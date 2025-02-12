<script>
	import { onMount } from "svelte";
	import OSC from "osc-js";
	import { gridProperties, currentGrid } from "$lib/index.svelte.js";

	let { division, x, y } = $props();

	let grid = $state([]);
	let osc;

	// $effect() is a function that runs when any of the variables inside of it
	// ...change. In this case, it runs when division changes.
	$effect(() => {
		// returns the number of cells in the grid
		// I need to do this because the array isn't created yet and I need to
		// ...know the max index for the frequency conversion
		const maxIndex = Math.pow(division, 2) - 1;

		// set the grid to an array with a number of empty slots equal to the
		// number of cells per side
		grid = Array.from({ length: division }, (_, i) => {
			// fill each empty slot with an array of empty slots equal to the number of
			// ...cells per side to create the 2D grid
			return Array.from({ length: division }, (_, j) => {
				// in each slot, create an object that holds:
				// - the x and y coordinates of the cell, as well as the index
				// - the frequencies for each axis
				// - a variable to hold the light state
				// - a variable to hold the color (experimental)
				const index = (division - 1 - i) * division + j;
				return {
					index: {
						x: j,
						y: division - 1 - i,
						number: index,
					},
					frequency: {
						x: linearConversion(index, 0, maxIndex, x.low, x.high),
						y: linearConversion(index, 0, maxIndex, y.low, y.high),
					},
					light: false,
					color: null,
				};
			});
		});
	});

	// This runs when the currentGrid data changes (used for data sonification)
	$effect(() => {
		// If the data is loaded...
		if (currentGrid.data.loaded) {
			// The events array will store all of the data to schedule
			const events = [];

			// The counter is used primarily to calculate the delay
			let counter = 1;

			// This loop runs for the number of data points in the currentGrid
			for (let i = 0; i < currentGrid.data.data.length; i++) {
				// The current data point
				const current = currentGrid.data.data[i];

				// Add an object to the events array with the current cell:
				// - the x and y coordinates of the cell
				// - how far in the future the event will occur
				events.push({
					x: Math.floor(
						linearConversion(
							current.reclat,
							currentGrid.data.coordinateScale.x.min,
							currentGrid.data.coordinateScale.x.max,
							0,
							division - 1
						)
					),
					y: Math.floor(
						linearConversion(
							current.reclong,
							currentGrid.data.coordinateScale.y.min,
							currentGrid.data.coordinateScale.y.max,
							division - 1,
							0
						)
					),
					delay:
						Math.floor(Math.random() * 250) + 50 + counter * 1000,
				});

				// The counter gets incremented by 1 for each loop iteration
				counter++;
			}

			// Now that the events array is filled with all of the data we need
			// ... to schedule future events, we loop through it.
			events.forEach((event) => {
				// setTimeout() delays code from happening until a time has elapsed
				// ...based on the delay in the event object
				setTimeout(() => {
					// Simulate a button click with the coordinates from the data
					gridButtonClick(grid[event.y][event.x]);
				}, event.delay);
			});
		}
	});

	function linearConversion(value, oldMin, oldMax, newMin, newMax) {
		return (
			((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
		);
	}

	// Sends a message to the Max patch through osc-js
	function sendMessage(address, frequency, volume) {
		// Constructs a new OSC message with the address, frequency, and volume
		const message = new OSC.Message(address, frequency, volume);

		// Sends a message to the server
		osc.send(message);
	}

	// For handling the button click event
	function gridButtonClick(cell) {
		// Calculates the rate that events will be sent out
		// it's equal to the speed (measured in seconds) divided by the
		// ...number of divisions. We subtract 1 because the first cell
		// ...starts at 0
		const speedDivision = gridProperties.speed.value / (division - 1);

		// Checks to see if there are any neighboring cells
		// Each variable will return true or false depending on if the cell
		// ...is at the edge of the grid
		const neighbors = {
			// north neighbors won't exceed the top edge of the grid
			n: cell.index.y < division - 1,
			// north-east neighbors won't exceed the top or right edge of the grid
			ne: cell.index.y < division - 1 && cell.index.x < division - 1,
			// east neighbors won't exceed the right edge of the grid
			e: cell.index.x < division - 1,
			// south-east neighbors won't exceed the bottom or right edge of the grid
			se: cell.index.y > 0 && cell.index.x < division - 1,
			// south neighbors won't exceed the bottom edge of the grid
			s: cell.index.y > 0,
			// south-west neighbors won't exceed the bottom or left edge of the grid
			sw: cell.index.y > 0 && cell.index.x > 0,
			// west neighbors won't exceed the left edge of the grid
			w: cell.index.x > 0,
			// north-west neighbors won't exceed the top or left edge of the grid
			nw: cell.index.y < division - 1 && cell.index.x > 0,
		};

		// Sends out the "origin" messages to the Max patch
		// Two messages are sent, one for each axis
		// All chained events will only send out one message
		// ...based on the axis it's traveling on
		sendMessage("/origin", cell.frequency.x, 1);
		sendMessage("/origin", cell.frequency.y, 1);

		// If there is a neighbor to the north...
		if (neighbors.n) {
			// The distance to the edge of the grid is unique for each
			// ...cell. In this case, it's the index subtracted from
			// ...the number of divisions. We subtract 1 because the
			// ...first cell starts at 0
			const distanceToEdge = division - cell.index.y - 1;

			// The events array will store all of the data to schedule
			// ...the event chain later.
			const events = [];

			// The counter is used primarily to calculate the volume
			// ...the i from the loop would normally be used, but
			// ...it doesn't start at 1, so I create a separate variable
			let counter = 1;

			// This loop's length is equal to the distance from the button
			// ...to the edge of the grid, starting at the cell's x and y
			// ...coordinates.
			for (let i = cell.index.y + 1; i < division; i++) {
				// The volume is decreased by a small amount for each step
				// ...away from the button.
				const volume = 0.7 - (counter / distanceToEdge) * 0.65;

				// Add an object to the events array with the current cell,
				// ... how far in the future the event will occur, and volume
				events.push({
					current: grid[division - i - 1][cell.index.x],
					delay: speedDivision * counter * 1000,
					volume: volume,
				});

				// The counter gets incremented by 1 for each loop iteration
				counter++;
			}

			// Now that the events array is filled with all of the data we need
			// ... to schedule future events, we loop through it.
			// forEach() is a method that loops through arrays in particular
			events.forEach((event) => {
				// setTimeout() delays code from happening until a time has elapsed
				setTimeout(() => {
					// The current cell's light is set to true
					event.current.light = true;

					// Send the message to the Max patch with the address, frequency,
					// ... and volume
					sendMessage(
						"/north",
						event.current.frequency.y,
						event.volume
					);

					// Turn the light off after a short delay
					setTimeout(() => {
						event.current.light = false;
					}, speedDivision * 1000);

					// Schedule this event to happen after a delay
				}, event.delay);
			});
		}

		//If there is a neighbor to the east
		if (neighbors.e) {
			const events = [];
			let counter = 1;

			for (let i = cell.index.x + 1; i < division; i++) {
				const volume =
					0.7 - (counter / (division - cell.index.x - 1)) * 0.65;

				events.push({
					current: grid[division - cell.index.y - 1][i],
					delay: speedDivision * counter * 1000,
					volume: volume,
				});

				counter++;
			}

			events.forEach((event) => {
				setTimeout(() => {
					event.current.light = true;

					sendMessage(
						"/east",
						event.current.frequency.x,
						event.volume
					);

					setTimeout(() => {
						event.current.light = false;
					}, speedDivision * 1000);
				}, event.delay);
			});
		}

		// If there is a neighbor to the south
		if (neighbors.s) {
			const events = [];
			let counter = 1;

			for (let i = division - cell.index.y; i < division; i++) {
				const volume =
					0.7 - (counter / (division - cell.index.y)) * 0.65;

				events.push({
					current: grid[i][cell.index.x],
					delay: speedDivision * counter * 1000,
					volume: volume,
				});

				counter++;
			}

			events.forEach((event) => {
				setTimeout(() => {
					event.current.light = true;

					sendMessage(
						"/south",
						event.current.frequency.y,
						event.volume
					);

					setTimeout(() => {
						event.current.light = false;
					}, speedDivision * 1000);
				}, event.delay);
			});
		}

		// If there is a neighbor to the west
		if (neighbors.w) {
			const events = [];
			let counter = 1;

			for (let i = cell.index.x - 1; i >= 0; i--) {
				const volume = 0.7 - (counter / cell.index.x) * 0.65;

				events.push({
					current: grid[division - cell.index.y - 1][i],
					delay: speedDivision * counter * 1000,
					volume: volume,
				});

				counter++;
			}

			events.forEach((event) => {
				setTimeout(() => {
					event.current.light = true;

					sendMessage(
						"/west",
						event.current.frequency.x,
						event.volume
					);

					setTimeout(() => {
						event.current.light = false;
					}, speedDivision * 1000);
				}, event.delay);
			});
		}

		grid.forEach((row) => {
			row.forEach((c) => {
				c.light = false;
			});
		});

		// Turns the light on for the original button
		cell.light = true;

		// Turns the original button's light off after a short delay
		setTimeout(() => {
			cell.light = false;
		}, speedDivision * 1000);
	}

	onMount(() => {
		osc = new OSC();
		osc.open({
			port: 3333,
		});
	});
</script>

<!-- A container to ensure the grid takes up 100% of the available width and height on the page -->
<div class="position-relative w-100 h-100">
	<!-- The grid starts here as a horizontally and vertically centered square -->
	<div
		class="d-flex justify-content-center align-items-center flex-wrap w-100 h-100">
		<!-- This iterates over the grid array, calling each element "row" -->
		{#each grid as row}
			<!-- For each row in the grid, create a horizontal strip on the web page that aligns all 
			of its contents horizontally and vertically -->
			<div
				class="d-flex justify-content-center align-items-center w-100"
				style="height: calc(100% / {division} - 3px); gap: 3px;">
				<!-- This iterates over each item in the row, calling each element "cell" -->
				{#each row as cell}
					<!-- For each cell, create a button that, when clicked, executes the gridButtonClick
					function -->
					<button
						class="rounded-1 border-0 p-0 m-0 h-100 {cell.light
							? 'default-bg'
							: 'accent-bg'}"
						style="width: calc(100% / {division} - 3px);"
						aria-label="Grid button - {cell.x}, {cell.y}"
						onclick={() => gridButtonClick(cell)}>
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<script>
	import { onMount } from "svelte";
	import OSC from "osc-js";
	import {
		gridProperties,
		currentGrid,
		showControls,
		defaultTheme,
	} from "$lib/index.svelte.js";
	import { linear } from "svelte/easing";

	let osc;

	$effect(() => {
		if (gridProperties.scale.value === "chromatic") {
			const ratio = Math.pow(2, 1 / gridProperties.scale.edo);
			const scale = [];

			for (
				let i = 0;
				i < Math.pow(gridProperties.division.value, 2);
				i++
			) {
				const xFrequency = gridProperties.x.low * Math.pow(ratio, i);
				const yFrequency = gridProperties.y.low * Math.pow(ratio, i);

				if (xFrequency >= 20000 || yFrequency >= 20000) {
					break;
				}

				scale.push([xFrequency, yFrequency]);
			}

			gridProperties.division.value = nearestSquareNumber(scale.length);
			gridProperties.x.high = scale[scale.length - 1][0];
			gridProperties.y.high = scale[scale.length - 1][1];
		} else if (gridProperties.scale.value === "major") {
			const ratio = Math.pow(2, 1 / 12);
			const scale = [];
			const majorSteps = [0, 2, 4, 5, 7, 9, 11];

			let octave = 0;
			let index = 0;

			while (true) {
				const semitoneStep = majorSteps[index] + octave * 12;
				const xFrequency =
					gridProperties.x.low * Math.pow(ratio, semitoneStep);
				const yFrequency =
					gridProperties.y.low * Math.pow(ratio, semitoneStep);

				if (xFrequency >= 20000 || yFrequency >= 20000) {
					break;
				}

				scale.push([xFrequency, yFrequency]);
				index++;

				if (index >= majorSteps.length) {
					index = 0;
					octave++;
				}
			}

			gridProperties.division.value = nearestSquareNumber(scale.length);
			gridProperties.x.high = scale[scale.length - 1][0];
			gridProperties.y.high = scale[scale.length - 1][1];
		} else if (gridProperties.scale.value === "minor") {
			const ratio = Math.pow(2, 1 / 12);
			const scale = [];
			const minorSteps = [0, 2, 3, 5, 7, 8, 10];

			let octave = 0;
			let index = 0;

			while (true) {
				const semitoneStep = minorSteps[index] + octave * 12;
				const xFrequency =
					gridProperties.x.low * Math.pow(ratio, semitoneStep);
				const yFrequency =
					gridProperties.y.low * Math.pow(ratio, semitoneStep);

				if (xFrequency >= 20000 || yFrequency >= 20000) {
					break;
				}

				scale.push([xFrequency, yFrequency]);
				index++;

				if (index >= minorSteps.length) {
					index = 0;
					octave++;
				}
			}

			gridProperties.division.value = nearestSquareNumber(scale.length);
			gridProperties.x.high = scale[scale.length - 1][0];
			gridProperties.y.high = scale[scale.length - 1][1];
		} else if (gridProperties.scale.value === "pentatonic") {
			const ratio = Math.pow(2, 1 / 12);
			const scale = [];
			const pentatonicSteps = [0, 2, 4, 7, 9];

			let octave = 0;
			let index = 0;

			while (true) {
				const semitoneStep = pentatonicSteps[index] + octave * 12;
				const xFrequency =
					gridProperties.x.low * Math.pow(ratio, semitoneStep);
				const yFrequency =
					gridProperties.y.low * Math.pow(ratio, semitoneStep);

				if (xFrequency >= 20000 || yFrequency >= 20000) {
					break;
				}

				scale.push([xFrequency, yFrequency]);
				index++;

				if (index >= pentatonicSteps.length) {
					index = 0;
					octave++;
				}
			}

			gridProperties.division.value = nearestSquareNumber(scale.length);
			gridProperties.x.high = scale[scale.length - 1][0];
			gridProperties.y.high = scale[scale.length - 1][1];
		} else if (gridProperties.scale.value === "diminished") {
			const ratio = Math.pow(2, 1 / 12);
			const scale = [];
			const diminishedSteps = [0, 2, 3, 5, 6, 8, 9, 11];

			let octave = 0;
			let index = 0;

			while (true) {
				const semitoneStep = diminishedSteps[index] + octave * 12;
				const xFrequency =
					gridProperties.x.low * Math.pow(ratio, semitoneStep);
				const yFrequency =
					gridProperties.y.low * Math.pow(ratio, semitoneStep);

				if (xFrequency >= 20000 || yFrequency >= 20000) {
					break;
				}

				scale.push([xFrequency, yFrequency]);
				index++;

				if (index >= diminishedSteps.length) {
					index = 0;
					octave++;
				}
			}

			gridProperties.division.value = nearestSquareNumber(scale.length);
			gridProperties.x.high = scale[scale.length - 1][0];
			gridProperties.y.high = scale[scale.length - 1][1];
		}

		currentGrid.grid = createGrid(
			gridProperties.division.value,
			gridProperties.x.low,
			gridProperties.x.high,
			gridProperties.y.low,
			gridProperties.y.high,
			gridProperties.scale.value,
			gridProperties.scale.edo
		);
	});

	// This runs when the currentGrid data changes (used for data sonification)
	$effect(() => {
		if (currentGrid.data.loaded && !currentGrid.data.events) {
			initializeEvents();
			if (!currentGrid.playAlong) {
				scheduleEvents();
			} else {
				promptNextEvent();
			}
		}
	});

	$effect(() => {
		if (showControls.state && currentGrid.data.events) {
			if (currentGrid.playAlong) {
				currentGrid.playAlong = false;
				currentGrid.playAlongIndex = 0;
				resetCurrentGridData();
			} else {
				clearEvents();
			}
		}
	});

	function initializeEvents() {
		currentGrid.data.events = [];
		let counter = 1;

		currentGrid.data.data.forEach((current, i) => {
			currentGrid.data.events.push({
				index: i,
				x: calculateCoordinate(
					current.reclat,
					currentGrid.data.coordinateScale.x,
					0,
					gridProperties.division.value - 1
				),
				y: calculateCoordinate(
					current.reclong,
					currentGrid.data.coordinateScale.y,
					gridProperties.division.value - 1,
					0
				),
				delay: Math.floor(Math.random() * 250) + 50 + counter * 1000,
				current,
			});
			counter++;
		});
	}

	function calculateCoordinate(value, scale, newMin, newMax) {
		return Math.floor(
			linearConversion(value, scale.min, scale.max, newMin, newMax)
		);
	}

	function scheduleEvents() {
		currentGrid.data.eventIds = [];
		currentGrid.data.events.forEach((event) => {
			const id = setTimeout(() => {
				gridButtonClick(currentGrid.grid[event.y][event.x]);
				if (event.index === currentGrid.data.events.length - 1) {
					setTimeout(clearEvents, 2000);
				}
			}, event.delay);
			currentGrid.data.eventIds.push(id);
		});
	}

	function clearEvents() {
		currentGrid.data.eventIds.forEach((id) => clearTimeout(id));
		resetCurrentGridData();
	}

	function resetCurrentGridData() {
		currentGrid.data = {
			events: null,
			eventIds: null,
			path: null,
			data: null,
			loaded: false,
			coordinateScale: {
				x: {
					min: null,
					max: null,
				},
				y: {
					min: null,
					max: null,
				},
			},
			timeScale: {
				min: null,
				max: null,
			},
		};
	}

	function linearConversion(value, oldMin, oldMax, newMin, newMax) {
		return (
			((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
		);
	}

	function logarithmicConversion(value, oldMin, oldMax, newMin, newMax) {
		const logMin = Math.log(newMin);
		const logMax = Math.log(newMax);
		const scale = (logMax - logMin) / (oldMax - oldMin);
		return Math.exp(logMin + scale * (value - oldMin));
	}

	function nearestSquareNumber(n) {
		return Math.round(Math.sqrt(n));
	}

	function createGrid(length, x1, x2, y1, y2, scale, division) {
		const ratio = Math.pow(2, 1 / division);
		const maxIndex = Math.pow(length, 2) - 1;

		const createCell = (index, x, y, frequencyX, frequencyY) => ({
			index: { x, y, number: index },
			frequency: { x: Number(frequencyX), y: Number(frequencyY) },
			light: false,
			border: false,
			color: null,
		});

		const generateGrid = (frequencyFunc) =>
			Array.from({ length }, (_, i) =>
				Array.from({ length }, (_, j) => {
					const index = (length - 1 - i) * length + j;
					const x = j;
					const y = length - 1 - i;
					const [frequencyX, frequencyY] = frequencyFunc(index);
					return createCell(index, x, y, frequencyX, frequencyY);
				})
			);

		const frequencyFuncs = {
			default: (index) => [
				logarithmicConversion(index, 0, maxIndex, x1, x2),
				logarithmicConversion(index, 0, maxIndex, y1, y2),
			],
			chromatic: (index) => [
				x1 * Math.pow(ratio, index),
				y1 * Math.pow(ratio, index),
			],
			major: (index) => {
				const majorSteps = [0, 2, 4, 5, 7, 9, 11];
				const octave = Math.floor(index / majorSteps.length);
				const step = index % majorSteps.length;
				return [
					x1 * Math.pow(ratio, majorSteps[step] + octave * 12),
					y1 * Math.pow(ratio, majorSteps[step] + octave * 12),
				];
			},
			minor: (index) => {
				const minorSteps = [0, 2, 3, 5, 7, 8, 10];
				const octave = Math.floor(index / minorSteps.length);
				const step = index % minorSteps.length;
				return [
					x1 * Math.pow(ratio, minorSteps[step] + octave * 12),
					y1 * Math.pow(ratio, minorSteps[step] + octave * 12),
				];
			},
			pentatonic: (index) => {
				const pentatonicSteps = [0, 2, 4, 7, 9];
				const octave = Math.floor(index / pentatonicSteps.length);
				const step = index % pentatonicSteps.length;
				return [
					x1 * Math.pow(ratio, pentatonicSteps[step] + octave * 12),
					y1 * Math.pow(ratio, pentatonicSteps[step] + octave * 12),
				];
			},
			diminished: (index) => {
				const diminishedSteps = [0, 2, 3, 5, 6, 8, 9, 11];
				const octave = Math.floor(index / diminishedSteps.length);
				const step = index % diminishedSteps.length;
				return [
					x1 * Math.pow(ratio, diminishedSteps[step] + octave * 12),
					y1 * Math.pow(ratio, diminishedSteps[step] + octave * 12),
				];
			},
		};

		return generateGrid(frequencyFuncs[scale] || frequencyFuncs.default);
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
		const speedDivision = gridProperties.speed.value * 1000;

		// Checks to see if there are any neighboring cells
		// Each variable will return true or false depending on if the cell
		// ...is at the edge of the grid
		const neighbors = {
			// north neighbors won't exceed the top edge of the grid
			n: cell.index.y < gridProperties.division.value - 1,
			// north-east neighbors won't exceed the top or right edge of the grid
			ne:
				cell.index.y < gridProperties.division.value - 1 &&
				cell.index.x < gridProperties.division.value - 1,
			// east neighbors won't exceed the right edge of the grid
			e: cell.index.x < gridProperties.division.value - 1,
			// south-east neighbors won't exceed the bottom or right edge of the grid
			se:
				cell.index.y > 0 &&
				cell.index.x < gridProperties.division.value - 1,
			// south neighbors won't exceed the bottom edge of the grid
			s: cell.index.y > 0,
			// south-west neighbors won't exceed the bottom or left edge of the grid
			sw: cell.index.y > 0 && cell.index.x > 0,
			// west neighbors won't exceed the left edge of the grid
			w: cell.index.x > 0,
			// north-west neighbors won't exceed the top or left edge of the grid
			nw:
				cell.index.y < gridProperties.division.value - 1 &&
				cell.index.x > 0,
		};

		function checkNorth() {
			// If there is a neighbor to the north...
			if (neighbors.n) {
				// The distance to the edge of the grid is unique for each
				// ...cell. In this case, it's the index subtracted from
				// ...the number of divisions. We subtract 1 because the
				// ...first cell starts at 0
				const distanceToEdge =
					gridProperties.division.value - cell.index.y - 1;

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
				for (
					let i = cell.index.y + 1;
					i < gridProperties.division.value;
					i++
				) {
					const volume =
						// Add an object to the events array with the current cell,
						// ... how far in the future the event will occur, and volume
						events.push({
							current:
								currentGrid.grid[
									gridProperties.division.value - i - 1
								][cell.index.x],
							delay: speedDivision * counter,
							volume: linearConversion(
								counter,
								1,
								distanceToEdge,
								0.75,
								0.1
							),
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
						}, speedDivision);

						// Schedule this event to happen after a delay
					}, event.delay);
				});
			}
		}

		function checkSouth() {
			// If there is a neighbor to the south
			if (neighbors.s) {
				const events = [];
				const distanceToEdge = cell.index.y;
				let counter = 1;

				console.log(distanceToEdge);

				for (
					let i = gridProperties.division.value - cell.index.y;
					i < gridProperties.division.value;
					i++
				) {
					events.push({
						current: currentGrid.grid[i][cell.index.x],
						delay: speedDivision * counter,
						volume: linearConversion(
							counter,
							1,
							distanceToEdge,
							0.75,
							0.1
						),
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
						}, speedDivision);
					}, event.delay);
				});
			}
		}

		function checkEast() {
			if (neighbors.e) {
				const events = [];
				const distanceToEdge =
					gridProperties.division.value - cell.index.x - 1;
				let counter = 1;

				for (
					let i = cell.index.x + 1;
					i < gridProperties.division.value;
					i++
				) {
					events.push({
						current:
							currentGrid.grid[
								gridProperties.division.value - cell.index.y - 1
							][i],
						delay: speedDivision * counter,
						volume: linearConversion(
							counter,
							1,
							distanceToEdge,
							0.75,
							0.1
						),
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
						}, speedDivision);
					}, event.delay);
				});
			}
		}

		function checkWest() {
			// If there is a neighbor to the west
			if (neighbors.w) {
				const events = [];
				const distanceToEdge = cell.index.x;
				let counter = 1;

				for (let i = cell.index.x - 1; i >= 0; i--) {
					events.push({
						current:
							currentGrid.grid[
								gridProperties.division.value - cell.index.y - 1
							][i],
						delay: speedDivision * counter,
						volume: linearConversion(
							counter,
							1,
							distanceToEdge,
							0.75,
							0.1
						),
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
						}, speedDivision);
					}, event.delay);
				});
			}
		}

		// Sends out the "origin" messages to the Max patch
		// Two messages are sent, one for each axis
		// All chained events will only send out one message
		// ...based on the axis it's traveling on
		if (gridProperties.testMode.x) {
			sendMessage("/origin", cell.frequency.x, 1);
		}

		if (gridProperties.testMode.y) {
			sendMessage("/origin", cell.frequency.y, 1);
		}

		if (gridProperties.testMode.x && gridProperties.testMode.y) {
			sendMessage("/origin", cell.frequency.x, 1);
			sendMessage("/origin", cell.frequency.y, 1);
		}

		if (!gridProperties.testMode.x && !gridProperties.testMode.y) {
			sendMessage("/origin", cell.frequency.x, 1);
			sendMessage("/origin", cell.frequency.y, 1);

			if (gridProperties.axisLimit.y && !gridProperties.axisLimit.x) {
				checkNorth();
				checkSouth();
			}

			if (gridProperties.axisLimit.x && !gridProperties.axisLimit.y) {
				checkEast();
				checkWest();
			}

			if (gridProperties.axisLimit.x && gridProperties.axisLimit.y) {
				checkNorth();
				checkSouth();
				checkEast();
				checkWest();
			}

			if (!gridProperties.axisLimit.x && !gridProperties.axisLimit.y) {
				checkNorth();
				checkSouth();
				checkEast();
				checkWest();
			}
		}

		// Turns the light on for the original button
		cell.light = true;

		// Turns the original button's light off after a short delay
		setTimeout(() => {
			cell.light = false;
			cell.border = false;
		}, speedDivision);
	}

	// For play along mode, this function is used to schedule the next event
	function promptNextEvent() {
		if (currentGrid.playAlongIndex < currentGrid.data.events.length) {
			const event = currentGrid.data.events[currentGrid.playAlongIndex];
			const cell = currentGrid.grid[event.y][event.x];
			const delayCorrection =
				event.delay - currentGrid.playAlongIndex * 1000;

			setTimeout(() => {
				cell.border = true;
			}, delayCorrection);
		} else {
			currentGrid.playAlong = false;
			currentGrid.playAlongIndex = 0;
			resetCurrentGridData();
		}
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
		{#each currentGrid.grid as row}
			<!-- For each row in the grid, create a horizontal strip on the web page that aligns all 
			of its contents horizontally and vertically -->
			<div
				class="d-flex justify-content-center align-items-center w-100"
				style="height: calc(100% / {gridProperties.division
					.value} - 3px); gap: 3px;">
				<!-- This iterates over each item in the row, calling each element "cell" -->
				{#each row as cell}
					<!-- For each cell, create a button that, when clicked, executes the gridButtonClick
					function -->
					<button
						class="rounded-1 p-0 m-0 h-100 user-select-none {cell.border
							? 'border border-4 border-light'
							: 'border-0'}"
						style="width: calc(100% / {gridProperties.division
							.value} - 3px); background: {cell.light
							? currentGrid.theme.accent
							: currentGrid.theme.light};
							color: {currentGrid.theme.text};"
						aria-label="Grid button - {cell.x}, {cell.y}"
						onclick={() => {
							if (currentGrid.playAlong && cell.border) {
								currentGrid.playAlongIndex++;
								promptNextEvent();
							}

							gridButtonClick(cell);
						}}>
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<script>
	import { onMount } from "svelte";
	import OSC from "osc-js";
	import { gridProperties, currentGrid } from "$lib/index.svelte.js";

	let { division, x, y } = $props();

	let grid = $state([]);
	let osc;

	$effect(() => {
		const maxIndex = Math.pow(division, 2) - 1;

		grid = Array.from({ length: division }, (_, i) => {
			return Array.from({ length: division }, (_, j) => {
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

	$effect(() => {
		if (currentGrid.data.loaded) {
			const events = [];
			let counter = 1;

			for (let i = 0; i < currentGrid.data.data.length; i++) {
				const current = currentGrid.data.data[i];

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

				counter++;
			}

			events.forEach((event) => {
				setTimeout(() => {
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

	function sendMessage(address, frequency, volume) {
		const message = new OSC.Message(address, frequency, volume);
		osc.send(message);
	}

	function gridButtonClick(cell) {
		const speedDivision = gridProperties.speed.value / (division - 1);

		const neighbors = {
			n: cell.index.y < division - 1,
			ne: cell.index.y < division - 1 && cell.index.x < division - 1,
			e: cell.index.x < division - 1,
			se: cell.index.y > 0 && cell.index.x < division - 1,
			s: cell.index.y > 0,
			sw: cell.index.y > 0 && cell.index.x > 0,
			w: cell.index.x > 0,
			nw: cell.index.y < division - 1 && cell.index.x > 0,
		};

		sendMessage("/origin", cell.frequency.x, 1);
		sendMessage("/origin", cell.frequency.y, 1);

		// If there is a neighbor to the north
		if (neighbors.n) {
			const distanceToEdge = division - cell.index.y - 1;
			const events = [];
			let counter = 1;

			for (let i = cell.index.y + 1; i < division; i++) {
				const volume = 0.7 - (counter / distanceToEdge) * 0.65;

				events.push({
					current: grid[division - i - 1][cell.index.x],
					delay: speedDivision * counter * 1000,
					volume: volume,
				});

				counter++;
			}

			events.forEach((event) => {
				setTimeout(() => {
					event.current.light = true;

					sendMessage(
						"/north",
						event.current.frequency.y,
						event.volume
					);

					setTimeout(() => {
						event.current.light = false;
					}, speedDivision * 1000);
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

		cell.light = true;
		setTimeout(
			() => {
				cell.light = false;
			},
			speedDivision * 2 * 1000
		);
	}

	onMount(() => {
		osc = new OSC();
		osc.open({
			port: 3333,
		});
	});
</script>

<div class="position-relative w-100 h-100">
	<div
		class="d-flex justify-content-center align-items-center flex-wrap w-100 h-100">
		{#each grid as row}
			<div
				class="d-flex justify-content-center align-items-center w-100"
				style="height: calc(100% / {division} - 3px); gap: 3px;">
				{#each row as cell}
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

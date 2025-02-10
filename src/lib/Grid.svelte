<script>
	import { onMount } from "svelte";
	import OSC from "osc-js";
	import { gridProperties } from "$lib/index.svelte.js";

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

	function linearConversion(value, oldMin, oldMax, newMin, newMax) {
		return (
			((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
		);
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

		sendMessage("/origin", cell.frequency.x, 0);
		sendMessage("/origin", cell.frequency.y, 0);

		// If there is a neighbor to the north
		if (neighbors.n) {
			const distanceToEdge = division - 1;

			let counter = 1;
			for (let i = cell.index.y + 1; i < division; i++) {
				setTimeout(
					() => {
						const current = grid[division - i - 1][cell.index.x];

						current.light = true;

						sendMessage(
							"/north",
							current.frequency.y,
							-1 * counter
						);

						setTimeout(() => {
							current.light = false;
						}, speedDivision * 1000);
					},
					speedDivision * counter * 1000
				);

				counter++;
			}
		}

		//If there is a neighbor to the east
		if (neighbors.e) {
			const distanceToEdge = division - 1 - cell.index.x;

			let counter = 1;
			for (let i = cell.index.x + 1; i < division; i++) {
				setTimeout(
					() => {
						const current = grid[division - cell.index.y - 1][i];

						current.light = true;

						sendMessage(
							"/east",
							current.frequency.x,
							speedDivision
						);

						setTimeout(() => {
							current.light = false;
						}, speedDivision * 1000);
					},
					speedDivision * counter * 1000
				);

				counter++;
			}
		}

		// If there is a neighbor to the south
		if (neighbors.s) {
			const distanceToEdge = cell.index.y;

			let counter = 1;
			for (let i = division - cell.index.y; i < division; i++) {
				setTimeout(
					() => {
						const current = grid[i][cell.index.x];

						current.light = true;

						sendMessage(
							"/south",
							current.frequency.y,
							speedDivision
						);

						setTimeout(() => {
							current.light = false;
						}, speedDivision * 1000);
					},
					speedDivision * counter * 1000
				);

				counter++;
			}
		}

		// If there is a neighbor to the west
		if (neighbors.w) {
			const distanceToEdge = cell.index.x;

			let counter = 1;
			for (let i = cell.index.x - 1; i >= 0; i--) {
				setTimeout(
					() => {
						const current = grid[division - cell.index.y - 1][i];
						const volume = linearConversion(
							i,
							0,
							distanceToEdge,
							-6,
							-36
						);

						current.light = true;

						sendMessage(
							"/west",
							current.frequency.x,
							speedDivision
						);

						setTimeout(() => {
							current.light = false;
						}, speedDivision * 1000);
					},
					speedDivision * counter * 1000
				);

				counter++;
			}
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

		function sendMessage(address, frequency, time) {
			const message = new OSC.Message(address, frequency, time);
			osc.send(message);
		}
	}

	onMount(() => {
		osc = new OSC();
		osc.open({
			port: 3333,
		});
	});
</script>

<div class="position-relative w-100 h-100" style="padding: 3px;">
	<div
		class="d-flex justify-content-center align-items-center flex-wrap w-100 h-100"
		style="gap: 3px;">
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

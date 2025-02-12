<script>
	import { onMount } from "svelte";
	import Grid from "$lib/Grid.svelte";
	import GridControlRange from "$lib/GridControlRange.svelte";
	import {
		darkMode,
		showControls,
		gridProperties,
		gridLength,
	} from "$lib/index.svelte.js";
	import { fetchAndParseCSV } from "$lib/data.svelte.js";

	let width = $state(0);
	let height = $state(0);
	let length = $state(0);
	let arp;
	let playMode = $state(false);

	$effect(() => {
		// set length to the smaller of width and height of the container
		if (width >= height) {
			length = height;
		} else {
			length = width;
		}

		gridLength.value = length;

		// setting low and high frequencies of the axes to make sure they are...
		// ...within the range of the low and high limits
		// ...and that low is less than high
		// ...and that they are numbers
	});

	// resize function to get the width and height of the container
	function resize() {
		width = arp.clientWidth;
		height = arp.clientHeight;
	}

	onMount(() => {
		resize();
	});
</script>

<svelte:window on:resize={resize} />

<section class="container d-flex flex-column flex-grow-1 gap-3 pb-5">
	<!-- Grid -->
	<div
		class="flex-grow-1 d-flex justify-content-center align-items-end"
		bind:this={arp}>
		{#if length >= 300}
			<div class="mb-2" style="width: {length}px; height: {length}px;">
				<Grid
					division={gridProperties.division.value}
					speed={gridProperties.speed.value}
					x={gridProperties.x}
					y={gridProperties.y} />
			</div>
		{:else if length}
			<div>
				<h1
					class="text-center {darkMode.state === true
						? 'default-text'
						: 'dark-text'}">
					Dimensions too small.
				</h1>
				<p
					class="text-center {darkMode.state === true
						? 'default-text'
						: 'dark-text'}">
					Make sure this area is at least 300px wide and tall.
				</p>
			</div>
		{/if}
	</div>
	<!-- Controls -->
	<div class="w-100 d-flex justify-content-center">
		<div
			class="d-flex justify-content-center gap-3"
			style="width: {length}px;">
			<div>
				<label for="division">Division</label>
				<input
					id="division"
					class="form-control"
					type="number"
					bind:value={gridProperties.division.value} />
			</div>
			<div>
				<label for="speed">Speed</label>
				<input
					id="speed"
					class="form-control"
					type="number"
					bind:value={gridProperties.speed.value} />
			</div>
			<div>
				<label for="x">Low x-frequency</label>
				<input
					id="x"
					class="form-control"
					type="number"
					bind:value={gridProperties.x.low} />
			</div>
			<div>
				<label for="x">High x-frequency</label>
				<input
					id="x"
					class="form-control"
					type="number"
					bind:value={gridProperties.x.high} />
			</div>
			<div>
				<label for="y">Low y-frequency</label>
				<input
					id="y"
					class="form-control"
					type="number"
					bind:value={gridProperties.y.low} />
			</div>
			<div>
				<label for="y">High y-frequency</label>
				<input
					id="y"
					class="form-control"
					type="number"
					bind:value={gridProperties.y.high} />
			</div>
		</div>
	</div>
</section>

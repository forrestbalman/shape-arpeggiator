<script>
	import { darkMode } from "$lib/index.svelte.js";
	import { onMount } from "svelte";
	import Grid from "$lib/Grid.svelte";
	import GridControlRange from "$lib/GridControlRange.svelte";

	let width = $state(0);
	let height = $state(0);
	let length = $state(0);
	let gridProperties = $state({
		division: 32,
		low: 20,
		high: 20000,
		speed: 1,
		show: true,
	});
	let arp;
	let playMode = $state(false);

	$effect(() => {
		if (width >= height) {
			length = height;
		} else {
			length = width;
		}

		if (gridProperties.low > 20000) {
			gridProperties.low = 20000;
		} else if (gridProperties.low < 20) {
			gridProperties.low = 20;
		}

		if (gridProperties.high > 20000) {
			gridProperties.high = 20000;
		} else if (gridProperties.high < 20) {
			gridProperties.high = 20;
		}

		if (isNaN(gridProperties.low)) {
			gridProperties.low = 20;
		}

		if (isNaN(gridProperties.high)) {
			gridProperties.high = 20000;
		}

		if (
			gridProperties.low >= gridProperties.high &&
			gridProperties.high < 20000
		) {
			gridProperties.high = gridProperties.low + 1;
		}

		if (
			gridProperties.high <= gridProperties.low &&
			gridProperties.low > 20
		) {
			gridProperties.low = gridProperties.high - 1;
		}
	});

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
	<div
		class="flex-grow-1 d-flex justify-content-center align-items-center position-relative"
		bind:this={arp}>
		{#if length >= 300}
			<div
				class="rounded-2 {darkMode.state === true
					? 'default-border'
					: 'dark-border'}"
				style="width: {length}px; height: {length}px;">
				<Grid
					division={gridProperties.division}
					low={100}
					high={4000} />
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
	<div class="d-flex justify-content-center" style="min-height: 96px;">
		<div
			class="d-flex flex-column gap-2 position-relative"
			style="width: {length}px;">
			<button
				class="w-auto border-0 rounded-1 {gridProperties.show === true
					? 'bg-danger'
					: 'bg-success'}"
				onclick={() => (gridProperties.show = !gridProperties.show)}
				>{gridProperties.show === false ? "show" : "hide"} controls</button>
			{#if gridProperties.show}
				<div class="d-flex justify-content-center gap-2 w-100">
					<GridControlRange
						min={4}
						max={32}
						step={1}
						id="division"
						label="Division"
						bind:value={gridProperties.division} />
					<GridControlRange
						min={20}
						max={20000}
						step={1}
						id="low"
						label="Low"
						maxWidth={95}
						bind:value={gridProperties.low} />
					<GridControlRange
						min={20}
						max={20000}
						step={1}
						id="high"
						label="High"
						maxWidth={95}
						bind:value={gridProperties.high} />
					<GridControlRange
						min={0.1}
						max={10}
						step={0.1}
						id="speed"
						label="Speed"
						bind:value={gridProperties.speed} />
				</div>
			{/if}
		</div>
	</div>
</section>

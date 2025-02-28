<script>
	import { onMount } from "svelte";
	import Grid from "$lib/Grid.svelte";
	import GridControlRange from "$lib/GridControlRange.svelte";
	import Controls from "$lib/Controls.svelte";
	import {
		darkMode,
		showControls,
		gridProperties,
		gridLength,
		currentGrid,
	} from "$lib/index.svelte.js";

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
	<div
		class="flex-grow-1 d-flex justify-content-center align-items-end"
		bind:this={arp}>
		<div
			class="mb-2 overflow-y-auto position-relative"
			style="width: {length}px; height: {length}px;">
			<Grid />
			{#if showControls.state}
				<Controls />
			{/if}
		</div>
	</div>
</section>

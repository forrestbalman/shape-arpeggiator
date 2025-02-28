<script>
	import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
	import "../app.css";
	import Navbar from "$lib/Navbar.svelte";
	import { gridProperties, currentGrid } from "$lib/index.svelte.js";
	import Grid from "$lib/Grid.svelte";

	let { children } = $props();
</script>

<div class="d-flex flex-column min-vh-100 position-relative">
	<Navbar />
	<main
		class="d-flex flex-grow-1"
		style="background: {currentGrid.theme.background};">
		{@render children()}
	</main>
</div>

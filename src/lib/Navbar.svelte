<script>
	import { darkMode, currentGrid, showControls } from "$lib/index.svelte.js";
</script>

<nav class="py-3" style="background: {currentGrid.theme.background};">
	<div class="container d-flex justify-content-between align-items-center">
		<a
			class="fs-3 text-decoration-none"
			href="https://forrestbalman.com"
			style="color: {currentGrid.theme.accent};">Forrest</a>

		<button
			class="bg-transparent border-0"
			style="color: {showControls.state
				? currentGrid.theme.text
				: currentGrid.theme.accent};"
			onclick={() => {
				showControls.state = !showControls.state;
			}}>{showControls.state ? "Hide Controls" : "Show Controls"}</button>
	</div>
</nav>

<style>
	a {
		cursor: pointer;
	}
</style>

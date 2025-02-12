<script>
	import { darkMode, currentGrid } from "$lib/index.svelte.js";
	import { meteoriteLandings } from "$lib/data-sonifications/meteorite-landings.svelte.js";
</script>

<nav class="py-3 {darkMode.state === true ? 'dark-bg' : 'default-bg'}">
	<div class="container d-flex justify-content-between align-items-center">
		<a
			class="fs-3 text-decoration-none accent-text"
			href="https://forrestbalman.com">Forrest</a>
		<div class="d-flex gap-2">
			<button
				class="bg-transparent border-0 {darkMode.state === true
					? 'default-text'
					: 'dark-text'}"
				onclick={meteoriteLandings}>Meteorite Landings</button>
		</div>
	</div>
</nav>

<style>
	a {
		cursor: pointer;
	}
</style>

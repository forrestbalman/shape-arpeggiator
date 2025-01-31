<script>
	import { darkMode } from "$lib/index.svelte.js";
</script>

<nav class="py-3 {darkMode.state === true ? 'dark-bg' : 'default-bg'}">
	<div class="container d-flex justify-content-between align-items-center">
		<a
			class="fs-3 text-decoration-none accent-text"
			href="https://forrestbalman.com">Forrest</a>
		<div class="d-flex gap-2">
			<a
				class="text-decoration-none {darkMode.state === true
					? 'default-text'
					: 'dark-text'}"
				href="/about">About</a>
			<button
				class="text-decoration-none p-0 border-0 bg-transparent {darkMode.state ===
				true
					? 'default-text'
					: 'dark-text'}"
				role="switch"
				aria-checked={darkMode.state}
				on:click={() => (darkMode.state = !darkMode.state)}
				on:keydown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						darkMode.state = !darkMode.state;
						e.preventDefault();
					}
				}}>{darkMode.state === true ? "Dark" : "Light"}</button>
		</div>
	</div>
</nav>

<style>
	a {
		cursor: pointer;
	}
</style>

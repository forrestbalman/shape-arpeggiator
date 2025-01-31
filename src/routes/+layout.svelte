<script>
	import "bootstrap/dist/css/bootstrap.min.css";
	import "bootstrap-icons/font/bootstrap-icons.css";
	import "../app.css";
	import Navbar from "$lib/Navbar.svelte";
	import { darkMode } from "$lib/index.svelte.js";

	let { children } = $props();
</script>

<div class="d-flex flex-column min-vh-100">
	<Navbar />
	<main
		class="{darkMode.state === true
			? 'dark-bg'
			: 'default-bg'} flex-grow-1">
		{@render children()}
	</main>
</div>

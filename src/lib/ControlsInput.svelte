<script>
	import { currentGrid } from "$lib/index.svelte.js";

	let {
		label,
		min,
		max,
		step,
		disabled = false,
		value = $bindable(),
	} = $props();
</script>

<div>
	<label for={label} style="color: {currentGrid.theme.text};"
		>{label[0].toUpperCase() + label.substring(1, label.length)}</label>
	<input
		id="division"
		class="form-control"
		type="number"
		{disabled}
		{min}
		{max}
		{step}
		bind:value
		style="color: {currentGrid.theme.background};" />
</div>

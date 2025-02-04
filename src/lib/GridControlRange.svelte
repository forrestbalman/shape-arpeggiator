<script>
	let { min, max, step, id, label, maxWidth = 65, value = $bindable() } = $props();
</script>

<div class="flex-grow-1 d-flex flex-column align-items-center">
	<div class="d-flex align-items-center gap-2">
		<label for={id} class="form-label m-0"
			>{id[0].toUpperCase() + id.substring(1)}</label>
		<input
			type="number"
			class="form-control"
			id="low"
			style="max-width: {maxWidth}px;"
			bind:value />
	</div>
	<input type="range" class="form-range" {min} {max} {step} {id} bind:value />
</div>

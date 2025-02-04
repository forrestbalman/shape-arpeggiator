<script>
	let { division, low, high } = $props();

	let grid = $state([]);

	$effect(() => {
		let a = [];
		let interval = (high - low) / (division - 1);

		for (let i = 0; i < division; i++) {
			let row = [];
			for (let j = 0; j < division; j++) {
				row.push({
					x: low + j * interval,
					y: 0,
				});
			}

			row.forEach((cell) => {
				cell.y = high - i * interval;
			});

			a.push(row);
		}

		grid = a.flat();
	});
</script>

<div class="position-relative w-100 h-100">
	<div
		class="d-flex justify-content-center align-items-center flex-wrap w-100 h-100 p-1 gap-1">
		{#each grid as cell}
			<div
				class="rounded-1 accent-bg"
				style="width: calc((100% / {division}) - 4px); height: calc((100% / {division}) - 4px);">
			</div>
		{/each}
	</div>
</div>

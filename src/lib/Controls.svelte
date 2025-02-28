<script>
	import { gridProperties, currentGrid } from "$lib/index.svelte.js";
	import {
		meteoriteLandings,
		meteoriteTheme,
	} from "$lib/data-sonifications/meteorite-landings.svelte.js";
	import ControlsInput from "$lib/ControlsInput.svelte";
	import ControlsDataSonificationButton from "$lib/ControlsDataSonificationButton.svelte";
</script>

<div
	class="w-100 h-100 d-flex flex-column justify-content-center gap-5 position-absolute top-0 start-0"
	style="background: {currentGrid.theme.background};">
	<!-- Base properties: division, speed, frequencies -->
	<div class="d-flex flex-column alight-items-center">
		<h2 class="text-center" style="color: {currentGrid.theme.text};">
			Grid Properties
		</h2>
		<div class="d-flex flex-column align-items-center gap-3">
			<div class="d-flex justify-content-center align-items-end gap-3">
				<ControlsInput
					label="division"
					min={gridProperties.division.min}
					max={gridProperties.division.max}
					step={gridProperties.division.step}
					disabled={gridProperties.scale.value !== "default"}
					bind:value={gridProperties.division.value} />
				<ControlsInput
					label="speed"
					min={gridProperties.speed.min}
					max={gridProperties.speed.max}
					step={gridProperties.speed.step}
					bind:value={gridProperties.speed.value} />
				<ControlsInput
					label="low-x"
					min={gridProperties.x.min}
					max={gridProperties.x.max}
					step={gridProperties.x.step}
					bind:value={gridProperties.x.low} />
				<ControlsInput
					label="high-x"
					min={gridProperties.x.min}
					max={gridProperties.x.max}
					step={gridProperties.x.step}
					disabled={gridProperties.scale.value !== "default"}
					bind:value={gridProperties.x.high} />
				<ControlsInput
					label="low-y"
					min={gridProperties.y.min}
					max={gridProperties.y.max}
					step={gridProperties.y.step}
					bind:value={gridProperties.y.low} />
				<ControlsInput
					label="high-y"
					min={gridProperties.y.min}
					max={gridProperties.y.max}
					step={gridProperties.y.step}
					disabled={gridProperties.scale.value !== "default"}
					bind:value={gridProperties.y.high} />
				<ControlsInput
					label="octave-division"
					min={12}
					max={36}
					step={1}
					disabled={gridProperties.scale.value !== "chromatic"}
					bind:value={gridProperties.scale.edo} />
			</div>
			<p class="m-0" style="color: {currentGrid.theme.accent};">
				Playback properties for the grid. Control side length, playback
				speed in seconds, and the range of frequencies for each cell
				(left to right, bottom to top). You can also divide the octave
				for chromatic scales (lowest is 12, max is 36).
			</p>
		</div>
	</div>
	<!-- Pitch and testing -->
	<div class="d-flex flex-column alight-items-center">
		<h2 class="text-center" style="color: {currentGrid.theme.text};">
			Pitch Mode
		</h2>
		<div class="d-flex gap-3">
			<div
				class="d-flex flex-column align-items-center justify-content-end gap-3">
				<div
					class="d-flex justify-content-center align-items-end gap-3">
					<select
						class="form-select"
						aria-label="choose a scale"
						bind:value={gridProperties.scale.value}>
						<option value="default" selected
							>Divide range evenly (default)</option>
						<option value="chromatic">Chromatic</option>
						<option value="major">Major</option>
						<option value="minor">Minor</option>
						<option value="pentatonic">Pentatonic</option>
						<option value="diminished">Diminished</option>
					</select>
				</div>
				{#if gridProperties.scale.value !== "default"}
					<p class="m-0" style="color: {currentGrid.theme.accent};">
						For scale settings, you can specify everything except
						the division and high frequency. The grid will calculate
						what size is possible because the scale will quickly
						grow out of hearing range.
					</p>
				{:else}
					<p class="m-0" style="color: {currentGrid.theme.accent};">
						The grid will evenly divide the ranges of frequencies
						for both x and y axes. This is the default setting.
					</p>
				{/if}
			</div>
			<div
				class="d-flex flex-column align-items-center justify-content-end">
				<div class="d-flex gap-3">
					<div class="mb-1">
						<label
							for="test-x"
							style="color: {currentGrid.theme.text};"
							>Test x mode</label>
						<input
							id="test-x"
							class="form-check-input ms-2"
							type="checkbox"
							bind:checked={gridProperties.testMode.x} />
					</div>
					<div class="mb-1">
						<label
							for="test-x"
							style="color: {currentGrid.theme.text};"
							>Test y mode</label>
						<input
							id="test-y"
							class="form-check-input ms-2"
							type="checkbox"
							bind:checked={gridProperties.testMode.y} />
					</div>
				</div>
				<p class="m-0" style="color: {currentGrid.theme.accent};">
					When enabled, the grid will only play the pressed button's
					frequency associated with the selected axis.
				</p>
			</div>
			<div
				class="d-flex flex-column align-items-center justify-content-end">
				<div class="d-flex gap-3">
					<div class="mb-1">
						<label
							for="test-x"
							style="color: {currentGrid.theme.text};"
							>Only x mode</label>
						<input
							id="only-x"
							class="form-check-input ms-2"
							type="checkbox"
							bind:checked={gridProperties.axisLimit.x} />
					</div>
					<div class="mb-1">
						<label
							for="only-y"
							style="color: {currentGrid.theme.text};"
							>Only y mode</label>
						<input
							id="only-y"
							class="form-check-input ms-2"
							type="checkbox"
							bind:checked={gridProperties.axisLimit.y} />
					</div>
				</div>
				<p class="m-0" style="color: {currentGrid.theme.accent};">
					When enabled, the grid will only play the pressed button's
					frequency associated with the selected axis.
				</p>
			</div>
		</div>
	</div>
	<!-- Data Sonifications -->
	<div class="d-flex flex-column align-items-center">
		<h2 class="text-center" style="color: {currentGrid.theme.text};">
			Data Sonification
		</h2>
		<div class="mb-4 d-flex flex-column align-items-center">
			<div class="mb-1">
				<label for="play-along" style="color: {currentGrid.theme.text};"
					>Play along mode</label>
				<input
					id="play-along"
					class="form-check-input ms-2"
					type="checkbox"
					bind:checked={currentGrid.playAlong} />
			</div>
			<p class="m-0" style="color: {currentGrid.theme.accent};">
				When enabled, the grid will prompt you to play along with the
				data, rather than playing the data automatically.
			</p>
		</div>
		<div
			class="d-flex justify-content-center align-items-end flex-wrap gap-3">
			<button
				class="btn px-3 py-1"
				style="background: {meteoriteTheme.background}; color: {meteoriteTheme.light}; border: 2px solid {meteoriteTheme.light};"
				onclick={meteoriteLandings}>
				Meteorite Landings
			</button>
		</div>
	</div>
</div>

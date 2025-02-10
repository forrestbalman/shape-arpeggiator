// place files you want to import through the `$lib` alias in this folder.
export let darkMode = $state({
	state: true,
});
export let showControls = $state({
	state: false,
});
export let gridProperties = $state({
	frequency: {
		min: 50,
		max: 4000,
		step: 1,
	},
	division: {
		min: 4,
		max: 50,
		value: 7,
		step: 1,
	},
	speed: {
		min: 0.1,
		max: 3,
		value: 1,
		step: 0.1,
	},
	x: {
		low: 50,
		high: 4000,
	},
	y: {
		low: 70,
		high: 2000,
	},
});
export let gridLength = $state({
	value: 0,
});

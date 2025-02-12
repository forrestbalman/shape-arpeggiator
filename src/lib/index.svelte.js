// place files you want to import through the `$lib` alias in this folder.
export let darkMode = $state({
	state: true,
});
export let showControls = $state({
	state: false,
});
export let gridProperties = $state({
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
export let currentGrid = $state({
	grid: null,
	data: {
		path: null,
		data: null,
		loaded: false,
		coordinateScale: {
			x: {
				min: null,
				max: null,
			},
			y: {
				min: null,
				max: null,
			},
		},
		timeScale: {
			min: null,
			max: null,
		},
		gridProperties: {
			division: 15,
			x: {
				low: 62,
				high: 1984,
			},
			y: {
				low: 93,
				high: 1715,
			},
		},
	},
});

// place files you want to import through the `$lib` alias in this folder.
export let darkMode = $state({
	state: true,
});
export const defaultTheme = {
	text: "#ffffff",
	background: "#1b1b1c",
	light: "#7897c2",
	accent: "#e8be48",
};
export let showControls = $state({
	state: false,
});
export let gridProperties = $state({
	division: {
		min: 4,
		max: 50,
		value: randomInt(4, 20),
		step: 1,
	},
	speed: {
		min: 0.01,
		max: 1,
		value: randomFloat(0.01, 1),
		step: 0.01,
	},
	scale: {
		value: "default",
		edo: 12,
	},
	x: {
		min: 20,
		max: 19999,
		step: 1,
		low: randomInt(50, 400),
		high: randomInt(1000, 4000),
	},
	y: {
		min: 21,
		max: 20000,
		step: 1,
		low: randomInt(100, 600),
		high: randomInt(800, 2000),
	},
	axisLimit: {
		x: false,
		y: false,
	},
	testMode: {
		x: false,
		y: false,
	},
});
export let gridLength = $state({
	value: 0,
});
export let currentGrid = $state({
	grid: null,
	playAlong: false,
	playAlongIndex: 0,
	theme: defaultTheme,
	data: {
		events: null,
		eventIds: null,
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
	},
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
	return (Math.random() * (max - min) + min).toFixed(2);
}

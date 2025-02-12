import { fetchAndParseCSV } from "$lib/data.svelte.js";
import { gridProperties, currentGrid } from "$lib/index.svelte.js";

const path = "/data/Meteorite_Landings.csv";

export function meteoriteLandings() {
	currentGrid.data.path = path;

	fetchAndParseCSV(path).then((data) => {
		const filteredData = data
			.filter(
				(meteorite) =>
					meteorite.year !== null || meteorite["mass (g)"] !== null
			)
			.sort((a, b) => a.year - b.year)
			.slice(0, 100);

		currentGrid.data.data = filteredData;

		const smallestCoordinates = filteredData.reduce(
			(acc, meteorite) => {
				if (meteorite.reclat < acc.reclat)
					acc.reclat = meteorite.reclat;
				if (meteorite.reclong < acc.reclong)
					acc.reclong = meteorite.reclong;
				return acc;
			},
			{ reclat: Infinity, reclong: Infinity }
		);

		const largestCoordinates = filteredData.reduce(
			(acc, meteorite) => {
				if (meteorite.reclat > acc.reclat)
					acc.reclat = meteorite.reclat;
				if (meteorite.reclong > acc.reclong)
					acc.reclong = meteorite.reclong;
				return acc;
			},
			{ reclat: -Infinity, reclong: -Infinity }
		);

		const smallestTime = filteredData.reduce(
			(acc, meteorite) => Math.min(acc, meteorite.year),
			Infinity
		);
		const largestTime = filteredData.reduce(
			(acc, meteorite) => Math.max(acc, meteorite.year),
			-1
		);

		currentGrid.data.coordinateScale.x.min = smallestCoordinates.reclat;
		currentGrid.data.coordinateScale.x.max = largestCoordinates.reclat;
		currentGrid.data.coordinateScale.y.min = smallestCoordinates.reclong;
		currentGrid.data.coordinateScale.y.max = largestCoordinates.reclong;
		currentGrid.data.timeScale.min = smallestTime;
		currentGrid.data.timeScale.max = largestTime;

		const properties = {
			division: 15,
			speed: 0.7,
			x: {
				low: 62,
				high: 1984,
			},
			y: {
				low: 93,
				high: 1715,
			},
		};

		gridProperties.division.value = properties.division;
		gridProperties.speed.value = properties.speed;
		gridProperties.x.low = properties.x.low;
		gridProperties.x.high = properties.x.high;
		gridProperties.y.low = properties.y.low;
		gridProperties.y.high = properties.y.high;

		currentGrid.data.loaded = true;
	});
}

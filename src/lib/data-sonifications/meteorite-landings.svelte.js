import { fetchAndParseCSV } from "$lib/data.svelte.js";
import {
	gridProperties,
	currentGrid,
	showControls,
} from "$lib/index.svelte.js";

const path = "/data/Meteorite_Landings.csv";

export const meteoriteTheme = $state({
	text: "#f0dadb",
	background: "#1c1f48",
	light: "#8b8ce5",
	accent: "#da4526",
});

export function meteoriteLandings() {
	showControls.state = false;
	// Set the patch to the url of the CSV file
	currentGrid.data.path = path;
	currentGrid.theme = meteoriteTheme;

	// Turn the CSV file into an array of objects, then...
	fetchAndParseCSV(path).then((data) => {
		// Filter the data to include relevant information about this particular data
		// Make sure the meteorite has a year and a mass
		// Sort the data by year
		// Limit the data to 100 entries (because the performance is supposed to be about a minute)
		const uniqueCoordinates = new Set();
		const filteredData = data
			.filter(
				(meteorite) =>
					meteorite.year !== null || meteorite["mass (g)"] !== null
			)
			.filter((meteorite) => {
				const coordinates = `${meteorite.reclat},${meteorite.reclong}`;
				if (uniqueCoordinates.has(coordinates)) {
					return false;
				} else {
					uniqueCoordinates.add(coordinates);
					return true;
				}
			})
			.slice(0, 100);

		// Update the data to be the data after the curation
		currentGrid.data.data = filteredData;

		// Get the smallest coordinates
		// We use reduce(), which is a method for arrays that...
		// performs a function on each element of the array until
		// the result is a single value
		const smallestCoordinates = filteredData.reduce(
			(acc, meteorite) => {
				// if the meteorite's latitude is less than the current smallest latitude...
				if (meteorite.reclat < acc.reclat)
					// set the current smallest latitude to the meteorite's latitude
					acc.reclat = meteorite.reclat;
				// if the meteorite's longitude is less than the current smallest longitude...
				if (meteorite.reclong < acc.reclong)
					// set the current smallest longitude to the meteorite's longitude
					acc.reclong = meteorite.reclong;
				return acc;
			},
			// These are the initial values. We use "Infinity" because we want to ensure that our
			// starting point is always larger than the smallest value in the array
			{ reclat: Infinity, reclong: Infinity }
		);

		// Get the largest coordinates
		// We use reduce() again
		const largestCoordinates = filteredData.reduce(
			(acc, meteorite) => {
				// if the meteorite's latitude is greater than the current largest latitude...
				if (meteorite.reclat > acc.reclat)
					// set the current largest latitude to the meteorite's latitude
					acc.reclat = meteorite.reclat;
				// if the meteorite's longitude is greater than the current largest longitude...
				if (meteorite.reclong > acc.reclong)
					// set the current largest longitude to the meteorite's longitude
					acc.reclong = meteorite.reclong;
				return acc;
			},
			// These are the initial values. We use "-Infinity" because we want to ensure that our
			// starting point is always smaller than the largest value in the array
			{ reclat: -Infinity, reclong: -Infinity }
		);

		// Get the earliest and latest years
		// We use reduce() again
		const smallestTime = filteredData.reduce(
			// We use Math.min() to compare the current smallest year with the meteorite's year
			(acc, meteorite) => Math.min(acc, meteorite.year),
			// We use "Infinity" because we want to ensure that our year is always earlier than the earliest year
			Infinity
		);

		// We use reduce() again
		const largestTime = filteredData.reduce(
			// We use Math.max() to compare the current largest year with the meteorite's year
			(acc, meteorite) => Math.max(acc, meteorite.year),
			// We use "-1" because we want to ensure that our year is always later than the latest year
			-1
		);

		currentGrid.data.coordinateScale.x.min = smallestCoordinates.reclat;
		currentGrid.data.coordinateScale.x.max = largestCoordinates.reclat;
		currentGrid.data.coordinateScale.y.min = smallestCoordinates.reclong;
		currentGrid.data.coordinateScale.y.max = largestCoordinates.reclong;
		currentGrid.data.timeScale.min = smallestTime;
		currentGrid.data.timeScale.max = largestTime;

		currentGrid.data.loaded = true;

		console.log(filteredData);
	});
}

import Papa from "papaparse";
import { currentGrid } from "$lib/index.svelte.js";

export async function fetchAndParseCSV(url) {
	try {
		const response = await fetch(url);
		const csvText = await response.text();
		return new Promise((resolve, reject) => {
			Papa.parse(csvText, {
				header: true,
				dynamicTyping: true,
				complete: function (results) {
					resolve(results.data);
				},
				error: function (error) {
					reject(error);
				},
			});
		});
	} catch (error) {
		console.error("Error fetching CSV file:", error);
	}
}
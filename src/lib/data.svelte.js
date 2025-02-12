// papaparse is a library for handling CSV files in JavaScript
import Papa from "papaparse";
import { currentGrid } from "$lib/index.svelte.js";

// This function fetches a CSV file from a given URL and parses it into an array of objects
export async function fetchAndParseCSV(url) {
	// with the data from the provided URL, try to...
	try {
		// waits to parse the data from the CSV file at the url
		const response = await fetch(url);

		// if there's a response, turn the data from the CSV file into text
		const csvText = await response.text();

		// if the text is created successfully...
		return new Promise((resolve, reject) => {
			// papaparse returns the data from the CSV file as an array of objects
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
	// otherwise, console log "Error fetching CSV file"
	} catch (error) {
		console.error("Error fetching CSV file:", error);
	}
}
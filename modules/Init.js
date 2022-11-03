const fs = require("fs");
const peacestats = JSON.parse(fs.readFileSync("storage/peacestats.json", "utf8"));
const PeaceStatsModel = require("../models/PeaceStatsModel");

// check if peacestats data exists
async function initPeaceStats(client) {
	const clientId = client.application.id;

	// init peacestats json
	if (!peacestats[clientId]) {
		peacestats[clientId] = {
			name: "Cure Peace",
			win: 0,
			draw: 0,
			loss: 0,
			points: 0,
		};

		fs.writeFile("storage/peacestats.json", JSON.stringify(peacestats), (err) => {
			if (err) console.error(err);
		});
	}

	// check if peace stats exists
	let peaceStats = new PeaceStatsModel();
	const paramWhere = new Map();
	paramWhere.set(peaceStats.fields.id_user, clientId);
	await peaceStats.find(paramWhere);

	if (!peaceStats.hasData()) {
		const paramInsert = new Map();
		paramInsert.set(peaceStats.fields.id_user, clientId);
		paramInsert.set(peaceStats.fields.name, "Cure Peace");
		peaceStats = new PeaceStatsModel();
		await peaceStats.insert(paramInsert);
	}
}

module.exports = { initPeaceStats };
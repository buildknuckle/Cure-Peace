const saucenao_key = require("dotenv").config().parsed.saucenao_key;
const fetch = require("node-fetch");

const { ApplicationCommandType, ApplicationCommandOptionType, hyperlink, bold } = require("discord.js");
const { Pagination, PaginationConfig, PaginationButton } = require("../modules/discord/Pagination");
const { Embed } = require("../modules/discord/Embed");
const { errorLog } = require("../modules/Logger");
const { dateTimeNow } = require("../modules/helper/datetime");

function handleResponse(response) {
	return response.json().then(function(json) {
		return response.ok ? json : Promise.reject(json);
	});
}

// returns error message on catch
function saucenaoErrorHandler(tag, error, message) {
	let errMessage = ":x: ";
	let log = `[${tag}] ${dateTimeNow()} `;
	if ("errno" in error) {
		errMessage += "Unexpected error has occured";
		log += error;
		errorLog(log);
	}
	else {
		console.log(error);
		errMessage += `Error ${message}`;
		log += `Error ${message}`;
	}

	console.log(log);
	return errMessage;
}

module.exports = {
	name: "saucenao",
	description: "Reverse search image with SauceNAO",
	type: ApplicationCommandType.ChatInput,
	options:[
		{
			name: "image-url",
			description: "provide the image url",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "search-mode",
			description: "filterize based on search mode",
			type: ApplicationCommandOptionType.String,
			required: false,
			choices: [
				{
					name: "anime",
					value: "anime",
				},
				{
					name: "art",
					value: "art",
				},
			],
		},
	],
	async execute(interaction) {
		const imgUrl = interaction.options.getString("image-url");
		const searchMode = interaction.options.getString("search-mode") ?
			interaction.options.getString("search-mode") : "anime";

		let embed = new Embed();

		let dbsQuery = "";
		// list of dbs: https://saucenao.com/tools/examples/api/index_details.txt
		switch (searchMode) {
		case "anime":
		default: {
			dbsQuery = "dbs[]=21";
			break;
		}
		case "art": {
			dbsQuery = "dbs[]=5&dbs[]=41";
			break;
		}
		}

		const saucenaoUrl = `https://saucenao.com/search.php?${dbsQuery}&output_type=2&testmode=1&numres=15&api_key=${saucenao_key}&url=${imgUrl}&hide=3`;

		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
		};

		switch (searchMode) {
		case "anime": {
			await interaction.deferReply();
			break;
		}
		case "art": {
			await interaction.deferReply({ ephemeral: true });
			break;
		}
		}

		let saucenaoResults = null;

		await fetch(saucenaoUrl, fetchOptions).then(handleResponse)
			.then(async function handleData(dtSaucenao) {
				if (dtSaucenao.results) {
					saucenaoResults = dtSaucenao.results;
				}
			})
			.catch(async function handleError(errorSaucenao) {
				return interaction.followUp(saucenaoErrorHandler("SAUCENAO", errorSaucenao, "Cannot find any results of this search"));
			});

		if (!saucenaoResults) {
			return await interaction.followUp(":x: cannot find any results of this search");
		}

		const pages = [];
		switch (searchMode) {
		case "anime": {
			saucenaoResults.forEach(results => {
				embed = new Embed();
				const similarity = results.header.similarity;
				let description = `${bold("Similarity:")} ${similarity}`;

				if (similarity >= 85) {
					embed.color = Embed.color.green;
				}
				else if (similarity >= 50) {
					embed.color = Embed.color.yellow;
				}
				else {
					embed.color = Embed.color.red;
				}

				embed.thumbnail = results.header.thumbnail;
				embed.authorName = results.data.source;
				embed.authorUrl = `https://anilist.co/anime/${results.data.anilist_id}`;

				if ("year" in results.data) {
					description += `\\n${bold("Year: ")}${results.data.year}`;
				}

				if ("part" in results.data) {
					description += `\\n${bold("Episode: ")} ${results.data.part}`;
				}

				embed.description = description;

				embed.addFields("est time", `${results.data.est_time}`, true);
				pages.push(embed.build());
			});

			return new Pagination().setInterface(interaction)
				.setPageList(pages)
				.setButtonList(PaginationButton)
				.setTimeout(PaginationConfig.timeout)
				.paginate();
		}
		case "art": {
			saucenaoResults.forEach(results => {
				embed = new Embed();
				const similarity = results.header.similarity;
				let description = `${bold("Similarity:")} ${similarity}`;

				if (similarity >= 85) {
					embed.color = Embed.color.green;
				}
				else if (similarity >= 50) {
					embed.color = Embed.color.yellow;
				}
				else {
					embed.color = Embed.color.red;
				}

				embed.thumbnail = results.header.thumbnail;

				const link = results.data.ext_urls[0];
				// embed.thumbnail = results.header.thumbnail;
				if ("pixiv_id" in results.data) {
					// pixiv:
					embed.addFields("Source Link", `${hyperlink("Pixiv", link)}`);
					embed.authorName = results.data.member_name;
					embed.authorUrl = `https://www.pixiv.net/en/users/${results.data.pixiv_id}`;

					embed.title = results.data.title;
				}
				else if ("twitter_user_id" in results.data) {
					// twitter:
					embed.addFields("Source Link", `${hyperlink("Twitter", link)}`);
					embed.authorName = results.data.member_name;
					embed.authorUrl = `https://www.twitter.com/${results.data.member_name}`;
					description += `\\nCreated at: ${results.data.created_at}`;
				}

				embed.description = description;

				if (!results.header.hidden) {
					pages.push(embed.build());
				}
			});

			return new Pagination().setInterface(interaction)
				.setPageList(pages)
				.setButtonList(PaginationButton)
				.setTimeout(PaginationConfig.timeout)
				.paginate();
		}
		}
	},
};
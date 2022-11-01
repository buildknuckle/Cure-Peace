const fetch = require("node-fetch");
const { ApplicationCommandType, ApplicationCommandOptionType, hyperlink } = require("discord.js");
const { Pagination, PaginationConfig, PaginationButton } = require("../modules/discord/Pagination");
const { Embed } = require("../modules/discord/Embed");
const { errorLog } = require("../modules/Logger");
const { dateTimeNow, timestampToDateTime } = require("../modules/helper/datetime");

function handleResponse(response) {
	return response.json().then(function(json) {
		return response.ok ? json : Promise.reject(json);
	});
}

// returns error message on catch
function sakugaErrorHandler(tag, error, message) {
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
	name: "sakugabooru",
	description: "Sakugabooru search command",
	type: ApplicationCommandType.ChatInput,
	args: true,
	api_ver: "API 1.13.0+update.3",
	options: [
		{
			name: "keyword",
			description: "Enter the search keyword",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "page",
			description: "Enter the page number",
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
	],
	async execute(interaction) {
		const keyword = interaction.options.getString("keyword").replace(/\s/g, "_").replace(/,/g, "+");
		const page = interaction.options.getInteger("page") ? interaction.options.getInteger("page") : 1;

		const fetchUrl = `https://www.sakugabooru.com/post.json?limita=0&page=${page}&tags=${keyword}`;
		const fetchOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
		};

		const embed = new Embed();
		embed.color = 0xEA002D;

		await interaction.deferReply();

		// Make the HTTP Api request
		await fetch(fetchUrl, fetchOptions).then(handleResponse)
			.then(async function handleData(dt) {
				const pages = [];
				dt.forEach(entry => {
					// console.log(dt);
					embed.authorName = `${entry.author}`;
					embed.authorUrl = `https://www.sakugabooru.com/user/show/${entry.creator_id}`;
					embed.description = `**Tags:**\n${entry.tags.replace(/\s/g, ",").replace(/_/g, " ")}`;

					// file extension filter
					switch (entry.file_ext.split(".").pop().toLowerCase()) {
					// image format:
					case "jpg":
					case "jpeg":
					case "png":
					case "gif":
						embed.image = entry.file_url;
						break;
						// video format:
					case "mp4":
					default:
						embed.description += `\n\n**File:**\n${entry.file_url}`;
						embed.image = entry.preview_url;
						break;
					}

					embed.fields = [
						{
							name: "🔗 Site:",
							value: `${hyperlink("Go to site", `https://www.sakugabooru.com/post/show/${entry.id}`)}\n`,
							inline: true,
						},
						{
							name: "📅 Posted date:",
							value: `${timestampToDateTime(entry.created_at)}`,
							inline: true,
						},
						{
							name: "⭐ Score:",
							value: `${entry.score}`,
							inline: true,
						},
					];

					pages.push(embed.build());
				});

				if (pages.length > 0) {
					new Pagination().setInterface(interaction)
						.setPageList(pages)
						.setButtonList(PaginationButton)
						.setTimeout(PaginationConfig.timeout)
						.paginate();
				}
				else {
					return interaction.followUp(":x: Can't find any sakuga results with that keyword");
				}
			})
			.catch(function handleError(error) {
				return interaction.followUp(sakugaErrorHandler("SAKUGABOORU_SEARCH", error, "Cannot find any sakuga results with that keyword"));
			});

	},

};
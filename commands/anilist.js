const fetch = require("node-fetch");
const { ApplicationCommandType, ApplicationCommandOptionType, hyperlink } = require("discord.js");
const { Pagination, PaginationConfig, PaginationButton } = require("../modules/discord/Pagination");
const { Embed } = require("../modules/discord/Embed");
const { errorLog } = require("../modules/Logger");
const { dateTimeNow } = require("../modules/helper/datetime");

function handleResponse(response) {
	return response.json().then(function(json) {
		return response.ok ? json : Promise.reject(json);
	});
}

// returns link of anilist image
function aniImgLink(id) {
	return `https://img.anili.st/media/${id}`;
}

// returns link of anilist staff
function aniStaffLink(id) {
	return `https://anilist.co/staff/${id}`;
}

// returns error message on catch
function anilistErrorHandler(tag, error, message) {
	let errMessage = ":x: ";
	let log = `[${tag}] ${dateTimeNow()} `;
	if ("errno" in error) {
		errMessage += "Unexpected error has occured";
		log += error;
		errorLog(log);
	}
	else {
		errMessage += `Error ${error.errors[0].status} - ${message}`;
		log += `Error ${error.errors[0].status} - ${error.errors[0].message}`;
	}

	console.log(log);
	return errMessage;
}

module.exports = {
	name: "anilist",
	args: true,
	type: ApplicationCommandType.ChatInput,
	description: "Anilist search command",
	api_ver:"2",
	options: [
		{
			name: "title",
			description: "Search for anime title",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "anime-title",
					description: "Anime title keyword",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: "character",
			description: "Search for anime character",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "anime-character",
					description: "Anime character keyword",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "anime-title",
					description: "Provide with anime title keyword",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
		},
		{
			name: "staff",
			description: "Search for anime/VA/studio staff",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "staff-name",
					description: "Staff name keyword",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "filter",
					description: "Filter based on staff/VA",
					type: ApplicationCommandOptionType.String,
					required: false,
					choices: [
						{
							name: "staff",
							value: "staff",
						},
						{
							name: "voice-actor",
							value: "voice-actor",
						},
					],
				},
			],
		},
	],
	async execute(interaction) {
		const fetchUrl = "https://graphql.anilist.co";
		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			body: JSON.stringify({
				"query": null,
				"variables": null,
			}),
		};
		const embedColor = 0x02A9FF;

		switch (interaction.options.getSubcommand()) {
		case "title": {
			// search for anime title
			const aniTitle = interaction.options.getString("anime-title");

			// provide search query
			let fetchQuery = `query ($title: String) {
				Media (search: $title, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
					id
					description
					relations{
						edges{
							id
							relationType(version:2)
							node{
								id
								seasonYear
								siteUrl
								title{
									romaji
									english
									native
								}
							}
						}
					}
					staff(perPage:6){
						edges{
							node{
								id
								name{
									full
									native
								}
							}
							role
						}
					}
					title{
						romaji
						english
						native
					}
					status
					format
					bannerImage
					siteUrl
					favourites
				}
			}`;

			// Define our query variables and values that will be used in the query request
			let fetchVariables = {
				title: aniTitle,
				// search by id
				// id: 15125,
			};

			fetchOptions.body = JSON.stringify({
				"query": fetchQuery,
				"variables": fetchVariables,
			});

			// main anime info:
			// Make the HTTP Api request
			await interaction.deferReply();

			const pages = [];

			await fetch(fetchUrl, fetchOptions).then(handleResponse)
				.then(async function handleData(dt) {
					// main page
					const mainMedia = dt.data.Media;
					const mainEmbed = new Embed();
					mainEmbed.color = embedColor;
					if (mainMedia.description != null) {
						mainEmbed.description = mainMedia.description;
						mainEmbed.withReadmore = mainMedia.siteUrl;
					}

					const staffNodes = mainMedia.staff.edges;
					// staff embed fields
					staffNodes.forEach(function(staff) {
						let nativeName = "";
						if (staff.node.name.native != null) {
							nativeName = ` (${staff.node.name.native})`;
						}
						mainEmbed.addFields(`${staff.role}`, `${hyperlink(`${staff.node.name.full}${nativeName}`, `${aniStaffLink(staff.node.id)}`)}`, true);
					});

					let titleNative = "";
					if (mainMedia.title.native != null) {
						titleNative = ` (${mainMedia.title.native})`;
					}

					mainEmbed.author = {
						name:`${mainMedia.title.romaji}${titleNative}`,
						url:mainMedia.siteUrl,
					};

					mainEmbed.image = aniImgLink(dt.data.Media.id);
					mainEmbed.setFooter(`❤️${dt.data.Media.favourites}`);
					pages.push(mainEmbed.build());

					// check if anime has relation
					const relations = (dt.data.Media.relations.edges).slice(0, 20);
					if (relations.length > 0) {
						const relationEmbed = new Embed();
						relationEmbed.color = embedColor;
						relationEmbed.title = "Relations";

						for (let i = 0;i < relations.length;i++) {
							const relationType = relations[i].relationType.replace("_", " ");
							const relationNode = relations[i].node;

							const seasonYear = relationNode.seasonYear ? `(${relationNode.seasonYear})` : "";

							relationEmbed.addFields(`${relationType} ${seasonYear}`, hyperlink(`${relationNode.title.romaji}`, relationNode.siteUrl), true);
						}

						pages.push(relationEmbed.build());
					}

				})
				.catch(async function handleError(error) {
					interaction.followUp(anilistErrorHandler("ANILIST_TITLE", error, "Cannot found any results for this title"));
				});

			// search for similar title
			fetchQuery = `query ($id: Int, $page: Int, $search: String) {
				Page (page: $page) {
					pageInfo {
						total
						currentPage
						lastPage
						hasNextPage
						perPage
					}
					media (id: $id, search: $search, isAdult:false, type: ANIME, sort: START_DATE) {
						id
						title {
							romaji
							english
							native
						}
						siteUrl
						seasonYear
					}
				}
				}`;

			fetchVariables = {
				search: aniTitle,
				page: 1,
			};

			fetchOptions.body = JSON.stringify({
				"query": fetchQuery,
				"variables": fetchVariables,
			});

			await fetch(fetchUrl, fetchOptions).then(handleResponse)
				.then(async function handleData(dt) {
					const maxData = dt.data.Page.media.length;

					// console.log(dt.data.Page.media);
					const embed = new Embed();
					embed.color = embedColor;
					embed.title = "Similar search results:";

					let desc = "";
					const maxIdx = 15;
					let ctr = 0; let idx = 0;

					dt.data.Page.media.forEach(function(entry) {
						const seasonYear = entry.seasonYear ? ` (${entry.seasonYear})` : "";
						desc += `• ${hyperlink(`${entry.title.romaji}${seasonYear}`, entry.siteUrl)}\n`;
						ctr++;

						if (ctr >= maxData || idx > maxIdx) {
							embed.description = desc;
							pages.push(embed.build());
							idx = 0; desc = "";
						}
						else {
							idx++;
						}

					});
				})
				.catch(function handleError() {
					// console.log(error);
				});

			if (pages.length > 0) {
				new Pagination().setInterface(interaction)
					.setPageList(pages)
					.setButtonList(PaginationButton)
					.setTimeout(PaginationConfig.timeout)
					.paginate();
			}
			else {
				interaction.followUp("Cannot found any results for this title");
			}

			break;
		}
		case "character": {
			// search for anime character
			const charName = interaction.options.getString("anime-character");
			const aniTitle = interaction.options.getString("anime-title");
			let charId = null;

			let fetchQuery = "";
			let fetchVariables = {};

			await interaction.deferReply();

			// check & search title if parameter was given:
			if (aniTitle) {
				fetchQuery = `query ($title: String) {
					Media (search: $title, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
						id
						characters(sort: FAVOURITES_DESC){
							nodes{
								id
								name{
									first
									last
									full
									native
									alternative
								}
							}
						}
					}
				}`;

				// Define our query variables and values that will be used in the query request
				fetchVariables = {
					title: aniTitle,
				};

				fetchOptions.body = JSON.stringify({
					"query": fetchQuery,
					"variables": fetchVariables,
				});

				await fetch(fetchUrl, fetchOptions).then(handleResponse)
					.then(function handleData(dt) {
						const charNodes = dt.data.Media.characters.nodes;

						const filteredData = charNodes.filter(val => {
							// console.log(val)
							return Object.values(val.name).some(
								first => String(first).toLowerCase().includes(charName.toLowerCase()),
							) || Object.values(val.name).some(
								last => String(last).toLowerCase().includes(charName.toLowerCase()),
							) || Object.values(val.name).some(
								full => String(full).toLowerCase().includes(charName.toLowerCase()),
							) || Object.values(val.name).some(
								alternative => String(alternative).toLowerCase().includes(charName.toLowerCase()),
							);
						});

						// validate if character not found
						if (filteredData.length <= 0) {
							interaction.followUp(":x: Can't find that character on given title");
						}
						else {
							charId = filteredData[0].id;
						}

					})
					.catch(async function handleError(error) {
						return await interaction.followUp(anilistErrorHandler("ANILIST_TITLE", error, "Can't find that character on given title"));
					});

				if (!charId) return;
			}

			fetchVariables = {
				keyword:charName,
			};

			// if char id was found with title
			if (charId) {
				fetchQuery = `query ($keyword: String, $idChar:Int) {
				Character (search: $keyword, id:$idChar) {
					id
					name{
						full
						native
						alternative
					}
					image{large,medium}
					description
					siteUrl
					favourites
					media(type: ANIME, sort: START_DATE){
						edges{
							node{
								id
								title{
									romaji
								}
								siteUrl
								seasonYear
							}
							voiceActors{
								id
								name{
									full
									native
								}
								language
							}
						}
					}
				}
				}`;

				fetchVariables.idChar = charId;
			}
			else {
				fetchQuery = `query ($keyword: String) {
				Character (search: $keyword) {
					id
					name{
						full
						native
						alternative
					}
					image{large,medium}
					description
					siteUrl
					favourites
					media(type: ANIME, sort: START_DATE){
						edges{
							node{
								id
								title{
									romaji
								}
								siteUrl
								seasonYear
							}
							voiceActors{
								id
								name{
									full
									native
								}
								language
							}
						}
					}
				}
				}`;
			}

			fetchOptions.body = JSON.stringify({
				"query": fetchQuery,
				"variables": fetchVariables,
			});

			await fetch(fetchUrl, fetchOptions).then(handleResponse)
				.then(async function handleData(dt) {
					const character = dt.data.Character;

					const mainEmbed = new Embed();
					mainEmbed.color = embedColor;
					const nativeName = character.name.native ?
						`(${character.name.native})` : "";

					mainEmbed.authorIcon = character.image.medium,
					mainEmbed.authorName = `${character.name.full} ${nativeName}`,
					mainEmbed.authorUrl = character.siteUrl;

					mainEmbed.thumbnail = character.image.large;
					let appearances = "";
					const charEdges = character.media.edges;

					const arrVa = [];
					let ctr = 0; let isMore = false;
					charEdges.forEach(function(entry) {
						// add the va data:
						const vaData = entry.voiceActors;
						vaData.forEach(function(entryVa) {
							const tempVaText = `${entryVa.name.full} : ${entryVa.language}`;
							if (!arrVa.includes(tempVaText)) {
								arrVa.push(tempVaText);
							}
						});
						// add the appearances of the show:
						if (ctr <= 5) {
							const node = entry.node;
							appearances += `[${node.title.romaji} `;
							if (node.seasonYear) {
								appearances += ` (${node.seasonYear})`;
							}
							appearances += `](${node.siteUrl})\n`;
						}
						else {
							isMore = true;
						}
						ctr++;
					});

					if (isMore) {
						appearances += `**${ctr - 6}+ other shows**`;
					}

					mainEmbed.objEmbed.fields = [
						{
							name:"🎞️ Appearances:",
							value: appearances,
							inline: false,
						},
					];

					// alias checking
					if (character.name["alternative"] != "") {
						mainEmbed.addFields("❔Known as:", character.name.alternative.join(", "), true);
					}

					// description
					if (character.description) {
						mainEmbed.description = character.description;
						mainEmbed.withReadmore = character.siteUrl;
					}
					else {
						mainEmbed.description = "This character doesn't have any written description yet";
					}

					// voice actor
					if (arrVa.length >= 1) {
						mainEmbed.addFields("🎙️ VA Staff:", arrVa.join("\n"));
					}

					mainEmbed.setFooter(`❤️ ${character.favourites}`);

					return interaction.followUp(mainEmbed.buildEmbed());

				})
				.catch(async function handleError(error) {
					return interaction.followUp(anilistErrorHandler("ANILIST_CHARACTER", error, "Cannot find that character"));
				});

			break;
		}
		case "staff": {
			const staffName = interaction.options.getString("staff-name");
			const filter = interaction.options.getString("filter") ? interaction.options.getString("filter") : "staff";

			const fetchQuery = `query ($keyword: String) {
			Staff (search: $keyword) {
				id
				name{
					full
					native
					alternative
				}
				image{large,medium}
				description
				siteUrl
				favourites
				staffMedia(type: ANIME){
					edges{
						node{
							id
							title{
								romaji
							}
							siteUrl
							seasonYear
						}
						staffRole
					}
				}
				characterMedia{
					edges{
						node{
							title{
								romaji
							}
							siteUrl
							seasonYear
						}
						characters{
							siteUrl
							name{
								full
								native
								alternative
							}
							image{large,medium}
						}
					}
				}
			}
			}`;

			// Define our query variables and values that will be used in the query request
			const fetchVariables = {
				keyword: staffName,
			};

			// Define the config we'll need for our Api request
			fetchOptions.body = JSON.stringify({
				"query": fetchQuery,
				"variables": fetchVariables,
			});

			await interaction.deferReply();

			// Make the HTTP Api request
			await fetch(fetchUrl, fetchOptions).then(handleResponse)
				.then(async function handleData(dt) {
					// main data
					const staff = dt.data.Staff;

					const mainEmbed = new Embed();
					mainEmbed.color = embedColor;
					mainEmbed.authorIcon = staff.image.medium;
					const staffNativeName = staff.name.native ? ` (${staff.name.native})` : "";
					mainEmbed.authorName = `${staff.name.full}${staffNativeName}`;
					mainEmbed.authorUrl = staff.siteUrl;
					mainEmbed.description = staff.description;
					mainEmbed.options.readmoreLink = staff.siteUrl;
					mainEmbed.thumbnail = staff.image.medium;

					let arrFields = [];
					const pages = []; const maxIdx = 4;
					let ctr = 0; let idx = 0;
					switch (filter) {
					case "staff": {
						// Staff data
						const staffMediaEdges = staff.staffMedia.edges;
						const maxData = staffMediaEdges.length;

						if (maxData <= 0) return interaction.followUp(":x: Cannot find this staff");

						staffMediaEdges.forEach(function(entry) {
							const staffNode = entry.node;

							const seasonYear = staffNode.seasonYear ?
								` (${staffNode.seasonYear})` : "";

							arrFields.push({
								name: `${staffNode.title.romaji}${seasonYear}`,
								value: `[${entry.staffRole}](${staffNode.siteUrl})`,
								inline: true,
							});

							ctr++;

							if (ctr >= maxData || idx > maxIdx) {
								mainEmbed.fields = arrFields;

								pages.push(mainEmbed.build());
								idx = 0; arrFields = [];
							}
							else {
								idx++;
							}

						});

						new Pagination().setInterface(interaction)
							.setPageList(pages)
							.setButtonList(PaginationButton)
							.setTimeout(PaginationConfig.timeout)
							.paginate();

						break;
					}
					case "voice-actor": {
						// VA data
						const charMediaEdges = staff.characterMedia.edges;
						const maxData = charMediaEdges.length;

						if (maxData <= 0) return interaction.followUp(":x: Cannot find that staff as voice actor");

						charMediaEdges.forEach(function(entry) {
							// console.log(entry);
							const charNodes = entry.characters;

							let txtCharacter = "";
							// loop character
							charNodes.forEach(function(entryCharacters) {
								txtCharacter += `[${entryCharacters.name.full}](${entryCharacters.siteUrl})\n`;
							});

							const seasonYear = entry.node.seasonYear ?
								` (${entry.node.seasonYear})` : "";

							arrFields.push({
								name: `${entry.node.title.romaji}${seasonYear}`,
								value: `as ${txtCharacter}`,
								inline: true,
							});

							ctr++;

							if (ctr >= maxData || idx > maxIdx) {
								mainEmbed.thumbnail = charNodes[0].image.large;
								mainEmbed.fields = arrFields;

								pages.push(mainEmbed.build());
								idx = 0; arrFields = [];
							}
							else {
								idx++;
							}

						});

						new Pagination().setInterface(interaction)
							.setPageList(pages)
							.setButtonList(PaginationButton)
							.setTimeout(PaginationConfig.timeout)
							.paginate();

						break;
					}
					}

				})
				.catch(async function handleError(error) {
					return interaction.followUp(anilistErrorHandler("ANILIST_STAFF", error, "Cannot find that staff"));
				});

			break;
		}
		}
	},
};
const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const fetch = require('node-fetch');
const GlobalFunctions = require('../modules/GlobalFunctions');
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('discordjs-button-pagination');

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

module.exports = {
	name: 'tracemoe',
	description: 'Tracemoe command',
	options:[
        {
            name: "search",
			description: "Reverse search anime image",
			type: 1,
			options:[
				{
					name:"image-url",
					description:"Enter the image url",
					type:3,
					required:true
				}
			]
		}
	],
	async executeMessage(message, args) {
	},
	async execute(interaction){
		var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
		var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

		switch(commandSubcommand){
			case "search":
				var imageUrl = interaction.options._hoistedOptions[0].value;
				var url = `https://api.trace.moe/search?url=${imageUrl}`;
				options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                };

				var objEmbed = {
					color:DiscordStyles.Color.embedColor,
					author:{
						name: `Trace.moe Top Search`,
					}
				}

				try{
					await fetch(url, options).then(handleResponse)
					.then(async function handleData(dt) {
						//json results example:
						/*
							//format:// anilist: 10278,
							// filename: '[DMG][THE IDOLM@STER][BDRip][05][AVC_AAC][720P][CHT].mp4',
							// episode: 5,
							// from: 1088.08,
							// to: 1090.92,
							// similarity: 1,
							// video: 'https://media.trace.moe/video/10278/%5BDMG%5D%5BTHE%20IDOLM%40STER%5D%5BBDRip%5D%5B05%5D%5BAVC_AAC%5D%5B720P%5D%5BCHT%5D.mp4?t=1089.5&token=U3BMxRRrySwDx6VqZRc3TjJvWLI',
							// image: 'https://media.trace.moe/image/10278/%5BDMG%5D%5BTHE%20IDOLM%40STER%5D%5BBDRip%5D%5B05%5D%5BAVC_AAC%5D%5B720P%5D%5BCHT%5D.mp4?t=1089.5&token=U3BMxRRrySwDx6VqZRc3TjJvWLI'
						*/
						
						var topResult = dt.result[0];
	
						//anilist start:
						var query = `query ($idsearch: Int) {
						Media (id: $idsearch, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
							id
							description
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
							bannerImage
							siteUrl
						}
						}`;
		
						var urlAnilist = 'https://graphql.anilist.co',
						options = {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
							},
							body: JSON.stringify({
								query: query,
								variables: {
									idsearch: topResult.anilist //search by id
								}
							})
						};
		
						objEmbed.title = topResult.filename,20;
						await fetch(urlAnilist, options).then(handleResponse)
						.then(async function handleData(dtAnilist) {
							objEmbed.author.iconURL = dtAnilist.data.Media.bannerImage;
							objEmbed.title = dtAnilist.data.Media.title.romaji;
							objEmbed.description = GlobalFunctions.cutText(GlobalFunctions.markupCleaner(dtAnilist.data.Media.description),150);
							objEmbed.description+=`\n\n[View more on Anilist](https://anilist.co/anime/${topResult.anilist})`;
						})
						.catch(async function handleError(errorAnilist) {
							// console.error(errorAnilist);
							// return await interaction.reply(`:x: Error on searching the image.`);
						});
						//anilist end
	
						var fromText = new Date(Math.round(topResult.from) * 1000).toISOString().substr(14, 5);
						var toText = new Date(Math.round(topResult.to) * 1000).toISOString().substr(14, 5);
						
						objEmbed.fields = [
							{
								name:`Episode:`,
								value:`${String(topResult.episode)}`,
								inline:true
							},
							{
								name:`From:`,
								value:`${String(fromText)}`,
								inline:true
							},
							{
								name:`To:`,
								value:`${String(toText)}`,
								inline:true
							}
						];
	
						objEmbed.thumbnail = {
							url:topResult.image
						}

						objEmbed.image = {
							url:`https://img.anili.st/media/${topResult.anilist}`
						}
	
						return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
					})
					.catch(async function handleError(err) {
						return await interaction.reply({content:err.error});
						// return await interaction.reply(`:x: Error on searching the image.`);
					});
				} catch(err){
					// console.log(err);
					// return await interaction.reply(`:x: Error on searching the image. Please try again or wait for a while.`);
				}

				break;
		}
	}
};
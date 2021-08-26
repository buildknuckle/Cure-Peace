const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const fetch = require('node-fetch');
const GlobalFunctions = require('../modules/GlobalFunctions');
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('discordjs-button-pagination');
const { saucenao_key } = require('../storage/config.json');

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

module.exports = {
	name: 'saucenao',
	description: 'SauceNao command',
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

		var objEmbed = {
			color:DiscordStyles.Color.embedColor,
			author:{
				name: `SauceNao Top Search`,
			}
		}

		switch(commandSubcommand){
			case "search":
				await interaction.deferReply();
				var imageUrl = interaction.options._hoistedOptions[0].value;

				var url = `https://saucenao.com/search.php?db=21&output_type=2&testmode=1&numres=5&api_key=${saucenao_key}&url=${imageUrl}`;
				options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                };

				try{
					await fetch(url, options).then(handleResponse)
					.then(async function handleData(dt) {
						//json results example:
						/*
							"results":[{"header":{"similarity":"87.97","thumbnail":"https:\/\/img3.saucenao.com\/frames\/?expires=1630436400\u0026init=1d9a2001c8424d23\u0026data=9b9413943490d33b61838c798545615991e4e7aa2996f6de147141d98b322fddd93d45721e6f0a31922700c79b3843d3c0ebc150ed168118d0bcb95a0abd619699a61e6fe431f6a0054b2b3443443d962359f175bcc98a24df50508b1270433b57a195a38bdc7f1cd2f1fcfe2fd8fa17\u0026auth=e99de959c68ef57981b918efe9f25f6f063cdf03","index_id":21,"index_name":"Index #21: Anime* - 21510-80-897105.jpg (31239)","dupes":0},"data":{"ext_urls":["https:\/\/anidb.net\/anime\/1413"],"source":"Futari wa Precure","anidb_aid":1413,"part":"08","year":"2004-2005","est_time":"00:14:57 \/ 00:24:10"}}
						*/
						
						var topResult = dt.results[0];
	
						//anilist start:
						var query = `query ($title: String) {
						Media (search: $title, sort: SEARCH_MATCH, type: ANIME) {
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
							isAdult
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
									title: topResult.data.source //search by id
								}
							})
						};

						var similarity = topResult.header.similarity;
						if(similarity<=70) similarity = "❓";
						else if(similarity<=80) similarity = "☑️";
						else similarity = "✅";

						objEmbed.fields = [
							{
								name:`Episode:`,
								value:`${String(topResult.data.part)}`,
								inline:true
							},
							{
								name:`Year`,
								value:`${String(topResult.data.year)}`,
								inline:true
							},
							{
								name:`Est Time:`,
								value:`${String(topResult.data.est_time)}`,
								inline:true
							},
							{
								name:`Similarity:`,
								value:`${String(topResult.header.similarity)}%`,
								inline:true
							},
							{
								name:`External Link:`,
								value:`[AniDB](${String(topResult.data.ext_urls[0])})`,
								inline:true
							},
						];

						objEmbed.thumbnail = {
							url:String(imageUrl)
						}
		
						await fetch(urlAnilist, options).then(handleResponse)
						.then(async function handleData(dtAnilist) {
							if(!dtAnilist.data.Media.isAdult){
								objEmbed.author.iconURL = dtAnilist.data.Media.bannerImage;
								objEmbed.title = `${similarity} ${dtAnilist.data.Media.title.romaji}`;
								objEmbed.description = GlobalFunctions.cutText(GlobalFunctions.markupCleaner(dtAnilist.data.Media.description),180);
								objEmbed.description+=`\n\n[View more on Anilist](https://anilist.co/anime/${dtAnilist.data.Media.id})`;
		
								objEmbed.image = {
									url:`https://img.anili.st/media/${dtAnilist.data.Media.id}`
								}
							}
						})
						.catch(async function handleError(errorAnilist) {
							objEmbed.title = `${similarity} ${topResult.data.source}`;
							objEmbed.image = {
								url:String(imageUrl)
							}
							objEmbed.description = "Cannot load anilist information";
							// console.log(errorAnilist);
							// return await interaction.editReply(`:x: Error on searching the image.`);
						});
						//anilist end
	
						return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
						
					})
					.catch(async function handleError(err) {
						console.log(err);
						// return await interaction.editReply({content:err});
						return await interaction.editReply(`:x: Error on searching the image.`);
					});
				} catch(err){
					return await interaction.editReply({content:err});
				}

				break;
		}
	}
};
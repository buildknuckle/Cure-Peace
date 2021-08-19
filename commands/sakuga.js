const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const fetch = require('node-fetch');
const paginationEmbed = require('discordjs-button-pagination');
const GlobalFunctions = require('../modules/GlobalFunctions');
const DiscordStyles = require('../modules/DiscordStyles');

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

module.exports = {
	name: 'sakugabooru',
    description: 'Sakugabooru search command',
    args: true,
    options: [
        {
            name: "anime-title",
            description: "Enter the anime title",
            type: 3,
            required:true
        },
        {
            name: "page",
            description: "Enter the page number",
            type: 4,
            required:false
        },
    ],
    async executeMessage(message, args) {
    },
    async execute(interaction) {
        var objEmbed = {
            color: DiscordStyles.Color.embedColor
        };

        var _keyword = interaction.options._hoistedOptions[0].value;
        var page = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
        interaction.options._hoistedOptions[1].value :1;//param(opt.): page search

        _keyword = _keyword.replace(/\s/g, '_').replace(/,/g, '+');//repalce whitespace comma

        // Define the config we'll need for our Api request
        var url = `https://www.sakugabooru.com/post.json?limit=0&page=${page}&tags=${_keyword}`,
        options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };

        // Make the HTTP Api request
        await fetch(url, options).then(handleResponse)
        .then(async function handleData(dt) {
            var arrPages = [];
            dt.forEach(entry => {
                objEmbed.author = {
                    name: `${entry.author}`,
                    url: `https://www.sakugabooru.com/user/show/${entry.creator_id}`
                }

                objEmbed.description = `**Tags:**\n${entry.tags.replace(/\s/g,",").replace(/_/g," ")}`;

                //file extension filter
                switch(entry.file_ext.split('.').pop().toLowerCase()){
                    //image format:
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "gif":
                        objEmbed.image = {
                            url:entry.file_url
                        }
                        break;
                    //video format:
                    case "mp4":
                    default:
                        objEmbed.description +=`\n\n**File:**\n${entry.file_url}`;
                        objEmbed.image = {
                            url:entry.preview_url
                        }
                        break;  
                }
                
                objEmbed.fields = [
                    {
                        name:`Site:`,
                        value:`[Go to site](https://www.sakugabooru.com/post/show/${entry.id})\n`,
                        inline:true
                    },
                    {
                        name:`Posted date:`,
                        value:`${GlobalFunctions.timestampToDateTime(entry.created_at)}`,
                        inline:true
                    },
                    {
                        name:`Score:`,
                        value:`${entry.score}`,
                        inline:true
                    }
                ];
                var msgEmbed = new MessageEmbed(objEmbed);
                arrPages.push(msgEmbed);

                objEmbed = {
                    color: DiscordStyles.Color.embedColor
                };
            });
            // console.log(arrPages);
            // return;

            if(arrPages.length>0){
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
            } else {
                return interaction.reply(`:x: I can't find that **keyword**. Try to put more specific keyword.`);
            }
        })
        .catch(function handleError(error) {
            console.error(error);
            return interaction.reply(`:x: I can't find that **keyword**. Try to put more specific keyword.`);
        });

    }
}
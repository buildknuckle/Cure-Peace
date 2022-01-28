const fs = require('fs');
const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');

const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const ItemModule = require('../../modules/Item');
const CardGuildModule = require('../../modules/CardGuild');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));
const CardPropertiesModules = require('../../modules/Card/Properties');
const DBM_Card_Leaderboard = require('../../database/model/DBM_Card_Leaderboard');

module.exports = {
    name: 'leaderboard',
    cooldown: 5,
    description: "Shows the leaderboard",
    args: true,
    options:[
        {
            name: "jankenpon",
            description: "Peace will shows the Rock-Paper-Score scoreboard!",
            type: 1,
            options: [
                {
                    name: "view",
                    description: "Enter card pack name",
                    type: 3
                }
            ]
        },
        {
            name: "card-pack",
            description: "View the card pack leaderboard",
            type: 1,
            options: [
                {
                    name: "pack-name",
                    description: "Enter card pack name",
                    type: 3,
                    required: true
                },
                {
                    name: "mode",
                    description: "Choose the completion mode (default:normal)",
                    type: 3,
                    required: false,
                    choices:[
                        {
                            name:"normal",
                            value:"pack"
                        },
                        {
                            name:"gold",
                            value:"pack_gold"
                        },
                    ]
                },
            ]
        },
        {
            name: "card-series",
            description: "View the card series leaderboard",
            type: 1,
            options: [
                {
                    name: "series-selection",
                    description: "Choose the series",
                    type: 3,
                    required: true,
                    choices:CardPropertiesModules.interactionList.series
                },
                {
                    name: "mode",
                    description: "Choose the completion mode (default:normal)",
                    type: 3,
                    required: false,
                    choices:[
                        {
                            name:"normal",
                            value:"series"
                        },
                        {
                            name:"gold",
                            value:"series_gold"
                        },
                    ]
                },
            ]
        },
        {
            name: "card-color",
            description: "View the card color leaderboard",
            type: 1,
            options: [
                {
                    name: "color-selection",
                    description: "Choose the color",
                    type: 3,
                    required: true,
                    choices: CardPropertiesModules.interactionList.color
                },
                {
                    name: "mode",
                    description: "Choose the completion mode (default:normal)",
                    type: 3,
                    required: false,
                    choices:[
                        {
                            name:"normal",
                            value:"color"
                        },
                        {
                            name:"gold",
                            value:"color_gold"
                        },
                    ]
                },
            ]
        },

    ],
    executeMessage(message, args) {
        const clientId = message.client.user.id;
    },
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        //default embed:
        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            }
        };

        switch(commandSubcommand){
            case "jankenpon":
                var lbArray = Object.entries(peacestats);
                for (i = 0, len = lbArray.length; i < len; i++) 
                    lbArray[i].splice(0,1);

                var newarray = [];
                for (i = 0, len = lbArray.length; i < len; i++)
                    newarray.push(lbArray[i].pop())
                
                function compare(a, b) {
                    const ptsa = a.points
                    const ptsb = b.points

                    let comparison = 0;
                    if (ptsa > ptsb) 
                        comparison = -1;
                    else if (ptsa < ptsb) 
                        comparison = 1;
                    
                    return comparison;
                }

                newarray.sort(compare);

                let postarray = newarray.map(x => `${x.name} - W: ${x.win} - D: ${x.draw} - L: ${x.loss} - Pts: ${x.points}`)
                
                var leaderboard = new MessageEmbed()
                .setAuthor("Top 10")
                .setThumbnail("https://cdn.discordapp.com/avatars/764510594153054258/cb309a0c731ca1357cfbe303c39d47a8.png")
                .setColor('#efcc2c')
                .setTitle("Here's the current Top 10!" )
                i = 0;
                while (i < 10) {
                    if (postarray[i] == undefined) {
                        break;
                    }
                    leaderboard.addField('#' + (i + 1) ,postarray[i]);
                    i++;
                }
                interaction.reply({embeds:[leaderboard]});
                break;
            case "card-pack":
            case "card-series":
            case "card-color":
                var completion = interaction.options._hoistedOptions[0].value;
                var selection = null;

                //validation completion:
                switch(commandSubcommand){
                    case "card-pack":
                        if(!CardModule.Properties.dataCardCore.hasOwnProperty(completion.toLowerCase())){
                            return interaction.reply({
                                embeds:[new MessageEmbed(CardModule.Embeds.embedCardPackNotFound())],ephemeral:true
                            });
                        }
                        selection = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value : "pack";
                        break;
                    case "card-series":
                        selection = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value : "series";
                        break;
                    case "card-color":
                        selection = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value : "color";
                        break;
                }

                await interaction.deferReply();

                //prepare the embed
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                }
                
                var query = `SELECT * 
                FROM ${DBM_Card_Leaderboard.TABLENAME} 
                WHERE ${DBM_Card_Leaderboard.columns.id_guild}=? AND 
                ${DBM_Card_Leaderboard.columns.category}=? AND 
                ${DBM_Card_Leaderboard.columns.completion}=?
                ORDER BY ${DBM_Card_Leaderboard.columns.created_at} ASC 
                LIMIT 10`; 
                var leaderboardContent = "";
                var arrParameterized = [guildId,selection,completion];
                var dataLeaderboard = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 1;
                dataLeaderboard[0].forEach(function(entry){
                    leaderboardContent += `${ctr}. <@${entry[DBM_Card_Leaderboard.columns.id_user]}> : ${GlobalFunctions.convertDateTime(entry[DBM_Card_Leaderboard.columns.created_at])}\n`; ctr++;
                })

                switch(selection){
                    case "pack":
                        objEmbed.title = `Top 10 ${GlobalFunctions.capitalize(completion)} Card Leaderboard`;
                        objEmbed.thumbnail = {url:CardModule.Properties.dataCardCore[completion].icon}
                        var color = CardModule.Properties.dataCardCore[completion].color;
                        objEmbed.color = CardModule.Properties.dataColorCore[color].color;

                        if(leaderboardContent=="") objEmbed.description = `No one has completed the **${completion}** card pack yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                    case "color":
                        objEmbed.title = `Top 10 Cure ${GlobalFunctions.capitalize(completion)} Leaderboard`;
                        objEmbed.color = CardModule.Properties.dataColorCore[completion].color;

                        if(leaderboardContent=="") objEmbed.description = `No one has become the master of **Cure ${completion}** yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                    case "series":
                        objEmbed.title = `Top 10 ${GlobalFunctions.capitalize(completion)} Series Completion Leaderboard`;
                        objEmbed.thumbnail = {url:CardModule.Properties.seriesCardCore[completion].icon}

                        if(leaderboardContent=="") objEmbed.description = `No one has completed the card series: **${completion}** yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                    case "pack_gold":
                        objEmbed.thumbnail = {url:CardModule.Properties.dataCardCore[completion].icon}
                        objEmbed.color = CardModule.Properties.cardCategory.gold.color;
                        objEmbed.title = `Top 10 Gold ${GlobalFunctions.capitalize(completion)} Card Leaderboard`;

                        if(leaderboardContent=="") objEmbed.description = `No one has completed the gold **${completion}** card pack yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                    case "color_gold":
                        objEmbed.title = `:trophy: Top 10 Gold Cure ${GlobalFunctions.capitalize(completion)} Leaderboard`;
                        objEmbed.color = CardModule.Properties.cardCategory.gold.color;

                        if(leaderboardContent=="") objEmbed.description = `No one has become the gold master of **Cure ${completion}** yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                    case "series_gold":
                        objEmbed.thumbnail = {url:CardModule.Properties.seriesCardCore[completion].icon}
                        objEmbed.title = `Top 10 Gold ${GlobalFunctions.capitalize(completion)} Card Leaderboard`;
                        objEmbed.color = CardModule.Properties.cardCategory.gold.color;

                        if(leaderboardContent=="") objEmbed.description = `No one has completed the gold card series: **${completion}** yet.`;
                        else objEmbed.description = `${leaderboardContent}`;
                        break;
                }

                return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                break;
        }
        // var userId = interaction.user.id;
        // var userUsername = interaction.user.username;
        // var userAvatarUrl = interaction.user.avatarURL();

    }
}
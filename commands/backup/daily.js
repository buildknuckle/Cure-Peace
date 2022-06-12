const {MessageActionRow, MessageButton, MessageEmbed, Discord, Emoji} = require('discord.js');
const dedent = require('dedent-js');
const paginationEmbed = require('../../modules/DiscordPagination');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
// const CardModule = require('../modules/Card');
const Properties = require("../../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../../modules/puzzlun/data/User");
const {UserQuest, DailyCardQuest} = require("../../modules/puzzlun/data/Quest");
const Card = require("../../modules/puzzlun/data/Card");
const CardInventory = require("../../modules/puzzlun/data/CardInventory");
const {Series, SPack} = require('../../modules/puzzlun/data/Series');
const Embed = require('../../modules/puzzlun/Embed');

const Daily = require('../../modules/puzzlun/Daily');
module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Card daily commands',
    options:[
        {
            name: "check-in",
            description: "Select the color check-in rewards",
            type: 1,
            options: [
                {
                    name: "selection",
                    description: "Select the color check-in rewards",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "all",
                            value: "all"
                        },
                        {
                            name: "pink",
                            value: "pink"
                        },
                        {
                            name: "blue",
                            value: "blue"
                        },
                        {
                            name: "yellow",
                            value: "yellow"
                        },
                        {
                            name: "purple",
                            value: "purple"
                        },
                        {
                            name: "red",
                            value: "red"
                        },
                        {
                            name: "green",
                            value: "green"
                        },
                        {
                            name: "white",
                            value: "white"
                        }
                    ],
                }
            ]
        },
        {
            name: "quest",
            description: "Check in for daily quests",
            type: 2,
            options:[
                {
                    name: "list",
                    description: "Open the daily quests list",
                    type: 1,
                },
                {
                    name: "submit",
                    description: "Submit the card quest",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id that you want to submit",
                            type: 3,
                            required:true
                        }
                    ]
                },
            ]
        }
    ],
	async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        switch(command){
            case "quest":
                switch(subcommand){
                    case "list":{
                        var daily = new Daily.Quest(interaction);
                        await daily.questList();
                        break;
                    }
                    case "submit":{
                        var daily = new Daily.Quest(interaction);
                        await daily.submitCardQuest();
                        break;
                    }
                        
                }
                break;
        }

        switch(subcommand){
            case "check-in":{
                var daily = new Daily(interaction);
                await daily.checkIn();
                break;
            }
        }
    }
};
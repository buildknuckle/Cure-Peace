const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const User = require("../modules/puzzlun/data/User");
const Validation = require("../modules/puzzlun/Validation");
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const TradeboardListener = require("../modules/puzzlun/Tradeboard");
const Embed = require('../modules/puzzlun/Embed');

module.exports = {
    name: 'tradeboard',
    cooldown: 5,
    description: 'Contains all tradeboard command',
    args: true,
    options:[
        {//post new card offer
            name: "post",
            description: "Post card trade offer",
            type: 1,
            options: [
                {
                    name: "looking-for",
                    description: "Enter the precure card id that you're looking for",
                    type: 3,
                    required: true
                },
                {
                    name: "card-offer",
                    description: "Enter the precure card id that you will send",
                    type: 3,
                    required: true
                },
            ]
        },
        {//search for card listing
            name: "search-card",
            description: "Search the open listing from tradeboard",
            type: 1,
            options: [
                {
                    name: "id-card",
                    description: "Enter the precure card id that you're looking for",
                    type: 3,
                    required: true
                },
            ]
        },
        {//trade
            name: "trade",
            description: "Prompt to trade with the selected trade list id",
            type: 1,
            options: [
                {
                    name: "list-id",
                    description: "Enter the trade list id that you want to trade with",
                    type: 3,
                    required: true
                },
            ]
        },
        {//open listing
            name: "list",
            description: "Open your tradeboard listing",
            type: 1
        },
        {//remove from listing
            name: "remove",
            description: "Remove your posted trade listing",
            type: 1,
            options: [
                {
                    name: "list-id",
                    description: "Enter the trade list id that you want to remove",
                    type: 3,
                    required: true
                },
            ]
        },
    ], async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        var tradeboard = new TradeboardListener(interaction, await User.getData(userId));

        switch(subcommand){
            case "post":{
                return await tradeboard.post();
                break;
            }
            case "search-card":{
                return await tradeboard.searchCard();
                break;
            }
            case "list":{
                return await tradeboard.listing();
                break;
            }
            case "remove":{
                return await tradeboard.remove();
                break;
            }
            case "trade":{
                return await tradeboard.trade();
                break;
            }
        }

    }
}
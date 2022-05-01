const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const {Party} = require("../modules/puzzlun/data/Party");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const Embed = require('../modules/puzzlun/Embed');
const {AvatarFormation, PrecureAvatar} = require('../modules/puzzlun/Data/Avatar');
const {PartyListener} = require('../modules/puzzlun/Party');

module.exports = {
    name: 'party',
    cooldown: 5,
    description: 'Contains all party command',
    args: true,
    options:[
        {//create party
            name: "create",
            description: "Create party",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter unique name for your party",
                    type: 3,
                    required: true
                }
            ]
        },
        {//join into party
            name: "join",
            description: "Join existing party",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter the spesific party name",
                    type: 3,
                    required: true
                }
            ]
        },
        {//rename party
            name: "rename",
            description: "Rename your party name",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter new unique party name",
                    type: 3,
                    required: true
                }
            ]
        },
        {//leave from party
            name: "leave",
            description: "Leave your party/disband if you are leader",
            type: 1
        },
        {//open party status
            name: "status",
            description: "Open party status menu",
            type: 1
        },
        {//party list
            name: "list",
            description: "Open party list menu",
            type: 1
        },
    ],
    async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        var party = new PartyListener(interaction);

        switch(subcommand){
            case "create":{
                await party.create();
                break;
            }
            case "join":{
                await party.joinParty();
                break;
            }
            case "rename":{
                await party.renameParty();
                break;
            }
            case "leave":{
                await party.leave();
                break;
            }
            case "status":{
                await party.status();
                break;
            }
            case "list":{
                await party.partyList();
                break;
            }
        }
    }
}
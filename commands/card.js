const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const paginationEmbed = require('../modules/DiscordPagination');

// const DataModule = require("../modules/puzzlun/Data");
// const Avatar = require("../modules/puzzlun/Avatar");
// const UserModule = require("../modules/puzzlun/User");
// const GuildModule = require("../modules/puzzlun/Guild");
// const BattleModule = require("../modules/puzzlun/Battle");
// const InstanceBattle = require("../modules/puzzlun/InstanceBattle");
// const Spawner = require("../modules/puzzlun/Spawner");
const Validation = require("../modules/puzzlun/Validation");
const {Spawner, SpawnerListener} = require("../modules/puzzlun/data/Spawner");
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const Embed = require("../modules/puzzlun/Embed");
// const SpawnerEventListener = SpawnerModule.EventListener;
const {AvatarFormation} = require('../modules/puzzlun/data/Avatar');
const UserListener = require("../modules/puzzlun/User");
const {CardListener} = require("../modules/puzzlun/Card");

module.exports = {
    name: 'card',
    cooldown: 5,
    description: 'Contains all card command',
    args: true,
    options:[
        {//status
            name: "status",
            description: "Open card status menu.",
            type: 1,
            options: [
                {
                    name: "username",
                    description: "Enter username to view card status from other user.",
                    type: 3,
                    required:false
                }
            ]
        },
        {//inventory
            name: "inventory",
            description: "Open card inventory menu.",
            type: 1,
            options: [
                {
                    name: "card-pack",
                    description: "Enter the card pack. Example: nagisa",
                    type: 3,
                    required:true
                },
                {
                    name: "username",
                    description: "Enter username to view card inventory from other user.",
                    type: 3
                },
                {
                    name: "filter-duplicate",
                    description: "Filter card inventory with duplicate card only",
                    type: 5
                },
                {
                    name: "display-style",
                    description: "Select the displaying style (Default: full)",
                    type: 3,
                    required:false,
                    choices:[
                        {
                            name:`Compact (without status)`,
                            value:CardListener.viewStyle.compact
                        },
                        {
                            name:`Full (with status)`,
                            value:CardListener.viewStyle.full
                        },
                    ]
                },
            ]
        },
        {//detail
            name:"detail",
            description: "Check your precure card detail",
            type:1,
            options: [
                {
                    name: "card-id",
                    description: "Enter the card id",
                    type: 3,
                    required: true
                },
                {
                    name: "visible-private",
                    description: "Set the henshin notification to be shown privately (Default: false)",
                    type: 5
                },
            ]
        },
        {//upgrade
            name:"upgrade",
            description: "Card upgrade command",
            type: 2,
            options:[
                {//color level
                    name: "color-level",
                    description: "Upgrade your color level",
                    type: 1,
                    options: [
                        {
                            name: "selection",
                            description: "Choose the color selection that you want to level up",
                            type: 3,
                            required: true,
                            choices:[
                                {
                                    name:"pink",
                                    value:"pink"
                                },
                                {
                                    name:"blue",
                                    value:"blue"
                                },
                                {
                                    name:"red",
                                    value:"red"
                                },
                                {
                                    name:"yellow",
                                    value:"yellow"
                                },
                                {
                                    name:"green",
                                    value:"green"
                                },
                                {
                                    name:"purple",
                                    value:"purple"
                                },
                                {
                                    name:"white",
                                    value:"white"
                                },
                            ]
                        }
                    ]
                },
                {//card level
                    name: "card-level",
                    description: "Upgrade level of precure card",
                    type: 1,
                    options:[
                        {
                            name: "card-id",
                            description: "Enter the precure card id that you want to level up",
                            type: 3,
                            required: true,
                        },
                        {
                            name: "amount",
                            description: "Enter the amount of level up (default: 1, max: 10)",
                            type: 4,
                            required: false,
                        },
                    ]
                },
                {//card special level
                    name: "card-special-level",
                    description: "Upgrade special level of precure card",
                    type: 1,
                    options:[
                        {
                            name: "card-id",
                            description: "Enter the precure card id that you want to level up",
                            type: 3,
                            required: true,
                        },
                        {
                            name: "amount",
                            description: "Enter the amount of level up (default: 1, max: 9)",
                            type: 4,
                            required: false,
                        },
                    ]
                },
                {//upgrade to gold card
                    name: "gold",
                    description: "Upgrade into gold card using duplicates & fragment",
                    type: 1,
                    options:[
                        {
                            name: "card-id",
                            description: "Enter the precure card id that you want to upgrade",
                            type: 3,
                            required: true,
                        }
                    ]
                },
            ]
        },
        {//timer spawn
            name: "timer-spawn",
            description: "View spawner timer.",
            type: 1,
        },
        // {//unset precure avatar
        //     name:"unset-avatar",
        //     description: "Unset precure avatar",
        //     type: 1,
        //     options: [
        //         {
        //             name: "formation",
        //             description: "Choose the color selection that you want to level up",
        //             type: 3,
        //             required: true,
        //             choices:[
        //                 {
        //                     name:`all`,
        //                     value:`all`
        //                 },
        //                 {
        //                     name:`${AvatarFormation.formation.main.name}`,
        //                     value:`${AvatarFormation.formation.main.value}`
        //                 },
        //                 {
        //                     name:`${AvatarFormation.formation.support1.name}`,
        //                     value:`${AvatarFormation.formation.support1.value}`
        //                 },
        //                 {
        //                     name:`${AvatarFormation.formation.support2.name}`,
        //                     value:`${AvatarFormation.formation.support2.value}`
        //                 },
        //             ]
        //         }
        //     ]
        // },
        {//convert
            name:"convert-card",
            description: "Convert your precure card into various rewards",
            type:1,
            options: [
                {
                    name: "card-id",
                    description: "Enter the precure card that you want to convert",
                    type: 3,
                    required: true
                },
                {
                    name: "amount",
                    description: "Enter the amount of card that you want to convert (default: 1, max:10)",
                    type: 4,
                    required: false,
                },
            ]
        },
	],

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(command){
            case "upgrade": {//upgrade command
                switch(commandSubcommand){
                    case "color-level":{//upgrade color level
                        let userListener = new UserListener(interaction);
                        await userListener.levelUpColor();
                        break;
                    }
                    case "card-level":{//upgrade card level
                        let cardListener = new CardListener(interaction);
                        await cardListener.levelUp();
                        break;
                    }
                    case "card-special-level":{
                        let cardListener = new CardListener(interaction);
                        await cardListener.levelUpSpecial();
                        break;
                    }
                    case "gold":{
                        let cardListener = new CardListener(interaction);
                        await cardListener.upgradeGold();
                        break;
                    }
                }
                break;
            }
        }

        if(command!==null) return;

        switch(commandSubcommand){
            case "status":{//print user status
                let userListener = new UserListener(interaction);
                return await userListener.status();
                break;
            }
            case "detail":{//print card detail
                var cardListener = new CardListener(interaction);
                return await cardListener.detail();
                break;
            }
            case "inventory":{//print card inventory
                var cardListener = new CardListener(interaction);
                await cardListener.inventory();
                break;
            }
            case "unset-avatar":{//unset precure avatar
                var userListener = new UserListener(interaction);
                await userListener.unsetAvatar();
                break;
            }
            case "convert-card":{
                let cardListener = new CardListener(interaction);
                await cardListener.convert();
                break;
            }
            case "timer-spawn": {//spawner timer
                var spawner = new SpawnerListener(interaction);
                spawner.getTimer();
                break;
            }
        }
    },

    async executeComponentButton(interaction){

        var captureListener = new SpawnerListener(interaction);
        await captureListener.onClick();

    },
    async executeComponentSelectMenu(interaction){
        

        var captureListener = new SpawnerListener(interaction);
        await captureListener.onSelect();

    }
}
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
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
const SpawnerModule = require("../modules/puzzlun/data/Spawner");
const Spawner = SpawnerModule.Spawner;
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const Embed = require("../modules/puzzlun/Embed");
// const SpawnerEventListener = SpawnerModule.EventListener;
const {AvatarFormation} = require('../modules/puzzlun/Data/Avatar');
const UserListener = require("../modules/puzzlun/listener/User");
const CardListener = require("../modules/puzzlun/listener/Card");

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
                }
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
                {
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
                {
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
                            description: "Enter the amount of level up (default: 1, max: 50)",
                            type: 4,
                            required: false,
                        },
                    ]
                },
                {
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
                }
            ]
        },
        {//unset precure avatar
            name:"unset-avatar",
            description: "Unset precure avatar",
            type: 1,
            options: [
                {
                    name: "formation",
                    description: "Choose the color selection that you want to level up",
                    type: 3,
                    required: true,
                    choices:[
                        {
                            name:`all`,
                            value:`all`
                        },
                        {
                            name:`${AvatarFormation.formation.main.name}`,
                            value:`${AvatarFormation.formation.main.value}`
                        },
                        {
                            name:`${AvatarFormation.formation.support1.name}`,
                            value:`${AvatarFormation.formation.support1.value}`
                        },
                        {
                            name:`${AvatarFormation.formation.support2.name}`,
                            value:`${AvatarFormation.formation.support2.value}`
                        },
                    ]
                }
            ]
        }
	],

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(command){
            case "upgrade"://upgrade command
                switch(commandSubcommand){
                    case "color-level":{//upgrade color level
                        let userListener = new UserListener(userId, discordUser, interaction);
                        await userListener.levelUpColor();
                        break;
                    }
                    case "card-level":{//upgrade card level
                        let cardId = interaction.options.getString("card-id");
                        let amount = interaction.options.getInteger("amount")!==null?
                        interaction.options.getInteger("amount"):1;
                        let cardListener = new CardListener(userId, discordUser, interaction);
                        await cardListener.levelUp(cardId, amount);
                        break;
                    }
                    case "card-special-level":{
                        let cardId = interaction.options.getString("card-id");
                        let amount = interaction.options.getInteger("amount")!==null?
                        interaction.options.getInteger("amount"):1;
                        let cardListener = new CardListener(userId, discordUser, interaction);
                        await cardListener.levelUpSpecial(cardId, amount);
                        break;
                    }
                }
                break;
        }

        if(command!==null) return;

        switch(commandSubcommand){
            case "status": {//print user status
                var username = interaction.options.getString("username");
                
                var userSearchResult = await Validation.User.isAvailable(discordUser, username, interaction);
                if(!userSearchResult) return; else discordUser = userSearchResult;

                let userListener = new UserListener(userId, discordUser, interaction);
                return await userListener.status(username==null?true:false);
                break;
            }
            case "detail":{//print card detail
                var cardId = interaction.options.getString("card-id");
                var isPrivate = interaction.options.getBoolean("visible-private") !== null? 
                interaction.options.getBoolean("visible-private"):false;
                var cardListener = new CardListener(userId, discordUser, interaction);
                return await cardListener.detail(cardId, isPrivate);
                break;
            }
            case "inventory":{//print card inventory
                var pack = interaction.options.getString("card-pack");
                var parameterUsername = interaction.options.getString("username");
                var duplicateOnly = interaction.options.getBoolean("filter-duplicate")!==null ? 
                interaction.options.getBoolean("filter-duplicate"):false;


                var userSearchResult = await Validation.User.isAvailable(discordUser, parameterUsername, interaction);
                if(!userSearchResult) return; else discordUser = userSearchResult;

                var cardListener = new CardListener(userId, discordUser, interaction);
                return await cardListener.inventory(pack, parameterUsername==null?true:false, duplicateOnly);
                break;
            }
            case "unset-avatar":{//unset precure avatar
                let formation = interaction.options.getString("formation");
                var userListener = new UserListener(userId, discordUser, interaction);
                await userListener.unsetAvatar(formation);
                break;
            }
        }
    },

    async executeComponentButton(interaction){
        var command = interaction.command;
        var customId = interaction.customId;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        //check for user login
        // var loginCheck = await UserModule.isLogin(objUserData,guildId);
        // if(loginCheck!=true){
        //     return interaction.reply(loginCheck);//return error message
        // }

        await Spawner.eventListenerButton(discordUser, guildId, customId, interaction);

        switch(customId){
            // case Spawner.buttonId.catch_boost:
            //     var ret = await Spawner.onCardCaptureNormal(discordUser, guildId);
            //     return interaction.reply(ret);
            //     break;
            // case "catch_boost":
            //     var ret = await CardModule.EventListener.captureNormal(objUserData, guildId, true);
            //     return interaction.reply(ret);
            //     break;
            // case "catch_color":
            //     var ret = await CardModule.EventListener.captureColor(objUserData, guildId, false);
            //     return interaction.reply(ret);
            //     break;
            // case "catch_color_boost":
            //     var ret = await CardModule.EventListener.captureColor(objUserData, guildId, true);
            //     return interaction.reply(ret);
            //     break;
            // case "catch_series":
            //     var ret = await Spawner.EventListener.captureSeries(objUserData, guildId, false);
            //     return interaction.reply(ret);
            //     break;
            // case "catch_series_boost":
            //     var ret = await CardModule.EventListener.captureSeries(objUserData, guildId, true);
            //     return interaction.reply(ret);
            //     break;
            // //jankenpon:
            // case "jankenpon_rock":
            // case "jankenpon_paper":
            // case "jankenpon_scissors":
            //     var ret = await CardModule.EventListener.captureJankenpon(objUserData, guildId, customId.split("_")[1]);
            //     return interaction.reply(ret);
            //     break;
            // //number
            // case "number_lower":
            // case "number_higher":
            //     var ret = await CardModule.EventListener.captureNumber(objUserData, guildId, customId.split("_")[1]);
            //     return interaction.reply(ret);
            //     break;
        }

        //BATTLE COMMANDS
        // if(customId.includes("battle_scanInfo_")){
        //     var ret = await BattleModule.EventListener.scanBattleInfoTsunagarus(objUserData, guildId, interaction, customId);
        //     return ret;
        // }

    },
    async executeComponentSelectMenu(interaction){
        var customId = interaction.customId;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        
        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }

        await Spawner.eventListenerSelect(discordUser, guildId, customId, interaction);
        //check for user login
        // var loginCheck = await UserModule.isLogin(objUserData,guildId);
        // if(loginCheck!=true){
        //     await interaction.update({ components: interaction.components });
        //     return interaction.followUp(loginCheck);//return error message
        // }

        // switch(customId){
        //     case "act_mini_tsunagarus":
        //         var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.mini_tsunagarus);
        //         return interaction.reply(ret);
        //         break;
        //     case "act_suite_notes_count":
        //         var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.suite_notes_count);
        //         return interaction.reply(ret);
        //         break;
        //     case "act_star_twinkle_constellation":
        //         var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.star_twinkle_constellation);
        //         return interaction.reply(ret);
        //         break;
        //     case "act_star_twinkle_counting":
        //         var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.star_twinkle_counting);
        //         return interaction.reply(ret);
        //         break;
        //     case "quiz_answer":
        //         var ret = await CardModule.EventListener.captureQuiz(objUserData, guildId, interaction.values[0]);
        //         return interaction.reply(ret);
        //         break;
        //     case "battle_join_chokkins":
        //         var ret = await BattleModule.EventListener.joinChokkins(objUserData, guildId, BattleModule.Enemy.tsunagarus.chokkins.value , interaction.values[0],interaction);
        //         return ret;
        //         break;
        //     case "battle_command_chokkins":
        //         console.log(interaction.values[0]);
        //         break;
        // }

        // //BATTLE COMMANDS
        // if(customId.includes("battle_join_")){
        //     var ret = await BattleModule.EventListener.joinSolo(guildId, objUserData, interaction, customId, interaction.values[0]);
        //     return ret;
        // }

    }
}
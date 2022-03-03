const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, User} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');

const paginationEmbed = require('../modules/DiscordPagination');

const DataModule = require("../modules/card/Data");
const CardModule = require("../modules/card/Card");
const Avatar = require("../modules/card/Avatar");
const UserModule = require("../modules/card/User");
// const GuildModule = require("../modules/card/Guild");
const BattleModule = require("../modules/card/Battle");
// const InstanceBattle = require("../modules/card/InstanceBattle");
// const Spawner = require("../modules/card/Spawner");
const Validation = require("../modules/card/Validation");

module.exports = {
    name: 'card',
    cooldown: 5,
    description: 'Contains all card command',
    args: true,
    options:[
        {
            name: "status",
            description: "Open card status menu.",
            type: 2,
            options: [
                {
                    name: "open-status-menu",
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
                }
            ]
        },
        {
            name: "inventory",
            description: "Open card inventory menu.",
            type: 2,
            options: [
                {
                    name: "open-menu",
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
                        }
                    ]
                }
            ]
        },
        {
            name:"set",
            description: "Set your precure card as avatar",
            type: 2,
            options:[
                {
                    name: "avatar",
                    description: "Set your precure card avatar",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter precure card id",
                            type: 3,
                            required: true
                        },
                        {
                            name: "formation",
                            description: "Select the formation (Default:Main)",
                            type: 3,
                            choices:[
                                {
                                    name:`Main`,
                                    value:`id_main`
                                },
                                {
                                    name:`Support 1`,
                                    value:`id_support1`
                                },
                                {
                                    name:`Support 2`,
                                    value:`id_support2`
                                },
                            ]
                        },
                        {
                            name: "visible-public",
                            description: "Set the henshin notification to be shown on public (Default: false)",
                            type: 5
                        },
                    ]
                },
            ]
        },
        {
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
                    name: "visible-public",
                    description: "Set the henshin notification to be shown on public (Default: false)",
                    type: 5
                },
            ]
        }
	],

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var userDiscord = interaction.user;
        var userId = userDiscord.id;

        switch(command){
            //STATUS MENU: open card status
            case "status":
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(0) ? 
                interaction.options._hoistedOptions[0].value : null;
                
                var userSearchResult = await Validation.userAvailable(userDiscord, parameterUsername, interaction);
                if(!userSearchResult) return; else userDiscord = userSearchResult;
                
                var arrPages = await UserModule.EventListener.printStatus(userDiscord, guildId);
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, parameterUsername==null?true:false);
                break;
            case "inventory":
                var pack = interaction.options._hoistedOptions[0].value;
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : null;

                var userSearchResult = await UserModule.checkAvailable(userDiscord, parameterUsername, interaction);
                if(!userSearchResult) return; else userDiscord = userSearchResult;

                var arrPages = await UserModule.Card.printInventory(userDiscord, pack, interaction);
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, parameterUsername==null?true:false);
                break;
            case "set":
                switch(commandSubcommand){
                    case "avatar":
                        var idCard = interaction.options._hoistedOptions[0].value.toLowerCase();
                        
                        var formation = interaction.options._hoistedOptions.hasOwnProperty(1)?
                        interaction.options._hoistedOptions[1].value.toLowerCase():"id_main";
                        var isPrivate = interaction.options._hoistedOptions.hasOwnProperty(2) ? 
                        interaction.options._hoistedOptions[2].value:true;

                        await Avatar.EventListener.set(userDiscord, idCard, formation, interaction, isPrivate);

                        break;
                }
                break;
        }

        if(command!==null) return;

        switch(commandSubcommand){
            case "detail":
                var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();
                var isPrivate = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value:true;
                return await UserModule.Card.printDetail(userDiscord, cardId, interaction, isPrivate);
                break;
        }

        // var objSpawn = await CardModule.Spawner.spawnNormal(guildId);
        // await interaction.reply({embeds:[objSpawn.embed],components:objSpawn.components});

        // switch(command){
        //     //STATUS MENU: open card status
        //     case "test":
        //         await interaction.reply("ok");
        //         break;
        // }
    },

    async executeComponentButton(interaction){
        var command = interaction.command;
        var customId = interaction.customId;
        const guildId = interaction.guild.id;

        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }

        //check for user login
        var loginCheck = await UserModule.isLogin(objUserData,guildId);
        if(loginCheck!=true){
            return interaction.reply(loginCheck);//return error message
        }

        switch(customId){
            case "catch_normal":
                var ret = await CardModule.EventListener.captureNormal(objUserData, guildId, false);
                return interaction.reply(ret);
                break;
            case "catch_boost":
                var ret = await CardModule.EventListener.captureNormal(objUserData, guildId, true);
                return interaction.reply(ret);
                break;
            case "catch_color":
                var ret = await CardModule.EventListener.captureColor(objUserData, guildId, false);
                return interaction.reply(ret);
                break;
            case "catch_color_boost":
                var ret = await CardModule.EventListener.captureColor(objUserData, guildId, true);
                return interaction.reply(ret);
                break;
            case "catch_series":
                var ret = await Spawner.EventListener.captureSeries(objUserData, guildId, false);
                return interaction.reply(ret);
                break;
            case "catch_series_boost":
                var ret = await CardModule.EventListener.captureSeries(objUserData, guildId, true);
                return interaction.reply(ret);
                break;
            //jankenpon:
            case "jankenpon_rock":
            case "jankenpon_paper":
            case "jankenpon_scissors":
                var ret = await CardModule.EventListener.captureJankenpon(objUserData, guildId, customId.split("_")[1]);
                return interaction.reply(ret);
                break;
            //number
            case "number_lower":
            case "number_higher":
                var ret = await CardModule.EventListener.captureNumber(objUserData, guildId, customId.split("_")[1]);
                return interaction.reply(ret);
                break;
        }

        //BATTLE COMMANDS
        if(customId.includes("battle_scanInfo_")){
            var ret = await BattleModule.EventListener.scanBattleInfoTsunagarus(objUserData, guildId, interaction, customId);
            return ret;
        }

    },
    async executeComponentSelectMenu(interaction){
        var customId = interaction.customId;
        const guildId = interaction.guild.id;
        
        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }

        //check for user login
        var loginCheck = await UserModule.isLogin(objUserData,guildId);
        if(loginCheck!=true){
            await interaction.update({ components: interaction.components });
            return interaction.followUp(loginCheck);//return error message
        }

        switch(customId){
            case "act_mini_tsunagarus":
                var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.mini_tsunagarus);
                return interaction.reply(ret);
                break;
            case "act_suite_notes_count":
                var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.suite_notes_count);
                return interaction.reply(ret);
                break;
            case "act_star_twinkle_constellation":
                var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.star_twinkle_constellation);
                return interaction.reply(ret);
                break;
            case "act_star_twinkle_counting":
                var ret = await CardModule.EventListener.captureCheckActAnswer(objUserData, guildId, interaction.values[0],CardModule.Spawner.spawnDataType.act.dataKey.typeVal.star_twinkle_counting);
                return interaction.reply(ret);
                break;
            case "quiz_answer":
                var ret = await CardModule.EventListener.captureQuiz(objUserData, guildId, interaction.values[0]);
                return interaction.reply(ret);
                break;
            case "battle_join_chokkins":
                var ret = await BattleModule.EventListener.joinChokkins(objUserData, guildId, BattleModule.Enemy.tsunagarus.chokkins.value , interaction.values[0],interaction);
                return ret;
                break;
            case "battle_command_chokkins":
                console.log(interaction.values[0]);
                break;
        }

        //BATTLE COMMANDS
        if(customId.includes("battle_join_")){
            var ret = await BattleModule.EventListener.joinSolo(guildId, objUserData, interaction, customId, interaction.values[0]);
            return ret;
        }

    }
}
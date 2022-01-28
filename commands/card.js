const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');

const paginationEmbed = require('discordjs-button-pagination');

const CardModule = require("../modules/card/Card");
const UserModule = require("../modules/card/User");
const GuildModule = require("../modules/card/Guild");

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
        }
	],

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }

        switch(command){
            //STATUS MENU: open card status
            case "status":
                var memberExists = true;
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(0) ? 
                interaction.options._hoistedOptions[0].value : null;

                if(parameterUsername!=null){
                    await interaction.guild.members.fetch({query:`${parameterUsername}`,limit:1})
                    .then(
                        async members=> {
                            if(members.size>=1){

                                userId = members.first().user.id;
                                objEmbed.author = {
                                    name:members.first().user.username,
                                    icon_url:members.first().user.avatarURL()
                                }
                                
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                } else if(!memberExists){
                    objEmbed.title = "Cannot find that user";
                    objEmbed.description = ":x: I can't find that username, please re-enter with specific username.";
                    objEmbed.thumbnail = {url:CardModule.Properties.imgMofu.imgError};
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                var arrPages = await UserModule.EventListener.printStatus(objUserData);
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                break;
            case "inventory":
                var pack = interaction.options._hoistedOptions[0].value;
                var memberExists = true;
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : null;

                if(parameterUsername!=null){
                    await interaction.guild.members.fetch({query:`${parameterUsername}`,limit:1})
                    .then(
                        async members=> {
                            if(members.size>=1){

                                userId = members.first().user.id;
                                objEmbed.author = {
                                    name:members.first().user.username,
                                    icon_url:members.first().user.avatarURL()
                                }
                                
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                } else if(!memberExists){
                    objEmbed.title = "Cannot find that user";
                    objEmbed.description = ":x: I can't find that username, please re-enter with specific username.";
                    objEmbed.thumbnail = {url:CardModule.Properties.imgMofu.imgError};
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                var arrPages = await UserModule.EventListener.printInventory(objUserData, pack, interaction);
                return arrPages;
                // paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
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
                var ret = await CardModule.EventListener.captureSeries(objUserData, guildId, false);
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
            return interaction.reply(loginCheck);//return error message
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
        }

    }
}
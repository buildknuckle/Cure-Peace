const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const ItemModule = require('../../modules/Item');
const CardGuildModule = require('../../modules/CardGuild');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const TsunagarusModules = require('../../modules/Tsunagarus');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../../database/model/DBM_Card_Leaderboard');
const DBM_Card_Tradeboard = require('../../database/model/DBM_Card_Tradeboard');
const DBM_Card_Enemies = require('../../database/model/DBM_Card_Enemies');
const DBM_Item_Inventory = require('../../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const DBM_Card_Party = require('../../database/model/DBM_Card_Party');

module.exports = {
    name: 'verify',
    cooldown: 5,
    description: 'Contains card verification commmand',
    args: true,
    options:[{
        name: "card-color-completion",
        description: "Verify for color card completion",
        type: 1
    },
    {
        name: "card-pack-completion",
        description: "Verify for card pack completion",
        type: 1,
        options: [
            {
                name: "pack-name",
                description: "Enter the pack name that want to get verified. Example: nagisa",
                type: 3,
                required:true
            }
        ]
    },
    {
        name: "card-series-completion",
        description: "Verify for card series completion",
        type: 1
    }],
	async executeMessage(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();
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

        var arrEmbedsSend = [];

        switch(commandSubcommand){
            case "card-color-completion":
                await interaction.deferReply();

                var txtCompletionVerifyValue = "";
                var txtCompletionVerifyValueGold = "";

                for(var i=0;i<CardModule.Properties.arrColor.length;i++){
                    var verifyValue = CardModule.Properties.arrColor[i];
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",verifyValue);
                    if(checkCardCompletionColor){
                        txtCompletionVerifyValue+=`${verifyValue},`;
                        await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color",verifyValue);
                    }

                    var checkCardCompletionColorGold = await CardModule.checkCardCompletion(guildId,userId,"color_gold",verifyValue);
                    if(checkCardCompletionColorGold){
                        txtCompletionVerifyValueGold+=`${verifyValue},`;
                        await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color_gold",verifyValue);
                    }
                }

                txtCompletionVerifyValue = txtCompletionVerifyValue.replace(/,\s*$/, "");
                txtCompletionVerifyValueGold = txtCompletionVerifyValueGold.replace(/,\s*$/, "");

                if(txtCompletionVerifyValue!=""){
                    objEmbed.thumbnail = {
                        url:userAvatarUrl
                    };
                    objEmbed.title = `Card Color Verification`;
                    objEmbed.description = `<@${userId}> has become the new master of cure: **${txtCompletionVerifyValue}**`;
                    objEmbed.footer = {
                        iconURL:userAvatarUrl,
                        text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                    };
                    arrEmbedsSend.push(new MessageEmbed(objEmbed));
                    // await interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                }

                if(txtCompletionVerifyValueGold!=""){
                    objEmbed.thumbnail = {
                        url:userAvatarUrl
                    };
                    objEmbed.color = CardModule.Properties.cardCategory.gold.color;
                    objEmbed.title = `Gold Card Color Verification`;
                    objEmbed.description = `✨<@${userId}> has become the new master of gold cure: **${txtCompletionVerifyValueGold}**`;
                    objEmbed.footer = {
                        iconURL:userAvatarUrl,
                        text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                    };
                    arrEmbedsSend.push(new MessageEmbed(objEmbed));
                    // await interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                }
                
                arrEmbedsSend.push(new MessageEmbed({
                    color: CardModule.Properties.embedColor,
                    title: `Color Card Verification`,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    },
                    description: `:white_check_mark: Your color card has been verified for the completion.`
                }));

                await interaction.editReply({embeds:arrEmbedsSend});
                break;
            case "card-pack-completion":
                //validation if pack exists/not

                var verifyValue = interaction.options._hoistedOptions[0].value;
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_Data.columns.pack,verifyValue);
                var checkData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
                checkData = checkData[0][0];
                if(checkData==null)
                    return await interaction.reply({embeds:[new MessageEmbed(CardModule.Embeds.embedCardPackNotFound())],ephemeral:true});

                await interaction.deferReply();

                var query = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.color}  
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.pack}=? 
                LIMIT 1`;
                var cardData = await DBConn.conn.promise().query(query, [verifyValue]);
                cardData = cardData[0][0];

                var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",verifyValue);
                var checkCardCompletionPackGold = await CardModule.checkCardCompletion(guildId,userId,"pack_gold",verifyValue);

                if(checkCardCompletionPack){
                    //card pack completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack",cardData[DBM_Card_Data.columns.pack]);
                    if(embedCompletion!=null)
                        arrEmbedsSend.push(new MessageEmbed(embedCompletion));
                }

                if(checkCardCompletionPackGold){
                    //card pack completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                    if(embedCompletion!=null)
                        arrEmbedsSend.push(new MessageEmbed(embedCompletion));
                }

                arrEmbedsSend.push(new MessageEmbed({
                    color: CardModule.Properties.embedColor,
                    title: `Card Pack Verification: ${GlobalFunctions.capitalize(verifyValue)}`,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    },
                    description: `:white_check_mark: Your card pack: **${GlobalFunctions.capitalize(verifyValue)}** has been verified for the completion.`
                }));

                await interaction.editReply({embeds:arrEmbedsSend});
                break;
            case "card-series-completion":
                await interaction.deferReply();

                var txtCompletionVerifyValue = "",
                txtCompletionVerifyValueGold = "";
                for(var i=0;i<CardModule.Properties.seriesCardCore.arrSeriesName.length;i++){
                    var verifyValue = CardModule.Properties.seriesCardCore.arrSeriesName[i];
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"series",verifyValue);
                    
                    if(checkCardCompletionPack){
                        txtCompletionVerifyValue+=`>${verifyValue}\n`;
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",verifyValue);
                    }

                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"series_gold",verifyValue);
                    if(checkCardCompletionPack){
                        txtCompletionVerifyValueGold+=`>${verifyValue}\n`;
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series_gold",verifyValue);
                    }
                }

                if(txtCompletionVerifyValue!=""){
                    objEmbed.thumbnail = {
                        url:userAvatarUrl
                    };
                    objEmbed.title = `Card Series Verification`;
                    objEmbed.description = `<@${userId}> has completed the card series:\n${txtCompletionVerifyValue}`;
                    objEmbed.footer = {
                        iconURL:userAvatarUrl,
                        text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                    };
                    arrEmbedsSend.push(new MessageEmbed(objEmbed));
                }

                if(txtCompletionVerifyValueGold!=""){
                    objEmbed.color = CardModule.Properties.cardCategory.gold.color;
                    objEmbed.thumbnail = {
                        url:userAvatarUrl
                    };
                    objEmbed.title = `Gold Card Series Verification`;
                    objEmbed.description = `✨<@${userId}> has completed the gold card series:\n${txtCompletionVerifyValueGold}`;
                    objEmbed.footer = {
                        iconURL:userAvatarUrl,
                        text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                    };
                    arrEmbedsSend.push(new MessageEmbed(objEmbed));
                }

                arrEmbedsSend.push(new MessageEmbed({
                    color: CardModule.Properties.embedColor,
                    title: `Card Series Verification`,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    },
                    description: `:white_check_mark: Your card series has been verified for the completion.`
                }));

                await interaction.editReply({embeds:arrEmbedsSend});
                break;
        }


    }
}
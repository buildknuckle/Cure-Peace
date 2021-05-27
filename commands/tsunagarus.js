const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');
const DBM_Card_Tradeboard = require('../database/model/DBM_Card_Tradeboard');
const DBM_Card_Enemies = require('../database/model/DBM_Card_Enemies');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Card_Party = require('../database/model/DBM_Card_Party');

module.exports = {
    name: 'tsunagarus',
    cooldown: 5,
    description: 'Contains all tsunagarus categories',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        // var members = message.guild.members;
        switch(args[0]) {
            case "greeting":

                break;
            case "summon":
                if(userId!=145584315839938561){
                    return;
                }

                //for card spawn debug purpose
                var cardSpawnData = await CardModule.generateCardSpawn(guildId,"battle",true,);
                var msgObject = null;
                if("isPaging" in cardSpawnData){
                    msgObject = await paginationEmbed(message,[cardSpawnData]);
                } else {
                    msgObject = await message.channel.send({embed:cardSpawnData});
                }

                await CardModule.updateMessageIdSpawn(guildId,msgObject.id);

                break;
            
            case "leveldown":
                
                break;

            default:
                break;
            
        }
	},
};
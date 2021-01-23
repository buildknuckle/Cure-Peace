const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Command to get daily color point. Can only be used within 24 hours server time.',
	async execute(message, args) {
		const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();
        //check for optional color if provided
        var optionalColor = args[0];
        if(optionalColor!=null){
            optionalColor = optionalColor.toLowerCase();
            if(!CardModule.Properties.arrColor.includes(optionalColor)){
                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    thumbnail : {
                        url: CardModule.Properties.imgResponse.imgError
                    },
                    description : ":x: Please enter the correct daily color command with:  **p!color daily** or **p!color daily <pink/purple/green/yellow/white/blue/red>**."
                };
                return message.channel.send({embed:objEmbed});
            }
        }

        //validate & check if user have do the daily today/not
        var dateToken = new Date().getDate();
        var userCardData = await CardModule.getCardUserStatusData(userId);
        if(userCardData[DBM_Card_User_Data.columns.daily_last]==dateToken){
            var midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            var timeRemaining = ( midnight.getTime() - new Date().getTime() ) / 1000 / 60;
            var num = timeRemaining;
            var hours = (num / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            timeRemaining = rhours + " hour(s) and " + rminutes + " more minute(s)";

            var objEmbed = {
                color: CardModule.Properties.embedColor,
                thumbnail : {
                    url: CardModule.Properties.imgResponse.imgError
                },
                description : `:x: Sorry, you have receive the daily point today. Please wait for **${timeRemaining}** until the next daily reset time.`
            };

            return message.channel.send({embed:objEmbed});
        }

        var objEmbed = {
            color: CardModule.Properties.embedColor,
            thumbnail : {
                url: CardModule.Properties.imgResponse.imgOk
            },
        };

        var query = "";
        var colorPoint = (Math.floor(Math.random() * 20) + 5);
        var arrParameterized = [];
        if(optionalColor!=null){
            //double the color point
            colorPoint*=2; 
            query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
            SET ${DBM_Card_User_Data.columns.daily_last} = ?, color_point_${optionalColor} = ?
            WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
            arrParameterized = [dateToken,colorPoint,userId];
            objEmbed.description = `<@${userId}> have received ** ${colorPoint} ${optionalColor} color point ** from the daily command.`;
        } else {
            query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
            SET ${DBM_Card_User_Data.columns.daily_last} = ?, 
            ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${colorPoint} 
            WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
            arrParameterized = [dateToken,userId];
            objEmbed.description = `<@${userId}> have received ** ${colorPoint} overall color point ** from the daily command.`;
        }

        //update the token & color point data
        await DBConn.conn.promise().query(query, arrParameterized);

        return message.channel.send({embed:objEmbed});
	},
};
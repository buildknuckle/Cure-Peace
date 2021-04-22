const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const BioModule = require('../modules/Bio');

module.exports = {
    name: 'bio',
    cooldown: 5,
    description: 'Contains all card categories',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        // var members = message.guild.members;
        var packName = args.join(' ');

        if(packName==null){
            objEmbed.thumbnail = {
                url:CardModule.Properties.imgResponse.imgError
            }
            objEmbed.description = ":x: Please enter the name that you want to see for the profile.";
            return message.channel.send({embed:objEmbed});
        } else if(!BioModule.Properties.bioDataCore.hasOwnProperty(packName.toLowerCase())){
            return message.channel.send({
                content:"Sorry, I cannot search that name. Here are the list of bio that you can search:",
                embed:CardModule.embedCardPackList});
        }

        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = BioModule.Properties.bioDataCore[packName].transform_quotes;
        var imgTransformation = BioModule.Properties.bioDataCore[packName].icon;//default transformation image
        
        //get card data:
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Data.columns.pack,packName);
        var cardData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
        cardData = cardData[0][0];

        var arrFields = [
            {
                name:`Alter Ego:`,
                value:BioModule.Properties.bioDataCore[packName].alter_ego,
                inline:true
            },
            {
                name:`Series:`,
                value:cardData[DBM_Card_Data.columns.series],
                inline:true
            }
        ];

        //prepare the embed
        var objEmbed = {
            color: CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,
            author: {
                name: BioModule.Properties.bioDataCore[packName].fullname,
                icon_url: BioModule.Properties.bioDataCore[packName].icon
            },
            title: BioModule.Properties.bioDataCore[packName].henshin_phrase,
            fields:arrFields,
            image:{
                url:imgTransformation
            }
        }

        //check if description not empty
        if(BioModule.Properties.bioDataCore[packName].description!=""){
            objEmbed.description = BioModule.Properties.bioDataCore[packName].description;
        }

        //check if birthday exists
        if(BioModule.Properties.bioDataCore[packName].bio.key1!=""){
            arrFields[arrFields.length] = 
            {
                name:BioModule.Properties.bioDataCore[packName].bio.key1,
                value:BioModule.Properties.bioDataCore[packName].bio.value1,
                inline:true
            };
        }

        //check for each embed field information
        if(BioModule.Properties.bioDataCore[packName].bio.key2!=""){
            arrFields[arrFields.length] = {
                name:BioModule.Properties.bioDataCore[packName].bio.key2,
                value:BioModule.Properties.bioDataCore[packName].bio.value2,
                inline:true
            };
        }

        if(BioModule.Properties.bioDataCore[packName].bio.key3!=""){
            arrFields[arrFields.length] = {
                name:BioModule.Properties.bioDataCore[packName].bio.key3,
                value:BioModule.Properties.bioDataCore[packName].bio.value3,
                inline:true
            };
        }

        if(BioModule.Properties.bioDataCore[packName].bio.key4!=""){
            arrFields[arrFields.length] = {
                name:BioModule.Properties.bioDataCore[packName].bio.key4,
                value:BioModule.Properties.bioDataCore[packName].bio.value4,
                inline:true
            };
        }

        return message.channel.send({embed:objEmbed});
        

	},
};
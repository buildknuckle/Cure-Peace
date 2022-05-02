const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('../modules/DiscordPagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');

const CardModule = require('../modules/puzzlun/data/Card');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const BioModule = require('../modules/Bio');
const ValidationModule = require('../modules/puzzlun/Validation');

const {Series, SPack} = require("../modules/puzzlun/data/Series");
const {Character, CPack} = require("../modules/puzzlun/data/Character");

const Embed = require("../modules/puzzlun/Embed");

module.exports = {
    name: 'bio',
    cooldown: 5,
    description: 'View info for precure character',
    args: true,
    options:[
        {
            name: "info",
            description: "View info for precure character",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter the name. Example: nagisa",
                    type: 3,
                    required:true
                }
            ]
        }
    ],
	async executeMessage(message, args) {
	},
    async execute(interaction){
        var packName = interaction.options.getString("name");
        // var packName = interaction.options._hoistedOptions[0].value.toLowerCase();
        var discordUser = interaction.user;

        if(!BioModule.Properties.bioDataCore.hasOwnProperty(packName.toLowerCase())){
            return interaction.reply(ValidationModule.Pack.embedNotFound(discordUser));
        }

        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = BioModule.Properties.bioDataCore[packName].transform_quotes;
        var imgTransformation = BioModule.Properties.bioDataCore[packName].icon;//default transformation image
        
        //get card data:
        // var parameterWhere = new Map();
        // parameterWhere.set(DBM_Card_Data.columns.pack,packName);
        // var cardData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
        // cardData = cardData[0][0];

        var character = new Character(packName);
        var series = new Series(character.series);

        var arrFields = [
            {
                name:`Alter Ego:`,
                value:BioModule.Properties.bioDataCore[packName].alter_ego,
                inline:true
            },
            {
                name:`Series:`,
                value:series.name,
                inline:true
            }
        ];

        //prepare the embed
        var objEmbed = {
            // color: character.color,
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

        //validation: description not empty
        if(BioModule.Properties.bioDataCore[packName].description!=""){
            objEmbed.description = BioModule.Properties.bioDataCore[packName].description;
        }

        //validation: birthday exists
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

        // console.log(objEmbed);
        // return;

        return interaction.reply({embeds:[
            Embed.builder("", 
                Embed.builderUser.authorCustom(
                    BioModule.Properties.bioDataCore[packName].fullname, BioModule.Properties.bioDataCore[packName].icon
                ), 
                {
                    color: character.color,
                    title: BioModule.Properties.bioDataCore[packName].henshin_phrase,
                    fields:arrFields,
                    image:imgTransformation
                }
            )
        ]});
    }
};
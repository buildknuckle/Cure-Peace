const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');

module.exports = {
    name: 'marketboard',
    cooldown: 5,
    description: 'Contains all marketboard categories',
    args: true,
	async execute(message, args) {
        
    }
}
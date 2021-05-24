const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardModules = require('../modules/Card');
const CardGuildModules = require('../modules/CardGuild');

class Properties {
    static dataTsunagarusExecutivesCore = {
        barabaran:{
            name:"Barabaran",
            img_url:"https://media.discordapp.net/attachments/842662797941669888/844457642474340352/latest.png",
            embed_color:"#FF9E28"
        }
    }
}

function introduction(id_guild,name){
    var objEmbed = new Discord.MessageEmbed({
        color:Properties.dataTsunagarusExecutivesCore[name].embed_color,
        author:{
            name:Properties.dataTsunagarusExecutivesCore[name].name
        },
        description:Properties.dataTsunagarusExecutivesCore[name].embed_color,
        thumbnail:{
            url:Properties.dataTsunagarusExecutivesCore[name].img_url
        }
    });
    return objEmbed;
}


module.exports = {Properties,introduction}
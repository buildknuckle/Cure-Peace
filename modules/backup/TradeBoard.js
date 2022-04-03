const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBM_Card_Tradeboard = require('../../database/model/DBM_Tradeboard');

module.exports = class TradeBoard {
    static async getTradeboardData(id_guild,id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
        if(resultCheckExist[0][0]==null){
            //insert if not found
            var parameter = new Map();
            parameter.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameter.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            await DB.insert(DBM_Card_Tradeboard.TABLENAME,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
            return await resultCheckExist[0][0];
        } else {
            return await resultCheckExist[0][0];
        }
    }

    static async removeListing(id_guild,id_user){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_want,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_have,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.last_update,null);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        await DB.update(DBM_Card_Tradeboard.TABLENAME,parameterSet,parameterWhere);
    }
}
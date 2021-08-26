const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');

module.exports = class Quest {
    static questData = {
        last_daily_quest:"last_daily_quest",
        dataQuest:"dataQuest"
    }

    static async setQuestData(idUser,objReward){
        var todayDate = new Date().getDate();
        var questData = `{"${this.questData.last_daily_quest}":${todayDate},"${this.questData.dataQuest}":${objReward}}`;
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.daily_quest,questData);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,idUser);
        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static getQuestReward(cardRarity){
        return cardRarity*30;
    }
}
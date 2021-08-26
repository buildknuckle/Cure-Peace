const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
const DB = require('../../database/DatabaseCore');
const TsunagarusModules = require('../../modules/Tsunagarus');
const DBM_Card_Enemies = require('../../database/model/DBM_Card_Enemies');

module.exports = class Battle{
    //contain the values of battle type
    static type = {
        normal:"normal",//tsunagarus
        raid:"raid"//not implemented yet but for upcoming updates
    }

    static async getEnemyData(id_enemy){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Enemies.columns.id,id_enemy);
        var result = await DB.select(DBM_Card_Enemies.TABLENAME,parameterWhere);
        return result[0][0];
    }

    static embedBossViewer(enemy_type,level,color_lives,type,rarity,atk,hp,_special_protection){
        var special_protection = "❌";
        
        if(_special_protection){
            special_protection = `✅`;
        }

        return {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemy_type].embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Lv.${level}`,
            description: transformQuotes,
            fields:[
                {
                    name:`Color Lives:`,
                    value:color_lives,
                    inline:true
                },
                {
                    name:`Enemy Type:`,
                    value:type,
                    inline:true
                },
                {
                    name:`Min. Rarity:`,
                    value:rarity,
                    inline:true
                },
                {
                    name:`Party Atk:`,
                    value:atk,
                    inline:true
                }
            ],
            image:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemy_type].image
            },
            footer:{
                text:`Special Protection: ${special_protection}`
            }
        }
    }

    static componentsSelectMenuCommand(enemyType){
        switch(enemyType){
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term:
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term:
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term:
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term:
                return [
                    DiscordStyles.SelectMenus.basic("card.battle_normal","Battle Command",
                    [{
                        label: `⚔️Fight`,
                        description: `Attack the tsunagarus. CP Cost: 10 CP`,
                        value:`fight`
                    },
                    {
                        label: `✨Special attack`,
                        description: `Unleash precure special attack. SP Cost: 100%`,
                        value:`special`
                    },
                    {
                        label: `⬆️Charge up`,
                        description: `Charge up your special attack. CP Cost: 50 CP`,
                        value:`charge`
                    }])];
                break;
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.term:
            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                return [
                    DiscordStyles.SelectMenus.basic("card.battle_boss","Team Battle Main Command",
                    [{
                        label: `⚔️Fight`,
                        description: `Participate in team battle. CP Cost: 10 CP`,
                        value:`fight`
                    },
                    {
                        label: `🛡️Block`,
                        description: `Block any offensive attack. CP Cost: 10 CP`,
                        value:`block`
                    },
                    {
                        label: `✨Special attack`,
                        description: `Unleash your special attack. SP Cost: 100%`,
                        value:`special`
                    },
                    {
                        label: `💖Party special attack`,
                        description: `Unleash party special attack. Party SP Cost: 100%`,
                        value:`special_party`
                    }]),

                    DiscordStyles.SelectMenus.basic("card.battle_boss_scan","Team Battle Scan Command",
                    [{
                        label: `🔎Scan color`,
                        description: `Scan color weaknesses for this enemy. PP Cost: 1`,
                        value:`color`
                    },
                    {
                        label: `🔎Scan type`,
                        description: `Scan type weaknesses for this enemy. PP Cost: 1`,
                        value:`type`
                    },
                    {
                        label: `🔎Scan rarity`,
                        description: `Scan rarity weaknesses for this enemy. PP Cost: 1`,
                        value:`rarity`
                    },
                    ])
                ];
                break;
        }
    }

}
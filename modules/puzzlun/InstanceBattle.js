const GlobalFunctions = require('../GlobalFunctions');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Enemy_Data = require('../../database/model/DBM_Enemy_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

const Data = require("./Data");
const GuildModule = require("./Guild");
const SpackModule = require("./Series");
const EnpackModule = require("./Enpack");

class Properties {
    static solo = {
        tsunagarus:"tsunagarus",//type of enemies. e.g: chokkins
        monster:"monster",//will be used to store monster data loaded from DB
        instance:"instance",//will be used to store user battle progress, in obj
    }

    static soloInstanceKey = {
        user:"user",
        enemy:"enemy"
    }
}

//solo battle
class Solo {
    static spawnType = "battleSolo";
    static spawnData = {
        tsunagarus:"tsunagarus",//store tsunagarus type. e.g: chokkins
        monsterSeries:"monsterSeries",//store monster series
        monsterId:"monsterId"//store monster id
    }

    static isGuildAvailable(guildId){
        if(guildId in GuildModule.InstanceBattle.solo){
            if(GuildModule.InstanceBattle.solo[guildId]!==null){
                return true;
            }
        }

        return false;
    }

    static getGuildInstance(guildId){
        if(this.isGuildAvailable(guildId)){
            return GuildModule.InstanceBattle.solo[guildId];   
        }
        
        return null;
    }

    static getTsunagarus(guildId){
        if(this.isGuildAvailable(guildId)){
            return GuildModule.InstanceBattle.solo[guildId][Properties.solo.tsunagarus];
        }
        return null;
    }

    static getMonster(guildId){
        if(this.isGuildAvailable(guildId)){
            return GuildModule.InstanceBattle.solo[guildId][Properties.solo.monster];
        }
        return null;
    }

    static isUserAvailable(guildId, userId){
        if(this.isGuildAvailable(guildId)){
            if(userId in GuildModule.InstanceBattle.solo[guildId][Properties.solo.instance]){
                return true;
            }
        }

        return false;
    }

    static getUserInstance(guildId, userId){
        if(this.isUserAvailable(guildId, userId)){
            return GuildModule.InstanceBattle.solo[guildId][Properties.solo.instance];
        }
        return null;
    }

    static async removeSpawn(guildId){
        GuildModule.InstanceBattle.solo[guildId] = null;
    }

    static async init(guildId, tsunagarus, series, monsterId){//init instance into guild module
        //tsunagarus pass the val
        var tsunagarus = EnpackModule.tsunagarus[tsunagarus];
        var monster = SpackModule[series].Monsters.data[monsterId];
        monster[DBM_Enemy_Data.columns.weakness_color] = monster[DBM_Enemy_Data.columns.weakness_color].toString().split(",");//split weakness color into array

        //update guild instance modules data
        var instanceBattleData = {};
        instanceBattleData[Properties.solo.tsunagarus] = tsunagarus;
        instanceBattleData[Properties.solo.monster] = monster;
        instanceBattleData[Properties.solo.instance] = {};
        GuildModule.InstanceBattle.solo[guildId] = instanceBattleData;
    }

    static async updateSpawn(guildId, spawnToken, tsunagarus, series, monsterId){
        this.removeSpawn(guildId);//reset/remove battle spawn instance

        //tsunagarus pass the val
        var tsunagarus = EnpackModule.tsunagarus[tsunagarus];
        var monster = SpackModule[series].Monsters.data[monsterId];
        monster[DBM_Enemy_Data.columns.weakness_color] = monster[DBM_Enemy_Data.columns.weakness_color].toString().split(",");//split weakness color into array

        this.init(guildId, tsunagarus.Properties.value, monster[DBM_Enemy_Data.columns.series], monster[DBM_Enemy_Data.columns.id]);

        //update spawn data to DB
        var valSpawn = {};
        valSpawn[this.spawnData.tsunagarus] = tsunagarus.Properties.value;
        valSpawn[this.spawnData.monsterSeries] = monster[DBM_Enemy_Data.columns.series];
        valSpawn[this.spawnData.monsterId] = monster[DBM_Enemy_Data.columns.id];

        var spawnData = {};
        spawnData[DBM_Guild_Data.columns.spawn_token] = spawnToken;
        spawnData[DBM_Guild_Data.columns.spawn_type] = this.spawnType;
        spawnData[DBM_Guild_Data.columns.spawn_data] = JSON.stringify(valSpawn);
        await Data.Guild.updateData(guildId, spawnData);
    }

    static async setInstanceData(guildId, userId, avatarData, enemyData){
        GuildModule.InstanceBattle.solo[guildId][Properties.solo.instance][userId] = {};
        GuildModule.InstanceBattle.solo[guildId][Properties.solo.instance][userId]
        [Properties.soloInstanceKey.user] = avatarData;//set user avatar
        GuildModule.InstanceBattle.solo[guildId][Properties.solo.instance][userId]
        [Properties.soloInstanceKey.enemy] = enemyData;//set enemy data
    }
}

class Party {
    static spawnType = "battleParty";
}

//re-init & load from db to guild
async function init(){
    //load & init battle instance if exists
    var mapSpawnType = new Map();
    mapSpawnType.set(DBM_Guild_Data.columns.spawn_type, Solo.spawnType);
    var mapSpawnType2 = new Map();
    mapSpawnType2.set(DBM_Guild_Data.columns.spawn_type, Party.spawnType);

    var arrWhere = [mapSpawnType,mapSpawnType2];
    var guildData = await DB.selectOr(DBM_Guild_Data.TABLENAME, arrWhere);
    
    for(var i=0; i<guildData.length; i++){
        let guild = guildData[i];
        let guildId = guild[DBM_Guild_Data.columns.id_guild];
        let spawnData = JSON.parse(guild[DBM_Guild_Data.columns.spawn_data]);
        let tsunagarus = spawnData[Solo.spawnData.tsunagarus];
        let monsterSeries = spawnData[Solo.spawnData.monsterSeries];
        let monsterId = spawnData[Solo.spawnData.monsterId];

        switch(guild[DBM_Guild_Data.columns.spawn_type]){
            case Solo.spawnType:
                await Solo.removeSpawn(guildId);//reset/remove battle spawn instance
                 //update instance
                await Solo.init(guildId, tsunagarus, monsterSeries, monsterId);
                break;
        }
    }

}

module.exports = {
    Properties, Solo, Party, init
}
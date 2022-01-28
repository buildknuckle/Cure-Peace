const Cron = require('node-cron');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('./Card');

// const DBM_Card_Data = require('../database/model/DBM_Card_Data');
// const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

var arrTimerCardSpawn = {};//timer for each guild
/*
for guild timer duration. Object structure: {timer:.....,remaining:......}. 
Timer is the timer object, remaining: remaining of time left
*/
var arrTimerGuildInformation = {};

class Data {
    static userLogin = {};
}

async function init(guildId){
    //load latest user login data
    Data.userLogin[guildId] = [];

    var query = `SELECT * FROM ${DBM_User_Data.TABLENAME} WHERE ${DBM_User_Data.columns.server_id_login}=?`;
    var loggedInUser = await DBConn.conn.query(query,[guildId]);
    loggedInUser.forEach(item => {
        Data.userLogin[guildId].push(item[DBM_User_Data.columns.id_user]);
    });
}

//get 1 card guild data
async function getGuildData(id_guild){
    var mapWhere = new Map();
    mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
    var resultCheckExist = await DB.select(DBM_Guild_Data.TABLENAME,mapWhere);
    if(resultCheckExist[0]==null){
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
        await DB.insert(DBM_Guild_Data.TABLENAME,mapWhere);

        //reselect after insert new data
        mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
        var resultCheckExist = await DB.select(DBM_Guild_Data.TABLENAME,mapWhere);
    }

    return await resultCheckExist[0];
}

async function removeSpawn(id_guild){
    var query = `UPDATE ${DBM_Guild_Data.TABLENAME} 
    SET ${DBM_Guild_Data.columns.spawn_type}=NULL, ${DBM_Guild_Data.columns.spawn_data}=NULL 
    WHERE ${DBM_Guild_Data.columns.id_guild}=?`;
    await DBConn.conn.query(query, [id_guild]);
}

async function updateTimerRemaining(id_guild){
    var cardGuildData = await getGuildData(id_guild);
    var duration = parseInt(cardGuildData[DBM_Guild_Data.columns.spawn_interval]*60);//convert to seconds

    if(arrTimerGuildInformation[id_guild]!=null){
        //remove the old timer if existed
        if(arrTimerGuildInformation[id_guild].timer!=null){
            clearInterval(arrTimerGuildInformation[id_guild].timer);
            arrTimerGuildInformation[id_guild].remaining = duration;
        }
    } else {
        //init the object of guild if not existed yet:
        arrTimerGuildInformation[id_guild] = {
            timer:null,remaining:duration
        }
    }

    arrTimerGuildInformation[id_guild].timer = setInterval(function(){
        if(arrTimerGuildInformation[id_guild].remaining>0){
            arrTimerGuildInformation[id_guild].remaining-=1;
        } else {
            arrTimerGuildInformation[id_guild].remaining = duration;
        }
    },1000);
}

async function getTimerRemaining(id_guild){
    var cardGuildData = await getGuildData(id_guild);
}

async function initCardSpawnInstance(guildId,client){
    var cardGuildData = await getGuildData(guildId);

    if(cardGuildData[DBM_Guild_Data.columns.id_channel_spawn]!=null){
        var assignedChannel = cardGuildData[DBM_Guild_Data.columns.id_channel_spawn];
        
        arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
            if(arrTimerGuildInformation.hasOwnProperty(guildId)){
                var cardGuildData = await getGuildData(guildId);
                var objEmbed = await CardModule.generateCardSpawn(guildId);
        
                var sendParam = objEmbed; 
                if(cardGuildData[DBM_Guild_Data.columns.id_roleping_cardcatcher]!=null){
                    sendParam.content = `<@&${cardGuildData[DBM_Guild_Data.columns.id_roleping_cardcatcher]}>`;
                }
                
                var msgObject = await client.channels.cache.find(ch => ch.id === assignedChannel)
                    .send(sendParam);
    
                await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
            }            
        }, parseInt(cardGuildData[DBM_Guild_Data.columns.spawn_interval])*60*1000);

        // //update the time remaining information:
        await updateTimerRemaining(guildId);
    }
}

async function updateCardSpawnInstance(guildId,client){
    if(arrTimerGuildInformation.hasOwnProperty(guildId)){
        clearInterval(arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
        clearInterval(arrTimerCardSpawn[guildId]);
    }

    var cardGuildData = await getGuildData(guildId);

    if(cardGuildData[DBM_Guild_Data.columns.id_channel_spawn]!=null){
        var assignedChannel = cardGuildData[DBM_Guild_Data.columns.id_channel_spawn];

        arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
            if(arrTimerGuildInformation.hasOwnProperty(guildId)){
                var cardGuildData = await getGuildData(guildId);
                var objEmbed = await CardModule.generateCardSpawn(guildId);
        
                var sendParam = objEmbed; 
                if(cardGuildData[DBM_Guild_Data.columns.id_roleping_cardcatcher]!=null){
                    sendParam.content = `<@&${cardGuildData[DBM_Guild_Data.columns.id_roleping_cardcatcher]}>`;
                }
                
                var msgObject = await client.guild.channels.cache.find(ch => ch.id === assignedChannel)
                    .send(sendParam);
    
                await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
            } else {
                clearInterval(arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
                clearInterval(arrTimerCardSpawn[guildId]);
            }
            
        }, parseInt(cardGuildData[DBM_Guild_Data.columns.spawn_interval])*60*1000);

        // //update the time remaining information:
        await updateTimerRemaining(guildId);
    }
}

module.exports = {init, Data, arrTimerCardSpawn, getGuildData, removeSpawn, arrTimerGuildInformation,
    updateTimerRemaining,getTimerRemaining,initCardSpawnInstance,updateCardSpawnInstance};
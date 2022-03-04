// const Cron = require('node-cron');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('./Card');
const DataModule = require("./Data");

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

class InstanceBattle {
    static solo = {};
    static party = {};
}

async function init(guildId){
    Data.userLogin[guildId] = []; //init user login data
    //init instance data
    InstanceBattle.solo[guildId] = null;
    InstanceBattle.party[guildId] = null;

    var query = `SELECT * FROM ${DBM_User_Data.TABLENAME} WHERE ${DBM_User_Data.columns.server_id_login}=?`;
    var loggedInUser = await DBConn.conn.query(query,[guildId]);
    loggedInUser.forEach(item => {
        Data.userLogin[guildId].push(item[DBM_User_Data.columns.id_user]);
    });
}

async function removeSpawn(id_guild){
    var query = `UPDATE ${DBM_Guild_Data.TABLENAME} 
    SET ${DBM_Guild_Data.columns.spawn_type}=NULL, ${DBM_Guild_Data.columns.spawn_data}=NULL 
    WHERE ${DBM_Guild_Data.columns.id_guild}=?`;
    await DBConn.conn.query(query, [id_guild]);
}

module.exports = {init, Data, InstanceBattle, arrTimerCardSpawn, removeSpawn};
const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GardenModule = require('./Garden');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_User_Data = require('../database/model/DBM_User_Data');

async function getUserStatusData(id_user){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
    var resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
    if(resultCheckExist[0][0]==null){
        //insert if not found
        var parameter = new Map();
        parameter.set(DBM_User_Data.columns.id_user,id_user);
        await DB.insert(DBM_User_Data.TABLENAME,parameter);
        //reselect after insert new data
        parameterWhere = new Map();
        parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
    }

    return await resultCheckExist[0][0];
}

module.exports = {getUserStatusData}
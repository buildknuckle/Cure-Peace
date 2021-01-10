const DB = require('../database/DatabaseCore');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

var arrTimerCardSpawn = {};

//get 1 card guild data
async function getCardGuildData(id_guild){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    var resultCheckExist = await DB.selectAll(DBM_Card_Guild.TABLENAME,parameterWhere);
    if(resultCheckExist[0][0]==null){
        var parameter = new Map();
        parameter.set(DBM_Card_Guild.columns.id_guild,id_guild);
        await DB.insert(DBM_Card_Guild.TABLENAME,parameter);
        //reselect after insert new data
        parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
        var resultCheckExist = await DB.selectAll(DBM_Card_Guild.TABLENAME,parameterWhere);
        return await resultCheckExist[0][0];
    } else {
        return await resultCheckExist[0][0];
    }
    
}

module.exports = {getCardGuildData,arrTimerCardSpawn};
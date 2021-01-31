const DB = require('../database/DatabaseCore');
const CardModule = require('../modules/Card');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

var arrTimerCardSpawn = {};//timer for each guild
/*
for guild timer duration. Object structure: {timer:.....,remaining:......}. 
Timer is the timer object, remaining: remaining of time left
*/
var arrTimerGuildInformation = {};

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

async function updateTimerRemaining(id_guild){
    var cardGuildData = await getCardGuildData(id_guild);
    var duration = parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval]*60);//convert to seconds

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
    var cardGuildData = await getCardGuildData(id_guild);

}

module.exports = {arrTimerCardSpawn,getCardGuildData,arrTimerGuildInformation,updateTimerRemaining,getTimerRemaining};
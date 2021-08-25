const DB = require('../database/DatabaseCore');
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

async function initCardSpawnInstance(guildId,client){
    var cardGuildData = await getCardGuildData(guildId);

    if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
        var assignedChannel = cardGuildData[DBM_Card_Guild.columns.id_channel_spawn];
        const CardModule = require('../modules/Card');
        
        arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
            if(arrTimerGuildInformation.hasOwnProperty(guildId)){
                var cardGuildData = await getCardGuildData(guildId);
                var objEmbed = await CardModule.generateCardSpawn(guildId);
        
                var sendParam = objEmbed; 
                if(cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]!=null){
                    sendParam.content = `<@&${cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]}>`;
                }
                
                var msgObject = await client.channels.cache.find(ch => ch.id === assignedChannel)
                    .send(sendParam);
    
                await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
            }            
        }, parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval])*60*1000);

        // //update the time remaining information:
        await updateTimerRemaining(guildId);
    }
}

async function updateCardSpawnInstance(guildId,client){
    if(arrTimerGuildInformation.hasOwnProperty(guildId)){
        clearInterval(arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
        clearInterval(arrTimerCardSpawn[guildId]);
    }

    var cardGuildData = await getCardGuildData(guildId);

    if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
        var assignedChannel = cardGuildData[DBM_Card_Guild.columns.id_channel_spawn];
        const CardModule = require('../modules/Card');

        arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
            if(arrTimerGuildInformation.hasOwnProperty(guildId)){
                var cardGuildData = await getCardGuildData(guildId);
                var objEmbed = await CardModule.generateCardSpawn(guildId);
        
                var sendParam = objEmbed; 
                if(cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]!=null){
                    sendParam.content = `<@&${cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]}>`;
                }
                
                var msgObject = await client.guild.channels.cache.find(ch => ch.id === assignedChannel)
                    .send(sendParam);
    
                await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
            } else {
                clearInterval(arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
                clearInterval(arrTimerCardSpawn[guildId]);
            }
            
        }, parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval])*60*1000);

        // //update the time remaining information:
        await updateTimerRemaining(guildId);
    }
}

module.exports = {arrTimerCardSpawn,getCardGuildData,arrTimerGuildInformation,
    updateTimerRemaining,getTimerRemaining,initCardSpawnInstance,updateCardSpawnInstance};
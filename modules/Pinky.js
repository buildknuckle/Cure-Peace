const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Pinky_Data = require('../database/model/DBM_Pinky_Data');
const DBM_Pinky_Inventory = require('../database/model/DBM_Pinky_Inventory');
const CardModule = require('../modules/Card')
const pinky = require('../commands/pinky');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const { constants } = require('fs');

class Properties{
    static maxPinky = `55`;
    static embedColor = '#efcc2c';

    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png"
    }
}

async function getPinkyData(id_pinky) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Pinky_Data.columns.id_pinky,id_pinky);
    var result = await DB.selectAll(DBM_Pinky_Data.TABLENAME,parameterWhere);
    return result[0][0];
}

async function getPinkyInventoryData(id_guild,id_pinky) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Pinky_Inventory.columns.id_guild,id_guild);
    parameterWhere.set(DBM_Pinky_Inventory.columns.id_pinky,id_pinky);
    var result = await DB.select(DBM_Pinky_Inventory.TABLENAME,parameterWhere);
    return result[0][0];
}

async function getPinkyTotal(id_guild){
    var query = `SELECT count(${DBM_Pinky_Inventory.columns.id_pinky}) as total 
    FROM ${DBM_Pinky_Inventory.TABLENAME} 
    WHERE ${DBM_Pinky_Inventory.columns.id_guild}=?`;
    var result = await DBConn.conn.promise().query(query, [id_guild]);
    return result[0][0]["total"];
}

async function addPinkyInventory(id_guild,id_user,id_pinky){
    var parameterInsert = new Map();
    parameterInsert.set(DBM_Pinky_Inventory.columns.id_guild,id_guild);
    parameterInsert.set(DBM_Pinky_Inventory.columns.id_user,id_user);
    parameterInsert.set(DBM_Pinky_Inventory.columns.id_pinky,id_pinky);
    await DB.insert(DBM_Pinky_Inventory.TABLENAME,parameterInsert);
}

async function removeGuildPinkySpawn(id_guild){
    //erase all card spawn information
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.spawn_type,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_id,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_color,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_number,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_data,null);
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function pinkyCompletion(id_guild){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    var result = await DB.selectAll(DBM_Card_Guild.TABLENAME,parameterWhere);
    if(result[0][0][DBM_Card_Guild.columns.completion_date_pinky]==null){
        //update the completion date
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Guild.columns.completion_date_pinky,GlobalFunctions.getCurrentDateTime());
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere)

        var userContributor = "";
        var arrUserContributor = [];
        var mofuCoinReward = 1000;

        //get all user who contribute
        var query = `SELECT ${DBM_Pinky_Inventory.columns.id_user},count(${DBM_Pinky_Inventory.columns.id_user}) as total 
        FROM ${DBM_Pinky_Inventory.TABLENAME} 
        WHERE ${DBM_Pinky_Inventory.columns.id_guild}=? 
        GROUP BY ${DBM_Pinky_Inventory.columns.id_user}`;
        var result = await DBConn.conn.promise().query(query, [id_guild]);
        result[0].forEach(entry=>{
            //update the mofucoin
            arrUserContributor.push(entry[DBM_Pinky_Inventory.columns.id_user]);
            userContributor += `<@${entry[DBM_Pinky_Inventory.columns.id_user]}>: ${entry['total']} P\n`;
        });
        arrUserContributor = arrUserContributor.join();//join the array

        //update user mofucoin
        var queryUpdate = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
        SET ${DBM_Card_User_Data.columns.mofucoin}=${DBM_Card_User_Data.columns.mofucoin}+${mofuCoinReward} 
        WHERE ${DBM_Card_User_Data.columns.id_user} IN (${arrUserContributor})`;
        await DBConn.conn.promise().query(queryUpdate);
        
        //return the completion embed
        return {
            color: Properties.embedColor,
            thumbnail : {
                url:`https://static.wikia.nocookie.net/prettycure/images/2/20/Stage2.Nuts.PNG`
            },
            title:`Palmier Kingdom has been Restored!`,
            description:`Thank you everyone for restoring the palmier kingdom!\nAll contributed user has received: **${mofuCoinReward} mofucoin** as bonus.`,
            fields:[
                {
                    name:`Special thanks to:`,
                    value:userContributor,
                    inline:true
                }
            ],
            footer:{
                text:`Completed At: ${GlobalFunctions.convertDateTime(GlobalFunctions.getCurrentDateTime())}`
            }
        }
    } else {
        return null;
    }
}

module.exports = {Properties,getPinkyData,getPinkyInventoryData,getPinkyTotal,
    addPinkyInventory,removeGuildPinkySpawn,pinkyCompletion}
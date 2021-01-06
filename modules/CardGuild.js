const DB = require('../database/DatabaseCore');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

//get 1 card guild data
function getCardGuildData(id_guild,callback){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    DB.selectAll(DBM_Card_Guild.TABLENAME,parameterWhere,function getResult(result){
        return callback(result);
    });

    //insert if not found
    var parameter = new Map();
    parameter.set(DBM_Card_Guild.columns.id_guild,id_guild);
    DB.insert(DBM_Card_Guild.TABLENAME,parameter);
}

module.exports = {getCardGuildData};
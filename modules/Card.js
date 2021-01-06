const DB = require('../database/DatabaseCore');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');

//get 1 card data
function getCardData(id_card,callback) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Data.columns.id_card,id_card);
    DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere,function getResult(result){
        return callback(result);
    });
    //return callback(DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere));
}

//get 1 card user data
function getUserStatusData(id_user,callback){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
    DB.selectAll(DBM_Card_User_Data.TABLENAME,parameterWhere,function getResult(result){
        return callback(result);
    });
}

module.exports = {getCardData,getUserStatusData};
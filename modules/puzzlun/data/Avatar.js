const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Avatar = require('../../../database/model/DBM_Card_Avatar');

const {Series, SPack} = require("./Series");
const {Character} = require("./Character");
const GProperties = require('../Properties');

class Avatar {
    // static formation = {
    //     main:DBM_Card_Avatar.columns.id_main,
    //     support1:DBM_Card_Avatar.columns.id_support1,
    //     support2:DBM_Card_Avatar.columns.id_support2,
    // }

    properties = {
        icon:null,
        name:null,
        transform_quotes1:null,
        transform_quotes2:null,
        special_attack:null,
        img_special_attack:null,
        img_transformation:null,
    }

    parameter = {
        //base stats
        level:0,
        hp:0,
        sp:0,
        atk:0,
        specialPoint:0,
        base_hp:0,
        base_atk:0,
        maxSp:0,
        maxHp:0,
        maxSpecialPoint:0,
    }
    
    //parameter
    // maxHp = 0;
    // hp = 0;
    // atk = 0;
    // maxSp = 0;
    // sp = 0;
    // maxSpecialPoint = 0;
    // specialPoint = 0;

    // Status;

    // skill = {
    //     passive:
    // }
    
    constructor(pack, statusData=null){
        // this.Status = new Status();
        // this.SKill = new Skill();
        if(statusData!==null){
            this.Status = new Status();
        }
    }

    getStatus(){
        return {
            
        }
    }
    
    // static async getData(id_user){
    //     var parameterWhere = new Map();
    //     parameterWhere.set(DBM_Card_Avatar.columns.id_user,id_user);
    //     var resultCheckExist = await DB.select(DBM_Card_Avatar.TABLENAME,parameterWhere);
    //     if(resultCheckExist[0]==null){ //insert if not found
    //         var parameter = new Map();
    //         parameter.set(DBM_Card_Avatar.columns.id_user,id_user);
    //         await DB.insert(DBM_Card_Avatar.TABLENAME,parameter);
    //         //reselect after insert new data
    //         parameterWhere = new Map();
    //         parameterWhere.set(DBM_Card_Avatar.columns.id_user,id_user);
    //         resultCheckExist = await DB.select(DBM_Card_Avatar.TABLENAME,parameterWhere);
    //     }
    
    //     return resultCheckExist[0];
    // }

    // static async updateData(id_user, options){
    //     var arrParam = [];
    //     var querySet = ``;
    //     for (var keyOptions in options) {
    //         var valueOptions = options[keyOptions];
    //         switch(keyOptions){
    //             case DBM_Card_Avatar.columns.id_main:
    //             case DBM_Card_Avatar.columns.id_support1:
    //             case DBM_Card_Avatar.columns.id_support2:
    //             default:
    //                 querySet+=` ${keyOptions} = ?, `;
    //                 arrParam.push(valueOptions);
    //                 break;
    //         }
    //     }
        
    //     querySet = querySet.replace(/,\s*$/, "");//remove last comma and space
    //     arrParam.push(id_user);//push user id to arrParam
    
    //     var query = `UPDATE ${DBM_Card_Avatar.TABLENAME} 
    //     SET ${querySet} 
    //     WHERE ${DBM_Card_Avatar.columns.id_user} = ?`;
    //     await DBConn.conn.query(query, arrParam);
    // }

    // static getLevel(avatarData){
    //     return avatarData[PropertiesStats.level]
    // }

    // static getMaxHp(avatarData){
    //     return avatarData[PropertiesStats.maxHp];
    // }

    // static getHp(avatarData){
    //     return avatarData[PropertiesStats.hp];
    // }

    // static getAtk(avatarData){
    //     return avatarData[PropertiesStats.atk];
    // }

    // static getMaxSp(avatarData){
    //     return avatarData[PropertiesStats.maxSp];
    // }

    // static getSp(avatarData){
    //     return avatarData[PropertiesStats.sp];
    // }

    // static getBaseMaxHp(avatarData){
    //     return avatarData[PropertiesStats.baseStats][PropertiesStats.maxHp];
    // }

    // static getBaseAtk(avatarData){
    //     return avatarData[PropertiesStats.baseStats][PropertiesStats.atk];
    // }

    // static isAvailable(avatarData, index=0){
    //     return (avatarData[PropertiesStats.cardData][index]!==null&&avatarData[PropertiesStats.cardInventoryData][index]) ? true: false;
    // }

    // static getIdCard(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.id_card];
    //     } else {
    //         return null;
    //     }
    // }

    // static getPack(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.pack];
    //     } else {
    //         return null;
    //     }
    // }

    // static getSeries(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.series];
    //     } else {
    //         return null;
    //     }
    // }

    // static getAlterEgo(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         var pack = this.getPack(avatarData, index);
    //         return CpackModule[pack].Properties.alter_ego;
    //     } else {
    //         return null;
    //     }
    // }

    // static getSuppportLevel(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         return avatarData[PropertiesStats.cardInventoryData][index][DBM_Card_Inventory.columns.level];
    //     } else {
    //         return null;
    //     }
    // }

    // static getRarity(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.rarity];
    //     } else {
    //         return null;
    //     }
    // }

    // static getColor(avatarData, index=0){
    //     if(this.isAvailable(avatarData, index)){
    //         var pack = this.getPack(avatarData, index);
    //         return CpackModule[pack].Properties.color;
    //     } else {
    //         return null;
    //     }
    // }
}

class Status {
    //base stats
    hp_base = 0;
    atk_base = 0;
    
    //parameter
    maxHp = 0;
    hp = 0;
    atk = 0;
    maxSp = 0;
    sp = 0;
    maxSpecialPoint = 0;
    specialPoint = 0;
    
    constructor(statusData){

    }

    getMaxHp(){

    }

    getHp(){
        return this.hp;
    }

    getAtk(){
        return this.atk;
    }

    getMaxSp(){
        return this.maxSp;
    }

    getSp(){
        return this.sp;
    }
}

class Skill {
    passive = null;
    constructor(){

    }
}

class Behavior {
    onDamage(){

    }
}

module.exports = Avatar;
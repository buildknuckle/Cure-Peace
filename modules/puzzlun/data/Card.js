const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const CpackModule = require("../Characters");
const SpackModule = require("../Series");
const GProperties = require('../Properties');

class Card {
    data = {
        id_card:null,
        color:null,
        series:null,
        pack:null,
        rarity:null,
        name:null,
        img_url:null,
        img_url_upgrade1:null,
        hp_base:null,
        atk_base:null,
        is_spawnable:null,
        patch_ver:null,
        created_at:null,
    };

    constructor(cardData){
        for(var key in cardData){
            this.data[key] = cardData[key];
        }
    }

    static async getData(cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.id_card,cardId);
        var cardData = await DB.select(DBM_Card_Data.TABLENAME,mapWhere);
        if(cardData[0]!=null){
            return cardData[0];
        } else {
            return null;
        }
    }

    static async getMultipleData(arrCardId){
        var cardData = await DB.selectIn(DBM_Card_Data.TABLENAME, DBM_Card_Data.columns.id_card, arrCardId);
        return cardData;
    }

    getData(){
        return this.data;
    }

    isAvailable(){
        return this.data[DBM_Card_Data.columns.id_card]!=null ? true:false;
    }

    getId(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.id_card]:null;
    }

    getColor(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.color]:null;
    }

    getSeries(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.series]:null;
    }

    getPack(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.pack]:null;
    }

    getRarity(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.rarity]:null;
    }

    getName(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.name]:null;
    }

    getImg(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.img_url]:null;
    }

    getImgGold(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.img_url_upgrade1]:null;
    }

    getHpBase(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.hp_base]:null;
    }

    getAtkBase(){
        return this.isAvailable()?
            this.data[DBM_Card_Data.columns.atk_base]:null;
    }

    isSpawnable(){
        if(this.isAvailable()){
            return Boolean(this.data[DBM_Card_Data.columns.is_spawnable])?
                true:false;
        }
        
        return false;
    }

    static async getPackTotal(pack){
        if(pack in CpackModule[pack]){
            return CpackModule[pack].Properties.total;
        }
        
        return 99;
    }

}

module.exports = Card;
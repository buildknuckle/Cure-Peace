const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const CpackModule = require("../Cpack");
const SpackModule = require("../Series");
const GProperties = require('../Properties');

class Card {
    data = {};

    // id_card: "id_card",
    // color: "color",
    // series: "series",
    // pack: "pack",
    // rarity: "rarity",
    // name: "name",
    // img_url: "img_url",
    // img_url_upgrade1: "img_url_upgrade1",
    // hp_base: "hp_base",
    // atk_base: "atk_base",
    // is_spawnable:"is_spawnable",
    // patch_ver:"patch_ver",
    // created_at: "created_at",

    constructor(cardData){
        if(cardData==null){
            return this.data = null;
        }

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

    isAvailable(){
        return this.data!=null ? true:false;
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
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const {Character, CPack} = require("./Character");
const SpackModule = require("./Series");
const GProperties = require('../Properties');

class Card {
    static tablename = DBM_Card_Data.TABLENAME;
    static columns = DBM_Card_Data.columns;

    id_card=null;
    color=null;
    series=null;
    pack=null;
    rarity=null;
    name=null;
    img_url=null;
    img_url_upgrade1=null;
    hp_base=null;
    atk_base=null;
    is_spawnable=null;
    patch_ver=null;
    created_at=null;

    //modifier:
    packTotal = null;

    constructor(cardData){
        for(var key in cardData){
            this[key] = cardData[key];
        }

        //modify pack total
        if(this.pack in CPack){
            this.packTotal = CPack[this.pack].properties.total;
        }
    }

    static async getCardData(idCard){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.id_card, idCard);
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

    isAvailable(key){
        return typeof this[key] === 'undefined';
    }

    getIdCard(){
        return this.id_card;
    }

    getColor(){
        return this.color;
    }

    getSeries(){
        return this.series;
    }

    getPack(){
        return this.pack;
    }

    getRarity(){
        return this.rarity;
    }

    getName(){
        return this.name;
    }

    getImg(){
        return this.img_url;
    }

    getImgGold(){
        return this.img_url_upgrade1;
    }

    getHpBase(){
        return this.hp_base;
    }

    getAtkBase(){
        return this.atk_base;
    }

    isSpawnable(){
        if(this.isAvailable(this[DBM_Card_Data.columns.is_spawnable])){
            return Boolean(this[DBM_Card_Data.columns.is_spawnable]);
        }
        
        return false;
    }

    getPackTotal(){
        return this.packTotal;
    }

    static async getPackTotal(pack){
        if(pack in CPack[pack]){
            return CPack[pack].Properties.total;
        }
        return 0;
    }

}

module.exports = Card;
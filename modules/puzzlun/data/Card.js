const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const {Character, CPack} = require("./Character");
const SpackModule = require("./Series");
const GProperties = require('../Properties');

class Card {
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

    isAvailable(key){
        return typeof this[key] === 'undefined';
    }

    getIdCard(){
        return this.isAvailable(this[DBM_Card_Data.columns.id_card])?
            this[DBM_Card_Data.columns.id_card]:null;
    }

    getColor(){
        return this.isAvailable(this[DBM_Card_Data.columns.color])?
            this[DBM_Card_Data.columns.color]:null;
    }

    getSeries(){
        return this.isAvailable(thisthis[DBM_Card_Data.columns.series])?
            this[DBM_Card_Data.columns.series]:null;
    }

    getPack(){
        return this.isAvailable(this[DBM_Card_Data.columns.pack])?
            this[DBM_Card_Data.columns.pack]:null;
    }

    getRarity(){
        return this.isAvailable(this[DBM_Card_Data.columns.rarity])?
            this[DBM_Card_Data.columns.rarity]:null;
    }

    getName(){
        return this.isAvailable(this[DBM_Card_Data.columns.name])?
            this[DBM_Card_Data.columns.name]:null;
    }

    getImg(){
        return this.isAvailable(this[DBM_Card_Data.columns.img_url])?
            this[DBM_Card_Data.columns.img_url]:null;
    }

    getImgGold(){
        return this.isAvailable(this[DBM_Card_Data.columns.img_url_upgrade1])?
            this[DBM_Card_Data.columns.img_url_upgrade1]:null;
    }

    getHpBase(){
        return this.isAvailable(this[DBM_Card_Data.columns.hp_base])?
            this[DBM_Card_Data.columns.hp_base]:null;
    }

    getAtkBase(){
        return this.isAvailable(this[DBM_Card_Data.columns.atk_base])?
            this[DBM_Card_Data.columns.atk_base]:null;
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
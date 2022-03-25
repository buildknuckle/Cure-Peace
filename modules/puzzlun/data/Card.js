const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const {Character, CPack} = require("./Character");
const {Series} = require("./Series");
const GlobalFunctions = require('../../GlobalFunctions');
const Properties = require('../Properties');

const emoji = {
    rarity(rarity){
        switch(rarity){
            case 7:
                return "<:r7:935903814358270023>";
            case 6:
                return "<:r6:935903799317499954>";
            default:
                return "<:r1:935903782770966528>";
        }
    },
    hp:"❤️",
    atk:"⚔️",
    sp:"🌟"
}

const parameter =  {
    maxLevel(rarity){
        switch(rarity){
            case 1: return 20;
            case 2: return 25;
            case 3: return 35;
            case 4: return 40;
            case 5: return 50;
            case 6: case 7: return 60;
            default: return 20;
        }
    },
    maxLevelSpecial: 10,
    maxHp(level,base_hp){
        return level>1 ? level+base_hp:base_hp;
    },
    maxSp(color){
        switch(color){
            case "pink": return 4; break;
            case "blue": return 3; break;
            case "red": return 3; break;
            case "yellow": return 6; break;
            case "green": return 6; break;
            case "purple": return 5; break;
            case "white": return 5; break;
        }
    },
    atk(level,base_atk){
        return level>1 ? level+base_atk:base_atk;
    },
    nextColorPoint(level,qty=1){
        var tempExp = 0;
        var baseCost = 20;
        //parameter:3: level 1->4
        for(var i=0;i<qty;i++){
            tempExp+=(level+1)*baseCost;
            level+=1;
        }
        
        return tempExp;
    },
    getNextSpecialTotal(level){
        //get the card stock requirement to level up the specials
        switch(level){
            case 1: return 1;
            case 2: return 2;
            default: return 4;
        }
    }
}

class Card {
    static tablename = DBM_Card_Data.TABLENAME;
    static columns = DBM_Card_Data.columns;
    static parameter = parameter;
    static emoji = emoji;

    parameter = parameter;
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
    is_tradable=null;
    // patch_ver=null;
    created_at=null;

    Character;
    Series;

    //modifier:
    packTotal = null;

    constructor(cardData=null){
        if(cardData!=null){
            for(var key in cardData){
                this[key] = cardData[key];
            }

            //modify pack total
            if(this.pack in CPack){
                this.packTotal = CPack[this.pack].properties.total;
            }

            if(this.pack!=null) this.Character = new Character(this.pack);
            if(this.series!=null) this.Series = new Series(this.series);

            this.maxSp = parameter.maxSp(this.color);
        }
    }

    initCardData(cardData){
        for(var key in cardData){
            this[key] = cardData[key];
        }
        this.init();
    }

    //load all necessary class variable
    init(){
        //modify pack total
        if(this.pack in CPack){
            this.packTotal = CPack[this.pack].properties.total;
        }

        if(this.pack!=null) this.Character = new Character(this.pack);
        if(this.series!=null) this.Series = new Series(this.series);

        this.maxSp = parameter.maxSp(this.color);
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

    getName(maxLength=0, withImageLink=false){
        let name = this.name;
        if(maxLength>0) name = GlobalFunctions.cutText(name, maxLength);

        return withImageLink ? `[${name}](${this.img_url})` : name;
    }

    getMaxLevel(){
        return parameter.maxLevel(this.rarity);
    }

    getMaxSpecialLevel(){
        return parameter.maxLevelSpecial;
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

    isTradable(){
        return Boolean(this.is_tradable);
    }

    getPackTotal(){
        return this.packTotal;
    }

    getColorEmoji(){
        return Properties.color[this.color].emoji;
    }

    getCardEmoji(){
        return Properties.color[this.color].emoji_card;
    }

    getRarityEmoji(){
        return Card.emoji.rarity(this.rarity);
    }

    static async getPackTotal(pack){
        if(pack in CPack[pack]){
            return CPack[pack].Properties.total;
        }
        return 0;
    }

    static getId(cardData){
        return cardData[this.columns.id_card];
    }

}

module.exports = Card;
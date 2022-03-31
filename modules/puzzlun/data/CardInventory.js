const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
// const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const Card = require("./Card");
// const SpackModule = require("./Series");
const GProperties = require('../Properties');
const GlobalFunctions = require('../../GlobalFunctions');
const {Character, CPack} = require("./Character");
const {Series, SPack} = require("./Series");

//database modifier
const PROTECTED_KEY = Object.keys(DBM_Card_Inventory.columns);
const UPDATE_KEY = [
    DBM_Card_Inventory.columns.id_user,
    DBM_Card_Inventory.columns.id_card,
];

const limit = Object.freeze({
    card:99
});

const emoji = {
    rarity(is_gold, rarity){
        if(is_gold){
            return `🌟`;
        } else {
            switch(rarity){
                case 7:
                    return "<:r7:935903814358270023>";
                case 6:
                    return "<:r6:935903799317499954>";
                default:
                    return "<:r1:935903782770966528>";
            }
        }
    },
    hp:"❤️",
    atk:"⚔️",
    sp:"💠"
}

// const parameter =  {
//     maxLevel(rarity){
//         switch(rarity){
//             case 1: return 20;
//             case 2: return 25;
//             case 3: return 35;
//             case 4: return 40;
//             case 5: return 50;
//             case 6: case 7: return 60;
//             default: return 20;
//         }
//     },
//     maxHp(level,base_hp){
//         return level>1 ? level+base_hp:base_hp;
//     },
//     maxSp(color){
//         switch(color){
//             case "pink":
//                 return 4;
//                 break;
//             case "blue":
//                 return 3;
//                 break;
//             case "red":
//                 return 3;
//                 break;
//             case "yellow":
//                 return 6;
//                 break;
//             case "green":
//                 return 6;
//                 break;
//             case "purple":
//                 return 5;
//                 break;
//             case "white":
//                 return 5;
//                 break;
//         }
//     },
//     atk(level,base_atk){
//         return level>1 ? level+base_atk:base_atk;
//     },
//     nextColorPoint(level,qty=1){
//         var tempExp = 0;
//         if(qty<=1){
//             tempExp+=(level+1)*10;
//         } else {
//             //parameter:3: level 1->4
//             for(var i=0;i<qty;i++){
//                 tempExp+=(level+1)*10;
//                 level+=1;
//             }
//         }
        
//         return tempExp;
//     },
//     getNextSpecialTotal(level){
//         //get the card stock requirement to level up the specials
//         switch(level){
//             case 1: return 1;
//             case 2: return 2;
//             default: return 4;
//         }
//     }
// }

// class Parameter {
//     maxHp = 0;
//     maxSp = 0;
//     atk = 0;
//     maxLevel = 0;
//     nextSpecialTotal = 0;


//     constructor(){
//         this.hp = this.getMaxLevel();
//         this.atk = this.getMaxLevel();
//     }

//     getMaxLevel(rarity){
//         switch(rarity){
//             case 1: return 20;
//             case 2: return 25;
//             case 3: return 35;
//             case 4: return 40;
//             case 5: return 50;
//             case 6: case 7:
//                 return 60;
//             default: return 20;
//         }
//     }

//     getNextExp(level,qty=1){
//         var tempExp = 0;
//         if(qty<=1){
//             tempExp+=(level+1)*10;
//         } else {
//             //parameter:3: level 1->4
//             for(var i=0;i<qty;i++){
//                 tempExp+=(level+1)*10;
//                 level+=1;
//             }
//         }
        
//         return tempExp;
//     }

//     getHp(level,base_hp){
//         return level>1 ? level+base_hp:base_hp;
//     }

//     getAtk(level,base_atk){
//         return level>1 ? level+base_atk:base_atk;
//     }

//     getSp(color){
//         switch(color){
//             case "pink":
//                 return 4;
//                 break;
//             case "blue":
//                 return 3;
//                 break;
//             case "red":
//                 return 3;
//                 break;
//             case "yellow":
//                 return 6;
//                 break;
//             case "green":
//                 return 6;
//                 break;
//             case "purple":
//                 return 5;
//                 break;
//             case "white":
//                 return 5;
//                 break;
//         }
        
//     }

//     getNextSpecialTotal(level){
//         //get the card stock requirement to level up the specials
//         switch(level){
//             case 1: return 1;
//             case 2: return 2;
//             default: return 4;
//         }
//     }
    
// }

class CardInventory extends Card {
    //contains protected columns, used for constructor
    static tablename = DBM_Card_Inventory.TABLENAME;
    static columns = DBM_Card_Inventory.columns;
    static limit = limit;
    static emoji = emoji;

    static itemUpgradeMaterial = {
        gold:{
            max_heart: "cfrg001",
            splash_star: "cfrg002",
            yes5gogo: "cfrg003",
            fresh: "cfrg004",
            heartcatch: "cfrg005",
            suite: "cfrg006",
            smile: "cfrg007",
            dokidoki: "cfrg008",
            happiness_charge: "cfrg009",
            go_princess: "cfrg010",
            mahou_tsukai: "cfrg011",
            kirakira: "cfrg012",
            hugtto: "cfrg013",
            star_twinkle: "cfrg014",
            healin_good: "cfrg015",
            tropical_rouge: "cfrg016"
        }
    }

    id_user=null;
    id_card=null;
    level=null;
    level_special=null;
    stock=null;
    is_gold=null;
    received_at=null;

    //modifier
    isPackCompleted = false;

    // parameter =  {
    //     maxLevel(rarity){
    //         switch(rarity){
    //             case 1: return 20;
    //             case 2: return 25;
    //             case 3: return 35;
    //             case 4: return 40;
    //             case 5: return 50;
    //             case 6: case 7:
    //                 return 60;
    //             default: return 20;
    //         }
    //     },
    //     hp(level,base_hp){
    //         return level>1 ? level+base_hp:base_hp;
    //     },
    //     atk(level,base_atk){
    //         return level>1 ? level+base_atk:base_atk;
    //     },
    //     sp(color){
    //         switch(color){
    //             case "pink":
    //                 return 4;
    //                 break;
    //             case "blue":
    //                 return 3;
    //                 break;
    //             case "red":
    //                 return 3;
    //                 break;
    //             case "yellow":
    //                 return 6;
    //                 break;
    //             case "green":
    //                 return 6;
    //                 break;
    //             case "purple":
    //                 return 5;
    //                 break;
    //             case "white":
    //                 return 5;
    //                 break;
    //         }
    //     },
    //     nextColorPoint(level,qty=1){
    //         var tempExp = 0;
    //         if(qty<=1){
    //             tempExp+=(level+1)*10;
    //         } else {
    //             //parameter:3: level 1->4
    //             for(var i=0;i<qty;i++){
    //                 tempExp+=(level+1)*10;
    //                 level+=1;
    //             }
    //         }
            
    //         return tempExp;
    //     },
    //     getNextSpecialTotal(level){
    //         //get the card stock requirement to level up the specials
    //         switch(level){
    //             case 1: return 1;
    //             case 2: return 2;
    //             default: return 4;
    //         }
    //     }
    // }
    maxHp=null;
    atk=null;

    constructor(cardInventoryData=null, cardData=null){
        super(cardData);
        
        // if(cardInventoryData==null) return null;

        for(var key in cardInventoryData){
            this[key] = cardInventoryData[key];
        //     // ALLOWED.includes(key)?
        //     //     this[key] = cardInventoryData[key]:
        //     //     ;
        }

        if(cardData!=null){
            for(var key in cardData){
                this[key] = cardData[key];
            }
        }

        this.maxHp = this.parameter.maxHp(this.level, this.hp_base);//assign max hp
        this.atk = this.parameter.atk(this.level, this.atk_base);
    }

    static async getDataByIdUser(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(this.columns.id_user, userId);
        mapWhere.set(this.columns.id_card, cardId);
        var result = await DB.select(this.tablename, mapWhere);
        if(result[0]!=null){
            return result[0];
        } else {
            return null;
        }
    }

    /**
     * @description will return search results by pack in multiple object
     */
    static async getDataByPack(userId, pack, duplicateOnly){
        var query = `select cd.*, 
        inv.${this.columns.id_user}, inv.${this.columns.is_gold}, inv.${this.columns.stock}, inv.${this.columns.level}, inv.${this.columns.level_special} 
        from ${super.tablename} cd 
        left join ${this.tablename} inv 
        on cd.${super.columns.id_card} = inv.${this.columns.id_card} and 
        inv.${this.columns.id_user} = ?
        where cd.${super.columns.pack}=? `;
        if(duplicateOnly) query+=` AND inv.${this.columns.stock}>0`;

        var result = await DBConn.conn.query(query, [userId, pack]);
        var ret = {
            cardData:[],
            cardInventoryData:[],
        }

        if(result[0]!=null){
            for(var i=0;i<result.length; i++){
                var cardData = {};
                var cardInventoryData = {};

                for(var key in result[i]){
                    var colVal = result[i][key];
                    if(key in super.columns){
                        cardData[key] = colVal;
                    } else {
                        cardInventoryData[key] = colVal;
                    }
                }

                ret.cardData.push(cardData);
                //check if user own the card/not
                if(cardInventoryData[this.columns.id_user]==null) cardInventoryData = null;
                ret.cardInventoryData.push(cardInventoryData);
            }

            return ret;
        } else {
            return null;
        }
    }

    /**
     * @description Used to search card data & inventory. Will return null if card data not found
     */
    static async getJoinUserData(userId, cardId){
        var query = `SELECT cd.*,
        ci.${this.columns.id_user},
        ci.${this.columns.level},
        ci.${this.columns.level_special},
        ci.${this.columns.stock},
        ci.${this.columns.is_gold},
        ci.${this.columns.received_at} 
        from ${super.tablename} cd 
        left join ${this.tablename} ci 
        ON cd.${super.columns.id_card}=ci.${this.columns.id_card} and 
        ci.${this.columns.id_user}=?  
        where cd.${super.columns.id_card}=? 
        LIMIT 1`;
        var result = await DBConn.conn.query(query, [userId, cardId]);
        var ret = {
            cardData:{},
            cardInventoryData:{},
        }

        //check for card data
        if(result[0]!=null){
            for(var key in result[0]){
                var colVal = result[0][key];
                if(key in super.columns){
                    ret.cardData[key] = colVal;
                } else {
                    ret.cardInventoryData[key] = colVal;
                }
            }

            //check if user own the card/not
            if(ret.cardInventoryData[this.columns.id_user]==null) ret.cardInventoryData = null;
            return ret;
        } else {
            return null;//return null if not found
        }
    }

    static async getTotalByPack(userId){
        var query = `select cd.${DBM_Card_Data.columns.pack}, count(inv.${DBM_Card_Inventory.columns.id_user}) as total, 
        cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series} 
        from ${DBM_Card_Data.TABLENAME} cd 
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user}=? 
        group by cd.${DBM_Card_Data.columns.pack}`;
        var cardDataInventory = await DBConn.conn.query(query, [userId]);
        return cardDataInventory;
    }

    static async getPackTotal(userId, pack){
        var query = `SELECT cd.${super.columns.pack}, count(inv.${this.columns.id_card}) as total
        from ${super.tablename} cd  
        left join ${this.tablename} inv 
        on (cd.${super.columns.id_card}=inv.${this.columns.id_card} and 
        inv.${this.columns.id_user}=?)
        where cd.${super.columns.pack}=?`;
        var packTotalData = await DBConn.conn.query(query, [userId, pack]);
        return packTotalData[0]["total"];
    }

    static async getTotalAll(userId){
        var query = `SELECT count(*) as total 
        FROM ${this.tablename} 
        WHERE ${this.columns.id_user}=?`;
        var total = await DBConn.conn.query(query, [userId]);
        return total[0]["total"];
    }

    // async getInventoryPackTotal(pack){
    //     var query = `SELECT cd.${DataCard.columns.pack}, count(inv.${CardInventory.columns.id_card}) as total
    //     from ${DataCard.tablename} cd  
    //     left join ${CardInventory.tablename} inv 
    //     on (cd.${DataCard.columns.id_card}=inv.${CardInventory.columns.id_card} and 
    //     inv.${CardInventory.columns.id_user}=?)
    //     where cd.${DataCard.columns.pack}=?`;
    //     var packTotalData = await DBConn.conn.query(query, [this.id_user, pack]);
    //     return packTotalData[0]["total"];
    // }

    static async updateStock(userId, cardId, qty=1, notifReturn=false){
        //check if card existed/not
        var cardInventoryData = await this.getDataByIdUser(userId, cardId);
        if(cardInventoryData==null){//insert if not found
            qty-=1;
            if(qty<0) qty = 0;//ensures qty is not negative
            var paramInsert = new Map();
            paramInsert.set(this.columns.id_card, cardId);
            paramInsert.set(this.columns.id_user, userId);
            paramInsert.set(this.columns.stock, qty);
            try {
                await DB.insert(this.tablename, paramInsert);
            } catch{}

            if(notifReturn) return -1;//will return -1 if notifReturn is set to true
        } else {
            var cardInventory = new CardInventory(cardInventoryData);
            cardInventory.stock+=qty;
            await cardInventory.updateStock();

            if(notifReturn) return cardInventory.stock;//will return new stock if notifReturn is set to true
        }
    }
    
    getReceivedDate(){
        return GlobalFunctions.convertDateTime(this.received_at);
    }

    levelSync(newLevel){
        this.level = newLevel;
        this.paramSync();
    }

    paramSync(){
        this.maxHp = this.parameter.maxHp(this.level, this.hp_base);//assign max hp
        this.atk = this.parameter.atk(this.level, this.atk_base);
    }

    getGoldUpgradeMaterial(){
        return CardInventory.itemUpgradeMaterial.gold[this.series];
    }

    // getIdCard(){
    //     if(this.isAvailable(this.id_card)){
    //         return this.id_card;
    //     }
    // }

    getIdUser(){
        return this.id_user;
    }

    getLevel(){
        return this.level;
    }

    getLevelSpecial(){
        return this.level_special;
    }

    getStock(){
        if(this.stock!==null){
            return this.stock;
        }
        
        return -1;
    }

    isGold(){
        return this.is_gold;
    }

    isHaveCard(){
        if(this.stock!==null){
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description check if able to level up with color point
     */
    canLevelUpColor(colorPoint, amount=1){
        //rarity 1-5: level up with color point
        if(this.level+amount>this.getMaxLevel()){//check for max level
            return false;
        } else if(this.rarity<=4){
            var pointCost = Card.parameter.nextColorPoint(this.level, amount);
            return colorPoint>=pointCost ? true : false;
        } else {//5-7: level up with duplicate card
            return false;
        }
    }

    //rarity 6-7: level up with duplicate
    canLevelUpDuplicate(amount=1){
        if(this.level+amount>this.getMaxLevel()){//check for max level
            return false;
        } else if(this.rarity>=5){
            return this.stock>=amount ? true : false;
        } else {
            return false;
        }
    }

    //level up card special level
    canLevelUpSpecial(amount=1){
        if(this.level_special+amount>this.getMaxSpecialLevel()){//check for max special level
            return false;
        } else if(this.stock>=amount){
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {string} key custom key to be added
     * @param {string} value custom value to be added
     */
    addKeyVal(key, value){
        if(PROTECTED_KEY.includes(key)==false){
            this[key] = value;
        }
    }

    /**
     * @param {string} key get custom added key
     */
    getKeyVal(key){
        return this[key];
    }

    isCompleted(){
        return false;
    }

    /**
     * @param {boolean} isOriginal if true: will return original rarity format with non gold checking
     */
    getRarityEmoji(isOriginal=false){
        return isOriginal ? 
        CardInventory.emoji.rarity(false, this.rarity) : CardInventory.emoji.rarity(this.is_gold, this.rarity);
    }

    getRarity(withEmoji=true, isOriginal=false){
        return withEmoji? 
        `${this.getRarityEmoji(isOriginal)}${this.rarity}`:`${this.rarity}`;
    }

    getImgDisplay(){
        if(this.isGold()){
            return this.img_url_upgrade1;
        } else {
            return this.img_url;
        }
    }

    validation(){
        if(this.level>=this.parameter.maxLevel(this.rarity))//ensures level is not reaching cap
            this.level = this.parameter.maxLevel(this.rarity);
        if(this.stock<0) this.stock = 0;//ensures stock is not negative
        if(this.stock>limit.card) this.stock = limit.card;//ensures stock is not over limit
    }

    //db
    /**
     * @description update the stock
     */
    async updateStock(){
        this.validation();
        let column = [//columns to be updated:
            DBM_Card_Inventory.columns.stock,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();
        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }

        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }
        await DB.update(DBM_Card_Inventory.TABLENAME, paramSet, paramWhere);
    }

    /**
     * @description update all data
     */
    async update(){
        // if(this[UPDATE_KEY].length<=0) return;
        this.validation();
        let column = [//columns to be updated:
            DBM_Card_Inventory.columns.level,
            DBM_Card_Inventory.columns.level_special,
            DBM_Card_Inventory.columns.stock,
            DBM_Card_Inventory.columns.is_gold,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(DBM_Card_Inventory.TABLENAME, paramSet, paramWhere);
    }
}

module.exports = CardInventory;
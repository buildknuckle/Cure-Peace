const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
// const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const DataCard = require("./Card");
// const SpackModule = require("./Series");
const GProperties = require('../Properties');
const GlobalFunctions = require('../../GlobalFunctions');

//database modifier
const PROTECTED_KEY = Object.keys(DBM_Card_Inventory.columns);
const UPDATE_KEY = [
    DBM_Card_Inventory.columns.id_user,
    DBM_Card_Inventory.columns.id_card,
];

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
            case 6: case 7:
                return 60;
            default: return 20;
        }
    },
    maxHp(level,base_hp){
        return level>1 ? level+base_hp:base_hp;
    },
    maxSp(color){
        switch(color){
            case "pink":
                return 4;
                break;
            case "blue":
                return 3;
                break;
            case "red":
                return 3;
                break;
            case "yellow":
                return 6;
                break;
            case "green":
                return 6;
                break;
            case "purple":
                return 5;
                break;
            case "white":
                return 5;
                break;
        }
    },
    atk(level,base_atk){
        return level>1 ? level+base_atk:base_atk;
    },
    nextColorPoint(level,qty=1){
        var tempExp = 0;
        if(qty<=1){
            tempExp+=(level+1)*10;
        } else {
            //parameter:3: level 1->4
            for(var i=0;i<qty;i++){
                tempExp+=(level+1)*10;
                level+=1;
            }
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

class CardInventory extends DataCard {
    //contains protected columns, used for constructor
    static tablename = DBM_Card_Inventory.TABLENAME;
    static columns = DBM_Card_Inventory.columns;
    static parameter = parameter;

    id_user=null;
    id_card=null;
    level=null;
    level_special=null;
    stock=null;
    is_gold=null;
    received_at=null;

    //modifier
    emoji = {
        rarity:null,
        hp:emoji.hp,
        atk:emoji.atk,
        sp:emoji.sp
    }

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
    maxLevel=null;
    maxHp=null;
    maxSp=null;
    atk=null;
    nextColorPoint=null;

    Parameter;
    Data;

    constructor(cardInventoryData, cardData={}){
        super(cardData);
        // this.Data = new Data();
        // this.Parameter = new Parameter(cardInventoryData, cardData);
        // console.log(super.dc);
        
        if(cardInventoryData==null) return null;

        for(var key in cardInventoryData){
            if(key==DBM_Card_Inventory.columns.created_at){
                this.received_at = GlobalFunctions.convertDateTime(
                    cardInventoryData[DBM_Card_Inventory.columns.created_at]
                );
            } else {
                this[key] = cardInventoryData[key];
            }
            // ALLOWED.includes(key)?
            //     this[key] = cardInventoryData[key]:
            //     ;
        }

        this.emoji.rarity = emoji.rarity(this.is_gold, this.rarity);//get rarity emoji
        this.maxHp = parameter.maxHp(this.level, this.hp_base);//assign max hp
        this.maxSp = parameter.maxSp(this.color);
        this.atk = parameter.atk(this.level, this.atk_base);
        this.maxLevel = parameter.maxLevel(this.rarity);
        this.nextColorPoint = parameter.nextColorPoint(this.level);
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
    static async getDataByPack(userId, pack){
        var query = `select cd.${super.columns.id_card}, cd.${super.columns.pack}, cd.${super.columns.name}, 
        cd.${super.columns.rarity}, cd.${super.columns.img_url}, cd.${super.columns.hp_base}, cd.${super.columns.atk_base}, cd.${super.columns.color}, cd.${super.columns.series}, cd.${super.columns.img_url_upgrade1}, 
        inv.${this.columns.id_user}, inv.${this.columns.is_gold}, inv.${this.columns.stock}, inv.${this.columns.level}, inv.${this.columns.level_special} 
        from ${super.tablename} cd 
        left join ${this.tablename} inv 
        on cd.${super.columns.id_card} = inv.${this.columns.id_card} and 
        inv.${this.columns.id_user} = ?
        where cd.${super.columns.pack}=?`;

        var result = await DBConn.conn.query(query, [userId, pack]);
        if(result[0]!=null){
            return result;
        } else {
            return null;
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

    getIdCard(){
        if(this.isAvailable(this.id_card)){
            return this.id_card;
        }
    }

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

    getImgDisplay(){
        if(this.isGold()){
            return this.img_url_upgrade1;
        } else {
            return this.img_url;
        }
    }

    // static async updateStockParam(userId, cardId, cardInventoryData=null, qty=1){
    //     if(cardInventoryData==null){
    //         //add new card
    //         var mapAdd = new Map();
    //         mapAdd.set(DBM_Card_Inventory.columns.id_card,cardId);
    //         mapAdd.set(DBM_Card_Inventory.columns.id_user,userId);
    //         if(qty>=1){
    //             mapAdd.set(DBM_Card_Inventory.columns.stock,qty);
    //         }
            
    //         await DB.insert(DBM_Card_Inventory.TABLENAME,mapAdd);
    //     } else {
    //         //get old card stock
    //         var stock = cardInventoryData[DBM_Card_Inventory.columns.stock];
            
    //         if(qty>=0&&stock+qty<Properties.limit.card){
    //             stock+= qty;
    //         } else if(qty<0){
    //             stock-=- qty;
    //         } else {
    //             stock= Properties.limit.card;
    //         }
            
    //         if(qty<0&&stock-qty<=0) stock=0; //prevent negative

    //         var mapSet = new Map();
    //         mapSet.set(DBM_Card_Inventory.columns.stock,stock);
    //         var mapWhere = new Map();
    //         mapWhere.set(DBM_Card_Inventory.columns.id_card, cardInventoryData[DBM_Card_Data.columns.id_card]);
    //         mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
    //         await DB.update(DBM_Card_Inventory.TABLENAME, mapSet, mapWhere);
    //         return stock//return with stock
    //     }
    
    // }
}

class Data {
    constructor(){
    }

    updateStock(){
        console.log("UPDATED");
    }

    async update(){
        // if(this[UPDATE_KEY].length<=0) return;
        
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
            paramSet.set(column[key], super[colVal]);
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(DBM_Card_Inventory.TABLENAME, paramSet, paramWhere);
    }
}

module.exports = CardInventory;
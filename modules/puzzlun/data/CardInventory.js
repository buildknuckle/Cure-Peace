const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

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
    }
}

class CardInventory extends DataCard {
    //contains protected columns, used for constructor
    id_user=null;
    id_card=null;
    level=null;
    level_special=null;
    stock=null;
    is_gold=null;
    created_at=null;

    //modifier
    emoji = {
        rarity:null
    }

    isPackCompleted = false;

    constructor(cardInventoryData, cardData={}){
        super(cardData);
        // console.log(super.dc);
        
        if(cardInventoryData==null) return null;

        for(var key in cardInventoryData){
            this[key] = cardInventoryData[key];
            // ALLOWED.includes(key)?
            //     this[key] = cardInventoryData[key]:
            //     ;
        }

        //get rarity emoji
        this.emoji.rarity = emoji.rarity(this.is_gold, this.rarity);
    }

    static async getDataById(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
        mapWhere.set(DBM_Card_Inventory.columns.id_card, cardId);
        var result = await DB.select(DBM_Card_Inventory.TABLENAME,mapWhere);
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
        var query = `select cd.${DBM_Card_Data.columns.id_card}, cd.${DBM_Card_Data.columns.pack}, cd.${DBM_Card_Data.columns.name}, cd.${DBM_Card_Data.columns.rarity}, cd.${DBM_Card_Data.columns.img_url}, cd.${DBM_Card_Data.columns.hp_base}, cd.${DBM_Card_Data.columns.atk_base}, inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.is_gold}, inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.level}
        from ${DBM_Card_Data.TABLENAME} cd 
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card} = inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user} = ?
        where cd.${DBM_Card_Data.columns.pack}=?`;

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
        if(this.isAvailable(this.id_user)){
            return this[DBM_Card_Inventory.columns.id_user];
        }
        
        return null;
    }

    getLevel(){
        if(this.isAvailable()){
            return this[DBM_Card_Inventory.columns.level];
        }
        
        return null;
    }

    getLevelSpecial(){
        if(this.isAvailable()){
            return this[DBM_Card_Inventory.columns.level_special];
        }
        
        return null;
    }

    getStock(){
        if(this.isAvailable()){
            return this[DBM_Card_Inventory.columns.stock];
        }
        
        return -1;
    }

    isGold(){
        if(this.isAvailable()){
            return Boolean(this[DBM_Card_Inventory.columns.is_gold]);
        }
        
        return false;
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

    // static async getPackTotal(userId, pack){
    //     var query = `SELECT count(*) as total  
    //     FROM ${DBM_Card_Data.TABLENAME} cd, ${DBM_Card_Inventory.TABLENAME} inv 
    //     WHERE cd.${DBM_Card_Data.columns.pack}=? AND cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} AND 
    //     inv.${DBM_Card_Inventory.columns.id_user}=?`;
    //     var result = await DBConn.conn.query(query,[pack, userId]);
    //     if(result[0]==null){
    //         return 0;
    //     } else {
    //         return result[0]['total'];
    //     }
    // }

    async updateData(){
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
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(DBM_Card_Inventory.TABLENAME, paramSet, paramWhere);
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

module.exports = CardInventory;
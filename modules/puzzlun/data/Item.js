const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Item_Data = require('../../../database/model/DBM_Item_Data');
const DBM_Item_Shop_Data = require('../../../database/model/DBM_Item_Shop_Data');
const DBM_Item_Inventory_Data = require('../../../database/model/DBM_Item_Inventory');
const GlobalFunctions = require('../../GlobalFunctions');
const Properties = require('../Properties');
const Currency = Properties.currency;

class Item {
    static tablename = DBM_Item_Data.TABLENAME;
    static columns = DBM_Item_Data.columns;
    
    static category = {
        ingredient_food:{
            name: "food ingredient",
            value: "ingredient_food",
            emoji: "🧉"
        },
        misc_fragment:{
            name: "gold card fragment",
            value: "misc_fragment",
            emoji: "🌟",
        },
        gacha_ticket:{
            name: "gachapon ticket",
            value: "gacha_ticket",
            emoji: "🎫",
        },
        food:{
            name: "food",
            value: "food",
            emoji: "🍲"
        }
    }

    id_item = null;
    name = null;
    description = null;
    keyword_search = null;
    category = null;
    img_url = null;

    constructor(itemData=null){
        if(itemData!=null){
            for(var key in itemData){
                this[key] = itemData[key];
            }
        }
    }

    static async getItemData(idItem){
        var mapWhere = new Map();
        mapWhere.set(DBM_Item_Data.columns.id_item, idItem);
        var cardData = await DB.select(DBM_Item_Data.TABLENAME,mapWhere);
        return cardData[0]!==null? cardData[0]:null;
    }

    static async getItemDataAll(){
        var mapWhere = new Map();
        var cardData = await DB.selectAll(DBM_Item_Data.TABLENAME,mapWhere);
        return cardData[0]!==null ? cardData:null;
    }

    getName(maxLength=0, withImageLink=false){
        let name = this.name;
        if(maxLength>0) name = GlobalFunctions.cutText(name, maxLength);

        return withImageLink ? `[${name}](${this.img_url})` : name;
    }

    getIdItem(withTag=true){
        return withTag? `**[${this.id_item}]**`:this.id_item;
    }

    getCategoryName(){
        return Item.category[this.category].name;
    }

    getCategoryEmoji(){
        return Item.category[this.category].emoji;
    }
}

class ItemFood {
    static foodData = {
        
    };
}

class ItemShop extends Item {
    static tablename = DBM_Item_Shop_Data.TABLENAME;
    static columns = DBM_Item_Shop_Data.columns;

    price;
    currency;

    constructor(itemData=null){
        if(itemData!==null){
            super(itemData);
            for(var key in itemData){
                this[key] = itemData[key];
            }
        }
    }

    static async getItemShopData(arrCategory=null){
        var arrFilter = [];
        var query = `SELECT idat.*, isd.${this.columns.price}, isd.${this.columns.currency} 
        FROM ${super.tablename} idat, ${this.tablename} isd 
        WHERE idat.${super.columns.id_item}=isd.${this.columns.id_item} `;
        if(arrCategory!==null){
            query+=` AND idat.${super.columns.category} IN (`;
            for(var key in arrCategory){
                query+=`?,`;
                arrFilter.push(arrCategory[key]);
            }
            query = query.replace(/,\s*$/, "");//remove last AND and any whitespace
            query+=`)`;
        }

        var result = await DBConn.conn.query(query, arrFilter);
        return result[0]!==undefined? result:null;
    }

    isPurchasable(userCurrency,qty=1){
        return userCurrency>=this.price*qty? true:false;
    }

    getCurrencyName(){
        return Currency[this.currency].name;
    }

    getCurrencyValue(){
        return Currency[this.currency].value;
    }

    getCurrencyEmoji(){
        return Currency[this.currency].emoji;
    }
    
}

class ItemInventory extends Item {
    static UPDATE_KEY = [
        DBM_Item_Inventory_Data.columns.id_user,
        DBM_Item_Inventory_Data.columns.id_item,
    ];

    static tablename = DBM_Item_Inventory_Data.TABLENAME;
    static columns = DBM_Item_Inventory_Data.columns;
    static limit = Object.freeze({
        stock:99
    });

    id= null; 
    id_user= null;
    // id_item= null;
    stock= null;

    constructor(itemInventoryData=null, itemData=null){
        super(itemData);
        if(itemInventoryData!==null){
            for(var key in itemInventoryData){
                this[key] = itemInventoryData[key];
            }
        }
    }

    static async getDataByIdUser(userId, itemId){
        var mapWhere = new Map();
        mapWhere.set(this.columns.id_user, userId);
        mapWhere.set(this.columns.id_item, itemId);
        var result = await DB.select(this.tablename, mapWhere);
        return result[0]!==null ? result[0]:null;
    }

    static async getItemInventoryDataById(userId, itemId){
        var query = `SELECT idat.*,
        inv.${this.columns.id_user},
        inv.${this.columns.stock} 
        from ${super.tablename} idat 
        left join ${this.tablename} inv 
        ON idat.${super.columns.id_item}=inv.${this.columns.id_item} and 
        inv.${this.columns.id_user}=?  
        where idat.${super.columns.id_item}=? 
        LIMIT 1`;
        var result = await DBConn.conn.query(query, [userId, itemId]);
        var ret = {
            itemData:{},
            itemInventoryData:{},
        }

        //check for item data
        if(result[0]!=null){
            for(var key in result[0]){
                var colVal = result[0][key];
                if(key in super.columns){
                    ret.itemData[key] = colVal;
                } else {
                    ret.itemInventoryData[key] = colVal;
                }
            }

            //check if user own the item/not
            if(ret.itemInventoryData[this.columns.id_user]==null) ret.itemInventoryData = null;
            return ret;
        } else {
            return null;//return null if not found
        }
    }

    static async getItemInventoryData(userId, arrCategory=null){
        var arrParam = [userId];
        var query = `SELECT idat.*, inv.${this.columns.id}, inv.${this.columns.id_user}, inv.${this.columns.stock}
        FROM ${super.tablename} idat, ${this.tablename} inv 
        WHERE idat.${super.columns.id_item}=inv.${this.columns.id_item} AND 
        inv.${this.columns.id_user}=? AND inv.${this.columns.stock}>0 `;
        if(arrCategory!==null){
            query+=` AND idat.${super.columns.category} IN (`;
            for(var key in arrCategory){
                query+=`?,`;
                arrParam.push(arrCategory[key]);
            }
            query = query.replace(/,\s*$/, "");//remove last AND and any whitespace
            query+=`)`;
        }

        var result = await DBConn.conn.query(query, arrParam);
        return result[0]!==undefined? result:null;
    }

    static async updateStock(userId, itemId, qty=1){
        //check if item existed/not
        var query = `INSERT INTO ${ItemInventory.tablename} 
        (${ItemInventory.columns.id_user}, ${ItemInventory.columns.id_item})
        SELECT ?, ? FROM dual 
        WHERE NOT EXISTS (SELECT 1 FROM ${ItemInventory.tablename} WHERE 
        ${ItemInventory.columns.id_user} = ? and ${ItemInventory.columns.id_item}=?);
        UPDATE ${ItemInventory.tablename} SET ${this.columns.stock}=${this.columns.stock}+? 
        WHERE ${ItemInventory.columns.id_user} = ? and ${ItemInventory.columns.id_item}=?;`;
        await DBConn.conn.query(query, [userId, itemId, userId, itemId, qty, userId, itemId]);

        // var itemInventoryData = await this.getDataByIdUser(userId, itemId);
        // if(itemInventoryData==null){//insert if not found
        //     if(qty>ItemInventory.limit.stock) qty = ItemInventory.limit.stock;//ensures stock is not over limit
        //     var paramInsert = new Map();
        //     paramInsert.set(this.columns.id_item, itemId);
        //     paramInsert.set(this.columns.id_user, userId);
        //     paramInsert.set(this.columns.stock, qty);
        //     try {
        //         await DB.insert(this.tablename, paramInsert);
        //     } catch{}

        //     if(notifReturn) return -1;//will return -1 if notifReturn is set to true
        // } else {
        //     var itemInventory = new ItemInventory(itemInventoryData);
        //     itemInventory.stock+=qty;
        //     await itemInventory.update();

        //     if(notifReturn) return itemInventory.stock;//will return new stock if notifReturn is set to true
        // }
    }

    validation(){
        if(this.stock<0) this.stock = 0;//ensures stock is not negative
        if(this.stock>ItemInventory.limit.stock) this.stock = ItemInventory.limit.stock;//ensures stock is not over limit
    }

    //db
    /**
     * @description update user item inventory data
     */
     async update(){
        // if(this[UPDATE_KEY].length<=0) return;
        this.validation();
        let column = [//columns to be updated:
            ItemInventory.columns.stock,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in ItemInventory.UPDATE_KEY){
            let updateKey = ItemInventory.UPDATE_KEY[key];
            paramWhere.set(ItemInventory.UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(ItemInventory.tablename, paramSet, paramWhere);
    }

}

module.exports = {Item, ItemShop, ItemInventory};
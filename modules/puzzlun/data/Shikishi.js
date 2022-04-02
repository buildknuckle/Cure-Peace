const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const GlobalFunctions = require('../../GlobalFunctions');

const DBM_Shikishi_Data = require('../../../database/model/DBM_Shikishi_Data');
const DBM_Shikishi_Inventory = require('../../../database/model/DBM_Shikishi_Inventory');

const {Series} = require("./Series");
const {Character} = require("./Character");
const Properties = require('../Properties');

class Shikishi {
    static tablename = DBM_Shikishi_Data.TABLENAME;
    static columns = DBM_Shikishi_Data.columns;
    static emoji = "🖼️";
    static total = 0;

    id_shikishi=null;
    name=null;
    series=null;
    pack=null;
    img_url=null;

    Series;

    constructor(shikishiData=null){
        if(shikishiData!==null){
            for(var key in shikishiData){
                var colVal = shikishiData[key];
                this[key] = shikishiData[key];

                switch(key){
                    case Shikishi.columns.series:
                        this.Series = new Series(JSON.parse(colVal));
                        break;
                }
            }
        }
    }

    static async getShikishiData(idShikishi){
        var mapWhere = new Map();
        mapWhere.set(this.columns.id_shikishi, idShikishi);

        var shikishiData = await DB.select(DBM_Card_Data.TABLENAME,mapWhere);
        return await shikishiData[0]!==null? shikishiData[0]:null;

    }

    static async randomizeShikishiData(){
        return await DB.selectRandom(this.tablename);
    }

    getIdShikishi(withTag=true){
        return withTag? `**[${this.id_shikishi}]**`:this.id_shikishi;
    }

    getName(maxLength=0, withImageLink=false){
        let name = this.name;
        if(maxLength>0) name = GlobalFunctions.cutText(name, maxLength);

        return withImageLink ? `[${name}](${this.img_url})` : name;
    }

    getShikishiEmoji(){
        return Shikishi.emoji;
    }

    static async init(){
        //get shikishi total
        var result = await DB.count(this.tablename);
        this.total = result[0]["total"];
    }

}

class ShikishiInventory extends Shikishi {
    static tablename = DBM_Shikishi_Inventory.TABLENAME;
    static columns = DBM_Shikishi_Inventory.columns;

    static limit = Object.freeze({
        stock:99
    });

    id=null;
    id_user=null;
    stock=null;
    received_at=null;

    constructor(shikishiInventoryData=null, shikishiData=null){
        super(shikishiData);
        
        for(var key in shikishiInventoryData){
            this[key] = shikishiInventoryData[key];
        }

    }

    static async getShikishiInventoryData(userId, series=null, filter=null){
        var arrFilter = [userId];
        var query = ``;

        if(filter==null||filter=="duplicate"){
            query = `select sdat.*, inv.${this.columns.id_user}, inv.${this.columns.stock} 
            from ${super.tablename} sdat 
            left join ${this.tablename} inv 
            on sdat.${super.columns.id_shikishi} = inv.${this.columns.id_shikishi} and 
            inv.${this.columns.id_user} = ? `;

            if(series!==null){
                query+=`where `;
                if(series!==null){
                    query+=` sdat.${super.columns.series} like ? AND `;
                    arrFilter.push(`%${series}%`);
                }
                // if(filter=="duplicate") query+=` inv.${this.columns.stock}>0 `;
            }
            query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
        } else if(filter=="owned") {//filter with
            query =  `SELECT sdat.*, inv.${this.columns.id_user}, inv.${this.columns.stock} 
            FROM ${super.tablename} sdat, ${this.tablename} inv 
            WHERE sdat.${super.columns.id_shikishi} = inv.${this.columns.id_shikishi} and
            inv.${this.columns.id_user} = ? `;
            
            if(series!==null){
                if(series!==null){
                    query+=` AND sdat.${super.columns.series} like ? `;
                    arrFilter.push(`%${series}%`);
                }
            }
            query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
        }

        query+=` ORDER BY sdat.${super.columns.name}`;
        
        var result = await DBConn.conn.query(query, arrFilter);
        var ret = {
            shikishiData:[],
            shikishiInventoryData:[],
        }

        if(result[0]!=null){
            for(var i=0;i<result.length; i++){
                var shikishiData = {};
                var shikishiInventoryData = {};

                for(var key in result[i]){
                    var colVal = result[i][key];
                    if(key in super.columns){
                        shikishiData[key] = colVal;
                    } else {
                        shikishiInventoryData[key] = colVal;
                    }
                }

                ret.shikishiData.push(shikishiData);
                //check if user own the card/not
                if(shikishiInventoryData[this.columns.id_user]==null) shikishiInventoryData = null;
                ret.shikishiInventoryData.push(shikishiInventoryData);
            }

            return ret;
        } else {
            return null;
        }

    }

    static async getShikishiInventoryDataById(userId, shikishiId){
        var query = `SELECT idat.*,
        inv.${this.columns.id_user},
        inv.${this.columns.stock} 
        from ${super.tablename} idat 
        left join ${this.tablename} inv 
        ON idat.${super.columns.id_shikishi}=inv.${this.columns.id_shikishi} and 
        inv.${this.columns.id_user}=?  
        where idat.${super.columns.id_shikishi}=? 
        LIMIT 1`;

        var result = await DBConn.conn.query(query, [userId, shikishiId]);
        var ret = {
            shikishiData:{},
            shikishiInventoryData:{},
        }

        //check for shikishi data
        if(result[0]!=null){
            for(var key in result[0]){
                var colVal = result[0][key];
                if(key in super.columns){
                    ret.shikishiData[key] = colVal;
                } else {
                    ret.shikishiInventoryData[key] = colVal;
                }
            }

            //check if user own the item/not
            if(ret.shikishiInventoryData[this.columns.id_user]==null) ret.shikishiInventoryData = null;
            return ret;
        } else {
            return null;//return null if not found
        }

    }

    static async updateStock(userId, shikishiId, qty=1){
        //check if shikishi existed/not
        var query = `INSERT INTO ${this.tablename} 
        (${this.columns.id_user}, ${this.columns.id_shikishi})
        SELECT ?, ? FROM dual 
        WHERE NOT EXISTS (SELECT 1 FROM ${this.tablename} WHERE 
        ${this.columns.id_user} = ? and ${this.columns.id_shikishi}=?);
        UPDATE ${this.tablename} SET ${this.columns.stock}=${this.columns.stock}+? 
        WHERE ${this.columns.id_user} = ? and ${this.columns.id_shikishi}=?;`;
        await DBConn.conn.query(query, [userId, shikishiId, userId, shikishiId, qty, userId, shikishiId]);
    }

    isHaveShikishi(){
        return this.stock!==null? true: false;
    }
}

module.exports = {Shikishi, ShikishiInventory}
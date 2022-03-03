const stripIndents = require("common-tags/lib/stripIndents")
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, User} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('discordjs-button-pagination');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');


const DataModule = require("./Data");
const CpackModule = require("./Cpack");
const spack = require("./Series");
const GProperties = require('./Properties');

// const GuildModule = require("./Guild");

//initialize necessary properties
async function init() {
    //load total card for all pack
    // var query = `select cd.${DBM_Card_Data.columns.pack}, count(cd.${DBM_Card_Data.columns.pack}) as total, 
    //     cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series}
    //     from ${DBM_Card_Data.TABLENAME} cd
    //     group by cd.${DBM_Card_Data.columns.pack}`;
    // var cardData = await DBConn.conn.query(query, []);
    // for(var i=0;i<cardData.length;i++)
    //     CpackModule[cardData[i][DBM_Card_Data.columns.pack]].Properties.total = cardData[i]["total"];
    
    // //init yes 5 gogo data
    // await Series.yes5gogo.init();
    // console.log("Card Modules : Loaded ✓");
}



const GEmbed = require('./Embed');

class Emoji {
    static rarity(rarity=1,cardDataInventory=null){
        //check if upgraded to cardDataInventory given/not
        if(cardDataInventory!=null){
            if(cardDataInventory[DBM_Card_Inventory.columns.is_gold]){
                return `🌟`;
            }
        }

        switch(rarity){
            case 7:
                return GProperties.emoji.r7;
            case 6:
                return GProperties.emoji.r6;
            default:
                return GProperties.emoji.r1;
        }
        
    }

    static enhancement(cardInventoryData){
        var txtIcon = "";
        //check for gold completion
        if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
            txtIcon+=`🌟`;
        }
        return txtIcon;
    }
}

async function getCardData(cardId){
    var mapWhere = new Map();
    mapWhere.set(DBM_Card_Data.columns.id_card,cardId);
    var cardData = await DB.select(DBM_Card_Data.TABLENAME,mapWhere);
    return cardData[0];
}

async function getCardDataMultiple(arrCardId){
    var cardData = await DB.selectIn(DBM_Card_Data.TABLENAME, DBM_Card_Data.columns.id_card, arrCardId);
    return cardData;
}

class Inventory {
    static async getPackTotal(userId, pack){
        var query = `SELECT count(*) as total  
        FROM ${DBM_Card_Data.TABLENAME} cd, ${DBM_Card_Inventory.TABLENAME} inv 
        WHERE cd.${DBM_Card_Data.columns.pack}=? AND cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} AND 
        inv.${DBM_Card_Inventory.columns.id_user}=?`;
        var result = await DBConn.conn.query(query,[pack, userId]);
        if(result[0]==null){
            return 0;
        } else {
            return result[0]['total'];
        }
    }

    static async getStock(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Inventory.columns.id_card, cardId);
        mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
        var result = await DB.select(DBM_Card_Inventory.TABLENAME,mapWhere);
        if(result[0]==null){
            return -1;
        } else {
            return result[0][DBM_Card_Inventory.columns.stock];
        }
    }

    static async getData(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Inventory.columns.id_card, cardId);
        mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
        var result = await DB.select(DBM_Card_Inventory.TABLENAME,mapWhere);
        if(result[0]==null){
            return null;
        } else {
            return result[0];
        }
    }

    static async updateStockParam(userId, cardId, cardInventoryData=null, qty=1){
        if(cardInventoryData==null){
            //add new card
            var mapAdd = new Map();
            mapAdd.set(DBM_Card_Inventory.columns.id_card,cardId);
            mapAdd.set(DBM_Card_Inventory.columns.id_user,userId);
            if(qty>=1){
                mapAdd.set(DBM_Card_Inventory.columns.stock,qty);
            }
            
            await DB.insert(DBM_Card_Inventory.TABLENAME,mapAdd);
        } else {
            //get old card stock
            var stock = cardInventoryData[DBM_Card_Inventory.columns.stock];
            
            if(qty>=0&&stock+qty<GProperties.limit.card){
                stock+= qty;
            } else if(qty<0){
                stock-=- qty;
            } else {
                stock= GProperties.limit.card;
            }
            
            if(qty<0&&stock-qty<=0) stock=0; //prevent negative

            var mapSet = new Map();
            mapSet.set(DBM_Card_Inventory.columns.stock,stock);
            var mapWhere = new Map();
            mapWhere.set(DBM_Card_Inventory.columns.id_card, cardInventoryData[DBM_Card_Data.columns.id_card]);
            mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
            await DB.update(DBM_Card_Inventory.TABLENAME, mapSet, mapWhere);
            return stock//return with stock
        }
    
    }
}

class Modifier {
    static img(cardInventoryData, cardData){
        
        return cardInventoryData[DBM_Card_Inventory.columns.is_gold] ? 
            cardData[DBM_Card_Data.columns.img_url_upgrade1]:cardData[DBM_Card_Data.columns.img_url];
    }
}

module.exports = {
    init, Emoji, Inventory, Modifier, getCardData, getCardDataMultiple
}
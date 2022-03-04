const stripIndents = require("common-tags/lib/stripIndents")
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, User} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('discordjs-button-pagination');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');

const DataModule = require("./Data");
const DataCard = DataModule.Card;
const DataCardInventory = DataModule.CardInventory;
const {Series, SPack} = require("./Series");
const {Character, CPack} = require("./Characters");
const GProperties = require('./Properties');
const GEmbed = require('./Embed');

// const GuildModule = require("./Guild");

//initialize necessary properties
async function init() {
    //load total card for all pack
    var query = `select cd.${DBM_Card_Data.columns.pack}, count(cd.${DBM_Card_Data.columns.pack}) as total, 
        cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series}
        from ${DBM_Card_Data.TABLENAME} cd
        group by cd.${DBM_Card_Data.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++){
        var dataCard = new DataCard(cardData[i]);
        CPack[dataCard.data.pack].properties.total = cardData[i]["total"];
    }

    var userCardInventory = new DataCardInventory(
        await DataCardInventory.getData("145584315839938561","nami301"),
        await DataCard.getData("tsha301")
    );

    userCardInventory.data.stock = 0;

    userCardInventory.updateData();

    // console.log(userCardInventory);
    
    // //init yes 5 gogo data
    // await Series.yes5gogo.init();
    // console.log("Card Modules : Loaded ✓");
}

// class Inventory {

//     static async updateStockParam(userId, cardId, cardInventoryData=null, qty=1){
//         if(cardInventoryData==null){
//             //add new card
//             var mapAdd = new Map();
//             mapAdd.set(DBM_Card_Inventory.columns.id_card,cardId);
//             mapAdd.set(DBM_Card_Inventory.columns.id_user,userId);
//             if(qty>=1){
//                 mapAdd.set(DBM_Card_Inventory.columns.stock,qty);
//             }
            
//             await DB.insert(DBM_Card_Inventory.TABLENAME,mapAdd);
//         } else {
//             //get old card stock
//             var stock = cardInventoryData[DBM_Card_Inventory.columns.stock];
            
//             if(qty>=0&&stock+qty<GProperties.limit.card){
//                 stock+= qty;
//             } else if(qty<0){
//                 stock-=- qty;
//             } else {
//                 stock= GProperties.limit.card;
//             }
            
//             if(qty<0&&stock-qty<=0) stock=0; //prevent negative

//             var mapSet = new Map();
//             mapSet.set(DBM_Card_Inventory.columns.stock,stock);
//             var mapWhere = new Map();
//             mapWhere.set(DBM_Card_Inventory.columns.id_card, cardInventoryData[DBM_Card_Data.columns.id_card]);
//             mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
//             await DB.update(DBM_Card_Inventory.TABLENAME, mapSet, mapWhere);
//             return stock//return with stock
//         }
    
//     }
// }

class Modifier {
    static img(cardInventoryData, cardData){
        
        return cardInventoryData[DBM_Card_Inventory.columns.is_gold] ? 
            cardData[DBM_Card_Data.columns.img_url_upgrade1]:cardData[DBM_Card_Data.columns.img_url];
    }
}

module.exports = {
    init, Modifier, 
    // getCardData, getCardDataMultiple
}
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');

const DataCard = require("./Card");
const SpackModule = require("../Series");
const GProperties = require('../Properties');
const GlobalFunctions = require('../../GlobalFunctions');


// function printInventory(objUserData, pack, interaction){
//     var arrPages = []; //prepare paging embed
    
//     var query = `select cd.${DBM_Card_Data.columns.id_card}, cd.${DBM_Card_Data.columns.pack}, cd.${DBM_Card_Data.columns.name}, cd.${DBM_Card_Data.columns.rarity}, cd.${DBM_Card_Data.columns.img_url}, inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.is_gold}, inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.level}
//     from ${DBM_Card_Data.TABLENAME} cd 
//     left join ${DBM_Card_Inventory.TABLENAME} inv 
//     on cd.${DBM_Card_Data.columns.id_card} = inv.${DBM_Card_Inventory.columns.id_card} and 
//     inv.${DBM_Card_Inventory.columns.id_user} = ?
//     where cd.${DBM_Card_Data.columns.pack}=?`;
    
//     var cardDataInventory = await DBConn.conn.query(query, [objUserData.id, pack]);
//     //validation if pack exists/not
//     if(cardDataInventory.length<=0){
//         var packByColor = {pink:``,blue:``,yellow:``,purple:``,red:``,green:``,white:``};
//         for(var pack in CpackModule){
//             var series = CpackModule[pack].Properties.series;
//             packByColor[CpackModule[pack].Properties.color]+=`${SpackModule[series].Properties.icon.mascot_emoji} ${GlobalFunctions.capitalize(pack)}\n`;
//         }

//         return interaction.reply({embeds:[
//             Embed.builder(":x: I can't find that card pack. Here are the list for available card pack:", objUserData, {
//                 color:Embed.color.danger,
//                 fields:[
//                     {
//                         name:`${GProperties.emoji.color_pink} Pink:`,
//                         value:packByColor.pink,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_blue} Blue:`,
//                         value:packByColor.blue,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_yellow} Yellow:`,
//                         value:packByColor.yellow,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_purple} Purple:`,
//                         value:packByColor.purple,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_red} Red:`,
//                         value:packByColor.red,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_green} Green:`,
//                         value:packByColor.green,
//                         inline:true
//                     },
//                     {
//                         name:`${GProperties.emoji.color_white} White:`,
//                         value:packByColor.white,
//                         inline:true
//                     }
//                 ]
//             })
//         ], ephemeral:true});
//     }

//     var pack = cardDataInventory[0][DBM_Card_Data.columns.pack];
//     var color = CpackModule[pack].Properties.color; var iconColor = GProperties.emoji[`color_${color}`];
//     var alterEgo = CpackModule[pack].Properties.alter_ego;
//     var icon = CpackModule[pack].Properties.icon;
//     var max = CpackModule[pack].Properties.total;

//     var idx = 0; var maxIdx = 4; var txtInventory = ``;
//     var total = {
//         normal:cardDataInventory.filter(
//             function (item) {
//                 return item[DBM_Card_Inventory.columns.id_user] != null;
//             }
//         ).length,
//         gold:cardDataInventory.filter(
//             function (item) {
//                 return item[DBM_Card_Inventory.columns.is_gold] == 1;
//             }
//         ).length
//     };
    
//     var arrFields = [];
//     for(var i=0;i<cardDataInventory.length;i++){
//         var iconOwned = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
//             GProperties.emoji.aoi_check_green : GProperties.emoji.aoi_x;
//         var rarity = cardDataInventory[i][DBM_Card_Data.columns.rarity];
//         var img = cardDataInventory[i][DBM_Card_Data.columns.img_url];
//         var id = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
//         `${cardDataInventory[i][DBM_Card_Data.columns.id_card]}` : "???";
//         var displayName = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
//         `[${cardDataInventory[i][DBM_Card_Data.columns.name]}](${img})` : "???";
//         var stock = cardDataInventory[i][DBM_Card_Inventory.columns.stock]>1 ? 
//         `x${cardDataInventory[i][DBM_Card_Inventory.columns.stock]}`:"";
        
//         //check for gold
//         // iconOwned = cardDataInventory[i][DBM_Card_Data.columns.is_gold]==1 && cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
//         // GProperties.emoji.aoi_check_green:GProperties.emoji.aoi_x;
        
//         arrFields.push({
//             name:`${GProperties.emoji.r1}${rarity}: ${id} ${stock}`,
//             value:displayName
//         });
        
//         if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
//             arrPages.push(Embed.builder(
//                 stripIndents`**Duplicate:**/${Properties.limit.card}
//                 **Normal:** ${total.normal}/ ${max} 
//                 **Gold:** ${total.gold}/${max}`,objUserData,{
//                 color:Embed.color[color],
//                 title:`${iconColor} ${GlobalFunctions.capitalize(pack)}/${alterEgo} Inventory:`,
//                 thumbnail:icon,
//                 fields:arrFields
//             }));
//             arrFields = [];
//             idx = 0;
//         } else {
//             idx++;
//         }

//     }

//     return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);

//     // for(var item in cardDataInventory){
//     //     console.log(item);
//     //     ctr++;
//     // }

//     // console.log(color);
//     //init embed
//     // var objEmbed = Embed.builder(``,objUserData, {
//     //     color:Embed.color[]
//     // });

// }

class CardInventory extends DataCard {
    UPDATE_KEY = [
        DBM_Card_Inventory.columns.id_user,
        DBM_Card_Inventory.columns.id_card,
    ];
    
    data = {
        id:null,
        id_user:null,
        id_card:null,
        level:null,
        level_special:null,
        stock:null,
        is_gold:null,
        created_at:null,
    };

    //modifier
    emoji = {
        rarity:null
    }

    constructor(cardInventoryData, cardData={}){
        super(cardData);
        
        if(cardInventoryData==null){
            return this.data = null;
        }

        for(var key in cardInventoryData){
            this.data[key] = cardInventoryData[key];
        }

        //check for rarity enhancement
        if(this.data[DBM_Card_Inventory.columns.is_gold]){
            this.emoji.rarity = `🌟`;
        } else {
            switch(this.data[DBM_Card_Data.columns.rarity]){
                case 7:
                    this.emoji.rarity = "<:r7:935903814358270023>";
                case 6:
                    this.emoji.rarity = "<:r6:935903799317499954>";
                default:
                    this.emoji.rarity = "<:r1:935903782770966528>";
            }
        }

    }

    static async getData(userId, cardId){
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

    isAvailable(){
        return this.data!=null ? true:false;
    }

    getId(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.id_card in this.data){
                return this.data[DBM_Card_Inventory.columns.id_card];
            }
        }
        
        return null;
    }

    getIdUser(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.id_user in this.data){
                return this.data[DBM_Card_Inventory.columns.id_user];
            }
        }
        
        return null;
    }

    getLevel(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.level in this.data){
                return this.data[DBM_Card_Inventory.columns.level];
            }
        }
        
        return null;
    }

    getLevelSpecial(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.level_special in this.data){
                return this.data[DBM_Card_Inventory.columns.level_special];
            }
        }
        
        return null;
    }

    getStock(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.stock in this.data){
                return this.data[DBM_Card_Inventory.columns.stock];
            }
        }
        
        return -1;
    }

    isGold(){
        if(this.isAvailable()){
            if(DBM_Card_Inventory.columns.is_gold in this.data){
                return Boolean(this.data[DBM_Card_Inventory.columns.is_gold]);
            }
        }
        
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

    updateStockParam(userId, cardId, cardInventoryData=null, qty=1){
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
            
    }

    async updateData(){
        if(this.UPDATE_KEY.length<=0) return;
        
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
            paramSet.set(column[key], this.data[colVal]);
        }
        
        for(let key in this.UPDATE_KEY){
            let updateKey = this.UPDATE_KEY[key];
            paramWhere.set(this.UPDATE_KEY[key],this.data[updateKey]);
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
const dedent = require("dedent-js");
const stripIndents = require("common-tags/lib/stripIndents");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, User} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('discordjs-button-pagination');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');

const Data = require("./Data");
const DataUser = Data.User;
const DataCard = Data.Card;
const DataCardInventory = Data.CardInventory;
const {Series, SPack} = require("./data/Series");
const {Character, CPack} = require("./data/Character");
const GProperties = require('./Properties');
const Embed = require('./Embed');

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
        Character.setTotal(dataCard.pack, cardData[i]["total"]);
    }

    // console.log(userCardInventory);
    
    // //init yes 5 gogo data
    // await Series.yes5gogo.init();
    // console.log("Card Modules : Loaded ✓");
}

class Validation extends require("./Validation") {
    
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

class EventListener {
    static async printDetail(discordUser, idCard, interaction, isPrivate=true){
        //print card detail
        var userId = discordUser.id;
        var arrPages = []; //prepare paging embed
        // var cardData = await CardModule.getCardData(idCard);
        var dataCard = await DataCard.getCardData(idCard);
        if(dataCard==null){
            return interaction.reply(Validation.Card.embedNotFound(discordUser));
        }

        var dataCardInventory = await DataCardInventory.getDataByIdUser(userId, idCard);
        if(dataCardInventory==null){
            return interaction.reply(Validation.Card.embedNotHave(discordUser));
        }
        
        var card = new DataCardInventory(
            dataCardInventory,
            dataCard
        )

        var idCard = card.id_card;
        var name = card.name;
        var rarity = card.rarity;
        var color = card.color;
        var img = card.getImgDisplay();
        var series = new Series(card.series);
        var character = new Character(card.pack);
        var receivedAt = card.received_at;

        var level = card.level;
        var levelSpecial = card.level_special;
        var maxHp = card.maxHp;
        var maxSp = card.maxSp;
        var atk = card.atk;
        

        // var cureData = CpackModule[pack].Avatar.normal;
        arrPages.push(Embed.builder(
        dedent(`**${DataCardInventory.emoji.rarity(card.is_gold, rarity)}${rarity} Level:** ${level}/${card.maxLevel} | **Next EXP:** ${card.nextColorPoint}P
        **Battle Stats:**
        ${DataCardInventory.emoji.hp} **Hp:** ${maxHp} | ${DataCardInventory.emoji.atk} **Atk:** ${atk} 
        ${DataCardInventory.emoji.sp} **Sp Max:** ${maxSp} 
        💖 **Special:** ${character.specialAttack} Lv.${card.level_special}
        
        **Passive Skill:**`),
        Embed.builderUser.author(discordUser,character.fullname, character.icon),{
            color:color,
            image:img,
            title:`${name}`,
            footer:{
                text:`Received at: ${receivedAt}`,
                iconURL:Embed.builderUser.getAvatarUrl(discordUser)
            }
        }));

        paginationEmbed(interaction, arrPages, DiscordStyles.Button.pagingButtonList, isPrivate);
    }
}

module.exports = {
    init, Modifier, EventListener
}
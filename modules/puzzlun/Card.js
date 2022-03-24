const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('../../modules/DiscordPagination');

const DataUser = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {Series, SPack} = require("./data/Series");
const {Character, CPack} = require("./data/Character");
const GProperties = require('./Properties');
const Embed = require('./Embed');

// const GuildModule = require("./Guild");

//initialize necessary properties
async function init() {
    //load total card for all pack
    var query = `select cd.${Card.columns.pack}, count(cd.${Card.columns.pack}) as total, 
        cd.${Card.columns.color}, cd.${Card.columns.series}
        from ${Card.tablename} cd
        group by cd.${Card.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++){
        var dataCard = new Card(cardData[i]);
        Character.setTotal(dataCard.pack, cardData[i]["total"]);
    }

    // console.log(userCardInventory);
    
    // //init yes 5 gogo data
    // await Series.yes5gogo.init();
    // console.log("Card Modules : Loaded ✓");
}

class Validation extends require("./Validation") {
    
}

class EventListener {
    static async printDetail(discordUser, idCard, interaction, isPrivate=true){
        //print card detail
        var userId = discordUser.id;
        var arrPages = []; //prepare paging embed
        // var cardData = await CardModule.getCardData(idCard);
        var dataCard = await Card.getCardData(idCard);
        if(dataCard==null){
            return interaction.reply(Validation.Card.embedNotFound(discordUser));
        }

        var dataCardInventory = await CardInventory.getDataByIdUser(userId, idCard);
        if(dataCardInventory==null){
            return interaction.reply(Validation.Card.embedNotHave(discordUser));
        }
        
        var card = new CardInventory(
            dataCardInventory,
            dataCard
        )

        var idCard = card.id_card;
        var name = card.name;
        var rarity = card.rarity;
        var color = card.color;
        var img = card.getImgDisplay();
        var character = card.Character;
        var receivedAt = card.received_at;

        var level = card.level;
        var levelSpecial = card.level_special;
        

        // var cureData = CpackModule[pack].Avatar.normal;
        arrPages.push(Embed.builder(
        dedent(`**${card.getRarityEmoji()}${rarity} Level:** ${level}/${card.maxLevel} | **Next EXP:** ${card.nextColorPoint}P
        ─────────────────
        **Battle Stats:**
        ${CardInventory.emoji.hp} **Hp:** ${card.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${card.atk} | ${CardInventory.emoji.sp} **Sp:** ${card.maxSp}        
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

    static async printInventory(discordUser, pack, interaction, isPrivate){
        var userId = discordUser.id;
        var arrPages = []; //prepare paging embed
        
        //validation if pack exists/not
        var cardDataInventory = await CardInventory.getDataByPack(userId, pack);
        if(cardDataInventory==null){
            return interaction.reply(Validation.Pack.embedNotFound(discordUser));
        }

        var total = {
            normal: cardDataInventory.filter(
                function (item) {
                    return item[CardInventory.columns.id_user] != null;
                }
            ).length,
            gold: cardDataInventory.filter(
                function (item) {
                    return item[CardInventory.columns.is_gold] == 1;
                }
            ).length,
            duplicate: GlobalFunctions.sumObjectByKey(cardDataInventory.filter(
                function (item) {
                    return item[CardInventory.columns.stock]>0;
                }
            ), CardInventory.columns.stock)
        };

        //process first card info
        var cardInfo = new CardInventory(cardDataInventory[0], cardDataInventory[0]);
        var character = new Character(cardInfo.pack);
        var alterEgo = character.alter_ego;
        var color = cardInfo.color;
        var icon = character.icon;
        // var iconColor = Color[color].emoji;
        var iconSeries = cardInfo.Series.emoji.mascot;
        var maxPack = cardInfo.packTotal;
            
        var arrFields = [];
        var idx = 0; var maxIdx = 4; var txtInventory = ``;
        for(var i=0;i<cardDataInventory.length;i++){
            var card = new CardInventory(cardDataInventory[i], cardDataInventory[i]);
            let id = card.id_card; let level = card.level;
            let displayName = `${card.getName(30, true)}`;
            let stock = card.stock;
            let rarity = card.rarity;
            let hp = card.maxHp;
            let atk = card.atk;

            if(card.isHaveCard()){
                txtInventory+=`**${card.getRarityEmoji()}${rarity}: ${id}** ${card.getCardEmoji()}x${stock}\n`;
                // txtInventory+=`${displayName} \n\n`;
                txtInventory+=`${displayName} **Lv.${level}**\n${CardInventory.emoji.hp} Hp: ${hp} | ${CardInventory.emoji.atk} Atk: ${atk} | ${CardInventory.emoji.sp} Sp: ${card.maxSp}\n`;
                txtInventory+=`─────────────────\n`;
            } else {
                txtInventory+=`**${Card.emoji.rarity(rarity)}${rarity}: ???**\n???\n`;
                txtInventory+=`─────────────────\n`;
            }
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
                let embed = 
                Embed.builder(
                    `**Normal:** ${total.normal}/${maxPack} | **Gold:** ${total.gold}/${maxPack}\n${card.getCardEmoji()}x${total.duplicate}/${maxPack*CardInventory.limit.card}\n`+
                    `\n${txtInventory}`,discordUser,{
                    color:Embed.color[color],
                    title:`${iconSeries} ${GlobalFunctions.capitalize(character.name)}/${alterEgo} Inventory:`,
                    thumbnail:icon,
                    // fields:arrFields
                })

                arrPages.push(embed);
                arrFields = []; txtInventory="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, isPrivate);
    }

}

module.exports = {
    init, EventListener
}
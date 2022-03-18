const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('discordjs-button-pagination');

const DataUser = require("./data/User");
const DataCard = require("./data/Card");
const DataCardInventory = require("./data/CardInventory");
const {Series, SPack} = require("./data/Series");
const {Character, CPack} = require("./data/Character");
const GProperties = require('./Properties');
const Embed = require('./Embed');

// const GuildModule = require("./Guild");

//initialize necessary properties
async function init() {
    //load total card for all pack
    var query = `select cd.${DataCard.columns.pack}, count(cd.${DataCard.columns.pack}) as total, 
        cd.${DataCard.columns.color}, cd.${DataCard.columns.series}
        from ${DataCard.tablename} cd
        group by cd.${DataCard.columns.pack}`;
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
    init, EventListener
}
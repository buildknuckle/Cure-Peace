// const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageEmbed} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');
const capitalize = GlobalFunctions.capitalize;

const paginationEmbed = require('../DiscordPagination');

const Properties = require('./Properties');
const Color = Properties.color;
const Currency = Properties.currency;
const Emoji = Properties.emoji;

const User = require("./data/User");
const UserGacha = require("./data/Gacha");
const Card = require("./data/Card");
const Embed = require("./Embed");
const CardInventory = require("./data/CardInventory");
const {CardEmbed} = require("./Card");
const {Item, ItemInventory} = require("./data/Item");

const Listener = require("./data/Listener");

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");

class Validation extends require("./Validation") {
    static notEnoughJewel(discordUser, jewelCost){
        return Embed.errorMini(`**${Currency.jewel.emoji} ${jewelCost} ${Currency.jewel.name}** are required to use this gachapon.`, discordUser, true, {
            title:`❌ Not enough jewel`
        })
    }
}

//roll with ticket:
class TicketRoller extends Listener {
    name=null;
    cardData={};
    chance={};
    itemTicketData;

    constructor(interaction, name, cardData, chance, itemTicketData){
        super(interaction);
        this.name = name;
        this.cardData = cardData;
        this.chance = chance;
        this.itemTicketData = itemTicketData;
    }

    async roll(roll){
        //validation: check if user have ticket
        var item = new Item(this.itemTicketData);
        var itemInventoryData = await ItemInventory.getItemInventoryDataById(this.userId, item.id_item);
        var itemInventory = new ItemInventory(itemInventoryData.itemInventoryData, itemInventoryData.itemData);
        if(itemInventoryData.itemInventoryData==null|| itemInventory.stock<=0){
            return this.interaction.reply(
                Embed.errorMini(`${item.getCategoryEmoji()} ${item.getIdItem()} **${item.getName()}** are required to use **${capitalize(this.name)}**`, this.discordUser, true, {
                    title:`❌ Not enough ticket`
                })
            );
        }
        
        var userData = await User.getData(this.userId);

        itemInventory.stock-=1;
        await itemInventory.update();//update ticket data

        //init embed
        var arrPages = [
            Embed.builder(`**${capitalize(this.name)}** has been selected!
            (Click on next page to reveal your roll results!)

            *Good luck! mofu~*`, this.discordUser, {
                title:`${capitalize(this.name)}`,
                image:Properties.imgSet.mofu.peek,
                footer:Embed.builderUser.footer(`Roll total: ${roll}`)
            })
        ]; //prepare paging embed

        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity=null; var minChance = 0;
            for(var key in this.chance){
                minChance+=this.chance[key];
                if(rnd<=minChance&&rndRarity==null){ rndRarity = key; }
            }

            var rndCardData = GlobalFunctions.randomProperty(this.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);

            var stock = await CardInventory.updateStock(this.userId, card.id_card, 1, true);
            var txtRoll = `🔄 **Roll:** ${i+1}/${roll}\n\n`;
            if(stock<=-1){//new card
                var newTotal = await CardInventory.getPackTotal(this.userId, card.pack);
                arrPages.push(cardEmbed.newCard(newTotal, 
                    {notifFront:txtRoll}
                ));
            } else {//duplicate
                arrPages.push(cardEmbed.duplicateCard(stock, 
                    {notifFront:txtRoll}));
            }
        }

        paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList);
    }
}

//roll with jewel:
class JewelRoller extends Listener {
    name=null;
    cardData={};
    chance={};
    cost={};
    user;

    constructor(interaction, userData, name, cardData, chance, cost){
        super(interaction);
        this.name = name;
        this.cardData = cardData;
        this.chance = chance;
        this.cost = cost;
        this.user = new User(userData);
    }

    async roll(){
        var roll = parseInt(this.interaction.options.getString("roll"));
    
        var userData = await User.getData(this.userId);
        var userGacha = new UserGacha(await UserGacha.getData(this.userId));

        var jewelCost = this.cost[roll];
        if(this.user.Currency.jewel<jewelCost){ //validation: check for jewel
            return this.interaction.reply(Validation.notEnoughJewel(this.discordUser, jewelCost));
        }

        this.user.Currency.jewel-=jewelCost;
        await this.user.update()//update user data

        userGacha.setLastDailyGachaDate();
        await userGacha.update();//update user gacha data
        
        //init embed
        var arrPages = [
            Embed.builder(dedent(`**${capitalize(this.name)}** has been selected!
            (Click on next page to reveal your roll results!)

            *Good luck! mofu~*`), 
            this.discordUser, {
                title:`${capitalize(this.name)}`,
                image:Properties.imgSet.mofu.peek,
                footer:Embed.builderUser.footer(`Roll total: ${roll}`)
            })
        ]; //prepare paging embed
        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity=null; var minChance = 0;
            for(var key in this.chance){
                minChance+=this.chance[key];
                if(rnd<=minChance&&rndRarity==null){ rndRarity = key; }
            }

            var rndCardData = GlobalFunctions.randomProperty(this.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);
            
            var stock = await CardInventory.updateStock(this.userId, card.id_card, 1, true);
            var txtRoll = `🔄 **Roll:** ${i+1}/${roll}\n\n`;
            if(stock<=-1){//new card
                var newTotal = await CardInventory.getPackTotal(this.userId, card.pack);
                arrPages.push(cardEmbed.newCard(newTotal, 
                    {notifFront:txtRoll}
                ));
            } else {//duplicate
                arrPages.push(cardEmbed.duplicateCard(stock, 
                    {notifFront:txtRoll}));
            }
        }

        paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList);
    }
}

class Daily extends Listener {
    static name = "daily gachapon roll";
    
    static cardData = {
        1:[], 5:[], 6:[],
    }

    static cost = {
        1: 50,
        5: 200
    }

    static chance = {
        1: 85,
        5: 10,
        6: 5
    }

    static info(){
        var arrSeriesNormal = ["max_heart","splash_star","yes5gogo","fresh","heartcatch","suite","smile","dokidoki","happiness_charge","go_princess","mahou_tsukai","kirakira","hugtto"];
        var arrSeriesLimited = ["max_heart","splash_star","yes5gogo","fresh"];

        //rarity 1 & 5
        var seriesTextDailyNormal = ``;
        for(var key in SPack){
            if(arrSeriesNormal.includes(key)){
                var series = new Series(key);
                seriesTextDailyNormal+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesTextDailyNormal = seriesTextDailyNormal.replace(/,\s*$/, "");//remove last comma and any whitespace

        //rarity 6 limited
        var seriesTextDailyLimited = ``;
        for(var key in SPack){
            if(arrSeriesLimited.includes(key)){
                var series = new Series(key);
                seriesTextDailyLimited+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesTextDailyLimited = seriesTextDailyLimited.replace(/,\s*$/, "");//remove last comma and any whitespace

        var txtInfo = dedent(`**Command:** /gachapon daily
        ─────────────────
        **Overview**
        ─────────────────
        
        This is a standard daily gachapon that available with 2 types of roll:
        • 1x (Costs: ${this.cost[1]} ${Currency.jewel.emoji}): will roll 1x card drop
        • 5x (Costs: ${this.cost[5]} ${Currency.jewel.emoji}): will roll 5x card drop 

        ─────────────────
        **Series lineup**
        ─────────────────
        The following series lineup will appear on this gachapon:
        ${Card.emoji.rarity(1)}__**1 (drop rates: ${this.chance[1]}%)**__
        ${seriesTextDailyNormal}

        ${Card.emoji.rarity(5)}__**5 (drop rates: ${this.chance[5]}%)**__
        ${seriesTextDailyNormal}

        ${Card.emoji.rarity(6)}__**6 (limited) (drop rates: ${this.chance[6]}%)**__
        ${seriesTextDailyLimited}
        
        ─────────────────
        **Notes**
        ─────────────────
        • This gachapon will be resetted daily.
        • Precure card that appear in this gachapon may be duplicated.`);

        return Embed.builder(txtInfo, 
            Embed.builderUser.authorCustom(`Gachapon Info`, Properties.imgSet.mofu.ok), {
            title:capitalize(this.name)
        });
    }
    
    static async initCardData(){
        //init daily gachapon:
        var query = `SELECT * 
        FROM ${Card.tablename} 
        WHERE ${Card.columns.series}<>? AND 
        (${Card.columns.rarity}=? or ${Card.columns.rarity}=? or 
        (${Card.columns.rarity}=? and ${Card.columns.is_spawnable}=? AND ${Card.columns.series} IN (?,?,?,?)))`;

        var results = await DBConn.conn.query(query, [SPack.tropical_rouge.properties.value, 1,5,6,0,
            SPack.max_heart.properties.value, SPack.splash_star.properties.value, SPack.yes5gogo.properties.value, SPack.fresh.properties.value]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }
    }

    async roll(){
        //gacha date validation
        var userData = await User.getData(this.userId);
        var userGacha = new UserGacha(await UserGacha.getData(this.userId));

        if(userGacha.hasDailyGacha()){//validation: check if already use daily gacha
            return this.interaction.reply(Embed.errorMini(
                `❌ You already used your ${Daily.name} for today.`,this.discordUser, true
            ));
        }

        var jewelRoller = new JewelRoller(this.interaction, userData, 
            Daily.name, Daily.cardData, Daily.chance, Daily.cost);
        await jewelRoller.roll();
    }
}

class TropicalCatch extends Listener {
    static endingDate = "09/30/2022";
    static name = "tropical-catch! gachapon";
    static cardData = {
        1:[], 5:[], 6:[],
    }

    static cost = {
        1: 100,
        3: 250
    }

    static chance = {
        1: 85,
        5: 18,
        6: 2
    }

    static info(){
        var arrSeriesIncludes = ["heartcatch","tropical_rouge"];
        //rarity 1 & 5
        var seriesText = ``;
        for(var key in SPack){
            if(arrSeriesIncludes.includes(key)){
                var series = new Series(key);
                seriesText+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesText = seriesText.replace(/,\s*$/, "");//remove last comma and any whitespace

        var txtInfo = dedent(`**Command:** /gachapon tropical-catch
        ─────────────────
        **Overview**
        ─────────────────
        This gachapon includes the limited heartcatch & tropical-rouge series that available with 2 types of roll:
        • 1x (Costs: ${this.cost[1]} ${Currency.jewel.emoji}): will roll 1x card drop
        • 3x (Costs: ${this.cost[3]} ${Currency.jewel.emoji}): will roll 3x card drop

        ─────────────────
        **Gachapon duration**
        ─────────────────
        Up to ${this.endingDate} 

        ─────────────────
        **Series lineup**
        ─────────────────
        The following series lineup will appear on this gachapon:
        ${Card.emoji.rarity(1)}__**1 (drop rates: 80%)**__
        ${seriesText}

        ${Card.emoji.rarity(5)}__**5 (drop rates: 18%)**__
        ${seriesText}

        ${Card.emoji.rarity(6)}__**6 (limited) (drop rates: 2%)**__
        ${seriesText}
        
        ─────────────────
        **Notes**
        ─────────────────
        • This gachapon will be resetted daily.
        • Precure card that appear in this gachapon may be duplicated.`);

        return Embed.builder(txtInfo, 
            Embed.builderUser.authorCustom(`Gachapon Info`, Properties.imgSet.mofu.ok), {
            title:capitalize(this.name)
        });
    }

    static async initCardData(){
        // init tropical-catch gachapon:
        var query = `SELECT * 
        FROM ${Card.tablename} 
        WHERE (${Card.columns.series}=? OR ${Card.columns.series}=?) AND 
        (${Card.columns.rarity}=? or ${Card.columns.rarity}=? or 
        (${Card.columns.rarity}=? and ${Card.columns.is_spawnable}=?))`;
        var results = await DBConn.conn.query(query, [SPack.heartcatch.properties.value, SPack.tropical_rouge.properties.value, 1,5,6,0]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }
    }

    async roll(){
        //roll validation date
        var today = new Date();
        var endingDate = new Date(TropicalCatch.endingDate);
        if(today>endingDate){
            return this.interaction.reply(Embed.errorMini(
                `❌ This gachapon period has been ended.`,this.discordUser, true, {
                    title:`Tropical-catch! gachapon has ended`
                }
            ));
        }

        //gacha date validation
        var userData = await User.getData(this.userId);
        var userGacha = new UserGacha(await UserGacha.getData(this.userId));

        if(userGacha.hasTropicalCatchGacha()){//validation: check if already use tropical-catch gacha
            return this.interaction.reply(Embed.errorMini(
                `❌ You already used your ${TropicalCatch.name} for today.`,this.discordUser, true
            ));
        }

        var jewelRoller = new JewelRoller(this.interaction, userData, 
            TropicalCatch.name, TropicalCatch.cardData, TropicalCatch.chance, TropicalCatch.cost);
        await jewelRoller.roll();
    }
}

class StandardTicket extends Listener {
    static name ="standard ticket roll";
    static cardData = {
        1:[], 2:[], 3:[],
    }

    static chance = {
        1: 33,
        2: 34,
        3: 33,
    }

    static itemTicketData;//ticket data that will be used

    static info(){
        var ticket = new Item(this.itemTicketData);
        var arrSeries = ["max_heart","splash_star","yes5gogo","fresh","heartcatch"];

        //rarity 1-3
        var seriesText = ``;
        for(var key in SPack){
            if(arrSeries.includes(key)){
                var series = new Series(key);
                seriesText+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesText = seriesText.replace(/,\s*$/, "");//remove last comma and any whitespace

        var txtInfo = dedent(`**Command:** /gachapon ticket Standard Gachapon Ticket
        ─────────────────
        **Overview**
        ─────────────────
        This is a standard gachapon that will use: ${ticket.getCategoryEmoji()} ${ticket.getIdItem()} **${ticket.getName()}**

        ─────────────────
        **Series lineup**
        ─────────────────
        The following series lineup will appear on this gachapon:
        ${Card.emoji.rarity(1)}__**1 (drop rates: ${this.chance[1]}%)**__
        ${seriesText}

        ${Card.emoji.rarity(2)}__**2 (drop rates: ${this.chance[2]}%)**__
        ${seriesText}

        ${Card.emoji.rarity(3)}__**3 (limited) (drop rates: ${this.chance[3]}%)**__
        ${seriesText}
        
        ─────────────────
        **Notes**
        ─────────────────
        • Precure card that appear in this gachapon may be duplicated.`);

        return Embed.builder(txtInfo, 
            Embed.builderUser.authorCustom(`Gachapon Info`, Properties.imgSet.mofu.ok), {
            title:capitalize(this.name)
        });

    }

    static async initData(){
        //init card data:
        var query = `SELECT * 
        FROM ${Card.tablename} 
        WHERE ${Card.columns.series} IN (?,?,?,?,?) AND 
        ${Card.columns.rarity}<=?`;

        var results = await DBConn.conn.query(query, [SPack.max_heart.properties.value, SPack.splash_star.properties.value, SPack.yes5gogo.properties.value, SPack.fresh.properties.value,SPack.heartcatch.properties.value, 3]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }

        //init ticket data:
        this.itemTicketData = await Item.getItemData("gt001");
    }

    async roll(){
        var ticketRoller = new TicketRoller(this.interaction, 
            StandardTicket.name, StandardTicket.cardData, StandardTicket.chance, StandardTicket.itemTicketData);
        await ticketRoller.roll(1);
    }
}

class TropicalCatchTicket extends Listener {
    static endingDate = "09/30/2022";
    static name ="tropical-catch! ticket roll";
    static cardData = {
        1:[], 6:[],
    }

    static chance = {
        1: 90,
        6: 10,
    }

    static info(){
        var ticket = new Item(this.itemTicketData);
        var arrSeriesIncludes = ["heartcatch","tropical_rouge"];
        //rarity 1 & 5
        var seriesText = ``;
        for(var key in SPack){
            if(arrSeriesIncludes.includes(key)){
                var series = new Series(key);
                seriesText+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesText = seriesText.replace(/,\s*$/, "");//remove last comma and any whitespace

        var txtInfo = dedent(`**Command:** /gachapon ticket Tropical-Catch! Gachapon Ticket
        ─────────────────
        **Overview**
        ─────────────────
        This is a tropical-rouge gachapon that will use: ${ticket.getCategoryEmoji()} ${ticket.getIdItem()} **${ticket.getName()}**

        ─────────────────
        **Gachapon duration**
        ─────────────────
        Up to ${this.endingDate} 

        ─────────────────
        **Series lineup**
        ─────────────────
        The following series lineup will appear on this gachapon:
        ${Card.emoji.rarity(1)}__**1 (drop rates: 80%)**__
        ${seriesText}

        ${Card.emoji.rarity(5)}__**5 (drop rates: 18%)**__
        ${seriesText}

        ${Card.emoji.rarity(6)}__**6 (limited) (drop rates: 2%)**__
        ${seriesText}
        
        ─────────────────
        **Notes**
        ─────────────────
        • This gachapon will be resetted daily.
        • Precure card that appear in this gachapon may be duplicated.`);

        return Embed.builder(txtInfo, 
            Embed.builderUser.authorCustom(`Gachapon Info`, Properties.imgSet.mofu.ok), {
            title:capitalize(this.name)
        });
    }

    static itemTicketData;//ticket data that will be used

    static async initData(){
        //init card data:
        var query = `SELECT * 
        FROM ${Card.tablename} 
        WHERE ${Card.columns.series} IN (?) AND 
        (${Card.columns.rarity}=? OR ${Card.columns.rarity}=?)`;

        var results = await DBConn.conn.query(query, [SPack.tropical_rouge.properties.value, 1, 6]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }

        //init ticket data:
        this.itemTicketData = await Item.getItemData("gt002");
    }

    async roll(){
        //roll validation date
        var today = new Date();
        var endingDate = new Date(TropicalCatchTicket.endingDate);
        if(today>endingDate){
            return this.interaction.reply(Embed.errorMini(
                `❌ This gachapon period has been ended.`,this.discordUser, true, {
                    title:`Tropical-catch! gachapon has ended`
                }
            ));
        }

        var ticketRoller = new TicketRoller(this.interaction, 
            TropicalCatchTicket.name, TropicalCatchTicket.cardData, TropicalCatchTicket.chance, TropicalCatchTicket.itemTicketData);
        await ticketRoller.roll(1);
    }
}

class PremiumTicket extends Listener {
    static name ="premium ticket roll";

    static cardData = {
        4:[], 5:[], 6:[],
    }

    static chance = {
        4: 5,
        5: 90,
        6: 5,
    }

    static itemTicketData;//ticket data that will be used

    static info(){
        var ticket = new Item(this.itemTicketData);
        var arrSeriesNormal = ["max_heart","splash_star","yes5gogo",
        "fresh","heartcatch","suite","smile","dokidoki",
        "happiness_charge","go_princess","mahou_tsukai",
        "kirakira","hugtto","star_twinkle","healin_good"];

        //rarity 4, 5
        var seriesTextNormal = ``;
        for(var key in SPack){
            if(arrSeriesNormal.includes(key)){
                var series = new Series(key);
                seriesTextNormal+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesTextNormal = seriesTextNormal.replace(/,\s*$/, "");//remove last comma and any whitespace

        //rarity 6
        var arrSeriesLimited = ["max_heart","splash_star","yes5gogo","fresh","heartcatch"];
        var seriesTextLimited = ``;
        for(var key in SPack){
            if(arrSeriesLimited.includes(key)){
                var series = new Series(key);
                seriesTextLimited+=`${series.emoji.mascot} ${series.name}, `;
            }
        }
        seriesTextLimited = seriesTextLimited.replace(/,\s*$/, "");//remove last comma and any whitespace

        var txtInfo = dedent(`**Command:** /gachapon ticket Premium Gachapon Ticket
        ─────────────────
        **Overview**
        ─────────────────
        This is a premium gachapon that will use: ${ticket.getCategoryEmoji()} ${ticket.getIdItem()} **${ticket.getName()}**

        ─────────────────
        **Series lineup**
        ─────────────────
        The following series lineup will appear on this gachapon:

        ${Card.emoji.rarity(4)}__**4 (drop rates: ${this.chance[4]}%)**__
        ${seriesTextNormal}

        ${Card.emoji.rarity(5)}__**5 (drop rates: ${this.chance[5]}%)**__
        ${seriesTextNormal}

        ${Card.emoji.rarity(6)}__**6 (limited) (drop rates: ${this.chance[6]}%)**__
        ${seriesTextLimited}
        
        ─────────────────
        **Notes**
        ─────────────────
        • Precure card that appear in this gachapon may be duplicated.`);

        return Embed.builder(txtInfo, 
            Embed.builderUser.authorCustom(`Gachapon Info`, Properties.imgSet.mofu.ok), {
            title:capitalize(this.name)
        });
    }

    static async initData(){
        //init card data:
        var query = `SELECT * 
        FROM ${Card.tablename} 
        WHERE ${Card.columns.series} <>? AND 
        (${Card.columns.rarity}=? OR ${Card.columns.rarity}=? OR ${Card.columns.rarity}=?)`;

        var results = await DBConn.conn.query(query, [SPack.tropical_rouge.properties.value, 4, 5, 6]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }

        //init ticket data:
        this.itemTicketData = await Item.getItemData("gt003");
    }

    async roll(){
        var ticketRoller = new TicketRoller(this.interaction, 
            PremiumTicket.name, PremiumTicket.cardData, PremiumTicket.chance, PremiumTicket.itemTicketData);
        await ticketRoller.roll(1);
    }

}

class Gachapon extends Listener {
    static Daily = Daily;
    static TropicalCatch = TropicalCatch;
    static StandardTicket = StandardTicket;
    static PremiumTicket = PremiumTicket;
    static TropicalCatchTicket = TropicalCatchTicket;

    //1 time init for card data
    static async init(){
        await Daily.initCardData();
        await TropicalCatch.initCardData();
        await StandardTicket.initData();
        await PremiumTicket.initData();
        await TropicalCatchTicket.initData();
    }

    async info(){
        var arrPages = []; //prepare paging embed
        arrPages.push(
            Daily.info(),
            TropicalCatch.info(),
            StandardTicket.info(),
            TropicalCatchTicket.info(),
            PremiumTicket.info()
        );

        await paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
    }

}

module.exports = Gachapon;
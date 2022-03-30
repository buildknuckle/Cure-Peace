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

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");

class Validation extends require("./Validation") {
    static notEnoughJewel(discordUser, jewelCost){
        return Embed.errorMini(`**${Currency.jewel.emoji} ${jewelCost} ${Currency.jewel.name}** are required to use this gachapon.`, discordUser, true, {
            title:`❌ Not enough jewel`
        })
    }
}

class Daily extends require("./data/Listener") {
    static name = "daily gachapon";
    
    static cardData = {
        1:[], 5:[], 6:[],
    }

    static cost = {
        1: 10,
        5: 35
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
        var roll = parseInt(this.interaction.options.getString("roll"));
        
        //lineup: 1* normal: 85%, 5* normal: 10%, 6* premium: 5%
        var userId = this.discordUser.id;
    
        var userData = await User.getData(this.userId);
        var user = new User(userData);
        var userGacha = new UserGacha(await UserGacha.getData(this.userId));

        var jewelCost = Daily.cost[roll];
        if(userGacha.hasDailyGacha()){//validation: check if already use daily gacha
            return this.interaction.reply(Embed.errorMini(
                `❌ You already used your daily gachapon for today.`,this.discordUser, true
            ));
        } else if(user.Currency.jewel<jewelCost){ //validation: check for jewel
            return this.interaction.reply(Validation.notEnoughJewel(this.discordUser, jewelCost));
        } 

        user.Currency.jewel-=jewelCost;
        await user.update()//update user data

        userGacha.setLastDailyGachaDate();
        await userGacha.update();//update user gacha data
        
        //init embed
        var arrPages = [
            Embed.builder(`${roll}x daily gachapon roll has been selected!`, this.discordUser, {
                title:`Daily Gachapon Roll`,
                image:Properties.imgSet.mofu.ok
            })
        ]; //prepare paging embed
        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity;
            if(rnd<=Daily.chance[1]){ rndRarity = 1; }//roll 1*
            else if(rnd<=Daily.chance[5]){ rndRarity = 5;}//roll 5*
            else { rndRarity = 6; }//roll 6* premium

            var rndCardData = GlobalFunctions.randomProperty(Daily.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);
            
            var stock = await CardInventory.updateStock(userId, card.id_card, 1, true);
            var txtRoll = `**Roll:** ${i+1}/${roll}\n`;
            if(stock<=-1){//new card
                var newTotal = await CardInventory.getPackTotal(userId, card.pack);
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

class TropicalCatch extends require("./data/Listener") {
    static name = "tropical-catch gachapon";
    static cardData = {
        1:[], 5:[], 6:[],
    }

    static cost = {
        1: 100,
        3: 350
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
        Up to 04/30 

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
        var roll = parseInt(this.interaction.options.getString("roll"));

        //lineup: 1* normal: 85%, 5* normal: 10%, 6* premium: 5%
        var userData = await User.getData(this.userId);
        var user = new User(userData);
        var userGacha = new UserGacha(await UserGacha.getData(this.userId));

        var jewelCost = TropicalCatch.cost[roll];
        if(userGacha.hasTropicalCatchGacha()){//validation: check if already use daily gacha
            return this.interaction.reply(Embed.errorMini(
                `❌ You already used your tropical-catch! gachapon for today.`,this.discordUser, true
            ));
        } else if(user.Currency.jewel<jewelCost){ //validation: check for jewel
            return this.interaction.reply(Validation.notEnoughJewel(this.discordUser, jewelCost));
        } 

        user.Currency.jewel-=jewelCost;
        await user.update()//update user data

        userGacha.setLastTropicalCatchGachaDate();
        await userGacha.update();//update user gacha data

        //init embed
        var arrPages = [
            Embed.builder(`${roll}x tropical-catch! gachapon roll has been selected!`, this.discordUser, {
                title:`Tropical-Catch! Gachapon Roll`,
                image:Properties.imgSet.mofu.ok
            })
        ]; //prepare paging embed

        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity;
            if(rnd<=TropicalCatch.chance[1]){ rndRarity = 1; }//roll 1*
            else if(rnd<=TropicalCatch.chance[5]){ rndRarity = 5;}//roll 5*
            else { rndRarity = 6; }//roll 6* premium

            var rndCardData = GlobalFunctions.randomProperty(TropicalCatch.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);

            var stock = await CardInventory.updateStock(this.userId, card.id_card, 1, true);
            var txtRoll = `**Roll:** ${i+1}/${roll}\n`;
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

class StandardTicket extends require("./data/Listener") {
    static name ="standard gachapon roll";
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
        var roll = 1;

        //validation: check if user have ticket
        var item = new Item(StandardTicket.itemTicketData);
        var itemInventoryData = await ItemInventory.getItemInventoryDataById(this.userId, item.id_item);
        var itemInventory = new ItemInventory(itemInventoryData.itemInventoryData, itemInventoryData.itemData);
        if(itemInventoryData.itemInventoryData==null|| itemInventory.stock<=0){
            return this.interaction.reply(
                Embed.errorMini(`${item.getCategoryEmoji()} ${item.getIdItem()} **${item.getName()}** are required to use **${capitalize(StandardTicket.name)}**`, this.discordUser, true, {
                    title:`❌ Not enough ticket`
                })
            );
        }
        
        //lineup: 1* normal: 33%, 2* normal: 34%, 3* normal: 33%
        var userData = await User.getData(this.userId);

        itemInventory.stock-=1;
        await itemInventory.update();//update ticket data

        //init embed
        var arrPages = [
            Embed.builder(`${StandardTicket.name} has been selected!`, this.discordUser, {
                title:`${capitalize(StandardTicket.name)}`,
                image:Properties.imgSet.mofu.ok
            })
        ]; //prepare paging embed

        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity;
            var minChance = {
                1:StandardTicket.chance[1],
                2:StandardTicket.chance[1]+StandardTicket.chance[2]
            }
            if(rnd<=minChance[1]){ rndRarity = 1; }//roll 1*
            else if(rnd<=minChance[2]){ rndRarity = 2;}//roll 2*
            else { rndRarity = 3; }//roll 3* normal

            var rndCardData = GlobalFunctions.randomProperty(StandardTicket.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);

            var stock = await CardInventory.updateStock(this.userId, card.id_card, 1, true);
            var txtRoll = `**Roll:** ${i+1}/${roll}\n`;
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

class PremiumTicket extends require("./data/Listener") {
    static name ="premium gachapon roll";

    static cardData = {
        5:[], 6:[],
    }

    static chance = {
        5: 98,
        6: 2,
    }

    static itemTicketData;//ticket data that will be used

    static info(){
        var ticket = new Item(this.itemTicketData);
        var arrSeriesNormal = ["max_heart","splash_star","yes5gogo",
        "fresh","heartcatch","suite","smile","dokidoki",
        "happiness_charge","go_princess","mahou_tsukai",
        "kirakira","hugtto","star_twinkle","healin_good"];

        //rarity 5
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
        (${Card.columns.rarity}=? OR ${Card.columns.rarity}=?)`;

        var results = await DBConn.conn.query(query, [SPack.tropical_rouge.properties.value, 5,6]);
        for(var i=0;i<results.length;i++){
            var card = results[i];
            this.cardData[card[Card.columns.rarity]].push(card);
        }

        //init ticket data:
        this.itemTicketData = await Item.getItemData("gt003");
    }

    async roll(){
        var roll = 1;

        //validation: check if user have ticket
        var item = new Item(PremiumTicket.itemTicketData);
        var itemInventoryData = await ItemInventory.getItemInventoryDataById(this.userId, item.id_item);
        var itemInventory = new ItemInventory(itemInventoryData.itemInventoryData, itemInventoryData.itemData);
        if(itemInventoryData.itemInventoryData==null|| itemInventory.stock<=0){
            return this.interaction.reply(
                Embed.errorMini(`${item.getCategoryEmoji()} ${item.getIdItem()} **${item.getName()}** are required to use **${capitalize(PremiumTicket.name)}**`, this.discordUser, true, {
                    title:`❌ Not enough ticket`
                })
            );
        }
        
        
        //lineup: 5* normal: 98%, 6* normal: 2%
        var userData = await User.getData(this.userId);

        itemInventory.stock-=1;
        await itemInventory.update();//update ticket data

        //init embed
        var arrPages = [
            Embed.builder(`${PremiumTicket.name} has been selected!`, this.discordUser, {
                title:`${capitalize(PremiumTicket.name)}`,
                image:Properties.imgSet.mofu.ok
            })
        ]; //prepare paging embed

        for(var i=0;i<roll;i++){
            //randomize roll:
            var rnd = GlobalFunctions.randomNumber(1,100);
            var rndRarity;
            if(rnd<=PremiumTicket.chance[5]){ rndRarity = 5; }//roll 5*
            else { rndRarity = 6; }//roll 6* limited

            var rndCardData = GlobalFunctions.randomProperty(PremiumTicket.cardData[rndRarity]);
            var cardEmbed = new CardEmbed(rndCardData, userData, this.discordUser);
            var card = new Card(rndCardData);

            var stock = await CardInventory.updateStock(this.userId, card.id_card, 1, true);
            var txtRoll = `**Roll:** ${i+1}/${roll}\n`;
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

class Listener extends require("./data/Listener") {
    // constructor(userId=null, discordUser=null, interaction=null){
    //     super(userId, discordUser, interaction);
    // }

    async info(){
        var arrPages = []; //prepare paging embed
        arrPages.push(
            Daily.info(),
            TropicalCatch.info(),
            StandardTicket.info(),
            PremiumTicket.info()
        );

        await paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
    }

}

class Gachapon {
    static Daily = Daily;
    static TropicalCatch = TropicalCatch;
    static StandardTicket = StandardTicket;
    static PremiumTicket = PremiumTicket;
    static Listener = Listener;

    //1 time init for card data
    static async init(){
        await Daily.initCardData();
        await TropicalCatch.initCardData();
        await StandardTicket.initData();
        await PremiumTicket.initData();
    }

}

module.exports = Gachapon;
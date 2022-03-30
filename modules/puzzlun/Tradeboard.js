const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const User = require("./data/User");
const Properties = require("./Properties");
const Color = Properties.color;
const Currency = Properties.currency;
const paginationEmbed = require('../DiscordPagination');
const Embed = require('./Embed');
const Validation = require("./Validation");

const {Tradeboard, CardTradeboard} = require("./data/Tradeboard");

class TradeboardListener extends require("./data/Listener") {
    guildId = null;
    user;

    constructor(userId, discordUser, interaction, guildId, userData){
        super(userId, discordUser, interaction);
        this.guildId= guildId;
        this.user = new User(userData);
    }

    async post(){
        var idCardLookingFor = this.interaction.options.getString("looking-for");
        var idCardOffer = this.interaction.options.getString("card-offer");

        // var user = new User(await User.getData(this.userId));

        //validation: get user trade listing total
        var cardTradeboard = new CardTradeboard(this.guildId, this.userId);
        // var totalList = await Tradeboard.getTotalByUser(this.guildId, this.userId);
        var totalList = await cardTradeboard.getTotalByUser();
        if(totalList>=Tradeboard.limit.post){ //validation: total list
            return this.interaction.reply(Embed.errorMini(`Your trade listing already full.`, this.discordUser, true, {
                title:"❌ Cannot post trade listing"
            }));
        }

        var cardDataLookingFor = await Card.getCardData(idCardLookingFor);
        var cardDataOffer = await CardInventory.getJoinUserData(this.userId, idCardOffer);
        //validation: check for available card:
        if(cardDataLookingFor==null){
            return this.interaction.reply(
                Embed.errorMini(`I cannot find the card that you're looking for.`,this.discordUser, true, {
                    title:`❌ Cannot find that card`
                })
            );
        }

        if(cardDataOffer==null){
            return this.interaction.reply(
                Embed.errorMini(`I cannot find the card that card offer.`,this.discordUser, true, {
                    title:`❌ Cannot find that card`
                })
            );
        }

        //validation: check if user have card:
        if(cardDataOffer.cardInventoryData==null){
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        var cardLookingFor = new Card(cardDataLookingFor);
        var cardOffer = new CardInventory(cardDataOffer.cardInventoryData, cardDataOffer.cardData);
        
        if(!cardLookingFor.isTradable()){ //validation: limited card
            return this.interaction.reply(Embed.errorMini(`${cardLookingFor.getCardEmoji()} ${cardLookingFor.getIdCard()} **${cardLookingFor.getName(15)}** are limited and cannot be traded.`, this.discordUser, true, {
                title:"❌ Limited card"
            }));
        } else if(!cardOffer.isTradable()){ //validation: limited card
            return this.interaction.reply(Embed.errorMini(`${cardLookingFor.getCardEmoji()} ${cardOffer.getIdCard()} **${cardOffer.getName(15)}** are limited and cannot be traded.`, this.discordUser, true, {
                title:"❌ Limited card"
            }));
        } else if(cardLookingFor.id_card.toLowerCase()==cardOffer.id_card.toLowerCase()){ //validation: same card
            return this.interaction.reply(Embed.errorMini(`Cannot trade card with same id.`, this.discordUser, true, {
                title:"❌ Same card id"
            }));
        } else if(cardOffer.stock<=0){ //validation: not enough duplicate
            return this.interaction.reply(Embed.errorMini(`You need 1x duplicate of: ${cardOffer.getIdCard()} **${cardOffer.getName(15)}** to trade this card.`, this.discordUser, true, {
                title:"❌ Not enough duplicates"
            }));
        }

        cardTradeboard.setCardData(cardDataLookingFor, cardDataOffer.cardData);
        var getSameListing = await cardTradeboard.findDuplicate();
        if(getSameListing!=null){ //validation: check for same listing
            return this.interaction.reply(Embed.errorMini(`You cannot post same trade listing.`, this.discordUser, true, {
                title:"❌ Listing already existed"
            }));
        }

        cardOffer.stock-=1;//update user card inventory stock
        await cardOffer.update();
        await cardTradeboard.insert();//insert into tradeboard table

        var arrPages = [];
        var embed = Embed.builder(dedent(`${Properties.emoji.mofuheart} <@${this.userId}> has post new card listing on tradeboard`), 
        this.discordUser, {
            color:this.user.set_color,
            title:`❣️ New card trade listing!`,
            thumbnail: cardOffer.img_url,
            fields:[
                {
                    name:`🔍${this.discordUser.username} looking for:`,
                    value:dedent(`${cardLookingFor.getRarity()} ${cardLookingFor.getIdCard()} ${cardLookingFor.getName(0, true)}`),
                },
                {
                    name:`🔀${this.discordUser.username} will offer:`,
                    value:dedent(`${cardOffer.getRarity()} ${cardOffer.getIdCard()} ${cardOffer.getName(0, true)}`),
                },
            ],
            footer:Embed.builderUser.footer(`Trade on this list with: /tradeboard trade ${cardTradeboard.id}`)
        });
        
        return await this.interaction.reply({embeds:[embed]});
    }

    async searchCard(){
        var idCard = this.interaction.options.getString("id-card");
                
        var cardOwnDataJoin = await CardInventory.getJoinUserData(this.userId, idCard);
        if(cardOwnDataJoin==null){
            return this.interaction.reply(Embed.errorMini(`I cannot find the card that you're looking for.`,this.discordUser, true, {
                title:`❌ Cannot find that card`
            }));
        }

        var card = new Card(cardOwnDataJoin.cardData);
        
        var tradeboardAll = new CardTradeboard(this.guildId, this.userId, cardOwnDataJoin.cardData);
        var allOfferData = await tradeboardAll.getAllOfferData(idCard, this.userId);

        if(!card.isTradable()){
            return this.interaction.reply(Embed.errorMini(`${card.getIdCard()} **${card.getName(15)}** are limited card and cannot be searched.`, this.discordUser, true, {
                title:"❌ Limited card"
            }));
        } else if(allOfferData==null){
            return this.interaction.reply({embeds:[
                Embed.builder(`Cannot find card trade listing for: ${card.getIdCard()} **${card.getName(15)}**`,this.discordUser, {
                    color:card.color, 
                    thumbnail:card.img_url, 
                    title:`❌ Trade listing not available`})
            ], ephemeral:true
            });
        }

        var arrPages = [];
        var idx = 0; var maxIdx = 4; var txtList = ``;
        for(var i=0;i<allOfferData.length;i++){
            var trader = new CardTradeboard();
            trader.initOffer(allOfferData[i]);
            let cardTrader = new Card(trader.CardLookingFor);
            txtList+=dedent(`**Id:** ${trader.id} | Posted by: <@${trader.id_user}>
            🔀${cardTrader.getRarity()} ${cardTrader.getIdCard()} **${cardTrader.getName(15)}**
            ─────────────────`)+`\n`;
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==allOfferData.length-1)){
                let embed = 
                Embed.builder(dedent(`${allOfferData.length} trade offer listing are available for this card:
                ${card.getRarity()} ${card.getIdCard()} **${card.getName()}**

                ${txtList}`),
                    Embed.builderUser.authorCustom(`Tradeboard Search Results`, Properties.imgSet.mofu.ok),{
                    color: card.color,
                    thumbnail:card.img_url
                })

                arrPages.push(embed);
                idx = 0; txtList="";
            } else {
                idx++;
            }
        }
        
        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
    }

    async listing(){
        //get all listing
        var ownTradeboard = new CardTradeboard(this.guildId, this.userId);
        var dataLookingFor = await ownTradeboard.getAllLookingForData(null, true);
        
        if(dataLookingFor==null){//validation: no active listing
            return this.interaction.reply(
                Embed.errorMini(`You haven't post any card trade listing yet.`,this.discordUser, true, { 
                title:`❌ No active listing are available`})
            );
        }

        var arrPages = [];
        var idx = 0; var maxIdx = 4; var txtList = ``;
        for(var i=0;i<dataLookingFor.length;i++){
            var trader = new CardTradeboard();
            trader.initLookingFor(dataLookingFor[i]);
            let card = new Card(trader.CardLookingFor);

            txtList+=dedent(`🔍 **Id:** ${trader.id}
            ${card.getRarity()} ${card.getIdCard()} ${card.getName(23, true)}
            ─────────────────`)+`\n`;
            
            //check for max page content
            if(idx>=maxIdx||(idx<maxIdx && i==dataLookingFor.length-1)){
                let embed = 
                Embed.builder(dedent(`**Active listing:** ${dataLookingFor.length}/${Tradeboard.limit.post}
                Here are your active card trade listing:

                ${txtList}`),
                    this.discordUser,{
                    color: this.user.set_color
                })

                arrPages.push(embed);
                idx = 0; txtList="";
            } else {
                idx++;
            }
        }

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
    }

    async remove(){
        var idListing = this.interaction.options.getString("list-id");
                
        var tradeboard = new CardTradeboard(this.guildId, this.userId);
        var tradeboardData = await tradeboard.getTradeboardDataById(idListing, true);
        if(tradeboardData==null){//validation: incorrect listing id
            return this.interaction.reply(
                Embed.errorMini(`Please re-enter with correct listing Id`,this.discordUser, true, {
                title:`❌ Cannot find this trade listing`})
            );
        }

        tradeboard.init(tradeboardData);//init the data
        var cardLookingFor = new Card(await Card.getCardData(tradeboard.id_looking_for));

        if(await tradeboard.remove()){
            //add 1 card back to user
            await CardInventory.updateStock(this.userId, tradeboard.id_offer);
            return await this.interaction.reply({embeds:[
                Embed.builder(`${cardLookingFor.getRarity()} ${cardLookingFor.getIdCard()} **${cardLookingFor.getName(15)}** has been removed from trade listing.`,this.discordUser, {
                    color: cardLookingFor.color,
                    title: `🗑️ Trade listing removed`,
                    thumbnail:cardLookingFor.img_url
                })
            ]});
        }
    }

    async trade(){
        var idListing = this.interaction.options.getString("list-id");
        var tradeboard = new CardTradeboard(this.guildId, this.userId);

        var tradeboardData = await tradeboard.getTradeboardDataById(idListing);
        if(tradeboardData==null){//validation: incorrect listing id
            return this.interaction.reply(
                Embed.errorMini(`Please re-enter with correct listing Id`,this.discordUser, true, {
                title:`❌ Cannot find this trade listing`})
            );
        }

        tradeboard.init(tradeboardData);
        if(tradeboard.id_user==this.userId){//validation: check if trade with own listing
            return this.interaction.reply(
                Embed.errorMini(`You cannot trade with your own trade listing`,this.discordUser, true, {
                title:`❌ Invalid trade ID`})
            );
        }

        var cardDataJoin = await CardInventory.getJoinUserData(this.userId, tradeboard.id_looking_for);
        if(cardDataJoin.cardInventoryData==null){//validation: check if user have card
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        var cardInventoryOwn = new CardInventory(cardDataJoin.cardInventoryData, cardDataJoin.cardData);
        if(cardInventoryOwn.stock<=0){ //validation: not enough duplicate
            return this.interaction.reply(
                Embed.errorMini(`${cardInventoryOwn.getRarity()} ${cardInventoryOwn.getIdCard()} **${cardInventoryOwn.getName(15)}** are required to trade with this listing.`, this.discordUser, true, {
                    title:"❌ Not enough duplicates"
                })
            );
        }
        cardInventoryOwn.stock-=1;
        await cardInventoryOwn.update();//update card stock

        var cardDataLookingFor = await Card.getCardData(tradeboard.id_looking_for);
        var cardDataOffer = await Card.getCardData(tradeboard.id_offer);
        tradeboard.setCardData(cardDataLookingFor, cardDataOffer);//init card data

        var cardOffer = new Card(tradeboard.CardOffer);
        var cardLookingFor = new Card(tradeboard.CardLookingFor);

        var txtDescription = dedent(`${Properties.emoji.mofuheart} <@${this.userId}> has successfully trade card with <@${tradeboard.id_user}>
            
        <@${this.userId}> has received:
        ${cardOffer.getCardEmoji()}${cardOffer.getRarity()} ${cardOffer.getIdCard()} **${cardOffer.getName(0, true)}**
        
        <@${tradeboard.id_user}> has received:
        ${cardLookingFor.getCardEmoji()}${cardLookingFor.getRarity()} ${cardLookingFor.id_card} **${cardLookingFor.getName(0, true)}**`);
        
        await this.interaction.reply({embeds:[
            Embed.builder(txtDescription, this.discordUser, {
                color:user.set_color,
                title:`✅ Card trade has complete!`,
                // thumbnail: cardOffer.img_url,
            })
        ]});

        await CardInventory.updateStock(this.userId, cardOffer.id_card);//add card to own user
        await CardInventory.updateStock(tradeboard.id_user, cardLookingFor.id_card);//add card to user lister
        return await tradeboard.remove();//remove tradeboard listing
    }
}

module.exports = TradeboardListener;
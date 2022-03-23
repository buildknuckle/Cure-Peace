const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const User = require("../modules/puzzlun/data/User");
const Validation = require("../modules/puzzlun/Validation");
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const {Tradeboard, CardTradeboard} = require("../modules/puzzlun/data/Tradeboard");
const Embed = require('../modules/puzzlun/Embed');

module.exports = {
    name: 'tradeboard',
    cooldown: 5,
    description: 'Contains all tradeboard command',
    args: true,
    options:[
        {
            name: "post",
            description: "Post card trade offer",
            type: 1,
            options: [
                {
                    name: "looking-for",
                    description: "Enter the precure card id that you're looking for",
                    type: 3,
                    required: true
                },
                {
                    name: "card-offer",
                    description: "Enter the precure card id that you will send",
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: "search-card",
            description: "Search the open listing from tradeboard",
            type: 1,
            options: [
                {
                    name: "id-card",
                    description: "Enter the precure card id that you're looking for",
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: "trade",
            description: "Prompt to trade with the selected trade list id",
            type: 1,
            options: [
                {
                    name: "list-id",
                    description: "Enter the trade list id that you want to trade with",
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: "list",
            description: "Open your tradeboard listing",
            type: 1
        },
        {
            name: "remove",
            description: "Remove your posted trade listing",
            type: 1,
            options: [
                {
                    name: "list-id",
                    description: "Enter the trade list id that you want to remove",
                    type: 3,
                    required: true
                },
            ]
        },
    ], async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        switch(subcommand){
            case "post":
                var idCardLookingFor = interaction.options.getString("looking-for");
                var idCardOffer = interaction.options.getString("card-offer");

                //validation: get user trade listing total
                var cardTradeboard = new CardTradeboard(guildId, userId);
                // var totalList = await Tradeboard.getTotalByUser(guildId, userId);
                var totalList = await cardTradeboard.getTotalByUser();
                if(totalList>=Tradeboard.limit.post){ //validation: total list
                    return interaction.reply(Embed.errorMini(`Your trade listing already full.`, discordUser, true, {
                        title:"❌ Cannot post trade listing"
                    }));
                }

                var cardDataLookingFor = await Card.getCardData(idCardLookingFor);
                var cardDataOffer = await CardInventory.getJoinUserData(userId, idCardOffer);
                //validation: check for available card:
                if(cardDataLookingFor==null){
                    return interaction.reply(
                        Embed.errorMini(`I cannot find the card that you're looking for.`,discordUser, true, {
                            title:`❌ Cannot find that card`
                        })
                    );
                }

                if(cardDataOffer==null){
                    return interaction.reply(
                        Embed.errorMini(`I cannot find the card that card offer.`,discordUser, true, {
                            title:`❌ Cannot find that card`
                        })
                    );
                }

                //validation: check if user have card:
                if(cardDataOffer.cardInventoryData==null){
                    return interaction.reply(Validation.Card.embedNotHave(discordUser));
                }

                var cardLookingFor = new Card(cardDataLookingFor);
                var cardOffer = new CardInventory(cardDataOffer.cardInventoryData, cardDataOffer.cardData);
                
                if(!cardLookingFor.isTradable()){ //validation: limited card
                    return interaction.reply(Embed.errorMini(`This card: **${cardLookingFor.id_card} - ${GlobalFunctions.cutText(cardLookingFor.name,15)}** are limited and cannot be traded.`, discordUser, true, {
                        title:"❌ Limited card"
                    }));
                } else if(!cardOffer.isTradable()){ //validation: limited card
                    return interaction.reply(Embed.errorMini(`This card: **${cardOffer.id_card} - ${GlobalFunctions.cutText(cardOffer.name,15)}** are limited and cannot be traded.`, discordUser, true, {
                        title:"❌ Limited card"
                    }));
                } else if(cardLookingFor.id_card.toLowerCase()==cardOffer.id_card.toLowerCase()){ //validation: same card
                    return interaction.reply(Embed.errorMini(`Cannot trade card with same id.`, discordUser, true, {
                        title:"❌ Same card id"
                    }));
                } else if(cardOffer.stock<=0){ //validation: not enough duplicate
                    return interaction.reply(Embed.errorMini(`You need 1x duplicate of: **${cardOffer.id_card} - ${GlobalFunctions.cutText(cardOffer.name,15)}** to trade this card.`, discordUser, true, {
                        title:"❌ Not enough duplicates"
                    }));
                }

                cardTradeboard.setCardData(cardDataLookingFor, cardDataOffer.cardData);
                var getSameListing = await cardTradeboard.findDuplicate();
                if(getSameListing!=null){ //validation: check for same listing
                    return interaction.reply(Embed.errorMini(`You cannot post the same trade listing again.`, discordUser, true, {
                        title:"❌ Listing already existed"
                    }));
                }

                cardOffer.stock-=1;//update user card inventory stock
                await cardOffer.update();
                await cardTradeboard.insert();//insert into tradeboard table

                var arrPages = [];
                var embed = Embed.builder(dedent(`${Properties.emoji.mofuheart} <@${userId}> has post new card listing on tradeboard`), 
                discordUser, {
                    color:user.set_color,
                    title:`❣️ New card trade listing!`,
                    thumbnail: cardOffer.img_url,
                    fields:[
                        {
                            name:`${discordUser.username} looking for:`,
                            value:dedent(`${cardLookingFor.getCardEmoji()}**${cardLookingFor.getRarityEmoji()}${cardLookingFor.rarity} ${cardLookingFor.id_card}** - ${cardLookingFor.getName(0, true)}`),
                        },
                        {
                            name:`${discordUser.username} will offer:`,
                            value:dedent(`${cardLookingFor.getCardEmoji()}**${cardOffer.getRarityEmoji()}${cardOffer.rarity} ${cardOffer.id_card}** - ${cardOffer.getName(0, true)}`),
                        },
                    ],
                    footer:Embed.builderUser.footer(`Trade on this list with: /tradeboard trade ${cardTradeboard.id}`)
                });
                
                return await interaction.reply({embeds:[embed]});
                break;
            case "search-card":
                var idCard = interaction.options.getString("id-card");
                
                var cardOwnDataJoin = await CardInventory.getJoinUserData(userId, idCard);
                if(cardOwnDataJoin==null){
                    return interaction.reply(Embed.errorMini(`I cannot find the card that you're looking for.`,discordUser, true, {
                        title:`❌ Cannot find that card`
                    }));
                }

                var card = new Card(cardOwnDataJoin.cardData);
                
                var tradeboardAll = new CardTradeboard(guildId, userId, cardOwnDataJoin.cardData);
                var allOfferData = await tradeboardAll.getAllOfferData(idCard, userId);

                if(!card.isTradable()){
                    return interaction.reply(Embed.errorMini(`This card: **${card.id_card} - ${GlobalFunctions.cutText(card.name,15)}** are limited and cannot be traded.`, discordUser, true, {
                        title:"❌ Limited card"
                    }));
                } else if(allOfferData==null){
                    return interaction.reply({embeds:[
                        Embed.builder(`Cannot find the trade listing for: **${card.getRarityEmoji()} ${card.rarity} ${card.id_card}**`,discordUser, {
                            color:card.color, 
                            thumbnail:card.img_url, 
                            title:`❌ No listing are available`})
                    ], ephemeral:true
                    });
                }

                var arrPages = [];
                var idx = 0; var maxIdx = 4; var txtList = ``;
                for(var i=0;i<allOfferData.length;i++){
                    var trader = new CardTradeboard();
                    trader.initOffer(allOfferData[i]);
                    let cardTrader = trader.CardLookingFor;
                    txtList+=dedent(`**Id:** ${trader.id} | Posted by: <@${trader.id_user}>
                    **Looking for:** ${cardTrader.getRarityEmoji()}${cardTrader.rarity} ${cardTrader.id_card} - ${GlobalFunctions.cutText(cardTrader.name, 15)}
                    ─────────────────`)+`\n`;
                    
                    //check for max page content
                    if(idx>maxIdx||(idx<maxIdx && i==allOfferData.length-1)){
                        let embed = 
                        Embed.builder(dedent(`${allOfferData.length} trade offer listing are available for this card:
                        **${card.getRarityEmoji()}${card.rarity} ${card.id_card} - ${card.name}**

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
                
                return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
                break;
            case "list":
                //get all listing
                var ownTradeboard = new CardTradeboard(guildId, userId);
                var dataLookingFor = await ownTradeboard.getAllLookingForData(null, true);
                
                if(dataLookingFor==null){//validation: no active listing
                    return interaction.reply(
                        Embed.errorMini(`You haven't post any card trade listing yet.`,discordUser, true, { 
                        title:`❌ No active listing are available`})
                    );
                }

                var arrPages = [];
                var idx = 0; var maxIdx = 4; var txtList = ``;
                for(var i=0;i<dataLookingFor.length;i++){
                    var trader = new CardTradeboard();
                    trader.initLookingFor(dataLookingFor[i]);
                    let card = trader.CardLookingFor;

                    txtList+=dedent(`**List Id:** ${trader.id}
                    ${card.getRarityEmoji()}${card.rarity} ${card.id_card} - ${card.getName(15, true)}
                    ─────────────────`)+`\n`;
                    
                    //check for max page content
                    if(idx>maxIdx||(idx<maxIdx && i==dataLookingFor.length-1)){
                        let embed = 
                        Embed.builder(dedent(`${Properties.emoji.mofuheart} **Active listing:** ${dataLookingFor.length}/${Tradeboard.limit.post}
                        Here are your active card trade listing:

                        ${txtList}`),
                            discordUser,{
                            color: user.set_color
                        })

                        arrPages.push(embed);
                        idx = 0; txtList="";
                    } else {
                        idx++;
                    }
                }

                return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, true);
                break;
            case "remove":
                var idListing = interaction.options.getString("list-id");
                
                var tradeboard = new CardTradeboard(guildId, userId);
                var tradeboardData = await tradeboard.getTradeboardDataById(idListing, true);
                if(tradeboardData==null){//validation: incorrect listing id
                    return interaction.reply(
                        Embed.errorMini(`Please re-enter with correct listing Id`,discordUser, true, {
                        title:`❌ Cannot find this trade listing`})
                    );
                }

                tradeboard.init(tradeboardData);//init the data
                var cardLookingFor = new Card(await Card.getCardData(tradeboard.id_looking_for));

                if(await tradeboard.remove()){
                    //add 1 card back to user
                    await CardInventory.updateStock(userId, tradeboard.id_offer);
                    return await interaction.reply({embeds:[
                        Embed.builder(`Trade listing: **${cardLookingFor.getRarityEmoji()}${cardLookingFor.rarity} ${cardLookingFor.getName(15)}** has been removed. `,discordUser, {
                            color: cardLookingFor.color,
                            title: `🗑️ Trade listing removed`,
                            thumbnail:cardLookingFor.img_url
                        })
                    ]});
                }
                    
                    return;
                break;
            case "trade":
                var idListing = interaction.options.getString("list-id");
                var tradeboard = new CardTradeboard(guildId, userId);

                var tradeboardData = await tradeboard.getTradeboardDataById(idListing);
                if(tradeboardData==null){//validation: incorrect listing id
                    return interaction.reply(
                        Embed.errorMini(`Please re-enter with correct listing Id`,discordUser, true, {
                        title:`❌ Cannot find this trade listing`})
                    );
                }

                tradeboard.init(tradeboardData);
                if(tradeboard.id_user==userId){//validation: check if trade with own listing
                    return interaction.reply(
                        Embed.errorMini(`You cannot trade with your own trade listing`,discordUser, true, {
                        title:`❌ Invalid trade ID`})
                    );
                }

                var cardDataJoin = await CardInventory.getJoinUserData(userId, tradeboard.id_looking_for);
                if(cardDataJoin.cardInventoryData==null){//validation: check if user have card
                    return interaction.reply(Validation.Card.embedNotHave(discordUser));
                }

                var cardInventoryOwn = new CardInventory(cardDataJoin.cardInventoryData, cardDataJoin.cardData);
                if(cardInventoryOwn.stock<=0){ //validation: not enough duplicate
                    return interaction.reply(
                        Embed.errorMini(`You need 1x duplicate of: **${cardInventoryOwn.getRarityEmoji()}${cardInventoryOwn.rarity} ${cardInventoryOwn.id_card} - ${cardInventoryOwn.getName(15)}** to trade with this listing.`, discordUser, true, {
                            title:"❌ Not enough duplicates"
                        })
                    );
                }
                cardInventoryOwn.stock-=1;
                await cardInventoryOwn.update();//update card stock

                var cardDataLookingFor = await Card.getCardData(tradeboard.id_looking_for);
                var cardDataOffer = await Card.getCardData(tradeboard.id_offer);
                tradeboard.setCardData(cardDataLookingFor, cardDataOffer);//init card data

                var cardOffer = tradeboard.CardOffer;
                var cardLookingFor = tradeboard.CardLookingFor;

                var txtDescription = dedent(`${Properties.emoji.mofuheart} <@${userId}> has successfully trade card with <@${tradeboard.id_user}>
                    
                <@${userId}> has received:
                **${cardOffer.getCardEmoji()}${cardOffer.getRarityEmoji()}${cardOffer.rarity} ${cardOffer.id_card}** - ${cardOffer.getName(0, true)}
                
                <@${tradeboard.id_user}> has received:
                **${cardLookingFor.getCardEmoji()}${cardLookingFor.getRarityEmoji()}${cardLookingFor.rarity} ${cardLookingFor.id_card}** - ${cardLookingFor.getName(0, true)}`);
                
                await interaction.reply({embeds:[
                    Embed.builder(txtDescription, discordUser, {
                        color:user.set_color,
                        title:`✅ Card trade has complete!`,
                        // thumbnail: cardOffer.img_url,
                    })
                ]});

                await CardInventory.updateStock(userId, cardOffer.id_card);//add card to own user
                await CardInventory.updateStock(tradeboard.id_user, cardLookingFor.id_card);//add card to user lister
                return await tradeboard.remove();//remove tradeboard listing
                break;
        }

    }
}
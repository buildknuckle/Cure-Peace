const {MessageActionRow, MessageButton, MessageEmbed, Discord, Emoji} = require('discord.js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
// const CardModule = require('../modules/Card');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Embed = require('../modules/puzzlun/Embed');
const dedent = require('dedent-js');


module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Card daily commands',
    options:[
        {
            name: "check-in",
            description: "Select the color check-in rewards",
            type: 1,
            options: [
                {
                    name: "selection",
                    description: "Select the color check-in rewards",
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: "all",
                            value: "all"
                        },
                        {
                            name: "pink",
                            value: "pink"
                        },
                        {
                            name: "blue",
                            value: "blue"
                        },
                        {
                            name: "yellow",
                            value: "yellow"
                        },
                        {
                            name: "purple",
                            value: "purple"
                        },
                        {
                            name: "red",
                            value: "red"
                        },
                        {
                            name: "green",
                            value: "green"
                        },
                        {
                            name: "white",
                            value: "white"
                        }
                    ],
                }
            ]
        },
        {
            name: "quest",
            description: "Check in for daily quests",
            type: 2,
            options:[
                {
                    name: "list",
                    description: "Receive new quests/open the quests list",
                    type: 1,
                },
                {
                    name: "submit",
                    description: "Submit the card quests",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id",
                            type: 3,
                            required:true
                        }
                    ]
                },
            ]
        }
    ],
	async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        switch(command){
            case "quest":
                switch(subcommand){
                    case "list":
                        var user = new User(await User.getData(userId));
                        if(user.Daily.quuser.Daily.getCardQuestTotal<=0){

                        }
                        break;
                }
                break;
        }

        switch(subcommand){
            case "check-in":
                //check in date validation
                var user = new User(await User.getData(userId));
                var resetTime = new Date();
                resetTime.setHours(24, 0, 0, 0);
                var timeRemaining = GlobalFunctions.getDateTimeDifference(resetTime.getTime(),new Date().getTime());
                timeRemaining = timeRemaining.hours + " Hour " + timeRemaining.minutes + " Min";
                var arrPages = [];

                if(user.hasLogin()){
                    var objEmbed = Embed.errorMini(`:x: You have already received your daily rewards for today.\nNext daily available in: **${timeRemaining}**`, discordUser, true);
                    return interaction.reply(objEmbed);
                }

                var selectedColor = interaction.options._hoistedOptions[0].value;
                var series = new Series(user.set_series);

                var dailyRewards = {
                    jewel: 1,
                    color: 70,
                    txtColor:"",
                    mofucoin: 100,
                    series: 50,
                    iconBoost: "",
                    embedColor:Embed.color.yellow
                }

                if(selectedColor!="all"){
                    dailyRewards.color*=2;
                    dailyRewards.mofucoin*=2;
                    dailyRewards.series*=2;
                    dailyRewards.iconBoost="⏫";
                    dailyRewards.embedColor = Embed.color[selectedColor];
                    dailyRewards.txtColor=`${Color[selectedColor].emoji} ${dailyRewards.color} ${selectedColor} points (${user.Color[user.set_color].point}/${User.limit.colorPoint})`;

                    //process rewards to user
                    user.Currency.jewel+=dailyRewards.jewel;
                    user.Currency.mofucoin+=dailyRewards.mofucoin;
                    user.Color[selectedColor].point+=dailyRewards.color;
                    user.Series[user.set_series]+=dailyRewards.series;
                } else {
                    //process rewards to user
                    user.Currency.jewel+=dailyRewards.jewel;
                    user.Currency.mofucoin+=dailyRewards.mofucoin;
                    dailyRewards.txtColor=`${Properties.emoji.mofuheart} ${dailyRewards.color} color points`;

                    var arrColor = Object.keys(Color);
                    for(var key in arrColor){
                        let color = arrColor[key];
                        user.Color[color].point+=dailyRewards.color;
                    }

                    var arrSeries = Object.keys(SPack);
                    for(var i=0; i<arrSeries.length; i++){
                        let series = arrSeries[i];
                        user.Series[series]+=dailyRewards.series;
                    }
                }

                //check if user have 10 cards/not
                var txtNewbieBonus = "";
                if(await CardInventory.getTotalAll(userId)<=0){
                    txtNewbieBonus="\n\n**You have received 10 bonus starter card!**\n";

                    var query = `
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=1 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 3) UNION ALL
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=2 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 2) UNION ALL 
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=3 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 2) UNION ALL 
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=4 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 1) UNION ALL 
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=5 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 1) UNION ALL 
                    (SELECT * FROM ${Card.tablename} 
                    WHERE ${Card.columns.rarity}=6 AND ${Card.columns.is_spawnable}=1 
                    ORDER BY rand() LIMIT 1)`;
                    
                    var rndCard = await DBConn.conn.query(query, []);
                    for(var i=0;i<rndCard.length;i++){
                        var card = new Card(rndCard[i]);
                        txtNewbieBonus+=`${Color[card.color].emoji} ${card.id_card}: [${GlobalFunctions.cutText(card.name, 25)}](${card.img_url})\n`;
                        await CardInventory.updateStock(userId, card.id_card);
                    }
                }

                arrPages.push(
                    Embed.builder(dedent(`✅ <@${userId}> has successfully checked in for the daily!

                    **Rewards received:** ${dailyRewards.iconBoost}
                    ${dailyRewards.txtColor}
                    ${Properties.currency.mofucoin.emoji} ${dailyRewards.mofucoin} mofucoin (${user.Currency.mofucoin}/${User.limit.currency.mofucoin})
                    ${series.emoji.mascot} ${dailyRewards.series} ${series.currency.name.toLowerCase()} (${user.Series[user.set_series]}/${User.limit.seriesPoint})
                    ${Properties.currency.jewel.emoji} ${dailyRewards.jewel} jewel (${user.Currency.jewel}/${User.limit.currency.jewel})${txtNewbieBonus}`),
                    discordUser,{
                        color:dailyRewards.embedColor,
                        title:`Check In Complete!`,
                        thumbnail:Properties.imgSet.mofu.ok,
                        footer:Embed.builderUser.footer(`Next daily available in: ${timeRemaining}`)
                    })
                );

                //generate 3 card quest
                var txtCardQuest = ``;
                var arrCardQuest = [];
                var query = `(SELECT * FROM ${Card.tablename} 
                WHERE ${Card.columns.rarity}=2 AND ${Card.columns.is_spawnable}=1 
                ORDER BY rand() LIMIT 1) UNION ALL 
                (SELECT * FROM ${Card.tablename} 
                WHERE ${Card.columns.rarity}=3 AND ${Card.columns.is_spawnable}=1 
                ORDER BY rand() LIMIT 2) UNION ALL 
                (SELECT * FROM ${Card.tablename} 
                WHERE ${Card.columns.rarity}=4 AND ${Card.columns.is_spawnable}=1 
                ORDER BY rand() LIMIT 1)`;
                var rndCardQuest = await DBConn.conn.query(query, []);
                for(var i=0;i<rndCardQuest.length;i++){
                    var card = new Card(rndCardQuest[i]);
                    txtCardQuest+=`${Color[card.color].emoji_card} ${CardInventory.emoji.rarity(false, card.rarity)}${card.rarity} **${card.id_card}**: ${GlobalFunctions.cutText(card.name,18)}\n\n`;
                    arrCardQuest.push(card.id_card);
                }

                user.Daily.setCardQuest(arrCardQuest);
                

                arrPages.push(
                    Embed.builder(dedent(`Here are the requested card list for today:
                    ${txtCardQuest}`), discordUser, {
                        title:`New Card Quest Received!`,
                        footer:Embed.builderUser.footer(`Access the card quest anytime with: /daily quest list`)
                    })
                );
                
                //update daily token
                user.Daily.lastCheckInDate = GlobalFunctions.getCurrentDate();
                // await user.update();

                
                // await interaction.reply({embeds:[objEmbed]});
                return await paginationEmbed(interaction, arrPages, DiscordStyles.Button.pagingButtonList);

                break;
        }

        // // console.log(interaction.options._hoistedOptions[0]);

        
        //     case "quest":

        //     var userCardData = await CardModule.getCardUserStatusData(userId);
        //     var lastDate = -1; var requestedIdCard = "";
        //     var requestedCards = ""; var requestedRewards = "";

        //     //get latest taken date & data if not null
        //     if(userCardData[DBM_Card_User_Data.columns.daily_quest]!=null){
        //         var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
        //         lastDate = jsonParsedData[CardModule.Quest.questData.last_daily_quest];
        //     }

        //     switch(commandSubcommand){
        //         case "list":
        //             objEmbed.description = `<@${userId}>, here are the requested cards list for today:\nYou can submit the quest with: **p!daily quest submit <card id>**`;
        //             objEmbed.author = {
        //                 name: `Daily Quest`,
        //                 icon_url: CardModule.Properties.imgResponse.imgOk
        //             }
    
        //             var lastDate = -1; var requestedIdCard = "";
    
        //             var requestedCards = ""; var requestedRewards = "";
    
        //             //get latest taken date & data if not null
        //             if(userCardData[DBM_Card_User_Data.columns.daily_quest]!=null){
        //                 var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
        //                 lastDate = jsonParsedData[CardModule.Quest.questData.last_daily_quest];
        //             }

        //             if(lastDate==-1||lastDate!=new Date().getDate()){
        //                 //check for daily quest if already requested/not
        //                 var objQuestData = "{";
        //                 requestedCards = ""; requestedRewards = "";
        //                 //get 4 randomized card
        //                 var query = `SELECT * FROM 
        //                 (
        //                     SELECT cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.name},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.rarity},idat.${DBM_Item_Data.columns.id} as id_item,idat.${DBM_Item_Data.columns.name} as item_name 
        //                         FROM ${DBM_Card_Data.TABLENAME} cd,${DBM_Item_Data.TABLENAME} idat 
        //                         WHERE cd.${DBM_Card_Data.columns.rarity}<=? AND 
        //                         idat.${DBM_Item_Data.columns.category} in ('card','ingredient','ingredient_rare') 
        //                         GROUP BY cd.${DBM_Card_Data.columns.id_card},idat.${DBM_Item_Data.columns.id} 
        //                         ORDER BY rand() LIMIT 4 
        //                 ) T1 
        //                 ORDER BY T1.rarity`;
        //                 var randomizedCardData = await DBConn.conn.promise().query(query, [3]);
                        
        //                 randomizedCardData[0].forEach(entry => {
        //                     // idCard+=`${entry[DBM_Card_Data.columns.id_card]},`;
        //                     objQuestData+=`"${entry[DBM_Card_Data.columns.id_card]}":"${entry["id_item"]}",`;
        //                     //randomize the reward:
        //                     requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],12)}\n`;
        //                     requestedRewards+=`**${entry["id_item"]}**: ${GlobalFunctions.cutText(entry["item_name"],12)} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC&SP\n`;
        //                 });
    
        //                 objQuestData = objQuestData.replace(/,\s*$/, "");
        //                 objQuestData+="}";
    
        //                 objEmbed.fields = [
        //                     {
        //                         name:`Card Quest List:`,
        //                         value:requestedCards,
        //                         inline:true
        //                     },
        //                     {
        //                         name:`Item & MC Reward:`,
        //                         value:requestedRewards,
        //                         inline:true
        //                     }
        //                 ];
    
        //                 // idCard = idCard.replace(/,\s*$/, "");
        //                 await CardModule.Quest.setQuestData(userId,objQuestData);
        //             } else if(lastDate==new Date().getDate()){
        //                 if(Object.keys(jsonParsedData[CardModule.Quest.questData.dataQuest]).length>=1){
        //                     var questData = jsonParsedData[CardModule.Quest.questData.dataQuest];
        //                     var arrItemReward = [];
    
        //                     Object.keys(questData).forEach(function(key){
        //                         requestedIdCard+=`"${key}",`;
        //                         arrItemReward.push(questData[key]);
        //                     });
        //                     requestedIdCard = requestedIdCard.replace(/,\s*$/, "");
    
        //                     var query = `SELECT * 
        //                     FROM ${DBM_Card_Data.TABLENAME} 
        //                     WHERE ${DBM_Card_Data.columns.id_card} IN (${requestedIdCard}) 
        //                     ORDER BY ${DBM_Card_Data.columns.rarity}`;
    
        //                     var cardData = await DBConn.conn.promise().query(query);
        //                     var ctr = 0;//for item data
        //                     for(var key in cardData[0]){
        //                         var entry = cardData[0][key];
        //                         requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],17)}\n`;
    
        //                         //get the item reward
        //                         var itemData = await ItemModule.getItemData(arrItemReward[ctr]); ctr++;
        //                         requestedRewards+=`**${itemData[DBM_Item_Data.columns.id]}**: ${GlobalFunctions.cutText(itemData[DBM_Item_Data.columns.name],12)} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC&SP\n`;
        //                     }
    
        //                     objEmbed.fields = [{
        //                         name:`Quest List:`,
        //                         value:requestedCards,
        //                         inline:true
        //                     },
        //                     {
        //                         name:`Item & MC Reward:`,
        //                         value:requestedRewards,
        //                         inline:true
        //                     }];
        //                 } else {
        //                     objEmbed.description = "You have no more daily quest for today.";
        //                 }
                        
        //             }
        //             return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             break;
        //         case "submit":

        //             //submit the daily quest
        //             if(lastDate!=new Date().getDate()){
        //                 objEmbed.thumbnail = {
        //                     url:CardModule.Properties.imgResponse.imgError
        //                 }
        //                 objEmbed.description = `:x: Sorry, you cannot submit this quests anymore. Please request new daily quest with **daily quest  list** command.`;
        //                 return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             }

        //             var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();

        //             //check if card ID exists/not
        //             var cardData = await CardModule.getCardData(cardId);
        //             if(cardData==null){
        //                 objEmbed.thumbnail = {
        //                     url:CardModule.Properties.imgResponse.imgError
        //                 }
        //                 objEmbed.description = ":x: I can't find that card ID.";

        //                 return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             }

        //             //lowercase the card id
        //             cardId = cardId.toLowerCase();

        //             var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
        //             var requestedIdCard = jsonParsedData[CardModule.Quest.questData.dataQuest];
                    
        //             var idCardExists = false;

        //             var itemRewardData = null;
        //             for(var key in requestedIdCard){
        //                 var idItemReward = requestedIdCard[key];
        //                 if(key.toLowerCase()==cardId){
        //                     itemRewardData = await ItemModule.getItemData(idItemReward);
        //                     idCardExists = true;
        //                 }
        //             }

        //             //check for card quest id
        //             if(!idCardExists){
        //                 objEmbed.thumbnail = {
        //                     url:CardModule.Properties.imgResponse.imgError
        //                 }
        //                 objEmbed.description = `:x: That card id is not on the quest list today.`;
        //                 return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             }

        //             //check if user have card/not
        //             var userCardStock = await CardModule.getUserCardStock(userId,cardId);
        //             if(userCardStock<=0){
        //                 objEmbed.thumbnail = {
        //                     url:CardModule.Properties.imgResponse.imgError
        //                 }
        //                 objEmbed.description = `:x: You need another: **${cardData[DBM_Card_Data.columns.name]}** to submit the card quest.`;
        //                 return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             } else {
        //                 var mofucoinReward = CardModule.Quest.getQuestReward(cardData[DBM_Card_Data.columns.rarity]);
        //                 //update card stock
        //                 var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
        //                 SET  ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1 
        //                 WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
        //                 ${DBM_Card_Inventory.columns.id_card}=?`;
        //                 await DBConn.conn.promise().query(query,[userId,cardId]);

        //                 //update mofucoin
        //                 await CardModule.updateMofucoin(userId,mofucoinReward);
        //                 //update series point
        //                 var seriesId = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;
        //                 var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;
                        
        //                 var objSeries = new Map();
        //                 objSeries.set(seriesId,mofucoinReward);
        //                 await CardModule.updateSeriesPoint(userId,objSeries);

        //                 //add item reward
        //                 if(itemRewardData!=null){
        //                     await ItemModule.addNewItemInventory(userId,itemRewardData[DBM_Item_Data.columns.id]);
        //                 }

        //                 //update the quest data:
        //                 delete requestedIdCard[cardId];
                        
        //                 var parameterSet = new Map();
        //                 parameterSet.set(DBM_Card_User_Data.columns.daily_quest,JSON.stringify(jsonParsedData));
        //                 var parameterWhere = new Map();
        //                 parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
        //                 await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        
        //                 objEmbed.author = {
        //                     name: userUsername,
        //                     icon_url: userAvatarUrl
        //                 }
        //                 objEmbed.title = "Daily Quest Completed!";
        //                 objEmbed.thumbnail = {
        //                     url:CardModule.Properties.imgResponse.imgOk
        //                 }
        //                 objEmbed.description = `You have submit the daily card quest: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}**.`;
        //                 objEmbed.fields = [
        //                     {
        //                         name:"Rewards Received:",
        //                         value:`>**Item:** ${itemRewardData[DBM_Item_Data.columns.name]} (**${itemRewardData[DBM_Item_Data.columns.id]}**)\n>${mofucoinReward} Mofucoin\n>${mofucoinReward} ${seriesCurrency}`
        //                     }
        //                 ];
        //                 return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
        //             }

        //             break;
        //     }
        //         break;
        // }

    }
};
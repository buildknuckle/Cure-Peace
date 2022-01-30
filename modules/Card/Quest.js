const stripIndents = require("common-tags/lib/stripIndents")
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');

const GlobalFunctions = require('../../modules/GlobalFunctions');

const Embed = require("../../modules/card/Embed");
const GProperties = require("../../modules/card/Properties");
const CPackModule = require("../../modules/card/Cpack");
const SPackModule = require("../../modules/card/Spack");
const CardModule = require("../../modules/card/Card");
const UserModule = require("../../modules/card/User");

const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require("../../database/model/DBM_Card_Inventory");

class Properties {
    static dataKey = {
        lastCheckInDate:"lastCheckInDate",
        lastQuestDate:"lastQuestDate",
        quest:"quest",
        //quest key:
        battle:"battle",
        kirakiraDelivery:"kirakiraDelivery",
        card:"card",
    }
    
    static questDataKey = {
        card:{
            id:"id",
            colorPoint:"colorPoint",
            seriesPoint:"seriesPoint",
            mofucoin:"mofucoin",
            item:"item",
            //for query results:
            cardData:"cardData"
        },
        kirakiraDelivery:{},
        battle:{},
    }
}

class Card {
    static async generateQuest(objUserData, userStatusData){
        var questDate = GlobalFunctions.getCurrentDate();
        var parsedQuestData = JSON.parse(userStatusData[DBM_User_Data.columns.daily_data]);
        var parsedCardQuest = parsedQuestData[Properties.dataKey.quest][Properties.dataKey.card];
    
        var activeQuest = 0;//default
    
        if(parsedQuestData[Properties.dataKey.lastQuestDate]!=questDate){
            var query = `(SELECT * FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}=1 AND ${DBM_Card_Data.columns.is_spawnable}=1
            ORDER BY RAND() LIMIT 1) UNION 
            (SELECT * FROM ${DBM_Card_Data.TABLENAME}  
            WHERE ${DBM_Card_Data.columns.rarity}=2 AND ${DBM_Card_Data.columns.is_spawnable}=1
            ORDER BY RAND() LIMIT 1) UNION 
            (SELECT * FROM ${DBM_Card_Data.TABLENAME}  
            WHERE ${DBM_Card_Data.columns.rarity}=3 AND ${DBM_Card_Data.columns.is_spawnable}=1 
            ORDER BY RAND() LIMIT 1) UNION 
            (SELECT * FROM ${DBM_Card_Data.TABLENAME}  
            WHERE ${DBM_Card_Data.columns.rarity}=4 AND ${DBM_Card_Data.columns.is_spawnable}=1 
            ORDER BY RAND() LIMIT 1)`;
            var cardData = await DBConn.conn.query(query,[]);//randomize card quest

            activeQuest=cardData.length;
            for(var i=0;i<cardData.length;i++){
                var rarity = cardData[i][DBM_Card_Data.columns.rarity];
                //init the reward
                var colorPointReward = rarity*30; var seriesPointReward = rarity*10; var mofucoinReward = rarity*20;
    
                parsedCardQuest[i]={};//init the object
                parsedCardQuest[i][Properties.questDataKey.card.id] = cardData[i][DBM_Card_Data.columns.id_card];
                parsedCardQuest[i][Properties.questDataKey.card.colorPoint] = colorPointReward;
                parsedCardQuest[i][Properties.questDataKey.card.seriesPoint] = seriesPointReward;
                parsedCardQuest[i][Properties.questDataKey.card.mofucoin] = mofucoinReward;
            }
    
            parsedQuestData[Properties.dataKey.quest][Properties.dataKey.card] = parsedCardQuest;//send back to original var
            parsedQuestData[Properties.dataKey.lastQuestDate] = GlobalFunctions.getCurrentDate();
    
            //update the data
            var updateData = {};
            updateData[DBM_User_Data.columns.daily_data] = JSON.stringify(parsedQuestData);
            await UserModule.updateData(objUserData.id, userStatusData, updateData);

            //parse the card data
            for(var i=0;i<cardData.length;i++){
                parsedCardQuest[i][Properties.questDataKey.card.cardData] = cardData[i];//add to parsed card quest
            }
        } else if(parsedQuestData[Properties.dataKey.quest][Properties.dataKey.card].length>0) {
            var query = `SELECT * FROM ${DBM_Card_Data.TABLENAME} WHERE `;
            var arrParam = [];
            for(var idx in parsedCardQuest){
                var idCard = parsedCardQuest[idx][Properties.questDataKey.card.id];
                query+=` ${DBM_Card_Data.columns.id_card}=? OR`;
                arrParam.push(idCard);
            }
            query = query.substring(0, query.lastIndexOf(" "));
            query+=` ORDER BY ${DBM_Card_Data.columns.rarity}`;
            var cardData = await DBConn.conn.query(query, arrParam);
            activeQuest=cardData.length;
    
            //search for card data
            for(var i=0;i<cardData.length;i++){
                var id = cardData[i][DBM_Card_Data.columns.id_card];
                
                //init the reward
                var colorPointReward = parsedQuestData[Properties.questDataKey.card.colorPoint]; 
                var seriesPointReward = parsedQuestData[Properties.questDataKey.card.seriesPoint]; 
                var mofucoinReward = parsedQuestData[Properties.questDataKey.card.mofucoin];
    
                var searchResults = parsedCardQuest.filter(function(item) {
                    return item[Properties.questDataKey.card.id] === id;
                });
                searchResults = searchResults[0];
                var idx = parsedCardQuest.indexOf(searchResults);
                parsedCardQuest[idx][Properties.questDataKey.card.cardData] = cardData[i];//add to parsed card quest
            }
    
        }
    
        //card quests
        var objEmbed = new MessageEmbed({
            color: Embed.color.yellow,
            author: {
                name: `Daily Card Quest List (${activeQuest}/4)`,
                icon_url: GProperties.imgMofu.ok
            },
            description:``
        });
    
        if(activeQuest>0){
            objEmbed.description += `<@${objUserData.id}>, here are the requested card list for today:\nYou can submit card quest with: **/daily quest submit <card id>**\n\n`;
            for(var idx in parsedCardQuest){
                var cardData = parsedCardQuest[idx][Properties.questDataKey.card.cardData];
                var rarity = cardData[DBM_Card_Data.columns.rarity];
                var id = cardData[DBM_Card_Data.columns.id_card];
                var pack = cardData[DBM_Card_Data.columns.pack];
                var color = CPackModule[pack].Properties.color;
                var name = cardData[DBM_Card_Data.columns.name];
                var series = cardData[DBM_Card_Data.columns.series];
                var seriesCurrency = SPackModule[series].Properties.currency;
    
                var colorPointReward = parsedCardQuest[idx][Properties.questDataKey.card.colorPoint];
                var seriesPointReward = parsedCardQuest[idx][Properties.questDataKey.card.seriesPoint];
                var mofucoinReward = parsedCardQuest[idx][Properties.questDataKey.card.mofucoin];
    
                objEmbed.description+=stripIndents`**${rarity}${GProperties.emoji.r1}: ${id} (${GlobalFunctions.cutText(name,28)})**
                **Rewards:**
                ${GProperties.color[color].icon} ${colorPointReward} ${color} points
                ${SPackModule[series].Properties.icon.mascot_emoji} ${seriesPointReward} ${seriesCurrency.name}
                ${GProperties.currency.mofucoin.icon_emoji} ${mofucoinReward} mofucoin`;
                objEmbed.description+=`\n\n`;
            }
    
            objEmbed.description+=`*Complete all daily card quest to receive 1 ${GProperties.emoji.jewel}`;
        } else {
            objEmbed.title = `Daily card quest has been completed!`;
            objEmbed.description += `✅ You have completed all the card quest for today`;
            objEmbed.thumbnail = {
                url:GProperties.imgMofu.ok
            }
        }
    
        return {embeds:[objEmbed]};
    }

    static async submitQuest(objUserData, userStatusData, idCardSubmit){
        idCardSubmit = idCardSubmit.toLowerCase();//lowercase the id card
        var questDate = GlobalFunctions.getCurrentDate();
        var parsedDailyData = JSON.parse(userStatusData[DBM_User_Data.columns.daily_data]);
        var parsedCardQuest = parsedDailyData[Properties.dataKey.quest][Properties.dataKey.card];

        var userId = objUserData.id;

        //VALIDATION
        if(parsedDailyData[Properties.dataKey.lastQuestDate]!=questDate){//if quest has expired
            return Embed.errorMini(`:x: Please receive new card quest with: **/daily quest list**`,objUserData,true, {
                title:`Daily Card Quest Has Expired`
            });
        } 
        
        var searchResult = parsedCardQuest.filter(function(item) {
            return item[Properties.questDataKey.card.id] === idCardSubmit;
        });
        if(searchResult.length<=0){//if id card does not exists on quest list
            return Embed.errorMini(`:x: That card is not on the quest list for today.`,objUserData,true);
        }

        //process the rewards
        searchResult = searchResult[0];
        var idx = parsedCardQuest.indexOf(searchResult);//get the index
        var colorPointReward = parsedCardQuest[idx][Properties.questDataKey.card.colorPoint];
        var seriesPointReward = parsedCardQuest[idx][Properties.questDataKey.card.seriesPoint];
        var mofucoinReward = parsedCardQuest[idx][Properties.questDataKey.card.mofucoin];

        //get card data:
        var cardData = await CardModule.getCardData(idCardSubmit);
        var cardId = cardData[DBM_Card_Data.columns.id_card];
        var color = cardData[DBM_Card_Data.columns.color]; var series = cardData[DBM_Card_Data.columns.series];
        var name = cardData[DBM_Card_Data.columns.name];
        var rarity = cardData[DBM_Card_Data.columns.rarity];

        //card stock validation
        var cardInventoryData = await UserModule.Card.getInventoryData(userId, cardId);
        if(cardInventoryData==null){
            return Embed.errorMini(`:x: You need 1x **${cardId} - ${name}** to submit this card quest.`,objUserData,true, {
                title:`Not Enough Card`
            });
        } else if(cardInventoryData[DBM_Card_Inventory.columns.stock]<1) {
            return Embed.errorMini(`:x: You need 1x **${cardId} - ${name}** to submit this card quest.`,objUserData,true, {
                title:`Not Enough Card`
            });
        }

        //start update
        parsedCardQuest = GlobalFunctions.removeArrayItem(parsedCardQuest,searchResult);
        parsedDailyData[Properties.dataKey.quest][Properties.dataKey.card] = parsedCardQuest;
        //update user quest data
        var objUpdateData = {};
        var mapColorPoint = new Map();
        mapColorPoint.set(DBM_User_Data.columns.color_data);//update color point
        //update series point
        objUpdateData[DBM_User_Data.columns.daily_data] = JSON.stringify(parsedDailyData);//parse daily data
        await UserModule.updateData(userId, userStatusData, objUpdateData);

        await UserModule.Card.updateStockParam(userId, cardId, cardInventoryData,-1);//update card stock

        return {embeds:[Embed.builder(`✅ You have submit: 1x **${cardId} - ${name}** for your daily card quest.`,objUserData, {
            color:color,
            title:`Daily Card Quest Submitted!`,
            thumbnail:GProperties.imgMofu.ok,
            fields:[
                {
                    name:`Rewards Received:`,
                    value:stripIndents`${GProperties.color[color].icon} ${colorPointReward} ${GProperties.color[color].value} points
                    ${SPackModule[series].Properties.icon.mascot_emoji} ${seriesPointReward} ${SPackModule[series].Properties.currency.name} 
                    ${GProperties.currency.mofucoin.icon_emoji} ${mofucoinReward} ${GProperties.currency.mofucoin.name}`
                }
            ]
        })]};

    }
}

module.exports = {Properties, Card}
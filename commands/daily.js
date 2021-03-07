const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const ItemModule = require('../modules/Item');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');

module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Command to get daily color points. Can only be used every 24 hours.',
	async execute(message, args) {
		const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();
        //check for optional color if provided

        var userCardData = await CardModule.getCardUserStatusData(userId);
        var optionalColor = null;
        

        var optionalArgs = args[0];
        
        if(optionalArgs!=null){
            optionalArgs = optionalArgs.toLowerCase();
            optionalColor = optionalArgs.toLowerCase();
            
            if(optionalArgs=="quest"){
                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    description: `<@${userId}>, here are the requested cards list for today:\nYou can submit the quest with: **p!daily quest submit <card id>**`,
                    author: {
                        name: `Daily Quest`,
                        icon_url: CardModule.Properties.imgResponse.imgOk
                    }
                };

                optionalArgs = args[1];//switch into next args
                var lastDate = -1; var requestedIdCard = "";

                var requestedCards = ""; var requestedRewards = "";

                //get latest taken date & data if not null
                if(userCardData[DBM_Card_User_Data.columns.daily_quest]!=null){
                    var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
                    lastDate = jsonParsedData[CardModule.Quest.questData.last_daily_quest];
                }
                
                if(optionalArgs=="submit"){
                    //submit the daily quest
                    if(lastDate!=new Date().getDate()){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Sorry, the quest is not available anymore. Please request new daily quest with **p!daily quest**.`;
                        return message.channel.send({embed:objEmbed});
                    }

                    //p!daily quest submit <idcard>
                    //get/view the card detail
                    var cardId = args[2];
                    objEmbed = {
                        color:CardModule.Properties.embedColor
                    }
                    if(cardId==null){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Please enter the card ID.";
                        return message.channel.send({embed:objEmbed});
                    }

                    //check if card ID exists/not
                    var cardData = await CardModule.getCardData(cardId);
                    if(cardData==null){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Sorry, I can't find that card ID.";

                        return message.channel.send({embed:objEmbed});
                    }

                    //lowercase the card id
                    cardId = cardId.toLowerCase();

                    var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
                    var requestedIdCard = jsonParsedData[CardModule.Quest.questData.dataQuest];
                    
                    var idCardExists = false;

                    var itemRewardData = null;
                    for(var key in requestedIdCard){
                        var idItemReward = requestedIdCard[key];
                        if(key.toLowerCase()==cardId){
                            itemRewardData = await ItemModule.getItemData(idItemReward);
                            idCardExists = true;
                        }
                    }

                    //check for card quest id
                    if(!idCardExists){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Sorry, that card id is not on the quest list today.`;
                        return message.channel.send({embed:objEmbed});
                    }

                    //check if user have card/not
                    var userCardStock = await CardModule.getUserCardStock(userId,cardId);
                    if(userCardStock<=0){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Sorry, you need another: **${cardData[DBM_Card_Data.columns.name]}** to submit the card quest.`;
                        return message.channel.send({embed:objEmbed});
                    } else {
                        var mofucoinReward = CardModule.Quest.getQuestReward(cardData[DBM_Card_Data.columns.rarity]);
                        //update card stock
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                        SET  ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1 
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query,[userId,cardId]);

                        //update mofucoin
                        await CardModule.updateMofucoin(userId,mofucoinReward);

                        //add item reward
                        if(itemRewardData!=null){
                            await ItemModule.addNewItemInventory(userId,itemRewardData[DBM_Item_Data.columns.id]);
                        }

                        //update the quest data:
                        delete requestedIdCard[cardId];
                        
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.daily_quest,JSON.stringify(jsonParsedData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        }
                        objEmbed.title = "Daily Quest Completed!";
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        }
                        objEmbed.description = `You have submit the daily card quest: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}**.`;
                        objEmbed.fields = [
                            {
                                name:"Rewards Received:",
                                value:`>${itemRewardData[DBM_Item_Data.columns.name]} (**${itemRewardData[DBM_Item_Data.columns.id]}**)\n>${mofucoinReward} Mofucoin`
                            }
                        ];
                        return message.channel.send({embed:objEmbed});
                    }

                } else if(optionalArgs==null){

                    if(lastDate==-1||lastDate!=new Date().getDate()){
                        //check for daily quest if already requested/not
                        var objQuestData = "{";
                        requestedCards = ""; requestedRewards = "";
                        //get 3 randomized card
                        var query = `SELECT * FROM 
                        (
                            SELECT cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.name},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.rarity},idat.${DBM_Item_Data.columns.id} as id_item,idat.${DBM_Item_Data.columns.name} as item_name 
                                FROM ${DBM_Card_Data.TABLENAME} cd,${DBM_Item_Data.TABLENAME} idat 
                                WHERE cd.${DBM_Card_Data.columns.rarity}<=? AND 
                                idat.${DBM_Item_Data.columns.category}=? 
                                GROUP BY cd.${DBM_Card_Data.columns.id_card},idat.${DBM_Item_Data.columns.id} 
                                ORDER BY rand() LIMIT 3 
                        ) T1 
                        ORDER BY T1.rarity`;
                        var randomizedCardData = await DBConn.conn.promise().query(query, [5,"ingredient"]);
                        
                        randomizedCardData[0].forEach(entry => {
                            // idCard+=`${entry[DBM_Card_Data.columns.id_card]},`;
                            objQuestData+=`"${entry[DBM_Card_Data.columns.id_card]}":"${entry["id_item"]}",`;
                            //randomize the reward:
                            requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],20)}\n`;
                            requestedRewards+=`**${entry["id_item"]}**: ${entry["item_name"]} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC\n`;
                        });
    
                        objQuestData = objQuestData.replace(/,\s*$/, "");
                        objQuestData+="}";
    
                        objEmbed.fields = [
                            {
                                name:`Card Quest List:`,
                                value:requestedCards,
                                inline:true
                            },
                            {
                                name:`Item & MC Reward:`,
                                value:requestedRewards,
                                inline:true
                            }
                        ];
    
                        // idCard = idCard.replace(/,\s*$/, "");
                        await CardModule.Quest.setQuestData(userId,objQuestData);
                    } else if(lastDate==new Date().getDate()){
                        if(Object.keys(jsonParsedData[CardModule.Quest.questData.dataQuest]).length>=1){
                            var questData = jsonParsedData[CardModule.Quest.questData.dataQuest];
                            var arrItemReward = [];
    
                            Object.keys(questData).forEach(function(key){
                                requestedIdCard+=`"${key}",`;
                                arrItemReward.push(questData[key]);
                            });
                            requestedIdCard = requestedIdCard.replace(/,\s*$/, "");
    
                            var query = `SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.id_card} IN (${requestedIdCard}) 
                            ORDER BY ${DBM_Card_Data.columns.rarity}`;
    
                            var cardData = await DBConn.conn.promise().query(query);
                            var ctr = 0;//for item data
                            for(var key in cardData[0]){
                                var entry = cardData[0][key];
                                requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],20)}\n`;
    
                                //get the item reward
                                var itemData = await ItemModule.getItemData(arrItemReward[ctr]); ctr++;
                                requestedRewards+=`**${itemData[DBM_Item_Data.columns.id]}**: ${itemData[DBM_Item_Data.columns.name]} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC\n`;
                            }
    
                            objEmbed.fields = [{
                                name:`Quest List:`,
                                value:requestedCards,
                                inline:true
                            },
                            {
                                name:`Item & MC Reward:`,
                                value:requestedRewards,
                                inline:true
                            }];
                            return message.channel.send({embed:objEmbed});
                        } else {
                            objEmbed.description = "You have no more daily quest for today.";
                            return message.channel.send({embed:objEmbed});
                        }
                    }

                } else {
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : "-Use: **p!daily quest** to show the available card quest.\n-Use: **p!daily quest submit <id card>** to submit the card quest."
                    };
                    return message.channel.send({embed:objEmbed});
                }
                
                return message.channel.send({embed:objEmbed});
            } else if(!CardModule.Properties.arrColor.includes(optionalArgs)){
                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    thumbnail : {
                        url: CardModule.Properties.imgResponse.imgError
                    },
                    description : ":x: Please enter the correct daily color command with: **p!color daily** or **p!color daily <pink/purple/green/yellow/white/blue/red>**."
                };
                return message.channel.send({embed:objEmbed});
            }
        }

        //validate & check if user have do the daily today/not
        var dateToken = new Date().getDate();
        if(userCardData[DBM_Card_User_Data.columns.daily_last]==dateToken){
            var midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            var timeRemaining = ( midnight.getTime() - new Date().getTime() ) / 1000 / 60;
            var num = timeRemaining;
            var hours = (num / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            timeRemaining = rhours + " hour(s) and " + rminutes + " more minute(s)";

            var objEmbed = {
                color: CardModule.Properties.embedColor,
                thumbnail : {
                    url: CardModule.Properties.imgResponse.imgError
                },
                description : `:x: Sorry, you have already received your daily color points today. Please wait for **${timeRemaining}** until you can get more color points.`
            };

            return message.channel.send({embed:objEmbed});
        }

        var objEmbed = {
            color: CardModule.Properties.embedColor,
            thumbnail : {
                url: CardModule.Properties.imgResponse.imgOk
            },
        };

        var query = "";
        var colorPoint = GlobalFunctions.randomNumber(10,20);
        var arrParameterized = [];
        if(optionalColor!=null){
            //double the color point
            colorPoint*=2;
            query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
            SET ${DBM_Card_User_Data.columns.daily_last} = ?, color_point_${optionalColor} = color_point_${optionalColor} + ?
            WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
            arrParameterized = [dateToken,colorPoint,userId];
            objEmbed.description = `<@${userId}> has received ** ${colorPoint} ${optionalColor} color points ** from the daily command.`;
        } else {
            query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
            SET ${DBM_Card_User_Data.columns.daily_last} = ?, 
            ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${colorPoint}, 
            ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${colorPoint} 
            WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
            arrParameterized = [dateToken,userId];
            objEmbed.description = `<@${userId}> has received **${colorPoint} overall color points** from the daily command.`;
        }

        //update the token & color point data
        await DBConn.conn.promise().query(query, arrParameterized);

        return message.channel.send({embed:objEmbed});
	},
};
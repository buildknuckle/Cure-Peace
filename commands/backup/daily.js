const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const CardGuildModule = require('../../modules/CardGuild');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const ItemModule = require('../../modules/Item');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../../database/model/DBM_Card_Guild');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');

module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Card daily commands',
    options:[
        {
            name: "check-in",
            description: "Check in for daily rewards.",
            type: 2, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "color",
                    description: "Check in for series & color point rewards",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "selection",
                            description: "Select the color check-in rewards",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "overall",
                                    value: "overall"
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
                            ]
                        }
                    ]
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
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        // console.log(interaction.options._hoistedOptions[0]);

        //default embed:
        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            }
        };

        switch(command){
            //check in for daily rewards + get bonus cards for newbie:
            case "check-in":
                // var color = interaction.options._hoistedOptions[0].value;
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var optionalColor = interaction.options._hoistedOptions[0].value;
        
                var query = "";
                var basePoint = GlobalFunctions.randomNumber(60,70);
                var seriesPoint = Math.round(basePoint/2);
                var arrParameterized = [];
                var assignedSeriesCurrency = CardModule.Properties.seriesCardCore[userCardData[DBM_Card_User_Data.columns.series_set]].currency;
                var bonusReward = "";

                //validate & check if user have do the daily/not
                var dateToken = new Date().getDate();
                if(userCardData[DBM_Card_User_Data.columns.daily_last]==dateToken){
                    var midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    var timeRemaining = GlobalFunctions.getDateTimeDifference(midnight.getTime(),new Date().getTime());
                    timeRemaining = timeRemaining.hours + " hour(s) and " + timeRemaining.minutes + " more minute(s)";

                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: You already received your daily color points for today. Please wait until: **${timeRemaining}**.`
                    };

                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                objEmbed.thumbnail = {
                    url: CardModule.Properties.imgResponse.imgOk
                };

                //check for newbie claim reward
                if(!userCardData[DBM_Card_User_Data.columns.newbie_reward_claim]){
                    //check if user already own 10 cards
                    var query = `SELECT COUNT(*) as total
                    FROM ${DBM_Card_Inventory.TABLENAME} 
                    WHERE ${DBM_Card_Inventory.columns.id_user}=?`;
                    var totalCard = await DBConn.conn.promise().query(query,[userId]);
                    totalCard = totalCard[0][0]["total"];
                    if(totalCard<10){
                        var query = `(SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=6 
                            ORDER BY rand() 
                            LIMIT 1)
                            UNION ALL 
                            (SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=5 
                            ORDER BY rand() 
                            LIMIT 1)
                            UNION ALL 
                            (SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=4 
                            ORDER BY rand() 
                            LIMIT 1)
                            UNION ALL 
                            (SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=3 
                            ORDER BY rand() 
                            LIMIT 2)
                            UNION ALL 
                            (SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=2 
                            ORDER BY rand() 
                            LIMIT 2)
                            UNION ALL 
                            (SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}=1 
                            ORDER BY rand() 
                        LIMIT 3)`;
                        var cardRewardData = await DBConn.conn.promise().query(query);
                        cardRewardData = cardRewardData[0];
                        for(var i=0;i<cardRewardData.length;i++){
                            bonusReward+=`>${cardRewardData[i][DBM_Card_Data.columns.id_card]} - ${cardRewardData[i][DBM_Card_Data.columns.name]}\n`;
                            var userCardStock = await CardModule.getUserCardStock(userId,cardRewardData[i][DBM_Card_Data.columns.id_card]);
                            if(userCardStock<=-1){
                                await CardModule.addNewCardInventory(userId,cardRewardData[i][DBM_Card_Data.columns.id_card]);
                            } else {
                                await CardModule.addNewCardInventory(userId,cardRewardData[i][DBM_Card_Data.columns.id_card],true);
                            }
                        }
                    }
                    
                    //update the newbie claim reward
                    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                    SET ${DBM_Card_User_Data.columns.newbie_reward_claim}=? 
                    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                    await DBConn.conn.promise().query(query,[1,userId]);
                }

                switch(optionalColor){
                    case "overall":
                        query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.daily_last} = ?, 
                        ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${basePoint},
                        ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}+${basePoint}, 
                        ${DBM_Card_User_Data.columns.sp001} = ${DBM_Card_User_Data.columns.sp001}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp002} = ${DBM_Card_User_Data.columns.sp002}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp003} = ${DBM_Card_User_Data.columns.sp003}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp004} = ${DBM_Card_User_Data.columns.sp004}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp005} = ${DBM_Card_User_Data.columns.sp005}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp006} = ${DBM_Card_User_Data.columns.sp006}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp007} = ${DBM_Card_User_Data.columns.sp001}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp008} = ${DBM_Card_User_Data.columns.sp008}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp009} = ${DBM_Card_User_Data.columns.sp009}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp010} = ${DBM_Card_User_Data.columns.sp010}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp011} = ${DBM_Card_User_Data.columns.sp011}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp012} = ${DBM_Card_User_Data.columns.sp012}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp013} = ${DBM_Card_User_Data.columns.sp013}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp014} = ${DBM_Card_User_Data.columns.sp014}+${seriesPoint},
                        ${DBM_Card_User_Data.columns.sp015} = ${DBM_Card_User_Data.columns.sp015}+${seriesPoint} 
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        arrParameterized = [dateToken,userId];
                        objEmbed.description = `<@${userId}> has successfully checked in for the daily!`;
                        objEmbed.fields = [
                            {
                                name:"Daily Rewards:",
                                value:`>${basePoint} overall color points\n>${basePoint} mofucoin\n>${seriesPoint} overall series points.`
                            }
                        ]
                        break;
                    default:
                        //double the color point
                        basePoint*=2;
                        seriesPoint = Math.round(basePoint/2);
                        query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.daily_last} = ?, color_point_${optionalColor} = color_point_${optionalColor} + ?,
                        ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}+?, 
                        ${userCardData[DBM_Card_User_Data.columns.series_set]} = ${userCardData[DBM_Card_User_Data.columns.series_set]} + ?
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        arrParameterized = [dateToken,basePoint,basePoint,seriesPoint,userId];
                        objEmbed.description = `<@${userId}> has successfully checked in for the daily!`;
                        objEmbed.fields = [
                            {
                                name:"Daily Rewards:",
                                value:`>${basePoint} ${optionalColor} color points (Double points!)\n>${basePoint} mofucoin\n>${seriesPoint} ${assignedSeriesCurrency}`
                            }
                        ]
                        break;
                }

                if(bonusReward!=""){
                    objEmbed.fields[1] = {
                        name:"Received 10 Bonus Newbie Card!",
                        value:bonusReward
                    }
                }
        
                //update the token & color point data
                await DBConn.conn.promise().query(query, arrParameterized);
                //limit all points
                await CardModule.limitizeUserPoints();
                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});

                break;
            case "quest":

            var userCardData = await CardModule.getCardUserStatusData(userId);
            var lastDate = -1; var requestedIdCard = "";
            var requestedCards = ""; var requestedRewards = "";

            //get latest taken date & data if not null
            if(userCardData[DBM_Card_User_Data.columns.daily_quest]!=null){
                var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
                lastDate = jsonParsedData[CardModule.Quest.questData.last_daily_quest];
            }

            switch(commandSubcommand){
                case "list":
                    objEmbed.description = `<@${userId}>, here are the requested cards list for today:\nYou can submit the quest with: **p!daily quest submit <card id>**`;
                    objEmbed.author = {
                        name: `Daily Quest`,
                        icon_url: CardModule.Properties.imgResponse.imgOk
                    }
    
                    var lastDate = -1; var requestedIdCard = "";
    
                    var requestedCards = ""; var requestedRewards = "";
    
                    //get latest taken date & data if not null
                    if(userCardData[DBM_Card_User_Data.columns.daily_quest]!=null){
                        var jsonParsedData = JSON.parse(userCardData[DBM_Card_User_Data.columns.daily_quest]);
                        lastDate = jsonParsedData[CardModule.Quest.questData.last_daily_quest];
                    }

                    if(lastDate==-1||lastDate!=new Date().getDate()){
                        //check for daily quest if already requested/not
                        var objQuestData = "{";
                        requestedCards = ""; requestedRewards = "";
                        //get 4 randomized card
                        var query = `SELECT * FROM 
                        (
                            SELECT cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.name},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.rarity},idat.${DBM_Item_Data.columns.id} as id_item,idat.${DBM_Item_Data.columns.name} as item_name 
                                FROM ${DBM_Card_Data.TABLENAME} cd,${DBM_Item_Data.TABLENAME} idat 
                                WHERE cd.${DBM_Card_Data.columns.rarity}<=? AND 
                                idat.${DBM_Item_Data.columns.category} in ('card','ingredient','ingredient_rare') 
                                GROUP BY cd.${DBM_Card_Data.columns.id_card},idat.${DBM_Item_Data.columns.id} 
                                ORDER BY rand() LIMIT 4 
                        ) T1 
                        ORDER BY T1.rarity`;
                        var randomizedCardData = await DBConn.conn.promise().query(query, [3]);
                        
                        randomizedCardData[0].forEach(entry => {
                            // idCard+=`${entry[DBM_Card_Data.columns.id_card]},`;
                            objQuestData+=`"${entry[DBM_Card_Data.columns.id_card]}":"${entry["id_item"]}",`;
                            //randomize the reward:
                            requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],12)}\n`;
                            requestedRewards+=`**${entry["id_item"]}**: ${GlobalFunctions.cutText(entry["item_name"],12)} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC&SP\n`;
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
                                requestedCards+=`-**[${entry[DBM_Card_Data.columns.pack]}] ${entry[DBM_Card_Data.columns.id_card]}** - ${GlobalFunctions.cutText(entry[DBM_Card_Data.columns.name],17)}\n`;
    
                                //get the item reward
                                var itemData = await ItemModule.getItemData(arrItemReward[ctr]); ctr++;
                                requestedRewards+=`**${itemData[DBM_Item_Data.columns.id]}**: ${GlobalFunctions.cutText(itemData[DBM_Item_Data.columns.name],12)} & ${CardModule.Quest.getQuestReward(entry[DBM_Card_Data.columns.rarity])} MC&SP\n`;
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
                        } else {
                            objEmbed.description = "You have no more daily quest for today.";
                        }
                        
                    }
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    break;
                case "submit":

                    //submit the daily quest
                    if(lastDate!=new Date().getDate()){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Sorry, you cannot submit this quests anymore. Please request new daily quest with **daily quest  list** command.`;
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    }

                    var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();

                    //check if card ID exists/not
                    var cardData = await CardModule.getCardData(cardId);
                    if(cardData==null){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: I can't find that card ID.";

                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                        objEmbed.description = `:x: That card id is not on the quest list today.`;
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    }

                    //check if user have card/not
                    var userCardStock = await CardModule.getUserCardStock(userId,cardId);
                    if(userCardStock<=0){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: You need another: **${cardData[DBM_Card_Data.columns.name]}** to submit the card quest.`;
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                        //update series point
                        var seriesId = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;
                        var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;
                        
                        var objSeries = new Map();
                        objSeries.set(seriesId,mofucoinReward);
                        await CardModule.updateSeriesPoint(userId,objSeries);

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
                                value:`>**Item:** ${itemRewardData[DBM_Item_Data.columns.name]} (**${itemRewardData[DBM_Item_Data.columns.id]}**)\n>${mofucoinReward} Mofucoin\n>${mofucoinReward} ${seriesCurrency}`
                            }
                        ];
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    }

                    break;
            }
                break;
        }

    }
};
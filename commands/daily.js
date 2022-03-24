const {MessageActionRow, MessageButton, MessageEmbed, Discord, Emoji} = require('discord.js');
const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
// const CardModule = require('../modules/Card');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const {UserQuest, DailyCardQuest} = require("../modules/puzzlun/data/Quest");
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Embed = require('../modules/puzzlun/Embed');

const Validation = require('../modules/puzzlun/Validation');

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
                    description: "Open the daily quests list",
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
                        //validation if user has logged in
                        if(user.hasLogin()==false){
                            return interaction.reply(
                                Embed.errorMini(`:x: Your current card quest are no longer available. Receive new card quest with: **/daily check-in**`, discordUser, true)
                            );
                        }
                        
                        //validation if user have quest/not
                        var userQuest = new UserQuest(await UserQuest.getData(userId));
                        var dailyCardQuest = userQuest.DailyCardQuest;
                        if(!dailyCardQuest.isAvailable()){
                            return interaction.reply({embeds:[
                                Embed.builder(`You have completed all daily card quest for today.`,discordUser, {
                                    color:Embed.color.success,
                                    thumbnail:Properties.imgSet.mofu.thumbsup,
                                    title:`✅ Daily card quest completed!`
                                })
                            ]});
                        }

                        await dailyCardQuest.initCardData();

                        var txtCardQuest = ``;
                        for(var key in dailyCardQuest.arrCardData){
                            var card = new Card(dailyCardQuest.arrCardData[key]);
                            var rarity = card.rarity;
                            var rewards = DailyCardQuest.reward[rarity];

                            var txtReward = `${Properties.currency.mofucoin.emoji} ${rewards.mofucoin}, `;//mofucoin
                            txtReward += `${card.getColorEmoji()} ${rewards.color}, `;//color point
                            txtReward += `${card.Series.emoji.mascot} ${rewards.series}, `;//series point
                            if("jewel" in rewards) txtReward += `${Properties.currency.jewel.emoji} ${rewards.jewel}`;//jewel
                            txtReward = txtReward.replace(/,\s*$/, "");

                            txtCardQuest+=dedent(`${card.getRarityEmoji()}${card.rarity}: ${card.id_card} - ${card.getName(18)}`);
                            
                            var cardInventoryData = await CardInventory.getDataByIdUser(userId, card.id_card);
                            if(cardInventoryData!=null){
                                var cardInventory = new CardInventory(cardInventoryData, dailyCardQuest.arrCardData[key]);
                                if(cardInventory.stock>=1) txtCardQuest+=` ❗`
                            }
                            txtCardQuest+=`\n**Reward:**  ${txtReward}\n\n`;
                        }
                        txtCardQuest+=dedent(`**Completion Bonus:** ${Properties.currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel}
                        (Received upon completing all card quest)`);

                        return interaction.reply({
                            embeds:[Embed.builder(dedent(`Submit any of these card to receive various rewards: 

                            ${txtCardQuest}`), discordUser, {
                                title:`Daily card quest (${dailyCardQuest.getTotal()}/${DailyCardQuest.max})`,
                                thumbnail:Properties.imgSet.mofu.ok,
                                footer:Embed.builderUser.footer(`Submit the card quest with: /daily quest submit`)
                            })]
                        });
                        break;
                    case "submit":
                        var user = new User(await User.getData(userId));
                        //check in validation
                        if(user.hasLogin()==false){
                            return interaction.reply(
                                Embed.errorMini(`:x: Your card quest has expired. Please receive new card quest with: **/daily check-in**`, discordUser, true)
                            );
                        }

                        var selectedCardId = interaction.options._hoistedOptions[0].value.toLowerCase();
                        var userQuest = new UserQuest(await UserQuest.getData(userId));
                        var dailyCardQuest = userQuest.DailyCardQuest;
                        await dailyCardQuest.initCardData();
                        //card validation
                        if(dailyCardQuest.checkCardAvailable(selectedCardId)==false){
                            return interaction.reply(
                                Embed.errorMini(`:x: This card is not available on daily card quest for today.`, discordUser, true)
                            );
                        }

                        //validation: check if user have card/not
                        var cardInventoryData = await CardInventory.getDataByIdUser(userId, selectedCardId);
                        if(cardInventoryData==null){
                            return interaction.reply(Validation.Card.embedNotHave(discordUser));
                        }

                        //validation: check card stock
                        var cardInventory = new CardInventory(cardInventoryData, dailyCardQuest.arrCardData[selectedCardId]);
                        if(cardInventory.stock<=0){
                            return interaction.reply(Embed.errorMini(`You need 1x **${cardInventory.id_card} - ${cardInventory.name}** to submit this card quest.`,discordUser, true, {
                                title:`Not Enough Card`
                            }));
                        }

                        cardInventory.stock-=1;//remove card stock by 1
                        await cardInventory.update();//update user card inventory data

                        dailyCardQuest.remove(selectedCardId);//remove selected card quest
                        await userQuest.update();//update quest data
                        
                        var rarity = cardInventory.rarity;
                        var series = cardInventory.Series;
                        
                        //distribute rewards
                        var reward = DailyCardQuest.reward[rarity];
                        user.Currency.mofucoin+=reward.mofucoin;//mofucoin
                        user.Color[cardInventory.color].point+=reward.color;//color points
                        user.Series[series.value]+=reward.series;//series points
                        if("jewel" in reward) user.Currency.jewel+=reward.jewel;//jewel
                        if(dailyCardQuest.getTotal()<=0){//bonus completion rewards
                            user.Currency.jewel+=DailyCardQuest.rewardCompletion.jewel;
                        }
                        await user.update();//validate & update user data

                        
                        var txtReward = `${Properties.currency.mofucoin.emoji} ${reward.mofucoin} mofucoin (${user.Currency.mofucoin}/${User.Currency.limit.mofucoin})\n`;//mofucoin

                        txtReward += `${cardInventory.getColorEmoji()} ${reward.color} ${cardInventory.color} points (${user.Color[cardInventory.color].point}/${User.Color.limit.point})\n`;//color points

                        txtReward += `${series.emoji.mascot} ${reward.series} ${series.currency.name.toLowerCase()} (${user.Series[series.value]}/${User.Series.limit.point})\n`;//series points
                        
                        if("jewel" in reward){
                            txtReward += `${Properties.currency.jewel.emoji} ${reward.jewel} ${Properties.currency.jewel.name.toLowerCase()} (${user.Currency.jewel}/${User.Currency.limit.jewel})`;
                        }
                        txtReward = txtReward.replace(/,\s*$/, "");

                        //print embed
                        var txtCardQuest = `You have submitted: ${cardInventory.id_card} - ${GlobalFunctions.cutText(cardInventory.name,15)}.`;
                        var txtTitle = `✅ Daily card quest submitted!`;
                        var imgThumbnail = Properties.imgSet.mofu.ok;
                        var txtFooter = `Remaining card quest: ${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}`;

                        if(dailyCardQuest.getTotal()<=0){
                            txtCardQuest+=`\nYou have completed all card quest for today!`;
                            txtReward+=`\n**Completion Bonus:** ${Properties.currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel} ${Properties.currency.jewel.name.toLowerCase()}`;
                            txtTitle = `✅ Daily card quest completed!`;
                            imgThumbnail = Properties.imgSet.mofu.thumbsup;
                            txtFooter = "";
                        }

                        return interaction.reply({
                            embeds:[Embed.builder(dedent(txtCardQuest), discordUser, {
                                color: cardInventory.color,
                                title: txtTitle,
                                thumbnail: imgThumbnail,
                                fields:[
                                    {
                                        name:`${cardInventory.getRarityEmoji(true)}${rarity} Rewards received:`,
                                        value:txtReward
                                    }
                                ],
                                footer:Embed.builderUser.footer(txtFooter)
                            })]
                        });
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
                timeRemaining = timeRemaining.hours + " Hours " + timeRemaining.minutes + " Mins";
                var arrPages = [];

                if(user.hasLogin()){
                    return interaction.reply(
                        Embed.errorMini(`:x: You have already received your daily rewards for today.\nNext daily available in: **${timeRemaining}**`, discordUser, true)
                    );
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
                    dailyRewards.txtColor=`${Color[selectedColor].emoji} ${dailyRewards.color} ${selectedColor} points (${user.Color[user.set_color].point}/${User.Color.limit.point})`;

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
                var isNewcomer = User.isNewcomer(await CardInventory.getTotalAll(userId));
                if(isNewcomer){
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

                //update daily token
                user.last_checkIn_date = GlobalFunctions.getCurrentDate();
                await user.update();

                arrPages.push(
                    Embed.builder(dedent(`✅ <@${userId}> has successfully logged in for the daily!

                    **Rewards received:** ${dailyRewards.iconBoost}
                    ${dailyRewards.txtColor}
                    ${Properties.currency.mofucoin.emoji} ${dailyRewards.mofucoin} mofucoin (${user.Currency.mofucoin}/${User.Currency.limit.mofucoin})
                    ${series.emoji.mascot} ${dailyRewards.series} ${series.currency.name.toLowerCase()} (${user.Series[user.set_series]}/${User.Series.limit.point})
                    ${Properties.currency.jewel.emoji} ${dailyRewards.jewel} jewel (${user.Currency.jewel}/${User.Currency.limit.jewel})${txtNewbieBonus}`),
                    discordUser,{
                        color:dailyRewards.embedColor,
                        title:isNewcomer ? `Welcome to Puzzlun Peacecure!`: `Welcome back!`,
                        thumbnail:Properties.imgSet.mofu.wave,
                        footer:Embed.builderUser.footer(`Next daily reset available in: ${timeRemaining}`)
                    })
                );

                //generate 3 card quest
                var userQuest = new UserQuest(await UserQuest.getData(userId));
                var dailyCardQuest = userQuest.DailyCardQuest;
                await dailyCardQuest.randomizeCardData();
                await userQuest.update();

                var txtCardQuest = ``;
                for(var key in dailyCardQuest.arrCardData){
                    var card = new Card(dailyCardQuest.arrCardData[key]);
                    var rarity = card.rarity;
                    var rewards = DailyCardQuest.reward[rarity];

                    var txtReward = `${Properties.currency.mofucoin.emoji} ${rewards.mofucoin}, `;
                    txtReward += `${card.getColorEmoji()} ${rewards.color}, `;
                    txtReward += `${new Series(card.series).emoji.mascot} ${rewards.series}, `;
                    if("jewel" in rewards){
                        txtReward += `${Properties.currency.jewel.emoji} ${rewards.jewel}`;
                    }
                    txtReward = txtReward.replace(/,\s*$/, "");

                    txtCardQuest+=dedent(`${CardInventory.emoji.rarity(false, card.rarity)}${card.rarity}: ${card.id_card} - ${GlobalFunctions.cutText(card.name,18)}
                    **Reward:**  ${txtReward}`);
                    txtCardQuest+=`\n\n`;
                }

                txtCardQuest+=dedent(`**Completion Bonus:** ${Properties.currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel}
                (Received upon completing all card quest)`);

                arrPages.push(
                    Embed.builder(dedent(`Here are the requested cards for today:

                    ${txtCardQuest}`), discordUser, {
                        title:`New card quest received! (${dailyCardQuest.getTotal()}/${DailyCardQuest.max})`,
                        thumbnail:Properties.imgSet.mofu.ok,
                        footer:Embed.builderUser.footer(`Access the card quest anytime with: /daily quest list`)
                    })
                );
                

                // await interaction.reply({embeds:[objEmbed]});
                return await paginationEmbed(interaction, arrPages, DiscordStyles.Button.pagingButtonList);
                break;
        }
    }
};
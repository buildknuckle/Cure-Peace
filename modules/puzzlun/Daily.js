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
const Embed = require("./Embed");

const User = require("../../modules/puzzlun/data/User");
const {UserQuest, DailyCardQuest} = require("../../modules/puzzlun/data/Quest");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {Item, ItemInventory} = require("./data/Item");

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");

class Validation extends require("./Validation") {
    static notifCardQuestCompleted(discordUser){
        return {
            embeds:[Embed.builder(`You have completed all daily card quest for today.`,discordUser, {
                color:Embed.color.success,
                thumbnail:Properties.imgSet.mofu.thumbsup,
                title:`✅ Daily card quest completed!`
            })],
            ephemeral:true
        }
        
    }
}

class Quest extends require("./data/Listener") {

    async questList(){
        var user = new User(await User.getData(this.userId));
        //validation if user has logged in
        if(user.hasLogin()==false){
            return this.interaction.reply(
                Embed.errorMini(`:x: Your current card quest are no longer available. Receive new card quest with: **/daily check-in**`, this.discordUser, true)
            );
        }
        
        //validation if user have quest/not
        var userQuest = new UserQuest(await UserQuest.getData(this.userId));
        var dailyCardQuest = userQuest.DailyCardQuest;
        if(!dailyCardQuest.isAvailable()){
            return this.interaction.reply(Validation.notifCardQuestCompleted(this.discordUser));
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

            txtCardQuest+=dedent(`${card.getRarity()} ${card.getIdCard(true)}: ${card.getName(30)}`);
            
            var cardInventoryData = await CardInventory.getDataByIdUser(this.userId, card.id_card);
            if(cardInventoryData!=null){
                var cardInventory = new CardInventory(cardInventoryData, dailyCardQuest.arrCardData[key]);
                if(cardInventory.stock>=1) txtCardQuest+=` ❗`
            }
            txtCardQuest+=`\n**Reward:**  ${txtReward}\n\n`;
        }

        var rewardTicket = new Item(DailyCardQuest.rewardCompletion.ticket);

        txtCardQuest+=dedent(`**Quest Completion Bonus:**
        (Received upon completing all card quest)
        • ${Currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel} ${Currency.jewel.name}
        • 1x ${rewardTicket.getCategoryEmoji()} ${rewardTicket.getIdItem()} ${rewardTicket.name}
        • 1x ${Item.category.ingredient_food.emoji} random ${Item.category.ingredient_food.name}`);

        return this.interaction.reply({
            embeds:[Embed.builder(dedent(`Submit any of these card to receive various rewards: 

            ${txtCardQuest}`), this.discordUser, {
                title:`Daily card quest (${dailyCardQuest.getTotal()}/${DailyCardQuest.max})`,
                thumbnail:Properties.imgSet.mofu.ok,
                footer:Embed.builderUser.footer(`Submit the card quest with: /daily quest submit`)
            })]
        });
    }

    async submitCardQuest(){
        var user = new User(await User.getData(this.userId));
        if(user.hasLogin()==false){//validation: check if already logged in/not
            return this.interaction.reply(
                Embed.errorMini(`:x: Your card quest has expired. Please receive new card quest with: **/daily check-in**`, this.discordUser, true)
            );
        }

        var selectedCardId = this.interaction.options.getString("card-id");
        var userQuest = new UserQuest(await UserQuest.getData(this.userId));
        var dailyCardQuest = userQuest.DailyCardQuest;
        if(!dailyCardQuest.isAvailable()){
            return this.interaction.reply(Validation.notifCardQuestCompleted(this.discordUser));
        }
        
        var dailyCardQuest = userQuest.DailyCardQuest;
        await dailyCardQuest.initCardData();
        //card validation
        if(dailyCardQuest.checkCardAvailable(selectedCardId)==false){
            return this.interaction.reply(
                Embed.errorMini(`:x: This card is not available on today's daily card quest.`, this.discordUser, true)
            );
        }

        //validation: check if user have card/not
        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, selectedCardId);
        if(cardInventoryData.cardInventoryData==null){
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        //validation: check card stock
        var cardInventory = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        if(cardInventory.stock<=0){
            return this.interaction.reply(Embed.errorMini(`You need: 1x ${cardInventory.getCardEmoji()}${cardInventory.getIdCard()} **${cardInventory.name}** to submit this card quest.`,this.discordUser, true, {
                title:`❌ Not enough card`
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

            var ticketReward = new Item(DailyCardQuest.rewardCompletion.ticket);//ticket
            var itemReward = new Item(GlobalFunctions.randomProperty(DailyCardQuest.rewardCompletion.item));//food ingredient
            await ItemInventory.updateStock(this.userId, ticketReward.id_item);//update user ticket reward
            await ItemInventory.updateStock(this.userId, itemReward.id_item);//update user item reward
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
        var txtCardQuest = dedent(`You have submitted: 
        ${cardInventory.getRarity(true, true)} ${cardInventory.getIdCard()} ${cardInventory.getName(18,true)}`);
        var txtTitle = `✅ Daily card quest submitted!`;
        var imgThumbnail = Properties.imgSet.mofu.ok;
        var txtFooter = `Remaining card quest: ${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}`;

        if(dailyCardQuest.getTotal()<=0){
            txtReward+=`\n`;
            txtReward+=dedent(`**Completion Bonus:** 
            ${Currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel} ${Currency.jewel.name}
            1x ${ticketReward.getCategoryEmoji()} ${ticketReward.getIdItem()} ${ticketReward.getName()}
            1x ${itemReward.getCategoryEmoji()} ${itemReward.getIdItem()} ${itemReward.getName()}`);
            txtTitle = `✅ Daily card quest completed!`;
            imgThumbnail = Properties.imgSet.mofu.thumbsup;
            txtFooter = "";
        }

        return this.interaction.reply({
            embeds:[Embed.builder(dedent(txtCardQuest), this.discordUser, {
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
    }
}

class Daily extends require("./data/Listener") {
    static Quest = Quest;
    static newcomerTicketData = {
        standard:"gt004",
        premium:"gt005"
    };

    async checkIn(){
        //check in date validation
        var user = new User(await User.getData(this.userId));
        var resetTime = new Date();
        resetTime.setHours(24, 0, 0, 0);
        var timeRemaining = GlobalFunctions.getDateTimeDifference(resetTime.getTime(),new Date().getTime());
        timeRemaining = timeRemaining.hours + " Hours " + timeRemaining.minutes + " Mins";
        var arrPages = [];

        if(user.hasLogin()){
            return this.interaction.reply(
                Embed.errorMini(`:x: You already received your daily rewards for today.\nNext daily available in: **${timeRemaining}**`, this.discordUser, true)
            );
        }

        var selectedColor = this.interaction.options._hoistedOptions[0].value;
        var series = new Series(user.set_series);

        var dailyRewards = {
            jewel: 10,
            color: 70,
            txtColor:"",
            mofucoin: 100,
            series: 50,
            iconBoost: "",
            embedColor:Embed.color.yellow
        }

        //process rewards to user
        user.Currency.jewel+=dailyRewards.jewel;

        if(selectedColor!="all"){//all color
            dailyRewards.color*=2;
            dailyRewards.mofucoin*=2;
            dailyRewards.series*=2;
            dailyRewards.iconBoost="⏫";
            dailyRewards.embedColor = Embed.color[selectedColor];
            dailyRewards.txtColor=`${User.Color.getEmoji(selectedColor)} ${dailyRewards.color} ${selectedColor} points (${user.Color[selectedColor].point}/${User.Color.limit.point})`;

            
            user.Currency.jewel+=dailyRewards.jewel;
            user.Currency.mofucoin+=dailyRewards.mofucoin;
            user.Color[selectedColor].point+=dailyRewards.color;
            user.Series[user.set_series]+=dailyRewards.series;
        } else {
            //specific color;
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
        var isNewcomer = user.isNewcomer();
        if(isNewcomer){
            let standardTicket = new Item(Daily.newcomerTicketData.standard);
            let premiumTicket = new Item(Daily.newcomerTicketData.premium);
            txtNewbieBonus+=`\n\n`;
            txtNewbieBonus+=dedent(`**You have received starter gachapon ticket:**
            8x ${standardTicket.getCategoryEmoji()} ${standardTicket.getIdItem()} ${standardTicket.name}
            2x ${premiumTicket.getCategoryEmoji()} ${premiumTicket.getIdItem()} ${premiumTicket.name}`);
            //distribute item
            await ItemInventory.updateStock(this.userId, standardTicket.id_item, 8);
            await ItemInventory.updateStock(this.userId, premiumTicket.id_item, 2);
        }

        //update daily token
        user.last_checkIn_date = GlobalFunctions.getCurrentDate();
        await user.update();

        arrPages.push(
            Embed.builder(dedent(`✅ <@${this.userId}> has successfully checked in for the daily!

            **Rewards received:** ${dailyRewards.iconBoost}
            ${dailyRewards.txtColor}
            ${Properties.currency.mofucoin.emoji} ${dailyRewards.mofucoin} mofucoin (${user.Currency.mofucoin}/${User.Currency.limit.mofucoin})
            ${series.emoji.mascot} ${dailyRewards.series} ${series.currency.name.toLowerCase()} (${user.Series[user.set_series]}/${User.Series.limit.point})
            ${Properties.currency.jewel.emoji} ${dailyRewards.jewel} jewel (${user.Currency.jewel}/${User.Currency.limit.jewel})${txtNewbieBonus}`),
            this.discordUser,{
                color:dailyRewards.embedColor,
                title:isNewcomer ? `Welcome to Puzzlun Peacecure!`: `Welcome back!`,
                thumbnail:Properties.imgSet.mofu.wave,
                footer:Embed.builderUser.footer(`Next daily reset available in: ${timeRemaining}`)
            })
        );

        //generate 3 card quest
        var userQuest = new UserQuest(await UserQuest.getData(this.userId));
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

            txtCardQuest+=dedent(`${card.getRarity()} ${card.getIdCard()}: ${GlobalFunctions.cutText(card.name,18)}
            **Reward:**  ${txtReward}`);
            txtCardQuest+=`\n\n`;
        }

        var rewardTicket = new Item(DailyCardQuest.rewardCompletion.ticket);

        txtCardQuest+=dedent(`**Quest Completion Bonus:**
        (Received upon completing all card quest)
        • ${Currency.jewel.emoji} ${DailyCardQuest.rewardCompletion.jewel} ${Currency.jewel.name}
        • 1x ${rewardTicket.getCategoryEmoji()} ${rewardTicket.getIdItem()} ${rewardTicket.name}
        • 1x ${Item.category.ingredient_food.emoji} random ${Item.category.ingredient_food.name}`);

        arrPages.push(
            Embed.builder(dedent(`Here are the requested cards for today:

            ${txtCardQuest}`), this.discordUser, {
                title:`New card quest received! (${dailyCardQuest.getTotal()}/${DailyCardQuest.max})`,
                thumbnail:Properties.imgSet.mofu.ok,
                footer:Embed.builderUser.footer(`Access the card quest anytime with: /daily quest list`)
            })
        );
        

        // await this.interaction.reply({embeds:[objEmbed]});
        return await paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList);
    }

    static async init(){
        //init card quest:
        //init ticket data
        DailyCardQuest.rewardCompletion.ticket = await Item.getItemData(
            DailyCardQuest.rewardCompletion.ticket
        );

        //init item data:
        var paramWhere = DailyCardQuest.rewardCompletion.item;
        for(var key in paramWhere){
            var mapWhere = new Map();
            paramWhere[key] = mapWhere.set(Item.columns.id_item, paramWhere[key]); 
        }

        var arrIngredientData = [];
        var ingredientData = await DB.selectOr(Item.tablename, paramWhere);
        for(var i=0; i<ingredientData.length; i++){
            arrIngredientData.push(ingredientData[i]);
        }
        DailyCardQuest.rewardCompletion.item = arrIngredientData;

        //init newcomerTicketData
        Daily.newcomerTicketData.standard = await Item.getItemData(Daily.newcomerTicketData.standard);
        Daily.newcomerTicketData.premium = await Item.getItemData(Daily.newcomerTicketData.premium);
    }
}

module.exports = Daily;
const dedent = require("dedent-js");
const paginationEmbed = require('../../../modules/DiscordPagination');
const GlobalFunctions = require('../../GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require("../../DiscordStyles");
const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');
const DataGuild = require('./Guild');
const DataCard = require('./Card');
const DataCardInventory = require('./CardInventory');
const DataUser = require('./User');
const {Series, SPack} = require('./Series');
const {Character, CPack} = require('./Character');
const Properties = require("../Properties");
const Color = Properties.color;
const Emoji = Properties.emoji;

class Embed extends require("../Embed") {
    static notifNotEnoughBoostPoint(boostCost, objUserData){
        return GEmbed.failMini(`:x: you need **${boostCost} peace point** to use the boost capture.`, objUserData)
    }

    static notifNewCard(discordUser, cardData, baseRewards={qty:1, color:0,series:0}, updatedTotalPack, 
        options = {notifFront:"",notifBack:"",rewards:""}){
        var arrPages = [];

        //user data:
        var userId = discordUser.id;
        var username = discordUser.username;
        var userAvatar = this.builderUser.getAvatarUrl(discordUser);

        //card data
        var card = new DataCard(cardData);
        var id = card.id_card; var rarity = card.rarity;
        var character = new Character(card.pack); var name = card.name.toString();
        var img = card.img_url; var color = card.color;
        var series = new Series(card.series);

        var colorPoint = baseRewards.color;
        var seriesPoint = baseRewards.series;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifCard = `${Color[color].emoji_card} ${baseRewards.qty}x new card: ${id} ${baseRewards.qty>1?" ⏫":""}`;
        var notifColorPoints = `${Color[color].emoji} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}`;
        var notifSeriesPoints = `${series.emoji.mascot} ${seriesPoint} ${series.currency.name} ${seriesPoint>rarity?" ⏫":""}`;
        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;
        var optRewards = `${"rewards" in options ? options.rewards:""}`;

        var author = this.builderUser.author(discordUser, `New ${capitalize(card.pack)} Pack!`, character.icon);

        arrPages[0] = this.builder(dedent(`${notifFront}${Properties.emoji.mofuheart} <@${userId}> has received new ${rarity}${DataCard.emoji.rarity(rarity)} ${capitalize(card.pack)} card!\n
        **Rewards:**
        ${notifCard}
        ${notifColorPoints}
        ${notifSeriesPoints}${optRewards}${notifBack}`), author, {
        color: color,
        title: name,
        fields:[{
            name:`ID:`,
            value:`${id.toString()}`,
            inline:true
        },{
            name:`Series:`,
            value:`${GlobalFunctions.capitalize(series.name)}`,
            inline:true
        }],
        image: img,
        footer: this.builderUser.footer(`Captured by: ${username} (${updatedTotalPack}/${card.packTotal})`, userAvatar)
        });

        //base stats:
        arrPages[1] = this.builder(dedent(`${notifFront}
        **Base Stats:**
        ${DataCard.emoji.hp} **HP:** ${card.hp_base}
        ${DataCard.emoji.sp} **Max SP:** ${card.maxSp}
        ${DataCard.emoji.atk} **Atk:** ${card.atk_base}`), 
        author, {
        color: this.color[color],
        title: name,
        thumbnail: character.icon, 
        fields:[{
            name:`ID:`,
            value:`${id.toString()}`,
            inline:true
        },{
            name:`Series:`,
            value:`${capitalize(series.name)}`,
            inline:true
        }],
        image: img,
        footer: this.builderUser.footer(`Captured by: ${username} (${updatedTotalPack}/${card.packTotal})`, userAvatar)
        });

        return arrPages;
    }

    static notifDuplicateCard(discordUser, cardData, baseRewards={qty:1, color:0,series:0}, updatedStock, 
        options = {notifFront:"",notifBack:"",rewards:""}){
        //user data:
        var userId = discordUser.id;

        //card data
        var card = new DataCard(cardData);
        var id = card.id_card; var rarity = card.rarity;
        var character = new Character(card.pack); var series = new Series(card.series); 
        var name = card.name; var img = card.img_url; 
        var color = card.color;

        var colorPoint = baseRewards.color;
        var seriesPoint = baseRewards.series;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifCard = `${Color[color].emoji_card} ${baseRewards.qty}x dup card: ${id} ${baseRewards.qty>1?" ⏫":""}`;
        var notifColorPoints = `${Color[color].emoji} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}`;
        var notifSeriesPoints = `${series.emoji.mascot} ${seriesPoint} ${series.currency.name} ${seriesPoint>rarity?" ⏫":""}`;
        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;
        var optRewards = `${"rewards" in options ? options.rewards:""}`;

        return this.builder(`${notifFront}${Emoji.mofuheart}<@${userId}> has received another ${character.name} card: **${id}**.${notifBack}`, discordUser, {
            color: color,
            title: name,
            thumbnail:img,
            fields:[
            {
                name:`Rewards Received:`,
                value:dedent(`${notifCard}
                ${notifColorPoints}
                ${notifSeriesPoints}${optRewards}`),
                inline:false
            }],
            footer: {
                text: `Stock: ${updatedStock}/${card.packTotal}`
        }});
    }

    static notifFailCatch(discordUser, cardData, baseRewards={color:0,series:0}, options = {notifFront:"",notifBack:"",rewards:""}){
        //user data:
        var userId = discordUser.id;

        //card data
        var card = new DataCard(cardData);
        var rarity = card.rarity; var pack = card.pack; 
        var color = card.color; var series = new Series(card.series);

        var colorPoint = baseRewards.color;
        var seriesPoint = baseRewards.series;

        var notifFront = options.notifFront;
        var notifColorPoints = `${Color[color].emoji} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}`;
        var notifSeriesPoints = `${series.emoji.mascot} ${seriesPoint} ${series.currency.name} ${seriesPoint>rarity?" ⏫":""}`;
        var notifBack = options.notifBack;

        var builder = this.failMini(`${notifFront}:x: <@${userId}> has failed to catch the card this time.${notifBack}`, 
        discordUser, false, {
            fields:[{
                name:`Received:`,
                value:dedent(`${notifColorPoints}
                ${notifSeriesPoints}`),
                inline:true
            }],
            footer:this.builderUser.footer(`❣️ Tips: Level up your color level of ${color} to increase the capture chance.`)
        });
        
        return builder;
    }
}

// normal:{
//     value:"normal",
//     name:"normal",
//     dataKey:{
//         spawnId: "spawnId",
//         type: "type",
//         spawnSubId: "spawnSubId"//for special spawn such as pinky
//     }
// },
// act:{
//     value:"act",
//     name:"act",
//     dataKey:{
//         spawnId : "spawnId",
//         type: "type",
//         value:"value",
//         typeVal: {
//             jankenpon:"jankenpon",
//             mini_tsunagarus:"mini_tsunagarus",
//             suite_notes_count:"suite_notes_count",
//             star_twinkle_constellation:"star_twinkle_constellation",
//             star_twinkle_counting:"star_twinkle_counting"
//         },  
//     }
// },//act (activities)
// quiz:{
//     value:"quiz",
//     name:"quiz",
//     dataKey:{
//         spawnId : "spawnId",
//         value:"value"
//     }
// },
// number:{
//     value:"number",
//     name:"number",
//     dataKey:{
//         spawnId:"spawnId",
//         number:"number"
//     }
// },
// color:{
//     value:"color",
//     name:"color",
//     dataKey:{
//         rarity:"rarity",
//         bonus_color:"bonus_color"
//     }
// },
// series:{
//     value:"series",
//     name:"series",
//     dataKey:{
//         rarity:"rarity",
//         bonus_series:"bonus_series"
//     }
// },
// cure:{
//     value:"cure",
//     name:"cure",
//     dataKey:{
//         rarity:"rarity",
//         bonus_color:"bonus_color",
//         bonus_series:"bonus_series",
//     }
// }

// const boosterCost = Object.freeze({
//     normal:{
//         1:1,
//         2:2,
//     },
//     number:{
//         3:3,
//         4:4
//     },
//     color:{
//         4:4,
//         5:5,
//     },
//     series:{
//         4:4,
//         5:5,
//     },
//     grand:{
//         4:5,
//         5:5,
//     }
// });

class Timer {
    //convert mins to seconds
    static minToSec(min){
        // return (min*60)*1000;
        return min*1000;//for testing only
    }
}

class Spawner {
    static type = {
        cardNormal:"cardNormal",
        act:"act",
    };

    token = null;//contains spawn token
    interval = null;//in minutes
    timer = null;
    type = null;
    spawnData = null;//to be saved for db
    data = null;//contains class of the spawned
    guildId = null;
    idRoleping = {
        cardcatcher:null
    }
    guildChannel = null;//contains discord guild channel to send the spawn notif
    userAttempt = [];//contains list of all user who already used the spawn attempt

    constructor(Spawner=null){
        if(Spawner!=null){
            for(var key in Spawner){
                this[key] = Spawner[key];
            }
        }
    }

    async setSpawnData(){
        switch(this.type){
            case Spawner.type.cardNormal:
                this.data = new CardNormal(await DataCard.getCardData(this.spawnData), this.token);
                break;
            case Spawner.type.act:
                var parsedSpawnData = JSON.parse(this.spawnData);
                switch(parsedSpawnData.subtype){
                    case Act.subtype.jankenpon:
                        this.data = new ActJankenpon(await DataCard.getCardData(parsedSpawnData.cardId), this.token);
                        break;
                    case Act.subtype.miniTsunagarus:
                        var spawn = new ActMiniTsunagarus();
                        await spawn.initSpawnData(parsedSpawnData);
                        this.data = spawn;
                        break;
                }
                break;
        }
    }

    async randomizeSpawn(){
        //randomize new spawn token:
        var rndSpawnToken = GlobalFunctions.randomNumber(0,1000).toString();
        this.token = rndSpawnToken;

        var rnd = GlobalFunctions.randomNumber(0,100);
        rnd = 20;//only for testing
        var spawn;
        // var message = {id:"B"}//only for testing
        if(rnd<10){//normal card spawn
            this.type = Spawner.type.cardNormal;
            spawn = new CardNormal(await CardNormal.getRandomCard(), this.token);
            this.spawnData = spawn.spawnData;
            this.data = spawn;
        } else if(rnd==20){//activity
            this.type = Spawner.type.act;
            spawn = await Act.randomSubtype(this.token);
            this.spawnData = spawn.getSpawnData();
            this.data = spawn;
        }

        //merge embedspawn with id roleping if provided
        if(this.idRoleping.cardcatcher!==null){
            spawn.embedSpawn = GlobalFunctions.mergeObjects(spawn.embedSpawn, {content:`<@&${this.idRoleping.cardcatcher}>`});
        }

        var message = await this.guildChannel.send(spawn.embedSpawn);
        // console.log(spawn.embedSpawn.components[0]);
        
        // this.stopTimer();//only for testing
        // return;

        this.userAttempt = [];//reset listed user attempt
        //save spawner data to guild
        var dataGuild = new DataGuild(DataGuild.getData(this.guildId));
        dataGuild.setSpawner(this.type, this.spawnData, this, rndSpawnToken, message.id);//save latest spawner data to guild
        await dataGuild.updateDbSpawnerData();//update latest spawn to db
    }

    // setData(data){
    //     this.data = data;
    // }

    //timer method
    //newInterval in minutes
    updateTimer(newInterval){
        if(this.timer!==null){ //clear interval if timer exists
            clearInterval(this.timer);
        }

        this.interval = newInterval;
        this.timer = setInterval(()=>this.randomizeSpawn()
        ,Timer.minToSec(this.interval));
    }

    stopTimer(){
        if(this.timer!==null){ //clear interval if timer exists
            clearInterval(this.timer);
        }
    }

    async startTimer(){
        if(this.interval==null) return;
        this.timer = setInterval(async ()=>this.randomizeSpawn()
        ,Timer.minToSec(this.interval));
    }

    validationSpawn(discordUser, userData, commandToken, interaction){
        var user = new DataUser(userData);
        var userToken = user.token_cardspawn;
        if(this.type==null){
            return interaction.reply(Embed.errorMini(`:x: There are no card spawning right now.`,discordUser,true));
        } else if(userToken==this.token || this.userAttempt.includes(user.id_user)){ //check if capture token same/not
            return interaction.reply(Embed.errorMini(`:x: You have already used the capture attempt. Please wait for next card spawn.`,discordUser,true));
        } else if(commandToken!=this.token){
            return interaction.reply(Embed.errorMini(`:x: This capture command is not valid for current spawn.`,discordUser,true));
        }

        return true;
    }

    validationPeaceBoost(discordUser, userPeacePoint, cost, interaction){
        if(userPeacePoint<cost){
            return interaction.reply(Embed.errorMini(`:x: You need ${cost} peace point ${DataUser.peacePoint.emoji} to use boost capture.`,discordUser,true));
        }

        return true;
    }

    async removeSpawn(){
        this.spawnData = null;
        this.token = null;

        //save spawner data to guild
        var dataGuild = new DataGuild(DataGuild.getData(this.guildId));
        dataGuild.setSpawner(null, null, null, null);//save latest spawner data to guild
        await dataGuild.updateDbSpawnerData();//update latest spawn to db
    }

    static async eventListenerButton(discordUser, guildId, customId, interaction){
        var userId = discordUser.id;
        var userData = await DataUser.getData(userId);
        
        var joiner = "_";
        var guildData = DataGuild.getData(guildId);
        var dataGuild = new DataGuild(guildData); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);

        //process command
        var type = customId.split(joiner).shift();
        var commandToken = customId.split(joiner).pop();
        var command = customId.split(joiner).slice(1, -1).join(joiner);

        //spawn validation
        if(spawner.validationSpawn(discordUser, userData, commandToken, interaction)!=true) return;
        
        switch(type){
            case Spawner.type.cardNormal: //normal card spawn
                switch(command){
                    case CardNormal.buttonId.catch_normal:
                        await CardNormal.onCapture(discordUser, userData, guildData, interaction, false);
                        break;
                    case CardNormal.buttonId.catch_boost:
                        await CardNormal.onCapture(discordUser, userData, guildData, interaction, true);
                        break;
                }
                break;
            case Spawner.type.act:
                switch(command){
                    case ActJankenpon.buttonId.jankenpon_rock:
                    case ActJankenpon.buttonId.jankenpon_paper:
                    case ActJankenpon.buttonId.jankenpon_scissors:
                        await ActJankenpon.onCapture(discordUser, userData, guildData, 
                        command, interaction);
                    break;
                }
                break;
        }
    }

    static async eventListenerSelect(discordUser, guildId, customId, interaction){
        var userId = discordUser.id;
        var userData = await DataUser.getData(userId);

        var joiner = "_";
        var guildData = DataGuild.getData(guildId);
        var dataGuild = new DataGuild(guildData); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);

        //process command
        var type = customId.split(joiner).shift();
        var commandToken = customId.split(joiner).pop();
        var command = customId.split(joiner).slice(1, -1).join(joiner);
        var value = interaction.values[0];

        //spawn validation
        if(spawner.validationSpawn(discordUser, userData, commandToken, interaction)!=true) return;
        switch(type){
            case Spawner.type.act:
                var subType = command;
                switch(subType){
                    case ActMiniTsunagarus.selectId:
                        await ActMiniTsunagarus.onCapture(discordUser, userData, guildData, value, interaction);
                        break;
                }
                break;
        }
    }

}

class CardNormal {
    static value = Spawner.type.cardNormal;
    static buttonId = Object.freeze({
        catch_normal:"catch_normal",
        catch_boost:"catch_boost"
    });
    static catchRate = {
        1:80,
        2:70
    }
    
    // token = null;//token for card spawn
    spawnData = null;//to be saved for db
    cardData;//contains randomized/set card data
    static peacePointCost = {
        1:1,
        2:2
    };
    
    embedSpawn = null;

    constructor(cardData=null, token=null){
        // this.token = spawnToken;
        if(cardData!=null){
            this.cardData = new DataCard(cardData);
            //init embed spawn
            let card = this.cardData;
            let id = card.id_card; let pack = card.pack;
            let name = card.name; let img = card.img_url;
            let color = card.color; 
            let series = new Series(card.series);
            let character = new Character(card.pack);
            let rarity = card.rarity;

            var objEmbed = Embed.builder(`**Normal precure card has spawned!**`,
            Embed.builderUser.authorCustom(`${rarity}⭐ ${GlobalFunctions.capitalize(pack)} Card`, character.icon),
            {
                color: Embed.color[color],
                title:`${name.toString()}`,
                fields: [
                    {
                        name:"Card Capture Command:",
                        value:`${Emoji.mofuheart} Press ✨ **Catch!** to capture this card\nPress 🆙 **Boost** to boost capture with ${CardNormal.peacePointCost[rarity]} ${DataUser.peacePoint.emoji}`
                    }
                ],
                image:img,
                footer:Embed.builderUser.footer(`${series.name} Card (${id}) | ✔️ ${CardNormal.catchRate[rarity]}%`)
            });
            
            this.embedSpawn = ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
                DiscordStyles.Button.base(`card.${Spawner.type.cardNormal}_${CardNormal.buttonId.catch_normal}_${token}`,"✨ Catch!","PRIMARY"),
                DiscordStyles.Button.base(`card.${Spawner.type.cardNormal}_${CardNormal.buttonId.catch_boost}_${token}`,"🆙 Boost","PRIMARY"),
            ])]});

            this.spawnData = id;//set card id as spawnData
        }
    }

    static async getRandomCard(){
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(DataCard.columns.rarity,2);
        mapWhere.set(DataCard.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging

        var resultData = await DB.selectRandom(DataCard.tablename, mapWhere);
        return resultData[0];
    }

    //method to be called
    //set card data & embed
    // setData(CardNormal){
    //     for(var key in CardNormal){
    //         this[key] = CardNormal[key];
    //     }
    // }

    getBonusCaptureRate(refColorLevel){
        return refColorLevel>1 ? 
            3*refColorLevel:0;
    }

    capture(refColorLevel){
        var rarity = this.cardData.rarity;
        var catchRate = CardNormal.catchRate[rarity]+this.getBonusCaptureRate(refColorLevel);
        var chance = GlobalFunctions.randomNumber(0, 100);
        if(chance<catchRate){
            return true;
        } else {
            return false;
        }
    }

    getRewards(userColor, userSeries, isSuccess = true){
        var rarity = this.cardData.rarity;
        var rewards = {qty:1, color:rarity, series:rarity};//base rewards
        
        if(isSuccess){
            var color = this.cardData.color;
            var series = this.cardData.series;
            if(userColor==color) rewards.color*=2;
            if(userSeries==series) rewards.series*=2;
            if(userColor==color && userSeries==series) rewards.qty=2;
        } else {
            rewards = {color:rarity, series:rarity};//base rewards
        }
        
        return rewards;
    }

    //button event listener
    //normal card capture
    static async onCapture(discordUser, userData, guildData, interaction, isBoostCaptured){
        var userId = discordUser.id;
        var user = new DataUser(userData);

        var dataGuild = new DataGuild(guildData); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);
        
        //process chance
        var cardData = spawner.data.cardData;
        var spawn = new CardNormal(cardData);
        var card = spawn.cardData;
        var cardId = spawn.cardData.id_card;
        var color = card.color;
        var pack = card.pack;
        var series = card.series;
        var colorLevel = user.Color[color].level;

        var captured = false;
        var txtBoostCapture = "";
        if(isBoostCaptured){
            var cost = CardNormal.peacePointCost[card.rarity];//cost of peace point
            if(Spawner.validationPeaceBoost(discordUser, user.peace_point, cost, interaction)!=true) return;
            captured = true;
            user.peace_point-=cost;//update peace point
            txtBoostCapture = `${DataUser.peacePoint.emoji} Boost capture has been used!\n`;
        } else {
            captured = spawn.capture(colorLevel);//check if captured/not
        }
        
        var baseRewards = spawn.getRewards(user.set_color, user.set_series);
        user.token_cardspawn = spawner.token;//update user spawn token
        user.Color[color].point+= baseRewards.color;//update color points on user
        user.Series[series]+= baseRewards.series;//update series points on user
        await user.update();//update all data

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild

        if(captured){
            var stock = await DataCardInventory.updateStock(userId, cardId, baseRewards.qty, true);
            if(stock<=-1){
                var newTotal = await DataCardInventory.getPackTotal(userId, pack);
                await spawner.removeSpawn();//remove spawn if new
                return paginationEmbed(interaction, Embed.notifNewCard(discordUser, cardData, baseRewards, newTotal,{notifFront:txtBoostCapture}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                return interaction.reply({embeds:[Embed.notifDuplicateCard(discordUser, cardData, baseRewards, stock, {notifFront:txtBoostCapture})]});
            }
        } else {
            return interaction.reply(Embed.notifFailCatch(discordUser, cardData, 
                spawn.getRewards(user.set_color, user.set_series, false)));
        }
    }
}

class Act {
    static value = Spawner.type.act;
    static subtype = {
        jankenpon:"jankenpon",
        miniTsunagarus:"miniTsunagarus",
        series:"series",
        // star_twinkle_constellation:"star_twinkle_constellation",
        // star_twinkle_counting:"star_twinkle_counting"
    }

    spawnData = {
        subtype: null,
        cardId: null
    };//to be saved for db
    cardData;
    embedSpawn = null;

    constructor(cardData=null, token=null){//token will be used for command id
        if(cardData!=null){
            this.cardData = new DataCard(cardData);
            //init embed spawn
            let card = this.cardData;
            this.spawnData.cardId = card.id_card;
        }
    }

    static async randomSubtype(token){
        var rnd = GlobalFunctions.randomNumber(0,100);
        rnd=3;//onlny for debugging
        if(rnd<=1){//jankenpon spawn
            var cardData = await ActJankenpon.getRandomCard();
            var spawn = new ActJankenpon(cardData, token);
            return spawn;
        } else if(rnd==2){
            var arrCardData = await ActMiniTsunagarus.getRandomCard();
            var spawn = new ActMiniTsunagarus(arrCardData, token);
            return spawn;
        } else if(rnd==3){
            var series = GlobalFunctions.randomArrayItem([
                new Series("suite").value,
                // SPack.star_twinkle.properties.value
            ]);
            
            var arrCardData = await ActSeries.getRandomCard(series);
            var spawn = new ActSeries(arrCardData, token, series);
            return spawn;
        }
    }

    getRewards(userColor, userSeries, isSuccess = true){
        var rarity = this.cardData.rarity;
        var rewards = {qty:1, color:rarity, series:rarity};//base rewards
        
        if(isSuccess){
            var color = this.cardData.color;
            var series = this.cardData.series;
            if(userColor==color) rewards.color*=2;
            if(userSeries==series) rewards.series*=2;
            if(userColor==color && userSeries==series) rewards.qty=2;
        } else {
            rewards = {color:rarity, series:rarity};//base rewards
        }
        
        return rewards;
    }

    getSpawnData(){
        return JSON.stringify(this.spawnData);
    }
}

//smile jankenpon
class ActJankenpon extends Act {
    static subType = Act.subtype.jankenpon;
    static series = SPack.smile.properties.value;
    static jankenponData = {
        rock:{
            value:"rock",
            icon:"🪨",
            img:"https://i.imgur.com/xvAk8aA.png",
            choiceResults:{//player results
                paper:true,
                scissors:false
            }
        }, 
        paper:{
            value:"paper",
            icon:"📜",
            img:"https://imgur.com/uQtSfqD.png",
            choiceResults:{//player results
                scissors:true,
                rock:false
            }
        },
        scissors:{
            value:"scissors",
            icon:"✂️",
            img:"https://imgur.com/vgqsHN5.png",
            choiceResults:{//player results
                rock:true,
                paper:false
            }
        }
    }

    static results = {
        win:"win",
        draw:"draw",
        lose:"lose"
    }

    static rewardsPeacePoint = 1;

    static buttonId = Object.freeze({
        jankenpon_rock:"jankenpon_rock",
        jankenpon_paper:"jankenpon_paper",
        jankenpon_scissors:"jankenpon_scissors"
    });

    constructor(cardData= null, token= null){
        super(cardData);
        this.spawnData.subtype = ActJankenpon.subType; 
        //build embed spawn
        this.embedSpawn = {embeds:[
            Embed.builder(`Play & win the jankenpon round from Peace!`,
            Embed.builderUser.authorCustom(`${this.cardData.rarity}⭐ Spawn Act: Smile Jankenpon`),
            {
                thumbnail:new Character("yayoi").icon,
                image:`https://cdn.discordapp.com/attachments/793415946738860072/936272483286413332/peace_jankenpon.gif`,
                title:`${new Series(this.cardData.series).emoji.mascot} It's Jankenpon Time!`,
                fields:[
                    {
                        name:"Jankenpon Command:",
                        value:`Press 🪨 to pick rock\nPress 📜 to pick paper\nPress ✂️ to pick scissors`
                    },
                ]
            })
        ], components:[
            DiscordStyles.Button.row(
                [
                    DiscordStyles.Button.base(`card.${Spawner.type.act}_${ActJankenpon.buttonId.jankenpon_rock}_${token}`,"🪨 Rock"),
                    DiscordStyles.Button.base(`card.${Spawner.type.act}_${ActJankenpon.buttonId.jankenpon_paper}_${token}`,"📜 Paper"),
                    DiscordStyles.Button.base(`card.${Spawner.type.act}_${ActJankenpon.buttonId.jankenpon_scissors}_${token}`,"✂️ Scissors")
                ]
            )
        ]};
    }

    static async getRandomCard(){
        //randomize smile card
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, 5);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable, 1);
        mapWhere.set(DBM_Card_Data.columns.series, this.series);

        var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere);
        return resultData[0];
    }

    getRewards(userColor, userSeries, isSuccess = true){
        var rarity = this.cardData.rarity;
        var rewards = {qty:1, color:rarity, series:rarity};//base rewards
        
        if(isSuccess){
            var color = this.cardData.color;
            var series = this.cardData.series;
            if(userColor==color) rewards.color*=2;
            if(userSeries==series) rewards.series*=2;
            if(userColor==color && userSeries==series) rewards.qty=2;
        } else {
            rewards = {color:rarity, series:rarity};//base rewards
        }
        
        return rewards;
    }

    static async onCapture(discordUser, userData, guildData, command, interaction){
        var userId = discordUser.id;
        var user = new DataUser(userData);

        var dataGuild = new DataGuild(guildData); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);
        var spawn = new ActJankenpon(spawner.data.cardData);
        var cardData = spawner.data.cardData;
        var card = spawn.cardData;
        var cardId = card.id_card;
        var color = card.color;
        var rarity = card.rarity;
        var series = new Series(card.series);

        //process jankenpon
        var arrEmbeds = []; var choice = command.split("_")[1];
        var rndJankenpon = GlobalFunctions.randomPropertyKey(ActJankenpon.jankenponData);
        var baseRewards = spawn.getRewards(user.set_color, user.set_series);

        //process points & peace points rewards
        user.Color[color].point+= baseRewards.color;//update color points on user
        user.Series[series]+= baseRewards.series;//update series points on user

        var colorPoints = baseRewards.color;
        var seriesPoints = baseRewards.series;

        var notifColorPoints = `${Color[color].emoji} ${colorPoints} ${color} points ${colorPoints>rarity ? " ⏫":""}`;
        var notifSeriesPoints = `${series.emoji.mascot} ${seriesPoints} ${series.currency.name} ${seriesPoints>rarity ? " ⏫":""}`;
        if(ActJankenpon.jankenponData[rndJankenpon].choiceResults[choice]){//results: win
            user.peace_point+= ActJankenpon.rewardsPeacePoint;//update peace points on user
            user.token_cardspawn = spawner.token;//update user spawn token
            spawner.userAttempt.push(userId);//add user attempt to spawner list

            var notifRewards = `\n${DataUser.peacePoint.emoji} ${ActJankenpon.rewardsPeacePoint} peace point`;

            var embedWin = Embed.builder(
                `I picked ${ActJankenpon.jankenponData[rndJankenpon].icon} **${ActJankenpon.jankenponData[rndJankenpon].value}**! Yay yay yay! You win!`,
                discordUser,{
                    color:Embed.color.yellow,
                    title:"✅ You Win!",
                    thumbnail:ActJankenpon.jankenponData[rndJankenpon].img
                }
            );

            var stock = await DataCardInventory.updateStock(userId, cardId, baseRewards.qty, true);
            if(stock<=-1){
                var newTotal = await DataCardInventory.getPackTotal(userId, card.pack);
                await spawner.removeSpawn();//remove spawn if new
                await interaction.channel.send({embeds:[embedWin]});
                await paginationEmbed(interaction, Embed.notifNewCard(discordUser, cardData, baseRewards, newTotal, {rewards:notifRewards}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                spawner.userAttempt.push(userId);//add user attempt to spawner list
                dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild
                await interaction.reply({embeds:[
                    embedWin,
                    Embed.notifDuplicateCard(discordUser, cardData, baseRewards, stock, {rewards:notifRewards})
                ]});
            }
        } else if(ActJankenpon.jankenponData[rndJankenpon].value==choice){ //results: draw
            arrEmbeds.push(Embed.builder(
                `Hey we both went with ${ActJankenpon.jankenponData[rndJankenpon].icon} **${ActJankenpon.jankenponData[rndJankenpon].value}**! It's a draw!\nYou have another chance to use the jankenpon command.`,discordUser,
                {
                    title:"🔁 Once More!",
                    thumbnail:ActJankenpon.jankenponData[rndJankenpon].img,
                    fields:[{
                        name:`Received:`,
                        value:dedent(`${notifColorPoints}
                        ${notifSeriesPoints}`)
                    }]
                }
            ));
            await interaction.reply({embeds:arrEmbeds});
        } else {//results: lose
            user.token_cardspawn = spawner.token;//update user spawn token
            spawner.userAttempt.push(userId);//add user attempt to spawner list
            dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild
            arrEmbeds.push(Embed.builder(
                `I picked ${ActJankenpon.jankenponData[rndJankenpon].icon} **${ActJankenpon.jankenponData[rndJankenpon].value}**! Oh no, you lost.`,
                discordUser,{
                    color:Embed.color.danger,
                    title:"❌ You Lost",
                    thumbnail:ActJankenpon.jankenponData[rndJankenpon].img,
                    fields:[{
                        name:`Received:`,
                        value:dedent(`${notifColorPoints}
                        ${notifSeriesPoints}`)
                    }]
                }
            ));
            await interaction.reply({embeds:arrEmbeds});
        }

        await user.update();
    }
}

//mini tsunagarus
class ActMiniTsunagarus extends Act {
    static subType = Act.subtype.miniTsunagarus;
    static selectId = Act.subtype.miniTsunagarus;
    static imgTsunagarus = "https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png"
    
    spawnData = {//to be saved for db
        subtype: Act.subtype.miniTsunagarus,
        cardId: [],
        answer: null
    };

    cardData = [];

    constructor(arrCardData=null, token= null){
        super(null);
        
        if(arrCardData!=null){//init new
            for(var key in arrCardData){
                arrCardData[key] = new DataCard(arrCardData[key]);
            }
    
            this.cardData = arrCardData;
            this.randomize(arrCardData, token);
        }
    }

    async initSpawnData(parsedSpawnData){
        this.spawnData = parsedSpawnData;
        for(var key in this.spawnData.cardId){
            this.cardData.push(new DataCard(
                await DataCard.getCardData(this.spawnData.cardId[key])
            ));
        }
    }

    setSpawnData(spawnerData){
        this.spawnData = spawnerData.spawnData;
        this.cardData = spawnerData.cardData;
    }

    randomize(arrCardData=[], token){
        var card = new DataCard(arrCardData[0]);
        var rarity =card.rarity;
        var pack = card.pack;

        var splittedText = new Character(pack).fullname.split(" ");
        var shuffleName = "";
        var arrAnswerList = []; //prepare the answer list

        //randomize the answer text
        for(var i=0;i<splittedText.length;i++){
            shuffleName += `${GlobalFunctions.shuffleText(
                GlobalFunctions.shuffleText(
                    GlobalFunctions.shuffleText(splittedText[i])).replace(" ",""))}`.toLowerCase();
        }

        //push all the listed card
        for(var i=0;i<arrCardData.length;i++){
            let card = new DataCard(arrCardData[i]);
            var pack = card.pack;
            var series = new Series(card.series).name;

            arrAnswerList.push(`${series} - ${capitalize(new Character(pack).color)} Cure`);
            this.spawnData.cardId.push(card.id_card);
        }

        // var tempAnswer = arrAnswerList[0];
        var answer = arrAnswerList.indexOf(arrAnswerList[0]);
        
        var tempAnswer = arrAnswerList[0];
        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList); //shuffle the answer

        var answer = arrAnswerList.indexOf(tempAnswer);
        //get the answer
        switch(answer){
            case 0: this.spawnData.answer = "a"; break;
            case 1: this.spawnData.answer = "b"; break;
            case 2: this.spawnData.answer = "c"; break;
            case 3: this.spawnData.answer = "d"; break;
        }

        //prepare select menu
        var arrOptions = [];
        for(var i=0;i<arrAnswerList.length;i++){
            arrOptions.push({
                label: `${arrAnswerList[i].toString()}`,
                description: `Answers with: ${arrAnswerList[i]}`
            });
            switch(i){
                case 0: arrOptions[i].value = "a"; break;
                case 1: arrOptions[i].value = "b"; break;
                case 2: arrOptions[i].value = "c"; break;
                case 3: arrOptions[i].value = "d"; break;
            }
        }

        //select menu end

        var objEmbed = Embed.builder(`**Chiridjirin** has taking over the quiz time!\nRearrange this provided hint: **${shuffleName}** and choose the correct branch to defeat the tsunagarus!`,
        Embed.builderUser.authorCustom(`${rarity}⭐ Spawn Act: Quiztaccked!`),
        {
            color:`#CC3060`,
            thumbnail:Properties.imgSet.mofu.panic,
            image:ActMiniTsunagarus.imgTsunagarus
        });

        this.embedSpawn = {embeds:[objEmbed],
            components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActMiniTsunagarus.selectId}_${token}`,"Select the answers",arrOptions)]}
    }

    getRewards(userColor, userSeries, cardData, isSuccess = true){
        var card = new DataCard(cardData);
        var rarity = card.rarity;
        var color = card.color;
        var series = card.series;

        var rewards = {qty:1, color:rarity, series:rarity};//base rewards
        if(isSuccess){
            if(userColor==color) rewards.color*=2;
            if(userSeries==series) rewards.series*=2;
            if(userColor==color && userSeries==series) rewards.qty=2;
        } else {
            rewards = {color:rarity, series:rarity};//base rewards
        }
        
        return rewards;
    }

    static async getRandomCard(){
        //randomize smile card
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, 3);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable, 1);

        var arrCardData = [];
        var resultData = await DB.selectRandomNonDuplicate(DBM_Card_Data.TABLENAME, mapWhere, DBM_Card_Data.columns.pack, 4);
        for(var i=0;i<resultData.length;i++){
            arrCardData.push(resultData[i]);
        }
        return arrCardData;
    }

    static async onCapture(discordUser, userData, guildData, 
        value, interaction){
        var userId = discordUser.id;
        var user = new DataUser(userData);

        var dataGuild = new DataGuild(guildData); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);
        var spawn = new ActMiniTsunagarus();
        spawn.setSpawnData(spawner.data);

        var answer = spawn.spawnData.answer;
        var isSuccess = value==answer? true:false;

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild

        //check for answer
        if(isSuccess){//success
            //randomize card rewards
            var rndCardData = GlobalFunctions.randomArrayItem(spawn.cardData);
            var card = new DataCard(rndCardData);//randomized card
            var cardId = card.id_card;
            var color = card.color;
            var series = new Series(card.series);
            var pack = card.pack;

            //process user rewards
            var baseRewards = spawn.getRewards(user.set_color, user.set_series, rndCardData, isSuccess);
            
            user.Color[color].point+= baseRewards.color;//update color points on user
            user.Series[series]+= baseRewards.series;//update series points on user

            var stock = await DataCardInventory.updateStock(userId, cardId, baseRewards.qty, true);

            if(stock<=-1){
                var newTotal = await DataCardInventory.getPackTotal(userId, pack);//get new pack total
                await spawner.removeSpawn();//remove spawn if new

                await interaction.channel.send(
                    Embed.successMini(`✅ You've successfully defeat the mini tsunagarus!`, 
                    discordUser, false, {
                        title:`Mini Tsunagarus Defeated!`
                    })
                );
                await paginationEmbed(interaction, Embed.notifNewCard(discordUser, rndCardData, baseRewards, newTotal), 
                DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    embSuccess,
                    Embed.notifDuplicateCard(discordUser, rndCardData, baseRewards, stock)
                ]});
            }
        } else {
            await interaction.reply({embeds:[
                Embed.builder(`:x: Chirichiri! You failed to defeat the tsunagarus this time.`,discordUser,{
                    color:`#CC3060`,
                    thumbnail:`https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png`,
                    title:`Defeated!`
                })
            ]});
        }

        user.token_cardspawn = spawner.token;//update user spawn token
        await user.update();//update all data
    }
}

class ActSeries extends Act {
    static subType = Act.subtype.series;
    static selectId = Act.subtype.series;
    static seriestype = {
        suiteNotesCount:"suiteNotesCount",
    }

    spawnData = {//to be saved for db
        subtype: Act.subtype.series,
        series: null,
        cardId: [],
        answer: null
    };

    cardData = [];

    constructor(arrCardData=null, token= null, series= null){
        super(null);
        
        if(arrCardData!=null){//init new
            for(var key in arrCardData){
                arrCardData[key] = new DataCard(arrCardData[key]);
            }
    
            this.spawnData.series = series;
            this.cardData = arrCardData;
            this.randomize(arrCardData, token, series);
        }
    }

    randomize(arrCardData=[], token, series){
        var card = new DataCard(arrCardData[0]);
        var rarity = card.rarity;
        var pack = card.pack;

        //push all the listed card
        for(var i=0;i<arrCardData.length;i++){
            let card = new DataCard(arrCardData[i]);
            this.spawnData.cardId.push(card.id_card);
        }

        switch(series){
            case new Series("suite").value:
                this.spawnData.seriesType = ActSeries.seriestype.suiteNotesCount;

                //suite notes counting
                var total = 0;//init default

                var objNotes = [
                    {icon:"🎶",sign: "+",value:GlobalFunctions.randomNumber(5,10)},
                    {icon:"🎵",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(2,7)},
                    {icon:"🎹",sign: "+",value:GlobalFunctions.randomNumber(3,7)},
                    {icon:"🎸",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(5,7)},
                    {icon:"🎺",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(3,7)},
                ];

                var positiveNotes = objNotes.filter(function(notes) {
                    return notes.sign === '+';
                });

                var txtDescription = `🎶${objNotes[0].sign}${objNotes[0].value} / 🎵${objNotes[1].sign}${objNotes[1].value} / 🎹${objNotes[2].sign}${objNotes[2].value} / 🎸${objNotes[3].sign}${objNotes[3].value} / 🎺${objNotes[4].sign}${objNotes[4].value}\n`;

                //generate notes
                var txtField=`🎶`;
                total = objNotes[0].value;//init first note number

                for(var i=0;i<4;i++){
                    var rndKey = GlobalFunctions.randomNumber(0,Object.keys(objNotes).length-1);
                    if(objNotes[rndKey].sign=="-" && total-objNotes[rndKey].value<=0){
                        //switch to positive & random with positive notes
                        var rndKey = GlobalFunctions.randomNumber(0,Object.keys(positiveNotes).length-1);
                        total+=positiveNotes[rndKey].value;
                        txtField+=`${positiveNotes[rndKey].icon}`;
                    } else {
                        objNotes[rndKey].sign=="+" ? total+=objNotes[rndKey].value : total-=objNotes[rndKey].value;
                        txtField+=`${objNotes[rndKey].icon}`;
                    }
                }

                var arrAnswerList = GlobalFunctions.shuffleArray([total,GlobalFunctions.randomNumber(total-3,total-4),GlobalFunctions.randomNumber(total-1,total-2),GlobalFunctions.randomNumber(total+1,total+2)]);

                // arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                var answer = arrAnswerList.indexOf(total);
                switch(answer){
                    case 0:
                        this.spawnData.answer = "a";
                        break;
                    case 1:
                        this.spawnData.answer = "b";
                        break;
                    case 2:
                        this.spawnData.answer = "c";
                        break;
                    case 3:
                        this.spawnData.answer = "d";
                        break;
                    case 4:
                        this.spawnData.answer = "e";
                        break;
                }

                var arrOptions = [];
                for(var i=0;i<arrAnswerList.length;i++){
                    arrOptions.push({
                        label: `${arrAnswerList[i].toString()}`,
                        description: `Answer with ${arrAnswerList[i]} notes`
                    });
                    switch(i){
                        case 0: arrOptions[i].value = "a"; break;
                        case 1: arrOptions[i].value = "b"; break;
                        case 2: arrOptions[i].value = "c"; break;
                        case 3: arrOptions[i].value = "d"; break;
                        case 4: arrOptions[i].value = "e"; break;
                    }
                }

                //set embed
                var objEmbed = Embed.builder(`Count how many generated notes on this spawn:\n${txtDescription}`,
                Embed.builderUser.authorCustom(`${rarity}⭐ Spawn Act: Suite Notes Counting`),{
                    title:`${new Series(series).emoji.mascot} It's Suite Notes Counting Time!`,
                    thumbnail:GlobalFunctions.randomArrayItem(
                        [`https://static.wikia.nocookie.net/prettycure/images/3/33/Fairy01.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/d/d5/Fairy02.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/9/94/Fairy03.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/6/63/Fairy04.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/7/71/Fairy05.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/b/b1/Fairy06.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/6/68/Fairy07.gif`,
                        `https://static.wikia.nocookie.net/prettycure/images/0/00/Fairy08.gif`]
                    ),
                    image:Properties.imgSet.mofu.peek,
                    fields:[{
                        name:"Generated Notes:",
                        value:txtField
                    }]
                });

                this.embedSpawn = {embeds:[objEmbed],
                    components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActSeries.selectId}_${token}`,
                    "Select the answers",arrOptions)]};

            break;
        }
    }

    static async getRandomCard(series){
        //randomize smile card
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, 2);
        mapWhere.set(DBM_Card_Data.columns.series, series);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable, 1);

        var arrCardData = [];
        var resultData = await DB.selectRandomNonDuplicate(DBM_Card_Data.TABLENAME, mapWhere, DBM_Card_Data.columns.pack, 4);
        for(var i=0;i<resultData.length;i++){
            arrCardData.push(resultData[i]);
        }
        return arrCardData;
    }

    
    
}

module.exports = { Spawner, CardNormal, ActJankenpon };
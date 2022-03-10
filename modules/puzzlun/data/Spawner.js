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
const {Series} = require('./Series');
const {Character} = require('./Character');
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

const type = {
    cardNormal:"cardNormal"
}

const buttonId = Object.freeze({
    catch_normal:"catch_normal",
    catch_boost:"catch_boost"
});

class Spawner {
    // static type = type;
    static Timer = Timer;
    static buttonId = buttonId;

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

    constructor(Spawner=null){
        if(Spawner!=null){
            for(var key in Spawner){
                this[key] = Spawner[key];
            }
        }
    }

    async init(guildId, guildChannel, interval,
        spawn_token=null, spawn_type=null, spawn_data=null){
        this.guildId = guildId;
        this.guildChannel = guildChannel;
        this.interval = interval;
        this.token = spawn_token;
        if(spawn_type!==null || spawn_data!==null){
            this.type = spawn_type;
            switch(this.type){
                case type.cardNormal:
                    var spawn = new CardNormal(await DataCard.getCardData(spawn_data), this.token);
                    // spawn.setData(await DataCard.getCardData(spawn_data), this.token);
                    this.spawnData = spawn.spawnData;
                    this.data = spawn;
                    break;
            }
        }

        //save spawner data to guild
        var dataGuild = new DataGuild(DataGuild.getData(this.guildId));
        dataGuild.setSpawner(this.type, this.spawnData, this);
    }

    async randomizeSpawn(){
        //randomize new spawn token:
        var rndSpawnToken = GlobalFunctions.randomNumber(0,1000).toString();
        this.token = rndSpawnToken;

        var rnd = GlobalFunctions.randomNumber(0,100);
        rnd = 0;
        var message = null;
        if(rnd<100){//normal card spawn
            this.type = type.cardNormal;
            var spawn = new CardNormal(await CardNormal.getRandomCard(), this.token);
            // spawn.setData(await CardNormal.getRandomCard(), this.token);
            this.spawnData = spawn.spawnData;
            this.data = spawn;

            //send embed to guild channel
            message = await this.guildChannel.send(spawn.embedSpawn);
        }

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

    validationCapture(discordUser, userData, customId, interaction){
        var user = new DataUser(userData);
        var userToken = user.token_cardspawn;
        var buttonToken = customId.toString().split("_")[2];//split custom id & get 
        if(this.type==null){
            return interaction.reply(Embed.errorMini(`:x: There are no card spawning right now.`,discordUser,true));
        } else if(userToken==this.token){ //check if capture token same/not
            return interaction.reply(Embed.errorMini(`:x: You have already used the capture attempt. Please wait for next card spawn.`,discordUser,true));
        } else if(buttonToken!=this.token){
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

    //method to be called
    // startRandomSpawn(){
    //     if(this.interval==null) return;
    //     switch(this.type){
    //         case type.cardNormal.value:
    //             break;
    //     }
    //     //  = DataGuild.getSpawner(this.guildId);
    // }

}

class CardNormal {
    static value = "cardNormal";
    
    token = null;//token for card spawn
    spawnData = null;//to be saved for db
    cardData;//contains randomizeed/set card data
    userData = null;
    idRoleping = null;
    peacePointCost = {
        1:1,
        2:2
    };
    catchRate = {
        1:80,
        2:70
    }
    embedSpawn = null;

    constructor(cardData=null, spawnToken=null, userData=null){
        // if(spawnToken!=null){
            this.token = spawnToken;
        // }
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
                        value:`${Emoji.mofuheart} Press ✨ **Catch!** to capture this card\nPress 🆙 **Boost** to boost capture with ${this.peacePointCost[rarity]} ${DataUser.peacePoint.emoji}`
                    }
                ],
                image:img,
                footer:Embed.builderUser.footer(`${series.name} Card (${id}) | ✔️ ${this.catchRate[rarity]}%`)
            });
            
            this.embedSpawn = ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
                DiscordStyles.Button.base(`card.${buttonId.catch_normal}_${this.token}`,"✨ Catch!","PRIMARY"),
                DiscordStyles.Button.base(`card.${buttonId.catch_boost}_${this.token}`,"🆙 Boost","PRIMARY"),
            ])]});

            this.spawnData = id;//set card id as spawnData
        }
        
        if(userData!=null){
            this.userData = new DataUser(userData);
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
    setData(CardNormal){
        for(var key in CardNormal){
            this[key] = CardNormal[key];
        }
    }

    getBonusCaptureRate(refColorLevel){
        return refColorLevel>1 ? 
            3*refColorLevel:0;
    }

    capture(refColorLevel){
        var rarity = this.cardData.rarity;
        var catchRate = this.catchRate[rarity]+this.getBonusCaptureRate(refColorLevel);
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
    static async onCapture(discordUser, guildId, customId, interaction, 
        isBoostCaptured){
        var userId = discordUser.id;
        var userData = await DataUser.getData(userId);
        var user = new DataUser(userData);

        var dataGuild = new DataGuild(DataGuild.getData(guildId)); //get spawnerdata from guild
        var spawner = new Spawner(dataGuild.spawner);
        
        if(spawner.validationCapture(discordUser, userData, customId, interaction)!=true) return;
        
        //process chance
        var cardData = spawner.data.cardData;
        var spawn = new CardNormal(cardData);
        var card = spawn.cardData;
        var cardId = spawn.cardData.id_card;
        var color = card.color;
        var series = card.series;
        var colorLevel = user.Color[color].level;

        var captured = false;
        var txtBoostCapture = "";
        if(isBoostCaptured){
            var cost = spawn.peacePointCost[card.rarity];//cost of peace point
            if(spawner.validationPeaceBoost(discordUser, user.peace_point, cost, interaction)!=true) return;
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

        if(captured){
            var ret = await DataCardInventory.updateStock(userId, cardId, baseRewards.qty, true);
            if(ret<=-1){
                await spawner.removeSpawn();//remove spawn if new
                return paginationEmbed(interaction, Embed.notifNewCard(discordUser, cardData, baseRewards, 1,{notifFront:txtBoostCapture}), 
                DiscordStyles.Button.pagingButtonList);
                
            } else {
                return interaction.reply({embeds:[Embed.notifDuplicateCard(discordUser, cardData, baseRewards, ret, {notifFront:txtBoostCapture})]});
            }
        } else {
            return interaction.reply(Embed.notifFailCatch(discordUser, cardData, 
                spawn.getRewards(user.set_color, user.set_series, false)));
        }
    }

    // async spawn(guildId, guildChannel, interval){
    //     var embedSpawn = this.getEmbedSpawn();
        
    //     if(this.cardData==null) return;
    //     var dataGuild = new DataGuild(DataGuild.getData(guildId));
    //     dataGuild.spawn_type = this.type;
    //     dataGuild.spawn_data = DataCard.getId(this.cardData);
    //     dataGuild.spawner = this;
    //     //save to guild object
    //     await dataGuild.updateDbSpawnData();
    //     return;
    // }
}

class EventListener {
    guildId;
    user;
    spawner;

    constructor(guildId, dataUser){
        this.guildId = guildId;
        this.user = new DataUser(dataUser);
    }
}

module.exports = { Spawner, CardNormal, EventListener };
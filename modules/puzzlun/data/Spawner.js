const dedent = require("dedent-js");
const GlobalFunctions = require('../../GlobalFunctions');
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require("../../DiscordStyles");
const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');
const DataGuild = require('./Guild');
const DataCard = require('./Card');
const DataUser = require('./User');
const {Series} = require('./Series');
const {Character} = require('./Character');
const GProperties = require("../Properties");
const Color = GProperties.color;
const Emoji = GProperties.emoji;

class Embed extends require("../Embed") {
    static notifNotEnoughBoostPoint(boostCost, objUserData){
        return GEmbed.failMini(`:x: you need **${boostCost} peace point** to use the boost capture.`, objUserData)
    }

    static notifNewCard(discordUser, dataCard, qtyReceive, 
        colorPoint, seriesPoint, total, options = {}){
        //user data:
        var userId = discordUser.id;
        var username = discordUser.username;
        var userAvatar = this.builderUser.getAvatarUrl(discordUser);

        //card data
        var card = new DataCard(dataCard);
        var id = card.id_card; var rarity = card.rarity;
        var pack = new Character(card.pack); var name = card.name.toString();
        var img = card.img_url; var color = card.color;
        var series = new Series(card.series);
        var packTotal = card.packTotal;

        return GEmbed.successBuilder(dedent(`${"notifFront" in options? options.notifFront:""}
        <@${userId}> has received new ${pack} card!\n
        **Rewards:**
        ${Color[color].emoji_card} ${qtyReceive}x new card: ${id} ${qtyReceive>1?" ⏫":""}
        ${Color[color].emoji} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}
        ${series.emoji.mascot} ${seriesPoint} ${series.currency.name} ${seriesPoint>rarity?" ⏫":""}${"rewards" in options ? "\n"+options.rewards : ""}
        ${"notifBack" in options? options.notifBack:""}\n`, {
            username:`${rarity.toString()}${card.emoji.rarity} ${GlobalFunctions.capitalize(pack.alter_ego)} Card`,
            avatarUrl: pack.icon
        }, {
        color: this.color[color],
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
        footer: {
            text: `Captured by: ${username} (${total}/${packTotal})`,
            icon_url: userAvatar
        }}
        ));
    }

    // static notifDuplicateCard(objUserData, cardData, qtyReceive, 
    //     colorPoint, seriesPoint, updatedStock, options = {}){
    //     //user data:
    //     var userId = objUserData.id;

    //     //card data
    //     var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
    //     var pack = cardData[DBM_Card_Data.columns.pack]; var series = CpackModule[pack].Properties.series; 
    //     var name = cardData[DBM_Card_Data.columns.name]; var img = cardData[DBM_Card_Data.columns.img_url]; 
    //     var color = CpackModule[pack].Properties.color;

    //     return GEmbed.builder(`${"notifFront" in options? options.notifFront:""}\n<@${userId}> has received another ${pack} card: **${id}**.${"notifBack" in options? options.notifBack:""}`, objUserData, {
    //         color: color,
    //         title: `Duplicate Card`,
    //         thumbnail:img,
    //         fields:[
    //         {
    //             name:`Rewards Received:`,
    //             value:stripIndents`${Properties.color[color].icon_card} **${qtyReceive}x dup card:** ${id} - ${name}${qtyReceive>1?" ⏫":""}
    //             ${Properties.color[color].icon} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}
    //             ${SpackModule[series].Properties.currency.icon_emoji} ${seriesPoint} ${SpackModule[series].Properties.currency.name} ${seriesPoint>rarity?" ⏫":""}${"rewards" in options ? "\n"+options.rewards : ""}`,
    //             inline:false
    //         }],
    //         footer: {
    //             text: `Stock: ${updatedStock}/${UserModule.Properties.limit.card}`
    //     }});
    // }

    // static notifFailCatch(objUserData, cardData, options={}){
    //     //user data:
    //     var userId = objUserData.id;

    //     //card data
    //     var rarity = cardData[DBM_Card_Data.columns.rarity]; var pack = cardData[DBM_Card_Data.columns.pack]; 
    //     var color = CpackModule[pack].Properties.color; var series = CpackModule[pack].Properties.series;

    //     var builder = GEmbed.failMini(`${"notifFront" in options? options.notifFront:""}\n:x: <@${userId}> has failed to catch the card this time.\n${"notifBack" in options? options.notifBack:""}\n`, objUserData, {
    //     fields:[{
    //         name:`Received:`,
    //         value:stripIndents`${Properties.color[color].icon} ${rarity} ${color} points
    //         ${SpackModule[series].Properties.currency.icon_emoji} ${rarity} ${SpackModule[series].Properties.currency.name}`,
    //         inline:true
    //     }]});
    //     if("title" in options)
    //         obuilder.fields[0].title = options.title;
        
    //     return builder;
    // }
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

const catchRate = Object.freeze({

})

class Timer {
    timer=null;

    constructor(){

    }

    static start(guildChannel, objEmbed){
        return setInterval(function(){
            guildChannel.send(objEmbed);
        }, 5000)
    }

    //convert mins to seconds
    static minToSec(min){
        return min*60;
    }
}

class CardNormal {
    static properties = "normal";

    type = "normal";
    cardData=null;
    peacePointCost = {
        1:1,
        2:2
    };
    catchRate = {
        1:80,
        2:70
    }

    constructor(){
        // this.cardData=cardData;
        // for(var key in cardData){
        //     this[key] = cardData[key];
        // }
        // this.Card = cardData;
    }

    static async getRandomCard(){
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity,2);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging

        var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere);
        return resultData[0];
    }

    getEmbedSpawn(){
        if(this.cardData==null) return;
        var card = new DataCard(this.cardData);
        var id = card.id_card; var pack = card.pack;
        var name = card.name; var img = card.img_url;
        var color = card.color; 
        var series = new Series(card.series);
        var character = new Character(card.pack);
        var rarity = card.rarity;

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
        
        return ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base("card.catch_normal","✨ Catch!","PRIMARY"),
            DiscordStyles.Button.base("card.catch_boost","🆙 Boost","PRIMARY"),
        ])]});
    }

    getCardData(){
        return this.cardData;
    }

    setCardData(cardData){
        this.cardData = cardData;
    }

    //method to be called
    async spawn(guildId, interval){
        var embedSpawn = this.getEmbedSpawn();
        
        if(this.cardData==null) return;
        var dataGuild = new DataGuild(DataGuild.getData(guildId));
        dataGuild.spawn_type = this.type;
        dataGuild.spawn_data = new DataCard(this.cardData).id_card;
        dataGuild.Spawner = this;
        //save to guild object
        await dataGuild.updateSpawnData();
        return;
    }
    
    getSpawnData(){
        if(this.cardData==null) return;
        return DataCard.getId(this.cardData);
    }

    onCapture(){

    }
}

const type = {
    normal:CardNormal
}

class Spawner {
    static type = type;
    static Timer = Timer;

    interval = null;//in minutes
    timer = null;
    type = null;
    data = null;

    constructor(type){
        console.log(type);
        // if(spawnData!==null){
        //     for(var key in spawnData){
        //         this[key] = spawnData[key];
        //     }
        // }

        // console.log("OK");
        // console.log(spawnData);
    }

    setData(data){
        this.data = "A";
    }

    getData(){
        return{
            timer: this.timer,
            type: this.type,
            data: this.data,
        }
    }

    setTimer(timer, interval){
        // this.timer = setInterval(function(){

        // },1000);
    }

    getTimer(timer){
        // this.timer = timer;
    }

    resetTimer(timer){

    }

    randomize(){

    }

    getSpawnType(){
        return this.type;
    }
}

module.exports = Spawner;
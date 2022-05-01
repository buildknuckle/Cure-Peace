const dedent = require("dedent-js");
const paginationEmbed = require('../../../modules/DiscordPagination');
const GlobalFunctions = require('../../GlobalFunctions');
const emojify = GlobalFunctions.emojify;
const capitalize = GlobalFunctions.capitalize;
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require("../../DiscordStyles");
const DBM_Card_Data = require('../../../database/model/DBM_Card_Data');
const Guild = require('./Guild');
const Card = require('./Card');
const CardInventory = require('./CardInventory');
const User = require('./User');
const Instance = require('./Instance');
const {Series, SPack} = require('./Series');
const {Character, CPack} = require('./Character');
const {Enemy, EnPack} = require('./Enemy');
const {Party} = require('./Party');
const Properties = require("../Properties");
const { PartyAct } = require("./Instance");
const Color = Properties.color;
const Emoji = Properties.emoji;
const Listener = require('./Listener');

class Embed extends require("../Embed") {
}

class Timer {
    interval = null;//default interval
    remainingTime = null;//remaining time in seconds
    timer;//timer functions

    constructor(Timer=null){
        if(Timer!=null){
            for(var key in Timer){
                this[key] = Timer[key];
            }
        }
    }

    //convert mins to seconds
    static intervalMinToSec(min){
        return (min*60)*1000;
        // return min*1000;//for testing only
    }

    static minToSec(min){
        return min*60;
    }

    static getLabelMMSS(second){
        var minutes = GlobalFunctions.str_pad_left(Math.floor(second / 60),'0',2);
        var seconds = GlobalFunctions.str_pad_left(second - minutes * 60,'0',2);
        return {
            min:minutes,
            sec:seconds
        }
    }

    stop(){
        //clear timer if exists
        if(this.timer!==null) clearInterval(this.timer);
        this.timer = null;
        this.remainingTime = 0;//reset remainingTime to 0
    }

    update(newInterval){
        this.stop();
        this.interval = newInterval;
        this.remainingTime = Timer.minToSec(this.interval);
    }

    start(){
        if(this.interval==null) return;
        this.timer = setInterval(async ()=>{
            this.remainingTime = this.remainingTime>0 ? 
                this.remainingTime-1:Timer.minToSec(this.interval);
            // console.log(this.remainingTime);
        }, 1000);
    }

    getRemainingTime(){
        var remainingTime = Timer.getLabelMMSS(this.remainingTime);
        return `${remainingTime.min}:${remainingTime.sec}`;
    }
}

class Spawner {
    static type = {
        cardNormal:"cardNormal",
        act:"act",
        cardColor:"cardColor",
        cardSeries:"cardSeries",
        quiz:"quiz",
        numberGuess:"numberGuess",
        partyAct:Instance.PartyAct.type,
        soloBattle:Instance.SoloBattle.type,
    };

    // guildId = null;
    interval = null;//in minutes
    timer = null;//spawner timer
    timerCountdown;//countdown timer
    token = null;//spawn token
    type = null;
    spawn = null;//class of the spawned
    idRoleping = {
        cardcatcher:null
    }
    spawnChannel = null;//discord guild channel to send the spawn notif
    userAttempt = [];//list of all user who already used the spawn attempt
    message = null;//embed/message of spawn

    constructor(Spawner=null){
        this.timerCountdown = new Timer();
        if(Spawner!=null){
            for(var key in Spawner){
                this[key] = Spawner[key];
            }
        }
    }

    async randomizeSpawn(){
        //randomize new spawn token:
        var rndSpawnToken = GlobalFunctions.randomNumber(0,200).toString();
        this.token = rndSpawnToken;

        var rnd = GlobalFunctions.randomNumber(0,100);
        // rnd = 30;//only for testing
        var spawn;
        var embedSpawn;
        if(rnd<=15){//normal card spawn
            this.type = Spawner.type.cardNormal;
            spawn = new CardNormal(await CardNormal.getRandomCard());
            embedSpawn = spawn.getEmbedSpawn(this.token);
        } else if(rnd<=40){//activity
            this.type = Spawner.type.act;
            // spawn = await Act.randomSubtype(this.token);

            //randomize subtype
            var rnd = GlobalFunctions.randomNumber(1,3);
            // rnd=1;//only for testing
            if(rnd<=1){//jankenpon spawn
                spawn = new ActJankenpon(await ActJankenpon.getRandomCard());
                embedSpawn = spawn.getEmbedSpawn(this.token);
            } else if(rnd==2){//mini tsunagarus
                spawn = new ActMiniTsunagarus(await ActMiniTsunagarus.getRandomCard());
                embedSpawn = spawn.getEmbedSpawn(this.token);
            } else if(rnd==3){//series quiz
                var series = GlobalFunctions.randomArrayItem([
                    new Series("suite").value,
                    new Series("star_twinkle").value
                ]);
                
                var spawn = new ActSeries(await ActSeries.getRandomCard(series), series);
                embedSpawn = spawn.getEmbedSpawn(this.token);
            }
        } else if(rnd<=55){//color card
            this.type = Spawner.type.cardColor;
            spawn = new CardColor(await CardColor.getAllCardData());
            embedSpawn = spawn.getEmbedSpawn(this.token);
        } else if(rnd<=70){//quiz
            this.type = Spawner.type.quiz;
            spawn = new Quiz(await Quiz.getRandomCard());
            embedSpawn = spawn.getEmbedSpawn(this.token);
        } else if(rnd<=90){//number guess
            this.type = Spawner.type.numberGuess;
            spawn = new NumberGuess(await NumberGuess.getRandomCard());
            embedSpawn = spawn.getEmbedSpawn(this.token);
        } else {//party act instance
            this.type = Spawner.type.partyAct;

            let rnd = GlobalFunctions.randomPropertyKey(Instance.PartyAct.instanceType);
            let instance = new Instance.PartyAct();
            let instanceType = Instance.PartyAct.instanceType;
            switch(rnd){
                case instanceType.treasureHunt:{
                    instance.type = instanceType.treasureHunt;
                    embedSpawn = instance.getEmbedSpawn(this.token);
                    break;
                }
            }

            spawn = instance;
        }
        // else if(rnd==70){//solo battle instance
        //     // this.type = Spawner.type.
        //     this.type = Spawner.type.soloBattle;

        //     let rnd = GlobalFunctions.randomPropertyKey(Instance.SoloBattle.instanceType);
        //     let instance = new Instance.SoloBattle();
        //     let instanceType = Instance.SoloBattle.instanceType;
        //     switch(rnd){
        //         case instanceType.chokkins:{
        //             instance.type = instanceType.chokkins;
        //             embedSpawn = instance.getEmbedSpawn(this.token);
        //         }
        //     }

        //     spawn = instance;
        // }

        this.spawn = spawn;//set spawn

        //merge embedspawn with id roleping if provided
        if(this.idRoleping.cardcatcher!==null){
            embedSpawn = GlobalFunctions.mergeObjects(embedSpawn, {content:`<@&${this.idRoleping.cardcatcher}>`});
        }

        this.message = await this.spawnChannel.send(embedSpawn);
        // await this.stopTimer();//only for testing
        // console.log(this.timer);

        // return;

        this.userAttempt = [];//reset listed user attempt
        this.token = rndSpawnToken; //save spawner data to guild
        // guild.setSpawner(this);
    }

    //timer method
    //newInterval in minutes
    async updateTimer(newInterval){
        await this.stopTimer();//stop spawner timer
        this.interval = newInterval;
        this.timerCountdown.stop();//stop stopwatch timer
        this.timerCountdown.update(newInterval);
    }

    async stopTimer(){
        //clear timer if exists
        if(this.timer!==null) await clearInterval(this.timer);
        this.timer = null;
        this.timerCountdown.stop();
    }

    async startTimer(){
        if(this.interval==null) return;
        //start spawn timer
        this.timer = setInterval(async ()=>{
            this.randomizeSpawn();//randomize spawn
        }
        ,Timer.intervalMinToSec(this.interval));
        // , 10000);//for testing
        //start stopwatch timer
        this.timerCountdown.start();
    }

    static validationPeaceBoost(discordUser, userPeacePoint, cost, interaction){
        return userPeacePoint<cost?
            interaction.reply(Embed.errorMini(`:x: You need ${cost} peace point to use boost capture.`,discordUser,true)): true;

    }

    async messageCaptured(){
        if(this.message!=null) await this.message.delete();
    }

    hasActiveSpawn(){
        return this.spawn!==null? true: false;
    }

    getSpawnTypeName(){
        var type = {
            [Spawner.type.cardNormal]:`normal card spawn`,
            [Spawner.type.act]:"act",
            [Spawner.type.cardColor]:"color card",
            [Spawner.type.quiz]:"quiz",
            [Spawner.type.numberGuess]:"number guessing",
            [Spawner.type.partyAct]:"party act",
        };

        return type[this.type];
    }

}

class SpawnerListener extends Listener {
    Guild;
    spawner;
    customId=null;

    constructor(interaction){
        super(interaction);
        this.customId = interaction.customId;
        this.Guild = new Guild(Guild.getData(this.guildId));
        this.spawner = this.Guild.spawner;
    }

    validationSpawn(commandToken){
        if(this.spawner.type==null){
            return this.interaction.reply(Embed.errorMini(`:x: There are no active spawn right now.`,this.discordUser,true));
        } else if(this.spawner.userAttempt.includes(this.userId)){ //check if capture token same/not
            return this.interaction.reply(Embed.errorMini(`:x: You have already used the capture attempt. Please wait for next card spawn.`,this.discordUser,true));
        } else if(commandToken!=this.spawner.token){
            return this.interaction.reply(Embed.errorMini(`:x: This command is not valid for current spawn.`,this.discordUser,true));
        }

        return true;
    }

    async onClick(){
        var joiner = "_";

        //process command
        var type = this.customId.split(joiner).shift();
        var commandToken = this.customId.split(joiner).pop();
        var command = this.customId.split(joiner).slice(1, -1).join(joiner);
        
        //spawn validation
        if(this.validationSpawn(commandToken)!=true) return;

        switch(type){
            case Spawner.type.cardNormal: //normal card spawn
                switch(command){
                    case CardNormal.buttonId.catch_normal:{
                        await CardNormal.onCapture(this.discordUser, this.Guild, this.interaction, false);
                        break;
                    }
                    case CardNormal.buttonId.catch_boost:{
                        await CardNormal.onCapture(this.discordUser, this.Guild, this.interaction, true);
                        break;
                    }
                }
                break;
            case Spawner.type.act:
                switch(command){
                    case ActJankenpon.buttonId.jankenpon_rock:
                    case ActJankenpon.buttonId.jankenpon_paper:
                    case ActJankenpon.buttonId.jankenpon_scissors:
                        await ActJankenpon.onCapture(this.discordUser, this.Guild, 
                        command, this.interaction);
                    break;
                }
                break;
            case Spawner.type.cardColor:
                switch(command){
                    case CardColor.buttonId.catch_normal:
                        await CardColor.onCapture(this.discordUser, this.Guild, this.interaction, false);
                        break;
                    case CardColor.buttonId.catch_boost:
                        await CardColor.onCapture(this.discordUser, this.Guild, this.interaction, true);
                        break;
                }
                break;
            case Spawner.type.numberGuess:
                await NumberGuess.onCapture(this.discordUser, this.Guild, this.interaction, command);
                break;
            case Spawner.type.partyAct:
                switch(command){
                    case PartyAct.buttonId.commence:
                        await Instance.PartyAct.join(this.discordUser, this.Guild, this.interaction);
                        break;
                    default:
                        await Instance.PartyAct.eventListener(this.discordUser, this.Guild, command, this.interaction);
                        break;
                }
                break;
        }

        // console.log(Guild.getData(guildId));
    }

    async onSelect(){
        var joiner = "_";
        //process command
        var type = this.customId.split(joiner).shift();
        var commandToken = this.customId.split(joiner).pop();
        var value = this.interaction.values[0];

        //spawn validation
        if(this.validationSpawn(commandToken)!=true) return;
        switch(type){
            case Spawner.type.act:
                var command = this.customId.split(joiner).slice(1, -1).join(joiner);
                var subType = command;
                switch(subType){
                    case ActMiniTsunagarus.selectId:
                        await ActMiniTsunagarus.onCapture(this.discordUser, this.Guild, value, this.interaction);
                        break;
                    case ActSeries.selectId:
                        await ActSeries.onCapture(this.discordUser, this.Guild, value, this.interaction);
                        break;
                }
                break;
            case Spawner.type.quiz:
                await Quiz.onCapture(this.discordUser, this.Guild, value, this.interaction);
                break;
        }
    }

    async getTimer(){
        if(this.spawner.hasActiveSpawn()){
            return this.interaction.reply({embeds:[
                Embed.builder(
                    `[Jump to spawn link](${this.spawner.message.url})`, 
                    this.discordUser, {
                    title:`Spawner Info`,
                    fields:[
                        {
                            name:`❗Spawn type:`,
                            value:`${this.spawner.getSpawnTypeName()}`,
                            inline: true
                        },
                        {
                            name:`⏱️ Next spawn at:`,
                            value:`${this.spawner.timerCountdown.getRemainingTime()}`,
                            inline: true
                        },
                    ]
                })
            ], ephemeral: true});
        } else {
            return this.interaction.reply({embeds:[
                Embed.builder(`No active spawn are available.`, this.discordUser, {
                    title:`Spawner Info`,
                    fields:[
                        {
                            name:`⏱️ Next spawn at:`,
                            value:`${this.spawner.timerCountdown.getRemainingTime()}`
                        },
                    ]
                })
            ], ephemeral: true});
        }
    }

}

class Rewards {
    user;
    value = {color:0, series:0, mofucoin:0, boostColor:"", boostSeries:""};//base rewards

    constructor(userData=null){
        if(userData!=null){
            this.user = new User(userData);
        }
    }

    setValue(isSuccess){
        if(isSuccess){
            if(this.user.set_color==color){
                this.value.color*=2; this.value.boostColor = "⏫";
            }
            if(this.user.set_series==series) {
                this.value.series*=2; this.value.boostSeries = "⏫";
            }
        }
    }

}

class RewardsCard extends Rewards {
    card;
    value = {qty:0, color:0, series:0, mofucoin:0, boostColor:"", boostSeries:""};//base rewards

    constructor(userData=null, cardData=null){
        super(userData);
        if(cardData!=null){
            this.card = new Card(cardData);
            this.value.color = this.card.rarity;
            this.value.series = this.card.rarity;
        }
    }

    init(RewardsCard){
        for(var key in RewardsCard){
            this[key] = RewardsCard[key];
        }
    }

    setValue(isSuccess){
        var rarity = this.card.rarity;
        if(isSuccess){//success captured
            this.value.qty = 1;

            var color = this.card.color;
            var series = this.card.series;
            if(this.user.set_color==color){
                this.value.color*=2; this.value.boostColor = "⏫";
            }
            if(this.user.set_series==series) {
                this.value.series*=2; this.value.boostSeries = "⏫";
            }
            if(this.user.set_color==color && this.user.set_series==series) this.value.qty=2;
        } else {//fail
            this.value.color = rarity;
            this.value.series = rarity;
        }
    }

    notifEmbedNewCard(discordUser, updatedTotalPack, options = {notifFront:"",notifBack:"",rewards:""}){
        var arrPages = [];

        //discord user author:
        var userId = discordUser.id;
        var username = discordUser.username;
        var userAvatar = Embed.builderUser.getAvatarUrl(discordUser);

        //card data
        var id = this.card.id_card; var rarity = this.card.rarity;
        var character = this.card.Character; var name = this.card.name.toString();
        var img = this.card.img_url; var color = this.card.color;
        var series = this.card.Series;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifCard = `${Color[color].emoji_card} ${this.value.qty}x card: ${id} ${this.value.qty>1?" ⏫":""}`;//received card
        //color points:
        var notifColorPoints = `${User.Color.getEmoji(color)} ${this.value.color} ${color} points (${this.user.Color[color].point}/${User.Color.limit.point}) `;
        if(this.value.boostColor!="") notifColorPoints+=`${this.value.boostColor}`;

        //series points:
        var notifSeriesPoints = `${series.emoji.mascot} ${this.value.series} ${series.currency.name} (${this.user.Series[series.value]}/${User.Series.limit.point}) `;
        if(this.value.boostSeries!="") notifSeriesPoints+=`${this.value.boostSeries}`;

        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;
        var optRewards = `${"rewards" in options ? options.rewards:""}`;

        var author = Embed.builderUser.author(discordUser, `New ${capitalize(character.name)} Card!`, character.icon);

        arrPages[0] = Embed.builder(dedent(`${notifFront}${Properties.emoji.mofuheart} <@${userId}> has received new ${rarity}${Card.emoji.rarity(rarity)} ${capitalize(this.card.pack)} card!\n
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
            value:`${series.emoji.mascot} ${GlobalFunctions.capitalize(series.name)}`,
            inline:true
        }],
        image: img,
        footer: Embed.builderUser.footer(`Captured by: ${username} (${updatedTotalPack}/${this.card.packTotal})`, userAvatar)
        });

        //base stats:
        arrPages[1] = Embed.builder(dedent(`${notifFront}
        **Base Stats:**
        ${Card.emoji.hp} **HP:** ${this.card.hp_base}
        ${Card.emoji.sp} **Max SP:** ${this.card.maxSp}
        ${Card.emoji.atk} **Atk:** ${this.card.atk_base}`), 
        author, {
        color: Embed.color[color],
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
        footer: Embed.builderUser.footer(`Captured by: ${username} (${updatedTotalPack}/${this.card.packTotal})`, userAvatar)
        });

        return arrPages;
    }

    notifEmbedDuplicate(discordUser, updatedStock, options = {notifFront:"",notifBack:"",rewards:""}){
        //card data
        var userId = discordUser.id;

        var character = this.card.Character; var series = this.card.Series; 
        var name = this.card.name; var img = this.card.img_url; 
        var color = this.card.color;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifCard = `${this.card.getCardEmoji()} ${this.value.qty}x ${this.card.getIdCard()} ${this.card.getName(25)} ${this.value.qty>1?" ⏫":""}`;
        //color points:
        var notifColorPoints = `${this.card.getColorEmoji()} ${this.value.color} ${color} points (${this.user.getColorPoint(color)}/${User.Color.limit.point}) `;
        if(this.value.boostColor!="") notifColorPoints+=`${this.value.boostColor}`;

        //series points:
        var notifSeriesPoints = `${series.emoji.mascot} ${this.value.series} ${series.currency.name} (${this.user.getSeriesPoint(series.value)}/${User.Series.limit.point}) `;
        if(this.value.boostSeries!="") notifSeriesPoints+=` ${this.value.boostSeries}`;

        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;
        var optRewards = `${"rewards" in options ? options.rewards:""}`;

        return Embed.builder(`${notifFront}${Emoji.mofuheart} <@${userId}> has received another ${character.name} card${notifBack}`, discordUser, {
            color: color,
            title: `Duplicate Card`,
            thumbnail: img,
            fields:[
            {
                name:`__Rewards Received:__`,
                value:dedent(`${notifCard}
                ${notifColorPoints}
                ${notifSeriesPoints}${optRewards}`),
                inline:false
            }],
            footer: Embed.builderUser.footer(`Stock: ${updatedStock}/${CardInventory.limit.card}`)});
    }

    notifFailCatch(discordUser, options = {notifFront:"",notifBack:"",rewards:""}){
        //user data:
        var userId = discordUser.id;

        //card data
        var color = this.card.color; var series = this.card.Series;

        var colorPoint = this.value.color;
        var seriesPoint = this.value.series;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifColorPoints = `${User.Color.getEmoji(color)} ${colorPoint} ${color} points (${this.user.Color[color].point}/${User.Color.limit.point})`;
        var notifSeriesPoints = `${series.emoji.mascot} ${seriesPoint} ${series.currency.name} (${this.user.Series[series.value]}/${User.Series.limit.point})`;
        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;

        return Embed.failMini(`${notifFront}:x: <@${userId}> has failed to catch the card this time.${notifBack}`, 
        discordUser, false, {
            fields:[{
                name:`Received:`,
                value:dedent(`${notifColorPoints}
                ${notifSeriesPoints}`)
            }],
            footer:Embed.builderUser.footer(`❣️ Tips: Level up your color level of ${color} to increase your capture chance.`)
        });
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

    static peacePointCost = {
        1:1,
        2:2
    };
    
    card;

    constructor(cardData=null){
        this.card = cardData!=null ?
            new Card(cardData):null;
    }

    getEmbedSpawn(token){
        if(this.card!=null){
            // this.cardData = new Card(cardData);
            //init embed spawn
            let card = this.card;
            let id = card.id_card;
            let name = card.name;
            let color = card.color; 
            let series = card.Series;
            let character = card.Character;
            let rarity = card.rarity;

            var objEmbed = Embed.builder(`**Normal precure card has spawned!**`,
            Embed.builderUser.authorCustom(`${rarity}⭐ ${GlobalFunctions.capitalize(character.name)} Card`, character.icon),
            {
                color: Embed.color[color],
                title:`${name.toString()}`,
                fields: [
                    {
                        name:"Card Capture Command:",
                        value:`• Press **Catch!** to capture this card\n• Press 🆙 **Boost** to boost capture with ${CardNormal.peacePointCost[rarity]} ${User.peacePoint.emoji}`
                    }
                ],
                image: card.img_url,
                footer:Embed.builderUser.footer(`${series.name} Card (${id}) | ✔️ ${CardNormal.catchRate[rarity]}%`)
            });
            
            return ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
                DiscordStyles.Button.base(`card.${Spawner.type.cardNormal}_${CardNormal.buttonId.catch_normal}_${token}`,"Catch!","PRIMARY"),
                DiscordStyles.Button.base(`card.${Spawner.type.cardNormal}_${CardNormal.buttonId.catch_boost}_${token}`,"🆙 Boost","SUCCESS"),
            ])]});

            // this.spawnData = id;//set card id as spawnData
        }
    }

    init(CardNormal){
        for(var key in CardNormal){
            this[key] = CardNormal[key];
        }
    }

    //called to get random card during spawn
    static async getRandomCard(){
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(Card.columns.rarity,2);
        mapWhere.set(Card.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging

        var resultData = await DB.selectRandom(Card.tablename, mapWhere);
        return resultData[0];
    }

    capture(captureRateBonus){
        var rarity = this.card.rarity;
        var catchRate = CardNormal.catchRate[rarity]+captureRateBonus;
        var chance = GlobalFunctions.randomNumber(0, 100);
        if(chance<catchRate){
            return true;
        } else {
            return false;
        }
    }

    //button event listener
    static async onCapture(discordUser, guildData, interaction, isBoostCaptured){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        //process chance
        var spawn = new CardNormal();
        spawn.init(spawner.spawn);

        var card = spawn.card;
        var cardId = card.id_card;
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
            txtBoostCapture = `${User.peacePoint.emoji} Boost capture has been used!\n`;
        } else {
            var captureRateBonus = user.Color.getCardCaptureBonus(color);
            captured = spawn.capture(captureRateBonus);//check if captured/not
        }
        
        var rewardsCard = new RewardsCard(user, spawn.card);
        // captured = false;//only for testing
        rewardsCard.setValue(captured);//set value
        var rewards = rewardsCard.value;
        
        user.Color[color].point+= rewards.color;//update color points on user
        user.Series[series]+= rewards.series;//update series points on user
        await user.update();//update all data

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        if(captured){
            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);
            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);
                await spawner.messageCaptured();//remove spawned message
                guild.removeSpawn();//remove spawn if new
                return paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront:txtBoostCapture}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                return interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront:txtBoostCapture})
                ]});
            }
        } else {
            return interaction.reply(rewardsCard.notifFailCatch(discordUser));
        }
    }
}

class Act {
    static value = Spawner.type.act;
    static subtype = {
        jankenpon:"jankenpon",
        miniTsunagarus:"miniTsunagarus",
        series:"series",
    }

    cardData;

    constructor(cardData=null, token=null){//token will be used for command id
        if(cardData!=null){
            this.cardData = new Card(cardData);
            //init embed spawn
            let card = this.cardData;
            this.spawnData.cardId = card.id_card;
        }
    }

    getSpawnData(){
        return JSON.stringify(this.spawnData);
    }
}

//smile jankenpon
class ActJankenpon {
    static subType = Act.subtype.jankenpon;
    static series = SPack.smile.properties.value;
    static jankenponData = Object.freeze({
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
    })

    static results = Object.freeze({
        win:"win",
        draw:"draw",
        lose:"lose"
    })

    static rewardsPeacePoint = 1;

    static buttonId = Object.freeze({
        jankenpon_rock:"jankenpon_rock",
        jankenpon_paper:"jankenpon_paper",
        jankenpon_scissors:"jankenpon_scissors"
    });

    card;

    constructor(cardData=null){
        this.card = cardData!=null ?
        new Card(cardData):null;
    }

    init(ActJankenpon){
        for(var key in ActJankenpon){
            this[key] = ActJankenpon[key];
        }
    }

    getEmbedSpawn(token){
        return {embeds:[
            Embed.builder(`Let's play jankenpon with Peace!`,
            Embed.builderUser.authorCustom(`${this.card.rarity}⭐ Spawn Act: Smile Jankenpon`),
            {
                thumbnail:new Character("yayoi").icon,
                image:`https://cdn.discordapp.com/attachments/793415946738860072/936272483286413332/peace_jankenpon.gif`,
                title:`${this.card.Series.emoji.mascot} It's Jankenpon Time!`,
                fields:[
                    {
                        name:"Jankenpon Command:",
                        value:`• Press 🪨 to pick rock\n• Press 📜 to pick paper\n• Press ✂️ to pick scissors`
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
        mapWhere.set(Card.columns.rarity, 5);
        mapWhere.set(Card.columns.is_spawnable, 1);
        mapWhere.set(Card.columns.series, this.series);

        var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere);
        return resultData[0];
    }

    static async onCapture(discordUser, guildData, command, interaction){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;

        var spawn = new ActJankenpon();
        spawn.init(spawner.spawn);

        // var cardData = spawner.spawn.cardData;
        var card = spawn.card;
        var cardId = card.id_card;
        var color = card.color;
        var series = card.Series;

        //process jankenpon
        var arrEmbeds = []; var choice = command.split("_")[1];
        var rndJankenpon = GlobalFunctions.randomPropertyKey(ActJankenpon.jankenponData);
        // rndJankenpon = "rock";//only for testing
        if(ActJankenpon.jankenponData[rndJankenpon].choiceResults[choice]){//results: win
            var rewardsCard = new RewardsCard(user, spawn.card);
            rewardsCard.setValue(true);//set value
            var rewards = rewardsCard.value;

            //process points & peace points rewards
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.peace_point+= ActJankenpon.rewardsPeacePoint;//update peace points on user
            user.validation();
            // user.token_cardspawn = spawner.token;//update user spawn token
            spawner.userAttempt.push(userId);//add user attempt to spawner list

            var notifRewards = `\n${User.peacePoint.emoji} ${ActJankenpon.rewardsPeacePoint} peace point`;
            var embedWin = Embed.builder(
                `I picked ${ActJankenpon.jankenponData[rndJankenpon].icon} **${ActJankenpon.jankenponData[rndJankenpon].value}**! Yay yay yay! You win!`,
                discordUser,{
                    color:Embed.color.success,
                    title:"✅ You Win!",
                    thumbnail:ActJankenpon.jankenponData[rndJankenpon].img
                }
            );

            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);
            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, card.pack);
                await guild.spawner.messageCaptured();//remove spawned message
                guild.removeSpawn();//remove spawn if new
                await interaction.channel.send({embeds:[embedWin]});
                // await paginationEmbed(interaction, Embed.notifNewCard(discordUser, cardData, baseRewards, newTotal, {rewards:notifRewards}),
                // DiscordStyles.Button.pagingButtonList);

                await paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {rewards:notifRewards}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    embedWin,
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {rewards:notifRewards})
                ]});
            }
        } else if(ActJankenpon.jankenponData[rndJankenpon].value==choice){ //results: draw
            var rewardsCard = new RewardsCard(user, spawn.card);
            rewardsCard.setValue(false);//set value
            var rewards = rewardsCard.value;

            //process points & peace points rewards
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();

            var notifColorPoints = `${Color[color].emoji} ${rewards.color} ${color} points (${user.Color[color].point}/${User.Color.limit.point}) ${rewards.boostColor}`;
            var notifSeriesPoints = `${series.emoji.mascot} ${rewards.series} ${series.currency.name} (${user.Series[series.value]}/${User.Series.limit.point}) ${rewards.boostSeries}`;

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
            // guild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild
            arrEmbeds.push(Embed.builder(
                `I picked ${ActJankenpon.jankenponData[rndJankenpon].icon} **${ActJankenpon.jankenponData[rndJankenpon].value}**! Oh no, you lost.`,
                discordUser,{
                    color:Embed.color.danger,
                    title:"❌ You Lost",
                    thumbnail:ActJankenpon.jankenponData[rndJankenpon].img
                }
            ));
            await interaction.reply({embeds:arrEmbeds});
        }

        await user.update();//update user data
    }
}

//mini tsunagarus
class ActMiniTsunagarus {
    static subType = Act.subtype.miniTsunagarus;
    static selectId = Act.subtype.miniTsunagarus;
    static imgTsunagarus = "https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png"
    
    arrCardData = [];
    answer = null;

    constructor(arrCardData=null){
        if(arrCardData!=null){
            this.arrCardData = arrCardData;
        }
    }

    init(ActMiniTsunagarus){
        for(var key in ActMiniTsunagarus){
            this[key] = ActMiniTsunagarus[key];
        }
    }

    getEmbedSpawn(token){
        var card = new Card(this.arrCardData[0]);
        var rarity =card.rarity;
        var character = card.Character;

        var splittedText = character.fullname.split(" ");
        var shuffleName = "";
        var arrAnswerList = []; //prepare the answer list

        //randomize the answer text
        for(var i=0;i<splittedText.length;i++){
            shuffleName += `${GlobalFunctions.shuffleText(
                GlobalFunctions.shuffleText(
                    GlobalFunctions.shuffleText(splittedText[i])).replace(" ",""))}`.toLowerCase();
        }

        //push all the listed card
        for(var i=0;i<this.arrCardData.length;i++){
            let card = new Card(this.arrCardData[i]);
            let series = new Series(card.series).name;
            let character = card.Character;

            arrAnswerList.push(`${series} - ${capitalize(character.color)} Cure`);
            // this.spawnData.cardId.push(card.id_card);
        }

        var answer = arrAnswerList.indexOf(arrAnswerList[0]);
        
        var tempAnswer = arrAnswerList[0];
        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList); //shuffle the answer

        var answer = arrAnswerList.indexOf(tempAnswer);
        //get the answer
        switch(answer){
            case 0: this.answer = "a"; break;
            case 1: this.answer = "b"; break;
            case 2: this.answer = "c"; break;
            case 3: this.answer = "d"; break;
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

        var objEmbed = Embed.builder(`Chiridjirin has taking over the quiz time!\nRearrange this provided hint: **${shuffleName}** and choose the correct branch to defeat the tsunagarus!`,
        Embed.builderUser.authorCustom(`${rarity}⭐ Spawn: Quiztaccked Act`),
        {
            color:`#CC3060`,
            thumbnail:Properties.imgSet.mofu.panic,
            image:ActMiniTsunagarus.imgTsunagarus
        });

        return {embeds:[objEmbed],
            components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActMiniTsunagarus.selectId}_${token}`,"Select the answers",arrOptions)]}
    }

    static async getRandomCard(){
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

    static async onCapture(discordUser, guildData, value, interaction){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        //process chance
        var spawn = new ActMiniTsunagarus();
        spawn.init(spawner.spawn);

        var answer = spawn.answer;
        var isSuccess = value==answer? true:false;

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        // dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild

        //check for answer
        if(isSuccess){//success
            //randomize card rewards
            var rndCardData = GlobalFunctions.randomArrayItem(spawn.arrCardData);
            var card = new Card(rndCardData);//randomized card
            var cardId = card.id_card;
            var color = card.color;
            var series = card.Series;
            var pack = card.pack;

            //process user rewards
            var rewardsCard = new RewardsCard(user, card);
            rewardsCard.setValue(true);//set value
            var rewards = rewardsCard.value;
            
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();

            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);

            var txtNotifFront = `\n${Properties.emoji.mofuthumbsup} **Mini Tsunagarus Defeated!**\n Your answer was correct & it's successfully defeat the mini tsunagarus!\n\n`;

            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);//get new pack total
                await spawner.messageCaptured();
                guild.removeSpawn();//remove spawn if new
                await paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront: txtNotifFront}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront: txtNotifFront})
                ]});
            }
        } else {
            await interaction.reply({embeds:[
                Embed.builder(`:x: Chirichiri! You failed to defeat the tsunagarus this time.`,discordUser,{
                    color:`#CC3060`,
                    thumbnail: ActMiniTsunagarus.imgTsunagarus,
                    title:`Defeated!`
                })
            ]});
        }

        await user.update();//update all data
    }
}

class ActSeries {
    static subType = Act.subtype.series;
    static selectId = Act.subtype.series;
    static seriestype = {
        suiteNotesCount:"suiteNotesCount",
        starTwinkleConstellation:"starTwinkleConstellation",
        starTwinkleCounting:"starTwinkleCounting",
    }

    static imgSet = {
        starTwinkle: SPack.star_twinkle.imgSet
    }

    series;
    arrCardData = [];
    answer = null;
    baseRewards = {
        color:0,
        series:0
    }

    constructor(arrCardData=null, series= null){        
        if(arrCardData!=null){//init new
            this.series = new Series(series);
            this.arrCardData = arrCardData;
        }
    }

    setSpawnData(ActSeries){
        this.spawnData = ActSeries.spawnData;
        this.cardData = ActSeries.cardData;
    }

    init(ActSeries){
        for(var key in ActSeries){
            this[key] = ActSeries[key];
        }
    }

    getEmbedSpawn(token){
        var card = new Card(this.arrCardData[0]);
        var rarity = card.rarity;

        switch(this.series.value){
            case new Series("suite").value:
                //suite notes counting
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
                var total = objNotes[0].value;//init first note number
                this.baseRewards = {
                    color: GlobalFunctions.randomNumber(total, total+20),
                    series: GlobalFunctions.randomNumber(total, total+10)
                }

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

                var arrAnswerList = GlobalFunctions.shuffleArray([total,
                    GlobalFunctions.randomNumber(total-3,total-4),
                    GlobalFunctions.randomNumber(total-1,total-2),
                    GlobalFunctions.randomNumber(total+1,total+2)]);

                switch(arrAnswerList.indexOf(total)){
                    case 0: this.answer = "a"; break;
                    case 1: this.answer = "b"; break;
                    case 2: this.answer = "c"; break;
                    case 3: this.answer = "d"; break;
                    case 4: this.answer = "e"; break;
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
                Embed.builderUser.authorCustom(`${rarity}⭐ Spawn: Suite Notes Counting Act`),{
                    title:`${this.series.emoji.mascot} It's Suite Notes Counting Time!`,
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
                        value:emojify(txtField)
                    }]
                });

                return {embeds:[objEmbed],
                    components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActSeries.selectId}_${token}`,
                    "Select the answers",arrOptions)]};
            break;
            case new Series("star_twinkle").value: //star twinkle series
                var subtype = GlobalFunctions.randomArrayItem([
                    ActSeries.seriestype.starTwinkleConstellation,
                    ActSeries.seriestype.starTwinkleCounting
                ]);
                switch(subtype){
                    case ActSeries.seriestype.starTwinkleConstellation://star twinkle constellation
                        var fuwaConstellation = SPack.star_twinkle.Spawner.fuwaConstellation;
                        var randObj = GlobalFunctions.randomProperty(fuwaConstellation);
                        var answer = randObj.name; var randomImg = randObj.img_url[0];
                        var arrAnswerList = [];
                        arrAnswerList.push(randObj.name);

                        this.baseRewards = { //set base rewards
                            color: 12,
                            series: 12
                        }

                        for(var i=0;i<=2;i++){
                            var tempAnswer = GlobalFunctions.randomProperty(fuwaConstellation);
                            arrAnswerList.includes(tempAnswer.name) ?
                                i-=1 : arrAnswerList.push(tempAnswer.name);
                        }
        
                        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                        arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                        answer = arrAnswerList.indexOf(answer);
                        switch(answer){
                            case 0: this.answer = "a"; break;
                            case 1: this.answer = "b"; break;
                            case 2: this.answer = "c"; break;
                            case 3: this.answer = "d"; break;
                            case 4: this.answer = "e"; break;
                        }

                        //select menu start
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

                        var objEmbed = Embed.builder(`Guess the correct fuwa constellation from this costume:`,
                        Embed.builderUser.authorCustom(`${rarity}⭐ Spawn: Star Twinkle Constellation Act`),{
                            title:`${this.series.emoji.mascot} It's Star Twinkle Constellation Time!`,
                            thumbnail:ActSeries.imgSet.starTwinkle.gibberishFuwa,
                            image:randomImg
                        });

                        //set embed
                        return {embeds:[objEmbed],
                        components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActSeries.selectId}_${token}`,
                        "Choose the answers",arrOptions)]};
                        break;
                    case ActSeries.seriestype.starTwinkleCounting://star twinkle counting
                        var txtStar = "";
                        var arrStars = [`0`,`1`];
                        var targetStar = GlobalFunctions.randomArrayItem(arrStars);
                        for(var i=0;i<5;i++){
                            var twinkleRandom = GlobalFunctions.randomNumber(2,10);
                            for(var j=0; j<twinkleRandom; j++){
                                txtStar += GlobalFunctions.randomArrayItem(arrStars);
                            }
                            txtStar += `\n`;
                        }
                        
                        var totalStars = txtStar.split("").filter(txt => txt.includes(targetStar)).length;
                        targetStar = targetStar.replaceAll("0","⭐").replaceAll("1","🌟");
                        txtStar = txtStar.replaceAll("0","⭐").replaceAll("1","🌟");
                        this.baseRewards = { //set base rewards
                            color: GlobalFunctions.randomNumber(totalStars, totalStars+12),
                            series: GlobalFunctions.randomNumber(totalStars, totalStars+12)
                        }
        
                        var arrAnswerList = [totalStars,totalStars+1,totalStars+2,totalStars+3];
                        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
        
                        switch(arrAnswerList.indexOf(totalStars)){
                            case 0: this.answer = "a"; break;
                            case 1: this.answer = "b"; break;
                            case 2: this.answer = "c"; break;
                            case 3: this.answer = "d"; break;
                        }
        
                        var arrOptions = [];
                        for(var i=0;i<arrAnswerList.length;i++){
                            arrOptions.push({
                                label: `${arrAnswerList[i].toString()} ${targetStar}`,
                                description: `Answers with ${arrAnswerList[i]} ${targetStar}`
                            });
                            switch(i){
                                case 0: arrOptions[i].value = "a"; break;
                                case 1: arrOptions[i].value = "b"; break;
                                case 2: arrOptions[i].value = "c"; break;
                                case 3: arrOptions[i].value = "d"; break;
                            }
                        }

                        var objEmbed = Embed.builder(`How many ${targetStar} stars on this spawn?\n\n${txtStar}`,
                        Embed.builderUser.authorCustom(`${rarity}⭐ Spawn: Star Twinkle Counting Act`),{
                            title:`${this.series.emoji.mascot} It's Star Twinkle Counting Time!`,
                            thumbnail:ActSeries.imgSet.starTwinkle.gibberishFuwa,
                            image:`https://static.wikia.nocookie.net/prettycure/images/5/51/STPC01_The_Fuwa_Constellation.jpg`
                        });

                        return {embeds:[objEmbed],
                            components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.act}_${ActSeries.selectId}_${token}`,
                            "Choose the answers",arrOptions)]};
                        break;
                }
                
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

    static async onCapture(discordUser, guildData, value, interaction){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        var spawn = new ActSeries();
        spawn.init(spawner.spawn);

        //process answer
        var answer = spawn.answer;
        var isSuccess = value==answer? true:false;

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        // dataGuild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild

        //check for answer
        if(isSuccess){//success
            //randomize card rewards
            var rndCardData = GlobalFunctions.randomArrayItem(spawn.arrCardData);
            var card = new Card(rndCardData);//randomized card
            var cardId = card.id_card;
            var color = card.color;
            var series = card.Series;
            var pack = card.pack;

            //process user rewards
            var rewardsCard = new RewardsCard(user, card);
            //modify base rewards:
            rewardsCard.value.color = spawn.baseRewards.color;
            rewardsCard.value.series = spawn.baseRewards.series;
            rewardsCard.setValue(true);//set value

            var rewards = rewardsCard.value;
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();

            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);

            var txtNotifFront = `\n${Properties.emoji.mofuthumbsup} **Correct Answer!**\n Your answer was correct ~mofu!\n\n`;
            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);//get new pack total
                await spawner.messageCaptured();
                guild.removeSpawn();//remove spawn if new

                await paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront: txtNotifFront}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront: txtNotifFront})
                ]});
            }
        } else {
            await interaction.reply(Embed.failMini(`:x: Sorry, your answer was wrong ~mofu!`,discordUser, false, {
                title:`Wrong Answer`
            }));
        }

        await user.update();//update all data
    }
    
}

class CardColor {
    static value = Spawner.type.cardColor;
    static buttonId = Object.freeze({
        catch_normal:"catch_normal",
        catch_boost:"catch_boost"
    });

    static catchRate = {
        4:30,
        5:20
    }

    static bonusCatchRate = {
        4:40,
        5:35
    }

    static peacePointCost = {
        4:4,
        5:5
    };

    rarity = null;
    colorBonus = null;
    arrCardData={//contains randomized/set card data
        pink:[],
        blue:[],
        yellow:[],
        purple:[],
        red:[],
        green:[],
        white:[],
    };
    
    embedSpawn = null;

    constructor(arrCardData=null){
        if(arrCardData!=null){
            this.colorBonus = GlobalFunctions.randomArrayItem([
                Color.pink.value,
                Color.blue.value,
                Color.yellow.value,
                Color.purple.value,
                Color.red.value,
                Color.green.value,
                Color.white.value,
            ]);

            for(var i=0;i<arrCardData.length;i++){
                var color = arrCardData[i][Card.columns.color];
                this.arrCardData[color].push(arrCardData[i]);
            }
            
            this.rarity = arrCardData[0][DBM_Card_Data.columns.rarity];//get first card data to be saved for rarity
        }
    }

    init(CardColor){
        for(var key in CardColor){
            this[key] = CardColor[key];
        }
    }

    getEmbedSpawn(token){
        var objEmbed = Embed.builder(`Capture it to get color card based from your assigned color zone.`,
        Embed.builderUser.authorCustom(`${this.rarity}⭐ Color Card Spawn`),{
            image:Properties.imgSet.mofu.peek,
            color:`${Color[this.colorBonus].embed_color}`,
            title:`A color card has spawned!`,
            fields: [
                {
                    name:"⏫ Color assign bonus effect:",
                    value:`${Color[this.colorBonus].emoji} ${this.colorBonus} set increase chance into ${CardColor.bonusCatchRate[this.rarity]}%`
                },
                {
                    name:"Card Capture Command:",
                    value:`• Press **Catch!** to capture this color card\n• Press 🆙 **Boost** to boost capture with ${CardColor.peacePointCost[this.rarity]} ${User.peacePoint.emoji}`
                }
            ],
            footer:Embed.builderUser.footer(`✔️ Base Catch Rate: ${CardColor.catchRate[this.rarity]}%`)
        });

        return ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(`card.${Spawner.type.cardColor}_${CardColor.buttonId.catch_normal}_${token}`,"Catch!","PRIMARY"),
            DiscordStyles.Button.base(`card.${Spawner.type.cardColor}_${CardColor.buttonId.catch_boost}_${token}`,"🆙 Boost","SUCCESS"),
        ])]});
    }

    static async getAllCardData(rarity = GlobalFunctions.randomNumber(4,5)){
        var query = `SELECT * 
        FROM ${Card.tablename}  
        WHERE ${Card.columns.is_spawnable}=? AND ${Card.columns.rarity}=?  
        ORDER BY ${Card.columns.color} ASC`;
        var cardData = await DBConn.conn.query(query, [1, rarity]);
        return cardData;
    }

    capture(userColor, captureRateBonus){
        var catchRate = CardColor.catchRate[this.rarity];
        if(userColor==this.colorBonus){
            catchRate = CardColor.bonusCatchRate[this.rarity];
        }

        catchRate+=captureRateBonus;
        var chance = GlobalFunctions.randomNumber(0, 100);
        return chance<catchRate ? true: false;
    }

    static async onCapture(discordUser, guildData, interaction, isBoostCaptured){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        var spawn = new CardColor();
        spawn.init(spawner.spawn);

        var cardData = GlobalFunctions.randomArrayItem(spawn.arrCardData[user.set_color]);//randomize card data from color set
        var card = new Card(cardData);
        var cardId = card.id_card;
        var color = card.color;
        var pack = card.pack;
        var series = card.Series;

        var captured = false;
        var txtBoostCapture = "";
        if(isBoostCaptured){
            var cost = CardColor.peacePointCost[spawn.rarity];//cost of peace point
            if(Spawner.validationPeaceBoost(discordUser, user.peace_point, cost, interaction)!=true) return;
            captured = true;
            user.peace_point-=cost;//update peace point
            txtBoostCapture = `${User.peacePoint.emoji} Boost capture has been used!\n`;
        } else {
            var captureRateBonus = user.Color.getCardCaptureBonus(user.set_color);
            captured = spawn.capture(user.set_color, captureRateBonus);
        }

        var rewardsCard = new RewardsCard(user, card);
        rewardsCard.setValue(captured);//set value
        var rewards = rewardsCard.value;
        
        user.Color[color].point+= rewards.color;//update color points on user
        user.Series[series.value]+= rewards.series;//update series points on user
        user.validation();//validate all points
        await user.update();//update all data

        spawner.userAttempt.push(userId);//add user attempt to spawner list

        if(captured){
            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);
            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);
                await spawner.messageCaptured();//remove spawned message
                guild.removeSpawn();//remove spawn if new
                return paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront:txtBoostCapture}),
                DiscordStyles.Button.pagingButtonList);
            } else {
                return interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront:txtBoostCapture})
                ]});
            }
        } else {
            return interaction.reply(rewardsCard.notifFailCatch(discordUser));
        }
    }
}

class Quiz {
    static value = Spawner.type.quiz;
    static selectId = Spawner.type.quiz;

    answer = null;
    arrCardData = [];

    constructor(arrCardData=null){
        if(arrCardData!=null){
            this.arrCardData = arrCardData;
        }
    }

    init(Quiz){
        for(var key in Quiz){
            this[key] = Quiz[key];
        }
    }

    getEmbedSpawn(token){
        var card = new Card(this.arrCardData[0]);//get original character
        var rarity = card.rarity;
        var character = card.Character;
        var series = card.Series;
        
        var arrAnswerList = []; //prepare the answer list
        for(var i=0;i<this.arrCardData.length;i++){
            let card = new Card(this.arrCardData[i]);
            arrAnswerList.push(card.pack);
        }

        //shuffle the answer
        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
        //get the answer
        // var answer = arrAnswerList.indexOf(pack);
        switch(arrAnswerList.indexOf(card.pack)){
            case 0: this.answer = "a"; break;
            case 1: this.answer = "b"; break;
            case 2: this.answer = "c"; break;
            case 3: this.answer = "d"; break;
        }

        //select menu start
        var arrOptions = [];
        for(var i=0;i<arrAnswerList.length;i++){
            let character = new Character(arrAnswerList[i]);
            let series = new Series(character.series);
            arrOptions.push({
                label: `${character.fullname} (${series.name})`,
                description: `Answer with: ${character.fullname}`
            });
            switch(i){
                case 0: arrOptions[i].value = "a"; break;
                case 1: arrOptions[i].value = "b"; break;
                case 2: arrOptions[i].value = "c"; break;
                case 3: arrOptions[i].value = "d"; break;
            }
        }

        //select menu end

        var objEmbed = Embed.builder(`The series theme/motif was about: **${series.theme}** and I'm known as **${character.alter_ego}**. Who am I?`,
        Embed.builderUser.authorCustom(`${rarity}⭐ Precure Quiz`),
        {
            image:Properties.imgSet.mofu.peek,
            title:`❔ It's Quiz Time!`
        });

        return {embeds:[objEmbed],
            components: [DiscordStyles.SelectMenus.basic(`card.${Spawner.type.quiz}_${Quiz.selectId}_${token}`,"Select the answers",arrOptions)]}
    }

    static async getRandomCard(){
        var mapWhere = new Map();
        mapWhere.set(Card.columns.rarity, 3);
        mapWhere.set(Card.columns.is_spawnable, 1);

        var arrCardData = [];
        var resultData = await DB.selectRandomNonDuplicate(Card.tablename, mapWhere, Card.columns.pack, 4);
        for(var i=0;i<resultData.length;i++){
            arrCardData.push(resultData[i]);
        }
        return arrCardData;
    }

    static async onCapture(discordUser, guildData, value, interaction){
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        var spawn = new Quiz();
        spawn.init(spawner.spawn);

        //process answer
        var answer = spawn.answer;
        var isSuccess = value==answer? true:false;

        spawner.userAttempt.push(userId);//add user attempt to spawner list
        // guild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild

        //check for answer
        if(isSuccess){//success
            //randomize card rewards
            var rndCardData = GlobalFunctions.randomArrayItem(spawn.arrCardData);
            var card = new Card(rndCardData);//randomized card
            var cardId = card.id_card;
            var color = card.color;
            var series = card.Series;
            var pack = card.pack;

            //process user rewards
            var rewardsCard = new RewardsCard(user, card);
            rewardsCard.setValue(true);//set value
            var rewards = rewardsCard.value;
            
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();

            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);

            var txtNotifFront = `\n${Properties.emoji.mofuthumbsup} **Correct Answer!**\n You guessed the answer correctly ~mofu!\n\n`;

            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);//get new pack total
                await spawner.messageCaptured();
                guild.removeSpawn();//remove spawn if new
                await paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront: txtNotifFront}), 
                DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront: txtNotifFront})
                ]});
            }
        } else {
            await interaction.reply(Embed.failMini(`:x: Sorry, that's not the correct answer ~mofu!`,discordUser, false, {
                title:`Wrong Answer!`
            }));
        }

        await user.update();//update all data
    }
}

class NumberGuess {
    static value = Spawner.type.numberGuess;
    static buttonId = Object.freeze({
        lower:"lower",
        higher:"higher",
        boost:"boost"
    });

    static results = Object.freeze({
        same:"same"
    });

    static peacePointCost = {
        3:3,
        4:4
    };

    rndNumber = null;
    card;

    constructor(cardData=null){
        if(cardData!=null){
            this.card = new Card(cardData);
            this.rndNumber = GlobalFunctions.randomNumber(2, 11);
        }
    }

    init(NumberGuess){
        for(var key in NumberGuess){
            this[key] = NumberGuess[key];
        }
    }

    getEmbedSpawn(token){
        //init embed spawn
        let color = this.card.color;
        let rarity = this.card.rarity
        
        var objEmbed = Embed.builder(`Guess whether the hidden number **(1-12)** will be **lower** or **higher** than the current number: **${this.rndNumber}**`,
        Embed.builderUser.authorCustom(`${rarity}⭐ Number Spawn: ${GlobalFunctions.capitalize(color)} Edition`),
        {
            color: Embed.color[color],
            title:`:game_die: It's Lucky Number Time!`,
            image:Properties.imgSet.mofu.peek,
            fields: [
                {
                    name:"Number Guess Command:",
                    value:`• Press **Lower/Higher** to guess the hidden number\n• Press 🆙 **Boost** to boost capture with ${NumberGuess.peacePointCost[rarity]} ${User.peacePoint.emoji}`
                }
            ],
        });

        return {embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(`card.${Spawner.type.numberGuess}_${NumberGuess.buttonId.lower}_${token}`,"▼ Lower","PRIMARY"),
            DiscordStyles.Button.base(`card.${Spawner.type.numberGuess}_${NumberGuess.buttonId.higher}_${token}`,"▲ Higher","PRIMARY"),
            DiscordStyles.Button.base(`card.${Spawner.type.numberGuess}_${NumberGuess.buttonId.boost}_${token}`,"🆙 Boost","SUCCESS"),
        ])]};
    }

    guess(choice, hiddenNumber){
        if((choice==NumberGuess.buttonId.lower && hiddenNumber<this.rndNumber)||
        (choice==NumberGuess.buttonId.higher && hiddenNumber>this.rndNumber)){
            return true;
        } else if(hiddenNumber==this.rndNumber){
            return NumberGuess.results.same;
        } else {
            return false;
        }
    }

    static async getRandomCard(){
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(Card.columns.rarity, GlobalFunctions.randomNumber(3, 4));
        mapWhere.set(Card.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging

        var resultData = await DB.selectRandom(Card.tablename, mapWhere);
        return resultData[0];
    }

    static async onCapture(discordUser, guildData, interaction, command){
        //check for boost capture:
        var isBoostCaptured = command==NumberGuess.buttonId.boost ?
            true : false;
        
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        var guild = new Guild(guildData); //get spawnerdata from guild
        var spawner = guild.spawner;
        
        //process chance
        var spawn = new NumberGuess();
        spawn.init(spawner.spawn);

        // console.log(isBoostCaptured);
        // return;
        
        var card = spawn.card;
        var cardId = card.id_card;
        var color = card.color;
        var pack = card.pack;
        var series = card.Series;
        
        var results;
        var txtNotifFront = "";
        if(isBoostCaptured){
            var cost = NumberGuess.peacePointCost[card.rarity];//cost of peace point
            if(Spawner.validationPeaceBoost(discordUser, user.peace_point, cost, interaction)!=true) return;
            results = true;
            user.peace_point-=cost;//update peace point
            txtNotifFront = `${User.peacePoint.emoji} Boost capture has been used!\n`;
        } else {
            var hiddenNumber = GlobalFunctions.randomNumber(1, 12);
            results = spawn.guess(command, hiddenNumber);//check if captured/not
        }

        if(results==true){//correct
            spawner.userAttempt.push(userId);//add user attempt to spawner list

            var rewardsCard = new RewardsCard(user, spawn.card);
            rewardsCard.setValue(true);//set value
            var rewards = rewardsCard.value;

            //process points & peace points rewards
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();
            
            var stock = await CardInventory.updateStock(userId, cardId, rewards.qty, true);
            if(isBoostCaptured==false){
                txtNotifFront+= `\n${Properties.emoji.mofuthumbsup} **Nice Guess!**\nThe next hidden number was **${hiddenNumber}** and you guessed it: **${command}**\n\n`;
            }

            if(stock<=-1){
                var newTotal = await CardInventory.getPackTotal(userId, pack);
                await spawner.messageCaptured();
                guild.removeSpawn();//remove spawn if new
                await paginationEmbed(interaction, rewardsCard.notifEmbedNewCard(discordUser, newTotal, {notifFront:txtNotifFront}),DiscordStyles.Button.pagingButtonList);
            } else {
                await interaction.reply({embeds:[
                    rewardsCard.notifEmbedDuplicate(discordUser, stock, {notifFront:txtNotifFront})
                ]});
            }
        } else if(results==NumberGuess.results.same){//same numbers
            var rewardsCard = new RewardsCard(user, spawn.card);
            rewardsCard.setValue(false);//set value
            var rewards = rewardsCard.value;

            //process points & peace points rewards
            user.Color[color].point+= rewards.color;//update color points on user
            user.Series[series.value]+= rewards.series;//update series points on user
            user.validation();

            var notifColorPoints = `${Color[color].emoji} ${rewards.color} ${color} points (${user.Color[color].point}/${User.Color.limit.point}) ${rewards.boostColor}`;
            var notifSeriesPoints = `${series.emoji.mascot} ${rewards.series} ${series.currency.name} (${user.Series[series.value]}/${User.Series.limit.point}) ${rewards.boostSeries}`;

            await interaction.reply({embeds:[
                Embed.builder(`The next hidden number was **${hiddenNumber}** and you guessed it: **${command}**\nIt's a draw!\nYou have another chance to use the number guess command.`,discordUser,
                {
                    title:"🔁 Once More!",
                    thumbnail:Properties.imgSet.mofu.ok,
                    fields:[{
                        name:`Received:`,
                        value:dedent(`${notifColorPoints}
                        ${notifSeriesPoints}`)
                    }]
                }
            )
            ]});
        } else {//results: lose
            // user.token_cardspawn = spawner.token;//update user spawn token
            spawner.userAttempt.push(userId);//add user attempt to spawner list
            // guild.setSpawner(spawner.type, spawner.spawnData, spawner, spawner.token);//save latest spawner data to guild
            await interaction.reply({embeds:[
                Embed.builder(
                    `The next hidden number was **${hiddenNumber}** and you guessed it: **${command}**`,
                    discordUser,{
                        color:Embed.color.danger,
                        title:"❌ Wrong guess",
                        thumbnail:Properties.imgSet.mofu.error
                    }
                )]
            });
        }
        
        await user.update();//update all data
    }
    
}

// class CardSeries {
//     static value = Spawner.type.cardSeries;
//     static buttonId = Object.freeze({
//         catch_normal:"catch_normal",
//         catch_boost:"catch_boost"
//     });

//     static catchRate = {
//         4:50,
//         5:30
//     }

//     static bonusCatchRate = {
//         4:60,
//         5:50
//     }

//     static peacePointCost = {
//         4:4,
//         5:5
//     };

//     spawnData = {
//         rarity: null,
//         seriesBonus: null
//     };//to be saved for db

//     cardData={//contains randomized/set card data
//         max_heart:[],
//         splash_star:[],
//         yes5gogo:[],
//         fresh:[],
//         heartcatch:[],
//         suite:[],
//         smile:[],
//         dokidoki:[],
//         happiness_charge:[],
//         go_princess:[],
//         mahou_tsukai:[],
//         kirakira:[],
//         hugtto:[],
//         star_twinkle:[],
//         healin_good:[],
//     };
    
//     embedSpawn = null;

//     static async getAllCardData(rarity = GlobalFunctions.randomNumber(4,5)){
//         var query = `SELECT * 
//         FROM ${DataCard.tablename}  
//         WHERE ${DataCard.columns.is_spawnable}=? AND ${DataCard.columns.rarity}=?  
//         ORDER BY ${DataCard.columns.series} ASC`;
//         var cardData = await DBConn.conn.query(query, [1, rarity]);
//         return cardData;
//     }
// }

module.exports = { Spawner, SpawnerListener: SpawnerListener, Instance };
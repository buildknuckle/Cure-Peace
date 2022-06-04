const dedent = require("dedent-js");
const paginationEmbed = require('../../../modules/DiscordPagination');
const GlobalFunctions = require('../../GlobalFunctions');
const emojify = GlobalFunctions.emojify;
const capitalize = GlobalFunctions.capitalize;
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require("../../DiscordStyles");
const Guild = require('./Guild');
const DataCard = require('./Card');
const DataCardInventory = require('./CardInventory');
const DataUser = require('./User');
const {Series, SPack} = require('./Series');
const {Character, CPack} = require('./Character');
const {AvatarFormation, PrecureAvatar} = require('./Avatar');
const Properties = require("../Properties");
const {Party} = require('./Party');
const {Enemy, Tsunagarus, Monster} = require('./Enemy');
const {Shikishi, ShikishiInventory} = require('./Shikishi');
const User = require("./User");
const Color = Properties.color;
const Emoji = Properties.emoji;

class Embed extends require("../Embed") {
    static validationNotInParty(discordUser){
        return Embed.errorMini(`Cannot use this command while not in party.`, discordUser, true, {
            title:":x: Not in party"
        });
    }

    static validationNotEnoughMembers(discordUser, minTotal){
        return Embed.errorMini(`${minTotal} party members are required for this spawn instance.`, discordUser, true, {
            title:":x: Not enough party members"
        });
    }

    static validationAlreadyJoined(discordUser){
        return Embed.errorMini(`Your party can only commence this spawn instance once.`, discordUser, true, {
            title:":x: Cannot commence another instance"
        });
    }

    static validationWrongInstance(discordUser){
        return Embed.errorMini(`This command is not valid for your instance.`, discordUser, true, {
            title:":x: Wrong instance"
        });
    }
}

class PartyAct {
    static type = "instancePartyAct";
    static buttonId = Object.freeze({
        commence:"commence",
    });
    static instanceType = {
        treasureHunt: "treasureHunt"
    }
    type = null;
    // spawnClass = null;//will be used on join. Called with: new instanceType();
    instance = {};//contains party instance data

    constructor(instanceData=null){
        if(instanceData!=null){
            for(var key in instanceData){
                this[key] = instanceData[key];
            }
        }
    }

    //used to get instance by party id
    getInstance(partyid){
        return this.instance[partyid];
    }

    //used to get spawn embed
    getEmbedSpawn(token){
        switch(this.type){
            case PartyAct.instanceType.treasureHunt:{
                return TreasureHunt.getEmbedSpawn(token);
                break;
            }
        }
        
    }

    async updateInstance(partyId, newInstanceData){
        this.instance[partyId] = newInstanceData;
    }

    static async join(discordUser, guildData, interaction){
        await interaction.deferReply({ephemeral:true});

        var userId = discordUser.id;
        var guild = new Guild(guildData);
        var spawner = guild.spawner;
        var partyData = await Party.getData(guild.id_guild, userId);
        //validation: if user in party/not
        if(partyData==null) return interaction.editReply(Embed.validationNotInParty(discordUser));
        var party = new Party(partyData);
        if(party.isLeaderHaveAvatar()==false) return interaction.editReply(
            Embed.errorMini(`Your party leader need to set main precure avatar`, discordUser, true, {
                title:`:x: Missing leader avatar`
            })
        );
        if(party.getTotalMember()<=0) return interaction.editReply(Embed.validationNotEnoughMembers(discordUser, 1));


        //validation: if party already joined
        var spawn = new PartyAct(spawner.spawn);
        
        //validation if user already in party/not
        if(party.id in spawn.instance){ 
            return interaction.editReply(Embed.validationAlreadyJoined(discordUser));
        } else {
            switch(spawn.type){
                case this.instanceType.treasureHunt://treasure hunt
                    var treasureHunt = new TreasureHunt();
                    treasureHunt.commence(partyData);
                    treasureHunt.embed = await spawner.spawnChannel.send(
                        treasureHunt.getEmbedCommence(spawner.token)
                    );
                    spawn.instance[party.id] = treasureHunt;
                    break;
            }
            
        }

        await interaction.editReply("⠀");
    }

    static async eventListener(discordUser, guildData, _command, interaction){
        var userId = discordUser.id;
        var spawnType = _command.split("_")[0];
        var command = _command.split("_")[1];
        var commandPartyId = _command.split("_")[2];

        var guild = new Guild(guildData);
        var partyData = await Party.getData(guild.id_guild, userId);
        //validation: if user in party/not
        if(partyData==null) return interaction.reply(Embed.validationNotInParty(discordUser));

        var party = new Party(partyData);
        //validation: check for correct party id instance
        if(party.id!=commandPartyId) return interaction.reply(Embed.validationWrongInstance(discordUser));

        switch(spawnType){
            case TreasureHunt.type:
                await TreasureHunt.onGuess(discordUser, guildData, party.id, command, interaction);
            break;
        }
    }

}

class TreasureHunt {
    static type = PartyAct.instanceType.treasureHunt;
    static buttonId = Object.freeze({
        lower:"lower",
        higher:"higher",
        collect:"collect",
    });
    static stage = {//contains max randomizer
        1:{max:100, current: [10,20,80,90]},
        2:{max:70, current: [10,20,50,60]},
        3:{max:60, current: [15,20,25,30,35,40,45]},
        4:{max:50, current: [10,13,15,40,43,45]},
        5:{max:30, current: [7,10,15,20,23]},
        // 6:{max:20, current: [5,6,10,14,15]},
        // 7:{max:18, current: [6,7,9,11,12]},
        // 8:{max:12, current: [4,6,8]},
        // 9:{max:10, current: [5]},
        // 10:{max:8, current: [4]},
        // 11:8,
        // 12:8,
        // 13:6,
        // 14:6,
        // 15:4,
        // 16:4,
        // 17:4,
    }
    static maxStage = Object.keys(this.stage).length;
    static rewardShikishiData = [];//data will be loaded from init

    party;//contains party data
    reward = { //base reward
        jewel: 1,
        mofucoin: 5,
        shikishiData:null//reward for shikishi
    }
    
    stage = 1;
    currentNumber;
    embed = null;

    constructor(partyInstanceData=null){
        this.party = new Party();
        if(partyInstanceData!=null){
            // console.log(partyInstanceData);
            for(var key in partyInstanceData){
                this[key] = partyInstanceData[key];
            }
        }
    }

    static getEmbedSpawn(token){
        var objEmbed = Embed.builder(`${Properties.emoji.mofuheart} Party up and search for hidden treasure!`,
        Embed.builderUser.authorCustom(`Treasure Hunt Spawn`),
        {
            title:`It's Treasure Hunting Time!`,
            image:Properties.imgSet.mofu.peek,
            
        });

        return {embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(`card.${PartyAct.type}_${PartyAct.buttonId.commence}_${token}`,"Commence","PRIMARY"),
        ])]};
    }

    commence(partyData){
        var party = new Party(partyData);
        this.party = party;

        //init shikishi reward
        // console.log(this);
        this.reward.shikishiData = GlobalFunctions.randomProperty(TreasureHunt.rewardShikishiData);
        this.currentNumber = this.randomizeStageCurrentNumber();//init current number
    }

    getEmbedCommence(token){
        var memberList = `• <@${this.party.id_leader}>`;
        for(var key in this.party.id_member){
            memberList+=`\n• <@${this.party.id_member[key]}>`;
        }

        var objEmbed = Embed.builder(`❓ Guess whether the hidden number: **(1-${this.getStageMaxNumber()})** will be lower equal or higher equal than the current number: **${this.currentNumber}**`,
        Embed.builderUser.authorCustom(`${this.party.name}`, this.party.Series.icon),
        {
            title:`Treasure hunt commenced!`,
            thumbnail:Properties.imgSet.mofu.peek,
            fields:[
                {
                    name: `Number guess command:`,
                    value: dedent(`• Press Lower/Higher to guess the hidden number`)
                },
                {
                    name: `Party member:`,
                    value: memberList
                }
            ]
        });

        return {embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(
                `card.${PartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.lower}_${this.party.id}_${token}`,
            "Lower","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${PartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.higher}_${this.party.id}_${token}`,"Higher","PRIMARY"),
        ])]};
    }

    getStageMaxNumber(){
        return TreasureHunt.stage[this.stage]["max"];
    }

    //randomize & get stage current number
    randomizeStageCurrentNumber(){
        return GlobalFunctions.randomArrayItem(TreasureHunt.stage[this.stage].current);
    }

    getEmbedWin(discordUser, rnd, choice){
        var shikishi = new Shikishi(this.reward.shikishiData);

        var embed = Embed.builder(dedent(`✅ **Your guess was correct!** 
        The next hidden number was: **${rnd}** and you guessed it ${choice} equal!
        
        ${Properties.emoji.mofuheart} Congratulations your party has cleared this treasure hunt & receive all rewards!`),
        Embed.builderUser.authorCustom(`${this.party.name}`, this.party.Series.icon),{
            title: `Treasure hunt cleared!`,
            thumbnail:Properties.imgSet.mofu.ok,
            color:Embed.color.success,
            fields:[
                {
                    name:`Party rewards:`,
                    value:dedent(`${Properties.currency.mofucoin.emoji} ${this.reward.mofucoin} ${Properties.currency.mofucoin.name}
                    ${Properties.currency.jewel.emoji} ${this.reward.jewel} ${Properties.currency.jewel.name}
                    ${Shikishi.emoji} **Shikishi**: ${shikishi.getIdShikishi()} ${shikishi.getName(0, true)}`)
                }
            ],
            footer:Embed.builderUser.footer(`Guessed by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed], components: []};
    }

    getEmbedCorrect(discordUser, rnd, choice, token){
        var embed = Embed.builder(dedent(`✅ **Your guess was correct!** 
        The next hidden number was: **${rnd}** and you guessed it ${choice} equal!
        
        ❓Guess whether the hidden number **(1-${this.getStageMaxNumber()})** will be lower equal or higher equal than the current number: **${this.currentNumber}**`),
        Embed.builderUser.authorCustom(`${this.party.name}`, this.party.Series.icon),{
            title: `Treasure hunt stage ${this.stage}/${TreasureHunt.maxStage}`,
            thumbnail:Properties.imgSet.mofu.thumbsup,
            fields:[
                {
                    name:`Party commands:`,
                    value:dedent(`• Press Lower/Higher to guess the hidden number
                    • Press **collect** to take current rewards`)
                },
                {
                    name:`Current party rewards:`,
                    value:dedent(`${Properties.currency.mofucoin.emoji} ${this.reward.mofucoin} ${Properties.currency.mofucoin.name}
                    ${Properties.currency.jewel.emoji} ${this.reward.jewel} ${Properties.currency.jewel.name}`)
                }
            ],
            footer:Embed.builderUser.footer(`Guessed by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });
        var components = [DiscordStyles.Button.row([
            DiscordStyles.Button.base(
                `card.${PartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.lower}_${this.party.id}_${token}`,
            "▼ Lower","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${PartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.higher}_${this.party.id}_${token}`,"▲ Higher","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${PartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.collect}_${this.party.id}_${token}`,"Collect","SUCCESS"),
        ])]

        return {embeds:[embed], components: components};
    }

    getEmbedLose(discordUser, rnd, choice){
        var embed = Embed.builder(dedent(`:x: **Your guess was wrong**

        The next hidden number was: **${rnd}** and you guessed it ${choice} equal.
        Your party has lost all rewards.`),
        Embed.builderUser.authorCustom(`${this.party.name}`, this.party.Series.icon),{
            color:Embed.color.danger,
            title: `Treasure hunt stage ${this.stage}/${TreasureHunt.maxStage}`,
            thumbnail:Properties.imgSet.mofu.error,
            footer:Embed.builderUser.footer(`Guessed by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed],components:[]};
    }

    getEmbedCollect(discordUser){
        var embed = Embed.builder(`${Properties.emoji.mofuheart} Your party has decide to collect all rewards!`,
        Embed.builderUser.authorCustom(`${this.party.name}`, this.party.Series.icon),{
            title: `Treasure hunt stage ${this.stage}/${TreasureHunt.maxStage}`,
            thumbnail:Properties.imgSet.mofu.ok,
            color:Embed.color.success,
            fields:[
                {
                    name:`Party rewards:`,
                    value:dedent(`${Properties.currency.mofucoin.emoji} ${this.reward.mofucoin} ${Properties.currency.mofucoin.name}
                    ${Properties.currency.jewel.emoji} ${this.reward.jewel} ${Properties.currency.jewel.name}`)
                }
            ],
            footer:Embed.builderUser.footer(`Collected by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed], components: []};
    }

    isWin(){
        return this.stage>TreasureHunt.maxStage? true: false;
    }

    //advance through next stage
    setNextStage(){
        this.currentNumber = this.randomizeStageCurrentNumber();//set new current number

        //increment rewards:
        this.reward.mofucoin = this.reward.mofucoin+(5*2);
        this.reward.jewel +=1;
    }

    async distributePartyRewards(){
        var shikishi = new Shikishi(this.reward.shikishiData);

        var idMembers = this.party.getAllUserId();
        for(var key in idMembers){
            var idMember = idMembers[key];
            let user = new User(await User.getData(idMember));
            user.Currency.mofucoin+=this.reward.mofucoin;
            user.Currency.jewel+=this.reward.jewel;
            await user.update();
            
            //distribute shikishi item if win the round
            if(this.isWin()) await ShikishiInventory.updateStock(idMember, shikishi.id_shikishi, 1);
        }
    }

    static async onGuess(discordUser, guildData, partyId, command, interaction){
        var guild = new Guild(guildData);
        var spawn = new PartyAct(guild.spawner.spawn);
        var instance = new TreasureHunt(spawn.getInstance(partyId));
        await interaction.deferReply();
        
        var rnd = GlobalFunctions.randomNumber(1, instance.getStageMaxNumber());
        // rnd = 99;//debugging purpose
        if(command==TreasureHunt.buttonId.collect){
            await instance.embed.edit(instance.getEmbedCollect(discordUser));
            await instance.distributePartyRewards(); //distribute rewards to party
        } else if((command==TreasureHunt.buttonId.lower && rnd<=instance.currentNumber)||
        (command==TreasureHunt.buttonId.higher && rnd>=instance.currentNumber)){
            instance.stage+=1;

            //check for maximum stage
            if(instance.isWin()){//win
                instance.reward.mofucoin*=2;
                instance.reward.jewel+=5;
                await instance.embed.edit(instance.getEmbedWin(discordUser, rnd, command));
                await instance.distributePartyRewards(); //distribute rewards to party
            } else {//on progress
                instance.setNextStage();
                await instance.embed.edit(instance.getEmbedCorrect(discordUser, rnd, command, guild.spawner.token));
            }
        } else {
            await instance.embed.edit(instance.getEmbedLose(discordUser, rnd, command));
        }

        await spawn.updateInstance(partyId, instance);//save latest instance data
        await interaction.editReply("⠀");
        await interaction.deleteReply();
    }

    // init(){//init instance
        
    // }

    static async initRewardData(){//init reward for all shikishi data
        var shikishiData = await DB.selectAll(Shikishi.tablename);
        for(var i=0;i<shikishiData.length;i++){
            TreasureHunt.rewardShikishiData.push(shikishiData[i]);
        }
    }

}

class SoloBattle {
    static type = "instanceSoloBattle";
    static buttonId = Object.freeze({
        commence:"commence",
    });

    static instanceType = {
        chokkins: "chokkins"
    }

    static difficulty = {
        normal:{
            value:"normal",
            maxLevel:30,
            score:1,
        },
        hard:{
            value:"hard",
            maxLevel:50,
            score:1,
        }
    }

    type = null;
    difficulty = null;
    instance = {};//contains instance data

    constructor(instanceData=null){
        if(instanceData!=null){
            for(var key in instanceData){
                this[key] = instanceData[key];
            }
        }
    }

    //used to get instance by user id
    getInstance(userId){
        return this.instance[userId];
    }

    //used to get spawn embed
    getEmbedSpawn(token){
        switch(this.type){
            case SoloBattle.instanceType.chokkins:{
                return ChokkinsBattle.getEmbedSpawn(token);
                break;
            }
        }
        
    }

}

class BattleRewards {
    static normal = {
        
    }



}

class ChokkinsBattle {
    static type = SoloBattle.instanceType.chokkins;
    
    userId = null;
    monster;
    tsunagarus;
    mainAvatar = null;
    support1Avatar = null;
    support2Avatar = null;

    constructor(userId=null, cardAvatarData=null, cardInventoryData = {main:null, support1:null, support2:null}, 
        cardData = {main:null, support1:null, support2:null}){
        if(userId!=null){
            this.userId = userId;
            this.cardAvatar = new AvatarFormation(cardAvatarData);
            this.mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, cardInventoryData.main, cardData.main);
            // if("support1" in cardInventoryData){
            //     this.support1Avatar = new PrecureAvatar(AvatarFormation.formation.support1.value, cardInventoryData.support1, cardData.support1);
            // }
            

            // this.support2Avatar = new PrecureAvatar(AvatarFormation.formation.support2.value, cardInventoryData.support2, cardData.support2);
        }
    }

    static getEmbedSpawn(token){
        var tsunagarus = new Tsunagarus("chokkins");
        
        var objEmbed = Embed.builder(dedent(`${tsunagarus.properties.name} has appeared and possesses x powers! 
        Join in battle to defeat it!`),
        Embed.builderUser.authorCustom(`Tsunagarus battle: `, tsunagarus.properties.icon),
        {
            title:`Tsunagarus has appeared!`,
            image:Properties.imgSet.mofu.peek,
            thumbnail:tsunagarus.properties.icon
            
        });

        // return {embeds:
            //             [GEmbed.builder(txtDesc, 
            //                 objUserData, {
            //                 title:`🆚 Battle Started!`,
            //                 thumbnail:Properties.icon,
            //                 fields:[
            //                     Embed.printStatusField(enemyData,true),
            //                     Avatar.Embed.printFieldStatus(avatarData,true)
            //                 ]
            //             })],
            //             components:
            //             [
            //                 Enemy.Commands.getMainCommandComponents(spawnToken, userId)
            //             ]
                    
            //         };

        return {embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(`card.${this.type}_${this.buttonId.commence}_${token}`,"Commence","PRIMARY"),
        ])]};
    }
}

// class Tsunagarus {
//     static value = "battle";
//     instance={};
//     embedSpawn = null;
//     constructor(token = null){


//         this.embedSpawn = ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
//             DiscordStyles.Button.base(`card.${Spawner.type.battle}_${NumberGuess.buttonId.lower}_${token}`,"▼ Lower","PRIMARY"),
//             DiscordStyles.Button.base(`card.${Spawner.type.numberGuess}_${NumberGuess.buttonId.higher}_${token}`,"▲ Higher","PRIMARY"),
//             DiscordStyles.Button.base(`card.${Spawner.type.numberGuess}_${NumberGuess.buttonId.boost}_${token}`,"🆙 Boost","SUCCESS"),
//         ])]});
//     }

//     join(userId){
//         this.instance[userId] = new BattleSolo(userId, )
//     }

//     async randomize(){

//     }
    
// }

class Instance {
    static PartyAct = PartyAct;
    static SoloBattle = SoloBattle;

    static async init(){
        //init treasure hunt reward data
        await TreasureHunt.initRewardData();
    }

}

module.exports = Instance;
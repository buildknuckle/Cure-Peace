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
const User = require("./User");
const Color = Properties.color;
const Emoji = Properties.emoji;

class Embed extends require("../Embed") {
    static validationNotInParty(discordUser){
        return Embed.errorMini(`Cannot use this command while not in party.`, discordUser, true, {
            title:":x: Not in party"
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

class BattleSolo {
    userId = null;
    cardAvatar;

    mainAvatar = null;
    support1Avatar = null;
    support2Avatar = null;
    enemy = null;

    constructor(userId=null, cardAvatarData=null, cardInventoryData = {main:null, support1:null, support2:null}, 
        cardData = {main:null, support1:null, support2:null}, 
        enemy = null){
        if(userId!=null){
            this.userId = userId;
            this.cardAvatar = new AvatarFormation(cardAvatarData);
            this.mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, cardInventoryData.main, cardData.main);

            if("support1" in cardInventoryData){
                this.support1Avatar = new PrecureAvatar(AvatarFormation.formation.support1.value, cardInventoryData.support1, cardData.support1);
            }
            

            this.support2Avatar = new PrecureAvatar(AvatarFormation.formation.support2.value, cardInventoryData.support2, cardData.support2);
        }
    }
}

class InstancePartyAct {
    static type = "instancePartyAct";
    static buttonId = Object.freeze({
        commence:"commence",
    });
    static spawnType = {
        treasureHunt: "treasureHunt"
    }
    spawnType = null;
    spawnClass = null;//will be used on join. Called with: new instanceType();
    instance = {};//contains party instance data
    embedSpawn = null;

    constructor(instanceData=null){
        if(instanceData!=null){
            for(var key in instanceData){
                this[key] = instanceData[key];
            }
        }
    }

    initData(InstancePartyAct){
        for(var key in InstancePartyAct){
            this[key] = InstancePartyAct[key];
        }
    }

    getInstance(partyid){
        return this.instance[partyid];
    }

    updateInstance(partyId, newInstanceData){
        this.instance[partyId] = newInstanceData;
    }

    static async join(discordUser, guildData, interaction){
        var userId = discordUser.id;
        var guild = new Guild(guildData);
        var spawner = guild.spawner.data;
        var partyData = await Party.getData(guild.id_guild, userId);
        //validation: if user in party/not
        if(partyData==null) return interaction.reply(Embed.validationNotInParty(discordUser));
        var party = new Party(partyData);

        //validation: if party already joined
        var instance = new InstancePartyAct(spawner);
        
        //validation if user already in party/not
        if(party.id in instance.instance){ 
            return interaction.reply(Embed.validationAlreadyJoined(discordUser));
        } else {
            switch(instance.spawnType){
                case this.spawnType.treasureHunt:
                    var spawnClass = new TreasureHunt();
                    await spawnClass.commence(partyData, guild.spawner.token, interaction);
                    instance.instance[party.id] = spawnClass;
                    // guild.updateData();//save latest spawner data to guild
                    break;
            }
            
        }
    }

    static randomize(token){
        var rnd = GlobalFunctions.randomPropertyKey(this.spawnType);
        var instance = new InstancePartyAct();
        switch(rnd){
            case this.spawnType.treasureHunt:
                instance.spawnType = TreasureHunt.type;
                instance.spawnClass = TreasureHunt;
                instance.embedSpawn = TreasureHunt.getEmbedSpawn(token);
                break;
        }
        return instance;
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

        //validation: if party already joined
        var instancePartyAct = new InstancePartyAct(guild.spawner.data);
        if(!(party.id in instancePartyAct.instance)){
            return interaction.reply(Embed.validationWrongInstance(discordUser));
        }

        // var instancePartyData = instancePartyAct.getInstance(party.id);

        switch(spawnType){
            case TreasureHunt.type:
                await TreasureHunt.onGuess(discordUser, guildData, party.id, command, interaction);
            break;
        }
    }

}

class TreasureHunt {
    static type = "treasureHunt";
    static buttonId = Object.freeze({
        lower:"lower",
        higher:"higher",
        take:"take",
    });
    static stage = {//contains max randomizer
        1:100,
        2:50,
        3:20,
        4:20,
        5:18,
        6:16,
        7:16,
        8:14,
        9:12,
        10:10,
        11:8,
        12:8,
        13:6,
        14:6,
        15:4,
        16:4,
        17:4,
    }

    party;//contains party data
    reward = { //base reward
        jewel: 1,
        mofucoin: 5
    }
    
    stage = 1;
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

        return ({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(`card.${InstancePartyAct.type}_${InstancePartyAct.buttonId.commence}_${token}`,"Commence","PRIMARY"),
        ])]});
    }

    async commence(partyData, token, interaction){
        var party = new Party(partyData);
        this.party = party;

        var memberList = `• <@${this.party.id_leader}>`;
        for(var key in this.party.id_member){
            memberList+=`\n• <@${this.party.id_member[key]}>`;
        }

        var objEmbed = Embed.builder(`Guess whether the hidden number (1-${this.getStageMaxNumber()}) will be lower equal or higher equal than the current number: **${Math.round(this.getStageMaxNumber()/2)}**`,
        Embed.builderUser.authorCustom(`Instance of: ${party.name}`),
        {
            title:`Treasure hunt commenced!`,
            thumbnail:Properties.imgSet.mofu.peek,
            fields:[
                {
                    name: `Number Guess Command:`,
                    value: dedent(`• Press Lower/Higher to guess the hidden number`)
                },
                {
                    name: `Member List:`,
                    value: memberList
                }
            ]
        });

        this.embed = await interaction.channel.send(({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.lower}_${party.id}_${token}`,
            "Lower","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.higher}_${party.id}_${token}`,"Higher","PRIMARY"),
        ])]}));
    }

    getStageMaxNumber(){
        return TreasureHunt.stage[this.stage];
    }

    getEmbedWin(discordUser, rnd, choice){
        var embed = Embed.builder(`✅ **Your guess was correct!** 
        The next hidden number was: **${rnd}** and you guessed it ${choice} equal!
        
        ${Properties.emoji.mofuheart} Congratulations your party has cleared this treasure hunt & receive all rewards!`,
        Embed.builderUser.authorCustom(`Party Instance: ${this.party.name}`),{
            title: `Treasure hunt cleared!`,
            thumbnail:Properties.imgSet.mofu.ok,
            color:Embed.color.success,
            fields:[
                {
                    name:`Party rewards:`,
                    value:dedent(`${Properties.currency.mofucoin.emoji} ${this.reward.mofucoin} ${Properties.currency.mofucoin.name}
                    ${Properties.currency.jewel.emoji} ${this.reward.jewel} ${Properties.currency.jewel.name}`)
                }
            ],
            footer:Embed.builderUser.footer(`Guessed by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed], components: []};
    }

    getEmbedCorrect(discordUser, rnd, choice, token){
        var embed = Embed.builder(`✅ **Your guess was correct!** 
        The next hidden number was: **${rnd}** and you guessed it ${choice} equal!
        
        Guess whether the hidden number (1-${this.getStageMaxNumber()}) will be lower equal or higher equal than the current number: **${Math.round(this.getStageMaxNumber()/2)}**`,
        Embed.builderUser.authorCustom(`Party Instance: ${this.party.name}`),{
            title: `Treasure hunt stage ${this.stage}`,
            thumbnail:Properties.imgSet.mofu.thumbsup,
            fields:[
                {
                    name:`Commands:`,
                    value:dedent(`• Press Lower/Higher to guess the hidden number
                    • Press take to take current rewards`)
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
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.lower}_${this.party.id}_${token}`,
            "▼ Lower","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.higher}_${this.party.id}_${token}`,"▲ Higher","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.take}_${this.party.id}_${token}`,"Take","SUCCESS"),
        ])]

        return {embeds:[embed], components: components};
    }

    getEmbedLose(discordUser, rnd, choice){
        var embed = Embed.builder(`:x: **Your guess was wrong**

        The next hidden number was: **${rnd}** and you guessed it ${choice} equal.
        Your party has lost all rewards.`,
        Embed.builderUser.authorCustom(`Party Instance: ${this.party.name}`),{
            title: `Treasure hunt stage ${this.stage}`,
            thumbnail:Properties.imgSet.mofu.error,
            footer:Embed.builderUser.footer(`Guessed by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed],components:[]};
    }

    getEmbedTake(discordUser){
        var embed = Embed.builder(`${Properties.emoji.mofuheart} Your party has decide to take all rewards!`,
        Embed.builderUser.authorCustom(`Party Instance: ${this.party.name}`),{
            title: `Treasure hunt stage ${this.stage}`,
            thumbnail:Properties.imgSet.mofu.ok,
            color:Embed.color.success,
            fields:[
                {
                    name:`Party rewards:`,
                    value:dedent(`${Properties.currency.mofucoin.emoji} ${this.reward.mofucoin} ${Properties.currency.mofucoin.name}
                    ${Properties.currency.jewel.emoji} ${this.reward.jewel} ${Properties.currency.jewel.name}`)
                }
            ],
            footer:Embed.builderUser.footer(`Taken by: ${discordUser.username}`, 
            Embed.builderUser.getAvatarUrl(discordUser))
        });

        return {embeds:[embed], components: []};
    }

    async distributePartyRewards(){
        var idMembers = this.party.getAllIdMembers();
        for(var key in idMembers){
            var idMember = idMembers[key];
            let user = new User(await User.getData(idMember));
            user.Currency.mofucoin+=this.reward.mofucoin;
            user.Currency.jewel+=this.reward.jewel;
            await user.update();
        }
    }

    static async onGuess(discordUser, guildData, partyId, command, interaction){
        var guild = new Guild(guildData);
        var instancePartyAct = new InstancePartyAct(guild.spawner.data);
        var instance = new TreasureHunt(instancePartyAct.getInstance(partyId));
        
        var currentNumber = Math.round(TreasureHunt.stage[instance.stage]/2);
        var rnd = GlobalFunctions.randomNumber(1, Math.round(TreasureHunt.stage[instance.stage]));
        rnd = 99;
        if(command==TreasureHunt.buttonId.take){
            await instance.embed.edit(instance.getEmbedTake(discordUser));
            await instance.distributePartyRewards(); //distribute rewards to party
        } else if((command==TreasureHunt.buttonId.lower && rnd<=currentNumber)||
        (command==TreasureHunt.buttonId.higher && rnd>=currentNumber)){
            instance.stage+=1;

            instance.reward.mofucoin = instance.reward.mofucoin+(5*2);
            instance.reward.jewel = instance.reward.jewel+(1*2);
            
            //check for maximum stage
            if(instance.stage>17){//win
                instance.reward.mofucoin*=2;
                instance.reward.jewel*=2;
                await instance.embed.edit(instance.getEmbedWin(discordUser, rnd, command));
                await instance.distributePartyRewards(); //distribute rewards to party
            } else {//on progress
                await instance.embed.edit(instance.getEmbedCorrect(discordUser, rnd, command, guild.spawner.token));
            }
        } else {
            await instance.embed.edit(instance.getEmbedLose(discordUser, rnd, command));
        }

        instancePartyAct.updateInstance(partyId, instance);//save latest instance data
    }

}

module.exports = {
    InstancePartyAct, BattleSolo, TreasureHunt
}
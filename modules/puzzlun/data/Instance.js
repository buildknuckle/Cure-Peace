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
        return Embed.errorMini(`Your party still in one of the instance progress.`, discordUser, true, {
            title:":x: Cannot commence another instance"
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
    party = {};//contains party instance data
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
        if(party.name in instance.party){ 
            return interaction.reply(Embed.validationAlreadyJoined(discordUser));
        } else {
            switch(instance.spawnType){
                case this.spawnType.treasureHunt:
                    var spawnClass = new TreasureHunt();
                    await spawnClass.commence(partyData, guild.spawner.token, interaction);
                    instance.party[party.name] = spawnClass;
                    guild.updateData();//save latest spawner data to guild
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

    static async eventListener(discordUser, guildData, command, interaction){
        var spawnType = command.split("_")[0];
        var command = command.split("_")[1];

        switch(spawnType){
            case TreasureHunt.type:
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

    userId = null;
    reward = {
        jewel: 0,
        mofucoin: 0
    }
    currentNumber = null;
    embedCommence = null;

    constructor(partyInstanceData=null){
        if(partyInstanceData!=null){
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
        var objEmbed = Embed.builder(`Guess whether the hidden number (1-100) will be lower or higher than the current number: **50**`,
        Embed.builderUser.authorCustom(`Instance of: ${party.name}`),
        {
            title:`Treasure Hunting Commenced!`,
            thumbnail:Properties.imgSet.mofu.peek,
        });

        this.embedCommence = await interaction.channel.send(({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.lower}_${token}`,
            "Lower","PRIMARY"),
            DiscordStyles.Button.base(
                `card.${InstancePartyAct.type}_${TreasureHunt.type}_${TreasureHunt.buttonId.higher}_${token}`,"Higher","PRIMARY"),
        ])]}));
    }



}

module.exports = {
    InstancePartyAct, BattleSolo, TreasureHunt
}
const stripIndents = require("common-tags/lib/stripIndents");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, Guild} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
// const paginationEmbed = require('discordjs-button-pagination');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');
const DBM_Enemy_Data = require('../../database/model/DBM_Enemy_Data');
const DBM_Card_Avatar = require('../../database/model/DBM_Card_Avatar');

const CpackModule = require("./Characters");
const SpackModule = require("./Series");
const EnpackModule = require('./Enpack');
const UserModule = require("./User");
const CardModule = require("./Card");
const GuildModule = require("./Guild");
const Avatar = require('./Avatar');
const Enemy = require('./Enemy');

const GProperties = require('./Properties');
const GEmbed = require('./Embed');
const InstanceBattle = require('./InstanceBattle');

class Properties {
    static limit = {
        join_difficulty:{//limitation to join each week
            challenge:5
        }
    }

    static emoji = {
        special_point:"<:peacepoint:936238606660554773>",
        
        color_pink:"<:color_pink:935901707026714714>",
        color_blue:"<:color_blue:935901706837975080>",
        color_green:"<:color_green:935901706804412477>",
        color_purple:"<:color_purple:935903379044065290>",
        color_red:"<:color_red:935901706473050173>",
        color_yellow:"<:color_yellow:935901706770845736>",
        color_white:"<:color_white:935903763741429800>",
        resist:"🛡️",
        block:"❌",
        confuse:"💫",
        sleep:"💤",
        ice:"🧊",
        cg1:"1️⃣",
        cg2:"2️⃣",
        cg3:"3️⃣",
        mleft:"⬅️",
        mright:"➡️",
        mup:"⬆️",
        mdown:"⬇️",
        pause:"⏸️",
        skillPassive:"🌟",
        specialAttackPurify:"💖",
        regen:"💞"
    }
}

class Embed {
    static notifUserInBattle(objUserData){
        return GEmbed.errorMini(`:x: You're still participating on battle instance and cannot join another battle session.`, objUserData, true);
    }
}

class Spawner {
    static async spawnEnemyAppeared(guildId){
        // var rndSeries = GlobalFunctions.randomProperty(SpackModule);//original one
        var spawnToken = GlobalFunctions.randomNumber(0,1000);
        var rndSeries = SpackModule.tropical_rouge;//only for debugging
        var monster = GlobalFunctions.randomProperty(rndSeries.Monsters.data);
        var tsunagarus = GlobalFunctions.randomProperty(EnpackModule.tsunagarus);
        var objEmbed = tsunagarus.spawned(monster, spawnToken);

        await InstanceBattle.Solo.updateSpawn (
            guildId, spawnToken, tsunagarus.Properties.value, monster[DBM_Enemy_Data.columns.series], monster[DBM_Enemy_Data.columns.id]
        );

        //update guild data
        return objEmbed;
    }
}

async function init(){
    //load available color for enemy
    var query = `SELECT ${DBM_Card_Data.columns.color}, ${DBM_Card_Data.columns.series} 
    FROM ${DBM_Card_Data.TABLENAME} GROUP BY ${DBM_Card_Data.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++){
        SpackModule[cardData[i][DBM_Card_Data.columns.series]].Monsters
        .color.push(cardData[i][DBM_Card_Data.columns.color]);
    }

    //load enemy data from DB
    var monstersData = await DB.selectAll(DBM_Enemy_Data.TABLENAME);
    for(var i=0;i<monstersData.length;i++){
        var monsterId = monstersData[i][DBM_Enemy_Data.columns.id];
        var series = monstersData[i][DBM_Enemy_Data.columns.series];
        var data = {};//init the data
        for(var key in monstersData[i]){
            switch(key){
                case DBM_Enemy_Data.columns.weakness_color: //convert weakness color to array
                    data[key] = monstersData[i][key].split(",");
                    break;
                default:
                    data[key] = monstersData[i][key];
                    break;
            }
        }
        SpackModule[series].Monsters.data[monsterId] = data;
    }

    //init battle instance
    await InstanceBattle.init();

    console.log("Battle Modules : Loaded ✓");
}

class Validation {
    static async spawn(objUserData, guildData, instance, customId){
        var commandToken = customId.toString().split("_")[2];
        if(guildData[DBM_Guild_Data.columns.spawn_type]==null||instance==null){
            return {embeds:[
                GEmbed.builder(`No enemies detected right now.`,objUserData, {
                    thumbnail:GProperties.imgSet.mofu.ok
                })
            ], ephemeral:true}
            
        } else if(guildData[DBM_Guild_Data.columns.spawn_token]!=commandToken){
            return {embeds:[
                GEmbed.builder(`:x: This battle command is not available for this spawn.`,objUserData, {
                    thumbnail:GProperties.imgSet.mofu.error,
                    color:GEmbed.color.danger
                })
            ], ephemeral:true}
        }
        
        return true;
    }

    static async join(objUserData, userAvatar){
        if(userAvatar[DBM_Card_Avatar.columns.id_main]===null){//avatar validation
            return {embeds:[
                GEmbed.builder(`:x: Please set your main precure avatar first with: "**/card set avatar**"`, objUserData, {
                    thumbnail:GProperties.imgSet.mofu.error,
                    color:GEmbed.color.danger
                })
            ], ephemeral:true}
        }

        return true;
    }

    static async level(objUserData, cardInventoryData, levelMin){
        if(levelMin>1&&cardInventoryData[DBM_Card_Inventory.columns.level]<levelMin){ //validate level if provided
            return {embeds:[
                GEmbed.builder(`:x: Your cure avatar needs to be on level ${levelMin} to participate on this battle mode`, objUserData, {
                    thumbnail:GProperties.imgSet.mofu.error,
                    color:GEmbed.color.danger
                })
            ]}
        }

        return true;
    }

    static async command(objUserData, userStatusData, interaction){

    }
}

class EventListener {
    
    static async scanBattleInfoTsunagarus(objUserData, guildId, interaction, customId){
        //spawn validation
        var guildInstance = InstanceBattle.Solo.getGuildInstance(guildId);
        var guildData = await GuildModule.getGuildData(guildId);
        var spawnValidation = await Validation.spawn(objUserData, guildData, guildInstance, customId);
        if(spawnValidation!==true) return interaction.reply(spawnValidation);

        var tsunagarus = customId.split("_")[3];
        return interaction.reply(EnpackModule.tsunagarus[tsunagarus].EventListener.scanInfo(guildData, objUserData));
    }

    static async joinSolo(guildId, objUserData, interaction, customId, mode){
        await interaction.update({embeds:interaction.embeds});//return to default select menu

        //spawn validation
        var guildInstance = InstanceBattle.Solo.getGuildInstance(guildId);
        var guildData = await GuildModule.getGuildData(guildId);
        var spawnValidation = await Validation.spawn(objUserData, guildData, guildInstance, customId);
        if(spawnValidation!==true) return interaction.followUp(spawnValidation);

        //get tsunagarus level
        var tsunagarus = InstanceBattle.Solo.getTsunagarus(guildId);
        var monster = InstanceBattle.Solo.getMonster(guildId);
        var levelMin = tsunagarus.Parameter.getLevelMin(mode);
        var levelMax = tsunagarus.Parameter.getLevelMax(mode);

        var userId = objUserData.id;
        var userStatusData = await UserModule.getData(userId);
        var userAvatar = await UserModule.Card.getAvatarData(userId);

        //validation on joining
        var joinValidation = await Validation.join(objUserData, userAvatar);
        if(joinValidation!==true) return interaction.followUp(joinValidation);

        //process instance
        var cardData = await CardModule.getCardData(userAvatar[DBM_Card_Avatar.columns.id_main]);
        var cardInventoryData = await CardModule.Inventory.getData(userId, cardData[DBM_Card_Data.columns.id_card]);

        //level validation
        var levelValidation = await Validation.level(objUserData, cardInventoryData, levelMin);
        if(levelValidation!==true) return interaction.followUp(levelValidation);

        var arrCardData = [cardData];
        var arrCardInventoryData = [cardInventoryData];
        
        if(userAvatar[DBM_Card_Avatar.columns.id_support1]!==null){//avatar support 1
            var cardData = await CardModule.getCardData(userAvatar[DBM_Card_Avatar.columns.id_support1]);
            var cardInventoryData = await CardModule.Inventory.getData(userId, cardData[DBM_Card_Data.columns.id_card]);
            arrCardData.push(cardData);
            arrCardInventoryData.push(cardInventoryData);
        }

        if(userAvatar[DBM_Card_Avatar.columns.id_support2]!==null){//avatar support 2
            var cardData = await CardModule.getCardData(userAvatar[DBM_Card_Avatar.columns.id_support2]);
            var cardInventoryData = await CardModule.Inventory.getData(userId, cardData[DBM_Card_Data.columns.id_card]);
            arrCardData.push(cardData);
            arrCardInventoryData.push(cardInventoryData);
        }

        //init avatar data
        var avatarData = Avatar.init(arrCardData, arrCardInventoryData, "normal", levelMax);

        //refresh new guild instance data
        var guildInstance = InstanceBattle.Solo.getGuildInstance(guildId);
        
        //init enemy data
        var enemyData = tsunagarus.init(mode, monster, avatarData);
        // console.log(enemyData);
        var objEmbed = tsunagarus.EventListener.onStart(mode, objUserData, tsunagarus, monster, enemyData, avatarData, guildData[DBM_Guild_Data.columns.spawn_token]);
        // console.log(enemyData);
        return interaction.followUp(objEmbed);

        // console.log(avatarData);
        // var enemy = EnpackModule.tsunagarus.chokkins.EventListener.join(guildData, objUserData, userAvatar);

        


        await InstanceBattle.Solo.setInstanceData(guildId, userId, avatarData, enemyData);

        return;
        var spawnData = instanceData[Spawner.instanceBattleKey.single.spawnData];
        var series = spawnData[DBM_Enemy_Data.columns.series];
        var enemyType = instanceData[Spawner.instanceBattleKey.single.type];
        var userMainAvatar = JSON.parse(userStatusData[DBM_User_Data.columns.avatar_main_data]);
        var userSupportAvatar = JSON.parse(userStatusData[DBM_User_Data.columns.avatar_support_data]);

        return;
        
        // console.log(enemyData);
        // console.log(difficulty);

        //get player base card stats to be synced:
        var cardInventoryData = await CardModule.Inventory.getData(userId, userMainAvatar[UserModule.Properties.userDataKey.avatar_main.id_card]);
        var cardData = await CardModule.getCardData(userMainAvatar[UserModule.Properties.userDataKey.avatar_main.id_card]);
        var avatarData = Avatar.init(mode, cardData, cardInventoryData, userSupportAvatar);//init avatar data
        instanceData[Spawner.instanceBattleKey.single.instance][userId] = {
            user:avatarData,
            enemy:null,
            mode:mode
        };

        var arrFields = [{
            name:`${tsunagarus.name}`,
            value:``,
            inline: true
        },{
            name:`${SpackModule[cardData[DBM_Card_Data.columns.series]].Properties.icon.mascot_emoji} ${CpackModule[cardData[DBM_Card_Data.columns.pack]].Avatar.normal.name}:`,
            value:stripIndents`❤️ **HP:** ${avatarData[Avatar.dataKey.hp]}/${avatarData[Avatar.dataKey.hp_max]}
            🌟 **SP:** 0/${avatarData[Avatar.dataKey.sp_max]}
            ⚔️ **Color:** ???`,
            inline: true
        },{
            name:`⏪ Battle Log:`,
            value:`-`,
            inline:false
        }];

        var arrActionFields = [];
        switch(mode){
            case Properties.mode.normal.value:
                //generate color
                for(var i=0; i<4; i++){
                    var selectedColor = GlobalFunctions.randomArrayItem(Randomizer.color);
                    arrActionFields.push(`${Actions.color[selectedColor].value}`);
                }

                // //replace 1 of the array with weakness color
                var rndWeaknessColor = GlobalFunctions.randomArrayItem(spawnData[DBM_Enemy_Data.columns.weakness_color]);
                arrActionFields[GlobalFunctions.randomNumber(0,arrActionFields.length-1)] = 
                `${Actions.color[rndWeaknessColor].value}`;

                // arrFields[0].value = Embed.printActionFields(arrActionFields);

                arrFields[0].name = `⭐ ${tsunagarus.name}`;

                var enemyData = Enemy.init(enemyType, mode, avatarData.hp, avatarData.atk, arrActionFields);
                instanceData[Spawner.instanceBattleKey.single.instance][userId]["enemy"] = enemyData;
                // break;
        }

        arrFields[0].value = `💔 **HP:** ${enemyData[Enemy.dataKey.hp]}/${enemyData[Enemy.dataKey.hp_max]}`;

        var userData = instanceData[Spawner.instanceBattleKey.single.instance][userId]
        [Spawner.instanceBattleKey.single.instanceDataKey.user];
        var enemyData = instanceData[Spawner.instanceBattleKey.single.instance][userId]
        [Spawner.instanceBattleKey.single.instanceDataKey.enemy];

        // console.log(userData);

        // console.log(instanceData[Spawner.instanceBattleKey.single.instance]);
        // console.log(instanceData[Spawner.instanceBattleKey.single.instance][userId]);

        var txtDescription = stripIndents`▶️ **Next Action:**
        💭 Chokkins are **standing by** and preparing for it's next moveset.\n
        **Action Fields:**
        ${Embed.printActionFields(arrActionFields)}\n
        ${Embed.printChaosMeter(SpackModule[series].Enemy.data.tsunagarus.chaos_meter.toUpperCase(), 0, tsunagarus.mode[mode].chaos_meter)}`;
        
        var objEmbed = GEmbed.builder(txtDescription,objUserData, {
            title:`🆚 Battle Started!`,
            color:tsunagarus.embed.color,
            thumbnail:tsunagarus.embed.icon,
            fields:arrFields
        });
        return interaction.followUp({embeds:[objEmbed],components:[
            Avatar.commands.components.single(userId)
        ]});
    }
}

module.exports = { init, Properties, Spawner, EventListener }
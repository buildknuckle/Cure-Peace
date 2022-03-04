const dedent = require("dedent-js");
const GlobalFunctions = require('../../../GlobalFunctions.js');
const {MessageActionRow} = require('discord.js');
const DiscordStyles = require('../../../DiscordStyles');
const DBM_Enemy_Data = require('../../../../database/model/DBM_Enemy_Data');
const DBM_Guild_Data = require('../../../../database/model/DBM_Guild_Data');

const GProperties = require('../../Properties');
const GEmbed = require('../../Embed');

const SpackModule = require("../../Series");
const Avatar = require("../../Avatar");

const Enemy = require("../../Enemy");

class Properties {
    static value = "chokkins";
    static name = "Chokkins";
    static icon = "https://waa.ai/f4Lv.png";
    static color = "#D9A4FE";

    static mode = {
        normal:{
            score:1,
            value:"normal",
            name:"normal",
            level:{
                min:5,max:20
            },
            rewards:{
                color_point:10,
                series_point:20,
            },
            maxCp:0
        },
        hard:{
            score:2,
            value:"hard",
            name:"hard",
            level:{
                min:20,max:50
            },
            rewards:{
                color_point:20,
                series_point:40,
            },
            maxCp:3
        },
        expert:{
            score:3,
            value:"expert",
            name:"expert",
            level:{
                min:30,max:60
            },
            rewards:{
                jewel:1,
                color_point:40,
                series_point:50,
            },
            maxCp:6
        },
        auto:{
            score:1,
            value:"auto",
            name:"auto",
            level:{
                min:1,max:60
            },
            rewards:{
                color_point:5,
                series_point:5
            }
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

        statsHp:"💔"
    }
}

class PropertiesStats extends Enemy.PropertiesStats {
    
}

class Parameter {
    static getLevelMin(mode){
        return Properties.mode[mode].level.min;
    }

    static getLevelMax(mode){
        return Properties.mode[mode].level.max;
    }
}

class StatusEffect {

}

class ActionFields extends Enemy.ActionFields {
    static type = {
        color:"color",
        buff:"buff",
        debuff:"debuff"
    }

    static turn = {
        1:{iconTitle:"💭",value:"Chokkins are **standing by** and preparing for it's next moveset"}
    }

    static update(){

    }
}

class StatsModifier {
    static addMaxHpPercentage(enemyData, value, fullRestore=true){

    }
}

class Data extends Enemy.Data {
}

class Embed extends Enemy.Embed {
    static printActionFields(arrActionFields){
        var txt = `${Properties.emoji.cg1}`;
        arrActionFields.forEach(item => {
            if(item in ActionFields.color){
                txt+=`${ActionFields.color[item].icon_emoji}`;
            }
        });
        return txt;
    }

    static printStatusField(enemyData,inline=true){
        return {name:`${Properties.name}`,
        value:`${Properties.emoji.statsHp} **HP**: ${Data.getHp(enemyData)}/${Data.getMaxHp(enemyData)}`,
        inline:inline};
    }

}

function spawned(monster, spawnToken){
    var series = monster[DBM_Enemy_Data.columns.series];
    var monsterName = SpackModule[series].Monsters.name;
    var txtDescription = dedent(`${Properties.name} has appeared and possesses ${monsterName} powers!
    Join in battle to defeat it!`);
    var catchphrase = SpackModule[series].Monsters.catchphrase;
    if(typeof catchphrase=== 'undefined'){
        catchphrase="";
    }
    
    var objEmbed = GEmbed.builder(txtDescription,
    {
        username:`🆚 Tsunagarus Battle`
    }, {
        title:(catchphrase),
        color:Properties.color,
        image:monster[DBM_Enemy_Data.columns.img],
        thumbnail:Properties.icon,
        fields:[{
            name:"Main Info:",
            value:``
        }]
    });

    monster[DBM_Enemy_Data.columns.weakness_color].forEach(item => {
        objEmbed.fields[0].value+=`${Properties.emoji[`color_${item}`]}`;
    });
    objEmbed.fields[0].value = GlobalFunctions.emojify(objEmbed.fields[0].value);

    return {embeds:[objEmbed], components: [
        DiscordStyles.SelectMenus.basic(`card.battle_join_${spawnToken}_chokkins`,"Join & Select Battle Mode",[
            DiscordStyles.SelectMenus.options(`⭐ Normal Mode`,`Join with normal mode`,Properties.mode.normal.value),
            DiscordStyles.SelectMenus.options(`⭐⭐ Hard Mode`,`Join with hard mode`,Properties.mode.hard.value),
            DiscordStyles.SelectMenus.options(`⭐⭐⭐ Expert Mode`,`Join with expert mode`,Properties.mode.expert.value),
            DiscordStyles.SelectMenus.options(`⭐ Auto Mode`,`Use miracle light to join with auto battle mode`,Properties.mode.auto.value),
        ]),
        new MessageActionRow()
        .addComponents(
            DiscordStyles.Button.base(`card.battle_scanInfo_${spawnToken}_chokkins`,"🔍 Scan")
        ),
    ]};
}

function init(mode, monster, avatarData){
    //hp will be taken from player hp
    var initedData = {
        maxHp:0,
        hp:0,
        atk:{min:0,max:0},
        maxCp:Properties.mode[mode].maxCp,
        cp:0,
        baseStats:{},
        turn:1,
        actionFields:[[]],
        se_buff:null,
        se_debuff:null,
        nextAction:null,
    };

    var avatarAtk = Avatar.Data.getAtk(avatarData);
    //[[{type:"color",value:""}]]
    //randomize color

    switch(mode){
        case Properties.mode.normal.value://normal mode
            //init hp
            initedData[PropertiesStats.maxHp] = GlobalFunctions.calculateAddPercentage(avatarAtk,
                GlobalFunctions.randomNumber(300, 500)
            );

            //init atk
            initedData[PropertiesStats.atk].min = 20;
            initedData[PropertiesStats.atk].max = 40;

            var arrActionFields = [[]];
            //randomize action fields
            var col = 0;
            for(var row=0;row<=3;row++){
                var rnd = GlobalFunctions.randomNumber(0,100);
                if(rnd<=70){
                    var weaknessColor = Enemy.Randomizer.weaknessColor(monster);
                    arrActionFields[col].push(ActionFields.color(weaknessColor));
                } else {
                    var rndColor = Enemy.Randomizer.color();
                    arrActionFields[col].push(ActionFields.color(rndColor));
                }
            }

            initedData = Enemy.Data.setActionFields(initedData, arrActionFields);

            break;
        case Properties.mode.hard.value://hard mode
            //init hp
            initedData[PropertiesStats.maxHp] = GlobalFunctions.calculateAddPercentage(avatarAtk,
                GlobalFunctions.randomNumber(1000, 1200)
            );

            //init atk
            initedData[PropertiesStats.atk].min = 50;
            initedData[PropertiesStats.atk].max = 60;
            initedData.actionFields = [[],[]];
            break;
        case Properties.mode.expert.value:
            //init hp
            initedData[PropertiesStats.maxHp] = GlobalFunctions.calculateAddPercentage(avatarAtk,
                GlobalFunctions.randomNumber(1300, 1500)
            );

            //init atk
            initedData[PropertiesStats.atk].min = 60;
            initedData[PropertiesStats.atk].max = 70;

            initedData.actionFields = [[],[],[]];
            break;
    }

    initedData.hp = initedData.maxHp;

    return initedData;
}

class EventListener {
    static scanInfo(guildData, objUserData){
        var spawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var monsterSeries = spawnData.monsterSeries;
        var monsterId = spawnData.monsterId;
        
        var monster = SpackModule[monsterSeries].Monsters;
        var monsterData = SpackModule[monsterSeries].Monsters.data[monsterId];
        var currency = SpackModule[monsterSeries].Properties.currency;
        var chaosMeter = GlobalFunctions.capitalize(monster.chaos_meter);

        return {
            embeds:[GEmbed.builder(dedent(`This ${Properties.name} possesses ${monsterData[DBM_Enemy_Data.columns.name]} power! It is recommended to participate with **${monsterData[DBM_Enemy_Data.columns.weakness_color].toString().replace(",","/")}** cure that able to defeat **${monster.name}**.`), objUserData, {
                title:`🔍Information Scanned!`,
                fields:[
                    {
                        name:`⭐ Normal Mode:`,
                        value:dedent(`♻️ **Level:** ${Properties.mode.normal.level.min}-${Properties.mode.normal.level.max}
                        **Rewards:**
                        ${GProperties.emoji.mofuheart} ${Properties.mode.normal.rewards.color_point} color points
                        ${currency.icon_emoji} ${Properties.mode.normal.rewards.series_point} ${currency.name}
                        `),
                        inline:true
                    },
                    {
                        name:`⭐⭐ Hard Mode:`,
                        value:dedent(`♻️ **Level:** ${Properties.mode.hard.level.min}-${Properties.mode.hard.level.max}
                        💥 **${chaosMeter}:** ${Properties.mode.hard.maxCp}p
                        **Rewards:**
                        ${GProperties.emoji.mofuheart} ${Properties.mode.hard.rewards.color_point} color points
                        ${currency.icon_emoji} ${Properties.mode.hard.rewards.series_point} ${currency.name}
                        `),
                        inline:true
                    },
                    {
                        name:`⭐⭐⭐ Expert Mode:`,
                        value:dedent(`♻️ **Level:** ${Properties.mode.expert.level.min}-${Properties.mode.expert.level.max}
                        💥 **${chaosMeter}:** ${Properties.mode.expert.maxCp}p
                        **Rewards:**
                        ${GProperties.currency.jewel.emoji} ${Properties.mode.expert.rewards.jewel} ${GProperties.currency.jewel.name} 
                        ${GProperties.emoji.mofuheart} ${Properties.mode.expert.rewards.color_point} color points
                        ${currency.icon_emoji} ${Properties.mode.expert.rewards.series_point} ${currency.name}
                        `),
                        inline:true
                    },
                    {
                        name:`${GProperties.emoji.milight} Auto Mode: ${GProperties.color}`,
                        value:dedent(`•Use miracle light to participate in auto battle mode.
                        •Chance of success will be based on avatar level & base recommendation
                        ♻️ **Level:** ${Properties.mode.auto.level.min}-${Properties.mode.auto.level.max}
                        **Rewards:**
                        ${GProperties.emoji.mofuheart} ${Properties.mode.auto.rewards.color_point} color points
                        ${currency.icon_emoji} ${Properties.mode.auto.rewards.series_point} ${currency.name}`),
                        inline:true
                    },
                ]
            })],
            ephemeral:true
        };
    }

    static onStart(mode, objUserData, tsunagarus, monster, enemyData, avatarData, spawnToken){
        // console.log(tsunagarus);
        // console.log(monster);
        var userId = objUserData.id;
        var txtDesc = dedent(`**${Properties.emoji.play} Next Action:** 
        💭 Chokkins are **standing by** and preparing for it's next moveset.

        **Action Fields:**
        ${Enemy.Embed.printActionFields(enemyData)}\n`);
        if(Data.getMaxCp(enemyData)>0){
            txtDesc+=Embed.printChaosMeter(Data.getCpLabel(monster), Data.getCp(enemyData), Data.getMaxCp(enemyData));
        }

        return {embeds:
            [GEmbed.builder(txtDesc, 
                objUserData, {
                title:`🆚 Battle Started!`,
                thumbnail:Properties.icon,
                fields:[
                    Embed.printStatusField(enemyData,true),
                    Avatar.Embed.printFieldStatus(avatarData,true)
                ]
            })],
            components:
            [
                Enemy.Commands.getMainCommandComponents(spawnToken, userId)
            ]
        
        };

    }

}

module.exports = {
    Properties, EventListener, Parameter, init, spawned
}
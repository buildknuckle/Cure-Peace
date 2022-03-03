const dedent = require('dedent-js');
const GlobalFunctions = require('../GlobalFunctions.js');
const SpackModule = require("./Series");
const DBM_Enemy_Data = require('../../database/model/DBM_Enemy_Data');
const GProperties = require('./Properties');

const DiscordStyles = require('../DiscordStyles');

class PropertiesStats {
    static mode = "mode";
    static hp = "hp";
    static maxHp = "maxHp";
    static cp = "cp";//chaos points
    static maxCp = "maxCp";//max chaos points
    static atk = "atk";
    static baseStats = "baseStats";//base stats
    static turn = "turn";
    static movement = "movement";
    static actionFields = "actionFields";//contains main actions fields. e.g: color, debuff, etc
    static se_buff = "se_buff";
    static se_debuff = "se_debuff";
    static nextAction = "nextAction";
}

class Data {
    static getMode(enemyData){
        return enemyData[PropertiesStats.mode];
    }

    static getMaxHp(enemyData){
        return enemyData[PropertiesStats.maxHp];
    }

    static getHp(enemyData){
        return enemyData[PropertiesStats.hp];
    }
    
    static getAtkMin(enemyData){
        return enemyData[PropertiesStats.atk].min;
    }

    static getAtkMax(enemyData){
        return enemyData[PropertiesStats.atk].min;
    }

    static getMaxCp(enemyData){
        return enemyData[PropertiesStats.maxCp];
    }

    static getCp(enemyData){
        return enemyData[PropertiesStats.cp];
    }

    static getSeries(monster){
        return monster[DBM_Enemy_Data.columns.series];
    }

    static getWeaknessColor(monster){
        return monster[DBM_Enemy_Data.columns.weakness_color];
    }

    static getMonsterName(monster){
        return monster[DBM_Enemy_Data.columns.name];
    }

    static getCpLabel(monster){
        var series = this.getSeries(monster);
        return SpackModule[series].Monsters.chaos_meter;
    }

    static getActionFields(enemyData){
        return enemyData[PropertiesStats.actionFields];
    }

    static setActionFields(enemyData,value){
        enemyData[PropertiesStats.actionFields] = value;
        return enemyData;
    }
}

class Emoji {
    static color = {
        color_pink:"<:color_pink:935901707026714714>",
        color_blue:"<:color_blue:935901706837975080>",
        color_green:"<:color_green:935901706804412477>",
        color_purple:"<:color_purple:935903379044065290>",
        color_red:"<:color_red:935901706473050173>",
        color_yellow:"<:color_yellow:935901706770845736>",
        color_white:"<:color_white:935903763741429800>",
    }

    static group = {
        1:"1️⃣",
        2:"2️⃣",
        3:"3️⃣"
    }

    static movement = {
        mleft:"⬅️",
        mright:"➡️",
        mup:"⬆️",
        mdown:"⬇️",
        play:"▶️",
        pause:"⏸️",
        rewind:"⏪",
    }
}

class Randomizer {
    static color(){
        return GlobalFunctions.randomProperty(GProperties.color).value;
    }

    static weaknessColor(monster){
        var weakness_color = Data.getWeaknessColor(monster);
        return GlobalFunctions.randomArrayItem(weakness_color);
    }
}

class Movement {
    static right(enemyData){
        
    }
}

class ActionFields {
    static type="type";
    static emoji="emoji";
    static value="value";

    static typeVal = {
        color:"color",
        buff:"buff",
        debuff:"debuff"
    }

    static color(color){
        var objColor = {type:this.typeVal.color,value:color};
        objColor.emoji=Emoji.color[`color_${color}`];
        return objColor;
    }

    static getEmoji(objFields){
        if(this.emoji in objFields){
            return objFields[this.emoji];
        } else {
            return "-";
        }
    }
}

class Commands {
    static attack = "attack";
    static block = "block";
    static skill = "skill";
    static purify = "purify";

    static getMainCommandComponents(spawnToken, userId){
        return DiscordStyles.SelectMenus.basic("card.battle_command_main","❣️ Commands",[
            DiscordStyles.SelectMenus.options(`⚔️ Attack`,'Attack active frontline field',`attack_${spawnToken}_${userId}`),
            DiscordStyles.SelectMenus.options(`🛡️ Block`,'Block from offensive attack',`block_${spawnToken}_${userId}`),
            DiscordStyles.SelectMenus.options(`🌟 Skill`,'Use main precure skill with SP',`skill_${spawnToken}_${userId}`),
            DiscordStyles.SelectMenus.options(`💖 Purify`,'Use special attack with SP to purify enemy.',`purify_${spawnToken}_${userId}`),
        ])
    }
}

class Embed {
    static printChaosMeter(label, value, max, iconVal=`💔`, iconOutline=`🖤`){
        var txtChaosMeter = ``;
        var barVal = max-value;
        txtChaosMeter = `💥 **${GlobalFunctions.capitalize(label)}:**\n**[**`;
        for(var i=0;i<value;i++){
            txtChaosMeter+=iconVal;
        }
        for(var i=0;i<barVal;i++){
            txtChaosMeter+=iconOutline;
        }
        return txtChaosMeter+=`**]** ${value}/${max}`;
    }

    static printBattleLog(value='-'){
        return {
            name:`⏪**Battle Log:**`,
            value:value
        }
    }

    static printActionFields(enemyData){
        var txt = ``;
        var actionFields = Data.getActionFields(enemyData);
        for(var col=0; col<actionFields.length; col++){
            txt+=`${Emoji.group[col+1]}`;
            for(var row=0; row<actionFields[col].length; row++){
                var objFields = actionFields[col][row];
                txt+=`${ActionFields.getEmoji(objFields)}`;
            }
            txt+=`\n`;
        }
        return txt;
    }
}

module.exports = {
    PropertiesStats, Movement, ActionFields, Embed, Data, Emoji, Randomizer, Commands
}
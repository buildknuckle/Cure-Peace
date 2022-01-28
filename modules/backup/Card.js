const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
<<<<<<< Updated upstream:modules/Card.js
const DiscordStyles = require('../modules/DiscordStyles');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardGuildModules = require('../modules/CardGuild');
const ItemModules = require('../modules/Item');
const TsunagarusModules = require('../modules/Tsunagarus');
const CardPropertiesModules = require('../modules/Card/Properties');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');
const DBM_Card_Enemies = require('../database/model/DBM_Card_Enemies');
const DBM_Card_Tradeboard = require('../database/model/DBM_Card_Tradeboard');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Pinky_Data = require('../database/model/DBM_Pinky_Data');
const DBM_Pinky_Inventory = require('../database/model/DBM_Pinky_Inventory');
const DBM_Card_Party = require('../database/model/DBM_Card_Party');
const DBM_Card_Battle_Instance = require('../database/model/DBM_Card_Battle_Instance');

const latestVersion = "1.13";
=======
const DiscordStyles = require('../DiscordStyles');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const GlobalFunctions = require('../GlobalFunctions.js');
const CardGuildModules = require('../Guild');
const ItemModules = require('../Item');
const TsunagarusModules = require('../Tsunagarus');
const StatusDataModules = require('../StatusData');
const CardPropertiesModules = require('../card/Properties');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../../database/model/DBM_Guild');
const DBM_Card_Leaderboard = require('../../database/model/DBM_Card_Leaderboard');
const DBM_Card_Enemies = require('../../database/model/DBM_Card_Enemies');
const DBM_Card_Tradeboard = require('../../database/model/DBM_Card_Tradeboard');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const DBM_Pinky_Data = require('../../database/model/DBM_Pinky_Data');
const DBM_Pinky_Inventory = require('../../database/model/DBM_Pinky_Inventory');
const DBM_Card_Party = require('../../database/model/DBM_Card_Party');
>>>>>>> Stashed changes:modules/backup/Card.js

class StatusEffect{
    //for skills status effect
    static propertiesStatusEffect2 = {
        value:"value",
        attempts:"attempts"
    }

    static buffData = {
        second_chance:{
            value:"second_chance",
            name:"Second Chance",
            description:"You'll be given another chance to use the: **capture/answer/guess** command.",
        },
        lucky_number:{
            value:"lucky_number",
            name:"Lucky Number",
            permanent:false,
            description:"Provide number 7 as the next hidden number.",
            value_number:7
        },
        pink_coloraura_1:{
            value:"pink_coloraura_1",
            name:"Pink Aura 1",
            permanent:true,
            description:"10% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:10
        },
        blue_coloraura_1:{
            value:"blue_coloraura_1",
            name:"Blue Aura 1",
            permanent:true,
            description:"10% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:10
        },
        yellow_coloraura_1:{
            value:"yellow_coloraura_1",
            name:"Yellow Aura 1",
            permanent:true,
            description:"10% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:10
        },
        red_coloraura_1:{
            value:"red_coloraura_1",
            name:"Red Aura 1",
            permanent:true,
            description:"10% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:10
        },
        purple_coloraura_1:{
            value:"purple_coloraura_1",
            name:"Purple Aura 1",
            permanent:true,
            description:"10% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:10
        },
        white_coloraura_1:{
            value:"white_coloraura_1",
            name:"White Aura 1",
            permanent:true,
            description:"10% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:10
        },
        green_coloraura_1:{
            value:"green_coloraura_1",
            name:"Green Aura 1",
            permanent:true,
            description:"10% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:10
        },
        pink_coloraura_2:{
            value:"pink_coloraura_2",
            name:"Pink Aura 2",
            permanent:true,
            description:"15% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:15
        },
        blue_coloraura_2:{
            value:"blue_coloraura_2",
            name:"Blue Aura 2",
            permanent:true,
            description:"15% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:15
        },
        yellow_coloraura_2:{
            value:"yellow_coloraura_2",
            name:"Yellow Aura 2",
            permanent:true,
            description:"15% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:15
        },
        red_coloraura_2:{
            value:"red_coloraura_2",
            name:"Red Aura 2",
            permanent:true,
            description:"15% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:15
        },
        purple_coloraura_2:{
            value:"purple_coloraura_2",
            name:"Purple Aura 2",
            permanent:true,
            description:"15% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:15
        },
        white_coloraura_2:{
            value:"white_coloraura_2",
            name:"White Aura 2",
            permanent:true,
            description:"15% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:15
        },
        green_coloraura_2:{
            value:"green_coloraura_2",
            name:"Green Aura 2",
            permanent:true,
            description:"15% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:15
        },
        clear_status_all:{
            value:"clear_status_all",
            name:"Status Removal",
            description:"Remove the Debuff & Clear Status Effect."
        },
        quiz_master:{
            value:"quiz_master",
            name:"Quiz Master",
            permanent:false,
            description:"Instantly give the correct answer if the answer is wrong."
        },

        hp_up_1:{
            value:"hp_up_1",
            name:"Hp Up 1",
            description:"+20% hp boost during battle.",
            value_hp_boost:20,
            permanent:true
        },
        hp_up_2:{
            value:"hp_up_2",
            name:"Hp Up 2",
            description:"+25% hp boost during battle.",
            value_hp_boost:25,
            permanent:true
        },
        hp_up_3:{
            value:"hp_up_3",
            name:"Hp Up 3",
            description:"+30% hp boost during battle.",
            value_hp_boost:30,
            permanent:true
        },
        hp_up_4:{
            value:"hp_up_4",
            name:"Hp Up 4",
            description:"+40% hp boost during battle.",
            value_hp_boost:40,
            permanent:false
        },

        rarity_up_1:{
            value:"rarity_up_1",
            name:"Rarity Up 1",
            description:"+1 :star: rarity during battle.",
            value_rarity_boost:1,
            permanent:true
        },
        rarity_up_2:{
            value:"rarity_up_2",
            name:"Rarity Up 2",
            description:"+2 :star: rarity during battle.",
            value_rarity_boost:2,
            permanent:true
        },
        rarity_up_3:{
            value:"rarity_up_3",
            name:"Rarity Up 3",
            description:"+3 :star: rarity during battle.",
            value_rarity_boost:3,
            permanent:true
        },
        rarity_up_4:{
            value:"rarity_up_4",
            name:"Rarity Up 4",
            description:"+4 :star: rarity during battle.",
            value_rarity_boost:4,
            permanent:false
        },
        atk_up_1:{
            value:"atk_up_1",
            name:"Atk Up 1",
            description:"+20% atk boost during battle.",
            value_atk_boost:20,
            permanent:true
        },
        atk_up_2:{
            value:"atk_up_2",
            name:"Atk Up 2",
            description:"+25% atk boost during battle.",
            value_atk_boost:25,
            permanent:true
        },
        atk_up_3:{
            value:"atk_up_3",
            name:"Atk Up 3",
            description:"+30% atk boost during battle.",
            value_atk_boost:30,
            permanent:true
        },
        atk_up_4:{
            value:"atk_up_4",
            name:"Atk Up 4",
            description:"+40% atk boost during battle.",
            value_atk_boost:40,
            permanent:false
        },

        battle_protection:{
            value:"battle_protection",
            name:"Battle Protection",
            description:"Protect from receiving debuff.",
            permanent:false
        },
        precure_protection:{
            value:"precure_protection",
            name:"Precure Protection",
            description:"**Protect** yourself from losing the precure avatar.",
            permanent:false
        },
        debuff_protection_1:{
            value:"debuff_protection_1",
            name:"Debuff Protection 1",
            description:"**Protect** yourself from receiving debuff.",
            permanent:false
        },
        debuff_protection_2:{
            value:"debuff_protection_2",
            name:"Debuff Protection 2",
            description:"**Permanently protect** yourself from receiving debuff.",
            permanent:true
        },
        rainbow_coloraura_1:{
            value:"rainbow_coloraura_1",
            name:"Rainbow Aura 1",
            description:"5% capture boost for all card.",
            value_capture_boost:5,
            permanent:true
        },
        rainbow_coloraura_2:{
            value:"rainbow_coloraura_2",
            name:"Rainbow Aura 2",
            description:"10% capture boost for all card.",
            value_capture_boost:10,
            permanent:true
        },
        rainbow_coloraura_3:{
            value:"rainbow_coloraura_3",
            name:"Rainbow Aura 3",
            description:"15% capture boost for all card.",
            value_capture_boost:15,
            permanent:true
        },
        remove_debuff:{
            value:"remove_debuff",
            name:"Debuff Removal",
            description:"Remove the chosen debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_cardcaplock:{
            value:"remove_debuff_cardcaplock",
            name:"Cardcaplock Removed",
            description:"Remove **cardcaplock** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_fear:{
            value:"remove_debuff_fear",
            name:"Fear Removed",
            description:"Remove **fear** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_amnesia:{
            value:"remove_debuff_amnesia",
            name:"Amnesia Removed",
            description:"Remove **amnesia** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_specialock:{
            value:"remove_debuff_specialock",
            name:"Specialock Removed",
            description:"Remove **specialock** debuff.",
            usable:false,
            clear_status:true
        },
        special_break:{
            value:"special_break",
            name:"Special Break",
            description:"**Break** through enemy **special protection**!",
            permanent:false
        },
        scan_tsunagarus:{
            value:"scan_tsunagarus",
            name:"🔍 Tsunagascan!",
            description:"Scan",
            permanent:false
        }
    }

    static cureSkillsBuffData = {
        stats_booster:{
            value:"stats_booster",
            name:"Stats Booster",
            description:"Boost HP & Atk Stats by 50% for 3 battle attempts.",
            boost_value:50,
            attempts:3,
            notifications:["hp","atk"]
        },
        catchphrage:{
            value:"catchphrage",
            name:"Catchphrage",
            description:"Lower your hp by 30% & boost atk by 30% for 5 battle attempts.",
            boost_penalty:30,
            boost_value:30,
            attempts:5,
            notifications:["hp","atk"]
        },
        levelcutter:{
            value:"levelcutter",
            name:"Levelcutter",
            description:"Lower your level by 50% & boost atk by 70% for 5 battle attempts.",
            boost_penalty:50,
            boost_value:70,
            attempts:5,
            notifications:["level","atk"]
        },
        starmaster:{
            value:"starmaster",
            name:"Starmaster",
            description:"+7 rarity boost for 7 turns.",
            attempts:7,
            boost_value:7,
            damageRelated: false,
            notifications:["rarity"]
        },
        endure:{
            value:"endure",
            name:"Endure",
            description:"Lower your atk by 50% & boost hp by 50% for 5 battle attempts.",
            attempts:5,
            boost_penalty:50,
            boost_value:50,
            damageRelated: false,
            notifications:["atk","hp"]
        },
        reward_booster:{
            value:"reward_booster",
            name:"Reward Booster",
            description:"Individual boost rewards upon defeating the enemy.",
            attempts:2,
            notifications:["rewards"]
        },
        cure_blessing:{
            value:"cure_blessing",
            name:"Cure Blessing",
            description:"Protect from getting defeated for 3 battle attempts*.",
            attempts:3,
            notifications:["hp"]
        }
        
    }

    static partyBuffData = {
        party_atk_up_1:{
            value:"party_atk_up_1",
            name:"Party Atk Up 1",
            description:"+10% atk boost for party.",
            value_atk_boost:10,
            permanent:true
        },
        party_atk_up_2:{
            value:"party_atk_up_2",
            name:"Party Atk Up 2",
            description:"+20% atk boost for party.",
            value_atk_boost:20,
            permanent:true
        },
        party_atk_up_3:{
            value:"party_atk_up_3",
            name:"Party Atk Up 3",
            description:"+30% atk boost for party.",
            value_atk_boost:30,
            permanent:true
        },
        party_atk_up_4:{
            value:"party_atk_up_4",
            name:"Party Atk Up 4",
            description:"+40% atk boost for party.",
            value_atk_boost:50,
            permanent:false
        },
        party_hp_up_1:{
            value:"party_hp_up_1",
            name:"Party Hp Up 1",
            description:"+10% hp boost for party.",
            value_hp_boost:10,
            permanent:true
        },
        party_hp_up_2:{
            value:"party_hp_up_2",
            name:"Party Hp Up 2",
            description:"+20% hp boost for party.",
            value_hp_boost:20,
            permanent:true
        },
        party_hp_up_3:{
            value:"party_hp_up_3",
            name:"Party Hp Up 3",
            description:"+30% hp boost for party.",
            value_hp_boost:30,
            permanent:true
        },
        party_hp_up_4:{
            value:"party_hp_up_4",
            name:"Party Hp Up 4",
            description:"+40% hp boost for party.",
            value_hp_boost:40,
            permanent:true
        },

        party_rarity_up_1:{
            value:"party_rarity_up_1",
            name:"Party Rarity Up 1",
            description:"+1 :star: rarity for party.",
            value_rarity_boost:1,
            permanent:true
        },
        party_rarity_up_2:{
            value:"party_rarity_up_2",
            name:"Party Rarity Up 2",
            description:"+2 :star: rarity for party.",
            value_rarity_boost:2,
            permanent:true
        },
        party_rarity_up_3:{
            value:"party_rarity_up_3",
            name:"Party Rarity Up 3",
            description:"+3 :star: rarity for party.",
            value_rarity_boost:3,
            permanent:true
        },
        party_rarity_up_4:{
            value:"party_rarity_up_4",
            name:"Party Rarity Up 4",
            description:"+4 :star: rarity for party.",
            value_rarity_boost:4,
            permanent:false
        },
    }

    static debuffData = {
        item_curse:{
            value:"item_curse",
            name:"Item Curse",
            description:"Unable to use any item except with the item that has **Debuff Removal**.",
            permanent:true,
            recovery_item:["ca017","fo009"]
        },
        capture_debuff_1:{
            value:"capture_debuff_1",
            name:"Capture Debuff 1",
            description:"-30% capture rate when using **capture** command.",
            value_capture_down:30,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_2:{
            value:"capture_debuff_2",
            name:"Capture Debuff 2",
            description:"-50% capture rate when using **capture** command.",
            value_capture_down:50,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_3:{
            value:"capture_debuff_3",
            name:"Capture Debuff 3",
            description:"-70% capture rate when using **capture** command.",
            value_capture_down:70,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_4:{
            value:"capture_debuff_4",
            name:"Capture Debuff 4",
            description:"-100% capture rate when using **capture** command.",
            value_capture_down:100,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },

        hp_down_1:{
            value:"hp_down_1",
            name:"Hp Down 1",
            description:"-50% hp during battle.",
            value_hp_down:50,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_2:{
            value:"hp_down_2",
            name:"Hp Down 2",
            description:"-60% hp during battle.",
            value_hp_down:60,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_3:{
            value:"hp_down_3",
            name:"Hp Down 3",
            description:"-70% hp during battle.",
            value_hp_down:70,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_4:{
            value:"hp_down_4",
            name:"Hp Down 4",
            description:"-80% hp during battle.",
            value_hp_down:80,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },

        rarity_down_1:{
            value:"rarity_down_1",
            name:"Rarity Down 1",
            description:"-1 :star: rarity during battle.",
            value_rarity_down:1,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_2:{
            value:"rarity_down_2",
            name:"Rarity Down 2",
            description:"-2 :star: rarity during battle.",
            value_rarity_down:2,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_3:{
            value:"rarity_down_3",
            name:"Rarity Down 3",
            description:"-3 :star: rarity during battle.",
            value_rarity_down:3,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_4:{
            value:"rarity_down_4",
            name:"Rarity Down 4",
            description:"-4 :star: rarity during battle.",
            value_rarity_down:4,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },

        atk_down_1:{
            value:"atk_down_1",
            name:"Atk Down 1",
            description:"-50% atk during battle.",
            value_atk_down:50,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_2:{
            value:"atk_down_2",
            name:"Atk Down 2",
            description:"-60% atk during battle.",
            value_atk_down:60,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_3:{
            value:"atk_down_3",
            name:"Atk Down 3",
            description:"-65% atk during battle.",
            value_atk_down:65,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_4:{
            value:"atk_down_4",
            name:"Atk Down 4",
            description:"-80% atk during battle.",
            value_atk_down:80,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        fear:{
            value:"fear",
            name:"Fear",
            description:"Unable to participate in **battle**.",
            permanent:true,
            recovery_item:["ca029","ca017","fo009"]
        },
        cardcaplock:{
            value:"cardcaplock",
            name:"Cardcaplock",
            description:"Unable to use the **capture** command.",
            permanent:true,
            recovery_item:["ca028","ca017","fo009"]
        },
        amnesia:{
            value:"amnesia",
            name:"Amnesia",
            description:"Unable to use the **guess/answer** command.",
            permanent:true,
            recovery_item:["ca030","ca017","fo009"]
        },
        specialock:{
            value:"specialock",
            name:"Specialock",
            description:"Unable to use special attack during battle.",
            permanent:true,
            recovery_item:["ca031","ca017","fo009"]
        }
    }

    static async updateStatusEffect(id_user,status_effect){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.status_effect,status_effect);
        
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);

        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static async updateCureSkillsStatusEffect(id_user,status_effect2,reduceAttempts = false){
        //status_effect2 will be loaded from the object of cureSkillsBuffData
        if(status_effect2!=null&&!reduceAttempts){
            var val = status_effect2;
            status_effect2 = `{"${this.propertiesStatusEffect2.value}":"${this.cureSkillsBuffData[val].value}","${this.propertiesStatusEffect2.attempts}":${this.cureSkillsBuffData[val].attempts}}`;
        } else if(reduceAttempts){
            //status_effect2 already parsed
            status_effect2[this.propertiesStatusEffect2.attempts]-=1;
            status_effect2 = JSON.stringify(status_effect2);
        }

        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.status_effect_2,status_effect2);
        
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);

        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static statusEffectBattleHitResults(status_effect,statusType="buff",teamBattle=false){
        var icon = "⬆️";//default icon
        var txtReturn = "";
        switch(statusType){
            case "skills":
                txtReturn = `**${icon}Skills - ${this.cureSkillsBuffData[status_effect].name}**: ${this.cureSkillsBuffData[status_effect].description}\n`;
                break;
            case "debuff":
                icon = "⬇️";
                txtReturn = `**${icon}Debuff - ${this.debuffData[status_effect].name}**: ${this.debuffData[status_effect].description}\n`;
                break;
            case "buff":
                if(!teamBattle){
                    txtReturn = `**${icon}Status Effect - ${this.buffData[status_effect].name}**: ${this.buffData[status_effect].description}\n`;
                } else {
                    txtReturn = `**${icon}Party Status Effect - ${this.partyBuffData[status_effect].name}**: ${this.partyBuffData[status_effect].description}\n`;
                }
                break;
        }
        return txtReturn;
    }

    static async embedStatusEffectActivated(userUsername,userAvatarUrl,status_effect,statusType="buff",teamBattle=false){
        var SEDescription = ""; var parTitle = "";
        var imgThumbnail = Properties.imgResponse.imgOk;
        switch(statusType){
            case "skills":
                parTitle = `✨ Skills Activated!`;
                SEDescription = `**${this.cureSkillsBuffData[status_effect].name}**:\n${this.cureSkillsBuffData[status_effect].description}`;
                break;
            case "debuff":
                parTitle = `💥 Debuff inflicted!`;
                SEDescription = `**${this.debuffData[status_effect].name}**:\n${this.debuffData[status_effect].description}`;
                imgThumbnail = Properties.imgResponse.imgFailed;
                break;
            case "buff":
                if(!teamBattle){
                    parTitle = `✨ Status Effect Activated!`;
                    SEDescription = `**${this.buffData[status_effect].name}**:\n${this.buffData[status_effect].description}`;
                } else {
                    parTitle = `✨ Status Effect Activated!`;
                    SEDescription = `**${this.partyBuffData[status_effect].name}**:\n${this.partyBuffData[status_effect].description}`;
                }
                break;
        }
        return new MessageEmbed({
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:imgThumbnail
            },
            title: parTitle,
            description: SEDescription,
        })
    }
}

class Properties{
    static embedColor = '#efcc2c';
    static maximumCard = 120;
    static limit = {
        colorpoint:3000,
        mofucoin:3000,
        seriespoint:1000
    }

    static cardCategory = {
        normal:{
            value:"normal",
            color:'#efcc2c',
            rarityBoost:0
        },
        gold:{
            value:"gold",
            color:'#c99914',
            rarityBoost:1
        }
    }

    //any other spawn type that is not listed will put as normal spawn
    static objSpawnType = {
        battle:25,
        quiz:20,
        normal:20,
        number:15,
        color:10,
        series:10
    }
    

    // original:
    static spawnType = ["normal","battle","number","quiz","color","series"];


    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png"
    }

    //contains the data structure for card spawn
    static spawnData = {
        normal:{
            id_card:"id_card",
        },
        quiz:{
            //for column structure:
            type:"type",
            answer:"answer",
            id_card:"id_card",
            //for the embed image
            embed_img:"https://waa.ai/JEyE.png",
            //for the value type:
            typeNormal:"normal",
            typeTsunagarus:"tsunagarus",
            typeStarTwinkleStarsCount:"star twinkle star count",
            typeStarTwinkleConstellation:"star twinkle constellation",
            //for twinkle spawn
            totalStars:"totalStars"
        },
        color:{
            //for column structure:
            pink:"pink",
            purple:"purple",
            green:"green",
            yellow:"yellow",
            white:"white",
            blue:"blue",
            red:"red",
            //for the embed image
            embed_img:"https://waa.ai/JEyE.png"
        },
        battle:{
            category:"category",//battle category: normal/boss
            type:"type",//enemy type
            level:"level",//the level of the enemy
            color:"color",
            color_block:"color_block",
            color_absorb:"color_absorb",
            color_non:"color_non",//non color condition
            //for color condition
            color_lives:"color_lives",
            rarity:"rarity",
            rarity_less:"rarity_less",//less
            rarity_more:"rarity_more",//more rarity
            id_enemy:"id_enemy",
            id_card_reward:"id_card_reward",
            special_allow:"special_allow",//true: special can be used,
            //hp key
            hp1:"hp1",
            hp2:"hp2",
            hp3:"hp3",
            hp4:"hp4",
            hp5:"hp5",
            hp:"hp",
            hp_max:"hp_max",
            //atk key
            atk1:"atk1",
            atk2:"atk2",
            atk3:"atk3",
            atk4:"atk4",
            atk5:"atk5",
            damage_dealer:"damage_dealer",
            traits:"traits",
            actions:"actions",
            turn:"turn",//battle attempt with limit
            turn_mechanics:"turn_mechanics",//for mechanics
            actions_mechanics:"actions_mechanics",
            turn_max:"turn_max",
            color_lives_down:"color_down"
        },
        battle_executive:{
            series:"series",
            color:"color",
            non_color:"non_color",
            level:"level",
            card_level:"card_level"
        }
    }

    //contain basic information of the color
<<<<<<< Updated upstream:modules/Card.js
    static arrColor = ["pink","purple","green","yellow","white","blue","red"];
    static dataColorCore = {
        pink:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FEA1E6",
            total:194,
            skills:{
                1:{
                    cp_cost:50,
                    buff_data:StatusEffect.cureSkillsBuffData.stats_booster
                }
            }
        },
        blue:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#7FC7FF",
            total:136,
            skills:{
                1:{
                    cp_cost:30,
                    buff_data:StatusEffect.cureSkillsBuffData.catchphrage
                }
            }
        },
        red:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FF9389",
            total:87,
            skills:{
                1:{
                    cp_cost:40,
                    buff_data:StatusEffect.cureSkillsBuffData.levelcutter
                }
            }
        },
        yellow:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FDF13B",
            total:152,
            skills:{
                1:{
                    cp_cost:30,
                    buff_data:StatusEffect.cureSkillsBuffData.starmaster
                }
            }
        },
        green:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#7CF885",
            total:62,
            skills:{
                1:{
                    cp_cost:20,
                    buff_data:StatusEffect.cureSkillsBuffData.endure
                }
            }
        },
        purple:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#897CFE",
            total:102,
            skills:{
                1:{
                    cp_cost:500,
                    buff_data:StatusEffect.cureSkillsBuffData.reward_booster
                }
            }
        },
        white:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FFFFEA",
            total:40,
            skills:{
                1:{
                    cp_cost:50,
                    buff_data:StatusEffect.cureSkillsBuffData.cure_blessing
                }
            }
        },
        all:{
            imgMysteryUrl:"https://waa.ai/JEyE.png"
        },
        interactionColorList:[
            {
                name: "pink",
                value: "pink"
            },
            {
                name: "blue",
                value: "blue"
            },
            {
                name: "yellow",
                value: "yellow"
            },
            {
                name: "purple",
                value: "purple"
            },
            {
                name: "red",
                value: "red"
            },
            {
                name: "green",
                value: "green"
            },
            {
                name: "white",
                value: "white"
            }
        ]
    };
=======
    static arrColor = CardPropertiesModules.arrColor;
    static dataColorCore = CardPropertiesModules.dataColorCore;
>>>>>>> Stashed changes:modules/backup/Card.js
    
    //the constant of all available/required card
    static dataCardCore = CardPropertiesModules.dataCardCore;

    static spawnHintSeries = CardPropertiesModules.spawnHintSeries;

    static seriesCardCore = CardPropertiesModules.seriesCardCore;

    static interactionCommandOptions = CardPropertiesModules.interactionCommandOptions;

    //{"max_heart":0,"splash_star":0,"yes5gogo":0,"fresh":0,"heartcatch":0,"suite":0,"smile":0,"dokidoki":0,"happiness":0,"go_princess":0,"mahou_tsukai":0,"kirakira":0,"hugtto":0,"star_twinkle":0,"healin_good":0,"tropical_rouge":0}

}

const Battle = require('../card/Battle');

const Leveling = require('../card/Leveling');

const Shop = require('../card/Shop');

class Status {
    static getHp(level,base_hp){
        return level+base_hp;
    }

    static getModifiedHp(level,base_hp){
        return level*base_hp;
    }

    static getAtk(level,base_atk){
        return level+base_atk;
    }

    static getSpecialAtk(level_special,base_atk){
        return level_special*base_atk;
    }

    static getSpecialActivationChance(level,level_special){
        return level+(level_special*2);
    }

    static getSpecialPointProgress(level_special){
        var retValue = level_special+GlobalFunctions.calculatePercentage(level_special,20);
        if(retValue>=15){retValue = 15;} //cap the received special point
        return retValue;
    }

    static getPartySpecialPointProgress(level_special){
        var retValue = level_special+GlobalFunctions.calculatePercentage(level_special,20);
        if(retValue>=10){retValue = 10;} //cap the received special point
        return retValue;
    }
    
    static getBonusDropRate(level_special){
        return level_special*3;
    }

    static async updateSpecialPoint(id_user,value){
        var specialCharged = false; var maxPoint = 100;
        var cardUserStatusData = await getCardUserStatusData(id_user);
        var querySpecialPoint = "";
    
        if(value>=1){
            //addition
            if(cardUserStatusData[DBM_Card_User_Data.columns.special_point]+value>=maxPoint){
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${maxPoint} `;
                specialCharged = true;
            } else {
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${DBM_Card_User_Data.columns.special_point}+${value} `;
            }
        } else {
            //substract
            cardUserStatusData[DBM_Card_User_Data.columns.special_point]-value<=0 ? 
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = 0 `: 
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${DBM_Card_User_Data.columns.special_point}${value} `;
        }
    
        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
        SET ${querySpecialPoint} 
        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
    
        await DBConn.conn.promise().query(query, [id_user]);
        return specialCharged;
    }

    static async getAverageLevel(id_user,arrColorLevel=null){
        if(arrColorLevel==null){
            //if arrColorLevel provided we dont need to read it from db
            var userData = await getCardUserStatusData(id_user);
            arrColorLevel = [
                userData[DBM_Card_User_Data.columns.color_level_blue], userData[DBM_Card_User_Data.columns.color_level_green],
                userData[DBM_Card_User_Data.columns.color_level_pink], userData[DBM_Card_User_Data.columns.color_level_purple],
                userData[DBM_Card_User_Data.columns.color_level_red], userData[DBM_Card_User_Data.columns.color_level_white],
                userData[DBM_Card_User_Data.columns.color_level_yellow]
            ]
        } else {
            arrColorLevel = [ 
                arrColorLevel[DBM_Card_User_Data.columns.color_level_blue], arrColorLevel[DBM_Card_User_Data.columns.color_level_green],
                arrColorLevel[DBM_Card_User_Data.columns.color_level_pink], arrColorLevel[DBM_Card_User_Data.columns.color_level_purple],
                arrColorLevel[DBM_Card_User_Data.columns.color_level_red], arrColorLevel[DBM_Card_User_Data.columns.color_level_white],
                arrColorLevel[DBM_Card_User_Data.columns.color_level_yellow]
            ];
        }

        var total = 0;
        for(var i = 0; i < arrColorLevel.length; i++) 
            total += arrColorLevel[i];
        
        return Math.ceil(total / arrColorLevel.length);
    }

}

const Skills = require('../card/Skills');

const TradeBoard = require('../card/TradeBoard');

const Quest = require('../card/Quest');

const StarTwinkle = require('../card/spack/Star_Twinkle');

class Embeds{
    static precureAvatarView(embedColor,userUsername,userAvatarUrl,packName,
        level,hp,atk,level_special,thumbnail,cardId,rarity,type=Properties.cardCategory.normal.value,
        henshinForm="normal"){
        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = Properties.dataCardCore[packName].transform_quotes;
        // if("transform_super_quotes" in Properties.dataCardCore[packName]){
        //     transformQuotes = Properties.dataCardCore[packName].transform_super_quotes;
        // }

        var imgTransformation = Properties.dataCardCore[packName].icon;//default transformation image

        if("img_transformation" in Properties.dataCardCore[packName]){
            if(Properties.dataCardCore[packName].img_transformation.length>0){
                imgTransformation = GlobalFunctions.randomArrayItem(Properties.dataCardCore[packName].img_transformation);
            }
        }
        
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: Properties.dataCardCore[packName].henshin_phrase,
            description: transformQuotes,
            fields:[
                {
                    name:`${rarity}⭐ ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                    value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                    inline:true
                }
            ],
            // thumbnail:{
            //     url:selectedIcon
            // },
            image:{ url:imgTransformation },
            footer:{ text:`Cure Avatar ID: ${cardId}` }
        }

        var henshinFormData = null;
        if(henshinForm.toLowerCase()=="normal"){
            objEmbed.thumbnail = { url:Properties.dataCardCore[packName].icon }
        } else {
            henshinFormData = Properties.dataCardCore[packName].form[henshinForm];
            objEmbed.title = henshinFormData.quotes_head;
            objEmbed.description = henshinFormData.quotes_description;
            objEmbed.thumbnail = { url:henshinFormData.img_url }
            objEmbed.fields = [
                {
                    name:`${rarity}⭐ ${henshinFormData.name} Lv.${level}`,
                    value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                    inline:true
                }
            ]
        }

        switch(type){
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                if(henshinForm=="normal"){
                    objEmbed.fields = [
                        {
                            name:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ Gold ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                            value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }
                    ];
                } else {
                    objEmbed.fields = [
                        {
                            name:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ Gold ${henshinFormData.name} Lv.${level}`,
                            value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }
                    ];
                }
                
                break;
        }
        
        return new MessageEmbed(objEmbed);
    }

    static battleSpecialActivated(embedColor,userUsername,userAvatarUrl,packName,
        level_special,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}**!`,
            description: `**${Properties.dataCardCore[packName].alter_ego}** has used the special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            },
        });
    }

    static teamBattleSpecialActivated(embedColor,userUsername,userAvatarUrl,seriesName,packName,teamName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.seriesCardCore[seriesName].special_name}**!`,
            description: `**${teamName}** has used the team special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Party Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            },
        });
    }

    static teamBattleSpecialActivatedHitOne(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}**!`,
            description: `**${userUsername}** has used the special attack and take down **${embedColor}** color!`,
            fields: [
                {
                    name:"Party Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            },
        });
    }

    static battleSpecialReady(userUsername,userAvatarUrl,individual=true){
        var txtDescription = `Your special point is ready now! You can use the special attack on the next battle spawn.`;
        if(!individual){
            txtDescription = `Your party special point has been fully charged!.`;
        }
        return new MessageEmbed({
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Special Point Fully Charged!`,
            description: txtDescription,
            thumbnail:{
                url:Properties.imgResponse.imgOk
            }
        });
    }

    static battleHitHpSuccess(embedColor,packName,userUsername,userAvatarUrl,txtDescription,txtBuffDebuff,txtReward,txtHp){
        if(txtBuffDebuff!=""){
            txtBuffDebuff = `\n\n**Status Effects:**\n${txtBuffDebuff}`;
        }

        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Nice Hit!`,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `${txtDescription}${txtBuffDebuff}`,
            fields:[
                {
                    name:`Contribution Rewards:`,
                    value:`${txtReward}`
                },
                {
                    name:`💔 Tsunagarus Hp:`,
                    value:`${txtHp}`
                }
            ]
        }

        return new MessageEmbed(objEmbed);
    }

    static battleEnemyActions(enemyType,txtHeader,txtDescription,txtSpawnLink=""){
        var objEmbed = {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor,
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            title: txtHeader,
            description: txtDescription
        }

        if(txtSpawnLink!=""){
            objEmbed.fields = {
                name:"Spawn Link:",
                value:`[Jump To Enemy Spawn](${txtSpawnLink})`
            }
        }

        return new MessageEmbed(objEmbed);
    }

    static battleEnemyActionsBlock(embedColor,packName,userUsername,userAvatarUrl,txtHeader,txtDescription){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            title: txtHeader,
            description: `${txtDescription}`
        }
        
        return new MessageEmbed(objEmbed);
    }

    static battleEnemyActionsPrepare(enemyType,txtHeader,txtDescription){
        var objEmbed = {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor,
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            title: `Next Actions: ${txtHeader}`,
            description: `${enemyType} will prepare: **${txtDescription}** for the next actions!`
        }

        return new MessageEmbed(objEmbed);
    }

    static battleHitHpFail(embedColor,enemyType,userUsername,userAvatarUrl,txtHeader,txtDescription,txtHp){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: txtHeader,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            description: txtDescription,
            fields:[
                {
                    name:`💔 Tsunagarus Hp:`,
                    value:`${txtHp}`
                },
            ]
        }

        return new MessageEmbed(objEmbed);
    }

    static battleWin(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `With the help of **${Properties.dataCardCore[packName].alter_ego}**, **${userUsername}** has won the battle against tsunagarus!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        })
    }

    static battleLost(userUsername,userAvatarUrl,_description,rewardsReceived,debuff_data="",txtSpawnLink){
        var objEmbed = {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Defeated!`,
            thumbnail:{
                url:Properties.imgResponse.imgFailed
            },
            description: _description,
            fields: []
        }

        objEmbed.fields[objEmbed.fields.length] =  {
            name:"Battle Rewards:",
            value:rewardsReceived,
            inline:true
        }

        if(debuff_data!=""){
            objEmbed.fields[objEmbed.fields.length] = {
                name : "⬇️ Debuff inflicted!",
                value: `**${StatusEffect.debuffData[debuff_data].name}**:\n${StatusEffect.debuffData[debuff_data].description}`,
                inline:true
            }
        }

        objEmbed.fields[objEmbed.fields.length] =  {
            name:"Spawn Link:",
            value:`[Jump To Enemy Spawn](${txtSpawnLink})`,
            inline:true
        }
        
        return new MessageEmbed(objEmbed);
    }

    static teamBattleWin(packName,seriesName,partyName,txtReward){
        return new MessageEmbed({
            color: Properties.embedColor,
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${partyName}** has won the battle against tsunagarus!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            }
        })
    }

    static teamBattleHit(embedColor,packName,userUsername,userAvatarUrl,txtDescription,txtBuffDebuff,txtReward,txtSpawnLink){
        if(txtBuffDebuff!=""){
            txtBuffDebuff = `\n\n**Status Effects:**\n${txtBuffDebuff}`;
        }

        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Nice Hit!`,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `${txtDescription}${txtBuffDebuff}`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                },
                {
                    name:"Spawn Link:",
                    value:`[Jump To Enemy Spawn](${txtSpawnLink})`
                },
            ]
        }
        
        return new MessageEmbed(objEmbed);
    }

    static teamBattleLivesDown(embedColor,packName,userUsername,userAvatarUrl,txtReward){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Color Down!`,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${embedColor}** color has been taken down!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        }
        
        return new MessageEmbed(objEmbed);
    }

    static embedCardCaptureNew(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"New Card!",
            description: `**${username}** has received new card!`,
            thumbnail:{
                url:Properties.imgResponse.imgOk
            },
            fields:[
                {
                    name:"Rewards:",
                    value:`>**New Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static embedCardCaptureDuplicate(embedColor,id_card,
    cardName,pointReward,seriesCurrency,imgUrl,avatarImgUrl,username,seriesPoint=0,cardQty=1){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"Duplicate Card",
            description: `**${username}** has received another duplicate card.`,
            thumbnail:{
                url:imgUrl
            },
            fields:[
                {
                    name:"Rewards:",
                    value:`>**${cardQty}x Dup Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static embedCardCaptureDuplicateMaxCard(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"Duplicate Card",
            description: `**${username}** cannot receive another dupe of this card anymore.`,
            fields:[
                {
                    name:"Rewards:",
                    value:`>**Overcapped Dup Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static embedCardDetail(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,receivedDate,
        level,max_hp,max_atk,special_level,stock=0,ability1,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
    
        var customReceivedDate = GlobalFunctions.convertDateTime(receivedDate);
    
        var txtPartyAbility = "-";
        if(ability1 in StatusEffect.partyBuffData)
            txtPartyAbility = `**${StatusEffect.partyBuffData[ability1].name}:**\n${StatusEffect.partyBuffData[ability1].description}`;
    
        var embedColor = Properties.dataCardCore[packName].color;
        var skillsData = Properties.dataColorCore[embedColor].skills[1];
        var skillsCpCost = Properties.dataColorCore[embedColor].skills[1].cp_cost;
        var skillsName = skillsData.buff_data.name;
        var skillsDescription = skillsData.buff_data.description;
    
        var objEmbed = {
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} | Next CP: ${Leveling.getNextCardExp(level)}`
            },
            title:`${cardName}`,
            description:`**Party Ability:**\n>${txtPartyAbility}\n\n**Battle Skills:**\n>**${skillsName} (${skillsCpCost} CP)**:\n${skillsDescription}`,
            image:{ url:imgUrl },
            fields:[
                {
                    name:"ID:",
                    value:id_card,
                    inline:true
                },
                {
                    name:"Series:",
                    value:series,
                    inline:true
                },
                {
                    name:"Rarity:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                    inline:true
                },
                {
                    name:`❤️HP:`,
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`Received at: ${customReceivedDate}`
            }
        }
    
        //modify the card
        switch(type){
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory.gold.color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }
    
        if(stock>=1) objEmbed.footer.text+= ` | Dup:${stock}`;
        return new MessageEmbed(objEmbed);
    }

    static embedCardCapture(embedColor,id_card,packName,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,currentCardTotal,
        max_hp,max_atk,cardStock=0){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here
    
        var objEmbed = {
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`${GlobalFunctions.capitalize(packName)} Card Pack`
            },
            title:cardName,
            image:{
                url:imgUrl
            },
            fields:[
                {
                    name:"ID:",
                    value:id_card,
                    inline:true
                },
                {
                    name:"Series:",
                    value:series,
                    inline:true
                },
                {
                    name:"Rarity:",
                    value:`${String(rarity)} :star:`,
                    inline:true
                },
                {
                    name:"HP:",
                    value:`${String(max_hp)}`,
                    inline:true
                },
                {
                    name:"Atk:",
                    value:`${Status.getAtk(1,max_atk)}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:Properties.dataCardCore[packName].special_attack,
                    inline:true
                }
            ]
        }
    
        if(cardStock>=1){
            objEmbed["footer"] = {
                iconURL:avatarImgUrl,
                text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total}) x${cardStock}`
            }
        } else {
            objEmbed["footer"] = {
                iconURL:avatarImgUrl,
                text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total})`
            }
        }
    
        return new MessageEmbed(objEmbed);
    }

    static embedCardLevelUp(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,totalLevelUp,
        level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here
    
        var hpHeader = "HP: "; var modifiedHp = "";
        var _color = Properties.dataCardCore[packName].color;
        _color = Properties.dataColorCore[_color].color;
        if(Status.getModifiedHp(level,max_hp)>0){
            hpHeader += Status.getHp(level,max_hp);
            modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
        }
    
        var objEmbed = {
            color:_color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} (Lv+ ${totalLevelUp}/Next CP: ${Leveling.getNextCardExp(level)})`
            },
            title:`${String(cardName)}`,
            thumbnail:{ url:imgUrl },
            fields:[
                {
                    name:"❤️HP:",
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:"Rarity/Series:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ ${series}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`ID Card: ${id_card}`
            }
        }
    
        switch(type){
            //override color from card type
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }

        return new MessageEmbed(objEmbed);
    }

    static cardLevelUpDefault(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,totalLevelUp,
        level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here
    
        var hpHeader = "HP: "; var modifiedHp = "";
        var _color = Properties.dataCardCore[packName].color;
        _color = Properties.dataColorCore[_color].color;
        if(Status.getModifiedHp(level,max_hp)>0){
            hpHeader += Status.getHp(level,max_hp);
            modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
        }
    
        var objEmbed = {
            color:_color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} (Next CP: ${Leveling.getNextCardExp(level)})`
            },
            title:`${String(cardName)}`,
            thumbnail:{ url:imgUrl },
            fields:[
                {
                    name:"❤️HP:",
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:"Rarity/Series:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ ${series}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`ID Card: ${id_card}`
            }
        }
    
        switch(type){
            //override color from card type
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }
        
        return new MessageEmbed(objEmbed);
    }

}

class Party {
    static maxPartyMembers = 6;//included with the leader
    static maxPartyPoint = 20;

    static async searchPartyStatusData(id_guild,id_user){
        //search either leader/member
        var query = `SELECT * 
        FROM ${DBM_Card_Party.TABLENAME} 
        WHERE (${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.id_user}=?) OR 
        (${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.party_data} like '%${id_user}%') 
        LIMIT 1`;

        var arrParameterized = [id_guild,id_user,id_guild];
        var result = await DBConn.conn.promise().query(query, arrParameterized);
        result = result[0][0];
        if(result==null){
            return null;
        } else {
            return result;
        }
    }

    static async getPartyStatusData(id_guild,id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Party.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_Party.TABLENAME,parameterWhere);
        if(resultCheckExist[0][0]==null){
            //insert if not found
            return null;
        } else {
            return await resultCheckExist[0][0];
        }
    }

    static async getPartyStatusDataByIdParty(id_party){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Party.columns.id,id_party);
        var resultCheckExist = await DB.select(DBM_Card_Party.TABLENAME,parameterWhere);
        resultCheckExist = resultCheckExist[0][0];
        if(resultCheckExist==null){
            //insert if not found
            return null;
        } else {
            return await resultCheckExist;
        }
    }

    static async getAllStatus(id_party){
        //total status:
        var objReturn = {
            status_effect:null,
            synergy:false,
            synergy_series:null,
            data_user:{},
            id_leader:"",
            partyData:null
        };
        var synergySeries = "";
        var partyStatusData = await this.getPartyStatusDataByIdParty(id_party);
        objReturn.partyData = partyStatusData;
        var userData = await getCardUserStatusData(partyStatusData[DBM_Card_Party.columns.id_user]);

        //get leader status
        if(userData[DBM_Card_User_Data.columns.card_id_selected]!=null){
            objReturn.id_leader = partyStatusData[DBM_Card_Party.columns.id_user];
            // objReturn.id_all_user.push(partyStatusData[DBM_Card_Party.columns.id_user]);
            var cardData = await getCardData(userData[DBM_Card_User_Data.columns.card_id_selected]);
            objReturn.synergy = true;
            synergySeries = cardData[DBM_Card_Data.columns.series];
            // objReturn.card_id.push(userData[DBM_Card_User_Data.columns.card_id_selected]);

            objReturn.data_user[partyStatusData[DBM_Card_Party.columns.id_user]] = cardData[DBM_Card_Data.columns.id_card];

            objReturn.status_effect = cardData[DBM_Card_Data.columns.ability1];
            objReturn.synergy_series = synergySeries;
        } else {
            objReturn.data_user[partyStatusData[DBM_Card_Party.columns.id_user]] = "";
        }

        //member status
        if(partyStatusData[DBM_Card_Party.columns.party_data]!=null){
            var splittedUserId = partyStatusData[DBM_Card_Party.columns.party_data].split(",");
            for(var i=0;i<splittedUserId.length;i++){
                var cardUserData = await getCardUserStatusData(splittedUserId[i]);
                // objReturn.id_all_user.push(splittedUserId[i]);
                if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){

                    var cardData = await getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                    objReturn.data_user[splittedUserId[i]] = cardData[DBM_Card_Data.columns.id_card];

                    //check for synergy
                    if(synergySeries!=""&&synergySeries!=cardData[DBM_Card_Data.columns.series]){
                        objReturn.synergy = false;
                    }
                } else {
                    objReturn.data_user[splittedUserId[i]] = "";
                }
            }
        }
        

        return objReturn;
    }

    static async updateParty(id_guild,id_user,party_name){
        var partyData = await this.getPartyStatusData(id_guild,id_user);
        if(partyData==null){
            //insert if not found
            var parameter = new Map();
            parameter.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameter.set(DBM_Card_Party.columns.id_user,id_user);
            parameter.set(DBM_Card_Party.columns.name,party_name);
            await DB.insert(DBM_Card_Party.TABLENAME,parameter);
        } else {
            //update party name if found
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.name,party_name);

            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id_user,id_user);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        }

        //reselect the data again
        var partyData = await this.getPartyStatusData(id_guild,id_user);
        return partyData;
    }

    static async joinParty(id_guild,id_party,id_user){
        var objEmbed ={
            color: Properties.embedColor
        };

        var partyData = await this.getPartyStatusDataByIdParty(id_party);

        //select if user is member from party/not
        var query = `SELECT * 
        FROM ${DBM_Card_Party.TABLENAME} 
        WHERE ${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.party_data} like '%${id_user}%'`;
        var arrParameterized = [id_guild];
        var checkUserMember = await DBConn.conn.promise().query(query, arrParameterized);
        checkUserMember = checkUserMember[0][0];
        if(checkUserMember!=null){
            objEmbed.thumbnail = {
                url:Properties.imgResponse.imgError
            }
            objEmbed.description = `:x: You cannot join another party while you're still on the party.`;
            return objEmbed;
        }

        if(partyData[DBM_Card_Party.columns.party_data]==null||partyData[DBM_Card_Party.columns.party_data]==""){
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.party_data,id_user);

            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id,id_party);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        } else {
            //check for current party total
            var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
            if(splittedUserId.length>=this.maxPartyMembers-1){
                objEmbed.thumbnail = {
                    url:Properties.imgResponse.imgError
                }
                objEmbed.description = `:x: Sorry, this party already full.`;
                return objEmbed;
            }

            //update the party data
            var tempPartyData = partyData[DBM_Card_Party.columns.party_data];
            tempPartyData+=`,${id_user}`;
            
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.party_data,tempPartyData);
            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id,id_party);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        }

        //reset the precure avatar
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

        //reselect the data
        var partyData = await this.getPartyStatusDataByIdParty(id_party);
        var totalMembers = 1;
        var txtMembers = `><@${partyData[DBM_Card_Party.columns.id_user]}>\n`;
        var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
        for(var i=0;i<splittedUserId.length;i++){
            txtMembers+=`><@${splittedUserId[i]}>\n`;
            totalMembers++;
        }

        objEmbed.description = `You have joined the party: **${partyData[DBM_Card_Party.columns.name]}**.`;
        objEmbed.fields = [
            {
                name:`Party Members (${totalMembers}/${this.maxPartyMembers}):`,
                value:txtMembers,
                inline:true
            }
        ];
        objEmbed.footer = {
            text:`Party ID: ${partyData[DBM_Card_Party.columns.id]}`
        }

        return objEmbed;
    }

    static async updatePartyPoint(id_party,value){
        var maxPoint = Party.maxPartyPoint;
        var partyStatusData = await this.getPartyStatusDataByIdParty(id_party);
    
        var querySet = "";
    
        if(value>=1){
            //addition
            if(partyStatusData[DBM_Card_Party.columns.party_point]+value>=maxPoint){
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${maxPoint} `;
            } else {
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${DBM_Card_Party.columns.party_point}+${value} `;
            }
        } else {
            //substract
            if(partyStatusData[DBM_Card_Party.columns.party_point]-value<=0){
                querySet += ` ${DBM_Card_Party.columns.party_point} = 0 `;
            } else {
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${DBM_Card_Party.columns.party_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_Party.TABLENAME} 
        SET ${querySet} 
        WHERE ${DBM_Card_Party.columns.id}=?`;
    
        await DBConn.conn.promise().query(query, [id_party]);
    }

    static async updatePartySpecialPoint(id_party,value){
        var specialCharged = false;
        var maxPoint = 100;
        var partyStatusData = await Party.getPartyStatusDataByIdParty(id_party);
    
        var querySpecialPoint = "";
    
        if(value>=1){
            //addition
            if(partyStatusData[DBM_Card_Party.columns.special_point]+value>=maxPoint){
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${maxPoint} `;
                specialCharged = true;
            } else {
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${DBM_Card_Party.columns.special_point}+${value} `;
            }
        } else {
            //substract
            if(partyStatusData[DBM_Card_Party.columns.special_point]-value<=0){
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = 0 `;
            } else {
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${DBM_Card_Party.columns.special_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_Party.TABLENAME} 
        SET ${querySpecialPoint} 
        WHERE ${DBM_Card_Party.columns.id}=?`;
    
        await DBConn.conn.promise().query(query, [id_party]);
        return specialCharged;
    }

}

class User {

}

//get 1 card data
async function getAllCardDataByPack(card_pack){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Data.columns.pack,card_pack);
    var parameterOrderBy = new Map();
    parameterOrderBy.set(DBM_Card_Data.columns.id_card,"asc");
    var result = await DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere,parameterOrderBy);
    return result[0];
}

async function getCardData(id_card) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Data.columns.id_card,id_card);
    var result = await DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere);
    return result[0][0];
}

async function getCardInventoryUserData(id_user,id_card) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.selectAll(DBM_Card_Inventory.TABLENAME,parameterWhere);
    return result[0][0];
}

//deprecated
const embedBioPackList = {
    color: Properties.embedColor,
    title : `Character List`,
    fields : [{
        name: `Pink`,
        value: `Nagisa\nSaki\nNozomi\nLove\nTsubomi\nHibiki\nMiyuki\nMana\nMegumi\nHaruka\nMirai\nIchika\nHana\nHikaru\nNodoka`,
        inline: true
    },
    {
        name: `Blue`,
        value: `Karen\nMiki\nErika\nEllen\nReika\nRikka\nHime\nMinami\nAoi\nSaaya\nYuni\nChiyu`,
        inline: true
    },
    {
        name: `Yellow`,
        value: `Hikari\nUrara\nInori\nItsuki\nAko\nYayoi\nAlice\nYuko\nKirara\nHimari\nHomare\nElena\nHinata`,
        inline: true
    },
    {
        name: `Purple`,
        value: `Yuri\nMakoto\nIona\nRiko\nYukari\nAmour\nMadoka\nKurumi`,
        inline: true
    },
    {
        name: `Red`,
        value: `Rin\nSetsuna\nAkane\nAguri\nTowa\nAkira\nEmiru`,
        inline: true
    },
    {
        name: `Green`,
        value: `Komachi\nNao\nKotoha\nCiel\nLala`,
        inline: true
    },
    {
        name: `White`,
        value: `Honoka\nMai\nKanade`,
        inline: true
    }]
}

//deprecated
const embedCardPackList = {
    color: Properties.embedColor,
    title : `Card Pack List`,
    fields : [{
        name: `Pink`,
        value: `Nagisa\nSaki\nNozomi\nLove\nTsubomi\nHibiki\nMiyuki\nMana\nMegumi\nHaruka\nMirai\nIchika\nHana\nHikaru\nNodoka`,
        inline: true
    },
    {
        name: `Blue`,
        value: `Karen\nMiki\nErika\nEllen\nReika\nRikka\nHime\nMinami\nAoi\nSaaya\nYuni\nChiyu`,
        inline: true
    },
    {
        name: `Yellow`,
        value: `Hikari\nUrara\nInori\nItsuki\nAko\nYayoi\nAlice\nYuko\nKirara\nHimari\nHomare\nElena\nHinata`,
        inline: true
    },
    {
        name: `Purple`,
        value: `Yuri\nMakoto\nIona\nRiko\nYukari\nRuru\nMadoka\nKurumi`,
        inline: true
    },
    {
        name: `Red`,
        value: `Rin\nSetsuna\nAkane\nAguri\nTowa\nAkira\nEmiru`,
        inline: true
    },
    {
        name: `Green`,
        value: `Komachi\nNao\nKotoha\nCiel\nLala`,
        inline: true
    },
    {
        name: `White`,
        value: `Honoka\nMai\nKanade`,
        inline: true
    }]
}

//get 1 card user data
async function getCardUserStatusData(id_user){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
    var resultCheckExist = await DB.select(DBM_Card_User_Data.TABLENAME,parameterWhere);
    if(resultCheckExist[0][0]==null){
        //insert if not found
        var parameter = new Map();
        parameter.set(DBM_Card_User_Data.columns.id_user,id_user);
        await DB.insert(DBM_Card_User_Data.TABLENAME,parameter);
        //reselect after insert new data
        parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_User_Data.TABLENAME,parameterWhere);
        return await resultCheckExist[0][0];
    } else {
        return await resultCheckExist[0][0];
    }
}

async function checkUserHaveCard(id_user,id_card){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return await true;
    } else {
        return await false;
    }
}

async function getUserCardInventoryData(id_user,id_card){
    //return the stock if existed
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return result[0][0];
    } else {
        return null;
    }
}

async function getUserCardStock(id_user,id_card){
    //return the stock if existed
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return result[0][0][DBM_Card_Inventory.columns.stock];
    } else {
        return -1;
    }
}

async function getUserTotalCard(id_user,pack){
    var query = `select cd.${DBM_Card_Data.columns.pack},count(inv.${DBM_Card_Inventory.columns.id_user}) as total
    from ${DBM_Card_Data.TABLENAME} cd, ${DBM_Card_Inventory.TABLENAME} inv 
    where cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
    inv.${DBM_Card_Inventory.columns.id_user}=? and 
    cd.${DBM_Card_Data.columns.pack} = ?`;
    var arrParameterized = [id_user,pack];
    var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
    return cardDataInventory[0][0].total;
}

async function updateCatchAttempt(id_user,spawn_token,objColor=null,objSeries=null){
    //update catch attempt, add color exp in object if parameter existed
    //get color point
    var maxColorPoint = Properties.limit.colorpoint;
    var maxSeriesPoint = Properties.limit.seriespoint;
    var cardUserStatusData = await getCardUserStatusData(id_user);
    var arrParameterized = [];
    arrParameterized.push(spawn_token);
    var queryColor = ""; var querySeriesPoint = "";
    
    if(objColor!=null){
        for (const [key, value] of objColor.entries()) {
            //get current color point
            // var selectedColor = `color_point_${key}`;
            if(cardUserStatusData[key]+value>=maxColorPoint){
                queryColor += `, ${key} = ${maxColorPoint}, `;
            } else {
                queryColor += `, ${key} = ${key}+${value}, `;
            }
        }
        queryColor = queryColor.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    if(objSeries!=null){
        for (const [key, value] of objSeries.entries()) {
            //get current series point
            if(cardUserStatusData[key]+value>=maxSeriesPoint){
                querySeriesPoint += `, ${key} = ${maxSeriesPoint}, `;
            } else {
                querySeriesPoint += `, ${key} = ${key}+${value}, `;
            }
        }
        querySeriesPoint = querySeriesPoint.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${DBM_Card_User_Data.columns.spawn_token}=? ${queryColor} ${querySeriesPoint} 
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
    arrParameterized.push(id_user);

    await DBConn.conn.promise().query(query, arrParameterized);
}

async function checkCardCompletion(id_guild,id_user,category,value){
    
    //category parameter: color/pack
    //check if user founded on leaderboard/not
    var queryCompletion = `select count(*) as total 
        FROM ${DBM_Card_Leaderboard.TABLENAME} 
        WHERE ${DBM_Card_Leaderboard.columns.id_guild}=? AND 
        ${DBM_Card_Leaderboard.columns.id_user}=? AND 
        ${DBM_Card_Leaderboard.columns.category}=? AND 
        ${DBM_Card_Leaderboard.columns.completion}=?`;
    var checkLeaderboardExists = await DBConn.conn.promise().query(queryCompletion, [id_guild,id_user,category,value]);
    if(checkLeaderboardExists[0][0]["total"]>=1){
        return false;
    }

    switch(category){
        case "color":
            //check color set completion:
            var queryColorCompletion = `select count(ci.${DBM_Card_Inventory.columns.id_card}) as total 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd 
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.color}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,id_user];
            var checkColorCompletion = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
            if(checkColorCompletion[0][0]["total"]>=Properties.dataColorCore[value].total){
                return true;
            }
            break;
        case "pack":
            //pack category
            var currentTotalCard = await getUserTotalCard(id_user,value);
            var maxTotalCard = Properties.dataCardCore[value].total;
            if(currentTotalCard>=maxTotalCard){
                return true;
            }
            break;
        case "color_gold":
            //check color set completion:
            var queryColorCompletion = `select count(ci.${DBM_Card_Inventory.columns.id_card}) as total 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.color}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=? and
            ci.${DBM_Card_Inventory.columns.is_gold}=1`;
            var arrParameterized = [value,id_user];
            var checkColorCompletion = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
            if(checkColorCompletion[0][0]["total"]>=Properties.dataColorCore[value].total){
                return true;
            }
            break;
        case "pack_gold":
            var query = `select count(inv.${DBM_Card_Inventory.columns.id_user}) as total 
            from ${DBM_Card_Data.TABLENAME} cd 
            left join ${DBM_Card_Inventory.TABLENAME} inv 
            on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
            cd.${DBM_Card_Data.columns.pack}=? and 
            inv.${DBM_Card_Inventory.columns.id_user}=? and inv.${DBM_Card_Inventory.columns.is_gold}=1`;

            var arrParameterized = [value,id_user];
            var checkPackCompletion = await DBConn.conn.promise().query(query, arrParameterized);
            if(checkPackCompletion[0][0]["total"]>=Properties.dataCardCore[value].total){
                return true;
            }
            break;
        case "series":
            //check color set completion:
            var query = `select count(ci.${DBM_Card_Inventory.columns.id_user}) as total_inventory,(select count(cd.${DBM_Card_Data.columns.id_card}) as total_series 
            from ${DBM_Card_Data.TABLENAME} cd 
            where cd.${DBM_Card_Data.columns.series}=?) as total_series 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd 
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.series}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,value,id_user];
            var completionData = await DBConn.conn.promise().query(query, arrParameterized);
            if(completionData[0][0]["total_inventory"]>=completionData[0][0]["total_series"]){
                return true;
            }
            break;
        case "series_gold":
            var query = `select count(ci.${DBM_Card_Inventory.columns.id_user}) as total_inventory,(select count(cd.${DBM_Card_Data.columns.id_card}) as total_series 
            from ${DBM_Card_Data.TABLENAME} cd 
            where cd.${DBM_Card_Data.columns.series}=?) as total_series 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd 
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.series}=? and 
            ci.${DBM_Card_Inventory.columns.is_gold}=1 and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,value,id_user];
            var completionData = await DBConn.conn.promise().query(query, arrParameterized);
            if(completionData[0][0]["total_inventory"]>=completionData[0][0]["total_series"]){
                return true;
            }
            break;
    }

    return false;
}

async function leaderboardAddNew(id_guild,id_user,imgAvatarUrl,_color,category,completion){
    //check if leaderboard data exists/not
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Leaderboard.columns.id_guild,id_guild);
    parameterWhere.set(DBM_Card_Leaderboard.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Leaderboard.columns.category,category);
    parameterWhere.set(DBM_Card_Leaderboard.columns.completion,completion);
    var checkExistsLeaderboard = await DB.select(DBM_Card_Leaderboard.TABLENAME,parameterWhere);
    if(checkExistsLeaderboard[0][DBM_Card_Leaderboard.columns.id_user]==null){
        var parameterNew = new Map();
        parameterNew.set(DBM_Card_Leaderboard.columns.id_guild,id_guild);
        parameterNew.set(DBM_Card_Leaderboard.columns.id_user,id_user);
        parameterNew.set(DBM_Card_Leaderboard.columns.category,category);
        parameterNew.set(DBM_Card_Leaderboard.columns.completion,completion);
        await DB.insert(DBM_Card_Leaderboard.TABLENAME,parameterNew);
        
        //prepare the completion date
        var completionDate = new Date();
        var dd = String(completionDate.getDate()).padStart(2, '0');
        var mm = String(completionDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = completionDate.getFullYear();
        completionDate = dd + '/' + mm + '/' + yyyy;

        var objEmbed = {
            color: _color
        }
        
        switch(category){
            case "color":
                //color completed
                objEmbed.title = `Card Color Set ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has become the new master of cure **${completion}**!`;
                objEmbed.thumbnail = {
                    url:imgAvatarUrl
                }
                break;
            case "pack":
                //pack completed
                objEmbed.title = `${GlobalFunctions.capitalize(completion)} Card Pack Completed!`;
                objEmbed.description = `<@${id_user}> has completed the card pack: **${completion}**!`;
                objEmbed.thumbnail = {
                    url:Properties.dataCardCore[completion].icon
                }
                break;
            case "series":
                //pack completed
                objEmbed.title = `Card Series ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has completed the card series: **${completion}**!`;
                objEmbed.thumbnail = {
                    url:Properties.seriesCardCore[completion].icon
                }
                break;
            case "color_gold":
                //color completed
                objEmbed.color = Properties.cardCategory.gold.color;
                objEmbed.title = `Gold ${GlobalFunctions.capitalize(completion)} Set Completed!`;
                objEmbed.description = `<@${id_user}> has become the new master of gold cure **${completion}**!✨`;
                objEmbed.thumbnail = {
                    url:imgAvatarUrl
                }
                break;
            case "pack_gold":
                //pack completed
                objEmbed.color = Properties.cardCategory.gold.color;
                objEmbed.title = `Gold ${GlobalFunctions.capitalize(completion)} Pack Completed!`;
                objEmbed.description = `<@${id_user}> has completed the gold card pack: **${completion}**!✨`;
                objEmbed.thumbnail = {
                    url:Properties.dataCardCore[completion].icon
                }
                break;
            case "series_gold":
                //pack completed
                objEmbed.color = Properties.cardCategory.gold.color;
                objEmbed.title = `Gold Series ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has completed the gold series: **${completion}**!✨`;
                objEmbed.thumbnail = {
                    url:Properties.seriesCardCore[completion].icon
                }
                break;
        }

        objEmbed.footer = {
            iconURL:imgAvatarUrl,
            text:`Completed at: ${completionDate}`
        };

        return new MessageEmbed(objEmbed);

    } else {
        return null;
    }
}

function getNextColorPoint(level){
    return level*100;
}

function getBonusCatchAttempt(level){
    //starting from level 2: every level get 5% catch bonus
    if(level>=2){
        return (level*5)-5;
    } else {
        return 0;
    }
}

async function updateColorPoint(id_user,objColor){
    //get color point
    var maxColorPoint = Properties.limit.colorpoint;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var queryColor = "";
    for (const [key, value] of objColor.entries()) {
        //get current color point
        // var selectedColor = `color_point_${key}`;
        if(value>=1){
            //addition
            if(cardUserStatusData[key]+value>=maxColorPoint){
                queryColor += ` ${key} = ${maxColorPoint}, `;
            } else {
                queryColor += ` ${key} = ${key}+${value}, `;
            }
        } else {
            //substract
            if(cardUserStatusData[key]-value<=0){
                queryColor += ` ${key} = 0, `;
            } else {
                queryColor += ` ${key} = ${key}${value}, `;
            }
        }
    }

    if(objColor!=null){
        queryColor = queryColor.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${queryColor}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}

async function updateMofucoin(id_user,value){
    var maxCoin = Properties.limit.mofucoin;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var queryCoin = "";

    if(value>=1){
        //addition
        if(cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]+value>=maxCoin){
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${maxCoin} `;
        } else {
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}+${value} `;
        }
    } else {
        //substract
        if(cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]-value<=0){
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = 0 `;
        } else {
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}${value} `;
        }
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${queryCoin}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}

async function updateSeriesPoint(id_user,objSeries){
    //get series point
    var maxSeriesPoint = Properties.limit.seriespoint;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var querySeries = "";
    for (const [key, value] of objSeries.entries()) {
        //get current series point
        if(value>=1){
            //addition
            if(cardUserStatusData[key]+value>=maxSeriesPoint){
                querySeries += ` ${key} = ${maxSeriesPoint}, `;
            } else {
                querySeries += ` ${key} = ${key}+${value}, `;
            }
        } else {
            //substract
            if(cardUserStatusData[key]-value<=0){
                querySeries += ` ${key} = 0, `;
            } else {
                querySeries += ` ${key} = ${key}${value}, `;
            }
        }
    }

    if(objSeries!=null){
        querySeries = querySeries.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${querySeries}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}

async function removeCardGuildSpawn(id_guild,removeSpawnType=true,removeSpawnId=true,removeSpawnData=true){
    //erase all card spawn information
    var parameterSet = new Map();
    if(removeSpawnType){
        parameterSet.set(DBM_Card_Guild.columns.spawn_type,null);
    }
    if(removeSpawnId){
        parameterSet.set(DBM_Card_Guild.columns.spawn_id,null);
    }
    
    parameterSet.set(DBM_Card_Guild.columns.spawn_color,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_number,null);

    if(removeSpawnData){
        parameterSet.set(DBM_Card_Guild.columns.spawn_data,null);
    }
    
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function updateMessageIdSpawn(id_guild,id_message){
    //update the message id on card spawn
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.id_last_message_spawn,id_message);
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function generateCardSpawn(id_guild,specificType=null,overwriteToken = true,spawnData2=null,spawnData3=null){
    var cardGuildData = await CardGuildModules.getCardGuildData(id_guild);
    //reset guild timer information
    //update & erase last spawn information if overwriteToken param is provided
    if(overwriteToken) await removeCardGuildSpawn(id_guild);

    //start randomize the spawn
    var cardSpawnType = "normal";

    var rnd = GlobalFunctions.randomNumber(1,100);
    // battle:25,//25
    // quiz:20,//20
    // normal:20,
    // number:15,
    // color:10,
    // series:10
    if(rnd<Properties.objSpawnType.battle){
        cardSpawnType = "battle";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz){
        cardSpawnType = GlobalFunctions.randomNumber(0,1) == 0 ? "normal":"quiz";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number){
        cardSpawnType = "number";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.color+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.series){
        cardSpawnType = GlobalFunctions.randomNumber(0,1) == 0 ? "series":"color";
    } else {
        cardSpawnType = "battle";
    }

    if(specificType!=null) cardSpawnType=specificType;

    //for debugging purpose:
<<<<<<< Updated upstream:modules/Card.js
    // cardSpawnType = "normal";
=======
    cardSpawnType = "battle";
>>>>>>> Stashed changes:modules/backup/Card.js

    var query = "";
    var objFinalSend = {};
    var objEmbed = new MessageEmbed(objEmbed);
    objEmbed.color = Properties.embedColor;

    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.spawn_type,cardSpawnType); //set the spawn type
    if(overwriteToken){
        parameterSet.set(DBM_Card_Guild.columns.spawn_token,GlobalFunctions.randomNumber(0,100000)); //set & randomize the spawn token
    }
    switch(cardSpawnType) {
        case "color": // color spawn type
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Color Card";
            objEmbed.description = `A **color** card has appeared! Press **✨Catch!** button to capture this color card!`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
            objFinalSend.components =[DiscordStyles.Button.basic("card.catch_color","✨Catch!","PRIMARY")];

            break;
        case "series":
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Series Card";
            objEmbed.description = `A **series** card has appeared! Press **✨Catch!** button to capture this series card!`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
            objFinalSend.components =[DiscordStyles.Button.basic("card.catch_series","✨Catch!","PRIMARY")];
            break;
        case "number": //number spawn type
            //get color total:
            var rndNumber = GlobalFunctions.randomNumber(2,10);
            parameterSet.set(DBM_Card_Guild.columns.spawn_number,rndNumber);
            
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
            ${DBM_Card_Data.columns.rarity}<=?  
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[4,5]);
            parameterSet.set(DBM_Card_Guild.columns.spawn_id,resultData[0][0][DBM_Card_Data.columns.id_card]);
            parameterSet.set(DBM_Card_Guild.columns.spawn_color,resultData[0][0][DBM_Card_Data.columns.color]);
            objEmbed.color = Properties.dataColorCore[resultData[0][0][DBM_Card_Data.columns.color]].color;
            var selectedColor = resultData[0][0][DBM_Card_Data.columns.color];

            objEmbed.author = {
                name:`Number Card: ${GlobalFunctions.capitalize(selectedColor)} Edition`
            }
            objEmbed.title = ":game_die: It's Lucky Numbers Time!";
            objEmbed.description = `Guess whether the hidden number**(1-12)** will be **lower** or **higher** than the current number: **${rndNumber}**`;
            objEmbed.image = {
                url:Properties.dataColorCore[selectedColor].imgMysteryUrl
            }

            objEmbed.footer = {
                text:`⭐ Rarity: 4-5 | ⏫ Catch Rate: 100%`
            }

            //select menu start
<<<<<<< Updated upstream:modules/Card.js
            var arrOptions = [
                {
                    label: `Lower`,
                    value: `lower`,
                    description: `Hidden number is lower than ${rndNumber}`
                },
                {
                    label: `Higher`,
                    value: `higher`,
                    description: `Hidden number is higher than ${rndNumber}`
                }
            ];

            objFinalSend.components = [
                DiscordStyles.SelectMenus.basic("card.guess_number","Guess it lower/higher",arrOptions)
            ];
=======
            // var arrOptions = [
            //     {
            //         label: `Lower`,
            //         value: `lower`,
            //         description: `Hidden number is lower than ${rndNumber}`
            //     },
            //     {
            //         label: `Higher`,
            //         value: `higher`,
            //         description: `Hidden number is higher than ${rndNumber}`
            //     }
            // ];

            // objFinalSend.components = [
            //     DiscordStyles.SelectMenus.basic("card.guess_number","Guess it lower/higher",arrOptions)
            // ];

            objFinalSend.components = [DiscordStyles.Button.row([
                DiscordStyles.Button.base("card.guess_number.lower","▼ Lower","PRIMARY"),
                DiscordStyles.Button.base("card.guess_number.higher","▲ Higher","PRIMARY"),
            ])];
>>>>>>> Stashed changes:modules/backup/Card.js
            //select menu end
            
            break;
        
        case "quiz":
            var randomQuizType = GlobalFunctions.randomNumber(0,2);
            var query = ``;
            var resultData;
            // randomQuizType = 1;//for debugging purpose
            var subRandType = 0;
            switch(randomQuizType){
                case 1:
                    //quiztaccked
                    query = `SELECT * 
                    FROM ${DBM_Card_Data.TABLENAME} 
                    WHERE ${DBM_Card_Data.columns.rarity}=? 
                    ORDER BY rand() 
                    LIMIT 1`;
                    resultData = await DBConn.conn.promise().query(query,[5]);
                    break;
                case 2:
                    //star twinkle theme
                    subRandType = GlobalFunctions.randomNumber(0,1);
                    // subRandType = 1; //for debugging purpose

                    switch(subRandType){
                        case 0:
                            //star counting
                            query = `SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
                            ${DBM_Card_Data.columns.rarity}<=? AND 
                            ${DBM_Card_Data.columns.series}=? 
                            ORDER BY rand() 
                            LIMIT 1`;
                            resultData = await DBConn.conn.promise().query(query,[1,4,"star twinkle"]);
                            break;
                        case 1:
                            //fuwa constellation
                            //star counting
                            query = `SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
                            ${DBM_Card_Data.columns.rarity}<=? AND 
                            ${DBM_Card_Data.columns.series}=? 
                            ORDER BY rand() 
                            LIMIT 1`;
                            resultData = await DBConn.conn.promise().query(query,[4,5,"star twinkle"]);
                            break;
                    }
                    break;
                case 0:
                default:
                    query = `SELECT * 
                    FROM ${DBM_Card_Data.TABLENAME} 
                    WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
                    ${DBM_Card_Data.columns.rarity}<=? 
                    ORDER BY rand() 
                    LIMIT 1`;
                    resultData = await DBConn.conn.promise().query(query,[1,4]);
                    break;
            }

            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnColor = resultData[0][0][DBM_Card_Data.columns.color];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var arrAnswerList = [cardSpawnPack]; //prepare the answer list

            switch(randomQuizType){
                case 0:
                    //default quiz:
                    var alterEgo = Properties.dataCardCore[cardSpawnPack].alter_ego;
                    //get the other pack answer
                    var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.color} 
                    FROM ${DBM_Card_Data.TABLENAME} 
                    WHERE ${DBM_Card_Data.columns.pack}<>? 
                    GROUP BY ${DBM_Card_Data.columns.pack} 
                    ORDER BY rand() 
                    LIMIT 3`;
                    var resultDataAnotherAnswer = await DBConn.conn.promise().query(queryAnotherQuestion,[cardSpawnPack]);
                    resultDataAnotherAnswer[0].forEach(function(entry){
                        arrAnswerList.push(entry[DBM_Card_Data.columns.pack]);
                    })
        
                    //shuffle the answer
                    arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                    //get the answer
                    var answer = arrAnswerList.indexOf(cardSpawnPack);
                    switch(answer){
                        case 0: answer = "a"; break;
                        case 1: answer = "b"; break;
                        case 2: answer = "c"; break;
                        case 3: answer = "d"; break;
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

                    objFinalSend.components = [
                        DiscordStyles.SelectMenus.basic("card.answer_quiz","Select the answers",arrOptions)
                    ];
                    //select menu end
        
                    parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                    `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeNormal}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);
        
                    //prepare the embed:
                    objEmbed.title = `:grey_question: It's Quiz Time!`;
                    objEmbed.description = `The series theme/motif was about: **${Properties.spawnHintSeries[cardSpawnSeries]}** and I'm known as **${alterEgo}**. Who am I?`;
                    objEmbed.author = {
                        name:`Quiz Card`,
                    }
                    objEmbed.image ={
                        url:Properties.spawnData.quiz.embed_img
                    }
                    objEmbed.footer = {
                        text:`⭐ Rarity: 1-4`
                    }
                    break;
                case 1:
                    //quiztackked
                    var splittedText = Properties.dataCardCore[cardSpawnPack].fullname.split(" ");
                    var name = "";
                    for(var i=0;i<splittedText.length;i++){
                        name += `${GlobalFunctions.shuffleText(GlobalFunctions.shuffleText(splittedText[i]))} `;
                    }
                    name = name.toLowerCase()
    
                    //get the other pack answer
                    var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.color} 
                    FROM ${DBM_Card_Data.TABLENAME} 
                    WHERE ${DBM_Card_Data.columns.pack}<>? 
                    GROUP BY ${DBM_Card_Data.columns.pack} 
                    ORDER BY rand() 
                    LIMIT 3`;
                    var resultDataAnotherAnswer = await DBConn.conn.promise().query(queryAnotherQuestion,[cardSpawnPack]);
                    arrAnswerList[0] = `${GlobalFunctions.capitalize(cardSpawnSeries)} - ${GlobalFunctions.capitalize(cardSpawnColor)} Cure`;
                    var tempAnswer = arrAnswerList[0];
                    resultDataAnotherAnswer[0].forEach(function(entry){
                        arrAnswerList.push(`${GlobalFunctions.capitalize(entry[DBM_Card_Data.columns.series])} - ${GlobalFunctions.capitalize(entry[DBM_Card_Data.columns.color])} Cure`);
                    })
    
                    //shuffle the answer
                    arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                    //get the answer
                    var answer = arrAnswerList.indexOf(tempAnswer);
                    switch(answer){
                        case 0: answer = "a"; break;
                        case 1: answer = "b"; break;
                        case 2: answer = "c"; break;
                        case 3: answer = "d"; break;
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

                    objFinalSend.components = [
                        DiscordStyles.SelectMenus.basic("card.answer_quiz","Select the answers",arrOptions)
                    ];
                    //select menu end
        
                    parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                    `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeTsunagarus}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);
    
                    //prepare the embed:
                    objEmbed.description = `**${GlobalFunctions.capitalize(TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.term)}** has take over the quiz time!\nRearrange this provided hint: **${name}** and choose the correct branch!`;
                    objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.embedColor;
                    objEmbed.author = {
                        name:`Quiztaccked!`,
                    }
                    objEmbed.thumbnail = {
                        url:Properties.imgResponse.imgFailed
                    }
                    objEmbed.image ={
                        url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.image
                    }
                    objEmbed.footer = {
                        text:`⭐ Rarity: 5`
                    }
                    break;
                case 2:
                    //star twinkle
                    arrAnswerList = [];
                    switch(subRandType){
                        case 0:
                            //count star twinkle
                            objEmbed.author = {
                                name:`Star Twinkle Quiz Time!`,
                            }
                            objEmbed.title = `:grey_question: It's Star Twinkle Counting Time!`;
                            objEmbed.description = `How many stars on this spawn:\n`;
                            var totalStars = 0;
                            for(var i=0;i<5;i++){
                                var twinkleRandom = GlobalFunctions.randomNumber(2,10);
                                totalStars+=twinkleRandom;

                                for(var j=0;j<twinkleRandom;j++){
                                    objEmbed.description += `⭐`;
                                }
                                objEmbed.description += `\n`;
                            }

                            var answer = "";
                            arrAnswerList.push(totalStars);
                            for(var i=0;i<=2;i++){
                                var tempAnswer = GlobalFunctions.randomNumber(0,1) == 0 ? totalStars-GlobalFunctions.randomNumber(1,2+i) : totalStars+GlobalFunctions.randomNumber(1,2+i);

                                if(arrAnswerList.includes(tempAnswer)){
                                    i-=1;
                                } else {
                                    arrAnswerList.push(tempAnswer);
                                }
                            }

                            arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                            answer = arrAnswerList.indexOf(totalStars);

                            var arrOptions = [];
                            for(var i=0;i<arrAnswerList.length;i++){
                                arrOptions.push({
                                    label: `${arrAnswerList[i].toString()}`,
                                    description: `Answers with ${arrAnswerList[i]} stars`
                                });
                                switch(i){
                                    case 0: arrOptions[i].value = "a"; break;
                                    case 1: arrOptions[i].value = "b"; break;
                                    case 2: arrOptions[i].value = "c"; break;
                                    case 3: arrOptions[i].value = "d"; break;
                                }
                            }

                            objFinalSend.components = [
                                DiscordStyles.SelectMenus.basic("card.answer_quiz","Select the answers",arrOptions)
                            ];

                            switch(answer){
                                case 0:
                                    answer = "a";
                                    break;
                                case 1:
                                    answer = "b";
                                    break;
                                case 2:
                                    answer = "c";
                                    break;
                                case 3:
                                    answer = "d";
                                    break;
                            }

                            parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                            `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeStarTwinkleStarsCount}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}","${Properties.spawnData.quiz.totalStars}":${totalStars}}`);
                            
                            objEmbed.image ={
                                url:Properties.spawnData.quiz.embed_img
                            }
                            objEmbed.thumbnail = {
                                url:"https://static.wikia.nocookie.net/prettycure/images/5/51/STPC01_The_Fuwa_Constellation.jpg"
                            }
                            objEmbed.footer = {
                                text:`⭐ Rarity: 1-4`
                            }
                            break;
                        case 1:
                        default:
                            //star twinkle constellation
                            objEmbed.author = {
                                name:`Star Twinkle Quiz Time!`,
                            }
                            objEmbed.title = `:grey_question: It's Star Twinkle Constellation Time!`;
                            objEmbed.description = `Guess the correct fuwa constellation from this costume:\n`;

                            var randObj = GlobalFunctions.randomProperty(StarTwinkle.fuwaConstellation);
                            var answer = randObj.name; var randomImg = randObj.img_url[0];
                            arrAnswerList.push(randObj.name);
                            for(var i=0;i<=2;i++){
                                var tempAnswer = GlobalFunctions.randomProperty(StarTwinkle.fuwaConstellation);
                                if(arrAnswerList.includes(tempAnswer.name)){
                                    i-=1;
                                } else {
                                    arrAnswerList.push(tempAnswer.name);
                                }
                            }

                            arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                            arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                            answer = arrAnswerList.indexOf(answer);

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

                            objFinalSend.components = [
                                DiscordStyles.SelectMenus.basic("card.answer_quiz","Select the answers",arrOptions)
                            ];
                            //select menu end

                            switch(answer){
                                case 0: answer = "a"; break;
                                case 1: answer = "b"; break;
                                case 2: answer = "c"; break;
                                case 3: answer = "d"; break;
                            }

                            parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                            `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeStarTwinkleConstellation}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);

                            objEmbed.fields = [
                                {
                                    name:`Image Link`,
                                    value:`[Image Link](${randomImg})`,
                                    inline:true
                                },
                            ];

                            objEmbed.image = {
                                url:randomImg
                            }

                            objEmbed.footer = {
                                text:`⭐ Rarity: 4-5`
                            }

                            objEmbed.thumbnail = {
                                url:Properties.spawnData.quiz.embed_img
                            }
                            
                            break;
                    }
                    break;
            }
            
            break;
        case "battle":
            //battle: randomize the enemy type:
            var enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term;//default enemy type
            var randomType = GlobalFunctions.randomNumber(0,10);

            // randomType = 1;//for debug purpose only

            if(specificType!=null&&
            (spawnData2==null||spawnData3==null)){
                return;
            }

            if(spawnData2!=null){
                switch(spawnData2.toLowerCase()){
                    case TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term:
                        randomType=10;
                        break;
                    case TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.term:
                        randomType=6;
                        break;
                    case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term:
                        randomType=5;
                        break;
                    case TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term:
                        randomType=3;
                        break;
                    default:
                        randomType=0;
                        break;
                }
            }
            
            //get random enemy
            var query = `SELECT * 
            FROM ${DBM_Card_Enemies.TABLENAME} 
            ORDER BY rand() LIMIT 1`;
            var enemyData = await DBConn.conn.promise().query(query);
            enemyData = enemyData[0][0];
            var spawnSeries = enemyData[DBM_Card_Enemies.columns.series];

            var spawnData = "";

            if(randomType>=10){
                //barabaran
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;

                var cardRewardData = await DBConn.conn.promise().query(query,[6]);
                cardRewardData = cardRewardData[0][0];

                enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term;

                var randomMinLives = 2;

                //get the random series information
                var query = `SELECT ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color} 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.series}=?  
                GROUP BY ${DBM_Card_Data.columns.color} 
                ORDER BY rand() 
                LIMIT ${randomMinLives}`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0];

                var arrTempColor = [];
                var dtColor = "{";
                for(var i=0;i<cardDataSeriesWeakness.length;i++){
                    dtColor+=`"${cardDataSeriesWeakness[i][DBM_Card_Data.columns.color]}":0,`;
                    arrTempColor.push(cardDataSeriesWeakness[i][DBM_Card_Data.columns.color]);
                }
                dtColor = dtColor.replace(/,\s*$/, "");//remove last comma
                dtColor += "}";

                var spawnColorLivesParse = JSON.parse(dtColor);

                var lvR = 50;
                var randRarityMin = GlobalFunctions.randomNumber(5,6);
                var txtRarity = "?";
                if(GlobalFunctions.randomNumber(0,1)>0){
                    txtRarity=randRarityMin;
                }

                //randomize hp
                var baseHp = 20;//default hp
                var turnMax = GlobalFunctions.randomNumber(7,9);
                var colorGroup = arrTempColor.length;
                var turnBonus = GlobalFunctions.randomNumber(7,10);

                // var rndHp = baseHp;
                rndHp = Status.getAtk(lvR,baseHp)*turnMax;
                var dtTurn = `"${Properties.spawnData.battle.turn_mechanics}":${1},"${Properties.spawnData.battle.turn}":${1},"${Properties.spawnData.battle.turn_max}":${(turnMax*colorGroup)+turnBonus}`;

                //======PREPARE THE ACTIONS MECHANICS============
                //=====WHITE/BLACK FORCE START=====
                var randomIndexColor = GlobalFunctions.randomNumber(0,1);
                var dtActionsMechanics = `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.white_force}":"${arrTempColor[randomIndexColor]}",`;
                //invert the random color index
                if(randomIndexColor==0){
                    randomIndexColor = 1;
                } else {
                    randomIndexColor = 0;
                }

                //insert the second randomized color foce
                dtActionsMechanics += `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.black_force}":"${arrTempColor[randomIndexColor]}",`;
                //=====WHITE/BLACK FORCE END=====
                //=====SUNLIGHT/MOONLIGHT FORCE START=====
                var randomIndexColor = GlobalFunctions.randomNumber(0,1);
                dtActionsMechanics += `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force}":"${arrTempColor[randomIndexColor]}",`;
                //invert the random color index
                if(randomIndexColor==0){
                    randomIndexColor = 1;
                } else {
                    randomIndexColor = 0;
                }
                dtActionsMechanics += `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force}":"${arrTempColor[randomIndexColor]}",`;
                //=====SUNLIGHT/MOONLIGHT FORCE END=====
                //=====DELAYED PUNCH START=====
                var randPunch = GlobalFunctions.randomNumber(2,3);
                dtActionsMechanics += `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_punch}":${randPunch},`;
                //=====DELAYED KICK START=====
                var randKick = GlobalFunctions.randomNumber(2,4);
                dtActionsMechanics += `"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick}":${randKick}`;

                //======ACTIONS MECHANICS END============

                for (var key in spawnColorLivesParse) {
                    spawnColorLivesParse[key] = rndHp;
                }

                var dtHp = `"${Properties.spawnData.battle.color_lives}":${JSON.stringify(spawnColorLivesParse)},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                //hiddenize the color lives
                var textColor = arrTempColor.join(",");
                for(var i=0;i<textColor.length;i++){
                    if(i>0&&textColor[i]!=","){
                        textColor = textColor.replace(textColor[i],"?");
                    }
                }

                var splitted = textColor.split(",");
                var txtHpDisplay = "";
                splitted.forEach(item => {
                    txtHpDisplay+=`${txtRarity}⭐ ${item} : ${rndHp}/${rndHp}\n`;
                });

                //hiddenize the rarity
                //get the hint
                var hiddenEnemy = TsunagarusModules.Properties.enemySpawnData[cardDataSeriesWeakness[0][DBM_Card_Data.columns.series]].term;
                var resultWord = [];
                var modWord = ``;
                var maxModWord = 4;

                //get vowel word
                for(var i=0;i<hiddenEnemy.length;i++){
                    resultWord.push(hiddenEnemy[i]);
                }

                var arrTaken = GlobalFunctions.getRandomArray(resultWord,maxModWord);

                //start modify the word:
                for(var i=0;i<resultWord.length;i++){
                    if(arrTaken.includes(resultWord[i])){
                        modWord+=`?`;
                    } else {
                        modWord+=`${resultWord[i]}`;
                    }
                }

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.image
                }
                objEmbed.title = `Lets settle this down shall we?`;
                objEmbed.description = `Team up to defeat **${GlobalFunctions.capitalize(enemyType)}**!\n\n**Traits:**\n>Can attack & counter cure with HP<${lvR}\n>Counter cure that doesn't possess its elemental weakness\n>Counter cure that has less than ${txtRarity}⭐\n>Counter cure that cannot hit the color`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;

                objEmbed.fields = [
                    {
                        name:`💔Color Weakness & Hp:`,
                        value:`${txtHpDisplay}`,
                        inline:true
                    },
                    {
                        name:`Element. Weakness:`,
                        value:`${modWord}`,
                        inline:true
                    },
                    {
                        name:`Next Actions:`,
                        value:`-`,
                        inline:true
                    },
                    {
                        name:`Turn:`,
                        value:`${1}/${(turnMax*colorGroup)+turnBonus}`,
                        inline:true
                    }
                ]

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=8){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.boss}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${lvR},${dtHp},"${Properties.spawnData.battle.color_lives_down}":[],"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.actions}":{},"${Properties.spawnData.battle.actions_mechanics}":{${dtActionsMechanics}},${dtTurn},"${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial}}`;
                
            } else if(randomType>=9){
                //dibosu
                enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term;
                var randRarityMin = 4;

                //get enemy color weakness
                var query = `select cd.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cd 
                where cd.${DBM_Card_Data.columns.color} not in(select cdnotin.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cdnotin 
                where ${DBM_Card_Data.columns.series}=?) 
                group by cd.${DBM_Card_Data.columns.color} 
                union 
                (select cd.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cd 
                where ${DBM_Card_Data.columns.series}=? 
                order by rand() 
                limit 1)`;

                var arrColorTemp = [];
                var cardDataColorWeakness = await DBConn.conn.promise().query(query,[spawnSeries,spawnSeries]);
                cardDataColorWeakness = cardDataColorWeakness[0];
                var dtColor = "";
                var color = cardDataColorWeakness[cardDataColorWeakness.length-1][DBM_Card_Data.columns.color];//correct color

                for(i=0;i<cardDataColorWeakness.length;i++){
                    arrColorTemp.push(cardDataColorWeakness[i][DBM_Card_Data.columns.color]);
                }

                arrColorTemp = GlobalFunctions.shuffleArray(arrColorTemp);

                //randomize hp
                var baseHp = 15;//default hp
                var lvR = GlobalFunctions.randomNumber(45,50);
                var rndHp = Status.getAtk(lvR,baseHp)*GlobalFunctions.randomNumber(4,6);
                var dtHp = `"${Properties.spawnData.battle.hp}":${rndHp},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                //process color
                var rndFake = GlobalFunctions.randomNumber(0,1);
                var rndTraitType = GlobalFunctions.randomNumber(0,1);
                var txtHeader = "";

                var randRarityCondition = GlobalFunctions.randomNumber(0,1);
                var iconRarity = "⬆️";
                if(randRarityCondition){
                    iconRarity = "⬇️";
                    randRarityCondition = Properties.spawnData.battle.rarity_less;
                } else {
                    randRarityCondition = Properties.spawnData.battle.rarity_more;
                }

                switch(rndTraitType){
                    case 0:
                        //block
                        txtHeader = `Weakness & Color Block`;
                        dtColor = `"${Properties.spawnData.battle.color_block}":"${color}"`;
                        break;
                    case 1:
                        //absorb
                        txtHeader = `Weakness & Color Absorb`;
                        dtColor = `"${Properties.spawnData.battle.color_absorb}":"${color}"`;
                        break;
                }

                if(rndFake<=0){
                    //fake
                    txtHeader+="???";
                    dtColor = `"${Properties.spawnData.battle.color}":"${color}"`;
                }

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.image
                }
                objEmbed.title = `Tsunagarus Lv.${lvR} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has manifest the **series cure card** and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers!\nDefeat it with your precure avatar to get the cure card!\n\n**Traits:**\n>Can attack\n>Weak against cure that can hit this monster type\n>Counter cure that has incorrect rarity\n>Counter cure with tricky color information`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;
                objEmbed.fields = [
                    {
                        name:`${iconRarity} ${randRarityMin}⭐ ${txtHeader}`,
                        value:`${arrColorTemp.join(",")}`
                    },
                    {
                        name:`💔Hp:`,
                        value:`${rndHp}/${rndHp}`,
                        inline:true
                    },
                    {
                        name:`Monster Type HP Boost:`,
                        value:`${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}: HP+70%`,
                        inline:true
                    }
                ]
                

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=9){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}",${dtColor},"${Properties.spawnData.battle.level}":${lvR},${dtAllowSpecial},"${randRarityCondition}":${randRarityMin},${dtHp},"${Properties.spawnData.battle.damage_dealer}":{}}`;

            } else if(randomType>=7) {
                //buttagiru : 6-7 star
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[6]);
                cardRewardData = cardRewardData[0][0];

                enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.term;

                var randomMinLives = GlobalFunctions.randomNumber(2,3);

                //get the random series information
                var query = `SELECT ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color}
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.series}=? 
                GROUP BY ${DBM_Card_Data.columns.color} 
                ORDER BY rand() 
                LIMIT ${randomMinLives}`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0];

                var arrTempColor = [];
                var dtColor = "{";
                for(var i=0;i<cardDataSeriesWeakness.length;i++){
                    dtColor+=`"${cardDataSeriesWeakness[i][DBM_Card_Data.columns.color]}":0,`;
                    arrTempColor.push(cardDataSeriesWeakness[i][DBM_Card_Data.columns.color]);
                }
                dtColor = dtColor.replace(/,\s*$/, "");//remove last comma
                dtColor += "}";

                var spawnColorLivesParse = JSON.parse(dtColor);

                var lvR = GlobalFunctions.randomNumber(48,50);
                var randRarityMin = GlobalFunctions.randomNumber(4,5);
                var txtRarity = "?";
                if(GlobalFunctions.randomNumber(0,1)>0){
                    txtRarity=randRarityMin;
                }

                //randomize hp
                var baseHp = 15;//default hp
                var turnMax = GlobalFunctions.randomNumber(3,7);
                var colorGroup = arrTempColor.length; 
                var turnBonus = GlobalFunctions.randomNumber(10,12);

                if(colorGroup>=3){
                    turnMax = GlobalFunctions.randomNumber(3,6);
                    turnBonus = GlobalFunctions.randomNumber(10,12);
                }

                // var rndHp = baseHp;
                rndHp = Status.getAtk(lvR,baseHp)*turnMax;
                var dtTurn = `"${Properties.spawnData.battle.turn}":${1},"${Properties.spawnData.battle.turn_max}":${(turnMax*colorGroup)+turnBonus}`;
                // rndHp = Status.getAtk(lvR,baseHp);

                for (var key in spawnColorLivesParse) {
                    spawnColorLivesParse[key] = rndHp;
                }

                var dtHp = `"${Properties.spawnData.battle.color_lives}":${JSON.stringify(spawnColorLivesParse)},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                //hiddenize the color lives
                var textColor = arrTempColor.join(",");
                for(var i=0;i<textColor.length;i++){
                    if(i>0&&textColor[i]!=","){
                        textColor = textColor.replace(textColor[i],"?");
                    }
                }

                var splitted = textColor.split(",");
                var txtHpDisplay = "";
                splitted.forEach(item => {
                    txtHpDisplay+=`${txtRarity}⭐ ${item} : ${rndHp}/${rndHp}\n`;
                });

                //hiddenize the rarity
                //get the hint
                var hiddenEnemy = TsunagarusModules.Properties.enemySpawnData[cardDataSeriesWeakness[0][DBM_Card_Data.columns.series]].term;
                var resultWord = [];
                var modWord = ``;
                var maxModWord = 4;

                //get vowel word
                for(var i=0;i<hiddenEnemy.length;i++){
                    resultWord.push(hiddenEnemy[i]);
                }

                var arrTaken = GlobalFunctions.getRandomArray(resultWord,maxModWord);

                //start modify the word:
                for(var i=0;i<resultWord.length;i++){
                    if(arrTaken.includes(resultWord[i])){
                        modWord+=`?`;
                    } else {
                        modWord+=`${resultWord[i]}`;
                    }
                }

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.image
                }
                objEmbed.title = `Tsunagarus Lv.${lvR} has appeared!`;
                objEmbed.description = `It's a Big Monster! Team up to defeat **${GlobalFunctions.capitalize(enemyType)}**! \n\n**Traits:**\n>Can attack & counter cure with HP<${lvR}\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${txtRarity}⭐\n>Counter cure that cannot hit the color`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;

                objEmbed.fields = [
                    {
                        name:`💔Color Weakness & Hp:`,
                        value:`${txtHpDisplay}`,
                        inline:true
                    },
                    {
                        name:`Monster Type:`,
                        value:`${modWord}`,
                        inline:true
                    },
                    {
                        name:`Next Actions:`,
                        value:`-`,
                        inline:true
                    },
                    {
                        name:`Turn:`,
                        value:`${1}/${(turnMax*colorGroup)+turnBonus}`,
                        inline:true
                    }
                ]

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=8){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.boss}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${lvR},${dtHp},"${Properties.spawnData.battle.color_lives_down}":[],"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.actions}":{},${dtTurn},"${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial}}`;

            } else if(randomType>=5) {
                //Chiguhaguu : 5-7
                //get 1 random card reward
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[5]);
                cardRewardData = cardRewardData[0][0];

                enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term;
                var randRarityMin = GlobalFunctions.randomNumber(3,5);
                var randLevel = GlobalFunctions.randomNumber(1,3);

                //get the random series information
                var query = `SELECT ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color}
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.series}=? 
                ORDER BY rand() LIMIT 1`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0][0];
                var color = cardDataSeriesWeakness[DBM_Card_Data.columns.color];

                //get the hint
                var hiddenAlterEgo = Properties.dataCardCore[cardDataSeriesWeakness[DBM_Card_Data.columns.pack]].alter_ego;
                var resultWord = [];
                var arrAlterEgo = hiddenAlterEgo.split(" ");//split into array
                var modWord = `${arrAlterEgo[0]} `;
                var maxModWord = randLevel;
                if(maxModWord<=0){
                    //preserve 2 if reached 0
                    maxModWord = 2;
                }

                //get vowel word
                for(var i=0;i<arrAlterEgo[1].length;i++){
                    resultWord.push(arrAlterEgo[1][i]);
                }

                var arrTaken = GlobalFunctions.getRandomArray(resultWord,maxModWord);
                // console.log(`original: ${arrAlterEgo[1]}`);
                // console.log(`taken: ${arrTaken}`);

                //start modify the word:
                for(var i=0;i<arrAlterEgo[1].length;i++){
                    if(arrTaken.includes(arrAlterEgo[1][i])){
                        modWord+=`?`;
                    } else {
                        modWord+=`${arrAlterEgo[1][i]}`;
                    }
                }

                //uniquized the array:
                // resultWord = resultWord.filter((v, i, a) => a.indexOf(v) === i);
                var baseHp = 15;//default hp
                var lvR = GlobalFunctions.randomNumber(45,48);
                var rndHp = Status.getAtk(lvR,baseHp)*GlobalFunctions.randomNumber(4,5);
                var dtHp = `"${Properties.spawnData.battle.hp}":${rndHp},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                //process color
                var rndFake = GlobalFunctions.randomNumber(0,1);
                var rndTraitType = GlobalFunctions.randomNumber(0,2);
                var txtHeader = "";

                switch(rndTraitType){
                    case 0:
                        //block
                        txtHeader = "Catchphrase Block";
                        dtColor = `"${Properties.spawnData.battle.color_block}":"${color}"`;
                        break;
                    case 1:
                        //absorb
                        txtHeader = "Catchphrase Absorb";
                        dtColor = `"${Properties.spawnData.battle.color_absorb}":"${color}"`;
                        break;
                    case 2:
                        txtHeader = "Catchphrase";
                        dtColor = `"${Properties.spawnData.battle.color}":"${color}"`;
                        break;
                }

                if(rndTraitType!=2&&rndFake<=0){
                    //fake
                    txtHeader+="???";
                    dtColor = `"${Properties.spawnData.battle.color}":"${color}"`;
                }

                var hintPack = `${Properties.dataCardCore[cardDataSeriesWeakness[DBM_Card_Data.columns.pack]].hint_chiguhaguu}`;
                hintPack = hintPack.replace("<x>",modWord);

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.image
                }
                objEmbed.title = `Tsunagarus LvR. ${lvR} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[cardDataSeriesWeakness[DBM_Card_Data.columns.series]].term}** powers!\nDefeat it with your precure avatar to get the cure card!\n\n**Traits:**\n>Cannot attack\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${randRarityMin}⭐\n>Counter cure with tricky catchphrase information`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;
                objEmbed.fields = [
                    {
                        name:`${randRarityMin}⭐ ${txtHeader}`,
                        value:`${hintPack}`,
                        inline:false
                    },
                    {
                        name:`💔Hp:`,
                        value:`${rndHp}/${rndHp}`,
                        inline:true
                    },
                    {
                        name:`Monster Type:`,
                        value:`${TsunagarusModules.Properties.enemySpawnData[cardDataSeriesWeakness[DBM_Card_Data.columns.series]].term}`,
                        inline:true
                    }
                ]
                
                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=7){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${lvR},${dtColor},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}",${dtHp},"${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial},"${Properties.spawnData.battle.damage_dealer}":{}}`;

            } else if(randomType>=3) {
                //gizzagizza: 5-7 star
                //get 1 random card reward
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[5]);
                cardRewardData = cardRewardData[0][0];

                enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term;
                var randRarityMin = GlobalFunctions.randomNumber(3,5);

                //get the random series information
                var query = `select ${DBM_Card_Data.columns.series} 
                from ${DBM_Card_Data.TABLENAME} 
                order by rand() 
                limit 1`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0][0];
                
                //get enemy color weakness
                var query = `select cd.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cd 
                where cd.${DBM_Card_Data.columns.color} not in(select cdnotin.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cdnotin 
                where ${DBM_Card_Data.columns.series}=?) 
                group by cd.${DBM_Card_Data.columns.color} 
                union 
                (select cd.${DBM_Card_Data.columns.color} 
                from ${DBM_Card_Data.TABLENAME} cd 
                where ${DBM_Card_Data.columns.series}=? 
                order by rand() 
                limit 1)`;

                var arrColorTemp = [];
                var cardDataColorWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series],enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataColorWeakness = cardDataColorWeakness[0];
                var dtColor = "";
                var color = cardDataColorWeakness[cardDataColorWeakness.length-1][DBM_Card_Data.columns.color];//correct color

                for(i=0;i<cardDataColorWeakness.length;i++){
                    arrColorTemp.push(cardDataColorWeakness[i][DBM_Card_Data.columns.color]);
                }

                arrColorTemp = GlobalFunctions.shuffleArray(arrColorTemp);

                // var filtered = arrColorTemp.filter(function(x){ return x!= });
                // console.log(arrColorTemp)

                //randomize hp
                var baseHp = 15;//default hp
                var lvR = GlobalFunctions.randomNumber(40,44);
                var rndHp = Status.getAtk(lvR,baseHp)*GlobalFunctions.randomNumber(4,5);
                var dtHp = `"${Properties.spawnData.battle.hp}":${rndHp},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                //process color
                var rndFake = GlobalFunctions.randomNumber(0,1);
                var rndTraitType = GlobalFunctions.randomNumber(0,1);
                var txtHeader = "";

                switch(rndTraitType){
                    case 0:
                        //block
                        txtHeader = "Weakness & Color Block";
                        dtColor = `"${Properties.spawnData.battle.color_block}":"${color}"`;
                        break;
                    case 1:
                        //absorb
                        txtHeader = "Weakness & Color Absorb";
                        dtColor = `"${Properties.spawnData.battle.color_absorb}":"${color}"`;
                        break;
                }

                if(rndFake<=0){
                    //fake
                    txtHeader+="???";
                    dtColor = `"${Properties.spawnData.battle.color}":"${color}"`;
                }

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.image
                }
                objEmbed.title = `Tsunagarus LvR. ${lvR} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers!\nDefeat it with your precure avatar to get the cure card!\n\n**Traits:**\n>Cannot attack\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${randRarityMin}⭐\n>Counter cure with tricky color information`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;
                objEmbed.fields = [
                    {
                        name:`💔Hp:`,
                        value:`${rndHp}/${rndHp}`,
                        inline:true
                    },
                    {
                        name:`Monster Type:`,
                        value:`${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}`,
                        inline:true
                    },
                    {
                        name:`${randRarityMin}⭐ ${txtHeader}`,
                        value:`${arrColorTemp.join(",")}`,
                        inline:true
                    }
                ]
                
                objEmbed.footer = {
                    text:`Special Protection: ❌`
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}",${dtColor},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.level}":${lvR},"${Properties.spawnData.battle.rarity}":${randRarityMin},${dtHp},"${Properties.spawnData.battle.damage_dealer}":{}}`;

            } else {
                //chokkins
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[6]);
                cardRewardData = cardRewardData[0][0];

                //get the enemy trait data
                var query = `select * 
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.series}=?  
                group by ${DBM_Card_Data.columns.color},${DBM_Card_Data.columns.rarity} 
                order by rand() limit 1`;
                var enemyDataTrait = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                enemyDataTrait = enemyDataTrait[0][0];

                //default: chokkins: 6-7
                //get the random enemy
                var baseHp = 15;//default hp
                var lvR = GlobalFunctions.randomNumber(35,40);

                //randomize hp
                var rndHp = Status.getAtk(lvR,baseHp)*GlobalFunctions.randomNumber(3,5);
                var dtHp = `"${Properties.spawnData.battle.hp}":${rndHp},"${Properties.spawnData.battle.hp_max}":${rndHp}`;

                var randTrait = GlobalFunctions.randomNumber(0,1);
                var dtColor = "\""; var colorTrait = "";
                switch(randTrait){
                    case 0:
                        //block
                        dtColor+=Properties.spawnData.battle.color_absorb; colorTrait="Color Absorb";
                        break;
                    case 1:
                        //absorb
                        dtColor+=Properties.spawnData.battle.color_block; colorTrait="Color Block";
                        break;
                }
                dtColor += `":["${enemyDataTrait[DBM_Card_Data.columns.color]}"]`;

                //embed
                objEmbed.thumbnail = {
                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.image
                }
                objEmbed.title = `Tsunagarus Lv. ${lvR} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers! Defeat it with your precure avatar to get the cure card!\n\n**Traits:**\n>Can attack\n>Weak against cure that can hit this monster type`;
                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor;
                objEmbed.fields = [
                    {
                        name:`⬆️ Series Hp Boost:`,
                        value:`${spawnSeries}: +20%`,
                        inline:true
                    },
                    {
                        name:colorTrait,
                        value:`${enemyDataTrait[DBM_Card_Data.columns.color]}`,
                        inline:true
                    },
                    {
                        name:`💔 Hp:`,
                        value:`${rndHp}/${rndHp}`,
                        inline:true
                    }
                ];

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=7){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${lvR},${dtColor},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}",${dtAllowSpecial},${dtHp},"${Properties.spawnData.battle.damage_dealer}":{}}`;
            }

            //command button
            objFinalSend.components = Battle.componentsBattleCommand(enemyType);
            //select menu end

            parameterSet.set(DBM_Card_Guild.columns.spawn_data,spawnData);
            break;
        default: // normal spawn type
            //get 1 card id
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}<=? 
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[3]); //for testing only
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var cardRarity = resultData[0][0][DBM_Card_Data.columns.rarity];
            var captureChance = `${100-(parseInt(cardRarity)*10)}`;
            parameterSet.set(DBM_Card_Guild.columns.spawn_id,cardSpawnId);
            //prepare the embeds:
            objEmbed.title = resultData[0][0][DBM_Card_Data.columns.name];
            objEmbed.color = Properties.dataColorCore[resultData[0][0][DBM_Card_Data.columns.color]].color;
            objEmbed.author = {
                name:`${GlobalFunctions.capitalize(cardSpawnSeries)} Card - ${GlobalFunctions.capitalize(resultData[0][0][DBM_Card_Data.columns.pack])}`,
                iconURL:Properties.dataCardCore[cardSpawnPack].icon,
            }
            objEmbed.fields = [
                {
                    name:"Precure Card Spawned!",
                    value:`Press **✨Catch!** button to capture this card!`,
                    inline:false
                }
            ];
            objEmbed.image ={
                url:resultData[0][0][DBM_Card_Data.columns.img_url]
            }
            objEmbed.footer = {
                text:`${cardRarity} ⭐ | ID: ${cardSpawnId} | ✔️ Catch Rate: ${captureChance}%`
            }

            var tempSend = [DiscordStyles.Button.basic("card.catch_normal","✨Catch!","PRIMARY")];

            var randomPinky = GlobalFunctions.randomNumber(0,100);
            if(randomPinky<=20 && cardSpawnSeries=="yes! precure 5 gogo!"){
                //randomize pinky
                var queryPinky = `select pd.${DBM_Pinky_Data.columns.id_pinky},pd.${DBM_Pinky_Data.columns.name},pd.${DBM_Pinky_Data.columns.img_url}  
                from ${DBM_Pinky_Data.TABLENAME} pd 
                where pd.${DBM_Pinky_Data.columns.id_pinky} not in(
                select pi.${DBM_Pinky_Inventory.columns.id_pinky}  
                from ${DBM_Pinky_Inventory.TABLENAME} pi 
                where pi.${DBM_Pinky_Inventory.columns.id_guild}=?) 
                order by rand() 
                limit 1`;
                var resultDataPinky = await DBConn.conn.promise().query(queryPinky,[id_guild]);
                if(resultDataPinky[0][0]!=null){
                    objEmbed.fields.push(
                        {
                            name:"🦋 Special Capture Command:",
                            value:`Press **🦋Catch!** button to capture this pinky!`,
                            inline:false
                        }
                    );
                    objEmbed.thumbnail = {
                        url:resultDataPinky[0][0][DBM_Pinky_Data.columns.img_url]
                    }

                    tempSend.push(DiscordStyles.Button.basic("pinky.catch_pinky","🦋Catch!","PRIMARY"));
                    parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                        `{"id_pinky":"${resultDataPinky[0][0][DBM_Pinky_Data.columns.id_pinky]}","id_card":"${cardSpawnId}"}`
                    );
                }
            }

            objFinalSend.components = tempSend;
            break;
    }
    
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

    //update the time remaining information:
    await CardGuildModules.updateTimerRemaining(id_guild);

    // console.log(objEmbed);
    objFinalSend.embeds = [objEmbed];

    return objFinalSend;
}

async function addNewCardInventory(id_user,id_card,addStock = false,qty=1){
    if(!addStock){
        //check if card rarity is 6/7 to determine if it's cure card/not
        var cardData = await getCardData(id_card);

        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Inventory.columns.id_user,id_user);
        parameterSet.set(DBM_Card_Inventory.columns.id_card,id_card);
        parameterSet.set(DBM_Card_Inventory.columns.stock,qty);

        if(cardData[DBM_Card_Data.columns.rarity]>=6){
            parameterSet.set(DBM_Card_Inventory.columns.level_special,10);
        }
        
        await DB.insert(DBM_Card_Inventory.TABLENAME,parameterSet);
    } else {
        //update the stock
        // var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
        // SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}+${qty} 
        // WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
        // ${DBM_Card_Inventory.columns.id_card}=?`;

        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
        SET ${DBM_Card_Inventory.columns.stock}= 
            IF(${DBM_Card_Inventory.columns.stock}+${qty}<=${Properties.maximumCard},${DBM_Card_Inventory.columns.stock}+${qty}, ${DBM_Card_Inventory.columns.stock}) 
        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
        ${DBM_Card_Inventory.columns.id_card}=?`;
        await DBConn.conn.promise().query(query, [id_user,id_card]);
    }
    
}

async function limitizeUserPoints(){
    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${DBM_Card_User_Data.columns.mofucoin} = IF(${DBM_Card_User_Data.columns.mofucoin}>=${Properties.limit.mofucoin}, ${Properties.limit.mofucoin}, ${DBM_Card_User_Data.columns.mofucoin}), 

    ${DBM_Card_User_Data.columns.color_point_pink} = IF(${DBM_Card_User_Data.columns.color_point_pink}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_pink}), 
    ${DBM_Card_User_Data.columns.color_point_blue} = IF(${DBM_Card_User_Data.columns.color_point_blue}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_blue}), 
    ${DBM_Card_User_Data.columns.color_point_green} = IF(${DBM_Card_User_Data.columns.color_point_green}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_green}), 
    ${DBM_Card_User_Data.columns.color_point_purple} = IF(${DBM_Card_User_Data.columns.color_point_purple}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_purple}), 
    ${DBM_Card_User_Data.columns.color_point_red} = IF(${DBM_Card_User_Data.columns.color_point_red}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_red}), 
    ${DBM_Card_User_Data.columns.color_point_white} = IF(${DBM_Card_User_Data.columns.color_point_white}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_white}), 
    ${DBM_Card_User_Data.columns.color_point_yellow} = IF(${DBM_Card_User_Data.columns.color_point_yellow}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_yellow}), 

    ${DBM_Card_User_Data.columns.sp001} = IF(${DBM_Card_User_Data.columns.sp001}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp001}), 
    ${DBM_Card_User_Data.columns.sp002} = IF(${DBM_Card_User_Data.columns.sp002}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp002}),
    ${DBM_Card_User_Data.columns.sp003} = IF(${DBM_Card_User_Data.columns.sp003}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp003}),
    ${DBM_Card_User_Data.columns.sp004} = IF(${DBM_Card_User_Data.columns.sp004}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp004}),
    ${DBM_Card_User_Data.columns.sp005} = IF(${DBM_Card_User_Data.columns.sp005}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp005}),
    ${DBM_Card_User_Data.columns.sp006} = IF(${DBM_Card_User_Data.columns.sp006}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp006}),
    ${DBM_Card_User_Data.columns.sp007} = IF(${DBM_Card_User_Data.columns.sp007}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp007}),
    ${DBM_Card_User_Data.columns.sp008} = IF(${DBM_Card_User_Data.columns.sp008}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp008}),
    ${DBM_Card_User_Data.columns.sp009} = IF(${DBM_Card_User_Data.columns.sp009}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp009}),
    ${DBM_Card_User_Data.columns.sp010} = IF(${DBM_Card_User_Data.columns.sp010}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp010}),
    ${DBM_Card_User_Data.columns.sp011} = IF(${DBM_Card_User_Data.columns.sp011}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp011}),
    ${DBM_Card_User_Data.columns.sp012} = IF(${DBM_Card_User_Data.columns.sp012}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp012}),
    ${DBM_Card_User_Data.columns.sp013} = IF(${DBM_Card_User_Data.columns.sp013}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp013}),
    ${DBM_Card_User_Data.columns.sp014} = IF(${DBM_Card_User_Data.columns.sp014}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp014}),
    ${DBM_Card_User_Data.columns.sp015} = IF(${DBM_Card_User_Data.columns.sp015}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp015})`;

    await DBConn.conn.promise().query(query);
}

<<<<<<< Updated upstream:modules/Card.js
module.exports = {latestVersion,Properties,PrecureStarTwinkle: PrecureStarTwinkleCore,Battle,Leveling,Quest,Shop,Status,StatusEffect,TradeBoard,Embeds,Party,Skills,getCardData,getCardInventoryUserData,getAllCardDataByPack,
=======
module.exports = {Properties,PrecureStarTwinkleCore: StarTwinkle, Battle,Leveling,Quest,Shop,Status,StatusEffect,TradeBoard,Embeds,Party,Skills,getCardData,getCardInventoryUserData,getAllCardDataByPack,
>>>>>>> Stashed changes:modules/backup/Card.js
    getCardUserStatusData,checkUserHaveCard,getUserCardInventoryData,getUserCardStock,getUserTotalCard,
    updateCatchAttempt,updateColorPoint,updateMofucoin,updateSeriesPoint,removeCardGuildSpawn,generateCardSpawn,addNewCardInventory,limitizeUserPoints,embedBioPackList,embedCardPackList,getBonusCatchAttempt,getNextColorPoint,
    checkCardCompletion,leaderboardAddNew,updateMessageIdSpawn};
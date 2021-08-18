const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardGuildModules = require('../modules/CardGuild');
const ItemModules = require('../modules/Item');
const TsunagarusModules = require('../modules/Tsunagarus');
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
        var icon = "⬆️";//default icon
        var SEDescription = ""; var parTitle = "";
        var imgThumbnail = Properties.imgResponse.imgOk;
        switch(statusType){
            case "skills":
                parTitle = `${icon} Skills Activated!`;
                SEDescription = `**${this.cureSkillsBuffData[status_effect].name}**:\n${this.cureSkillsBuffData[status_effect].description}`;
                break;
            case "debuff":
                icon = "⬇️";
                parTitle = `${icon} Debuff inflicted!`;
                SEDescription = `**${this.debuffData[status_effect].name}**:\n${this.debuffData[status_effect].description}`;
                imgThumbnail = Properties.imgResponse.imgFailed;
                break;
            case "buff":
                if(!teamBattle){
                    parTitle = `${icon} Status Effect Activated!`;
                    SEDescription = `**${this.buffData[status_effect].name}**:\n${this.buffData[status_effect].description}`;
                } else {
                    parTitle = `${icon} Status Effect Activated!`;
                    SEDescription = `**${this.partyBuffData[status_effect].name}**:\n${this.partyBuffData[status_effect].description}`;
                }
                break;
        }
        return {
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
        }
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
    static spawnType = ["normal","battle","number","quiz","color","series"
        //golden_week
        //virus
    ];


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
                    cp_cost:100,
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
        }
    };
    
    //the constant of all available/required card
    static dataCardCore = {
        nagisa:{
            total:16,
            icon:"https://waa.ai/JEVB.png",
            color:"pink",
            fullname:"Nagisa Misumi",
            alter_ego:"Cure Black",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure Black!",
            special_attack:"Marble Screw",
            img_special_attack:"https://cdn.discordapp.com/attachments/793374640839458837/817775242729881660/unknown.png",
            img_transformation:[],
            badge_completion:"",
            hint_chiguhaguu:"Emissary of light, <x>!",
            skill:{
                "marble screw max":{
                    name:"Marble Screw Max",
                    description:"Take down pink/white color",
                    cp_cost:150,
                    color_removal:["pink","white"]
                }
            }
        },
        saki:{
            total:12,
            icon:"https://waa.ai/JEVI.png",
            color:"pink",
            fullname:"Saki Hyuuga",
            alter_ego:"Cure Bloom",
            henshin_phrase:"Dual Spiritual Wave!",
            transform_quotes:"The shining golden flower, Cure Bloom!",
            special_attack:"Spiral Star Splash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793378822976045096/817775703444684820/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The shining golden flower, <x>!",
            skill:{
                "twin stream splash":{
                    name:"Twin Stream Splash",
                    description:"Take down pink/yellow color",
                    cp_cost:150,
                    color_removal:["pink","yellow"]
                }
            }
        },
        nozomi:{
            total:11,
            icon:"https://waa.ai/JEV8.png",
            color:"pink",
            fullname:"Nozomi Yumehara",
            alter_ego:"Cure Dream",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The great power of hope, Cure Dream!",
            special_attack:"Shooting Star",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379464753971220/817775920550248498/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793379464753971220/822044019566706698/image0.gif"],
            hint_chiguhaguu:"The great power of hope, <x>",
            skill:{
                "crystal shoot":{
                    name:"Crystal Shoot",
                    description:"Take down pink color",
                    cp_cost:80,
                    color_removal:["pink"]
                }
            }
        },
        love:{
            total:11,
            icon:"https://waa.ai/JEVW.png",
            color:"pink",
            fullname:"Love Momozono",
            alter_ego:"Cure Peach",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The pink heart is the emblem of love. Freshly-picked, Cure Peach!",
            special_attack:"Love Sunshine",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381447062913064/817776599390486558/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381447062913064/823994186217816075/image0.gif"],
            hint_chiguhaguu:"The pink heart is the emblem of love. Freshly-picked, <x>!",
            skill:{
                "love sunshine fresh":{
                    name:"Love Sunshine Fresh",
                    description:"Boost pink atk by 20%",
                    cp_cost:30,
                    color_boost:["pink"]
                }
            }
        },
        tsubomi:{
            total:13,
            icon:"https://waa.ai/JEVD.png",
            color:"pink",
            fullname: "Tsubomi Hanasaki",
            alter_ego:"Cure Blossom",
            henshin_phrase:"Pretty Cure, Open My Heart!",
            transform_quotes:"The flowers spreading throughout the land, Cure Blossom!",
            special_attack:"Pink Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382427551727636/817777422723973190/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382427551727636/822047607412490270/image0.gif"],
            hint_chiguhaguu:"The flowers spreading throughout the land, <x>!",
            form:{
                silhouette:{
                    name:"Cure Blossom Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/ad/Puzzlun_Sprite_HPC_Cure_Blossom_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            },
            skill:{
                "blossom butt punch":{
                    name:"Blossom Butt Punch",
                    description:"Boost pink atk by 30%",
                    cp_cost:40,
                    color_boost:["pink"]
                }
            }
        },
        hibiki:{
            total:12,
            icon:"https://waa.ai/JEVd.png",
            color:"pink",
            fullname: "Hibiki Hojo",
            alter_ego:"Cure Melody",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the wild tune, Cure Melody!",
            special_attack:"Miracle Heart Arpeggio",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383641119850556/817782344819408966/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Strumming the wild tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        miyuki:{
            total:13,
            icon:"https://waa.ai/JEVM.png",
            color:"pink",
            fullname: "Miyuki Hoshizora",
            alter_ego:"Cure Happy",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Twinkling and shining, the light of the future! Cure Happy!",
            special_attack:"Happy Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384875465506816/817783520935673856/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384875465506816/822032962186117140/image0.gif"],
            hint_chiguhaguu:"Twinkling and shining, the light of the future! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Happy Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/e/e8/Puzzlun_Sprite_SmPC_Cure_Happy_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Happy!",
                }
            }
        },
        mana:{
            total:12,
            icon:"https://waa.ai/JEV6.png",
            color:"pink",
            fullname: "Mana Aida",
            alter_ego:"Cure Heart",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"Overflowing Love! Cure Heart!",
            special_attack:"Heart Dynamite",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387637527805973/817784809380118528/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Overflowing Love! <x>!",
            catchprase:"Kyunkyun!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
        },
        megumi:{
            total:10,
            icon:"https://waa.ai/JEVg.png",
            color:"pink",
            fullname: "Megumi Aino",
            alter_ego:"Cure Lovely",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The big love spreading throughout the world! Cure Lovely!!",
            special_attack:"Pinky Love Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388697474564157/817786157650673674/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The big love spreading throughout the world! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Lovely Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/92/Puzzlun_Sprite_HCPC_Cure_Lovely_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The big love spreading throughout the world! Cure Lovely Innocent Form!"
                }
            }
        },
        haruka:{
            total:16,
            icon:"https://waa.ai/JEVN.png",
            color:"pink",
            fullname: "Haruka Haruno",
            alter_ego:"Cure Flora",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the Flourishing Flowers! Cure Flora!",
            special_attack:"Floral Tourbillon",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389561606045737/817786541179011072/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389561606045737/822056134847758350/image0.gif"],
            hint_chiguhaguu:"Princess of the Flourishing Flowers! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Flora Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/9a/Puzzlun_Sprite_GPPC_Cure_Flora_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the Flourishing Flowers! Cure Flora!"
                }
            }
        },
        mirai:{
            total:16,
            icon:"https://waa.ai/JEVh.png",
            color:"pink",
            fullname:"Mirai Asahina",
            alter_ego:"Cure Miracle",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Miracle! Cure Miracle!",
            special_attack:"Diamond Eternal",
            img_special_attack:"https://cdn.discordapp.com/attachments/793390659046080512/817787063726243880/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Our Miracle! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                ruby:{
                    name:"Cure Miracle Ruby Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/3/36/Puzzlun_Sprite_MTPC_Cure_Miracle_Ruby.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Ruby Style!"
                },
                sapphire:{
                    name:"Cure Miracle Sapphire Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/4/4e/Puzzlun_Sprite_MTPC_Cure_Miracle_Sapphire.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Sapphire Style!"
                },
                alexandrite:{
                    name:"Cure Miracle Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/87/Puzzlun_Sprite_MTPC_Cure_Miracle_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Alexandrite Style!"
                }
            }
        },
        ichika:{
            total:18,
            icon:"https://waa.ai/JEVP.png",
            color:"pink",
            fullname:"Ichika Usami",
            alter_ego:"Cure Whip",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Liveliness and Smiles! Let's La Mix It All Up! Cure Whip! Ready To Serve!",
            special_attack:"Whip Decoration",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391968322322462/817792783754330142/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793391968322322462/822041487444803594/image0.gif"],
            hint_chiguhaguu:"With Liveliness and Smiles! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Whip A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/be/Puzzlun_Sprite_KKPCALM_Cure_Whip_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Whip A la Mode!"
                }
            }
        },
        hana:{
            total:16,
            icon:"https://waa.ai/JEVp.png",
            color:"pink",
            fullname: "Hana Nono",
            alter_ego:"Cure Yell",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell!",
            special_attack:"Heart For You",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393652348354600/817793676813533214/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Cheering on everyone! The Pretty Cure of High Spirits! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Yell Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a5/Puzzlun_Sprite_HuPC_Cure_Yell_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Yell Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/5d/Puzzlun_Sprite_HuPC_Cure_Yell_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell Mother Heart"
                }
            }
        },
        hikaru:{
            total:13,
            icon:"https://waa.ai/JEV7.png",
            color:"pink",
            fullname: "Hikaru Hoshina",
            alter_ego:"Cure Star",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The twinkling star that shines throughout the universe! Cure Star!",
            special_attack:"Star Punch",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395639512989727/817794726728171561/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The twinkling star that shines throughout the universe! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Star Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cf/Puzzlun_Sprite_STPC_Cure_Star_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The twinkling star that shines throughout the universe! Cure Star Twinkle Style!"
                }
            }
        },
        nodoka:{
            total:5,
            icon:"https://waa.ai/JEVL.png",
            color:"pink",
            fullname: "Nodoka Hanadera",
            alter_ego:"Cure Grace",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two overlapping flowers! Cure Grace!",
            special_attack:"Healing Flower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396698117701632/825099297687076904/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396698117701632/822036258628435968/image0.gif"],
            hint_chiguhaguu:"The two overlapping flowers! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        karen:{
            total:12,
            icon:"https://waa.ai/JEV5.png",
            color:"blue",
            fullname: "Karen Minazuki",
            alter_ego:"Cure Aqua",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The blue spring of intelligence, Cure Aqua!",
            special_attack:"Sapphire Arrow",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380588223856651/817776251489747020/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380588223856651/822045554518261800/image0.gif"],
            hint_chiguhaguu:"The blue spring of intelligence, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        miki:{
            total:10,
            icon:"https://waa.ai/JEVn.png",
            color:"blue",
            fullname: "Miki Aono",
            alter_ego:"Cure Berry",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The blue heart is the emblem of hope. Freshly-gathered, Cure Berry!",
            special_attack:"Espoir Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381635424387073/817776807679623178/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381635424387073/822035476323631114/image0.gif"],
            hint_chiguhaguu:"The blue heart is the emblem of hope. Freshly-gathered, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        erika:{
            total:13,
            icon:"https://waa.ai/JEwE.png",
            color:"blue",
            fullname:"Erika Kurumi",
            alter_ego:"Cure Marine",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that flutters in the ocean winds, Cure Marine!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Blue Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382673749377075/817778139501559888/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382673749377075/822047680099254272/image0.gif"],
            hint_chiguhaguu:"The flower that flutters in the ocean winds, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Marine Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/26/Puzzlun_Sprite_HPC_Cure_Marine_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        ellen:{
            total:12,
            icon:"https://waa.ai/JEw4.png",
            color:"blue",
            fullname:"Ellen Kurokawa",
            alter_ego:"Cure Beat",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the soul's tune, Cure Beat!",
            special_attack:"Heartful Beat Rock",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384071107575838/817783058949603368/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384071107575838/822049486553350154/image0.gif"],
            hint_chiguhaguu:"Strumming the soul's tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        reika:{
            total:12,
            icon:"https://waa.ai/JEwk.png",
            color:"blue",
            fullname: "Reika Aoki",
            alter_ego:"Cure Beauty",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Snowing, falling and gathering, a noble heart! Cure Beauty!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Beauty",
            special_attack:"Beauty Blizzard",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387120341155850/817784652236062750/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793387120341155850/822029771910676480/image0.gif"],
            hint_chiguhaguu:"Snowing, falling and gathering, a noble heart! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Beauty Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/99/Puzzlun_Sprite_SmPC_Cure_Beauty_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Beauty!",
                }
            }
        },
        rikka:{
            total:11,
            icon:"https://waa.ai/JEwz.png",
            color:"blue",
            fullname:"Rikka Hishikawa",
            alter_ego:"Cure Diamond",
            henshin_phrase: "Pretty Cure, Love Link!",
            transform_quotes:"The light of Wisdom! Cure Diamond!!",
            special_attack:"Diamond Swirkle",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387811922903040/817785362213765141/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/796354776714969119/822201577233186866/image0.gif"],
            hint_chiguhaguu:"The light of Wisdom! <x>!!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        hime:{
            total:11,
            icon:"https://waa.ai/JEwo.png",
            color:"blue",
            fullname:"Hime Shirayuki",
            alter_ego:"Cure Princess",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The blue wind dancing in the sky! Cure Princess!",
            special_attack:"Blue Happy Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388907429232650/817786226895618068/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793388907429232650/822053505861812254/image0.gif"],
            hint_chiguhaguu:"The blue wind dancing in the sky! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Princess Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a8/Puzzlun_Sprite_HCPC_Cure_Princess_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The blue wind dancing in the sky! Cure Lovely Innocent Form!"
                }
            }
        },
        minami:{
            total:14,
            icon:"https://waa.ai/JEwX.png",
            color:"blue",
            fullname:"Minami Kaidou",
            alter_ego:"Cure Mermaid",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the crystal clear seas! Cure Mermaid!",
            special_attack:"Mermaid Ripple",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389777361174549/817786645037711390/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389777361174549/822055972255825958/image0.gif"],
            hint_chiguhaguu:"Princess of the crystal clear seas! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Mermaid Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/4/47/Puzzlun_Sprite_GPPC_Cure_Mermaid_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the crystal clear seas! Cure Mermaid!"
                }
            }
        },
        aoi:{
            total:14,
            icon:"https://waa.ai/JEw3.png",
            color:"blue",
            fullname:"Aoi Tategami",
            alter_ego:"Cure Gelato",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Freedom and Passion! Let's La Mix It All Up! Cure Gelato! Ready To Serve!",
            special_attack:"Gelato Shake",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392456019345418/817793196901400576/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793392456019345418/822041589349351434/image0.gif"],
            hint_chiguhaguu:"With Freedom and Passion! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Gelato A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/f3/Puzzlun_Sprite_KKPCALM_Cure_Gelato_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Gelato A la Mode!"
                }
            }
        },
        saaya:{
            total:14,
            icon:"https://waa.ai/JEwO.png",
            color:"blue",
            fullname: "Saaya Yakushiji",
            alter_ego:"Cure Ange",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange!",
            special_attack:"Heart Feather",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394491431714838/817793766152470528/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Healing everyone! The Pretty Cure of Wisdom! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Ange Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/0/0a/Puzzlun_Sprite_HuPC_Cure_Ange_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Ange Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/7/7b/Puzzlun_Sprite_HuPC_Cure_Ange_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange Mother Heart!"
                }
            }
        },
        yuni:{
            total:8,
            icon:"https://waa.ai/JEwT.png",
            color:"blue",
            fullname:"Yuni",
            alter_ego:"Cure Cosmo",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The rainbow spectrum lighting up the galaxy! Cure Cosmo!",
            special_attack:"Cosmo Shining",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396381406199809/817795242929422406/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The rainbow spectrum lighting up the galaxy! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Cosmo Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/6/60/Puzzlun_Sprite_STPC_Cure_Cosmo_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The rainbow spectrum lighting up the galaxy! Cure Cosmo Twinkle Style!"
                }
            }
        },
        chiyu:{
            total:5,
            icon:"https://waa.ai/JEwe.png",
            color:"blue",
            fullname:"Chiyu Sawaizumi",
            alter_ego:"Cure Fontaine",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two intersecting streams! Cure Fontaine!",
            special_attack:"Healing Stream",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396832717111347/825099333333811310/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396832717111347/822037799011352576/image0.gif"],
            hint_chiguhaguu:"The two intersecting streams! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        hikari:{
            total:14,
            icon:"https://waa.ai/JEwu.png",
            color:"yellow",
            fullname:"Hikari Kujou",
            alter_ego:"Shiny Luminous",
            henshin_phrase:"Luminous Shining Stream!",
            transform_quotes:"Shining life, Shiny Luminous! The light's heart and the light's will, for the sake of uniting all as one!",
            special_attack:"Heartiel Action",
            img_special_attack:"https://cdn.discordapp.com/attachments/793378136871010364/817775581458464808/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Shining life, <x>! The light's heart and the light's will, for the sake of uniting all as one!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        urara:{
            total:11,
            icon:"https://waa.ai/JEwt.png",
            color:"yellow",
            fullname:"Urara Kasugano",
            alter_ego:"Cure Lemonade",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The effervescence of bursting lemon, Cure Lemonade!",
            special_attack:"Prism Chain",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380077173735424/817776088595300452/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380077173735424/822044339370065941/image0.gif"],
            hint_chiguhaguu:"The effervescence of bursting lemon, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        inori:{
            total:10,
            icon:"https://waa.ai/JEwJ.png",
            color:"yellow",
            fullname:"Inori Yamabuki",
            alter_ego:"Cure Pine",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The yellow heart is the emblem of faith! Freshly-harvested, Cure Pine!",
            special_attack:"Healing Prayer",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381839938519040/817776874607607808/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381839938519040/823994231860363315/image0.gif"],
            hint_chiguhaguu:"The yellow heart is the emblem of faith! Freshly-harvested, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        itsuki:{
            total:12,
            icon:"https://waa.ai/JEwm.png",
            color:"yellow",
            fullname:"Itsuki Myoudouin",
            alter_ego:"Cure Sunshine",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that bathes in the sunlight, Cure Sunshine!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Gold Forte Burst",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383020336906259/817781911929225236/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793383020336906259/822048055859609630/image0.gif"],
            hint_chiguhaguu:"The flower that bathes in the sunlight, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Sunshine Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/1d/Puzzlun_Sprite_HPC_Cure_Sunshine_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        ako:{
            total:11,
            icon:"https://waa.ai/JEwx.png",
            color:"yellow",
            fullname:"Ako Shirabe",
            alter_ego:"Cure Muse",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the Goddess' tune, Cure Muse!",
            special_attack:"Sparkling Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384267753193482/817783205075353620/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384267753193482/822049698478948372/image0.gif"],
            hint_chiguhaguu:"Playing the Goddess' tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yayoi:{
            total:11,
            icon:"https://waa.ai/JEwq.png",
            color:"yellow",
            fullname:"Yayoi Kise",
            alter_ego:"Cure Peace",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Sparkling, glittering, rock-paper-scissors! Cure Peace!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Peace!",
            special_attack:"Peace Thunder",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386748356067349/817784272323608626/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386748356067349/822030765248348210/image0.gif"],
            hint_chiguhaguu:"Sparkling, glittering, rock-paper-scissors! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Peace Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/8c/Puzzlun_Sprite_SmPC_Cure_Peace_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Peace!"
                }
            }
        },
        alice:{
            total:10,
            icon:"https://waa.ai/JEwl.png",
            color:"yellow",
            fullname:"Alice Yotsuba",
            alter_ego:"Cure Rosetta",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The Sunny warmth! Cure Rosetta!",
            special_attack:"Rosetta Balloon",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388055583129601/817785467805499402/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793388055583129601/822051142506643486/image0.gif"],
            hint_chiguhaguu:"The Sunny warmth! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yuko:{
            total:12,
            icon:"https://waa.ai/JEwF.png",
            color:"yellow",
            fullname:"Yuuko Omori",
            alter_ego:"Cure Honey",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The light of life flourishing on the Earth, Cure Honey!",
            special_attack:"Sparkling Baton Attack",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389083162050581/817786309334663188/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The light of life flourishing on the Earth, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Honey Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/8c/Puzzlun_Sprite_HCPC_Cure_Honey_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The light of life flourishing on the Earth, Cure Honey Innocent Form!"
                }
            }
        },
        kirara:{
            total:16,
            icon:"https://waa.ai/JEw0.png",
            color:"yellow",
            fullname:"Kirara Amanogawa",
            alter_ego:"Cure Twinkle",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the twinkling stars! Cure Twinkle!",
            special_attack:"Twinkle Humming",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389968457859093/817786728202502204/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389968457859093/822056102803800064/image0.gif"],
            hint_chiguhaguu:"Princess of the twinkling stars! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Twinkle Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cb/Puzzlun_Sprite_GPPC_Cure_Twinkle_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the twinkling stars! Cure Twinkle!"
                }
            }
        },
        himari:{
            total:15,
            icon:"https://waa.ai/JEw9.png",
            color:"yellow",
            fullname:"Himari Arisugawa",
            alter_ego:"Cure Custard",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Intelligence and Courage! Let's La Mix It All Up! Cure Custard! Ready To Serve!",
            special_attack:"Custard Illusion",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392228168237086/817793084657631262/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"With Intelligence and Courage! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Custard A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/7/7b/Puzzlun_Sprite_KKPCALM_Cure_Custard_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Custard A la Mode!"
                }
            }
        },
        homare:{
            total:14,
            icon:"https://waa.ai/JEwS.png",
            color:"yellow",
            fullname:"Homare Kagayaki",
            alter_ego:"Cure Etoile",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile!",
            special_attack:"Heart Star",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394718305419265/817794207732727858/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Making everyone shine! The Pretty Cure of Strength! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Etoile Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a3/Puzzlun_Sprite_HuPC_Cure_Etoile_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Etoile Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/bc/Puzzlun_Sprite_HuPC_Cure_Etoile_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile Mother Heart!"
                }
            }
        },
        elena:{
            total:11,
            icon:"https://waa.ai/JEws.png",
            color:"yellow",
            fullname:"Elena Amamiya",
            alter_ego:"Cure Soleil",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the sky! With sparkling heat! Cure Soleil!",
            special_attack:"Soleil Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396010227204117/817794841130827786/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Light up the sky! With sparkling heat! <x>!!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Soleil Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/56/Puzzlun_Sprite_STPC_Cure_Soleil_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"Light up the sky! With sparkling heat! Cure Soleil Twinkle Style!"
                }
            }
        },
        hinata:{
            total:5,
            icon:"https://waa.ai/JEwC.png",
            color:"yellow",
            fullname:"Hinata Hiramitsu",
            alter_ego:"Cure Sparkle",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two lights that come together! Cure Sparkle!",
            special_attack:"Healing Flash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396923054686219/825099367849263134/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396923054686219/822038127509766154/image0.gif"],
            hint_chiguhaguu:"The two lights that come together! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yuri:{
            total:13,
            icon:"https://static.wikia.nocookie.net/prettycure/images/7/71/Puzzlun_Sprite_HPC_Cure_Moonlight.png",
            color:"purple",
            fullname:"Yuri Tsukikage",
            alter_ego:"Cure Moonlight",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that shines in the moon's light, Cure Moonlight!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Silver Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383243750703144/817782029147832360/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793383243750703144/822048055788437504/image0.gif"],
            hint_chiguhaguu:"The flower that shines in the moon's light, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Moonlight Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/dc/Puzzlun_Sprite_HPC_Cure_Moonlight_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        makoto:{
            total:11,
            icon:"https://waa.ai/JEwc.png",
            color:"purple",
            fullname:"Makoto Kenzaki",
            alter_ego:"Cure Sword",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The courageous blade! Cure Sword!",
            special_attack:"Sword Hurricane",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388248139300864/817785553084219402/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The courageous blade! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        iona:{
            total:12,
            icon:"https://waa.ai/JEwV.png",
            color:"purple",
            fullname:"Iona Hikawa",
            alter_ego:"Cure Fortune",
            henshin_phrase:"Pretty Cure! Kirarin Star Symphony",
            transform_quotes:"The star of hope that glitters in the night sky! Cure Fortune!",
            special_attack:"Stardust Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389261570965504/817786376220835840/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The star of hope that glitters in the night sky! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Fortune Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2b/Puzzlun_Sprite_HCPC_Cure_Fortune_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The star of hope that glitters in the night sky! Cure Fortune Innocent Form!"
                }
            }
        },
        riko:{
            total:15,
            icon:"https://waa.ai/JEww.png",
            color:"purple",
            fullname:"Riko Izayoi",
            alter_ego:"Cure Magical",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Magic! Cure Magical!",
            special_attack:"Diamond Eternal",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391024067837972/817792621912129536/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Our Magic! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                ruby:{
                    name:"Cure Magical Ruby Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/d0/Puzzlun_Sprite_MTPC_Cure_Magical_Ruby.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Ruby Style!"
                },
                sapphire:{
                    name:"Cure Magical Sapphire Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2a/Puzzlun_Sprite_MTPC_Cure_Magical_Sapphire.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Sapphire Style!"
                },
                alexandrite:{
                    name:"Cure Magical Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/d1/Puzzlun_Sprite_MTPC_Cure_Magical_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Alexandrite Style!"
                }
            }
        },
        yukari:{
            total:16,
            icon:"https://waa.ai/JEwy.png",
            color:"purple",
            fullname:"Yukari Kotozume",
            alter_ego:"Cure Macaron",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Beauty and Excitement! Let's La Mix It All Up! Cure Macaron! Is Ready To Serve!",
            special_attack:"Macaron Julienne",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392786367316038/817793379797696512/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"With Beauty and Excitement! Let's La Mix It All Up! <x>! Is Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Macaron A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/6/6f/Puzzlun_Sprite_KKPCALM_Cure_Macaron_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Macaron A la Mode!"
                }
            }
        },
        ruru:{
            total:11,
            icon:"https://waa.ai/JEwH.png",
            color:"purple",
            fullname:"Ruru Amour",
            alter_ego:"Cure Amour",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Amour!",
            special_attack:"Heart Dance",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395175695187980/817794367410143262/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Loving everyone! The Pretty Cure of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Amour Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/1f/Puzzlun_Sprite_HuPC_Cure_Amour_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Amour Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Amour Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/26/Puzzlun_Sprite_HuPC_Cure_Amour_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Amour Mother Heart!"
                }
            }
        },
        madoka:{
            total:12,
            icon:"https://waa.ai/JEwU.png",
            color:"purple",
            fullname:"Madoka Kaguya",
            alter_ego:"Cure Selene",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the night sky! With the secretive moonlight! Cure Selene!",
            special_attack:"Selene Arrow",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396194697019412/817794901722005554/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Light up the night sky! With the secretive moonlight! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Selene Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/5d/Puzzlun_Sprite_STPC_Cure_Selene_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"Light up the night sky! With the secretive moonlight! Cure Selene Twinkle Style!"
                }
            }
        },
        kurumi:{
            total:12,
            icon:"https://waa.ai/JEwK.png",
            color:"purple",
            fullname:"Kurumi Mimino",
            alter_ego:"Milky Rose",
            henshin_phrase:"Skyrose Translate!",
            transform_quotes:"The blue rose is my secret emblem! Milky Rose!",
            special_attack:"Metal Blizzard",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380840255389716/817776335572172880/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380840255389716/826556276469137418/image0.gif"],
            hint_chiguhaguu:"The blue rose is my secret emblem! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        rin:{
            total:11,
            icon:"https://waa.ai/JEwR.png",
            color:"red",
            fullname:"Rin Natsuki",
            alter_ego:"Cure Rouge",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The red flame of passion, Cure Rouge!",
            special_attack:"Fire Strike",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379843483631626/817776006181945374/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793379843483631626/822044204128534528/image0.gif"],
            hint_chiguhaguu:"The red flame of passion, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        setsuna:{
            total:11,
            icon:"https://waa.ai/JEwQ.png",
            color:"red",
            fullname:"Setsuna Higashi",
            alter_ego:"Cure Passion",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The scarlet heart is the proof of happiness! Freshly-ripened, Cure Passion!",
            special_attack:"Happiness Hurricane",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382021044371507/817776964298866688/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382021044371507/822035356319875092/image0.gif"],
            hint_chiguhaguu:"The scarlet heart is the proof of happiness! Freshly-ripened, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        akane:{
            total:11,
            icon:"https://waa.ai/JEw2.png",
            color:"red",
            fullname:"Akane Hino",
            alter_ego:"Cure Sunny",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"The brilliant sun, hot-blooded power! Cure Sunny!",
            special_attack:"Sunny Fire",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386538045276171/817783836435021824/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386538045276171/822031840202063932/image0.gif"],
            hint_chiguhaguu:"The brilliant sun, hot-blooded power! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Sunny Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/0/04/Puzzlun_Sprite_SmPC_Cure_Sunny_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Sunny!"
                }
            }
        },
        aguri:{
            total:12,
            icon:"https://waa.ai/JEwB.png",
            color:"red",
            fullname:"Aguri Madoka",
            alter_ego:"Cure Ace",
            henshin_phrase:"Pretty Cure, Dress Up!",
            transform_quotes:"The Trump Card of Love! Cure Ace!",
            special_attack:"Ace Shot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388428150046740/817786014482825226/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The Trump Card of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        towa:{
            total:15,
            icon:"https://waa.ai/JEwI.png",
            color:"red",
            fullname:"Towa Akagi",
            alter_ego:"Cure Scarlet",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of crimson flames! Cure Scarlet!",
            special_attack:"Phoenix Blaze",
            img_special_attack:"https://cdn.discordapp.com/attachments/793390200070864908/817786809270403114/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793390200070864908/822056130271641610/image0.gif"],
            hint_chiguhaguu:"Princess of crimson flames! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Scarlet Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2f/Puzzlun_Sprite_GPPC_Cure_Scarlet_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of crimson flames! Cure Scarlet!"
                }
            }
        },
        akira:{
            total:16,
            icon:"https://waa.ai/JEw8.png",
            color:"red",
            fullname:"Akira Kenjou",
            alter_ego:"Cure Chocolat",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Strength and Love! Let's La Mix It All Up! Cure Chocolat! Is Ready To Serve!",
            special_attack:"Chocolat Aromase",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393018614841355/817793497238601738/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793393018614841355/822041731855286282/image0.gif"],
            hint_chiguhaguu:"With Strength and Love! Let's La Mix It All Up! <x>! Is Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Chocolat A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/f9/Puzzlun_Sprite_KKPCALM_Cure_Chocolat_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Chocolat A la Mode!"
                }
            }
        },
        emiru:{
            total:11,
            icon:"https://waa.ai/JEwW.png",
            color:"red",
            fullname:"Emiru Aisaki",
            alter_ego:"Cure Macherie",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Machérie!",
            special_attack:"Heart Song",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394965690318898/817794295641407548/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Loving everyone! The Pretty Cure of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Macherie Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/3/33/Puzzlun_Sprite_HuPC_Cure_Macherie_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Macherie Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Macherie Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cb/Puzzlun_Sprite_HuPC_Cure_Macherie_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Macherie Mother Heart!"
                }
            }
        },
        komachi:{
            total:13,
            icon:"https://waa.ai/JEwi.png",
            color:"green",
            fullname:"Komachi Akimoto",
            alter_ego:"Cure Mint",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The green earth of tranquility, Cure Mint!",
            special_attack:"Emerald Saucer",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380333194051614/817776166597034014/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380333194051614/822044644505944074/image0.gif"],
            hint_chiguhaguu:"The green earth of tranquility, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        nao:{
            total:11,
            icon:"https://waa.ai/JEwD.png",
            color:"green",
            fullname:"Nao Midorikawa",
            alter_ego:"Cure March",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Intense courage, a straight-up bout! Cure March!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess March!",
            special_attack:"March Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386892137332756/817784444546449468/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386892137332756/822031246094761984/image0.gif"],
            hint_chiguhaguu:"Intense courage, a straight-up bout! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure March Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/bc/Puzzlun_Sprite_SmPC_Cure_March_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess March!",
                }
            }
        },
        kotoha:{
            total:15,
            icon:"https://waa.ai/JEwd.png",
            color:"green",
            fullname:"Kotoha Hanami",
            alter_ego:"Cure Felice",
            henshin_phrase:"Felice, Fun Fun, Flowerle!",
            transform_quotes:"Spreading blessings to lives far and wide! Cure Felice!",
            special_attack:"Emerald Reincarnation",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391246495449088/817786930174885898/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Spreading blessings to lives far and wide! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                alexandrite:{
                    name:"Cure Felice Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/fe/Puzzlun_Sprite_MTPC_Cure_Felice_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Felice Alexandrite Style!"
                }
            }
        },
        ciel:{
            total:12,
            icon:"https://waa.ai/JEwM.png",
            color:"green",
            fullname:"Ciel Kirahoshi",
            alter_ego:"Cure Parfait",
            henshin_phrase:"Cure La Mode・Decoration!",
            transform_quotes:"With Dreams and Hope! Let's La Mix It All Up! Cure Parfait! Is Ready To Serve",
            special_attack:"Parfait Étoile",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393296957243403/817793570161295390/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793393296957243403/822041883827896341/image0.gif"],
            hint_chiguhaguu:"With Dreams and Hope! Let's La Mix It All Up! <x>! Is Ready To Serve",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Parfait A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/10/Puzzlun_Sprite_KKPCALM_Cure_Parfait_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Parfait A la Mode!"
                }
            }
        },
        lala:{
            total:11,
            icon:"https://waa.ai/JEw6.png",
            color:"green",
            fullname:"Lala Hagoromo",
            alter_ego:"Cure Milky",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The milky way stretching across the heavens! Cure Milky!",
            special_attack:"Milky Shock",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395855654518814/817794616949997588/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The milky way stretching across the heavens! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Milky Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/e/e5/Puzzlun_Sprite_STPC_Cure_Milky_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The milky way stretching across the heavens! Cure Milky Twinkle Style!"
                }
            }
        },
        honoka:{
            total:18,
            icon:"https://waa.ai/JEwL.png",
            color:"white",
            fullname:"Honoka Yukishiro",
            alter_ego:"Cure White",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure White!",
            special_attack:"Marble Screw",
            img_special_attack:"https://cdn.discordapp.com/attachments/793377043646775297/817775439320842320/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Emissary of light, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        mai:{
            total:10,
            icon:"https://waa.ai/JEwb.png",
            color:"white",
            fullname:"Mai Mishou",
            alter_ego:"Cure Egret",
            henshin_phrase:"Dual Spiritual Power!",
            transform_quotes:"The sparkling silver wing, Cure Egret!",
            special_attack:"Twin Stream Splash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379085069844520/817775792875372554/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The sparkling silver wing, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        kanade:{
            total:12,
            icon:"https://waa.ai/JEwA.png",
            color:"white",
            fullname:"Kanade Minamino",
            alter_ego:"Cure Rhythm",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the graceful tune, Cure Rhythm!",
            special_attack:"Fantastic Piacere",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383859348701195/817782937667895306/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Playing the graceful tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        }
    };

    static spawnHintSeries = {
        "max heart":"yin & yang",
        "splash star":"flower, bird, wind and moon",
        "yes! precure 5 gogo!":"natural elements, human characteristics and emotions",
        "fresh":"fruits, clovers, card suits, and dancing",
        "heartcatch":"flowers and Hanakotoba",
        "suite":":musical_note: musical theme",
        "smile":"fairy tales",
        "doki doki!":"emotions and selflessness",
        "happiness":"mirrors, fashion, dancing and romance",
        "go! princess":"princesses, personal goals and dreams",
        "mahou tsukai":"sorcery, gemstones and friendship",
        "kirakira":"sweets, animals and creativity",
        "hugtto":"destiny, future, heroism, parenting, and jobs",
        "star twinkle":"space, astrology and imagination",
        "healin' good":"health, nature, and animals"
    }

    static arrSeriesList = ["sp001","sp002","sp003","sp004","sp005","sp006","sp007","sp008","sp009","sp010","sp011","sp012","sp013","sp014","sp015"];
    static arrSeriesName = ["max heart","splash star","yes! precure 5 gogo!","fresh","heartcatch","suite","smile","doki doki!","happiness","go! princess","mahou tsukai","kirakira","hugtto","star twinkle","healin' good"];

    static seriesCardCore = {
        sp001:{
            value:"sp001",
            pack:"max heart",
            currency:"Heartiel Points"
        },
        sp002:{
            value:"sp002",
            pack:"splash star",
            currency:"Miracle Drop Points"
        },
        sp003:{
            value:"sp003",
            pack:"yes! precure 5 gogo!",
            currency:"Palmin Points"
        },
        sp004:{
            value:"sp004",
            pack:"fresh",
            currency:"Linkrun Points"
        },
        sp005:{
            value:"sp005",
            pack:"heartcatch",
            currency:"Heart Seed Points"
        },
        sp006:{
            value:"sp006",
            pack:"suite",
            currency:"Melody Note Points"
        },
        sp007:{
            value:"sp007",
            pack:"smile",
            currency:"Decor Points"
        },
        sp008:{
            value:"sp008",
            pack:"doki doki!",
            currency:"Lovead Points"
        },
        sp009:{
            value:"sp009",
            pack:"happiness",
            currency:"Precard Points"
        },
        sp010:{
            value:"sp010",
            pack:"go! princess",
            currency:"Princess Points"
        },
        sp011:{
            value:"sp011",
            pack:"mahou tsukai",
            currency:"Linkle Points"
        },
        sp012:{
            value:"sp012",
            pack:"kirakira",
            currency:"Kirakiraru"
        },
        sp013:{
            value:"sp013",
            pack:"hugtto",
            currency:"Mirai Crystal Points"
        },
        sp014:{
            value:"sp014",
            pack:"star twinkle",
            currency:"Twinkle Points"
        },
        sp015:{
            value:"sp015",
            pack:"healin' good",
            currency:"Elemental Points"
        },
        "max heart":{
            special_name:"Extreme Luminario",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png",
            series_point:"sp001",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617394872614942/latest.png"
        },
        "splash star":{
            special_name:"Spiral Heart Splash",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146180845207602/image0.png",
            series_point:"sp002",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617466529021962/Puzzlun_data_download_cures_4.png"
        },
        "yes! precure 5 gogo!":{
            special_name:"Milky Rose Floral Explosion",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146259148668965/image0.png",
            series_point:"sp003",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617508936974357/latest.png"
        },
        "fresh":{
            special_name:"Lucky Clover Grand Finale",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146317411483688/image0.png",
            series_point:"sp004",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617558089367552/latest.png"
        },
        "heartcatch":{
            special_name:"Heartcatch Orchestra",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824149388389646336/image0.png",
            series_point:"sp005",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617596086878239/latest.png"
        },
        "suite":{
            special_name:"Suite Session Ensemble Crescendo",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824150226645680138/image0.png",
            series_point:"sp006",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617647847473160/latest.png"
        },
        "smile":{
            special_name:"Royal Rainbow Burst",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824151822146207764/image0.png",
            series_point:"sp007",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617680399728690/latest.png"
        },
        "doki doki!":{
            special_name:"Royal Lovely Straight Flush",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png",
            series_point:"sp008",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png"
        },
        "happiness":{
            special_name:"Innocent Purification",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png",
            series_point:"sp009",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png"
        },
        "go! princess":{
            special_name:"Grand Printemps",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp",
            series_point:"sp010",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png"
        },
        "mahou tsukai":{
            special_name:"Extreme Rainbow",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp",
            series_point:"sp011",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png"
        },
        "kirakira":{
            special_name:"Fantastic Animale",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp",
            series_point:"sp012",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png"
        },
        "hugtto":{
            special_name:"Minna de Tomorrow",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156303525019648/image0.webp",
            series_point:"sp013",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845618022843809842/latest.png"
        },
        "star twinkle":{
            special_name:"Star Twinkle Imagination",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156329014460416/image0.png",
            series_point:"sp014",
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/845618044655239188/latest.png"
        },
        "healin' good":{
            special_name:"Healing Oasis",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png",
            series_point:"sp015",
            icon:""
        }
    }


    static interactionSeriesList = [
        {
            name: "max-heart",
            value: "max heart"
        },
        {
            name: "splash-star",
            value: "splash star"
        },
        {
            name: "yes-precure-5-gogo",
            value: "yes! precure 5 gogo!"
        },
        {
            name: "fresh",
            value: "fresh"
        },
        {
            name: "heartcatch",
            value: "heartcatch"
        },
        {
            name: "suite",
            value: "suite"
        },
        {
            name: "smile",
            value: "smile"
        },
        {
            name: "doki-doki",
            value: "doki doki!"
        },
        {
            name: "happiness",
            value: "happiness"
        },
        {
            name: "go-princess",
            value: "go! princess"
        },
        {
            name: "mahou-tsukai",
            value: "mahou tsukai"
        },
        {
            name: "kirakira",
            value: "kirakira"
        },
        {
            name: "hugtto",
            value: "hugtto"
        },
        {
            name: "star-twinkle",
            value: "star twinkle"
        },
        {
            name: "healin-good",
            value: "healin' good"
        }
    ];

    static interactionColorList = [
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
    ];

}

class PrecureStarTwinkleCore{
    static fuwaConstellationData = {
        aries:{
            name:"Aries Fuwa",
            img_url:["https://cdn.discordapp.com/attachments/841371817704947722/841519710062247936/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841519710285332490/image1.png"]
        },
        taurus:{
            name:"Taurus Fuwa",
            img_url:["https://cdn.discordapp.com/attachments/841371817704947722/841519957682552832/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841519957934342144/image1.png"]
        },
        gemini:{
            name:"Gemini Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841520642935226388/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841520643178889246/image1.png"
            ]
        },
        cancer:{
            name:"Cancer Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841521681398497320/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841521681628528680/image1.png"
            ]
        },
        leo:{
            name:"Leo Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841522187881414706/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841522188099780628/image1.png"
            ]
        },
        virgo:{
            name:"Virgo Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841523045402279956/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841523045638471710/image1.png"
            ]
        },
        libra:{
            name:"Libra Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841524914317951086/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841524914543788053/image1.png"
            ]
        },
        scorpio:{
            name:"Scorpio Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841525434931085332/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841525435221016586/image1.png"
            ]
        },
        sagittarius:{
            name:"Sagittarius Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841525834703437835/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841525835013423134/image1.png"
            ]
        },
        capricorn:{
            name:"Capricorn Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841526112294797312/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841526112533741588/image1.png"
            ]
        },
        aquarius:{
            name:"Aquarius Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841526881769881630/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841526881987723284/image1.png"
            ]
        },
        pisces:{
            name:"Pisces Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841527139165798400/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841527139496099850/image1.png"
            ]
        }
    }
}

class Battle{
    //contain the values of battle type
    static type = {
        normal:"normal",//tsunagarus
        raid:"raid"//not implemented yet but for upcoming updates
    }

    static async getEnemyData(id_enemy){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Enemies.columns.id,id_enemy);
        var result = await DB.select(DBM_Card_Enemies.TABLENAME,parameterWhere);
        return result[0][0];
    }

    static embedBossViewer(enemy_type,level,color_lives,type,rarity,atk,hp,_special_protection){
        var special_protection = "❌";
        
        if(_special_protection){
            special_protection = `✅`;
        }

        return {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemy_type].embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Lv.${level}`,
            description: transformQuotes,
            fields:[
                {
                    name:`Color Lives:`,
                    value:color_lives,
                    inline:true
                },
                {
                    name:`Enemy Type:`,
                    value:type,
                    inline:true
                },
                {
                    name:`Min. Rarity:`,
                    value:rarity,
                    inline:true
                },
                {
                    name:`Party Atk:`,
                    value:atk,
                    inline:true
                }
            ],
            image:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemy_type].image
            },
            footer:{
                text:`Special Protection: ${special_protection}`
            }
        }
    }

}

class Leveling {
    // 1 star was Lv.20, 2 star was Lv.25, 3 star was Lv.35, 4 star and Cure Cards was Lv.40 and 5 star and Premium Cure Cards was Lv.50
    static getMaxLevel(rarity){
        switch(rarity){
            case 1:
                return 20;
                break;
            case 2:
                return 25;
                break;
            case 3:
                return 35;
                break;
            case 4:
                return 40;
                break;
            default:
                return 50;
                break;
        }
    }

    static getNextCardExp(level,qty=1){
        var tempExp = 0;
        if(qty<=1){
            tempExp+=(level+1)*10;
        } else {
            //parameter:3: level 1->4
            for(var i=0;i<qty;i++){
                tempExp+=(level+1)*10;
                level+=1;
            }
        }
        
        return tempExp;
    }

    static getNextCardSpecialTotal(level){
        //get the card stock requirement to level up the specials
        switch(level){
            case 1:
                return 1;
            case 2:
                return 2;
            default:
                return 4;
        }
    }
    
}

class Shop {
    static async embedShopList() {
        var itemList = ""; var itemList2 = ""; var itemList3 = "";
        var result = await DB.selectAll(DBM_Item_Data.TABLENAME);
        result[0].forEach(item => {
            itemList += `**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`
            itemList2 += `${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
            itemList3 += `${item[DBM_Item_Data.columns.description]}\n`;
        });

        return {
            color: Properties.embedColor,
            author: {
                name: "Mofu shop",
                icon_url: "https://waa.ai/JEwn.png"
            },
            title: `Item Shop List:`,
            description: `Welcome to Mofushop! Here are the available item list that you can purchase:\nUse **p!card shop buy <item id> [qty]** to purchase the item.`,
            fields:[
                {
                    name:`ID - Name:`,
                    value:itemList,
                    inline:true
                },
                {
                    name:`Price (MC):`,
                    value:itemList2,
                    inline:true
                },
                {
                    name:`Description`,
                    value:itemList3,
                    inline:true
                }
            ],
        }
    }
}

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
        var specialCharged = false;
        var maxPoint = 100;
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
            if(cardUserStatusData[DBM_Card_User_Data.columns.special_point]-value<=0){
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = 0 `;
            } else {
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${DBM_Card_User_Data.columns.special_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
        SET ${querySpecialPoint} 
        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
    
        await DBConn.conn.promise().query(query, [id_user]);
        return specialCharged;
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

class Skills {
    static skillCoreData = {
        card_duplicator: {
            cp_cost:100
        },
        atk_boost_s: {
            cp_cost:30
        },
        hp_boost_s: {
            cp_cost:30
        },
        rarity_boost_s: {
            cp_cost:30
        },
        recover:{
            cp_cost:20
        }
    }
}

class TradeBoard {
    static async getTradeboardData(id_guild,id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
        if(resultCheckExist[0][0]==null){
            //insert if not found
            var parameter = new Map();
            parameter.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameter.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            await DB.insert(DBM_Card_Tradeboard.TABLENAME,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
            return await resultCheckExist[0][0];
        } else {
            return await resultCheckExist[0][0];
        }
    }

    static async removeListing(id_guild,id_user){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_want,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_have,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.last_update,null);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        await DB.update(DBM_Card_Tradeboard.TABLENAME,parameterSet,parameterWhere);
    }
}

class Quest {
    static questData = {
        last_daily_quest:"last_daily_quest",
        dataQuest:"dataQuest"
    }

    static async setQuestData(idUser,objReward){
        var todayDate = new Date().getDate();
        var questData = `{"${this.questData.last_daily_quest}":${todayDate},"${this.questData.dataQuest}":${objReward}}`;
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.daily_quest,questData);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,idUser);
        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static getQuestReward(cardRarity){
        return cardRarity*30;
    }
}

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
            image:{
                url:imgTransformation
            },
            footer:{
                text:`Cure Avatar ID: ${cardId}`
            }
        }

        var henshinFormData = null;
        if(henshinForm.toLowerCase()=="normal"){
            objEmbed.thumbnail = {
                url:Properties.dataCardCore[packName].icon
            }
        } else {
            henshinFormData = Properties.dataCardCore[packName].form[henshinForm];
            objEmbed.title = henshinFormData.quotes_head;
            objEmbed.description = henshinFormData.quotes_description;
            objEmbed.thumbnail = {
                url:henshinFormData.img_url
            }
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
        return {
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
        }
    }

    static teamBattleSpecialActivated(embedColor,userUsername,userAvatarUrl,seriesName,packName,teamName,rewardsReceived){
        return {
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
        }
    }

    static teamBattleSpecialActivatedHitOne(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return {
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
        }
    }

    static battleSpecialReady(userUsername,userAvatarUrl,individual=true){
        var txtDescription = `Your special point is ready now! You can use the special attack on the next battle spawn.`;
        if(!individual){
            txtDescription = `Your party special point has been fully charged!.`;
        }
        return {
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
        }
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

        return objEmbed;
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

        return objEmbed;
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
        
        return objEmbed;
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

        return objEmbed;
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

        return objEmbed;
    }

    static battleWin(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return {
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
        }
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
        
        return objEmbed;
    }

    static teamBattleWin(packName,seriesName,partyName,txtReward){
        return {
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
        }
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
        
        return objEmbed;
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
        
        return objEmbed;
    }

    static embedCardCaptureNew(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return {
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
        };
    }

    static embedCardCaptureDuplicate(embedColor,id_card,
    cardName,pointReward,seriesCurrency,imgUrl,avatarImgUrl,username,seriesPoint=0,cardQty=1){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return {
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
        };
    }

    static embedCardCaptureDuplicateMaxCard(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return {
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
        };
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

}

class Title {
    static cardTitleData = {
        card_master: {
            value:"card_master",
            name:"Card Master",
            description:"Complete all precure card."
        },
        master_of_pink: {
            value:"master_of_pink",
            name:"Master of Pink",
            description:"Complete all pink precure card list."
        },
        master_of_yellow: {
            value:"master_of_yellow",
            name:"Master of Yellow",
            description:"Complete all yellow precure card list."
        },
        master_of_green: {
            value:"master_of_green",
            name:"Master of Green",
            description:"Complete all green precure card list."
        },
        master_of_blue: {
            value:"master_of_blue",
            name:"Master of Blue",
            description:"Complete all blue precure card list."
        },
        master_of_purple: {
            value:"master_of_purple",
            name:"Master of Purple",
            description:"Complete all purple precure card list."
        },
        master_of_red: {
            value:"master_of_red",
            name:"Master of Red",
            description:"Complete all red precure card list."
        },
        master_of_white: {
            value:"master_of_white",
            name:"Master of White",
            description:"Complete all white precure card list."
        },
    }
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

function embedCardLevelUp(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,username,
    level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var hpHeader = "HP: "; var modifiedHp = "";
    if(Status.getModifiedHp(level,max_hp)>0){
        hpHeader += Status.getHp(level,max_hp);
        modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
    }

    var objEmbed = {
        color:Properties.dataColorCore[embedColor].color,
        author:{
            iconURL:Properties.dataCardCore[packName].icon,
            name:`Level ${level}/${Leveling.getMaxLevel(rarity)}`
        },
        title:cardName,
        thumbnail:{
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
                value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                inline:true
            },
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
                name:`Special:`,
                value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                inline:true
            }
        ],
        footer:{
            iconURL:avatarImgUrl,
            text:`${username}`
        }
    }

    switch(type){
        case Properties.cardCategory.gold.value:
            objEmbed.color = Properties.cardCategory[type].color;
            objEmbed.title = `${cardName} ✨`;
            break;
    }


    return new MessageEmbed(objEmbed);
}

function embedCardCapture(embedColor,id_card,packName,
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
                value:`${rarity} :star:`,
                inline:true
            },
            {
                name:"HP:",
                value:`${max_hp}`,
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

    return objEmbed;
}

function embedCardDetail(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,receivedDate,
    level,max_hp,max_atk,special_level,stock=0,ability1,type=Properties.cardCategory.normal.value){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var customReceivedDate = new Date(receivedDate);
    customReceivedDate = `${("0" + receivedDate.getDate()).slice(-2)}/${("0" + (receivedDate.getMonth() + 1)).slice(-2)}/${customReceivedDate.getFullYear()}`;

    var txtPartyAbility = "-";
    if(ability1 in StatusEffect.partyBuffData){
        txtPartyAbility = `**${StatusEffect.partyBuffData[ability1].name}:**\n${StatusEffect.partyBuffData[ability1].description}`;
    }

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
                value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                inline:true
            },
            {
                name:`❤️HP:`,
                value:`${Status.getHp(level,max_hp)}`,
                inline:true
            },
            {
                name:"⚔️Atk:",
                value:`${Status.getAtk(level,max_atk)}`,
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

    if(stock>=1){
        objEmbed.footer.text+= ` | Stock:${stock}`;
    }

    return new MessageEmbed(objEmbed);
}

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

async function getAverageLevel(id_user,arrColorLevel=null){
    if(arrColorLevel==null){
        //if arrColorLevel provided we dont need to read it from db
        var userData = await getCardUserStatusData(id_user);
        arrColorLevel = [
            userData[DBM_Card_User_Data.columns.color_level_blue],
            userData[DBM_Card_User_Data.columns.color_level_green],
            userData[DBM_Card_User_Data.columns.color_level_pink],
            userData[DBM_Card_User_Data.columns.color_level_purple],
            userData[DBM_Card_User_Data.columns.color_level_red],
            userData[DBM_Card_User_Data.columns.color_level_white],
            userData[DBM_Card_User_Data.columns.color_level_yellow]
        ]
    }
    var total = 0;
    for(var i = 0; i < arrColorLevel.length; i++) {
        total += arrColorLevel[i];
    }
    return Math.ceil(total / arrColorLevel.length);
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

async function getCardBattleInstanceData(userId){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Battle_Instance.columns.id_user,userId);
    var cardInstanceData = await DB.select(DBM_Card_Battle_Instance.TABLENAME,parameterWhere);
    cardInstanceData = cardInstanceData[0];
    if(cardInstanceData.length<=0){
        return null;
    }
    return cardInstanceData;
}

async function generateCardCureDuel(userId,overwriteToken = true,update=false){
    var battleInstanceData = await getCardBattleInstanceData(userId);
    var dtBattle = "{";
    if(battleInstanceData==null&&!update){
        
    }
    
    dtBattle += "}";

    var query = `SELECT * FROM ${DBM_Card_Data.TABLENAME} WHERE ${DBM_Card_Data.columns.rarity}=(
        SELECT max(${DBM_Card_Data.columns.rarity}) FROM ${DBM_Card_Data.TABLENAME} 
            where pack=? 
    ) and series=? and pack=?`;
}

async function generateCardSpawn(id_guild,specificType=null,overwriteToken = true,spawnData2=null,spawnData3=null){
    var cardGuildData = await CardGuildModules.getCardGuildData(id_guild);
    //reset guild timer information
    //update & erase last spawn information if overwriteToken param is provided
    if(overwriteToken){
        await removeCardGuildSpawn(id_guild);
    }
    
    // var rndIndex = GlobalFunctions.randomNumber(0,Properties.spawnType.length-1); 
    // // var cardSpawnType = Properties.spawnType[rndIndex].toLowerCase();
    // // if(specificType!=null){
    // //     cardSpawnType = specificType;
    // // }

    //start randomize the spawn
    var cardSpawnType = "";

    // for (const key in Properties.objSpawnType) {
    //     if(cardSpawnType==""){
    //         var rnd = GlobalFunctions.randomNumber(0,100);
    //         var minRnd = 100-Properties.objSpawnType[key];//get the minimum random number
    //         if(rnd>=minRnd){
    //             cardSpawnType = key;
    //         }
    //     }
    // }

    //if card spawn is empty set to default:normal
    if(cardSpawnType==""){
        cardSpawnType = "color";
    }

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
        var rnd = GlobalFunctions.randomNumber(0,1);
        switch(rnd){
            case 0:
                cardSpawnType = "normal";
                break;
            case 1:
                cardSpawnType = "quiz";
                break;
        }
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number){
        cardSpawnType = "number";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.color+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.series){
        var rnd = GlobalFunctions.randomNumber(0,1);
        switch(rnd){
            case 0:
                cardSpawnType = "series";
                break;
            case 1:
                cardSpawnType = "color";
                break;
        }
    } else {
        cardSpawnType = "battle";
    }

    if(specificType!=null){
        cardSpawnType=specificType;
    }

    //for debugging purpose:
    // cardSpawnType = "quiz";

    var query = "";
    //prepare the embed object
    // var objEmbed = {
    //     color: Properties.embedColor
    // }

    var objEmbed = new Discord.MessageEmbed(objEmbed);
    objEmbed.color = Properties.embedColor;

    //get color total
    // var colorTotal = 0; 
    // for ( var {} in Properties.dataColorCore ) { colorTotal++; }

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
            objEmbed.description = `A **color** card has appeared! Use: **p!card catch** to capture the card based from your assigned color.`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
            break;
        case "series":
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Series Card";
            objEmbed.description = `A **series** card has appeared! Use: **p!card catch** to capture the card based from your assigned series.`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
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

            if(cardSpawnType=="number"){
                objEmbed.author = {
                    name:`Number Card: ${GlobalFunctions.capitalize(selectedColor)} Edition`
                }
                objEmbed.title = ":game_die: It's Lucky Numbers Time!";
                objEmbed.description = `Guess whether the hidden number**(1-12)** will be **lower** or **higher** than the current number: **${rndNumber}** with: **p!card guess <lower/higher>**`;
                objEmbed.image = {
                    url:Properties.dataColorCore[selectedColor].imgMysteryUrl
                }
            }
            
            objEmbed.footer = {
                text:`⭐ Rarity: 4-5 | ⏫ Catch Rate: 100%`
            }
            
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
                    `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeNormal}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);
        
                    //prepare the embed:
                    objEmbed.author = {
                        name:`Quiz Card`,
                    }
                    objEmbed.title = `:grey_question: It's Quiz Time!`;
                    objEmbed.description = `The series theme/motif was about: **${Properties.spawnHintSeries[cardSpawnSeries]}** and I'm known as **${alterEgo}**. Who am I?`;
                    objEmbed.fields = [{
                        name:`Answer command:\np!card answer <a/b/c/d>`,
                        value:`**A. ${Properties.dataCardCore[arrAnswerList[0]].fullname}\nB. ${Properties.dataCardCore[arrAnswerList[1]].fullname}\nC. ${Properties.dataCardCore[arrAnswerList[2]].fullname}\nD. ${Properties.dataCardCore[arrAnswerList[3]].fullname}**`
                    }]
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
                    `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeTsunagarus}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);
    
                    //prepare the embed:
                    objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.embedColor;
                    objEmbed.author = {
                        name:`Quiztaccked!`,
                    }
                    objEmbed.thumbnail = {
                        url:Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `**${GlobalFunctions.capitalize(TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.term)}** has take over the quiz time!\nRearrange this provided hint: **${name}** and choose the correct branch!`;
                    objEmbed.fields = [{
                        name:`Branch command:\np!card choose <a/b/c/d>`,
                        value:`**A. ${arrAnswerList[0]}\nB. ${arrAnswerList[1]}\nC. ${arrAnswerList[2]}\nD. ${arrAnswerList[3]}**`
                    }]
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
                                var tempAnswer = 0;
                                var randomEquation = GlobalFunctions.randomNumber(0,1);
                                if(randomEquation==0){
                                    tempAnswer = totalStars-GlobalFunctions.randomNumber(1,2+i);
                                } else {
                                    tempAnswer = totalStars+GlobalFunctions.randomNumber(1,2+i);
                                }

                                if(arrAnswerList.includes(tempAnswer)){
                                    i-=1;
                                } else {
                                    arrAnswerList.push(tempAnswer);
                                }
                            }

                            arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                            answer = arrAnswerList.indexOf(totalStars);

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
                            
                            objEmbed.fields = [{
                                name:`Answer command:\np!card answer <a/b/c/d>`,
                                value:`**A.** ${arrAnswerList[0]}\n**B.** ${arrAnswerList[1]}\n**C.** ${arrAnswerList[2]}\n**D.** ${arrAnswerList[3]}`
                            }];
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
                            // libra:{
                            //     name:"Libra Fuwa",
                            //     img_url:[
                            //         "https://cdn.discordapp.com/attachments/841371817704947722/841524914317951086/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841524914543788053/image1.png"
                            //     ]
                            // },
                            objEmbed.author = {
                                name:`Star Twinkle Quiz Time!`,
                            }
                            objEmbed.title = `:grey_question: It's Star Twinkle Constellation Time!`;
                            objEmbed.description = `Guess the correct fuwa constellation from this costume:\n`;

                            var randObj = GlobalFunctions.randomProperty(PrecureStarTwinkleCore.fuwaConstellationData);
                            var answer = randObj.name; var randomImg = randObj.img_url[0];
                            arrAnswerList.push(randObj.name);
                            for(var i=0;i<=2;i++){
                                var tempAnswer = GlobalFunctions.randomProperty(PrecureStarTwinkleCore.fuwaConstellationData);
                                if(arrAnswerList.includes(tempAnswer.name)){
                                    i-=1;
                                } else {
                                    arrAnswerList.push(tempAnswer.name);
                                }
                            }

                            arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                            arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                            answer = arrAnswerList.indexOf(answer);

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
                            `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeStarTwinkleConstellation}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);

                            objEmbed.fields = [
                                {
                                    name:`Answer command:\np!card answer <a/b/c/d>`,
                                    value:`**A.** ${arrAnswerList[0]}\n**B.** ${arrAnswerList[1]}\n**C.** ${arrAnswerList[2]}\n**D.** ${arrAnswerList[3]}`,
                                    inline:true
                                },
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

            //randomize the enemy type:
            var enemyType = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term;//default enemy type
            var randomType = GlobalFunctions.randomNumber(0,10);

            // randomType = 10;//for debug purpose only

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
                objEmbed.description = `Team up to defeat the **${GlobalFunctions.capitalize(enemyType)}**! \n\n**p!card <command> List:**\n⚔️ **battle**: Participate in team battle (10 CP)\n✨ **battle special [party]**: Use the fully charged special attack/team attack\n🛡️ **battle block**: Counter/Block any offensive actions (10 CP)\n⬆️ **battle charge**: Charge up team special point (10 PP)\n🔍 **battle scan <info>**: Scan & Reveal <info> (1 PP)\n\n**Traits:**\n>Can attack & counter cure with HP<${lvR}\n>Counter cure that doesn't possess its elemental weakness\n>Counter cure that has less than ${txtRarity}⭐\n>Counter cure that cannot hit the color`;
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
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has manifest the **series cure card** and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle. (10 CP)\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack. (20 CP)\n\n**Traits:**\n>Can attack\n>Weak against cure that can hit this monster type\n>Counter cure that has incorrect rarity\n>Counter cure with tricky color information`;
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
                objEmbed.description = `It's a Big Monster! Team up to defeat the **${GlobalFunctions.capitalize(enemyType)}**! \n\n**p!card <command> List:**\n⚔️ **battle**: Participate in team battle (10 CP)\n✨ **battle special [party]**: Use the fully charged special attack/team attack\n🛡️ **battle block**: Counter/Block any offensive actions (10 CP)\n⬆️ **battle charge**: Charge up team special point (10 PP)\n🔍 **battle scan <info>**: Scan & Reveal <info> (1 PP)\n\n**Traits:**\n>Can attack & counter cure with HP<${lvR}\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${txtRarity}⭐\n>Counter cure that cannot hit the color`;
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
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[cardDataSeriesWeakness[DBM_Card_Data.columns.series]].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle. (10 CP)\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack. (20 CP)\n\n**Traits:**\n>Cannot attack\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${randRarityMin}⭐\n>Counter cure with tricky catchphrase information`;
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
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle. (10 CP)\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack. (20 CP)\n\n**Traits:**\n>Cannot attack\n>Counter cure that cannot hit this monster type\n>Counter cure that has less than ${randRarityMin}⭐\n>Counter cure with tricky color information`;
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
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${TsunagarusModules.Properties.enemySpawnData[spawnSeries].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle. (10 CP)\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack. (20 CP)\n\n**Traits:**\n>Can attack\n>Weak against cure that can hit this monster type`;
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
            objEmbed.color = Properties.dataColorCore[resultData[0][0][DBM_Card_Data.columns.color]].color;
            objEmbed.author = {
                name:`${GlobalFunctions.capitalize(cardSpawnSeries)} Card - ${GlobalFunctions.capitalize(resultData[0][0][DBM_Card_Data.columns.pack])}`,
                iconURL:Properties.dataCardCore[cardSpawnPack].icon,
            }
            objEmbed.title = resultData[0][0][DBM_Card_Data.columns.name];

            objEmbed.fields = [
                {
                    name:"Capture Command:",
                    value:`Use: **p!card catch** to capture the card.`,
                    inline:false
                }
            ];

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
                    objEmbed.fields[1] = [
                        {
                            name:"🦋 Special Capture Command:",
                            value:`Use: **p!pinky catch** to capture the pinky.`,
                            inline:false
                        }
                    ];
                    objEmbed.thumbnail = {
                        url:resultDataPinky[0][0][DBM_Pinky_Data.columns.img_url]
                    }
                    parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                        `{"id_pinky":"${resultDataPinky[0][0][DBM_Pinky_Data.columns.id_pinky]}","id_card":"${cardSpawnId}"}`
                    );
                }
            }

            objEmbed.image ={
                url:resultData[0][0][DBM_Card_Data.columns.img_url]
            }
            objEmbed.footer = {
                text:`${cardRarity} ⭐ | ID: ${cardSpawnId} | ✔️ Catch Rate: ${captureChance}%`
            }
            break;
    }
    
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

    //update the time remaining information:
    await CardGuildModules.updateTimerRemaining(id_guild);

    // console.log(objEmbed);
    return objEmbed;
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

module.exports = {latestVersion,Properties,PrecureStarTwinkle: PrecureStarTwinkleCore,Battle,Leveling,Quest,Shop,Status,StatusEffect,TradeBoard,Embeds,Party,Skills,getCardData,getCardInventoryUserData,getAllCardDataByPack,
    getCardUserStatusData,checkUserHaveCard,getUserCardInventoryData,getUserCardStock,getUserTotalCard,
    updateCatchAttempt,updateColorPoint,updateMofucoin,updateSeriesPoint,removeCardGuildSpawn,generateCardCureDuel,generateCardSpawn,addNewCardInventory,limitizeUserPoints, 
    embedCardLevelUp,embedCardCapture,embedCardDetail,embedBioPackList,embedCardPackList,getBonusCatchAttempt,getNextColorPoint,
    checkCardCompletion,leaderboardAddNew,getAverageLevel,updateMessageIdSpawn};
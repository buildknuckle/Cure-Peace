const dedent = require('dedent-js');
const GlobalFunctions = require('../GlobalFunctions.js');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_Card_Avatar = require('../../database/model/DBM_Card_Avatar');

const DataModule = require("./Data");
const CpackModule = require("./Cpack");
const SpackModule = require("./Series");
const GProperties = require('./Properties');

const GEmbed = require("./Embed");

const Color = GProperties.color;

// class Embed {
//     static setCardAvatar(objUserData,cardData,cardInventoryData,formation){
//         var rarity = cardData[DBM_Card_Data.columns.rarity];
//         var pack = cardData[DBM_Card_Data.columns.pack];
//         var img = CardModule.Modifier.img(cardInventoryData, cardData);
//         var name = cardData[DBM_Card_Data.columns.name];
//         var level = cardInventoryData[DBM_Card_Inventory.columns.level];
//         var color = CpackModule[pack].Properties.color;
//         var series = CpackModule[pack].Properties.series;
//         var cureData = CpackModule[pack].Avatar.normal;

//         var hp = Avatar.Parameter.getHp(level, cardData[DBM_Card_Data.columns.hp_base]);
//         var atk = Avatar.Parameter.getAtk(level, cardData[DBM_Card_Data.columns.atk_base]);

//         switch(formation){
//             case DBM_Card_Avatar.columns.id_main:
//                 formation = "main";
//                 break;
//             case DBM_Card_Avatar.columns.id_support1:
//                 formation = "support 1";
//                 break;
//             case DBM_Card_Avatar.columns.id_support2:
//                 formation = "support 2";
//                 break;
//         }

//         return GEmbed.builder(stripIndents`"*${cureData.transform_quotes2}*"\n
//         <@${objUserData.id}> has set **${cureData.name}** as **${formation}** precure avatar!
        
//         ${rarity}${CardModule.Emoji.rarity(rarity, cardInventoryData)} **${GlobalFunctions.cutText(name,35)}** Lv.${level}
//         **Base Stats:**
//         ❤️:${hp} | ⚔️:${atk}
//         💖 **Special:** ${CpackModule[pack].Avatar.normal.special_attack}\n
//         🌟 **Passive Skill:**
//         ${Avatar.Skill.getPassiveSkillLabel(level, pack)}`, 
//             {
//                 username:` ${cureData.name}`,
//                 avatarUrl:cureData.icon
//             },{
//             color:color,
//             title:`${cureData.transform_quotes1}`,
//             thumbnail:img,
//             image:cureData.img_transformation,
//             footer:{
//                 iconURL:objUserData.avatarUrl,
//                 text:objUserData.username
//             }
//         })

//     }
// }

class PropertiesStats {
    static level = "level";
    static maxHp = "maxHp"; 
    static hp = "hp";
    static maxSp = "maxSp";//max sp
    static sp = "sp";
    static atk = "atk";
    static baseStats = "baseStats";//base stats of main cure
    static specialPoint = "specialPoint";
    static se_buff = "se_buff";//contains buff status effect
    static se_debuff = "se_debuff";//contains debuff status effect
    static statsModifier = "statsModifier";
    static skill = "skill";
    static cardData = "cardData";//the original card data
    static cardInventoryData = "cardInventoryData";//loaded from card inventory
}

class StatusEffect {
    static type = {
        buff:{
            regen_hp:"regen_hp",//regen hp
            regen_sp:"regen_sp",//regen sp
            onAtk_stun:"onAtk_stun"
        }
    }
}

class Skill {
    static type = {
        passive:{
            stats:"stats",//skill type that able to boosts base stats
            turn_regen_hp:"turn_regen_hp",//recover hp per turn
            turn_regen_sp:"turn_regen_sp",//recover sp per turn
            block_damage_partial:"block_damage_partial"//block partial damage
        }
    }

    static getPackPassiveSkill(pack, form="normal"){
        return CpackModule[pack].Avatar[form].skill.passive;
    }

    static getPassiveSkillLabel(level, pack, form="normal"){
        //formation taken from column name. e.g: id_main
        var passiveSkill = CpackModule[pack].Avatar[form].skill.passive;
        if(this.type.passive.stats in passiveSkill){
            return passiveSkill[this.type.passive.stats](level).label;
        }
        return "-";
    }
}

class Parameter {
    static getMaxLevel(rarity){
        switch(rarity){
            case 1: return 20;
            case 2: return 25;
            case 3: return 35;
            case 4: return 40;
            case 5: return 50;
            case 6: case 7:
                return 60;
            default: return 20;
        }
    }

    static getNextExp(level,qty=1){
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

    static getHp(level,base_hp){
        return level>1 ? level+base_hp:base_hp;
    }

    static getAtk(level,base_atk){
        return level>1 ? level+base_atk:base_atk;
    }

    static getSp(color){
        switch(color){
            case "pink":
                return 4;
                break;
            case "blue":
                return 3;
                break;
            case "red":
                return 3;
                break;
            case "yellow":
                return 6;
                break;
            case "green":
                return 6;
                break;
            case "purple":
                return 5;
                break;
            case "white":
                return 5;
                break;
        }
        
    }

    static getNextSpecialTotal(level){
        //get the card stock requirement to level up the specials
        switch(level){
            case 1: return 1;
            case 2: return 2;
            default: return 4;
        }
    }
    
}

class Data {
    static getLevel(avatarData){
        return avatarData[PropertiesStats.level]
    }

    static getMaxHp(avatarData){
        return avatarData[PropertiesStats.maxHp];
    }

    static getHp(avatarData){
        return avatarData[PropertiesStats.hp];
    }

    static getAtk(avatarData){
        return avatarData[PropertiesStats.atk];
    }

    static getMaxSp(avatarData){
        return avatarData[PropertiesStats.maxSp];
    }

    static getSp(avatarData){
        return avatarData[PropertiesStats.sp];
    }

    static getBaseMaxHp(avatarData){
        return avatarData[PropertiesStats.baseStats][PropertiesStats.maxHp];
    }

    static getBaseAtk(avatarData){
        return avatarData[PropertiesStats.baseStats][PropertiesStats.atk];
    }

    static isAvailable(avatarData, index=0){
        return (avatarData[PropertiesStats.cardData][index]!==null&&avatarData[PropertiesStats.cardInventoryData][index]) ? true: false;
    }

    static getIdCard(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.id_card];
        } else {
            return null;
        }
    }

    static getPack(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.pack];
        } else {
            return null;
        }
    }

    static getSeries(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.series];
        } else {
            return null;
        }
    }

    static getAlterEgo(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            var pack = this.getPack(avatarData, index);
            return CpackModule[pack].Properties.alter_ego;
        } else {
            return null;
        }
    }

    static getSuppportLevel(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            return avatarData[PropertiesStats.cardInventoryData][index][DBM_Card_Inventory.columns.level];
        } else {
            return null;
        }
    }

    static getRarity(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            return avatarData[PropertiesStats.cardData][index][DBM_Card_Data.columns.rarity];
        } else {
            return null;
        }
    }

    static getColor(avatarData, index=0){
        if(this.isAvailable(avatarData, index)){
            var pack = this.getPack(avatarData, index);
            return CpackModule[pack].Properties.color;
        } else {
            return null;
        }
    }
}

class StatsModifier {
    static addMaxHpPercentage(avatarData, value, fullRestore=false){
        var baseMaxHp = avatarData[PropertiesStats.baseStats][PropertiesStats.maxHp];
        var modHp = GlobalFunctions.calculatePercentage(baseMaxHp, value);
        avatarData[PropertiesStats.maxHp] += modHp;
        if(fullRestore){
            avatarData[PropertiesStats.hp] = avatarData[PropertiesStats.maxHp];
        }

        var param = PropertiesStats.maxHp;
        if(param in avatarData[PropertiesStats.statsModifier]){
            avatarData[PropertiesStats.statsModifier][param] += GlobalFunctions.calculatePercentage(baseMaxHp, value);
        } else {
            avatarData[PropertiesStats.statsModifier][param] = GlobalFunctions.calculatePercentage(baseMaxHp, value);
        }

        return avatarData;
    }

    static addAtkPercentage(avatarData, value){
        var baseAtk = avatarData[PropertiesStats.baseStats][PropertiesStats.atk];
        var modAtk = GlobalFunctions.calculatePercentage(baseAtk, value);
        avatarData[PropertiesStats.atk] += modAtk;
        
        var param = PropertiesStats.atk;
        if(param in avatarData[PropertiesStats.statsModifier]){
            avatarData[PropertiesStats.statsModifier][param] += GlobalFunctions.calculatePercentage(baseAtk, value);
        } else {
            avatarData[PropertiesStats.statsModifier][param] = GlobalFunctions.calculatePercentage(baseAtk, value);
        }

        return avatarData;
    }

    static recoverHpPercentage(avatarData, value){
        var baseMaxHp = avatarData[PropertiesStats.baseStats][PropertiesStats.maxHp];
        avatarData[PropertiesStats.hp] += GlobalFunctions.calculatePercentage(baseMaxHp, value);
        if(avatarData[PropertiesStats.hp]>avatarData[PropertiesStats.maxHp]){
            avatarData[PropertiesStats.hp] = avatarData[PropertiesStats.maxHp];
        }
    }
}

class Embed {
    static notifUserInBattle(objUserData){
        return GEmbed.errorMini(`:x: You're still participating on battle instance and cannot join another battle session.`, objUserData, true);
    }

    static printFieldStatus(avatarData,inline=true){
        return {
            name:`**${Data.getAlterEgo(avatarData)}** Lvl.${Data.getLevel(avatarData)}`,
            value:dedent(`❤️ **HP:** ${Data.getHp(avatarData)}/${Data.getMaxHp(avatarData)} 
            🌟 **SP:** ${Data.getSp(avatarData)}/${Data.getMaxSp(avatarData)}`),
            inline:inline
        }
    }
}

class EventListener {
    /**
     * @param {string} idCard Id of card
     * @param {DataModule.CardInventory} cardInventoryData The string
     */
    static async set(userDiscord, idCard, formation, interaction, isPrivate){
        var userId = userDiscord.id;
        
        var cardData = new DataModule.Card(await DataModule.Card.getData(idCard));
        var cardInventoryData = new DataModule.CardInventory(await DataModule.CardInventory.getData(userId,idCard));

        //card validation
        if(!cardData.isAvailable()){
            return interaction.reply(GEmbed.notif.cardDataNotFound(userDiscord));
        } else if(!cardInventoryData.isAvailable()){
            return interaction.reply(GEmbed.notifNotOwnCard(userDiscord));
        }

        //card data:
        var cardId = cardData.getId();
        var rarity = cardData.getRarity();
        var pack = cardData.getPack();
        var color = cardData.getColor();
        var series = cardData.getSeries();
        var seriesCurrency = SpackModule[series].Properties.currency.name.toLowerCase();

        var userData = new DataModule.User(
            await DataModule.User.getData(userId)
        );
        console.log(cardId);
        console.log(rarity);
        console.log(pack);

        console.log(userData);
        return;

        var avatarData = await getData(userId);
        var colorPoint = JSON.parse(userData[DBM_User_Data.columns.color_data]);
        var parsedSeriesPoint = JSON.parse(userData[DBM_User_Data.columns.series_data]);

        var arrAvatarData = [
            avatarData[DBM_Card_Avatar.columns.id_main],
            avatarData[DBM_Card_Avatar.columns.id_support1],
            avatarData[DBM_Card_Avatar.columns.id_support2]
        ];
        
        //check for duplicate set
        if(GlobalFunctions.isArrayValDuplicate(arrAvatarData, cardId)){
            if(avatarData[DBM_Card_Avatar.columns.id_main]==cardId){
                return interaction.reply(
                    GEmbed.errorMini(`:x: This precure has been set in **main** avatar`, userDiscord, true)
                );
            } else if(avatarData[DBM_Card_Avatar.columns.id_support1]==cardId){
                return interaction.reply(
                    GEmbed.errorMini(`:x: This precure has been set in **support 1** avatar`, userDiscord, true)
                );
            } else if(avatarData[DBM_Card_Avatar.columns.id_support2]==cardId){
                return interaction.reply(
                    GEmbed.errorMini(`:x: This precure has been set in **support 2** avatar`, userDiscord, true)
                );
            }
        }

        var setCost = {
            color:20, series:10,
        }

        var objUpdateAvatar = {};//prepare the obj avatar to be updated
        var isSetAvatar = false;
        switch(formation){
            case DBM_Card_Avatar.columns.id_main:
                if(avatarData[DBM_Card_Avatar.columns.id_main]==null){
                    setCost = {
                        color:setCost.color*rarity, series:setCost.series*rarity,
                    }

                    //point validation
                    if(colorPoint[color]["point"]<setCost.color&&
                    parsedSeriesPoint[series]<setCost.series){
                        return interaction.reply(
                            GEmbed.errorMini(`:x: You need ${setCost.color} ${color} point & ${setCost.series} ${seriesCurrency} to set this card as **main** precure avatar.`,userDiscord,true,{
                                title:`Not Enough Points`
                            })
                        );
                    } else {
                        isSetAvatar = true;
                    }
                }

                //=====update avatar data=====
                objUpdateAvatar[DBM_Card_Avatar.columns.id_main] = cardData[DBM_Card_Data.columns.id_card];
                break;
            case DBM_Card_Avatar.columns.id_support1:
                if(avatarData[DBM_Card_Avatar.columns.id_support1]==null){
                    //point validation
                    if(colorPoint[color]["point"]<setCost.color&&
                    parsedSeriesPoint[series]<setCost.series){
                        return interaction.reply(
                            GEmbed.errorMini(`:x: You need ${setCost.color} ${color} point & ${setCost.series} ${seriesCurrency} to set this card as **support 1** avatar.`,userDiscord,true,{
                                title:`Not Enough Points`
                            })
                        );
                    } else {
                        isSetAvatar = true;
                    }
                }

                //=====update avatar data=====
                objUpdateAvatar[DBM_Card_Avatar.columns.id_support1] = cardData[DBM_Card_Data.columns.id_card];
                break;
            case DBM_Card_Avatar.columns.id_support2:
                if(avatarData[DBM_Card_Avatar.columns.id_support2]==null){
                    //point validation
                    if(colorPoint[color]["point"]<setCost.color&&
                    parsedSeriesPoint[series]<setCost.series){
                        return interaction.reply(
                            GEmbed.errorMini(`:x: You need ${setCost.color} ${color} point & ${setCost.series} ${seriesCurrency} to set this card as **support 2** avatar.`,userDiscord,true,{
                                title:`Not Enough Points`
                            })
                        );
                    } else {
                        isSetAvatar = true;
                    }
                }

                //=====update avatar data=====
                objUpdateAvatar[DBM_Card_Avatar.columns.id_support2] = cardData[DBM_Card_Data.columns.id_card];
                break;
        }

        await Avatar.updateData(userId, objUpdateAvatar);

        if(isSetAvatar){
            //=====update point=====
            var mapColorData = new Map();
            mapColorData.set(GProperties.color[color].value, {"point":-setCost.color});
            var mapSeriesPoint = new Map();
            mapSeriesPoint.set(SpackModule[series].Properties.value, -setCost.series);
            
            var objUpdateUserData = {};//prepare the obj user data to be updated
            objUpdateUserData[DBM_User_Data.columns.color_data] = mapColorData;
            objUpdateUserData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
            // await updateData(userId, userData, objUpdateUserData);//unremark on release
        }

        return interaction.reply({
            embeds:[Embed.setCardAvatar(userDiscord,cardData,cardInventoryData, formation)],
            ephemeral:isPrivate
        });
    }
}

//init avatar data
function init(arrCardData, arrCardInventoryData, form="normal", levelSync=0){
    var level = arrCardInventoryData[0][DBM_Card_Inventory.columns.level];
    if(level>levelSync && levelSync>0) level = levelSync;//levelSync: sync level if parameter provided

    var initedData = {
        level:level,
        maxHp:Parameter.getHp(level, arrCardData[0][DBM_Card_Data.columns.hp_base]),
        hp:Parameter.getHp(level, arrCardData[0][DBM_Card_Data.columns.hp_base]),
        maxSp:Parameter.getSp(arrCardData[0][DBM_Card_Data.columns.color]),
        sp:0,
        atk:Parameter.getAtk(level, arrCardData[0][DBM_Card_Data.columns.atk_base]),
        baseStats:{
            maxHp:Parameter.getHp(level, arrCardData[0][DBM_Card_Data.columns.hp_base]),
            maxSp:Parameter.getSp(arrCardData[0][DBM_Card_Data.columns.color]),
            atk:Parameter.getAtk(level, arrCardData[0][DBM_Card_Data.columns.atk_base]),
        },
        statsModifier:{},
        skill:{active:[],passive:[]},//contains all active skills data
        se_buff:[],
        se_debuff:[],
        cardData:arrCardData,//original card data
        cardInventoryData:arrCardInventoryData//loaded from card inventory/modified,
    };

    // //check for passive skill stats on main avatar
    for(var i=0;i<arrCardData.length;i++){
        if(Data.isAvailable(initedData, i)){
            var pack = Data.getPack(initedData, i);
            var level = Data.getSuppportLevel(initedData, i);
            if(level>levelSync && levelSync>0) level = levelSync;//levelSync: sync level if parameter provided
                
            var passiveSkill = Skill.getPackPassiveSkill(pack);
            if(Skill.type.passive.stats in passiveSkill){//stats booster
                //template:
                // const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
                // passive:{
                // stats: function(initedData){
                //     var level = initedData.avatarData[DBM_Card_Inventory.columns.level];
                //     if(level<=9){
                //         return {label:" , value:{maxHp:}};
                //     } else if(level<=19){
                //         return {label:" , value:{maxHp:}};
                //     } else if(level<=29){
                //         return {label:" , value:{maxHp:}};
                //     } else if(level<=39){
                //         return {label:" , value:{maxHp:}};
                //     } else if(level<=49){
                //         return {label:" , value:{maxHp:}};
                //     } else {
                //         return {label:" , value:{maxHp:}};
                //     }
                // }

                var boostedStats = passiveSkill[Skill.type.passive.stats](level);
                initedData[PropertiesStats.skill].passive.push(boostedStats);//passive skill entry
                
                for(var key in boostedStats.value){
                    var statsVal = boostedStats.value;
                    switch(key){
                        case PropertiesStats.maxHp:
                            initedData = StatsModifier.addMaxHpPercentage(initedData, statsVal[PropertiesStats.maxHp], true);
                            break;
                        case PropertiesStats.atk:
                            initedData = StatsModifier.addAtkPercentage(initedData, statsVal[PropertiesStats.atk]);
                            break;
                    }
                }

                initedData[PropertiesStats.hp] = initedData[PropertiesStats.maxHp];//rewrite hp
            }
        }
    }

    // console.log(initedData);
    
    return initedData;
        
        //     // if(this.skillType.passive.turn_recover_hp in passiveSkill){
        //     //     //template:
        //     //     // const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
        //     //     // const GlobalFunctions = require('../../GlobalFunctions');
        //     //     // turn_recover_hp: function(initedData){
        //     //     //     var level = initedData.avatarData[DBM_Card_Inventory.columns.level];
        //     //     //     var hp_max = initedData.hp_max;
        //     //     //     var rng = GlobalFunctions.randomNumber(1,100);
                    
        //     //     //     if(level<=9 && rng<=){
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else if(level<=19 && rng<=){
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else if(level<=29 && rng<=){
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else if(level<=39 && rng<=){
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else if(level<=49 && rng<=){
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else if(rng<=) {
        //     //     //         return GlobalFunctions.calculatePercentage(hp_max, );
        //     //     //     } else {
        //     //     //         return 0;
        //     //     //     }
        //     //     // }
        
        //     //     var hpRegen = passiveSkill[this.skillType.passive.turn_recover_hp](initedData);
        //     // }
        
        //     // if(this.skillType.passive.turn_recover_sp in passiveSkill){
        //     //     //template:
        //     //     // const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
        //     //     // const GlobalFunctions = require('../../GlobalFunctions');
        //     //     // turn_recover_sp: function(initedData){
        //     //     //     var level = initedData.avatarData[DBM_Card_Inventory.columns.level];
        //     //     //     var rng = GlobalFunctions.randomNumber(1,100);
                    
        //     //     //     if(level<=9 && rng<=){
        //     //     //         return 1;
        //     //     //     } else if(level<=19 && rng<=){
        //     //     //         return 1;
        //     //     //     } else if(level<=29 && rng<=){
        //     //     //         return 1;
        //     //     //     } else if(level<=39 && rng<=){
        //     //     //         return 1;
        //     //     //     } else if(level<=49 && rng<=){
        //     //     //         return 1;
        //     //     //     } else if(rng<=) {
        //     //     //         return 1;
        //     //     //     } else {
        //     //     //         return 0;
        //     //     //     }
        //     //     // }
        
        //     //     var spRegen = passiveSkill[this.skillType.passive.turn_recover_sp](initedData);
        //     //     // console.log(spRegen);
        //     // }
    

    //base stats without modified
    
}
module.exports = {PropertiesStats, StatusEffect, Skill, init, Parameter, Data, StatsModifier, Embed, EventListener};
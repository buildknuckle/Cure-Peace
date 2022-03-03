const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');

class Properties {
    static icon = "https://waa.ai/JEVD.png";
    static color = "pink";
    static fullname = "Tsubomi Hanasaki";
    static alter_ego = "Cure Blossom";
    static hint_chiguhaguu = "The flowers spreading throughout the land, <x>!";
    static total = 0;
    static series = "heartcatch";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVD.png",
        name : "Cure Blossom",
        transform_quotes1 : "Pretty Cure, Open My Heart!",
        transform_quotes2 : "The flowers spreading throughout the land, Cure Blossom!",
        special_attack : "Pink Forte Wave",
        img_special_attack : "https://cdn.discordapp.com/attachments/793382427551727636/817777422723973190/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793382427551727636/822047607412490270/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP+10% & atk+5%", value:{maxHp:10, atk:5}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP+15% & atk+5%", value:{maxHp:15, atk:5}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP+18% & atk+5%", value:{maxHp:18, atk:5}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP+20% & atk+5%", value:{maxHp:20, atk:5}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP+23% & atk+8%", value:{maxHp:23, atk:8}};
                    } else {
                        return {label:"⏫ Max HP+25% & atk+10%", value:{maxHp:25, atk:10}};
                    }

                }
            }
        }
    }
}

module.exports = {
    Properties, Avatar
}
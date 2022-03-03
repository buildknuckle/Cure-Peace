const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');

class Properties {
    static icon = "https://waa.ai/JEVh.png";
    static color = "pink";
    static fullname = "Mirai Asahina";
    static alter_ego = "Cure Miracle";
    static hint_chiguhaguu = "Our Miracle! <x>!";
    static total = 0;
    static series = "mahou_tsukai";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVh.png",
        name : "Cure Miracle",
        transform_quotes1 : "Miracle, Magical, Jewelryle!",
        transform_quotes2 : "Our Miracle! Cure Miracle!",
        special_attack : "Diamond Eternal",
        img_special_attack : "https://cdn.discordapp.com/attachments/793390659046080512/817787063726243880/unknown.png",
        img_transformation : "",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP+5% & atk+10%", value:{maxHp:5, atk:10}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP+5% & atk+15%", value:{maxHp:5, atk:15}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP+5% & atk+18%", value:{maxHp:5, atk:18}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP+5% & atk+20%", value:{maxHp:5, atk:20}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP+8% & atk+23%", value:{maxHp:8, atk:23}};
                    } else {
                        return {label:"⏫ Max HP+10% & atk+25%", value:{maxHp:10, atk:25}};
                    }
                }
            }
        }
    }
}

module.exports = {
    Properties, Avatar
}
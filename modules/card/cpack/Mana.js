const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');

class Properties {
    static icon = "https://waa.ai/JEV6.png";
    static color = "pink";
    static fullname = "Mana Aida";
    static alter_ego = "Cure Heart";
    static hint_chiguhaguu = "Overflowing Love! <x>!";
    static total = 0;
    static series = "dokidoki";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEV6.png",
        name : "Cure Heart",
        transform_quotes1 : "Pretty Cure, Love Link!",
        transform_quotes2 : "Overflowing Love! Cure Heart!",
        special_attack : "Heart Dynamite",
        img_special_attack : "https://cdn.discordapp.com/attachments/793387637527805973/817784809380118528/unknown.png",
        img_transformation : "",
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
const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');

class Properties {
    static icon = "https://waa.ai/JEVN.png";
    static color = "pink";
    static fullname = "Haruka Haruno";
    static alter_ego = "Cure Flora";
    static hint_chiguhaguu = "Princess of the Flourishing Flowers! <x>!";
    static total = 0;
    static series = "go_princess";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVN.png",
        name : "Cure Flora",
        transform_quotes1 : "Pretty Cure, Princess Engage!",
        transform_quotes2 : "Princess of the Flourishing Flowers! Cure Flora!",
        special_attack : "Floral Tourbillon",
        img_special_attack : "https://cdn.discordapp.com/attachments/793389561606045737/817786541179011072/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793389561606045737/822056134847758350/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP & atk+12%", value:{maxHp:12, atk:12}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP & atk+14%", value:{maxHp:14, atk:14}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP & atk+18%", value:{maxHp:18, atk:18}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP & atk+25%", value:{maxHp:25, atk:25}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP & atk+30%", value:{maxHp:30, atk:30}};
                    } else {
                        return {label:"⏫ Max HP & atk+30%",value:{maxHp:30, atk:30}};
                    }
                }
            }
        }
    }
}

module.exports = {
    Properties, Avatar
}
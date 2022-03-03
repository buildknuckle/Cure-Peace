const DBM_Card_Inventory = require(`../../../database/model/DBM_Card_Inventory`);

class Properties {
    static icon = "https://waa.ai/JEV8.png";
    static color = "pink";
    static fullname = "Nozomi Yumehara";
    static alter_ego = "Cure Dream";
    static hint_chiguhaguu = "The great power of hope, <x>";
    static total = 0;
    static series = "yes5gogo";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEV8.png",
        name : "Cure Dream",
        transform_quotes1 : "Pretty Cure Metamorphose!",
        transform_quotes2 : "The great power of hope, Cure Dream!",
        special_attack : "Shooting Star",
        img_special_attack : "https://cdn.discordapp.com/attachments/793379464753971220/817775920550248498/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793379464753971220/822044019566706698/image0.gif",
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
const DBM_Card_Inventory = require(`../../../database/model/DBM_Card_Inventory`);

class Properties {
    static icon = "https://waa.ai/JEwL.png";
    static color = "white";
    static fullname = "Honoka Yukishiro";
    static alter_ego = "Cure White";
    static hint_chiguhaguu = "Emissary of light, <x>!";
    static total = 0;
    static series = "max_heart";
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwL.png",
        name:"Cure White",
        transform_quotes1:"Dual Aurora Wave!",
        transform_quotes2:"Emissary of light, Cure White!",
        special_attack:"Marble Screw",
        img_special_attack:"https://cdn.discordapp.com/attachments/793377043646775297/817775439320842320/unknown.png",
        img_transformation:"",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⚔️ Atk+10%", value:{atk:10}};
                    } else if(level<=19){
                        return {label:"⚔️ Atk+15%", value:{atk:15}};
                    } else if(level<=29){
                        return {label:"⚔️ Atk+20%", value:{atk:20}};
                    } else if(level<=39){
                        return {label:"⚔️ Atk+25%", value:{atk:25}};
                    } else if(level<=49){
                        return {label:"⚔️ Atk+30%", value:{atk:30}};
                    } else {
                        return {label:"⚔️ Atk+40%", value:{atk:40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    Properties, Avatar
}
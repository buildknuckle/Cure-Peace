const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');

class Properties {
    static icon = "https://waa.ai/JEwF.png";
    static color = "yellow";
    static fullname = "Yuko Omori";
    static alter_ego = "Cure Honey";
    static hint_chiguhaguu = "The light of life flourishing on the Earth, <x>!";
    static total = 0;
    static series = "happiness_charge";
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwF.png",
        name:"Cure Honey",
        transform_quotes1:"Pretty Cure Kururin Mirror Change!",
        transform_quotes2:"The light of life flourishing on the Earth, Cure Honey!",
        special_attack:"Sparkling Baton Attack",
        img_special_attack:"https://cdn.discordapp.com/attachments/793389083162050581/817786309334663188/unknown.png",
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
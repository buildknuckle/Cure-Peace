var properties = {
    icon:"https://waa.ai/JEVB.png",
    color:"pink",
    fullname:"Nagisa Misumi",
    alter_ego:"Cure Black",
    hint_spawn:"Emissary of light, <x>!",
    total:0,
    series:"max_heart",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVB.png",
        name : "Cure Black",
        transform_quotes1 : "Dual Aurora Wave!",
        transform_quotes2 : "Emissary of light, Cure Black!",
        special_attack : "Marble Screw",
        img_special_attack : "https://cdn.discordapp.com/attachments/793374640839458837/817775242729881660/unknown.png",
        img_transformation : "",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP & atk+10%", value:{maxHp:10, atk:10}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP & atk+15%", value:{maxHp:15, atk:15}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP & atk+20%", value:{maxHp:20, atk:20}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP & atk+25%", value:{maxHp:25, atk:25}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP & atk+28%", value:{maxHp:28, atk:28}};
                    } else {
                        return {label:"⏫ Max HP & atk+30%", value:{maxHp:30, atk:30}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
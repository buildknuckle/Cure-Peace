var properties = {
    name:"saki",
    icon:"https://waa.ai/JEVI.png",
    color:"pink",
    fullname:"Saki Hyuuga",
    alter_ego:"Cure Bloom",
    hint_spawn:"The shining golden flower, <x>!",
    total:0,
    series:"splash_star",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVI.png",
        name : "Cure Bloom",
        transform_quotes1 : "Dual Spiritual Wave!",
        transform_quotes2 : "The shining golden flower, Cure Bloom!",
        special_attack : "Spiral Star Splash",
        img_special_attack : "https://cdn.discordapp.com/attachments/793378822976045096/817775703444684820/unknown.png",
        img_transformation : "",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP & atk+14%", value:{maxHp:14, atk:14}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP & atk+18%", value:{maxHp:18, atk:18}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP & atk+20%", value:{maxHp:20, atk:20}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP & atk+23%", value:{maxHp:23, atk:23}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP & atk+25%", value:{maxHp:25, atk:25}};
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
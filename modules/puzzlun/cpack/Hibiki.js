var properties = {
    name:"hibiki",
    icon:"https://waa.ai/JEVd.png",
    color:"pink",
    fullname:"Hibiki Hojo",
    alter_ego:"Cure Melody",
    hint_spawn:"Strumming the wild tune, <x>!",
    total:0,
    series:"suite",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVd.png",
        name : "Cure Melody",
        transform_quotes1 : "Let's Play! Pretty Cure Modulation!",
        transform_quotes2 : "Strumming the wild tune, Cure Melody!",
        special_attack : "Miracle Heart Arpeggio",
        img_special_attack : "https://cdn.discordapp.com/attachments/793383641119850556/817782344819408966/unknown.png",
        img_transformation : "https://waa.ai/JEVd.png",
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
                        return {label:"⏫ Max HP+8% & atk+23%",value:{maxHp:8, atk:23}};
                    } else {
                        return {label:"⏫ Max HP+10% & atk+25%", value:{maxHp:10, atk:25}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
var properties = {
    name:"hikaru",
    icon:"https://waa.ai/JEV7.png",
    color:"pink",
    fullname:"Hikaru Hoshina",
    alter_ego:"Cure Star",
    hint_spawn:"The twinkling star that shines throughout the universe! <x>!",
    total:0,
    series:"star_twinkle",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEV7.png",
        name : "Cure Star",
        transform_quotes1 : "Color Charge!",
        transform_quotes2 : "The twinkling star that shines throughout the universe! Cure Star!",
        special_attack : "Star Punch",
        img_special_attack : "https://cdn.discordapp.com/attachments/793395639512989727/817794726728171561/unknown.png",
        img_transformation : "",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⚔️ Atk+10%", value:{atk:10}};
                    } else if(level<=19){
                        return {label:"⚔️ Atk+13%", value:{atk:13}};
                    } else if(level<=29){
                        return {label:"⚔️ Atk+18%", value:{atk:18}};
                    } else if(level<=39){
                        return {label:"⚔️ Atk+30%", value:{atk:30}};
                    } else if(level<=49){
                        return {label:"⚔️ Atk+35%" , value:{atk:35}};
                    } else {
                        return {label:"⚔️ Atk+40%", value:{atk:40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
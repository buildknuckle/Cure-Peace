var properties = {
    name:"yuri",
    icon:"https://waa.ai/f4i4.png",
    color:"purple",
    fullname:"Yuri Tsukikage",
    alter_ego:"Cure Moonlight",
    hint_spawn:"The flower that shines in the moon's light, <x>!",
    total:0,
    series:"heartcatch",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/f4i4.png",
        name:"Cure Moonlight",
        transform_quotes1:"Pretty Cure! Open My Heart!",
        transform_quotes2:"The flower that shines in the moon's light, Cure Moonlight!",
        special_attack:"Silver Forte Wave",
        img_special_attack:"https://cdn.discordapp.com/attachments/793383243750703144/817782029147832360/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793383243750703144/822048055788437504/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⚔️ Atk+8%", value:{atk:8}};
                    } else if(level<=19){
                        return {label:"⚔️ Atk+12%", value:{atk:12}};
                    } else if(level<=29){
                        return {label:"⚔️ Atk+25%", value:{atk:25}};
                    } else if(level<=39){
                        return {label:"⚔️ Atk+30%", value:{atk:30}};
                    } else if(level<=49){
                        return {label:"⚔️ Atk+35%", value:{atk:35}};
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
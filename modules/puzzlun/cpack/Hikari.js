var properties = {
    name:"hikari",
    icon:"https://waa.ai/JEwu.png",
    color:"yellow",
    fullname:"Hikari Kujou",
    alter_ego:"Shiny Luminous",
    hint_spawn:"Shining life, <x>! The light's heart and the light's will, for the sake of uniting all as one!",
    total:0,
    series:"max_heart",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwu.png",
        name:"Shiny Luminous",
        transform_quotes1:"Luminous Shining Stream!",
        transform_quotes2:"Shining life, Shiny Luminous! The light's heart and the light's will, for the sake of uniting all as one!",
        special_attack:"Heartiel Action",
        img_special_attack:"https://cdn.discordapp.com/attachments/793378136871010364/817775581458464808/unknown.png",
        img_transformation:"",
        skill:{
            passive:{
                block_damage_partial: function(level){
                    if(level<=9){
                        return {label:"🛡️ 20% on block: block 20% damage", value:{chance:20, value:20}};
                    } else if(level<=19){
                        return {label:"🛡️ 30% on block: block 25% damage", value:{chance:30, value:25}};
                    } else if(level<=29){
                        return {label:"🛡️ 35% on block: block 30% damage", value:{chance:35, value: 30}};
                    } else if(level<=39){
                        return {label:"🛡️ 35% on block: block 35% damage", value:{chance:35, value: 35}};
                    } else if(level<=49){
                        return {label:"🛡️ 40% on block: block 40% damage", value:{chance:40, value: 40}};
                    } else {
                        return {label:"🛡️ 45% on block: block 40% damage", value:{chance:45, value: 40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
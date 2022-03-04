var properties = {
    icon:"https://waa.ai/JEwi.png",
    color:"green",
    fullname:"Komachi Akimoto",
    alter_ego:"Cure Mint",
    hint_spawn:"The green earth of tranquility, <x>!",
    total:0,
    series:"yes5gogo",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwi.png",
        name:"Cure Mint",
        transform_quotes1:"Pretty Cure Metamorphose!",
        transform_quotes2:"The green earth of tranquility, Cure Mint!",
        special_attack:"Emerald Saucer",
        img_special_attack:"https://cdn.discordapp.com/attachments/793380333194051614/817776166597034014/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793380333194051614/822044644505944074/image0.gif",
        skill:{
            passive:{
                block_damage_partial: function(level){
                    if(level<=9){
                        return {label:"🛡️ 20% on block: block 20% damage", value:{chance:20, value:20}};
                    } else if(level<=19){
                        return {label:"🛡️ 25% on block: block 30% damage", value:{chance:25, value:30}};
                    } else if(level<=29){
                        return {label:"🛡️ 30% on block: block 35% damage", value:{chance:30, value:35}};
                    } else if(level<=39){
                        return {label:"🛡️ 35% on block: block 35% damage", value:{chance:35, value:35}};
                    } else if(level<=49){
                        return {label:"🛡️ 40% on block: block 40% damage", value:{chance:40, value:40}};
                    } else {
                        return {label:"🛡️ 40% on block: block 45% damage", value:{chance:40, value:40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
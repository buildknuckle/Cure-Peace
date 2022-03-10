var properties = {
    name:"itsuki",
    icon:"https://waa.ai/JEwm.png",
    color:"yellow",
    fullname:"Itsuki Myoudouin",
    alter_ego:"Cure Sunshine",
    hint_spawn:"The flower that bathes in the sunlight, <x>!",
    total:0,
    series:"heartcatch",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwm.png",
        name:"Cure Sunshine",
        transform_quotes1:"Pretty Cure! Open My Heart!",
        transform_quotes2:"The flower that bathes in the sunlight, Cure Sunshine!",
        special_attack:"Gold Forte Burst",
        img_special_attack:"https://cdn.discordapp.com/attachments/793383020336906259/817781911929225236/unknown.png",
        img_transformation: "https://cdn.discordapp.com/attachments/793383020336906259/822048055859609630/image0.gif",
        skill:{
            passive:{
                block_damage_partial: function(level){
                    if(level<=9){
                        return {label:"🛡️ 25% on block: block 20% damage", value:{chance:25, value:20}};
                    } else if(level<=19){
                        return {label:"🛡️ 30% on block: block 25% damage", value:{chance:30, value:25}};
                    } else if(level<=29){
                        return {label:"🛡️ 35% on block: block 30% damage", value:{chance:35, value:30}};
                    } else if(level<=39){
                        return {label:"🛡️ 40% on block: block 33% damage", value:{chance:40, value:33}};
                    } else if(level<=49){
                        return {label:"🛡️ 43% on block: block 35% damage", value:{chance:43, value:35}};
                    } else {
                        return {label:"🛡️ 45% on block: block 40% damage", value:{chance:45, value:40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
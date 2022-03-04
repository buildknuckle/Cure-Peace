var properties = {
    icon:"https://waa.ai/JEwJ.png",
    color:"yellow",
    fullname:"Inori Yamabuki",
    alter_ego:"Cure Pine",
    hint_spawn:"The yellow heart is the emblem of faith! Freshly-harvested, <x>!",
    total:0,
    series:"fresh",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwJ.png",
        name:"Cure Pine",
        transform_quotes1:"Change, Pretty Cure! Beat up!",
        transform_quotes2:"The yellow heart is the emblem of faith! Freshly-harvested, Cure Pine!",
        special_attack:"Healing Prayer",
        img_special_attack:"https://cdn.discordapp.com/attachments/793381839938519040/817776874607607808/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793381839938519040/823994231860363315/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
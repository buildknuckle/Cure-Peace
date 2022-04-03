var properties = {
    name:"makoto",
    icon:"https://waa.ai/JEwc.png",
    color:"purple",
    fullname:"Makoto Kenzaki",
    alter_ego:"Cure Sword",
    hint_spawn:"The courageous blade! <x>!",
    total:0,
    series:"dokidoki",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwc.png",
        name:"Cure Sword",
        transform_quotes1:"Pretty Cure, Love Link!",
        transform_quotes2:"The courageous blade! Cure Sword!",
        special_attack:"Sword Hurricane",
        img_special_attack:"https://cdn.discordapp.com/attachments/793388248139300864/817785553084219402/unknown.png",
        img_transformation:"https://waa.ai/JEwc.png",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
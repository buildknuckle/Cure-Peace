var properties = {
    icon:"https://waa.ai/JEwz.png",
    color:"blue",
    fullname:"Rikka Hishikawa",
    alter_ego:"Cure Diamond",
    hint_spawn:"The light of Wisdom! <x>!!",
    total:0,
    series:"dokidoki",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwz.png",
        name : "Cure Diamond",
        transform_quotes1 : "Pretty Cure, Love Link!",
        transform_quotes2 : "The light of Wisdom! Cure Diamond!!",
        special_attack : "Diamond Swirkle",
        img_special_attack : "https://cdn.discordapp.com/attachments/793387811922903040/817785362213765141/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/796354776714969119/822201577233186866/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
var properties = {
    icon:"https://waa.ai/JEVp.png",
    color:"pink",
    fullname:"Hana Nono",
    alter_ego:"Cure Yell",
    hint_spawn:"Cheering on everyone! The Pretty Cure of High Spirits! <x>!",
    total:0,
    series:"hugtto",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEVp.png",
        name : "Cure Yell",
        transform_quotes1 : "Heart Kiratto!",
        transform_quotes2 : "Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell!",
        special_attack : "Heart For You",
        img_special_attack : "https://cdn.discordapp.com/attachments/793393652348354600/817793676813533214/unknown.png",
        img_transformation : "",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
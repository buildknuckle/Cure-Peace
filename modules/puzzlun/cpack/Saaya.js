var properties = {
    name:"saaya",
    icon:"https://waa.ai/JEwO.png",
    color:"blue",
    fullname:"Saaya Yakushiji",
    alter_ego:"Cure Ange",
    hint_spawn:"Healing everyone! The Pretty Cure of Wisdom! <x>!",
    total:0,
    series:"hugtto",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwO.png",
        name : "Cure Ange",
        transform_quotes1 : "Heart Kiratto!",
        transform_quotes2 : "Healing everyone! The Pretty Cure of Wisdom! Cure Ange!",
        special_attack : "Heart Feather",
        img_special_attack : "https://cdn.discordapp.com/attachments/793394491431714838/817793766152470528/unknown.png",
        img_transformation : "",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
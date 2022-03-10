var properties = {
    name:"chiyu",
    icon:"https://waa.ai/JEwe.png",
    color:"blue",
    fullname:"Chiyu Sawaizumi",
    alter_ego:"Cure Fontaine",
    hint_spawn:"The two intersecting streams! <x>!",
    total:0,
    series:"healin_good"
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwe.png",
        name : "Cure Fontaine",
        transform_quotes1 : "Start! Pretty Cure Operation!",
        transform_quotes2 : "The two intersecting streams! Cure Fontaine!",
        special_attack : "Healing Stream",
        img_special_attack : "https://cdn.discordapp.com/attachments/793396832717111347/825099333333811310/image0.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793396832717111347/822037799011352576/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
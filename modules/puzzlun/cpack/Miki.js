var properties = {
    name:"miki",
    icon:"https://waa.ai/JEVn.png",
    color:"blue",
    fullname:"Miki Aono",
    alter_ego:"Cure Berry",
    hint_spawn:"The blue heart is the emblem of hope. Freshly-gathered, <x>!",
    total:0,
    series:"fresh",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVn.png",
        name : "Cure Berry",
        transform_quotes1 : "Change, Pretty Cure! Beat up!",
        transform_quotes2 : "The blue heart is the emblem of hope. Freshly-gathered, Cure Berry!",
        special_attack : "Espoir Shower",
        img_special_attack : "https://cdn.discordapp.com/attachments/793381635424387073/817776807679623178/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793381635424387073/822035476323631114/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
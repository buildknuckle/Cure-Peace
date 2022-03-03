class Properties {
    static icon = "https://waa.ai/JEVn.png";
    static color = "blue";
    static fullname = "Miki Aono";
    static alter_ego = "Cure Berry";
    static hint_chiguhaguu = "The blue heart is the emblem of hope. Freshly-gathered, <x>!";
    static total = 0;
    static series = "fresh";
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
    Properties, Avatar
}
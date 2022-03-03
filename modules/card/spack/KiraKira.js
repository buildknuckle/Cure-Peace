class Properties {
    static value = "kirakira";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png",
        mascot_emoji:"<:m12_pekorin:936237024149659689>"
    }
    static name = "KiraKira";
    static currency = {
        name:"Kirakiraru",
        icon_emoji:"<:m12_pekorin:936237024149659689>"
    };
    static theme = "sweets, animals and creativity";
    static location = {
        name:"Ichigozaka",
        icon:"https://static.wikia.nocookie.net/prettycure/images/5/50/KKPCALM_Ichigozaka_Concepts.png",
    };
}

class Battle {
    static party_special = "Fantastic Animale";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "kirakirarun_thieves";
    static name = "Kirakirarun Thieves";
    static chaos_meter = "manipulation";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
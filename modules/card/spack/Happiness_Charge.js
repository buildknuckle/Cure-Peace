class Properties {
    static value = "happiness_charge";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png",
        mascot_emoji:"<:m9_ribbon:936237024602628096>"
    }
    static name = "Happiness Charge";
    static currency = {
        name:"Precard Points",
        icon_emoji:"<:m9_ribbon:936237024602628096>"
    };
    static theme = "mirrors, fashion, dancing and romance";
    static location = {
        name:"Pikarigaoka",
        icon:"https://static.wikia.nocookie.net/prettycure/images/2/25/Pikarigaoka_Full_View.png",
    };
}

class Battle {
    static party_special = "Innocent Purification";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "saiarks";
    static name = "Saiarks";
    static catchphrase = "Saiarks!";
    static chaos_meter = "distress";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
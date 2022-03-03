class Properties {
    static value = "fresh";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617558089367552/latest.png",
        mascot_emoji:"<:m4_chiffon:936237021616275496>"
    }
    static name = "Fresh";
    static currency = {
        name:"Linkrun Points",
        icon_emoji:"<:m4_chiffon:936237021616275496>"
    };
    static theme = "fruits, clovers, card suits, and dancing";
    static location = {
        name:"Clover Town",
        icon:"https://static.wikia.nocookie.net/prettycure/images/e/e1/Kurobaa.png",
    };
}

class Battle {
    static type_monster = "nakewameke";
    static party_special = "Lucky Clover Grand Finale";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146317411483688/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "nakewameke";
    static name = "Nakewameke";
    static catchphrase = "Nakewameke!";
    static chaos_meter = "misery";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
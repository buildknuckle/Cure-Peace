class Properties {
    static value = "go_princess";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png",
        mascot_emoji:"<:m10_aroma:936237022056710154>"
    }
    static name = "Go! Princess";
    static currency = {
        name:"Princess Points",
        icon_emoji:"<:m10_aroma:936237022056710154>"
    };
    static theme = "princesses, personal goals and dreams";
    static location = {
        name:"Yumegahama",
        icon:"https://static.wikia.nocookie.net/prettycure/images/0/01/Yumegahama.png",
    };
}

class Battle {
    static party_special = "Grand Printemps";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "zetsuborg";
    static name = "Zetsuborg";
    static catchphrase = "Zetsuborg!";
    static chaos_meter = "despair";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
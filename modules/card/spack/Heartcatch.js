class Properties {
    static value = "heartcatch";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617596086878239/latest.png",
        mascot_emoji:"<:m5_cyphre:936237021599518801>"
    }
    static name = "Heartcatch";
    static currency = {
        name:"Heart Seed Points",
        icon_emoji:"<:m5_cyphre:936237021599518801>"
    };
    static theme = "Flowers and Hanakotoba";
    static location = {
        name:"Kibougahana",
        icon:"https://static.wikia.nocookie.net/prettycure/images/5/5c/Kibogahana.jpg",
    };
}

class Battle {
    static party_special = "Heartcatch Orchestra";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824149388389646336/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "desertrian";
    static name = "Desertrian";
    static chaos_meter = "wither";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
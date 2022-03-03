class Properties {
    static value = "hugtto";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845618022843809842/latest.png",
        mascot_emoji:"<:m13_hariham:936237022803275777>"
    }
    static name = "HUGtto!";
    static currency = {
        name:"Mirai Crystal Points",
        icon_emoji:"<:m13_hariham:936237022803275777>"
    };
    static theme = "destiny, future, heroism, parenting, and jobs";
    static location = {
        name:"Hagukumi City",
        icon:"https://static.wikia.nocookie.net/prettycure/images/0/02/Hakumi-City.png",
    };
}

class Battle {
    static party_special = "Minna de Tomorrow";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824156303525019648/image0.webp";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "oshimaida";
    static name = "Oshimaida";
    static catchphrase = "Oshimaida!";
    static chaos_meter = "eternity";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
class Properties {
    static value = "max_heart";

    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617394872614942/latest.png",
        mascot_emoji:"<:m1_mepple:936237021293322290>"
    }

    static name = "Max Heart";
    static currency = {
        name:"Heartiel Points",
        icon_emoji:"<:m1_mepple:936237021293322290>"
    };
    static theme = "yin & yang";
    static location = {
        name:"Wakaba City",
        icon:"",
    };
}

class Battle {
    static party_special = "Extreme Luminario";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "zakenna";
    static name = "Zakenna";
    static catchphrase = "Zakenna!";
    static chaos_meter = "havoc";
    static data = {};//will be loaded from init,
}

module.exports = {
    Properties, Monsters, Battle
}
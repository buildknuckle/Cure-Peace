const GProperties = require("../Properties");

class Properties {
    static value = "mahou_tsukai";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png",
        mascot_emoji:"<:m11_mofurun:936237023465984050>"
    }
    static name = "Mahou Tsukai";
    static currency = {
        name:"Linkle Points",
        icon_emoji:"<:m11_mofurun:936237023465984050>"
    };
    static theme = "sorcery, gemstones and friendship";
    static location = {
        name:"Tsunagi",
        icon:"https://static.wikia.nocookie.net/prettycure/images/2/2a/No_Magic_World_Setting.png",
    };
}

class Battle {
    static party_special = "Extreme Rainbow";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "yokubaru";
    static name = "Yokubaru";
    static catchphrase = "Yokubaru!";
    static chaos_meter = "hex";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
const GProperties = require("../Properties");

class Properties {
    static value = "mahou_tsukai";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png",
        mascot_emoji:GProperties.emoji.m11_mofurun
    }
    static name = "Mahou Tsukai";
    static currency = {
        name:"Linkle Points",
        icon_emoji:GProperties.emoji.m11_mofurun
    };
    static theme = "sorcery, gemstones and friendship";
}

class Battle {
    static party_special = "Extreme Rainbow";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp";
}

class Enemy {
    static data = {
        tsunagarus:{
            term:"yokubaru",
            name:"Yokubaru",
            catchphrase:"Yokubaru!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/e/ed/MTPC01_-_Yokubaru.png",
                "https://static.wikia.nocookie.net/prettycure/images/0/0a/MTPC05_Yokubaru.png",
                "https://static.wikia.nocookie.net/prettycure/images/3/3d/MTPC10_Yokubaru.png",
                "https://static.wikia.nocookie.net/prettycure/images/b/b2/MTPC15_Yokubaru.png",
                "https://static.wikia.nocookie.net/prettycure/images/f/f9/MTPC25_Yokubaru.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
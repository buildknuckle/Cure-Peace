const GProperties = require("../Properties");

class Properties {
    static value = "heartcatch";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617596086878239/latest.png",
        mascot_emoji:GProperties.emoji.m5_cyphre
    }
    static name = "Heartcatch";
    static currency = {
        name:"Heart Seed Points",
        icon_emoji:GProperties.emoji.m5_cyphre
    };
    static theme = "Flowers and Hanakotoba";
}

class Battle {
    static party_special = "Heartcatch Orchestra";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824149388389646336/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"desertrian",
            name:"Desertrian",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/e/e2/Desertrian_01.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/6/6b/Desertrian_05.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/8/85/Desertrian_09.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/0/04/Desertrian_11.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
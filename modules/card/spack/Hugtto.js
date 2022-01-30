const GProperties = require("../Properties");

class Properties {
    static value = "hugtto";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845618022843809842/latest.png",
        mascot_emoji:GProperties.emoji.m13_hariham
    }
    static name = "HUGtto!";
    static currency = {
        name:"Mirai Crystal Points",
        icon_emoji:GProperties.emoji.m13_hariham
    };
    static theme = "destiny, future, heroism, parenting, and jobs";
}

class Battle {
    static party_special = "Minna de Tomorrow";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824156303525019648/image0.webp";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"oshimaida",
            name:"Oshimaida",
            catchphrase:"Oshimaida!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/d/d6/HuPC01_Oshimaid%C4%81.png",
                "https://static.wikia.nocookie.net/prettycure/images/7/7a/Oshimaida_03.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/8/8c/HuPC09_Oshimaida.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/b/b9/HuPC21_Oshimaida.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/6/67/HuPC23_Oshimaida.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
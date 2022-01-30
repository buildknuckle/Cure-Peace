const GProperties = require("../Properties");

class Properties {
    static value = "fresh";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617558089367552/latest.png",
        mascot_emoji:GProperties.emoji.m4_chiffon
    }
    static name = "Fresh";
    static currency = {
        name:"Linkrun Points",
        icon_emoji:GProperties.emoji.m4_chiffon
    };
    static theme = "fruits, clovers, card suits, and dancing";
}

class Battle {
    static type_monster = "nakewameke";
    static party_special = "Lucky Clover Grand Finale";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146317411483688/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"nakewameke",
            name:"Nakewameke",
            catchphrase:"Nakewameke!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/b/b2/Nakewameke_01.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/1/1e/Nakewameke_02.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/a/af/Nakewameke_10.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/5/5a/Nakewameke_11.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/d/de/Nakewameke_17.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
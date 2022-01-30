const GProperties = require("../Properties");

class Properties {
    static value = "go_princess";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png",
        mascot_emoji:GProperties.emoji.m10_aroma
    }
    static name = "Go! Princess";
    static currency = {
        name:"Princess Points",
        icon_emoji:GProperties.emoji.m10_aroma
    };
    static theme = "princesses, personal goals and dreams";
}

class Battle {
    static party_special = "Grand Printemps";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"zetsuborg",
            name:"Zetsuborg",
            catchphrase:"Zetsuborg!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/e/ee/Book_Zetsuborg.png",
                "https://static.wikia.nocookie.net/prettycure/images/0/05/Episode8Zetsuborg.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/f/fc/GPPC12_Zetsuborg.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/4/49/This_Episode%27s_Zetsuborg_%2816%29.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/9/97/Episode19Zetsuborg.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
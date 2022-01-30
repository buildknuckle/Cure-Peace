const GProperties = require("../Properties");

class Properties {
    static value = "healin_good";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/936266739841372160/healin_good.png",
        mascot_emoji:GProperties.emoji.m15_rabirin
    }
    
    static name = "Healin' Good";
    static currency = {
        name:"Elemental Points",
        icon_emoji:GProperties.emoji.m15_rabirin
    };
    static theme = "health, nature, and animals";
}

class Battle {
    static party_special = "Healing Oasis";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"megabyogen",
            name:"Megabyogen",
            catchphrase:"Mega!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/a/ab/HGPC01_Megabyogen.png",
                "https://static.wikia.nocookie.net/prettycure/images/4/4e/HGPC02_Megabyogen.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/e/e9/HGPC06_The_Megabyogen.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/0/07/HGPC07_Megabyogen.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
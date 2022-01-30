const GProperties = require("../Properties");

class Properties {
    static value = "max_heart";

    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617394872614942/latest.png",
        mascot_emoji:GProperties.emoji.m1_mepple
    }

    static name = "Max Heart";
    static currency = {
        name:"Heartiel Points",
        icon_emoji:GProperties.emoji.m1_mepple
    };
    static theme = "yin & yang";
}

class Battle {
    static party_special = "Extreme Luminario";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png";
}

class Enemy {
    static data = {
        tsunagarus:{//normal monster
            term:"zakenna",
            name:"Zakenna",
            catchphrase:"Zakenna!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/d/d2/FwPC01_Roller_Coaster_Zakenna.png",
                "https://static.wikia.nocookie.net/prettycure/images/0/00/FwPC04_Zakenna_Horseback.png",
                "https://static.wikia.nocookie.net/prettycure/images/a/a1/FwPC06_Zakenna-possessed_bear.png",
                "https://static.wikia.nocookie.net/prettycure/images/6/63/FwPC09_Zakenna_Anatomy_model.png"
            ],
        },
        regine: {
            img:"https://static.wikia.nocookie.net/prettycure/images/c/cb/FwPC_Regine_fullbody.jpg",
            color:["red"],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
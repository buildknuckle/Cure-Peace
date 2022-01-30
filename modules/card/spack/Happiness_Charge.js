const GProperties = require("../Properties");

class Properties {
    static value = "happiness_charge";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png",
        mascot_emoji:GProperties.emoji.m9_ribbon
    }
    static name = "Happiness Charge";
    static currency = {
        name:"Precard Points",
        icon_emoji:GProperties.emoji.m9_ribbon
    };
    static theme = "mirrors, fashion, dancing and romance";
}

class Battle {
    static party_special = "Innocent Purification";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"saiarks",
            name:"Saiarks",
            catchphrase:"Saiarks!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/1/17/HCPC03.saiark.PNG",
                "https://static.wikia.nocookie.net/prettycure/images/a/a4/Hcpc11saiars.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/5/54/Saiarkep24.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/1/18/HCPC26Saiark.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
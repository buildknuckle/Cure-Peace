const GProperties = require("../Properties");

class Properties {
    static value = "splash_star";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617466529021962/Puzzlun_data_download_cures_4.png",
        mascot_emoji:GProperties.emoji.m2_flappy
    }
    static name = "Splash Star";
    static currency = {
        name:"Miracle Drop Points",
        icon_emoji:GProperties.emoji.m2_flappy
    }
    
    static theme = "flower, bird, wind and moon";
}

class Battle {
    static party_special = "Spiral Heart Splash";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"uzaina",
            name:"Uzaina",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/b/b7/FwPCSS01_-_Uzaina.png",
                "https://static.wikia.nocookie.net/prettycure/images/f/fa/FwPCSS05_-_Uzaina.png",
                "https://static.wikia.nocookie.net/prettycure/images/d/db/FwPCSS06_-_Uzaina.png",
                "https://static.wikia.nocookie.net/prettycure/images/2/23/FwPCSS12_-_Uzaina.png"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
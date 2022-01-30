const GProperties = require("../Properties");

class Properties {
    static value = "dokidoki";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
        mascot_emoji:GProperties.emoji.m8_davi
    }
    static name = "Doki Doki";
    static currency = {
        name:"Lovead Points",
        icon_emoji:GProperties.emoji.m8_davi
    };
    static theme = "emotions and selflessness";
}

class Battle {
    static party_special = "Royal Lovely Straight Flush";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png";
}

class Enemy {
    static data = {
        tsunagarus:{
            term:"jikochuu",
            name:"Jikochuu",
            catchphrase:"Jikochuu!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/2/21/JikochuuGorilla.png",
                "https://static.wikia.nocookie.net/prettycure/images/4/47/Jikochuu_marmo.png",
                "https://static.wikia.nocookie.net/prettycure/images/5/54/Aee42734.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/7/77/Jikochuu_pelota.png",
                "https://static.wikia.nocookie.net/prettycure/images/1/11/DDPC16.Jikochuu.PNG"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
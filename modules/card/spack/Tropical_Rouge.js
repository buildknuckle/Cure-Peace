const GProperties = require("../Properties");

class Properties {
    static value = "tropical_rouge";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/832917823122571294/927540812659687444/deb2gk0-c438e38e-61d7-454f-b57e-eca1f24dddda.png",
        mascot_emoji:GProperties.emoji.m16_kururun
    }
    static name = "Tropical-Rouge!";
    static currency = {
        name:"Tropi Points",
        icon_emoji:GProperties.emoji.m16_kururun
    };
    static theme = "mermaids and club activities";
}

class Battle {
    static party_special = "Mix Tropical";
    static img_party_special = "https://cdn.discordapp.com/attachments/832917823122571294/927542773899460658/1000.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"yaraneeda",
            name:"Yaraneeda",
            catchphrase:"Yaraneeda!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/c/c8/TRPC01_Yaraneeda.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/c/ca/TRPC04_Yaraneeda.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/6/69/TRPC08_Yaraneeda.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/d/d1/TRPC09_Yaraneeda.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
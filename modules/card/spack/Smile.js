const GProperties = require("../Properties");

class Properties {
    static value = "smile";
    static icon = {
        series: "https://cdn.discordapp.com/attachments/793415946738860072/845617680399728690/latest.png",
        mascot_emoji:GProperties.emoji.m7_candy
    }
    static name = "Smile";
    static currency = {
        name:"Decor Points",
        icon_emoji:GProperties.emoji.m7_candy
    };

    static theme = "fairy tales";

    static jankenponData = {
        rock:{
            value:"rock",
            icon:"🪨",
            img:"https://i.imgur.com/xvAk8aA.png",
            choiceResults:{//player results
                paper:true,
                scissors:false
            }
        }, 
        paper:{
            value:"paper",
            icon:"📜",
            img:"https://imgur.com/uQtSfqD.png",
            choiceResults:{//player results
                scissors:true,
                rock:false
            }
        },
        scissors:{
            value:"scissors",
            icon:"✂️",
            img:"https://imgur.com/vgqsHN5.png",
            choiceResults:{//player results
                rock:true,
                paper:false
            }
        }
    }
}

class Battle {
    static party_special = "Royal Rainbow Burst";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824151822146207764/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"akanbe",
            name:"Akanbe",
            catchphrase:"Akanbe!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/4/46/Akanbe_01.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/4/44/Gfxg.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/0/06/Akanbe.ep.9.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/9/91/Akanbe_15.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/b/b8/Akanbe.ep16.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
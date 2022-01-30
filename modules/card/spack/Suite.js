const GProperties = require("../Properties");

class Properties {
    static value = "suite";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617647847473160/latest.png",
        mascot_emoji:GProperties.emoji.m6_hummy
    }
    static name = "Suite";
    static currency = {
        name:"Melody Note Points",
        icon_emoji:GProperties.emoji.m6_hummy
    };
    static theme = ":musical_note: musical theme";
}

class Battle {
    static party_special = "Suite Session Ensemble Crescendo";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824150226645680138/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"negatone",
            name:"Negatone",
            catchphrase:"Negatone!",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/7/72/Nega0102.gif",
                "https://static.wikia.nocookie.net/prettycure/images/0/02/Nega05a.gif",
                "https://static.wikia.nocookie.net/prettycure/images/e/ec/Nega07.gif",
                "https://static.wikia.nocookie.net/prettycure/images/c/cc/Nega11.gif",
                "https://static.wikia.nocookie.net/prettycure/images/f/f8/Nega15.gif"
            ],
        }
    }
}

class FairyTones {
    static dataFairy = {
        pink:{
            value:"pink",
            name:"Pink",
            img:"https://static.wikia.nocookie.net/prettycure/images/3/33/Fairy01.gif"
        },
        white:{
            value:"white",
            name:"White",
            img:"https://static.wikia.nocookie.net/prettycure/images/d/d5/Fairy02.gif"
        },
        orange:{
            value:"orange",
            name:"Orange",
            img:"https://static.wikia.nocookie.net/prettycure/images/9/94/Fairy03.gif"
        },
        yellow:{
            value:"yellow",
            name:"Yellow",
            img:"https://static.wikia.nocookie.net/prettycure/images/6/63/Fairy04.gif"
        },
        green:{
            value:"green",
            name:"Green",
            img:"https://static.wikia.nocookie.net/prettycure/images/7/71/Fairy05.gif"
        },
        lightBlue:{
            value:"lightBlue",
            name:"Light Blue",
            img:"https://static.wikia.nocookie.net/prettycure/images/b/b1/Fairy06.gif"
        },
        blue:{
            value:"blue",
            name:"Blue",
            img:"https://static.wikia.nocookie.net/prettycure/images/6/68/Fairy07.gif"
        },
        purple:{
            value:"purple",
            name:"Purple",
            img:"https://static.wikia.nocookie.net/prettycure/images/0/00/Fairy08.gif"
        }
    }
}


module.exports = {
    Properties, Battle, Enemy, FairyTones
}
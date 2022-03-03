class Properties {
    static value = "suite";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617647847473160/latest.png",
        mascot_emoji:"<:m6_hummy:936237021716946964>"
    }
    static name = "Suite";
    static currency = {
        name:"Melody Note Points",
        icon_emoji:"<:m6_hummy:936237021716946964>"
    };
    static theme = ":musical_note: musical theme";
    static location = {
        name:"Kanon Town",
        icon:"https://static.wikia.nocookie.net/prettycure/images/0/09/Kanon_Town.jpg",
    };
}

class Battle {
    static party_special = "Suite Session Ensemble Crescendo";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824150226645680138/image0.png";
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

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "negatone";
    static name = "Negatone";
    static catchphrase = "Negatone!";
    static chaos_meter = "nega";
    static data = {};//will be loaded from init
}


module.exports = {
    Properties, Battle, FairyTones, Monsters
}
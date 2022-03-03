class Properties {
    static value = "smile";
    static icon = {
        series: "https://cdn.discordapp.com/attachments/793415946738860072/845617680399728690/latest.png",
        mascot_emoji:"<:m7_candy:936237023747014726>"
    }
    static name = "Smile";
    static currency = {
        name:"Decor Points",
        icon_emoji:"<:m7_candy:936237023747014726>"
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

    static location = {
        name:"Nanairogaoka",
        icon:"https://static.wikia.nocookie.net/prettycure/images/7/74/Nanairoga1.jpg",
    };

}

class Battle {
    static party_special = "Royal Rainbow Burst";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824151822146207764/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "akanbe";
    static name = "Akanbe";
    static catchphrase = "Akanbe!";
    static chaos_meter = "fiasco";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
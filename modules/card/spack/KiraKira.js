const GProperties = require("../Properties");

class Properties {
    static value = "kirakira";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png",
        mascot_emoji:GProperties.emoji.m12_pekorin
    }
    static name = "KiraKira";
    static currency = {
        name:"Kirakiraru",
        icon_emoji:GProperties.emoji.m12_pekorin
    };
    static theme = "sweets, animals and creativity";
}

class Battle {
    static party_special = "Fantastic Animale";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"kirakirarun_thieves",
            name:"Kirakirarun Thieves",
            color: [],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/1/15/KKPCALM_01_Gummy_and_the_Kirakiraru.png",
                "https://static.wikia.nocookie.net/prettycure/images/5/5e/Pulupuluu.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/0/0b/KKPCALM03_Hotto_first_form.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/9/98/Tarton_with_Kirakiraru_%282%29.png"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
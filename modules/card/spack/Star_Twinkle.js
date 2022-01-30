const GProperties = require("../Properties");

class Properties {
    static value = "star_twinkle";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845618044655239188/latest.png",
        mascot_emoji:GProperties.emoji.m14_fuwa
    }
    static name = "Star Twinkle";
    static currency = {
        name:"Twinkle Points",
        icon_emoji:GProperties.emoji.m14_fuwa
    };
    static theme = "space, astrology and imagination";

    static fuwaConstellation = {
        aries:{
            name:"Aries Fuwa",
            img_url:["https://cdn.discordapp.com/attachments/841371817704947722/841519710062247936/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841519710285332490/image1.png"]
        },
        taurus:{
            name:"Taurus Fuwa",
            img_url:["https://cdn.discordapp.com/attachments/841371817704947722/841519957682552832/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841519957934342144/image1.png"]
        },
        gemini:{
            name:"Gemini Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841520642935226388/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841520643178889246/image1.png"
            ]
        },
        cancer:{
            name:"Cancer Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841521681398497320/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841521681628528680/image1.png"
            ]
        },
        leo:{
            name:"Leo Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841522187881414706/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841522188099780628/image1.png"
            ]
        },
        virgo:{
            name:"Virgo Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841523045402279956/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841523045638471710/image1.png"
            ]
        },
        libra:{
            name:"Libra Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841524914317951086/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841524914543788053/image1.png"
            ]
        },
        scorpio:{
            name:"Scorpio Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841525434931085332/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841525435221016586/image1.png"
            ]
        },
        sagittarius:{
            name:"Sagittarius Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841525834703437835/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841525835013423134/image1.png"
            ]
        },
        capricorn:{
            name:"Capricorn Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841526112294797312/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841526112533741588/image1.png"
            ]
        },
        aquarius:{
            name:"Aquarius Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841526881769881630/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841526881987723284/image1.png"
            ]
        },
        pisces:{
            name:"Pisces Fuwa",
            img_url:[
                "https://cdn.discordapp.com/attachments/841371817704947722/841527139165798400/image0.png","https://cdn.discordapp.com/attachments/841371817704947722/841527139496099850/image1.png"
            ]
        }
    }
}

class Battle {
    static party_special = "Star Twinkle Imagination";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824156329014460416/image0.png";
}

class Enemy{
    static data = {
        tsunagarus:{
            term:"nottrigger",
            name:"Nottrigger",
            catchphrase:"Nottrigger",
            color:[],//will be loaded from init
            img:[
                "https://static.wikia.nocookie.net/prettycure/images/6/62/STPC06_Nottoreiga.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/b/b9/STPC12_Nottoriga.jpeg",
                "https://static.wikia.nocookie.net/prettycure/images/7/76/STPC16_Nottorigga.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/6/65/STPC19_Aiwarn%27s_Nottoriga.jpg",
                "https://static.wikia.nocookie.net/prettycure/images/7/7f/STPC20_Aiwarn%27s_Nottoriga_form.jpg"
            ],
        }
    }
}

module.exports = {
    Properties, Battle, Enemy
}
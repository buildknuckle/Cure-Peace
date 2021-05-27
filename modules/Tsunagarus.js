const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardModules = require('../modules/Card');
const CardGuildModules = require('../modules/CardGuild');

class Properties {
    static dataTsunagarusExecutivesCore = {
        barabaran:{
            name:"Barabaran",
            img_url:"https://media.discordapp.net/attachments/842662797941669888/844457642474340352/latest.png",
            embed_color:"#FF9E28"
        }
    }

    static enemySpawnData = {
        tsunagarus : {
            category:{
                normal:"normal",
                boss:"boss",
                executives:"executives"
            },
            chokkins:{
                category:"normal",
                term:"chokkins",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/817018351846293554/Chokkin.png",
                embedColor:"#D9A4FE",
            },
            dibosu:{
                category:"normal",
                term:"dibosu",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/817018421795487764/Dibosufinal.png",
                embedColor:"#1D0F21",
            },
            gizzagizza:{
                category:"normal",
                term:"gizzagizza",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/817018549146484746/Gizzagizza.png",
                embedColor:"#ED873C",
            },
            chiguhaguu:{
                category:"normal",
                term:"chiguhaguu",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/822016967741407272/latest.png",
                embedColor:"#C9C9C9",
            },
            chiridjirin:{
                category:"normal",
                term:"chiridjirin",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png",
                embedColor:"#CC3060",
            },
            buttagiru:{
                category:"boss",
                term:"buttagiru",
                image:"https://cdn.discordapp.com/attachments/793415946738860072/817018566057918484/Buttagiru.png",
                embedColor:"#B2D67A",
                actions:{
                    color_absorb:{
                        value:"color_absorb",
                        name:"💔Color Absorb!",
                        description:"Absorb <xcolor> color into HP",
                    },
                    buttascream:{
                        value:"buttascream",
                        name:"💥Buttascream!",
                        description:"Inflict atk debuff after battle"
                    },
                    big_punch:{
                        value:"big_slam",
                        name:"💥Big Slam!",
                        description:"Inflict hp debuff after battle"
                    },
                    charge_up:{
                        value:"charge_up",
                        name:"⬆️Charge Up!",
                        description:"Hasten & take 2 turns ahead"
                    },
                    daydreaming:{
                        value:"daydreaming",
                        name:"💭Daydreaming...",
                        description:"Daydreaming and do nothing!"
                    }
                },
                actions_last_lives:{
                    buttascream:{
                        value:"buttascream",
                        name:"💥Buttascream!",
                        description:"Inflict atk debuff after battle"
                    },
                    big_punch:{
                        value:"big_slam",
                        name:"💥Big Slam!",
                        description:"Inflict hp debuff after battle"
                    },
                    charge_up:{
                        value:"charge_up",
                        name:"⬆️Charge Up!",
                        description:"Hasten & take 2 turns ahead"
                    }
                },
                special_attack:{
                    buttagislam:{
                        value:"buttagislam",
                        name:"💢Buttagislam!",
                        description:"Deal 100% hp damage to all party members & ends the battle"
                    }
                }
            },
        },
        "max heart":{
            term:"zakenna"
        },
        "splash star":{
            term:"uzaina"
        },
        "yes! precure 5 gogo!":{
            term:"hoshina"
        },
        "fresh":{
            term:"nakewameke"
        },
        "heartcatch":{
            term:"desertrian",
            super:true
        },
        "suite":{
            term:"negatone"
        },
        "smile":{
            term:"akanbe",
            super:true
        },
        "doki doki!":{
            term:"jikochuu"
        },
        "happiness":{
            term:"saiarks",
            super:true
        },
        "go! princess":{
            term:"zetsuborg",
            super:true
        },
        "mahou tsukai":{
            term:"yokubaru",
            super:true
        },
        "kirakira":{
            term:"kirakirarun thieves",
            super:true
        },
        "hugtto":{
            term:"oshimaida",
            super:true
        },
        "star twinkle":{
            term:"nottrigger",
            super:true
        },
        "healin' good":{
            term:"megabyogen"
        }
    }

}

function introduction(id_guild,name){
    var objEmbed = new Discord.MessageEmbed({
        color:Properties.dataTsunagarusExecutivesCore[name].embed_color,
        author:{
            name:Properties.dataTsunagarusExecutivesCore[name].name
        },
        description:Properties.dataTsunagarusExecutivesCore[name].embed_color,
        thumbnail:{
            url:Properties.dataTsunagarusExecutivesCore[name].img_url
        }
    });
    return objEmbed;
}


module.exports = {Properties,introduction}
const Discord = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardModules = require('../modules/Card');
const CardGuildModules = require('./Guild');

class Properties {
    static dataTsunagarusExecutivesCore = {
        barabaran:{
            name:"Barabaran",
            img_url:"https://media.discordapp.net/attachments/842662797941669888/844457642474340352/latest.png",
            embed_color:"#FF9E28"
        }
    }

    static dataEnemyType = {
        zakenna:"zakenna",
        uzaina:"uzaina",
        hoshina:"hoshina",
        nakewameke:"nakewameke",
        desertrian:"desertrian",
        negatone:"negatone",
        akanbe:"akanbe",
        jikochuu:"jikochuu",
        saiarks:"saiarks",
        zetsuborg:"zetsuborg",
        yokubaru:"yokubaru",
        kirakirarun_thieves:"kirakirarun thieves",
        oshimaida:"oshimaida",
        nottrigger:"nottrigger",
        megabyogen:"megabyogen",
        yaraneda:"yaraneda"
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
                        description:"Instantly wipe out entire party members & ends the battle"
                    }
                }
            },
            barabaran:{
                category:"boss",
                term:"barabaran",
                image:"https://media.discordapp.net/attachments/842662797941669888/844457642474340352/latest.png",
                embedColor:"#FF9E28",
                actions:{
                    slowmo_punch_2:{
                        value:"slowmo_punch_2",
                        name:"🕑Slow Motion Punch 2",
                        description:"Prepare for incoming attack in 2 turns.",
                    },
                    slowmo_punch_3:{
                        value:"slowmo_punch_3",
                        name:"🕒Slow Motion Punch 3",
                        description:"Prepare for incoming attack in 3 turns.",
                    },
                    white_force:{
                        value:"white_force",
                        name:"⚪White Force - <xcolor>",
                        description:"Renders white force field against: <xcolor>",
                    },
                    black_force:{
                        value:"black_force",
                        name:"⚫Black Force - <xcolor>",
                        description:"Renders black force field against: <xcolor>",
                    },
                    barbarpunch:{
                        value:"barbarpunch",
                        name:"💥Slowmo afterhit: Barbar Punch!",
                        description:"Inflict hp debuff after unsuccessful block.",
                    },
                    white_beam:{
                        value:"white_beam",
                        name:"⚪White Beam!",
                        description:"Absorb attack against white force.",
                    },
                    black_beam:{
                        value:"black_beam",
                        name:"⚫Black Beam!",
                        description:"Absorb attack against black force.",
                    },
                    slowmo_kick_2:{
                        value:"slowmo_kick_2",
                        name:"🕑Slow Motion Kick 2",
                        description:"Prepare for incoming attack.",
                    },
                    slowmo_kick_3:{
                        value:"slowmo_kick_3",
                        name:"🕒Slow Motion Kick 3",
                        description:"Prepare for incoming attack.",
                    },
                    slowmo_kick_4:{
                        value:"slowmo_kick_4",
                        name:"🕓Slow Motion Kick 4",
                        description:"Prepare for incoming attack.",
                    },
                    sunlight_force:{
                        value:"sunlight_force",
                        name:"☀️Sunlight Force - <xcolor>",
                        description:"Renders sunlight force field against: <xcolor>",
                    },
                    moonlight_force:{
                        value:"moonlight_force",
                        name:"🌙Moonlight Force - <xcolor>",
                        description:"Renders moonlight force field against: <xcolor>",
                    },
                    barbarkick:{
                        value:"barbarkick",
                        name:"💥Slowmo afterhit: Barbar Kick!",
                        description:"Inflict hp debuff after battle.",
                    },
                    forcepposite:{
                        value:"forcepposite",
                        name:"🔁Forcepposite",
                        description:"Swaps the sun/moon force.",
                    },
                    sun_beam:{
                        value:"sun_beam",
                        name:"☀️Sun Beam!",
                        description:"Absorb sunlight force attack.",
                    },
                    moon_beam:{
                        value:"moon_beam",
                        name:"🌙Moon Beam!",
                        description:"Absorb moonlight force attack.",
                    }
                },
                actions_last_lives:{
                    
                },
                actions_mechanics:{
                    slowmo_punch:"slowmo_punch",
                    slowmo_kick:"slowmo_kick",
                    white_force:"white_force",
                    black_force:"black_force",
                    sunlight_force:"sunlight_force",
                    moonlight_force:"moonlight_force"
                },
                special_attack:{
                    rampage:{
                        value:"rampage",
                        name:"💢Rampage!",
                        description:"Instantly wipe out entire party members & ends the battle"
                    }
                }
            }
        },
        "max heart":{
            term:this.dataEnemyType.zakenna
        },
        "splash star":{
            term:this.dataEnemyType.uzaina
        },
        "yes! precure 5 gogo!":{
            term:this.dataEnemyType.hoshina
        },
        "fresh":{
            term:this.dataEnemyType.nakewameke
        },
        "heartcatch":{
            term:this.dataEnemyType.desertrian
        },
        "suite":{
            term:this.dataEnemyType.negatone
        },
        "smile":{
            term:this.dataEnemyType.akanbe
        },
        "doki doki!":{
            term:this.dataEnemyType.jikochuu
        },
        "happiness":{
            term:this.dataEnemyType.saiarks
        },
        "go! princess":{
            term:this.dataEnemyType.zetsuborg
        },
        "mahou tsukai":{
            term:this.dataEnemyType.yokubaru
        },
        "kirakira":{
            term:this.dataEnemyType.kirakirarun_thieves
        },
        "hugtto":{
            term:this.dataEnemyType.oshimaida
        },
        "star twinkle":{
            term:this.dataEnemyType.nottrigger
        },
        "healin' good":{
            term:this.dataEnemyType.megabyogen
        },
        "tropical rouge":{
            term:this.dataEnemyType.yaraneda
        }
    }

}

class Mechanics {
    
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


module.exports = {Properties, Mechanics, introduction}
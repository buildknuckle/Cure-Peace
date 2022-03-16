const properties = {
    value:"kirakira",
	name:"KiraKira",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png",
    emoji:{
        mascot:"<:m12_pekorin:936237024149659689>",
    },
    currency:{
        name:"kirakiraru",
        emoji:"<:m12_pekorin:936237024149659689>"
    },
    theme:"sweets, animals and creativity",
    location:{
        name:"Ichigozaka",
        icon:"https://static.wikia.nocookie.net/prettycure/images/5/50/KKPCALM_Ichigozaka_Concepts.png",
    },
}

const teams = {
	icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png",
    special:{
        name:"Fantastic Animale",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp",
    }
}

const monsters = require("../enpack/monsters/Kirakirarun_thieves");

module.exports = {
    properties, teams, monsters
}
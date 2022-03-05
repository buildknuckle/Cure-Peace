const properties = {
    value:"tropical_rouge",
	name:"Tropical-Rouge!",
    icon:"https://waa.ai/fTjk",
    emoji:{
        mascot:"<:m16_kururun:936237022274781215>",
    },
    currency:{
        name:"Tropi Points",
        emoji:"<:m16_kururun:936237022274781215>"
    },
    theme:"mermaids and club activities",
    location:{
        name:"Aozora City",
        icon:"https://static.wikia.nocookie.net/prettycure/images/1/14/TRPC01_Aozora_City.jpg",
    },
}

const teams = {
	icon:"https://waa.ai/fTjk",
    special:{
        name:"Mix Tropical",
        icon:"https://cdn.discordapp.com/attachments/832917823122571294/927542773899460658/1000.png",
    }
}

const monsters = require("../enpack/monsters/Yaraneeda");

module.exports = {
    properties, teams, monsters
}
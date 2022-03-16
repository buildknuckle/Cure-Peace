const properties = {
    value:"healin_good",
	name:"Healin' Good",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/936266739841372160/healin_good.png",
    emoji:{
        mascot:"<:m15_rabirin:936237024724262923>",
    },
    currency:{
        name:"elemental points",
        emoji:"<:m15_rabirin:936237024724262923>"
    },
    theme:"health, nature, and animals",
    location:{
        name:"Sukoyaka City",
        icon:"https://static.wikia.nocookie.net/prettycure/images/a/a6/HGPC14_Nodoka%27s_voice_echoes_throughout_Sukoyaka_City.jpg",
    },
}

const teams = {
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/936266739841372160/healin_good.png",
    special:{
        name:"Healing Oasis",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png",
    }
}

const monsters = require("../enpack/monsters/Megabyogen");

module.exports = {
    properties, teams, monsters
}
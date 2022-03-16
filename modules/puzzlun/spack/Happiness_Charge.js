const properties = {
    value:"happiness_charge",
	name:"Happiness Charge",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png",
    emoji:{
        mascot:"<:m9_ribbon:936237024602628096>",
    },
    currency:{
        name:"precard points",
        emoji:"<:m9_ribbon:936237024602628096>"
    },
    theme:"mirrors, fashion, dancing and romance",
    location:{
        name:"Pikarigaoka",
        icon:"https://static.wikia.nocookie.net/prettycure/images/2/25/Pikarigaoka_Full_View.png",
    },
}

const teams = {
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png",
    special:{
        name:"Innocent Purification",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png"
    }
}

const monsters = require("../enpack/monsters/Saiarks");

module.exports = {
    properties, teams, monsters
}
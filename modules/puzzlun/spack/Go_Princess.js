const Properties = {
    value:"go_princess",
	name:"Go! Princess",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png",
    emoji:{
        mascot:"<:m10_aroma:936237022056710154>",
    },
    currency:{
        name:"Princess Points",
        emoji:"<:m10_aroma:936237022056710154>"
    },
    theme:"princesses, personal goals and dreams",
    location:{
        name:"Yumegahama",
        icon:"https://static.wikia.nocookie.net/prettycure/images/0/01/Yumegahama.png",
    },
}

const Teams = {
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png",
    special:{
        name:"Grand Printemps",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp",
    }
}

const Monsters = require("../enpack/monsters/Zetsuborg");

module.exports = {
    Properties, Teams, Monsters
}
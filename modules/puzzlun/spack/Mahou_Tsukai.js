const Properties = {
    value:"mahou_tsukai",
	name:"Mahou Tsukai",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png",
    emoji:{
        mascot:"<:m11_mofurun:936237023465984050>",
    },
    currency:{
        name:"Linkle Points",
        emoji:"<:m11_mofurun:936237023465984050>",
    },
    theme:"sorcery, gemstones and friendship",
    location:{
        name:"Tsunagi",
        icon:"https://static.wikia.nocookie.net/prettycure/images/2/2a/No_Magic_World_Setting.png",
    },
}

const Teams = {
	icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png",
    special:{
        name:"Extreme Rainbow",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp",
    }
}

const Monsters = require("../enpack/monsters/Yokubaru");

module.exports = {
    Properties, Teams, Monsters
}
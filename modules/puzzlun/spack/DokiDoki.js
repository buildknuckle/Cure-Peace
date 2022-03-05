const properties = {
    value:"dokidoki",
    name:"Doki Doki",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
    emoji:{
        mascot:"<:m8_davi:936237025609261106>",
    },
    currency:{
        name:"Lovead Points",
        emoji:"<:m8_davi:936237025609261106>"
    },
    theme:"emotions and selflessness",
    location:{
        name:"Oogai Town",
        icon:"https://static.wikia.nocookie.net/prettycure/images/4/4a/Clover_Tower_.jpg",
    },
}

const teams = {
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
    special:{
        name:"Royal Lovely Straight Flush",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png",
    }
}

const monsters = require("../enpack/monsters/Jikochuu");

module.exports = {
    properties, teams, monsters
}
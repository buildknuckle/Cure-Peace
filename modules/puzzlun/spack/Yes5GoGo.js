const properties = {
    value:"yes5gogo",
	name:"Yes! PreCure 5 GoGo!",
    icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617508936974357/latest.png",
    emoji:{
        mascot:"<:m3_coco:936237022044110898>",
    },
    currency:{
        name:"palmin points",
        emoji:"<:m3_coco:936237022044110898>"
    },
    theme:"natural elements, human characteristics and emotions",
    location:{
        name:"L'École des Cinq Lumières",
        icon:"",
    },
}

const teams = {
	icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617508936974357/latest.png",
    special:{
        name:"Milky Rose Floral Explosion",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/824146259148668965/image0.png",
    }
}

const monsters = require("../enpack/monsters/Hoshina");

class Spawner {
    // static spawnTypeVal = {
    //     pinky:"pinky"
    // }

    // static async spawnRandomPinky(){//spawn for random pinky
    //     //spawn normal card
    //     var mapWhere = new Map();
    //     mapWhere.set(DBM_Pinky_Data.columns.rarity, 2);
        
    //     var resultData = await DB.selectRandom(DBM_Pinky_Data.TABLENAME); //for testing only
    // }
}

module.exports = {
    properties, teams, monsters, Spawner
}
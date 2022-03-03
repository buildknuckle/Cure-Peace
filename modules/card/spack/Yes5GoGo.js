const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Pinky_Data = require('../../../database/model/DBM_Pinky_Data');

class Properties {
    static value = "yes5gogo";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617508936974357/latest.png",
        mascot_emoji:"<:m3_coco:936237022044110898>"
    }
    static name = "Yes! PreCure 5 GoGo!";
    static currency = {
        name:"Palmin Points",
        icon_emoji:"<:m3_coco:936237022044110898>"
    }
    static theme = "natural elements, human characteristics and emotions";
    static location = {
        name:"L'École des Cinq Lumières",
        icon:"",
    };
}

class Pinky {
    static total = 0;
}

class Battle {
    static party_special = "Milky Rose Floral Explosion";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146259148668965/image0.png";
}

class Spawner {
    static spawnTypeVal = {
        pinky:"pinky"
    }

    static async spawnRandomPinky(){//spawn for random pinky
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(DBM_Pinky_Data.columns.rarity, 2);
        
        var resultData = await DB.selectRandom(DBM_Pinky_Data.TABLENAME); //for testing only
    }
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "hoshina";
    static name = "Hoshina";
    static chaos_meter = "eternal";
    static data = {};//will be loaded from init
}

async function init(){
    //constructor for yes5 gogo data
    //init pinky data
    var pinkyTotal = await DB.count(DBM_Pinky_Data.TABLENAME);
    Pinky.total = pinkyTotal[0]['total'];
}

module.exports = {
    Properties, Pinky, Battle, Spawner, Monsters, init
}
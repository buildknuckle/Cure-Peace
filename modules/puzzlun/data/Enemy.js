const GlobalFunctions = require('../../GlobalFunctions');

const EnPack = {
    monster:{
        zakenna: require("../enpack/monsters/Zakenna"),
        uzaina: require("../enpack/monsters/Uzaina"),
        hoshina: require("../enpack/monsters/Hoshina"),
        nakewameke: require("../enpack/monsters/Nakewameke"),
        desertrian: require("../enpack/monsters/Desertrian"),
        negatone: require("../enpack/monsters/Negatone"),
        akanbe: require("../enpack/monsters/Akanbe"),
        jikochuu: require("../enpack/monsters/Jikochuu"),
        saiarks: require("../enpack/monsters/Saiarks"),
        zetsuborg: require("../enpack/monsters/Zetsuborg"),
        yokubaru: require("../enpack/monsters/Yokubaru"),
        kirakirarun_thieves: require("../enpack/monsters/Kirakirarun_thieves"),
        oshimaida: require("../enpack/monsters/Oshimaida"),
        nottrigger: require("../enpack/monsters/Nottrigger"),
        megabyogen: require("../enpack/monsters/Megabyogen"),
        yaraneeda: require("../enpack/monsters/Yaraneeda"),
    },
    tsunagarus:{
        chokkins: require("../enpack/tsunagarus/Chokkins"),
    }
}

class Monster {
    value = null;
    name = null;
    catchphrase = null;
    chaos_meter = null;
    series = null;

    constructor(monsterType=null){
        if(monsterType!=null){
            for(var key in EnPack.monster[monsterType].properties){
                this[key] = EnPack.monster[monsterType].properties[key];
            }
        }
    }

    async randomize(){

    }
}

class Tsunagarus {

}

class Parameter {
    level = 1;
    maxHp= 0;
    hp= 0;
    atk= 0;

    constructor(level, maxHp, atk){
        this.level = level;
        this.maxHp = maxHp;
        this.hp = this.maxHp;
        this.atk = atk;
    }
}

class Enemy {
    parameter;
    enemyData;
    monster;

    constructor(enemyData = null, 
        playerData = {maxHp:0,atk:0}){
        if(enemyData!=null){
            this.parameter = new Parameter();
            this.monster = new Monster();
        }
    }
}

module.exports = {
    Enemy, EnPack
}
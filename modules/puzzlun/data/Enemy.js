const GlobalFunctions = require('../../GlobalFunctions');
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const {Series, SPack} = require('./Series');
const DBM_Monster_Data = require('../../../database/model/DBM_Monster_Data');

const Properties = require('../Properties');

class Monster {
    static type = {
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
    };

    static tablename = DBM_Monster_Data.TABLENAME;
    static columns = DBM_Monster_Data.columns;

    id= null;
    name= null;
    type= null;
    series= null;
    img_url= null;
    weakness_color= null;
    precure_buff_desc= null;
    precure_buff_effect= null;

    properties = {
        value: null,
        type: null,
        catchphrase: null,
        chaos_meter: null
    }
    // Series;

    constructor(monsterData=null){
        if(monsterData!=null){
            for(var key in monsterData){
                var val = monsterData[key];
                this[key] = val;
                switch(key){
                    case Monster.columns.type:{
                        this.properties[key] = Monster.type[val].properties;
                        break;
                    }
                    // case Monster.columns.series:{
                    //     this.Series = new Series(SPack[val].properties);
                    //     break;
                    // }
                }
            }
        }
    }

    static async randomizeMonsterData(){
        return await DB.selectRandom(Monster.tablename);
    }
}

class Tsunagarus {
    static type = {
        chokkins: require("../enpack/tsunagarus/Chokkins"),
    }

    properties = {
        value: null,
        name: null,
        icon: null,
        color: null
    }

    constructor(type=null){
        if(type!==null){
            this.properties = Tsunagarus.type[type].properties;
        }
    }
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

    constructor(enemyData = null){
        if(enemyData!==null){
            this.parameter = new Parameter();
            this.monster = new Monster();
        }
    }
}

module.exports = {
    Enemy, Tsunagarus, Monster
}
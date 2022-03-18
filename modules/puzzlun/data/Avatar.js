const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Avatar_Formation = require('../../../database/model/DBM_Avatar_Formation');

const {Series, SPack} = require("./Series");
const {Character, CPack} = require("./Character");
const GProperties = require('../Properties');
const CardInventory = require("./CardInventory");

const UPDATE_KEY = [
    DBM_Avatar_Formation.columns.id_user
]

class AvatarFormation {
    static tablename = DBM_Avatar_Formation.TABLENAME;
    static columns = DBM_Avatar_Formation.columns;
    static formation = {
        main: {
            name: "main",
            value: "main",
            columns: AvatarFormation.columns.id_main
        },
        support1: {
            name: "support 1",
            value:"support1",
            columns: AvatarFormation.columns.id_support1
        },
        support2: {
            name:"support 2",
            value:"support2",
            columns: AvatarFormation.columns.id_support2
        },
    }

    id_user = null;
    id_main = null;
    item_equip = null;
    id_support1 = null;
    id_support2 = null;
    
    constructor(avatarData = null){
        for(var key in avatarData){
            this[key] = avatarData[key];
        }
    }

    static async getData(userId){
        var paramWhere = new Map();
        paramWhere.set(AvatarFormation.columns.id_user, userId);
        var avatarData = await DB.select(AvatarFormation.tablename, paramWhere);

        if(avatarData[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(AvatarFormation.columns.id_user, userId);
            await DB.insert(AvatarFormation.tablename, parameter);
            //reselect after insert new data
            paramWhere = new Map();
            paramWhere.set(AvatarFormation.columns.id_user, userId);
            avatarData = await DB.select(AvatarFormation.tablename,paramWhere);
        }

        return avatarData[0];
    }

    async update(){
        let column = [//columns to be updated:
            AvatarFormation.columns.id_main,
            AvatarFormation.columns.id_support1,
            AvatarFormation.columns.id_support2
        ];

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(AvatarFormation.tablename, paramSet, paramWhere);
    }
}

class Parameter {
    level = 1;
    maxHp= 0;
    maxSp= 0;
    hp= 0;
    sp= 0;
    atk= 0;
    specialPoint= 0;

    constructor(level, maxHp, maxSp, atk){
        this.level = level;
        this.maxHp = maxHp;
        this.hp = this.maxHp;
        this.maxSp = maxSp;
        this.sp = this.maxSp;
        this.atk = atk;
    }
}

class PrecureAvatar {
    parameter;
    properties = {
        icon: null,
        name: null,
        transform_quotes1: null,
        transform_quotes2: null,
        special_attack: null,
        img_special_attack: null,
        img_transformation: null,
    };
    cardInventory;
    character;
    series;
    formation = {
        name: null,
        value: null,
        columns: null
    }

    /**
     * @param {string} formation formation in string name
     */
    constructor(formation=null, cardInventoryData=null, cardData=null){
        if(formation!=null) this.formation = AvatarFormation.formation[formation];
        if(cardInventoryData!=null){
            this.cardInventory = new CardInventory(cardInventoryData, cardData);
            this.parameter = new Parameter(this.cardInventory.level, this.cardInventory.maxHp, this.cardInventory.maxSp,
                this.cardInventory.atk, this.cardInventory.maxSp);
            this.properties = CPack[this.cardInventory.pack].Avatar.normal;
            this.character = new Character(this.cardInventory.pack);
            this.series = new Series(this.cardInventory.series);
        }
    }

    levelSync(newLevel){
        //re-init parameter stats
        this.cardInventory.levelSync(newLevel);
        this.parameter = new Parameter(this.cardInventory.maxHp, this.cardInventory.maxSp, this.cardInventory.atk, this.cardInventory.maxSp);
    }

    init(){
        
    }
}

class Skill {
    passive = null;
    constructor(){

    }
}

class Behavior {
    onDamage(){

    }
}

module.exports = {
    AvatarFormation, PrecureAvatar
};
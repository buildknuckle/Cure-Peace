const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Badge_User = require('../../../database/model/DBM_Badge_User');

const {Series} = require("./Series");
const {Character} = require("./Character");
const Properties = require('../Properties');

class Badge {
    static tablename = DBM_Badge_User.TABLENAME;
    static columns = DBM_Badge_User.columns;

    static UPDATE_KEY = [
        Badge.columns.id_user
    ];

    id_user= null;
    nickname= null;
    favorite_series= null;
    favorite_character= null;
    img_cover= null;
    color= null;
    about= null;
    created_at= null;

    Character;
    Series;

    constructor(userBadgeData = null){
        for(var key in userBadgeData){
            var colVal = userBadgeData[key];
            this[key] = userBadgeData[key];

            switch(key){
                case Badge.columns.favorite_series:
                    this.Series = new Series(colVal);
                    break;
                case Badge.columns.favorite_character:
                    this.Character = new Character(colVal);
                    break;
            }
        }
    }

    static async getUserData(userId){
        //check if card existed/not
        var query = `INSERT INTO ${this.tablename} 
        (${this.columns.id_user})
        SELECT ? FROM dual 
        WHERE NOT EXISTS (SELECT 1 FROM ${this.tablename} WHERE 
        ${this.columns.id_user} = ?);`;

        await DBConn.conn.query(query, [userId, userId]);
        
        //reselect user data
        var paramWhere = new Map();
        paramWhere.set(this.columns.id_user, userId);
        var badgeData = await DB.select(this.tablename, paramWhere);
        return badgeData[0];
    }

    setFavoriteSeries(newSeries){
        this.favorite_series = newSeries;
        this.Series = new Series(newSeries);
    }

    setFavoriteCharacter(newCharacter){
        this.favorite_character = newCharacter;
        this.Character = new Character(newCharacter);
    }

    async update(){
        let column = [//columns to be updated:
            Badge.columns.nickname,
            Badge.columns.favorite_series,
            Badge.columns.favorite_character,
            Badge.columns.color,
            Badge.columns.about,
            Badge.columns.img_cover,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in Badge.UPDATE_KEY){
            let updateKey = Badge.UPDATE_KEY[key];
            paramWhere.set(Badge.UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(Badge.tablename, paramSet, paramWhere);
    }

}

module.exports = {Badge};
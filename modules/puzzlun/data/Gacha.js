const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const GlobalFunctions = require('../../GlobalFunctions');

const DBM_User_Gacha = require('../../../database/model/DBM_User_Gacha');

const Properties = require('../Properties');
const Color = Properties.color;
const Currency = Properties.currency;

const UPDATE_KEY = [
    DBM_User_Gacha.columns.id_user,
];

class UserGacha {
    static tablename = DBM_User_Gacha.TABLENAME;
    static columns = DBM_User_Gacha.columns;

    id_user= null;
    last_daily_gacha_date= null;
    last_tropicalcatch_gacha_date= null;

    constructor(userGacha){
        for(var key in userGacha){
            this[key] = userGacha[key];
        }
    }

    static async getData(userId){
        var parameterWhere = new Map();
        parameterWhere.set(UserGacha.columns.id_user, userId);
        var userData = await DB.select(UserGacha.tablename,parameterWhere);
    
        if(userData[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(UserGacha.columns.id_user, userId);
            await DB.insert(UserGacha.tablename,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(UserGacha.columns.id_user, userId);
            userData = await DB.select(UserGacha.tablename,parameterWhere);
        }
        
        return userData[0];
    }

    setLastDailyGachaDate(){
        this.last_daily_gacha_date = GlobalFunctions.getCurrentDate();
    }

    //update tropicalcatch gacha date
    setLastTropicalCatchGachaDate(){
        this.last_tropicalcatch_gacha_date = GlobalFunctions.getCurrentDate();
    }

    async update(){
        let column = [//columns to be updated:
            UserGacha.columns.id_user,
            UserGacha.columns.last_daily_gacha_date,
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

        await DB.update(UserGacha.tablename, paramSet, paramWhere);
    }

    hasDailyGacha(){//check if already login/not
        return this.last_daily_gacha_date==GlobalFunctions.getCurrentDate() ? true:false;
    }

    hasTropicalCatchGacha(){
        return this.last_tropicalcatch_gacha_date==GlobalFunctions.getCurrentDate() ? true:false;
    }

}

module.exports = UserGacha;
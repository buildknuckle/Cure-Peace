const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_User_Data = require('../../../database/model/DBM_User_Data');

const Properties = require('../Properties');
const GColor = Properties.color;
const GCurrency = Properties.currency;
const {DataSeries, SPack} = require("./Series");
const GlobalFunctions = require('../../GlobalFunctions');
// const SPack = SeriesModule.SPack;

//database modifier
const PROTECTED_KEY = Object.keys(DBM_User_Data.columns);
const UPDATE_KEY = [
    DBM_User_Data.columns.id_user,
];

class Currency {
    static arrCurrency = [GCurrency.mofucoin.value, GCurrency.jewel.value];
    static limit = Object.freeze({
        mofucoin:3000,
        jewel:2000
    })

    mofucoin=0;
    jewel=0;

    constructor(currencyData){
        for(var key in currencyData){
            this[key] = currencyData[key];
        }
    }

    validation(){
        for(var key in Currency.arrCurrency){
            var currency = Currency.arrCurrency[key];

            //point
            if(this[currency]<0) this[series]= 0;
            if(this[currency]>Currency.limit[currency]) this[currency]= Currency.limit[currency];
        }
    }

    modifPoint(currency, point){
        this.jewel+=point;
        this.validation();
    }

    getData(){
        var currencyData = {};
        for(var key in Currency.arrCurrency){
            var currency = Currency.arrCurrency[key];
            currencyData[currency] = this[currency];
        }

        return JSON.stringify(currencyData);
    }
}

class Color {
    // static arrColor = [ 
    //     GColor.pink.value, GColor.blue.value, GColor.yellow.value, GColor.green.value,
    //     GColor.red.value, GColor.purple.value, GColor.white.value
    // ];
    static arrColor = Object.keys(GColor);

    static limit = Object.freeze({
        level:50,
        point:5000
    });

    pink = {level:1,point:0};
    blue = {level:1,point:0};
    yellow = {level:1,point:0};
    green = {level:1,point:0};
    red = {level:1,point:0};
    purple = {level:1,point:0};
    white = {level:1,point:0};
    
    constructor(colorData){
        for(var key in colorData){
            this[key] = colorData[key];
        }
    }

    getAverageLevel(){
        var total = 0;
        var arrColor = [ 
            this.pink.level, this.blue.level, this.yellow.level, this.green.level,
            this.red.level, this.purple.level, this.white.level
        ];
        for(var i = 0; i < arrColor.length; i++) 
            total += arrColor[i];
        
        return Math.ceil(total / arrColor.length);
    }
    
    /**
     * @param {string} color selected color in string
     */
    getLevel(color){
        return this[color].level;
    }

    /**
     * @param {string} color selected color in string
     */
    getPoint(color){
        return this[color].point;
    }

    getNextLevelPoint(color, totalLevelUp=1){
        return (this[color].level+totalLevelUp)*100;
    }

    getCardCaptureBonus(color){
        return this[color].level>=2 ? this[color].level*2:0;
    }

    /**
     * @param {string} color selected color in string
     */
    canLevelUp(color, totalLevelUp=1){
        if(this[color].level>=Color.limit.level) return false;//check for max color level
        return this[color].point>=this.getNextLevelPoint(color, totalLevelUp) ? 
            true:false;
    }

    validation(){
        for(var key in Color.arrColor){
            var color = Color.arrColor[key];
            //level
            if(this[color].level>Color.limit.level) this[color].level= Color.limit.level;

            //point
            if(this[color].point<0) this[color].point= 0;
            if(this[color].point>Color.limit.point) this[color].point= Color.limit.point;
        }
    }

    /**
     * @description get latest color data in stringified json
     */
    getData(){
        var colorData = {};
        for(var key in Color.arrColor){
            var color = Color.arrColor[key];
            colorData[color] = this[color];
        }
        return JSON.stringify(colorData);
    }

    modifPoint(color, point){
        this[color].point+=point;
        this.validation();
    }

    static getEmoji(color){
        return GColor[color].emoji;
    }

}

class Series {
    static arrSeries = [
        SPack.max_heart.properties.value,
        SPack.splash_star.properties.value,
        SPack.yes5gogo.properties.value,
        SPack.fresh.properties.value,
        SPack.heartcatch.properties.value,
        SPack.suite.properties.value,
        SPack.smile.properties.value,
        SPack.dokidoki.properties.value,
        SPack.happiness_charge.properties.value,
        SPack.go_princess.properties.value,
        SPack.mahou_tsukai.properties.value,
        SPack.kirakira.properties.value,
        SPack.hugtto.properties.value,
        SPack.star_twinkle.properties.value,
        SPack.healin_good.properties.value,
        SPack.tropical_rouge.properties.value,
    ];

    static limit = Object.freeze({
        point:2000
    })

    max_heart=0; 
    splash_star=0;
    yes5gogo=0;
    fresh=0;
    heartcatch=0;
    suite=0;
    smile=0;
    dokidoki=0;
    happiness_charge=0;
    go_princess=0;
    mahou_tsukai=0;
    kirakira=0;
    hugtto=0;
    star_twinkle=0;
    healin_good=0;
    tropical_rouge=0;

    constructor(seriesData){
        for(var key in seriesData){
            this[key] = seriesData[key];
        }
    }

    /**
     * @param {string} series Series in string
     */
    getPoint(series){
        return this[series];
    }

    validation(){
        for(var key in Series.arrSeries){
            var series = Series.arrSeries[key];

            //point
            if(this[series]<0) this[series]= 0;
            if(this[series]>Series.limit.point) this[series]= Series.limit.point;
        }
    }

    modifPoint(series, point){
        this[series]+=point;
        this.validation();
    }

    //get latest color data in stringified json
    getData(){
        var seriesData = {};
        for(var key in Series.arrSeries){
            var series = Series.arrSeries[key];
            seriesData[series] = this[series];
        }
        return JSON.stringify(seriesData);
    }
}

class User {
    //contains protected columns, used for constructor
    static tablename = DBM_User_Data.TABLENAME;
    static columns = DBM_User_Data.columns;

    static Series = Series;
    static Color = Color;
    static Currency = Currency;

    static peacePoint = {
        emoji:"<:peacepoint:936238606660554773>",
        name:"Peace Point"
    }

    static currency = {
        mofucoin:"mofucoin",
        jewel:"jewel"
    }

    static limit = Object.freeze({
        peacePoint:6,
    });

    id_user= null;
    last_checkIn_date= null;
    token_sale= null;
    peace_point= null;
    set_color= null;
    set_series= null;
    currency_data= null;
    color_data= null;
    series_data= null;

    Currency;
    Color;
    Series;

    constructor(userData){
        for(var key in userData){
            var val = userData[key];
            this[key] = val;
            switch(key){
                case User.columns.currency_data:
                    this.Currency = new Currency(JSON.parse(val));
                    break;
                case User.columns.color_data:
                    this.Color = new Color(JSON.parse(val));
                    break;
                case User.columns.series_data:
                    this.Series = new Series(JSON.parse(val));
                    break;
                default:
                    break;
            }
            
        }
    }

    static async getData(userId){
        var parameterWhere = new Map();
        parameterWhere.set(User.columns.id_user, userId);
        var userData = await DB.select(User.tablename,parameterWhere);
    
        if(userData[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(User.columns.id_user, userId);
            await DB.insert(User.tablename,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(User.columns.id_user, userId);
            userData = await DB.select(User.tablename,parameterWhere);
        }
        
        return userData[0];
    }

    getCurrency(currency){
        var currencyData = JSON.parse(this[DBM_User_Data.columns.currency_data]);
        if(currency==null){
            return currencyData;
        } else {
            return currencyData[currency];
        }
    }

    getColorLevel(color){
        return this.Color.getLevel(color);
    }

    getColorPoint(color){
        return this.Color.getPoint(color);
    }

    getLastCheckInDate(){
        return this.last_checkIn_date;
    }

    getSeriesPoint(series){
        return this.Series.getPoint(series);
    }

    getAverageColorLevel(){
        return this.Color.getAverageLevel();
    }

    hasLogin(){//check if already login/not
        return this.last_checkIn_date==GlobalFunctions.getCurrentDate() ? true:false;
    }

    // static getColorLevelBonus(level){
    //     return level>=2 ? level*3:0;
    // }

    static getUserLevelBonus(level){
        return level>=2? level*5:0;
    }

    isNewcomer(){
        return this.last_checkIn_date==null? true:false;
    }

    static async getUserTotalByLocation(series){
        var query = `SELECT count(*) as total  
        FROM ${this.tablename}
        WHERE ${this.columns.set_series}=?`;
        var userTotal = await DBConn.conn.query(query, [series]);
        return userTotal[0]["total"];
    }

    validationBasic(){
        if(this.peace_point<=0) this.peace_point= 0;//peace point validation
        if(this.peace_point>=User.limit.peacePoint) this.peace_point= User.limit.peacePoint;//peace point validation
    }

    validation(){
        this.validationBasic();
        this.Color.validation();
        this.Series.validation();
        this.Currency.validation();
    }

    //database:
    /**
     * @description update all data
     */
    async update(){
        this.validation();

        // this.currency_data = ;//update latest currency_data
        this.color_data = this.Color.getData();
        this.series_data = this.Series.getData();
        this.currency_data = this.Currency.getData();

        let column = [//columns to be updated:
            User.columns.last_checkIn_date,
            User.columns.token_sale,
            User.columns.peace_point,
            User.columns.set_color,
            User.columns.set_series,
            User.columns.currency_data,
            User.columns.color_data,
            User.columns.series_data,
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

        await DB.update(User.tablename, paramSet, paramWhere);
    }

}

module.exports = User;
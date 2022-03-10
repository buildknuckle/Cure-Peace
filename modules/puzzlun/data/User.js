const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_User_Data = require('../../../database/model/DBM_User_Data');

const Properties = require('../Properties');
const GColor = Properties.color;
const GCurrency = Properties.currency;
const {DataSeries, SPack} = require("./Series");
// const SPack = SeriesModule.SPack;

//database modifier
const PROTECTED_KEY = Object.keys(DBM_User_Data.columns);
const UPDATE_KEY = [
    DBM_User_Data.columns.id_user,
];

const limit = Object.freeze({
    colorLevel:30,
    colorPoint:3000,
    seriesPoint:2000,
    peacePoint:5
});

class User {
    //contains protected columns, used for constructor
    static tablename = DBM_User_Data.TABLENAME;
    static columns = DBM_User_Data.columns;

    id_user= null;
    server_id_login= null;
    token_sale= null;
    token_cardspawn= null;
    peace_point= null;
    set_color= null;
    set_series= null;
    currency_data= null;
    color_data= null;
    series_data= null;

    Currency;
    Color;
    Series;
    Daily;

    static peacePoint = {
        emoji:"<:peacepoint:936238606660554773>",
        name:"Peace Point"
    }

    static currency = {
        mofucoin:"mofucoin",
        jewel:"jewel"
    }

    static limit = limit;
    limit = limit;

    constructor(userData){
        for(var key in userData){
            var val = userData[key];
            this[key] = val;
            switch(key){
                case DBM_User_Data.columns.currency_data:
                    this.Currency = new Currency(JSON.parse(val));
                    break;
                case DBM_User_Data.columns.color_data:
                    this.Color = new Color(JSON.parse(val));
                    break;
                case DBM_User_Data.columns.daily_data:
                    this.Daily = new Daily(JSON.parse(val));
                    break;
                case DBM_User_Data.columns.series_data:
                    this.Series = new Series(JSON.parse(val));
                    break;
                default:
                    break;
            }
            
        }
    }

    static async getData(id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
        var userData = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
    
        if(userData[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(DBM_User_Data.columns.id_user,id_user);
            await DB.insert(DBM_User_Data.TABLENAME,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
            userData = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
        }
        
        return userData[0];
    }

    // async updateData(userStatusData, options){
    //     var arrParam = [];
    //     var querySet = ``;
    
    //     //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
        
    //     //process color point
    //     for (var keyOptions in options) {
    //         var valueOptions = options[keyOptions];
    //         switch(keyOptions){
    //             case DBM_User_Data.columns.color_data: //color point
    //                 var mapColorPoint = valueOptions;
    //                 var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
    //                 for (const [key, value] of mapColorPoint.entries()) {
    //                     if("level" in value){//add level
    //                         parsedColorPoint[key]["level"]+=value["level"];
    //                     }
    
    //                     if("point" in value){//update color point
    //                         var point = value["point"];
    //                         if(point>=0&&parsedColorPoint[key]["point"]+point<Properties.limit.colorPoint){
    //                             parsedColorPoint[key]["point"]+= point;
    //                         } else if(point<0){
    //                             parsedColorPoint[key]["point"]-=- point;
    //                         } else {
    //                             parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
    //                         }
                            
    //                         if(point<0&&parsedColorPoint[key]["point"]-point<=0) parsedColorPoint[key]["point"]=0; //prevent negative
    //                     }
    //                 }
                
    //                 arrParam.push(JSON.stringify(parsedColorPoint));
    //                 querySet+=` ${DBM_User_Data.columns.color_data} = ?, `;
    //                 break;
    //             case DBM_User_Data.columns.series_data: //series point
    //                 var mapSeriesPoint = valueOptions;
    //                 var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
    //                 for (const [key, value] of mapSeriesPoint.entries()) {
    //                     if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
    //                         parsedSeriesPoint[key]+= value;
    //                     } else if(value<0){
    //                         parsedSeriesPoint[key]-=- value;
    //                     } else {
    //                         parsedSeriesPoint[key]= Properties.limit.seriesPoint;
    //                     }
                        
    //                     if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
    //                 }
                
    //                 arrParam.push(JSON.stringify(parsedSeriesPoint));
    //                 querySet+=` ${DBM_User_Data.columns.series_data} = ?, `;
    //                 break;
    //             case DBM_User_Data.columns.currency_data: //currency data
    //                 var mapCurrency = valueOptions;
    //                 var parsedCurrency = JSON.parse(userStatusData[DBM_User_Data.columns.currency_data]);
                    
    //                 for (const [key, value] of mapCurrency.entries()) {
    //                     if(value>=0&&parsedCurrency[key]+value<Properties.limit[key]){
    //                         parsedCurrency[key]+= value;
    //                     } else if(value<0){
    //                         parsedCurrency[key]-=- value;
    //                     } else {
    //                         parsedCurrency[key]= Properties.limit[key];
    //                     }
                        
    //                     if(value<0&&parsedCurrency[key]-value<=0) parsedCurrency[key]=0; //prevent negative
    //                 }
    
    //                 querySet+=` ${DBM_User_Data.columns.currency_data} = ?, `;
    //                 arrParam.push(JSON.stringify(parsedCurrency));
    //                 break;
    //             case DBM_User_Data.columns.peace_point://peace point
    //                 var curPointBoost = userStatusData[DBM_User_Data.columns.peace_point];
    //                 if(valueOptions>=0&&curPointBoost+valueOptions<Properties.limit.peacePoint){
    //                     curPointBoost+= valueOptions;
    //                 } else if(valueOptions<0){
    //                     curPointBoost-=- valueOptions;
    //                 } else {
    //                     curPointBoost= Properties.limit[key];
    //                 }
    
    //                 querySet+=` ${DBM_User_Data.columns.peace_point} = ?, `;
    //                 arrParam.push(curPointBoost);
    //                 break;
    //             case DBM_User_Data.columns.daily_data://daily data
    //             case DBM_User_Data.columns.token_cardspawn://card spawn token
    //             case DBM_User_Data.columns.server_id_login:
    //             case DBM_User_Data.columns.avatar_main_data:
    //             case DBM_User_Data.columns.avatar_support_data://support avatar
    //             default:
    //                 querySet+=` ${keyOptions} = ?, `;
    //                 arrParam.push(valueOptions);
    //                 break;
            
    //         }
    //     }
    
    //     querySet = querySet.replace(/,\s*$/, "");//remove last comma and space
    
    //     arrParam.push(this[DBM_User_Data.columns.id_user]);//push user id to arrParam
    //     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    //     SET ${querySet} 
    //     WHERE ${DBM_User_Data.columns.id_user} = ?`;
    
    //     await DBConn.conn.query(query, arrParam);
    // }

    getCurrency(currency){
        var currencyData = JSON.parse(this[DBM_User_Data.columns.currency_data]);
        if(currency==null){
            return currencyData;
        } else {
            return currencyData[currency];
        }
    }

    getPeacePoint(){
        return this[DBM_User_Data.columns.peace_point];
    }

    getSetColor(){
        return this[DBM_User_Data.columns.set_color];
    }

    getColorLevel(color){
        return this.Color.getLevel(color);
    }

    getColorPoint(color){
        return this.Color.getPoint(color);
    }

    getSetSeries(){
        return this[DBM_User_Data.columns.set_series];
    }

    // getSetSeriesName(){
    //     return SpackModule[this.getSetSeries()].Properties.name;
    // }
    
    // getSeriesLocationName(){
    //     var series = this.getSetSeries();
    //     return SpackModule[series].Properties.location.name;
    // }

    // getSeriesData(){
    //     return this[DBM_User_Data.columns.series_data];
    // }

    getSeriesPoint(series){
        return this.Series.getPoint(series);
    }

    getAverageColorLevel(){
        return this.Color.getAverageLevel();
    }

    getDailyData(){
        return JSON.parse(this[DBM_User_Data.columns.daily_data]);
    }

    getLastCheckInDate(){
        return this.Daily.getLastCheckInDate();
    }

    getLastQuestDate(){
        return this.Daily.getLastCheckInDate();
    }

    getCardQuest(){
        return this.Daily.getCardQuest();
    }

    hasLogin(){//check if already login/not
        return this.getLastCheckInDate()==new Date().setHours(24, 0, 0, 0) ? true:false;
    }

    static getColorLevelBonus(level){
        return level>=2 ? level*5:0;
    }

    static getUserLevelBonus(level){
        return level>=2? level*5:0;
    }

    validationBasic(){
        if(this.peace_point<=0) this.peace_point =0;//peace point validation
    }

    //database:
    /**
     * @description update all data
     */
    async update(){
        this.validationBasic();
        this.Color.validation();

        // this.currency_data = ;//update latest currency_data
        this.color_data = this.Color.getData();
        this.series_data = this.Series.getData();

        let column = [//columns to be updated:
            DBM_User_Data.columns.server_id_login,
            DBM_User_Data.columns.token_sale,
            DBM_User_Data.columns.token_cardspawn,
            DBM_User_Data.columns.peace_point,
            DBM_User_Data.columns.set_color,
            DBM_User_Data.columns.set_series,
            DBM_User_Data.columns.currency_data,
            DBM_User_Data.columns.color_data,
            DBM_User_Data.columns.series_data,
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

        await DB.update(DBM_User_Data.TABLENAME, paramSet, paramWhere);
    }

}

class Daily {
    lastCheckInDate = "";
    lastQuestDate = "";
    quest = {
        card:{},
        kirakiraDelivery:[],
        battle:{}
    }

    constructor(dailyData){
        for(var key in dailyData){
            this[key] = dailyData[key];
        }
    }

    getLastCheckInDate(){
        return this.lastCheckInDate;
    }

    getLastQuestDate(){
        return this.lastQuestDate;
    }

    getCardQuest(){
        return this.quest.card;
    }

    getCardQuestTotal(){
        return this.quest.card.length;
    }
    
}

class Currency {
    static arrCurrency = [GCurrency.mofucoin.value, GCurrency.jewel.value];
    mofucoin=0;
    jewel=0;

    limit = {
        mofucoin:3000,
        jewel:1000
    }

    constructor(currencyData){
        for(var key in currencyData){
            this[key] = currencyData[key];
        }
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
    static arrColor = [ 
        GColor.pink.value, GColor.blue.value, GColor.yellow.value, GColor.green.value,
        GColor.red.value, GColor.purple.value, GColor.white.value
    ];

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

    /**
     * @param {string} color selected color in string
     */
    canLevelUp(color, totalLevelUp=1){
        return this[color].point>(this[color].level+totalLevelUp)*100 ? 
            true:false;
    }

    validation(){
        for(var key in Color.arrColor){
            var color = Color.arrColor[key];
            //level
            if(this[color].level>limit.colorLevel) this[color].level= limit.colorLevel;

            //point
            if(this[color].point<0) this[color].point= 0;
            if(this[color].point>limit.colorPoint) this[color].point= limit.colorPoint;
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
            if(this[series]>limit.seriesPoint) this[series]= limit.seriesPoint;
        }
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

module.exports = User;
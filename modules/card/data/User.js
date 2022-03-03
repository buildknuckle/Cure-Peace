const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_User_Data = require('../../../database/model/DBM_User_Data');

const SpackModule = require("../Series");

class User {
    data = {};

    static peacePoint = {
        emoji:"<:peacepoint:936238606660554773>",
        name:"Peace Point"
    }

    static currency = {
        mofucoin:"mofucoin",
        jewel:"jewel"
    }

    limit = Object.freeze({
        colorPoint:3000,
        seriesPoint:2000,
        peacePoint:5,
        card:99,
        currency:{
            mofucoin:3000,
            jewel:1000
        }
    });

    constructor(userData){
        for(var key in userData){
            this.data[key] = userData[key];
        }
    }

    static async getData(id_user, guildId = null){
        //{"mofucoin":0}
    
        //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
    
        //{"max_heart":0,"splash_star":0,"yes5gogo":0,"fresh":0,"heartcatch":0,"suite":0,"smile":0,"dokidoki":0,"happiness_charge":0,"go_princess":0,"mahou_tsukai":0,"kirakira":0,"hugtto":0,"star_twinkle":0,"healin_good":0,"tropical_rouge":0}
    
        //if guildId provided it'll check whether user has login to server/not
        var parameterWhere = new Map();
        parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
    
        if(resultCheckExist[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(DBM_User_Data.columns.id_user,id_user);
            await DB.insert(DBM_User_Data.TABLENAME,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
            resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
        }
    
        resultCheckExist = resultCheckExist[0];
    
        if(guildId == null||guildId !== null && resultCheckExist[DBM_User_Data.columns.server_id_login]==guildId){
            return await resultCheckExist;
        } else {
            return null;
        }
    }

    getCurrency(currency){
        var currencyData = JSON.parse(this.data[DBM_User_Data.columns.currency_data]);
        if(currency==null){
            return currencyData;
        } else {
            return currencyData[currency];
        }
    }

    getPeacePoint(){
        return this.data[DBM_User_Data.columns.peace_point];
    }

    getSetColor(){
        return this.data[DBM_User_Data.columns.set_color];
    }

    getColorData(){
        return JSON.parse(this.data[DBM_User_Data.columns.color_data]);
    }

    getColorLevel(color){
        var colorData = this.getColorData();
        return colorData[color.value].level;
    }

    getColorPoint(color){
        var colorData = this.getColorData();
        return colorData[color.value].point;
    }

    getSetSeries(){
        return this.data[DBM_User_Data.columns.set_series];
    }

    getSetSeriesName(){
        return SpackModule[this.getSetSeries()].Properties.name;
    }
    
    getSeriesLocationName(){
        var series = this.getSetSeries();
        return SpackModule[series].Properties.location.name;
    }

    getSeriesData(){
        return JSON.parse(this.data[DBM_User_Data.columns.series_data]);
    }

    getSeriesPoint(series){
        var seriesData = this.getSeriesData();
        return seriesData[series.Properties.value];
    }

    getAverageColorLevel(){
        //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
        // if(color_data!=null){
        //     //if arrColorLevel provided we dont need to read it from db
        //     var userData = await getStatusData(id_user);
        //     var parsedColor = JSON.parse(userData[DBM_User_Data.columns.color_data]);
        //     color_data = [
        //             parsedColor.pink.level, parsedColor.blue.level,
        //             parsedColor.yellow.level, parsedColor.green.level,
        //             parsedColor.red.level, parsedColor.purple.level,
        //             parsedColor.white.level
        //     ];
        // } else {
            
        // }

        var colorData = this.getColorData();
        colorData = [ 
            colorData.pink.level, colorData.blue.level, colorData.yellow.level, colorData.green.level,
            colorData.red.level, colorData.purple.level, colorData.white.level
        ];
    
        var total = 0;
        for(var i = 0; i < colorData.length; i++) 
            total += colorData[i];
        
        return Math.ceil(total / colorData.length);
    }

    getDailyData(){
        return JSON.parse(this.data[DBM_User_Data.columns.daily_data]);
    }

    getLastCheckInDate(){
        var dailyData = this.getDailyData();
        return dailyData[DBM_User_Data.dataKey.daily_data.lastCheckInDate];
    }

    getLastQuestDate(){
        var dailyData = this.getDailyData();
        return dailyData[DBM_User_Data.dataKey.daily_data.lastQuestDate];
    }

    getQuestCard(){
        var dailyData = this.getDailyData();
        return dailyData[DBM_User_Data.dataKey.daily_data.quest.card];
    }

    hasLogin(){
        return this.getLastCheckInDate()==new Date().setHours(24, 0, 0, 0) ? true:false;
    }

}

module.exports = User;
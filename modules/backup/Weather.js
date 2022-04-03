const GlobalFunctions = require('../GlobalFunctions.js');
const DB = require('../../database/DatabaseCore');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

/*
for guild timer duration. Object structure: {timer:.....,remaining:......}. 
Timer is the timer object, remaining: remaining of time left
*/
var timerWeatherInformation = {};

class Properties {
    static interval = 60;//in minutes
    static weatherData = {
        sunny:{
            value:"sunny",
            name:"Sunny",
            icon:"☀️"
        },
        sunny_with_cloudy:{
            value:"sunny_with_cloudy",
            name:"Sunny With Cloudy",
            icon:"⛅"
        },
        cloudy:{
            value:"cloudy",
            name:"Cloudy",
            icon:"☁️"
        },
        sunshower:{
            value:"sunshower",
            name:"Sunshower",
            icon:"🌦️"
        },
        raining:{
            value:"raining",
            name:"Raining",
            icon:"🌧️"
        },
        thunder_storm:{
            value:"thunder_storm",
            name:"Thunder Storm",
            icon:"⛈️"
        }
    }

    static currentWeather = GlobalFunctions.randomProperty(this.weatherData);
}

function updateTimerRemaining(){
    var duration = parseInt(Properties.interval*60);//convert to seconds

    if(timerWeatherInformation!=null){
        //remove the old timer if existed
        if(timerWeatherInformation.timer!=null){
            timerWeatherInformation.remaining = duration;
        }
    } else {
        //init the object of guild if not existed yet:
        timerWeatherInformation = {
            timer:null,remaining:duration
        }
    }

    //timer for countdown
    setInterval(function(){
        if(timerWeatherInformation.remaining>0){
            timerWeatherInformation.remaining-=1;
        } else {
            timerWeatherInformation.remaining = duration;
        }
    },1000);

    //randomize the weather with timer
    timerWeatherInformation.timer = setInterval(function intervalCardSpawn(){
        Properties.currentWeather = GlobalFunctions.randomProperty(Properties.weatherData);
        timerWeatherInformation.remaining = parseInt(Properties.interval*60);//convert to seconds
    }, parseInt(Properties.interval)*60*1000);
}

module.exports = {timerWeatherInformation,Properties,updateTimerRemaining}
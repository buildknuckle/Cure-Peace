const GlobalFunctions = require("../GlobalFunctions");
const SPack = {
    max_heart: require("./spack/Max_Heart"),
    splash_star: require("./spack/Splash_Star"),
    yes5gogo: require("./spack/Yes5GoGo"),
    fresh: require("./spack/Fresh"),
    heartcatch: require("./spack/Heartcatch"),
    suite: require("./spack/Suite"),
    smile: require("./spack/Smile"),
    dokidoki: require("./spack/DokiDoki"),
    happiness_charge: require("./spack/Happiness_Charge"),
    go_princess: require("./spack/Go_Princess"),
    mahou_tsukai: require("./spack/Mahou_Tsukai"),
    kirakira: require("./spack/KiraKira"),
    hugtto: require("./spack/Hugtto"),
    star_twinkle: require("./spack/Star_Twinkle"),
    healin_good: require("./spack/Healin_Good"),
    tropical_rouge: require("./spack/Tropical_Rouge"),
}

// class SPack {
// //     // spack = {
// //     //     max_heart: require("./spack/Max_Heart"),
// //     //     splash_star: require("./spack/Splash_Star"),
// //     //     yes5gogo: require("./spack/Yes5GoGo"),
// //     //     fresh: require("./spack/Fresh"),
// //     //     heartcatch: require("./spack/Heartcatch"),
// //     //     suite: require("./spack/Suite"),
// //     //     smile: require("./spack/Smile"),
// //     //     dokidoki: require("./spack/DokiDoki"),
// //     //     happiness_charge: require("./spack/Happiness_Charge"),
// //     //     go_princess: require("./spack/Go_Princess"),
// //     //     mahou_tsukai: require("./spack/Mahou_Tsukai"),
// //     //     kirakira: require("./spack/KiraKira"),
// //     //     hugtto: require("./spack/Hugtto"),
// //     //     star_twinkle: require("./spack/Star_Twinkle"),
// //     //     healin_good: require("./spack/Healin_Good"),
// //     //     tropical_rouge: require("./spack/Tropical_Rouge"),
// //     // }

//     max_heart = require("./spack/Max_Heart");
//     splash_star = require("./spack/Splash_Star");
//     yes5gogo = require("./spack/Yes5GoGo");
//     fresh = require("./spack/Fresh");
//     heartcatch = require("./spack/Heartcatch");
//     suite = require("./spack/Suite");
//     smile = require("./spack/Smile");
//     dokidoki = require("./spack/DokiDoki");
//     happiness_charge = require("./spack/Happiness_Charge");
//     go_princess = require("./spack/Go_Princess");
//     mahou_tsukai = require("./spack/Mahou_Tsukai");
//     kirakira = require("./spack/KiraKira");
//     hugtto = require("./spack/Hugtto");
//     star_twinkle = require("./spack/Star_Twinkle");
//     healin_good = require("./spack/Healin_Good");
//     tropical_rouge = require("./spack/Tropical_Rouge");

// //     // Properties = Properties;
// //     constructor(){
// //         // this.Properties = new this.spack.max_heart();
// //         // this.Properties = new series();
// //     }

// //     static getValue(){
// // 	return this.value;
// // }

// // static getName(){
// // 	return this.name;
// // }

// // static getCurrencyName(){
// // 	return this.currency.name;
// // }

// // static getCurrencyEmoji(){
// // 	return this.currency.icon_emoji;
// // }

// // static getIconSeries(){
// // 	return this.icon.series;
// // }

// // static getMascotEmoji(){
// // 	return this.icon.mascot_emoji;
// // }

// // static getCurrencyName(){
// // 	return this.currency.name;
// // }

// // static getLocationName(){
// // 	return this.location.name;
// // }
// // }

// // class Properties {
// //     static value = "dokidoki";
// //     static icon = {
// //         series:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
// //         mascot_emoji:"<:m8_davi:936237025609261106>"
// //     }
// //     static name = "Doki Doki";
// //     static currency = {
// //         name:"Lovead Points",
// //         icon_emoji:"<:m8_davi:936237025609261106>"
// //     };
// //     static theme = "emotions and selflessness";
// //     static location = {
// //         name:"Oogai Town",
// //         icon:"https://static.wikia.nocookie.net/prettycure/images/4/4a/Clover_Tower_.jpg",
// //     };
// }

class Series {
    Properties;

    constructor(series){
        this.Properties = new Properties(series.Properties);
    }
}

class Properties {
    value;
    name;
    currency={
        name:null,
        icon_emoji:null
    }
    icon={
        series:null,
        mascot_emoji:null
    }
    theme;
    location={
        name:null,
        icon:null
    };

    constructor(properties){
        for(var key in properties){
            this[key] = properties[key];
        }
    }

    getValue(){
        return this.value;
    }
    
    getName(){
        return this.name;
    }
    
    getCurrencyName(){
        return this.currency.name;
    }
    
    getCurrencyEmoji(){
        return this.currency.icon_emoji;
    }
    
    getIconSeries(){
        return this.icon.series;
    }
    
    getMascotEmoji(){
        return this.icon.mascot_emoji;
    }
    
    getCurrencyName(){
        return this.currency.name;
    }
    
    getLocationName(){
        return this.location.name;
    }

    getLocationIcon(){
        return this.location.icon;
    }

}

module.exports = {
    //series pack loader
    Series,
    SPack,
    // Properties,
    // spack
    // max_heart: require("./spack/Max_Heart"),
    // splash_star: require("./spack/Splash_Star"),
    // yes5gogo: require("./spack/Yes5GoGo"),
    // fresh: require("./spack/Fresh"),
    // heartcatch: require("./spack/Heartcatch"),
    // suite: require("./spack/Suite"),
    // smile: require("./spack/Smile"),
    // dokidoki: require("./spack/DokiDoki"),
    // happiness_charge: require("./spack/Happiness_Charge"),
    // go_princess: require("./spack/Go_Princess"),
    // mahou_tsukai: require("./spack/Mahou_Tsukai"),
    // kirakira: require("./spack/KiraKira"),
    // hugtto: require("./spack/Hugtto"),
    // star_twinkle: require("./spack/Star_Twinkle"),
    // healin_good: require("./spack/Healin_Good"),
    // tropical_rouge: require("./spack/Tropical_Rouge"),
}
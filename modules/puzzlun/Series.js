// const GlobalFunctions = require("../GlobalFunctions");
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

class Series {
    value = null;
	name = null;
    icon = null;
    emoji = {
        mascot: null
    };
    currency = {
        name:null,
        emoji:null
    };
    theme = null;
    location = {
        name:null,
        icon:null
    };
    
    // Monsters;

    /**
     * @param {string} series The series value in string
     */
    constructor(series){
        var spack = spack[series];//selected SPack
        for(var key in spack.Properties){
            this[key] = spack.Properties[key];
        }
        // this.Monsters = new Monsters(spack.Monsters);
    }
    
    getCurrencyName(){
        return this.currency.name;
    }
    
    getCurrencyEmoji(){
        return this.currency.icon_emoji;
    }
    
    getIcon(){
        return this.icon;
    }
    
    getMascotEmoji(){
        return this.emoji.mascot;
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

// class Teams {
//     icon = null;
//     special = {
//         name:null,
//         icon:null,
//     }
// }

// class Monsters {
//     value = null;
//     name = null;
//     catchphrase = null;
//     chaos_meter = null;
// 	data = null;//will be loaded from init

//     constructor(properties){
//         for(var key in properties){
//             this[key] = properties[key];
//         }
//     }
// }

module.exports = {
    //series pack loader
    Series,
    SPack
}
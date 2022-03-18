// const GlobalFunctions = require("../GlobalFunctions");
const SPack = {
    max_heart: require("../spack/Max_Heart"),
    splash_star: require("../spack/Splash_Star"),
    yes5gogo: require("../spack/Yes5GoGo"),
    fresh: require("../spack/Fresh"),
    heartcatch: require("../spack/Heartcatch"),
    suite: require("../spack/Suite"),
    smile: require("../spack/Smile"),
    dokidoki: require("../spack/DokiDoki"),
    happiness_charge: require("../spack/Happiness_Charge"),
    go_princess: require("../spack/Go_Princess"),
    mahou_tsukai: require("../spack/Mahou_Tsukai"),
    kirakira: require("../spack/KiraKira"),
    hugtto: require("../spack/Hugtto"),
    star_twinkle: require("../spack/Star_Twinkle"),
    healin_good: require("../spack/Healin_Good"),
    tropical_rouge: require("../spack/Tropical_Rouge"),
}

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
        var spack = SPack[series];//selected SPack
        for(var key in spack.properties){
            this[key] = spack.properties[key];
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

    static isAvailable(series){
        return series in SPack ? true:false;
    }

    // static getName(series){
    //     return this.isAvailable(series)?
    //         SPack[series].properties.name:null;
    // }

    // static getLocationName(series){
    //     return this.isAvailable(series)?
    //     SPack[series].properties.location.name:null;
    // }
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
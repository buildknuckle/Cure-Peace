const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    icon:"https://waa.ai/JEwy.png",
    color:"purple",
    fullname:"Yukari Kotozume",
    alter_ego:"Cure Macaron",
    hint_spawn:"With Beauty and Excitement! Let's La Mix It All Up! <x>! Is Ready To Serve!",
    total:0,
    series:"kirakira",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwy.png",
        name:"Cure Macaron",
        transform_quotes1:"Cure La Mode, Decoration!",
        transform_quotes2:"With Beauty and Excitement! Let's La Mix It All Up! Cure Macaron! Is Ready To Serve!",
        special_attack:"Macaron Julienne",
        img_special_attack:"https://cdn.discordapp.com/attachments/793392786367316038/817793379797696512/unknown.png",
        img_transformation:"",
        skill:{
            passive:{
                turn_recover_hp: function(level){
                    var hp_max = initedData.hp_max;
                    var rng = GlobalFunctions.randomNumber(1,100);
                    
                    if(level<=9 && rng<=1){
                        return GlobalFunctions.calculatePercentage(hp_max, 10);
                    } else if(level<=19 && rng<=2){
                        return GlobalFunctions.calculatePercentage(hp_max, 15);
                    } else if(level<=29 && rng<=3){
                        return GlobalFunctions.calculatePercentage(hp_max, 20);
                    } else if(level<=39 && rng<=4){
                        return GlobalFunctions.calculatePercentage(hp_max, 25);
                    } else if(level<=49 && rng<=5){
                        return GlobalFunctions.calculatePercentage(hp_max, 28);
                    } else if(rng<=5) {
                        return GlobalFunctions.calculatePercentage(hp_max, 20);
                    } else {
                        return 0;
                    }
                }
            }
        }
        
    }
}

module.exports = {
    properties, Avatar
}
const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    icon:"https://waa.ai/JEw0.png",
    color:"yellow",
    fullname:"Kirara Amanogawa",
    alter_ego:"Cure Twinkle",
    hint_spawn:"Princess of the twinkling stars! <x>!",
    total:0,
    series:"go_princess",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEw0.png",
        name:"Cure Twinkle",
        transform_quotes1:"Pretty Cure, Princess Engage!",
        transform_quotes2:"Princess of the twinkling stars! Cure Twinkle!",
        special_attack:"Twinkle Humming",
        img_special_attack:"https://cdn.discordapp.com/attachments/793389968457859093/817786728202502204/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793389968457859093/822056102803800064/image0.gif",
        skill:{
            passive:{
                turn_recover_hp: function(level){
                    var hp_max = initedData.hp_max;
                    var rng = GlobalFunctions.randomNumber(1,100);
                    
                    if(level<=9 && rng<=1){
                        return GlobalFunctions.calculatePercentage(hp_max, 15);
                    } else if(level<=19 && rng<=1){
                        return GlobalFunctions.calculatePercentage(hp_max, 20);
                    } else if(level<=29 && rng<=2){
                        return GlobalFunctions.calculatePercentage(hp_max, 25);
                    } else if(level<=39 && rng<=3){
                        return GlobalFunctions.calculatePercentage(hp_max, 27);
                    } else if(level<=49 && rng<=4){
                        return GlobalFunctions.calculatePercentage(hp_max, 29);
                    } else if(rng<=5) {
                        return GlobalFunctions.calculatePercentage(hp_max, 30);
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
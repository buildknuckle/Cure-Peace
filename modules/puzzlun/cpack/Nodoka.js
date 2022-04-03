const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    name:"nodoka",
    icon:"https://waa.ai/JEVL.png",
    color:"pink",
    fullname:"Nodoka Hanadera",
    alter_ego:"Cure Grace",
    hint_spawn:"The two overlapping flowers! <x>!",
    total:0,
    series:"healin_good",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVL.png",
        name : "Cure Grace",
        transform_quotes1 : "Start! Pretty Cure Operation!",
        transform_quotes2 : "The two overlapping flowers! Cure Grace!",
        special_attack : "Healing Flower",
        img_special_attack : "https://cdn.discordapp.com/attachments/793396698117701632/825099297687076904/image0.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793396698117701632/822036258628435968/image0.gif",
        skill:{
            passive:{
                turn_recover_hp: function(level){
                    var hp_max = initedData.hp_max;
                    var rng = GlobalFunctions.randomNumber(1,100);

                    if(level<=9 && rng<=5){
                        return GlobalFunctions.calculatePercentage(hp_max, 5);
                    } else if(level<=19 && rng<=6){
                        return GlobalFunctions.calculatePercentage(hp_max, 10);
                    } else if(level<=29 && rng<=7){
                        return GlobalFunctions.calculatePercentage(hp_max, 12);
                    } else if(level<=39 && rng<=8){
                        return GlobalFunctions.calculatePercentage(hp_max, 15);
                    } else if(level<=49 && rng<=9){
                        return GlobalFunctions.calculatePercentage(hp_max, 15);
                    } else if(rng<=10) {
                        return GlobalFunctions.calculatePercentage(hp_max, 15);
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
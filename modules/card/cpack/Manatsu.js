const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
const GlobalFunctions = require('../../GlobalFunctions');

class Properties {
    static icon = "https://waa.ai/f4sL.png";
    static color = "pink";
    static fullname = "Manatsu Natsuumi";
    static alter_ego = "Cure Summer";
    static hint_chiguhaguu = "Joyful Everlasting Summer! <x>!";
    static total = 0;
    static series = "tropical_rouge";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/f4sL.png",
        name : "Cure Summer",
        transform_quotes1 : "Pretty Cure, Tropical Change!",
        transform_quotes2 : "Joyful Everlasting Summer! Cure Summer!",
        special_attack : "Otento Summer Strike",
        img_special_attack : "https://cdn.discordapp.com/attachments/832840763087519752/927473594517299200/1000.png",
        img_transformation : "https://cdn.discordapp.com/attachments/832840763087519752/927468608077066250/ASW_Tropical-Rouge_Precure_-_38_1080p_HEVC1A68E332.mkv_snapshot_18.02.374.jpg",
        skill:{
            passive:{
                turn_recover_hp: function(level){
                        var hp_max = initedData.hp_max;
                        var rng = GlobalFunctions.randomNumber(1,100);

                        if(level<=9 && rng<=6){
                            return GlobalFunctions.calculatePercentage(hp_max, 5);
                        } else if(level<=19 && rng<=6){
                            return GlobalFunctions.calculatePercentage(hp_max, 10);
                        } else if(level<=29 && rng<=7){
                            return GlobalFunctions.calculatePercentage(hp_max, 12);
                        } else if(level<=39 && rng<=7){
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
    Properties, Avatar
}
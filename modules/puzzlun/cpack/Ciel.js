const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    name:"ciel",
    icon:"https://waa.ai/JEwM.png",
    color:"green",
    fullname:"Ciel Kirahoshi",
    alter_ego:"Cure Parfait",
    hint_spawn:"With Dreams and Hope! Let's La Mix It All Up! <x>! Is Ready To Serve",
    total:0,
    series:"kirakira",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwM.png",
        name:"Cure Parfait",
        transform_quotes1:"Cure La Mode・Decoration!",
        transform_quotes2:"With Dreams and Hope! Let's La Mix It All Up! Cure Parfait! Is Ready To Serve",
        special_attack:"Parfait Étoile",
        img_special_attack:"https://cdn.discordapp.com/attachments/793393296957243403/817793570161295390/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793393296957243403/822041883827896341/image0.gif",
        skill:{
            passive:{
                turn_recover_sp: function(initedData, processEffect=false){
                    //process effect: boolean = 
                    var level = initedData.avatarData[DBM_Card_Inventory.columns.level];
                    var rng = GlobalFunctions.randomNumber(1,100);

                    // 5% chance of SP+1/turn
                    // 8% chance of SP+1/turn
                    // 13% chance of SP+1/turn
                    // 14% chance of SP+1/turn
                    // 15% chance of SP+1/turn
                    // 15% chance of SP+1/turn

                    if(level<=9){
                        if(!processEffect){//get label
                            return 
                        } else if(processEffect&&rng<=5){
                            return 1;
                        } else {
                            return 0;
                        }
                        
                    } else if(level<=19 && rng<=8){
                        return 1;
                    } else if(level<=29 && rng<=13){
                        return 1;
                    } else if(level<=39 && rng<=14){
                        return 1;
                    } else if(level<=49 && rng<=15){
                        return 1;
                    } else if(rng<=15) {
                        return 1;
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
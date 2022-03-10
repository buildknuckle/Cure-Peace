const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    name:"ellen",
    icon:"https://waa.ai/JEw4.png",
    color:"blue",
    fullname:"Ellen Kurokawa",
    alter_ego:"Cure Beat",
    hint_spawn:"Strumming the soul's tune, <x>!",
    total:0,
    series:"suite",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEw4.png",
        name : "Cure Beat",
        transform_quotes1 : "Let's Play! Pretty Cure Modulation!",
        transform_quotes2 : "Strumming the soul's tune, Cure Beat!",
        special_attack : "Heartful Beat Rock",
        img_special_attack :"https://cdn.discordapp.com/attachments/793384071107575838/817783058949603368/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793384071107575838/822049486553350154/image0.gif",
        skill:{
            passive:{
                turn_recover_sp: function(initedData){
                    var level = initedData.avatarData[DBM_Card_Inventory.columns.level];
                    var rng = GlobalFunctions.randomNumber(1,100);
                    if(level<=9 && rng<=10){
                        return 1;
                    } else if(level<=19 && rng<=11){
                        return 1;
                    } else if(level<=29 && rng<=12){
                        return 1;
                    } else if(level<=39 && rng<=13){
                        return 1;
                    } else if(level<=49 && rng<=14){
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
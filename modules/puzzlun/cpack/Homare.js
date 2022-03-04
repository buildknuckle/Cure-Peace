const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    icon:"https://waa.ai/JEwS.png",
    color:"yellow",
    fullname:"Homare Kagayaki",
    alter_ego:"Cure Etoile",
    hint_spawn:"Making everyone shine! The Pretty Cure of Strength! <x>!",
    total:0,
    series:"hugtto",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwS.png",
        name:"Cure Etoile",
        transform_quotes1:"Heart Kiratto!",
        transform_quotes2:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile!",
        special_attack:"Heart Star",
        img_special_attack:"https://cdn.discordapp.com/attachments/793394718305419265/817794207732727858/unknown.png",
        img_transformation:"",
        skill:{
            passive:{
                turn_recover_sp: function(level){
                    var rng = GlobalFunctions.randomNumber(1,100);
                    
                    if(level<=9 && rng<=5){
                        return 1;
                    } else if(level<=19 && rng<=10){
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
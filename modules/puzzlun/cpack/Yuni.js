const GlobalFunctions = require('../../GlobalFunctions');

var properties ={
    name:"yuni",
    icon:"https://waa.ai/JEwT.png",
    color:"blue",
    fullname:"Yuni",
    alter_ego:"Cure Cosmo",
    hint_spawn:"The rainbow spectrum lighting up the galaxy! <x>!",
    total:0,
    series:"star_twinkle",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwT.png",
        name:"Cure Cosmo",
        transform_quotes1:"Color Charge!",
        transform_quotes2:"The rainbow spectrum lighting up the galaxy! Cure Cosmo!",
        special_attack:"Cosmo Shining",
        img_special_attack:"https://cdn.discordapp.com/attachments/793396381406199809/817795242929422406/unknown.png",
        img_transformation:"https://waa.ai/JEwT.png",
        skill:{
            passive:{
                turn_recover_sp: function(level){
                    var rng = GlobalFunctions.randomNumber(1,100);
                    
                    if(level<=9 && rng<=8){
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
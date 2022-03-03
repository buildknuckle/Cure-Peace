const DBM_Card_Inventory = require('../../../database/model/DBM_Card_Inventory');
const GlobalFunctions = require('../../GlobalFunctions');

class Properties {
    static icon = "https://waa.ai/JEw9.png";
    static color = "yellow";
    static fullname = "Himari Arisugawa";
    static alter_ego = "Cure Custard";
    static hint_chiguhaguu = "With Intelligence and Courage! Let's La Mix It All Up! <x>! Ready To Serve!";
    static total = 0;
    static series = "kirakira";
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEw9.png",
        name:"Cure Custard",
        transform_quotes1:"Cure La Mode, Decoration!",
        transform_quotes2:"With Intelligence and Courage! Let's La Mix It All Up! Cure Custard! Ready To Serve!",
        special_attack:"Custard Illusion",
        img_special_attack:"https://cdn.discordapp.com/attachments/793392228168237086/817793084657631262/unknown.png",
        img_transformation:"",
        skill:{
            passive:{
                
            }
        }
    }
}

module.exports = {
    Properties, Avatar
}
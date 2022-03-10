const GlobalFunctions = require('../../GlobalFunctions');

var properties = {
    name:"himari",
    icon:"https://waa.ai/JEw9.png",
    color:"yellow",
    fullname:"Himari Arisugawa",
    alter_ego:"Cure Custard",
    hint_spawn:"With Intelligence and Courage! Let's La Mix It All Up! <x>! Ready To Serve!",
    total:0,
    series:"kirakira",
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
    properties, Avatar
}
var properties = {
    name:"elena",
    icon:"https://waa.ai/JEws.png",
    color:"yellow",
    fullname:"Elena Amamiya",
    alter_ego:"Cure Soleil",
    hint_spawn:"Light up the sky! With sparkling heat! <x>!!",
    total:0,
    series:"star_twinkle",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEws.png",
        name:"Cure Soleil",
        transform_quotes1:"Color Charge!",
        transform_quotes2:"Light up the sky! With sparkling heat! Cure Soleil!",
        special_attack:"Soleil Shoot",
        img_special_attack:"https://cdn.discordapp.com/attachments/793396010227204117/817794841130827786/unknown.png",
        img_transformation:"",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
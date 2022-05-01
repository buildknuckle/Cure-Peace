var properties = {
    name:"nao",
    icon:"https://waa.ai/JEwD.png",
    color:"green",
    fullname:"Nao Midorikawa",
    alter_ego:"Cure March",
    hint_spawn:"Intense courage, a straight-up bout! <x>!",
    total:0,
    series:"smile",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwD.png",
        name:"Cure March",
        transform_quotes1:"Pretty Cure! Smile Charge!",
        transform_quotes2:"Intense courage, a straight-up bout! Cure March!",
        special_attack:"March Shoot",
        img_special_attack:"https://cdn.discordapp.com/attachments/793386892137332756/817784444546449468/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793386892137332756/822031246094761984/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
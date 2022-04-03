var properties = {
    name:"erika",
    icon:"https://waa.ai/JEwE.png",
    color:"blue",
    fullname:"Erika Kurumi",
    alter_ego:"Cure Marine",
    hint_spawn:"The flower that flutters in the ocean winds, <x>!",
    total:0,
    series:"heartcatch",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwE.png",
        name : "Cure Marine",
        transform_quotes1 : "Pretty Cure! Open My Heart!",
        transform_quotes2 : "The flower that flutters in the ocean winds, Cure Marine!",
        special_attack : "Blue Forte Wave",
        img_special_attack : "https://cdn.discordapp.com/attachments/793382673749377075/817778139501559888/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793382673749377075/822047680099254272/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
var properties = {
    name:"minami",
    icon:"https://waa.ai/JEwX.png",
    color:"blue",
    fullname:"Minami Kaidou",
    alter_ego:"Cure Mermaid",
    hint_spawn:"Princess of the crystal clear seas! <x>!",
    total:0,
    series:"go_princess",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwX.png",
        name : "Cure Mermaid",
        transform_quotes1 : "Pretty Cure, Princess Engage!",
        transform_quotes2 : "Princess of the crystal clear seas! Cure Mermaid!",
        special_attack : "Mermaid Ripple",
        img_special_attack : "https://cdn.discordapp.com/attachments/793389777361174549/817786645037711390/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793389777361174549/822055972255825958/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
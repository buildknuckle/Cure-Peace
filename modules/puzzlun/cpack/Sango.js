var properties = {
    name:"sango",
    icon:"https://waa.ai/f4BX.png",
    color:"purple",
    fullname:"Sango Suzumura",
    alter_ego:"Cure Coral",
    hint_spawn:"Glittering Jewels! <x>!",
    total:0,
    series:"tropical_rouge",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/f4BX.png",
        name : "Cure Coral",
        transform_quotes1 : "Pretty Cure, Tropical Change!",
        transform_quotes2 : "Glittering Jewels! Cure Coral!",
        special_attack : "Mokomoko Coral Diffusion",
        img_special_attack : "https://waa.ai/fa6p.png",
        img_transformation : "https://waa.ai/fa6h.jpg",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
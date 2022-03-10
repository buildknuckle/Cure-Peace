var properties = {
    name:"minori",
    icon:"https://waa.ai/f4wf.png",
    color:"yellow",
    fullname:"Minori Ichinose",
    alter_ego:"Cure Papaya",
    hint_spawn:"Sparkling Fruits! <x>!",
    total:0,
    series:"tropical_rouge",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/f4wf.png",
        name : "Cure Papaya",
        transform_quotes1 : "Pretty Cure, Tropical Change!",
        transform_quotes2 : "Sparkling Fruits! Cure Papaya!",
        special_attack : "Panpaka Papaya Shot",
        img_special_attack : "https://waa.ai/fa6d.png",
        img_transformation : "https://waa.ai/fa6i.jpg",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
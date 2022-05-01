var properties = {
    name:"asuka",
    icon:"https://waa.ai/f4vH.png",
    color:"red",
    fullname:"Asuka Takizawa",
    alter_ego:"Cure Flamingo",
    hint_spawn:"Fluttering Wings! <x>!",
    total:0,
    series:"tropical_rouge",
}

class Avatar {
    static normal = {
        icon: "https://waa.ai/f4vH.png",
        name : "Cure Flamingo",
        transform_quotes1 : "Pretty Cure, Tropical Change!",
        transform_quotes2 : "Fluttering Wings! Cure Flamingo!",
        special_attack : "Buttobi Flamingo Smash",
        img_special_attack : "https://cdn.discordapp.com/attachments/832841288172175390/927473735966027806/1000.png",
        img_transformation : "https://waa.ai/f4ZV.jpg",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
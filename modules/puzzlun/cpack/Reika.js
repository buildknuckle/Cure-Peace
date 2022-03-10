var properties = {
    name:"reika",
    icon:"https://waa.ai/JEwk.png",
    color:"blue",
    fullname:"Reika Aoki",
    alter_ego:"Cure Beauty",
    hint_spawn:"Snowing, falling and gathering, a noble heart! <x>!",
    total:0,
    series:"smile",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwk.png",
        name : "Cure Beauty",
        transform_quotes1 : "Pretty Cure! Smile Charge!",
        transform_quotes2 : "Snowing, falling and gathering, a noble heart! Cure Beauty!",
        special_attack : "Beauty Blizzard",
        img_special_attack : "https://cdn.discordapp.com/attachments/793387120341155850/817784652236062750/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793387120341155850/822029771910676480/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    properties, Avatar
}
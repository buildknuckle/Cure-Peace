var properties = {
    icon:"https://waa.ai/JEVM.png",
    color:"pink",
    fullname:"Miyuki Hoshizora",
    alter_ego:"Cure Happy",
    hint_spawn:"Twinkling and shining, the light of the future! <x>!",
    total:0,
    series:"smile",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVM.png",
        name : "Cure Happy",
        transform_quotes1 : "Pretty Cure! Smile Charge!",
        transform_quotes2 : "Twinkling and shining, the light of the future! Cure Happy!",
        special_attack : "Happy Shower",
        img_special_attack : "https://cdn.discordapp.com/attachments/793384875465506816/817783520935673856/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793384875465506816/822032962186117140/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"❤️ Max HP+10%", value:{maxHp:10}};
                    } else if(level<=19){
                        return {label:"❤️ Max HP+14%", value:{maxHp:14}};
                    } else if(level<=29){
                        return {label:"❤️ Max HP+18%", value:{maxHp:18}};
                    } else if(level<=39){
                        return {label:"❤️ Max HP+30%", value:{maxHp:30}};
                    } else if(level<=49){
                        return {label:"❤️ Max HP+35%", value:{maxHp:35}};
                    } else {
                        return {label:"❤️ Max HP+40%", value:{maxHp:40}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
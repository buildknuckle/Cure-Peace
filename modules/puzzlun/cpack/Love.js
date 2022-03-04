const DBM_Card_Inventory = require(`../../../database/model/DBM_Card_Inventory`);

var properties = {
    icon:"https://waa.ai/JEVW.png",
    color:"pink",
    fullname:"Love Momozono",
    alter_ego:"Cure Peach",
    hint_spawn:"The pink heart is the emblem of love. Freshly-picked, <x>!",
    total:0,
    series:"fresh",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVW.png",
        name : "Cure Peach",
        transform_quotes1 : "Change, Pretty Cure! Beat up!",
        transform_quotes2 : "The pink heart is the emblem of love. Freshly-picked, Cure Peach!",
        special_attack : "Love Sunshine",
        img_special_attack : "https://cdn.discordapp.com/attachments/793381447062913064/817776599390486558/unknown.png",
        img_transformation: "https://cdn.discordapp.com/attachments/793381447062913064/823994186217816075/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"❤️ Max HP+10%", value:{maxHp:10}};
                    } else if(level<=19){
                        return {label:"❤️ Max HP+15%", value:{maxHp:15}};
                    } else if(level<=29){
                        return {label:"❤️ Max HP+20%", value:{maxHp:20}};
                    } else if(level<=39){
                        return {label:"❤️ Max HP+25%", value:{maxHp:25}};
                    } else if(level<=49){
                        return {label:"❤️ Max HP+30%", value:{maxHp:30}};
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
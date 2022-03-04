var properties = {
    icon:"https://waa.ai/JEVP.png",
    color:"pink",
    fullname:"Ichika Usami",
    alter_ego:"Cure Whip",
    hint_spawn:"With Liveliness and Smiles! Let's La Mix It All Up! <x>! Ready To Serve!",
    total:0,
    series:"kirakira",
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEVP.png",
        name : "Cure Whip",
        transform_quotes1 : "Cure La Mode, Decoration!",
        transform_quotes2 : "With Liveliness and Smiles! Let's La Mix It All Up! Cure Whip! Ready To Serve!",
        special_attack : "Whip Decoration",
        img_special_attack : "https://cdn.discordapp.com/attachments/793391968322322462/817792783754330142/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793391968322322462/822041487444803594/image0.gif",
        skill:{
            passive:{
                stats: function(level){
                    if(level<=9){
                        return {label:"⏫ Max HP+10% & atk+5%", value:{maxHp:10, atk:5}};
                    } else if(level<=19){
                        return {label:"⏫ Max HP+15% & atk+5%", value:{maxHp:15, atk:5}};
                    } else if(level<=29){
                        return {label:"⏫ Max HP+18% & atk+5%", value:{maxHp:18, atk:5}};
                    } else if(level<=39){
                        return {label:"⏫ Max HP+20% & atk+5%", value:{maxHp:20, atk:5}};
                    } else if(level<=49){
                        return {label:"⏫ Max HP+23% & atk+8%", value:{maxHp:23, atk:8}};
                    } else {
                        return {label:"⏫ Max HP+25% & atk+10%", value:{maxHp:25, atk:10}};
                    }
                }
            }
        }
    }
}

module.exports = {
    properties, Avatar
}
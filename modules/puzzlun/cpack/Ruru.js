var properties = {
    name:"ruru",
    icon:"https://waa.ai/JEwH.png",
    color:"purple",
    fullname:"Ruru Amour",
    alter_ego:"Cure Amour",
    hint_spawn:"Loving everyone! The Pretty Cure of Love! <x>!",
    total:0,
    series:"hugtto",
}

class Avatar {
    static normal = {
        icon:"https://waa.ai/JEwH.png",
        name:"Cure Amour",
        transform_quotes1:"Heart Kiratto!",
        transform_quotes2:"Loving everyone! The Pretty Cure of Love! Cure Amour!",
        special_attack:"Heart Dance",
        img_special_attack:"https://cdn.discordapp.com/attachments/793395175695187980/817794367410143262/unknown.png",
        img_transformation:"https://waa.ai/JEwH.png",
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
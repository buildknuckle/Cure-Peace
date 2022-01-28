const TsunagarusModules = require('../Tsunagarus');

module.exports = 
class Skills {
    // static skillCoreData = {
    //     card_duplicator: {
    //         cp_cost:100
    //     },
    //     atk_boost_s: {
    //         cp_cost:30
    //     },
    //     hp_boost_s: {
    //         cp_cost:30
    //     },
    //     rarity_boost_s: {
    //         cp_cost:30
    //     },
    //     recover:{
    //         cp_cost:20
    //     }
    // }

    static scan = {
        scan_color:"scan_color",
        scan_rarity:"scan_rarity",
        scan_type:"scan_type",
    }

    static effect = {
        cp_cost:"cp_cost",
        requirement_type:"requirement_type",
        requirement_color:"requirement_color",
        requirement_item:"requirement_item",
        requirement_form:"requirement_form",
        take_down_type:"take_down_type",
        take_down_color:"take_down_color",
        take_down_series:"take_down_series",
        boost_hp_value:"boost_hp_value",
        boost_atk_value:"boost_atk_value",
        hp_recovery:"hp_recovery",
        boost_hp_percentage:"boost_hp_percentage",
        boost_atk_percentage:"boost_atk_percentage",
        skp:"skp",
        turn:"turn"
    }

    static dataSkill = {
        nagisa:{
            0:{
                name:"Heartful Commune: Palp",
                description:`Max Hp+40%`,
                img:"",
                skp:4,
                effect:{
                    boost_hp_percentage:40
                }
            },
            1:{
                name:"Heartful Commune: Nelp",
                description:"Atk+40% for 3 turn",
                img:"",
                skp:4,
                effect:{
                    boost_atk_percentage:40,
                    turn:3
                }
            },
            2:{
                name:"Heartful Commune: Atalp",
                description:"Max Hp+30% & Atk+20%",
                img:"",
                skp:4,
                effect:{
                    boost_hp_percentage:30,
                    boost_atk_percentage:20
                }
            },
            3:{
                name:"Marble Screw",
                description:"Take down pink zakenna 30%",
                skp:6,
                effect:{
                    
                }
            }
        }
    }

    //VALIDATION
    //check if cp enough/not
    static validationCp(pack,skill_name,cp){
        if(this.effect.cp_cost in this.dataSkill[pack][skill_name]["effect"])
            if(cp >= this.dataSkill[pack][skill_name]["effect"][this.effect.cp_cost])
                return true;
    }

    static validationColor(pack,skill_name,color){
        //check if color was same/not
        if(this.effect.requirement_color in this.dataSkill[pack][skill_name]["effect"])
            if(color.toLowerCase() == this.dataSkill[pack][skill_name]["effect"][this.effect.requirement_color])
                return true;
    }
}
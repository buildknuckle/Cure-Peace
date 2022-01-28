module.exports = { 
    propertiesStatusEffect:  {
        value:"value",
        attempts:"attempts",
        item_requirement:"item_requirement"
    }, 
    buffData: {
        second_chance:{
            value:"second_chance",
            name:"Second Chance",
            description:"You'll be given another chance to use: **capture/answer/guess** command.",
        },
        lucky_number:{
            value:"lucky_number",
            name:"Lucky Number",
            permanent:false,
            description:"Provide number 7 as the next hidden number.",
            value_number:7
        },
        pink_coloraura_1:{
            value:"pink_coloraura_1",
            name:"Pink Aura 1",
            permanent:true,
            description:"10% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:10
        },
        blue_coloraura_1:{
            value:"blue_coloraura_1",
            name:"Blue Aura 1",
            permanent:true,
            description:"10% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:10
        },
        yellow_coloraura_1:{
            value:"yellow_coloraura_1",
            name:"Yellow Aura 1",
            permanent:true,
            description:"10% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:10
        },
        red_coloraura_1:{
            value:"red_coloraura_1",
            name:"Red Aura 1",
            permanent:true,
            description:"10% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:10
        },
        purple_coloraura_1:{
            value:"purple_coloraura_1",
            name:"Purple Aura 1",
            permanent:true,
            description:"10% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:10
        },
        white_coloraura_1:{
            value:"white_coloraura_1",
            name:"White Aura 1",
            permanent:true,
            description:"10% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:10
        },
        green_coloraura_1:{
            value:"green_coloraura_1",
            name:"Green Aura 1",
            permanent:true,
            description:"10% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:10
        },
        pink_coloraura_2:{
            value:"pink_coloraura_2",
            name:"Pink Aura 2",
            permanent:true,
            description:"15% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:15
        },
        blue_coloraura_2:{
            value:"blue_coloraura_2",
            name:"Blue Aura 2",
            permanent:true,
            description:"15% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:15
        },
        yellow_coloraura_2:{
            value:"yellow_coloraura_2",
            name:"Yellow Aura 2",
            permanent:true,
            description:"15% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:15
        },
        red_coloraura_2:{
            value:"red_coloraura_2",
            name:"Red Aura 2",
            permanent:true,
            description:"15% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:15
        },
        purple_coloraura_2:{
            value:"purple_coloraura_2",
            name:"Purple Aura 2",
            permanent:true,
            description:"15% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:15
        },
        white_coloraura_2:{
            value:"white_coloraura_2",
            name:"White Aura 2",
            permanent:true,
            description:"15% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:15
        },
        green_coloraura_2:{
            value:"green_coloraura_2",
            name:"Green Aura 2",
            permanent:true,
            description:"15% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:15
        },
        clear_status_all:{
            value:"clear_status_all",
            name:"Status Removal",
            description:"Remove the Debuff & Clear Status Effect."
        },
        quiz_master:{
            value:"quiz_master",
            name:"Quiz Master",
            permanent:false,
            description:"Instantly provide the correct answer if the answer is wrong."
        },
    
        hp_up_1:{
            value:"hp_up_1",
            name:"Hp Up 1",
            description:"+20% hp boost during battle.",
            value_hp_boost:20,
            permanent:true
        },
        hp_up_2:{
            value:"hp_up_2",
            name:"Hp Up 2",
            description:"+25% hp boost during battle.",
            value_hp_boost:25,
            permanent:true
        },
    
        rarity_up_1:{
            value:"rarity_up_1",
            name:"Rarity Up 1",
            description:"+1 :star: rarity during battle.",
            value_rarity_boost:1,
            permanent:true
        },
        rarity_up_2:{
            value:"rarity_up_2",
            name:"Rarity Up 2",
            description:"+2 :star: rarity during battle.",
            value_rarity_boost:2,
            permanent:true
        },
        atk_up_1:{
            value:"atk_up_1",
            name:"Atk Up 1",
            description:"+20% atk boost during battle.",
            value_atk_boost:20,
            permanent:true
        },
        atk_up_2:{
            value:"atk_up_2",
            name:"Atk Up 2",
            description:"+25% atk boost during battle.",
            value_atk_boost:25,
            permanent:true
        },
        precure_protection:{
            value:"precure_protection",
            name:"Precure Protection",
            description:"**Protect** yourself from losing the precure avatar.",
            permanent:false
        },
        rainbow_coloraura_1:{
            value:"rainbow_coloraura_1",
            name:"Rainbow Aura 1",
            description:"5% capture boost for all card.",
            value_capture_boost:5,
            permanent:true
        },
        rainbow_coloraura_2:{
            value:"rainbow_coloraura_2",
            name:"Rainbow Aura 2",
            description:"10% capture boost for all card.",
            value_capture_boost:10,
            permanent:true
        },
        remove_debuff:{
            value:"remove_debuff",
            name:"Debuff Removal",
            description:"Remove the chosen debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_fear:{
            value:"remove_debuff_fear",
            name:"Fear Removed",
            description:"Remove **fear** debuff.",
            usable:false,
            clear_status:true
        },
        special_break:{
            value:"special_break",
            name:"Special Break",
            description:"**Break** through enemy **special protection**!",
            permanent:false
        },
        scan_tsunagarus:{
            value:"scan_tsunagarus",
            name:"🔍 Tsunagascan!",
            description:"Scan",
            permanent:false
        }
    }, 
    cureSkillsBuffData: {
        stats_booster:{
            value:"stats_booster",
            name:"Stats Booster",
            description:"Boost HP & Atk Stats by 50% for 3 battle attempts.",
            boost_value:50,
            attempts:3,
            notifications:["hp","atk"]
        },
        catchphrage:{
            value:"catchphrage",
            name:"Catchphrage",
            description:"Lower your hp by 30% & boost atk by 30% for 5 battle attempts.",
            boost_penalty:30,
            boost_value:30,
            attempts:5,
            notifications:["hp","atk"]
        },
        levelcutter:{
            value:"levelcutter",
            name:"Levelcutter",
            description:"Lower your level by 50% & boost atk by 70% for 5 battle attempts.",
            boost_penalty:50,
            boost_value:70,
            attempts:5,
            notifications:["level","atk"]
        },
        starmaster:{
            value:"starmaster",
            name:"Starmaster",
            description:"+7 rarity boost for 7 turns.",
            attempts:7,
            boost_value:7,
            damageRelated: false,
            notifications:["rarity"]
        },
        endure:{
            value:"endure",
            name:"Endure",
            description:"Lower your atk by 50% & boost hp by 50% for 5 battle attempts.",
            attempts:5,
            boost_penalty:50,
            boost_value:50,
            damageRelated: false,
            notifications:["atk","hp"]
        },
        reward_booster:{
            value:"reward_booster",
            name:"Reward Booster",
            description:"Individual boost rewards upon defeating the enemy.",
            attempts:2,
            notifications:["rewards"]
        },
        cure_blessing:{
            value:"cure_blessing",
            name:"Cure Blessing",
            description:"Protect from getting defeated for 3 battle attempts*.",
            attempts:3,
            notifications:["hp"]
        },
        
    }, 
    partyBuffData: {
        party_atk_up_1:{
            value:"party_atk_up_1",
            name:"Party Atk Up 1",
            description:"+10% atk boost for party.",
            value_atk_boost:10,
            permanent:true
        },
        party_atk_up_2:{
            value:"party_atk_up_2",
            name:"Party Atk Up 2",
            description:"+20% atk boost for party.",
            value_atk_boost:20,
            permanent:true
        },
        party_atk_up_3:{
            value:"party_atk_up_3",
            name:"Party Atk Up 3",
            description:"+30% atk boost for party.",
            value_atk_boost:30,
            permanent:true
        },
        party_atk_up_4:{
            value:"party_atk_up_4",
            name:"Party Atk Up 4",
            description:"+40% atk boost for party.",
            value_atk_boost:50,
            permanent:false
        },
        party_hp_up_1:{
            value:"party_hp_up_1",
            name:"Party Hp Up 1",
            description:"+10% hp boost for party.",
            value_hp_boost:10,
            permanent:true
        },
        party_hp_up_2:{
            value:"party_hp_up_2",
            name:"Party Hp Up 2",
            description:"+20% hp boost for party.",
            value_hp_boost:20,
            permanent:true
        },
        party_hp_up_3:{
            value:"party_hp_up_3",
            name:"Party Hp Up 3",
            description:"+30% hp boost for party.",
            value_hp_boost:30,
            permanent:true
        },
        party_hp_up_4:{
            value:"party_hp_up_4",
            name:"Party Hp Up 4",
            description:"+40% hp boost for party.",
            value_hp_boost:40,
            permanent:true
        },
    
        party_rarity_up_1:{
            value:"party_rarity_up_1",
            name:"Party Rarity Up 1",
            description:"+1 :star: rarity for party.",
            value_rarity_boost:1,
            permanent:true
        },
        party_rarity_up_2:{
            value:"party_rarity_up_2",
            name:"Party Rarity Up 2",
            description:"+2 :star: rarity for party.",
            value_rarity_boost:2,
            permanent:true
        },
        party_rarity_up_3:{
            value:"party_rarity_up_3",
            name:"Party Rarity Up 3",
            description:"+3 :star: rarity for party.",
            value_rarity_boost:3,
            permanent:true
        },
        party_rarity_up_4:{
            value:"party_rarity_up_4",
            name:"Party Rarity Up 4",
            description:"+4 :star: rarity for party.",
            value_rarity_boost:4,
            permanent:false
        },
    }, 
    debuffData: {
        hp_down_1:{
            value:"hp_down_1",
            name:"Hp Down 1",
            description:"-50% hp during battle.",
            value_hp_down:50,
            recovery_item:["ca017","ca019","fo001","fo009"],
            permanent:true
        },
        hp_down_2:{
            value:"hp_down_2",
            name:"Hp Down 2",
            description:"-60% hp during battle.",
            value_hp_down:60,
            recovery_item:["ca017","ca019","fo001","fo009"],
            permanent:true
        },
        hp_down_3:{
            value:"hp_down_3",
            name:"Hp Down 3",
            description:"-70% hp during battle.",
            value_hp_down:70,
            recovery_item:["ca017","ca019","fo001","fo009"],
            permanent:true
        },
        hp_down_4:{
            value:"hp_down_4",
            name:"Hp Down 4",
            description:"-80% hp during battle.",
            value_hp_down:80,
            recovery_item:["ca017","ca019","fo001","fo009"],
            permanent:true
        },
    
        rarity_down_1:{
            value:"rarity_down_1",
            name:"Rarity Down 1",
            description:"-1 :star: rarity during battle.",
            value_rarity_down:1,
            recovery_item:["ca017","ca021","fo002","fo009"],
            permanent:true
        },
        rarity_down_2:{
            value:"rarity_down_2",
            name:"Rarity Down 2",
            description:"-2 :star: rarity during battle.",
            value_rarity_down:2,
            recovery_item:["ca017","ca021","fo002","fo009"],
            permanent:true
        },
        rarity_down_3:{
            value:"rarity_down_3",
            name:"Rarity Down 3",
            description:"-3 :star: rarity during battle.",
            value_rarity_down:3,
            recovery_item:["ca017","ca021","fo002","fo009"],
            permanent:true
        },
        rarity_down_4:{
            value:"rarity_down_4",
            name:"Rarity Down 4",
            description:"-4 :star: rarity during battle.",
            value_rarity_down:4,
            recovery_item:["ca017","ca021","fo002","fo009"],
            permanent:true
        },
    
        atk_down_1:{
            value:"atk_down_1",
            name:"Atk Down 1",
            description:"-50% atk during battle.",
            value_atk_down:50,
            recovery_item:["ca017","ca025","fo003","fo009"],
            permanent:true
        },
        atk_down_2:{
            value:"atk_down_2",
            name:"Atk Down 2",
            description:"-60% atk during battle.",
            value_atk_down:60,
            recovery_item:["ca017","ca025","fo003","fo009"],
            permanent:true
        },
        atk_down_3:{
            value:"atk_down_3",
            name:"Atk Down 3",
            description:"-65% atk during battle.",
            value_atk_down:65,
            recovery_item:["ca017","ca025","fo003","fo009"],
            permanent:true
        },
        atk_down_4:{
            value:"atk_down_4",
            name:"Atk Down 4",
            description:"-80% atk during battle.",
            value_atk_down:80,
            recovery_item:["ca017","ca025","fo003","fo009"],
            permanent:true
        },
        fear:{
            value:"fear",
            name:"Fear",
            description:"Unable to participate in **battle**.",
            permanent:true,
            recovery_item:["ca029","ca017","fo009"]
        }
    } 
}
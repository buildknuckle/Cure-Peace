class Passive {
    static type = {
        statsBooster:"statsBooster"
    }
    label = "";

    constructor(label){
        this.label = label;
    }
}

class StatsBooster extends Passive {
    type = Passive.type.statsBooster;
    maxHp=0;//in percentage
    atk=0;//in percentage

    constructor(label, maxHp=0, atk=0){
        super(label);
        this.maxHp = maxHp;
        this.atk = atk;
    }
    // stats: function(level){
    //     if(level<=9){
    //         return {label:"⏫ Max HP & atk+10%", value:{maxHp:10, atk:10}};
    //     } else if(level<=19){
    //         return {label:"⏫ Max HP & atk+15%", value:{maxHp:15, atk:15}};
    //     } else if(level<=29){
    //         return {label:"⏫ Max HP & atk+20%", value:{maxHp:20, atk:20}};
    //     } else if(level<=39){
    //         return {label:"⏫ Max HP & atk+25%", value:{maxHp:25, atk:25}};
    //     } else if(level<=49){
    //         return {label:"⏫ Max HP & atk+28%", value:{maxHp:28, atk:28}};
    //     } else {
    //         return {label:"⏫ Max HP & atk+30%", value:{maxHp:30, atk:30}};
    //     }
    // }
}

module.exports = {
    passive:{
        StatsBooster
    }
};
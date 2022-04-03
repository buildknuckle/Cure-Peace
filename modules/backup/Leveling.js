module.exports = class Leveling {
    // 1 star was Lv.20, 2 star was Lv.25, 3 star was Lv.35, 4 star and Cure Cards was Lv.40 and 5 star and Premium Cure Cards was Lv.50
    static getMaxLevel(rarity){
        switch(rarity){
            case 1: return 20;
            case 2: return 25;
            case 3: return 35;
            case 4: return 40;
            default: return 50;
        }
    }

    static getNextCardExp(level,qty=1){
        var tempExp = 0;
        if(qty<=1){
            tempExp+=(level+1)*10;
        } else {
            //parameter:3: level 1->4
            for(var i=0;i<qty;i++){
                tempExp+=(level+1)*10;
                level+=1;
            }
        }
        
        return tempExp;
    }

    static getNextCardSpecialTotal(level){
        //get the card stock requirement to level up the specials
        switch(level){
            case 1: return 1;
            case 2: return 2;
            default: return 4;
        }
    }
    
}
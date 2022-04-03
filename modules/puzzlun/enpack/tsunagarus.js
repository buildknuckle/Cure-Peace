class Parameter {
    level = 1;
    maxHp= 0;
    hp= 0;
    atk= 0;

    constructor(level, maxHp, atk){
        this.level = level;
        this.maxHp = maxHp;
        this.hp = this.maxHp;
        this.atk = atk;
    }
}

class Tsunagarus {

    parameter;

    constructor(){

    }
}

module.exports = { Parameter };
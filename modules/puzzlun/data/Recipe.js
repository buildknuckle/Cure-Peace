const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const {Item} = require("./Item");
const GlobalFunctions = require('../../GlobalFunctions');
const Properties = require('../Properties');
const Currency = Properties.currency;

class RecipeFood extends Item {
    id_recipe= null;
    id_item= null;
    ingredient= {
        name:null,
        qty:null,
    };

    constructor(recipeData, itemData=null){
        super(itemData);
        for(var key in recipeData){
            this[key] = recipeData[key];
        }
    }

}

module.exports = {
    RecipeFood
}
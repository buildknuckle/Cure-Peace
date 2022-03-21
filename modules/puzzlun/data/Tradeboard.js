const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DBM_Tradeboard = require('../../../database/model/DBM_Tradeboard');
const Card = require('./Card');

//database modifier

var update_key = [
    DBM_Tradeboard.columns.id_guild,
];

class Tradeboard {
    static tablename = DBM_Tradeboard.TABLENAME;
    static columns = DBM_Tradeboard.columns;
    static category = {
        card:"card"
    }

    id = null;
    id_guild = null;
    id_user = null;

    constructor(){
        // if(tradeboardData!=null){
        //     for(var key in tradeboardData){
        //         this[key] = tradeboardData[key];
        //     }

        //     if(this.category!=null){
        //         switch(this.category){
        //             case Tradeboard.category.card:
        //                 this.category = Tradeboard.category.card;
        //                 break;
        //         }
        //     }

        // }
        
    }
    
    static async getTotalByUser(guildId, userId, category = null){
        var parameterWhere= new Map();
        parameterWhere.set(this.columns.id_guild, guildId);
        parameterWhere.set(this.columns.id_user, userId);
        if(category!=null){
            parameterWhere.set(this.columns.category, category);
        }
        var result = await DB.selectAll(this.tablename, parameterWhere);
        return result.length;
    }

    static async getDataByUser(guildId, userId, category= null){
        var parameterWhere= new Map();
        parameterWhere.set(this.columns.id_guild, guildId);
        parameterWhere.set(this.columns.id_user, userId);
        if(category!=null){
            parameterWhere.set(this.columns.category, category);
        }
        var result = await DB.selectAll(this.tablename, parameterWhere);

        // if(result[0]==null){ //insert if not found
        //     var parameter = new Map();
        //     parameter.set(this.columns.id_guild, guildId);
        //     parameter.set(this.columns.id_user, userId);
        //     await DB.insert(this.tablename, parameter);
        //     //reselect after insert new data
        //     parameterWhere = new Map();
        //     parameterWhere.set(this.columns.id_guild, guildId);
        //     parameterWhere.set(this.columns.id_user, userId);
        //     if(category!=null){
        //         parameterWhere.set(this.columns.category, category);
        //     }
        //     userData = await DB.selectAll(User.tablename,parameterWhere);
        // }

        return result;
    }
}

class CardTradeboard extends Tradeboard {
    category = "card";
    data_trade = {
        lookingFor: null,//card that will be received
        offer: null//card that will be sent
    }

    CardLookingFor;
    CardOffer;
    
    // id_card_want = null;//card that will be received
    // id_card_offer = null;//card that will be sent

    constructor(initData={guildId:null, userId:null, lookingFor:null, offer:null},
        cardDataLookingFor = null, cardDataOffer = null){
        super();
        this.id_guild = initData.guildId;
        this.id_user = initData.userId;
        this.data_trade.lookingFor = initData.lookingFor;
        this.data_trade.offer = initData.offer;

        if(cardDataLookingFor!=null) this.CardLookingFor = new Card(cardDataLookingFor);
        if(cardDataOffer!=null) this.CardOffer = new Card(cardDataOffer);
    }

    init(tradeboardData){
        for(var key in tradeboardData){
            var colVal = tradeboardData[key];
            switch(key){
                case Tradeboard.columns.data_trade:
                    if(colVal!=null) this.data_trade = JSON.parse(colVal);
                    break;
                default:
                    this[key] = colVal;
                    break;
            }
            this[key] = tradeboardData[key];
        }
    }

    set(guildId, userId, id_card_want, id_card_offer){
        this.id_card
    }

    update(){

    }


}

module.exports = {Tradeboard, CardTradeboard};
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DBM_Tradeboard = require('../../../database/model/DBM_Tradeboard');
const Card = require('./Card');

var update_key = [
    DBM_Tradeboard.columns.id_guild,
];

class Tradeboard {
    static tablename = DBM_Tradeboard.TABLENAME;
    static columns = DBM_Tradeboard.columns;
    static category = Object.freeze({
        card:"card"
    });
    static limit = {
        post:10
    }

    id = null;
    id_guild = null;
    category = null;
    id_user = null;
    id_looking_for = null;
    id_offer = null;

    constructor(guildId=null, userId=null){
        this.id_guild= guildId;
        this.id_user= userId;
    }

    init(tradeboardData){
        for(var key in tradeboardData){
            this[key] = tradeboardData[key];
        }
    }
    
    async getTotalByUser(){
        var parameterWhere= new Map();
        parameterWhere.set(Tradeboard.columns.id_guild, this.id_guild);
        parameterWhere.set(Tradeboard.columns.id_user, this.id_user);
        if(this.category!=null){
            parameterWhere.set(Tradeboard.columns.category, this.category);
        }
        var result = await DB.selectAll(Tradeboard.tablename, parameterWhere);
        return result.length;
    }

    async getDataByUser(guildId, userId, category= null){
        var parameterWhere= new Map();
        parameterWhere.set(Tradeboard.columns.id_guild, guildId);
        parameterWhere.set(Tradeboard.columns.id_user, userId);
        if(category!=null){
            parameterWhere.set(Tradeboard.columns.category, category);
        }
        var result = await DB.selectAll(Tradeboard.tablename, parameterWhere);
        return result;
    }
}

class CardTradeboard extends Tradeboard {
    static category = Tradeboard.category.card;

    // {"lookingFor":"nami301","offer":"nami401"}
    category = CardTradeboard.category;
    CardLookingFor;
    CardOffer;

    constructor(guildId=null, userId=null, cardDataLookingFor=null, cardDataOffer=null){
        super(guildId, userId);
        this.setCardData(cardDataLookingFor, cardDataOffer);
    }

    setCardData(cardDataLookingFor=null, cardDataOffer=null){
        if(cardDataLookingFor!=null){
            this.CardLookingFor = new Card(cardDataLookingFor);
            this.id_looking_for = this.CardLookingFor.id_card;
        };

        if(cardDataOffer!=null){
            this.CardOffer = new Card(cardDataOffer);
            this.id_offer = this.CardOffer.id_card;
        }
    }

    async insert(){
        var parameter = new Map();
        parameter.set(Tradeboard.columns.id_guild, this.id_guild);
        parameter.set(Tradeboard.columns.id_user, this.id_user);
        parameter.set(Tradeboard.columns.category, this.category);
        parameter.set(Tradeboard.columns.id_looking_for, this.id_looking_for);
        parameter.set(Tradeboard.columns.id_offer, this.id_offer);
        var ins = await DB.insert(Tradeboard.tablename, parameter);
        this.id = ins.insertId;//assign the id
    }

    async findDuplicate(idLookingFor=null, idOffer=null){
        var paramWhere = new Map();
        paramWhere.set(Tradeboard.columns.id_guild, this.id_guild);
        paramWhere.set(Tradeboard.columns.id_user, this.id_user);
        if(idLookingFor==null){
            paramWhere.set(Tradeboard.columns.id_looking_for, this.id_looking_for);
        } else {
            paramWhere.set(Tradeboard.columns.id_looking_for, idLookingFor);
        }

        if(idOffer==null){
            paramWhere.set(Tradeboard.columns.id_offer, this.id_offer);
        } else {
            paramWhere.set(Tradeboard.columns.id_offer, idOffer);
        }
        
        var result = await DB.selectAll(Tradeboard.tablename, paramWhere);
        return result[0]!=null? result:null;
    }

    async init(CardTradeboard){
        for(var key in CardTradeboard){
            this[key] = CardTradeboard[key];
        }
    }
    
    //will search all looking for listing with card data of looking for & return search data
    async getAllLookingForData(idLookingFor=null, searchOwn=true){
        var arrParam = [this.id_guild];
        var query = `SELECT * 
        FROM ${Tradeboard.tablename} t 
        LEFT JOIN ${Card.tablename} cd ON 
        cd.${Card.columns.id_card} = t.${Tradeboard.columns.id_looking_for} 
        WHERE t.${Tradeboard.columns.id_guild}=? `;
        if(idLookingFor!=null){
            query+=` AND ${Tradeboard.columns.id_looking_for}=? `;
            arrParam.push(idLookingFor);
        }

        if(searchOwn){
            query+=` AND t.${Tradeboard.columns.id_user}=? `;
            arrParam.push(this.id_user);
        } else {
            query+=` AND t.${Tradeboard.columns.id_user}<>? `;
            arrParam.push(this.id_user);
        }

        var result = await DBConn.conn.query(query, arrParam);
        return result[0]!==undefined ? result:null;
    }

    initLookingFor(lookingForData){
        this.CardLookingFor = new Card();
        for(var key in lookingForData){
            var colVal = lookingForData[key];
            if(key in Tradeboard.columns){
                this[key] = colVal;
            } else {
                this.CardLookingFor[key] = colVal;
            }
        }

        this.CardLookingFor.init();
    }

    //will search all offer listing with card data of looking for & return search data
    async getAllOfferData(idOffer = null, idUserOwn=null){
        var arrParam = [this.id_guild];
        var query = `SELECT * 
        FROM ${Tradeboard.tablename} t 
        LEFT JOIN ${Card.tablename} cd ON 
        cd.${Card.columns.id_card} = t.${Tradeboard.columns.id_looking_for} 
        WHERE t.${Tradeboard.columns.id_guild}=? `;
        if(idOffer!=null){
            query+=` AND ${Tradeboard.columns.id_offer}=? `;
            if(idOffer!=null){
                arrParam.push(idOffer);
            } else {
                arrParam.push(this.id_offer);
            }
        } 
        
        if(idUserOwn!=null){
            query+=` AND ${Tradeboard.columns.id_user}<>? `;
            arrParam.push(idUserOwn);
        }

        var result = await DBConn.conn.query(query, arrParam);
        return result[0]!==undefined ? result:null;
    }

    initOffer(offerData){
        this.CardLookingFor = new Card();
        for(var key in offerData){
            var colVal = offerData[key];
            if(key in Tradeboard.columns){
                this[key] = colVal;
            } else {
                this.CardLookingFor[key] = colVal;
            }
        }

        this.CardLookingFor.init();
    }

    async getTradeboardDataById(idListing=null, searchOwn=false){
        if(idListing==null){
            idListing = this.id;
        }

        var paramWhere = new Map();
        paramWhere.set(Tradeboard.columns.id, idListing);
        paramWhere.set(Tradeboard.columns.category, this.category);
        paramWhere.set(Tradeboard.columns.id_guild, this.id_guild);
        if(searchOwn){
            paramWhere.set(Tradeboard.columns.id_user, this.id_user);
        }
        
        var result = await DB.select(Tradeboard.tablename, paramWhere);
        return result[0]!==undefined ? result[0]:null;
    }

    async remove(){
        if(this.id_guild==null||this.id_user==null||
            this.id_looking_for==null) return false;
        var paramWhere = new Map();
        paramWhere.set(Tradeboard.columns.id_guild, this.id_guild);
        paramWhere.set(Tradeboard.columns.id_user, this.id_user);
        paramWhere.set(Tradeboard.columns.id_looking_for, this.id_looking_for);
        await DB.del(Tradeboard.tablename, paramWhere);
        return true;
    }
}

module.exports = {Tradeboard, CardTradeboard};
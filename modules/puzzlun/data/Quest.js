const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DBM_User_Quest = require('../../../database/model/DBM_User_Quest');
const Card = require("./Card");

const UPDATE_KEY = [
    DBM_User_Quest.columns.id_user,
];

class UserQuest {
    static tablename = DBM_User_Quest.TABLENAME;
    static columns = DBM_User_Quest.columns;

    id_user = null;
    daily_card_data = null;
    DailyCardQuest;

    constructor(userQuestData){
        for(var key in userQuestData){
            var val = userQuestData[key];
            this[key] = val;
            switch(key){
                case UserQuest.columns.daily_card_data:
                    this.DailyCardQuest = new DailyCardQuest(val);
                    break;
            }
        }
    }

    static async getData(userId){
        var parameterWhere = new Map();
        parameterWhere.set(UserQuest.columns.id_user, userId);
        var userQuestData = await DB.select(UserQuest.tablename,parameterWhere);
    
        if(userQuestData[0]==null){ //insert if not found
            var parameter = new Map();
            parameter.set(UserQuest.columns.id_user, userId);
            await DB.insert(UserQuest.tablename,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(UserQuest.columns.id_user, userId);
            userQuestData = await DB.select(UserQuest.tablename, parameterWhere);
        }
        
        return userQuestData[0];
    }

    async update(){
        let column = [//columns to be updated:
            UserQuest.columns.id_user,
            UserQuest.columns.daily_card_data,
        ];

        this.daily_card_data = this.DailyCardQuest.getData();

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(UserQuest.tablename, paramSet, paramWhere);
    }

}

class DailyCardQuest {
    static reward = {
        2:{
            mofucoin:40,
            color:30,
            series:20,
        },
        3:{
            mofucoin:60,
            color:50,
            series:30,
        },
        4:{
            jewel:1,
            mofucoin:80,
            color:60,
            series:40
        }
    }

    static rewardCompletion = {
        jewel:5
    }

    static max = 4;
    
    arrCardId = [];
    arrCardData = [];

    constructor(daily_card_data=null){
        if(daily_card_data!=null){
            this.arrCardId = JSON.parse(daily_card_data);
        }
    }

    //need to be called to load card quest data:
    async initCardData(){
        var resultCardData = await DB.selectIn(Card.tablename, Card.columns.id_card, this.arrCardId);
        for(var i=0; i<resultCardData.length; i++){
            this.arrCardData[resultCardData[i][Card.columns.id_card]] = resultCardData[i];
            // this.arrCardData.push(resultCardData[i]);
        }
    }

    getData(){
        return JSON.stringify(this.arrCardId);
    }

    remove(cardId){
        this.arrCardId = this.arrCardId.filter(item => item !== cardId);
    }

    //get total of active card quests
    getTotal(){
        return this.arrCardId.length;
    }

    isAvailable(){
        return this.arrCardId.length>=1 ? true: false;
    }

    checkCardAvailable(cardId){
        return this.arrCardId.includes(cardId);
    }

    async randomizeCardData(){//will return randomized card data
        var query = `(SELECT * FROM ${Card.tablename} 
        WHERE ${Card.columns.rarity}=2 AND ${Card.columns.is_spawnable}=1 
        ORDER BY rand() LIMIT 1) UNION ALL 
        (SELECT * FROM ${Card.tablename} 
        WHERE ${Card.columns.rarity}=3 AND ${Card.columns.is_spawnable}=1 
        ORDER BY rand() LIMIT 2) UNION ALL 
        (SELECT * FROM ${Card.tablename} 
        WHERE ${Card.columns.rarity}=4 AND ${Card.columns.is_spawnable}=1 
        ORDER BY rand() LIMIT 1)`;
        var rndCardQuest = await DBConn.conn.query(query, []);
        this.arrCardId = [];//remove old card quest

        for(var i=0;i<rndCardQuest.length;i++){
            var card = new Card(rndCardQuest[i]);
            this.arrCardId.push(card.id_card);
            this.arrCardData.push(card);
        }
        return this.arrCardData;
    }

}

module.exports = {UserQuest, DailyCardQuest};
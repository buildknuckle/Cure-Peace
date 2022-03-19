const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');

const DBM_Party_Data = require('../../../database/model/DBM_Party_Data');

const GlobalFunctions = require('../../GlobalFunctions.js');
const {Series, SPack} = require("./Series");
const {Character, CPack} = require("./Character");
const Properties = require('../Properties');

const UPDATE_KEY = [
    DBM_Party_Data.columns.id_guild,
    DBM_Party_Data.columns.id_leader,
]

class Party {
    static tablename = DBM_Party_Data.TABLENAME;
    static columns = DBM_Party_Data.columns;
    static limit = {
        member: 5
    };
    
    id = null;
    id_guild = null;
    name = null;
    id_leader = null;
    id_member = [];
    party_point = null;
    last_charge = null;

    constructor(partyData=null){
        if(partyData!=null){
            for(var key in partyData){
                var value = partyData[key];
                switch(key){
                    case Party.columns.id_member:
                        this.id_member = JSON.parse(value);
                    break;
                    default:
                        this[key] = value;
                        break;
                }
            }
        }
    }
    
    getTotal(){
        return 1+this.id_member.length;
    }

    getTotalMember(){
        return this.id_member.length;
    }

    isPartyLeader(userIdComparison){
        return this.id_leader==userIdComparison ? true: false;
    }

    isPartyMember(userIdComparison){
        return this.id_member.includes(userIdComparison);
    }

    join(userId){
        if(this.id_member.includes(userId)==false && 
        this.getTotalMember()<Party.limit.member){
            this.id_member.push(userId.toString());
            return true;
        } else {
            return false;
        }
    }

    leave(userId){
        this.id_member = GlobalFunctions.removeArrayItem(this.id_member, userId);
    }

    getAllIdMembers(){
        let allMembers = this.id_member;
        allMembers.unshift(this.id_leader);
        return allMembers;
    }

    async remove(){
        let paramWhere = new Map();
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key], this[updateKey]);
        }

        await DB.del(Party.tablename, paramWhere);
    }

    async update(){
        let column = [//columns to be updated:
            Party.columns.id_leader,
            Party.columns.id_member,
            Party.columns.name,
            Party.columns.party_point,
            Party.columns.spawn_token,
        ];

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            if(colVal==Party.columns.id_member){
                paramSet.set(column[key], JSON.stringify(this[colVal]));
            } else {
                paramSet.set(column[key], this[colVal]);
            }
        }
        
        for(let key in UPDATE_KEY){
            let updateKey = UPDATE_KEY[key];
            paramWhere.set(UPDATE_KEY[key],this[updateKey]);
        }

        await DB.update(Party.tablename, paramSet, paramWhere);
    }
    
    static async create(partyName, idGuild, userId){
        var parameter = new Map();
        parameter.set(Party.columns.name, partyName);
        parameter.set(Party.columns.id_guild, idGuild);
        parameter.set(Party.columns.id_leader, userId);
        await DB.insert(Party.tablename, parameter);
    }

    static async getDataByLeader(guildId, userId){
        var paramWhere = new Map();
        paramWhere.set(Party.columns.id_guild, guildId);
        paramWhere.set(Party.columns.id_leader, userId);

        var result = await DB.select(Party.tablename, paramWhere);
        if(result[0]!=null){
            return result[0];
        } else {
            return null;
        }
    }

    static async getData(guildId, userId, name=''){
        var query = `SELECT * 
        FROM ${Party.tablename} 
        WHERE ${Party.columns.id_guild}=? AND   
        (${Party.columns.id_leader}=? OR 
        ${Party.columns.id_member} LIKE ?) `;
        var arrParameterized = [guildId, `${userId}`, `%${userId}%`];
        if(name!=""){
            query+=` AND ${Party.columns.name}=? `;
            arrParameterized.push(name);
        }
        query+=` LIMIT 1`;

        var result = await DBConn.conn.query(query, arrParameterized);
        if(result[0]!=null){
            return result[0];
        } else {
            return null;
        }
    }

    static async getDataByName(id_guild, name=''){
        var paramWhere = new Map();
        paramWhere.set(Party.columns.id_guild, id_guild);
        paramWhere.set(Party.columns.name, name);

        var result = await DB.select(Party.tablename, paramWhere);
        return result[0]!=null ? result[0]:null;
    }
}

module.exports = {Party};
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DBM_Guild_Data = require('../../../database/model/DBM_Guild_Data');

//database modifier
const tablename = DBM_Guild_Data.TABLENAME;
const columns = DBM_Guild_Data.columns;
var update_key = [
    columns.id_guild,
];

class Guild {
    static data = {};//contains all public stored guild id and it's data including spawn class

    id_guild = null;
    id_channel_spawn = null;
    id_roleping_cardcatcher = null;
    id_last_message_spawn = null;
    spawn_interval = null;
    spawn_token = null;
    spawn_type = null;
    spawn_data = null;

    //modifier
    timer;//to store timer interval functions
    Spawner;

    constructor(guildData){
        for(var key in guildData){
            this[key] = guildData[key];
        }
    }

    //get 1 card guild data
    static async getDBData(id_guild){
        var mapWhere = new Map();
        mapWhere.set(columns.id_guild, id_guild);
        var resultCheckExist = await DB.select(tablename, mapWhere);
        if(resultCheckExist[0]==null){
            var mapWhere = new Map();
            mapWhere.set(columns.id_guild, id_guild);
            await DB.insert(tablename,mapWhere);

            //reselect after insert new data
            mapWhere = new Map();
            mapWhere.set(columns.id_guild,id_guild);
            var resultCheckExist = await DB.select(tablename, mapWhere);
        }

        return await resultCheckExist[0];
    }

    static getSpawn(guildId){

        return;
        if(!(guildId in this.spawn)){
            this.spawn[guildId] = null;
        }

        if(this.spawn[guildId]!==null){
            return true;
        }
    }

    static getData(guildId){
        return this.data[guildId];
    }

    static setData(guildId, Guild){
        this.data[guildId] = Guild;
    }

    setSpawner(spawnType, spawnData, Spawner){
        this.spawn_type = spawnType;
        this.spawn_data = spawnData;
        this.Spawner = Spawner;
    }

    //store to db:
    async updateData(){//update all data
        let column = [//columns to be updated:
            columns.id_channel_spawn,
            columns.id_roleping_cardcatcher,
            columns.id_last_message_spawn,
            columns.spawn_interval,
            columns.spawn_token,
            columns.spawn_type,
            columns.spawn_data,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], super[colVal]);
        }
        
        for(let key in update_key){
            let updateKey = update_key[key];
            paramWhere.set(update_key[key],this[updateKey]);
        }

        await DB.update(tablename, paramSet, paramWhere);
    }

    async updateSpawnData(){//update spawn data only
        let column = [//columns to be updated:
            columns.id_last_message_spawn,
            columns.spawn_token,
            columns.spawn_type,
            columns.spawn_data,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in update_key){
            let updateKey = update_key[key];
            paramWhere.set(update_key[key], this[updateKey]);
        }

        await DB.update(tablename, paramSet, paramWhere);
    }

    initSpawnTimer(){
        
    }

    // getData(){
    //     let dataRet = {};
    //     let columns = DBM_Guild_Data.columns;
    //     for(var key in columns){
    //         dataRet[key] = this[key];
    //     }
    //     dataRet.spawnData = this.spawnData;
    //     return dataRet;
    // }

    //check if spawn_interval not null
    isSpawnActive(){
        if(this.spawn_interval!==null){
            return true;
        } else {
            return false;
        }
    }

    // static async updateData(id_guild, options){
    //     var arrParam = [];
    //     var querySet = ``;

    //     for (var keyOptions in options) {
    //         var valueOptions = options[keyOptions];
    //         switch(keyOptions){
    //             case DBM_Guild_Data.columns.spawn_type:
    //             case DBM_Guild_Data.columns.spawn_data:
    //             case DBM_Guild_Data.columns.id_channel_spawn:
    //             case DBM_Guild_Data.columns.id_roleping_cardcatcher:
    //             case DBM_Guild_Data.columns.id_last_message_spawn:
    //             case DBM_Guild_Data.columns.spawn_interval:
    //             case DBM_Guild_Data.columns.spawn_token:
    //             case DBM_Guild_Data.columns.spawn_data:
    //                 querySet+=` ${keyOptions} = ?, `;
    //                 arrParam.push(valueOptions);
    //                 break;
    //         }
    //     }

    //     querySet = querySet.replace(/,\s*$/, "");//remove last comma and space
    //     arrParam.push(id_guild);//push user id to arrParam

    //     var query = `UPDATE ${DBM_Guild_Data.TABLENAME} 
    //     SET ${querySet} 
    //     WHERE ${DBM_Guild_Data.columns.id_guild} = ?`;

    //     await DBConn.conn.query(query, arrParam);
    // }
}

module.exports = Guild;
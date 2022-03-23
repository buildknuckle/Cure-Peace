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

    //modifier
    spawner;

    constructor(guildData=null){
        if(guildData!=null){
            var spawner = require("./Spawner");
            this.spawner = new spawner.Spawner();
        }
        
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

    /**
     * @description get public guild data
     */
    static getData(guildId){
        return this.data[guildId];
    }

    /**
     * @description set guild data publically
     */
    static setData(guildId, Guild){
        this.data[guildId] = Guild;
    }

    /**
     * @param Spawner class of Spawner
     * @param {string} idLastMessageSpawn last message id
     */
    setSpawner(Spawner){
        this.spawner = Spawner;
        this.updateData();//update latest guild data
    }

    //set data to guild object publically
    updateData(){
        Guild.setData(this.id_guild, this);
    }

    async removeSpawn(){
        this.spawner.token = null;
        this.spawner.type = null;
        this.spawner.spawn = null;
        this.updateData();
        await this.updateDb();
    }

    //store to db:
    async updateDb(){//update all data
        let column = [//columns to be updated:
            columns.id_channel_spawn,
            columns.id_roleping_cardcatcher,
            columns.spawn_interval,
        ]

        let paramSet = new Map();
        let paramWhere = new Map();

        for(let key in column){
            let colVal = column[key];
            paramSet.set(column[key], this[colVal]);
        }
        
        for(let key in update_key){
            let updateKey = update_key[key];
            paramWhere.set(update_key[key],this[updateKey]);
        }

        await DB.update(tablename, paramSet, paramWhere);
    }

    // setGuildChannel(guildChannel){
    //     this.guildChannel = guildChannel;
    // }

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
        if(this.spawner!==null){
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Guild;
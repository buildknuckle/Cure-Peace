class Guild {
    //get 1 card guild data
    static async getData(id_guild){
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
        var resultCheckExist = await DB.select(DBM_Guild_Data.TABLENAME,mapWhere);
        if(resultCheckExist[0]==null){
            var mapWhere = new Map();
            mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
            await DB.insert(DBM_Guild_Data.TABLENAME,mapWhere);

            //reselect after insert new data
            mapWhere = new Map();
            mapWhere.set(DBM_Guild_Data.columns.id_guild,id_guild);
            var resultCheckExist = await DB.select(DBM_Guild_Data.TABLENAME,mapWhere);
        }

        return await resultCheckExist[0];
    }

    static async updateData(id_guild, options){
        var arrParam = [];
        var querySet = ``;

        for (var keyOptions in options) {
            var valueOptions = options[keyOptions];
            switch(keyOptions){
                case DBM_Guild_Data.columns.spawn_type:
                case DBM_Guild_Data.columns.spawn_data:
                case DBM_Guild_Data.columns.id_channel_spawn:
                case DBM_Guild_Data.columns.id_roleping_cardcatcher:
                case DBM_Guild_Data.columns.id_last_message_spawn:
                case DBM_Guild_Data.columns.spawn_interval:
                case DBM_Guild_Data.columns.spawn_token:
                case DBM_Guild_Data.columns.spawn_data:
                    querySet+=` ${keyOptions} = ?, `;
                    arrParam.push(valueOptions);
                    break;
            }
        }

        querySet = querySet.replace(/,\s*$/, "");//remove last comma and space
        arrParam.push(id_guild);//push user id to arrParam

        var query = `UPDATE ${DBM_Guild_Data.TABLENAME} 
        SET ${querySet} 
        WHERE ${DBM_Guild_Data.columns.id_guild} = ?`;

        await DBConn.conn.query(query, arrParam);
    }
}

module.exports = Guild;
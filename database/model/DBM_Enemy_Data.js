class DBM_Enemy_Data {
    static TABLENAME = "enemy_data";

    static columns = {
        id:"id",
        name:"name",
        series:"series",
        img:"img",
        weakness_color:"weakness_color",
        buff_desc:"buff_desc",
        buff_effect:"buff_effect",
        created_at: "created_at",
    }
}

module.exports = DBM_Enemy_Data;
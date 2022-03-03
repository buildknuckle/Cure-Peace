class DBM_Tradeboard {
    static TABLENAME = "tradeboard";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        category: "category",
        data_trade: "data_trade",
        last_update:"last_update"
    };
}

module.exports = DBM_Tradeboard;
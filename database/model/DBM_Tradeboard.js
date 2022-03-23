class DBM_Tradeboard {
    static TABLENAME = "tradeboard";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        category: "category",
        id_looking_for: "id_looking_for",
        id_offer: "id_offer",
        last_update:"last_update"
    };
}

module.exports = DBM_Tradeboard;
class DBM_Card_Tradeboard {
    static TABLENAME = "card_tradeboard";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        id_card_want: "id_card_want",
        id_card_have: "id_card_have",
        last_update:"last_update"
    };
}

module.exports = DBM_Card_Tradeboard;
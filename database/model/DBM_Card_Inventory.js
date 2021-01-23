class DBM_Card_Inventory {
    static TABLENAME = "card_inventory";

    static columns = {
        id: "id",
        id_user: "id_user",
        id_card: "id_card",
        created_at: "created_at"
    };
}

module.exports = DBM_Card_Inventory;
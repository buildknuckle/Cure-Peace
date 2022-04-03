class DBM_Card_Inventory {
    static TABLENAME = "card_inventory";

    static columns = {
        id: "id",
        id_user: "id_user",
        id_card: "id_card",
        level: "level",
        level_special: "level_special",
        stock: "stock",
        is_gold: "is_gold",
        received_at: "received_at"
    };
}

module.exports = DBM_Card_Inventory;
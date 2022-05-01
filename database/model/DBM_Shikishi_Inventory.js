class DBM_Shikishi_Inventory {
    static TABLENAME = "shikishi_inventory";

    static columns = {
        id: "id",
        id_user: "id_user",
        id_shikishi: "id_shikishi",
        stock: "stock",
        received_at: "received_at",
    };
}

module.exports = DBM_Shikishi_Inventory;
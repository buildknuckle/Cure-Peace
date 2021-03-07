class DBM_Pinky_Inventory {
    static TABLENAME = "pinky_inventory";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_pinky: "id_pinky",
        id_user: "id_user",
        created_at: "created_at",
    };
}

module.exports = DBM_Pinky_Inventory;
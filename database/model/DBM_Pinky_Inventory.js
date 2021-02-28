class DBM_Pinky_Inventory {
    static TABLENAME = "pinky_inventory";

    static columns = {
        id: "id",
        id_user: "id_user",
        id_pinkies: "id_pinky",
        created_at: "created_at",
    };
}

module.exports = DBM_Pinky_Inventory;
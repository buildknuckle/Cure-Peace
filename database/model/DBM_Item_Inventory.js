class DBM_Item_Inventory {
    static TABLENAME = "item_inventory";

    static columns = {
        id: "id", 
        id_user: "id_user",
        id_item: "id_item", 
        stock: "stock",
        additional_effect: "additional_effect"
    };
}

module.exports = DBM_Item_Inventory;
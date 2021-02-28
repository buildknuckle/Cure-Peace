class DBM_Item_Data {
    static TABLENAME = "item_data";

    static columns = {
        id: "id", 
        name: "name",
        category: "category",
        price_mofucoin: "price_mofucoin",
        img_url: "img_url",
        description: "description",
        effect_data: "effect_data",
        created_at: "created_at"
    };
}

module.exports = DBM_Item_Data;
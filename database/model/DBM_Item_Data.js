class DBM_Item_Data {
    static TABLENAME = "item_data";

    static columns = {
        id: "id", 
        name: "name",
        category: "category",
        is_purchasable_shop: "is_purchasable_shop",
        is_tradable: "is_tradable",
        price_mofucoin: "price_mofucoin",
        img_url: "img_url",
        description: "description",
        effect_data: "effect_data",
        extra_data: "extra_data",
        drop_rate: "drop_rate",
        created_at: "created_at"
    };
}

module.exports = DBM_Item_Data;
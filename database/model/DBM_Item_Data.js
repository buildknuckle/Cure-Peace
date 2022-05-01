class DBM_Item_Data {
    static TABLENAME = "item_data";

    static columns = {
        id_item: "id_item",
        name: "name",
        description: "description",
        keyword_search: "keyword_search",
        category: "category",
        img_url: "img_url",
        created_at: "created_at"
    };
}

module.exports = DBM_Item_Data;
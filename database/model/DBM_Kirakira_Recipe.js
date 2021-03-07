class DBM_Kirakira_Recipe {
    static TABLENAME = "kirakira_recipe";

    static columns = {
        id: "id", 
        id_item: "id_item",
        difficulty: "difficulty",
        id_item_ingredient: "id_item_ingredient",
        created_at: "created_at"
    };
}

module.exports = DBM_Kirakira_Recipe;
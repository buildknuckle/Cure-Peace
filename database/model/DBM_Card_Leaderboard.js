class DBM_Card_Leaderboard {
    static TABLENAME = "card_leaderboard";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        category: "category",
        completion: "completion",
        created_at:"created_at"
    };
}

module.exports = DBM_Card_Leaderboard;
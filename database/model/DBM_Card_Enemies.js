class DBM_Card_Enemies {
    static TABLENAME = "card_enemies";

    static columns = {
        id: "id",
        name: "name",
        series: "series",
        img_url: "img_url",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_Enemies;
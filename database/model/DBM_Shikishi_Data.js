class DBM_Shikishi_Data {
    static TABLENAME = "shikishi_data";

    static columns = {
        id_shikishi: "id_shikishi",
        name: "name",
        img_url: "img_url",
        pack: "pack",
        series: "series",
    };
}

module.exports = DBM_Shikishi_Data;
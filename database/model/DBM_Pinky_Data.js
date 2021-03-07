class DBM_Pinky_Data {
    static TABLENAME = "pinky_data";

    static columns = {
        id_pinky: "id_pinky",
        name: "name",
        category: "category",
        img_url: "img_url",
        created_at: "created_at",
    };
}

module.exports = DBM_Pinky_Data;
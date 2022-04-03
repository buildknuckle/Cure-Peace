class DBM_User_Data {
    static TABLENAME = "user_data";

    static columns = {
        id_user: "id_user",
        last_checkIn_date: "last_checkIn_date",
        token_sale: "token_sale",
        peace_point: "peace_point",
        set_color:"set_color",
        set_series:"set_series",
        color_data:"color_data",
        currency_data:"currency_data",
        series_data:"series_data",
        gardening_data:"gardening_data",
        dailyQuest_data:"dailyQuest_data"
    };
}

module.exports = DBM_User_Data;
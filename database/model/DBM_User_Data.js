class DBM_User_Data {
    static TABLENAME = "user_data";

    static columns = {
        id_user: "id_user",
        server_id_login: "server_id_login",
        daily_data: "daily_data",
        token_sale: "token_sale",
        token_cardspawn: "token_cardspawn",
        peace_point: "peace_point",
        set_color:"set_color",
        set_series:"set_series",
        color_data:"color_data",
        currency_data:"currency_data",
        series_data:"series_data",
        gardening_data:"gardening_data",
    };

    static dataKey = {
        daily_data:{
            lastCheckInDate:"lastCheckInDate",
            lastQuestDate:"lastQuestDate",
            quest:{
                card:"card",
                kirakiraDelivery:"kirakiraDelivery",
                battle:"battle"
            }
        }
    }
}

module.exports = DBM_User_Data;
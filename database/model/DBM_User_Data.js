class DBM_User_Data {
    static TABLENAME = "user_data";

    static columns = {
        id_user: "id_user",
        server_id_login: "server_id_login",
        daily_data: "daily_data",
        token_sale: "token_sale",
        token_cardspawn: "token_cardspawn",
        point_peace: "point_peace",
        avatar_id:"avatar_id",
        avatar_form:"avatar_form",
        avatar_token:"avatar_token",
        avatar_main_data:"avatar_main_data",
        avatar_support_data:"avatar_support_data",
        status_effect_data:"status_effect_data",
        battle_data:"battle_data",
        equip_data:"equip_data",
        set_color:"set_color",
        set_series:"set_series",
        color_data:"color_data",
        currency_data:"currency_data",
        series_data:"series_data",
        gardening_data:"gardening_data",

    };
}

module.exports = DBM_User_Data;
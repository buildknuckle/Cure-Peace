class DBM_Card_User_Data {
    static TABLENAME = "card_user_data";

    static columns = {
        id_user: "id_user", 
        level: "level",
        exp: "exp",
        daily_last: "daily_last",
        spawn_token: "spawn_token",
        card_id_selected: "card_id_selected",
        card_set_token: "card_set_token",
        status_effect: "status_effect",
        mofucoin: "mofucoin",
        color: "color",
        color_level_pink: "color_level_pink",
        color_point_pink: "color_point_pink",
        color_level_blue: "color_level_blue",
        color_point_blue: "color_point_blue",
        color_level_yellow: "color_level_yellow",
        color_point_yellow: "color_point_yellow",
        color_level_purple: "color_level_purple",
        color_point_purple: "color_point_purple",
        color_level_red: "color_level_red",
        color_point_red: "color_point_red",
        color_level_green: "color_level_green",
        color_point_green: "color_point_green",
        color_level_white: "color_level_white",
        color_point_white: "color_point_white",
        hp: "hp",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_User_Data;
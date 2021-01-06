class DBM_Card_User_Data {
    static TABLENAME = "card_user_data";

    static columns = {
        id_user: "id_user", 
        level: "level",
        exp: "exp",
        action_token: "action_token",
        card_id_selected: "card_id_selected",
        color: "color",
        color_level_pink: "color_level_pink",
        color_exp_pink: "color_exp_pink",
        color_level_blue: "color_level_blue",
        color_exp_blue: "color_exp_blue",
        color_level_yellow: "color_level_yellow",
        color_exp_yellow: "color_exp_yellow",
        color_level_purple: "color_level_purple",
        color_exp_purple: "color_exp_purple",
        color_level_green: "color_level_green",
        color_exp_green: "color_exp_green",
        color_level_white: "color_level_white",
        color_exp_white: "color_exp_white",
        hp: "hp",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_User_Data;
class DBM_User_Data {
    static TABLENAME = "user_data";

    static columns = {
        id_user: "id_user",
        gardening_level: "gardening_level",
        gardening_point: "gardening_point",
        gardening_plot_data: "gardening_plot_data",
        gardening_activity_data: "gardening_activity_data",
    };
}

module.exports = DBM_User_Data;
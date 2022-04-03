class DBM_Badge_User {
    static TABLENAME = "badge_user";

    static columns = {
        id_user: "id_user",
        nickname: "nickname",
        favorite_series: "favorite_series",
        favorite_character: "favorite_character",
        color: "color",
        img_cover: "img_cover",
        about:"about",
        created_at:"created_at"
    };
}

module.exports = DBM_Badge_User;
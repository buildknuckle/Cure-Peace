class DBM_User_Gacha {
    static TABLENAME = "user_gacha";

    static columns = {
        id_user:"id_user",
        last_daily_gacha_date:"last_daily_gacha_date",
        last_tropicalcatch_gacha_date:"last_tropicalcatch_gacha_date"
    };
}

module.exports = DBM_User_Gacha;
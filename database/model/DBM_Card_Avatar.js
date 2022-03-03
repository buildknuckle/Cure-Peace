class DBM_Card_Battle {
    static TABLENAME = "card_avatar";

    static columns = {
        id_user: "id_user",
        id_main:"id_main",
        equip_main:"equip_main",
        id_support1:"id_support1",
        id_support2:"id_support2",
    }
}

module.exports = DBM_Card_Battle;
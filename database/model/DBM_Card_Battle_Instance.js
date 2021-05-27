class DBM_Card_Battle_Instance {
    static TABLENAME = "card_battle_instance";

    static columns = {
        id: "id",
        id_user: "id_user",
        data_enemy: "data_enemy",
        final_complete: "final_complete",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_Battle_Instance;
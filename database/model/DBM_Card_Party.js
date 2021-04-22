class DBM_Card_Party {
    static TABLENAME = "card_party";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        name: "name",
        party_data: "party_data",
        party_point: "party_point",
        special_point: "special_point",
        spawn_token: "spawn_token",
        last_charge: "last_charge",
        created_at:"created_at"
    };
}

module.exports = DBM_Card_Party;
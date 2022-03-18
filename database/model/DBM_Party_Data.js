class DBM_Party_Data {
    static TABLENAME = "party_data";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        name: "name",
        id_leader: "id_leader",
        id_member: "id_member",
        party_point: "party_point",
        spawn_token: "spawn_token",
        last_charge: "last_charge",
        created_at:"created_at"
    };
}

module.exports = DBM_Party_Data;
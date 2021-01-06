class DBM_Card_Guild {
    static TABLENAME = "card_guild";

    static columns = {
        id_guild: "id_guild",
        id_channel_spawn: "id_channel_spawn",
        id_channel_invade: "id_channel_invade",
        spawn_interval: "spawn_interval",
        spawn_token: "spawn_token",
        spawn_id: "spawn_id",
        spawn_color: "spawn_color",
    };
}

module.exports = DBM_Card_Guild;
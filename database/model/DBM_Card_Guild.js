class DBM_Card_Guild {
    static TABLENAME = "card_guild";

    static spawnType = {
        normal:"normal",
        color:"color",
        combat:"combat"
    }

    static columns = {
        id_guild: "id_guild",
        id_channel_spawn: "id_channel_spawn",
        id_channel_invade: "id_channel_invade",
        id_cardcatcher: "id_cardcatcher",
        id_last_message_spawn: "id_last_message_spawn",
        spawn_interval: "spawn_interval",
        spawn_token: "spawn_token",
        spawn_type: "spawn_type",
        spawn_id: "spawn_id",
        spawn_data: "spawn_data",
        spawn_color: "spawn_color",
        spawn_number: "spawn_number",
        completion_date_pinky: "completion_date_pinky"
    };
}

module.exports = DBM_Card_Guild;
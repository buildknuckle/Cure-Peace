class DBM_Guild_Data {
    static TABLENAME = "guild_data";

    static columns = {
        id_guild: "id_guild",
        id_channel_spawn: "id_channel_spawn",
        id_roleping_cardcatcher: "id_roleping_cardcatcher",
        id_last_message_spawn: "id_last_message_spawn",
        spawn_interval: "spawn_interval",
        spawn_token: "spawn_token",
        spawn_type: "spawn_type",
        spawn_data: "spawn_data",
        completion_date_pinky: "completion_date_pinky",
        sale_shop_data_hariham: "sale_shop_data_hariham",
    };
}

module.exports = DBM_Guild_Data;
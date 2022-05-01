class DBM_Birthday_Guild {

    static TABLENAME = "birthday_guild";

    static columns = {
        id_guild: "id_guild",
        id_notification_channel: "id_notification_channel",
        notification_hour: 'notification_hour',
        enabled: "enabled"
    };
}

module.exports = DBM_Birthday_Guild;
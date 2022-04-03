class DBM_Birthday {
    static TABLENAME = "birthday";

    static columns = {
        id: "id",
        id_guild: "id_guild",
        id_user: "id_user",
        birthday: "birthday",
        label: "label",
        notes: "notes",
        enabled: "enabled"
    };
}

module.exports = DBM_Birthday;
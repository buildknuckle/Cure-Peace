class DBM_Admin {
    static TABLENAME = "admin";

    static columns = {
        id_user: "id_user",
        role:"role",
        created_at:"created_at",
    }
}

module.exports = DBM_Admin;
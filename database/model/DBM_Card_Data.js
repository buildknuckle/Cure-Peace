class DBM_Card_Data {
    static TABLENAME = "card_data";

    static columns = {
        id_card: "id_card",
        color: "color",
        series: "series",
        pack: "pack",
        rarity: "rarity",
        name: "name",
        img_url: "img_url",
        img_url_upgrade1: "img_url_upgrade1",
        hp_base: "hp_base",
        atk_base: "atk_base",
        is_spawnable:"is_spawnable",
        is_tradable:"is_tradable",
        patch_ver:"patch_ver",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_Data;
class DBM_Card_Data {
    static TABLENAME = "card_data";

    static columns = {
        id_card: "id_card",
        color: "color",
        pack: "pack",
        rarity: "rarity",
        name: "name",
        img_url: "img_url",
        max_hp: "max_hp",
        max_atk: "max_atk",
        ability1: "ability1",
        ability2: "ability2",
        skill1: "skill1",
        skill2: "skill2",
        special: "special",
        created_at: "created_at",
    };
}

module.exports = DBM_Card_Data;
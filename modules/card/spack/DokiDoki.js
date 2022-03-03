class Properties {
    static value = "dokidoki";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
        mascot_emoji:"<:m8_davi:936237025609261106>"
    }
    static name = "Doki Doki";
    static currency = {
        name:"Lovead Points",
        icon_emoji:"<:m8_davi:936237025609261106>"
    };
    static theme = "emotions and selflessness";
    static location = {
        name:"Oogai Town",
        icon:"https://static.wikia.nocookie.net/prettycure/images/4/4a/Clover_Tower_.jpg",
    };
}

class Battle {
    static party_special = "Royal Lovely Straight Flush";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "jikochuu";
    static name = "Jikochuu";
    static catchphrase = "Jikochuu!";
    static chaos_meter = "selfish";
    static data = {};//will be loaded from init

}

module.exports = {
    Properties, Battle, Monsters
}
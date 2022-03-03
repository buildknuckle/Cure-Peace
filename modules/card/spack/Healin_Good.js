class Properties {
    static value = "healin_good";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/936266739841372160/healin_good.png",
        mascot_emoji:"<:m15_rabirin:936237024724262923>"
    }
    
    static name = "Healin' Good";
    static currency = {
        name:"Elemental Points",
        icon_emoji:"<:m15_rabirin:936237024724262923>"
    };
    static theme = "health, nature, and animals";
    static location = {
        name:"Sukoyaka City",
        icon:"https://static.wikia.nocookie.net/prettycure/images/a/a6/HGPC14_Nodoka%27s_voice_echoes_throughout_Sukoyaka_City.jpg",
    };
}

class Battle {
    static party_special = "Healing Oasis";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "megabyogen";
    static name = "Megabyogen";
    static catchphrase = "Mega!";
    static chaos_meter = "virus";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
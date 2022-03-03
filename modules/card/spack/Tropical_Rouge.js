class Properties {
    static value = "tropical_rouge";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/832917823122571294/927540812659687444/deb2gk0-c438e38e-61d7-454f-b57e-eca1f24dddda.png",
        mascot_emoji:"<:m16_kururun:936237022274781215>"
    }
    static name = "Tropical-Rouge!";
    static currency = {
        name:"Tropi Points",
        icon_emoji:"<:m16_kururun:936237022274781215>"
    };
    static theme = "mermaids and club activities";
    static location = {
        name:"Aozora City",
        icon:"https://static.wikia.nocookie.net/prettycure/images/1/14/TRPC01_Aozora_City.jpg",
    };
}

class Battle {
    static party_special = "Mix Tropical";
    static img_party_special = "https://cdn.discordapp.com/attachments/832917823122571294/927542773899460658/1000.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "yaraneeda";
    static name = "Yaraneeda";
    static catchphrase = "Yaraneeda!";
    static chaos_meter = "demotivation";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
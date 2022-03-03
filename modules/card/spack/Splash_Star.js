class Properties {
    static value = "splash_star";
    static icon = {
        series:"https://cdn.discordapp.com/attachments/793415946738860072/845617466529021962/Puzzlun_data_download_cures_4.png",
        mascot_emoji:"<:m2_flappy:936237022111219742>"
    }
    static name = "Splash Star";
    static currency = {
        name:"Miracle Drop Points",
        icon_emoji:"<:m2_flappy:936237022111219742>"
    }
    
    static theme = "flower, bird, wind and moon";
    static location = {
        name:"Land of Greenery",
        icon:"https://static.wikia.nocookie.net/prettycure/images/b/b4/FwPCSS01_-_Ocean_town_Yuunagi.png",
    };

}

class Battle {
    static party_special = "Spiral Heart Splash";
    static img_party_special = "https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png";
}

class Monsters {
    static color = [];//color availability, will be loaded from init
    static value = "uzaina";
    static name = "Uzaina";
    static chaos_meter = "havoc";
    static data = {};//will be loaded from init
}

module.exports = {
    Properties, Battle, Monsters
}
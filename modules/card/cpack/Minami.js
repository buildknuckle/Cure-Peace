class Properties {
    static icon = "https://waa.ai/JEwX.png";
    static color = "blue";
    static fullname = "Minami Kaidou";
    static alter_ego = "Cure Mermaid";
    static hint_chiguhaguu = "Princess of the crystal clear seas! <x>!";
    static total = 0;
    static series = "go_princess";
}

class Avatar {
    static normal = {
        icon : "https://waa.ai/JEwX.png",
        name : "Cure Mermaid",
        transform_quotes1 : "Pretty Cure, Princess Engage!",
        transform_quotes2 : "Princess of the crystal clear seas! Cure Mermaid!",
        special_attack : "Mermaid Ripple",
        img_special_attack : "https://cdn.discordapp.com/attachments/793389777361174549/817786645037711390/unknown.png",
        img_transformation : "https://cdn.discordapp.com/attachments/793389777361174549/822055972255825958/image0.gif",
        skill:{
            passive:{}
        }
    }
}

module.exports = {
    Properties, Avatar
}
class Properties {
    static icon = "https://static.wikia.nocookie.net/prettycure/images/7/71/Puzzlun_Sprite_HPC_Cure_Moonlight.png";
    static color = "purple";
    static fullname = "Yuri Tsukikage";
    static alter_ego = "Cure Moonlight";
    static hint_chiguhaguu = "The flower that shines in the moon's light, <x>!";
    static total = 0;
    static series = "heartcatch";
}

class Form {
    static normal = {
        name:"Cure Moonlight",
        transform_quotes1:"Pretty Cure! Open My Heart!",
        transform_quotes2:"The flower that shines in the moon's light, Cure Moonlight!",
        special_attack:"Silver Forte Wave",
        img_special_attack:"https://cdn.discordapp.com/attachments/793383243750703144/817782029147832360/unknown.png",
        img_transformation:"https://cdn.discordapp.com/attachments/793383243750703144/822048055788437504/image0.gif",
    }
}

module.exports = {
    Properties, Form
}
module.exports = class Form {
    static Properties = {
        cp_cost:"cp_cost",
        item_require:"item_require"
    }

    static dataForm = {
        nagisa:{
            0:{
                name:"Cure Black (Original)",
                img_url:"https://static.wikia.nocookie.net/prettycure/images/1/16/Puzzlun_Sprite_FwPC_Cure_Black.png",
                henshin_phrase:"Dual Aurora Wave!",
                transform_quotes:"Emissary of light, Cure Black!",
                special_attack:"Marble Screw",
                img_special_attack:"https://cdn.discordapp.com/attachments/793374640839458837/817775242729881660/unknown.png",
                skill:{
                    0:{
                        name:"Marble Screw Max",
                        description:"Take down zakenna with pink/white color",
                        cp_cost:100,
                        color_removal:["pink","white"]
                    }
                },
            }
        }
    }

}
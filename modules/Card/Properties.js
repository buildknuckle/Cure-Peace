module.exports =class Properties {
    static emoji = {
        mofuheart:"<:mofuheart:824281257276866560>",
        //color:
        color_pink:"<:color_pink:935901707026714714>",
        color_blue:"<:color_blue:935901706837975080>",
        color_green:"<:color_green:935901706804412477>",
        color_purple:"<:color_purple:935903379044065290>",
        color_red:"<:color_red:935901706473050173>",
        color_yellow:"<:color_yellow:935901706770845736>",
        color_white:"<:color_white:935903763741429800>",
        //rarity:
        r1:"<:r1:935903782770966528>",
        r6:"<:r6:935903799317499954>",
        r7:"<:r7:935903814358270023>",
        //checkmark
        aoi_check_green:"<:aoi_check_green:935956208727232522>",
        aoi_x:"<:aoi_x:935956209264107591>",
        //card
        card_pink:"<:card_pink:936239224481542144>",
        card_blue:"<:card_blue:936239222040428554>",
        card_yellow:"<:card_yellow:936239224527671326>", 
        card_green:"<:card_green:936239225664307231>",
        card_red:"<:card_red:936239224057892895>",
        card_purple:"<:card_purple:936239224284381224>", 
        card_white:"<:card_white:936239224372469770>",
        //currency
        mofucoin:"<:mofucoin:936238607331639356>",
        jewel:"<:jewel:936238609248448532>",
        peacepoint:"<:peacepoint:936238606660554773>",
        //mascot
        m1_mepple:"<:m1_mepple:936237021293322290>",
        m2_flappy:"<:m2_flappy:936237022111219742>",
        m3_coco:"<:m3_coco:936237022044110898>",
        m4_chiffon:"<:m4_chiffon:936237021616275496>",
        m5_cyphre:"<:m5_cyphre:936237021599518801>",
        m6_hummy:"<:m6_hummy:936237021716946964>",
        m7_candy:"<:m7_candy:936237023747014726>",
        m8_davi:"<:m8_davi:936237025609261106>",
        m9_ribbon:"<:m9_ribbon:936237024602628096>",
        m10_aroma:"<:m10_aroma:936237022056710154>",
        m11_mofurun:"<:m11_mofurun:936237023465984050> ", 
        m12_pekorin:"<:m12_pekorin:936237024149659689>",
        m13_hariham:"<:m13_hariham:936237022803275777>",
        m14_fuwa:"<:m14_fuwa:936237029157658625>",
        m15_rabirin:"<:m15_rabirin:936237024724262923>", 
        m16_kururun:"<:m16_kururun:936237022274781215>"
    }

    static imgMofu = {
        ok: "https://waa.ai/JEwn.png",
        error: "https://waa.ai/JEw5.png",
        panic: "https://waa.ai/JEwr.png",
        peek: "https://waa.ai/JEyE.png",
    }

    static arrPackList = [];
    static arrSeriesList = [];
    static color = {
        pink:{
            value:"pink",
            icon:this.emoji.color_pink,
            icon_card:this.emoji.card_pink
        },
        blue:{
            value:"blue",
            icon:this.emoji.color_blue,
            icon_card:this.emoji.card_blue
        },
        red:{
            value:"red",
            icon:this.emoji.color_red,
            icon_card:this.emoji.card_red
        },
        yellow:{
            value:"yellow",
            icon:this.emoji.color_yellow,
            icon_card:this.emoji.card_yellow
        },
        green:{
            value:"green",
            icon:this.emoji.color_green,
            icon_card:this.emoji.card_green
        },
        purple:{
            value:"purple",
            icon:this.emoji.color_purple,
            icon_card:this.emoji.card_purple
        },
        white:{
            value:"white",
            icon:this.emoji.color_white,
            icon_card:this.emoji.card_white
        },
    };

    static currency = {
        mofucoin:{
            value:"mofucoin",
            name:"Mofucoin",
            icon_emoji:this.emoji.mofucoin
        },
        jewel:{
            value:"jewel",
            name:"Jewel",
            icon_emoji:this.emoji.jewel
        }
    }
}
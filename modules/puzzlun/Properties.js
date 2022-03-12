class Properties {
    static emoji = Object.freeze({
        //rarity:
        r1:"<:r1:935903782770966528>",
        r6:"<:r6:935903799317499954>",
        r7:"<:r7:935903814358270023>",
        //checkmark
        aoi_check_green:"<:aoi_check_green:935956208727232522>",
        aoi_x:"<:aoi_x:935956209264107591>",
        mofuheart:"<:mofuheart:824281257276866560>",
        
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
        m11_mofurun:"<:m11_mofurun:936237023465984050>", 
        m12_pekorin:"<:m12_pekorin:936237024149659689>",
        m13_hariham:"<:m13_hariham:936237022803275777>",
        m14_fuwa:"<:m14_fuwa:936237029157658625>",
        m15_rabirin:"<:m15_rabirin:936237024724262923>", 
        m16_kururun:"<:m16_kururun:936237022274781215>",
        milight:"<a:milight:945511262832459796>"
    });
    
    static imgSet = Object.freeze({
        mofu:{
            ok: "https://waa.ai/JEwn.png",
            error: "https://waa.ai/JEw5.png",
            panic: "https://waa.ai/JEwr.png",
            peek: "https://waa.ai/JEyE.png",
            wave: "https://waa.ai/SXby.png",
            thumbsup: "https://waa.ai/fuoH.png"
        }
    })
    
    static color = Object.freeze({
        pink:{
            value:"pink",
            emoji:`<:color_pink:935901707026714714>`,
            emoji_card:`<:card_pink:936239224481542144>`,
            embed_color:"#FEA1E6",
            getLabel(val){
                return `${val} ${this.emoji}`;
            }
        },
        blue:{
            value:"blue",
            emoji:`<:color_blue:935901706837975080>`,
            emoji_card:`<:card_blue:936239222040428554>`,
            embed_color:"#7FC7FF",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
        red:{
            value:"red",
            emoji:`<:color_red:935901706473050173>`,
            emoji_card:`<:card_red:936239224057892895>`,
            embed_color:"#FF9389",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
        yellow:{
            value:"yellow",
            emoji:`<:color_yellow:935901706770845736>`,
            emoji_card:`<:card_yellow:936239224527671326>`,
            embed_color:"#FDF13B",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
        green:{
            value:"green",
            emoji:`<:color_green:935901706804412477>`,
            emoji_card:`<:card_green:936239225664307231>`,
            embed_color:"#7CF885",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
        purple:{
            value:"purple",
            emoji:`<:color_purple:935903379044065290>`,
            emoji_card:`<:card_purple:936239224284381224>`,
            embed_color:"#897CFE",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
        white:{
            value:"white",
            emoji:`<:color_white:935903763741429800>`,
            emoji_card:`<:card_white:936239224372469770>`,
            embed_color:"#FFFFEA",
            getLabel: function(val){
                return `${val} ${this.emoji}`;
            }
        },
    });
    
    static currency = Object.freeze({
        mofucoin:{
            value:"mofucoin",
            name:"Mofucoin",
            emoji:"<:mofucoin:936238607331639356>"
        },
        jewel:{
            value:"jewel",
            name:"Jewel",
            emoji:"<:jewel:936238609248448532>"
        },
    })
}

module.exports = Properties;
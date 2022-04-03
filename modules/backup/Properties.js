const StatusDataModules = require("../StatusData");
const SkillsModules = require("../card/Skills");
const FormModules = require("../card/Form");

var interactionList = {
    series:[
        {
            name: "max-heart",
            value: "max heart"
        },
        {
            name: "splash-star",
            value: "splash star"
        },
        {
            name: "yes-precure-5-gogo",
            value: "yes! precure 5 gogo!"
        },
        {
            name: "fresh",
            value: "fresh"
        },
        {
            name: "heartcatch",
            value: "heartcatch"
        },
        {
            name: "suite",
            value: "suite"
        },
        {
            name: "smile",
            value: "smile"
        },
        {
            name: "doki-doki",
            value: "doki doki!"
        },
        {
            name: "happiness",
            value: "happiness"
        },
        {
            name: "go-princess",
            value: "go! princess"
        },
        {
            name: "mahou-tsukai",
            value: "mahou tsukai"
        },
        {
            name: "kirakira",
            value: "kirakira"
        },
        {
            name: "hugtto",
            value: "hugtto"
        },
        {
            name: "star-twinkle",
            value: "star twinkle"
        },
        {
            name: "healin-good",
            value: "healin' good"
        }
    ],
    color:[
        {
            name: "pink",
            value: "pink"
        },
        {
            name: "blue",
            value: "blue"
        },
        {
            name: "yellow",
            value: "yellow"
        },
        {
            name: "purple",
            value: "purple"
        },
        {
            name: "red",
            value: "red"
        },
        {
            name: "green",
            value: "green"
        },
        {
            name: "white",
            value: "white"
        }
    ]
}

var dataColorCore = {
    pink:{
        value:'pink',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#FEA1E6",
        total:194,
        skill_scan:SkillsModules.scanData.scan_color
    },
    blue:{
        value:'blue',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#7FC7FF",
        total:136,
        skill_scan:SkillsModules.scanData.scan_color
    },
    red:{
        value:'red',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#FF9389",
        total:87,
        skill_scan:SkillsModules.scanData.scan_color
    },
    yellow:{
        value:'yellow',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#FDF13B",
        total:152,
        skill_scan:SkillsModules.scanData.scan_rarity
    },
    green:{
        value:'green',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#7CF885",
        total:62,
        skill_scan:SkillsModules.scanData.scan_type
    },
    purple:{
        value:'purple',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#897CFE",
        total:102,
        skill_scan:SkillsModules.scanData.scan_rarity
    },
    white:{
        value:'white',
        imgMysteryUrl:"https://waa.ai/JEyE.png",
        color:"#FFFFEA",
        total:40,
        // skills:{
        //     1:{
        //         cp_cost:50,
        //         buff_data:StatusEffect.cureSkillsBuffData.cure_blessing
        //     }
        // },
        skill_scan:SkillsModules.scanData.scan_type
    },
    all:{
        imgMysteryUrl:"https://waa.ai/JEyE.png"
    },
    interactionColorList:[
        {
            name: "pink",
            value: "pink"
        },
        {
            name: "blue",
            value: "blue"
        },
        {
            name: "yellow",
            value: "yellow"
        },
        {
            name: "purple",
            value: "purple"
        },
        {
            name: "red",
            value: "red"
        },
        {
            name: "green",
            value: "green"
        },
        {
            name: "white",
            value: "white"
        }
    ],
    arrColor:["pink","purple","green","yellow","white","blue","red"]
};

var seriesCardCore =  {
    "max_heart":{
        value:"max_heart",
        name:"Max Heart",
        special_name:"Extreme Luminario",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617394872614942/latest.png",
        currency:"Heartiel Points",
        type_monster:"zakenna"
    },
    "splash_star":{
        value:"splash_star",
        name:"Splash Star",
        special_name:"Spiral Heart Splash",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146180845207602/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617466529021962/Puzzlun_data_download_cures_4.png",
        currency:"Miracle Drop Points",
        type_monster:"uzaina"
    },
    "yes5gogo":{
        value:"yes5gogo",
        name:"Yes! Precure 5 GoGo!",
        special_name:"Milky Rose Floral Explosion",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146259148668965/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617508936974357/latest.png",
        currency:"Palmin Points",
        type_monster:"hoshina"
    },
    "fresh":{
        value:"fresh",
        name:"Fresh",
        special_name:"Lucky Clover Grand Finale",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146317411483688/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617558089367552/latest.png",
        currency:"Linkrun Points",
        type_monster:"nakewameke"
    },
    "heartcatch":{
        value:"heartcatch",
        name:"HeartCatch",
        special_name:"Heartcatch Orchestra",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824149388389646336/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617596086878239/latest.png",
        currency:"Heart Seed Points",
        type_monster:"desertrian"
    },
    "suite":{
        value:"suite",
        name:"Suite",
        special_name:"Suite Session Ensemble Crescendo",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824150226645680138/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617647847473160/latest.png",
        currency:"Melody Note Points",
        type_monster:"negatone"
    },
    "smile":{
        value:"smile",
        name:"Smile",
        special_name:"Royal Rainbow Burst",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824151822146207764/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617680399728690/latest.png",
        currency:"Decor Points",
        type_monster:"akanbe"
    },
    "dokidoki":{
        value:"dokidoki",
        name:"DokiDoki!",
        special_name:"Royal Lovely Straight Flush",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617720019648512/latest.png",
        currency:"Lovead Points",
        type_monster:"jikochuu"
    },
    "happiness":{
        value:"happiness",
        name:"Happiness Charge",
        special_name:"Innocent Purification",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617795240034314/latest.png",
        currency:"Precard Points",
        type_monster:"saiarks"
    },
    "go_princess":{
        value:"go_princess",
        name:"Go! Princess",
        special_name:"Grand Printemps",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617826264776724/latest.png",
        currency:"Princess Points",
        type_monster:"zetsuborg"
    },
    "mahou_tsukai":{
        value:"mahou_tsukai",
        name:"Mahou Tsukai",
        special_name:"Extreme Rainbow",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617868665782302/latest.png",
        currency:"Linkle Points",
        type_monster:"yokubaru"
    },
    "kirakira":{
        value:"kirakira",
        name:"KiraKira",
        special_name:"Fantastic Animale",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845617928208515082/latest.png",
        currency:"Kirakiraru",
        type_monster:"kirakirarun_thieves"
    },
    "hugtto":{
        value:"hugtto",
        name:"HUGtto!",
        special_name:"Minna de Tomorrow",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156303525019648/image0.webp",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845618022843809842/latest.png",
        currency:"Mirai Crystal Points",
        type_monster:"oshimaida"
    },
    "star_twinkle":{
        value:"star_twinkle",
        name:"Star Twinkle",
        special_name:"Star Twinkle Imagination",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156329014460416/image0.png",
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/845618044655239188/latest.png",
        currency:"Twinkle Points",
        type_monster:"nottrigger"
    },
    "healin_good":{
        value:"healin_good",
        name:"Healin' Good",
        special_name:"Healing Oasis",
        img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png",
        icon:"",
        currency:"Elemental Points",
        type_monster:"megabyogen"
    },
    "tropical_rouge":{
        value:"tropical_rouge",
        name:"Tropical-Rouge!",
        special_name:"Mix Tropical",
        img_team_attack:"",
        icon:"",
        currency:"Tropi Points",
        type_monster:"yaraneda"
    },
    arrSeriesList: ["sp001","sp002","sp003","sp004","sp005","sp006","sp007","sp008","sp009","sp010","sp011","sp012","sp013","sp014","sp015"],
    arrSeriesName: ["max heart","splash star","yes! precure 5 gogo!","fresh","heartcatch","suite","smile","doki doki!","happiness","go! princess","mahou tsukai","kirakira","hugtto","star twinkle","healin' good"],
}

module.exports = {
    interactionList,
    dataColorCore,
    embedStyle: {
        color:'#efcc2c',
        imgResponse:{
            imgOk: "https://waa.ai/JEwn.png",
            imgError: "https://waa.ai/JEw5.png",
            imgFailed: "https://waa.ai/JEwr.png"
        }
    },
    limit: {
        colorpoint:3000,
        mofucoin:3000,
        seriespoint:1000,
        maximumCard:120
    }, 
    cardCategory: {
        normal:{
            value:"normal",
            color:'#efcc2c',
            rarityBoost:0
        },
        gold:{
            value:"gold",
            color:'#c99914',
            rarityBoost:1
        }
    }, 
    objSpawnType: {
        battle:25,
        quiz:20,
        normal:20,
        number:15,
        color:10,
        series:10
    },
    spawnType: ["normal","battle","number","quiz","color","series"],
    spawnData: {
        normal:{
            id_card:"id_card",
        },
        quiz:{
            //for column structure:
            type:"type",
            answer:"answer",
            id_card:"id_card",
            //for the embed image
            embed_img:"https://waa.ai/JEyE.png",
            //for the value type:
            typeNormal:"normal",
            typeTsunagarus:"tsunagarus",
            typeStarTwinkleStarsCount:"star twinkle star count",
            typeStarTwinkleConstellation:"star twinkle constellation",
            //for twinkle spawn
            totalStars:"totalStars"
        },
        color:{
            //for column structure:
            pink:"pink",
            purple:"purple",
            green:"green",
            yellow:"yellow",
            white:"white",
            blue:"blue",
            red:"red",
            //for the embed image
            embed_img:"https://waa.ai/JEyE.png"
        },
        battle:{
            category:"category",//battle category: normal/boss
            type:"type",//enemy type
            level:"level",//the level of the enemy
            color:"color",
            color_block:"color_block",
            color_absorb:"color_absorb",
            color_non:"color_non",//non color condition
            //for color condition
            color_lives:"color_lives",
            rarity:"rarity",
            rarity_less:"rarity_less",//less
            rarity_more:"rarity_more",//more rarity
            id_enemy:"id_enemy",
            id_card_reward:"id_card_reward",
            special_allow:"special_allow",//true: special can be used,
            //hp key
            hp1:"hp1",
            hp2:"hp2",
            hp3:"hp3",
            hp4:"hp4",
            hp5:"hp5",
            hp:"hp",
            hp_max:"hp_max",
            //atk key
            atk1:"atk1",
            atk2:"atk2",
            atk3:"atk3",
            atk4:"atk4",
            atk5:"atk5",
            damage_dealer:"damage_dealer",
            traits:"traits",
            actions:"actions",
            turn:"turn",//battle attempt with limit
            turn_mechanics:"turn_mechanics",//for mechanics
            actions_mechanics:"actions_mechanics",
            turn_max:"turn_max",
            color_lives_down:"color_down"
        },
        battle_executive:{
            series:"series",
            color:"color",
            non_color:"non_color",
            level:"level",
            card_level:"card_level"
        }
    },
    arrColor: dataColorCore.arrColor,
    seriesCardCore,
    dataCardCore: {
        nagisa:{
            total:16,
            icon:"https://waa.ai/JEVB.png",
            color:dataColorCore.pink.value,
            fullname:"Nagisa Misumi",
            alter_ego:"Cure Black",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure Black!",
            special_attack:"Marble Screw",
            img_special_attack:"https://cdn.discordapp.com/attachments/793374640839458837/817775242729881660/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Emissary of light, <x>!",
            base_chance:{
                rock:40,
                paper:60,
                scissors:40
            },
            form:FormModules.dataForm.nagisa,
            skills:SkillsModules.dataSkill.nagisa
        },
        saki:{
            total:12,
            icon:"https://waa.ai/JEVI.png",
            color:dataColorCore.pink.value,
            fullname:"Saki Hyuuga",
            alter_ego:"Cure Bloom",
            henshin_phrase:"Dual Spiritual Wave!",
            transform_quotes:"The shining golden flower, Cure Bloom!",
            special_attack:"Spiral Star Splash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793378822976045096/817775703444684820/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The shining golden flower, <x>!",
        },
        nozomi:{
            total:11,
            icon:"https://waa.ai/JEV8.png",
            color:"pink",
            fullname:"Nozomi Yumehara",
            alter_ego:"Cure Dream",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The great power of hope, Cure Dream!",
            special_attack:"Shooting Star",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379464753971220/817775920550248498/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793379464753971220/822044019566706698/image0.gif"],
            hint_chiguhaguu:"The great power of hope, <x>",
        },
        love:{
            total:11,
            icon:"https://waa.ai/JEVW.png",
            color:"pink",
            fullname:"Love Momozono",
            alter_ego:"Cure Peach",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The pink heart is the emblem of love. Freshly-picked, Cure Peach!",
            special_attack:"Love Sunshine",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381447062913064/817776599390486558/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381447062913064/823994186217816075/image0.gif"],
            hint_chiguhaguu:"The pink heart is the emblem of love. Freshly-picked, <x>!",
        },
        tsubomi:{
            total:13,
            icon:"https://waa.ai/JEVD.png",
            color:"pink",
            fullname: "Tsubomi Hanasaki",
            alter_ego:"Cure Blossom",
            henshin_phrase:"Pretty Cure, Open My Heart!",
            transform_quotes:"The flowers spreading throughout the land, Cure Blossom!",
            special_attack:"Pink Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382427551727636/817777422723973190/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382427551727636/822047607412490270/image0.gif"],
            hint_chiguhaguu:"The flowers spreading throughout the land, <x>!",
            form:{
                silhouette:{
                    name:"Cure Blossom Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/ad/Puzzlun_Sprite_HPC_Cure_Blossom_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        hibiki:{
            total:12,
            icon:"https://waa.ai/JEVd.png",
            color:"pink",
            fullname: "Hibiki Hojo",
            alter_ego:"Cure Melody",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the wild tune, Cure Melody!",
            special_attack:"Miracle Heart Arpeggio",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383641119850556/817782344819408966/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Strumming the wild tune, <x>!",
            description:""
        },
        miyuki:{
            total:13,
            icon:"https://waa.ai/JEVM.png",
            color:"pink",
            fullname: "Miyuki Hoshizora",
            alter_ego:"Cure Happy",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Twinkling and shining, the light of the future! Cure Happy!",
            special_attack:"Happy Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384875465506816/817783520935673856/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384875465506816/822032962186117140/image0.gif"],
            hint_chiguhaguu:"Twinkling and shining, the light of the future! <x>!",
            description:"",
            form:{
                princess:{
                    name:"Cure Happy Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/e/e8/Puzzlun_Sprite_SmPC_Cure_Happy_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Happy!",
                }
            }
        },
        mana:{
            total:12,
            icon:"https://waa.ai/JEV6.png",
            color:"pink",
            fullname: "Mana Aida",
            alter_ego:"Cure Heart",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"Overflowing Love! Cure Heart!",
            special_attack:"Heart Dynamite",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387637527805973/817784809380118528/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Overflowing Love! <x>!",
            catchprase:"Kyunkyun!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
        },
        megumi:{
            total:10,
            icon:"https://waa.ai/JEVg.png",
            color:"pink",
            fullname: "Megumi Aino",
            alter_ego:"Cure Lovely",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The big love spreading throughout the world! Cure Lovely!!",
            special_attack:"Pinky Love Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388697474564157/817786157650673674/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The big love spreading throughout the world! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Lovely Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/92/Puzzlun_Sprite_HCPC_Cure_Lovely_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The big love spreading throughout the world! Cure Lovely Innocent Form!"
                }
            }
        },
        haruka:{
            total:16,
            icon:"https://waa.ai/JEVN.png",
            color:"pink",
            fullname: "Haruka Haruno",
            alter_ego:"Cure Flora",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the Flourishing Flowers! Cure Flora!",
            special_attack:"Floral Tourbillon",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389561606045737/817786541179011072/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389561606045737/822056134847758350/image0.gif"],
            hint_chiguhaguu:"Princess of the Flourishing Flowers! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Flora Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/9a/Puzzlun_Sprite_GPPC_Cure_Flora_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the Flourishing Flowers! Cure Flora!"
                }
            }
        },
        mirai:{
            total:16,
            icon:"https://waa.ai/JEVh.png",
            color:"pink",
            fullname:"Mirai Asahina",
            alter_ego:"Cure Miracle",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Miracle! Cure Miracle!",
            special_attack:"Diamond Eternal",
            img_special_attack:"https://cdn.discordapp.com/attachments/793390659046080512/817787063726243880/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Our Miracle! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                ruby:{
                    name:"Cure Miracle Ruby Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/3/36/Puzzlun_Sprite_MTPC_Cure_Miracle_Ruby.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Ruby Style!"
                },
                sapphire:{
                    name:"Cure Miracle Sapphire Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/4/4e/Puzzlun_Sprite_MTPC_Cure_Miracle_Sapphire.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Sapphire Style!"
                },
                alexandrite:{
                    name:"Cure Miracle Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/87/Puzzlun_Sprite_MTPC_Cure_Miracle_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Miracle Alexandrite Style!"
                }
            }
        },
        ichika:{
            total:18,
            icon:"https://waa.ai/JEVP.png",
            color:"pink",
            fullname:"Ichika Usami",
            alter_ego:"Cure Whip",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Liveliness and Smiles! Let's La Mix It All Up! Cure Whip! Ready To Serve!",
            special_attack:"Whip Decoration",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391968322322462/817792783754330142/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793391968322322462/822041487444803594/image0.gif"],
            hint_chiguhaguu:"With Liveliness and Smiles! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Whip A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/be/Puzzlun_Sprite_KKPCALM_Cure_Whip_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Whip A la Mode!"
                }
            }
        },
        hana:{
            total:16,
            icon:"https://waa.ai/JEVp.png",
            color:"pink",
            fullname: "Hana Nono",
            alter_ego:"Cure Yell",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell!",
            special_attack:"Heart For You",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393652348354600/817793676813533214/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Cheering on everyone! The Pretty Cure of High Spirits! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Yell Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a5/Puzzlun_Sprite_HuPC_Cure_Yell_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Yell Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/5d/Puzzlun_Sprite_HuPC_Cure_Yell_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell Mother Heart"
                }
            }
        },
        hikaru:{
            total:13,
            icon:"https://waa.ai/JEV7.png",
            color:"pink",
            fullname: "Hikaru Hoshina",
            alter_ego:"Cure Star",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The twinkling star that shines throughout the universe! Cure Star!",
            special_attack:"Star Punch",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395639512989727/817794726728171561/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The twinkling star that shines throughout the universe! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Star Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cf/Puzzlun_Sprite_STPC_Cure_Star_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The twinkling star that shines throughout the universe! Cure Star Twinkle Style!"
                }
            }
        },
        nodoka:{
            total:5,
            icon:"https://waa.ai/JEVL.png",
            color:"pink",
            fullname: "Nodoka Hanadera",
            alter_ego:"Cure Grace",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two overlapping flowers! Cure Grace!",
            special_attack:"Healing Flower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396698117701632/825099297687076904/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396698117701632/822036258628435968/image0.gif"],
            hint_chiguhaguu:"The two overlapping flowers! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        karen:{
            total:12,
            icon:"https://waa.ai/JEV5.png",
            color:"blue",
            fullname: "Karen Minazuki",
            alter_ego:"Cure Aqua",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The blue spring of intelligence, Cure Aqua!",
            special_attack:"Sapphire Arrow",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380588223856651/817776251489747020/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380588223856651/822045554518261800/image0.gif"],
            hint_chiguhaguu:"The blue spring of intelligence, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        miki:{
            total:10,
            icon:"https://waa.ai/JEVn.png",
            color:"blue",
            fullname: "Miki Aono",
            alter_ego:"Cure Berry",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The blue heart is the emblem of hope. Freshly-gathered, Cure Berry!",
            special_attack:"Espoir Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381635424387073/817776807679623178/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381635424387073/822035476323631114/image0.gif"],
            hint_chiguhaguu:"The blue heart is the emblem of hope. Freshly-gathered, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        erika:{
            total:13,
            icon:"https://waa.ai/JEwE.png",
            color:"blue",
            fullname:"Erika Kurumi",
            alter_ego:"Cure Marine",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that flutters in the ocean winds, Cure Marine!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Blue Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382673749377075/817778139501559888/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382673749377075/822047680099254272/image0.gif"],
            hint_chiguhaguu:"The flower that flutters in the ocean winds, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Marine Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/26/Puzzlun_Sprite_HPC_Cure_Marine_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        ellen:{
            total:12,
            icon:"https://waa.ai/JEw4.png",
            color:"blue",
            fullname:"Ellen Kurokawa",
            alter_ego:"Cure Beat",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the soul's tune, Cure Beat!",
            special_attack:"Heartful Beat Rock",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384071107575838/817783058949603368/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384071107575838/822049486553350154/image0.gif"],
            hint_chiguhaguu:"Strumming the soul's tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        reika:{
            total:12,
            icon:"https://waa.ai/JEwk.png",
            color:"blue",
            fullname: "Reika Aoki",
            alter_ego:"Cure Beauty",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Snowing, falling and gathering, a noble heart! Cure Beauty!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Beauty",
            special_attack:"Beauty Blizzard",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387120341155850/817784652236062750/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793387120341155850/822029771910676480/image0.gif"],
            hint_chiguhaguu:"Snowing, falling and gathering, a noble heart! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Beauty Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/9/99/Puzzlun_Sprite_SmPC_Cure_Beauty_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Beauty!",
                }
            }
        },
        rikka:{
            total:11,
            icon:"https://waa.ai/JEwz.png",
            color:"blue",
            fullname:"Rikka Hishikawa",
            alter_ego:"Cure Diamond",
            henshin_phrase: "Pretty Cure, Love Link!",
            transform_quotes:"The light of Wisdom! Cure Diamond!!",
            special_attack:"Diamond Swirkle",
            img_special_attack:"https://cdn.discordapp.com/attachments/793387811922903040/817785362213765141/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/796354776714969119/822201577233186866/image0.gif"],
            hint_chiguhaguu:"The light of Wisdom! <x>!!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        hime:{
            total:11,
            icon:"https://waa.ai/JEwo.png",
            color:"blue",
            fullname:"Hime Shirayuki",
            alter_ego:"Cure Princess",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The blue wind dancing in the sky! Cure Princess!",
            special_attack:"Blue Happy Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388907429232650/817786226895618068/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793388907429232650/822053505861812254/image0.gif"],
            hint_chiguhaguu:"The blue wind dancing in the sky! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Princess Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a8/Puzzlun_Sprite_HCPC_Cure_Princess_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The blue wind dancing in the sky! Cure Lovely Innocent Form!"
                }
            }
        },
        minami:{
            total:14,
            icon:"https://waa.ai/JEwX.png",
            color:"blue",
            fullname:"Minami Kaidou",
            alter_ego:"Cure Mermaid",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the crystal clear seas! Cure Mermaid!",
            special_attack:"Mermaid Ripple",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389777361174549/817786645037711390/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389777361174549/822055972255825958/image0.gif"],
            hint_chiguhaguu:"Princess of the crystal clear seas! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Mermaid Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/4/47/Puzzlun_Sprite_GPPC_Cure_Mermaid_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the crystal clear seas! Cure Mermaid!"
                }
            }
        },
        aoi:{
            total:14,
            icon:"https://waa.ai/JEw3.png",
            color:"blue",
            fullname:"Aoi Tategami",
            alter_ego:"Cure Gelato",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Freedom and Passion! Let's La Mix It All Up! Cure Gelato! Ready To Serve!",
            special_attack:"Gelato Shake",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392456019345418/817793196901400576/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793392456019345418/822041589349351434/image0.gif"],
            hint_chiguhaguu:"With Freedom and Passion! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Gelato A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/f3/Puzzlun_Sprite_KKPCALM_Cure_Gelato_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Gelato A la Mode!"
                }
            }
        },
        saaya:{
            total:14,
            icon:"https://waa.ai/JEwO.png",
            color:"blue",
            fullname: "Saaya Yakushiji",
            alter_ego:"Cure Ange",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange!",
            special_attack:"Heart Feather",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394491431714838/817793766152470528/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Healing everyone! The Pretty Cure of Wisdom! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Ange Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/0/0a/Puzzlun_Sprite_HuPC_Cure_Ange_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Ange Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/7/7b/Puzzlun_Sprite_HuPC_Cure_Ange_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange Mother Heart!"
                }
            }
        },
        yuni:{
            total:8,
            icon:"https://waa.ai/JEwT.png",
            color:"blue",
            fullname:"Yuni",
            alter_ego:"Cure Cosmo",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The rainbow spectrum lighting up the galaxy! Cure Cosmo!",
            special_attack:"Cosmo Shining",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396381406199809/817795242929422406/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The rainbow spectrum lighting up the galaxy! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Cosmo Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/6/60/Puzzlun_Sprite_STPC_Cure_Cosmo_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The rainbow spectrum lighting up the galaxy! Cure Cosmo Twinkle Style!"
                }
            }
        },
        chiyu:{
            total:5,
            icon:"https://waa.ai/JEwe.png",
            color:"blue",
            fullname:"Chiyu Sawaizumi",
            alter_ego:"Cure Fontaine",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two intersecting streams! Cure Fontaine!",
            special_attack:"Healing Stream",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396832717111347/825099333333811310/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396832717111347/822037799011352576/image0.gif"],
            hint_chiguhaguu:"The two intersecting streams! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        hikari:{
            total:14,
            icon:"https://waa.ai/JEwu.png",
            color:"yellow",
            fullname:"Hikari Kujou",
            alter_ego:"Shiny Luminous",
            henshin_phrase:"Luminous Shining Stream!",
            transform_quotes:"Shining life, Shiny Luminous! The light's heart and the light's will, for the sake of uniting all as one!",
            special_attack:"Heartiel Action",
            img_special_attack:"https://cdn.discordapp.com/attachments/793378136871010364/817775581458464808/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Shining life, <x>! The light's heart and the light's will, for the sake of uniting all as one!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        urara:{
            total:11,
            icon:"https://waa.ai/JEwt.png",
            color:"yellow",
            fullname:"Urara Kasugano",
            alter_ego:"Cure Lemonade",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The effervescence of bursting lemon, Cure Lemonade!",
            special_attack:"Prism Chain",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380077173735424/817776088595300452/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380077173735424/822044339370065941/image0.gif"],
            hint_chiguhaguu:"The effervescence of bursting lemon, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        inori:{
            total:10,
            icon:"https://waa.ai/JEwJ.png",
            color:"yellow",
            fullname:"Inori Yamabuki",
            alter_ego:"Cure Pine",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The yellow heart is the emblem of faith! Freshly-harvested, Cure Pine!",
            special_attack:"Healing Prayer",
            img_special_attack:"https://cdn.discordapp.com/attachments/793381839938519040/817776874607607808/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793381839938519040/823994231860363315/image0.gif"],
            hint_chiguhaguu:"The yellow heart is the emblem of faith! Freshly-harvested, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        itsuki:{
            total:12,
            icon:"https://waa.ai/JEwm.png",
            color:"yellow",
            fullname:"Itsuki Myoudouin",
            alter_ego:"Cure Sunshine",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that bathes in the sunlight, Cure Sunshine!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Gold Forte Burst",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383020336906259/817781911929225236/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793383020336906259/822048055859609630/image0.gif"],
            hint_chiguhaguu:"The flower that bathes in the sunlight, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Sunshine Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/1d/Puzzlun_Sprite_HPC_Cure_Sunshine_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        ako:{
            total:11,
            icon:"https://waa.ai/JEwx.png",
            color:"yellow",
            fullname:"Ako Shirabe",
            alter_ego:"Cure Muse",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the Goddess' tune, Cure Muse!",
            special_attack:"Sparkling Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384267753193482/817783205075353620/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384267753193482/822049698478948372/image0.gif"],
            hint_chiguhaguu:"Playing the Goddess' tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yayoi:{
            total:11,
            icon:"https://waa.ai/JEwq.png",
            color:"yellow",
            fullname:"Yayoi Kise",
            alter_ego:"Cure Peace",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Sparkling, glittering, rock-paper-scissors! Cure Peace!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Peace!",
            special_attack:"Peace Thunder",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386748356067349/817784272323608626/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386748356067349/822030765248348210/image0.gif"],
            hint_chiguhaguu:"Sparkling, glittering, rock-paper-scissors! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Peace Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/8c/Puzzlun_Sprite_SmPC_Cure_Peace_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Peace!"
                }
            }
        },
        alice:{
            total:10,
            icon:"https://waa.ai/JEwl.png",
            color:"yellow",
            fullname:"Alice Yotsuba",
            alter_ego:"Cure Rosetta",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The Sunny warmth! Cure Rosetta!",
            special_attack:"Rosetta Balloon",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388055583129601/817785467805499402/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793388055583129601/822051142506643486/image0.gif"],
            hint_chiguhaguu:"The Sunny warmth! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yuko:{
            total:12,
            icon:"https://waa.ai/JEwF.png",
            color:"yellow",
            fullname:"Yuko Omori",
            alter_ego:"Cure Honey",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The light of life flourishing on the Earth, Cure Honey!",
            special_attack:"Sparkling Baton Attack",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389083162050581/817786309334663188/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The light of life flourishing on the Earth, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Honey Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/8/8c/Puzzlun_Sprite_HCPC_Cure_Honey_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The light of life flourishing on the Earth, Cure Honey Innocent Form!"
                }
            }
        },
        kirara:{
            total:16,
            icon:"https://waa.ai/JEw0.png",
            color:"yellow",
            fullname:"Kirara Amanogawa",
            alter_ego:"Cure Twinkle",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the twinkling stars! Cure Twinkle!",
            special_attack:"Twinkle Humming",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389968457859093/817786728202502204/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793389968457859093/822056102803800064/image0.gif"],
            hint_chiguhaguu:"Princess of the twinkling stars! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Twinkle Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cb/Puzzlun_Sprite_GPPC_Cure_Twinkle_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of the twinkling stars! Cure Twinkle!"
                }
            }
        },
        himari:{
            total:15,
            icon:"https://waa.ai/JEw9.png",
            color:"yellow",
            fullname:"Himari Arisugawa",
            alter_ego:"Cure Custard",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Intelligence and Courage! Let's La Mix It All Up! Cure Custard! Ready To Serve!",
            special_attack:"Custard Illusion",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392228168237086/817793084657631262/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"With Intelligence and Courage! Let's La Mix It All Up! <x>! Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Custard A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/7/7b/Puzzlun_Sprite_KKPCALM_Cure_Custard_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Custard A la Mode!"
                }
            }
        },
        homare:{
            total:14,
            icon:"https://waa.ai/JEwS.png",
            color:"yellow",
            fullname:"Homare Kagayaki",
            alter_ego:"Cure Etoile",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile!",
            special_attack:"Heart Star",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394718305419265/817794207732727858/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Making everyone shine! The Pretty Cure of Strength! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Etoile Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/a/a3/Puzzlun_Sprite_HuPC_Cure_Etoile_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Etoile Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/bc/Puzzlun_Sprite_HuPC_Cure_Etoile_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Making everyone shine! The Pretty Cure of Strength! Cure Etoile Mother Heart!"
                }
            }
        },
        elena:{
            total:11,
            icon:"https://waa.ai/JEws.png",
            color:"yellow",
            fullname:"Elena Amamiya",
            alter_ego:"Cure Soleil",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the sky! With sparkling heat! Cure Soleil!",
            special_attack:"Soleil Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396010227204117/817794841130827786/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Light up the sky! With sparkling heat! <x>!!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Soleil Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/56/Puzzlun_Sprite_STPC_Cure_Soleil_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"Light up the sky! With sparkling heat! Cure Soleil Twinkle Style!"
                }
            }
        },
        hinata:{
            total:5,
            icon:"https://waa.ai/JEwC.png",
            color:"yellow",
            fullname:"Hinata Hiramitsu",
            alter_ego:"Cure Sparkle",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two lights that come together! Cure Sparkle!",
            special_attack:"Healing Flash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396923054686219/825099367849263134/image0.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793396923054686219/822038127509766154/image0.gif"],
            hint_chiguhaguu:"The two lights that come together! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        yuri:{
            total:13,
            icon:"https://static.wikia.nocookie.net/prettycure/images/7/71/Puzzlun_Sprite_HPC_Cure_Moonlight.png",
            color:"purple",
            fullname:"Yuri Tsukikage",
            alter_ego:"Cure Moonlight",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that shines in the moon's light, Cure Moonlight!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Silver Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383243750703144/817782029147832360/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793383243750703144/822048055788437504/image0.gif"],
            hint_chiguhaguu:"The flower that shines in the moon's light, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                silhouette:{
                    name:"Cure Moonlight Super Silhouette",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/dc/Puzzlun_Sprite_HPC_Cure_Moonlight_Super_Silhouette.png",
                    quotes_head:"Mirror, O mirror, grant your power to the Pretty Cure!",
                    quotes_description:"The flowers shining all over the world, Heartcatch Pretty Cure Super Silhouette!"
                }
            }
        },
        makoto:{
            total:11,
            icon:"https://waa.ai/JEwc.png",
            color:"purple",
            fullname:"Makoto Kenzaki",
            alter_ego:"Cure Sword",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The courageous blade! Cure Sword!",
            special_attack:"Sword Hurricane",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388248139300864/817785553084219402/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The courageous blade! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        iona:{
            total:12,
            icon:"https://waa.ai/JEwV.png",
            color:"purple",
            fullname:"Iona Hikawa",
            alter_ego:"Cure Fortune",
            henshin_phrase:"Pretty Cure! Kirarin Star Symphony",
            transform_quotes:"The star of hope that glitters in the night sky! Cure Fortune!",
            special_attack:"Stardust Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793389261570965504/817786376220835840/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The star of hope that glitters in the night sky! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                innocent:{
                    name:"Cure Fortune Innocent Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2b/Puzzlun_Sprite_HCPC_Cure_Fortune_Innocent_Form.png",
                    quotes_head:"Pretty Cure Kururin Mirror Change!",
                    quotes_description:"The star of hope that glitters in the night sky! Cure Fortune Innocent Form!"
                }
            }
        },
        riko:{
            total:15,
            icon:"https://waa.ai/JEww.png",
            color:"purple",
            fullname:"Riko Izayoi",
            alter_ego:"Cure Magical",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Magic! Cure Magical!",
            special_attack:"Diamond Eternal",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391024067837972/817792621912129536/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Our Magic! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                ruby:{
                    name:"Cure Magical Ruby Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/d0/Puzzlun_Sprite_MTPC_Cure_Magical_Ruby.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Ruby Style!"
                },
                sapphire:{
                    name:"Cure Magical Sapphire Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2a/Puzzlun_Sprite_MTPC_Cure_Magical_Sapphire.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Sapphire Style!"
                },
                alexandrite:{
                    name:"Cure Magical Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/d/d1/Puzzlun_Sprite_MTPC_Cure_Magical_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Magical Alexandrite Style!"
                }
            }
        },
        yukari:{
            total:16,
            icon:"https://waa.ai/JEwy.png",
            color:"purple",
            fullname:"Yukari Kotozume",
            alter_ego:"Cure Macaron",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Beauty and Excitement! Let's La Mix It All Up! Cure Macaron! Is Ready To Serve!",
            special_attack:"Macaron Julienne",
            img_special_attack:"https://cdn.discordapp.com/attachments/793392786367316038/817793379797696512/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"With Beauty and Excitement! Let's La Mix It All Up! <x>! Is Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Macaron A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/6/6f/Puzzlun_Sprite_KKPCALM_Cure_Macaron_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Macaron A la Mode!"
                }
            }
        },
        ruru:{
            total:11,
            icon:"https://waa.ai/JEwH.png",
            color:"purple",
            fullname:"Ruru Amour",
            alter_ego:"Cure Amour",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Amour!",
            special_attack:"Heart Dance",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395175695187980/817794367410143262/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Loving everyone! The Pretty Cure of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Amour Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/1f/Puzzlun_Sprite_HuPC_Cure_Amour_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Amour Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Amour Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/26/Puzzlun_Sprite_HuPC_Cure_Amour_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Amour Mother Heart!"
                }
            }
        },
        madoka:{
            total:12,
            icon:"https://waa.ai/JEwU.png",
            color:"purple",
            fullname:"Madoka Kaguya",
            alter_ego:"Cure Selene",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the night sky! With the secretive moonlight! Cure Selene!",
            special_attack:"Selene Arrow",
            img_special_attack:"https://cdn.discordapp.com/attachments/793396194697019412/817794901722005554/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Light up the night sky! With the secretive moonlight! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Selene Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/5/5d/Puzzlun_Sprite_STPC_Cure_Selene_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"Light up the night sky! With the secretive moonlight! Cure Selene Twinkle Style!"
                }
            }
        },
        kurumi:{
            total:12,
            icon:"https://waa.ai/JEwK.png",
            color:"purple",
            fullname:"Kurumi Mimino",
            alter_ego:"Milky Rose",
            henshin_phrase:"Skyrose Translate!",
            transform_quotes:"The blue rose is my secret emblem! Milky Rose!",
            special_attack:"Metal Blizzard",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380840255389716/817776335572172880/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380840255389716/826556276469137418/image0.gif"],
            hint_chiguhaguu:"The blue rose is my secret emblem! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        rin:{
            total:11,
            icon:"https://waa.ai/JEwR.png",
            color:"red",
            fullname:"Rin Natsuki",
            alter_ego:"Cure Rouge",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The red flame of passion, Cure Rouge!",
            special_attack:"Fire Strike",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379843483631626/817776006181945374/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793379843483631626/822044204128534528/image0.gif"],
            hint_chiguhaguu:"The red flame of passion, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        setsuna:{
            total:11,
            icon:"https://waa.ai/JEwQ.png",
            color:"red",
            fullname:"Setsuna Higashi",
            alter_ego:"Cure Passion",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The scarlet heart is the proof of happiness! Freshly-ripened, Cure Passion!",
            special_attack:"Happiness Hurricane",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382021044371507/817776964298866688/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382021044371507/822035356319875092/image0.gif"],
            hint_chiguhaguu:"The scarlet heart is the proof of happiness! Freshly-ripened, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        akane:{
            total:11,
            icon:"https://waa.ai/JEw2.png",
            color:"red",
            fullname:"Akane Hino",
            alter_ego:"Cure Sunny",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"The brilliant sun, hot-blooded power! Cure Sunny!",
            special_attack:"Sunny Fire",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386538045276171/817783836435021824/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386538045276171/822031840202063932/image0.gif"],
            hint_chiguhaguu:"The brilliant sun, hot-blooded power! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure Sunny Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/0/04/Puzzlun_Sprite_SmPC_Cure_Sunny_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess Sunny!"
                }
            }
        },
        aguri:{
            total:12,
            icon:"https://waa.ai/JEwB.png",
            color:"red",
            fullname:"Aguri Madoka",
            alter_ego:"Cure Ace",
            henshin_phrase:"Pretty Cure, Dress Up!",
            transform_quotes:"The Trump Card of Love! Cure Ace!",
            special_attack:"Ace Shot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793388428150046740/817786014482825226/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The Trump Card of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        towa:{
            total:15,
            icon:"https://waa.ai/JEwI.png",
            color:"red",
            fullname:"Towa Akagi",
            alter_ego:"Cure Scarlet",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of crimson flames! Cure Scarlet!",
            special_attack:"Phoenix Blaze",
            img_special_attack:"https://cdn.discordapp.com/attachments/793390200070864908/817786809270403114/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793390200070864908/822056130271641610/image0.gif"],
            hint_chiguhaguu:"Princess of crimson flames! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                premium:{
                    name:"Cure Scarlet Premium Dress",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/2/2f/Puzzlun_Sprite_GPPC_Cure_Scarlet_Premium_Dress.png",
                    quotes_head:"Pretty Cure, Princess Engage!",
                    quotes_description:"Princess of crimson flames! Cure Scarlet!"
                }
            }
        },
        akira:{
            total:16,
            icon:"https://waa.ai/JEw8.png",
            color:"red",
            fullname:"Akira Kenjou",
            alter_ego:"Cure Chocolat",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Strength and Love! Let's La Mix It All Up! Cure Chocolat! Is Ready To Serve!",
            special_attack:"Chocolat Aromase",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393018614841355/817793497238601738/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793393018614841355/822041731855286282/image0.gif"],
            hint_chiguhaguu:"With Strength and Love! Let's La Mix It All Up! <x>! Is Ready To Serve!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Chocolat A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/f9/Puzzlun_Sprite_KKPCALM_Cure_Chocolat_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Chocolat A la Mode!"
                }
            }
        },
        emiru:{
            total:11,
            icon:"https://waa.ai/JEwW.png",
            color:"red",
            fullname:"Emiru Aisaki",
            alter_ego:"Cure Macherie",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Machérie!",
            special_attack:"Heart Song",
            img_special_attack:"https://cdn.discordapp.com/attachments/793394965690318898/817794295641407548/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Loving everyone! The Pretty Cure of Love! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "cheerful":{
                    name:"Cure Macherie Cheerful Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/3/33/Puzzlun_Sprite_HuPC_Cure_Macherie_Cheerful.png",
                    quotes_head:"Heart Kiratto!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Macherie Cheerful Style!"
                },
                "mother heart":{
                    name:"Cure Macherie Mother Heart",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/c/cb/Puzzlun_Sprite_HuPC_Cure_Macherie_Mother_Heart.png",
                    quotes_head:"Memorial Cure Clock: Mother Heart!",
                    quotes_description:"Loving everyone! The Pretty Cure of Love! Cure Macherie Mother Heart!"
                }
            }
        },
        komachi:{
            total:13,
            icon:"https://waa.ai/JEwi.png",
            color:"green",
            fullname:"Komachi Akimoto",
            alter_ego:"Cure Mint",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The green earth of tranquility, Cure Mint!",
            special_attack:"Emerald Saucer",
            img_special_attack:"https://cdn.discordapp.com/attachments/793380333194051614/817776166597034014/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793380333194051614/822044644505944074/image0.gif"],
            hint_chiguhaguu:"The green earth of tranquility, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        nao:{
            total:11,
            icon:"https://waa.ai/JEwD.png",
            color:"green",
            fullname:"Nao Midorikawa",
            alter_ego:"Cure March",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Intense courage, a straight-up bout! Cure March!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess March!",
            special_attack:"March Shoot",
            img_special_attack:"https://cdn.discordapp.com/attachments/793386892137332756/817784444546449468/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793386892137332756/822031246094761984/image0.gif"],
            hint_chiguhaguu:"Intense courage, a straight-up bout! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                princess:{
                    name:"Cure March Princess Form",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/b/bc/Puzzlun_Sprite_SmPC_Cure_March_Princess_Form.png",
                    quotes_head:"Pegasus, grant us power!",
                    quotes_description:"Pretty Cure Princess Form! Princess March!",
                }
            }
        },
        kotoha:{
            total:15,
            icon:"https://waa.ai/JEwd.png",
            color:"green",
            fullname:"Kotoha Hanami",
            alter_ego:"Cure Felice",
            henshin_phrase:"Felice, Fun Fun, Flowerle!",
            transform_quotes:"Spreading blessings to lives far and wide! Cure Felice!",
            special_attack:"Emerald Reincarnation",
            img_special_attack:"https://cdn.discordapp.com/attachments/793391246495449088/817786930174885898/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Spreading blessings to lives far and wide! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                alexandrite:{
                    name:"Cure Felice Alexandrite Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/f/fe/Puzzlun_Sprite_MTPC_Cure_Felice_Alexandrite.png",
                    quotes_head:"Miracle, Magical, Jewelryle!",
                    quotes_description:"Our Miracle! Cure Felice Alexandrite Style!"
                }
            }
        },
        ciel:{
            total:12,
            icon:"https://waa.ai/JEwM.png",
            color:"green",
            fullname:"Ciel Kirahoshi",
            alter_ego:"Cure Parfait",
            henshin_phrase:"Cure La Mode・Decoration!",
            transform_quotes:"With Dreams and Hope! Let's La Mix It All Up! Cure Parfait! Is Ready To Serve",
            special_attack:"Parfait Étoile",
            img_special_attack:"https://cdn.discordapp.com/attachments/793393296957243403/817793570161295390/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793393296957243403/822041883827896341/image0.gif"],
            hint_chiguhaguu:"With Dreams and Hope! Let's La Mix It All Up! <x>! Is Ready To Serve",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                "a la mode":{
                    name:"Cure Parfait A La Mode",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/1/10/Puzzlun_Sprite_KKPCALM_Cure_Parfait_A_La_Mode.png",
                    quotes_head:"Sweets Castle! Let's - La - Get Changed!",
                    quotes_description:"Shine bright!! Cure Parfait A la Mode!"
                }
            }
        },
        lala:{
            total:11,
            icon:"https://waa.ai/JEw6.png",
            color:"green",
            fullname:"Lala Hagoromo",
            alter_ego:"Cure Milky",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The milky way stretching across the heavens! Cure Milky!",
            special_attack:"Milky Shock",
            img_special_attack:"https://cdn.discordapp.com/attachments/793395855654518814/817794616949997588/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The milky way stretching across the heavens! <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            },
            form:{
                twinkle:{
                    name:"Cure Milky Twinkle Style",
                    img_url:"https://static.wikia.nocookie.net/prettycure/images/e/e5/Puzzlun_Sprite_STPC_Cure_Milky_Twinkle_Style.png",
                    quotes_head:"Shiny Twinkle Pen!",
                    quotes_description:"The milky way stretching across the heavens! Cure Milky Twinkle Style!"
                }
            }
        },
        honoka:{
            total:18,
            icon:"https://waa.ai/JEwL.png",
            color:"white",
            fullname:"Honoka Yukishiro",
            alter_ego:"Cure White",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure White!",
            special_attack:"Marble Screw",
            img_special_attack:"https://cdn.discordapp.com/attachments/793377043646775297/817775439320842320/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Emissary of light, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        mai:{
            total:10,
            icon:"https://waa.ai/JEwb.png",
            color:"white",
            fullname:"Mai Mishou",
            alter_ego:"Cure Egret",
            henshin_phrase:"Dual Spiritual Power!",
            transform_quotes:"The sparkling silver wing, Cure Egret!",
            special_attack:"Twin Stream Splash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793379085069844520/817775792875372554/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The sparkling silver wing, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        kanade:{
            total:12,
            icon:"https://waa.ai/JEwA.png",
            color:"white",
            fullname:"Kanade Minamino",
            alter_ego:"Cure Rhythm",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the graceful tune, Cure Rhythm!",
            special_attack:"Fantastic Piacere",
            img_special_attack:"https://cdn.discordapp.com/attachments/793383859348701195/817782937667895306/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"Playing the graceful tune, <x>!",
            description:"",
            bio:{
                key1:"",
                value1:"",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        }
    },
    spawnHintSeries: {
        "max heart":"yin & yang",
        "splash star":"flower, bird, wind and moon",
        "yes! precure 5 gogo!":"natural elements, human characteristics and emotions",
        "fresh":"fruits, clovers, card suits, and dancing",
        "heartcatch":"flowers and Hanakotoba",
        "suite":":musical_note: musical theme",
        "smile":"fairy tales",
        "doki doki!":"emotions and selflessness",
        "happiness":"mirrors, fashion, dancing and romance",
        "go! princess":"princesses, personal goals and dreams",
        "mahou tsukai":"sorcery, gemstones and friendship",
        "kirakira":"sweets, animals and creativity",
        "hugtto":"destiny, future, heroism, parenting, and jobs",
        "star twinkle":"space, astrology and imagination",
        "healin' good":"health, nature, and animals"
    },
    interactionCommandOptions: [
        {
            name: "status",
            description: "Open card status menu.",
            type: 2,
            options: [
                {
                    name: "open-status-menu",
                    description: "Open card status menu.",
                    type: 1,
                    options: [
                        {
                            name: "username",
                            description: "Enter username to view card status from other user.",
                            type: 3,
                            required:false
                        }
                    ]
                }
            ]
        },
        {
            name: "inventory",
            description: "Open card inventory menu.",
            type: 2,
            options: [
                {
                    name: "open-menu",
                    description: "Open card inventory menu.",
                    type: 1,
                    options: [
                        {
                            name: "card-pack",
                            description: "Enter the card pack. Example: nagisa",
                            type: 3,
                            required:true
                        },
                        {
                            name: "username",
                            description: "Enter username to view card inventory from other user.",
                            type: 3
                        }
                    ]
                }
            ]
        },
        {
            name: "duplicate",
            description: "Open duplicate card inventory menu.",
            type: 2,
            options: [
                {
                    name: "open-menu",
                    description: "Open duplicate card inventory menu.",
                    type: 1,
                    options: [
                        {
                            name: "card-pack",
                            description: "Enter the card pack. Example: nagisa",
                            type: 3,
                            required:true
                        },
                        {
                            name: "username",
                            description: "Enter username to view duplicate card inventory from other user.",
                            type: 3,
                            required:false
                        }
                    ]
                }
            ]
        },
        {
            name: "detail",
            description: "View the card detail.",
            type: 2,
            options: [
                {
                    name: "open-detail",
                    description: "View the card detail.",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example: nami201",
                            type: 3,
                            required:true
                        },
                        {
                            name: "mode",
                            description: "Card preview mode (Default: normal)",
                            type: 3,
                            choices:[
                                {
                                    name:"normal",
                                    value:"normal"
                                },
                                {
                                    name:"gold",
                                    value:"gold"
                                },
                            ]
                        },
                    ]
                }
            ]
        },
        {
            name:"set",
            description: "Set your card assignment",
            type: 2,
            options:[
                {
                    name: "color",
                    description: "Set your card color assignment",
                    type: 1,
                    options: [
                        {
                            name: "selection",
                            description: "Select the color assignment",
                            type: 3,
                            required: true,
                            choices: interactionList.color
                        }
                    ]
                },
                {
                    name: "series",
                    description: "Set your card series assignment",
                    type: 1,
                    options: [
                        {
                            name: "selection",
                            description: "Select the series assignment",
                            type: 3,
                            required: true,
                            choices: interactionList.series
                        }
                    ]
                },
                {
                    name: "avatar",
                    description: "Set your cure avatar",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id",
                            type: 3,
                            required: true
                        },
                        {
                            name: "visible-public",
                            description: "Set the henshin notification to be shown on public (Default: false)",
                            type: 5
                        },
                    ]
                },
            ]
        },
        // {
        //     name:"unset",
        //     description: "Revert/remove your precure avatar.",
        //     type: 2,
        //     options:[
        //         {
        //             name: "avatar",
        //             description: "Revert/remove your precure avatar.",
        //             type: 1,
        //             options: [
        //                 {
        //                     name: "confirm",
        //                     description: "Confirm to revert back",
        //                     type: 3
        //                 }
        //             ]
        //         },
        //     ]
        // },
        {
            name:"leaderboard",
            description: "See the card leaderboard",
            type: 2,
            options:[
                {
                    name: "pack",
                    description: "View the card pack leaderboard",
                    type: 1,
                    options: [
                        {
                            name: "pack-name",
                            description: "Enter card pack name",
                            type: 3,
                            required: true
                        },
                        {
                            name: "mode",
                            description: "Choose the completion mode (default:normal)",
                            type: 3,
                            required: false,
                            choices:[
                                {
                                    name:"normal",
                                    value:"pack"
                                },
                                {
                                    name:"gold",
                                    value:"pack_gold"
                                },
                            ]
                        },
                    ]
                },
                {
                    name: "series",
                    description: "View the card series leaderboard",
                    type: 1,
                    options: [
                        {
                            name: "series-selection",
                            description: "Choose the series",
                            type: 3,
                            required: true,
                            choices:interactionList.series
                        },
                        {
                            name: "mode",
                            description: "Choose the completion mode (default:normal)",
                            type: 3,
                            required: false,
                            choices:[
                                {
                                    name:"normal",
                                    value:"series"
                                },
                                {
                                    name:"gold",
                                    value:"series_gold"
                                },
                            ]
                        },
                    ]
                },
                {
                    name: "color",
                    description: "View the card color leaderboard",
                    type: 1,
                    options: [
                        {
                            name: "color-selection",
                            description: "Choose the color",
                            type: 3,
                            required: true,
                            choices: interactionList.color
                        },
                        {
                            name: "mode",
                            description: "Choose the completion mode (default:normal)",
                            type: 3,
                            required: false,
                            choices:[
                                {
                                    name:"normal",
                                    value:"color"
                                },
                                {
                                    name:"gold",
                                    value:"color_gold"
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            name:"upgrade",
            description: "Card upgrade command",
            type: 2,
            options:[
                {
                    name: "color-level",
                    description: "Upgrade your color level",
                    type: 1,
                    options: [
                        {
                            name: "selection",
                            description: "Choose the color selection",
                            type: 3,
                            required: true,
                            choices: interactionList.color
                        }
                    ]
                },
                {
                    name: "card-level-with-point",
                    description: "Upgrade your card level with color point",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id that you want to leveled up. Example:nami201",
                            type: 3,
                            required: true
                        },
                        {
                            name: "qty",
                            description: "Enter the amount of level up (max:50)",
                            type: 4
                        },
                    ]
                },
                {
                    name: "card-level-with-duplicate",
                    description: "Upgrade your card level using duplicate card",
                    type: 1,
                    options: [
                        {
                            name: "card-id-material",
                            description: "Enter the card id material. Example:nami201",
                            type: 3,
                            required: true
                        },
                        {
                            name: "card-id-target",
                            description: "Enter the card id that you want to level up. Example:nami201",
                            type: 3,
                            required:true
                        },
                        {
                            name: "qty",
                            description: "Enter the amount of card that you want to used for level up",
                            type: 4
                        },
                    ]
                },
                {
                    name: "card-special-level",
                    description: "Upgrade your card special level",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example:nami201",
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: "gold",
                    description: "Upgrade your normal card into gold card",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example:nami201",
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            name:"convert",
            description: "Card convert command",
            type: 2,
            options:[
                {
                    name: "card-to-point",
                    description: "Convert card into color & series point",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example: nami201",
                            type: 3,
                            required:true
                        },
                        {
                            name: "qty",
                            description: `(Default 1) Enter the amount of card that you want to convert/use "all" to convert all card.`,
                            type: 3
                        }
                    ]
                },
                {
                    name: "card-to-mofucoin",
                    description: "Convert card into mofucoin",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example: nami201",
                            type: 3,
                            required:true
                        },
                        {
                            name: "qty",
                            description: `(Default 1) Enter the amount of card that you want to convert/use "all" to convert all card.`,
                            type: 3
                        }
                    ]
                },
            ]
        },
        {
            name:"timer",
            description:"Timer related command",
            type:2,
            options:[
                {
                    name: "spawn",
                    description: "Check the card spawn timer",
                    type: 1
                }
            ]
        },
        {
            name:"skill",
            description:"Use card skills",
            type: 2,
            options: [
                {
                    name: "use",
                    description: "Use card skills",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id. Example: nami201",
                            type: 3,
                            required:true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove card skills from your status",
                    type: 1,
                    options: [
                        {
                            name: "confirm",
                            description: "Confirm the card skills removal",
                            type: 3
                        }
                    ]
                },
            ]
        },
        {
            name:"party",
            description:"Card party command",
            type: 2,
            options: [
                {
                    name: "status",
                    description: "View party status",
                    type: 1,
                    options: [
                        {
                            name: "open-party-menu",
                            description: "View party status",
                            type: 3
                        }
                    ]
                },
                {
                    name: "list",
                    description: "View party status",
                    type: 1,
                    options: [
                        {
                            name: "open-party-menu",
                            description: "View party status",
                            type: 3
                        }
                    ]
                },
                {
                    name: "create",
                    description: "Create card party",
                    type: 1,
                    options: [
                        {
                            name: "party-name",
                            description: "Enter the party name",
                            type: 3,
                            required:true
                        }
                    ]
                },
                {
                    name: "join",
                    description: "Join into card party",
                    type: 1,
                    options: [
                        {
                            name: "id-party",
                            description: "Enter the card ID party",
                            type: 3,
                            required:true
                        }
                    ]
                },
                {
                    name: "leave",
                    description: "Leave from party",
                    type: 1
                },
                {
                    name: "charge",
                    description: "Charge party point up",
                    type: 1
                },
            ]
        },
        // {
        //     name:"tradeboard",
        //     description:"Card tradeboard command",
        //     type: 2,
        //     options: [
        //         {
        //             name: "post",
        //             description: "Post your trade offer into tradeboard listing.",
        //             type: 1,
        //             options: [
        //                 {
        //                     name: "looking-for",
        //                     description: "Enter the card id that you want to receive. Example: nami201",
        //                     type: 3,
        //                     required:true
        //                 },
        //                 {
        //                     name: "trade-offer",
        //                     description: "Enter the card id that you want to offer. Example: nami201",
        //                     type: 3,
        //                     required:true
        //                 }
        //             ]
        //         },
        //         {
        //             name: "trade",
        //             description: "Confirm the trade",
        //             type: 1,
        //             options: [
        //                 {
        //                     name: "id-trade-listing",
        //                     description: "Enter the trade id listing to confirm it",
        //                     type: 3,
        //                     required:true
        //                 }
        //             ]
        //         },
        //         {
        //             name: "search",
        //             description: "Search & opens up tradeboard listing menu",
        //             type: 1,
        //             options: [
        //                 {
        //                     name: "card-id",
        //                     description: "Enter the card id that you want to search. Example: nami201",
        //                     type: 3,
        //                     required:true
        //                 }
        //             ]
        //         },
        //         {
        //             name: "remove",
        //             description: "Remove your trade offer from listing",
        //             type: 1,
        //             options: [
        //                 {
        //                     name: "listing",
        //                     description: "Remove your trade offer from listing",
        //                     type: 3
        //                 }
        //             ]
        //         }
        //     ]
        // },
        {
            name:"debug",
            description:"Spawn testing",
            type: 1
        },
        {
            name:"wish",
            description:"Make a wish to duplicate precure card",
            type: 1,
            options: [
                {
                    name: "card-id",
                    description: "Enter the card id",
                    type: 3,
                    required:true
                }
            ]
        },
    ]
}
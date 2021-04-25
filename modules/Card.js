const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const CardGuildModules = require('../modules/CardGuild');
const ItemModules = require('../modules/Item');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');
const DBM_Card_Enemies = require('../database/model/DBM_Card_Enemies');
const DBM_Card_Tradeboard = require('../database/model/DBM_Card_Tradeboard');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Pinky_Data = require('../database/model/DBM_Pinky_Data');
const DBM_Pinky_Inventory = require('../database/model/DBM_Pinky_Inventory');
const DBM_Card_Party = require('../database/model/DBM_Card_Party');

const latestVersion = "1.13";

class Properties{
    static embedColor = '#efcc2c';
    static maximumCard = 99;
    static limit = {
        colorpoint:2000,
        mofucoin:2000,
        seriespoint:1000
    }

    static cardCategory = {
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
    }

    //any other spawn type that is not listed will put as normal spawn
    static objSpawnType = {
        battle:25,
        quiz:20,
        normal:20,
        number:15,
        color:10,
        series:10
    }
    

    // original:
    static spawnType = ["normal","battle","number","quiz","color","series"
        //golden_week
        //virus
    ];


    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png"
    }

    //contains the data structure for card spawn
    static spawnData = {
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
            typeTsunagarus:"tsunagarus"
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
            color_non:"color_non",//non color condition
            //for color condition
            color_lives:"color_lives",
            rarity:"rarity",
            rarity_less:"rarity_less",//less
            rarity_more:"rarity_more",//more rarity
            id_enemy:"id_enemy",
            id_card_reward:"id_card_reward",
            special_allow:"special_allow",//true: special can be used
            //hp will reduce the chance and stored upto 3 key
            hp1:"hp1",
            hp2:"hp2",
            hp3:"hp3",
            //atk will increase the chance and stored upto 2 key
            atk1:"atk1",
            atk2:"atk2",
        }
    }

    static enemySpawnData = {
        tsunagarus : {
            category:{
                normal:"normal",
                boss:"boss"
            },
            term:{
                chokkins:"chokkins",
                dibosu:"dibosu",
                gizzagizza:"gizzagizza",
                buttagiru:"buttagiru",
                chiguhaguu:"chiguhaguu",
                chiridjirin:"chiridjirin"
            },
            image:{
                chokkins:"https://cdn.discordapp.com/attachments/793415946738860072/817018351846293554/Chokkin.png",
                dibosu:"https://cdn.discordapp.com/attachments/793415946738860072/817018421795487764/Dibosufinal.png",
                gizzagizza:"https://cdn.discordapp.com/attachments/793415946738860072/817018549146484746/Gizzagizza.png",
                buttagiru:"https://cdn.discordapp.com/attachments/793415946738860072/817018566057918484/Buttagiru.png",
                chiguhaguu:"https://cdn.discordapp.com/attachments/793415946738860072/822016967741407272/latest.png",
                chiridjirin:"https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png"
            },
            embedColor:{
                chokkins:"#D9A4FE",
                dibosu:"#1D0F21",
                gizzagizza:"#ED873C",
                buttagiru:"#B2D67A",
                chiguhaguu:"#C9C9C9",
                chiridjirin:"#CC3060"
            }
        },
        "max heart":{
            term:"zakenna"
        },
        "splash star":{
            term:"uzaina"
        },
        "yes! precure 5 gogo!":{
            term:"hoshina"
        },
        "fresh":{
            term:"nakewameke"
        },
        "heartcatch":{
            term:"desertrian"
        },
        "suite":{
            term:"negatone"
        },
        "smile":{
            term:"akanbe"
        },
        "doki doki!":{
            term:"jikochuu"
        },
        "happiness":{
            term:"saiarks"
        },
        "go! princess":{
            term:"zetsuborg"
        },
        "mahou tsukai":{
            term:"yokubaru"
        },
        "hugtto":{
            term:"oshimaida"
        },
        "star twinkle":{
            term:"nottrigger"
        },
        "healin' good":{
            term:"megabyogen"
        },
        "kirakira":{
            term:"kirakirarun thieves"
        }
    }

    //contain basic information of the color
    static arrColor = ["pink","purple","green","yellow","white","blue","red"];
    static dataColorCore = {
        pink:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FEA1E6",
            total:194
        },
        purple:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#897CFE",
            total:102
        },
        green:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#7CF885",
            total:62
        },
        yellow:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FDF13B",
            total:152
        },
        white:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FFFFEA",
            total:40
        },
        blue:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#7FC7FF",
            total:136
        },
        red:{
            imgMysteryUrl:"https://waa.ai/JEyE.png",
            color:"#FF9389",
            total:87
        },
        all:{
            imgMysteryUrl:"https://waa.ai/JEyE.png"
        }
    };
    
    //the constant of all available/required card
    static dataCardCore = {
        nagisa:{
            total:16,
            icon:"https://waa.ai/JEVB.png",
            color:"pink",
            fullname:"Nagisa Misumi",
            alter_ego:"Cure Black",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure Black!",
            special_attack:"Marble Screw",
            img_special_attack:"https://cdn.discordapp.com/attachments/793374640839458837/817775242729881660/unknown.png",
            img_transformation:[],
            badge_completion:"",
            hint_chiguhaguu:"Emissary of light, <x>!",
            description:"nagisa description",
            bio:{
                key1:"birthday",
                value1:"October 10",
                key2:"",
                value2:"",
                key3:"",
                value3:"",
                key4:"",
                value4:""
            }
        },
        saki:{
            total:12,
            icon:"https://waa.ai/JEVI.png",
            color:"pink",
            fullname:"Saki Hyuuga",
            alter_ego:"Cure Bloom",
            henshin_phrase:"Dual Spiritual Wave!",
            transform_quotes:"The shining golden flower, Cure Bloom!",
            special_attack:"Spiral Star Splash",
            img_special_attack:"https://cdn.discordapp.com/attachments/793378822976045096/817775703444684820/unknown.png",
            img_transformation:[],
            hint_chiguhaguu:"The shining golden flower, <x>!",
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
        tsubomi:{
            total:13,
            icon:"https://waa.ai/JEVD.png",
            color:"pink",
            fullname: "Tsubomi Hanasaki",
            alter_ego:"Cure Blossom",
            henshin_phrase:"Pretty Cure, Open My Heart!",
            transform_quotes:"The flowers spreading throughout the land, Cure Blossom!",
            transform_super_quotes:"The flowers shining all over the world, Heartcatch Pretty Cure! Super Silhouette!",
            special_attack:"Pink Forte Wave",
            img_special_attack:"https://cdn.discordapp.com/attachments/793382427551727636/817777422723973190/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793382427551727636/822047607412490270/image0.gif"],
            hint_chiguhaguu:"The flowers spreading throughout the land, <x>!",
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
        miyuki:{
            total:13,
            icon:"https://waa.ai/JEVM.png",
            color:"pink",
            fullname: "Miyuki Hoshizora",
            alter_ego:"Cure Happy",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"Twinkling and shining, the light of the future! Cure Happy!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Happy!",
            special_attack:"Happy Shower",
            img_special_attack:"https://cdn.discordapp.com/attachments/793384875465506816/817783520935673856/unknown.png",
            img_transformation:["https://cdn.discordapp.com/attachments/793384875465506816/822032962186117140/image0.gif"],
            hint_chiguhaguu:"Twinkling and shining, the light of the future! <x>!",
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
            }
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
            fullname:"Yuuko Omori",
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
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Sunny!",
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
    };

    static spawnHintSeries = {
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
    }

    static arrSeriesList = ["sp001","sp002","sp003","sp004","sp005","sp006","sp007","sp008","sp009","sp010","sp011","sp012","sp013","sp014","sp015"];

    static seriesCardCore = {
        sp001:{
            value:"sp001",
            pack:"max heart",
            currency:"Heartiel Points"
        },
        sp002:{
            value:"sp002",
            pack:"splash star",
            currency:"Miracle Drop Points"
        },
        sp003:{
            value:"sp003",
            pack:"yes! precure 5 gogo!",
            currency:"Palmin Points"
        },
        sp004:{
            value:"sp004",
            pack:"fresh",
            currency:"Linkrun Points"
        },
        sp005:{
            value:"sp005",
            pack:"heartcatch",
            currency:"Heart Seed Points"
        },
        sp006:{
            value:"sp006",
            pack:"suite",
            currency:"Melody Note Points"
        },
        sp007:{
            value:"sp007",
            pack:"smile",
            currency:"Decor Points"
        },
        sp008:{
            value:"sp008",
            pack:"doki doki!",
            currency:"Lovead Points"
        },
        sp009:{
            value:"sp009",
            pack:"happiness",
            currency:"Precard Points"
        },
        sp010:{
            value:"sp010",
            pack:"go! princess",
            currency:"Princess Points"
        },
        sp011:{
            value:"sp011",
            pack:"mahou tsukai",
            currency:"Linkle Points"
        },
        sp012:{
            value:"sp012",
            pack:"kirakira",
            currency:"Kirakiraru"
        },
        sp013:{
            value:"sp013",
            pack:"hugtto",
            currency:"Mirai Crystal Points"
        },
        sp014:{
            value:"sp014",
            pack:"star twinkle",
            currency:"Twinkle Points"
        },
        sp015:{
            value:"sp015",
            pack:"healin' good",
            currency:"Elemental Points"
        },
        "max heart":{
            special_name:"Extreme Luminario",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146151757578240/image0.png",
            series_point:"sp001"
        },
        "splash star":{
            special_name:"Spiral Heart Splash",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146180845207602/image0.png",
            series_point:"sp002"
        },
        "yes! precure 5 gogo!":{
            special_name:"Milky Rose Floral Explosion",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146259148668965/image0.png",
            series_point:"sp003"
        },
        "fresh":{
            special_name:"Lucky Clover Grand Finale",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824146317411483688/image0.png",
            series_point:"sp004"
        },
        "heartcatch":{
            special_name:"Heartcatch Orchestra",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824149388389646336/image0.png",
            series_point:"sp005"
        },
        "suite":{
            special_name:"Suite Session Ensemble Crescendo",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824150226645680138/image0.png",
            series_point:"sp006"
        },
        "smile":{
            special_name:"Royal Rainbow Burst",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824151822146207764/image0.png",
            series_point:"sp007"
        },
        "doki doki!":{
            special_name:"Royal Lovely Straight Flush",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152056629690368/image0.png",
            series_point:"sp008"
        },
        "happiness":{
            special_name:"Innocent Purification",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824152831317377044/image0.png",
            series_point:"sp009"
        },
        "go! princess":{
            special_name:"Grand Printemps",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153614380433448/image0.webp",
            series_point:"sp010"
        },
        "mahou tsukai":{
            special_name:"Extreme Rainbow",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824153741347258378/image0.webp",
            series_point:"sp011"
        },
        "kirakira":{
            special_name:"Fantastic Animale",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824154257766088714/image0.webp",
            series_point:"sp012"
        },
        "hugtto":{
            special_name:"Minna de Tomorrow",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156303525019648/image0.webp",
            series_point:"sp013"
        },
        "star twinkle":{
            special_name:"Star Twinkle Imagination",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824156329014460416/image0.png",
            series_point:"sp014"
        },
        "healin' good":{
            special_name:"Healing Oasis",
            img_team_attack:"https://cdn.discordapp.com/attachments/793415946738860072/824157153626816512/image0.png",
            series_point:"sp015"
        }
    }

}

class Battle{
    //contain the values of battle type
    static type = {
        normal:"normal",//tsunagarus
        raid:"raid"//not implemented yet but for upcoming updates
    }

    static async getEnemyData(id_enemy){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Enemies.columns.id,id_enemy);
        var result = await DB.select(DBM_Card_Enemies.TABLENAME,parameterWhere);
        return result[0][0];
    }

    static embedBossViewer(enemy_type,level,color_lives,type,rarity,atk,hp,_special_protection){
        var special_protection = "❌";
        
        if(_special_protection){
            special_protection = `✅`;
        }

        return {
            color: Properties.enemySpawnData.tsunagarus.color[enemy_type],
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Lv.${level}`,
            description: transformQuotes,
            fields:[
                {
                    name:`Color Lives:`,
                    value:color_lives,
                    inline:true
                },
                {
                    name:`Enemy Type:`,
                    value:type,
                    inline:true
                },
                {
                    name:`Min. Rarity:`,
                    value:rarity,
                    inline:true
                },
                {
                    name:`Party Atk:`,
                    value:atk,
                    inline:true
                }
            ],
            image:{
                url:Properties.enemySpawnData.tsunagarus.image[enemy_type]
            },
            footer:{
                text:`Special Protection: ${special_protection}`
            }
        }
    }

}

class Leveling {
    // 1 star was Lv.20, 2 star was Lv.25, 3 star was Lv.35, 4 star and Cure Cards was Lv.40 and 5 star and Premium Cure Cards was Lv.50
    static getMaxLevel(rarity){
        switch(rarity){
            case 1:
                return 20;
                break;
            case 2:
                return 25;
                break;
            case 3:
                return 35;
                break;
            case 4:
                return 40;
                break;
            default:
                return 50;
                break;
        }
    }

    static getNextCardExp(level,qty=1){
        var tempExp = 0;
        if(qty<=1){
            tempExp+=(level+1)*10;
        } else {
            //parameter:3: level 1->4
            for(var i=0;i<qty;i++){
                tempExp+=(level+1)*10;
                level+=1;
            }
        }
        
        return tempExp;
    }

    static getNextCardSpecialTotal(level){
        //get the card stock requirement to level up the specials
        switch(level){
            case 1:
                return 1;
            case 2:
                return 2;
            default:
                return 4;
        }
    }
    
}

class Shop {
    static async embedShopList() {
        var itemList = ""; var itemList2 = ""; var itemList3 = "";
        var result = await DB.selectAll(DBM_Item_Data.TABLENAME);
        result[0].forEach(item => {
            itemList += `**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`
            itemList2 += `${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
            itemList3 += `${item[DBM_Item_Data.columns.description]}\n`;
        });

        return {
            color: Properties.embedColor,
            author: {
                name: "Mofu shop",
                icon_url: "https://waa.ai/JEwn.png"
            },
            title: `Item Shop List:`,
            description: `Welcome to Mofushop! Here are the available item list that you can purchase:\nUse **p!card shop buy <item id> [qty]** to purchase the item.`,
            fields:[
                {
                    name:`ID - Name:`,
                    value:itemList,
                    inline:true
                },
                {
                    name:`Price (MC):`,
                    value:itemList2,
                    inline:true
                },
                {
                    name:`Description`,
                    value:itemList3,
                    inline:true
                }
            ],
        }
    }
}

class Status {
    static getHp(level,base_hp){
        return level*base_hp;
    }

    static getModifiedHp(level,base_hp){
        return this.getHp(level,base_hp)-base_hp;
    }

    static getAtk(level,base_atk){
        return (level*5)+base_atk;
    }

    static getSpecialAtk(level_special,base_atk){
        return level_special*base_atk;
    }

    static getSpecialActivationChance(level,level_special){
        return level+(level_special*2);
    }

    static getSpecialPointProgress(level,level_special,enemyLevel=1){
        var retValue = (level*3)+(level_special*2)+(enemyLevel*3);
        if(retValue>=40){retValue = 40;} //cap the received special point
        return retValue;
    }

    static getPartySpecialPointProgress(level,level_special,enemyLevel=1){
        var retValue = level+(level_special*2)+enemyLevel;
        if(retValue>=35){retValue = 35;} //cap the received special point
        return retValue;
    }
    
    static getBonusDropRate(level_special){
        return level_special*3;
    }

    static async updateSpecialPoint(id_user,value){
        var specialCharged = false;
        var maxPoint = 100;
        var cardUserStatusData = await getCardUserStatusData(id_user);
    
        var querySpecialPoint = "";
    
        if(value>=1){
            //addition
            if(cardUserStatusData[DBM_Card_User_Data.columns.special_point]+value>=maxPoint){
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${maxPoint} `;
                specialCharged = true;
            } else {
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${DBM_Card_User_Data.columns.special_point}+${value} `;
            }
        } else {
            //substract
            if(cardUserStatusData[DBM_Card_User_Data.columns.special_point]-value<=0){
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = 0 `;
            } else {
                querySpecialPoint += ` ${DBM_Card_User_Data.columns.special_point} = ${DBM_Card_User_Data.columns.special_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
        SET ${querySpecialPoint} 
        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
    
        await DBConn.conn.promise().query(query, [id_user]);
        return specialCharged;
    }

    static async updatePartySpecialPoint(id_party,value){
        var specialCharged = false;
        var maxPoint = 100;
        var partyStatusData = await Party.getPartyStatusDataByIdParty(id_party);
    
        var querySpecialPoint = "";
    
        if(value>=1){
            //addition
            if(partyStatusData[DBM_Card_Party.columns.special_point]+value>=maxPoint){
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${maxPoint} `;
                specialCharged = true;
            } else {
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${DBM_Card_Party.columns.special_point}+${value} `;
            }
        } else {
            //substract
            if(partyStatusData[DBM_Card_Party.columns.special_point]-value<=0){
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = 0 `;
            } else {
                querySpecialPoint += ` ${DBM_Card_Party.columns.special_point} = ${DBM_Card_Party.columns.special_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_Party.TABLENAME} 
        SET ${querySpecialPoint} 
        WHERE ${DBM_Card_Party.columns.id}=?`;
    
        await DBConn.conn.promise().query(query, [id_party]);
        return specialCharged;
    }

}

class StatusEffect{
    static buffData = {
        second_chance:{
            value:"second_chance",
            name:"Second Chance",
            description:"You'll be given another chance to use the: **capture/answer/guess** command.",
        },
        lucky_number:{
            value:"lucky_number",
            name:"Lucky Number",
            permanent:false,
            description:"Provide number 7 as the next hidden number.",
            value_number:7
        },
        pink_coloraura_1:{
            value:"pink_coloraura_1",
            name:"Pink Aura 1",
            permanent:true,
            description:"10% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:10
        },
        blue_coloraura_1:{
            value:"blue_coloraura_1",
            name:"Blue Aura 1",
            permanent:true,
            description:"10% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:10
        },
        yellow_coloraura_1:{
            value:"yellow_coloraura_1",
            name:"Yellow Aura 1",
            permanent:true,
            description:"10% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:10
        },
        red_coloraura_1:{
            value:"red_coloraura_1",
            name:"Red Aura 1",
            permanent:true,
            description:"10% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:10
        },
        purple_coloraura_1:{
            value:"purple_coloraura_1",
            name:"Purple Aura 1",
            permanent:true,
            description:"10% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:10
        },
        white_coloraura_1:{
            value:"white_coloraura_1",
            name:"White Aura 1",
            permanent:true,
            description:"10% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:10
        },
        green_coloraura_1:{
            value:"green_coloraura_1",
            name:"Green Aura 1",
            permanent:true,
            description:"10% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:10
        },
        pink_coloraura_2:{
            value:"pink_coloraura_2",
            name:"Pink Aura 2",
            permanent:true,
            description:"15% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:15
        },
        blue_coloraura_2:{
            value:"blue_coloraura_2",
            name:"Blue Aura 2",
            permanent:true,
            description:"15% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:15
        },
        yellow_coloraura_2:{
            value:"yellow_coloraura_2",
            name:"Yellow Aura 2",
            permanent:true,
            description:"15% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:15
        },
        red_coloraura_2:{
            value:"red_coloraura_2",
            name:"Red Aura 2",
            permanent:true,
            description:"15% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:15
        },
        purple_coloraura_2:{
            value:"purple_coloraura_2",
            name:"Purple Aura 2",
            permanent:true,
            description:"15% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:15
        },
        white_coloraura_2:{
            value:"white_coloraura_2",
            name:"White Aura 2",
            permanent:true,
            description:"15% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:15
        },
        green_coloraura_2:{
            value:"green_coloraura_2",
            name:"Green Aura 2",
            permanent:true,
            description:"15% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:15
        },
        clear_status_all:{
            value:"clear_status_all",
            name:"Status Removal",
            description:"Remove the Debuff & Clear Status Effect."
        },
        quiz_master:{
            value:"quiz_master",
            name:"Quiz Master",
            permanent:false,
            description:"Instantly give the correct answer if the answer is wrong."
        },

        hp_up_1:{
            value:"hp_up_1",
            name:"Hp Up 1",
            description:"+50 hp boost during battle.",
            value_hp_boost:50,
            permanent:true
        },
        hp_up_2:{
            value:"hp_up_2",
            name:"Hp Up 2",
            description:"+100 hp boost during battle.",
            value_hp_boost:100,
            permanent:true
        },
        hp_up_3:{
            value:"hp_up_3",
            name:"Hp Up 3",
            description:"+150 hp boost during battle.",
            value_hp_boost:150,
            permanent:true
        },
        hp_up_4:{
            value:"hp_up_4",
            name:"Hp Up 4",
            description:"+300 hp boost during battle.",
            value_hp_boost:300,
            permanent:false
        },

        rarity_up_1:{
            value:"rarity_up_1",
            name:"Rarity Up 1",
            description:"+1 :star: rarity during battle.",
            value_rarity_boost:1,
            permanent:true
        },
        rarity_up_2:{
            value:"rarity_up_2",
            name:"Rarity Up 2",
            description:"+2 :star: rarity during battle.",
            value_rarity_boost:2,
            permanent:true
        },
        rarity_up_3:{
            value:"rarity_up_3",
            name:"Rarity Up 3",
            description:"+3 :star: rarity during battle.",
            value_rarity_boost:3,
            permanent:true
        },
        rarity_up_4:{
            value:"rarity_up_4",
            name:"Rarity Up 4",
            description:"+4 :star: rarity during battle.",
            value_rarity_boost:4,
            permanent:false
        },
        atk_up_1:{
            value:"atk_up_1",
            name:"Atk Up 1",
            description:"+50 atk boost during battle.",
            value_atk_boost:50,
            permanent:true
        },
        atk_up_2:{
            value:"atk_up_2",
            name:"Atk Up 2",
            description:"+80 atk boost during battle.",
            value_atk_boost:80,
            permanent:true
        },
        atk_up_3:{
            value:"atk_up_3",
            name:"Atk Up 3",
            description:"+150 atk boost during battle.",
            value_atk_boost:150,
            permanent:true
        },
        atk_up_4:{
            value:"atk_up_4",
            name:"Atk Up 4",
            description:"+300 atk boost during battle.",
            value_atk_boost:300,
            permanent:false
        },

        battle_protection:{
            value:"battle_protection",
            name:"Battle Protection",
            description:"You'll be given another chance to use the **set** & **battle** command again if you lost from the battle. And you're also protected from receiving debuff.",
            permanent:false
        },
        precure_protection:{
            value:"precure_protection",
            name:"Precure Protection",
            description:"**Protect** yourself from losing the precure avatar and allow you to use the **battle** command again if you lost from the battle.",
            permanent:false
        },
        debuff_protection_1:{
            value:"debuff_protection_1",
            name:"Debuff Protection 1",
            description:"**Protect** yourself from receiving debuff.",
            permanent:false
        },
        debuff_protection_2:{
            value:"debuff_protection_2",
            name:"Debuff Protection 2",
            description:"**Permanently protect** yourself from receiving debuff.",
            permanent:true
        },
        rainbow_coloraura_1:{
            value:"rainbow_coloraura_1",
            name:"Rainbow Aura 1",
            description:"5% capture boost for all card.",
            value_capture_boost:5,
            permanent:true
        },
        rainbow_coloraura_2:{
            value:"rainbow_coloraura_2",
            name:"Rainbow Aura 2",
            description:"10% capture boost for all card.",
            value_capture_boost:10,
            permanent:true
        },
        rainbow_coloraura_3:{
            value:"rainbow_coloraura_3",
            name:"Rainbow Aura 3",
            description:"15% capture boost for all card.",
            value_capture_boost:15,
            permanent:true
        },
        remove_debuff:{
            value:"remove_debuff",
            name:"Debuff Removal",
            description:"Remove the chosen debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_cardcaplock:{
            value:"remove_debuff_cardcaplock",
            name:"Cardcaplock Removed",
            description:"Remove **cardcaplock** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_fear:{
            value:"remove_debuff_fear",
            name:"Fear  Removed",
            description:"Remove **fear** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_amnesia:{
            value:"remove_debuff_amnesia",
            name:"Amnesia Removed",
            description:"Remove **amnesia** debuff.",
            usable:false,
            clear_status:true
        },
        remove_debuff_specialock:{
            value:"remove_debuff_specialock",
            name:"Specialock Removed",
            description:"Remove **specialock** debuff.",
            usable:false,
            clear_status:true
        },
        special_break:{
            value:"special_break",
            name:"Special Break",
            description:"**Break** through enemy **special protection**!",
            permanent:false
        },
        scan_tsunagarus:{
            value:"scan_tsunagarus",
            name:"🔍 Tsunagascan!",
            description:"Scan",
            permanent:false
        }
    }

    static partyBuffData = {
        party_atk_up_1:{
            value:"party_atk_up_1",
            name:"Party Atk Up 1",
            description:"+150 atk boost for party.",
            value_atk_boost:150,
            permanent:true
        },
        party_atk_up_2:{
            value:"party_atk_up_2",
            name:"Party Atk Up 2",
            description:"+200 atk boost for party.",
            value_atk_boost:200,
            permanent:true
        },
        party_atk_up_3:{
            value:"party_atk_up_3",
            name:"Party Atk Up 3",
            description:"+250 atk boost for party.",
            value_atk_boost:250,
            permanent:true
        },
        party_atk_up_4:{
            value:"party_atk_up_4",
            name:"Party Atk Up 4",
            description:"+300 atk boost for party.",
            value_atk_boost:300,
            permanent:false
        },

        party_hp_up_1:{
            value:"party_hp_up_1",
            name:"Party Hp Up 1",
            description:"+150 hp boost for party.",
            value_hp_boost:150,
            permanent:true
        },
        party_hp_up_2:{
            value:"party_hp_up_2",
            name:"Party Hp Up 2",
            description:"+200 hp boost for party.",
            value_hp_boost:200,
            permanent:true
        },
        party_hp_up_3:{
            value:"party_hp_up_3",
            name:"Party Hp Up 3",
            description:"+250 hp boost for party.",
            value_hp_boost:250,
            permanent:true
        },
        party_hp_up_4:{
            value:"party_hp_up_4",
            name:"Party Hp Up 4",
            description:"+300 hp boost for party.",
            value_hp_boost:300,
            permanent:true
        },

        party_rarity_up_1:{
            value:"party_rarity_up_1",
            name:"Party Rarity Up 1",
            description:"+1 :star: rarity for party.",
            value_rarity_boost:1,
            permanent:true
        },
        party_rarity_up_2:{
            value:"party_rarity_up_2",
            name:"Party Rarity Up 2",
            description:"+2 :star: rarity for party.",
            value_rarity_boost:2,
            permanent:true
        },
        party_rarity_up_3:{
            value:"party_rarity_up_3",
            name:"Party Rarity Up 3",
            description:"+3 :star: rarity for party.",
            value_rarity_boost:3,
            permanent:true
        },
        party_rarity_up_4:{
            value:"party_rarity_up_4",
            name:"Party Rarity Up 4",
            description:"+4 :star: rarity for party.",
            value_rarity_boost:4,
            permanent:false
        },
    }

    static debuffData = {
        item_curse:{
            value:"item_curse",
            name:"Item Curse",
            description:"Unable to use any item except with the item that has **Debuff Removal**.",
            permanent:true,
            recovery_item:["ca017","fo009"]
        },
        capture_debuff_1:{
            value:"capture_debuff_1",
            name:"Capture Debuff 1",
            description:"-30% capture rate when using **capture** command.",
            value_capture_down:30,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_2:{
            value:"capture_debuff_2",
            name:"Capture Debuff 2",
            description:"-50% capture rate when using **capture** command.",
            value_capture_down:50,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_3:{
            value:"capture_debuff_3",
            name:"Capture Debuff 3",
            description:"-70% capture rate when using **capture** command.",
            value_capture_down:70,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },
        capture_debuff_4:{
            value:"capture_debuff_4",
            name:"Capture Debuff 4",
            description:"-100% capture rate when using **capture** command.",
            value_capture_down:100,
            recovery_item:["ca003","ca004","ca005","ca006","ca007","ca008",
            "ca009","ca010","ca011","ca012","ca013","ca014","ca015","ca016","ca017",
            "fo004","fo005","fo009"],
            permanent:true
        },

        hp_down_1:{
            value:"hp_down_1",
            name:"Hp Down 1",
            description:"-100 hp during battle.",
            value_hp_down:100,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_2:{
            value:"hp_down_2",
            name:"Hp Down 2",
            description:"-150 hp during battle.",
            value_hp_down:150,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_3:{
            value:"hp_down_3",
            name:"Hp Down 3",
            description:"-200 hp during battle.",
            value_hp_down:200,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },
        hp_down_4:{
            value:"hp_down_4",
            name:"Hp Up 4",
            description:"-300 hp during battle.",
            value_hp_down:300,
            recovery_item:["ca017","ca019","ca020","ca023","fo001","fo009"],
            permanent:true
        },

        rarity_down_1:{
            value:"rarity_down_1",
            name:"Rarity Down 1",
            description:"-1 :star: rarity during battle.",
            value_rarity_down:1,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_2:{
            value:"rarity_down_2",
            name:"Rarity Down 2",
            description:"-2 :star: rarity during battle.",
            value_rarity_down:2,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_3:{
            value:"rarity_down_3",
            name:"Rarity Down 3",
            description:"-3 :star: rarity during battle.",
            value_rarity_down:3,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },
        rarity_down_4:{
            value:"rarity_down_4",
            name:"Rarity Down 4",
            description:"-4 :star: rarity during battle.",
            value_rarity_down:4,
            recovery_item:["ca017","ca021","ca022","ca024","fo002","fo009"],
            permanent:true
        },

        atk_down_1:{
            value:"atk_down_1",
            name:"Atk Down 1",
            description:"-100 atk during battle.",
            value_atk_down:100,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_2:{
            value:"atk_down_2",
            name:"Atk Down 2",
            description:"-150 atk during battle.",
            value_atk_down:150,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_3:{
            value:"atk_down_3",
            name:"Atk Down 3",
            description:"-180 atk during battle.",
            value_atk_down:180,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        atk_down_4:{
            value:"atk_down_4",
            name:"Atk Down 4",
            description:"-200 atk during battle.",
            value_atk_down:200,
            recovery_item:["ca017","ca025","ca026","ca027","fo003","fo009"],
            permanent:true
        },
        fear:{
            value:"fear",
            name:"Fear",
            description:"Unable to participate in **battle**.",
            permanent:true,
            recovery_item:["ca029","ca017","fo009"]
        },
        cardcaplock:{
            value:"cardcaplock",
            name:"Cardcaplock",
            description:"Unable to use the **capture** command.",
            permanent:true,
            recovery_item:["ca028","ca017","fo009"]
        },
        amnesia:{
            value:"amnesia",
            name:"Amnesia",
            description:"Unable to use the **guess/answer** command.",
            permanent:true,
            recovery_item:["ca030","ca017","fo009"]
        },
        specialock:{
            value:"specialock",
            name:"Specialock",
            description:"Unable to use special attack during battle.",
            permanent:true,
            recovery_item:["ca031","ca017","fo009"]
        }
    }

    static async updateStatusEffect(id_user,status_effect){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.status_effect,status_effect);
        
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);

        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static async embedStatusEffectActivated(userUsername,userAvatarUrl,status_effect,statusType="buff",teamBattle=false){
        var icon = "⬆️";//default icon
        var SEDescription = ""; var parTitle = "";
        var imgThumbnail = Properties.imgResponse.imgOk;
        switch(statusType){
            case "debuff":
                icon = "⬇️";
                parTitle = `${icon} Debuff inflicted!`;
                SEDescription = `**${this.debuffData[status_effect].name}**:\n${this.debuffData[status_effect].description}`;
                imgThumbnail = Properties.imgResponse.imgFailed;
                break;
            case "buff":
                if(!teamBattle){
                    parTitle = `${icon} Status Effect Activated!`;
                    SEDescription = `**${this.buffData[status_effect].name}**:\n${this.buffData[status_effect].description}`;
                } else {
                    parTitle = `${icon} Status Effect Activated!`;
                    SEDescription = `**${this.partyBuffData[status_effect].name}**:\n${this.partyBuffData[status_effect].description}`;
                }
                break;
        }
        return {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:imgThumbnail
            },
            title: parTitle,
            description: SEDescription,
        }
    }

}

class TradeBoard {
    static async getTradeboardData(id_guild,id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
        if(resultCheckExist[0][0]==null){
            //insert if not found
            var parameter = new Map();
            parameter.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameter.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            await DB.insert(DBM_Card_Tradeboard.TABLENAME,parameter);
            //reselect after insert new data
            parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
            var resultCheckExist = await DB.select(DBM_Card_Tradeboard.TABLENAME,parameterWhere);
            return await resultCheckExist[0][0];
        } else {
            return await resultCheckExist[0][0];
        }
    }

    static async removeListing(id_guild,id_user){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_want,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_have,null);
        parameterSet.set(DBM_Card_Tradeboard.columns.last_update,null);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,id_user);
        await DB.update(DBM_Card_Tradeboard.TABLENAME,parameterSet,parameterWhere);
    }
}

class Quest {
    static questData = {
        last_daily_quest:"last_daily_quest",
        dataQuest:"dataQuest"
    }

    static async setQuestData(idUser,objReward){
        var todayDate = new Date().getDate();
        var questData = `{"${this.questData.last_daily_quest}":${todayDate},"${this.questData.dataQuest}":${objReward}}`;
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.daily_quest,questData);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,idUser);
        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static getQuestReward(cardRarity){
        return cardRarity*10;
    }
}

class Embeds{
    static precureAvatarView(embedColor,userUsername,userAvatarUrl,packName,
        level,hp,atk,level_special,thumbnail,cardId,rarity,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = Properties.dataCardCore[packName].transform_quotes;
        // if("transform_super_quotes" in Properties.dataCardCore[packName]){
        //     transformQuotes = Properties.dataCardCore[packName].transform_super_quotes;
        // }

        var imgTransformation = Properties.dataCardCore[packName].icon;//default transformation image

        if("img_transformation" in Properties.dataCardCore[packName]){
            if(Properties.dataCardCore[packName].img_transformation.length>0){
                imgTransformation = GlobalFunctions.randomArrayItem(Properties.dataCardCore[packName].img_transformation);
            }
        }
        
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: Properties.dataCardCore[packName].henshin_phrase,
            description: transformQuotes,
            fields:[
                {
                    name:`${rarity}⭐ ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                    value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                    inline:true
                }
            ],
            thumbnail:{
                url:thumbnail
            },
            image:{
                url:imgTransformation
            },
            footer:{
                text:`Cure Avatar ID: ${cardId}`
            }
        }

        switch(type){
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                objEmbed.fields = [
                    {
                        name:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ Gold ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                        value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                        inline:true
                    }
                ]
                break;
        }
        
        return objEmbed;
    }

    static battleSpecialActivated(embedColor,userUsername,userAvatarUrl,packName,
        level_special,rewardsReceived){
        return {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}**!`,
            description: `**${Properties.dataCardCore[packName].alter_ego}** has used the special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            },
        }
    }

    static teamBattleSpecialActivated(embedColor,userUsername,userAvatarUrl,seriesName,packName,teamName,rewardsReceived){
        return {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.seriesCardCore[seriesName].special_name}**!`,
            description: `**${teamName}** has used the team special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            },
        }
    }

    static battleSpecialReady(userUsername,userAvatarUrl,individual=true){
        var txtDescription = `Your special point is ready now! You can use the special attack on the next battle spawn.`;
        if(!individual){
            txtDescription = `Your party special point has been fully charged!.`;
        }
        return {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Special Point Fully Charged!`,
            description: txtDescription,
            thumbnail:{
                url:Properties.imgResponse.imgOk
            }
        }
    }

    static battleWin(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `With the help of **${Properties.dataCardCore[packName].alter_ego}**, **${userUsername}** has won the battle against tsunagarus!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        }
    }

    static battleLost(userUsername,userAvatarUrl,_description,rewardsReceived,debuff_data=""){
        var objEmbed = {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Defeated!`,
            thumbnail:{
                url:Properties.imgResponse.imgFailed
            },
            description: _description,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ]
        }

        if(debuff_data!=""){
            objEmbed.fields[objEmbed.fields.length] = {
                name : "⬇️ Debuff inflicted!",
                value: `**${StatusEffect.debuffData[debuff_data].name}**:\n${StatusEffect.debuffData[debuff_data].description}`
            }
        }

        return objEmbed;
    }

    static teamBattleWin(packName,seriesName,partyName,txtReward){
        return {
            color: Properties.embedColor,
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${partyName}** has won the battle against tsunagarus!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            }
        }
    }

    static teamBattleHit(embedColor,packName,partyName,removedColor,txtReward){
        return {
            color: Properties.dataColorCore[embedColor].color,
            title: `Nice Hit!`,
            author: {
                name: partyName
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${removedColor}** color has been taken down!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        }
    }
}

class Party {
    static maxPartyMembers = 6;//included with the leader

    static async searchPartyStatusData(id_guild,id_user){
        //search either leader/member
        var query = `SELECT * 
        FROM ${DBM_Card_Party.TABLENAME} 
        WHERE (${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.id_user}=?) OR 
        (${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.party_data} like '%${id_user}%') 
        LIMIT 1`;

        var arrParameterized = [id_guild,id_user,id_guild];
        var result = await DBConn.conn.promise().query(query, arrParameterized);
        result = result[0][0];
        if(result==null){
            return null;
        } else {
            return result;
        }
    }

    static async getPartyStatusData(id_guild,id_user){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
        parameterWhere.set(DBM_Card_Party.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_Party.TABLENAME,parameterWhere);
        if(resultCheckExist[0][0]==null){
            //insert if not found
            return null;
        } else {
            return await resultCheckExist[0][0];
        }
    }

    static async getPartyStatusDataByIdParty(id_party){
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_Party.columns.id,id_party);
        var resultCheckExist = await DB.select(DBM_Card_Party.TABLENAME,parameterWhere);
        resultCheckExist = resultCheckExist[0][0];
        if(resultCheckExist==null){
            //insert if not found
            return null;
        } else {
            return await resultCheckExist;
        }
    }

    static async getAllStatus(id_party){
        //total status:
        var objReturn = {
            atk:0,
            hp:0,
            rarity_buff:0,
            status_effect:null,
            synergy:false,
            synergy_series:null
        };
        var synergySeries = "";
        var partyStatusData = await this.getPartyStatusDataByIdParty(id_party);
        var userData = await getCardUserStatusData(partyStatusData[DBM_Card_Party.columns.id_user]);
        //get leader status
        if(userData[DBM_Card_User_Data.columns.card_id_selected]!=null){
            var cardData = await getCardData(userData[DBM_Card_User_Data.columns.card_id_selected]);
            var cardInventoryData = await getCardInventoryUserData(partyStatusData[DBM_Card_User_Data.columns.id_user],
                userData[DBM_Card_User_Data.columns.card_id_selected]);
            
            objReturn.synergy = true;
            synergySeries = cardData[DBM_Card_Data.columns.series];
            objReturn.atk += Status.getAtk(cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_atk]);
            objReturn.hp += Status.getHp(cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp]);

            //check for ability
            if(cardData[DBM_Card_Data.columns.ability1] in StatusEffect.partyBuffData){
                switch(cardData[DBM_Card_Data.columns.ability1]){
                    case StatusEffect.partyBuffData.party_atk_up_1.value:
                    case StatusEffect.partyBuffData.party_atk_up_2.value:
                    case StatusEffect.partyBuffData.party_atk_up_3.value:
                    case StatusEffect.partyBuffData.party_atk_up_4.value:
                        objReturn.atk+=StatusEffect.partyBuffData[cardData[DBM_Card_Data.columns.ability1]].value_atk_boost;
                        break;
                    case StatusEffect.partyBuffData.party_hp_up_1.value:
                    case StatusEffect.partyBuffData.party_hp_up_2.value:
                    case StatusEffect.partyBuffData.party_hp_up_3.value:
                    case StatusEffect.partyBuffData.party_hp_up_4.value:
                        objReturn.hp+=StatusEffect.partyBuffData[cardData[DBM_Card_Data.columns.ability1]].value_hp_boost;
                        break;
                    case StatusEffect.partyBuffData.party_rarity_up_1.value:
                    case StatusEffect.partyBuffData.party_rarity_up_2.value:
                    case StatusEffect.partyBuffData.party_rarity_up_3.value:
                    case StatusEffect.partyBuffData.party_rarity_up_4.value:
                        objReturn.rarity_buff+=StatusEffect.partyBuffData[cardData[DBM_Card_Data.columns.ability1]].value_rarity_boost;
                        break;
                }
            }

            objReturn.status_effect = cardData[DBM_Card_Data.columns.ability1];
            objReturn.synergy_series = synergySeries;
        }

        //member status
        if(partyStatusData[DBM_Card_Party.columns.party_data]!=null){
            var splittedUserId = partyStatusData[DBM_Card_Party.columns.party_data].split(",");
            for(var i=0;i<splittedUserId.length;i++){
                var cardUserData = await getCardUserStatusData(splittedUserId[i]);
                if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                    var cardData = await getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                    var cardInventoryData = await getCardInventoryUserData(splittedUserId[i],
                        cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                    if(cardData[DBM_Card_Data.columns.series]==synergySeries){
                        objReturn.atk+=Status.getAtk(cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_atk]);
                        objReturn.hp+=Status.getHp(cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp]);
                    }
                    // console.log(Status.getAtk(cardUserData[DBM_Card_User_Data.columns.level],cardData[DBM_Card_Data.columns.max_atk]));
                    
                    //check for synergy
                    if(synergySeries!=""&&synergySeries!=cardData[DBM_Card_Data.columns.series]){
                        objReturn.synergy = false;
                    }
                }
            }
        }
        

        return objReturn;
    }

    static async updateParty(id_guild,id_user,party_name){
        var partyData = await this.getPartyStatusData(id_guild,id_user);
        if(partyData==null){
            //insert if not found
            var parameter = new Map();
            parameter.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameter.set(DBM_Card_Party.columns.id_user,id_user);
            parameter.set(DBM_Card_Party.columns.name,party_name);
            await DB.insert(DBM_Card_Party.TABLENAME,parameter);
        } else {
            //update party name if found
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.name,party_name);

            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id_user,id_user);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        }

        //reselect the data again
        var partyData = await this.getPartyStatusData(id_guild,id_user);
        return partyData;
    }

    static async joinParty(id_guild,id_party,id_user){
        var objEmbed ={
            color: Properties.embedColor
        };

        var partyData = await this.getPartyStatusDataByIdParty(id_party);

        //select if user is member from party/not
        var query = `SELECT * 
        FROM ${DBM_Card_Party.TABLENAME} 
        WHERE ${DBM_Card_Party.columns.id_guild}=? AND 
        ${DBM_Card_Party.columns.party_data} like '%${id_user}%'`;
        var arrParameterized = [id_guild];
        var checkUserMember = await DBConn.conn.promise().query(query, arrParameterized);
        checkUserMember = checkUserMember[0][0];
        if(checkUserMember!=null){
            objEmbed.thumbnail = {
                url:Properties.imgResponse.imgError
            }
            objEmbed.description = `:x: You cannot join another party while you're still on the party.`;
            return objEmbed;
        }

        if(partyData[DBM_Card_Party.columns.party_data]==null||partyData[DBM_Card_Party.columns.party_data]==""){
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.party_data,id_user);

            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id,id_party);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        } else {
            //check for current party total
            var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
            if(splittedUserId.length>=this.maxPartyMembers-1){
                objEmbed.thumbnail = {
                    url:Properties.imgResponse.imgError
                }
                objEmbed.description = `:x: Sorry, this party already full.`;
                return objEmbed;
            }

            //update the party data
            var tempPartyData = partyData[DBM_Card_Party.columns.party_data];
            tempPartyData+=`,${id_user}`;
            
            var parameterSet = new Map();
            parameterSet.set(DBM_Card_Party.columns.party_data,tempPartyData);
            var parameterWhere = new Map();
            parameterWhere.set(DBM_Card_Party.columns.id_guild,id_guild);
            parameterWhere.set(DBM_Card_Party.columns.id,id_party);
            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
        }

        //reset the precure avatar
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

        //reselect the data
        var partyData = await this.getPartyStatusDataByIdParty(id_party);
        var totalMembers = 1;
        var txtMembers = `><@${partyData[DBM_Card_Party.columns.id_user]}>\n`;
        var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
        for(var i=0;i<splittedUserId.length;i++){
            txtMembers+=`><@${splittedUserId[i]}>\n`;
            totalMembers++;
        }

        objEmbed.description = `You have joined the party: **${partyData[DBM_Card_Party.columns.name]}**.`;
        objEmbed.fields = [
            {
                name:`Party Members (${totalMembers}/${this.maxPartyMembers}):`,
                value:txtMembers,
                inline:true
            }
        ];
        objEmbed.footer = {
            text:`Party ID: ${partyData[DBM_Card_Party.columns.id]}`
        }

        return objEmbed;
    }

    static async updatePartyPoint(id_party,value){
        var maxPoint = 10;
        var partyStatusData = await this.getPartyStatusDataByIdParty(id_party);
    
        var querySet = "";
    
        if(value>=1){
            //addition
            if(partyStatusData[DBM_Card_Party.columns.party_point]+value>=maxPoint){
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${maxPoint} `;
            } else {
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${DBM_Card_Party.columns.party_point}+${value} `;
            }
        } else {
            //substract
            if(partyStatusData[DBM_Card_Party.columns.party_point]-value<=0){
                querySet += ` ${DBM_Card_Party.columns.party_point} = 0 `;
            } else {
                querySet += ` ${DBM_Card_Party.columns.party_point} = ${DBM_Card_Party.columns.party_point}${value} `;
            }
        }
    
        var query = `UPDATE ${DBM_Card_Party.TABLENAME} 
        SET ${querySet} 
        WHERE ${DBM_Card_Party.columns.id}=?`;
    
        await DBConn.conn.promise().query(query, [id_party]);
    }

}

//get 1 card data
async function getAllCardDataByPack(card_pack){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Data.columns.pack,card_pack);
    var parameterOrderBy = new Map();
    parameterOrderBy.set(DBM_Card_Data.columns.id_card,"asc");
    var result = await DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere,parameterOrderBy);
    return result[0];
}

async function getCardData(id_card) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Data.columns.id_card,id_card);
    var result = await DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere);
    return result[0][0];
}

async function getCardInventoryUserData(id_user,id_card) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.selectAll(DBM_Card_Inventory.TABLENAME,parameterWhere);
    return result[0][0];
}

function embedCardLevelUp(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,username,
    level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var hpHeader = "HP: "; var modifiedHp = "";
    if(Status.getModifiedHp(level,max_hp)>0){
        hpHeader += Status.getHp(level,max_hp);
        modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
    }

    var objEmbed = {
        color:Properties.dataColorCore[embedColor].color,
        author:{
            iconURL:Properties.dataCardCore[packName].icon,
            name:`Level ${level}/${Leveling.getMaxLevel(rarity)}`
        },
        title:cardName,
        thumbnail:{
            url:imgUrl
        },
        fields:[
            {
                name:"ID:",
                value:id_card,
                inline:true
            },
            {
                name:"Series:",
                value:series,
                inline:true
            },
            {
                name:"Rarity:",
                value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                inline:true
            },
            {
                name:"HP:",
                value:Status.getHp(level,max_hp),
                inline:true
            },
            {
                name:"Atk:",
                value:`${Status.getAtk(level,max_atk)}`,
                inline:true
            },
            {
                name:`Special:`,
                value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                inline:true
            }
        ],
        footer:{
            iconURL:avatarImgUrl,
            text:`${username}`
        }
    }

    switch(type){
        case Properties.cardCategory.gold.value:
            objEmbed.color = Properties.cardCategory[type].color;
            objEmbed.title = `${cardName} ✨`;
            break;
    }

    return objEmbed;
}

function embedCardCapture(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,username,currentCardTotal,
    max_hp,max_atk,cardStock=0){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var objEmbed = {
        color:Properties.dataColorCore[embedColor].color,
        author:{
            iconURL:Properties.dataCardCore[packName].icon,
            name:`${GlobalFunctions.capitalize(packName)} Card Pack`
        },
        title:cardName,
        image:{
            url:imgUrl
        },
        fields:[
            {
                name:"ID:",
                value:id_card,
                inline:true
            },
            {
                name:"Series:",
                value:series,
                inline:true
            },
            {
                name:"Rarity:",
                value:`${rarity} :star:`,
                inline:true
            },
            {
                name:"HP:",
                value:`${max_hp}`,
                inline:true
            },
            {
                name:"Atk:",
                value:`${Status.getAtk(1,max_atk)}`,
                inline:true
            },
            {
                name:`Special:`,
                value:Properties.dataCardCore[packName].special_attack,
                inline:true
            }
        ]
    }

    if(cardStock>=1){
        objEmbed["footer"] = {
            iconURL:avatarImgUrl,
            text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total}) x${cardStock}`
        }
    } else {
        objEmbed["footer"] = {
            iconURL:avatarImgUrl,
            text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total})`
        }
    }

    return objEmbed;
}

function embedCardDetail(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,receivedDate,
    level,max_hp,max_atk,special_level,stock=0,ability1,type=Properties.cardCategory.normal.value){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var customReceivedDate = new Date(receivedDate);
    customReceivedDate = `${("0" + receivedDate.getDate()).slice(-2)}/${("0" + (receivedDate.getMonth() + 1)).slice(-2)}/${customReceivedDate.getFullYear()}`;

    var txtPartyAbility = "-";
    if(ability1 in StatusEffect.partyBuffData){
        txtPartyAbility = `**${StatusEffect.partyBuffData[ability1].name}:**\n${StatusEffect.partyBuffData[ability1].description}`;
    }

    var objEmbed = {
        color:Properties.dataColorCore[embedColor].color,
        author:{
            iconURL:Properties.dataCardCore[packName].icon,
            name:`Level ${level}/${Leveling.getMaxLevel(rarity)} | Next CP: ${Leveling.getNextCardExp(level)}`
        },
        title:`${cardName}`,
        description:`**Ability:**\n${txtPartyAbility}`,
        image:{
            url:imgUrl
        },
        fields:[
            {
                name:"ID:",
                value:id_card,
                inline:true
            },
            {
                name:"Series:",
                value:series,
                inline:true
            },
            {
                name:"Rarity:",
                value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                inline:true
            },
            {
                name:`HP:`,
                value:`${Status.getHp(level,max_hp)}`,
                inline:true
            },
            {
                name:"Atk:",
                value:`${Status.getAtk(level,max_atk)}`,
                inline:true
            },
            {
                name:`Special:`,
                value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                inline:true
            }
        ],
        footer:{
            iconURL:avatarImgUrl,
            text:`Received at: ${customReceivedDate}`
        }
    }

    //modify the card
    switch(type){
        case Properties.cardCategory.gold.value:
            objEmbed.color = Properties.cardCategory.gold.color;
            objEmbed.title = `${cardName} ✨`;
            break;
    }

    if(stock>=1){
        objEmbed.footer.text+= ` | Stock:${stock}`;
    }

    return objEmbed;
}

const embedBioPackList = {
    color: Properties.embedColor,
    title : `Character List`,
    fields : [{
        name: `Pink`,
        value: `Nagisa\nSaki\nNozomi\nLove\nTsubomi\nHibiki\nMiyuki\nMana\nMegumi\nHaruka\nMirai\nIchika\nHana\nHikaru\nNodoka`,
        inline: true
    },
    {
        name: `Blue`,
        value: `Karen\nMiki\nErika\nEllen\nReika\nRikka\nHime\nMinami\nAoi\nSaaya\nYuni\nChiyu`,
        inline: true
    },
    {
        name: `Yellow`,
        value: `Hikari\nUrara\nInori\nItsuki\nAko\nYayoi\nAlice\nYuko\nKirara\nHimari\nHomare\nElena\nHinata`,
        inline: true
    },
    {
        name: `Purple`,
        value: `Yuri\nMakoto\nIona\nRiko\nYukari\nAmour\nMadoka\nKurumi`,
        inline: true
    },
    {
        name: `Red`,
        value: `Rin\nSetsuna\nAkane\nAguri\nTowa\nAkira\nEmiru`,
        inline: true
    },
    {
        name: `Green`,
        value: `Komachi\nNao\nKotoha\nCiel\nLala`,
        inline: true
    },
    {
        name: `White`,
        value: `Honoka\nMai\nKanade`,
        inline: true
    }]
}

const embedCardPackList = {
    color: Properties.embedColor,
    title : `Card Pack List`,
    fields : [{
        name: `Pink`,
        value: `Nagisa\nSaki\nNozomi\nLove\nTsubomi\nHibiki\nMiyuki\nMana\nMegumi\nHaruka\nMirai\nIchika\nHana\nHikaru\nNodoka`,
        inline: true
    },
    {
        name: `Blue`,
        value: `Karen\nMiki\nErika\nEllen\nReika\nRikka\nHime\nMinami\nAoi\nSaaya\nYuni\nChiyu`,
        inline: true
    },
    {
        name: `Yellow`,
        value: `Hikari\nUrara\nInori\nItsuki\nAko\nYayoi\nAlice\nYuko\nKirara\nHimari\nHomare\nElena\nHinata`,
        inline: true
    },
    {
        name: `Purple`,
        value: `Yuri\nMakoto\nIona\nRiko\nYukari\nRuru\nMadoka\nKurumi`,
        inline: true
    },
    {
        name: `Red`,
        value: `Rin\nSetsuna\nAkane\nAguri\nTowa\nAkira\nEmiru`,
        inline: true
    },
    {
        name: `Green`,
        value: `Komachi\nNao\nKotoha\nCiel\nLala`,
        inline: true
    },
    {
        name: `White`,
        value: `Honoka\nMai\nKanade`,
        inline: true
    }]
}

//get 1 card user data
async function getCardUserStatusData(id_user){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
    var resultCheckExist = await DB.select(DBM_Card_User_Data.TABLENAME,parameterWhere);
    if(resultCheckExist[0][0]==null){
        //insert if not found
        var parameter = new Map();
        parameter.set(DBM_Card_User_Data.columns.id_user,id_user);
        await DB.insert(DBM_Card_User_Data.TABLENAME,parameter);
        //reselect after insert new data
        parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);
        var resultCheckExist = await DB.select(DBM_Card_User_Data.TABLENAME,parameterWhere);
        return await resultCheckExist[0][0];
    } else {
        return await resultCheckExist[0][0];
    }
}

async function checkUserHaveCard(id_user,id_card){
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return await true;
    } else {
        return await false;
    }
}

async function getUserCardInventoryData(id_user,id_card){
    //return the stock if existed
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return result[0][0];
    } else {
        return null;
    }
}

async function getUserCardStock(id_user,id_card){
    //return the stock if existed
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Inventory.columns.id_card,id_card);
    var result = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return result[0][0][DBM_Card_Inventory.columns.stock];
    } else {
        return -1;
    }
}

async function getUserTotalCard(id_user,pack){
    var query = `select cd.${DBM_Card_Data.columns.pack},count(inv.${DBM_Card_Inventory.columns.id_user}) as total
    from ${DBM_Card_Data.TABLENAME} cd, ${DBM_Card_Inventory.TABLENAME} inv 
    where cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
    inv.${DBM_Card_Inventory.columns.id_user}=? and 
    cd.${DBM_Card_Data.columns.pack} = ?`;
    var arrParameterized = [id_user,pack];
    var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
    return cardDataInventory[0][0].total;
}

async function getAverageLevel(id_user,arrColorLevel=null){
    if(arrColorLevel==null){
        //if arrColorLevel provided we dont need to read it from db
        var userData = await getCardUserStatusData(id_user);
        arrColorLevel = [
            userData[DBM_Card_User_Data.columns.color_level_blue],
            userData[DBM_Card_User_Data.columns.color_level_green],
            userData[DBM_Card_User_Data.columns.color_level_pink],
            userData[DBM_Card_User_Data.columns.color_level_purple],
            userData[DBM_Card_User_Data.columns.color_level_red],
            userData[DBM_Card_User_Data.columns.color_level_white],
            userData[DBM_Card_User_Data.columns.color_level_yellow]
        ]
    }
    var total = 0;
    for(var i = 0; i < arrColorLevel.length; i++) {
        total += arrColorLevel[i];
    }
    return Math.ceil(total / arrColorLevel.length);
}

async function updateCatchAttempt(id_user,spawn_token,objColor=null){
    //update catch attempt, add color exp in object if parameter existed
    //get color point
    var maxColorPoint = 1000;
    var cardUserStatusData = await getCardUserStatusData(id_user);
    var arrParameterized = [];
    arrParameterized.push(spawn_token);
    var queryColor = "";
    
    if(objColor!=null){
        for (const [key, value] of objColor.entries()) {
            //get current color point
            // var selectedColor = `color_point_${key}`;
            if(cardUserStatusData[key]+value>=maxColorPoint){
                queryColor += `, ${key} = ${maxColorPoint}, `;
            } else {
                queryColor += `, ${key} = ${key}+${value}, `;
            }
        }
        queryColor = queryColor.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${DBM_Card_User_Data.columns.spawn_token}=? ${queryColor}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
    arrParameterized.push(id_user);

    await DBConn.conn.promise().query(query, arrParameterized);
}

async function checkCardCompletion(id_guild,id_user,category,value){
    
    //category parameter: color/pack
    //check if user founded on leaderboard/not
    var queryCompletion = `select count(*) as total 
        FROM ${DBM_Card_Leaderboard.TABLENAME} 
        WHERE ${DBM_Card_Leaderboard.columns.id_guild}=? AND 
        ${DBM_Card_Leaderboard.columns.id_user}=? AND 
        ${DBM_Card_Leaderboard.columns.category}=? AND 
        ${DBM_Card_Leaderboard.columns.completion}=?`;
    var checkLeaderboardExists = await DBConn.conn.promise().query(queryCompletion, [id_guild,id_user,category,value]);
    if(checkLeaderboardExists[0][0]["total"]>=1){
        return false;
    }

    switch(category){
        case "color":
            //check color set completion:
            var queryColorCompletion = `select count(ci.${DBM_Card_Inventory.columns.id_card}) as total 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.color}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,id_user];
            var checkColorCompletion = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
            if(checkColorCompletion[0][0]["total"]>=Properties.dataColorCore[value].total){
                return true;
            }
            break;
        case "pack":
            //pack category
            var currentTotalCard = await getUserTotalCard(id_user,value);
            var maxTotalCard = Properties.dataCardCore[value].total;
            if(currentTotalCard>=maxTotalCard){
                return true;
            }
            break;
        case "color_gold":
            //check color set completion:
            var queryColorCompletion = `select count(ci.${DBM_Card_Inventory.columns.id_card}) as total 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.color}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=? and
            ci.${DBM_Card_Inventory.columns.is_gold}=1`;
            var arrParameterized = [value,id_user];
            var checkColorCompletion = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
            if(checkColorCompletion[0][0]["total"]>=Properties.dataColorCore[value].total){
                return true;
            }
            break;
        case "pack_gold":
            var query = `select count(inv.${DBM_Card_Inventory.columns.id_user}) as total 
            from ${DBM_Card_Data.TABLENAME} cd 
            left join ${DBM_Card_Inventory.TABLENAME} inv 
            on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
            cd.${DBM_Card_Data.columns.pack}=? and 
            inv.${DBM_Card_Inventory.columns.id_user}=? and inv.${DBM_Card_Inventory.columns.is_gold}=1`;

            var arrParameterized = [value,id_user];
            var checkPackCompletion = await DBConn.conn.promise().query(query, arrParameterized);
            if(checkPackCompletion[0][0]["total"]>=Properties.dataCardCore[value].total){
                return true;
            }
            break;
        case "series":
            //check color set completion:
            var query = `select count(ci.${DBM_Card_Inventory.columns.id_user}) as total_inventory,(select count(cd.${DBM_Card_Data.columns.id_card}) as total_series 
            from ${DBM_Card_Data.TABLENAME} cd 
            where cd.${DBM_Card_Data.columns.series}=?) as total_series 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd 
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.series}=? and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,value,id_user];
            var completionData = await DBConn.conn.promise().query(query, arrParameterized);
            if(completionData[0][0]["total_inventory"]>=completionData[0][0]["total_series"]){
                return true;
            }
            break;
        case "series_gold":
            var query = `select count(ci.${DBM_Card_Inventory.columns.id_user}) as total_inventory,(select count(cd.${DBM_Card_Data.columns.id_card}) as total_series 
            from ${DBM_Card_Data.TABLENAME} cd 
            where cd.${DBM_Card_Data.columns.series}=?) as total_series 
            from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd 
            where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
            cd.${DBM_Card_Data.columns.series}=? and 
            ci.${DBM_Card_Inventory.columns.is_gold}=1 and 
            ci.${DBM_Card_Inventory.columns.id_user}=?`;
            var arrParameterized = [value,value,id_user];
            var completionData = await DBConn.conn.promise().query(query, arrParameterized);
            if(completionData[0][0]["total_inventory"]>=completionData[0][0]["total_series"]){
                return true;
            }
            break;
    }

    return false;
}

async function leaderboardAddNew(id_guild,id_user,imgAvatarUrl,_color,category,completion){
    //check if leaderboard data exists/not
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Leaderboard.columns.id_guild,id_guild);
    parameterWhere.set(DBM_Card_Leaderboard.columns.id_user,id_user);
    parameterWhere.set(DBM_Card_Leaderboard.columns.category,category);
    parameterWhere.set(DBM_Card_Leaderboard.columns.completion,completion);
    var checkExistsLeaderboard = await DB.select(DBM_Card_Leaderboard.TABLENAME,parameterWhere);
    if(checkExistsLeaderboard[0][DBM_Card_Leaderboard.columns.id_user]==null){
        var parameterNew = new Map();
        parameterNew.set(DBM_Card_Leaderboard.columns.id_guild,id_guild);
        parameterNew.set(DBM_Card_Leaderboard.columns.id_user,id_user);
        parameterNew.set(DBM_Card_Leaderboard.columns.category,category);
        parameterNew.set(DBM_Card_Leaderboard.columns.completion,completion);
        await DB.insert(DBM_Card_Leaderboard.TABLENAME,parameterNew);
        
        //prepare the completion date
        var completionDate = new Date();
        var dd = String(completionDate.getDate()).padStart(2, '0');
        var mm = String(completionDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = completionDate.getFullYear();
        completionDate = dd + '/' + mm + '/' + yyyy;

        var objEmbed = {
            color: _color,
            thumbnail : {
                url:imgAvatarUrl
            }
        }
        
        switch(category){
            case "color":
                //color completed
                objEmbed.title = `Card Color Set ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has become new master of cure **${completion}**!`;
                break;
            case "pack":
                //pack completed
                objEmbed.title = `${GlobalFunctions.capitalize(completion)} Card Pack Completed!`;
                objEmbed.description = `<@${id_user}> has completed the card pack: **${completion}**!`;
                break;
            case "color_gold":
                //color completed
                objEmbed.title = `Gold ${GlobalFunctions.capitalize(completion)} Set Completed!`;
                objEmbed.description = `<@${id_user}> has become new master of gold cure **${completion}**!`;
                break;
            case "pack_gold":
                //pack completed
                objEmbed.title = `Gold ${GlobalFunctions.capitalize(completion)} Pack Completed!`;
                objEmbed.description = `<@${id_user}> has completed the gold card pack: **${completion}**!`;
                break;
            case "series":
                //pack completed
                objEmbed.title = `Card Series ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has completed the card series: **${completion}**!`;
                break;
            case "series_gold":
                //pack completed
                objEmbed.title = `Gold Series ${GlobalFunctions.capitalize(completion)} Completed!`;
                objEmbed.description = `<@${id_user}> has completed the gold series: **${completion}**!`;
                break;
        }

        objEmbed.footer = {
            iconURL:imgAvatarUrl,
            text:`Completed at: ${completionDate}`
        };

        return objEmbed;

    } else {
        return null;
    }
}

function getNextColorPoint(level){
    return level*100;
}

function getBonusCatchAttempt(level){
    //starting from level 2: every level get 5% catch bonus
    if(level>=2){
        return (level*5)-5;
    } else {
        return 0;
    }
}

async function updateColorPoint(id_user,objColor){
    //get color point
    var maxColorPoint = Properties.limit.colorpoint;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var queryColor = "";
    for (const [key, value] of objColor.entries()) {
        //get current color point
        // var selectedColor = `color_point_${key}`;
        if(value>=1){
            //addition
            if(cardUserStatusData[key]+value>=maxColorPoint){
                queryColor += ` ${key} = ${maxColorPoint}, `;
            } else {
                queryColor += ` ${key} = ${key}+${value}, `;
            }
        } else {
            //substract
            if(cardUserStatusData[key]-value<=0){
                queryColor += ` ${key} = 0, `;
            } else {
                queryColor += ` ${key} = ${key}${value}, `;
            }
        }
    }

    if(objColor!=null){
        queryColor = queryColor.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${queryColor}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}

async function updateMofucoin(id_user,value){
    var maxCoin = Properties.limit.mofucoin;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var queryCoin = "";

    if(value>=1){
        //addition
        if(cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]+value>=maxCoin){
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${maxCoin} `;
        } else {
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}+${value} `;
        }
    } else {
        //substract
        if(cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]-value<=0){
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = 0 `;
        } else {
            queryCoin += ` ${DBM_Card_User_Data.columns.mofucoin} = ${DBM_Card_User_Data.columns.mofucoin}${value} `;
        }
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${queryCoin}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}

async function updateSeriesPoint(id_user,objSeries){
    //get series point
    var maxSeriesPoint = Properties.limit.seriespoint;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var querySeries = "";
    for (const [key, value] of objSeries.entries()) {
        //get current series point
        if(value>=1){
            //addition
            if(cardUserStatusData[key]+value>=maxSeriesPoint){
                querySeries += ` ${key} = ${maxSeriesPoint}, `;
            } else {
                querySeries += ` ${key} = ${key}+${value}, `;
            }
        } else {
            //substract
            if(cardUserStatusData[key]-value<=0){
                querySeries += ` ${key} = 0, `;
            } else {
                querySeries += ` ${key} = ${key}${value}, `;
            }
        }
    }

    if(objSeries!=null){
        querySeries = querySeries.replace(/,\s*$/, "");//remove the last comma and any whitespace
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${querySeries}
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [id_user]);
}


function getCardPack(id_card){
    id_card = id_card.toLowerCase();
    if(id_card.contains("agma")){
        return "aguri";
    } else if(id_card.contains("akhi")){
        return "akane";
    } else if(id_card.contains("akke")){
        return "akira";
    } else if(id_card.contains("aksh")){
        return "ako";
    } else if(id_card.contains("alyo")){
        return "alice";
    } else if(id_card.contains("amru")){
        return "ruru";
    } else if(id_card.contains("aota")){
        return "aoi";
    } else if(id_card.contains("chsa")){
        return "chiyu";
    } else if(id_card.contains("ciki")){
        return "ciel";
    } else if(id_card.contains("elam")){
        return "elena";
    } else if(id_card.contains("elku")){
        return "ellen";
    } else if(id_card.contains("emai")){
        return "emiru";
    } else if(id_card.contains("erku")){
        return "erika";
    } else if(id_card.contains("haha")){
        return "haruka";
    } else if(id_card.contains("hano")){
        return "hana";
    } else if(id_card.contains("hiar")){
        return "himari";
    } else if(id_card.contains("hihi")){
        return "hinata";
    } else if(id_card.contains("hiho")){
        return "hibiki";
    } else if(id_card.contains("hiku")){
        return "hikari";
    } else if(id_card.contains("hise")){
        return "hikaru";
    } else if(id_card.contains("hish")){
        return "hime";
    } else if(id_card.contains("hoka")){
        return "homare";
    } else if(id_card.contains("hoyu")){
        return "honoka";
    } else if(id_card.contains("icus")){
        return "ichika";
    } else if(id_card.contains("inya")){
        return "inori";
    } else if(id_card.contains("iohi")){
        return "iona";
    } else if(id_card.contains("itmy")){
        return "itsuki";
    } else if(id_card.contains("kami")){
        return "kanade";
    } else if(id_card.contains("kamin")){
        return "karen";
    } else if(id_card.contains("kiam")){
        return "kirara";
    } else if(id_card.contains("koak")){
        return "komachi";
    } else if(id_card.contains("koha")){
        return "kotoha";
    } else if(id_card.contains("kumi")){
        return "kurumi";
    } else if(id_card.contains("laha")){
        return "lala";
    } else if(id_card.contains("lomo")){
        return "love";
    } else if(id_card.contains("maai")){
        return "mana";
    } else if(id_card.contains("maka")){
        return "madoka";
    } else if(id_card.contains("make")){
        return "makoto";
    } else if(id_card.contains("mami")){
        return "mai";
    } else if(id_card.contains("meai")){
        return "megumi";
    } else if(id_card.contains("miao")){
        return "miki";
    } else if(id_card.contains("mias")){
        return "mirai";
    } else if(id_card.contains("miho")){
        return "miyuki";
    } else if(id_card.contains("mikai")){
        return "minami";
    } else if(id_card.contains("nami")){
        return "nagisa";
    } else if(id_card.contains("naomi")){
        return "nao";
    } else if(id_card.contains("noha")){
        return "nodoka";
    } else if(id_card.contains("nozomi")){
        return "noyu";
    } else if(id_card.contains("reao")){
        return "reika";
    } else if(id_card.contains("rihi")){
        return "rikka";
    } else if(id_card.contains("riiz")){
        return "riko";
    } else if(id_card.contains("rina")){
        return "rin";
    } else if(id_card.contains("sahy")){
        return "saki";
    } else if(id_card.contains("saya")){
        return "saaya";
    } else if(id_card.contains("sehi")){
        return "setsuna";
    } else if(id_card.contains("toak")){
        return "towa";
    } else if(id_card.contains("tsha")){
        return "tsubomi";
    } else if(id_card.contains("urka")){
        return "urara";
    } else if(id_card.contains("yaki")){
        return "yayoi";
    } else if(id_card.contains("yuko")){
        return "yukari";
    } else if(id_card.contains("yuni")){
        return "yuni";
    } else if(id_card.contains("yuom")){
        return "yuko";
    } else if(id_card.contains("yuts")){
        return "yuri";
    } else {
        return null;
    }
}

async function removeCardGuildSpawn(id_guild,removeSpawnType=true,removeSpawnId=true,removeSpawnData=true){
    //erase all card spawn information
    var parameterSet = new Map();
    if(removeSpawnType){
        parameterSet.set(DBM_Card_Guild.columns.spawn_type,null);
    }
    if(removeSpawnId){
        parameterSet.set(DBM_Card_Guild.columns.spawn_id,null);
    }
    
    parameterSet.set(DBM_Card_Guild.columns.spawn_color,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_number,null);

    if(removeSpawnData){
        parameterSet.set(DBM_Card_Guild.columns.spawn_data,null);
    }
    
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function updateMessageIdSpawn(id_guild,id_message){
    //update the message id on card spawn
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.id_last_message_spawn,id_message);
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function generateCardSpawn(id_guild,specificType=null,overwriteToken = true){
    var cardGuildData = await CardGuildModules.getCardGuildData(id_guild);
    //reset guild timer information
    //update & erase last spawn information if overwriteToken param is provided
    if(overwriteToken){
        await removeCardGuildSpawn(id_guild);
    }
    
    // var rndIndex = GlobalFunctions.randomNumber(0,Properties.spawnType.length-1); 
    // // var cardSpawnType = Properties.spawnType[rndIndex].toLowerCase();
    // // if(specificType!=null){
    // //     cardSpawnType = specificType;
    // // }

    //start randomize the spawn
    var cardSpawnType = "";

    // for (const key in Properties.objSpawnType) {
    //     if(cardSpawnType==""){
    //         var rnd = GlobalFunctions.randomNumber(0,100);
    //         var minRnd = 100-Properties.objSpawnType[key];//get the minimum random number
    //         if(rnd>=minRnd){
    //             cardSpawnType = key;
    //         }
    //     }
    // }

    //if card spawn is empty set to default:normal
    // if(cardSpawnType==""){
    //     cardSpawnType = "normal";
    // }

    var rnd = GlobalFunctions.randomNumber(1,100);
    // battle:25,//25
    // quiz:20,//20
    // normal:20,
    // number:15,
    // color:10,
    // series:10
    if(rnd<Properties.objSpawnType.battle){
        cardSpawnType = "battle";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz){
        var rnd = GlobalFunctions.randomNumber(0,1);
        switch(rnd){
            case 0:
                cardSpawnType = "normal";
                break;
            case 1:
                cardSpawnType = "quiz";
                break;
        }
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number){
        cardSpawnType = "number";
    } else if(rnd<Properties.objSpawnType.battle+Properties.objSpawnType.normal+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.color+Properties.objSpawnType.quiz+Properties.objSpawnType.number+Properties.objSpawnType.series){
        var rnd = GlobalFunctions.randomNumber(0,1);
        switch(rnd){
            case 0:
                cardSpawnType = "series";
                break;
            case 1:
                cardSpawnType = "color";
                break;
        }
    } else {
        cardSpawnType = "battle";
    }

    //for debugging purpose:
    // cardSpawnType = "battle";

    var query = "";
    //prepare the embed object
    var objEmbed = {
        color: Properties.embedColor
    }

    //get color total
    // var colorTotal = 0; 
    // for ( var {} in Properties.dataColorCore ) { colorTotal++; }

    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);

    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.spawn_type,cardSpawnType); //set the spawn type
    if(overwriteToken){
        parameterSet.set(DBM_Card_Guild.columns.spawn_token,GlobalFunctions.randomNumber(0,100000)); //set & randomize the spawn token
    }
    switch(cardSpawnType) {
        case "color": // color spawn type
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Color Card";
            objEmbed.description = `A **color** card has appeared! Use: **p!card catch** to capture the card based from your assigned color.`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
            break;
        case "series":
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Series Card";
            objEmbed.description = `A **series** card has appeared! Use: **p!card catch** to capture the card based from your assigned series.`;
            objEmbed.footer = {
                text:`⭐ Rarity: 1-3 | ⬆️ Bonus Catch Rate+10%`
            }
            break;
        case "number": //number spawn type
            //get color total:
            var rndNumber = GlobalFunctions.randomNumber(2,10);
            var rndIndexColor = GlobalFunctions.randomNumber(0,Properties.arrColor.length-1);
            var selectedColor = Properties.arrColor[rndIndexColor];
            parameterSet.set(DBM_Card_Guild.columns.spawn_color,selectedColor);
            parameterSet.set(DBM_Card_Guild.columns.spawn_number,rndNumber);
            objEmbed.color = Properties.dataColorCore[selectedColor].color;
            
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
            ${DBM_Card_Data.columns.rarity}<=? AND 
            ${DBM_Card_Data.columns.color}=? 
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[4,5,selectedColor]);
            parameterSet.set(DBM_Card_Guild.columns.spawn_id,resultData[0][0][DBM_Card_Data.columns.id_card]);
            if(cardSpawnType=="number"){
                objEmbed.author = {
                    name:`Number Card: ${GlobalFunctions.capitalize(selectedColor)} Edition`
                }
                objEmbed.title = ":game_die: It's Lucky Numbers Time!";
                objEmbed.description = `Guess whether the hidden number**(1-12)** will be **lower** or **higher** than the current number: **${rndNumber}** with: **p!card guess <lower/higher>**`;
                objEmbed.image = {
                    url:Properties.dataColorCore[selectedColor].imgMysteryUrl
                }
            }
            
            objEmbed.footer = {
                text:`⭐ Rarity: 4-5 | ⏫ Catch Rate: 100%`
            }
            
            break;
        
        case "quiz":
            var randomQuizType = GlobalFunctions.randomNumber(0,1);
            var query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
            ${DBM_Card_Data.columns.rarity}<=? 
            ORDER BY rand() 
            LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[1,4]);
            // randomQuizType = 1;//for debugging purpose
            if(randomQuizType>=1){
                query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}=? 
                ORDER BY rand() 
                LIMIT 1`;
                resultData = await DBConn.conn.promise().query(query,[5]);
            }
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnColor = resultData[0][0][DBM_Card_Data.columns.color];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var arrAnswerList = [cardSpawnPack]; //prepare the answer list

            if(randomQuizType<=0){
                var alterEgo = Properties.dataCardCore[cardSpawnPack].alter_ego;
                //get the other pack answer
                var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.color} 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.pack}<>? 
                GROUP BY ${DBM_Card_Data.columns.pack} 
                ORDER BY rand() 
                LIMIT 3`;
                var resultDataAnotherAnswer = await DBConn.conn.promise().query(queryAnotherQuestion,[cardSpawnPack]);
                resultDataAnotherAnswer[0].forEach(function(entry){
                    arrAnswerList.push(entry[DBM_Card_Data.columns.pack]);
                })
    
                //shuffle the answer
                arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                //get the answer
                var answer = arrAnswerList.indexOf(cardSpawnPack);
                switch(answer){
                    case 0:
                        answer = "a";
                        break;
                    case 1:
                        answer = "b";
                        break;
                    case 2:
                        answer = "c";
                        break;
                    case 3:
                        answer = "d";
                        break;
                }
    
                parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeNormal}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);
    
                //prepare the embed:
                objEmbed.author = {
                    name:`Quiz Card`,
                }
                objEmbed.title = `:grey_question: It's Quiz Time!`;
                objEmbed.description = `The series theme/motif was about: **${Properties.spawnHintSeries[cardSpawnSeries]}** and I'm known as **${alterEgo}**. Who am I?`;
                objEmbed.fields = [{
                    name:`Answer command:\np!card answer <a/b/c/d>`,
                    value:`**A. ${Properties.dataCardCore[arrAnswerList[0]].fullname}\nB. ${Properties.dataCardCore[arrAnswerList[1]].fullname}\nC. ${Properties.dataCardCore[arrAnswerList[2]].fullname}\nD. ${Properties.dataCardCore[arrAnswerList[3]].fullname}**`
                }]
                objEmbed.image ={
                    url:Properties.spawnData.quiz.embed_img
                }
                objEmbed.footer = {
                    text:`⭐ Rarity: 1-4 | ⏫ Catch Rate: 100%`
                }
            } else {
                var splittedText = Properties.dataCardCore[cardSpawnPack].fullname.split(" ");
                var name = "";
                for(var i=0;i<splittedText.length;i++){
                    name += `${GlobalFunctions.shuffleText(GlobalFunctions.shuffleText(splittedText[i]))} `;
                }
                name = name.toLowerCase()

                //get the other pack answer
                var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.color} 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.pack}<>? 
                GROUP BY ${DBM_Card_Data.columns.pack} 
                ORDER BY rand() 
                LIMIT 3`;
                var resultDataAnotherAnswer = await DBConn.conn.promise().query(queryAnotherQuestion,[cardSpawnPack]);
                arrAnswerList[0] = `${GlobalFunctions.capitalize(cardSpawnSeries)} - ${GlobalFunctions.capitalize(cardSpawnColor)} Cure`;
                var tempAnswer = arrAnswerList[0];
                resultDataAnotherAnswer[0].forEach(function(entry){
                    arrAnswerList.push(`${GlobalFunctions.capitalize(entry[DBM_Card_Data.columns.series])} - ${GlobalFunctions.capitalize(entry[DBM_Card_Data.columns.color])} Cure`);
                })

                //shuffle the answer
                arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                //get the answer
                var answer = arrAnswerList.indexOf(tempAnswer);
                switch(answer){
                    case 0:
                        answer = "a";
                        break;
                    case 1:
                        answer = "b";
                        break;
                    case 2:
                        answer = "c";
                        break;
                    case 3:
                        answer = "d";
                        break;
                }
    
                parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                `{"${Properties.spawnData.quiz.type}":"${Properties.spawnData.quiz.typeTsunagarus}","${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);

                //prepare the embed:
                objEmbed.color = Properties.enemySpawnData.tsunagarus.embedColor[Properties.enemySpawnData.tsunagarus.term.chiridjirin]
                objEmbed.author = {
                    name:`Quiztaccked!`,
                }
                objEmbed.thumbnail = {
                    url:Properties.imgResponse.imgFailed
                }
                objEmbed.description = `**${GlobalFunctions.capitalize(Properties.enemySpawnData.tsunagarus.term.chiridjirin)}** has interrupting the quiz time!\nRearrange this provided hint: **${name}** and choose the correct branch!`;
                objEmbed.fields = [{
                    name:`Branch command:\np!card choose <a/b/c/d>`,
                    value:`**A. ${arrAnswerList[0]}\nB. ${arrAnswerList[1]}\nC. ${arrAnswerList[2]}\nD. ${arrAnswerList[3]}**`
                }]
                objEmbed.image ={
                    url:Properties.enemySpawnData.tsunagarus.image[Properties.enemySpawnData.tsunagarus.term.chiridjirin]
                }
                objEmbed.footer = {
                    text:`⭐ Rarity: 5 | ⏫ Catch Rate: 100%`
                }
            }

            
            break;
        case "battle":

            //type:"type",//value will be: raid/
            // level:"level",//the level of the enemy
            // color:"color",
            // rarity:"rarity",
            // id_enemy:"id_enemy",
            // id_card_reward:"id_card_reward",
            // //hp will reduce the chance and stored into 3 key
            // hp1:"hp1",
            // hp2:"hp2",
            // hp3:"hp3",
            // special_allow:"special_allow",//true: special can be used
            // //atk will increase the chance and stored into 2 key
            // atk1:"atk1",
            // atk2:"atk2",

            //randomize the enemy type:
            var enemyType = GlobalFunctions.capitalize(Properties.enemySpawnData.tsunagarus.term.chokkins);//default enemy type
            var randomType = GlobalFunctions.randomNumber(0,10);

            // randomType = 9;//for debug purpose only

            //get the random enemy
            var query = `SELECT * 
            FROM ${DBM_Card_Enemies.TABLENAME} 
            ORDER BY rand() LIMIT 1`;
            var enemyData = await DBConn.conn.promise().query(query);
            enemyData = enemyData[0][0];
            var spawnSeries = enemyData[DBM_Card_Enemies.columns.series];

            //get 1 random card reward
            var query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? 
            ORDER BY rand() LIMIT 1`;
            var cardRewardData = await DBConn.conn.promise().query(query,[5]);
            cardRewardData = cardRewardData[0][0];

            var spawnData = "";
            if(randomType>=10){
                //dibosu
                enemyType = Properties.enemySpawnData.tsunagarus.term.dibosu;
                var randRarityMin = GlobalFunctions.randomNumber(3,5);
                var randLevel = GlobalFunctions.randomNumber(1,1);

                var randRarityCondition = GlobalFunctions.randomNumber(0,1);
                var titleRarity = "Rarity More Than:";
                if(randRarityCondition){
                    titleRarity = "Rarity Less Than:";
                    randRarityCondition = Properties.spawnData.battle.rarity_less;
                } else {
                    randRarityCondition = Properties.spawnData.battle.rarity_more;
                }

                //get the random series information
                var query = `select ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color}
                from ${DBM_Card_Data.TABLENAME} where ${DBM_Card_Data.columns.series}=? group by ${DBM_Card_Data.columns.color} order by rand() limit 2`;
                var cardDataWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataWeakness = cardDataWeakness[0];
                var cardDataSeriesWeakness = cardDataWeakness[0][DBM_Card_Data.columns.series];

                //get random color information
                var randColorCondition = GlobalFunctions.randomNumber(0,1);
                var titleColor = "Color:";
                if(randColorCondition){
                    titleColor = "Non Color:";
                    randColorCondition = Properties.spawnData.battle.color_non;
                } else {
                    randColorCondition = Properties.spawnData.battle.color;
                }

                var dtColorWeakness = "[";
                for(var i=0;i<cardDataWeakness.length;i++){
                    dtColorWeakness+=`"${cardDataWeakness[i][DBM_Card_Data.columns.color]}",`;
                }
                dtColorWeakness = dtColorWeakness.replace(/,\s*$/, "");//remove last comma
                dtColorWeakness += "]";

                //embed
                objEmbed.image = {
                    url:Properties.enemySpawnData.tsunagarus.image.dibosu
                }
                objEmbed.title = `Tsunagarus Lv.${randLevel} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has manifest the **series cure card** and possesses **${Properties.enemySpawnData[cardDataSeriesWeakness].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle.\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack.`;
                objEmbed.color = Properties.enemySpawnData.tsunagarus.embedColor.dibosu;
                objEmbed.fields = [
                    {
                        name:`Monster Type:`,
                        value:`${Properties.enemySpawnData[cardDataSeriesWeakness].term}`,
                        inline:true
                    },
                    {
                        name:titleColor,
                        value:`${dtColorWeakness.replace("[","").replace("]","").replace(/"/g, "").replace(/,/g,"/")}`,
                        inline:true
                    },
                    {
                        name:titleRarity,
                        value:`${randRarityMin}`,
                        inline:true
                    }
                ]

                objEmbed.footer = {
                    text:`Special Protection: ❌`
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${randColorCondition}":${dtColorWeakness},"${Properties.spawnData.battle.level}":1,"${randRarityCondition}":${randRarityMin}}`;

            } else if(randomType>=6) {
                //buttagiru : 6-7 star
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[6]);
                cardRewardData = cardRewardData[0][0];

                enemyType = Properties.enemySpawnData.tsunagarus.term.buttagiru;
                var randLevel = GlobalFunctions.randomNumber(10,20);

                var randomMinLives = GlobalFunctions.randomNumber(2,3);

                //get the random series information
                var query = `SELECT ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color}
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.series}=? 
                GROUP BY ${DBM_Card_Data.columns.color} 
                ORDER BY rand() 
                LIMIT ${randomMinLives}`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0];

                var dtColorWeakness = "[";
                for(var i=0;i<cardDataSeriesWeakness.length;i++){
                    dtColorWeakness+=`"${cardDataSeriesWeakness[i][DBM_Card_Data.columns.color]}",`;
                }
                dtColorWeakness = dtColorWeakness.replace(/,\s*$/, "");//remove last comma
                dtColorWeakness += "]";

                var randBaseAtk = GlobalFunctions.randomNumber(20,30);
                var randBaseHp = GlobalFunctions.randomNumber(50,70);
                var randRarityMin = GlobalFunctions.randomNumber(4,5);
                var txtRarity = "?";
                var rndShowInfo = 20-randLevel;
                if(rndShowInfo>GlobalFunctions.randomNumber(1,10)){
                    txtRarity=randRarityMin;
                }

                //start randomize status
                //randomize attack group
                var rndAtk1 = GlobalFunctions.randomNumber(1000,1001+(randBaseAtk*randLevel));
                // var rndAtk2 = GlobalFunctions.randomNumber(rndAtk1+2,rndAtk1+3+(randBaseAtk*randLevel));
                // var rndAtk3 = GlobalFunctions.randomNumber(rndAtk2+2,rndAtk2+3+(randBaseAtk*randLevel));
                var dtAtk = `"${Properties.spawnData.battle.atk1}":${rndAtk1},`;
                var txtAtk = String(rndAtk1);
                txtAtk = txtAtk.replace(txtAtk[0],"?").replace([txtAtk[1]],"?");
                if(rndShowInfo>GlobalFunctions.randomNumber(1,10)){
                    txtAtk=rndAtk1;
                }
                // txtAtk = txtAtk.replace(txtAtk[0],"?");

                //a-b,b-c,>c
                //randomize hp group
                var rndHp1 = GlobalFunctions.randomNumber(1500,1501+(randBaseHp*randLevel));
                // var rndHp2 = GlobalFunctions.randomNumber(rndHp1+2,rndHp1+3+(randBaseHp*randLevel));
                // if(rndHp2>=519){rndHp2=519;}
                // var rndHp3 = GlobalFunctions.randomNumber(rndHp2+2,rndHp2+3+(randBaseHp*randLevel));
                // if(rndHp3>=750){rndHp3=750;}//cap the hp penalty
                var dtHp = `"${Properties.spawnData.battle.hp1}":${rndHp1},`;
                dtHp = dtHp.replace(/,\s*$/, "");//remove last comma
                var txtHp = String(rndHp1);
                txtHp = txtHp.replace(txtHp[0],"?").replace(txtHp[1],"?");
                if(rndShowInfo>GlobalFunctions.randomNumber(1,10)){
                    txtHp=rndHp1;
                }

                //embed
                objEmbed.image = {
                    url:Properties.enemySpawnData.tsunagarus.image.buttagiru
                }
                objEmbed.title = `Tsunagarus Lv.${randLevel} has appeared!`;
                objEmbed.description = `It's a Big Monster! Team up to defeat the **${GlobalFunctions.capitalize(enemyType)}**! \n\n**p!card <command> List:**\n⚔️ **battle**: Participate in team battle.\n✨ **battle special**: Use the fully charged team attack.\n⬆️ **battle charge**: Charge up the team special point.\n🔍 **battle scan <info>**: Scan & Reveal <info>. (1 PP)`;
                objEmbed.color = "#B2D67A";

                //hiddenize the color lives
                var textColor = dtColorWeakness.replace("[","").replace("]","").replace(/"/g, "");
                for(var i=0;i<textColor.length;i++){
                    if(i>0&&textColor[i]!=","){
                        textColor = textColor.replace(textColor[i],"?");
                    }
                }

                //hiddenize the rarity
                //get the hint
                var hiddenEnemy = Properties.enemySpawnData[cardDataSeriesWeakness[0][DBM_Card_Data.columns.series]].term;
                var resultWord = [];
                var modWord = ``; var ctrHidden = 0; var arrWord = [];
                var maxModWord = 4;

                //get vowel word
                for(var i=0;i<hiddenEnemy.length;i++){
                    resultWord.push(hiddenEnemy[i]);
                }

                var arrTaken = GlobalFunctions.getRandomArray(resultWord,maxModWord);

                //start modify the word:
                for(var i=0;i<resultWord.length;i++){
                    if(arrTaken.includes(resultWord[i])){
                        modWord+=`?`;
                    } else {
                        modWord+=`${resultWord[i]}`;
                    }
                }

                objEmbed.fields = [
                    {
                        name:`Color Lives:`,
                        value:`${textColor}`,
                        inline:true
                    },
                    {
                        name:`Enemy Type:`,
                        value:`${modWord}`,
                        inline:true
                    },
                    {
                        name:`Min. Rarity:`,
                        value:`${txtRarity}`,
                        inline:true
                    },
                    {
                        name:`Party Atk:`,
                        value:`**<${txtAtk}** : -50%`,
                        inline:true
                    },
                    {
                        name:`Party Hp:`,
                        value:`**<${txtHp}** : -50%`,
                        inline:true
                    }
                ]

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=6){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${Properties.enemySpawnData.tsunagarus.category.boss}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${randLevel},"${Properties.spawnData.battle.color_lives}":${dtColorWeakness},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial},${dtAtk}${dtHp}}`;

            } else if(randomType>=4) {
                //Chiguhaguu : 5-7 
                enemyType = Properties.enemySpawnData.tsunagarus.term.chiguhaguu;
                var randRarityMin = GlobalFunctions.randomNumber(3,5);
                var randLevel = GlobalFunctions.randomNumber(1,3);

                //get the random series information
                var query = `SELECT ${DBM_Card_Data.columns.series}, ${DBM_Card_Data.columns.pack}, ${DBM_Card_Data.columns.color}
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.series}=? 
                ORDER BY rand() 
                LIMIT 1`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0][0];

                var dtColorWeakness = "[";
                dtColorWeakness+=`"${cardDataSeriesWeakness[DBM_Card_Data.columns.color]}",`;
                dtColorWeakness = dtColorWeakness.replace(/,\s*$/, "");//remove last comma
                dtColorWeakness += "]";

                //get the hint
                var hiddenAlterEgo = Properties.dataCardCore[cardDataSeriesWeakness[DBM_Card_Data.columns.pack]].alter_ego;
                var resultWord = [];
                var arrAlterEgo = hiddenAlterEgo.split(" ");//split into array
                var modWord = `${arrAlterEgo[0]} `; var ctrHidden = 0; var arrWord = [];
                var maxModWord = randLevel;
                if(maxModWord<=0){
                    //preserve 2 if reached 0
                    maxModWord = 2;
                }

                //get vowel word
                for(var i=0;i<arrAlterEgo[1].length;i++){
                    resultWord.push(arrAlterEgo[1][i]);
                }

                var arrTaken = GlobalFunctions.getRandomArray(resultWord,maxModWord);
                // console.log(`original: ${arrAlterEgo[1]}`);
                // console.log(`taken: ${arrTaken}`);

                //start modify the word:
                for(var i=0;i<arrAlterEgo[1].length;i++){
                    if(arrTaken.includes(arrAlterEgo[1][i])){
                        modWord+=`?`;
                    } else {
                        modWord+=`${arrAlterEgo[1][i]}`;
                    }
                }

                //uniquized the array:
                // resultWord = resultWord.filter((v, i, a) => a.indexOf(v) === i);


                var hintPack = `${Properties.dataCardCore[cardDataSeriesWeakness[DBM_Card_Data.columns.pack]].hint_chiguhaguu}`;
                hintPack = hintPack.replace("<x>",modWord);

                //embed
                objEmbed.image = {
                    url:Properties.enemySpawnData.tsunagarus.image.chiguhaguu
                }
                objEmbed.title = `Tsunagarus Level ${randLevel} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${Properties.enemySpawnData[cardDataSeriesWeakness[DBM_Card_Data.columns.series]].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle.\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack.`;
                objEmbed.color = "#C9C9C9";
                objEmbed.fields = [
                    {
                        name:`Monster Type:`,
                        value:`${Properties.enemySpawnData[cardDataSeriesWeakness[DBM_Card_Data.columns.series]].term}`,
                        inline:true
                    },
                    {
                        name:`Catchphrase:`,
                        value:`${hintPack}`,
                        inline:true
                    },
                    {
                        name:`Min. Rarity:`,
                        value:`${randRarityMin}`,
                        inline:true
                    }
                ]
                
                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=7){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${randLevel},"${Properties.spawnData.battle.color}":${dtColorWeakness},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial}}`;

            } else if(randomType>=2) {
                //gizzagizza: 5-7 star
                enemyType = Properties.enemySpawnData.tsunagarus.term.gizzagizza;
                var randRarityMin = GlobalFunctions.randomNumber(3,5);

                //get the random series information
                var query = `select ${DBM_Card_Data.columns.series} 
                from ${DBM_Card_Data.TABLENAME} 
                order by rand() 
                limit 1`;
                var cardDataSeriesWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataSeriesWeakness = cardDataSeriesWeakness[0][0];
                
                //get the card color weakness
                var query = `select ${DBM_Card_Data.columns.color}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.series}=? 
                group by ${DBM_Card_Data.columns.color} 
                order by rand() 
                limit 1`;
                var cardDataColorWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataColorWeakness = cardDataColorWeakness[0];
                var dtColorWeakness = "[";
                for(i=0;i<cardDataColorWeakness.length;i++){
                    dtColorWeakness+=`"${cardDataColorWeakness[i][DBM_Card_Data.columns.color]}",`;
                }
                dtColorWeakness = dtColorWeakness.replace(/,\s*$/, "");//remove last comma
                dtColorWeakness += "]";

                //embed
                objEmbed.image = {
                    url:Properties.enemySpawnData.tsunagarus.image.gizzagizza
                }
                objEmbed.title = `Tsunagarus Level 1 has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${Properties.enemySpawnData[spawnSeries].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle.\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack.`;
                objEmbed.color = "#ED873C";
                objEmbed.fields = [
                    {
                        name:`Monster Type:`,
                        value:`${Properties.enemySpawnData[spawnSeries].term}`,
                        inline:true
                    },
                    {
                        name:`Color Requirement:`,
                        value:`${dtColorWeakness.replace("[","").replace("]","").replace(/"/g, "")}`,
                        inline:true
                    },
                    {
                        name:`Min. Rarity:`,
                        value:`${randRarityMin}`,
                        inline:true
                    }
                ]
                
                objEmbed.footer = {
                    text:`Special Protection: ❌`
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.color}":${dtColorWeakness},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.level}":1,"${Properties.spawnData.battle.rarity}":${randRarityMin}}`;

            } else {
                var query = `SELECT * 
                FROM ${DBM_Card_Data.TABLENAME} 
                WHERE ${DBM_Card_Data.columns.rarity}>=? 
                ORDER BY rand() LIMIT 1`;
                var cardRewardData = await DBConn.conn.promise().query(query,[6]);
                cardRewardData = cardRewardData[0][0];

                //default: chokkins: 6-7
                //get the random enemy
                var randLevel = GlobalFunctions.randomNumber(3,8);
                var randBaseAtk = GlobalFunctions.randomNumber(50,70);
                var randBaseHp = GlobalFunctions.randomNumber(20,30);
                var randRarityMin = GlobalFunctions.randomNumber(4,5);

                //start randomize status
                //randomize attack group
                var rndAtk1 = GlobalFunctions.randomNumber(20,(randBaseAtk*randLevel));
                var rndAtk2 = GlobalFunctions.randomNumber(rndAtk1+2,rndAtk1+3+(randBaseAtk*randLevel));
                var rndAtk3 = GlobalFunctions.randomNumber(rndAtk2+2,rndAtk2+3+(randBaseAtk*randLevel));
                var dtAtk = `"${Properties.spawnData.battle.atk1}":${rndAtk1},"${Properties.spawnData.battle.atk2}":${rndAtk2},`;

                //a-b,b-c,>c
                //randomize hp group
                var rndHp1 = GlobalFunctions.randomNumber(20,21+(randBaseHp*randLevel));
                var rndHp2 = GlobalFunctions.randomNumber(rndHp1+2,randBaseHp+(rndHp1+2)*randLevel);
                if(rndHp2>=125){rndHp2=125;}
                var rndHp3 = GlobalFunctions.randomNumber(rndHp2+2,randBaseHp+(rndHp2+2)*randLevel);
                if(rndHp3>=175){rndHp3=175;}//cap the hp penalty
                var dtHp = `"${Properties.spawnData.battle.hp1}":${rndHp1},"${Properties.spawnData.battle.hp2}":${rndHp2},"${Properties.spawnData.battle.hp3}":${rndHp3},`;
                dtHp = dtHp.replace(/,\s*$/, "");//remove last comma

                // console.log("=============hp==================");
                // console.log(`<${rndHp1}`);
                // console.log(`${rndHp1+1}-${rndHp2}`);
                // console.log(`${rndHp2+1}-${rndHp3}`);
                // console.log("=============atk============");
                // console.log(`<${rndAtk1}`);
                // console.log(`${rndAtk1+1}-${rndAtk2}`);
                // console.log(`>${rndAtk2+1}`);

                //get the card color weakness
                var query = `select ${DBM_Card_Data.columns.color}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.series}=?
                group by ${DBM_Card_Data.columns.color}
                order by rand() 
                limit 1`;
                var cardDataColorWeakness = await DBConn.conn.promise().query(query,[enemyData[DBM_Card_Enemies.columns.series]]);
                cardDataColorWeakness = cardDataColorWeakness[0];
                var dtColorWeakness = "[";
                for(i=0;i<cardDataColorWeakness.length;i++){
                    dtColorWeakness+=`"${cardDataColorWeakness[i][DBM_Card_Data.columns.color]}",`;
                }
                dtColorWeakness = dtColorWeakness.replace(/,\s*$/, "");//remove last comma
                dtColorWeakness += "]";

                //embed
                objEmbed.image = {
                    url:Properties.enemySpawnData.tsunagarus.image.chokkins
                }
                objEmbed.title = `Tsunagarus Lv.${randLevel} has appeared!`;
                objEmbed.description = `${GlobalFunctions.capitalize(enemyType)} has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${Properties.enemySpawnData[spawnSeries].term}** powers!\n\n**Available Command:**\n⚔️ **p!card battle**: Participate in battle.\n✨ **p!card battle special**: Use the special attack.\n⬆️ **p!card battle charge**: Charge up your special attack.`;
                objEmbed.color = "#D9A4FE";
                objEmbed.fields = [
                    {
                        name:`⬆️ Series:`,
                        value:`${spawnSeries}: +5%`,
                        inline:true
                    },
                    {
                        name:`⬆️ Color:`,
                        value:`${dtColorWeakness.replace("[","").replace("]","").replace(/"/g, "")}: +5%`,
                        inline:true
                    },
                    {
                        name:`⬆️ Min. Rarity:`,
                        value:`${randRarityMin}: +10%`,
                        inline:true
                    },
                    {
                        name:`⬆️ Level/each:`,
                        value:`+1%`,
                        inline:true
                    },
                    {
                        name:`⬆️ Atk:`,
                        value:`<**${rndAtk1}**: +5%\n**${rndAtk1+1}-${rndAtk2}**: +10%\n>=**${rndAtk2+1}**: +15%`,
                        inline:true
                    },
                    {
                        name:`⬇️ Hp:`,
                        value:`**<${rndHp1}**: -10%\n**${rndHp1+1}-${rndHp2}**: -5%\n**${rndHp2+1}-${rndHp3}**: -3%`,
                        inline:true
                    }
                ]

                //randomize the special allowance
                var randAllowSpecial = GlobalFunctions.randomNumber(0,10);
                var dtAllowSpecial = `"${Properties.spawnData.battle.special_allow}":`;
                if(randAllowSpecial>=7){
                    dtAllowSpecial+="true";
                    objEmbed.footer = {
                        text:`Base Chance: 20% | Special Protection: ❌`
                    }
                } else {
                    dtAllowSpecial+="false";
                    objEmbed.footer = {
                        text:`Base Chance: 20% | Special Protection: ✅`
                    }
                }

                spawnData = `{"${Properties.spawnData.battle.category}":"${Properties.enemySpawnData.tsunagarus.category.normal}","${Properties.spawnData.battle.type}":"${enemyType}","${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${randLevel},"${Properties.spawnData.battle.color}":${dtColorWeakness},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial},${dtAtk}${dtHp}}`;
            }

            parameterSet.set(DBM_Card_Guild.columns.spawn_data,spawnData);
            break;
        default: // normal spawn type
            //get 1 card id
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}<=?  
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[3]); //for testing only
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var cardRarity = resultData[0][0][DBM_Card_Data.columns.rarity];
            var captureChance = `${100-(parseInt(cardRarity)*10)}`;

            parameterSet.set(DBM_Card_Guild.columns.spawn_id,cardSpawnId);
            objEmbed.color = Properties.dataColorCore[resultData[0][0][DBM_Card_Data.columns.color]].color;
            objEmbed.author = {
                name:`${GlobalFunctions.capitalize(cardSpawnSeries)} Card - ${GlobalFunctions.capitalize(resultData[0][0][DBM_Card_Data.columns.pack])}`,
                iconURL:Properties.dataCardCore[cardSpawnPack].icon,
            }
            objEmbed.title = resultData[0][0][DBM_Card_Data.columns.name];

            objEmbed.fields = [
                {
                    name:"Capture Command:",
                    value:`Use: **p!card catch** to capture the card.`,
                    inline:false
                }
            ];
            
            // objEmbed.description = `Use: **p!card catch** to capture the card.`;

            var randomPinky = GlobalFunctions.randomNumber(0,100);
            if(randomPinky<=20 && cardSpawnSeries=="yes! precure 5 gogo!"){
                //randomize pinky
                var queryPinky = `select pd.${DBM_Pinky_Data.columns.id_pinky},pd.${DBM_Pinky_Data.columns.name},pd.${DBM_Pinky_Data.columns.img_url}  
                from ${DBM_Pinky_Data.TABLENAME} pd 
                where pd.${DBM_Pinky_Data.columns.id_pinky} not in(
                select pi.${DBM_Pinky_Inventory.columns.id_pinky}  
                from ${DBM_Pinky_Inventory.TABLENAME} pi 
                where pi.${DBM_Pinky_Inventory.columns.id_guild}=?) 
                order by rand() 
                limit 1`;
                var resultDataPinky = await DBConn.conn.promise().query(queryPinky,[id_guild]);
                if(resultDataPinky[0][0]!=null){
                    objEmbed.fields[1] = [
                        {
                            name:"🦋 Special Capture Command:",
                            value:`Use: **p!pinky catch** to capture the pinky.`,
                            inline:false
                        }
                    ];
                    objEmbed.thumbnail = {
                        url:resultDataPinky[0][0][DBM_Pinky_Data.columns.img_url]
                    }
                    parameterSet.set(DBM_Card_Guild.columns.spawn_data,
                        `{"id_pinky":"${resultDataPinky[0][0][DBM_Pinky_Data.columns.id_pinky]}","id_card":"${cardSpawnId}"}`
                    );
                }
            }

            objEmbed.image ={
                url:resultData[0][0][DBM_Card_Data.columns.img_url]
            }
            objEmbed.footer = {
                text:`${cardRarity} ⭐ | ID: ${cardSpawnId} | ✔️ Catch Rate: ${captureChance}%`
            }
            break;
    }
    
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

    //update the time remaining information:
    await CardGuildModules.updateTimerRemaining(id_guild);

    // console.log(objEmbed);
    return objEmbed;
}

async function addNewCardInventory(id_user,id_card,addStock = false){
    if(!addStock){
        //check if card rarity is 6/7 to determine if it's cure card/not
        var cardData = await getCardData(id_card);

        var parameterSet = new Map();
        parameterSet.set(DBM_Card_Inventory.columns.id_user,id_user);
        parameterSet.set(DBM_Card_Inventory.columns.id_card,id_card);

        if(cardData[DBM_Card_Data.columns.rarity]>=6){
            parameterSet.set(DBM_Card_Inventory.columns.level_special,10);
        }
        
        await DB.insert(DBM_Card_Inventory.TABLENAME,parameterSet);
    } else {
        //update the stock
        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
        SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}+1 
        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
        ${DBM_Card_Inventory.columns.id_card}=?`;
        await DBConn.conn.promise().query(query, [id_user,id_card]);
    }
    
}

async function limitizeUserPoints(userId){
    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${DBM_Card_User_Data.columns.mofucoin} = IF(${DBM_Card_User_Data.columns.mofucoin}>=${Properties.limit.mofucoin}, ${Properties.limit.mofucoin}, ${DBM_Card_User_Data.columns.mofucoin}), 

    ${DBM_Card_User_Data.columns.color_point_pink} = IF(${DBM_Card_User_Data.columns.color_point_pink}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_pink}), 
    ${DBM_Card_User_Data.columns.color_point_blue} = IF(${DBM_Card_User_Data.columns.color_point_blue}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_blue}), 
    ${DBM_Card_User_Data.columns.color_point_green} = IF(${DBM_Card_User_Data.columns.color_point_green}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_green}), 
    ${DBM_Card_User_Data.columns.color_point_purple} = IF(${DBM_Card_User_Data.columns.color_point_purple}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_purple}), 
    ${DBM_Card_User_Data.columns.color_point_red} = IF(${DBM_Card_User_Data.columns.color_point_red}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_red}), 
    ${DBM_Card_User_Data.columns.color_point_white} = IF(${DBM_Card_User_Data.columns.color_point_white}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_white}), 
    ${DBM_Card_User_Data.columns.color_point_yellow} = IF(${DBM_Card_User_Data.columns.color_point_yellow}>=${Properties.limit.colorpoint}, ${Properties.limit.colorpoint}, ${DBM_Card_User_Data.columns.color_point_yellow}), 

    ${DBM_Card_User_Data.columns.sp001} = IF(${DBM_Card_User_Data.columns.sp001}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp001}), 
    ${DBM_Card_User_Data.columns.sp002} = IF(${DBM_Card_User_Data.columns.sp002}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp002}),
    ${DBM_Card_User_Data.columns.sp003} = IF(${DBM_Card_User_Data.columns.sp003}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp003}),
    ${DBM_Card_User_Data.columns.sp004} = IF(${DBM_Card_User_Data.columns.sp004}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp004}),
    ${DBM_Card_User_Data.columns.sp005} = IF(${DBM_Card_User_Data.columns.sp005}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp005}),
    ${DBM_Card_User_Data.columns.sp006} = IF(${DBM_Card_User_Data.columns.sp006}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp006}),
    ${DBM_Card_User_Data.columns.sp007} = IF(${DBM_Card_User_Data.columns.sp007}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp007}),
    ${DBM_Card_User_Data.columns.sp008} = IF(${DBM_Card_User_Data.columns.sp008}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp008}),
    ${DBM_Card_User_Data.columns.sp009} = IF(${DBM_Card_User_Data.columns.sp009}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp009}),
    ${DBM_Card_User_Data.columns.sp010} = IF(${DBM_Card_User_Data.columns.sp010}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp010}),
    ${DBM_Card_User_Data.columns.sp011} = IF(${DBM_Card_User_Data.columns.sp011}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp011}),
    ${DBM_Card_User_Data.columns.sp012} = IF(${DBM_Card_User_Data.columns.sp012}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp012}),
    ${DBM_Card_User_Data.columns.sp013} = IF(${DBM_Card_User_Data.columns.sp013}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp013}),
    ${DBM_Card_User_Data.columns.sp014} = IF(${DBM_Card_User_Data.columns.sp014}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp014}),
    ${DBM_Card_User_Data.columns.sp015} = IF(${DBM_Card_User_Data.columns.sp015}>=${Properties.limit.seriespoint}, ${Properties.limit.seriespoint}, ${DBM_Card_User_Data.columns.sp015}) 
    WHERE ${DBM_Card_User_Data.columns.id_user}=?`;

    await DBConn.conn.promise().query(query, [userId]);
}

module.exports = {latestVersion,Properties,Battle,Leveling,Quest,Shop,Status,StatusEffect,TradeBoard,Embeds,Party,getCardData,getCardInventoryUserData,getAllCardDataByPack,
    getCardUserStatusData,getCardPack,checkUserHaveCard,getUserCardInventoryData,getUserCardStock,getUserTotalCard,
    updateCatchAttempt,updateColorPoint,updateMofucoin,updateSeriesPoint,removeCardGuildSpawn,generateCardSpawn,addNewCardInventory,limitizeUserPoints, 
    embedCardLevelUp,embedCardCapture,embedCardDetail,embedBioPackList,embedCardPackList,getBonusCatchAttempt,getNextColorPoint,
    checkCardCompletion,leaderboardAddNew,getAverageLevel,updateMessageIdSpawn};
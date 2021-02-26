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

const latestVersion = "1.11";

class Properties{
    static embedColor = '#efcc2c';
    static maximumCard = 10;

    //any other spawn type that is not listed will put as normal spawn
    static objSpawnType = {
        number:15,
        quiz:20,
        battle:20,
        color:5,
    }
    

    static spawnType = ["normal","battle","number","quiz","color"
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
            answer:"answer",
            id_card:"id_card",
            //for the embed image
            embed_img:"https://waa.ai/JEyE.png"
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
            type:"type",//value will be: raid
            level:"level",//the level of the enemy
            color:"color",
            rarity:"rarity",
            id_enemy:"id_enemy",
            id_card_reward:"id_card_reward",
            special_allow:"special_allow",//true: special can be used
            //hp will reduce the chance and stored into 3 key
            hp1:"hp1",
            hp2:"hp2",
            hp3:"hp3",
            //atk will increase the chance and stored into 2 key
            atk1:"atk1",
            atk2:"atk2",
        }
    }

    static enemySpawnData = {
        tsunagarus : {
            image:{
                "chokkins":"https://static.wikia.nocookie.net/prettycure/images/b/b9/Chokkin.png",
                "dibosu":"https://static.wikia.nocookie.net/prettycure/images/8/8e/Dibosufinal.png",
                "gizzagizza":"https://static.wikia.nocookie.net/prettycure/images/0/0c/Gizzagizza.png",
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
            term:"nottoriga"
        },
        "healin' good":{
            term:"megabyogen"
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
            total:39
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
            team_attack:"Team Attack"
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
            team_attack:"Team Attack"
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
            team_attack:"Team Attack"
        },
        love:{
            total:11,
            icon:"https://waa.ai/JEVW.png",
            color:"pink",
            fullname:"Love Momozono",
            alter_ego:"Cure Peach",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The pink heart is the emblem of love. Freshly-picked, Cure Peach!",
            special_attack:"Love Sunshine"
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
            special_attack:"Pink Forte Wave"
        },
        hibiki:{
            total:12,
            icon:"https://waa.ai/JEVd.png",
            color:"pink",
            fullname: "Hibiki Hojo",
            alter_ego:"Cure Melody",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the wild tune, Cure Melody!",
            special_attack:"Miracle Heart Arpeggio"
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
            special_attack:"Happy Shower"
        },
        mana:{
            total:12,
            icon:"https://waa.ai/JEV6.png",
            color:"pink",
            fullname: "Mana Aida",
            alter_ego:"Cure Heart",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"Overflowing Love! Cure Heart!",
            special_attack:"Heart Dynamite"
        },
        megumi:{
            total:10,
            icon:"https://waa.ai/JEVg.png",
            color:"pink",
            fullname: "Megumi Aino",
            alter_ego:"Cure Lovely",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The big love spreading throughout the world! Cure Lovely!!",
            special_attack:"Pinky Love Shoot"
        },
        haruka:{
            total:16,
            icon:"https://waa.ai/JEVN.png",
            color:"pink",
            fullname: "Haruka Haruno",
            alter_ego:"Cure Flora",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the Flourishing Flowers! Cure Flora!",
            special_attack:"Floral Tourbillon"
        },
        mirai:{
            total:16,
            icon:"https://waa.ai/JEVh.png",
            color:"pink",
            fullname:"Mirai Asahina",
            alter_ego:"Cure Miracle",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Miracle! Cure Miracle!",
            special_attack:"Diamond Eternal"
        },
        ichika:{
            total:18,
            icon:"https://waa.ai/JEVP.png",
            color:"pink",
            fullname:"Ichika Usami",
            alter_ego:"Cure Whip",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Liveliness and Smiles! Let's La Mix It All Up! Cure Whip! Ready To Serve!",
            special_attack:"Whip Decoration"
        },
        hana:{
            total:16,
            icon:"https://waa.ai/JEVp.png",
            color:"pink",
            fullname: "Hana Nono",
            alter_ego:"Cure Yell",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Cheering on everyone! The Pretty Cure of High Spirits! Cure Yell!",
            special_attack:"Heart For You"
        },
        hikaru:{
            total:13,
            icon:"https://waa.ai/JEV7.png",
            color:"pink",
            fullname: "Hikaru Hoshina",
            alter_ego:"Cure Star",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The twinkling star that shines throughout the universe! Cure Star!",
            special_attack:"Star Punch"
        },
        nodoka:{
            total:5,
            icon:"https://waa.ai/JEVL.png",
            color:"pink",
            fullname: "Nodoka Hanadera",
            alter_ego:"Cure Grace",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two overlapping flowers! Cure Grace!",
            special_attack:"Healing Flower"
        },
        karen:{
            total:12,
            icon:"https://waa.ai/JEV5.png",
            color:"blue",
            fullname: "Karen Minazuki",
            alter_ego:"Cure Aqua",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The blue spring of intelligence, Cure Aqua!",
            special_attack:"Sapphire Arrow"
        },
        miki:{
            total:10,
            icon:"https://waa.ai/JEVn.png",
            color:"blue",
            fullname: "Miki Aono",
            alter_ego:"Cure Berry",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The blue heart is the emblem of hope. Freshly-gathered, Cure Berry!",
            special_attack:"Espoir Shower"
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
            special_attack:"Blue Forte Wave"
        },
        ellen:{
            total:12,
            icon:"https://waa.ai/JEw4.png",
            color:"blue",
            fullname:"Ellen Kurokawa",
            alter_ego:"Cure Beat",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Strumming the soul's tune, Cure Beat!",
            special_attack:"Heartful Beat Rock"
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
            special_attack:"Beauty Blizzard"
        },
        rikka:{
            total:11,
            icon:"https://waa.ai/JEwz.png",
            color:"blue",
            fullname:"Rikka Hishikawa",
            alter_ego:"Cure Diamond",
            henshin_phrase: "Pretty Cure, Love Link!",
            transform_quotes:"The light of Wisdom! Cure Diamond!!",
            special_attack:"Diamond Swirkle"
        },
        hime:{
            total:11,
            icon:"https://waa.ai/JEwo.png",
            color:"blue",
            fullname:"Hime Shirayuki",
            alter_ego:"Cure Princess",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            trasnform_quotes:"The blue wind dancing in the sky! Cure Princess!",
            special_attack:"Blue Happy Shoot"
        },
        minami:{
            total:14,
            icon:"https://waa.ai/JEwX.png",
            color:"blue",
            fullname:"Minami Kaidou",
            alter_ego:"Cure Mermaid",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the crystal clear seas! Cure Mermaid!",
            special_attack:"Mermaid Ripple"
        },
        aoi:{
            total:14,
            icon:"https://waa.ai/JEw3.png",
            color:"blue",
            fullname:"Aoi Tategami",
            alter_ego:"Cure Gelato",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Freedom and Passion! Let's La Mix It All Up! Cure Gelato! Ready To Serve!",
            special_attack:"Gelato Shake"
        },
        saaya:{
            total:14,
            icon:"https://waa.ai/JEwO.png",
            color:"blue",
            fullname: "Saaya Yakushiji",
            alter_ego:"Cure Ange",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Healing everyone! The Pretty Cure of Wisdom! Cure Ange!",
            special_attack:"Heart Feather"
        },
        yuni:{
            total:8,
            icon:"https://waa.ai/JEwT.png",
            color:"blue",
            fullname:"Yuni",
            alter_ego:"Cure Cosmo",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The rainbow spectrum lighting up the galaxy! Cure Cosmo!",
            special_attack:"Cosmo Shining"
        },
        chiyu:{
            total:5,
            icon:"https://waa.ai/JEwe.png",
            color:"blue",
            fullname:"Chiyu Sawaizumi",
            alter_ego:"Cure Fontaine",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two intersecting streams! Cure Fontaine!",
            special_attack:"Healing Stream"
        },
        hikari:{
            total:14,
            icon:"https://waa.ai/JEwu.png",
            color:"yellow",
            fullname:"Hikari Kujou",
            alter_ego:"Shiny Luminous",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Shining life, Shiny Luminous! The light's heart and the light's will, for the sake of uniting all as one!",
            special_attack:"Heartiel Action"
        },
        urara:{
            total:11,
            icon:"https://waa.ai/JEwt.png",
            color:"yellow",
            fullname:"Urara Kasugano",
            alter_ego:"Cure Lemonade",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The effervescence of bursting lemon, Cure Lemonade!",
            special_attack:"Prism Chain"
        },
        inori:{
            total:10,
            icon:"https://waa.ai/JEwJ.png",
            color:"yellow",
            fullname:"Inori Yamabuki",
            alter_ego:"Cure Pine",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The yellow heart is the emblem of faith! Freshly-harvested, Cure Pine!",
            special_attack:"Healing Prayer"
        },
        itsuki:{
            total:12,
            icon:"https://waa.ai/JEwm.png",
            color:"yellow",
            fullname:"Itsuki Myoudouin",
            alter_ego:"Cure Sunshine",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            trasnform_quotes:"The flower that bathes in the sunlight, Cure Sunshine!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Gold Forte Burst"
        },
        ako:{
            total:11,
            icon:"https://waa.ai/JEwx.png",
            color:"yellow",
            fullname:"Ako Shirabe",
            alter_ego:"Cure Muse",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the Goddess' tune, Cure Muse!",
            special_attack:"Sparkling Shower"
        },
        yayoi:{
            total:11,
            icon:"https://waa.ai/JEwq.png",
            color:"yellow",
            fullname:"Yayoi Kise",
            alter_ego:"Cure Peace",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            trasnform_quotes:"Sparkling, glittering, rock-paper-scissors! Cure Peace!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Peace!",
            special_attack:"Peace Thunder"
        },
        alice:{
            total:10,
            icon:"https://waa.ai/JEwl.png",
            color:"yellow",
            fullname:"Alice Yotsuba",
            alter_ego:"Cure Rosetta",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The Sunny warmth! Cure Rosetta!",
            special_attack:"Rosetta Balloon"
        },
        yuko:{
            total:12,
            icon:"https://waa.ai/JEwF.png",
            color:"yellow",
            fullname:"Yuuko Omori",
            alter_ego:"Cure Honey",
            henshin_phrase:"Pretty Cure Kururin Mirror Change!",
            transform_quotes:"The light of life flourishing on the Earth, Cure Honey!",
            special_attack:"Sparkling Baton Attack"
        },
        kirara:{
            total:16,
            icon:"https://waa.ai/JEw0.png",
            color:"yellow",
            fullname:"Kirara Amanogawa",
            alter_ego:"Cure Twinkle",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of the twinkling stars! Cure Twinkle!",
            special_attack:"Twinkle Humming"
        },
        himari:{
            total:15,
            icon:"https://waa.ai/JEw9.png",
            color:"yellow",
            fullname:"Himari Arisugawa",
            alter_ego:"Cure Custard",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Intelligence and Courage! Let's La Mix It All Up! Cure Custard! Ready To Serve!",
            special_attack:"Custard Illusion"
        },
        homare:{
            total:14,
            icon:"https://waa.ai/JEwS.png",
            color:"yellow",
            fullname:"Homare Kagayaki",
            alter_ego:"Cure Etoile",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Making everyone shine! The Pretty Cure of Strength! Cure Étoile!",
            special_attack:"Heart Star"
        },
        elena:{
            total:11,
            icon:"https://waa.ai/JEws.png",
            color:"yellow",
            fullname:"Elena Amamiya",
            alter_ego:"Cure Soleil",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the sky! With sparkling heat! Cure Soleil!",
            special_attack:"Soleil Shoot"
        },
        hinata:{
            total:5,
            icon:"https://waa.ai/JEwC.png",
            color:"yellow",
            fullname:"Hinata Hiramitsu",
            alter_ego:"Cure Sparkle",
            henshin_phrase:"Start! Pretty Cure Operation!",
            transform_quotes:"The two lights that come together! Cure Sparkle!",
            special_attack:"Healing Flash"
        },
        yuri:{
            total:13,
            icon:"https://waa.ai/JEwf",
            color:"purple",
            fullname:"Yuri Tsukikage",
            alter_ego:"Cure Moonlight",
            henshin_phrase:"Pretty Cure! Open My Heart!",
            transform_quotes:"The flower that shines in the moon's light, Cure Moonlight!",
            transform_super_quotes:"The flowers shining around the world, Heartcatch Pretty Cure, Super Silhouette!",
            special_attack:"Silver Forte Wave"
        },
        makoto:{
            total:11,
            icon:"https://waa.ai/JEwc.png",
            color:"purple",
            fullname:"Makoto Kenzaki",
            alter_ego:"Cure Sword",
            henshin_phrase:"Pretty Cure, Love Link!",
            transform_quotes:"The courageous blade! Cure Sword!",
            special_attack:"Sword Hurricane"
        },
        iona:{
            total:12,
            icon:"https://waa.ai/JEwV.png",
            color:"purple",
            fullname:"Iona Hikawa",
            alter_ego:"Cure Fortune",
            henshin_phrase:"Pretty Cure! Kirarin Star Symphony",
            transform_quotes:"The star of hope that glitters in the night sky! Cure Fortune!",
            special_attack:"Stardust Shoot"
        },
        riko:{
            total:15,
            icon:"https://waa.ai/JEww.png",
            color:"purple",
            fullname:"Riko Izayoi",
            alter_ego:"Cure Magical",
            henshin_phrase:"Miracle, Magical, Jewelryle!",
            transform_quotes:"Our Magic! Cure Magical!",
            special_attack:"Diamond Eternal"
        },
        yukari:{
            total:16,
            icon:"https://waa.ai/JEwy.png",
            color:"purple",
            fullname:"Yukari Kotozume",
            alter_ego:"Cure Macaron",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Beauty and Excitement! Let's La Mix It All Up! Cure Macaron! Is Ready To Serve!",
            special_attack:"Macaron Julienne"
        },
        amour:{
            total:11,
            icon:"https://waa.ai/JEwH.png",
            color:"purple",
            fullname:"Ruru Amour",
            alter_ego:"Cure Amour",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Amour!",
            special_attack:"Heart Dance"
        },
        madoka:{
            total:12,
            icon:"https://waa.ai/JEwU.png",
            color:"purple",
            fullname:"Madoka Kaguya",
            alter_ego:"Cure Selene",
            henshin_phrase:"Color Charge!",
            transform_quotes:"Light up the night sky! With the secretive moonlight! Cure Selene!",
            special_attack:"Selene Arrow"
        },
        kurumi:{
            total:12,
            icon:"https://waa.ai/JEwK.png",
            color:"purple",
            fullname:"Kurumi Mimino",
            alter_ego:"Milky Rose",
            henshin_phrase:"Skyrose Translate!",
            transform_quotes:"The blue rose is my secret emblem! Milky Rose!",
            special_attack:"Metal Blizzard"
        },
        rin:{
            total:11,
            icon:"https://waa.ai/JEwR.png",
            color:"red",
            fullname:"Rin Natsuki",
            alter_ego:"Cure Rouge",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The red flame of passion, Cure Rouge!",
            special_attack:"Fire Strike"
        },
        setsuna:{
            total:11,
            icon:"https://waa.ai/JEwQ.png",
            color:"red",
            fullname:"Setsuna Higashi",
            alter_ego:"Cure Passion",
            henshin_phrase:"Change, Pretty Cure! Beat up!",
            transform_quotes:"The scarlet heart is the proof of happiness! Freshly-ripened, Cure Passion!",
            special_attack:"Happiness Hurricane"
        },
        akane:{
            total:11,
            icon:"https://waa.ai/JEw2.png",
            color:"red",
            fullname:"Akane Hino",
            alter_ego:"Cure Sunny",
            henshin_phrase:"Pretty Cure! Smile Charge!",
            transform_quotes:"he brilliant sun, hot-blooded power! Cure Sunny!",
            transform_super_quotes:"Pegasus, Grant Us The Power! Princess Sunny!",
            special_attack:"Sunny Fire"
        },
        aguri:{
            total:12,
            icon:"https://waa.ai/JEwB.png",
            color:"red",
            fullname:"Aguri Madoka",
            alter_ego:"Cure Ace",
            henshin_phrase:"Pretty Cure, Dress Up!",
            transform_quotes:"The Trump Card of Love! Cure Ace!",
            special_attack:"Ace Shot"
        },
        towa:{
            total:15,
            icon:"https://waa.ai/JEwI.png",
            color:"red",
            fullname:"Towa Akagi",
            alter_ego:"Cure Scarlet",
            henshin_phrase:"Pretty Cure, Princess Engage!",
            transform_quotes:"Princess of crimson flames! Cure Scarlet!",
            special_attack:"Phoenix Blaze"
        },
        akira:{
            total:16,
            icon:"https://waa.ai/JEw8.png",
            color:"red",
            fullname:"Akira Kenjou",
            alter_ego:"Cure Chocolat",
            henshin_phrase:"Cure La Mode, Decoration!",
            transform_quotes:"With Strength and Love! Let's La Mix It All Up! Cure Chocolat! Is Ready To Serve!",
            special_attack:"Chocolat Aromase"
        },
        emiru:{
            total:11,
            icon:"https://waa.ai/JEwW.png",
            color:"red",
            fullname:"Emiru Aisaki",
            alter_ego:"Cure Macherie",
            henshin_phrase:"Heart Kiratto!",
            transform_quotes:"Loving everyone! The Pretty Cure of Love! Cure Machérie!",
            special_attack:"Heart Song"
        },
        komachi:{
            total:13,
            icon:"https://waa.ai/JEwi.png",
            color:"green",
            fullname:"Komachi Akimoto",
            alter_ego:"Cure Mint",
            henshin_phrase:"Pretty Cure Metamorphose!",
            transform_quotes:"The green earth of tranquility, Cure Mint!",
            special_attack:"Emerald Saucer"
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
            special_attack:"March Shoot"
        },
        kotoha:{
            total:15,
            icon:"https://waa.ai/JEwd.png",
            color:"green",
            fullname:"Kotoha Hanami",
            alter_ego:"Cure Felice",
            henshin_phrase:"Felice, Fun Fun, Flowerle!",
            transform_quotes:"Spreading blessings to lives far and wide! Cure Felice!",
            special_attack:"Emerald Reincarnation"
        },
        ciel:{
            total:12,
            icon:"https://waa.ai/JEwM.png",
            color:"green",
            fullname:"Ciel Kirahoshi",
            alter_ego:"Cure Parfait",
            henshin_phrase:"Cure La Mode・Decoration!",
            transform_quotes:"With Dreams and Hope! Let's La Mix It All Up! Cure Parfait! Is Ready To Serve",
            special_attack:"Parfait Étoile"
        },
        lala:{
            total:11,
            icon:"https://waa.ai/JEw6.png",
            color:"green",
            fullname:"Lala Hagoromo",
            alter_ego:"Cure Milky",
            henshin_phrase:"Color Charge!",
            transform_quotes:"The milky way stretching across the heavens! Cure Milky!",
            special_attack:"Milky Shock"
        },
        honoka:{
            total:17,
            icon:"https://waa.ai/JEwL.png",
            color:"white",
            fullname:"Honoka Yukishiro",
            alter_ego:"Cure White",
            henshin_phrase:"Dual Aurora Wave!",
            transform_quotes:"Emissary of light, Cure White!",
            special_attack:"Marble Screw"
        },
        mai:{
            total:10,
            icon:"https://waa.ai/JEwb.png",
            color:"white",
            fullname:"Mai Mishou",
            alter_ego:"Cure Egret",
            henshin_phrase:"Dual Spiritual Power!",
            transform_quotes:"The sparkling silver wing, Cure Egret!",
            special_attack:"Twin Stream Splash"
        },
        kanade:{
            total:12,
            icon:"https://waa.ai/JEwA.png",
            color:"white",
            fullname:"Kanade Minamino",
            alter_ego:"Cure Rhythm",
            henshin_phrase:"Let's Play! Pretty Cure Modulation!",
            transform_quotes:"Playing the graceful tune, Cure Rhythm!",
            special_attack:"Fantastic Piacere"
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
        "star twinkle":" space, astrology and imagination",
        "healin' good":"health, nature, and animals"
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

    static getNextCardExp(level){
        return (level+1)*10;
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

}

class StatusEffect{
    static buffData = {
        second_chance:{
            name:"Second Chance",
            description:"You'll be given another chance to use the: **capture/answer/guess** command.",
        },
        lucky_number:{
            name:"Lucky Number",
            permanent:false,
            description:"Provide number 7 as the next hidden number.",
            value_number:7
        },
        pink_coloraura_1:{
            name:"Pink Aura 1",
            permanent:true,
            description:"10% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:10
        },
        blue_coloraura_1:{
            name:"Blue Aura 1",
            permanent:true,
            description:"10% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:10
        },
        yellow_coloraura_1:{
            name:"Yellow Aura 1",
            permanent:true,
            description:"10% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:10
        },
        red_coloraura_1:{
            name:"Red Aura 1",
            permanent:true,
            description:"10% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:10
        },
        purple_coloraura_1:{
            name:"Purple Aura 1",
            permanent:true,
            description:"10% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:10
        },
        white_coloraura_1:{
            name:"White Aura 1",
            permanent:true,
            description:"10% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:10
        },
        green_coloraura_1:{
            name:"Green Aura 1",
            permanent:true,
            description:"10% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:10
        },
        pink_coloraura_2:{
            name:"Pink Aura 2",
            permanent:true,
            description:"15% capture boost for **pink** card.",
            value_color:"pink",
            value_capture_boost:15
        },
        blue_coloraura_2:{
            name:"Blue Aura 2",
            permanent:true,
            description:"15% capture boost for **blue** card.",
            value_color:"blue",
            value_capture_boost:15
        },
        yellow_coloraura_2:{
            name:"Yellow Aura 2",
            permanent:true,
            description:"15% capture boost for **yellow** card.",
            value_color:"yellow",
            value_capture_boost:15
        },
        red_coloraura_2:{
            name:"Red Aura 2",
            permanent:true,
            description:"15% capture boost for **red** card.",
            value_color:"red",
            value_capture_boost:15
        },
        purple_coloraura_2:{
            name:"Purple Aura 2",
            permanent:true,
            description:"15% capture boost for **purple** card.",
            value_color:"purple",
            value_capture_boost:15
        },
        white_coloraura_2:{
            name:"White Aura 2",
            permanent:true,
            description:"15% capture boost for **white** card.",
            value_color:"white",
            value_capture_boost:15
        },
        green_coloraura_2:{
            name:"Green Aura 2",
            permanent:true,
            description:"15% capture boost for **green** card.",
            value_color:"green",
            value_capture_boost:15
        },
        clear_status_all:{
            name:"Status Removal",
            description:"Clear the Status Effect."
        },
        quiz_master:{
            name:"Quiz Master",
            permanent:false,
            description:"Instantly give the correct answer if the answer is wrong."
        },
        hp_up_1:{
            name:"Hp Up 1",
            description:"+50 hp boost during battle.",
            value_hp_boost:50
        },
        hp_up_2:{
            name:"Hp Up 2",
            description:"+100 hp boost during battle.",
            value_hp_boost:100
        },
        rarity_up_1:{
            name:"Rarity Up 1",
            description:"+1 :star: rarity during battle.",
            value_rarity_boost:1
        },
        rarity_up_2:{
            name:"Rarity Up 2",
            description:"+2 :star: rarity during battle.",
            value_rarity_boost:2
        },
    }

    static async updateStatusEffect(id_user,status_effect){
        var parameterSet = new Map();
        parameterSet.set(DBM_Card_User_Data.columns.status_effect,status_effect);
        
        var parameterWhere = new Map();
        parameterWhere.set(DBM_Card_User_Data.columns.id_user,id_user);

        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    }

    static async embedStatusEffectActivated(userUsername,userAvatarUrl,status_effect){
        return {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: "Status Effect Activated!",
            description: `**${this.buffData[status_effect].name}**:\n${this.buffData[status_effect].description}`,
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

class Embeds{
    static precureAvatarView(embedColor,userUsername,userAvatarUrl,packName,
        level,hp,atk,level_special,thumbnail,cardId,rarity){
        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = Properties.dataCardCore[packName].transform_quotes;
        if("transform_super_quotes" in Properties.dataCardCore[packName]){
            transformQuotes = Properties.dataCardCore[packName].transform_super_quotes;
        }
        
        return {
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
                url:Properties.dataCardCore[packName].icon
            },
            footer:{
                text:`Card ID: ${cardId}`
            }
        }
    }

    static battleSpecialActivated(embedColor,userUsername,userAvatarUrl,packName,
        level_special){
        return {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}** Level ${level_special} Special Activated!`,
            description: `With enough energy, **${Properties.dataCardCore[packName].alter_ego}** used her special attack and defeat the tsunagarus instantly!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            }
        }
    }

    static battleWin(embedColor,userUsername,userAvatarUrl,packName){
        return {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Defeated!`,
            description: `With the help of **${Properties.dataCardCore[packName].alter_ego}**, **${userUsername}** has won the battle against tsunagarus!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            }
        }
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
    level,max_hp,max_atk,special_level){
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
                value:`${rarity} :star:`,
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
    level,max_hp,max_atk,special_level,stock=0){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var customReceivedDate = new Date(receivedDate);
    customReceivedDate = `${("0" + receivedDate.getDate()).slice(-2)}/${("0" + (receivedDate.getMonth() + 1)).slice(-2)}/${customReceivedDate.getFullYear()}`;

    var objEmbed = {
        color:Properties.dataColorCore[embedColor].color,
        author:{
            iconURL:Properties.dataCardCore[packName].icon,
            name:`Level ${level}/${Leveling.getMaxLevel(rarity)}`
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
            {//reserved for hp
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

    
    // if(Status.getModifiedHp(level,max_hp)>0){
    //     objEmbed.fields[3] = {
    //         name:`HP: ${Status.getHp(level,max_hp)}`,
    //         value:`${max_hp}(+${Status.getModifiedHp(level,max_hp)})`,
    //         inline:true
    //     }
    // } else {
    //     objEmbed.fields[3] = {
    //         name:`HP:`,
    //         value:`${max_hp}`,
    //         inline:true
    //     }
    // }

    if(stock>=1){
        objEmbed.footer.text+= ` | Stock:${stock}`;
    }

    return objEmbed;
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

async function checkCardCompletion(id_user,category,value){
    
    //category parameter: color/pack
    //check if user founded on leaderboard/not
    var queryColorCompletion = `select count(*) as total 
        FROM ${DBM_Card_Leaderboard.TABLENAME} 
        WHERE ${DBM_Card_Leaderboard.columns.id_user}=? AND 
        ${DBM_Card_Leaderboard.columns.category}=? AND 
        ${DBM_Card_Leaderboard.columns.completion}=?`;
    var arrParameterized = [id_user,category,value];
    var checkLeaderboardExists = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
    if(checkLeaderboardExists[0][0]["total"]>=1){
        return false;
    }

    if(category=="color"){
        //check color set completion:
        var queryColorCompletion = `select count(ci.${DBM_Card_Inventory.columns.id_card}) as total 
        from ${DBM_Card_Inventory.TABLENAME} ci, ${DBM_Card_Data.TABLENAME} cd
        where ci.${DBM_Card_Inventory.columns.id_card}=cd.${DBM_Card_Data.columns.id_card} and 
        cd.${DBM_Card_Data.columns.color}=? and 
        ci.${DBM_Card_Inventory.columns.id_user}=?`;
        var arrParameterized = [value,id_user];
        var checkColorCompletion = await DBConn.conn.promise().query(queryColorCompletion, arrParameterized);
        if(checkColorCompletion[0]["total"]>=Properties.dataColorCore[value].total){
            return true;
        }
    } else {
        //pack category
        var currentTotalCard = await getUserTotalCard(id_user,value);
        var maxTotalCard = Properties.dataCardCore[value].total;
        if(currentTotalCard>=maxTotalCard){
            return true;
        }
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

        if(category=="color"){
            //color completed
            objEmbed.title = `Card Color Set ${GlobalFunctions.capitalize(completion)} Completed!`;
            objEmbed.description = `<@${id_user}> has become new master of cure **${completion}**!`;
        } else {
            //pack completed
            objEmbed.title = `${GlobalFunctions.capitalize(completion)} Card Pack Completed!`;
            objEmbed.description = `<@${id_user}> has completed the card pack: **${completion}**!`;
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
    var maxColorPoint = 1000;
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
    var maxCoin = 1000;
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
        return "amour";
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

async function removeCardGuildSpawn(id_guild){
    //erase all card spawn information
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.spawn_type,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_id,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_color,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_number,null);
    parameterSet.set(DBM_Card_Guild.columns.spawn_data,null);
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
    for (const key in Properties.objSpawnType) {
        if(cardSpawnType==""){
            var rnd = GlobalFunctions.randomNumber(0,100);
            var minRnd = 100-Properties.objSpawnType[key];//get the minimum random number
            if(rnd>=minRnd){
                cardSpawnType = key;
            }
        }
    }
    //if card spawn is empty set to default:normal
    if(cardSpawnType==""){
        cardSpawnType = "normal";
    }

    //for debugging purpose:
    // cardSpawnType = "quiz";

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
            // query = `select (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_pink,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_purple,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_green,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_yellow,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_white,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_blue,
            //     (select ${DBM_Card_Data.columns.id_card}  
            //     from ${DBM_Card_Data.TABLENAME} 
            //     where ${DBM_Card_Data.columns.color}=? 
            //     order by rand() 
            //     limit 1) as id_card_red`;
            // var resultData = await DBConn.conn.promise().query(query, Properties.arrColor);
            //save to table
            // parameterSet.set(DBM_Card_Guild.columns.spawn_color,`{"pink":"${resultData[0][0]["id_card_pink"]}","purple":"${resultData[0][0]["id_card_purple"]}","green":"${resultData[0][0]["id_card_green"]}","yellow":"${resultData[0][0]["id_card_yellow"]}","white":"${resultData[0][0]["id_card_white"]}","blue":"${resultData[0][0]["id_card_blue"]}","red":"${resultData[0][0]["id_card_red"]}"}`); //set spawn color

            // parameterSet.set(DBM_Card_Guild.columns.spawn_data,`{"${Properties.spawnData.color.pink}":"${resultData[0][0]["id_card_pink"]}","${Properties.spawnData.color.purple}":"${resultData[0][0]["id_card_purple"]}","${Properties.spawnData.color.green}":"${resultData[0][0]["id_card_green"]}","${Properties.spawnData.color.yellow}":"${resultData[0][0]["id_card_yellow"]}","${Properties.spawnData.color.white}":"${resultData[0][0]["id_card_white"]}","${Properties.spawnData.color.blue}":"${resultData[0][0]["id_card_blue"]}","${Properties.spawnData.color.red}":"${resultData[0][0]["id_card_red"]}"}`);
            objEmbed.image = {
                url:Properties.spawnData.color.embed_img
            }
            objEmbed.title = "Color Card";
            objEmbed.description = `A **color** card has appeared! Use: **p!card catch** to capture the card based from your assigned color.`;
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
            WHERE ${DBM_Card_Data.columns.rarity}<=? AND 
            ${DBM_Card_Data.columns.color}=? 
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[4,selectedColor]);
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
                text:`⭐ Rarity: 1-4 | ⏫ Catch Rate: 100%`
            }
            
            break;
        
        case "quiz":
            var query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? AND 
            ${DBM_Card_Data.columns.rarity}<=? 
            ORDER BY rand() 
            LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[4,5]);
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnColor = resultData[0][0][DBM_Card_Data.columns.color];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var arrAnswerList = [cardSpawnPack]; //prepare the answer list
            var alterEgo = Properties.dataCardCore[cardSpawnPack].alter_ego;

            //get the other pack answer
            var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack} 
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
            `{"${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);

            //prepare the embed:
            objEmbed.author = {
                name:`Quiz Card`,
            }
            objEmbed.title = `:grey_question: It's Quiz Time!`;
            objEmbed.description = `The series theme/motif was about: **${Properties.spawnHintSeries[cardSpawnSeries]}** and I'm known as **${alterEgo}**. Who am I?`;
            objEmbed.fields = [{
                name:`Answer it with: p!card answer <a/b/c/d>`,
                value:`**A. ${Properties.dataCardCore[arrAnswerList[0]].fullname}\nB. ${Properties.dataCardCore[arrAnswerList[1]].fullname}\nC. ${Properties.dataCardCore[arrAnswerList[2]].fullname}\nD. ${Properties.dataCardCore[arrAnswerList[3]].fullname}**`
            }]
            objEmbed.image ={
                url:Properties.spawnData.quiz.embed_img
            }
            objEmbed.footer = {
                text:`⭐ Rarity: 4-5 | ⏫ Catch Rate: 100%`
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

            //get 1 random card reward
            var query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}>=? 
            ORDER BY rand() LIMIT 1`;
            var cardRewardData = await DBConn.conn.promise().query(query,[6]);
            cardRewardData = cardRewardData[0][0];

            //get the random enemy
            var query = `SELECT * 
            FROM ${DBM_Card_Enemies.TABLENAME} 
            ORDER BY rand() LIMIT 1`;
            var enemyData = await DBConn.conn.promise().query(query);
            enemyData = enemyData[0][0];
            var randLevel = GlobalFunctions.randomNumber(3,10);
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
            var query = `select color 
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

            var spawnSeries = enemyData[DBM_Card_Enemies.columns.series];

            //embed
            objEmbed.image = {
                url:Properties.enemySpawnData.tsunagarus.image.chokkins
            }
            objEmbed.title = `Tsunagarus Lv.${randLevel} has appeared!`;
            objEmbed.description = `Chokkins has the ${cardRewardData[DBM_Card_Data.columns.rarity]}⭐ cure card and possesses **${Properties.enemySpawnData[spawnSeries].term}** powers! Use **p!card battle** to participate in battle and defeat it!`;
            objEmbed.color = "#D9A4FE";
            objEmbed.fields = [
                {
                    name:`⬆️ Series: +5%`,
                    value:`${spawnSeries}`,
                    inline:true
                },
                {
                    name:`⬆️ Color: +5%`,
                    value:`${dtColorWeakness.replace("[","").replace("]","").replace(/"/g, "")}`,
                    inline:true
                },
                {
                    name:`⬆️ Min. Rarity: +10%`,
                    value:`${randRarityMin}`,
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
            if(randAllowSpecial>=9){
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

            var spawnData = `{"${Properties.spawnData.battle.id_enemy}":"${enemyData[DBM_Card_Enemies.columns.id]}","${Properties.spawnData.battle.level}":${randLevel},"${Properties.spawnData.battle.color}":${dtColorWeakness},"${Properties.spawnData.battle.id_card_reward}":"${cardRewardData[DBM_Card_Data.columns.id_card]}","${Properties.spawnData.battle.rarity}":${randRarityMin},${dtAllowSpecial},${dtAtk}${dtHp}}`;
            parameterSet.set(DBM_Card_Guild.columns.spawn_data,spawnData);

            break;
        default: // normal spawn type
            //get the 1card id
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.rarity}<=? 
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query,[3]);
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
            objEmbed.description = `Use: **p!card catch** to capture the card.`;
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

module.exports = {latestVersion,Properties,Battle,Leveling,Shop,Status,StatusEffect,TradeBoard,Embeds,getCardData,getCardInventoryUserData,getAllCardDataByPack,
    getCardUserStatusData,getCardPack,checkUserHaveCard,getUserCardInventoryData,getUserCardStock,getUserTotalCard,
    updateCatchAttempt,updateColorPoint,updateMofucoin,removeCardGuildSpawn,generateCardSpawn,addNewCardInventory,
    embedCardLevelUp,embedCardCapture,embedCardDetail,embedCardPackList,getBonusCatchAttempt,getNextColorPoint,
    checkCardCompletion,leaderboardAddNew,getAverageLevel,updateMessageIdSpawn};
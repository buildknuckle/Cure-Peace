const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');

class Properties{
    static embedColor = '#efcc2c';

    static spawnType = [
        "number",
        "normal",
        "color",
        "quiz"
        //golden_week
        //combat
        //virus
    ];

    static imgResponse = {
        imgOk: "https://cdn.discordapp.com/attachments/793415946738860072/797862343983497216/unknown.png",
        imgError: "https://cdn.discordapp.com/attachments/793415946738860072/797861955033366568/EfmTXAAWAAAbdRA.png",
        imgFailed: "https://cdn.discordapp.com/attachments/793415946738860072/797862111484182562/10225867f8a7c5accdde3e78181faca547530a28.png"
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
            embed_img:"https://cdn.discordapp.com/attachments/793415946738860072/798179736475926528/mystery_card_animate.gif"
        }
    }
    
    //contain basic information of the color
    static arrColor = ["pink","purple","green","yellow","white","blue","red"];

    static dataColorCore = {
        pink:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116047575842846/mystery_pink.jpg",
            color:"#FEA1E6",
            total:194
        },
        purple:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116058485227520/mystery_purple.jpg",
            color:"#897CFE",
            total:102
        },
        green:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116027358773258/mystery_green.jpg",
            color:"#7CF885",
            total:62
        },
        yellow:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116089950502942/mystery_yellow.jpg",
            color:"#FDF13B",
            total:152
        },
        white:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116077112393738/mystery_white.jpg",
            color:"#FFFFEA",
            total:39
        },
        blue:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116003649159219/mystery_blue.jpg",
            color:"#7FC7FF",
            total:136
        },
        red:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798116067250536458/mystery_red.jpg",
            color:"#FF9389",
            total:87
        },
        all:{
            imgMysteryUrl:"https://cdn.discordapp.com/attachments/793415946738860072/798179736475926528/mystery_card_animate.gif"
        }
    };
    
    //the constant of all available/required card
    static dataCardCore = {
        nagisa:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797863794470027294/unknown.png",
            color:"pink",
            fullname:"Misumi Nagisa"
        },
        saki:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797863605470888007/unknown.png",
            color:"pink",
            fullname:"Hyuuga Saki"
        },
        nozomi:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864034095202334/unknown.png",
            color:"pink",
            fullname:"Yumehara Nozomi"
        },
        love:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864276218871828/unknown.png",
            color:"pink",
            fullname: "Momozono Love"
        },
        tsubomi:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864461200916480/unknown.png",
            color:"pink",
            fullname: "Hanasaki Tsubomi"
        },
        hibiki:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864677190402108/unknown.png",
            color:"pink",
            fullname: "Hojo Hibiki"
        },
        miyuki:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864868480024596/unknown.png",
            color:"pink",
            fullname: "Hoshizora Miyuki"
        },
        mana:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864989615849492/unknown.png",
            color:"pink",
            fullname: "Aida Mana"
        },
        megumi:{
            total:10,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865131652022293/unknown.png",
            color:"pink",
            fullname: "Aino Megumi"
        },
        haruka:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865276615819284/unknown.png",
            color:"pink",
            fullname: "Haruno Haruka"
        },
        mirai:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865411777396736/unknown.png",
            color:"pink",
            fullname:"Asahina Mirai"
        },
        ichika:{
            total:18,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865571593093120/unknown.png",
            color:"pink",
            fullname:"Usami Ichika"
        },
        hana:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865745811636284/unknown.png",
            color:"pink",
            fullname: "Nono Hana"
        },
        hikaru:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865902783725568/unknown.png",
            color:"pink",
            fullname: "Hoshina Hikaru"
        },
        nodoka:{
            total:5,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866132206911528/unknown.png",
            color:"pink",
            fullname: "Hanadera Nodoka"
        },
        karen:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866307264839690/unknown.png",
            color:"blue",
            fullname: "Minazuki Karen"
        },
        miki:{
            total:10,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866496171835432/unknown.png",
            color:"blue",
            fullname: "Aono Miki"
        },
        erika:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866948116348968/unknown.png",
            color:"blue",
            fullname:"Kurumi Erika"
        },
        ellen:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797867854866939905/unknown.png",
            color:"blue",
            fullname:"Kurokawa Ellen"
        },
        reika:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868039810973796/unknown.png",
            color:"blue",
            fullname: "Aoki Reika"
        },
        rikka:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868236036767804/unknown.png",
            color:"blue",
            fullname:"Hishikawa Rikka"
        },
        hime:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868477422895144/unknown.png",
            color:"blue",
            fullname:"Shirayuki Hime"
        },
        minami:{
            total:14,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868678141050880/unknown.png",
            color:"blue",
            fullname:"Kaido Minami"
        },
        aoi:{
            total:14,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868885595783178/unknown.png",
            color:"blue",
            fullname:"Tategami Aoi"
        },
        saaya:{
            total:14,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869049916031016/unknown.png",
            color:"blue",
            fullname: "Yakushiji Saaya"
        },
        yuni:{
            total:8,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869194690953226/unknown.png",
            color:"blue",
            fullname:"Yuni"
        },
        chiyu:{
            total:5,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869330799919205/unknown.png",
            color:"blue",
            fullname:"Sawaizumi Chiyu"
        },
        hikari:{
            total:14,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869947023130634/unknown.png",
            color:"yellow",
            fullname:"Kujou Hikari"
        },
        urara:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870146756542494/unknown.png",
            color:"yellow",
            fullname:"Kasugano Urara"
        },
        inori:{
            total:10,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870295964450846/unknown.png",
            color:"yellow",
            fullname:"Yamabuki Inori"
        },
        itsuki:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870479209267230/unknown.png",
            color:"yellow",
            fullname:"Myoudouin Itsuki"
        },
        ako:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873360632807455/unknown.png",
            color:"yellow",
            fullname:"Shirabe Ako"
        },
        yayoi:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873533002317844/unknown.png",
            color:"yellow",
            fullname:"Kise Yayoi"
        },
        alice:{
            total:10,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873685800681492/unknown.png",
            color:"yellow",
            fullname:"Yotsuba Alice"
        },
        yuko:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873891359719434/unknown.png",
            color:"yellow",
            fullname:"Omori Yuko"
        },
        kirara:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797874089334276156/unknown.png",
            color:"yellow",
            fullname:"Amanogawa Kirara"
        },
        himari:{
            total:15,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875600341598228/unknown.png",
            color:"yellow",
            fullname:"Arisugawa Himari"
        },
        homare:{
            total:14,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875742750146570/unknown.png",
            color:"yellow",
            fullname:"Kagayaki Homare"
        },
        elena:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875900107456512/unknown.png",
            color:"yellow",
            fullname:"Amamiya Elena"
        },
        hinata:{
            total:5,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797876042042834994/unknown.png",
            color:"yellow",
            fullname:"Hiramitsu Hinata"
        },
        yuri:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797876212591493150/unknown.png",
            color:"purple",
            fullname:"Tsukikage Yuri"
        },
        makoto:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877332043628646/unknown.png",
            color:"purple",
            fullname:"Kenzaki Makoto"
        },
        iona:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877449017786418/unknown.png",
            color:"purple",
            fullname:"Hikawa Iona"
        },
        riko:{
            total:15,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877629469982750/unknown.png",
            color:"purple",
            fullname:"Izayoi Riko"
        },
        yukari:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877841105518602/unknown.png",
            color:"purple",
            fullname:"Kotozume Yukari"
        },
        amour:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797878877800235028/unknown.png",
            color:"purple",
            fullname:"Ruru Amour"
        },
        madoka:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879016802746388/unknown.png",
            color:"purple",
            fullname:"Kaguya Madoka"
        },
        kurumi:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879140811931649/unknown.png",
            color:"purple",
            fullname:"Mimino Kurumi"
        },
        rin:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879268372774912/unknown.png",
            color:"red",
            fullname:"Natsuki Rin"
        },
        setsuna:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879404536660018/unknown.png",
            color:"red",
            fullname:"Higashi Setsuna"
        },
        akane:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879955207880714/unknown.png",
            color:"red",
            fullname:"Hino Akane"
        },
        aguri:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797883836549038110/unknown.png",
            color:"red",
            fullname:"Madoka Aguri"
        },
        towa:{
            total:15,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884007189708860/unknown.png",
            color:"red",
            fullname:"Akagi Towa"
        },
        akira:{
            total:16,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884127768477706/unknown.png",
            color:"red",
            fullname:"Kenjou Akira"
        },
        emiru:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884885314437130/unknown.png",
            color:"red",
            fullname:"Aisaki Emiru"
        },
        komachi:{
            total:13,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797885787202125874/unknown.png",
            color:"green",
            fullname:"Akimoto Komachi"
        },
        nao:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797886213264244786/unknown.png",
            color:"green",
            fullname:"Midorikawa Nao"
        },
        kotoha:{
            total:15,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887526987497502/unknown.png",
            color:"green",
            fullname:"Hanami Kotoha"
        },
        ciel:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887665428365322/unknown.png",
            color:"green",
            fullname:"Kirahoshi Ciel"
        },
        lala:{
            total:11,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887830377889852/unknown.png",
            color:"green",
            fullname:"Hagoromo Lala"
        },
        honoka:{
            total:17,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887960003510282/unknown.png",
            color:"white",
            fullname:"Yukishiro Honoka"
        },
        mai:{
            total:10,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797888139992891432/unknown.png",
            color:"white",
            fullname:"Mishou Mai"
        },
        kanade:{
            total:12,
            icon:"https://cdn.discordapp.com/attachments/793415946738860072/797888264202747965/unknown.png",
            color:"white",
            fullname:"Minamino Kanade"
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
        "go! princess":"princesses and personal goals and dreams",
        "mahou tsukai":"sorcery, gemstones, and centrally friendship",
        "kirakira":"sweets, animals and creativity and the Cures manage a patissierie",
        "hugtto":"destiny, future, heroism, parenting, and jobs",
        "star twinkle":" space, astrology and imagination",
        "healin' good":"health, nature, and animals"
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
    
    //return callback(DB.selectAll(DBM_Card_Data.TABLENAME,parameterWhere));
}

function embedCardCapture(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,username,currentCard){
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
            }
        ],
        footer:{
            iconURL:avatarImgUrl,
            text:`Captured By: ${username} (${currentCard}/${Properties.dataCardCore[packName].total})`
        }
    }

    return objEmbed;
}

function embedCardDetail(embedColor,id_card,packName,
    cardName,imgUrl,series,rarity,avatarImgUrl,receivedDate){
    //embedColor in string and will be readed on Properties class: object variable
    //received date readed from db, will be converted here

    var customReceivedDate = new Date(receivedDate);
    customReceivedDate = `${("0" + receivedDate.getDate()).slice(-2)}/${("0" + (receivedDate.getMonth() + 1)).slice(-2)}/${customReceivedDate.getFullYear()}`;

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
            }
        ],
        footer:{
            iconURL:avatarImgUrl,
            text:`Received at: ${customReceivedDate}`
        }
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
        DB.insert(DBM_Card_User_Data.TABLENAME,parameter);
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

async function getAverageLevel(id_user,amount){
    var oldUserData = await getCardUserStatusData(id_user);
    if(oldUserData[DBM_Card_User_Data.columns.level]<=10){

    }
    var nextLevelExp = parseInt(oldUserData[DBM_Card_User_Data.columns.level])*100;
    
}

async function updateCatchAttempt(id_user,spawn_token,objColor=null){
    //update catch attempt, add color exp in object if parameter existed
    //get color point
    var maxColorPoint = 1000;
    var cardUserStatusData = await getCardUserStatusData(id_user);
    var arrParameterized = [];
    arrParameterized.push(spawn_token);
    var queryColor = "";
    for (const [key, value] of objColor.entries()) {
        //get current color point
        // var selectedColor = `color_point_${key}`;
        if(cardUserStatusData[key]+value>=maxColorPoint){
            queryColor += `, ${key} = ${maxColorPoint}, `;
        } else {
            queryColor += `, ${key} = ${key}+${value}, `;
        }
    }
    if(objColor!=null){
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
        return level*5;
    } else {
        return 0;
    }
}

async function updateColorPoint(id_user,objColor){
    //get color point
    var maxColorPoint = 1000;
    var cardUserStatusData = await getCardUserStatusData(id_user);

    var arrParameterized = [];
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
    arrParameterized.push(id_user);

    await DBConn.conn.promise().query(query, arrParameterized);
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
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
}

async function generateCardSpawn(id_guild,specificType=null,overwriteToken = true){
    //update & erase last spawn information if overwriteToken param is provided
    if(overwriteToken){
        await removeCardGuildSpawn(id_guild);
    }
    
    //start randomize
    var rndIndex = Math.floor(Math.random() * Properties.spawnType.length); 
    var cardSpawnType = Properties.spawnType[rndIndex].toLowerCase();
    if(specificType!=null){
        cardSpawnType = specificType;
    }

    cardSpawnType = "quiz";

    var query = "";
    //prepare the embed object
    var objEmbed = {
        color: Properties.embedColor
    }

    //get color total
    var colorTotal = 0; 
    for ( var {} in Properties.dataColorCore ) { colorTotal++; }

    var parameterWhere = new Map();
    parameterWhere.set(DBM_Card_Guild.columns.id_guild,id_guild);

    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Guild.columns.spawn_type,cardSpawnType); //set the spawn type
    if(overwriteToken){
        parameterSet.set(DBM_Card_Guild.columns.spawn_token,Math.floor(Math.random() * 1000)+10); //set & randomize the spawn token
    }
    switch(cardSpawnType) {
        case "color": // color spawn type
            query = `select (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=?  
                order by rand() 
                limit 1) as id_card_pink,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_purple,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_green,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_yellow,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_white,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_blue,
                (select ${DBM_Card_Data.columns.id_card}  
                from ${DBM_Card_Data.TABLENAME} 
                where ${DBM_Card_Data.columns.color}=? 
                order by rand() 
                limit 1) as id_card_red`;
            var resultData = await DBConn.conn.promise().query(query, Properties.arrColor);
            //save to table
            parameterSet.set(DBM_Card_Guild.columns.spawn_color,`{"pink":"${resultData[0][0]["id_card_pink"]}","purple":"${resultData[0][0]["id_card_purple"]}","green":"${resultData[0][0]["id_card_green"]}","yellow":"${resultData[0][0]["id_card_yellow"]}","white":"${resultData[0][0]["id_card_white"]}","blue":"${resultData[0][0]["id_card_blue"]}","red":"${resultData[0][0]["id_card_red"]}"}`); //set spawn color
            objEmbed.image = {
                url:Properties.dataColorCore.all.imgMysteryUrl
            }
            objEmbed.title = "Color Card";
            objEmbed.description = `A **color** card has appeared! Use: **p!card catch** to capture the card based from your assigned color.`;
            objEmbed.footer = {
                text:`ID: ???(variant) | Base Catch Rate+10%`
            }
            break;
        case "number": //gambling spawn type
            //get color total:
            var rndNumber = Math.floor(Math.random()*10)+2;
            var rndIndexColor = Math.floor(Math.random()*Properties.arrColor.length);
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

            objEmbed.author = {
                name:`Number Card: ${selectedColor.charAt(0).toUpperCase()+selectedColor.slice(1)} Edition`
            }
            objEmbed.title = ":game_die: It's Lucky Numbers Time!";
            objEmbed.description = `Guess whether the next hidden number will be **lower** or **higher** than the current number: **${rndNumber}** or not with: **p!card guess <lower/higher>**.`;
            objEmbed.image ={
                url:Properties.dataColorCore[selectedColor].imgMysteryUrl
            }
            objEmbed.footer = {
                text:`ID: ???(variant) | Catch Rate: 100%`
            }
            
            break;
        
        case "quiz":
            var query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            ORDER BY rand() 
            LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query);
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnColor = resultData[0][0][DBM_Card_Data.columns.color];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var arrAnswerList = [cardSpawnPack]; //prepare the answer list

            //get the other pack answer
            var queryAnotherQuestion = `SELECT ${DBM_Card_Data.columns.pack} 
            FROM ${DBM_Card_Data.TABLENAME} 
            WHERE ${DBM_Card_Data.columns.pack}<>? AND 
            ${DBM_Card_Data.columns.rarity}>=? 
            GROUP BY ${DBM_Card_Data.columns.pack} 
            ORDER BY rand() 
            LIMIT 2`;
            var resultDataAnotherAnswer = await DBConn.conn.promise().query(queryAnotherQuestion,[cardSpawnPack,5]);
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
            }

            parameterSet.set(DBM_Card_Guild.columns.spawn_data,
            `{"${Properties.spawnData.quiz.answer}":"${answer}","${Properties.spawnData.quiz.id_card}":"${cardSpawnId}"}`);

            //prepare the embed:
            objEmbed.author = {
                name:`Quiz Card`,
            }
            objEmbed.title = `:grey_question: It's Quiz Time!`;
            objEmbed.description = `The series theme/motif was about: **${Properties.spawnHintSeries[cardSpawnSeries]}**.**${cardSpawnColor}** is my theme color. Who am I?`;
            objEmbed.fields = [{
                name:`Answer it with: p!card answer <a/b/c>`,
                value:`**A. ${Properties.dataCardCore[arrAnswerList[0]].fullname}\nB. ${Properties.dataCardCore[arrAnswerList[1]].fullname}\nC. ${Properties.dataCardCore[arrAnswerList[2]].fullname}**`
            }]
            objEmbed.image ={
                url:Properties.spawnData.quiz.embed_img
            }
            objEmbed.footer = {
                text:`Catch Rate: 100%`
            }
            break;
        default: // normal spawn type
            //get the card id
            query = `SELECT * 
            FROM ${DBM_Card_Data.TABLENAME} 
            ORDER BY RAND() LIMIT 1`;
            var resultData = await DBConn.conn.promise().query(query);
            var cardSpawnId = resultData[0][0][DBM_Card_Data.columns.id_card];
            var cardSpawnSeries = resultData[0][0][DBM_Card_Data.columns.series];
            var cardSpawnPack = resultData[0][0][DBM_Card_Data.columns.pack];
            var cardRarity = resultData[0][0][DBM_Card_Data.columns.rarity];
            var captureChance = `${100-(parseInt(cardRarity)*10)}`;

            parameterSet.set(DBM_Card_Guild.columns.spawn_id,cardSpawnId);
            objEmbed.color = Properties.dataColorCore[resultData[0][0][DBM_Card_Data.columns.color]].color;
            objEmbed.author = {
                name:`${cardSpawnSeries.charAt(0).toUpperCase()+cardSpawnSeries.slice(1)} Card - ${resultData[0][0][DBM_Card_Data.columns.pack].charAt(0).toUpperCase()+resultData[0][0][DBM_Card_Data.columns.pack].slice(1)}`,
                iconURL:Properties.dataCardCore[cardSpawnPack].icon,
            }
            objEmbed.title = resultData[0][0][DBM_Card_Data.columns.name];
            objEmbed.description = `${cardRarity} :star: **${cardSpawnPack.charAt(0).toUpperCase()+cardSpawnPack.slice(1)}** card has appeared! Use: **p!card catch** to capture the card.`;
            objEmbed.image ={
                url:resultData[0][0][DBM_Card_Data.columns.img_url]
            }
            objEmbed.footer = {
                text:`ID: ${cardSpawnId} | Base Catch Rate: ${captureChance}%`
            }
            break;
    }
    
    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
    // console.log(objEmbed);
    return objEmbed;
}

async function addNewCardInventory(id_user,id_card){
    var parameterSet = new Map();
    parameterSet.set(DBM_Card_Inventory.columns.id_user,id_user);
    parameterSet.set(DBM_Card_Inventory.columns.id_card,id_card);
    await DB.insert(DBM_Card_Inventory.TABLENAME,parameterSet);
}

module.exports = {Properties,getCardData,getAllCardDataByPack,
    getCardUserStatusData,getCardPack,checkUserHaveCard,getUserTotalCard,
    updateCatchAttempt,updateColorPoint,removeCardGuildSpawn,generateCardSpawn,addNewCardInventory,
    embedCardCapture,embedCardDetail,embedCardPackList,getBonusCatchAttempt,getNextColorPoint,
    checkCardCompletion,leaderboardAddNew};
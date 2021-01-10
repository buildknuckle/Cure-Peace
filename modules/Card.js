const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');

const embedColor = '#efcc2c';
const imgResponse = {
    imgOk: "https://cdn.discordapp.com/attachments/793415946738860072/797862343983497216/unknown.png",
    imgError: "https://cdn.discordapp.com/attachments/793415946738860072/797861955033366568/EfmTXAAWAAAbdRA.png",
    imgFailed: "https://cdn.discordapp.com/attachments/793415946738860072/797862111484182562/10225867f8a7c5accdde3e78181faca547530a28.png"
}

//the constant of all available/required card
const dataCardCore = {
    nagisa:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797863794470027294/unknown.png",
        color:"pink"
    },
    saki:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797863605470888007/unknown.png",
        color:"pink"
    },
    nozomi:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864034095202334/unknown.png",
        color:"pink"
    },
    love:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864276218871828/unknown.png",
        color:"pink"
    },
    tsubomi:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864461200916480/unknown.png",
        color:"pink"
    },
    hibiki:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864677190402108/unknown.png",
        color:"pink"
    },
    miyuki:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864868480024596/unknown.png",
        color:"pink"
    },
    mana:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797864989615849492/unknown.png",
        color:"pink"
    },
    megumi:{
        total:10,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865131652022293/unknown.png",
        color:"pink"
    },
    haruka:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865276615819284/unknown.png",
        color:"pink"
    },
    mirai:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865411777396736/unknown.png",
        color:"pink"
    },
    ichika:{
        total:18,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865571593093120/unknown.png",
        color:"pink"
    },
    hana:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865745811636284/unknown.png",
        color:"pink"
    },
    hikaru:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797865902783725568/unknown.png",
        color:"pink"
    },
    nodoka:{
        total:5,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866132206911528/unknown.png",
        color:"pink"
    },
    karen:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866307264839690/unknown.png",
        color:"blue"
    },
    miki:{
        total:10,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866496171835432/unknown.png",
        color:"blue"
    },
    erika:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797866948116348968/unknown.png",
        color:"blue"
    },
    ellen:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797867854866939905/unknown.png",
        color:"blue"
    },
    reika:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868039810973796/unknown.png",
        color:"blue"
    },
    rikka:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868236036767804/unknown.png",
        color:"blue"
    },
    hime:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868477422895144/unknown.png",
        color:"blue"
    },
    minami:{
        total:14,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868678141050880/unknown.png",
        color:"blue"
    },
    aoi:{
        total:14,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797868885595783178/unknown.png",
        color:"blue"
    },
    saaya:{
        total:14,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869049916031016/unknown.png",
        color:"blue"
    },
    yuni:{
        total:8,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869194690953226/unknown.png",
        color:"blue"
    },
    chiyu:{
        total:5,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869330799919205/unknown.png",
        color:"blue"
    },
    hikari:{
        total:14,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797869947023130634/unknown.png",
        color:"yellow"
    },
    urara:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870146756542494/unknown.png",
        color:"yellow"
    },
    inori:{
        total:10,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870295964450846/unknown.png",
        color:"yellow"
    },
    itsuki:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797870479209267230/unknown.png",
        color:"yellow"
    },
    ako:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873360632807455/unknown.png",
        color:"yellow"
    },
    yayoi:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873533002317844/unknown.png",
        color:"yellow"
    },
    alice:{
        total:10,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873685800681492/unknown.png",
        color:"yellow"
    },
    yuko:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797873891359719434/unknown.png",
        color:"yellow"
    },
    kirara:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797874089334276156/unknown.png",
        color:"yellow"
    },
    himari:{
        total:15,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875600341598228/unknown.png",
        color:"yellow"
    },
    homare:{
        total:14,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875742750146570/unknown.png",
        color:"yellow"
    },
    elena:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797875900107456512/unknown.png",
        color:"yellow"
    },
    hinata:{
        total:5,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797876042042834994/unknown.png",
        color:"yellow"
    },
    yuri:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797876212591493150/unknown.png",
        color:"purple"
    },
    makoto:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877332043628646/unknown.png",
        color:"purple"
    },
    iona:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877449017786418/unknown.png",
        color:"purple"
    },
    riko:{
        total:15,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877629469982750/unknown.png",
        color:"purple"
    },
    yukari:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797877841105518602/unknown.png",
        color:"purple"
    },
    amour:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797878877800235028/unknown.png",
        color:"purple"
    },
    madoka:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879016802746388/unknown.png",
        color:"purple"
    },
    kurumi:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879140811931649/unknown.png",
        color:"purple"
    },
    rin:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879268372774912/unknown.png",
        color:"red"
    },
    setsuna:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879404536660018/unknown.png",
        color:"red"
    },
    akane:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797879955207880714/unknown.png",
        color:"red"
    },
    aguri:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797883836549038110/unknown.png",
        color:"red"
    },
    towa:{
        total:15,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884007189708860/unknown.png",
        color:"red"
    },
    akira:{
        total:16,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884127768477706/unknown.png",
        color:"red"
    },
    emiru:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797884885314437130/unknown.png",
        color:"red"
    },
    komachi:{
        total:13,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797885787202125874/unknown.png",
        color:"green"
    },
    nao:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797886213264244786/unknown.png",
        color:"green"
    },
    kotoha:{
        total:15,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887526987497502/unknown.png",
        color:"green"
    },
    ciel:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887665428365322/unknown.png",
        color:"green"
    },
    lala:{
        total:11,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887830377889852/unknown.png",
        color:"green"
    },
    honoka:{
        total:17,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797887960003510282/unknown.png",
        color:"white"
    },
    mai:{
        total:10,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797888139992891432/unknown.png",
        color:"white"
    },
    kanade:{
        total:12,
        icon:"https://cdn.discordapp.com/attachments/793415946738860072/797888264202747965/unknown.png",
        color:"white"
    }
};

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

async function updateCatchAttempt(id_user,spawn_token,objColor=null){
    //update catch attempt, add color exp in object if parameter existed
    //get color point
    var cardUserStatusData = await getCardUserStatusData(id_user);
    var arrParameterized = [];
    arrParameterized.push(spawn_token);
    var queryColor = "";
    for (const [key, value] of objColor.entries()) {
        queryColor = `,${key} = ${key}+${value}`;
    }

    var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
    SET ${DBM_Card_User_Data.columns.spawn_token}=? ${queryColor}
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

module.exports = {embedColor,imgResponse,dataCardCore,getCardData,getAllCardDataByPack,
    getCardUserStatusData,getCardPack,checkUserHaveCard,updateCatchAttempt};
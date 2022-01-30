const stripIndents = require('common-tags/lib/stripIndent');
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');

const paginationEmbed = require('discordjs-button-pagination');

const GProperties = require('./Properties');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

const CpackModule = require("./Cpack");
const SpackModule = require("./Spack");

const GuildModule = require('./Guild');

const Embed = require("./Embed");

class Properties {
    static limit = {
        colorPoint:3000,
        mofucoin:3000,
        jewel:1000,
        seriesPoint:2000,
        pointPeace:5,
        card:120
    }

    static peacePoint = {
        icon:GProperties.emoji.peacepoint,
        name:"Peace Point"
    }
}

class Color {
    static canLevelUp(color_data, color, totalLevelUp=1){
        return color_data[color].point>(color_data[color].level+totalLevelUp)*100 ? 
            true:false;
    }
}

async function getStatusData(id_user, guildId = null){
    //{"mofucoin":0}

    //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}

    //{"max_heart":0,"splash_star":0,"yes5gogo":0,"fresh":0,"heartcatch":0,"suite":0,"smile":0,"dokidoki":0,"happiness_charge":0,"go_princess":0,"mahou_tsukai":0,"kirakira":0,"hugtto":0,"star_twinkle":0,"healin_good":0,"tropical_rouge":0}

    //if guildId provided it'll check whether user has login to server/not
    var parameterWhere = new Map();
    parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
    var resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);

    if(resultCheckExist[0]==null){ //insert if not found
        var parameter = new Map();
        parameter.set(DBM_User_Data.columns.id_user,id_user);
        await DB.insert(DBM_User_Data.TABLENAME,parameter);
        //reselect after insert new data
        parameterWhere = new Map();
        parameterWhere.set(DBM_User_Data.columns.id_user,id_user);
        resultCheckExist = await DB.select(DBM_User_Data.TABLENAME,parameterWhere);
    }

    resultCheckExist = resultCheckExist[0];

    if(guildId == null||guildId !== null && resultCheckExist[DBM_User_Data.columns.server_id_login]==guildId){
        return await resultCheckExist;
    } else {
        return null;
    }
}

async function isLogin(objUserData, guildId){
    var userId = objUserData.id;
    if(!GuildModule.Data.userLogin[guildId].includes(userId)){
        return Embed.errorMini(`Please login into server with: "**/daily check-in**" command.`,objUserData,true, {
            title:`❌ Not logged in yet!`
        });
    } else {
        return true;
    }
}

async function getAverageColorLevel(color_data){
    //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
    // if(color_data!=null){
    //     //if arrColorLevel provided we dont need to read it from db
    //     var userData = await getStatusData(id_user);
    //     var parsedColor = JSON.parse(userData[DBM_User_Data.columns.color_data]);
    //     color_data = [
    //             parsedColor.pink.level, parsedColor.blue.level,
    //             parsedColor.yellow.level, parsedColor.green.level,
    //             parsedColor.red.level, parsedColor.purple.level,
    //             parsedColor.white.level
    //     ];
    // } else {
        
    // }

    color_data = [ 
        color_data.pink.level, color_data.blue.level, color_data.yellow.level, color_data.green.level,
        color_data.red.level, color_data.purple.level, color_data.white.level
    ];

    var total = 0;
    for(var i = 0; i < color_data.length; i++) 
        total += color_data[i];
    
    return Math.ceil(total / color_data.length);
}

async function updatePointParam(id_user, userStatusData, mapColorPoint, mapSeriesPoint, mapCurrency = null){
    //process color part
    var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
    for (const [key, value] of mapColorPoint.entries()) {
        if(value>=0&&parsedColorPoint[key]["point"]+value<Properties.limit.colorPoint){
            parsedColorPoint[key]["point"]+= value;
        } else if(value<0){
            parsedColorPoint[key]["point"]-=- value;
        } else {
            parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
        }
        
        if(value<0&&parsedColorPoint[key]["point"]-value<=0) parsedColorPoint[key]["point"]=0; //prevent negative
    }

    var colorData = JSON.stringify(parsedColorPoint);

    //process series part
    var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
    for (const [key, value] of mapSeriesPoint.entries()) {
        if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
            parsedSeriesPoint[key]+= value;
        } else if(value<0){
            parsedSeriesPoint[key]-=- value;
        } else {
            parsedSeriesPoint[key]= Properties.limit.seriesPoint;
        }
        
        if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
    }

    var seriesData = JSON.stringify(parsedSeriesPoint);

    var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    SET ${DBM_User_Data.columns.color_data} = ?, ${DBM_User_Data.columns.series_data} = ? `;
    var arrParam = [colorData, seriesData];

    if(mapCurrency!=null){
        var parsedCurrency = JSON.parse(userStatusData[DBM_User_Data.columns.currency_data]);
        
        for (const [key, value] of mapCurrency.entries()) {
            if(value>=0&&parsedCurrency[key]+value<Properties.limit[key]){
                parsedCurrency[key]+= value;
            } else if(value<0){
                parsedCurrency[key]-=- value;
            } else {
                parsedCurrency[key]= Properties.limit[key];
            }
            
            if(value<0&&parsedCurrency[key]-value<=0) parsedCurrency[key]=0; //prevent negative
        }

        query+=` , ${DBM_User_Data.columns.currency_data} = ? `;
        arrParam.push(JSON.stringify(parsedCurrency));
    }

    query+=` WHERE ${DBM_User_Data.columns.id_user} = ?`;
    arrParam.push(id_user);

    await DBConn.conn.query(query, arrParam);

    // {"mofucoin":0}

    // {"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}

    // {"max_heart":0,"splash_star":0,"yes5gogo":0,"fresh":0,"heartcatch":0,"suite":0,"smile":0,"dokidoki":0,"happiness":0,"go_princess":0,"mahou_tsukai":0,"kirakira":0,"hugtto":0,"star_twinkle":0,"healin_good":0,"tropical_rouge":0}
}

async function updateColorPointParam(id_user, userStatusData, mapColorPoint){
    //update without load from db
    //get series point from db
    var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
    for (const [key, value] of mapColorPoint.entries()) {
        if(value>=0&&parsedColorPoint[key]["point"]+value<Properties.limit.colorPoint){
            parsedColorPoint[key]["point"]+= value;
        } else if(value<0){
            parsedColorPoint[key]["point"]-=- value;
        } else {
            parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
        }
        
        if(value<0&&parsedColorPoint[key]["point"]-value<=0) parsedColorPoint[key]["point"]=0; //prevent negative
    }

    var colorData = JSON.stringify(parsedColorPoint);

    var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    SET ${DBM_User_Data.columns.color_data} = ? 
    WHERE ${DBM_User_Data.columns.id_user} = ?`;

    await DBConn.conn.query(query, [colorData, id_user]);
}

async function updateSeriesPointParam(id_user, userStatusData, mapSeriesPoint){
    //update without load from db
    //get series point from db
    var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
    for (const [key, value] of mapSeriesPoint.entries()) {
        if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
            parsedSeriesPoint[key]+= value;
        } else if(value<0){
            parsedSeriesPoint[key]-=- value;
        } else {
            parsedSeriesPoint[key]= Properties.limit.seriesPoint;
        }
        
        if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
    }

    var seriesData = JSON.stringify(parsedSeriesPoint);

    var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    SET ${DBM_User_Data.columns.series_data} = ? 
    WHERE ${DBM_User_Data.columns.id_user} = ?`;

    await DBConn.conn.query(query, [seriesData, id_user]);
}

async function updateSeriesPoint(id_user, mapSeriesPoint){
    //get series point from db
    var statusData = await getStatusData(id_user);
    var parsedSeriesPoint = JSON.parse(statusData[DBM_User_Data.columns.series_data]);
    for (const [key, value] of mapSeriesPoint.entries()) {
        if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.colorPoint){
            parsedSeriesPoint[key]+= value;
        } else if(value<0){
            parsedSeriesPoint[key]-=- value;
        } else {
            parsedSeriesPoint[key]= Properties.limit.colorPoint;
        }
        
        if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
    }

    var seriesData = JSON.stringify(parsedSeriesPoint);

    var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    SET ${DBM_User_Data.columns.series_data} = ? 
    WHERE ${DBM_User_Data.columns.id_user} = ?`;

    await DBConn.conn.query(query, [seriesData, id_user]);
}

async function updateSpawnToken(userId, tokenSpawn){
    // update user spawn token
    var mapSet = new Map();
    mapSet.set(DBM_User_Data.columns.token_cardspawn, tokenSpawn);
    var mapWhere = new Map();
    mapWhere.set(DBM_User_Data.columns.id_user, userId);
    await DB.update(DBM_User_Data.TABLENAME, mapSet, mapWhere);
}

async function updateData(id_user, userStatusData, options){
    var arrParam = [];
    var querySet = ``;

    //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
    
    //process color point
    for (var keyOptions in options) {
        var valueOptions = options[keyOptions];
        switch(keyOptions){
            case DBM_User_Data.columns.color_data: //color point
                var mapColorPoint = valueOptions;
                var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
                for (const [key, value] of mapColorPoint.entries()) {
                    if("level" in value){//add level
                        parsedColorPoint[key]["level"]+=value["level"];
                    }

                    if("point" in value){//update color point
                        var point = value["point"];
                        if(point>=0&&parsedColorPoint[key]["point"]+point<Properties.limit.colorPoint){
                            parsedColorPoint[key]["point"]+= point;
                        } else if(point<0){
                            parsedColorPoint[key]["point"]-=- point;
                        } else {
                            parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
                        }
                        
                        if(point<0&&parsedColorPoint[key]["point"]-point<=0) parsedColorPoint[key]["point"]=0; //prevent negative
                    }
                }
            
                arrParam.push(JSON.stringify(parsedColorPoint));
                querySet+=` ${DBM_User_Data.columns.color_data} = ?, `;
                break;
            case DBM_User_Data.columns.series_data: //series point
                var mapSeriesPoint = valueOptions;
                var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
                for (const [key, value] of mapSeriesPoint.entries()) {
                    if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
                        parsedSeriesPoint[key]+= value;
                    } else if(value<0){
                        parsedSeriesPoint[key]-=- value;
                    } else {
                        parsedSeriesPoint[key]= Properties.limit.seriesPoint;
                    }
                    
                    if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
                }
            
                arrParam.push(JSON.stringify(parsedSeriesPoint));
                querySet+=` ${DBM_User_Data.columns.series_data} = ?, `;
                break;
            case DBM_User_Data.columns.currency_data: //currency data
                var mapCurrency = valueOptions;
                var parsedCurrency = JSON.parse(userStatusData[DBM_User_Data.columns.currency_data]);
                
                for (const [key, value] of mapCurrency.entries()) {
                    if(value>=0&&parsedCurrency[key]+value<Properties.limit[key]){
                        parsedCurrency[key]+= value;
                    } else if(value<0){
                        parsedCurrency[key]-=- value;
                    } else {
                        parsedCurrency[key]= Properties.limit[key];
                    }
                    
                    if(value<0&&parsedCurrency[key]-value<=0) parsedCurrency[key]=0; //prevent negative
                }

                querySet+=` ${DBM_User_Data.columns.currency_data} = ?, `;
                arrParam.push(JSON.stringify(parsedCurrency));
                break;
            case DBM_User_Data.columns.point_peace://booster point
                var curPointBoost = userStatusData[DBM_User_Data.columns.point_peace];
                if(valueOptions>=0&&curPointBoost+valueOptions<Properties.limit.pointPeace){
                    curPointBoost+= valueOptions;
                } else if(valueOptions<0){
                    curPointBoost-=- valueOptions;
                } else {
                    curPointBoost= Properties.limit[key];
                }

                querySet+=` ${DBM_User_Data.columns.point_peace} = ?, `;
                arrParam.push(curPointBoost);
                break;
            case DBM_User_Data.columns.daily_data://daily data
            case DBM_User_Data.columns.token_cardspawn://card spawn token
            case DBM_User_Data.columns.server_id_login:
                querySet+=` ${keyOptions} = ?, `;
                arrParam.push(valueOptions);
                break;
        }
    }

    querySet = querySet.replace(/,\s*$/, "");//remove last comma and space

    arrParam.push(id_user);//push user id to arrParam
    var query = `UPDATE ${DBM_User_Data.TABLENAME} 
    SET ${querySet} 
    WHERE ${DBM_User_Data.columns.id_user} = ?`;

    await DBConn.conn.query(query, arrParam);
}

class Card {
    static async getPackTotal(userId, pack){
        var query = `SELECT count(*) as total  
        FROM ${DBM_Card_Data.TABLENAME} cd, ${DBM_Card_Inventory.TABLENAME} inv 
        WHERE cd.${DBM_Card_Data.columns.pack}=? AND cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} AND 
        inv.${DBM_Card_Inventory.columns.id_user}=?`;
        var result = await DBConn.conn.query(query,[pack, userId]);
        if(result[0]==null){
            return 0;
        } else {
            return result[0]['total'];
        }
    }

    static async getStock(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Inventory.columns.id_card, cardId);
        mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
        var result = await DB.select(DBM_Card_Inventory.TABLENAME,mapWhere);
        if(result[0]==null){
            return -1;
        } else {
            return result[0][DBM_Card_Inventory.columns.stock];
        }
    }

    static async getInventoryData(userId, cardId){
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Inventory.columns.id_card, cardId);
        mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
        var result = await DB.select(DBM_Card_Inventory.TABLENAME,mapWhere);
        if(result[0]==null){
            return null;
        } else {
            return result[0];
        }
    }
    
    static async updateStockParam(userId, cardId, cardInventoryData=null, qty=1){
        if(cardInventoryData==null){
            //add new card
            var mapAdd = new Map();
            mapAdd.set(DBM_Card_Inventory.columns.id_card,cardId);
            mapAdd.set(DBM_Card_Inventory.columns.id_user,userId);
            if(qty>=1){
                mapAdd.set(DBM_Card_Inventory.columns.stock,qty);
            }
            
            await DB.insert(DBM_Card_Inventory.TABLENAME,mapAdd);
        } else {
            //get old card stock
            var stock = cardInventoryData[DBM_Card_Inventory.columns.stock];
            
            if(qty>=0&&stock+qty<Properties.limit.card){
                stock+= qty;
            } else if(qty<0){
                stock-=- qty;
            } else {
                stock= Properties.limit.card;
            }
            
            if(qty<0&&stock-qty<=0) stock=0; //prevent negative

            var mapSet = new Map();
            mapSet.set(DBM_Card_Inventory.columns.stock,stock);
            var mapWhere = new Map();
            mapWhere.set(DBM_Card_Inventory.columns.id_card, cardInventoryData[DBM_Card_Data.columns.id_card]);
            mapWhere.set(DBM_Card_Inventory.columns.id_user, userId);
            await DB.update(DBM_Card_Inventory.TABLENAME, mapSet, mapWhere);
            return stock//return with stock
        }
    
    }

    static getColorLevelBonus(level){
        return level>=2 ? level*5:0;
    }

    static getUserLevelBonus(level){
        return level>=2? level*5:0;
    }
}

class EventListener {
    static async printStatus(objUserData){
        //key data:
        // objUserData = {
        //     id:interaction.user.id,
        //     username:interaction.user.username,
        //     avatarUrl:interaction.user.avatarURL()
        // }
    
        //init embed
        var arrPages = []; //prepare paging embed
    
        var query = `select cd.${DBM_Card_Data.columns.pack}, count(inv.${DBM_Card_Inventory.columns.id_user}) as total, 
        cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series} 
        from ${DBM_Card_Data.TABLENAME} cd 
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user}=? 
        group by cd.${DBM_Card_Data.columns.pack}`;
        
        var queryGold = `select cd.${DBM_Card_Data.columns.pack}, count(inv.${DBM_Card_Inventory.columns.id_user}) as total_gold, cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series} 
        from ${DBM_Card_Data.TABLENAME} cd
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user}=? and inv.${DBM_Card_Inventory.columns.is_gold}=1 
        group by cd.${DBM_Card_Data.columns.pack}`;
    
        var userData = await getStatusData(objUserData.id);
        var parsedColorData = JSON.parse(userData[DBM_User_Data.columns.color_data]);
        var parsedSeriesData = JSON.parse(userData[DBM_User_Data.columns.series_data]);
        var parsedStatusEffect = JSON.parse(userData[DBM_User_Data.columns.status_effect_data]);
    
        var statusEffect = "-";
        Object.keys(parsedSeriesData).length === 0 ? statusEffect = "-" : statusEffect = statusEffect.value;
    
        var currencyData = JSON.parse(userData[DBM_User_Data.columns.currency_data]);
        var lvl = await getAverageColorLevel(parsedColorData);//average overall color level
    
        //init the object
        var objCardStatus = {pink:{"pack":{},"level":parsedColorData.pink.level,"point":parsedColorData.pink.point},
        blue:{"pack":{},"level":parsedColorData.blue.level,"point":parsedColorData.blue.point},
        yellow:{"pack":{},"level":parsedColorData.yellow.level,"point":parsedColorData.yellow.point},
        purple:{"pack":{},"level":parsedColorData.purple.level,"point":parsedColorData.purple.point},
        red:{"pack":{},"level":parsedColorData.red.level,"point":parsedColorData.red.point},
        green:{"pack":{},"level":parsedColorData.green.level,"point":parsedColorData.green.point},
        white:{"pack":{},"level":parsedColorData.white.level,"point":parsedColorData.white.point}};
        var cardDataInventory = await DBConn.conn.query(query, [objUserData.id]);
        var cardDataInventoryGold = await DBConn.conn.query(queryGold, [objUserData.id]);
    
        for(var i=0;i<cardDataInventory.length;i++){
            var color = cardDataInventory[i][DBM_Card_Data.columns.color];
            var pack = cardDataInventory[i][DBM_Card_Data.columns.pack];
            var total = cardDataInventory[i]['total'];
            var total_gold = cardDataInventoryGold[i]['total_gold'];
    
            objCardStatus[color]["pack"][pack] = {"value":pack,"total":total,"total_gold":total_gold,"iconCompletion":""};
            if(total>=CpackModule[pack].Properties.total){
                cardDataInventoryGold[i]['total_gold'] >= CpackModule[pack].Properties.total ? 
                    objCardStatus[color]["pack"][pack]["iconCompletion"] = "☑️ " : objCardStatus[color]["pack"][pack]["iconCompletion"] = "✅ ";
            }
        }
    
        //prepare the embed
        //avatar
        var avatarId = "-";
        if(userData[DBM_User_Data.columns.avatar_id]!=null)
            avatarId = userData[DBM_User_Data.columns.avatar_id];
    
        var userAvatarMainData = JSON.parse(userData[DBM_User_Data.columns.avatar_main_data]);
    
        var setColor = userData[DBM_User_Data.columns.set_color];
        var setSeries = SpackModule[userData[DBM_User_Data.columns.set_series]].Properties.name;
    
        //prepare the embed
        var txtMainStatus = stripIndents`**Assigned Zone:** ${GProperties.color[setColor].icon}/${setSeries} | **Cure Avatar:** ${avatarId}
        **Currency:**
        ${currencyData[GProperties.currency.mofucoin.value]}/${Properties.limit.mofucoin} ${GProperties.currency.mofucoin.icon_emoji}
        ${currencyData[GProperties.currency.jewel.value]}/${Properties.limit.jewel} ${GProperties.currency.jewel.icon_emoji}
        ${Properties.peacePoint.icon} **${Properties.peacePoint.name}:** ${userData[DBM_User_Data.columns.point_peace]}/${Properties.limit.pointPeace} **|** ✨ **Special Point:** ${userAvatarMainData.special_point}%
        **Status Effect:** ${statusEffect}`;

        var objEmbed = Embed.builder(txtMainStatus, {
            username:`${objUserData.username} (Lvl.${lvl})`,
            avatarUrl:objUserData.avatarUrl
        }, {
            title:`Main Status:`,
            color:Embed.color[setColor],
            fields: [
                {name: `${GProperties.color.pink.icon}${Color.canLevelUp(parsedColorData,GProperties.color.pink.value,1) ? "🆙":""} Lvl. ${objCardStatus.pink.level}/${objCardStatus.pink.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.blue.icon}${Color.canLevelUp(parsedColorData,GProperties.color.blue.value,1) ? "🆙":""} Lvl. ${objCardStatus.blue.level}/${objCardStatus.blue.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.yellow.icon}${Color.canLevelUp(parsedColorData,GProperties.color.yellow.value,1) ? "🆙":""} Lvl. ${objCardStatus.yellow.level}/${objCardStatus.yellow.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.purple.icon}${Color.canLevelUp(parsedColorData,GProperties.color.purple.value,1) ? "🆙":""} Lvl. ${objCardStatus.purple.level}/${objCardStatus.purple.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.red.icon}${Color.canLevelUp(parsedColorData,GProperties.color.red.value,1) ? "🆙":""} Lvl. ${objCardStatus.red.level}/${objCardStatus.red.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.green.icon}${Color.canLevelUp(parsedColorData,GProperties.color.green.value,1) ? "🆙":""} Lvl. ${objCardStatus.green.level}/${objCardStatus.green.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.white.icon}${Color.canLevelUp(parsedColorData,GProperties.color.white.value,1) ? "🆙":""} Lvl. ${objCardStatus.white.level}/${objCardStatus.white.point} Pts:`,
                value: ``,inline:true},
            ]
        });
    
        var idxColor = 0;
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                var objPack = objCardStatus[keyColor]["pack"][pack];
                objEmbed.fields[idxColor]["value"] += `${objPack.iconCompletion}${GlobalFunctions.capitalize(objPack.value)}: ${objPack.total}/${CpackModule[pack].Properties.total}\n`;
            });
            idxColor+=1;
        });
    
        arrPages[0] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 2 : series point======
        objEmbed.title = `Status - Series Points`;
        objEmbed.description = ``;
        objEmbed.fields = [];

        for(var series in SpackModule){
            objEmbed.description+=`${SpackModule[series].Properties.currency.icon_emoji} ${parsedSeriesData[series]}/${Properties.limit.seriesPoint} ${SpackModule[series].Properties.currency.name} (${SpackModule[series].Properties.name})\n`;
        }
        
        arrPages[1] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 3: duplicate card======
        var queryDuplicate = `select cd.${DBM_Card_Data.columns.pack}, sum(inv.${DBM_Card_Inventory.columns.stock}) as total, 
        cd. ${DBM_Card_Data.columns.color}
        from ${DBM_Card_Data.TABLENAME} cd
        left join ${DBM_Card_Inventory.TABLENAME} inv
        on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and
        inv.${DBM_Card_Inventory.columns.id_user}=? and
        inv.${DBM_Card_Inventory.columns.stock}>=1
        where inv.${DBM_Card_Inventory.columns.stock}>=1 
        group by cd.${DBM_Card_Data.columns.pack}`;
    
        var cardDataInventory = await DBConn.conn.query(queryDuplicate, [objUserData.id]);
    
        //reset all total to 0
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                objCardStatus[keyColor]["pack"][pack]["total"] = 0;
            });
        });
    
        objEmbed.title = `Status - Duplicate Card:`;
        objEmbed.description = ``;
        objEmbed.fields = [
            { name: `${GProperties.color.pink.icon_card} Pink:`, value: ``, inline: true}, 
            { name: `${GProperties.color.blue.icon_card} Blue:`, value: ``, inline: true},
            { name: `${GProperties.color.yellow.icon_card} Yellow:`, value: ``, inline: true}, 
            { name: `${GProperties.color.purple.icon_card} Purple:`, value: ``, inline: true },
            { name: `${GProperties.color.red.icon_card} Red:`, value: ``, inline: true }, 
            { name: `${GProperties.color.green.icon_card} Green:`, value: ``, inline: true },
            { name: `${GProperties.color.white.icon_card} White:`, value: ``, inline: true }
        ];
    
        for(var i=0;i<cardDataInventory.length;i++){
            var color = cardDataInventory[i][DBM_Card_Data.columns.color];
            var pack = cardDataInventory[i][DBM_Card_Data.columns.pack];
            objCardStatus[color]["pack"][pack]["total"] = cardDataInventory[i]['total'];
        }
    
        var idxColor = 0;
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                // console.log(objCardStatus[keyColor]["pack"]);
                var objPack = objCardStatus[keyColor]["pack"][pack];
                objEmbed.fields[idxColor]["value"] += `${objPack.iconCompletion}${GlobalFunctions.capitalize(objPack.value)}: ${objPack.total}/${Properties.limit.card}\n`;
            });
            idxColor+=1;
        });
    
    
        arrPages[2] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 4: gold card======
        //reset all total to 0
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                objCardStatus[keyColor]["pack"][pack]["total"] = 0;
            });
        });
    
        objEmbed.title = `Status - Gold Card:`;
        objEmbed.fields = [
            { name: `${GProperties.color.pink.icon_card} Pink:`, value: ``, inline: true}, 
            { name: `${GProperties.color.blue.icon_card} Blue:`, value: ``, inline: true},
            { name: `${GProperties.color.yellow.icon_card} Yellow:`, value: ``, inline: true}, 
            { name: `${GProperties.color.purple.icon_card} Purple:`, value: ``, inline: true },
            { name: `${GProperties.color.red.icon_card} Red:`, value: ``, inline: true }, 
            { name: `${GProperties.color.green.icon_card} Green:`, value: ``, inline: true },
            { name: `${GProperties.color.white.icon_card} White:`, value: ``, inline: true }
        ];
    
        var idxColor = 0;
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                var objPack = objCardStatus[keyColor]["pack"][pack];
                objEmbed.fields[idxColor]["value"] += `${objPack.iconCompletion}${GlobalFunctions.capitalize(objPack.value)}: ${objPack.total_gold}/${CpackModule[pack].Properties.total}\n`;
            });
            idxColor+=1;
        });
    
        arrPages[3] = new MessageEmbed(objEmbed); //add embed to pages
    
        return arrPages;
    }

    static async printInventory(objUserData, pack, interaction){
        var arrPages = []; //prepare paging embed
        
        var query = `select cd.${DBM_Card_Data.columns.id_card}, cd.${DBM_Card_Data.columns.pack}, cd.${DBM_Card_Data.columns.name}, cd.${DBM_Card_Data.columns.rarity}, cd.${DBM_Card_Data.columns.img_url}, inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.is_gold}, inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.level}
        from ${DBM_Card_Data.TABLENAME} cd 
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card} = inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user} = ?
        where cd.${DBM_Card_Data.columns.pack}=?`;
        
        var cardDataInventory = await DBConn.conn.query(query, [objUserData.id, pack]);
        //validation if pack exists/not
        if(cardDataInventory.length<=0){
            var packByColor = {pink:``,blue:``,yellow:``,purple:``,red:``,green:``,white:``};
            for(var pack in CpackModule){
                var series = CpackModule[pack].Properties.series;
                packByColor[CpackModule[pack].Properties.color]+=`${SpackModule[series].Properties.icon.mascot_emoji} ${GlobalFunctions.capitalize(pack)}\n`;
            }

            return interaction.reply({embeds:[
                Embed.builder(":x: I can't find that card pack. Here are the list for available card pack:", objUserData, {
                    color:Embed.color.danger,
                    fields:[
                        {
                            name:`${GProperties.emoji.color_pink} Pink:`,
                            value:packByColor.pink,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_blue} Blue:`,
                            value:packByColor.blue,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_yellow} Yellow:`,
                            value:packByColor.yellow,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_purple} Purple:`,
                            value:packByColor.purple,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_red} Red:`,
                            value:packByColor.red,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_green} Green:`,
                            value:packByColor.green,
                            inline:true
                        },
                        {
                            name:`${GProperties.emoji.color_white} White:`,
                            value:packByColor.white,
                            inline:true
                        }
                    ]
                })
            ], ephemeral:true});
        }

        var pack = cardDataInventory[0][DBM_Card_Data.columns.pack];
        var color = CpackModule[pack].Properties.color; var iconColor = GProperties.emoji[`color_${color}`];
        var alterEgo = CpackModule[pack].Properties.alter_ego;
        var icon = CpackModule[pack].Properties.icon;
        var max = CpackModule[pack].Properties.total;

        var idx = 0; var maxIdx = 4; var txtInventory = ``;
        var total = {
            normal:cardDataInventory.filter(
                function (item) {
                    return item[DBM_Card_Inventory.columns.id_user] != null;
                }
            ).length,
            gold:cardDataInventory.filter(
                function (item) {
                    return item[DBM_Card_Inventory.columns.is_gold] == 1;
                }
            ).length
        };
        
        var arrFields = [];
        for(var i=0;i<cardDataInventory.length;i++){
            var iconOwned = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
                GProperties.emoji.aoi_check_green : GProperties.emoji.aoi_x;
            var rarity = cardDataInventory[i][DBM_Card_Data.columns.rarity];
            var img = cardDataInventory[i][DBM_Card_Data.columns.img_url];
            var id = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
            `${cardDataInventory[i][DBM_Card_Data.columns.id_card]}` : "???";
            var displayName = cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
            `[${cardDataInventory[i][DBM_Card_Data.columns.name]}](${img})` : "???";
            var stock = cardDataInventory[i][DBM_Card_Inventory.columns.stock]>1 ? 
            `x${cardDataInventory[i][DBM_Card_Inventory.columns.stock]}`:"";
            
            //check for gold
            // iconOwned = cardDataInventory[i][DBM_Card_Data.columns.is_gold]==1 && cardDataInventory[i][DBM_Card_Inventory.columns.id_user] ? 
            // GProperties.emoji.aoi_check_green:GProperties.emoji.aoi_x;
            
            arrFields.push({
                name:`${GProperties.emoji.r1}${rarity}: ${id} ${stock}`,
                value:displayName
            });
            
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
                arrPages.push(Embed.builder(
                    stripIndents`**Duplicate:**/${Properties.limit.card}
                    **Normal:** ${total.normal}/ ${max} 
                    **Gold:** ${total.gold}/${max}`,objUserData,{
                    color:Embed.color[color],
                    title:`${iconColor} ${GlobalFunctions.capitalize(pack)}/${alterEgo} Inventory:`,
                    thumbnail:icon,
                    fields:arrFields
                }));
                arrFields = [];
                idx = 0;
            } else {
                idx++;
            }

        }

        return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);

        // for(var item in cardDataInventory){
        //     console.log(item);
        //     ctr++;
        // }

        // console.log(color);
        //init embed
        // var objEmbed = Embed.builder(``,objUserData, {
        //     color:Embed.color[]
        // });

    }
}

module.exports = {Card, Properties, Color, EventListener, getStatusData, isLogin, getAverageColorLevel, updatePointParam, 
    updateColorPointParam, updateSeriesPointParam, updateSeriesPoint, updateSpawnToken,
    updateData}
const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');

const paginationEmbed = require('../DiscordPagination');

const GProperties = require('./Properties');
const Color = GProperties.color;

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

const Data = require("./Data");
const DataUser = Data.User;
const DataCard = Data.Card;
// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./Series");

const CardModule = require('./card');
// const QuestModule = require('./Quest');

const GEmbed = require("./Embed");
const Validation = require("./Validation");

// class Color {
//     static canLevelUp(color_data, color, totalLevelUp=1){
//         return color_data[color].point>(color_data[color].level+totalLevelUp)*100 ? 
//             true:false;
//     }
// }

// class Data {
//     static peacePoint = Object.freeze({
//         value:"peacePoint",
//         name:"Peace Point",
//         emoji:"<:peacepoint:936238606660554773>",
//         limit:5,
//         getLabel: function(val, withMax=false){
//             if(withMax){
//                 return `${val}/${this.limit} ${this.emoji}`;
//             } else {
//                 return `${val} ${this.emoji}`;
//             }
//         }
//     })

//     static color = Object.freeze({
//         level:"level",
//         point:"point"
//     })

//     static getCurrency(userData,currency=null){
//         var currencyData = JSON.parse(userData[DBM_User_Data.columns.currency_data]);
//         if(currency==null){
//             return currencyData;
//         } else {
//             return currencyData[currency.value];
//         }
//     }

//     static getPeacePoint(userData){
//         return userData[DBM_User_Data.columns.peace_point];
//     }

//     static getSetColor(userData){
//         return userData[DBM_User_Data.columns.set_color];
//     }

//     static getColorData(userData){
//         return JSON.parse(userData[DBM_User_Data.columns.color_data]);
//     }

//     static getColorLevel(userData, color){
//         var parsedColorData = JSON.parse(userData[DBM_User_Data.columns.color_data]);
//         return parsedColorData[color.value][this.color.level];
//     }

//     static getColorPoint(userData, color){
//         var parsedColorData = JSON.parse(userData[DBM_User_Data.columns.color_data]);
//         return parsedColorData[color.value][this.color.point];
//     }

//     static getSetSeries(userData){
//         return userData[DBM_User_Data.columns.set_series];
//     }

//     static getSeriesName(userData){
//         var series = this.getSetSeries(userData);
//         return SpackModule[series].Properties.name;
//     }

//     static getSeriesData(userData){
//         return JSON.parse(userData[DBM_User_Data.columns.series_data]);
//     }
// }

async function isLogin(objUserData, guildId){
    var userId = objUserData.id;
    if(!GuildModule.Data.userLogin[guildId].includes(userId)){
        return GEmbed.errorMini(`Please login into server with: "**/daily check-in**" command.`,objUserData,true, {
            title:`❌ Not logged in yet!`
        });
    } else {
        return true;
    }
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
    var statusData = await DataUser.Card.getData(id_user);
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
            case DBM_User_Data.columns.peace_point://booster point
                var curPointBoost = userStatusData[DBM_User_Data.columns.peace_point];
                if(valueOptions>=0&&curPointBoost+valueOptions<Properties.limit.peacePoint){
                    curPointBoost+= valueOptions;
                } else if(valueOptions<0){
                    curPointBoost-=- valueOptions;
                } else {
                    curPointBoost= Properties.limit[key];
                }

                querySet+=` ${DBM_User_Data.columns.peace_point} = ?, `;
                arrParam.push(curPointBoost);
                break;
            case DBM_User_Data.columns.daily_data://daily data
            case DBM_User_Data.columns.token_cardspawn://card spawn token
            case DBM_User_Data.columns.server_id_login:
            case DBM_User_Data.columns.avatar_main_data:
            case DBM_User_Data.columns.avatar_support_data://support avatar
            default:
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

async function checkAvailable(objUserData, username, interaction){//check if username is available on server/not
    if(username!=null){
        var memberExists = true;

        await interaction.guild.members.fetch({query:`${username}`,limit:1})
        .then(
            async members=> {
                if(members.size>=1){
                    objUserData = {
                        id:members.first().user.id,
                        username:members.first().user.username,
                        avatarUrl:members.first().user.avatarURL()
                    }
                    
                } else {
                    memberExists = false;
                }
            }
        );

        if(!memberExists){
            await interaction.reply(GEmbed.notifUserNotFound(objUserData));
            return false;
        }
    }

    return objUserData;
}

class Card {
    static getColorLevelBonus(level){
        return level>=2 ? level*5:0;
    }

    static getUserLevelBonus(level){
        return level>=2? level*5:0;
    }

    
}

class EventListener {
    static async printInventory(objUserData, pack, interaction){
        var arrPages = []; //prepare paging embed
        
        var query = `select cd.${DBM_Card_Data.columns.id_card}, cd.${DBM_Card_Data.columns.pack}, cd.${DBM_Card_Data.columns.name}, cd.${DBM_Card_Data.columns.rarity}, cd.${DBM_Card_Data.columns.img_url}, cd.${DBM_Card_Data.columns.hp_base}, cd.${DBM_Card_Data.columns.atk_base}, inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.is_gold}, inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.level}
        from ${DBM_Card_Data.TABLENAME} cd 
        left join ${DBM_Card_Inventory.TABLENAME} inv 
        on cd.${DBM_Card_Data.columns.id_card} = inv.${DBM_Card_Inventory.columns.id_card} and 
        inv.${DBM_Card_Inventory.columns.id_user} = ?
        where cd.${DBM_Card_Data.columns.pack}=?`;
        
        var cardDataInventory = await DBConn.conn.query(query, [objUserData.id, pack]);
        //validation if pack exists/not
        if(cardDataInventory.length<=0){
            return interaction.reply(GEmbed.notifPackNotFound(objUserData));
        }

        var pack = cardDataInventory[0][DBM_Card_Data.columns.pack];
        var color = CpackModule[pack].Properties.color; var iconColor = GProperties.emoji[`color_${color}`];
        var series = CpackModule[pack].Properties.series; var iconSeries = Series[series].Properties.icon.mascot_emoji;
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
            ).length,
            duplicate: GlobalFunctions.sumObjectByKey(cardDataInventory.filter(
                function (item) {
                    return item[DBM_Card_Inventory.columns.stock]>0;
                }
            ), DBM_Card_Inventory.columns.stock)
        };
        
        var arrFields = [];
        for(var i=0;i<cardDataInventory.length;i++){
            var cardInventory = cardDataInventory[i];
            var rarity = cardInventory[DBM_Card_Data.columns.rarity];

            arrFields.push({
                name:`${CardModule.Emoji.rarity(rarity)}${rarity}: ${id} ${stock}`,
                value:stripIndents`${displayName} Lv.${level}`
            });

            if(cardInventory[DBM_Card_Inventory.columns.id_user]){
                var id = `${cardInventory[DBM_Card_Data.columns.id_card]}`;
                var img = cardInventory[DBM_Card_Data.columns.img_url];
                var displayName = `[${GlobalFunctions.cutText(cardInventory[DBM_Card_Data.columns.name],30)}](${img})`;
                var stock = cardInventory[DBM_Card_Inventory.columns.stock]>0 ?
                `${GProperties.color[color].icon_card}x${cardInventory[DBM_Card_Inventory.columns.stock]}`:"";
                var level = cardInventory[DBM_Card_Inventory.columns.level];
                var hp = CardModule.Parameter.getHp(level, cardInventory[DBM_Card_Data.columns.hp_base]);
                var atk = CardModule.Parameter.getHp(level, cardInventory[DBM_Card_Data.columns.atk_base]);

                txtInventory+=`**${CardModule.Emoji.rarity(rarity, cardInventory)}${rarity}: ${id} ${stock}**\n`;
                txtInventory+=`${displayName} Lv.${level}\n❤️:${hp} | ⚔️:${atk}\n\n`;
            } else {
                txtInventory+=`**${CardModule.Emoji.rarity(rarity)}${rarity}: ???**\n???\n\n`;
            }
            
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
                arrPages.push(GEmbed.builder(
                    `**Normal:** ${total.normal}/${max} | **Gold:** ${total.gold}/${max}\n${GProperties.color[color].icon_card}: ${total.duplicate}/${Properties.limit.card*cardDataInventory.length}\n`+
                    `\n${txtInventory}`,objUserData,{
                    color:GEmbed.color[color],
                    title:`${iconSeries} ${GlobalFunctions.capitalize(pack)}/${alterEgo} Inventory:`,
                    thumbnail:icon,
                    // fields:arrFields
                }));
                arrFields = []; txtInventory="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return arrPages;
    }

    static async printStatus(userDiscord, guildId){
        var tes = new Series(SPack["max_heart"]);
        console.log(tes.Properties);
        // tes.Properties
        // tes.Properties.getValue();
        return;
        var userId = userDiscord.id;
        //key data:
        // objUserData = {
        //     id:interaction.user.id,
        //     username:interaction.user.username,
        //     avatarUrl:interaction.user.avatarURL()
        // }
    
        //init embed
        var arrPages = []; //prepare paging embed
    
        var userData = new DataUser( await DataUser.getData(userId));
        // var parsedColorData = userData.getColorData();
        // var parsedSeriesData = userData.getSeriesData();
    
        var userLevel = userData.getAverageColorLevel();//average overall color level
    
        //init the object
        var objCardStatus = {
            pink:{"pack":{},"level":userData.getColorLevel(Color.pink),"point":userData.getColorPoint(Color.pink)},
            blue:{"pack":{},"level":userData.getColorLevel(Color.blue),"point":userData.getColorPoint(Color.blue)},
            yellow:{"pack":{},"level":userData.getColorLevel(Color.yellow),"point":userData.getColorPoint(Color.yellow)},
            purple:{"pack":{},"level":userData.getColorLevel(Color.purple),"point":userData.getColorPoint(Color.purple)},
            red:{"pack":{},"level":userData.getColorLevel(Color.red),"point":userData.getColorPoint(Color.red)},
            green:{"pack":{},"level":userData.getColorLevel(Color.green),"point":userData.getColorPoint(Color.green)},
            white:{"pack":{},"level":userData.getColorLevel(Color.white),"point":userData.getColorPoint(Color.white)}
        };

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

        var cardDataInventory = await DBConn.conn.query(query, [userId]);
        var cardDataInventoryGold = await DBConn.conn.query(queryGold, [userId]);

        for(var i=0;i<cardDataInventory.length;i++){
            var cardData = new DataCard(cardDataInventory[i]);
            var color = cardData.getColor();
            var pack = cardData.getPack();
            var total = cardData.total;
            var total_gold = cardData.total_gold;
            var packTotal = DataCard.getPackTotal(pack);

            objCardStatus[color]["pack"][pack] = {"value":pack,"total":total,"total_gold":total_gold,"iconCompletion":""};
            if(total>=packTotal){
                cardDataInventoryGold[i]['total_gold'] >= packTotal ? 
                objCardStatus[color]["pack"][pack]["iconCompletion"] = "☑️ " : objCardStatus[color]["pack"][pack]["iconCompletion"] = "✅ ";
            }
        }
    
        //prepare the embed
        //avatar
        var setColor = userData.getSetColor();
        var setSeries = userData.getSetSeries();
    
        //prepare the embed
        var txtMainStatus = dedent(`🪐 **Location:** ${userData.getSeriesLocationName()}@${userData.getSetSeriesName()}
        ${DataUser.peacePoint.emoji} **${DataUser.peacePoint.name}:** ${userData.getPeacePoint()}/${userData.limit.peacePoint}
        
        **Currency:**
        ${userData.getCurrency(DataUser.currency.jewel)}
        ${GProperties.currency.jewel.getLabel(
            DataUser.getCurrency(userData, GProperties.currency.jewel), Properties.limit.currency.jewel)}`);

        var objEmbed = GEmbed.builder(txtMainStatus, {
            username:`${userDiscord.username} (Lvl.${lvl})`,
            avatarUrl:userDiscord.avatarUrl
        }, {
            title:`Main Status:`,
            color:GEmbed.color[setColor],
            fields: [
                {name: `${GProperties.color.pink.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.pink.value,1) ? "🆙":""} Lvl. ${objCardStatus.pink.level}/${objCardStatus.pink.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.blue.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.blue.value,1) ? "🆙":""} Lvl. ${objCardStatus.blue.level}/${objCardStatus.blue.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.yellow.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.yellow.value,1) ? "🆙":""} Lvl. ${objCardStatus.yellow.level}/${objCardStatus.yellow.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.purple.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.purple.value,1) ? "🆙":""} Lvl. ${objCardStatus.purple.level}/${objCardStatus.purple.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.red.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.red.value,1) ? "🆙":""} Lvl. ${objCardStatus.red.level}/${objCardStatus.red.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.green.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.green.value,1) ? "🆙":""} Lvl. ${objCardStatus.green.level}/${objCardStatus.green.point} Pts:`,
                value: ``,inline:true},
                {name: `${GProperties.color.white.emoji}${Color.canLevelUp(parsedColorData,GProperties.color.white.value,1) ? "🆙":""} Lvl. ${objCardStatus.white.level}/${objCardStatus.white.point} Pts:`,
                value: ``,inline:true},
            ],
            footer:{
                text:`Page 1 / 5 | Daily checked in: ${userData.hasLogin() ? `✅`:`❌`} `
            }
        });

        console.log(objEmbed);
        return;
    
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
        objEmbed.footer = null;

        for(var series in Series){
            objEmbed.description+=`${Series[series].Properties.currency.icon_emoji} ${parsedSeriesData[series]}/${Properties.limit.seriesPoint} ${Series[series].Properties.currency.name} (${Series[series].Properties.name})\n`;
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
    
        var cardDataInventory = await DBConn.conn.query(queryDuplicate, [userDiscord.id]);
    
        //reset all total to 0
        Object.keys(objCardStatus).forEach(keyColor=>{
            Object.keys(objCardStatus[keyColor]["pack"]).forEach(pack => {
                objCardStatus[keyColor]["pack"][pack]["total"] = 0;
            });
        });
    
        objEmbed.title = `Status - Duplicate Card:`;
        objEmbed.description = ``;
        objEmbed.fields = [
            { name: `${GProperties.color.pink.emoji_card} Pink:`, value: ``, inline: true}, 
            { name: `${GProperties.color.blue.emoji_card} Blue:`, value: ``, inline: true},
            { name: `${GProperties.color.yellow.emoji_card} Yellow:`, value: ``, inline: true}, 
            { name: `${GProperties.color.purple.emoji_card} Purple:`, value: ``, inline: true },
            { name: `${GProperties.color.red.emoji_card} Red:`, value: ``, inline: true }, 
            { name: `${GProperties.color.green.emoji_card} Green:`, value: ``, inline: true },
            { name: `${GProperties.color.white.emoji_card} White:`, value: ``, inline: true }
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
                var max = CpackModule[pack].Properties.total;
                objEmbed.fields[idxColor]["value"] += `${objPack.iconCompletion}${GlobalFunctions.capitalize(objPack.value)}: ${objPack.total}/${Properties.limit.card*max}\n`;
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
            { name: `${GProperties.color.pink.emoji_card} Pink:`, value: ``, inline: true}, 
            { name: `${GProperties.color.blue.emoji_card} Blue:`, value: ``, inline: true},
            { name: `${GProperties.color.yellow.emoji_card} Yellow:`, value: ``, inline: true}, 
            { name: `${GProperties.color.purple.emoji_card} Purple:`, value: ``, inline: true },
            { name: `${GProperties.color.red.emoji_card} Red:`, value: ``, inline: true }, 
            { name: `${GProperties.color.green.emoji_card} Green:`, value: ``, inline: true },
            { name: `${GProperties.color.white.emoji_card} White:`, value: ``, inline: true }
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

        //======page 5: avatar======
        // var pageIndex = 4;
        // var avatarData = await this.getAvatarData(objUserData.id);
        // if(avatarData[DBM_Card_Avatar.columns.id_main]!==null){
        //     //get main avatar data
        //     var cardId = avatarData[DBM_Card_Avatar.columns.id_main];
        //     var cardData = await CardModule.getCardData(avatarData[DBM_Card_Avatar.columns.id_main]);
        //     var cardInventoryData = await CardModule.Inventory.getData(objUserData.id, cardId);
        //     var pack = cardData[DBM_Card_Data.columns.pack];
        //     var arrCardData = [cardData];
        //     var arrCardInventoryData = [cardInventoryData];
            
        //     //check & get support 1 avatar data
        //     if(avatarData[DBM_Card_Avatar.columns.id_support1]!==null){
        //         let cardData = await CardModule.getCardData(avatarData[DBM_Card_Avatar.columns.id_support1]);
        //         let cardInventoryData = await CardModule.Inventory.getData(objUserData.id, avatarData[DBM_Card_Avatar.columns.id_support1]);

        //         arrCardData.push(cardData);
        //         arrCardInventoryData.push(cardInventoryData);
        //     } else {
        //         arrCardData.push(null);
        //         arrCardInventoryData.push(null);
        //     }

        //     //check & get support 2 avatar data
        //     if(avatarData[DBM_Card_Avatar.columns.id_support2]!==null){
        //         let cardData = await CardModule.getCardData(avatarData[DBM_Card_Avatar.columns.id_support2]);
        //         let cardInventoryData = await CardModule.Inventory.getData(objUserData.id, avatarData[DBM_Card_Avatar.columns.id_support2]);

        //         arrCardData.push(cardData);
        //         arrCardInventoryData.push(cardInventoryData);
        //     } else {
        //         arrCardData.push(null);
        //         arrCardInventoryData.push(null);
        //     }

        //     var avatarData = Avatar.init(arrCardData, arrCardInventoryData);
        //     var arrFields = [];
            
        //     //check & get support data to embed
        //     for(var i=0;i<=2;i++){
        //         if(Avatar.Data.isAvailable(avatarData, i)){
        //             let cardId = Avatar.Data.getIdCard(avatarData, i);
        //             let pack = Avatar.Data.getPack(avatarData, i);
        //             let rarity = Avatar.Data.getRarity(avatarData, i);
        //             let level = Avatar.Data.getSuppportLevel(avatarData, i);
        //             let name = Avatar.Data.getAlterEgo(avatarData, i);

        //             switch(i){
        //                 case 0://main cure
        //                     arrFields.push(
        //                         {name: `**${rarity}${CardModule.Emoji.rarity(rarity)} ${name}** | Lvl. ${level}`, 
        //                         value: dedent(`❤️ **Hp:** ${Avatar.Data.getMaxHp(avatarData)} | ⚔️ **Atk:** ${Avatar.Data.getAtk(avatarData)}
        //                         **Passive Skill:**
        //                         ${Avatar.Skill.getPassiveSkillLabel(level, pack)}`)}
        //                     );
        //                     break;
        //                 default:
        //                     arrFields.push({ 
        //                     name: `**${rarity}${CardModule.Emoji.rarity(rarity)} ${name} | Lvl. ${level}** (Support ${i})`, 
        //                     value: dedent(`**Passive Skill:** 
        //                     ${Avatar.Skill.getPassiveSkillLabel(level, pack)}`)});
        //                     break;
        //             }
        //         } else {
        //             arrFields.push({ 
        //                 name: `❌ Support ${i} : Not available`, 
        //                 value: dedent(`**Passive Skill: -**`)});
        //         }
        //     }

        //     // console.log(avatarData);

        //     arrPages[pageIndex] = new MessageEmbed(
        //         GEmbed.builder("",objUserData,{
        //             color: CpackModule[pack].Properties.color,
        //             title:`Cure Avatar:`,
        //             thumbnail:cardData[DBM_Card_Data.columns.img_url],
        //             fields:arrFields
        //         })
        //     ); //add embed to pages

        // }
    
        return arrPages;
    }

    static async printDetail(objUserData, idCard, interaction, isPrivate=true){
        var userId = objUserData.id;
        //print card detail
        var arrPages = []; //prepare paging embed
        var cardData = await CardModule.getCardData(idCard);
        var cardInventoryData = await CardModule.Inventory.getData(userId, idCard);
        if(!cardData){
            return interaction.reply(GEmbed.notifCardDataNotFound(objUserData));
        } else if(!cardInventoryData){
            return interaction.reply(GEmbed.notifNotOwnCard(objUserData));
        }

        var idCard = cardData[DBM_Card_Data.columns.id_card];
        var name = cardData[DBM_Card_Data.columns.name];
        var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack];
        var color = CpackModule[pack].Properties.color;
        var img = CardModule.Modifier.img(cardInventoryData, cardData);
        var series = CpackModule[pack].Properties.series;
        var createdDate = GlobalFunctions.convertDateTime(cardInventoryData[DBM_Card_Inventory.columns.created_at]);

        var level = cardInventoryData[DBM_Card_Inventory.columns.level];
        var hp = Avatar.Parameter.getHp(level, cardData[DBM_Card_Data.columns.hp_base]);
        var atk = Avatar.Parameter.getAtk(level, cardData[DBM_Card_Data.columns.atk_base]);
        var spMax = Avatar.Parameter.getSp(color);

        var cureData = CpackModule[pack].Avatar.normal;

        arrPages.push(GEmbed.builder(
        dedent(`**${rarity}${CardModule.Emoji.rarity(rarity, cardInventoryData)} Level:** ${level}/${Avatar.Parameter.getMaxLevel(rarity)} | **Next EXP:** ${Avatar.Parameter.getNextExp(level)}P
        **Passive Skill:**
        ${Avatar.Skill.getPassiveSkillLabel(level, pack)}

        **Battle Stats:**
        ❤️: ${hp} | ⚔️: ${atk} 
        🌟 SP Max: ${spMax} 
        💖 **Special:** ${CpackModule[pack].Avatar.normal.special_attack}`),
        {
            username:`${cureData.name}`,
            avatarUrl:cureData.icon
        },{
            color:color,
            image:img,
            title:`${name}`,
            footer:{
                text:`Received at: ${createdDate}`,
                iconURL:objUserData.avatarUrl
            }
        }));

        paginationEmbed(interaction, arrPages, DiscordStyles.Button.pagingButtonList, isPrivate);
    }
}

module.exports = {Card, EventListener, checkAvailable, isLogin, updatePointParam, 
    updateColorPointParam, updateSeriesPointParam, updateSeriesPoint, updateSpawnToken,
    updateData}
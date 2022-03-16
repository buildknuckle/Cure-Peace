const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageEmbed} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');

const paginationEmbed = require('../DiscordPagination');

const Properties = require('./Properties');
const Color = Properties.color;
const Currency = Properties.currency;
const Emoji = Properties.emoji;

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
// const DBM_User_Data = require('../../database/model/DBM_User_Data');
// const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

const Data = require("./Data");
const DataUser = Data.User;
const DataCard = Data.Card;
const {UserQuest, DailyCardQuest} = require("./data/Quest");
const DataCardInventory = Data.CardInventory;
// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");
const {Character } = require('./data/Character');

const CardModule = require('./card');
// const QuestModule = require('./Quest');

const GEmbed = require("./Embed");

class Validation extends require("./Validation") {
    
}

// async function isLogin(objUserData, guildId){
//     var userId = objUserData.id;
//     if(!GuildModule.Data.userLogin[guildId].includes(userId)){
//         return GEmbed.errorMini(`Please login into server with: "**/daily check-in**" command.`,objUserData,true, {
//             title:`❌ Not logged in yet!`
//         });
//     } else {
//         return true;
//     }
// }

// async function updatePointParam(id_user, userStatusData, mapColorPoint, mapSeriesPoint, mapCurrency = null){
//     //process color part
//     var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
//     for (const [key, value] of mapColorPoint.entries()) {
//         if(value>=0&&parsedColorPoint[key]["point"]+value<Properties.limit.colorPoint){
//             parsedColorPoint[key]["point"]+= value;
//         } else if(value<0){
//             parsedColorPoint[key]["point"]-=- value;
//         } else {
//             parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
//         }
        
//         if(value<0&&parsedColorPoint[key]["point"]-value<=0) parsedColorPoint[key]["point"]=0; //prevent negative
//     }

//     var colorData = JSON.stringify(parsedColorPoint);

//     //process series part
//     var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
//     for (const [key, value] of mapSeriesPoint.entries()) {
//         if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
//             parsedSeriesPoint[key]+= value;
//         } else if(value<0){
//             parsedSeriesPoint[key]-=- value;
//         } else {
//             parsedSeriesPoint[key]= Properties.limit.seriesPoint;
//         }
        
//         if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
//     }

//     var seriesData = JSON.stringify(parsedSeriesPoint);

//     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
//     SET ${DBM_User_Data.columns.color_data} = ?, ${DBM_User_Data.columns.series_data} = ? `;
//     var arrParam = [colorData, seriesData];

//     if(mapCurrency!=null){
//         var parsedCurrency = JSON.parse(userStatusData[DBM_User_Data.columns.currency_data]);
        
//         for (const [key, value] of mapCurrency.entries()) {
//             if(value>=0&&parsedCurrency[key]+value<Properties.limit[key]){
//                 parsedCurrency[key]+= value;
//             } else if(value<0){
//                 parsedCurrency[key]-=- value;
//             } else {
//                 parsedCurrency[key]= Properties.limit[key];
//             }
            
//             if(value<0&&parsedCurrency[key]-value<=0) parsedCurrency[key]=0; //prevent negative
//         }

//         query+=` , ${DBM_User_Data.columns.currency_data} = ? `;
//         arrParam.push(JSON.stringify(parsedCurrency));
//     }

//     query+=` WHERE ${DBM_User_Data.columns.id_user} = ?`;
//     arrParam.push(id_user);

//     await DBConn.conn.query(query, arrParam);

//     // {"mofucoin":0}

//     // {"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}

//     // {"max_heart":0,"splash_star":0,"yes5gogo":0,"fresh":0,"heartcatch":0,"suite":0,"smile":0,"dokidoki":0,"happiness":0,"go_princess":0,"mahou_tsukai":0,"kirakira":0,"hugtto":0,"star_twinkle":0,"healin_good":0,"tropical_rouge":0}
// }

// async function updateColorPointParam(id_user, userStatusData, mapColorPoint){
//     //update without load from db
//     //get series point from db
//     var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
//     for (const [key, value] of mapColorPoint.entries()) {
//         if(value>=0&&parsedColorPoint[key]["point"]+value<Properties.limit.colorPoint){
//             parsedColorPoint[key]["point"]+= value;
//         } else if(value<0){
//             parsedColorPoint[key]["point"]-=- value;
//         } else {
//             parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
//         }
        
//         if(value<0&&parsedColorPoint[key]["point"]-value<=0) parsedColorPoint[key]["point"]=0; //prevent negative
//     }

//     var colorData = JSON.stringify(parsedColorPoint);

//     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
//     SET ${DBM_User_Data.columns.color_data} = ? 
//     WHERE ${DBM_User_Data.columns.id_user} = ?`;

//     await DBConn.conn.query(query, [colorData, id_user]);
// }

// async function updateSeriesPointParam(id_user, userStatusData, mapSeriesPoint){
//     //update without load from db
//     //get series point from db
//     var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
//     for (const [key, value] of mapSeriesPoint.entries()) {
//         if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
//             parsedSeriesPoint[key]+= value;
//         } else if(value<0){
//             parsedSeriesPoint[key]-=- value;
//         } else {
//             parsedSeriesPoint[key]= Properties.limit.seriesPoint;
//         }
        
//         if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
//     }

//     var seriesData = JSON.stringify(parsedSeriesPoint);

//     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
//     SET ${DBM_User_Data.columns.series_data} = ? 
//     WHERE ${DBM_User_Data.columns.id_user} = ?`;

//     await DBConn.conn.query(query, [seriesData, id_user]);
// }

// async function updateSeriesPoint(id_user, mapSeriesPoint){
//     //get series point from db
//     var statusData = await DataUser.Card.getData(id_user);
//     var parsedSeriesPoint = JSON.parse(statusData[DBM_User_Data.columns.series_data]);
//     for (const [key, value] of mapSeriesPoint.entries()) {
//         if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.colorPoint){
//             parsedSeriesPoint[key]+= value;
//         } else if(value<0){
//             parsedSeriesPoint[key]-=- value;
//         } else {
//             parsedSeriesPoint[key]= Properties.limit.colorPoint;
//         }
        
//         if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
//     }

//     var seriesData = JSON.stringify(parsedSeriesPoint);

//     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
//     SET ${DBM_User_Data.columns.series_data} = ? 
//     WHERE ${DBM_User_Data.columns.id_user} = ?`;

//     await DBConn.conn.query(query, [seriesData, id_user]);
// }

// async function updateSpawnToken(userId, tokenSpawn){
//     // update user spawn token
//     var mapSet = new Map();
//     mapSet.set(DBM_User_Data.columns.token_cardspawn, tokenSpawn);
//     var mapWhere = new Map();
//     mapWhere.set(DBM_User_Data.columns.id_user, userId);
//     await DB.update(DBM_User_Data.TABLENAME, mapSet, mapWhere);
// }

// async function updateData(id_user, userStatusData, options){
//     var arrParam = [];
//     var querySet = ``;

//     //{"pink":{"level":1,"point":0},"blue":{"level":1,"point":0},"yellow":{"level":1,"point":0},"green":{"level":1,"point":0},"red":{"level":1,"point":0},"purple":{"level":1,"point":0},"white":{"level":1,"point":0}}
    
//     //process color point
//     for (var keyOptions in options) {
//         var valueOptions = options[keyOptions];
//         switch(keyOptions){
//             case DBM_User_Data.columns.color_data: //color point
//                 var mapColorPoint = valueOptions;
//                 var parsedColorPoint = JSON.parse(userStatusData[DBM_User_Data.columns.color_data]);
//                 for (const [key, value] of mapColorPoint.entries()) {
//                     if("level" in value){//add level
//                         parsedColorPoint[key]["level"]+=value["level"];
//                     }

//                     if("point" in value){//update color point
//                         var point = value["point"];
//                         if(point>=0&&parsedColorPoint[key]["point"]+point<Properties.limit.colorPoint){
//                             parsedColorPoint[key]["point"]+= point;
//                         } else if(point<0){
//                             parsedColorPoint[key]["point"]-=- point;
//                         } else {
//                             parsedColorPoint[key]["point"]= Properties.limit.colorPoint;
//                         }
                        
//                         if(point<0&&parsedColorPoint[key]["point"]-point<=0) parsedColorPoint[key]["point"]=0; //prevent negative
//                     }
//                 }
            
//                 arrParam.push(JSON.stringify(parsedColorPoint));
//                 querySet+=` ${DBM_User_Data.columns.color_data} = ?, `;
//                 break;
//             case DBM_User_Data.columns.series_data: //series point
//                 var mapSeriesPoint = valueOptions;
//                 var parsedSeriesPoint = JSON.parse(userStatusData[DBM_User_Data.columns.series_data]);
//                 for (const [key, value] of mapSeriesPoint.entries()) {
//                     if(value>=0&&parsedSeriesPoint[key]+value<Properties.limit.seriesPoint){
//                         parsedSeriesPoint[key]+= value;
//                     } else if(value<0){
//                         parsedSeriesPoint[key]-=- value;
//                     } else {
//                         parsedSeriesPoint[key]= Properties.limit.seriesPoint;
//                     }
                    
//                     if(value<0&&parsedSeriesPoint[key]-value<=0) parsedSeriesPoint[key]=0; //prevent negative
//                 }
            
//                 arrParam.push(JSON.stringify(parsedSeriesPoint));
//                 querySet+=` ${DBM_User_Data.columns.series_data} = ?, `;
//                 break;
//             case DBM_User_Data.columns.currency_data: //currency data
//                 var mapCurrency = valueOptions;
//                 var parsedCurrency = JSON.parse(userStatusData[DBM_User_Data.columns.currency_data]);
                
//                 for (const [key, value] of mapCurrency.entries()) {
//                     if(value>=0&&parsedCurrency[key]+value<Properties.limit[key]){
//                         parsedCurrency[key]+= value;
//                     } else if(value<0){
//                         parsedCurrency[key]-=- value;
//                     } else {
//                         parsedCurrency[key]= Properties.limit[key];
//                     }
                    
//                     if(value<0&&parsedCurrency[key]-value<=0) parsedCurrency[key]=0; //prevent negative
//                 }

//                 querySet+=` ${DBM_User_Data.columns.currency_data} = ?, `;
//                 arrParam.push(JSON.stringify(parsedCurrency));
//                 break;
//             case DBM_User_Data.columns.peace_point://booster point
//                 var curPointBoost = userStatusData[DBM_User_Data.columns.peace_point];
//                 if(valueOptions>=0&&curPointBoost+valueOptions<Properties.limit.peacePoint){
//                     curPointBoost+= valueOptions;
//                 } else if(valueOptions<0){
//                     curPointBoost-=- valueOptions;
//                 } else {
//                     curPointBoost= Properties.limit[key];
//                 }

//                 querySet+=` ${DBM_User_Data.columns.peace_point} = ?, `;
//                 arrParam.push(curPointBoost);
//                 break;
//             case DBM_User_Data.columns.daily_data://daily data
//             case DBM_User_Data.columns.token_cardspawn://card spawn token
//             case DBM_User_Data.columns.server_id_login:
//             case DBM_User_Data.columns.avatar_main_data:
//             case DBM_User_Data.columns.avatar_support_data://support avatar
//             default:
//                 querySet+=` ${keyOptions} = ?, `;
//                 arrParam.push(valueOptions);
//                 break;
        
//         }
//     }

//     querySet = querySet.replace(/,\s*$/, "");//remove last comma and space

//     arrParam.push(id_user);//push user id to arrParam
//     var query = `UPDATE ${DBM_User_Data.TABLENAME} 
//     SET ${querySet} 
//     WHERE ${DBM_User_Data.columns.id_user} = ?`;

//     await DBConn.conn.query(query, arrParam);
// }

class EventListener {
    static async printInventory(discordUser, pack, interaction, isPrivate){
        var userId = discordUser.id;
        var arrPages = []; //prepare paging embed
        
        //validation if pack exists/not
        var cardDataInventory = await DataCardInventory.getDataByPack(userId, pack);
        if(cardDataInventory==null){
            return interaction.reply(Validation.Pack.embedNotFound(discordUser));
        }

        var total = {
            normal: cardDataInventory.filter(
                function (item) {
                    return item[DBM_Card_Inventory.columns.id_user] != null;
                }
            ).length,
            gold: cardDataInventory.filter(
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

        //process first card info
        var cardInfo = new DataCardInventory(cardDataInventory[0], cardDataInventory[0]);
        var character = new Character(cardInfo.pack);
        var alterEgo = character.alter_ego;
        var color = cardInfo.color;
        var icon = character.icon;
        var iconColor = Color[color].emoji;
        var series = new Series(cardInfo.series);
        var iconSeries = series.emoji.mascot;
        var maxPack = cardInfo.packTotal;
            
        var arrFields = [];
        var idx = 0; var maxIdx = 4; var txtInventory = ``;
        for(var i=0;i<cardDataInventory.length;i++){
            var card = new DataCardInventory(cardDataInventory[i], cardDataInventory[i]);
            let id = card.id_card; let level = card.level;
            let img = card.img_url;
            let displayName = `[${GlobalFunctions.cutText(card.name,30)}](${img})`;
            let stock = card.stock;
            let rarity = card.rarity;
            let hp = card.maxHp;
            let atk = card.atk;
            let maxSp = DataCardInventory.parameter.maxSp(color);

            if(card.isHaveCard()){
                txtInventory+=`**${DataCard.emoji.rarity(rarity)}${rarity}: ${id}** ${Color[color].emoji_card}x${stock}\n`;
                // txtInventory+=`${displayName} \n\n`;
                txtInventory+=`${displayName} **Lv.${level}**\n${DataCardInventory.emoji.hp} Hp: ${hp} | ${DataCardInventory.emoji.atk} Atk: ${atk} | ${DataCardInventory.emoji.sp} Max Sp: ${maxSp}\n\n`;
            } else {
                txtInventory+=`**${DataCard.emoji.rarity(rarity)}${rarity}: ???**\n???\n\n`;
            }
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
                let embed = 
                GEmbed.builder(
                    `**Normal:** ${total.normal}/${maxPack} | **Gold:** ${total.gold}/${maxPack}\n${Color[color].emoji_card}x${total.duplicate}/${maxPack*DataCardInventory.limit.card}\n`+
                    `\n${txtInventory}`,discordUser,{
                    color:GEmbed.color[color],
                    title:`${iconSeries} ${GlobalFunctions.capitalize(character.name)}/${alterEgo} Inventory:`,
                    thumbnail:icon,
                    // fields:arrFields
                })

                arrPages.push(embed);
                arrFields = []; txtInventory="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, isPrivate);
    }

    static async printStatus(discordUser, guildId){
        var userId = discordUser.id;
        //init embed
        var arrPages = []; //prepare paging embed
    
        var userData = new DataUser(await DataUser.getData(userId));
        var userLevel = userData.getAverageColorLevel();//average color level
        var userQuest = new UserQuest(await UserQuest.getData(userId));
    
        //init the object
        var objCardInventory = {
            pink:{},
            blue:{},
            yellow:{},
            purple:{},
            red:{},
            green:{},
            white:{}
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
            var cardInventory = new DataCardInventory(cardDataInventory[i], cardDataInventory[i]);
            var color = cardInventory.color;
            var pack = cardInventory.pack;
            var packTotal = cardInventory.packTotal;
            cardInventory.addKeyVal("total_gold", cardDataInventoryGold[i].total_gold);

            //set for completion emoji
            cardInventory.addKeyVal("emoji_completion", "");
            if(cardInventory.total>=cardInventory.packTotal){
                cardInventory.getKeyVal("total_gold")>packTotal ?
                cardInventory.addKeyVal("emoji_completion", "☑️") : cardInventory.addKeyVal("emoji_completion", "✅");
            }
            objCardInventory[color][pack] = cardInventory;
        }
    
        //prepare the embed
        //avatar
        var setColor = userData.getSetColor();
        var setSeries = userData.getSetSeries();

        var seriesData = new Series(setSeries);
    
        //prepare the embed
        var txtMainStatus = dedent(`🪐 **Location:** ${seriesData.location.name}@${seriesData.name}
        ${DataUser.peacePoint.emoji} **${DataUser.peacePoint.name}:** ${userData.peace_point}/${DataUser.limit.peacePoint}
        ${Emoji.mofuheart} **Daily Card Quest:** ${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}

        **Currency:**
        ${Currency.mofucoin.emoji} **Mofucoin:** ${userData.Currency.mofucoin}/${DataUser.limit.currency.mofucoin} 
        ${Currency.jewel.emoji} **Jewel:** ${userData.Currency.jewel}/${DataUser.limit.currency.jewel}`);

        var author = GEmbed.builderUser.author(discordUser, `${discordUser.username} (Lvl.${userLevel})`);
        var objEmbed = GEmbed.builder(txtMainStatus, author, {
            title:`Main Status:`,
            color:GEmbed.color[setColor],
            thumbnail:seriesData.icon,
            fields: [
                {name: `${Color.pink.emoji}${userData.Color.canLevelUp(Color.pink.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.pink.value)}/${userData.Color.getPoint(Color.pink.value)} Pts:`,
                value: ``,inline:true},

                {name: `${Color.blue.emoji}${userData.Color.canLevelUp(Color.blue.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.blue.value)}/${userData.Color.getPoint(Color.blue.value)} Pts:`,
                value: ``,inline:true},
                
                {name: `${Color.yellow.emoji}${userData.Color.canLevelUp(Color.yellow.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.yellow.value)}/${userData.Color.getPoint(Color.yellow.value)} Pts:`,
                value: ``,inline:true},

                {name: `${Color.purple.emoji}${userData.Color.canLevelUp(Color.purple.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.purple.value)}/${userData.Color.getPoint(Color.purple.value)} Pts:`,
                value: ``,inline:true},

                {name: `${Color.red.emoji}${userData.Color.canLevelUp(Color.red.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.red.value)}/${userData.Color.getPoint(Color.red.value)} Pts:`,
                value: ``,inline:true},

                {name: `${Color.green.emoji}${userData.Color.canLevelUp(Color.green.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.green.value)}/${userData.Color.getPoint(Color.green.value)} Pts:`,
                value: ``,inline:true},

                {name: `${Color.white.emoji}${userData.Color.canLevelUp(Color.white.value) ? "🆙":""} Lvl. ${userData.Color.getLevel(Color.white.value)}/${userData.Color.getPoint(Color.white.value)} Pts:`,
                value: ``,inline:true},
            ],
            footer:{
                text:`Page 1 / 5 | Daily checked in: ${userData.hasLogin() ? `✅`:`❌`} `
            }
        });
    
        var idxColor = 0;
        for(var color in objCardInventory){
            for(var pack in objCardInventory[color]){
                var obj = objCardInventory[color][pack];
                var cardInventory = new DataCardInventory(obj,obj);
                
                objEmbed.fields[idxColor].value += 
                `${cardInventory.getKeyVal("emoji_completion")} ${GlobalFunctions.capitalize(cardInventory.pack)}: ${cardInventory.total}/${cardInventory.getPackTotal()}\n`;
            }
            idxColor++;
        }
    
        arrPages[0] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 2 : series point======
        objEmbed.title = `${Emoji.mofuheart} Status - Series Points`;
        objEmbed.description = ``;
        objEmbed.fields = [];
        objEmbed.footer = null;

        for(var key in SPack){
            let series = new Series(key);
            objEmbed.description+=
            `${series.emoji.mascot} ${userData.Series.getPoint(series.value)}/${DataUser.limit.seriesPoint} ${series.getCurrencyName()} (${series.name})\n`;
        }
        
        arrPages[1] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 3: duplicate card======
        objEmbed.title = `Status - Duplicate Card:`;
        objEmbed.description = ``;
        objEmbed.fields = [
            { name: `${Color.pink.emoji_card} Pink:`, value: ``, inline: true}, 
            { name: `${Color.blue.emoji_card} Blue:`, value: ``, inline: true},
            { name: `${Color.yellow.emoji_card} Yellow:`, value: ``, inline: true}, 
            { name: `${Color.purple.emoji_card} Purple:`, value: ``, inline: true },
            { name: `${Color.red.emoji_card} Red:`, value: ``, inline: true }, 
            { name: `${Color.green.emoji_card} Green:`, value: ``, inline: true },
            { name: `${Color.white.emoji_card} White:`, value: ``, inline: true }
        ];

        var queryDuplicate = `select cd.${DBM_Card_Data.columns.pack}, sum(inv.${DBM_Card_Inventory.columns.stock}) as total, 
        cd. ${DBM_Card_Data.columns.color}
        from ${DBM_Card_Data.TABLENAME} cd
        left join ${DBM_Card_Inventory.TABLENAME} inv
        on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and
        inv.${DBM_Card_Inventory.columns.id_user}=? and
        inv.${DBM_Card_Inventory.columns.stock}>=1
        where inv.${DBM_Card_Inventory.columns.stock}>=1 
        group by cd.${DBM_Card_Data.columns.pack}`;
    
        var cardDataInventory = await DBConn.conn.query(queryDuplicate, [discordUser.id]);
        //reassign total into duplicate total
        for(var i=0;i<cardDataInventory.length;i++){
            var pack = cardDataInventory[i][DBM_Card_Data.columns.pack];
            var color = cardDataInventory[i][DBM_Card_Data.columns.color];
            var objData = objCardInventory[color][pack];

            var cardInventory = new DataCardInventory(objData,objData);
            cardInventory.addKeyVal("total",cardDataInventory[i].total);
            objCardInventory[color][pack] = cardInventory; //reassign object
        }

        //print embed of normal card duplicate
        var idxColor = 0;
        for(var color in objCardInventory){
            for(var pack in objCardInventory[color]){
                var obj = objCardInventory[color][pack];
                var cardInventory = new DataCardInventory(obj,obj);
                
                objEmbed.fields[idxColor].value += 
                `${cardInventory.getKeyVal("emoji_completion")} ${GlobalFunctions.capitalize(cardInventory.pack)}: ${cardInventory.getKeyVal("total")}/${DataCardInventory.limit.card*3}\n`;
            }
            idxColor++;
        }
    
        arrPages[2] = new MessageEmbed(objEmbed); //add embed to pages
    
        //======page 4: gold card======
        objEmbed.title = `Status - Gold Card:`;
        objEmbed.fields = [
            { name: `${Color.pink.emoji_card} Pink:`, value: ``, inline: true}, 
            { name: `${Color.blue.emoji_card} Blue:`, value: ``, inline: true},
            { name: `${Color.yellow.emoji_card} Yellow:`, value: ``, inline: true}, 
            { name: `${Color.purple.emoji_card} Purple:`, value: ``, inline: true },
            { name: `${Color.red.emoji_card} Red:`, value: ``, inline: true }, 
            { name: `${Color.green.emoji_card} Green:`, value: ``, inline: true },
            { name: `${Color.white.emoji_card} White:`, value: ``, inline: true }
        ];
    
        //print embed of normal card duplicate
        var idxColor = 0;
        for(var color in objCardInventory){
            for(var pack in objCardInventory[color]){
                var obj = objCardInventory[color][pack];
                var cardInventory = new DataCardInventory(obj, obj);
                
                objEmbed.fields[idxColor].value += 
                `${cardInventory.getKeyVal("emoji_completion")} ${GlobalFunctions.capitalize(cardInventory.pack)}: ${cardInventory.getKeyVal("total_gold")}/${cardInventory.packTotal}\n`;
            }
            idxColor++;
        }
    
        arrPages[3] = new MessageEmbed(objEmbed); //add embed to pages

        return arrPages;
        
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

module.exports = {EventListener}
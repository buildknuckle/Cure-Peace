const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');
const DBM_Card_Tradeboard = require('../database/model/DBM_Card_Tradeboard');
const DBM_Card_Enemies = require('../database/model/DBM_Card_Enemies');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Card_Party = require('../database/model/DBM_Card_Party');

module.exports = {
    name: 'card',
    cooldown: 5,
    description: 'Contains all card categories',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        // var members = message.guild.members;
        switch(args[0]) {
            case "status":
                //show the card status
                var objEmbed ={
                    color: CardModule.Properties.embedColor,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
                };
                //get card total:
                //user parameter validator if placed
                var memberExists = true;
                if(args[1]!=null){
                    var parameterUsername = args.slice(1).join(' ');
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1})
                    .then(
                        async members=> {
                            if(members.size>=1){

                                userId = members.first().user.id;
                                objEmbed.author = {
                                    name:members.first().user.username,
                                    icon_url:members.first().user.avatarURL()
                                }
                                
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                }

                if(!memberExists){
                    return message.channel.send("Sorry, I can't find that username.");
                }

                var query = `select cd.${DBM_Card_Data.columns.pack}, count(inv.${DBM_Card_Inventory.columns.id_user}) as total
                from ${DBM_Card_Data.TABLENAME} cd
                left join ${DBM_Card_Inventory.TABLENAME} inv 
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                inv.${DBM_Card_Inventory.columns.id_user}=? 
                group by cd.${DBM_Card_Data.columns.pack}`;

                var queryGold = `select cd.${DBM_Card_Data.columns.pack}, count(inv.${DBM_Card_Inventory.columns.id_user}) as total_gold  
                from ${DBM_Card_Data.TABLENAME} cd
                left join ${DBM_Card_Inventory.TABLENAME} inv 
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                inv.${DBM_Card_Inventory.columns.id_user}=? and inv.${DBM_Card_Inventory.columns.is_gold}=1 
                group by cd.${DBM_Card_Data.columns.pack}`;

                var arrParameterized = [userId];
                var arrCardTotal = {}; var arrCardIconCompletion = {};
                var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                var cardDataInventoryGold = await DBConn.conn.promise().query(queryGold, arrParameterized);
                for(var i=0;i<cardDataInventory[0].length;i++){
                    arrCardIconCompletion[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = ``;//set default
                    if(cardDataInventory[0][i]['total']>=CardModule.Properties.dataCardCore[cardDataInventory[0][i][DBM_Card_Data.columns.pack]].total){
                        arrCardIconCompletion[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = "✅ ";
                        if(cardDataInventoryGold[0][i]['total_gold']>=CardModule.Properties.dataCardCore[cardDataInventory[0][i][DBM_Card_Data.columns.pack]].total){
                            arrCardIconCompletion[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = "☑️ ";
                        }
                    } 
                    
                    arrCardTotal[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = cardDataInventory[0][i]['total'];
                }

                var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                clvl = await CardModule.getAverageLevel(userId,[
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_green],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_red],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_white],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]
                ]);

                //prepare the embed
                var avatarId = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                    avatarId = cardUserStatusData[DBM_Card_User_Data.columns.card_id_selected];
                }

                // objEmbed.title = `Card Status | cLvl: ${clvl} | Color: ${cardUserStatusData[DBM_Card_User_Data.columns.color]} | Avatar: ${avatarId} `;
                // objEmbed.title = `cLvl:${clvl}  `;
                var currentSE = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.buffData){
                    currentSE = `⬆️${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name} [${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}]`;
                } else if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.debuffData){
                    currentSE = `⬇️${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name} [${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}]`;
                }

                //check if in party/not
                var txtInParty = ""; var arrPages = [];
                var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                if(partyData!=null){
                    txtInParty = ":busts_in_silhouette: In Party\n";
                }

                var assignedSeries = cardUserStatusData[DBM_Card_User_Data.columns.series_set];
                assignedSeries = CardModule.Properties.seriesCardCore[assignedSeries].pack;

                objEmbed.description = `${txtInParty}**aCLvl:** ${clvl} | **Assigned Set:** ${cardUserStatusData[DBM_Card_User_Data.columns.color]}/${assignedSeries} | **Cure Avatar:** ${avatarId} \n**MofuCoin:** ${cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]}/${CardModule.Properties.limit.mofucoin}\n**Special Point:** ${cardUserStatusData[DBM_Card_User_Data.columns.special_point]}%\n**Status Effect:** ${currentSE}`;

                objEmbed.fields = [{
                        name: `Pink(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_pink]} CP):`,
                        value: `${arrCardIconCompletion.nagisa}Nagisa: ${arrCardTotal.nagisa}/${CardModule.Properties.dataCardCore.nagisa.total}\n${arrCardIconCompletion.saki}Saki: ${arrCardTotal.saki}/${CardModule.Properties.dataCardCore.saki.total}\n${arrCardIconCompletion.nozomi}Nozomi: ${arrCardTotal.nozomi}/${CardModule.Properties.dataCardCore.nozomi.total}\n${arrCardIconCompletion.love}Love: ${arrCardTotal.love}/${CardModule.Properties.dataCardCore.love.total}\n${arrCardIconCompletion.tsubomi}Tsubomi: ${arrCardTotal.tsubomi}/${CardModule.Properties.dataCardCore.tsubomi.total}\n${arrCardIconCompletion.hibiki}Hibiki: ${arrCardTotal.hibiki}/${CardModule.Properties.dataCardCore.hibiki.total}\n${arrCardIconCompletion.miyuki}Miyuki: ${arrCardTotal.miyuki}/${CardModule.Properties.dataCardCore.miyuki.total}\n${arrCardIconCompletion.mana}Mana: ${arrCardTotal.mana}/${CardModule.Properties.dataCardCore.mana.total}\n${arrCardIconCompletion.megumi}Megumi: ${arrCardTotal.megumi}/${CardModule.Properties.dataCardCore.megumi.total}\n${arrCardIconCompletion.haruka}Haruka: ${arrCardTotal.haruka}/${CardModule.Properties.dataCardCore.haruka.total}\n${arrCardIconCompletion.mirai}Mirai: ${arrCardTotal.mirai}/${CardModule.Properties.dataCardCore.mirai.total}\n${arrCardIconCompletion.ichika}Ichika: ${arrCardTotal.ichika}/${CardModule.Properties.dataCardCore.ichika.total}\n${arrCardIconCompletion.hana}Hana: ${arrCardTotal.hana}/${CardModule.Properties.dataCardCore.hana.total}\n${arrCardIconCompletion.hikaru}Hikaru: ${arrCardTotal.hikaru}/${CardModule.Properties.dataCardCore.hikaru.total}\n${arrCardIconCompletion.nodoka}Nodoka: ${arrCardTotal.nodoka}/${CardModule.Properties.dataCardCore.nodoka.total}`,
                        inline: true
                    },
                    {
                        name: `Blue(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_blue]} CP):`,
                        value: `${arrCardIconCompletion.karen}Karen: ${arrCardTotal.karen}/${CardModule.Properties.dataCardCore.karen.total}\n${arrCardIconCompletion.miki}Miki: ${arrCardTotal.miki}/${CardModule.Properties.dataCardCore.miki.total}\n${arrCardIconCompletion.erika}Erika: ${arrCardTotal.erika}/${CardModule.Properties.dataCardCore.erika.total}\n${arrCardIconCompletion.ellen}Ellen: ${arrCardTotal.ellen}/${CardModule.Properties.dataCardCore.ellen.total}\n${arrCardIconCompletion.reika}Reika: ${arrCardTotal.reika}/${CardModule.Properties.dataCardCore.reika.total}\n${arrCardIconCompletion.rikka}Rikka: ${arrCardTotal.rikka}/${CardModule.Properties.dataCardCore.rikka.total}\n${arrCardIconCompletion.hime}Hime: ${arrCardTotal.hime}/${CardModule.Properties.dataCardCore.hime.total}\n${arrCardIconCompletion.minami}Minami: ${arrCardTotal.minami}/${CardModule.Properties.dataCardCore.minami.total}\n${arrCardIconCompletion.aoi}Aoi: ${arrCardTotal.aoi}/${CardModule.Properties.dataCardCore.aoi.total}\n${arrCardIconCompletion.saaya}Saaya: ${arrCardTotal.saaya}/${CardModule.Properties.dataCardCore.saaya.total}\n${arrCardIconCompletion.yuni}Yuni: ${arrCardTotal.yuni}/${CardModule.Properties.dataCardCore.yuni.total}\n${arrCardIconCompletion.chiyu}Chiyu: ${arrCardTotal.chiyu}/${CardModule.Properties.dataCardCore.chiyu.total}`,
                        inline: true
                    },
                    {
                        name: `Yellow(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_yellow]} CP):`,
                        value: `${arrCardIconCompletion.hikari}Hikari: ${arrCardTotal.hikari}/${CardModule.Properties.dataCardCore.hikari.total}\n${arrCardIconCompletion.urara}Urara: ${arrCardTotal.urara}/${CardModule.Properties.dataCardCore.urara.total}\n${arrCardIconCompletion.inori}Inori: ${arrCardTotal.inori}/${CardModule.Properties.dataCardCore.inori.total}\n${arrCardIconCompletion.itsuki}Itsuki: ${arrCardTotal.itsuki}/${CardModule.Properties.dataCardCore.itsuki.total}\n${arrCardIconCompletion.ako}Ako: ${arrCardTotal.ako}/${CardModule.Properties.dataCardCore.ako.total}\n${arrCardIconCompletion.yayoi}Yayoi: ${arrCardTotal.yayoi}/${CardModule.Properties.dataCardCore.yayoi.total}\n${arrCardIconCompletion.alice}Alice: ${arrCardTotal.alice}/${CardModule.Properties.dataCardCore.alice.total}\n${arrCardIconCompletion.yuko}Yuko: ${arrCardTotal.yuko}/${CardModule.Properties.dataCardCore.yuko.total}\n${arrCardIconCompletion.kirara}Kirara: ${arrCardTotal.kirara}/${CardModule.Properties.dataCardCore.kirara.total}\n${arrCardIconCompletion.himari}Himari: ${arrCardTotal.himari}/${CardModule.Properties.dataCardCore.himari.total}\n${arrCardIconCompletion.homare}Homare: ${arrCardTotal.homare}/${CardModule.Properties.dataCardCore.homare.total}\n${arrCardIconCompletion.elena}Elena: ${arrCardTotal.elena}/${CardModule.Properties.dataCardCore.elena.total}\n${arrCardIconCompletion.hinata}Hinata: ${arrCardTotal.hinata}/${CardModule.Properties.dataCardCore.hinata.total}`,
                        inline: true
                    },
                    {
                        name: `Purple(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_purple]} CP):`,
                        value: `${arrCardIconCompletion.yuri}Yuri: ${arrCardTotal.yuri}/${CardModule.Properties.dataCardCore.yuri.total}\n${arrCardIconCompletion.makoto}Makoto: ${arrCardTotal.makoto}/${CardModule.Properties.dataCardCore.makoto.total}\n${arrCardIconCompletion.iona}Iona: ${arrCardTotal.iona}/${CardModule.Properties.dataCardCore.iona.total}\n${arrCardIconCompletion.riko}Riko: ${arrCardTotal.riko}/${CardModule.Properties.dataCardCore.riko.total}\n${arrCardIconCompletion.yukari}Yukari: ${arrCardTotal.yukari}/${CardModule.Properties.dataCardCore.yukari.total}\n${arrCardIconCompletion.ruru}Ruru: ${arrCardTotal.ruru}/${CardModule.Properties.dataCardCore.ruru.total}\n${arrCardIconCompletion.madoka}Madoka: ${arrCardTotal.madoka}/${CardModule.Properties.dataCardCore.madoka.total}\n${arrCardIconCompletion.kurumi}Kurumi: ${arrCardTotal.kurumi}/${CardModule.Properties.dataCardCore.kurumi.total}`,
                        inline: true
                    },
                    {
                        name: `Red(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_red]} CP):`,
                        value: `${arrCardIconCompletion.rin}Rin: ${arrCardTotal.rin}/${CardModule.Properties.dataCardCore.rin.total}\n${arrCardIconCompletion.setsuna}Setsuna: ${arrCardTotal.setsuna}/${CardModule.Properties.dataCardCore.setsuna.total}\n${arrCardIconCompletion.akane}Akane: ${arrCardTotal.akane}/${CardModule.Properties.dataCardCore.akane.total}\n${arrCardIconCompletion.aguri}Aguri: ${arrCardTotal.aguri}/${CardModule.Properties.dataCardCore.aguri.total}\n${arrCardIconCompletion.towa}Towa: ${arrCardTotal.towa}/${CardModule.Properties.dataCardCore.towa.total}\n${arrCardIconCompletion.akira}Akira: ${arrCardTotal.akira}/${CardModule.Properties.dataCardCore.akira.total}\n${arrCardIconCompletion.emiru}Emiru: ${arrCardTotal.emiru}/${CardModule.Properties.dataCardCore.emiru.total}`,
                        inline: true
                    },
                    {
                        name: `Green(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_green]} CP):`,
                        value: `${arrCardIconCompletion.komachi}Komachi: ${arrCardTotal.komachi}/${CardModule.Properties.dataCardCore.komachi.total}\n${arrCardIconCompletion.nao}Nao: ${arrCardTotal.nao}/${CardModule.Properties.dataCardCore.nao.total}\n${arrCardIconCompletion.kotoha}Kotoha: ${arrCardTotal.kotoha}/${CardModule.Properties.dataCardCore.kotoha.total}\n${arrCardIconCompletion.ciel}Ciel: ${arrCardTotal.ciel}/${CardModule.Properties.dataCardCore.ciel.total}\n${arrCardIconCompletion.lala}Lala: ${arrCardTotal.lala}/${CardModule.Properties.dataCardCore.lala.total}`,
                        inline: true
                    },
                    {
                        name: `White(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_white]} CP):`,
                        value: `${arrCardIconCompletion.honoka}Honoka: ${arrCardTotal.honoka}/${CardModule.Properties.dataCardCore.honoka.total}\n${arrCardIconCompletion.mai}Mai: ${arrCardTotal.mai}/${CardModule.Properties.dataCardCore.mai.total}\n${arrCardIconCompletion.kanade}Kanade: ${arrCardTotal.kanade}/${CardModule.Properties.dataCardCore.kanade.total}`,
                        inline: true
                    }
                ];

                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                arrPages[0] = msgEmbed;

                //page 2
                objEmbed.fields = [
                    {
                        name:"Series Points:",
                        value:`SP001: ${cardUserStatusData[DBM_Card_User_Data.columns.sp001]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp001.currency} (${CardModule.Properties.seriesCardCore.sp001.pack})\nSP002: ${cardUserStatusData[DBM_Card_User_Data.columns.sp002]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp002.currency} (${CardModule.Properties.seriesCardCore.sp002.pack})\nSP003: ${cardUserStatusData[DBM_Card_User_Data.columns.sp003]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp003.currency} (${CardModule.Properties.seriesCardCore.sp003.pack})\nSP004: ${cardUserStatusData[DBM_Card_User_Data.columns.sp004]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp004.currency} (${CardModule.Properties.seriesCardCore.sp004.pack})\nSP005: ${cardUserStatusData[DBM_Card_User_Data.columns.sp005]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp005.currency} (${CardModule.Properties.seriesCardCore.sp005.pack})\nSP006: ${cardUserStatusData[DBM_Card_User_Data.columns.sp006]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp006.currency} (${CardModule.Properties.seriesCardCore.sp006.pack})\nSP007: ${cardUserStatusData[DBM_Card_User_Data.columns.sp007]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp007.currency} (${CardModule.Properties.seriesCardCore.sp007.pack})\nSP008: ${cardUserStatusData[DBM_Card_User_Data.columns.sp008]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp008.currency} (${CardModule.Properties.seriesCardCore.sp008.pack})\nSP009: ${cardUserStatusData[DBM_Card_User_Data.columns.sp009]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp009.currency} (${CardModule.Properties.seriesCardCore.sp009.pack})\nSP010: ${cardUserStatusData[DBM_Card_User_Data.columns.sp010]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp010.currency} (${CardModule.Properties.seriesCardCore.sp010.pack})\nSP011: ${cardUserStatusData[DBM_Card_User_Data.columns.sp011]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp011.currency} (${CardModule.Properties.seriesCardCore.sp011.pack})\nSP012: ${cardUserStatusData[DBM_Card_User_Data.columns.sp012]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp012.currency} (${CardModule.Properties.seriesCardCore.sp012.pack})\nSP013: ${cardUserStatusData[DBM_Card_User_Data.columns.sp013]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp013.currency} (${CardModule.Properties.seriesCardCore.sp013.pack})\nSP014: ${cardUserStatusData[DBM_Card_User_Data.columns.sp014]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp014.currency} (${CardModule.Properties.seriesCardCore.sp014.pack})\nSP015: ${cardUserStatusData[DBM_Card_User_Data.columns.sp015]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp015.currency} (${CardModule.Properties.seriesCardCore.sp015.pack})`
                    },
                    {
                        name:"Color Buff:",
                        value:`**Pink:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]))}% Catch Rate\n**Blue:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]))}% Catch Rate\n**Yellow:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]))}% Catch Rate\n**Purple:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]))}% Catch Rate\n**Red:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]))}% Catch Rate\n**Green:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]))}% Catch Rate\n**White:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]))}% Catch Rate`
                    }
                ]
                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                arrPages[1] = msgEmbed;

                //page 3
                //init all arrCardTotal
                var queryInitList = `select cd.${DBM_Card_Data.columns.pack} 
                from ${DBM_Card_Data.TABLENAME} cd 
                group by cd.${DBM_Card_Data.columns.pack}`;
                var arrCardTotal = {};
                var cardDataInventory = await DBConn.conn.promise().query(queryInitList);

                for(var i=0;i<cardDataInventory[0].length;i++){
                    arrCardTotal[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = "0";
                }

                var queryDuplicate = `select cd.${DBM_Card_Data.columns.pack},count(inv.${DBM_Card_Inventory.columns.stock}) as total 
                from ${DBM_Card_Data.TABLENAME} cd
                left join ${DBM_Card_Inventory.TABLENAME} inv
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and
                inv.${DBM_Card_Inventory.columns.id_user}=? and
                inv.${DBM_Card_Inventory.columns.stock}>=1
                where inv.${DBM_Card_Inventory.columns.stock}>=1 
                group by cd.${DBM_Card_Data.columns.pack}`;
                var arrParameterized = [userId];
                // var arrCardTotal = {};
                var cardDataInventory = await DBConn.conn.promise().query(queryDuplicate, arrParameterized);

                for(var i=0;i<cardDataInventory[0].length;i++){
                    arrCardTotal[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = cardDataInventory[0][i]['total'];
                }

                objEmbed.fields = [{
                        name: `Pink Duplicate:`,
                        value: `Nagisa: ${arrCardTotal.nagisa}\nSaki: ${arrCardTotal.saki}\nNozomi: ${arrCardTotal.nozomi}\nLove: ${arrCardTotal.love}\nTsubomi: ${arrCardTotal.tsubomi}\nHibiki: ${arrCardTotal.hibiki}\nMiyuki: ${arrCardTotal.miyuki}\nMana: ${arrCardTotal.mana}\nMegumi: ${arrCardTotal.megumi}\nHaruka: ${arrCardTotal.haruka}\nMirai: ${arrCardTotal.mirai}\nIchika: ${arrCardTotal.ichika}\nHana: ${arrCardTotal.hana}\nHikaru: ${arrCardTotal.hikaru}\nNodoka: ${arrCardTotal.nodoka}`,
                        inline: true
                    },
                    {
                        name: `Blue Duplicate:`,
                        value: `Karen: ${arrCardTotal.karen}\nMiki: ${arrCardTotal.miki}\nErika: ${arrCardTotal.erika}\nEllen: ${arrCardTotal.ellen}\nReika: ${arrCardTotal.reika}\nRikka: ${arrCardTotal.rikka}\nHime: ${arrCardTotal.hime}\nMinami: ${arrCardTotal.minami}\nAoi: ${arrCardTotal.aoi}\nSaaya: ${arrCardTotal.saaya}\nYuni: ${arrCardTotal.yuni}\nChiyu: ${arrCardTotal.chiyu}`,
                        inline: true
                    },
                    {
                        name: `Yellow Duplicate:`,
                        value: `Hikari: ${arrCardTotal.hikari}\nUrara: ${arrCardTotal.urara}\nInori: ${arrCardTotal.inori}\nItsuki: ${arrCardTotal.itsuki}\nAko: ${arrCardTotal.ako}\nYayoi: ${arrCardTotal.yayoi}\nAlice: ${arrCardTotal.alice}\nYuko: ${arrCardTotal.yuko}\nKirara: ${arrCardTotal.kirara}\nHimari: ${arrCardTotal.himari}\nHomare: ${arrCardTotal.homare}\nElena: ${arrCardTotal.elena}\nHinata: ${arrCardTotal.hinata}`,
                        inline: true
                    },
                    {
                        name: `Purple Duplicate:`,
                        value: `Yuri: ${arrCardTotal.yuri}\nMakoto: ${arrCardTotal.makoto}\nIona: ${arrCardTotal.iona}\nRiko: ${arrCardTotal.riko}\nYukari: ${arrCardTotal.yukari}\nRuru: ${arrCardTotal.ruru}\nMadoka: ${arrCardTotal.madoka}\nKurumi: ${arrCardTotal.kurumi}`,
                        inline: true
                    },
                    {
                        name: `Red Duplicate:`,
                        value: `Rin: ${arrCardTotal.rin}\nSetsuna: ${arrCardTotal.setsuna}\nAkane: ${arrCardTotal.akane}\nAguri: ${arrCardTotal.aguri}\nTowa: ${arrCardTotal.towa}\nAkira: ${arrCardTotal.akira}\nEmiru: ${arrCardTotal.emiru}`,
                        inline: true
                    },
                    {
                        name: `Green Duplicate:`,
                        value: `Komachi: ${arrCardTotal.komachi}\nNao: ${arrCardTotal.nao}\nKotoha: ${arrCardTotal.kotoha}\nCiel: ${arrCardTotal.ciel}\nLala: ${arrCardTotal.lala}`,
                        inline: true
                    },
                    {
                        name: `White Duplicate:`,
                        value: `Honoka: ${arrCardTotal.honoka}\nMai: ${arrCardTotal.mai}\nKanade: ${arrCardTotal.kanade}`,
                        inline: true
                    }
                ];

                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                arrPages[2] = msgEmbed;
                
                pages = arrPages;
                paginationEmbed(message,pages);

                // message.channel.send({embed:objEmbed});
                
                break;
            case "inventory":
                var pack = args[1];
                if(pack!=null){
                    pack = pack.toLowerCase();
                }
                //get the first mentionable user:
                //console.log(message.mentions.users.first());

                //check if user is available
                //check if user available/not
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };

                //card pack validator
                if(pack==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the card pack that you want to see.";
                    return message.channel.send({embed:objEmbed});
                } else if(!CardModule.Properties.dataCardCore.hasOwnProperty(pack.toLowerCase())){
                    return message.channel.send({
                        content:"Sorry, I cannot find that card pack. Here are the list of all available card pack:",
                        embed:CardModule.embedCardPackList});
                }

                //user parameter validator
                var memberExists = true;
                if(args[2]!=null){
                    var parameterUsername = args.slice(2).join(' ');
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
                    .then(
                        members=> {
                            if(members.size>=1){
                                userId = members.first().user.id;
                                userUsername = members.first().user.username;
                                userAvatarUrl = members.first().user.avatarURL();
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                }

                if(!memberExists){
                    return message.channel.send("Sorry, I can't find that username.");
                }

                //end user parameter validator
                objEmbed.title = `${GlobalFunctions.capitalize(pack)}/${CardModule.Properties.dataCardCore[pack].alter_ego} Pack:`;
                objEmbed.author = {
                    name: userUsername,
                    icon_url: userAvatarUrl
                }

                var cardList = "";
                var query = `select cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.color}, 
                cd.${DBM_Card_Data.columns.series},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.name}, 
                cd.${DBM_Card_Data.columns.img_url},inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.level}, 
                inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.is_gold} 
                from ${DBM_Card_Data.TABLENAME} cd 
                left join ${DBM_Card_Inventory.TABLENAME} inv 
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                inv.${DBM_Card_Inventory.columns.id_user}=? 
                where cd.pack = ?`;
                var arrParameterized = [userId,pack];
                
                var arrPages = [];
                var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                var totalGold = 0;
                // var cardDataInventory = await CardModule.getAllCardDataByPack(pack);
                var progressTotal = 0; var ctr = 0; var maxCtr = 3; var pointerMaxData = cardDataInventory[0].length;
                cardDataInventory[0].forEach(function(entry){
                    var icon = "❌";
                    //checkmark if card is owned
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        icon = "✅"; progressTotal++;
                        if(entry[DBM_Card_Inventory.columns.is_gold]==1){
                            icon = "☑️"; totalGold+=1;
                        }
                    }
                   
                    cardList+=`[${icon} ${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})`;
                    if(entry[DBM_Card_Inventory.columns.stock]>=1){
                        cardList+=` x${entry[DBM_Card_Inventory.columns.stock]}`;
                    }
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        cardList+=` Lv.${entry[DBM_Card_Inventory.columns.level]}`;
                    }
                    cardList+="\n";

                    objEmbed.thumbnail = {
                        url:CardModule.Properties.dataCardCore[pack].icon
                    };
                    objEmbed.color = CardModule.Properties.dataColorCore[entry[DBM_Card_Data.columns.color]].color;
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            // name: `Progress: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total}`,
                            value: cardList,
                        }];
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        cardList = ""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });

                for(var i=0;i<arrPages.length;i++){
                    arrPages[i].fields[0]['name'] = `Normal: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total} | Gold: ${totalGold}/${CardModule.Properties.dataCardCore[pack].total}`;
                }
                
                // message.channel.send({embed:objEmbed});
                pages = arrPages;

                paginationEmbed(message,pages);
                break;
            case "duplicate":
                var pack = args[1];
                if(pack!=null){
                    pack = pack.toLowerCase();
                }
                
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };

                var listAll = false;
                //card pack validator
                if(pack==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Please enter the card pack that you want to see/"all" to list all of the card.`;
                    return message.channel.send({embed:objEmbed});
                } else if(pack=="all"){
                    listAll = true;
                } else if(pack!="all"&&!CardModule.Properties.dataCardCore.hasOwnProperty(pack.toLowerCase())){
                    return message.channel.send({
                        content:"Sorry, I cannot find that card pack. Here are the list of all available card pack:",
                        embed:CardModule.embedCardPackList});
                }

                //user parameter validator
                var memberExists = true;
                if(args[2]!=null){
                    var parameterUsername = args.slice(2).join(' ');
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
                    .then(
                        members=> {
                            if(members.size>=1){
                                userId = members.first().user.id;
                                userUsername = members.first().user.username;
                                userAvatarUrl = members.first().user.avatarURL();
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                }

                if(!memberExists){
                    return message.channel.send("Sorry, I can't find that username.");
                }

                //end user parameter validator

                var arrPages = []; var query = ""; var cardList = "";
                objEmbed.author = {
                    name: userUsername,
                    icon_url: userAvatarUrl
                }
                
                if(!listAll){
                    objEmbed.title = `${GlobalFunctions.capitalize(pack)}/${GlobalFunctions.capitalize(CardModule.Properties.dataCardCore[pack].alter_ego)} Card Pack:`;
    
                    query = `select cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.color}, 
                    cd.${DBM_Card_Data.columns.series},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.name}, 
                    cd.${DBM_Card_Data.columns.img_url},inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.level}, 
                    inv.${DBM_Card_Inventory.columns.stock} 
                    from ${DBM_Card_Data.TABLENAME} cd 
                    left join ${DBM_Card_Inventory.TABLENAME} inv 
                    on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                    inv.${DBM_Card_Inventory.columns.id_user}=? and 
                    inv.${DBM_Card_Inventory.columns.stock}>=1 
                    where cd.pack = ? and 
                    inv.${DBM_Card_Inventory.columns.stock}>=1`;
                    var arrParameterized = [userId,pack];
                } else {
                    objEmbed.title = `All Pack Card:`;

                    query = `select cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.color}, 
                    cd.${DBM_Card_Data.columns.series},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.name}, 
                    cd.${DBM_Card_Data.columns.img_url},inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.level}, 
                    inv.${DBM_Card_Inventory.columns.stock} 
                    from ${DBM_Card_Data.TABLENAME} cd 
                    left join ${DBM_Card_Inventory.TABLENAME} inv 
                    on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                    inv.${DBM_Card_Inventory.columns.id_user}=? and 
                    inv.${DBM_Card_Inventory.columns.stock}>=1 
                    where inv.${DBM_Card_Inventory.columns.stock}>=1`;
                    var arrParameterized = [userId];
                }

                var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 0; var maxCtr = 3; var pointerMaxData = cardDataInventory[0].length;
                cardDataInventory[0].forEach(function(entry){
                    cardList+=`[${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})`;
                    if(entry[DBM_Card_Inventory.columns.stock]>=1){
                        cardList+=` x${entry[DBM_Card_Inventory.columns.stock]}`;
                    }
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        cardList+=` Lv.${entry[DBM_Card_Inventory.columns.level]}`;
                    }
                    cardList+="\n";

                    if(!listAll){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.dataCardCore[pack].icon
                        };
                        objEmbed.color = CardModule.Properties.dataColorCore[entry[DBM_Card_Data.columns.color]].color;
                    }
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            value: cardList,
                        }];
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        cardList = ""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });

                if(arrPages.length<=0){
                    if(!listAll){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.dataCardCore[pack].icon
                        };
                    }
                    
                    objEmbed.fields = [{
                        name: "Duplicate card list:",
                        value: "No duplicate cards available.",
                    }];
                    var msgEmbed = new Discord.MessageEmbed(objEmbed);
                    arrPages.push(msgEmbed);
                } else {
                    for(var i=0;i<arrPages.length;i++){
                        arrPages[i].fields[0]['name'] = `Duplicate card list:`;
                    }
                }
                
                paginationEmbed(message,arrPages);

                break;
            case "catch":
            case "capture":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }

                //get the series
                userData.series = CardModule.Properties.seriesCardCore[userCardData[DBM_Card_User_Data.columns.series_set]].pack;

                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    id:guildSpawnData[DBM_Card_Guild.columns.spawn_id],
                    color:guildSpawnData[DBM_Card_Guild.columns.spawn_color],
                    data:guildSpawnData[DBM_Card_Guild.columns.spawn_data]
                }

                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.cardcaplock.value){
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    return message.channel.send({embed:embedStatusEffectActivated})
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                spawnedCardData.token==null||
                (spawnedCardData.type=="normal"&&spawnedCardData.id==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no Precure cards spawning right now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you've already used the capture command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                }

                //reward & validator
                switch(spawnedCardData.type){
                    case "quiz":
                        //check if card spawn is quiz
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current card spawn type is **quiz**. You need to use: **p!card answer <a/b/c/d>** to guess the answer and capture the card.";
                        return message.channel.send({embed:objEmbed});
                    case "number":
                        //check if card spawn is number
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current card spawn type is **number**. You need to use: **p!card guess <lower/higher>** to guess the next hidden number and capture the card.";
                        return message.channel.send({embed:objEmbed});
                    case "battle":
                            //check if card spawn is number
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = ":x: Tsunagarus are still wandering around! You need to use: **p!card battle** to participate in battle!";
                            return message.channel.send({embed:objEmbed});
                    case "color": //color card spawn
                        var query = `SELECT * 
                        FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.color}=? AND 
                        ${DBM_Card_Data.columns.rarity}<=? 
                        ORDER BY rand() 
                        LIMIT 1`;
                        var resultData = await DBConn.conn.promise().query(query,[userData.color,3]);
                        spawnedCardData.id = resultData[0][0][DBM_Card_Data.columns.id_card];
                        spawnedCardData.color = userData.color;
                        //debugging purpose:
                        // spawnedCardData.id = "yuko303";
                        // spawnedCardData.color = "purple";
                        break;
                    case "series":
                        var query = `SELECT * 
                        FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.series}=? AND 
                        ${DBM_Card_Data.columns.rarity}<=? 
                        ORDER BY rand() 
                        LIMIT 1`;
                        var resultData = await DBConn.conn.promise().query(query,[userData.series,3]);
                        spawnedCardData.id = resultData[0][0][DBM_Card_Data.columns.id_card];
                        spawnedCardData.color = userData.color;
                    default:
                        break;
                }

                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];
                spawnedCardData.series = cardSpawnData[DBM_Card_Data.columns.series];
                var msgContent = "";

                //RNG: calculate catch attempt
                var captured = false;
                var chance = parseInt(cardSpawnData[DBM_Card_Data.columns.rarity])*10;//the minimum chance
                var rngCatch = GlobalFunctions.randomNumber(0,100);//rng point
                var bonusCatch = 
                CardModule.getBonusCatchAttempt(parseInt(userCardData[`color_level_${spawnedCardData.color}`]));

                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                if(currentStatusEffect in CardModule.StatusEffect.buffData){
                    //check for user buff capture boost from status effect
                    if(currentStatusEffect.includes(`${spawnedCardData.color}_coloraura`)){
                        if("value_capture_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                            rngCatch+=CardModule.StatusEffect.buffData[currentStatusEffect].value_capture_boost;
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});
                        }

                        if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                            if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            }
                        }
                    } else if(currentStatusEffect.includes('rainbow_coloraura')){
                        if("value_capture_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                            rngCatch+=CardModule.StatusEffect.buffData[currentStatusEffect].value_capture_boost;
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});
                        }

                        if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                            if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            }
                        }
                    }

                    
                } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                    //check for user capture rate debuff from status effect
                    if("value_capture_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                        rngCatch-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_capture_down;
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");

                        await message.channel.send({embed:embedStatusActivated});

                        if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                            if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            }
                        }
                    }
                }
                
                switch(spawnedCardData.type){
                    case "color":
                        //bonus +10% catch rate
                        if(rngCatch+bonusCatch+10>=chance){
                            captured = true;
                        }
                        break;
                    default://normal card spawn
                        if(rngCatch+bonusCatch>=chance){
                            captured = true;
                        }
                        break;
                }

                var duplicate = true;
                //get & put card data into embed
                if(captured){
                    //check for duplicates
                    var itemStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                    var pointReward = 3;//default point reward
                    //insert new card
                    if(itemStock<=-1){//non duplicate
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        msgContent = `Nice catch! **${userUsername}** has captured: **${cardSpawnData[DBM_Card_Data.columns.name]}** & has received **${pointReward} ${spawnedCardData.color}** color points.`;

                        duplicate = false;
                    } else {//duplicate
                        pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                        if(itemStock<CardModule.Properties.maximumCard){//add new stock card
                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                            msgContent = `**${userUsername}** has received another copy of : **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}** & **${pointReward} ${spawnedCardData.color}** color points.`;
                            itemStock+=1;
                        } else {
                            //cannot add more card
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.author = {
                                name:userUsername,
                                iconURL:userAvatarUrl
                            }
                            objEmbed.description = `:x: Sorry **${userUsername}**, you cannot have another copy of **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${pointReward} ${spawnedCardData.color}** color points.`;
                            //update the token & color point
                            var objColor = new Map();
                            objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                            await CardModule.updateCatchAttempt(userId,
                                spawnedCardData.token,
                                objColor
                            );

                            return message.channel.send({embed:objEmbed});

                        }
                    }

                    //update the catch token & color points
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );

                    //get the current card total
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);

                    if(duplicate){
                        await message.channel.send({
                            content:msgContent
                        });
                    } else {
                        //update the guild spawn data/token
                        switch(spawnedCardData.type){
                            case "color":
                                break;
                            default://normal card spawn, erase the card guild spawn
                                if(spawnedCardData.data==null){
                                    await CardModule.removeCardGuildSpawn(guildId);
                                } else {
                                    await CardModule.removeCardGuildSpawn(guildId,false,true,false);
                                }
                                break;
                        }
                        
                        await message.channel.send({
                            content:msgContent,
                            embed:CardModule.embedCardCapture(cardSpawnData[DBM_Card_Data.columns.color],cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_atk],itemStock)
                        });
                    }
                    
                    //check card pack completion:
                    var embedCompletion = null;
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                    if(checkCardCompletionPack){
                        //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null){
                            return message.channel.send({embed:embedCompletion});
                        }
                    }
                    
                    if(checkCardCompletionColor) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                        if(embedCompletion!=null){
                            return message.channel.send({embed:embedCompletion});
                        }
                    }
                    
                    if(checkCardCompletionSeries) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                        if(embedCompletion!=null){
                            return message.channel.send({embed:embedCompletion});
                        }
                    }

                } else {
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }

                    var cpReward = cardSpawnData[DBM_Card_Data.columns.rarity];

                    //update the color point
                    var objColor = new Map();
                    objColor.set(`color_point_${cardSpawnData[DBM_Card_Data.columns.color]}`,cpReward);
                    CardModule.updateColorPoint(userId,objColor);

                    objEmbed.description = `:x: Sorry <@${userId}>, you failed to catch the card this time. As a bonus you have received **${cpReward} ${cardSpawnData[DBM_Card_Data.columns.color]}** color points.`;

                    await message.channel.send({embed:objEmbed});

                    //get status effect
                    switch(currentStatusEffect){
                        case CardModule.StatusEffect.buffData.second_chance.value:
                            //check if second chance/not
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});
                            break;
                        default:
                            //update the catch token
                            await CardModule.updateCatchAttempt(userId,
                                spawnedCardData.token
                            );
                            break;
                    }

                }
                
                break;
            case "detail":
                //get/view the card detail
                var cardId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor
                }
                if(cardId==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the card ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //check if card ID exists/not
                var cardData = await CardModule.getCardData(cardId);

                if(cardData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that card ID.";

                    return message.channel.send({embed:objEmbed});
                }

                //check if user have card/not
                var itemStock = await CardModule.getUserCardStock(userId,cardId);
                if(itemStock<=-1){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                    return message.channel.send({embed:objEmbed});
                }


                //get card user inventory data to get the received date data
                var userInventoryData = await CardModule.getUserCardInventoryData(userId,cardId);

                var type = CardModule.Properties.cardCategory.normal.value;
                // if(userInventoryData[DBM_Card_Inventory.columns.is_gold]){
                //     type = CardModule.Properties.cardCategory.gold.value;
                // }

                if(args[2]!=null){
                    var cardCategory = args[2];
                    if(cardCategory.toLowerCase()!=CardModule.Properties.cardCategory.normal.value && 
                    cardCategory.toLowerCase()!=CardModule.Properties.cardCategory.gold.value){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `Please enter the card type that you want to see: **${CardModule.Properties.cardCategory.normal.value}/${CardModule.Properties.cardCategory.gold.value}**.`;
                        return message.channel.send({embed:objEmbed});
                    } else if(cardCategory.toLowerCase()==CardModule.Properties.cardCategory.gold.value&&
                    userInventoryData[DBM_Card_Inventory.columns.is_gold]==0){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: You need the ${CardModule.Properties.cardCategory.gold.value} upgrade of: **${cardData[DBM_Card_Data.columns.name]}** to see this card.`;
                        return message.channel.send({embed:objEmbed});
                    } else {
                        type=cardCategory.toLowerCase();
                    }
                }

                switch(type){
                    case CardModule.Properties.cardCategory.normal.value:
                        return message.channel.send({embed:CardModule.embedCardDetail(cardData[DBM_Card_Data.columns.color],
                            cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],
                            cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                            userInventoryData[DBM_Card_Inventory.columns.created_at],userInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userInventoryData[DBM_Card_Inventory.columns.level_special],itemStock,cardData[DBM_Card_Data.columns.ability1])});
                        break;
                    case CardModule.Properties.cardCategory.gold.value:
                        return message.channel.send({embed:CardModule.embedCardDetail(cardData[DBM_Card_Data.columns.color],
                            cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],
                            cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                            userInventoryData[DBM_Card_Inventory.columns.created_at],userInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userInventoryData[DBM_Card_Inventory.columns.level_special],itemStock,cardData[DBM_Card_Data.columns.ability1],CardModule.Properties.cardCategory.gold.value)});
                        break;
                }

                
                break;
            case "guess":
                var guess = args[1];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    id:guildSpawnData[DBM_Card_Guild.columns.spawn_id],
                    color:guildSpawnData[DBM_Card_Guild.columns.spawn_color],
                }

                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.amnesia.value){
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    return message.channel.send({embed:embedStatusEffectActivated})
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type!=null&&spawnedCardData.type != "number"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, current card spawn type is not a lucky number.";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    (spawnedCardData.id==null&&spawnedCardData.color==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no Precure cards spawning now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you have already used the guess command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(guess==null||(guess.toLowerCase()!="lower"&&guess.toLowerCase()!="higher")){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the guess parameter with **lower** or **higher**. Example: **p!card guess higher**";
                    return message.channel.send({embed:objEmbed});
                }

                var success = false; var msgSend = "";
                var currentNumber = parseInt(guildSpawnData[DBM_Card_Guild.columns.spawn_number]);
                var nextNumber = GlobalFunctions.randomNumber(1,12);
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                //get status effect
                switch(currentStatusEffect){
                    case CardModule.StatusEffect.buffData.lucky_number.value:
                        nextNumber = CardModule.StatusEffect.buffData.lucky_number.value_number
                        //erase the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                        await message.channel.send({embed:embedStatusActivated});
                        break;
                }

                if(currentStatusEffect==CardModule.StatusEffect.buffData.lucky_number.value){
                    //lucky number buff
                    success = true;
                } else if(nextNumber==currentNumber){
                    //number was same
                    pointReward = 10;
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.author = {
                        iconURL:userAvatarUrl,
                        name:userUsername
                    }
                    objEmbed.description = `:x: The current number was: **${currentNumber}** and the hidden number was **${nextNumber}**. Neither number is lower or higher. As a bonus you received **${pointReward} ${spawnedCardData.color}** color points, also you have another chance to guess the next hidden number.`;
                    
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);
                    return message.channel.send({embed:objEmbed});

                } else {
                    switch(guess.toLowerCase()){
                        case "lower":
                            if(nextNumber<currentNumber){
                                success = true;
                            }
                            break;
                        case "higher":
                            if(nextNumber>currentNumber){
                                success = true;
                            }
                            break;
                    }
                }

                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                if(success){
                    spawnedCardData.series = cardSpawnData[DBM_Card_Data.columns.series];
                    //if success
                    var pointReward = 5;//default point reward
                    var msgContent = "";
                    var itemStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                    var duplicate = true;
                    //var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);

                    if(itemStock<=-1){//card is not duplicate
                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        msgContent = `:white_check_mark: Current number was: **${currentNumber}** and the hidden number was **${nextNumber}**. Your guess was: **${guess}** and you guessed it correctly! **${userUsername}** has received: **${cardSpawnData[DBM_Card_Data.columns.name]}** & ${pointReward} **${spawnedCardData.color}** color points.`;

                        duplicate = false;
                    } else { //duplicate
                        pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                        if(itemStock<CardModule.Properties.maximumCard){//add new stock card
                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                            msgContent = `**${userUsername}** has received another copy of: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}** & **${pointReward} ${spawnedCardData.color}** color points.`;
                            itemStock=itemStock+1;
                        } else {
                            //cannot add more card
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.author = {
                                name:userUsername,
                                iconURL:userAvatarUrl
                            }
                            objEmbed.description = `:x: Sorry **${userUsername}**, you cannot have another copy of **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${pointReward} ${spawnedCardData.color}** color points.`;

                            //update the token & color point
                            var objColor = new Map();
                            objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                            await CardModule.updateCatchAttempt(userId,
                                spawnedCardData.token,
                                objColor
                            );

                            return message.channel.send({embed:objEmbed});
                        }
                    }

                    //check card pack completion:
                    var embedCompletion = null;
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                    if(checkCardCompletionPack){ //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null){
                            message.channel.send({embed:embedCompletion});
                        }
                    } 
                    
                    if(checkCardCompletionColor) { //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                        if(embedCompletion!=null){
                            message.channel.send({embed:embedCompletion});
                        }
                    }

                    if(checkCardCompletionSeries){
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                        if(embedCompletion!=null){
                            message.channel.send({embed:embedCompletion});
                        }
                    }

                    //update the token & color points
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );

                    //get the current card total
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);
                    
                    if(duplicate){
                        return message.channel.send({content:msgContent});
                    } else {
                        //remove the guild spawn token
                        await CardModule.removeCardGuildSpawn(guildId);

                        return message.channel.send({content:msgContent,embed:CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                            cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_atk],itemStock)});
                    }
                    
                } else { //guessed the wrong hidden number
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.author = {
                        iconURL:userAvatarUrl,
                        name:userUsername
                    }
                    
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}**. Sorry, you guessed it wrong this time.`;

                    await message.channel.send({embed:objEmbed});

                    //get status effect
                    switch(currentStatusEffect){
                        case "second_chance":
                            //check if second chance/not
                            //erase the status effect
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});
                            break;
                        default:
                            await CardModule.updateCatchAttempt(userId,
                                spawnedCardData.token
                            );
                            break;
                    }

                }

                //generate new card:
                // var objEmbedNewCard =  await CardModule.generateCardSpawn(guildId,"number",false);
                // message.channel.send({embed:objEmbedNewCard});
                
                break;
            case "color":
                var newColor = args[2];
                //validator if parameter format is not correct
                if(args[1]==null|| args[1].toLowerCase()!="set" || 
                    (args[1].toLowerCase()!="set" && newColor == null)||
                    (args[1].toLowerCase()=="set" && !CardModule.Properties.arrColor.includes(newColor))){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : ":x: Please enter the correct color set command with: **p!card color set <pink/purple/green/yellow/white/blue/red>**"
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var userCardData = await CardModule.getCardUserStatusData(userId);
                var assignedColor = userCardData[DBM_Card_User_Data.columns.color];
                var assignedColorPoint = userCardData[`color_point_${assignedColor}`];
                //validator: check if color points is enough/not
                if(assignedColorPoint<100){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **100 ${assignedColor}** color points to change your color.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //assign new color & update color
                var parameterSet = new Map();
                parameterSet.set(DBM_Card_User_Data.columns.color,newColor);
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                //update the color points
                var parameterSetColorPoint = new Map();
                parameterSetColorPoint.set(`color_point_${assignedColor}`,-100);
                await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                var objEmbed = {
                    author : {
                        iconURL:userAvatarUrl,
                        name:userUsername
                    },
                    color: CardModule.Properties.embedColor,
                    title: `New color has been set`,
                    description : `:white_check_mark: <@${userId}> is now assigned with color: **${newColor}** and use **100 ${assignedColor}** color points.`
                };

                return message.channel.send({embed:objEmbed});

                break;
            case "series":
                var newSeries = args[2];
                //validator if parameter format is not correct
                if(args[1]==null|| args[1].toLowerCase()!="set" || 
                    (args[1].toLowerCase()!="set" && newSeries == null)||
                    (args[1].toLowerCase()=="set" && !(newSeries in CardModule.Properties.seriesCardCore))){
                    var txtSeriesList = "";
                    CardModule.Properties.arrSeriesList.forEach(entry => {
                        txtSeriesList+=`-**${CardModule.Properties.seriesCardCore[entry].value}** (${CardModule.Properties.seriesCardCore[entry].pack}) : ${CardModule.Properties.seriesCardCore[entry].currency}\n`
                    });
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : ":x: Please enter the correct series id from the list below.\nExample: **p!card series set sp001**:",
                        fields:[{
                            name:"Series List:",
                            value:txtSeriesList
                        }]
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var userCardData = await CardModule.getCardUserStatusData(userId);
                var assignedSeries = userCardData[DBM_Card_User_Data.columns.series_set];
                var assignedSeriesPoint = userCardData[`${assignedSeries}`];
                var changePrice = 50;
                //validator: check if color points is enough/not
                if(assignedSeriesPoint<changePrice){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **${changePrice} ${CardModule.Properties.seriesCardCore[assignedSeries].currency}** series points to change your series assignment.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //assign new series & update series
                var parameterSet = new Map();
                parameterSet.set(DBM_Card_User_Data.columns.series_set,newSeries);
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                //update the color points
                var parameterSetSeriesPoint = new Map();
                parameterSetSeriesPoint.set(`${assignedSeries}`,-changePrice);
                await CardModule.updateSeriesPoint(userId,parameterSetSeriesPoint);

                var newSeries = CardModule.Properties.seriesCardCore[newSeries].pack;

                var objEmbed = {
                    author : {
                        iconURL:userAvatarUrl,
                        name:userUsername
                    },
                    color: CardModule.Properties.embedColor,
                    title: `New series has been set`,
                    description : `:white_check_mark: <@${userId}> is now assigned with series: **${newSeries}** and use **${changePrice} ${CardModule.Properties.seriesCardCore[assignedSeries].currency}** series points.`
                };

                return message.channel.send({embed:objEmbed});

                break;
            case "guide":
                var objEmbed = {
                    color:CardModule.Properties.embedColor,
                    title: "Precure Cardcatcher! Guide 101",
                    // thumbnail: {
                    //     url: CardModule.Properties.imgResponse.imgOk
                    // },
                    description: "This is the basic guide starter for the Precure Card Catcher:",
                    fields: [
                    {
                        name: "How many card color/packs/rarity available?",
                        value: `There are seven colours: pink, purple, green, yellow, white, blue and red. There are also 63 card packs that you can collect.\nEach card also provided with number of rarity from 1-7, the higher number of rarity the lower of the chance that you can capture it. You can track down your card progression with **p!card status** or **p!card inventory <pack>**`
                    },
                    {
                        name: "What is cLvl, assigned color, CL(color level) and CP(color points) on my status?",
                        value: `**cLvl** stands for the average of all your color level and just used to represent your overall color level. The **color that you assigned** will be used during the color card spawn.\nStarting from **CL(color level)** 2 you will get 5% card capture chance bonus and will be increased for every level. To level up your color, you need a multiplier of 100 **CP(color points)** for every color level and use the command: **p!card up <color>**. Color points can be used to change your color too.`
                    },
                    {
                        name: "What are the list of card spawn that is available?",
                        value: `-**normal**: the common card spawn that you can capture with **p!card catch** command.\n-**color**: 7 different color cards will be spawned and every color will provide 1 random card from its color. You can only capture the card from your assigned color and do it one time. After a color has been captured that color will be removed. Base catch rate +10% for this spawn.\n-**number**: a random number from 1-12 & card rarity within 1-4 will be spawned. You need to guess if the next hidden number will be **lower** or **higher** with **p!card guess <lower/higher>**. Bonus spawn type: 100% catch rate.\n-**quiz**: A set of question, answer and card rarity within 1-4 will be spawned. You need to answer it with **p!card answer <a/b/c>**. Bonus spawn type: 100% catch rate.`
                    },
                    {
                        name: "Summary & Getting Started",
                        value: `-Gather daily color points once every 24 hours with **p!daily <color>**. The **<color>** parameter is optional and the points will be doubled if you didn't provide the **<color>** parameter, otherwise you'll receive overall color points.\n-Capture the card based from the card spawn type ruleset.\n-You can level up your color with: **p!card up <color>**.\n-You can use **p!card status** or **p!card inventory <pack>** to track down your card progress.\n-You can use the **p!card respawn** to spawn a new card for 20 color points but the chances are 20%. If that fails, you will need to wait until the next card spawn.`
                    }]
                  }
                  message.channel.send({embed:objEmbed});
                
                break;
            case "leaderboard":
                var selection = args[1];
                var completion = args.slice(2).join(' ');
                if((selection=="pack"||selection=="goldpack")&&!CardModule.Properties.dataCardCore.hasOwnProperty(completion.toLowerCase())){
                    return message.channel.send({
                        content:`Please enter the correct pack that is listed bellow:`,
                        embed:CardModule.embedCardPackList
                    });
                } else if((selection=="color"||selection=="goldcolor")&&!CardModule.Properties.arrColor.includes(completion.toLowerCase())){
                    return message.channel.send({
                        content:`Please enter the parameter with one of the color list: **${CardModule.Properties.arrColor.toString().split(",").join("/")}**`
                    });
                } else if((selection=="series"||selection=="goldseries")&&!CardModule.Properties.dataCardCore.hasOwnProperty(completion.toLowerCase())){
                    //validation if series exists/not
                    var parameterWhere = new Map();
                    parameterWhere.set(DBM_Card_Data.columns.series,completion);
                    var checkSeriesData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
                    checkSeriesData = checkSeriesData[0][0];
                    if(checkSeriesData==null){
                        var querySeriesList = `SELECT * 
                        FROM ${DBM_Card_Data.TABLENAME} 
                        GROUP BY ${DBM_Card_Data.columns.series}`;
                        var seriesData = await DBConn.conn.promise().query(querySeriesList);
                        seriesData = seriesData[0];
                        var txtSeriesList = "";
                        for(var i=0;i<seriesData.length;i++){
                            txtSeriesList+=`${seriesData[i][DBM_Card_Data.columns.series]}\n`;
                        }

                        var objEmbed = {
                            color: CardModule.Properties.embedColor,
                            fields: {
                                name:`Series List:`,
                                value:txtSeriesList
                            }
                        };

                        return message.channel.send({
                            content:`Please enter the correct series that is listed bellow::`,
                            embed:objEmbed
                        });
                    }

                } else if(selection!="pack"&&selection!="goldpack"&&selection!="color"&&selection!="goldcolor"&&selection!="series"&&selection!="goldseries"){
                    var objEmbed ={
                        color: CardModule.Properties.embedColor,
                        description: `Use: **p!card leaderboard <color/goldcolor> <${CardModule.Properties.arrColor.toString().split(",").join("/")}>** to see the color card leaderboard\nUse: **p!card leaderboard <pack/goldpack> <pack>** to see the card pack completion\nUse: **p!card leaderboard <series/goldseries> <series>** to see the card series completion.`
                    };
                    return message.channel.send({
                        embed:objEmbed
                    });
                }
                
                //replace the filter
                selection = selection.replace("goldpack","pack_gold").replace("goldcolor","color_gold").replace("goldseries","series_gold");

                //prepare the embed
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                }
                
                var query = `SELECT * 
                FROM ${DBM_Card_Leaderboard.TABLENAME} 
                WHERE ${DBM_Card_Leaderboard.columns.id_guild}=? AND 
                ${DBM_Card_Leaderboard.columns.category}=? AND 
                ${DBM_Card_Leaderboard.columns.completion}=?
                ORDER BY ${DBM_Card_Leaderboard.columns.created_at} ASC 
                LIMIT 10`; 
                var leaderboardContent = "";
                var arrParameterized = [guildId,selection,completion];
                var dataLeaderboard = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 1;
                dataLeaderboard[0].forEach(function(entry){
                    leaderboardContent += `${ctr}. <@${entry[DBM_Card_Leaderboard.columns.id_user]}> : ${GlobalFunctions.convertDateTime(entry[DBM_Card_Leaderboard.columns.created_at])}\n`; ctr++;
                })

                switch(selection){
                    case "pack":
                        objEmbed.title = `Top 10 ${GlobalFunctions.capitalize(completion)} Card Pack Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has completed the **${completion}** card pack yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                    case "color":
                        objEmbed.title = `:trophy: Top 10 Cure ${GlobalFunctions.capitalize(completion)} Master Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has become the master of **Cure ${completion}** yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                    case "pack_gold":
                        objEmbed.title = `Top 10 Gold ${GlobalFunctions.capitalize(completion)} Card Pack Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has completed the gold **${completion}** card pack yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                    case "color_gold":
                        objEmbed.title = `:trophy: Top 10 Gold Cure ${GlobalFunctions.capitalize(completion)} Master Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has become the gold master of **Cure ${completion}** yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                    case "series":
                        objEmbed.title = `Top 10 ${GlobalFunctions.capitalize(completion)} Series Completion Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has completed the card series: **${completion}** yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                    case "series_gold":
                        objEmbed.title = `Top 10 Gold ${GlobalFunctions.capitalize(completion)} Series Completion Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has completed the gold card series: **${completion}** yet...`;
                        } else {
                            objEmbed.description = `${leaderboardContent}`;
                        }
                        break;
                }

                return message.channel.send({embed:objEmbed});
            case "up":
            case "upgrade":
                //level up the color
                if(args[1]==null||(args[1]!="color"&&args[1]!="level"&&args[1]!="special"&&args[1]!="gold")){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : `-Level up the color with: **p!card up color <pink/purple/green/yellow/white/blue/red>**\n-Level up the card level with: **p!card up level <id_card>**\n-Level up the card special attack with: **p!card up special <id_card>**\n-Upgrade the card into gold with: **p!card up gold <id_card>**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                switch(args[1].toLowerCase()){
                    case "color": //level up the color
                        var selectedColor = args[2];
                        if(!CardModule.Properties.arrColor.includes(selectedColor)){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : ":x: Please enter the correct color level up command with: **p!card up color <pink/purple/green/yellow/white/blue/red>**"
                            };
                            return message.channel.send({embed:objEmbed});   
                        }

                        var userCardData = await CardModule.getCardUserStatusData(userId);
                        var colorLevel = userCardData[`color_level_${selectedColor}`];
                        var colorPoint = userCardData[`color_point_${selectedColor}`];
                        var nextColorPoint = CardModule.getNextColorPoint(colorLevel);
                        //validator: check if color points is enough/not
                        if(colorPoint<nextColorPoint){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, you need **${nextColorPoint} ${selectedColor}** color points to level up.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        //update the color points
                        var parameterSetColorPoint = new Map();
                        parameterSetColorPoint.set(`color_point_${selectedColor}`,-nextColorPoint);
                        await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                        //add 1 color level
                        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET color_level_${selectedColor} = color_level_${selectedColor}+1
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        await DBConn.conn.promise().query(query, [userId]);

                        colorLevel+=1;

                        var objEmbed = {
                            color: CardModule.Properties.embedColor,
                            title: `${userUsername}' ${GlobalFunctions.capitalize(selectedColor)} Level Up!`,
                            thumbnail:{
                                url: userAvatarUrl
                            },
                            description : `:white_check_mark: <@${userId}> **${selectedColor}** color is now level **${colorLevel}**!`,
                            fields: [
                                {
                                    name:`Total bonus capture rate:`,
                                    value:`+${CardModule.getBonusCatchAttempt(colorLevel)}%`,
                                    inline: true
                                },
                                {
                                    name:`Next ${GlobalFunctions.capitalize(selectedColor)} Color Points:`,
                                    value:`${CardModule.getNextColorPoint(colorLevel)}`,
                                    inline: true
                                },
                            ]
                        };

                        message.channel.send({embed:objEmbed});
                        break;
                    
                    case "level": //level up the card using color point
                        var selectedIdCard = args[2];
                        var cardData = await CardModule.getCardData(selectedIdCard);
                        
                        if(cardData==null){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: Sorry, I can't find that card ID.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        var cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);
                        var cardUserData = await CardModule.getCardUserStatusData(userId);
                        if(cardInventoryData==null){ 
                            //card exists validation
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** yet.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        //card up with quantity
                        var qty = args[3];
                        if(qty!=null&&isNaN(qty)){
                            objEmbed.description = `:x: Please enter the valid level quantity between 1-${CardModule.Leveling.getMaxLevel(rarity)}`;
                            return message.channel.send({embed:objEmbed});
                        } else if(qty<=0||qty>=99){
                            objEmbed.description = `:x: Please enter the valid level quantity between 1-${CardModule.Leveling.getMaxLevel(rarity)}`;
                            return message.channel.send({embed:objEmbed});
                        } 
                        
                        if(qty==null){
                            qty = 0;
                        }
                        qty = parseInt(qty);//convert to int

                        var cardLevel = cardInventoryData[DBM_Card_Inventory.columns.level];
                        var rarity = cardData[DBM_Card_Data.columns.rarity];
                        var selectedColor = cardData[DBM_Card_Data.columns.color];

                        if(qty>=1&&cardLevel+qty>CardModule.Leveling.getMaxLevel(rarity)){
                            //max level validation
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                title:`Limited Card Level`,
                                description : `:x: Sorry, that card level parameter are more than the maximum level cap!`
                            };
                            return message.channel.send({embed:objEmbed});
                        } else if(cardLevel>=CardModule.Leveling.getMaxLevel(rarity)){
                            //max level validation
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                title:`Maximum Card Level!`,
                                description : `:x: **${cardData[DBM_Card_Data.columns.name]}** has reached the maximum card level and cannot be increased anymore.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }
                        
                        //color point validation
                        var nextExp = CardModule.Leveling.getNextCardExp(cardLevel,qty);
                        if(cardUserData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<nextExp){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: Sorry, you need **${nextExp} ${cardData[DBM_Card_Data.columns.color]}** color points to level up the **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into level **${cardLevel+qty}**.`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        if(qty<=0){
                            qty = 1;
                        }

                        //update the card level & color points 
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} inv, ${DBM_Card_User_Data.TABLENAME} cud 
                        SET inv.${DBM_Card_Inventory.columns.level}=inv.${DBM_Card_Inventory.columns.level}+${qty}, 
                        cud.color_point_${selectedColor}=cud.color_point_${selectedColor}-${nextExp} 
                        WHERE cud.${DBM_Card_User_Data.columns.id_user}=? AND 
                        inv.${DBM_Card_Inventory.columns.id_user}=? AND 
                        inv.${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query,[userId,userId,selectedIdCard]);

                        //get updated data:
                        var cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);

                        var objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special]);

                        if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                        }

                        return message.channel.send({content:`**${userUsername}** has used **${nextExp} ${cardData[DBM_Card_Data.columns.color]}** color points & **${cardData[DBM_Card_Data.columns.name]}** is now level **${cardInventoryData[DBM_Card_Inventory.columns.level]}**!`, embed:objEmbed});

                        break;
                    
                    case "special":
                        var selectedIdCard = args[2];
                        var cardData = await CardModule.getCardData(selectedIdCard);
                        if(cardData==null){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: Sorry, I can't find that card ID.`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        var cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);
                        if(cardInventoryData==null){
                            //check if user have card/not
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** yet.`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        if(cardInventoryData[DBM_Card_Inventory.columns.level_special]>=10){
                            //check if level is capped/not
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** has reached the maximum special level and cannot be increased anymore.`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        var requirement = CardModule.Leveling.getNextCardSpecialTotal(cardInventoryData[DBM_Card_Inventory.columns.level_special]);
                        if(cardInventoryData[DBM_Card_Inventory.columns.stock]<requirement){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: Sorry, you need **${(requirement)-cardInventoryData[DBM_Card_Inventory.columns.stock]}** more: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to level up the special attack into **${cardInventoryData[DBM_Card_Inventory.columns.level_special]+1}**.`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        //level up the special
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                        SET ${DBM_Card_Inventory.columns.level_special}=${DBM_Card_Inventory.columns.level_special}+1, 
                        ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-${requirement} 
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query,[userId,selectedIdCard]);

                        //get updated data:
                        cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);

                        var objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special]);

                        //check for card type upgrade
                        if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                        }
                        
                        return message.channel.send({content:`**${userUsername}** - **${cardData[DBM_Card_Data.columns.name]}** special attack is now level **${cardInventoryData[DBM_Card_Inventory.columns.level_special]}**!`, embed:objEmbed});

                        break;
                
                    case "gold": //upgrade into gold card
                        var cardId = args[2];
                        objEmbed = {
                            color:CardModule.Properties.embedColor,
                            author : {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            }
                        }
                        if(cardId==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Please enter the card ID that you want to upgrade into the gold with: **p!card upgrade gold <card id>**";
                            return message.channel.send({embed:objEmbed});
                        }
        
                        //check if card ID exists/not
                        var cardData = await CardModule.getCardData(cardId);
                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find that card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        }

                        var cardRarity = cardData[DBM_Card_Data.columns.rarity];
        
                        //check if user have card/not
                        var itemStock = await CardModule.getUserCardStock(userId,cardId);
                        if(itemStock<=-1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        var userCardInventoryData = await CardModule.getCardInventoryUserData(userId,cardId);
                        if(userCardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgOk
                            }
                            objEmbed.description = `:white_check_mark: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** already upgraded into gold.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Item_Data.columns.extra_data,cardData[DBM_Card_Data.columns.series]);

                        var itemDataRequirement = await DB.select(DBM_Item_Data.TABLENAME,parameterWhere);//get the item series
                        itemDataRequirement = itemDataRequirement[0][0];
                        var itemStock = await ItemModule.getUserItemStock(userId,itemDataRequirement[DBM_Item_Data.columns.id]);
                        if(cardRarity>=5){
                            cardRarity=5;
                        }
                        if(userCardInventoryData[DBM_Card_Inventory.columns.stock]<cardRarity||itemStock<cardRarity){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have enough materials to upgrade this card into gold card.`;
                            objEmbed.fields = [
                                {
                                    name:`Required Materials:`,
                                    value:`>**Card:** ${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]} x${cardRarity}\n>**Item:** ${itemDataRequirement[DBM_Item_Data.columns.id]} - ${itemDataRequirement[DBM_Item_Data.columns.name]} x${cardRarity}`,
                                    inline:true
                                }
                            ]
                            return message.channel.send({embed:objEmbed});
                        }

                        //update the card stock
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                        SET ${DBM_Card_Inventory.columns.stock} = ${DBM_Card_Inventory.columns.stock}-${cardRarity}
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query, [userId,cardData[DBM_Card_Data.columns.id_card]]);
                        await ItemModule.updateItemStock(userId,itemDataRequirement[DBM_Item_Data.columns.id],-cardRarity);

                        //start the upgrade rng
                        var randomChance = GlobalFunctions.randomNumber(1,10);
                        var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                        //get clvl
                        var clvl = await CardModule.getAverageLevel(userId,[
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_green],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_red],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_white],
                            cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]
                        ]);
                        if(clvl>=10){
                            randomChance+=3;
                        } else if(clvl>=7){
                            randomChance+=2;
                        } else if(clvl>=5){
                            randomChance+=1;
                        }
                        
                        if(randomChance<cardRarity){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.author = {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            }
                            objEmbed.title = "Upgrade Failed!";
                            objEmbed.description = `:x: Oh no, looks like you fail to upgrade the **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** this time.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        //upgrade the card
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Inventory.columns.is_gold,1);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Inventory.columns.id_user,userId);
                        parameterWhere.set(DBM_Card_Inventory.columns.id_card,cardData[DBM_Card_Data.columns.id_card]);
                        await DB.update(DBM_Card_Inventory.TABLENAME,parameterSet,parameterWhere);

                        var userCardInventoryData = await CardModule.getCardInventoryUserData(userId,cardId);

                        //announce the card ugprade
                        await message.channel.send({content:`${userUsername} has successfully upgrade **${cardData[DBM_Card_Data.columns.id_card]} ${cardData[DBM_Card_Data.columns.name]}** into gold card!`,embed:CardModule.embedCardDetail(cardData[DBM_Card_Data.columns.color],
                        cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],
                        cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                        userCardInventoryData[DBM_Card_Inventory.columns.created_at],userCardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardInventoryData[DBM_Card_Inventory.columns.level_special],userCardInventoryData[DBM_Card_Inventory.columns.stock],cardData[DBM_Card_Data.columns.ability1],CardModule.Properties.cardCategory.gold.value)});
                        
                        //check for leaderboard
                        var checkCardCompletionPackGold = await CardModule.checkCardCompletion(guildId,userId,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                        var checkCardCompletionColorGold = await CardModule.checkCardCompletion(guildId,userId,"color_gold",cardData[DBM_Card_Data.columns.color]);

                        if(checkCardCompletionPackGold){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        if(checkCardCompletionColorGold) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color_gold",cardData[DBM_Card_Data.columns.color]);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        break;
                }

                return;
                
                break;
            case "answer":
            case "choose":
                var answer = args[1];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }
                // var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    spawn_data:guildSpawnData[DBM_Card_Guild.columns.spawn_data]
                }

                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.amnesia.value){
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    return message.channel.send({embed:embedStatusEffectActivated})
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type!=null && spawnedCardData.type != "quiz"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, it's not quiz time yet.";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    spawnedCardData.spawn_data==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no card that is spawned yet. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you already use the answer command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(answer==null||
                    (answer.toLowerCase()!="a"&&answer.toLowerCase()!="b"&&answer.toLowerCase()!="c"&&answer.toLowerCase()!="d")){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the answer parameter with **a** or **b** or **c** or **d**. Example: **p!card answer a**";
                    return message.channel.send({embed:objEmbed});
                }

                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                
                spawnedCardData.id = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.id_card];
                spawnedCardData.answer = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.answer];
                spawnedCardData.type = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.type];

                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];
                spawnedCardData.pack = cardSpawnData[DBM_Card_Data.columns.pack];
                spawnedCardData.series = cardSpawnData[DBM_Card_Data.columns.series];
                
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                answer = answer.toLowerCase();
                if(answer!=spawnedCardData.answer){
                    //check for status effect:
                    if(currentStatusEffect=="quiz_master"){
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                        await message.channel.send({embed:embedStatusActivated});

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgFailed
                        }
                        objEmbed.description = `:x: The correct answer was: **${spawnedCardData.answer}**`;

                        await message.channel.send({embed:objEmbed});
                        
                        //erase the status effect
                        CardModule.StatusEffect.updateStatusEffect(userId,null);
                    } else {
                        switch(spawnedCardData.type){
                            case CardModule.Properties.spawnData.quiz.typeNormal:
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.imgResponse.imgFailed
                                }
                                objEmbed.description = `:x: Sorry, but that's not the answer.`;
                                break;
                            case CardModule.Properties.spawnData.quiz.typeTsunagarus:
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.enemySpawnData.tsunagarus.image[CardModule.Properties.enemySpawnData.tsunagarus.term.chiridjirin]
                                }
                                objEmbed.title = "Defeated!";
                                objEmbed.color = CardModule.Properties.enemySpawnData.tsunagarus.embedColor[CardModule.Properties.enemySpawnData.tsunagarus.term.chiridjirin];
                                objEmbed.description = `:x: Chirichiri! You failed to rescue this time.`;
                                break;
                        }

                        await message.channel.send({embed:objEmbed});

                        if(currentStatusEffect=="second_chance"){
                            //second chance status effect
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});

                            //erase the status effect
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);

                        } else {
                            //wrong answer - update the token
                            await CardModule.updateCatchAttempt(userId,
                                spawnedCardData.token
                            );
                        }
                        break;
                    }
                    
                    return;
                }

                if(spawnedCardData.type==CardModule.Properties.spawnData.quiz.typeTsunagarus){
                    var embedVictory = objEmbed;
                    embedVictory.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgOk
                    }
                    embedVictory.title = "Mini Tsunagarus Defeated!";
                    embedVictory.description = "✅ You've successfully defeat the mini tsunagarus!";
                    await message.channel.send({embed:embedVictory});

                }

                //correct answer
                var duplicate = true;
                var msgContent = "";
                var pointReward = 5;
                var itemStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                if(itemStock<=-1){//non duplicate
                    await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                    msgContent = `Nice one! **${userUsername}** has received: **${cardSpawnData[DBM_Card_Data.columns.name]}** & **${pointReward} ${spawnedCardData.color}** color points.`;
                    duplicate = false;
                } else {//duplicate
                    pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                    if(itemStock<CardModule.Properties.maximumCard){//add new stock card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                        msgContent = `**${userUsername}** has received another copy of : **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}** & **${pointReward} ${spawnedCardData.color}** color points.`;
                        itemStock=itemStock+1;
                    } else {
                        //cannot add more card
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.author = {
                            name:userUsername,
                            iconURL:userAvatarUrl
                        }
                        objEmbed.description = `:x: Sorry **${userUsername}**, you cannot have another copy of **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${pointReward} ${spawnedCardData.color}** color points.`;
                        //update the token & color point
                        var objColor = new Map();
                        objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                        await CardModule.updateCatchAttempt(userId,
                            spawnedCardData.token,
                            objColor
                        );

                        return message.channel.send({embed:objEmbed});
                    }
                }

                //get the current card total
                var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);

                //update token & color points
                var objColor = new Map();
                objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                await CardModule.updateCatchAttempt(userId,
                    spawnedCardData.token,
                    objColor
                );

                if(duplicate){
                    await message.channel.send({content:msgContent});
                } else {
                    //remove the spawn
                    await CardModule.removeCardGuildSpawn(guildId);

                    await message.channel.send({content:msgContent,embed:CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,spawnedCardData.pack,cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_hp],itemStock)});
                }
                
                //check card pack completion:
                var embedCompletion = null;
                var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                if(checkCardCompletionPack){
                    //card pack completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    if(embedCompletion!=null){
                        return message.channel.send({embed:embedCompletion});
                    }
                } 
                
                if(checkCardCompletionColor) {
                    //color set completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                    if(embedCompletion!=null){
                        return message.channel.send({embed:embedCompletion});
                    }
                }

                if(checkCardCompletionSeries) {
                    //color set completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                    if(embedCompletion!=null){
                        return message.channel.send({embed:embedCompletion});
                    }
                }

                //generate new card:
                // var objEmbedNewCard =  await CardModule.generateCardSpawn(guildId,"quiz",false);
                // message.channel.send({embed:objEmbedNewCard});
                
                break;
            case "set":
            case "transform":
            case "precure":
                //set the card id/cure avatar
                var cardId = args[1];
                if(cardId==null){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Please enter the card ID as parameter. Example: **p!card set <card id>**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                cardId = cardId.toLowerCase();

                var cardData = await CardModule.getCardData(cardId);
                if(cardData==null){
                    //check if card available/not
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, I can't find that card Id.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var cardInventoryData = await CardModule.getCardInventoryUserData(userId,cardId);
                if(cardInventoryData==null){
                    //check if user have card/not
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** yet.`,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var cardGuildData = await CardGuildModule.getCardGuildData(guildId);
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                var price = cardData[DBM_Card_Data.columns.rarity]*10;
                var selectedColor = cardData[DBM_Card_Data.columns.color];
                var currentColorPoint = cardUserData[`color_point_${selectedColor}`];
                var msgContent = "";

                if(cardGuildData[DBM_Card_Guild.columns.spawn_type]=="battle" && 
                cardUserData[DBM_Card_User_Data.columns.card_set_token]==cardGuildData[DBM_Card_Guild.columns.spawn_token]){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name:userUsername
                        },
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: You cannot change into another Precure avatar again when tsunagarus has appeared!`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(cardData[DBM_Card_Data.columns.rarity]>=3&&currentColorPoint<price){
                    //validation check: color point
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **${price} ${selectedColor}** color point to set **${cardId} - ${cardData[DBM_Card_Data.columns.name]}** as the cure avatar.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                if(cardData[DBM_Card_Data.columns.rarity]>=3){
                    //update the color point
                    var objColor = new Map();
                    objColor.set(`color_point_${selectedColor}`,-price);
                    await CardModule.updateColorPoint(userId,objColor);
                    msgContent = `${userUsername} has set **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** as the cure avatar & use **${price} ${selectedColor}** color points!`
                } else {
                    msgContent = `${userUsername} has set **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** as the cure avatar`;
                }

                //update the cure card avatar & card id set token
                var parameterSet = new Map();
                parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,cardData[DBM_Card_Data.columns.id_card]);
                if(cardGuildData[DBM_Card_Guild.columns.spawn_type]=="battle"){
                    parameterSet.set(DBM_Card_User_Data.columns.card_set_token,cardGuildData[DBM_Card_Guild.columns.spawn_token]);
                }
                
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                var type = CardModule.Properties.cardCategory.normal.value;
                if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                    type = CardModule.Properties.cardCategory.gold.value;
                }

                switch(type){
                    case CardModule.Properties.cardCategory.gold.value:
                        return message.channel.send({content:msgContent,embed:CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type)});
                        break;
                    default:
                        return message.channel.send({content:msgContent,embed:CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type)});
                        break;
                }
               
                break;
            case "unset":
            case "revert":
                //revert back the transformation
                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    author: {
                        name:userUsername,
                        iconURL:userAvatarUrl
                    }
                };

                var cardUserData = await CardModule.getCardUserStatusData(userId);
                if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You haven't set the precure avatar yet.";
                    message.channel.send({embed:objEmbed});
                    return;
                }

                //process the update
                var cardData = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                var parameterSet = new Map();
                parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                if(cardData[DBM_Card_Data.columns.rarity]>=3){
                    var objColor = new Map();
                    objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,cardData[DBM_Card_Data.columns.rarity]*10);
                    await CardModule.updateColorPoint(userId,objColor);
                }

                objEmbed.description = "Your precure avatar has been reverted back.";
                message.channel.send({embed:objEmbed});

                break
            case "avatar":
                //see the precure avatar
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]==null){
                    return message.channel.send({embed:{
                        color: CardModule.Properties.embedColor,
                        author: {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        },
                        thumbnail: {
                            url:CardModule.Properties.imgResponse.imgFailed
                        },
                        description:`:x: You haven't set the precure avatar yet.\nUse **p!card set <card id>** to set your precure avatar.`
                    }})
                }

                var cardUserInventory = await CardModule.getCardInventoryUserData(userId,cardUserData[DBM_Card_User_Data.columns.card_id_selected]); //get the card status
                var cardData = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                return message.channel.send({embed:CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardUserInventory[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardUserInventory[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity])})

                break;
            // case "debug":
            //     //for card spawn debug purpose
            //     var cardSpawnData = await CardModule.generateCardSpawn(guildId);
            //     var msgObject = await message.channel.send({embed:cardSpawnData});
            //     await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
            //     break;
            case "battle":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color],
                    cardIdSelected:userCardData[DBM_Card_User_Data.columns.card_id_selected]
                }
                
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    spawn_data:guildSpawnData[DBM_Card_Guild.columns.spawn_data]
                }

                //fear status effect
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.fear.value){
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    return message.channel.send({embed:embedStatusEffectActivated})
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type!=null && spawnedCardData.type != "battle"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgOk
                    }
                    objEmbed.description = ":x: There are no tsunagarus detected!";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    spawnedCardData.spawn_data==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I didn't sense any tsunagarus right now.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: I know you want to battle but you are in no condition to fight now!";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.cardIdSelected==null) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: I know you want to battle but you need to set your precure avatar first!";
                    return message.channel.send({embed:objEmbed});
                }

                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                var userCardInventoryData = await CardModule.getCardInventoryUserData(userId,userData.cardIdSelected);
                //check for card type boost
                var rarityBoost = 0;
                if(userCardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                    rarityBoost = CardModule.Properties.cardCategory.gold.rarityBoost;
                }

                var cardData = await CardModule.getCardData(userData.cardIdSelected);

                var cardDataReward = "";
                if(CardModule.Properties.spawnData.battle.id_card_reward in jsonParsedSpawnData){
                    cardDataReward = await CardModule.getCardData(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.id_card_reward]);
                } else {
                    var userSeries = CardModule.Properties.seriesCardCore[userCardData[DBM_Card_User_Data.columns.series_set]].pack;

                    var query = `select *  
                    from ${DBM_Card_Data.TABLENAME} 
                    where ${DBM_Card_Data.columns.rarity}>=? and 
                    ${DBM_Card_Data.columns.series}=? 
                    order by rand() limit 1`;
                    cardDataReward = await DBConn.conn.promise().query(query,[6,userSeries]);
                    cardDataReward = cardDataReward[0][0];
                }
                
                //to check the stock
                var userCardRewardStock = await CardModule.getUserCardStock(userId,cardDataReward[DBM_Card_Data.columns.id_card]);

                var enemyData = await CardModule.Battle.getEnemyData(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.id_enemy]);

                var enemyCategory = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.category];
                var enemyRarity = 0;

                if(CardModule.Properties.spawnData.battle.rarity in jsonParsedSpawnData){
                    enemyRarity = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity];
                } else if(CardModule.Properties.spawnData.battle.rarity_less in jsonParsedSpawnData){
                    enemyRarity = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity_less];
                } else if(CardModule.Properties.spawnData.battle.rarity_more in jsonParsedSpawnData){
                    enemyRarity = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity_more];
                }

                var enemyType = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.type];
                var arrColor = [];
                if(CardModule.Properties.spawnData.battle.color in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color];
                } else if(CardModule.Properties.spawnData.battle.color_non in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_non];
                }

                //check for battle_protection status effect
                //get status effect
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                var captured = false; var specialActivated = false; var teamBattle = false;

                //default point reward
                var pointReward = 10*cardDataReward[DBM_Card_Data.columns.rarity];
                var seriesPointReward = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var selectedSeriesPoint = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;

                var debuffProtection = false; var removePrecure = true; var allowSecondBattle = false;
                var allowSet = false;

                var randDebuffChance = GlobalFunctions.randomNumber(0,10);
                var randomDebuff = null; //return in object
                randDebuffChance = 8; //for debug purpose only
                if(randDebuffChance<=9){
                    randomDebuff = GlobalFunctions.randomProperty(CardModule.StatusEffect.debuffData); //return in object
                }

                var inParty = false;
                //check for party
                var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                var partyPoint = 0; var partyPack = ""; var partySynergy = false;//from the leader by default, if leader has no card set then it'll use the party member

                //check for team battle validation:
                if(enemyCategory==CardModule.Properties.enemySpawnData.tsunagarus.category.boss){
                    teamBattle = true;
                    //check for party synergy
                    var partyTotalData = await CardModule.Party.getAllStatus(partyData[DBM_Card_Party.columns.id]);
                    if(partyTotalData.synergy){partySynergy = true;}
                }

                if(partyData!=null&&teamBattle){
                    inParty = true;
                    partyPoint = partyData[DBM_Card_Party.columns.party_point];
                } else if(partyData==null&&teamBattle){
                    //party validation if boss type
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    };
                    objEmbed.description = `:x: You need to be on a party for this tsunagarus!`;
                    return await message.channel.send({embed:objEmbed});
                }

                //optional command validation
                if(args[1]!=null){
                    var specialAllow = true;
                    
                    //special validation
                    if(CardModule.Properties.spawnData.battle.special_allow in jsonParsedSpawnData){
                        if(!jsonParsedSpawnData[CardModule.Properties.spawnData.battle.special_allow]&&
                            currentStatusEffect!=CardModule.StatusEffect.buffData.special_break.value){
                            specialAllow = false;
                        }
                    }
                    
                    //check for same series from the leader
                    if(args[1].toLowerCase()!="special"&&args[1].toLowerCase()!="charge"&&args[1].toLowerCase()!="scan"){
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        };
                        if(teamBattle){
                            //team battle
                            objEmbed.description = ">Use **p!card battle special** to activate the team attack.\n>Use **p!card battle charge** to charge up the party special attack.\nUse **p!card battle scan <info: color/type/rarity/atk/hp>** to scan the enemy <info>.";
                        } else {
                            //individual
                            objEmbed.description = ">Use **p!card battle special** to activate the team attack.\n>Use **p!card battle charge** to charge up your party special attack.";
                        }
                        
                        return message.channel.send({embed:objEmbed});
                    } else if(args[1].toLowerCase()=="scan"){
                        //scan command
                        if(!teamBattle){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = "You cannot use the **scan** command for this tsunagarus.";
                        } else if(partyPoint<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = ":x: Your party need 1 Party Point to use the scan command.";
                        } else if(args[2]==null||(args[2]!="color"&&args[2]!="type"&&args[2]!="rarity"&&args[2]!="atk"&&args[2]!="hp")){
                            objEmbed.description = "Use one of these <info> that you want to scan: **color**/**type**/**rarity**/**atk**/**hp**.";
                        } else {
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.enemySpawnData.tsunagarus.image[enemyType]
                            };
                            switch(args[2]){
                                case "color":
                                    objEmbed.title = "Color Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus currently have: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].join(",")}** lives.`;
                                    break;
                                case "type":
                                    objEmbed.title = "Enemy Type Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus possesses **${CardModule.Properties.enemySpawnData[enemyData[DBM_Card_Enemies.columns.series].toLowerCase()].term}** power`;
                                    break;
                                case "rarity":
                                    objEmbed.title = "Rarity Scanned!"
                                    objEmbed.description = `1 PP has been used! You need card with minimum rarity of: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]}** for this one.`;
                                    break;
                                case "atk":
                                    objEmbed.title = "Party Atk Scanned!"
                                    objEmbed.description = `1 PP has been used! Your party need: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.atk1]}** atk point.`;
                                    break;
                                case "hp":
                                    objEmbed.title = "Party Hp Scanned!"
                                    objEmbed.description = `1 PP has been used! Your party need: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp1]}** hp.`;
                                    break;
                            }
                            
                            //update the party point
                            await CardModule.Party.updatePartyPoint(partyData[DBM_Card_Party.columns.id],-1);
                        }
                        
                        return message.channel.send({embed:objEmbed});
                    } else if(args[1].toLowerCase()=="charge"){
                        //check if party/individual one
                        //if Properties.spawnData.battle.category
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        };

                        if(teamBattle){
                            var pointSpecial = CardModule.Status.getPartySpecialPointProgress(userCardInventoryData[DBM_Card_Inventory.columns.level],userCardInventoryData[DBM_Card_Inventory.columns.level_special],jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level]);
                            //charge for party
                            objEmbed.title = "Party Special Point Charged!";
                            objEmbed.description = `Your party special point has been charged up by ${pointSpecial}%.`;
                            

                            //update the special point reward
                            var specialCharged = await CardModule.Status.updatePartySpecialPoint(partyData[DBM_Card_Party.columns.id],pointSpecial);
                            if(specialCharged){
                                objEmbed.description += `Your party special point is ready now! You can use the special attack on the next battle spawn.`;
                                // await message.channel.send({embed:CardModule.Embeds.battleSpecialReady(userUsername,userAvatarUrl,false)}); //announce the special ready
                            }
                            await message.channel.send({embed:objEmbed});
                        } else {
                            var pointSpecial = CardModule.Status.getSpecialPointProgress(userCardInventoryData[DBM_Card_Inventory.columns.level],userCardInventoryData[DBM_Card_Inventory.columns.level_special],jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level]);

                            //charge individual
                            objEmbed.title = "Special Point Charged!";
                            objEmbed.description = `Your special point has been charged up by ${pointSpecial}%.`;
                            await message.channel.send({embed:objEmbed});

                            //update the special point reward
                            var specialCharged = await CardModule.Status.updateSpecialPoint(userId,pointSpecial);
                            if(specialCharged){
                                objEmbed.description += `Your special point is ready now! You can use the special attack on the next battle spawn.`;
                                // await message.channel.send({embed:CardModule.Embeds.battleSpecialReady(userUsername,userAvatarUrl)}); //announce the special ready
                            }
                        }
                        
                        //update the battle token
                        await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        return;
                    } else if(currentStatusEffect==CardModule.StatusEffect.debuffData.specialock.value&&args[1].toLowerCase()=="special"){
                        //specialock debuff
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                        return message.channel.send({embed:embedStatusActivated});
                    } else if(!teamBattle&&userCardData[DBM_Card_User_Data.columns.special_point]<100&&args[1].toLowerCase()=="special"){
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };
                        objEmbed.description = ":x: Your special point is not fully charged yet!";
                        return message.channel.send({embed:objEmbed});
                    } else if(teamBattle&&partyData[DBM_Card_Party.columns.special_point]<100&&args[1].toLowerCase()=="special") {
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };
                        objEmbed.description = ":x: Your party special point is not fully charged yet!";
                        return message.channel.send({embed:objEmbed});
                    } else if(teamBattle&&!partySynergy&&args[1].toLowerCase()=="special") {
                        //check for special synergy
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };
                        objEmbed.title = "Non Synergy!";
                        objEmbed.description = "Your party is not on synergy and can't use the team attack!";
                        return message.channel.send({embed:objEmbed});
                    } else if(specialAllow&&teamBattle&&partySynergy&&
                        partyTotalData.synergy_series!=enemyData[DBM_Card_Enemies.columns.series]&&
                        args[1].toLowerCase()=="special") {
                        //check for special synergy
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };

                        objEmbed.title = "Battle Lost: Special Countered!";
                        //reset party special point
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Party.columns.special_point,0);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Party.columns.id,partyData[DBM_Card_Party.columns.id]);
                        await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);

                        //erase the set token
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.card_set_token,spawnedCardData.token);
                        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        objEmbed.description = "Oh no, the team attack has been countered by the tsunagarus and you've instantly defeated! Your party special point has dropped into 0%!";

                        return message.channel.send({embed:objEmbed});
                    } else if(!specialAllow) {
                        //special countered
                        //remove the precure avatar
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                        //update the capture attempt
                        await CardModule.updateCatchAttempt(userId,spawnedCardData.token);

                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };

                        objEmbed.title = "Battle Lost: Special Countered!";
                        if(teamBattle){
                            //reset party special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_Party.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_Party.columns.id,partyData[DBM_Card_Party.columns.id]);
                            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);

                            //erase the set token
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_set_token,spawnedCardData.token);
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                            objEmbed.description = "Oh no, the team attack has been countered by the tsunagarus and you've instantly defeated! Your party special point has dropped into 0%!";
                        } else {
                            //reset the special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            parameterSet.set(DBM_Card_User_Data.columns.card_set_token,spawnedCardData.token);
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                            //erase the set token
                            objEmbed.description = "Oh no, your special has been countered by the tsunagarus and you've instantly defeated! Your special point has dropped into 0%!";
                        }

                        return message.channel.send({embed:objEmbed});
                    } else {
                        //special activation with special break
                        if(currentStatusEffect==CardModule.StatusEffect.buffData.special_break.value){
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await message.channel.send({embed:embedStatusActivated});
    
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                    }
                                }
                            }
                        }

                        captured = true; specialActivated = true;

                        if(teamBattle){
                            //activate team attack
                            //reset party special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_Party.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_Party.columns.id,partyData[DBM_Card_Party.columns.id]);
                            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
                        } else {
                            //activate individual special
                            var level_special = userCardInventoryData[DBM_Card_Inventory.columns.level_special];

                            //reset the special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        }

                    }
                }

                var level = userCardInventoryData[DBM_Card_Inventory.columns.level];
                var level_special = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var enemyLevel = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level];
                var bonusDropRate = CardModule.Status.getBonusDropRate(userCardInventoryData[DBM_Card_Inventory.columns.level_special]);
                var colorTaken = "";//for boss
                
                switch(enemyType){
                    case CardModule.Properties.enemySpawnData.tsunagarus.term.dibosu:
                        //check for rarity boost
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if(currentStatusEffect.includes(`rarity_up_`)){
                                //check for rarity boost
                                if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                    await message.channel.send({embed:embedStatusActivated});

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }
                        } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if(currentStatusEffect.includes(`rarity_down_`)){
                                //check for rarity boost
                                if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        }

                        captured = true;
                        if(!specialActivated){
                            if(CardModule.Properties.spawnData.battle.rarity_less in jsonParsedSpawnData&&
                            cardData[DBM_Card_Data.columns.rarity]+rarityBoost>=enemyRarity){
                                captured = false;
                            }
                            
                            if(CardModule.Properties.spawnData.battle.rarity_more in jsonParsedSpawnData&&
                                cardData[DBM_Card_Data.columns.rarity]+rarityBoost<=enemyRarity){
                                captured = false;
                            }

                            if(CardModule.Properties.spawnData.battle.color in jsonParsedSpawnData&&
                                (!arrColor.includes(cardData[DBM_Card_Data.columns.color]))){
                                captured = false;
                            }

                            if(CardModule.Properties.spawnData.battle.color_non in jsonParsedSpawnData&&
                                (arrColor.includes(cardData[DBM_Card_Data.columns.color]))){
                                captured = false;
                            }
                        }

                        break;
                    case CardModule.Properties.enemySpawnData.tsunagarus.term.buttagiru:
                        var minChance = 0;
                        var partyTotalData = await CardModule.Party.getAllStatus(partyData[DBM_Card_Party.columns.id]);

                        if(specialActivated){
                            captured = true;
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives] = [];
                        } else {
                            //check for rarity buff
                            if(partyTotalData.status_effect in CardModule.StatusEffect.partyBuffData){
                                if(CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value.includes(`party_rarity_up_`)){
                                    //check for rarity boost
                                    if("value_rarity_boost" in CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect]){
                                        cardData[DBM_Card_Data.columns.rarity]+=CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value_rarity_boost;
                                    }
                                } else if(CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value.includes(`party_atk_up_`)){
                                    //check for rarity boost
                                    if("value_atk_boost" in CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect]){
                                        partyTotalData.atk+=CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value_atk_boost;
                                    }
                                } else if(CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value.includes(`party_hp_up_`)){
                                    //check for rarity boost
                                    if("value_hp_boost" in CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect]){
                                        partyTotalData.hp+=CardModule.StatusEffect.partyBuffData[partyTotalData.status_effect].value_hp_boost;
                                    }
                                }

                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,partyTotalData.status_effect,"buff",true);
                                await message.channel.send({embed:embedStatusActivated});
                            }

                            if((jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].includes(cardData[DBM_Card_Data.columns.color])&&cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()&&
                            cardData[DBM_Card_Data.columns.rarity]+rarityBoost>=enemyRarity)){
                                //check for atk
                                if(partyTotalData.atk<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.atk1]){
                                    minChance+=50;
                                }

                                //check for hp
                                if(partyTotalData.hp<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp1]){
                                    minChance+=50;
                                }

                                var selectedIndex = 0;
                                var randomChance = GlobalFunctions.randomNumber(1,99);
                                if(randomChance>=minChance){
                                    for(var i=0;i<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].length;i++){
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][i]==
                                            cardData[DBM_Card_Data.columns.color]){
                                                selectedIndex = i;
                                        }
                                    }
                                    captured = true;

                                    colorTaken = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][selectedIndex];
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].splice(selectedIndex,1);
                                }
                            }
                        }

                        if(captured){
                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].length>=1){
                                //enemy still alive
                                //update the spawn data
                                var parameterSet = new Map();
                                parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                                var parameterWhere = new Map();
                                parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                                await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
                            } else {
                                await CardModule.removeCardGuildSpawn(guildId);
                            }

                            //update the catch attempt token
                            await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        }

                        break;
                    case CardModule.Properties.enemySpawnData.tsunagarus.term.chiguhaguu:
                    case CardModule.Properties.enemySpawnData.tsunagarus.term.gizzagizza:
                        //check for rarity boost
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if(currentStatusEffect.includes(`rarity_up_`)){
                                //check for rarity boost
                                if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                    await message.channel.send({embed:embedStatusActivated});

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }
                        } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if(currentStatusEffect.includes(`rarity_down_`)){
                                //check for rarity boost
                                if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        }

                        if(specialActivated||(arrColor.includes(cardData[DBM_Card_Data.columns.color])&&
                        cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()&&
                        cardData[DBM_Card_Data.columns.rarity]+rarityBoost>=enemyRarity)){
                            captured = true;
                        }
                        break;
                    default:
                        //chokkins:
                        var minChance = 100-20;//default chance
        
                        var msgContent = "";
                        var duplicate = true;
        
                        var hp = cardData[DBM_Card_Data.columns.max_hp];
                        hp = CardModule.Status.getHp(level,hp);
                        var atk = cardData[DBM_Card_Data.columns.max_atk];
                        atk = CardModule.Status.getAtk(level,atk);
                        // console.log(`HP: ${hp}`);
                        // console.log(`ATK: ${atk}`);
                        // {"id_enemy":"SPC07","level":2,"color":["pink","blue"],"id_card_reward":"yuni701","rarity":3,"special_allow":false,"atk1":96,"atk2":139,"hp1":47,"hp2":98,"hp3":133}
                        if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()){
                            //calculate series buff: -5%
                            minChance-=5;
                        }
                        if(arrColor.includes(cardData[DBM_Card_Data.columns.color])){
                            //calculate color buff: +5%
                            minChance-=5;
                        }
        
                        //check for rarity boost
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if(currentStatusEffect.includes(`rarity_up_`)){
                                //check for rarity boost
                                if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                    await message.channel.send({embed:embedStatusActivated});

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }
                        } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if(currentStatusEffect.includes(`rarity_down_`)){
                                //check for rarity boost
                                if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    cardData[DBM_Card_Data.columns.rarity]-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        }
        
                        if(cardData[DBM_Card_Data.columns.rarity]+rarityBoost>=enemyRarity){
                            //calculate rarity buff: +10%
                            minChance-=10;
                        }
        
                        //calculate level buff: +1%/each level
                        minChance-=(1*level);
                        enemyLevel = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level];
        
                        //calculate attack buff:
                        var atk1 = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.atk1];
                        var atk2 = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.atk2];
                        // console.log(`<${rndAtk1}`);
                        // console.log(`${rndAtk1+1}-${rndAtk2}`);
                        // console.log(`>${rndAtk2+1}`);

                        //check for atk boost
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if(currentStatusEffect.includes(`atk_up_`)){
                                //check for rarity boost
                                if("value_atk_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    atk+=CardModule.StatusEffect.buffData[currentStatusEffect].value_atk_boost;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if(currentStatusEffect.includes(`atk_down_`)){
                                //check for rarity boost
                                if("value_atk_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    atk-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_atk_down;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not 
                                if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        }

                        if(atk>=atk2+1){
                            minChance-=15;
                        } else if(atk<=atk2&&atk>=atk1+1){
                            minChance-=10;
                        } else {
                            minChance-=5;
                        }
        
                        //calculate hp buff:
                        var hp1 = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp1];
                        var hp2 = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp2];
                        var hp3 = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp3];
        
                        //check for hp boost
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if(currentStatusEffect.includes(`hp_up_`)){
                                //check for rarity boost
                                if("value_hp_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    hp+=CardModule.StatusEffect.buffData[currentStatusEffect].value_hp_boost;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if(currentStatusEffect.includes(`hp_down_`)){
                                //check for rarity boost
                                if("value_hp_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    hp-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_hp_down;
        
                                    var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                    await message.channel.send({embed:embedStatusActivated});
                                }

                                //check if SE permanent/not
                                if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    }
                                }
                            }
                        }
        
                        // console.log(`<${rndHp1}`);
                        // console.log(`${rndHp1+1}-${rndHp2}`);
                        // console.log(`${rndHp2+1}-${rndHp3}`);
                        if(hp>=hp2+1&&hp<=hp3){
                            minChance+=3;
                        } else if(hp>=hp1+1&&hp<=hp2){
                            minChance+=5;
                        } else if(hp<hp1){
                            minChance+=10;
                        }
        
                        var chance = GlobalFunctions.randomNumber(0,100);
                        if(chance>=minChance){
                            captured = true;
                        }
        
                        // captured = true; //for debugging purpose!

                        break;
                }

                //add new card/update card stock & check for card completion
                var rewardsReceived = "";

                if(teamBattle){
                    //team battle
                    if(captured){
                        //team battle win
                        //randomize card fragment
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? 
                        ORDER BY rand() LIMIT 1`;
                        var fragmentDropData = await DBConn.conn.promise().query(query,["misc_fragment"]);
                        fragmentDropData = fragmentDropData[0][0];
                        rewardsReceived+=`>Item: ${fragmentDropData[DBM_Item_Data.columns.name]} **(${fragmentDropData[DBM_Item_Data.columns.id]})**\n`;
    
                        //check for item drop chance
                        var itemDropRareChance = GlobalFunctions.randomNumber(0,100);

                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE (${DBM_Item_Data.columns.category}=? OR 
                        ${DBM_Item_Data.columns.category}=?) AND 
                        ${DBM_Item_Data.columns.drop_rate}<=? 
                        ORDER BY rand() 
                        LIMIT 1`;
                        var itemDropData = await DBConn.conn.promise().query(query,["ingredient","ingredient_rare",itemDropRareChance]);
                        if(itemDropData[0][0]!=null){
                            rewardsReceived+=`>Item: ${itemDropData[0][0][DBM_Item_Data.columns.name]} **(${itemDropData[0][0][DBM_Item_Data.columns.id]})**\n`;
                        }
    
                        //put all the rewards:
                        rewardsReceived+=`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                        rewardsReceived+=`>${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                        
                        //update the mofucoin
                        var mofucoinReward = Math.round(pointReward/3);
                        if(mofucoinReward<=0){
                            mofucoinReward = 20;
                        }
                        rewardsReceived+=`>${mofucoinReward} mofucoin\n`
                        
                        //update the party special point
                        var specialCharged = false;
                        if(!specialActivated){
                            //update the special point reward
                            var pointSpecial = CardModule.Status.getPartySpecialPointProgress(level,level_special,enemyLevel);
                            specialCharged = await CardModule.Status.updatePartySpecialPoint(partyData[DBM_Card_Party.columns.id],pointSpecial);
                            rewardsReceived+=`>**${pointSpecial}**% special points\n`;
                        }
    
                        //update the color point
                        var objColor = new Map();
                        objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);

                        //update the series point:
                        var objSeries = new Map();
                        objSeries.set(selectedSeriesPoint,seriesPointReward);

                        //add rewards to leader
                        await ItemModule.addNewItemInventory(partyData[DBM_Card_Party.columns.id_user],fragmentDropData[DBM_Item_Data.columns.id],1);
                        await ItemModule.addNewItemInventory(partyData[DBM_Card_Party.columns.id_user],itemDropData[0][0][DBM_Item_Data.columns.id],1);
                        await CardModule.updateMofucoin(partyData[DBM_Card_Party.columns.id_user],mofucoinReward);
                        await CardModule.updateColorPoint(partyData[DBM_Card_Party.columns.id_user],objColor);
                        await CardModule.updateSeriesPoint(partyData[DBM_Card_Party.columns.id_user],objSeries);

                        var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
                        for(var i=0;i<splittedUserId.length;i++){
                            //add rewards to all members
                            await ItemModule.addNewItemInventory(splittedUserId[i],fragmentDropData[DBM_Item_Data.columns.id],1);
                            await ItemModule.addNewItemInventory(splittedUserId[i],itemDropData[0][0][DBM_Item_Data.columns.id],1);
                            await CardModule.updateMofucoin(splittedUserId[i],mofucoinReward);
                            await CardModule.updateColorPoint(splittedUserId[i],objColor);
                            await CardModule.updateSeriesPoint(splittedUserId[i],objSeries);
                        }

                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives].length>0){
                            //lives still remained
                            message.channel.send({embed:CardModule.Embeds.teamBattleHit(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],partyData[DBM_Card_Party.columns.name],colorTaken,rewardsReceived)});
                        } else {
                            //battle win
                            rewardsReceived+=`>Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**`;

                            //adds up the card to leader
                            var userCardRewardStock = await CardModule.getUserCardStock(partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card]);
                            if(userCardRewardStock<=-1){
                                await CardModule.addNewCardInventory(partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card]);
                            } else if(userCardRewardStock<CardModule.Properties.maximumCard){
                                await CardModule.addNewCardInventory(partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card],true);
                            }

                            //check leader card pack completion:
                            var embedCompletion = null;
                            var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,partyData[DBM_Card_Party.columns.id_user],"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                            var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,partyData[DBM_Card_Party.columns.id_user],"color",cardDataReward[DBM_Card_Data.columns.color]);
                            var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,partyData[DBM_Card_Party.columns.id_user],"series",cardDataReward[DBM_Card_Data.columns.series]);
        
                            if(checkCardCompletionPack){
                                //card pack completion
                                embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                                if(embedCompletion!=null){
                                    await message.channel.send({embed:embedCompletion});
                                }
                            }
                            
                            if(checkCardCompletionColor) {
                                //color set completion
                                embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                                if(embedCompletion!=null){
                                    await message.channel.send({embed:embedCompletion});
                                }
                            }
        
                            if(checkCardCompletionSeries) {
                                //color set completion
                                embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                                if(embedCompletion!=null){
                                    await message.channel.send({embed:embedCompletion});
                                }
                            }

                            //adds up card to all members
                            var splittedUserId = partyData[DBM_Card_Party.columns.party_data].split(",");
                            for(var i=0;i<splittedUserId.length;i++){
                                var userCardRewardStock = await CardModule.getUserCardStock(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card]);
                                if(userCardRewardStock<=-1){
                                    await CardModule.addNewCardInventory(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card]);
                                } else if(userCardRewardStock<CardModule.Properties.maximumCard){
                                    await CardModule.addNewCardInventory(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card],true);
                                }

                                //check all member card completion:
                                var embedCompletion = null;
                                var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                                var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"color",cardDataReward[DBM_Card_Data.columns.color]);
                                var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"series",cardDataReward[DBM_Card_Data.columns.series]);

                                if(checkCardCompletionPack){
                                    //card pack completion
                                    embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                                    if(embedCompletion!=null){
                                        await message.channel.send({embed:embedCompletion});
                                    }
                                }

                                if(checkCardCompletionColor) {
                                    //color set completion
                                    embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                                    if(embedCompletion!=null){
                                        await message.channel.send({embed:embedCompletion});
                                    }
                                }

                                if(checkCardCompletionSeries) {
                                    //color set completion
                                    embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                                    if(embedCompletion!=null){
                                        await message.channel.send({embed:embedCompletion});
                                    }
                                }

                            }

                            if(specialActivated){
                                message.channel.send({embed:CardModule.Embeds.teamBattleSpecialActivated(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.pack],partyData[DBM_Card_Party.columns.name],rewardsReceived)});
                            } else {
                                message.channel.send({embed:CardModule.Embeds.teamBattleWin(cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.series],partyData[DBM_Card_Party.columns.name],rewardsReceived)});
                            }

                            //erase the spawn data
                            await CardModule.removeCardGuildSpawn(guildId);
                        }

                    } else {
                        //team battle defeated
                        pointReward = Math.round(pointReward/2)-10;
                        if(pointReward<=0){ pointReward = 20; }
                        //update the catch token & color points
                        var objColor = new Map();
                        objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                        await CardModule.updateColorPoint(userId,objColor);

                        //check for buff
                        switch(currentStatusEffect){
                            case CardModule.StatusEffect.buffData.battle_protection.value:
                                allowSet = true;
                                allowSecondBattle = true;
                                debuffProtection = true;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                            case CardModule.StatusEffect.buffData.precure_protection.value:
                                allowSecondBattle = true;
                                removePrecure = false;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                            case CardModule.StatusEffect.buffData.debuff_protection_1.value:
                            case CardModule.StatusEffect.buffData.debuff_protection_2.value:
                                debuffProtection = true;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                        }

                        objEmbed.title = "Battle Lost";
                        var txtDescription = "";
                        if(removePrecure){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            txtDescription = `:x: Oh no! <@${userId}> has lost from the battle and lost the precure avatar power!`;
                            //remove the precure avatar
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        } else {
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            txtDescription = `:x: Oh no! <@${userId}> has lost from the battle!`;
                        }

                        if(allowSet){
                            //erase the card set token
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_set_token,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        }

                        //check for second battle allowance
                        if(!allowSecondBattle){
                            //update the spawn token
                            await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        }

                        //activate the debuff if user doesn't have debuff protection
                        var debuff_data = "";
                        if(!debuffProtection&&randomDebuff!=null){
                            await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                            debuff_data = randomDebuff.value;
                        }

                        await message.channel.send({embed:CardModule.Embeds.battleLost(userUsername,userAvatarUrl,txtDescription,`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,debuff_data)});

                        // objEmbed.description += `You have received some rewards from the battle.`;
                        // objEmbed.fields = [
                        //     {
                        //         name:"Rewards Received:",
                        //         value:`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,
                        //         inline:false
                        //     }
                        // ]
                        // await message.channel.send({embed:objEmbed});

                        //check if buff status effect is permanent/not
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                    await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                }
                            }
                        }
                    }
                } else {
                    //individual
                    var duplicate = true;
                    if(captured){
                        //stock validation
                        if(userCardRewardStock<=-1){
                            // objEmbed.description = `<@${userId}> has received new card!`;
                            rewardsReceived+=`>New Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                            
                            //add new card:
                            await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card]);
                            duplicate = false;
                        } else {
                            if(userCardRewardStock<CardModule.Properties.maximumCard){
                                // objEmbed.description = `<@${userId}> has received another duplicate card.`;
                                rewardsReceived+=`>Duplicate Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                                
                                userCardRewardStock+=1;
                                //add new card:
                                await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card],true);
                            } else {
                                //cannot add more card
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.author = {
                                    name:userUsername,
                                    iconURL:userAvatarUrl
                                }
                                // objEmbed.description = `:x: Sorry <@${userId}>, you cannot received another duplicate card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**.`;
                                //update the token & color point
                                var objColor = new Map();
                                objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                                await CardModule.updateCatchAttempt(userId,
                                    spawnedCardData.token,
                                    objColor
                                );
                                rewardsReceived+=`Duplicate Card (Full): **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                                // return message.channel.send({embed:objEmbed});
                            }
                        }
    
                        //check for item drop chance
                        var itemDropChance = GlobalFunctions.randomNumber(0,7);
                        // itemDropChance = 10; //for debug purpose only
                        if(itemDropChance<=7){
                            //check for rare item drop chance
                            var itemDropRareChance = GlobalFunctions.randomNumber(0,100)+bonusDropRate;
    
                            var query = `SELECT * 
                            FROM ${DBM_Item_Data.TABLENAME} 
                            WHERE (${DBM_Item_Data.columns.category}=? OR 
                            ${DBM_Item_Data.columns.category}=?) AND 
                            ${DBM_Item_Data.columns.drop_rate}<=? 
                            ORDER BY rand() 
                            LIMIT 1`;
                            var itemDropData = await DBConn.conn.promise().query(query,["ingredient","ingredient_rare",itemDropRareChance]);
                            if(itemDropData[0][0]!=null){
                                // var embedItemReward = ItemModule.Embeds.ItemDropReward(userUsername,userAvatarUrl,itemDropData[0][0][DBM_Item_Data.columns.id],itemDropData[0][0][DBM_Item_Data.columns.name],itemDropData[0][0][DBM_Item_Data.columns.description]);
                                // await message.channel.send({embed:embedItemReward});
    
                                rewardsReceived+=`>Item: ${itemDropData[0][0][DBM_Item_Data.columns.name]} **(${itemDropData[0][0][DBM_Item_Data.columns.id]})**\n`;
    
                                //check for item stock:
                                var userItemStock = await ItemModule.getUserItemStock(userId,itemDropData[0][0][DBM_Item_Data.columns.id]);
                                if(userItemStock<=-1){
                                    await ItemModule.addNewItemInventory(userId,itemDropData[0][0][DBM_Item_Data.columns.id]);
                                } else {
                                    await ItemModule.updateItemStock(userId,itemDropData[0][0][DBM_Item_Data.columns.id],1);
                                }
                            }
                        }
    
                        //put all the rewards:
                        rewardsReceived+=`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                        rewardsReceived+=`>${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                        
                        //update the mofucoin
                        var mofucoinReward = Math.round(pointReward/3);
                        if(mofucoinReward<=0){
                            mofucoinReward = 20;
                        }
                        await CardModule.updateMofucoin(userId,mofucoinReward);
                        rewardsReceived+=`>${mofucoinReward} mofucoin\n`
    
                        var specialCharged = false;
                        if(!specialActivated){
                            //update the special point reward
                            var pointSpecial = CardModule.Status.getSpecialPointProgress(level,level_special,enemyLevel);
                            specialCharged = await CardModule.Status.updateSpecialPoint(userId,pointSpecial);
                            rewardsReceived+=`>**${pointSpecial}**% special points\n`;
                        }
    
                        //update the token & color point
                        var objColor = new Map();
                        objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                        await CardModule.updateCatchAttempt(userId,
                            spawnedCardData.token,
                            objColor
                        );

                        //update the series point:
                        var objSeries = new Map();
                        objSeries.set(selectedSeriesPoint,seriesPointReward);
                        await CardModule.updateSeriesPoint(userId,objSeries);
    
                        // objEmbed.title = "Battle Rewards";
                        // objEmbed.fields = [
                        //     {
                        //         name:"Rewards Received:",
                        //         value:rewardsReceived,
                        //         inline:false
                        //     }
                        // ]

                        if(!specialActivated){
                            //battle win
                            message.channel.send({embed:CardModule.Embeds.battleWin(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],rewardsReceived)});
                        } else {
                            //special attack embed
                            await message.channel.send({embed:CardModule.Embeds.battleSpecialActivated(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],level_special,rewardsReceived)});
                        }
    
                        //get the current card total
                        var currentTotalCard = await CardModule.getUserTotalCard(userId,cardDataReward[DBM_Card_Data.columns.pack]);
                        // await message.channel.send({embed:objEmbed}); //announce the reward
                        
                        if(!duplicate){
                            await message.channel.send({embed:CardModule.embedCardCapture(cardDataReward[DBM_Card_Data.columns.color],cardDataReward[DBM_Card_Data.columns.id_card],cardDataReward[DBM_Card_Data.columns.pack],cardDataReward[DBM_Card_Data.columns.name],cardDataReward[DBM_Card_Data.columns.img_url],cardDataReward[DBM_Card_Data.columns.series],cardDataReward[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardDataReward[DBM_Card_Data.columns.max_hp],cardDataReward[DBM_Card_Data.columns.max_atk],userCardRewardStock)});
                        }

                        if(specialCharged){
                            await message.channel.send({embed:CardModule.Embeds.battleSpecialReady(userUsername,userAvatarUrl)}); //announce the special ready
                        }
    
                        //check card pack completion:
                        var embedCompletion = null;
                        var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                        var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",cardDataReward[DBM_Card_Data.columns.color]);
                        var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",cardDataReward[DBM_Card_Data.columns.series]);
    
                        if(checkCardCompletionPack){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }
                        
                        if(checkCardCompletionColor) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }
    
                        if(checkCardCompletionSeries) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }
    
                        //check for enemy revival/erase the card guild spawn
                        var reviveChance = GlobalFunctions.randomNumber(1,10);
                        if(duplicate&&reviveChance<=7){
                            var enemyRevivalEmbed = {
                                color: CardModule.Properties.embedColor,
                                title: `Tsunagarus Respawned!`,
                                description: `Looks like the tsunagarus has been respawned again!`,
                                fields:{
                                    name:'Spawn Link:',
                                    value:`[Jump to spawn link](${GlobalFunctions.discordMessageLinkFormat(guildId,guildSpawnData[DBM_Card_Guild.columns.id_channel_spawn],guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn])})`
                                },
                                thumbnail:{
                                    url:CardModule.Properties.imgResponse.imgFailed
                                },
                                image:{
                                    url:CardModule.Properties.enemySpawnData.tsunagarus.image[enemyType]
                                }
                            };
                            await message.channel.send({embed:enemyRevivalEmbed});
                        } else {
                            await CardModule.removeCardGuildSpawn(guildId);
                        }
    
                    } else {
                        //failed to defeat the enemy
                        //halves the point reward
                        pointReward = Math.round(pointReward/2)-10;
                        if(pointReward<=0){
                            pointReward = 20;
                        }
                        //update the catch token & color points
                        var objColor = new Map();
                        objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                        await CardModule.updateColorPoint(userId,objColor);

                        //check for buff
                        switch(currentStatusEffect){
                            case CardModule.StatusEffect.buffData.battle_protection.value:
                                allowSet = true;
                                allowSecondBattle = true;
                                debuffProtection = true;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                            case CardModule.StatusEffect.buffData.precure_protection.value:
                                allowSecondBattle = true;
                                removePrecure = false;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                            case CardModule.StatusEffect.buffData.debuff_protection_1.value:
                            case CardModule.StatusEffect.buffData.debuff_protection_2.value:
                                debuffProtection = true;
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                await message.channel.send({embed:embedStatusActivated});
                                break;
                        }

                        var txtDescription = "";
                        if(removePrecure){
                            txtDescription = `:x: Oh no! <@${userId}> has lost from the battle and lost the precure avatar power!`;
                            //remove the precure avatar
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        } else {
                            txtDescription = `:x: Oh no! <@${userId}> has lost from the battle!`;
                        }

                        if(allowSet){
                            //erase the card set token
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_set_token,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        }

                        //check for second battle allowance
                        if(!allowSecondBattle){
                            //update the spawn token
                            await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        }

                        txtDescription += `You have received some rewards from the battle.`;

                        //activate the debuff if user doesn't have debuff protection
                        var debuff_data = "";
                        if(!debuffProtection&&randomDebuff!=null){
                            await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                            debuff_data = randomDebuff.value;
                            // await message.channel.send({embed:embedStatusActivated});
                        }

                        await message.channel.send({embed:CardModule.Embeds.battleLost(userUsername,userAvatarUrl,txtDescription,`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,debuff_data)});

                        //check if buff status effect is permanent/not
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                    await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                }
                            }
                        }
                    }
                }
                

                break;
            
            case "spawn":
                //get card spawn information
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type]
                }
                var channelSpawnId = guildSpawnData[DBM_Card_Guild.columns.id_channel_spawn];
                
                //for countdown timer
                var minutes = GlobalFunctions.str_pad_left(Math.floor(CardGuildModule.arrTimerGuildInformation[guildId].remaining / 60),'0',2);
                var seconds = GlobalFunctions.str_pad_left(CardGuildModule.arrTimerGuildInformation[guildId].remaining - minutes * 60,'0',2);
                var timerLeft = `**${minutes}:${seconds}**`;

                var currentSpawnType = "normal";
                if(spawnedCardData.token!=null&&
                    spawnedCardData.type!=null){
                    switch(spawnedCardData.type.toLowerCase()) {
                        case "color":
                            currentSpawnType = "color";
                            break;
                        case "battle":
                            currentSpawnType = "battle";
                            break;
                        case "number":
                            currentSpawnType = ":game_die: number";
                            break;
                        case "quiz":
                            currentSpawnType = ":grey_question: quiz";
                            break;
                    }
                    
                } else {
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        fields : [
                            {
                                name:'Next Spawn Countdown:',
                                value:timerLeft,
                                inline:true
                            }
                        ],
                        description :':x: There are no Precure cards spawning right now.'
                    }
                    return message.channel.send({embed:objEmbed});
                }

                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    title: `Card Spawn Information`,
                    description : `Here are the current card spawn information that is available now:`,
                    fields : [
                        {
                            name:'Type:',
                            value:currentSpawnType,
                            inline:true
                        },
                        {
                            name:'Countdown:',
                            value:timerLeft,
                            inline:true
                        },
                        {
                            name:'Link:',
                            value:`[Jump to spawn](${GlobalFunctions.discordMessageLinkFormat(guildId,channelSpawnId,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn])})`,
                            inline:true
                        }
                    ]
                };
                return message.channel.send({embed:objEmbed});
                break;
            case "tradeboard":
                if(args[1]==null||(args[1]!="search"&&args[1]!="post"&&args[1]!="trade"&&args[1]!="remove")){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : `-Search the tradeboard listing with: **p!card tradeboard search <card id>**\n-Post your trade card offer with :**p!card tradeboard post <card id that you want> <card id>**\n-Confirm the trade process with **p!card tradeboard trade <trade id>**\n-Remove your trade listing with: **p!card tradeboard remove**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                switch(args[1].toLowerCase()){
                    case "post":
                        var cardIdReceive = args[2];
                        var cardIdSend = args[3];

                        //parameter validation
                        if(cardIdReceive==null||cardIdSend==null){
                            return message.channel.send("Post your trade card offer with :**p!card tradeboard post <card id that you want> <card id>**");
                        }

                        //lowercase the card id
                        cardIdReceive = cardIdReceive.toLowerCase();
                        cardIdSend = cardIdSend.toLowerCase();

                        //check if cardIdReceive exists on db/not
                        var cardDataReceive = await CardModule.getCardData(cardIdReceive);
                        var cardDataSend = await CardModule.getCardData(cardIdSend);
                        if(cardDataReceive==null||cardDataSend==null){
                            //check if card available/not
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, I can't find one of the card Id.`
                            };
                            return message.channel.send({embed:objEmbed});
                        } else if(cardDataReceive[DBM_Card_Data.columns.rarity]>5||cardDataSend[DBM_Card_Data.columns.rarity]>5){
                            //check if card rarity 1-5
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, you can only post the trade listing for card rarity within **1-5**⭐.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        //check if user have the dupe card/not
                        var itemStock = await CardModule.getUserCardStock(userId,cardIdSend);
                        if(itemStock<=0){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                author:{
                                    iconURL:userAvatarUrl,
                                    name:userUsername
                                },
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, you don't have another duplicate of: **${cardIdSend} - ${cardDataReceive[DBM_Card_Data.columns.name]}** yet.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        //for initialization if not exists & get the trade id
                        var tradeData = await CardModule.TradeBoard.getTradeboardData(guildId,userId);

                        //update the trade listing
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_want,cardIdReceive);
                        parameterSet.set(DBM_Card_Tradeboard.columns.id_card_have,cardIdSend);
                        parameterSet.set(DBM_Card_Tradeboard.columns.last_update,GlobalFunctions.getCurrentDateTime());
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,guildId);
                        parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,userId);
                        await DB.update(DBM_Card_Tradeboard.TABLENAME,parameterSet,parameterWhere);

                        return message.channel.send({embed:{
                            color: CardModule.Properties.embedColor,
                            title: `Trade Listing Updated!`,
                            author:{
                                iconURL:userAvatarUrl,
                                name:userUsername
                            },
                            description : `<@${userId}> has post/update the trade offer listing on tradeboard with trade id: **${tradeData[DBM_Card_Tradeboard.columns.id]}**!`,
                            fields:[
                            {
                                name:`Looking For: ${cardDataReceive[DBM_Card_Data.columns.rarity]}⭐ ${cardDataReceive[DBM_Card_Data.columns.pack]}`,
                                value:`${cardDataReceive[DBM_Card_Data.columns.id_card]} - ${cardDataReceive[DBM_Card_Data.columns.name]}`,
                                inline:true
                            },
                            {
                                name:`Will Trade: ${cardDataSend[DBM_Card_Data.columns.rarity]}⭐${cardDataSend[DBM_Card_Data.columns.pack]}`,
                                value:`${cardDataSend[DBM_Card_Data.columns.id_card]} - ${cardDataSend[DBM_Card_Data.columns.name]}`,
                                inline:true
                            }],
                            footer:{
                                text:`Trade ID: ${tradeData[DBM_Card_Tradeboard.columns.id]} | Last Update: ${GlobalFunctions.getCurrentDateTime()}`
                            }
                        }});

                        break;
                    case "search":
                        var cardIdReceive = args[2];

                        //parameter validation
                        if(cardIdReceive==null){
                            return message.channel.send("Search the tradeboard listing with: **p!card tradeboard search <card id>**");
                        }

                        //lowercase the card id
                        cardIdReceive = cardIdReceive.toLowerCase();

                        //check if cardIdReceive exists on db/not
                        var cardDataReceive = await CardModule.getCardData(cardIdReceive);
                        if(cardDataReceive==null){
                            //check if card available/not
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: Sorry, I can't find that card Id.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }
                        
                        //search the top 10 listing
                        var query = `SELECT * 
                        FROM ${DBM_Card_Tradeboard.TABLENAME} 
                        WHERE ${DBM_Card_Tradeboard.columns.id_guild}=? AND 
                        ${DBM_Card_Tradeboard.columns.id_user}<>? AND 
                        ${DBM_Card_Tradeboard.columns.id_card_have}=? AND 
                        ${DBM_Card_Tradeboard.columns.last_update}+INTERVAL 7 DAY>=CURDATE() 
                        ORDER BY ${DBM_Card_Tradeboard.columns.last_update} DESC 
                        LIMIT 10`;
                        // var parameterWhere = new Map();
                        // parameterWhere.set(DBM_Card_Tradeboard.columns.id_guild,guildId);
                        // parameterWhere.set(DBM_Card_Tradeboard.columns.id_user,userId);
                        // parameterWhere.set(DBM_Card_Tradeboard.columns.id_card_have,cardIdReceive);
                        var result = await DBConn.conn.promise().query(query, [guildId,userId,cardIdReceive]);
                        if(result[0].length<=0){
                            return message.channel.send(`:x: I can't find any available trade listing for: **${cardDataReceive[DBM_Card_Data.columns.id_card]} - ${cardDataReceive[DBM_Card_Data.columns.name]}**`);
                        } else {
                            var contentId = ""; var contentUsernameWant = ""; var contentWant = "";
                            result = result[0];
                            result.forEach(function(entry){
                                contentId+=`${entry[DBM_Card_Tradeboard.columns.id]}\n`;
                                contentUsernameWant+=`<@${entry[DBM_Card_Tradeboard.columns.id_user]}>\n`;
                                contentWant+=`${entry[DBM_Card_Tradeboard.columns.id_card_want]}\n`;
                            });

                            if(contentId==""){
                                return message.channel.send(`:x: I can't find any available trade listing for: **${cardDataReceive[DBM_Card_Data.columns.id_card]} - ${cardDataReceive[DBM_Card_Data.columns.name]}**`);
                            } else {
                                return message.channel.send({embed:{
                                    color: CardModule.Properties.embedColor,
                                    title: `Trade Listing: ${cardDataReceive[DBM_Card_Data.columns.id_card]}`,
                                    description : `Top 10 trade listing for: ${cardDataReceive[DBM_Card_Data.columns.rarity]}⭐ - **${cardDataReceive[DBM_Card_Data.columns.name]}**`,
                                    fields:[
                                    {
                                        name:`Trade ID:`,
                                        value: contentId,
                                        inline:true
                                    },
                                    {
                                        name:`Username:`,
                                        value: contentUsernameWant,
                                        inline:true
                                    },{
                                        name:`Want:`,
                                        value: contentWant,
                                        inline:true
                                    }]
                                }});
                            }
                        }
                        break;
                    case "remove":
                        //remove the trade listing
                        await CardModule.TradeBoard.removeListing(guildId,userId);

                        var objEmbed = {
                            color: CardModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name:userUsername
                            },
                            thumbnail : {
                                url: CardModule.Properties.imgResponse.imgOk
                            },
                            description : `✅ Your trade listing has been removed from the tradeboard.`
                        };
                        return message.channel.send({embed:objEmbed});

                        break;
                    case "trade":
                        //confirm the trade process
                        var tradeId = args[2];
                        if(tradeId==null){
                            return message.channel.send("Confirm the trade process with: **p!card tradeboard trade <trade id>**. Just remember that you can't change your mind after you've done this!");
                        }

                        //search the top 10 listing
                        var query = `SELECT * 
                        FROM ${DBM_Card_Tradeboard.TABLENAME} 
                        WHERE ${DBM_Card_Tradeboard.columns.id_guild}=? AND 
                        ${DBM_Card_Tradeboard.columns.id}=? AND 
                        ${DBM_Card_Tradeboard.columns.id_user}<>? AND 
                        ${DBM_Card_Tradeboard.columns.id_card_have} IS NOT NULL AND 
                        ${DBM_Card_Tradeboard.columns.id_card_want} IS NOT NULL AND 
                        ${DBM_Card_Tradeboard.columns.last_update}+INTERVAL 7 DAY>=CURDATE() 
                        ORDER BY ${DBM_Card_Tradeboard.columns.last_update} DESC 
                        LIMIT 1`;
                        var result = await DBConn.conn.promise().query(query, [guildId,tradeId,userId]);
                        if(result[0].length<=0){
                            return message.channel.send(`:x: Sorry, either that trade id has expired from the listing or not available anymore.`);
                        } else {
                            result = result[0][0];
                            var idCardReceive = result[DBM_Card_Tradeboard.columns.id_card_have];
                            var idCardSend = result[DBM_Card_Tradeboard.columns.id_card_want];
                            
                            var sendUserCardStock = await CardModule.getUserCardStock(userId,idCardSend);
                            var sendUserCardData = await CardModule.getCardData(idCardSend);
                            if(sendUserCardStock<=0){
                                var objEmbed = {
                                    color: CardModule.Properties.embedColor,
                                    author:{
                                        iconURL:userAvatarUrl,
                                        name:userUsername
                                    },
                                    thumbnail : {
                                        url: CardModule.Properties.imgResponse.imgError
                                    },
                                    description : `:x: Sorry, you need another dupe of: **${sendUserCardData[DBM_Card_Data.columns.id_card]} - ${sendUserCardData[DBM_Card_Data.columns.name]}**`
                                };
                                return message.channel.send({embed:objEmbed});
                            }

                            var receiveUserCardStock = await CardModule.getUserCardStock(result[DBM_Card_Tradeboard.columns.id_user],idCardReceive);
                            var receiveUserCardData = await CardModule.getCardData(idCardReceive);
                            if(receiveUserCardStock<=0){
                                var objEmbed = {
                                    color: CardModule.Properties.embedColor,
                                    author:{
                                        iconURL:userAvatarUrl,
                                        name:userUsername
                                    },
                                    thumbnail : {
                                        url: CardModule.Properties.imgResponse.imgError
                                    },
                                    description : `:x: Sorry, <@${result[DBM_Card_Tradeboard.columns.id_user]}> need another dupe of: **${receiveUserCardData[DBM_Card_Data.columns.id_card]} - ${receiveUserCardData[DBM_Card_Data.columns.name]}**`
                                };
                                return message.channel.send({embed:objEmbed});
                            }

                            //remove the trade listing
                            await CardModule.TradeBoard.removeListing(guildId,result[DBM_Card_Tradeboard.columns.id_user]);

                            //trade process confirmation
                            //swap the data
                            var receiveUserCardStock = await CardModule.getUserCardStock(userId,idCardReceive);
                            var sendUserCardStock = await CardModule.getUserCardStock(result[DBM_Card_Tradeboard.columns.id_user],idCardSend);

                            if(receiveUserCardStock<=-1){
                                //add new card to receiver
                                await CardModule.addNewCardInventory(userId,idCardReceive);
                            } else {
                                //update the card stock to received
                                await CardModule.addNewCardInventory(userId,idCardReceive,true);
                            }

                            if(sendUserCardStock<=-1){
                                //add new card to other
                                await CardModule.addNewCardInventory(result[DBM_Card_Tradeboard.columns.id_user],idCardSend);
                                // console.log(`sender:${result[DBM_Card_Tradeboard.columns.id_user]} receive the new card ${idCardSend}`);
                            } else {
                                //other update the card stock
                                await CardModule.addNewCardInventory(result[DBM_Card_Tradeboard.columns.id_user],idCardSend,true);
                                // console.log("sender update the card stock");
                            }

                            //substract your card stock:
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                            SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1 
                            WHERE ${DBM_Card_Inventory.columns.id_card}=? AND 
                            ${DBM_Card_Inventory.columns.id_user}=?`;
                            await DBConn.conn.promise().query(query, [idCardSend,userId]);

                            //substract other card stock:
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                            SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1 
                            WHERE ${DBM_Card_Inventory.columns.id_card}=? AND 
                            ${DBM_Card_Inventory.columns.id_user}=?`;
                            await DBConn.conn.promise().query(query, [idCardReceive,result[DBM_Card_Tradeboard.columns.id_user]]);

                            return message.channel.send({embed:{
                                color: CardModule.Properties.embedColor,
                                author:{
                                    iconURL:userAvatarUrl,
                                    name:userUsername
                                },
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgOk
                                },
                                title: `Trade Complete!`,
                                description: `You have successfully trade the card with <@${result[DBM_Card_Tradeboard.columns.id_user]}>`,
                                fields:[
                                {
                                    name:`Received ${receiveUserCardData[DBM_Card_Data.columns.rarity]}⭐ ${GlobalFunctions.capitalize(receiveUserCardData[DBM_Card_Data.columns.pack])} Card:`,
                                    value: `${receiveUserCardData[DBM_Card_Data.columns.id_card]} - ${receiveUserCardData[DBM_Card_Data.columns.name]}`,
                                    inline:true
                                },
                                {
                                    name:`Traded ${sendUserCardData[DBM_Card_Data.columns.rarity]}⭐ ${GlobalFunctions.capitalize(sendUserCardData[DBM_Card_Data.columns.pack])} Card:`,
                                    value:`${sendUserCardData[DBM_Card_Data.columns.id_card]} - ${sendUserCardData[DBM_Card_Data.columns.name]}`,
                                    inline:true
                                }]
                            }});

                        }
                        break;
                }

            case "convert":
                //get/view the card detail
                var convertOptions = args[1];

                var cardId = args[2];
                var convertAll = false;
                objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author : {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
                }

                if(convertOptions==null){
                    objEmbed.description = "-Use **p!card convert point <cardid> [all]** to convert the chosen card id into color & series points.\n-Use **p!card convert mofucoin <cardid> [all]** to convert the chosen card id into mofucoin.\n-Use **p!card convert item <cardid>** to convert the chosen card id into item.\n-Use **p!card convert level <cardid> <card id target>** to convert the chosen card id into level on <card id target>.\n-Use **p!card convert fragmenttolevel <cardid>** to level up the <cardid> with card fragment.\n-Use **p!card convert fragmenttopoint <fragment id>** to convert the fragment into series point.";
                    return message.channel.send({embed:objEmbed});
                } else if(convertOptions.toLowerCase()!="point" && convertOptions.toLowerCase()!="mofucoin" &&
                 convertOptions.toLowerCase()!="item"&& convertOptions.toLowerCase()!="level"&& 
                 convertOptions.toLowerCase()!="fragpoint"&&convertOptions.toLowerCase()!="fragmenttopoint"&&
                 convertOptions.toLowerCase()!="fraglevel"&&convertOptions.toLowerCase()!="fragmenttolevel"){
                    objEmbed.description = "-Use **p!card convert point <cardid> [all]** to convert the chosen card id into color & series points.\n-Use **p!card convert mofucoin <cardid> [all]** to convert the chosen card id into mofucoin.\n-Use **p!card convert item <cardid>** to convert the chosen card id into item.\n-Use **p!card convert level <cardid> <card id target>** to convert the chosen card id into level on <card id target>.\n-Use **p!card convert fraglevel <cardid>** to level up the <cardid> with card fragment.\n-Use **p!card convert fragpoint <fragment id>** to convert the fragment into series point.";
                    return message.channel.send({embed:objEmbed});
                }

                convertOptions = convertOptions.toLowerCase();

                //card id validation
                if(cardId==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the card ID.";
                    return message.channel.send({embed:objEmbed});
                }

                switch(convertOptions){
                    case "level":
                        //convert to level
                        //check if user have card/not
                        var targetCardId = args[3];
                        var itemStock = await CardModule.getUserCardStock(userId,cardId);
                        var userTargetCardStock = await CardModule.getUserCardStock(userId,targetCardId);

                        if(targetCardId==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Please enter the card ID that you want to leveled up with.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        //check for card data
                        var cardData = await CardModule.getCardData(cardId);
                        var cardData = await CardModule.getCardData(targetCardId);

                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find that card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        } else if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find the target card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        }

                        var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                        var rarity = cardData[DBM_Card_Data.columns.rarity];
                        var rarityValue = 0;

                        if(cardData[DBM_Card_Data.columns.pack]!=cardData[DBM_Card_Data.columns.pack]){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, both of the card need to be on the same card pack.`;
                        } else if(itemStock<=-1){
                            //stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                        } else if(userTargetCardStock<=-1){
                            //target stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                        } else if(itemStock<=0||userTargetCardStock<=-1){
                            //card stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you need another duplicate of: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** & **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert the card into level.`;
                        } else if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity])){
                            //check for max level
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** already reached the max level!`;
                        } else if(itemStock>=1&&userTargetCardStock>=0){
                            if(rarity<6){
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = `:x: Sorry, you can only convert card to level with 6/7 :star: card.`;
                            } else {
                                //check for card level
                                switch(cardData[DBM_Card_Data.columns.rarity]){
                                    case 6:
                                        rarityValue = 4;
                                        break;
                                    case 7:
                                        rarityValue = 5;
                                        break;
                                    default:
                                        rarityValue = rarity;
                                        break;
                                }

                                //update the level
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                                SET ${DBM_Card_Inventory.columns.level}=${DBM_Card_Inventory.columns.level}+${rarityValue}
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[userId,cardData[DBM_Card_Data.columns.id_card]]);

                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1  
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[userId,cardId]);

                                //get latest target card level & update to max level if exceed
                                var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                                if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity])){
                                    //update the level
                                    var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                                    SET ${DBM_Card_Inventory.columns.level}=?
                                    WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                    ${DBM_Card_Inventory.columns.id_card}=?`;
                                    await DBConn.conn.promise().query(query,[CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity]),userId,cardData[DBM_Card_Data.columns.id_card]]);
                                }

                                //get latest target card level
                                var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target

                                var objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,userCardData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardData[DBM_Card_Inventory.columns.level_special]);

                                if(userCardData[DBM_Card_Inventory.columns.is_gold]){
                                    objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,userCardData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                                }

                                return message.channel.send({content:`**${userUsername}** has convert **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** & increased **${cardData[DBM_Card_Data.columns.name]}** level by **${rarityValue}**.\n${cardData[DBM_Card_Data.columns.name]} is now level **${userCardData[DBM_Card_Inventory.columns.level]}**!`, embed:objEmbed});
                            }
                        }

                        break;
                    case "item":
                        //check if user have card/not
                        var itemStock = await CardModule.getUserCardStock(userId,cardId);

                        //check for card data
                        var cardData = await CardModule.getCardData(cardId);

                        if(itemStock<=-1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            
                        } else if(itemStock<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you need another duplicate of: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert this card.`;
                        } else if(itemStock>=1){
                            if(cardData[DBM_Card_Data.columns.rarity]<6){
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = `:x: Sorry, you can only convert card to item with 6/7 :star: card.`;
                            } else {
                                var minItemRarity = 70;
                                var query = `SELECT *
                                FROM ${DBM_Item_Data.TABLENAME} 
                                WHERE ${DBM_Item_Data.columns.drop_rate}>=?  
                                ORDER BY rand()`
                                var rndItemReward = await DBConn.conn.promise().query(query, [minItemRarity]);
                                rndItemReward = rndItemReward[0][0];
        
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
    
                                // //add the item inventory
                                await ItemModule.addNewItemInventory(userId,rndItemReward[DBM_Item_Data.columns.id]);
    
                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1  
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[userId,cardId]);
    
                                objEmbed.description = `<@${userId}> has converted **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into **${rndItemReward[DBM_Item_Data.columns.name]} (${rndItemReward[DBM_Item_Data.columns.id]})**`;
                            }
                        }

                        break;
                    case "fragpoint":
                    case "fragmenttopoint":
                        var itemId = cardId;
                        if(itemId==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Please enter the item fragment ID.";
                            return message.channel.send({embed:objEmbed});
                        }

                        var userData = await CardModule.getCardUserStatusData(userId);
                        var itemData = await ItemModule.getItemData(itemId);
                        if(itemData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find the target fragment ID.";
        
                            return message.channel.send({embed:objEmbed});
                        } else if(itemData[DBM_Item_Data.columns.category]!=ItemModule.Properties.categoryData.misc_fragment.value){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: That item ID is not part of card fragment.";
        
                            return message.channel.send({embed:objEmbed});
                        }

                        var convertedSpKey = CardModule.Properties.seriesCardCore[itemData[DBM_Item_Data.columns.extra_data]].series_point;
                        if(userData[convertedSpKey]>=CardModule.Properties.limit.seriespoint){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Your **${cardModule.Properties.seriesCardCore[convertedSpKey].currency}** series point has reached the maximumm amount.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        var itemStock = await ItemModule.getUserItemStock(userId,itemId);
                        if(itemStock<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need **${itemData[DBM_Item_Data.columns.name]}** to convert the card fragment into ${CardModule.Properties.seriesCardCore[convertedSpKey].currency}.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        //update the series point
                        var basePoint = 50;
                        var parameterSeries = new Map();
                        parameterSeries.set(convertedSpKey,basePoint);
                        await CardModule.updateSeriesPoint(userId,parameterSeries);

                        //update the item stock
                        await ItemModule.updateItemStock(userId,itemData[DBM_Item_Data.columns.id],-1);

                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        }
                        objEmbed.description = `:white_check_mark: You have convert **${itemData[DBM_Item_Data.columns.name]}** into **${basePoint} ${CardModule.Properties.seriesCardCore[convertedSpKey].currency}** series point.`;
                        return message.channel.send({embed:objEmbed});

                        break;
                    case "fraglevel":
                    case "fragmenttolevel":
                        //convert to level
                        //check if user have card/not
                        var targetCardId = cardId;

                        if(targetCardId==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Please enter the card ID that you want to leveled up with.`;
                            return message.channel.send({embed:objEmbed});
                        }

                        //check for card data
                        var cardData = await CardModule.getCardData(targetCardId);

                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find that card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        } else if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find the target card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        }

                        var userTargetCardStock = await CardModule.getUserCardStock(userId,targetCardId);

                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.extra_data}=?`;
                        var itemData = await DBConn.conn.promise().query(query, [cardData[DBM_Card_Data.columns.series]]);
                        itemData = itemData[0][0];
                        var itemStock = await ItemModule.getUserItemStock(userId,itemData[DBM_Item_Data.columns.id]);

                        var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                        var rarity = cardData[DBM_Card_Data.columns.rarity];
                        var rarityValue = 0;

                        if(userTargetCardStock<=-1){
                            //target stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                        } else if(itemStock<=0){
                            //stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need **${itemData[DBM_Item_Data.columns.id]} - ${itemData[DBM_Item_Data.columns.name]}** to convert the card fragment into level.`;
                        } else if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity])){
                            //check for max level
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** already reached the max level.`;
                        } else if(itemStock>=1&&userTargetCardStock>=0){
                            //check for card level
                            switch(cardData[DBM_Card_Data.columns.rarity]){
                                case 6:
                                case 7:
                                    rarityValue = 5;
                                    break;
                                default:
                                    rarityValue = rarity;
                                    break;
                            }

                            //update the level
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                            SET ${DBM_Card_Inventory.columns.level}=${DBM_Card_Inventory.columns.level}+${rarityValue}
                            WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                            ${DBM_Card_Inventory.columns.id_card}=?`;
                            await DBConn.conn.promise().query(query,[userId,cardData[DBM_Card_Data.columns.id_card]]);

                            //update the item stock
                            var query = `UPDATE ${DBM_Item_Inventory.TABLENAME}
                            SET ${DBM_Item_Inventory.columns.stock}=${DBM_Item_Inventory.columns.stock}-1 
                            WHERE ${DBM_Item_Inventory.columns.id_user}=? AND 
                            ${DBM_Item_Inventory.columns.id_item}=?`;
                            await DBConn.conn.promise().query(query,[userId,itemData[DBM_Item_Data.columns.id]]);

                            //get latest target card level & update to max level if exceed
                            var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                            if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity])){
                                //update the level
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                                SET ${DBM_Card_Inventory.columns.level}=?
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity]),userId,cardData[DBM_Card_Data.columns.id_card]]);
                            }

                            //get latest target card level
                            var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target

                            var objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,userCardData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardData[DBM_Card_Inventory.columns.level_special]);

                            if(userCardData[DBM_Card_Inventory.columns.is_gold]){
                                objEmbed = CardModule.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,userCardData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                            }

                            return message.channel.send({content:`**${userUsername}** has convert **${itemData[DBM_Item_Data.columns.name]}** & increased **${cardData[DBM_Card_Data.columns.name]}** level by **${rarityValue}**.\n${cardData[DBM_Card_Data.columns.name]} is now level **${userCardData[DBM_Card_Inventory.columns.level]}**!`, embed:objEmbed});
                            
                        }

                        break;
                    default:
                        //convert to point
                        if(args[3]!=null){
                            //check if convert all/not
                            if(args[3].toLowerCase()=="all"){
                                convertAll = true;
                            } else {
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = ":x: Use: **p!card convert <cardid> all** to convert all chosen card id into points.";
                                return message.channel.send({embed:objEmbed});
                            }
                        }
        
                        //check if card ID exists/not
                        var cardData = await CardModule.getCardData(cardId);
        
                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find that card ID.";
        
                            return message.channel.send({embed:objEmbed});
                        }
        
                        //check if user have card/not
                        var itemStock = await CardModule.getUserCardStock(userId,cardId);
        
                        if(itemStock<=-1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            
                        } else if(itemStock<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you need another duplicate of: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert this card.`;
                        } else if(itemStock>=1){
                            var convertValue = cardData[DBM_Card_Data.columns.rarity]*2;
                            switch(cardData[DBM_Card_Data.columns.rarity]){
                                case 6:
                                    convertValue = cardData[DBM_Card_Data.columns.rarity]*4;
                                    break;
                                case 7:
                                    convertValue = cardData[DBM_Card_Data.columns.rarity]*5;
                                    break;
                            }
        
                            var color = cardData[DBM_Card_Data.columns.color];
        
                            if(convertAll){
                                convertValue*=itemStock;
        
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
        
                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=? 
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[0,userId,cardId]);
        
                                objEmbed.description = `<@${userId}> has converted ${itemStock}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
                            } else {
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
        
                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-1  
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[userId,cardId]);
        
                                objEmbed.description = `<@${userId}> has converted 1x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
                            }
        
                            if(convertOptions=="point"){
                                //update the color point
                                var objColor = new Map();
                                objColor.set(`color_point_${color}`,convertValue);
                                await CardModule.updateColorPoint(userId,objColor);

                                //update the series points
                                var convertSp = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;
                                var convertValueSeries = convertValue;
                                var objSeries = new Map();
                                objSeries.set(`${convertSp}`,convertValueSeries);
                                await CardModule.updateSeriesPoint(userId,objSeries);

                                objEmbed.description += `**${convertValue} ${color} points** & **${convertValueSeries} ${CardModule.Properties.seriesCardCore[convertSp].currency}**.`;
                            } else if(convertOptions=="mofucoin"){
                                //update the mofucoin
                                await CardModule.updateMofucoin(userId,convertValue);
            
                                objEmbed.description += `**${convertValue} mofucoin**.`;
                            }
                        }
                        break;
                }

                return message.channel.send({embed:objEmbed});
                
                break;
            
            case "verify":
                //verify for card completion
                var option = args[1];
                if(option!=null){
                    option = option.toLowerCase();
                }
                
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };

                if(option==null||(option!="color"&&option!="pack"&&option!="series")){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : `-Use **p!card verify color <pink/purple/green/yellow/white/blue/red>** to verify the color completion.\n-Use **p!card verify pack <pack>** to verify the pack completion.\n-Use **p!card verify series <series>** to verify the series completion.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var embedCompletion = null;
                var verifyValue = args[2];
                switch(option){
                    case "color":
                        //validation
                        if(!CardModule.Properties.arrColor.includes(verifyValue)){
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: I can't find that color. Use **p!card verify color <pink/purple/green/yellow/white/blue/red>** to verify the color completion.`
                            };
                            return message.channel.send({embed:objEmbed});
                        }

                        var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",verifyValue);
                        var checkCardCompletionColorGold = await CardModule.checkCardCompletion(guildId,userId,"color_gold",verifyValue);

                        if(checkCardCompletionColor) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color",verifyValue);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }
                        
                        if(checkCardCompletionColorGold) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color_gold",verifyValue);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        objEmbed.title = `Color Card Verification: ${GlobalFunctions.capitalize(verifyValue)}`;
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        }
                        objEmbed.description = `Your **${GlobalFunctions.capitalize(verifyValue)}** card color has been verified for the completion.`;
                        await message.channel.send({embed:objEmbed});
                        break;
                    case "pack":
                        //validation if pack exists/not
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Data.columns.pack,verifyValue);
                        var checkData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
                        checkData = checkData[0][0];
                        if(checkData==null){
                            var objEmbed = CardModule.embedCardPackList;
                            return message.channel.send({content:`:x: I can't find that pack. Use **p!card verify pack <pack>** to verify the pack completion.`,embed:objEmbed});
                        }

                        var query = `SELECT ${DBM_Card_Data.columns.pack},${DBM_Card_Data.columns.color}  
                        FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.pack}=? 
                        LIMIT 1`;
                        var cardData = await DBConn.conn.promise().query(query, [verifyValue]);
                        cardData = cardData[0][0];

                        var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",verifyValue);
                        var checkCardCompletionPackGold = await CardModule.checkCardCompletion(guildId,userId,"pack_gold",verifyValue);

                        if(checkCardCompletionPack){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack",cardData[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        if(checkCardCompletionPackGold){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        objEmbed.title = `Card Pack Verification: ${GlobalFunctions.capitalize(verifyValue)}`;
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        }
                        objEmbed.description = `Your card pack: **${GlobalFunctions.capitalize(verifyValue)}** has been verified for the completion.`;
                        await message.channel.send({embed:objEmbed});
                        break;
                    case "series":
                        verifyValue = args.slice(2).join(' ');
                        //validation if series exists/not
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Data.columns.series,verifyValue);
                        var checkSeriesData = await DB.select(DBM_Card_Data.TABLENAME,parameterWhere);
                        checkSeriesData = checkSeriesData[0][0];
                        if(checkSeriesData==null){
                            var querySeriesList = `SELECT * 
                            FROM ${DBM_Card_Data.TABLENAME} 
                            GROUP BY ${DBM_Card_Data.columns.series}`;
                            var seriesData = await DBConn.conn.promise().query(querySeriesList);
                            seriesData = seriesData[0];
                            var txtSeriesList = "";
                            for(var i=0;i<seriesData.length;i++){
                                txtSeriesList+=`${seriesData[i][DBM_Card_Data.columns.series]}\n`;
                            }

                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                fields: {
                                    name:`Series List:`,
                                    value:txtSeriesList
                                }
                            };
                            return message.channel.send({content:`:x: I can't find that series. Use **p!card verify series <series>** to verify the series completion.`,embed:objEmbed});
                        }

                        var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"series",verifyValue);
                        var checkCardCompletionPackGold = await CardModule.checkCardCompletion(guildId,userId,"series_gold",verifyValue);

                        if(checkCardCompletionPack){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",verifyValue);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        if(checkCardCompletionPackGold){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series_gold",verifyValue);
                            if(embedCompletion!=null){
                                message.channel.send({embed:embedCompletion});
                            }
                        }

                        objEmbed.title = `Card Series Verification: ${GlobalFunctions.capitalize(verifyValue)}`;
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        }
                        objEmbed.description = `Your card series: **${GlobalFunctions.capitalize(verifyValue)}** has been verified for the completion.`;
                        await message.channel.send({embed:objEmbed});

                        break;
                }
                
            case "party":
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };

                var nextCommand = args[1];
                if(nextCommand!=null){
                    nextCommand = nextCommand.toLowerCase();
                }

                switch(nextCommand){
                    case "create":
                        var partyName = args.slice(2).join(' ');
                        if(partyName==""){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.title = "Party Creation Failed";
                            objEmbed.description = ":x: Please enter the party name with this parameter:\n**p!party create <partyname>**";
                            return message.channel.send({embed:objEmbed});
                        }

                        //check if user is member from party/not
                        var query = `SELECT * 
                        FROM ${DBM_Card_Party.TABLENAME} 
                        WHERE ${DBM_Card_Party.columns.id_guild}=? AND 
                        ${DBM_Card_Party.columns.party_data} like '%${userId}%'`;
                        var arrParameterized = [guildId];
                        var checkUserMember = await DBConn.conn.promise().query(query, arrParameterized);
                        checkUserMember = checkUserMember[0][0];
                        if(checkUserMember!=null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.title = "Party Creation Failed";
                            objEmbed.description = ":x: You cannot join another party while you're still on the party.";
                            return message.channel.send({embed:objEmbed});
                        }

                        var partyData = await CardModule.Party.updateParty(guildId,userId,partyName);
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        }
                        objEmbed.title = "Party has been created!";
                        objEmbed.description = `Your assigned party ID was: **${partyData[DBM_Card_Party.columns.id]}**`;
                        objEmbed.fields = [
                            {
                                name:`Party Name:`,
                                value:`${partyData[DBM_Card_Party.columns.name]}`
                            },
                            {
                                name:`Leader:`,
                                value:`<@${partyData[DBM_Card_Party.columns.id_user]}>`
                            }
                            
                        ]
                        return message.channel.send({embed:objEmbed});

                        break;
                    case "join":
                        var partyId = args[2];
                        if(partyId==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Please enter the **party ID** that you want to join with this parameter:\n**p!party join <party id>**";
                            return message.channel.send({embed:objEmbed});
                        }
                        
                        //check if still on party/not
                        var partyData = await CardModule.Party.getPartyStatusData(guildId,userId);//get by user id
                        if(partyData!=null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You cannot join another party while you're still on the party.";
                            return message.channel.send({embed:objEmbed});
                        }

                        //check if party id exists/not
                        var partyData = await CardModule.Party.getPartyStatusDataByIdParty(partyId);//get by party id
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, I can't find that party ID.";
                            return message.channel.send({embed:objEmbed});
                        }

                        //join the party
                        var joinResult = await CardModule.Party.joinParty(guildId,partyId,userId);
                        return message.channel.send({embed:joinResult});
                        break;
                    case "leave":
                        //check if user is member from party/not
                        var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You're not in party yet.";
                            return message.channel.send({embed:objEmbed});
                        } else {
                            //update the party data
                            if(partyData[DBM_Card_Party.columns.id_user]==userId){
                                //disband the party
                                var parameterWhere = new Map();
                                parameterWhere.set(DBM_Card_Party.columns.id_guild,guildId);
                                parameterWhere.set(DBM_Card_Party.columns.id_user,userId);
                                await DB.del(DBM_Card_Party.TABLENAME,parameterWhere);

                                objEmbed.author = {
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                }
                                objEmbed.description = `${userUsername} has disband the: **${partyData[DBM_Card_Party.columns.name]}**.`;
                            } else {
                                //leave from the party
                                var tempPartyData = partyData[DBM_Card_Party.columns.party_data].replace(`,${userId}`,"").replace(`${userId},`,"").replace(`${userId}`,"");
                                var parameterSet = new Map();
                                parameterSet.set(DBM_Card_Party.columns.party_data,tempPartyData);
                                var parameterWhere = new Map();
                                parameterWhere.set(DBM_Card_Party.columns.id,partyData[DBM_Card_Party.columns.id]);
                                await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);

                                objEmbed.author = {
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                }
                                objEmbed.description = `${userUsername} has leave from the party: **${partyData[DBM_Card_Party.columns.name]}**.`;

                                //check & update to null if no members
                                var query = `UPDATE ${DBM_Card_Party.TABLENAME}
                                SET ${DBM_Card_Party.columns.party_data} = CASE
                                WHEN ${DBM_Card_Party.columns.party_data} = '' THEN 
                                  NULL
                                ELSE 
                                ${DBM_Card_Party.columns.party_data}
                                END
                                WHERE ${DBM_Card_Party.columns.id}=?`;
                                var arrParameterized = [partyData[DBM_Card_Party.columns.id]];
                                await DBConn.conn.promise().query(query, arrParameterized);

                                
                            }

                            return message.channel.send({embed:objEmbed});
                        }
                        break;
                    case "status":
                        var partyStatusData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyStatusData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You're not in party yet.";
                            return message.channel.send({embed:objEmbed});
                        }

                        var totalMembers = 1;
                        
                        var txtMembers = `><@${partyStatusData[DBM_Card_Party.columns.id_user]}> : `;
                        var teamSeries = "-";
                        
                        var cardUserData = await CardModule.getCardUserStatusData(partyStatusData[DBM_Card_Party.columns.id_user]);
                        if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                            var cardData = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                            txtMembers+=`${cardData[DBM_Card_Data.columns.id_card]}\n`;
                            teamSeries = cardData[DBM_Card_Data.columns.series];
                        } else {
                            txtMembers+=`-\n`;
                        }

                        if(partyStatusData[DBM_Card_Party.columns.party_data]!=null){
                            var splittedUserId = partyStatusData[DBM_Card_Party.columns.party_data].split(",");
                            for(var i=0;i<splittedUserId.length;i++){
                                txtMembers+=`><@${splittedUserId[i]}> : `;
                                var cardUserData = await CardModule.getCardUserStatusData(splittedUserId[i]);
                                if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                                    var cardData = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                                    txtMembers+=`${cardData[DBM_Card_Data.columns.id_card]}\n`;
                                } else {
                                    txtMembers+=`-\n`;
                                }
                                totalMembers++;
                            }
                        }
                        
                        var role = "leader";
                        if(partyStatusData[DBM_Card_Party.columns.id_user]!=userId){
                            role = "member";
                        }

                        var atk = 0; var hp = 0;
                        var totalPartyData = await CardModule.Party.getAllStatus(partyStatusData[DBM_Card_Party.columns.id]);
                        atk = totalPartyData.atk;
                        hp = totalPartyData.hp;
                        //check if synergy/not
                        if(totalPartyData.synergy){
                            teamSeries+=" ✅";
                        }
                        
                        //check for party status buff:
                        var txtStatusEffect = "-";
                        if(totalPartyData.status_effect!=null){
                            if(totalPartyData.status_effect in CardModule.StatusEffect.partyBuffData){
                                txtStatusEffect = `${CardModule.StatusEffect.partyBuffData[totalPartyData.status_effect].name}\n⬆️ ${CardModule.StatusEffect.partyBuffData[totalPartyData.status_effect].description}`;
                            }
                        }

                        objEmbed.title = `Party Status`;
                        objEmbed.description = `You're the **${role}** of: **${partyStatusData[DBM_Card_Party.columns.name]}**\n**Series Synergy:** ${teamSeries}\n**Party Point:** ${partyStatusData[DBM_Card_Party.columns.party_point]}/10\n**Special Point:** ${partyStatusData[DBM_Card_Party.columns.special_point]}%\n**Party HP**: ${hp}\n**Party Atk**: ${atk}\n**Status Effect**: ${txtStatusEffect}`;
                        objEmbed.fields = [
                            {
                                name:`Party Members (${totalMembers}/${CardModule.Party.maxPartyMembers}):`,
                                value:txtMembers,
                                inline:true
                            }
                        ];

                        objEmbed.footer = {
                            text:`Party ID: ${partyStatusData[DBM_Card_Party.columns.id]} | Charge Up Party Point with p!card party charge`
                        }
                        return message.channel.send({embed:objEmbed});
                        break;
                    case "list":
                        var query = `SELECT * 
                        FROM ${DBM_Card_Party.TABLENAME} 
                        ORDER BY ${DBM_Card_Party.columns.id} ASC`;
                        var partyData = await DBConn.conn.promise().query(query);
                        var arrPages = [];
                        var ctr = 0; var maxCtr = 3; var pointerMaxData = partyData[0].length;
                        var partyList = ""; var partySeries = "";
                        objEmbed.title = "Party List";
                        for(var i=0;i<partyData[0].length;i++){
                            var totalMember = 1;
                            if(partyData[0][i][DBM_Card_Party.columns.party_data]!=null){
                                var splittedUserId = partyData[0][i][DBM_Card_Party.columns.party_data].split(",");
                                totalMember+=splittedUserId.length;
                            }

                            partyList+=`${partyData[0][i][DBM_Card_Party.columns.id]}. ${GlobalFunctions.cutText(partyData[0][i][DBM_Card_Party.columns.name],12)} (${totalMember}/${CardModule.Party.maxPartyMembers})\n`;
                            
                            var cardUserData = await CardModule.getCardUserStatusData(partyData[0][i][DBM_Card_Party.columns.id_user]);
                            if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                                var cardData = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);
                                partySeries+=`${cardData[DBM_Card_Data.columns.series]}\n`;
                            } else {
                                partySeries += "-\n";
                            }

                            //create pagination
                            if(pointerMaxData-1<=0||ctr>maxCtr){
                                objEmbed.description = "Use **p!card party join <party id>** to join into the party.";
                                objEmbed.fields = [
                                    {
                                        name: `ID - Team Name:`,
                                        value: partyList,
                                        inline:true
                                    },
                                    {
                                        name: `Series Syn.`,
                                        value: partySeries,
                                        inline:true
                                    },
                                ];
                                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                partyList = ""; partySeries = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        }
                        pages = arrPages;
                        paginationEmbed(message,pages);
                        break;
                    case "charge":
                        //charge the party point
                        //check if in party/not
                        var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need to be on a party to use the **charge** command.`;
                            return message.channel.send({embed:objEmbed})
                        }

                        //check for spawn token
                        var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                        if(guildSpawnData[DBM_Card_Guild.columns.spawn_type]=="battle"||
                        guildSpawnData[DBM_Card_Guild.columns.spawn_token]==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You cannot use the **party charge** at this time.`;
                        } else if(guildSpawnData[DBM_Card_Guild.columns.spawn_token]!=null){
                            if(partyData[DBM_Card_Party.columns.spawn_token]!=guildSpawnData[DBM_Card_Guild.columns.spawn_token]){
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
                                objEmbed.title = `Party Charged Up!`;
                                objEmbed.description = `${userUsername}'s party has been charged up and received 1 PP.`;

                                //update the party spawn token
                                var parameterSet = new Map();
                                parameterSet.set(DBM_Card_Party.columns.spawn_token,guildSpawnData[DBM_Card_Guild.columns.spawn_token]);
                                var parameterWhere = new Map();
                                parameterWhere.set(DBM_Card_Party.columns.id,partyData[DBM_Card_Party.columns.id]);
                                await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);

                                await CardModule.Party.updatePartyPoint(partyData[DBM_Card_Party.columns.id],1);

                            } else {
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = `:x: Your party has been charged up already.`;
                            }
                        }

                        return message.channel.send({embed:objEmbed});
                        break;
                }
                
                break;
            default:
                break;
            
        }
	},
};
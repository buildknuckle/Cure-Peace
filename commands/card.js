const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const TsunagarusModules = require('../modules/Tsunagarus');
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
                    currentSE = `${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name}\n⬆️ ${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}`;
                } else if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.debuffData){
                    currentSE = `${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name}\n⬇️ ${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}`;
                }

                var currentSkills = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]!=null){
                    cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2] = JSON.parse(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]);

                    if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2].value in CardModule.StatusEffect.cureSkillsBuffData){
                        currentSkills = `${CardModule.StatusEffect.cureSkillsBuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2].value].name} x${cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2].attempts}\n⬆️ ${CardModule.StatusEffect.cureSkillsBuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2].value].description}`;
                    }
                }

                //check if in party/not
                var txtInParty = ""; var arrPages = [];
                var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                if(partyData!=null){
                    txtInParty = ":busts_in_silhouette: In Party\n";
                }

                var assignedSeries = cardUserStatusData[DBM_Card_User_Data.columns.series_set];
                assignedSeries = CardModule.Properties.seriesCardCore[assignedSeries].pack;

                objEmbed.description = `${txtInParty}**aCLvl:** ${clvl} | **Assigned Set:** ${cardUserStatusData[DBM_Card_User_Data.columns.color]}/${assignedSeries} | **Cure Avatar:** ${avatarId} \n**MofuCoin:** ${cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]}/${CardModule.Properties.limit.mofucoin}\n**Special Point:** ${cardUserStatusData[DBM_Card_User_Data.columns.special_point]}%\n**Status Effect:** ${currentSE}\n\n**Act. Battle Skills:** ${currentSkills}`;

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
                        value:`:heart: ${cardUserStatusData[DBM_Card_User_Data.columns.sp001]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp001.currency} (${CardModule.Properties.seriesCardCore.sp001.pack})\n:star: ${cardUserStatusData[DBM_Card_User_Data.columns.sp002]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp002.currency} (${CardModule.Properties.seriesCardCore.sp002.pack})\n:butterfly: ${cardUserStatusData[DBM_Card_User_Data.columns.sp003]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp003.currency} (${CardModule.Properties.seriesCardCore.sp003.pack})\n:mobile_phone: ${cardUserStatusData[DBM_Card_User_Data.columns.sp004]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp004.currency} (${CardModule.Properties.seriesCardCore.sp004.pack})\n:seedling: ${cardUserStatusData[DBM_Card_User_Data.columns.sp005]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp005.currency} (${CardModule.Properties.seriesCardCore.sp005.pack})\n:notes: ${cardUserStatusData[DBM_Card_User_Data.columns.sp006]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp006.currency} (${CardModule.Properties.seriesCardCore.sp006.pack})\n:fairy: ${cardUserStatusData[DBM_Card_User_Data.columns.sp007]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp007.currency} (${CardModule.Properties.seriesCardCore.sp007.pack})\n:performing_arts: ${cardUserStatusData[DBM_Card_User_Data.columns.sp008]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp008.currency} (${CardModule.Properties.seriesCardCore.sp008.pack})\n:dress: ${cardUserStatusData[DBM_Card_User_Data.columns.sp009]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp009.currency} (${CardModule.Properties.seriesCardCore.sp009.pack})\n:princess: ${cardUserStatusData[DBM_Card_User_Data.columns.sp010]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp010.currency} (${CardModule.Properties.seriesCardCore.sp010.pack})\n:broom: ${cardUserStatusData[DBM_Card_User_Data.columns.sp011]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp011.currency} (${CardModule.Properties.seriesCardCore.sp011.pack})\n:sparkles: ${cardUserStatusData[DBM_Card_User_Data.columns.sp012]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp012.currency} (${CardModule.Properties.seriesCardCore.sp012.pack})\n:small_blue_diamond: ${cardUserStatusData[DBM_Card_User_Data.columns.sp013]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp013.currency} (${CardModule.Properties.seriesCardCore.sp013.pack})\n:ringed_planet: ${cardUserStatusData[DBM_Card_User_Data.columns.sp014]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp014.currency} (${CardModule.Properties.seriesCardCore.sp014.pack})\n:diamond_shape_with_a_dot_inside: ${cardUserStatusData[DBM_Card_User_Data.columns.sp015]}/${CardModule.Properties.limit.seriespoint} ${CardModule.Properties.seriesCardCore.sp015.currency} (${CardModule.Properties.seriesCardCore.sp015.pack})`,
                        inline:true
                    },
                    {
                        name:"Color Buff:",
                        value:`**Pink:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]))}% Catch Rate\n**Blue:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]))}% Catch Rate\n**Yellow:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]))}% Catch Rate\n**Purple:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]))}% Catch Rate\n**Red:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]))}% Catch Rate\n**Green:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]))}% Catch Rate\n**White:** +${CardModule.getBonusCatchAttempt(parseInt(cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]))}% Catch Rate`,
                        inline:true
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

                var queryDuplicate = `select cd.${DBM_Card_Data.columns.pack},sum(inv.${DBM_Card_Inventory.columns.stock}) as total 
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

                //reset to 0
                for(var i=0;i<cardDataInventory[0].length;i++){
                    arrCardTotal[cardDataInventory[0][i][DBM_Card_Data.columns.pack]] = "0";
                }

                //gold card
                for(var i=0;i<cardDataInventoryGold[0].length;i++){
                    arrCardTotal[cardDataInventoryGold[0][i][DBM_Card_Data.columns.pack]] = cardDataInventoryGold[0][i]['total_gold'];
                }

                objEmbed.fields = [{
                    name: `Pink Gold:`,
                    value: `Nagisa: ${arrCardTotal.nagisa}\nSaki: ${arrCardTotal.saki}\nNozomi: ${arrCardTotal.nozomi}\nLove: ${arrCardTotal.love}\nTsubomi: ${arrCardTotal.tsubomi}\nHibiki: ${arrCardTotal.hibiki}\nMiyuki: ${arrCardTotal.miyuki}\nMana: ${arrCardTotal.mana}\nMegumi: ${arrCardTotal.megumi}\nHaruka: ${arrCardTotal.haruka}\nMirai: ${arrCardTotal.mirai}\nIchika: ${arrCardTotal.ichika}\nHana: ${arrCardTotal.hana}\nHikaru: ${arrCardTotal.hikaru}\nNodoka: ${arrCardTotal.nodoka}`,
                    inline: true
                },
                {
                    name: `Blue Gold:`,
                    value: `Karen: ${arrCardTotal.karen}\nMiki: ${arrCardTotal.miki}\nErika: ${arrCardTotal.erika}\nEllen: ${arrCardTotal.ellen}\nReika: ${arrCardTotal.reika}\nRikka: ${arrCardTotal.rikka}\nHime: ${arrCardTotal.hime}\nMinami: ${arrCardTotal.minami}\nAoi: ${arrCardTotal.aoi}\nSaaya: ${arrCardTotal.saaya}\nYuni: ${arrCardTotal.yuni}\nChiyu: ${arrCardTotal.chiyu}`,
                    inline: true
                },
                {
                    name: `Yellow Gold:`,
                    value: `Hikari: ${arrCardTotal.hikari}\nUrara: ${arrCardTotal.urara}\nInori: ${arrCardTotal.inori}\nItsuki: ${arrCardTotal.itsuki}\nAko: ${arrCardTotal.ako}\nYayoi: ${arrCardTotal.yayoi}\nAlice: ${arrCardTotal.alice}\nYuko: ${arrCardTotal.yuko}\nKirara: ${arrCardTotal.kirara}\nHimari: ${arrCardTotal.himari}\nHomare: ${arrCardTotal.homare}\nElena: ${arrCardTotal.elena}\nHinata: ${arrCardTotal.hinata}`,
                    inline: true
                },
                {
                    name: `Purple Gold:`,
                    value: `Yuri: ${arrCardTotal.yuri}\nMakoto: ${arrCardTotal.makoto}\nIona: ${arrCardTotal.iona}\nRiko: ${arrCardTotal.riko}\nYukari: ${arrCardTotal.yukari}\nRuru: ${arrCardTotal.ruru}\nMadoka: ${arrCardTotal.madoka}\nKurumi: ${arrCardTotal.kurumi}`,
                    inline: true
                },
                {
                    name: `Red Gold:`,
                    value: `Rin: ${arrCardTotal.rin}\nSetsuna: ${arrCardTotal.setsuna}\nAkane: ${arrCardTotal.akane}\nAguri: ${arrCardTotal.aguri}\nTowa: ${arrCardTotal.towa}\nAkira: ${arrCardTotal.akira}\nEmiru: ${arrCardTotal.emiru}`,
                    inline: true
                },
                {
                    name: `Green Gold:`,
                    value: `Komachi: ${arrCardTotal.komachi}\nNao: ${arrCardTotal.nao}\nKotoha: ${arrCardTotal.kotoha}\nCiel: ${arrCardTotal.ciel}\nLala: ${arrCardTotal.lala}`,
                    inline: true
                },
                {
                    name: `White Gold:`,
                    value: `Honoka: ${arrCardTotal.honoka}\nMai: ${arrCardTotal.mai}\nKanade: ${arrCardTotal.kanade}`,
                    inline: true
                }
            ];

                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                arrPages[3] = msgEmbed;

                if(cardUserStatusData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                    var cardAvatarData = await CardModule.getCardData(avatarId);
                    var cardUserAvatarData = await CardModule.getUserCardInventoryData(userId,avatarId);

                    var packName = cardAvatarData[DBM_Card_Data.columns.pack];
                    var level = cardUserAvatarData[DBM_Card_Inventory.columns.level];
                    var level_special = cardUserAvatarData[DBM_Card_Inventory.columns.level_special];
                    var atk = cardAvatarData[DBM_Card_Data.columns.max_atk];
                    var hp = cardAvatarData[DBM_Card_Data.columns.max_hp];
                    var rarity = cardAvatarData[DBM_Card_Data.columns.rarity];
                    var avatarFormMode = cardUserStatusData[DBM_Card_User_Data.columns.card_avatar_form];
                    var type = "normal"; var cardTypeDisplay = "";
                    
                    var goldIcon = "";
                    if(cardUserAvatarData[DBM_Card_Inventory.columns.is_gold]){
                        objEmbed.thumbnail = {
                            url:cardAvatarData[DBM_Card_Data.columns.img_url_upgrade1]
                        }
                        type = "gold"; goldIcon="✨"; cardTypeDisplay = "Gold";
                    } else {
                        objEmbed.thumbnail = {
                            url:cardAvatarData[DBM_Card_Data.columns.img_url]
                        }
                    }

                    if(avatarFormMode=="normal"){
                        objEmbed.fields = [{
                            name:`Cure Avatar:\n${rarity+CardModule.Properties.cardCategory[type].rarityBoost}⭐ ${CardModule.Properties.dataCardCore[packName].alter_ego}${goldIcon} Lv.${level}`,
                            value:`❤️ **HP: **${CardModule.Status.getHp(level,hp)}\n⚔️ **Atk:** ${CardModule.Status.getAtk(level,atk)}\n**Special**: ${CardModule.Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }];
                        objEmbed.image = {
                            url:CardModule.Properties.dataCardCore[packName].icon
                        }
                    } else {
                        objEmbed.fields = [{
                            name:`Cure Avatar:\n${rarity+CardModule.Properties.cardCategory[type].rarityBoost}⭐ ${GlobalFunctions.capitalize(cardTypeDisplay)} ${CardModule.Properties.dataCardCore[packName].form[avatarFormMode].name}${goldIcon} Lv.${level}`,
                            value:`❤️ **HP: **${CardModule.Status.getHp(level,hp)}\n⚔️ **Atk:** ${CardModule.Status.getAtk(level,atk)}\n**Special**: ${CardModule.Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }];

                        objEmbed.image = {
                            url:CardModule.Properties.dataCardCore[packName].form[avatarFormMode].img_url
                        }
                    }

                    var msgEmbed = new Discord.MessageEmbed(objEmbed);
                    arrPages[4] = msgEmbed;
                }
                
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
                
                paginationEmbed(message,arrPages,['⏪', '⏩'],300000);

                break;
            case "catch":
            case "capture":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                objEmbed.author = {
                    iconURL:userAvatarUrl,
                    name:userUsername
                }

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
                var seriesId = CardModule.Properties.seriesCardCore[spawnedCardData.series].series_point;
                var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;

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
                    var pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                    var seriesReward = pointReward;
                    //check for double point reward
                    if(spawnedCardData.color==userData.color){
                        pointReward*=2;
                    }
                    if(spawnedCardData.series==userData.series){
                        seriesReward*=2;
                    }

                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    var objSeries = new Map();
                    objSeries.set(seriesId,seriesReward);

                    //insert new card
                    if(itemStock<=-1){//non duplicate
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        
                        await message.channel.send({embed:CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)});

                        duplicate = false;
                    } else {//duplicate
                        if(itemStock<CardModule.Properties.maximumCard){//add new stock card
                            var cardQty = 1;
                            if(spawnedCardData.color==userData.color&&spawnedCardData.series==userData.series){
                                cardQty = 2;
                            }

                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                            await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesReward,cardQty)});

                            itemStock+=1;
                        } else {
                            //cannot add more card
                            await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)});
                        }
                    }

                    //update the catch token & color points
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor,
                        objSeries
                    );

                    //get the current card total
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);

                    if(!duplicate){
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

                    var pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];

                    //update the color points
                    var objColor = new Map();
                    objColor.set(`color_point_${cardSpawnData[DBM_Card_Data.columns.color]}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);

                    //update the series points
                    var objSeries = new Map();
                    objSeries.set(seriesId,pointReward);
                    await CardModule.updateSeriesPoint(userId,objSeries);

                    objEmbed.description = `:x: ${userUsername} failed to catch the card this time!`;

                    objEmbed.fields = [
                        {
                            name:`Rewards:`,
                            value:`>${pointReward} ${cardSpawnData[DBM_Card_Data.columns.color]} points\n>${pointReward} ${seriesCurrency}`,
                            inline:true
                        }
                    ];

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
                objEmbed.author = {
                    iconURL:userAvatarUrl,
                    name:userUsername
                }

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
                // var nextNumber = currentNumber+1;//for debugging only
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.series = cardSpawnData[DBM_Card_Data.columns.series];
                var seriesId = CardModule.Properties.seriesCardCore[spawnedCardData.series].series_point;
                var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;

                userData.series = CardModule.Properties.seriesCardCore[userCardData[DBM_Card_User_Data.columns.series_set]].pack;

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
                    objEmbed.title = "Once More!"
                    objEmbed.description = `The current number was: **${currentNumber}** and the hidden number was **${nextNumber}**. Neither number is lower or higher.\nYou have another chance to guess the next hidden number.`;

                    objEmbed.fields = {
                        name:"Rewards:",
                        value:`>${pointReward} ${spawnedCardData.color} points\n>${pointReward} ${seriesCurrency}\n>**Once More:** another chance to use the guess command.`
                    }
                    
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);

                    var objPoints = new Map();
                    objPoints.set(seriesId,pointReward);
                    await CardModule.updateSeriesPoint(userId,objPoints);
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
                
                if(success){
                    var pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                    var seriesReward = pointReward;

                    if(userData.color==spawnedCardData.color){
                        pointReward*=2;
                    }

                    if(userData.series==spawnedCardData.series){
                        seriesReward*=2;
                    }

                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    var objSeries = new Map();
                    objSeries.set(seriesId,seriesReward);

                    //if success
                    var cardStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                    var duplicate = true;
                    //var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);

                    if(cardStock<=-1){//card is not duplicate
                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);

                        await message.channel.send({embed:CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)});

                        duplicate = false;
                    } else { //duplicate
                        var cardQty = 1;
                        if(userData.color==spawnedCardData.color&&userData.series==spawnedCardData.series){
                            cardQty=2;
                        }

                        if(cardStock<CardModule.Properties.maximumCard){//add new stock card
                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true,cardQty);

                            await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesReward,cardQty)});

                            cardStock=cardStock+1;
                        } else {
                            //cannot add more card
                            await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)});
                        }
                    }

                    //update the token & color points
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor,
                        objSeries
                    );

                    //get the current card total
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);
                    
                    if(!duplicate){
                        //remove the guild spawn token
                        await CardModule.removeCardGuildSpawn(guildId);

                        message.channel.send({embed:CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                        cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_atk],cardStock)});
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
                var newSeries = args.slice(2).join(' ');
                
                //validator if parameter format is not correct
                if(args[1]==null|| args[1].toLowerCase()!="set" || 
                    (args[1].toLowerCase()!="set" && newSeries == null)||
                    (args[1].toLowerCase()=="set" && !CardModule.Properties.arrSeriesName.includes(newSeries))){
                    var txtSeriesList = "";
                    CardModule.Properties.arrSeriesList.forEach(entry => {
                        txtSeriesList+=`-**${CardModule.Properties.seriesCardCore[entry].pack}** : ${CardModule.Properties.seriesCardCore[entry].currency}\n`
                    });
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        description : ":x: Please enter the correct series from the list below.\nExample: **p!card series set max heart**",
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
                //validator: check if series points is enough/not
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

                newSeries = CardModule.Properties.seriesCardCore[CardModule.Properties.seriesCardCore[newSeries].series_point].value;

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
                        var materialNeeded = cardRarity;
                        if(cardRarity>=5){
                            cardNeeded=4;
                            // cardRarity=5;
                        }
                        if(userCardInventoryData[DBM_Card_Inventory.columns.stock]<materialNeeded||itemStock<materialNeeded){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have enough materials to upgrade this card into gold card.`;
                            objEmbed.fields = [
                                {
                                    name:`Required Materials:`,
                                    value:`>**Card:** ${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]} x${materialNeeded}\n>**Item:** ${itemDataRequirement[DBM_Item_Data.columns.id]} - ${itemDataRequirement[DBM_Item_Data.columns.name]} x${materialNeeded}`,
                                    inline:true
                                }
                            ]
                            return message.channel.send({embed:objEmbed});
                        }

                        //start the upgrade rng
                        var randomChance = GlobalFunctions.randomNumber(1,10);
                        
                        //check for 100% upgrade chance:
                        var fullUpgrade = false;
                        var objRarityTotalData = {}; var objDupeTotal = {};
                        var query = `select cd.${DBM_Card_Data.columns.rarity},count(cd.${DBM_Card_Data.columns.rarity}) as total_req,sum(inv.${DBM_Card_Inventory.columns.stock}) as total 
                        from ${DBM_Card_Data.TABLENAME} cd 
                        left join ${DBM_Card_Inventory.TABLENAME} inv 
                        on (cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                        inv.${DBM_Card_Inventory.columns.id_user}=?) 
                        where cd.${DBM_Card_Data.columns.pack}=? 
                        group by cd.${DBM_Card_Data.columns.rarity}`;
                        var cardDataRarityRequirement = await DBConn.conn.promise().query(query,[userId,cardData[DBM_Card_Data.columns.pack]]);
                        cardDataRarityRequirement = cardDataRarityRequirement[0];
                        for(var i=0;i<cardDataRarityRequirement.length;i++){
                            objRarityTotalData[cardDataRarityRequirement[i][DBM_Card_Data.columns.rarity]] = parseInt(cardDataRarityRequirement[i]["total_req"]);
                            objDupeTotal[cardDataRarityRequirement[i][DBM_Card_Data.columns.rarity]] = parseInt(cardDataRarityRequirement[i]["total"]);
                            if(isNaN(objDupeTotal[cardDataRarityRequirement[i][DBM_Card_Data.columns.rarity]])){
                                objDupeTotal[cardDataRarityRequirement[i][DBM_Card_Data.columns.rarity]] = 0;
                            }
                        }

                        switch(cardRarity){
                            case 1:
                                //
                                if(objDupeTotal["1"]>=2){
                                    fullUpgrade = true;
                                }
                                break;
                            case 2:
                                if(objDupeTotal["2"]>=(objRarityTotalData["2"]*2)+2){
                                    fullUpgrade = true;
                                }
                                break;
                            case 3:
                                if(objDupeTotal["3"]>=(objRarityTotalData["2"]*3)+1){
                                    fullUpgrade = true;
                                }
                                break;
                            case 4:
                                if(objDupeTotal["3"]>=(objRarityTotalData["3"]*3)+1&&
                                objDupeTotal["2"]>=2){
                                    fullUpgrade = true;
                                }
                                break;
                            case 5:
                                if(objDupeTotal["4"]>=(objRarityTotalData["4"]*4)+1&&
                                objDupeTotal["3"]>=2&&objDupeTotal["2"]>=3){
                                    fullUpgrade = true;
                                }
                                break;
                            case 6:
                                if(objDupeTotal["5"]>=(objRarityTotalData["5"]*2)+1&&
                                objDupeTotal["4"]>=2&&objDupeTotal["3"]>=3&&objDupeTotal["2"]>=4){
                                    fullUpgrade = true;
                                }
                                break;
                            case 7:
                                if(objDupeTotal["6"]>=5&&objDupeTotal["5"]>=3&&
                                objDupeTotal["4"]>=3&&objDupeTotal["3"]>=4&&objDupeTotal["2"]>=6){
                                    fullUpgrade = true;
                                }
                                break;
                        }

                        if(fullUpgrade){
                            randomChance = 10;
                            await message.channel.send({embed:{
                                color:CardModule.Properties.embedColor,
                                thumbnail:{
                                    url:CardModule.Properties.imgResponse.imgOk
                                },
                                author:{
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                },
                                title:`${cardRarity}⭐ Gold Card Upgrade Boost!`,
                                description: `+100% gold card upgrade chance.`
                            }});
                        } else {
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

                            var embedTitle = ""; var embedDescription = "";
                            
                            if(clvl>=15){
                                randomChance+=5;
                                embedTitle = `aClvL Gold Card Upgrade Boost 5!`;
                                embedDescription = "+50% gold card upgrade chance.";
                            } if(clvl>=13){
                                randomChance+=4;
                                embedTitle = `aClvL Gold Card Upgrade Boost 4!`;
                                embedDescription = "+40% gold card upgrade chance.";
                            } else if(clvl>=10){
                                randomChance+=3;
                                embedTitle = `aClvL Gold Card Upgrade Boost 3!`;
                                embedDescription = "+30% gold card upgrade chance.";
                            } else if(clvl>=7){
                                randomChance+=2;
                                embedTitle = `aClvL Gold Card Upgrade Boost 2!`;
                                embedDescription = "+20% gold card upgrade chance.";
                            } else if(clvl>=5){
                                randomChance+=1;
                                embedTitle = `aClvL Gold Card Upgrade Boost 1!`;
                                embedDescription = "+10% gold card upgrade chance.";
                            }

                            if(embedTitle!=""){
                                await message.channel.send({embed:{
                                    color:CardModule.Properties.embedColor,
                                    thumbnail:{
                                        url:CardModule.Properties.imgResponse.imgOk
                                    },
                                    author:{
                                        name: userUsername,
                                        icon_url: userAvatarUrl
                                    },
                                    title:embedTitle,
                                    description:embedDescription
                                }});
                            }
                        }

                        //update the card & item stock
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                        SET ${DBM_Card_Inventory.columns.stock} = ${DBM_Card_Inventory.columns.stock}-${materialNeeded}
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query, [userId,cardData[DBM_Card_Data.columns.id_card]]);
                        await ItemModule.updateItemStock(userId,itemDataRequirement[DBM_Item_Data.columns.id],-materialNeeded);
                        
                        if(randomChance<materialNeeded){
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
                objEmbed.author = {
                    name:userUsername,
                    iconURL:userAvatarUrl
                }

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

                await message.delete();

                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                
                spawnedCardData.id = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.id_card];
                spawnedCardData.answer = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.answer];
                spawnedCardData.type = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.type];

                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];
                spawnedCardData.pack = cardSpawnData[DBM_Card_Data.columns.pack];
                spawnedCardData.series = cardSpawnData[DBM_Card_Data.columns.series];
                var seriesId = CardModule.Properties.seriesCardCore[spawnedCardData.series].series_point;
                var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;
                
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
                            case CardModule.Properties.spawnData.quiz.typeStarTwinkleStarsCount:
                            case CardModule.Properties.spawnData.quiz.typeStarTwinkleConstellation:
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

                switch(spawnedCardData.type){
                    case CardModule.Properties.spawnData.quiz.typeTsunagarus:
                        var embedVictory = objEmbed;
                        embedVictory.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgOk
                        }
                        embedVictory.title = "Mini Tsunagarus Defeated!";
                        embedVictory.description = "✅ You've successfully defeat the mini tsunagarus!";
                        await message.channel.send({embed:embedVictory});
                        break;
                }

                //correct answer
                var duplicate = true;
                var msgContent = "";
                var pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                var seriesPointReward = pointReward;
                userData.series = CardModule.Properties.seriesCardCore[userCardData[DBM_Card_User_Data.columns.series_set]].pack;

                switch(spawnedCardData.type){
                    case CardModule.Properties.spawnData.quiz.typeStarTwinkleStarsCount:
                        seriesPointReward = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.totalStars]+GlobalFunctions.randomNumber(1,4);
                        break;
                    case CardModule.Properties.spawnData.quiz.typeStarTwinkleConstellation:
                        seriesPointReward = 12;
                        break;
                }

                //check for double point boost
                if(userData.color==spawnedCardData.color){
                    pointReward*=2;
                }

                if(userData.series==spawnedCardData.series){
                    seriesPointReward*=2;
                }

                var cardStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                if(cardStock<=-1){//non duplicate
                    await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                    await message.channel.send({embed:CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesPointReward)});

                    duplicate = false;
                } else {//duplicate
                    var cardQty = 1;
                    if(userData.color==spawnedCardData.color&&userData.series==spawnedCardData.series){
                        cardQty=2;
                    }

                    if(cardStock<CardModule.Properties.maximumCard){//add new stock card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                        await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesPointReward,cardQty)});
                        cardStock=cardStock+1;
                    } else {
                        //cannot add more card
                        await message.channel.send({embed:CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesPointReward)});
                    }
                }

                //get the current card total
                var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);

                //update token & color points
                var objColor = new Map();
                objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                var objSeries = new Map();
                objSeries.set(seriesId,seriesPointReward);
                
                await CardModule.updateCatchAttempt(userId,
                    spawnedCardData.token,
                    objColor,objSeries
                );

                if(!duplicate){
                    await CardModule.removeCardGuildSpawn(guildId);
                    await message.channel.send({embed:CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,spawnedCardData.pack,cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_hp],cardStock)});
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
                var henshinForm = args[2];
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

                //form validation
                if(henshinForm!=null){
                    henshinForm = henshinForm.toLowerCase();

                    if(!("form" in CardModule.Properties.dataCardCore[cardData[DBM_Card_Data.columns.pack]])){
                        var objEmbed = {
                            color: CardModule.Properties.embedColor,
                            description : `:x: There are no other forms for this cure!`,
                            thumbnail : {
                                url: CardModule.Properties.imgResponse.imgError
                            },
                        };
                        return message.channel.send({embed:objEmbed});
                    } else if("form" in CardModule.Properties.dataCardCore[cardData[DBM_Card_Data.columns.pack]]){
                        //form rarity validation
                        if(cardData[DBM_Card_Data.columns.rarity]<6){
                            return message.channel.send({embed:{
                                color: CardModule.Properties.embedColor,
                                description : `:x: You can only use the form mode with 6/7:star: card!`,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                            }});
                        }

                        if(!(henshinForm in CardModule.Properties.dataCardCore[cardData[DBM_Card_Data.columns.pack]].form)){
                            var availableForm = "";

                            var eachForm = CardModule.Properties.dataCardCore[cardData[DBM_Card_Data.columns.pack]].form;
                            for (var key of Object.keys(eachForm)) {
                                availableForm+=`>**${key.toLowerCase()}** : ${eachForm[key].name}\n`;
                            }
                            
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                description : `:x: I can't find that form. Here are the list of available form:`,
                                fields : {
                                    name:"Available Form:",
                                    value:availableForm
                                },
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },

                            };
                            return message.channel.send({embed:objEmbed});
                        }
                    }
                } else {
                    henshinForm = "normal";
                }

                var cardGuildData = await CardGuildModule.getCardGuildData(guildId);
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                var price = cardData[DBM_Card_Data.columns.rarity]*10;
                var selectedColor = cardData[DBM_Card_Data.columns.color];
                var currentColorPoint = cardUserData[`color_point_${selectedColor}`];
                var msgContent = "";

                // if(cardGuildData[DBM_Card_Guild.columns.spawn_type]=="battle" && 
                // cardUserData[DBM_Card_User_Data.columns.card_set_token]==cardGuildData[DBM_Card_Guild.columns.spawn_token]){
                //     var objEmbed = {
                //         color: CardModule.Properties.embedColor,
                //         author:{
                //             iconURL:userAvatarUrl,
                //             name:userUsername
                //         },
                //         thumbnail : {
                //             url: CardModule.Properties.imgResponse.imgError
                //         },
                //         description : `:x: You cannot change into another Precure avatar again when tsunagarus has appeared!`
                //     };
                //     return message.channel.send({embed:objEmbed});
                // } else 
                if(cardData[DBM_Card_Data.columns.rarity]>=3&&currentColorPoint<price){
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
                parameterSet.set(DBM_Card_User_Data.columns.card_avatar_form,henshinForm);
                // if(cardGuildData[DBM_Card_Guild.columns.spawn_type]=="battle"){
                //     parameterSet.set(DBM_Card_User_Data.columns.card_set_token,cardGuildData[DBM_Card_Guild.columns.spawn_token]);
                // }
                
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                var type = CardModule.Properties.cardCategory.normal.value;
                if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                    type = CardModule.Properties.cardCategory.gold.value;
                }

                switch(type){
                    case CardModule.Properties.cardCategory.gold.value:
                        return message.channel.send({content:msgContent,embed:CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type,henshinForm)});
                        break;
                    default:
                        return message.channel.send({content:msgContent,embed:CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type,henshinForm)});
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
                    objEmbed.description = `🔁 Your precure avatar has been reverted back into **${cardData[DBM_Card_Data.columns.rarity]*10} ${cardData[DBM_Card_Data.columns.color]}** points.`;
                } else {
                    objEmbed.description = `🔁 Your precure avatar has been reverted back.`;
                }

                
                message.channel.send({embed:objEmbed});

                break
            // case "debug":
            //     //for card spawn debug purpose
            //     var cardSpawnData = await CardModule.generateCardSpawn(guildId);
            //     var msgObject = null;
            //     if("isPaging" in cardSpawnData){
            //         msgObject = await paginationEmbed(message,[cardSpawnData]);
            //     } else {
            //         msgObject = await message.channel.send({embed:cardSpawnData});
            //     }
            //     // var msgObject = await message.channel.send({embed:cardSpawnData});
            //     // var msgObject = await paginationEmbed(message,[cardSpawnData]);
            //     // console.log(msgObject);
            //     await CardModule.updateMessageIdSpawn(guildId,msgObject.id);

            //     //tsunagarus executives testing
            //     // var tsunagarusExecutivesIntro = await TsunagarusModules.introduction(guildId,"barabaran");
            //     // var msgObject = await message.channel.send({embed:tsunagarusExecutivesIntro});

            //     // await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
                
            //     break;
            case "battle":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

                await message.delete();

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
                    spawn_data:guildSpawnData[DBM_Card_Guild.columns.spawn_data],
                    messageId:guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]
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
                    objEmbed.description = ":x: There are no tsunagarus detected.";
                    return message.channel.send({embed:objEmbed});
                } 
                // else if(userData.token==spawnedCardData.token) {
                //     //user already capture the card on this turn
                //     objEmbed.thumbnail = {
                //         url: CardModule.Properties.imgResponse.imgFailed
                //     }
                //     objEmbed.description = ":x: I know you want to battle but you are in no condition to fight now!";
                //     return message.channel.send({embed:objEmbed});
                // } 
                else if(userData.cardIdSelected==null) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: You need to set your precure avatar first with **p!card set <card id>**!";
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
                var arrColor = []; var trait = "";
                if(CardModule.Properties.spawnData.battle.color in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color];
                    trait = CardModule.Properties.spawnData.battle.color;
                } else if(CardModule.Properties.spawnData.battle.color_non in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_non];
                    trait = CardModule.Properties.spawnData.battle.color_non;
                } else if(CardModule.Properties.spawnData.battle.color_block in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block];
                    trait = CardModule.Properties.spawnData.battle.color_block;
                }  else if(CardModule.Properties.spawnData.battle.color_absorb in jsonParsedSpawnData){
                    arrColor = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_absorb];
                    trait = CardModule.Properties.spawnData.battle.color_absorb;
                }

                //check for battle_protection status effect
                //get status effect
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                var currentStatusEffectSkills = userCardData[DBM_Card_User_Data.columns.status_effect_2];
                if(currentStatusEffectSkills!=null){
                    currentStatusEffectSkills = JSON.parse(currentStatusEffectSkills);
                }

                var captured = false; var specialActivated = false; var teamBattle = false; var hitted = false;

                //default point reward
                var pointReward = 0;
                // var pointReward = 10*cardDataReward[DBM_Card_Data.columns.rarity];
                var seriesPointReward = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var selectedSeriesPoint = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;

                var debuffProtection = false; var removePrecure = true; var allowSecondBattle = false;
                var allowSet = false; var partyBlock = false;

                var randDebuffChance = GlobalFunctions.randomNumber(0,10);
                var randomDebuff = null; //return in object
                randDebuffChance = 8; //for debug purpose only
                if(randDebuffChance<=9){
                    randomDebuff = GlobalFunctions.randomProperty(CardModule.StatusEffect.debuffData); //return in object
                }

                // var inParty = false;
                //check for party
                var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                var partyPoint = 0; var partySynergy = false;//from the leader by default
                // var partyTotalData = null;//temporary

                //check for team battle validation:
                if(enemyCategory==CardModule.Properties.enemySpawnData.tsunagarus.category.boss){
                    teamBattle = true;
                }

                if(partyData==null&&teamBattle){
                    //party validation if boss type
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    };
                    objEmbed.description = `:x: You need to be on a party for this tsunagarus!`;
                    return await message.channel.send({embed:objEmbed});
                } else if(partyData!=null&&teamBattle){
                    inParty = true;
                    partyPoint = partyData[DBM_Card_Party.columns.party_point];
                    partyData = await CardModule.Party.getAllStatus(partyData[DBM_Card_Party.columns.id]);
                    //check for party synergy
                    if(partyData.synergy){partySynergy = true;}
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
                    if(args[1].toLowerCase()!="special"&&args[1].toLowerCase()!="charge"&&args[1].toLowerCase()!="scan"&&args[1].toLowerCase()!="block"){
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        if(teamBattle){
                            //team battle
                            objEmbed.description = ">Use **p!card battle special** to activate the team attack.\n>Use **p!card battle block** to block any offensive actions.\n>Use **p!card battle charge** to charge up the party special attack.\nUse **p!card battle scan <info: color/type/rarity>** to scan the enemy <info>";
                        } else {
                            //individual
                            objEmbed.description = ">Use **p!card battle special** to activate the special attack.\n>Use **p!card battle charge** to charge up your special attack.";
                        }
                        
                        return message.channel.send({embed:objEmbed});
                    } else if(args[1].toLowerCase()=="scan"){
                        //scan command
                        if(!teamBattle){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = ":x: You cannot use the **scan** command for this tsunagarus.";
                        } else if(partyPoint<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = ":x: Your party need 1 Party Point to use the scan command.";
                        } else if(args[2]==null||(args[2]!="color"&&args[2]!="type"&&args[2]!="rarity")){
                            objEmbed.description = "Use one of these <info> that you want to scan: **color**/**type**/**rarity**.";
                        } else {
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.enemySpawnData.tsunagarus.image[enemyType]
                            };
                            switch(args[2]){
                                case "color":
                                    var txtColor = "";
                                    for(var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                        txtColor+=`${key},`;
                                    }
                                    txtColor = txtColor.replace(/,(?=[^,]*$)/, '');

                                    objEmbed.title = "Color Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus currently have: **${txtColor}** lives.`;
                                    break;
                                case "type":
                                    objEmbed.title = "Enemy Type Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus possesses **${CardModule.Properties.enemySpawnData[enemyData[DBM_Card_Enemies.columns.series].toLowerCase()].term}** power`;
                                    break;
                                case "rarity":
                                    objEmbed.title = "Rarity Scanned!"
                                    objEmbed.description = `1 PP has been used! You need card with minimum rarity of: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]}** for this one.`;
                                    break;
                            }
                            
                            //update the party point
                            await CardModule.Party.updatePartyPoint(partyData.partyData[DBM_Card_Party.columns.id],-1);
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
                            var pointSpecial = CardModule.Status.getPartySpecialPointProgress(userCardInventoryData[DBM_Card_Inventory.columns.level_special]+5);
                            //charge for party
                            objEmbed.title = "Party Special Point Charged!";
                            objEmbed.description = `Your party special point has been charged up by ${pointSpecial}%.`;
                            

                            //update the special point reward
                            var specialCharged = await CardModule.Status.updatePartySpecialPoint(partyData.partyData[DBM_Card_Party.columns.id],pointSpecial);
                            if(specialCharged){
                                objEmbed.description += `Your party special point is ready now! You can use the special attack on the next battle spawn.`;
                                // await message.channel.send({embed:CardModule.Embeds.battleSpecialReady(userUsername,userAvatarUrl,false)}); //announce the special ready
                            }
                            await message.channel.send({embed:objEmbed});
                        } else {
                            //reduce the color point
                            var cpCost = 20;//cp cost for battling the enemy
                            if(!specialActivated&&
                                userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<=cpCost){
                                var objEmbed = await message.channel.send({embed:{
                                    color:CardModule.Properties.embedColor,
                                    author: {
                                        name: userUsername,
                                        icon_url: userAvatarUrl
                                    },
                                    thumbnail: {
                                        url:CardModule.Properties.imgResponse.imgError
                                    },
                                    description: `:x: You need ${cpCost} ${cardData[DBM_Card_Data.columns.color]} points to charge up the special attack!`
                                }});

                                setTimeout(function() {
                                    objEmbed.delete();
                                }, 5000);
                                return;
                            } else if(!specialActivated&&userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]>=cpCost){
                                var objColor = new Map();
                                objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,-cpCost);
                                await CardModule.updateColorPoint(userId,objColor);
                            }

                            var pointSpecial = CardModule.Status.getSpecialPointProgress(userCardInventoryData[DBM_Card_Inventory.columns.level],userCardInventoryData[DBM_Card_Inventory.columns.level_special]);

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
                        // await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        return;
                    } else if(args[1].toLowerCase()=="block") {
                        partyBlock = true;
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
                    } else if(teamBattle&&partyData.partyData[DBM_Card_Party.columns.special_point]<100&&args[1].toLowerCase()=="special") {
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
                        partyData.synergy_series!=enemyData[DBM_Card_Enemies.columns.series]&&
                        args[1].toLowerCase()=="special") {
                        //check for special synergy
                        objEmbed.author = {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        };
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        };

                        objEmbed.title = "Defeated! Special Countered!";
                        //reset party special point
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Party.columns.special_point,0);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Party.columns.id,partyData.partyData[DBM_Card_Party.columns.id]);
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
                    } else if(!specialAllow||
                        cardData[DBM_Card_Data.columns.series]!=enemyData[DBM_Card_Enemies.columns.series]) {
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
                            parameterWhere.set(DBM_Card_Party.columns.id,partyData.partyData[DBM_Card_Party.columns.id]);
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

                //color point validator
                var cpBattleCost = 10;//cp cost for battling the enemy
                if(!specialActivated&&
                    userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<=cpBattleCost){
                    var objEmbed = await message.channel.send({embed:{
                        color:CardModule.Properties.embedColor,
                        author: {
                            name: userUsername,
                            icon_url: userAvatarUrl
                        },
                        thumbnail: {
                            url:CardModule.Properties.imgResponse.imgError
                        },
                        description: `:x: You need ${cpAttackCost} ${cardData[DBM_Card_Data.columns.color]} points to attack the tsunagarus!`
                    }});

                    setTimeout(function() {
                        objEmbed.delete();
                    }, 5000);
                    return;
                } else if(!specialActivated&&userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]>=cpBattleCost){
                    var objColor = new Map();
                    objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,-cpBattleCost);
                    await CardModule.updateColorPoint(userId,objColor);
                }

                var level = userCardInventoryData[DBM_Card_Inventory.columns.level];//user card level
                var level_special = userCardInventoryData[DBM_Card_Inventory.columns.level_special];//user level special
                var enemyLevel = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level];
                var bonusDropRate = CardModule.Status.getBonusDropRate(userCardInventoryData[DBM_Card_Inventory.columns.level_special]);

                var hpEnemy = 0; var hpMaxEnemy = 0; var atk = 0; var chance = 0;//default chance
                var teamBattleTurnOut = false;//for battle ends by enemy
                var bossAlive = false;//for bosses
                var livesDown = false;

                var hp = cardData[DBM_Card_Data.columns.max_hp];
                hp = CardModule.Status.getHp(level,hp);

                atk = cardData[DBM_Card_Data.columns.max_atk];
                atk = CardModule.Status.getAtk(level,atk);

                //get enemy hp stats:
                if(!teamBattle){
                    if(CardModule.Properties.spawnData.battle.hp in jsonParsedSpawnData){
                        hpEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp];
                        hpMaxEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max];
                    }
                }
                
                var txtStatusEffectHit = "";//for the end status embed results
                var enemySpawnLink = GlobalFunctions.discordMessageLinkFormat(guildId,message.channel.id,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);

                if(!specialActivated){
                    switch(enemyType){
                        case CardModule.Properties.enemySpawnData.tsunagarus.term.dibosu:
                            
                            var rarity = cardData[DBM_Card_Data.columns.rarity];
                            var overrideChance = false;

                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()){
                                //calculate series buff: +10%
                                chance+=70;
                            }
                            
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts];
                                var skillsActivated = true;
                                switch(valueSkillEffects){
                                    case CardModule.StatusEffect.cureSkillsBuffData.stats_booster.value:
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.catchphrage.value:
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_penalty);
                                        atk+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.levelcutter.value:
                                        //lower the levels
                                        level-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_penalty);
                                        if(level<=0){level=1;}//prevents negative
                                        atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);//modify the atk based from new level
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.endure.value:
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_penalty);
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.starmaster.value:
                                        rarity = 7;
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.cure_blessing.value:
                                        overrideChance = true;
                                        break;
                                    default:
                                        skillsActivated = false;
                                        break;
                                }
                                
                                if(skillsActivated){
                                    if("notifications" in CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects]){
                                        if(CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects].notifications.includes("atk")){
                                            txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(valueSkillEffects,"skills");
                                        }
                                    }

                                    //update the attempts
                                    if(attempts<=1){
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                                    } else {
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts]-=1;
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                                    }
                                }
    
                                //prevents from getting negative
                                if(hp<=0){hp=0;}
                                if(atk<=0){atk=1;}
                            }

                            //check for buff/debuff
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if(currentStatusEffect.includes(`rarity_up_`)){
                                    //check for rarity boost
                                    if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        rarity+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
    
                                        //check if SE permanent/not
                                        if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                            if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                            }
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`hp_up_`)){
                                    //check for rarity boost
                                    if("value_hp_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.buffData[currentStatusEffect].value_hp_boost);
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_up_`)){
                                    //check for atk boost
                                    if("value_atk_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.buffData[currentStatusEffect].value_atk_boost);

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect);
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                                if(currentStatusEffect.includes(`rarity_down_`)){
                                    //check for rarity boost
                                    if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        rarity-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
                                    }
    
                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`hp_down_`)){
                                    //check for rarity boost
                                    if("value_hp_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.debuffData[currentStatusEffect].value_hp_down);
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_down_`)){
                                    //check for atk debuff
                                    if("value_atk_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.debuffData[currentStatusEffect].value_atk_down);
                                        if(atk<=0){atk=0;}//prevents negative

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"debuff");
                                    }

                                    //check if SE permanent/not 
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }

                            chance+=hp;

                            var minChance = GlobalFunctions.randomNumber(1,100);
                            //check for rarity
                            if(CardModule.Properties.spawnData.battle.rarity_less in jsonParsedSpawnData&&
                            rarity+rarityBoost>=enemyRarity){
                                minChance = 1000;
                            } else if(CardModule.Properties.spawnData.battle.rarity_more in jsonParsedSpawnData&&
                                rarity+rarityBoost<=enemyRarity){
                                minChance = 1000;
                            }
                            
                            // minChance = 0;//for debugging purpose
                            //prioritize user hp first, then calculate enemy hp
                            if(chance>=minChance||overrideChance){
                                //check for color trait
                                switch(trait){
                                    case CardModule.Properties.spawnData.battle.color_absorb:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_absorb].includes(cardData[DBM_Card_Data.columns.color])){
                                            hpEnemy+=atk;
                                            if(hpEnemy>=hpMaxEnemy){ hpEnemy = hpMaxEnemy;}

                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);

                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color_block:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){
                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color].includes(cardData[DBM_Card_Data.columns.color])){
                                            hitted = true;
                                        }
                                        break;
                                    default:
                                        hitted = true;
                                        break;
                                }

                                if(hitted){
                                    hpEnemy-=atk;
                                    if(hpEnemy<=0){
                                        hitted = false; captured = true; hpEnemy = 0;
                                    }
    
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp] = hpEnemy;
                                }

                            }
    
                            break;
                        case CardModule.Properties.enemySpawnData.tsunagarus.term.buttagiru:
                            var overrideChance = false;
                            var rarity = cardData[DBM_Card_Data.columns.rarity];

                            //check for actions
                            var txtActionsEmbed = "";
                            hpMaxEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max];

                            //party buffs
                            if(partyData.status_effect in CardModule.StatusEffect.partyBuffData){
                                if(CardModule.StatusEffect.partyBuffData[partyData.status_effect].value.includes(`party_rarity_up_`)){
                                    //check for rarity boost
                                    if("value_rarity_boost" in CardModule.StatusEffect.partyBuffData[partyData.status_effect]){
                                        rarity+=CardModule.StatusEffect.partyBuffData[partyData.status_effect].value_rarity_boost;
                                    }
                                } else if(CardModule.StatusEffect.partyBuffData[partyData.status_effect].value.includes(`party_atk_up_`)){
                                    //check for rarity boost
                                    if("value_atk_boost" in CardModule.StatusEffect.partyBuffData[partyData.status_effect]){
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.partyBuffData[partyData.status_effect].value_atk_boost);

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(partyData.status_effect,"buff",true);
                                    }
                                } else if(CardModule.StatusEffect.partyBuffData[partyData.status_effect].value.includes(`party_hp_up_`)){
                                    //check for rarity boost
                                    if("value_hp_boost" in CardModule.StatusEffect.partyBuffData[partyData.status_effect]){
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.partyBuffData[partyData.status_effect].value_hp_boost);
                                    }
                                }

                                if(hp>=100){hp=100;}
                                else if(hp<=0){hp=0;}
                                if(rarity>=7){rarity=7;}
                            }

                            //skills buffs
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts];
                                var skillsActivated = true;
                                switch(valueSkillEffects){
                                    case CardModule.StatusEffect.cureSkillsBuffData.stats_booster.value:
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.catchphrage.value:
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_penalty);
                                        atk+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.levelcutter.value:
                                        //lower the levels
                                        level-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_penalty);
                                        if(level<=0){level=1;}//prevents negative
                                        atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);//modify the atk based from new level
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.endure.value:
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_penalty);
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.starmaster.value:
                                        rarity = 7;
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.cure_blessing.value:
                                        if(cardData[DBM_Card_Data.columns.color] in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                            overrideChance = true;
                                        }
                                        break;
                                    default:
                                        skillsActivated = false;
                                        break;
                                }
                                
                                if(skillsActivated){
                                    if("notifications" in CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects]){
                                        if(CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects].notifications.includes("atk")){
                                            txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(valueSkillEffects,"skills");
                                        }
                                    }
    
                                    //update the attempts
                                    if(attempts<=1){
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                                    } else {
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts]-=1;
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                                    }
                                }
    
                                //prevents from getting negative
                                if(hp<=0){hp=0;}
                                if(atk<=0){atk=1;}
                            }

                            //check for buff/debuff
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if(currentStatusEffect.includes(`hp_up_`)){
                                    //check for hp boost
                                    if("value_hp_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.buffData[currentStatusEffect].value_hp_boost);
                                    }
    
                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`rarity_up_`)){
                                    //check for rarity boost
                                    if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        rarity+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
    
                                        //check if SE permanent/not
                                        if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                            if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                            }
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_up_`)){
                                    //check for rarity boost
                                    if("value_atk_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.buffData[currentStatusEffect].value_atk_boost);

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect);
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
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.debuffData[currentStatusEffect].value_hp_down);
                                    }
    
                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`rarity_down_`)){
                                    //check for rarity boost
                                    if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        rarity-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
                                    }
    
                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_down_`)){
                                    //check for rarity boost
                                    if("value_atk_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.debuffData[currentStatusEffect].value_atk_down);
                                        if(atk<=0){atk=0;}//prevents negative

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"debuff");
                                    }

                                    //check if SE permanent/not 
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }

                            chance = hp;

                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()&&
                            rarity>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]&&
                            cardData[DBM_Card_Data.columns.color] in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                //check for series & rarity buff
                                chance=100;
                            } else {
                                chance = 0;
                            }

                            // chance = 100;//for debugging

                            //{"category":"boss","type":"buttagiru","id_enemy":"HPC01","level":45,"color_lives":{"purple":420,"yellow":420,"blue":420,"pink":420},"hp_max":420,"id_card_reward":"itmy601","actions":{},"turn":1,"turn_max":28,"rarity":4,"special_allow":false}
                            if(chance>=100||overrideChance){
                                
                                var actions = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions];

                                var txtHeaderActions = ""; var txtDescriptionActions = "" 
                                var parsedColorLives = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives];

                                if(CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.value in actions){
                                    //check for color absorb actions
                                    if(cardData[DBM_Card_Data.columns.color]==jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][CardModule.Properties.spawnData.battle.color_absorb]){
                                        parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                        if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                        txtHeaderActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.name;
                                        txtDescriptionActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.description;
                                        txtDescriptionActions = `${txtDescriptionActions.replace("<xcolor>",cardData[DBM_Card_Data.columns.color])}. `;
                                        txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                        hitted = true;
                                    }
                                    if(!partyBlock){
                                        hitted = true;
                                    }
                                } else if (CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.value in actions){
                                    //atk debuff
                                    txtHeaderActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.name;
                                    txtDescriptionActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.description;

                                    if(!partyBlock){
                                        var randDebuff = [
                                            CardModule.StatusEffect.debuffData.atk_down_1.value,
                                            CardModule.StatusEffect.debuffData.atk_down_2.value,
                                            CardModule.StatusEffect.debuffData.atk_down_3.value,
                                            CardModule.StatusEffect.debuffData.atk_down_4.value,
                                        ];
                                        randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                        await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    }
                                    
                                    
                                    hitted = true;
                                } else if (CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.value in actions){
                                    //hp debuff
                                    txtHeaderActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.name;
                                    txtDescriptionActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.description;

                                    if(!partyBlock){
                                        var randDebuff = [
                                            CardModule.StatusEffect.debuffData.hp_down_1.value,
                                            CardModule.StatusEffect.debuffData.hp_down_2.value,
                                            CardModule.StatusEffect.debuffData.hp_down_3.value,
                                            CardModule.StatusEffect.debuffData.hp_down_4.value,
                                        ];
                                        randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                        await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    }
                                    
                                    hitted = true;
                                } else if (CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.value in actions){
                                    //charge up
                                    txtHeaderActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.name;
                                    txtDescriptionActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.description;

                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+=1;
                                    
                                    if(partyBlock){
                                        hitted = false;
                                    } else {
                                        hitted = true;
                                    }
                                    
                                } else if (CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.value in actions){
                                    //do nothing
                                    txtHeaderActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.name;
                                    txtDescriptionActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.description;
                                    if(partyBlock){
                                        hitted = false;
                                    } else {
                                        hitted = true;
                                    }
                                } else {
                                    hitted = true;
                                }

                                //announce actions embed
                                try {
                                    if(txtHeaderActions!=""){
                                        if(!hitted&&partyBlock){
                                            var objEmbedActions = await message.channel.send({embed:CardModule.Embeds.battleEnemyActions(enemyType,`Counter Fail!`,`**${txtHeaderActions}** cannot be countered/blocked!`,enemySpawnLink)});
                                            setTimeout(function(){
                                                objEmbedActions.delete();
                                            }, 7000);
                                        } else if(hitted&partyBlock) {
                                            var objEmbedActions = await message.channel.send({embed:CardModule.Embeds.battleEnemyActionsBlock(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],userUsername,userAvatarUrl,`Actions Blocked: ${txtHeaderActions}!`,`${userUsername} has successfully blocked: **${txtHeaderActions}** & counter the attacks!`)});
                                            setTimeout(function(){
                                                objEmbedActions.delete();
                                            }, 7000);
                                        } else if(!partyBlock){
                                            var objEmbedActions = await message.channel.send({embed:CardModule.Embeds.battleEnemyActions(enemyType,txtHeaderActions,txtDescriptionActions)});
                                            setTimeout(function(){
                                                objEmbedActions.delete();
                                            }, 7000);
                                        }
                                    }
                                } catch(error){}

                                var minChance = GlobalFunctions.randomNumber(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level],85);
                                chance = hp;
                                // minChance = 0;//for debugging purpose
                                //process damage
                                if(hitted&&chance>=minChance){
                                    var parsedColorLivesDown = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives_down];

                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]-=atk;
                                    if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]<=0){
                                        parsedColorLives[cardData[DBM_Card_Data.columns.color]] = 0;

                                        //check for color taken down
                                        if(!parsedColorLivesDown.includes(cardData[DBM_Card_Data.columns.color])){
                                            livesDown = true;
                                            parsedColorLivesDown.push(cardData[DBM_Card_Data.columns.color]);
                                        }
                                    }

                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives] = parsedColorLives;
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives_down] = parsedColorLivesDown;
                                } else {
                                    hitted = false;
                                }
                            }

                            //check for color lives
                            var colorLivesLeft = 0;
                            for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]>=1){
                                    bossAlive = true; colorLivesLeft++;
                                }
                            }

                            //update the turn
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+=1;
                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]&&bossAlive){
                                //special attack: wipe out party
                                teamBattleTurnOut = true;
                                var txtDescription = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.description;
                                await message.channel.send({embed:CardModule.Embeds.battleEnemyActions(enemyType,CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.name,CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.description)});

                                var parsedDataUser = partyData.data_user;
                                for (var key in parsedDataUser) {
                                    var parameterSet = new Map();
                                    parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                                    var parameterWhere = new Map();
                                    parameterWhere.set(DBM_Card_User_Data.columns.id_user,key);
                                    await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                                }
                            } else {
                                //reset the actions
                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions] = {};

                                //randomize the attack
                                var nextActions = null;
                                var randomActions = null;
                                if(colorLivesLeft>1){
                                    randomActions = GlobalFunctions.randomProperty(CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions);
                                } else {
                                    randomActions = GlobalFunctions.randomProperty(CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions_last_lives);
                                }

                                // randomActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up;//for debugging

                                if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+1>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]){
                                    randomActions = CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam;
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][randomActions.value] = "";
                                    txtActionsEmbed = randomActions.name;
                                } else {
                                    if(randomActions.value==CardModule.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.value){
                                        //randomize color absorb
                                        var randomColor = GlobalFunctions.randomPropertyKey(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]);
                                        
                                        var newRandomColor = "";
                                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][randomActions.value] = randomColor;
                                        for(var i=0;i<randomColor.length;i++){
                                            if(i>0){ newRandomColor+="?"; }
                                            else {newRandomColor+=`${randomColor[i]}`;}
                                            
                                        }

                                        txtActionsEmbed = `${randomActions.name} - ${newRandomColor}`;
                                    } else {
                                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][randomActions.value] = "";
                                        txtActionsEmbed = randomActions.name;
                                    }
                                }

                                try{
                                    nextActions = await message.channel.send({embed:CardModule.Embeds.battleEnemyActionsPrepare(enemyType,randomActions.name,txtActionsEmbed)});
                                    setTimeout(function(){
                                        nextActions.delete();
                                    }, 7000);
                                } catch(error){}
                            }

                            //update embeds
                            try{
                                if(!teamBattleTurnOut&&bossAlive){
                                    var messageSpawn = await message.channel.messages
                                    .fetch(guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);
                                    var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
    
                                    var txtHpEmbed = editedEmbed.fields[0].value.split("\n");
                                    var newtxtHpEmbed = "";
                                    var ctr = 0;
                                    for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                        var splittedHp = txtHpEmbed[ctr].split("/");
                                        splittedHp = splittedHp[0].split(": ");
                                        newtxtHpEmbed+=`${splittedHp[0]}: ${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]}/${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max]}\n`;
                                        ctr++;
                                    }
                                    newtxtHpEmbed = newtxtHpEmbed.replace("/\n$/","");
    
                                    editedEmbed.fields[0].value = `${newtxtHpEmbed}`;
                                    editedEmbed.fields[2].value = `${txtActionsEmbed}`;
                                    editedEmbed.fields[3].value = `${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]}/${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]}`;
                                    try{
                                        await messageSpawn.edit(editedEmbed);
                                    } catch(error){}
                                    
                                }
                                
                            } catch(error){}
    
                            break;
                        case CardModule.Properties.enemySpawnData.tsunagarus.term.chiguhaguu:
                        case CardModule.Properties.enemySpawnData.tsunagarus.term.gizzagizza:
                            //gizzagizza
                            // {"category":"normal","type":"gizzagizza","id_enemy":"FPC10","color_block":"red","id_card_reward":"haha501","level":32,"rarity":5,"hp":388,"hp_max":388,"damage_dealer":{}}
    
                            var rarity = cardData[DBM_Card_Data.columns.rarity];
                            var overrideChance = false;
    
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts];
                                var skillsActivated = true;
                                switch(valueSkillEffects){
                                    case CardModule.StatusEffect.cureSkillsBuffData.stats_booster.value:
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.catchphrage.value:
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_penalty);
                                        atk+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.levelcutter.value:
                                        //lower the levels
                                        level-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_penalty);
                                        if(level<=0){level=1;}//prevents negative
                                        atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);//modify the atk based from new level
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.starmaster.value:
                                        rarity = 7;
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.cure_blessing.value:
                                        overrideChance = true;
                                        break;
                                    default:
                                        skillsActivated = false;
                                        break;
                                }
                                
                                if(skillsActivated){
                                    if("notifications" in CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects]){
                                        if(CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects].notifications.includes("atk")){
                                            txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(valueSkillEffects,"skills");
                                        }
                                    }
                                    //update the attempts
                                    if(attempts<=1){
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                                    } else {
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts]-=1;
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                                    }
                                }
    
                                //prevents from getting negative
                                if(atk<=0){atk=0;}
                            }
    
                            //check for buff/debuff
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if(currentStatusEffect.includes(`rarity_up_`)){
                                    //check for rarity boost
                                    if("value_rarity_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        rarity+=CardModule.StatusEffect.buffData[currentStatusEffect].value_rarity_boost;
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_up_`)){
                                    //check for rarity boost
                                    if("value_atk_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.buffData[currentStatusEffect].value_atk_boost);

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect);
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            } else if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                                if(currentStatusEffect.includes(`rarity_down_`)){
                                    //check for rarity boost
                                    if("value_rarity_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        rarity-=CardModule.StatusEffect.debuffData[currentStatusEffect].value_rarity_down;
                                    }

                                    //check if SE permanent/not 
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_down_`)){
                                    //check for rarity boost
                                    if("value_atk_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.debuffData[currentStatusEffect].value_atk_down);
                                        if(atk<=0){atk=0;}//prevents negative

                                        txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"debuff");
                                    }

                                    //check if SE permanent/not 
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }                               
                            }
    
                            //check for series
                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()!=enemyData[DBM_Card_Enemies.columns.series].toLowerCase()||
                            rarity<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]){
                                chance=0;
                            } else {
                                chance=100;
                            }
    
                            if(chance>0||overrideChance){
                                switch(trait){
                                    case CardModule.Properties.spawnData.battle.color_absorb:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_absorb].includes(cardData[DBM_Card_Data.columns.color])){
                                            hpEnemy+=atk;
                                            if(hpEnemy>=hpMaxEnemy){ hpEnemy = hpMaxEnemy;}
    
                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color_block:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){
                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color].includes(cardData[DBM_Card_Data.columns.color])){
                                            hitted = true;
                                        }
                                        break;
                                }

                                if(hitted){
                                    hpEnemy-=atk;
                                    if(hpEnemy<=0){
                                        hitted = false; captured = true; hpEnemy = 0;
                                    }
        
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp] = hpEnemy;
                                }
                            }
    
                            break;
                        case CardModule.Properties.enemySpawnData.tsunagarus.term.chokkins:
                        default:
                            //chokkins:
                            // {"category":"normal","type":"chokkins","id_enemy":"HCPC03","level":20,"color":["purple"],"id_card_reward":"saya702","special_allow":false,"hp":90,"max_hp":90}
    
                            var overrideChance = false;

                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()){
                                //calculate series buff: +10%
                                chance+=20;
                            }
            
                            enemyLevel = parseInt(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level]);
            
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts];
                                var skillsActivated = true;
                                switch(valueSkillEffects){
                                    case CardModule.StatusEffect.cureSkillsBuffData.stats_booster.value:
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.stats_booster.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.catchphrage.value:
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_penalty);
                                        atk+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.catchphrage.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.levelcutter.value:
                                        //lower the levels
                                        level-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_penalty);
                                        if(level<=0){level=1;}//prevents negative
                                        atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);//modify the atk based from new level
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.levelcutter.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.endure.value:
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_penalty);
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData.endure.boost_value);
                                        break;
                                    case CardModule.StatusEffect.cureSkillsBuffData.cure_blessing.value:
                                        hp=9999; overrideChance = true;
                                        break;
                                    default:
                                        skillsActivated = false;
                                        break;
                                }
                                
                                if(skillsActivated){
                                    if("notifications" in CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects]){
                                        if(CardModule.StatusEffect.cureSkillsBuffData[valueSkillEffects].notifications.includes("atk")){
                                            txtStatusEffectHit+=CardModule.StatusEffect.statusEffectBattleHitResults(valueSkillEffects,"skills");
                                        }
                                    }

                                    //update the attempts
                                    if(attempts<=1){
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                                    } else {
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts]-=1;
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                                    }
                                }
    
                                //prevents from getting negative
                                if(hp<=0){hp=0;}
                                if(atk<=0){atk=1;}
                            }
    
                            //check for buff/debuff
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if(currentStatusEffect.includes(`hp_up_`)){
                                    //check for rarity boost
                                    if("value_hp_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.buffData[currentStatusEffect].value_hp_boost);
                                    }

                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_up_`)){
                                    //check for atk boost
                                    if("value_atk_boost" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.buffData[currentStatusEffect].value_atk_boost);

                                        txtStatusEffectHit+= CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect);
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
                                        hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.debuffData[currentStatusEffect].value_hp_down);
                                    }
    
                                    //check if SE permanent/not
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                } else if(currentStatusEffect.includes(`atk_down_`)){
                                    //check for atk debuff
                                    if("value_atk_down" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.debuffData[currentStatusEffect].value_atk_down);
                                        if(atk<=0){atk=0;}//prevents negative
                                        txtStatusEffectHit+= CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"debuff");
                                    }

                                    //check if SE permanent/not 
                                    if("permanent" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.debuffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                        }
                                    }
                                }
                            }
    
                            var minChance = GlobalFunctions.randomNumber(enemyLevel,100);
    
                            // minChance = 0;//for debugging purpose
                            chance+=hp;
    
                            //prioritize user hp first, then calculate enemy hp
                            if(chance>=minChance||overrideChance){
                                //start
    
                                switch(trait){
                                    case CardModule.Properties.spawnData.battle.color_absorb:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_absorb].includes(cardData[DBM_Card_Data.columns.color])){
                                            hpEnemy+=atk;
                                            if(hpEnemy>=hpMaxEnemy){ hpEnemy = hpMaxEnemy;}
    
                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);
    
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color_block:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){
                                            var objEmbed = await message.channel.send({embed:CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)});
                                            setTimeout(function() {
                                                objEmbed.delete();
                                            }, 7000);
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    default:
                                        hitted = true;
                                        break;
                                }
    
                                //hp max validation
    
                                if(hitted){
                                    hpEnemy-=atk;
                                    if(hpEnemy<=0){
                                        hitted = false; captured = true; hpEnemy = 0;
                                    }
    
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp] = hpEnemy;
                                }
                            }
            
                            // captured = true; //for debugging purpose!
                            
                            break;
                    }
                }

                //add new card/update card stock & check for card completion
                var rewardsReceived = "";

                var messageSpawn = null;
                try{
                    messageSpawn = await message.channel.messages
                    .fetch(guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);
                } catch(error){
                }

                if(teamBattle){
                    //team battle
                    if(bossAlive&&hitted&&!teamBattleTurnOut&&!specialActivated){
                        var dataUser = partyData.data_user;
                        //color points
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 13;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 15;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 10;
                                break;
                        }

                        var queryIdUser= "";
                        for(var key in dataUser){
                            queryIdUser+=`"${key}",`;
                        }
                        queryIdUser = queryIdUser.replace(/,\s*$/, "");//remove last comma

                        var splittedUserId = partyData.partyData[DBM_Card_Party.columns.party_data].split(",");

                        if(livesDown){
                            var query = `SELECT *  
                            FROM ${DBM_Item_Data.TABLENAME}  
                            WHERE ${DBM_Item_Data.columns.category}=?  
                            ORDER BY RAND() LIMIT 1`;
                            //check for item drop chance
                            var dropData = await DBConn.conn.promise().query(query,["misc_fragment"]);
                            //fragment drop
                            var fragmentDropData = dropData[0][0];
                            rewardsReceived+=`>**Fragment:** ${fragmentDropData[DBM_Item_Data.columns.name]} **(${fragmentDropData[DBM_Item_Data.columns.id]})**\n`;

                            for(var i=0;i<splittedUserId.length;i++){
                                //add item rewards to all members
                                await ItemModule.addNewItemInventory(splittedUserId[i],fragmentDropData[DBM_Item_Data.columns.id],1);
                            }
                        }

                        //update mofucoin,colorpoint and series point
                        var queryUpdateMultipleUserStatus = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET color_point_${cardData[DBM_Card_Data.columns.color]}=color_point_${cardData[DBM_Card_Data.columns.color]}+${pointReward} `;
                        if(livesDown){
                            queryUpdateMultipleUserStatus+=` ,${selectedSeriesPoint}=${selectedSeriesPoint}+${seriesPointReward} `;
                            rewardsReceived+=`>${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                        }
                        queryUpdateMultipleUserStatus+=`WHERE ${DBM_Card_User_Data.columns.id_user} in (${queryIdUser})`;
                        await DBConn.conn.promise().query(queryUpdateMultipleUserStatus);

                        rewardsReceived+=`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                        //update the party special point
                        var specialCharged = false;
                        
                        //update the special point reward
                        var pointSpecial = CardModule.Status.getPartySpecialPointProgress(level_special);
                        specialCharged = await CardModule.Status.updatePartySpecialPoint(partyData.partyData[DBM_Card_Party.columns.id],pointSpecial);
                        rewardsReceived+=`>**${pointSpecial}**% party special points\n`;

                        try{
                            if(livesDown){
                                await message.channel.send({embed:CardModule.Embeds.teamBattleLivesDown(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],`${partyData.partyData[DBM_Card_Party.columns.name]} - ${userUsername}`,userAvatarUrl,rewardsReceived)});
                            } else {
                                var messageHit = await message.channel.send({embed:CardModule.Embeds.teamBattleHit(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],`${partyData.partyData[DBM_Card_Party.columns.name]} - ${userUsername}`,userAvatarUrl,`**${userUsername}** has deal **${atk} ${cardData[DBM_Card_Data.columns.color]}** damage!`,txtStatusEffectHit,rewardsReceived,enemySpawnLink)});
                                setTimeout(function(){
                                    messageHit.delete();
                                }, 6000);
                            }
                            
                        } catch(error){}

                        //update the spawn data
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                    } else if(!bossAlive||specialActivated){
                        //team battle win
                        //randomize card fragment
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 80;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 90;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 70;
                                break;
                        }

                        var query = `SELECT * FROM (
                        (SELECT *  
                        FROM ${DBM_Item_Data.TABLENAME}  
                        WHERE ${DBM_Item_Data.columns.category}=?  
                        ORDER BY RAND() 
                        LIMIT 1)
                        UNION  
                        (SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME}  
                        WHERE ${DBM_Item_Data.columns.category}=? OR 
                        ${DBM_Item_Data.columns.category}=? AND 
                        ${DBM_Item_Data.columns.category}<=? 
                        ORDER BY RAND() 
                        LIMIT 1)
                        ) AS t1`;
                        //check for item drop chance
                        var itemDropRareChance = GlobalFunctions.randomNumber(0,100);
                        var dropData = await DBConn.conn.promise().query(query,["misc_fragment","ingredient","ingredient_rare",itemDropRareChance]);
                        //fragment drop
                        var fragmentDropData = dropData[0][0];
                        rewardsReceived+=`>**Fragment:** ${fragmentDropData[DBM_Item_Data.columns.name]} **(${fragmentDropData[DBM_Item_Data.columns.id]})**\n`;

                        // item drop
                        var itemDropData = dropData[0][1];
                        if(itemDropData!=null){
                            rewardsReceived+=`>**Item:** ${itemDropData[DBM_Item_Data.columns.name]} **(${itemDropData[DBM_Item_Data.columns.id]})**\n`;
                        }
    
                        //put all the rewards:
                        rewardsReceived+=`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                        rewardsReceived+=`>${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                        
                        //update the mofucoin
                        var mofucoinReward = pointReward;
                        if(mofucoinReward<=0){
                            mofucoinReward = 20;
                        }
                        rewardsReceived+=`>${mofucoinReward} mofucoin\n`
                        
                        //update the party special point
                        var specialCharged = false;
                        if(!specialActivated){
                            //update the special point reward
                            var pointSpecial = CardModule.Status.getPartySpecialPointProgress(level_special);
                            specialCharged = await CardModule.Status.updatePartySpecialPoint(partyData.partyData[DBM_Card_Party.columns.id],pointSpecial);
                            rewardsReceived+=`>**${pointSpecial}**% party special points\n`;
                        }

                        var paramIdUser = []; var queryIdUser= "";

                        //add rewards to leader
                        await ItemModule.addNewItemInventory(partyData.partyData[DBM_Card_Party.columns.id_user],fragmentDropData[DBM_Item_Data.columns.id],1);
                        await ItemModule.addNewItemInventory(partyData.partyData[DBM_Card_Party.columns.id_user],itemDropData[DBM_Item_Data.columns.id],1);

                        paramIdUser.push(partyData.partyData[DBM_Card_Party.columns.id_user]);
                        queryIdUser+="?,";

                        var splittedUserId = partyData.partyData[DBM_Card_Party.columns.party_data].split(",");
                        for(var i=0;i<splittedUserId.length;i++){
                            //add rewards to all members
                            await ItemModule.addNewItemInventory(splittedUserId[i],fragmentDropData[DBM_Item_Data.columns.id],1);
                            await ItemModule.addNewItemInventory(splittedUserId[i],itemDropData[DBM_Item_Data.columns.id],1);

                            paramIdUser.push(splittedUserId[i]);
                            queryIdUser+="?,";
                        }

                        queryIdUser = queryIdUser.replace(/,\s*$/, "");//remove last comma

                        //update mofucoin,colorpoint and series point
                        var queryUpdateMultipleUserStatus = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET color_point_${cardData[DBM_Card_Data.columns.color]}=color_point_${cardData[DBM_Card_Data.columns.color]}+${pointReward},
                        ${selectedSeriesPoint}=${selectedSeriesPoint}+${seriesPointReward},
                        ${DBM_Card_User_Data.columns.mofucoin}=${DBM_Card_User_Data.columns.mofucoin}+${mofucoinReward}  
                        WHERE ${DBM_Card_User_Data.columns.id_user} in (${queryIdUser})`;
                        await DBConn.conn.promise().query(queryUpdateMultipleUserStatus,paramIdUser);

                        //battle win
                        rewardsReceived+=`>Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**`;

                        //adds up the card to leader
                        var userCardRewardStock = await CardModule.getUserCardStock(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card]);
                        if(userCardRewardStock<=-1){
                            await CardModule.addNewCardInventory(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card]);
                        } else if(userCardRewardStock<CardModule.Properties.maximumCard){
                            await CardModule.addNewCardInventory(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card],true);
                        }

                        //check leader card pack completion:
                        var embedCompletion = null;
                        var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                        var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"color",cardDataReward[DBM_Card_Data.columns.color]);
                        var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"series",cardDataReward[DBM_Card_Data.columns.series]);
    
                        if(checkCardCompletionPack){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }
                        
                        if(checkCardCompletionColor) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }
    
                        if(checkCardCompletionSeries) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                            if(embedCompletion!=null){
                                await message.channel.send({embed:embedCompletion});
                            }
                        }

                        //adds up card to all members
                        var splittedUserId = partyData.partyData[DBM_Card_Party.columns.party_data].split(",");
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
                            message.channel.send({embed:CardModule.Embeds.teamBattleSpecialActivated(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.pack],partyData.partyData[DBM_Card_Party.columns.name],rewardsReceived)});
                        } else {
                            message.channel.send({embed:CardModule.Embeds.teamBattleWin(cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.series],partyData.partyData[DBM_Card_Party.columns.name],rewardsReceived)});
                        }

                        //erase the spawn data
                        await CardModule.removeCardGuildSpawn(guildId);

                    } else {
                        //team battle defeated
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 7;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 10;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 5;
                                break;
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

                        objEmbed.title = "Defeated";
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

                        // if(allowSet){
                        //     //erase the card set token
                        //     var parameterSet = new Map();
                        //     parameterSet.set(DBM_Card_User_Data.columns.card_set_token,null);
                        //     var parameterWhere = new Map();
                        //     parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        //     await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        // }

                        //check for second battle allowance
                        // if(!allowSecondBattle){
                        //     //update the spawn token
                        //     await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        // }

                        //activate the debuff if user doesn't have debuff protection
                        var debuff_data = "";
                        if(!debuffProtection&&randomDebuff!=null){
                            await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                            debuff_data = randomDebuff.value;
                        }

                        await message.channel.send({embed:CardModule.Embeds.battleLost(userUsername,userAvatarUrl,txtDescription,`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,debuff_data,enemySpawnLink)});

                        //check if buff status effect is permanent/not
                        if(currentStatusEffect in CardModule.StatusEffect.buffData){
                            if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                    await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                }
                            }
                        }

                        //remove the spawn
                        if(teamBattleTurnOut){
                            await CardModule.removeCardGuildSpawn(guildId);
                        } else {
                            //update the spawn data
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                            await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
                        }

                    }
                } else {
                    //individual
                    var duplicate = true;
                    if(!specialActivated&&hitted&&hpEnemy>0){
                        //color points
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 10;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 15;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 5;
                                break;
                        }

                        var specialPointReward = CardModule.Status.getSpecialPointProgress(level_special);
                        var txtRewards = `>${pointReward} ${cardData[DBM_Card_Data.columns.color]} points\n>${specialPointReward}% special points`;

                        //distribute the reward
                        await CardModule.Status.updateSpecialPoint(userId,specialPointReward); //special points
                        var objColor = new Map(); //color points
                        objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                        await CardModule.updateColorPoint(userId,objColor);

                        //initialize the damage dealer(DD) data if user not found:
                        if(!(userId in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer])){
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer][`${userId.toString()}`] = 0;
                        }
                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer][userId]+=atk;//modify DD data

                        //modify the enemy hp
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                        var embedHit = await message.channel.send({embed:CardModule.Embeds.battleHitHpSuccess(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],userUsername,userAvatarUrl,`**${userUsername}** has deals **${atk}** damage to **${enemyType}**!`,txtStatusEffectHit,txtRewards,`${hpEnemy}/${hpMaxEnemy}`)});

                        try{
                            setTimeout(function() {
                                embedHit.delete();
                            }, 5000);
                        } catch(error){}
                        
                        //edit the embed
                        switch(enemyType){
                            case CardModule.Properties.enemySpawnData.tsunagarus.term.chokkins:
                                try{
                                    var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                    editedEmbed.fields[2].value = `${hpEnemy}/${hpMaxEnemy}`;
                                    await messageSpawn.edit(editedEmbed);
                                } catch(error){}
                                break;
                            case CardModule.Properties.enemySpawnData.tsunagarus.term.dibosu:
                            case CardModule.Properties.enemySpawnData.tsunagarus.term.chiguhaguu:
                                try{
                                    var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                    editedEmbed.fields[1].value = `${hpEnemy}/${hpMaxEnemy}`;
                                    await messageSpawn.edit(editedEmbed);
                                } catch(error){}
                                break;
                            case CardModule.Properties.enemySpawnData.tsunagarus.term.gizzagizza:
                                try{
                                    var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                    editedEmbed.fields[0].value = `${hpEnemy}/${hpMaxEnemy}`;
                                    await messageSpawn.edit(editedEmbed);
                                } catch(error){}
                                break;
                        }

                    } else if(specialActivated||captured||hpEnemy<=0){
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 60;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 70;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 50;
                                break;
                        }

                        //initialize the damage dealer(DD) data if user not found:
                        if(!(userId in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer])){
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer][`${userId.toString()}`] = 0;
                        }

                        if(specialActivated){
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer][userId]=9999;
                        } else {
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer][userId]+=atk;//modify DD data
                        }

                        //get the winner data
                        var damageDealerData = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer];
                        damageDealerData = GlobalFunctions.sortObject(damageDealerData);

                        var oldIdUser = userId;
                        userId = Object.keys(damageDealerData)[Object.keys(damageDealerData).length-1];
                        //get user information;
                        await message.guild.members.fetch(`${userId}`)
                        .then(
                            async members=> {
                                userUsername = members.user.username;
                                userAvatarUrl = members.user.avatarURL();
                            }
                        );

                        //list all damage dealer data
                        var txtDamageDealerList =  ""; var ctr=0;
                        var arrDamageDealerName = []; var arrDamageDealerPoint = [];
                        //reverse the order:
                        for (const [key, value] of Object.entries(damageDealerData)) {
                            arrDamageDealerName.push(`${key}`); arrDamageDealerPoint.push(`${value}`);
                        }

                        arrDamageDealerName.reverse(); arrDamageDealerPoint.reverse();

                        //prints out damage dealer
                        arrDamageDealerName.forEach(item => {
                            txtDamageDealerList+=`${ctr+1}. <@${item}> : ${arrDamageDealerPoint[ctr]}p \n`;
                            ctr++;
                        });

                        var embedDamageDealerList = {
                            color:CardModule.Properties.embedColor,
                            title:"❤️ Damage Dealer List:",
                            description:txtDamageDealerList,
                            thumbnail:{
                                url:CardModule.Properties.imgResponse.imgOk
                            },
                        }

                        await message.channel.send({embed:embedDamageDealerList});

                        var userCardRewardStock = await CardModule.getUserCardStock(userId,cardDataReward[DBM_Card_Data.columns.id_card]);
                        var qty = 1; var rewardBoost = false;

                        //reward booster validation
                        if(currentStatusEffectSkills!=null&&oldIdUser==userId){
                            var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.value];
                            var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect2.attempts];
                            var skillsActivated = true;
                            switch(valueSkillEffects){
                                case CardModule.StatusEffect.cureSkillsBuffData.reward_booster.value:
                                    rewardBoost = true;
                                    var embedSkillsActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,valueSkillEffects,"skills");

                                    var objEmbed = await message.channel.send({embed:embedSkillsActivated});
                                    setTimeout(function() {
                                        objEmbed.delete();
                                    }, 7000);

                                    //update the attempts
                                    if(attempts<=1){
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                                    } else {
                                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                                    }
                                    break;
                            }
                        }

                        //stock validation
                        if(userCardRewardStock<=-1){
                            if(!rewardBoost){
                                rewardsReceived+=`>New Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                            
                                //add new card:
                                await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card]);
                            } else {
                                rewardsReceived+=`>2x New Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                            
                                //add new card:
                                await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card]);
                                await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card],true);
                            }
                            duplicate = false;
                        } else {
                            if(userCardRewardStock<CardModule.Properties.maximumCard){
                                // objEmbed.description = `<@${userId}> has received another duplicate card.`;
                                if(!rewardBoost){
                                    rewardsReceived+=`>Duplicate Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                                    userCardRewardStock+=1;
                                    //add new card:
                                    await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card],true);
                                } else {
                                    rewardsReceived+=`>2x Duplicate Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                                    userCardRewardStock+=1;
                                    //add new card:
                                    await CardModule.addNewCardInventory(userId,cardDataReward[DBM_Card_Data.columns.id_card],true,2);
                                }
                                
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
                            ORDER BY rand() LIMIT 1`;
                            var itemDropData = await DBConn.conn.promise().query(query,["ingredient","ingredient_rare",itemDropRareChance]);
                            if(itemDropData[0][0]!=null){
                                // var embedItemReward = ItemModule.Embeds.ItemDropReward(userUsername,userAvatarUrl,itemDropData[0][0][DBM_Item_Data.columns.id],itemDropData[0][0][DBM_Item_Data.columns.name],itemDropData[0][0][DBM_Item_Data.columns.description]);
                                // await message.channel.send({embed:embedItemReward});
                                var qty = 1;
                                if(rewardBoost){
                                    qty = 2;
                                }
                                rewardsReceived+=`>${qty}x Item: ${itemDropData[0][0][DBM_Item_Data.columns.name]} **(${itemDropData[0][0][DBM_Item_Data.columns.id]})**\n`;
    
                                //check for item stock:
                                var userItemStock = await ItemModule.getUserItemStock(userId,itemDropData[0][0][DBM_Item_Data.columns.id]);
                                if(userItemStock<=-1){
                                    await ItemModule.addNewItemInventory(userId,itemDropData[0][0][DBM_Item_Data.columns.id]);
                                    if(rewardBoost){
                                        await ItemModule.updateItemStock(userId,itemDropData[0][0][DBM_Item_Data.columns.id],1);
                                    }
                                } else {
                                    await ItemModule.updateItemStock(userId,itemDropData[0][0][DBM_Item_Data.columns.id],qty);
                                }
                            }
                        }
    
                        //put all the rewards:
                        if(rewardBoost){
                            pointReward*=2; seriesPointReward*=2;
                        }
                        rewardsReceived+=`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                        rewardsReceived+=`>${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                        
                        //update the mofucoin
                        var mofucoinReward = Math.round(pointReward/3);
                        if(mofucoinReward<=0){
                            mofucoinReward = 20;
                        }
                        if(rewardBoost){
                            mofucoinReward*=2;
                        }
                        await CardModule.updateMofucoin(userId,mofucoinReward);
                        rewardsReceived+=`>${mofucoinReward} mofucoin\n`
    
                        var specialCharged = false;
                        if(!specialActivated){
                            //update the special point reward
                            var pointSpecial = CardModule.Status.getSpecialPointProgress(level_special);
                            if(rewardBoost){ pointSpecial*=2; }
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
                        // reviveChance = 0;//for debugging purpose only
                        if(duplicate&&reviveChance<=7){
                            var enemyRevivalEmbed = {
                                author : {
                                    name: "Mofurun",
                                    icon_url: CardModule.Properties.imgResponse.imgFailed
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Tsunagarus Respawned!`,
                                description: `Looks like the tsunagarus has been respawned again!`,
                                fields:{
                                    name:'Spawn Link:',
                                    value:`[Jump to spawn link](${GlobalFunctions.discordMessageLinkFormat(guildId,guildSpawnData[DBM_Card_Guild.columns.id_channel_spawn],guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn])})`
                                },
                                thumbnail:{
                                    url:CardModule.Properties.enemySpawnData.tsunagarus.image[enemyType]
                                }
                            };
                            await message.channel.send({embed:enemyRevivalEmbed});

                            //reset spawn data
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer]={};//modify DD data
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp] = hpMaxEnemy;
                            //modify the enemy hp
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                            await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                            //update the embed
                            switch(enemyType){
                                case CardModule.Properties.enemySpawnData.tsunagarus.term.chokkins:
                                    try{
                                        var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                        editedEmbed.fields[2].value = `${hpMaxEnemy}/${hpMaxEnemy}`;
                                        await messageSpawn.edit(editedEmbed);
                                    } catch(error){}
                                    break;
                                case CardModule.Properties.enemySpawnData.tsunagarus.term.dibosu:
                                case CardModule.Properties.enemySpawnData.tsunagarus.term.chiguhaguu:
                                    try{
                                        var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                        editedEmbed.fields[1].value = `${hpMaxEnemy}/${hpMaxEnemy}`;
                                        await messageSpawn.edit(editedEmbed);
                                    } catch(error){}
                                    break;
                                case CardModule.Properties.enemySpawnData.tsunagarus.term.gizzagizza:
                                    try{
                                        var editedEmbed = new Discord.MessageEmbed(messageSpawn.embeds[0]);
                                        editedEmbed.fields[0].value = `${hpMaxEnemy}/${hpMaxEnemy}`;
                                        await messageSpawn.edit(editedEmbed);
                                    } catch(error){}
                                    break;
                            }

                        } else {
                            await CardModule.removeCardGuildSpawn(guildId);
                        }
    
                    } else {
                        //failed to defeat the enemy
                        switch(cardData[DBM_Card_Data.columns.rarity]){
                            case 3:
                            case 4:
                                pointReward = 5;
                                break;
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                                pointReward = 7;
                                break;
                            case 1:
                            case 2:
                            default:
                                pointReward = 2;
                                break;
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

                        // if(allowSet){
                        //     //erase the card set token
                        //     var parameterSet = new Map();
                        //     parameterSet.set(DBM_Card_User_Data.columns.card_set_token,null);
                        //     var parameterWhere = new Map();
                        //     parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        //     await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        // }

                        // //check for second battle allowance
                        // if(!allowSecondBattle){
                        //     //update the spawn token
                        //     await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                        // }

                        txtDescription += ` You have received some rewards from the battle.`;

                        //activate the debuff if user doesn't have debuff protection
                        var debuff_data = "";
                        if(!debuffProtection&&randomDebuff!=null){
                            //check if have debuff/not
                            if(!(currentStatusEffect in CardModule.StatusEffect.debuffData)){
                                await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                                debuff_data = randomDebuff.value;
                            }
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
                    objEmbed.description = "-Use **p!card convert point <cardid> [all/qty]** to convert the chosen card id into color & series points.\n-Use **p!card convert mofucoin <cardid> [all/qty]** to convert the chosen card id into mofucoin.\n-Use **p!card convert item <cardid>** to convert the chosen card id into item.\n-Use **p!card convert level <cardid> <card id target> [qty]** to convert the chosen card id into level on <card id target>.\n-Use **p!card convert fragmenttolevel <cardid>** to level up the <cardid> with card fragment.\n-Use **p!card convert fragmenttopoint <fragment id>** to convert the fragment into series point.";
                    return message.channel.send({embed:objEmbed});
                } else if(convertOptions.toLowerCase()!="point" && convertOptions.toLowerCase()!="mofucoin" &&
                 convertOptions.toLowerCase()!="item"&& convertOptions.toLowerCase()!="level"&& 
                 convertOptions.toLowerCase()!="fragpoint"&&convertOptions.toLowerCase()!="fragmenttopoint"&&
                 convertOptions.toLowerCase()!="fraglevel"&&convertOptions.toLowerCase()!="fragmenttolevel"){
                    objEmbed.description = "-Use **p!card convert point <cardid> [all/qty]** to convert the chosen card id into color & series points.\n-Use **p!card convert mofucoin <cardid> [all/qty]** to convert the chosen card id into mofucoin.\n-Use **p!card convert item <cardid>** to convert the chosen card id into item.\n-Use **p!card convert level <cardid> <card id target> [qty]** to convert the chosen card id into level on <card id target>.\n-Use **p!card convert fraglevel <cardid>** to level up the <cardid> with card fragment.\n-Use **p!card convert fragpoint <fragment id>** to convert the fragment into series point.";
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
                        var qty = 1;
                        var targetCardId = args[3];
                        var cardStock = await CardModule.getUserCardStock(userId,cardId);
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

                        if(args[4]!=null){
                            if(isNaN(args[4])){
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = `Use **p!card convert level <card id> <target id> [qty]** to convert the card with the amount parameter.`;
                                return message.channel.send({embed:objEmbed});
                            } else {
                                qty = parseInt(args[4]);
                            }
                        }

                        var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                        var rarity = cardData[DBM_Card_Data.columns.rarity];
                        var rarityValue = 0;

                        if(cardData[DBM_Card_Data.columns.pack]!=cardData[DBM_Card_Data.columns.pack]){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, both of the card need to be on the same card pack.`;
                        } else if(cardStock<=-1){
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
                        } else if(cardStock<qty||userTargetCardStock<=-1){
                            //card stock validation
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you need ${qty}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** & **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert the card into level.`;
                        } else if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardData[DBM_Card_Data.columns.rarity])){
                            //check for max level
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** already reached the max level!`;   
                        } else if(cardStock>=1&&userTargetCardStock>=0){
                            //check for card level
                            switch(rarity){
                                case 6:
                                case 7:
                                    rarityValue = 6;
                                default:
                                    rarityValue = rarity;
                                    break;
                            }

                            rarityValue*=qty;

                            var txtCardDataSource = `${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}`;
                            var cardData = await CardModule.getCardData(targetCardId);//target card id

                            //update the level
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME} 
                            SET ${DBM_Card_Inventory.columns.level}=${DBM_Card_Inventory.columns.level}+${rarityValue}
                            WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                            ${DBM_Card_Inventory.columns.id_card}=?`;
                            await DBConn.conn.promise().query(query,[userId,cardData[DBM_Card_Data.columns.id_card]]);

                            //update the card stock
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                            SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-${qty}  
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

                            return message.channel.send({content:`**${userUsername}** has convert ${qty}x **${txtCardDataSource}** & increased **${cardData[DBM_Card_Data.columns.name]}** level by **${rarityValue}**.\n${cardData[DBM_Card_Data.columns.name]} is now level **${userCardData[DBM_Card_Inventory.columns.level]}**!`, embed:objEmbed});
                            
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
                        var qty = 1;
                        if(args[3]!=null){
                            //check if convert all/not
                            if(args[3].toLowerCase()=="all"){
                                convertAll = true;
                            } else if(isNaN(args[3])){ 
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = "> Use: **p!card convert <cardid> all** to convert all chosen card id into points.";
                                return message.channel.send({embed:objEmbed});
                            } else if(!isNaN(args[3])) {
                                qty = parseInt(args[3]);
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
                        var cardStock = await CardModule.getUserCardStock(userId,cardId);
                        
                        if(cardStock<=-1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                        } else if(cardStock<qty){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You don't have enough **${cardData[DBM_Card_Data.columns.name]}**.`;
                        } else if(cardStock<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Sorry, you need another duplicate of: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert this card.`;
                        } else if(cardStock>=1){
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
                                convertValue*=cardStock;
        
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
        
                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=? 
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[0,userId,cardId]);
        
                                objEmbed.description = `<@${userId}> has converted ${cardStock}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
                            } else {
                                convertValue*=qty;
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgOk
                                }
        
                                //update the card stock
                                var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                                SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-${qty}  
                                WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                                ${DBM_Card_Inventory.columns.id_card}=?`;
                                await DBConn.conn.promise().query(query,[userId,cardId]);
        
                                objEmbed.description = `<@${userId}> has converted ${qty}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
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

                        await CardModule.limitizeUserPoints(userId);
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
                        var txtCompletionVerifyValue = "";
                        var txtCompletionVerifyValueGold = "";

                        for(var i=0;i<CardModule.Properties.arrColor.length;i++){
                            var verifyValue = CardModule.Properties.arrColor[i];
                            var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",verifyValue);
                            if(checkCardCompletionColor){
                                txtCompletionVerifyValue+=`${verifyValue},`;
                                await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color",verifyValue);
                            }

                            var checkCardCompletionColorGold = await CardModule.checkCardCompletion(guildId,userId,"color_gold",verifyValue);
                            if(checkCardCompletionColorGold){
                                txtCompletionVerifyValueGold+=`${verifyValue},`;
                                await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[verifyValue].color,"color_gold",verifyValue);
                            }
                        }

                        txtCompletionVerifyValue = txtCompletionVerifyValue.replace(/,\s*$/, "");
                        txtCompletionVerifyValueGold = txtCompletionVerifyValueGold.replace(/,\s*$/, "");

                        if(txtCompletionVerifyValue!=""){
                            await message.channel.send({embed:{
                                author:{
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                },
                                thumbnail:{
                                    url:userAvatarUrl
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Card Color Verification!`,
                                description: `<@${userId}> has become the new master of cure: **${txtCompletionVerifyValue}**`,
                                footer:{
                                    iconURL:userAvatarUrl,
                                    text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                                }
                            }});
                        }

                        if(txtCompletionVerifyValueGold!=""){
                            await message.channel.send({embed:{
                                author:{
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                },
                                thumbnail:{
                                    url:userAvatarUrl
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Gold Card Color Verification!`,
                                description: `<@${userId}> has become the new master of gold cure: **${txtCompletionVerifyValueGold}**`,
                                footer:{
                                    iconURL:userAvatarUrl,
                                    text:`Completed at: ${GlobalFunctions.getCurrentDateFooterPrint()}`
                                }
                            }});
                        }

                        await message.channel.send({embed:{
                            color: CardModule.Properties.embedColor,
                            title: `Color Card Verification`,
                            author: {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            },
                            description: `:white_check_mark: All of your card color has been verified for the completion.`
                        }});

                        return;
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
                        //normal completion
                        var txtCompletionVerifyValue = "";
                        var txtCompletionVerifyValueGold = "";
                        for(var i=0;i<CardModule.Properties.arrSeriesName.length;i++){
                            var verifyValue = CardModule.Properties.arrSeriesName[i];
                            var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"series",verifyValue);
                            
                            if(checkCardCompletionPack){
                                txtCompletionVerifyValue+=`>${verifyValue}\n`;
                                embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",verifyValue);
                            }
                        }

                        if(txtCompletionVerifyValue!=""){
                            await message.channel.send({embed:{
                                author:{
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Card Series Verification!`,
                                description: `<@${userId}> has completed the card series:\n${txtCompletionVerifyValue}`,
                            }});
                        }

                        //gold completion
                        for(var i=0;i<CardModule.Properties.arrSeriesName.length;i++){
                            var verifyValue = CardModule.Properties.arrSeriesName[i];
                            var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"series_gold",verifyValue);
                            
                            if(checkCardCompletionPack){
                                txtCompletionVerifyValueGold+=`>${verifyValue}\n`;

                                embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series_gold",verifyValue);
                            }
                        }

                        if(txtCompletionVerifyValueGold!=""){
                            message.channel.send({embed:{
                                author:{
                                    name: userUsername,
                                    icon_url: userAvatarUrl
                                },
                                thumbnail:{
                                    url:userAvatarUrl
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Gold Card Series Verification!`,
                                description: `<@${userId}> has completed the gold card series:\n${txtCompletionVerifyValueGold}`,
                            }});
                        }

                        await message.channel.send({embed:{
                            color: CardModule.Properties.embedColor,
                            author: {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            },
                            title: `Card Series Verification`,
                            description: `:white_check_mark: Your card series has been verified for the completion.`
                        }});

                        // await CardModule.generateCardCureDuel(userId);

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
                            objEmbed.description = ":x: You're not in party yet.\n>Use **p!card party join <party id>** to join into a party.\n>Use **p!card party list** to open the party list menu.";
                            return message.channel.send({embed:objEmbed});
                        }

                        var teamSeries = "-";
                        var partyData = await CardModule.Party.getAllStatus(partyStatusData[DBM_Card_Party.columns.id]);
                        var totalMembers = 0;
                        var txtMembers = "";
                        for(var key in partyData.data_user){
                            var entry = partyData.data_user[key];
                            txtMembers += `💗 <@${key}> : ${entry}`;
                            if(entry==""){
                                txtMembers += "-";
                            }
                            txtMembers+= "\n";
                            totalMembers++;
                        }

                        if(partyData.synergy_series!=null){
                            teamSeries = partyData.synergy_series;
                            if(partyData.synergy){
                                teamSeries+=" ✅";
                            }
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.seriesCardCore[partyData.synergy_series].icon
                            }
                        }

                        var role = "leader";
                        if(partyData.id_leader!=userId){
                            role = "member";
                        }
                        var atk = partyData.atk;
                        var hp = partyData.hp;
                        
                        // //check for party status buff:
                        var txtStatusEffect = "-";
                        if(partyData.status_effect!=null){
                            if(partyData.status_effect in CardModule.StatusEffect.partyBuffData){
                                txtStatusEffect = `${CardModule.StatusEffect.partyBuffData[partyData.status_effect].name}\n⬆️ ${CardModule.StatusEffect.partyBuffData[partyData.status_effect].description}`;
                            }
                        }

                        // objEmbed.title = `Party Status`;
                        objEmbed.description = `**Role:** ${role}\n**Series Synergy:** ${teamSeries}\n**Party Point:** ${partyStatusData[DBM_Card_Party.columns.party_point]}/${CardModule.Party.maxPartyPoint}\n**Special Point:** ${partyStatusData[DBM_Card_Party.columns.special_point]}%\n**Party Boost**: ${txtStatusEffect}`;
                        objEmbed.author = {
                            name:partyStatusData[DBM_Card_Party.columns.name]
                        }
                        objEmbed.fields = [
                            {
                                name:`Party Members (${totalMembers}/${CardModule.Party.maxPartyMembers}):`,
                                value:txtMembers,
                                inline:true
                            }
                        ];

                        objEmbed.footer = {
                            text:`Party ID: ${partyStatusData[DBM_Card_Party.columns.id]}`
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
            
            case "skill":
            case "skills":
                //get/view the card detail
                var cardId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author:{
                        name: userUsername,
                        icon_url: userAvatarUrl
                    },
                }

                if(cardId==null){
                    objEmbed.description = ">Use **p!card skill <card id>** to use the card skills.\n>Use **p!card skill remove** to remove the skills status effect.";
                    return message.channel.send({embed:objEmbed});
                } else if(args[1]!=null){
                    if(args[1].toLowerCase()=="remove"){
                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                        objEmbed.description = "Your skills status effect has been removed.";
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
                var cardStock = await CardModule.getUserCardStock(userId,cardId);
                if(cardStock<=-1){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                    return message.channel.send({embed:objEmbed});
                }

                var color = cardData[DBM_Card_Data.columns.color];

                //check for color data skills
                var cpCost = CardModule.Properties.dataColorCore[color].skills[1].cp_cost;
                var skillsData = CardModule.Properties.dataColorCore[color].skills[1].buff_data;
                var userData = await CardModule.getCardUserStatusData(userId);
                if(userData[DBM_Card_User_Data.columns[`color_point_${color}`]]<cpCost){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You need ${cpCost} ${color} points to use **${skillsData.name}**.`;
                    return message.channel.send({embed:objEmbed});
                } else {
                    await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,skillsData.value);//update SE2
                    var objColor = new Map();
                    objColor.set(`color_point_${color}`,-cpCost);
                    await CardModule.updateColorPoint(userId,objColor);//reduce the color point

                    var seEmbed = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,skillsData.value,"skills");
                    message.channel.send({content:`**${userUsername}** has use the skills: **${skillsData.name}** with **${cpCost}** ${color} points.`,embed:seEmbed});
                }

                break;
            
            default:
                break;
            
        }
	},
};
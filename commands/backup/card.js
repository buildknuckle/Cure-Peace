const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const commonTags = require('common-tags');
const DiscordStyles = require('../../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const ItemModule = require('../../modules/Item');
const CardGuildModule = require('../../modules/Guild');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const TsunagarusModules = require('../../modules/Tsunagarus');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../../database/model/DBM_Guild_Data');
const DBM_Card_Leaderboard = require('../../database/model/DBM_Card_Leaderboard');
const DBM_Card_Tradeboard = require('../../database/model/DBM_Card_Tradeboard');
const DBM_Card_Enemies = require('../../database/model/DBM_Card_Enemies');
const DBM_Item_Inventory = require('../../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const DBM_Card_Party = require('../../database/model/DBM_Card_Party');

module.exports = {
    name: 'carda',
    cooldown: 5,
    description: 'Contains all card categories',
    args: true,
    options:CardModule.Properties.interactionCommandOptions,
	async executeMessage(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();
	},
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        //default embed:
        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            }
        };

        switch(command){
            //STATUS MENU: open card status
            case "status":
                //get card total:
                //user parameter validator if placed
                var memberExists = true;
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(0) ? 
                interaction.options._hoistedOptions[0].value : null;

                if(parameterUsername!=null){
                    await interaction.guild.members.fetch({query:`${parameterUsername}`,limit:1})
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
                } else if(!memberExists){
                    objEmbed.title = "Cannot find that user";
                    objEmbed.description = ":x: I can't find that username, please re-enter with specific username.";
                    objEmbed.thumbnail = {url:CardModule.Properties.imgResponse.imgError};
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

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

                //init the object
                var objCardStatus = {};
                objCardStatus[CardModule.Properties.dataColorCore.pink.value] = {}; 
                objCardStatus[CardModule.Properties.dataColorCore.blue.value] = {}; 
                objCardStatus[CardModule.Properties.dataColorCore.yellow.value] = {};
                objCardStatus[CardModule.Properties.dataColorCore.purple.value] = {}; 
                objCardStatus[CardModule.Properties.dataColorCore.red.value] = {}; 
                objCardStatus[CardModule.Properties.dataColorCore.green.value] = {};
                objCardStatus[CardModule.Properties.dataColorCore.white.value] = {};
                var cardDataInventory = await DBConn.conn.promise().query(query, [userId]);
                var cardDataInventoryGold = await DBConn.conn.promise().query(queryGold, [userId]);
                for(var i=0;i<cardDataInventory[0].length;i++){
                    //init if not exists:
                    var color = cardDataInventory[0][i][DBM_Card_Data.columns.color];
                    var pack = cardDataInventory[0][i][DBM_Card_Data.columns.pack];
                    var total = cardDataInventory[0][i]['total'];
                    
                    objCardStatus[color][pack] = {}; 
                    objCardStatus[color][pack]["value"] = pack; objCardStatus[color][pack]["total"] = total;

                    objCardStatus[color][pack]["iconCompletion"] = ""; //set default
                    if(total>=CardModule.Properties.dataCardCore[pack].total){
                        cardDataInventoryGold[0][i]['total_gold'] >= CardModule.Properties.dataCardCore[pack].total ? 
                            objCardStatus[color][pack]["iconCompletion"] = "☑️ " : objCardStatus[color][pack]["iconCompletion"] = "✅ ";
                    }
                }

                var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                clvl = await CardModule.Status.getAverageLevel(userId,cardUserStatusData);

                //prepare the embed
                var avatarId = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.card_id_selected]!=null)
                    avatarId = cardUserStatusData[DBM_Card_User_Data.columns.card_id_selected];

                var currentSE = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.buffData){
                    currentSE = `⬆️ ${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name} [${CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}]`;
                } else if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.debuffData){
                    currentSE = `⬇️ ${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].name} [${CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].description}]`;
                }

                var currentSkills = "-";
                if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]!=null){
                    var statusEffect2 = JSON.parse(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]);

                    if(statusEffect2.value in CardModule.StatusEffect.cureSkillsBuffData){
                        currentSkills = `${CardModule.StatusEffect.cureSkillsBuffData[statusEffect2.value].name} x${statusEffect2.attempts}\n⬆️ ${CardModule.StatusEffect.cureSkillsBuffData[statusEffect2.value].description}`;
                    }
                }

                //check if in party/not
                var arrPages = [];

                var assignedSeries = cardUserStatusData[DBM_Card_User_Data.columns.series_set];
                assignedSeries = CardModule.Properties.seriesCardCore[assignedSeries].pack;

                objEmbed.description = `**aLvl:** ${clvl} | **Assigned Set:** ${cardUserStatusData[DBM_Card_User_Data.columns.color]}/${assignedSeries} | **Cure Avatar:** ${avatarId} \n**MofuCoin:** ${cardUserStatusData[DBM_Card_User_Data.columns.mofucoin]}/${CardModule.Properties.limit.mofucoin}\n**Wish Point:** ${JSON.parse(cardUserStatusData[DBM_Card_User_Data.columns.wish_data])["wish_point"]}\n**Special Point:** ${cardUserStatusData[DBM_Card_User_Data.columns.special_point]}%\n**Status Effect:** ${currentSE}\n\n**Act. Battle Skills:** ${currentSkills}`;

                objEmbed.fields = [
                    {name: `Pink(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_pink]} Pts):`,
                    value: ``,inline:true},
                    {name: `Blue(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_blue]} Pts):`,
                    value: ``,inline:true},
                    {name: `Yellow(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_yellow]} Pts):`,
                    value: ``,inline:true},
                    {name: `Purple(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_purple]} Pts):`,
                    value: ``,inline:true},
                    {name: `Red(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_red]} Pts):`,
                    value: ``,inline:true},
                    {name: `Green(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_green]} Pts):`,
                    value: ``,inline:true},
                    {name: `White(Lvl. ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]}/${cardUserStatusData[DBM_Card_User_Data.columns.color_point_white]} Pts):`,
                    value: ``,inline:true},
                ];

                var idxColor = 0;
                Object.keys(objCardStatus).forEach(keyColor=>{
                    Object.keys(objCardStatus[keyColor]).forEach(key => {
                        var objPack = objCardStatus[keyColor][key];
                        var pack = objPack["value"]; var total = objPack["total"]; var iconCompletion = objPack["iconCompletion"];
                        objEmbed.fields[idxColor]["value"] += `${iconCompletion}${GlobalFunctions.capitalize(pack)}: ${total}/${CardModule.Properties.dataCardCore[pack].total}\n`;
                    });
                    idxColor+=1;
                });

                arrPages[0] = new MessageEmbed(objEmbed); //add embed to pages

                //page 2 : series point
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
                arrPages[1] = new MessageEmbed(objEmbed); //add embed to pages

                //page 3: duplicate card
                var queryDuplicate = `select cd.${DBM_Card_Data.columns.pack},sum(inv.${DBM_Card_Inventory.columns.stock}) as total, 
                cd. ${DBM_Card_Data.columns.color}
                from ${DBM_Card_Data.TABLENAME} cd
                left join ${DBM_Card_Inventory.TABLENAME} inv
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and
                inv.${DBM_Card_Inventory.columns.id_user}=? and
                inv.${DBM_Card_Inventory.columns.stock}>=1
                where inv.${DBM_Card_Inventory.columns.stock}>=1 
                group by cd.${DBM_Card_Data.columns.pack}`;
                var cardDataInventory = await DBConn.conn.promise().query(queryDuplicate, [userId]);

                //reset all total to 0
                Object.keys(objCardStatus).forEach(keyColor=>{
                    Object.keys(objCardStatus[keyColor]).forEach(key => {
                        objCardStatus[keyColor][key]["total"] = 0;
                    });
                });

                for(var i=0;i<cardDataInventory[0].length;i++){
                    var color = cardDataInventory[0][i][DBM_Card_Data.columns.color];
                    var pack = cardDataInventory[0][i][DBM_Card_Data.columns.pack];
                    objCardStatus[color][pack]["total"] = cardDataInventory[0][i]['total'];
                }

                objEmbed.fields = [
                    { name: `Pink Duplicate:`, value: ``, inline: true}, { name: `Blue Duplicate:`, value: ``, inline: true},
                    { name: `Yellow Duplicate:`, value: ``, inline: true}, { name: `Purple Duplicate:`, value: ``, inline: true },
                    { name: `Red Duplicate:`, value: ``, inline: true }, { name: `Green Duplicate:`, value: ``, inline: true },
                    { name: `White Duplicate:`, value: ``, inline: true }
                ];

                var idxColor = 0;
                Object.keys(objCardStatus).forEach(keyColor=>{
                    Object.keys(objCardStatus[keyColor]).forEach(key => {
                        var objPack = objCardStatus[keyColor][key];
                        var pack = objPack["value"]; var total = objPack["total"]; var iconCompletion = objPack["iconCompletion"];
                        objEmbed.fields[idxColor]["value"] += `${iconCompletion}${GlobalFunctions.capitalize(pack)}: ${total}\n`;
                    });
                    idxColor+=1;
                });

                arrPages[2] = new MessageEmbed(objEmbed); //add embed to pages

                //reset all total to 0
                Object.keys(objCardStatus).forEach(keyColor=>{
                    Object.keys(objCardStatus[keyColor]).forEach(key => {
                        objCardStatus[keyColor][key]["total"] = 0;
                    });
                });

                //page 4: gold card
                objEmbed.fields = [
                    { name: `Pink Gold:`, value: ``, inline: true}, { name: `Blue Gold:`, value: ``, inline: true},
                    { name: `Yellow Gold:`, value: ``, inline: true}, { name: `Purple Gold:`, value: ``, inline: true },
                    { name: `Red Gold:`, value: ``, inline: true }, { name: `Green Gold:`, value: ``, inline: true },
                    { name: `White Gold:`, value: ``, inline: true }
                ];

                for(var i=0;i<cardDataInventoryGold[0].length;i++){
                    var color = cardDataInventoryGold[0][i][DBM_Card_Data.columns.color];
                    var pack = cardDataInventoryGold[0][i][DBM_Card_Data.columns.pack];
                    objCardStatus[color][pack]["total"] = cardDataInventoryGold[0][i]['total_gold'];
                }

                var idxColor = 0;
                Object.keys(objCardStatus).forEach(keyColor=>{
                    Object.keys(objCardStatus[keyColor]).forEach(key => {
                        var objPack = objCardStatus[keyColor][key];
                        var pack = objPack["value"]; var total = objPack["total"]; var iconCompletion = objPack["iconCompletion"];
                        objEmbed.fields[idxColor]["value"] += `${iconCompletion}${GlobalFunctions.capitalize(pack)}: ${total}/${CardModule.Properties.dataCardCore[pack].total}\n`;
                    });
                    idxColor+=1;
                });

                arrPages[3] = new MessageEmbed(objEmbed); //add embed to pages

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

                    var iconHp = ""; var iconAtk = "";//for status effect
                    var bHp = CardModule.Status.getHp(level,hp); var bAtk = CardModule.Status.getAtk(level,atk);
                    var hp = bHp; var atk = bAtk;

                    //skills effect
                    var currentSkills = "-";
                    if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]!=null){
                        var statusEffect2 = JSON.parse(cardUserStatusData[DBM_Card_User_Data.columns.status_effect_2]).value;

                        if(statusEffect2 in CardModule.StatusEffect.cureSkillsBuffData){
                            switch(statusEffect2){
                                case "stats_booster":
                                    hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_value);
                                    atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_value);
                                    break;
                                case "catchphrage":
                                    hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_penalty);
                                    atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_value);
                                    break;
                                case "levelcutter":
                                    level-=GlobalFunctions.calculatePercentage(level,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_penalty);
                                    if(level<=1){level = 1;}
                                    //update the latest stats
                                    bHp = CardModule.Status.getHp(level,hp); bAtk = CardModule.Status.getAtk(level,atk);
                                    hp = bHp; atk = bAtk;

                                    atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_value);
                                    break;
                                case "endure":
                                    hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_penalty);
                                    atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.cureSkillsBuffData[statusEffect2].boost_value);
                                    break;
                                case "starmaster":
                                    rarity+=7;
                                    break;
                            }
                        }
                    }

                    //prevents from negative/limit
                    if(hp<=0) hp=1;  
                    else if(hp>=100) hp=100; 
                    if(atk<=0) atk=0;
                    if(rarity>=7) rarity = 7;

                    //buff/debuff
                    if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.buffData){
                        //check for hp buff
                        if(CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value.includes("hp_up_")){
                            hp+=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value_hp_boost);

                        } else if(CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value.includes("atk_up_")){
                            atk+=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.buffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value_atk_boost);
                        }
                    } else if(cardUserStatusData[DBM_Card_User_Data.columns.status_effect] in CardModule.StatusEffect.debuffData){
                        if(CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value.includes("hp_down_")){
                            hp-=GlobalFunctions.calculatePercentage(hp,CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value_hp_down);

                        } else if(CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value.includes("atk_down_")){
                            atk-=GlobalFunctions.calculatePercentage(atk,CardModule.StatusEffect.debuffData[cardUserStatusData[DBM_Card_User_Data.columns.status_effect]].value_atk_down);
                        }
                    }

                    //prevents from negative
                    if(hp<=0) hp=1;
                    else if(hp>=100) hp=100;
                    if(atk<=0) atk=0;

                    var txtHp = `${bHp}`; var txtAtk =  `${bAtk}`;

                    if(hp>bHp){ iconHp = "⬆️"; } else if(hp<bHp) { iconHp = "⬇️"; }

                    if(iconHp!=""){ txtHp += ` ➡️ ${hp}`; }

                    if(atk>bAtk){ iconAtk = "⬆️"; } else if(atk<bAtk) { iconAtk = "⬇️"; }

                    if(iconAtk!=""){ txtAtk += ` ➡️ ${atk}`; }

                    if(avatarFormMode=="normal"){
                        objEmbed.fields = [{
                            name:`Cure Avatar:\n${rarity+CardModule.Properties.cardCategory[type].rarityBoost}⭐ ${CardModule.Properties.dataCardCore[packName].alter_ego}${goldIcon} Lv.${level}`,
                            value:`${iconHp}❤️ **HP: **${txtHp}\n${iconAtk}⚔️ **Atk:** ${txtAtk}\n**Special**: ${CardModule.Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }];
                        objEmbed.image = { url:CardModule.Properties.dataCardCore[packName].icon }
                    } else {
                        objEmbed.fields = [{
                            name:`Cure Avatar:\n${rarity+CardModule.Properties.cardCategory[type].rarityBoost}⭐ ${GlobalFunctions.capitalize(cardTypeDisplay)} ${CardModule.Properties.dataCardCore[packName].form[avatarFormMode].name}${goldIcon} Lv.${level}`,
                            value:`${iconHp}❤️ **HP: **${txtHp}\n${iconAtk}⚔️ **Atk:** ${txtAtk}\n\n**Special**: ${CardModule.Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }];

                        objEmbed.image = { url:CardModule.Properties.dataCardCore[packName].form[avatarFormMode].img_url }
                    }

                    arrPages[4] = new MessageEmbed(objEmbed); //add embed to pages
                }

                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);

                break;
            case "inventory":
                var pack = interaction.options._hoistedOptions[0].value.toLowerCase();
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : null;

                //card pack validator
                if(!CardModule.Properties.dataCardCore.hasOwnProperty(pack.toLowerCase())){
                    return interaction.reply({
                        embeds:[new MessageEmbed(CardModule.Embeds.embedCardPackNotFound())],ephemeral:true});
                }

                //user parameter validator
                var memberExists = true;
                if(parameterUsername!=null){
                    await interaction.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
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
                    objEmbed.title = "Cannot find that user";
                    objEmbed.description = ":x: I can't find that username, please re-enter with more specific username.";
                    objEmbed.thumbnail = {url:CardModule.Properties.imgResponse.imgFailed};
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                //end user parameter validator
                objEmbed.title = `${GlobalFunctions.capitalize(pack)}/${CardModule.Properties.dataCardCore[pack].alter_ego} Pack:`;
                objEmbed.author = { name: userUsername, icon_url: userAvatarUrl }

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
                
                var arrPages = []; var totalGold = 0;
                var cardDataInventory = await DBConn.conn.promise().query(query, [userId,pack]);

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

                    objEmbed.thumbnail = { url:CardModule.Properties.dataCardCore[pack].icon };
                    objEmbed.color = CardModule.Properties.dataColorCore[entry[DBM_Card_Data.columns.color]].color;
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `Normal: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total} | Gold: ${totalGold}/${CardModule.Properties.dataCardCore[pack].total}`,
                            value: cardList,
                        }];
                        var msgEmbed = new MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        cardList = ""; ctr = 0;
                    } else { ctr++; }
                    pointerMaxData--;
                });

                for(var i=0;i<arrPages.length;i++){
                    arrPages[i].fields[0]['name'] = `Normal: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total} | Gold: ${totalGold}/${CardModule.Properties.dataCardCore[pack].total}`;
                }
                
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                break;
            case "duplicate":
                var pack = interaction.options._hoistedOptions[0].value.toLowerCase();
                var parameterUsername = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : null;

                var listAll = false;
                if(pack=="all"){
                    listAll = true;
                } else if(pack!="all"&&!CardModule.Properties.dataCardCore.hasOwnProperty(pack.toLowerCase())){
                    return interaction.reply({
                        embeds:[new MessageEmbed(CardModule.Embeds.embedCardPackNotFound())],ephemeral:true});
                }

                //user parameter validator
                var memberExists = true;
                if(parameterUsername!=null){
                    await interaction.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
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
                    objEmbed.title = "Cannot find that user";
                    objEmbed.description = ":x: I can't find that username, please re-enter with more specific username.";
                    objEmbed.thumbnail = {url:CardModule.Properties.imgResponse.imgFailed};
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                //end user parameter validator

                var arrPages = []; var query = ""; var cardList = "";
                objEmbed.author = {
                    name: userUsername,
                    icon_url: userAvatarUrl
                }
                
                if(!listAll){
                    objEmbed.title = `${GlobalFunctions.capitalize(pack)}/${GlobalFunctions.capitalize(CardModule.Properties.dataCardCore[pack].alter_ego)} Pack:`;
    
                    query = `select cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.color}, 
                    cd.${DBM_Card_Data.columns.series},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.name}, 
                    cd.${DBM_Card_Data.columns.img_url},inv.${DBM_Card_Inventory.columns.id_user}, inv.${DBM_Card_Inventory.columns.level}, 
                    inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.is_gold}  
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
                    inv.${DBM_Card_Inventory.columns.stock}, inv.${DBM_Card_Inventory.columns.is_gold} 
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
                    if(entry[DBM_Card_Inventory.columns.is_gold]) cardList+= "☑️ ";
                    cardList+=`[${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})`;
                    if(entry[DBM_Card_Inventory.columns.stock]>=1) cardList+=` x${entry[DBM_Card_Inventory.columns.stock]}`;
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null) cardList+=` Lv.${entry[DBM_Card_Inventory.columns.level]}`;
                    cardList+="\n";

                    if(!listAll){
                        objEmbed.thumbnail = { url:CardModule.Properties.dataCardCore[pack].icon };
                        objEmbed.color = CardModule.Properties.dataColorCore[entry[DBM_Card_Data.columns.color]].color;
                    }
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `Duplicate card list:`,
                            value: cardList,
                        }];
                        var msgEmbed = new MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        cardList = ""; ctr = 0;
                    } else { ctr++; }
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
                    var msgEmbed = new MessageEmbed(objEmbed);
                    arrPages.push(msgEmbed);
                }
                
                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                break;
            case "detail":
                var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();
                var type = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : CardModule.Properties.cardCategory.normal.value;//preview mode: normal/gold

                //check if card ID exists/not
                var cardData = await CardModule.getCardData(cardId);

                if(cardData==null){
                    objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                    objEmbed.description = ":x: Cannot find that card ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                //check if user have card/not
                var stock = await CardModule.getUserCardStock(userId,cardId);
                if(stock<=-1){
                    objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                    objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                //get card user inventory data to get the received date data
                var userInventoryData = await CardModule.getUserCardInventoryData(userId,cardId);

                if(type!=null){
                    if(type.toLowerCase()==CardModule.Properties.cardCategory.gold.value&&
                    userInventoryData[DBM_Card_Inventory.columns.is_gold]==0){
                        objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                        objEmbed.description = `:x: You need ${CardModule.Properties.cardCategory.gold.value} upgrade of: **${cardData[DBM_Card_Data.columns.name]}** to see this card.`;
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    }
                }

                switch(type){
                    case CardModule.Properties.cardCategory.normal.value:
                        return interaction.reply({
                            embeds:[CardModule.Embeds.embedCardDetail(cardData[DBM_Card_Data.columns.pack],
                            cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.name],
                            cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],
                            cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                            userInventoryData[DBM_Card_Inventory.columns.created_at],userInventoryData[DBM_Card_Inventory.columns.level],
                            cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                            userInventoryData[DBM_Card_Inventory.columns.level_special],stock,
                            cardData[DBM_Card_Data.columns.ability1])]
                        });
                        break;
                    case CardModule.Properties.cardCategory.gold.value:
                        return interaction.reply({
                            embeds:[CardModule.Embeds.embedCardDetail(cardData[DBM_Card_Data.columns.pack],
                            cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.name],
                            cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.series],
                            cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                            userInventoryData[DBM_Card_Inventory.columns.created_at],userInventoryData[DBM_Card_Inventory.columns.level],
                            cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                            userInventoryData[DBM_Card_Inventory.columns.level_special],stock,
                            cardData[DBM_Card_Data.columns.ability1],CardModule.Properties.cardCategory.gold.value)]
                        });
                        break;
                }

                break;
            case "set":
                switch(commandSubcommand){
                    case "color":
                        var newColor = interaction.options._hoistedOptions[0].value;
                        var colorCost = 100;
                        var userCardData = await CardModule.getCardUserStatusData(userId);
                        var assignedColor = userCardData[DBM_Card_User_Data.columns.color];
                        var assignedColorPoint = userCardData[`color_point_${assignedColor}`];
                        //validator: check if color points is enough/not
                        if(assignedColorPoint<colorCost){
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            },
                            objEmbed.description = `:x: You need **${colorCost} ${assignedColor}** points to change your color assignment.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        //assign new color & update color
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.color,newColor);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                        //update the color points
                        var parameterSetColorPoint = new Map();
                        parameterSetColorPoint.set(`color_point_${assignedColor}`,-colorCost);
                        await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                        objEmbed.title = `New color has been set`,
                        objEmbed.description = `:white_check_mark: <@${userId}> has been assigned into **${newColor}** color with **${colorCost} ${assignedColor}** points.`

                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        break;
                    case "series":
                        var newSeries = interaction.options._hoistedOptions[0].value;
                        var userCardData = await CardModule.getCardUserStatusData(userId);
                        var assignedSeries = userCardData[DBM_Card_User_Data.columns.series_set];
                        var assignedSeriesPoint = userCardData[`${assignedSeries}`];
                        var changePrice = 50;
                        //validator: check if series points is enough/not
                        if(assignedSeriesPoint<changePrice){
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need **${changePrice} ${CardModule.Properties.seriesCardCore[assignedSeries].currency}** series points to change your series assignment.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
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
                        objEmbed.title = `New series has been set`,
                        objEmbed.description = `:white_check_mark: <@${userId}> has been assigned into: **${newSeries}** series with **${changePrice} ${CardModule.Properties.seriesCardCore[assignedSeries].currency}** series points.`;
                        objEmbed.thumbnail = { url: CardModule.Properties.seriesCardCore[newSeries].icon }

                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                    case "avatar":
                        var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();
                        var visiblePublic = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value:false;
                        
                        var henshinForm = null;

                        var cardData = await CardModule.getCardData(cardId);
                        if(cardData==null){
                            //check if card available/not
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = `:x: I can't find that card Id.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        var cardInventoryData = await CardModule.getCardInventoryUserData(userId,cardId);
                        if(cardInventoryData==null){
                            //check if user have card/not
                            objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** yet.`,
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
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
                                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                            } else if("form" in CardModule.Properties.dataCardCore[cardData[DBM_Card_Data.columns.pack]]){
                                //form rarity validation
                                if(cardData[DBM_Card_Data.columns.rarity]<6){
                                    return interaction.reply({embeds:[
                                        new MessageEmbed({
                                            color: CardModule.Properties.embedColor,
                                            description : `:x: You can only use the form mode with 6/7:star: card!`,
                                            thumbnail : {
                                                url: CardModule.Properties.imgResponse.imgError
                                            },
                                        })
                                    ]});
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
                                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                                }
                            }
                        } else {
                            henshinForm = "normal";
                        }

                        var cardUserData = await CardModule.getCardUserStatusData(userId);
                        var price = cardData[DBM_Card_Data.columns.rarity]*10;
                        var selectedColor = cardData[DBM_Card_Data.columns.color];
                        var currentColorPoint = cardUserData[`color_point_${selectedColor}`];
                        var msgContent = "";

                        //unset if previously set
                        if(cardUserData[DBM_Card_User_Data.columns.card_id_selected]!=null){
                            var previousSetAvatar = await CardModule.getCardData(cardUserData[DBM_Card_User_Data.columns.card_id_selected]);

                            if(previousSetAvatar[DBM_Card_Data.columns.rarity]>=3){
                                var objColor = new Map();
                                objColor.set(`color_point_${previousSetAvatar[DBM_Card_Data.columns.color]}`,previousSetAvatar[DBM_Card_Data.columns.rarity]*10);
                                await CardModule.updateColorPoint(userId,objColor);
                                msgContent = `🔁 `;
                            }
                        }

                        if(cardData[DBM_Card_Data.columns.rarity]>=3&&currentColorPoint<price){
                            //validation check: color point
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need **${price} ${selectedColor}** color point to set **${cardId} - ${cardData[DBM_Card_Data.columns.name]}** as cure avatar.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        if(cardData[DBM_Card_Data.columns.rarity]>=3){
                            //update the color point
                            var objColor = new Map();
                            objColor.set(`color_point_${selectedColor}`,-price);
                            await CardModule.updateColorPoint(userId,objColor);
                            msgContent += `${userUsername} has set **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** as the cure avatar & use **${price} ${selectedColor}** color points!`
                        } else {
                            msgContent += `${userUsername} has set **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** as the cure avatar`;
                        }

                        //update the cure card avatar & card id set token
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,cardData[DBM_Card_Data.columns.id_card]);
                        parameterSet.set(DBM_Card_User_Data.columns.card_avatar_form,henshinForm);
                        
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        var type = CardModule.Properties.cardCategory.normal.value;
                        if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            type = CardModule.Properties.cardCategory.gold.value;
                        }

                        var objSend = {};
                        switch(type){
                            case CardModule.Properties.cardCategory.gold.value:
                                objSend = {content:msgContent,
                                    embeds:
                                    [new MessageEmbed(CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url_upgrade1],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type,henshinForm))]
                                }
                                break;
                            default:
                                objSend = {content:msgContent,
                                    embeds:
                                    [new MessageEmbed(CardModule.Embeds.precureAvatarView(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],cardInventoryData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],cardInventoryData[DBM_Card_Inventory.columns.level_special],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.rarity],type,henshinForm))]
                                }
                                break;
                        }

                        if(!visiblePublic){objSend.ephemeral = true;}
                        return interaction.reply(objSend);

                        break;
                }
                break;
            case "unset":
                //revert back the transformation
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

                interaction.reply({embeds:[new MessageEmbed(objEmbed)]});

                break;
            case "upgrade":
                switch(commandSubcommand){
                    case "color-level":
                        var selectedColor = interaction.options._hoistedOptions[0].value;

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
                                description : `:x: You need **${nextColorPoint} ${selectedColor}** color points to level up your color.`
                            };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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

                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                    case "card-level-with-duplicate":
                        var cardId = interaction.options._hoistedOptions[0].value;
                        var targetCardId = interaction.options._hoistedOptions[1].value;
                        var qty = interaction.options._hoistedOptions.hasOwnProperty(2) ? 
                        interaction.options._hoistedOptions[2].value : 1;
                        var cardStock = await CardModule.getUserCardStock(userId,cardId);
                        var userTargetCardStock = await CardModule.getUserCardStock(userId,targetCardId);

                        //check for card data
                        var cardData = await CardModule.getCardData(cardId);
                        var cardTargetData = await CardModule.getCardData(targetCardId);
                        if(cardData==null){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = ":x: I can't find that card ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(cardTargetData==null){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = ":x: I can't find the target card ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //validation- qty:
                        if(qty<=0||qty>99){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: Please enter valid quantity between 1-99`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        var userCardData = await CardModule.getUserCardInventoryData(userId,targetCardId)//card target
                        var rarity = cardData[DBM_Card_Data.columns.rarity];
                        var rarityValue = 1;

                        //validation:
                        if(cardData[DBM_Card_Data.columns.pack]!=cardData[DBM_Card_Data.columns.pack]){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: Both card need to be on same card pack.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        } else if(cardStock<=-1||userTargetCardStock<=-1){
                            //stock validation
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        } else if(cardStock<qty){
                            //card stock validation
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: Not enough materials:\n${qty}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}**.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        } else if(userCardData[DBM_Card_Inventory.columns.level]>=CardModule.Leveling.getMaxLevel(cardTargetData[DBM_Card_Data.columns.rarity])){
                            //check for max level
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgOk }
                            objEmbed.description = `:x: **${cardTargetData[DBM_Card_Data.columns.id_card]} - ${cardTargetData[DBM_Card_Data.columns.name]}** has reached the maximum level!`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)], ephemeral:true});
                        }

                        //start processing level up:
                        //check for card level
                        switch(rarity){
                            case 6: case 7: 
                                rarityValue = 6*qty; break;
                            default: 
                                rarityValue = rarity*qty;  break;
                        }

                        await interaction.deferReply();

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

                        var objEmbed = CardModule.Embeds.embedCardLevelUp(
                            cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.id_card],
                            cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],
                            cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],
                            userAvatarUrl,userUsername,rarityValue,userCardData[DBM_Card_Inventory.columns.level],
                            cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                            userCardData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.normal.value);

                        if(userCardData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed = CardModule.Embeds.embedCardLevelUp(
                                cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.id_card],
                                cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],
                                cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],
                                userAvatarUrl,userUsername,rarityValue,userCardData[DBM_Card_Inventory.columns.level],
                                cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                                userCardData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                        }

                        // var objEmbed = CardModule.Embeds.embedCardLevelUp(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,userCardData[DBM_Card_Inventory.columns.level],cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],userCardData[DBM_Card_Inventory.columns.level_special]);

                        return interaction.editReply({content:`**${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** has been leveled up with ${qty}x **${txtCardDataSource}**`, embeds:[objEmbed]});

                        break;
                    case "card-special-level":
                        var selectedIdCard = interaction.options._hoistedOptions[0].value;
                        var cardData = await CardModule.getCardData(selectedIdCard);
                        if(cardData==null){
                            objEmbed.description = `:x: I can't find that card ID.`,
                            objEmbed.thumbnail = { url: CardModule.Properties.imgResponse.imgError };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        var cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);
                        if(cardInventoryData==null){
                            //check if user have card/not
                            objEmbed.description =  `:x: You don't have: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`,
                            objEmbed.thumbnail = { url: CardModule.Properties.imgResponse.imgError };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        } else if(cardInventoryData[DBM_Card_Inventory.columns.level_special]>=10){
                            //check if level is capped/not
                            objEmbed.description = `:x: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** has reached maximum special level!`,
                            objEmbed.thumbnail = { url: CardModule.Properties.imgResponse.imgError };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        var requirement = CardModule.Leveling.getNextCardSpecialTotal(cardInventoryData[DBM_Card_Inventory.columns.level_special]);
                        if(cardInventoryData[DBM_Card_Inventory.columns.stock]<requirement){
                            objEmbed.description = `:x: You need **${(requirement)-cardInventoryData[DBM_Card_Inventory.columns.stock]}** more: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to level up the special attack into **${cardInventoryData[DBM_Card_Inventory.columns.level_special]+1}**.`,
                            objEmbed.thumbnail = { url: CardModule.Properties.imgResponse.imgError };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        //level up the special & decrease inventory
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                        SET ${DBM_Card_Inventory.columns.level_special}=${DBM_Card_Inventory.columns.level_special}+1, 
                        ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-${requirement} 
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query,[userId,selectedIdCard]);

                        await interaction.deferReply();

                        //get updated data:
                        cardInventoryData = await CardModule.getCardInventoryUserData(userId,selectedIdCard);

                        var objEmbed = CardModule.Embeds.cardLevelUpDefault(
                        cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.id_card],
                        cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],
                        cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],
                        userAvatarUrl,userUsername,1,cardInventoryData[DBM_Card_Inventory.columns.level],
                        cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                        cardInventoryData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.normal.value);

                        if(cardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed = CardModule.Embeds.cardLevelUpDefault(
                            cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.id_card],
                            cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],
                            cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],
                            userAvatarUrl,userUsername,1,cardInventoryData[DBM_Card_Inventory.columns.level],
                            cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                            cardInventoryData[DBM_Card_Inventory.columns.level_special],CardModule.Properties.cardCategory.gold.value);
                        }
                        
                        return interaction.editReply({content:`**${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** special attack is now level **${cardInventoryData[DBM_Card_Inventory.columns.level_special]}**!`, embeds:[new MessageEmbed(objEmbed)]});
                        break;
                    case "gold":
                        var cardId = interaction.options._hoistedOptions[0].value;
        
                        //check if card ID exists/not
                        var cardData = await CardModule.getCardData(cardId);
                        if(cardData==null){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = ":x: I can't find that card ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                        }

                        var cardRarity = cardData[DBM_Card_Data.columns.rarity];
                        //check if user have card/not
                        var itemStock = await CardModule.getUserCardStock(userId,cardId);
                        if(itemStock<=-1){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)], ephemeral:true});
                        }

                        var userCardInventoryData = await CardModule.getCardInventoryUserData(userId,cardId);
                        if(userCardInventoryData[DBM_Card_Inventory.columns.is_gold]){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgOk }
                            objEmbed.description = `:white_check_mark: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** already upgraded into gold type.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)], ephemeral:true});
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
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: You don't have enough materials to upgrade this card into gold card.`;
                            objEmbed.fields = [
                                {
                                    name:`Required Materials:`,
                                    value:`>**${materialNeeded}x card:** ${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}\n>**Item:** ${itemDataRequirement[DBM_Item_Data.columns.id]} - ${itemDataRequirement[DBM_Item_Data.columns.name]} x${materialNeeded}`,
                                    inline:true
                                }
                            ]
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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

                        //start upgrading process:
                        await interaction.deferReply();

                        var arrEmbedsSend = [];
                        //check for upgrade boost:
                        if(fullUpgrade){
                            randomChance = 10;
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgOk }
                            objEmbed.title = `${cardRarity}⭐ Gold Card Upgrade Boost!`;
                            objEmbed.description = `+100% gold card upgrade chance.`;
                            arrEmbedsSend.push(new MessageEmbed(objEmbed));
                        } else {
                            var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                            //get clvl
                            var clvl = await CardModule.Status.getAverageLevel(userId,cardUserStatusData);

                            var embedTitle = ""; var embedDescription = "";
                            
                            if(clvl>=15){
                                randomChance+=5;
                                embedTitle = `aClvL Gold Card Upgrade Boost 5!`;
                                embedDescription = "+50% gold card upgrade chance.";
                            } else if(clvl>=13){
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
                                objEmbed.title = embedTitle;
                                objEmbed.description = embedDescription;
                                arrEmbedsSend.push(new MessageEmbed(objEmbed));
                            }
                        }

                        //update the card & item stock
                        var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                        SET ${DBM_Card_Inventory.columns.stock} = ${DBM_Card_Inventory.columns.stock}-${materialNeeded}
                        WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                        ${DBM_Card_Inventory.columns.id_card}=?`;
                        await DBConn.conn.promise().query(query, [userId,cardData[DBM_Card_Data.columns.id_card]]);
                        await ItemModule.updateItemStock(userId,itemDataRequirement[DBM_Item_Data.columns.id],-materialNeeded);
                        //upgrade failed:
                        if(randomChance<materialNeeded){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgFailed }
                            objEmbed.title = "Upgrade Failed!";
                            objEmbed.description = `:x: Upgrade process for **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** has failed. Better luck next time!`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                        arrEmbedsSend.push(CardModule.Embeds.embedCardDetail(
                            cardData[DBM_Card_Data.columns.pack], cardData[DBM_Card_Data.columns.id_card],
                            cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url_upgrade1],
                            cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],
                            userAvatarUrl, userCardInventoryData[DBM_Card_Inventory.columns.created_at], userCardInventoryData[DBM_Card_Inventory.columns.level],
                            cardData[DBM_Card_Data.columns.max_hp],cardData[DBM_Card_Data.columns.max_atk],
                            userCardInventoryData[DBM_Card_Inventory.columns.level_special],
                            userCardInventoryData[DBM_Card_Inventory.columns.stock],cardData[DBM_Card_Data.columns.ability1],CardModule.Properties.cardCategory.gold.value)
                        );
                        
                        //check for completion:
                        //check for leaderboard
                        var checkCardCompletionPackGold = await CardModule.checkCardCompletion(guildId,userId,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                        var checkCardCompletionColorGold = await CardModule.checkCardCompletion(guildId,userId,"color_gold",cardData[DBM_Card_Data.columns.color]);
                        var checkCardCompletionSeriesGold = await CardModule.checkCardCompletion(guildId,userId,"series_gold",cardData[DBM_Card_Data.columns.series]);

                        if(checkCardCompletionPackGold){
                            //card pack completion
                            var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"pack_gold",cardData[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null) arrEmbedsSend.push(embedCompletion);
                        }
                        if(checkCardCompletionColorGold) {
                            //color set completion
                            var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"color_gold",cardData[DBM_Card_Data.columns.color]);
                            if(embedCompletion!=null) arrEmbedsSend.push(embedCompletion);
                        }
                        if(checkCardCompletionSeriesGold){
                            //series set completion
                            var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardData[DBM_Card_Data.columns.color]].color,"series_gold",cardData[DBM_Card_Data.columns.series]);
                            if(embedCompletion!=null) arrEmbedsSend.push(embedCompletion);
                        }

                        await interaction.editReply({content:`${userUsername} has successfully upgrade "**${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}**" into gold card!`,embeds:arrEmbedsSend});

                        // if(arrEmbedCompletion.length>=1) await interaction.editReply({embeds:arrEmbedCompletion});
                        break;
                }

                break;
            case "convert":
                switch(commandSubcommand){
                    case "card-to-point":
                    case "card-to-mofucoin":
                        var cardId = interaction.options._hoistedOptions[0].value;
                        var qty = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        String(interaction.options._hoistedOptions[1].value) : null;
                        var convertAll = false;
                        
                        if(qty!=null){
                            //check if convert all/not
                            if(qty.toLowerCase()=="all"){
                                convertAll = true;
                            } else if(isNaN(qty)||(qty<=0)){ 
                                objEmbed.thumbnail = {
                                    url:CardModule.Properties.imgResponse.imgError
                                }
                                objEmbed.description = `:x: Please enter valid number/"all" to convert all card.`;
                                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                            } else if(!isNaN(qty)) {
                                qty = parseInt(qty);
                            }
                        } else { qty = 1; }
        
                        //check if card ID exists/not
                        var cardData = await CardModule.getCardData(cardId);
        
                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: I can't find that card ID.";
        
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        //check if user have card/not
                        var cardStock = await CardModule.getUserCardStock(userId,cardId);
                        
                        if(cardStock<=-1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(cardStock<qty){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You don't have enough **${cardData[DBM_Card_Data.columns.name]}**.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(cardStock<=0){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need another duplicate of: **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** to convert this card.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } 
                        
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
    
                            //update the card stock
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                            SET ${DBM_Card_Inventory.columns.stock}=? 
                            WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                            ${DBM_Card_Inventory.columns.id_card}=?`;
                            await DBConn.conn.promise().query(query,[0,userId,cardId]);
    
                            objEmbed.description = `<@${userId}> has convert ${cardStock}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
                        } else {
                            convertValue*=qty;
    
                            //update the card stock
                            var query = `UPDATE ${DBM_Card_Inventory.TABLENAME}
                            SET ${DBM_Card_Inventory.columns.stock}=${DBM_Card_Inventory.columns.stock}-${qty}  
                            WHERE ${DBM_Card_Inventory.columns.id_user}=? AND 
                            ${DBM_Card_Inventory.columns.id_card}=?`;
                            await DBConn.conn.promise().query(query,[userId,cardId]);
    
                            objEmbed.description = `<@${userId}> has convert ${qty}x **${cardData[DBM_Card_Data.columns.id_card]} - ${cardData[DBM_Card_Data.columns.name]}** into `;
                        }

                        objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgOk }
    
                        //check the convert options:
                        var convertOptions = "point";
                        switch(commandSubcommand){
                            case "card-to-mofucoin":
                                convertOptions = "mofucoin";
                                break;
                            default:
                                convertOptions = "point";
                                break;
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
                        
                        await CardModule.limitizeUserPoints();
                        interaction.reply({embeds:[objEmbed]});

                        break;
                }
                break;
            case "timer":
                //get card spawn information
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type]
                }

                // if(!CardGuildModule.arrTimerGuildInformation.hasOwnProperty(guildId)){
                //     var objEmbed = {
                //         color: CardModule.Properties.embedColor,
                //         description :':x: There are no precure cards spawning right now.'
                //     }
                //     return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                // }

                //for countdown timer
                var timerLeft = "-";
                if(CardGuildModule.arrTimerGuildInformation.hasOwnProperty(guildId)){
                    var minutes = GlobalFunctions.str_pad_left(Math.floor(CardGuildModule.arrTimerGuildInformation[guildId].remaining / 60),'0',2);
                    var seconds = GlobalFunctions.str_pad_left(CardGuildModule.arrTimerGuildInformation[guildId].remaining - minutes * 60,'0',2);
                    timerLeft = `**${minutes}:${seconds}**`;
                }
                
                //prepare the embed:
                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    title: `Card Spawn Information`
                }

                if(spawnedCardData.token!=null&&
                    spawnedCardData.type!=null){
                    var currentSpawnType = spawnedCardData.type.toLowerCase();
                    switch(spawnedCardData.type.toLowerCase()) {
                        case "color":
                            currentSpawnType = "color";
                            break;
                        case "battle":
                            currentSpawnType = ":crossed_swords: battle";
                            break;
                        case "number":
                            currentSpawnType = ":game_die: number";
                            break;
                        case "quiz":
                            currentSpawnType = ":grey_question: quiz";
                            break;
                    }

                    objEmbed.fields = [
                        {
                            name:'Current Spawn:',
                            value:currentSpawnType,
                            inline:true
                        },
                        {
                            name:'Next Spawn Countdown:',
                            value:timerLeft,
                            inline:true
                        },
                        {
                            name:'Link:',
                            value:`[Jump to spawn](${GlobalFunctions.discordMessageLinkFormat(
                                guildId,interaction.channel.id,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]
                            )})`,
                            inline:true
                        }
                    ];
                    
                } else {
                    objEmbed.description = ':x: There are no precure card spawning right now.';
                    if(timerLeft!=null){
                        objEmbed.fields = [
                            {
                                name:'Next Spawn Countdown:',
                                value:timerLeft,
                                inline:true
                            }
                        ];
                    }
                }

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
            case "skill":
                switch(commandSubcommand){
                    case "use":
                        var cardId = interaction.options._hoistedOptions[0].value;
        
                        //check if card ID exists/not
                        var cardData = await CardModule.getCardData(cardId);
                        if(cardData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: I can't find that card ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        //check if user have card/not
                        var cardStock = await CardModule.getUserCardStock(userId,cardId);
                        if(cardStock<=-1){
                            objEmbed.thumbnail = { url:CardModule.Properties.imgResponse.imgError }
                            objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                            objEmbed.title = `Not enough ${color} color points`;
                            objEmbed.description = `:x: You need ${cpCost} ${color} points to use **${skillsData.name}**.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else {
                            await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,skillsData.value);//update SE2
                            var objColor = new Map();
                            objColor.set(`color_point_${color}`,-cpCost);
                            await CardModule.updateColorPoint(userId,objColor);//reduce the color point
        
                            var seEmbed = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,skillsData.value,"skills");
                            return interaction.reply({content:`**${userUsername}** has use the skills: **${skillsData.name}** with **${cpCost}** ${color} points.`,embeds:[new MessageEmbed(seEmbed)]});
                        }
                        break;
                    case "remove":
                        await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,null);
                        objEmbed.description = "Your skills status effect has been removed.";
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                }
                break;
            case "party":
                switch(commandSubcommand){
                    case "status":
                        var partyStatusData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyStatusData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You're not in party yet.\n>Use **card party join** to join into a party.\n>Use **card party list** to open the party list menu.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                    case "list":
                        var query = `SELECT * 
                        FROM ${DBM_Card_Party.TABLENAME} 
                        WHERE ${DBM_Card_Party.columns.id_guild}=? 
                        ORDER BY ${DBM_Card_Party.columns.id} ASC`;
                        var partyData = await DBConn.conn.promise().query(query,[guildId]);
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
                                objEmbed.description = "Use **card party join** command to join into the party.";
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
                                var msgEmbed = new MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                partyList = ""; partySeries = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        }

                        if(partyData[0].length<=0){
                            objEmbed.description = ":x: There are no available card party that can be joined up.";
                            interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else {
                            paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                        }
                        
                        break;
                    case "create":
                        var partyName = interaction.options._hoistedOptions[0].value;

                        //check if user is member from party/not
                        var query = `SELECT * 
                        FROM ${DBM_Card_Party.TABLENAME} 
                        WHERE ${DBM_Card_Party.columns.id_guild}=? AND 
                        (${DBM_Card_Party.columns.party_data} like '%${userId}%' OR 
                        ${DBM_Card_Party.columns.id_user} = ?)`;
                        var arrParameterized = [guildId,userId];
                        var checkUserMember = await DBConn.conn.promise().query(query, arrParameterized);
                        checkUserMember = checkUserMember[0][0];
                        if(checkUserMember!=null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.title = "Cannot create party";
                            objEmbed.description = ":x: You're still on card party and cannot create another one.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        var partyData = await CardModule.Party.updateParty(guildId,userId,partyName);
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        }
                        objEmbed.title = "Card party formed!";
                        objEmbed.description = `<@${partyData[DBM_Card_Party.columns.id_user]}> has formed card party with ID: **${partyData[DBM_Card_Party.columns.id]}**!`;
                        objEmbed.fields = [
                            {
                                name:`Party Name:`,
                                value:`${partyData[DBM_Card_Party.columns.name]}`
                            }
                        ]
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                    case "join":
                        var partyId = interaction.options._hoistedOptions[0].value;
                        
                        //check if still on party/not
                        var partyData = await CardModule.Party.getPartyStatusData(guildId,userId);//get by user id
                        if(partyData!=null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You're still on party and cannot join into another one.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //check if party id exists/not
                        var partyData = await CardModule.Party.getPartyStatusDataByIdParty(partyId);//get by party id
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: I can't find that party ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(partyData[DBM_Card_Party.columns.id_guild]!=guildId){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: I can't find that party ID.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //join the party
                        var joinResult = await CardModule.Party.joinParty(guildId,partyId,userId);
                        return interaction.reply({embeds:[new MessageEmbed(joinResult)]});
                        break;
                    case "leave":
                        //check if user is member from party/not
                        var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You're not in party yet.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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

                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
                        break;
                    case "charge":
                        //charge the party point
                        //check if in party/not
                        var partyData = await CardModule.Party.searchPartyStatusData(guildId,userId);
                        if(partyData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need to be on party to use the **party charge** command.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //check for spawn token
                        var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                        if(guildSpawnData[DBM_Card_Guild.columns.spawn_type]=="battle"||
                        guildSpawnData[DBM_Card_Guild.columns.spawn_token]==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Cannot use the **party charge** this time.`;
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

                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                }
                break;
            case "tradeboard":
                switch(commandSubcommand){
                    case "post":
                        var cardIdReceive = interaction.options._hoistedOptions[0].value;
                        var cardIdSend = interaction.options._hoistedOptions[1].value;

                        //lowercase the card id
                        cardIdReceive = cardIdReceive.toLowerCase();
                        cardIdSend = cardIdSend.toLowerCase();

                        //check if cardIdReceive exists on db/not
                        var cardDataReceive = await CardModule.getCardData(cardIdReceive);
                        var cardDataSend = await CardModule.getCardData(cardIdSend);
                        if(cardDataReceive==null||cardDataSend==null){
                            //check if card available/not
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: One of the card id cannot be found. Please re-enter with valid card id.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(cardDataReceive[DBM_Card_Data.columns.rarity]>5||cardDataSend[DBM_Card_Data.columns.rarity]>5){
                            //check if card rarity 1-5
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You can only post the trade listing with card rarity of: **1-5**⭐.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //check if user have the dupe card/not
                        var cardStock = await CardModule.getUserCardStock(userId,cardIdSend);
                        if(cardStock<=0){
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need another duplicate of: **${cardIdSend} - ${cardDataReceive[DBM_Card_Data.columns.name]}**.`
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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

                        return interaction.reply({embeds:[
                            new MessageEmbed({
                                color: CardModule.Properties.embedColor,
                                title: `Trade Listing Updated!`,
                                author:{
                                    iconURL:userAvatarUrl,
                                    name:userUsername
                                },
                                thumbnail:{
                                    url:cardDataReceive[DBM_Card_Data.columns.img_url]
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
                            })
                        ]});
                        break;
                    case "trade":
                        //confirm the trade process
                        var tradeId = interaction.options._hoistedOptions[0].value;

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
                            return interaction.reply({content:`:x: That trade listing was not available anymore/has expired.`});
                        } else {
                            result = result[0][0];
                            var idCardReceive = result[DBM_Card_Tradeboard.columns.id_card_have];
                            var idCardSend = result[DBM_Card_Tradeboard.columns.id_card_want];
                            
                            var sendUserCardStock = await CardModule.getUserCardStock(userId,idCardSend);
                            var sendUserCardData = await CardModule.getCardData(idCardSend);
                            if(sendUserCardStock<=0){
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.imgResponse.imgError
                                };
                                objEmbed.description = `:x: You need another duplicate of: **${sendUserCardData[DBM_Card_Data.columns.id_card]} - ${sendUserCardData[DBM_Card_Data.columns.name]}**`
                                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                            }

                            var receiveUserCardStock = await CardModule.getUserCardStock(result[DBM_Card_Tradeboard.columns.id_user],idCardReceive);
                            var receiveUserCardData = await CardModule.getCardData(idCardReceive);
                            if(receiveUserCardStock<=0){
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                objEmbed.description = `:x: <@${result[DBM_Card_Tradeboard.columns.id_user]}> need another duplicate of: **${receiveUserCardData[DBM_Card_Data.columns.id_card]} - ${receiveUserCardData[DBM_Card_Data.columns.name]}**`
                                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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

                            return interaction.reply({embeds:
                                [new MessageEmbed({
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
                                })]
                            });
                        }
                        break;
                    case "search":
                        var cardIdReceive = interaction.options._hoistedOptions[0].value;

                        //check if cardIdReceive exists on db/not
                        var cardDataReceive = await CardModule.getCardData(cardIdReceive);
                        if(cardDataReceive==null){
                            //check if card available/not
                            var objEmbed = {
                                color: CardModule.Properties.embedColor,
                                thumbnail : {
                                    url: CardModule.Properties.imgResponse.imgError
                                },
                                description : `:x: I can't find that card Id.`
                            };
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        //lowercase the card id
                        cardIdReceive = cardIdReceive.toLowerCase();
                        
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
                            return interaction.reply(`:x: I can't find any available trade listing for: **${cardDataReceive[DBM_Card_Data.columns.id_card]} - ${cardDataReceive[DBM_Card_Data.columns.name]}**`);
                        } else {
                            var contentId = ""; var contentUsernameWant = ""; var contentWant = "";
                            result = result[0];
                            result.forEach(function(entry){
                                contentId+=`${entry[DBM_Card_Tradeboard.columns.id]}\n`;
                                contentUsernameWant+=`<@${entry[DBM_Card_Tradeboard.columns.id_user]}>\n`;
                                contentWant+=`${entry[DBM_Card_Tradeboard.columns.id_card_want]}\n`;
                            });

                            if(contentId==""){
                                return interaction.reply(`:x: I can't find any available trade listing for: **${cardDataReceive[DBM_Card_Data.columns.id_card]} - ${cardDataReceive[DBM_Card_Data.columns.name]}**`);
                            } else {
                                return interaction.reply({embeds:
                                    [new MessageEmbed({
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
                                    })]
                                });
                            }
                        }
                        break;
                    case "remove":
                        //remove the trade listing
                        await CardModule.TradeBoard.removeListing(guildId,userId);

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgOk
                        },
                        objEmbed.description = `✅ Your trade listing has been removed from the tradeboard.`
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                }
                break;
            
        }

        if(command!=null) return;
        switch(commandSubcommand){
            case "debug":
                var cardSpawnData = await CardModule.generateCardSpawn(guildId);
                var msgObject = await interaction.channel.send(cardSpawnData);
                msgObject = await CardModule.updateMessageIdSpawn(guildId,msgObject.id);
                interaction.reply({content:"SPAWN DEBUG!"});
                break;
            case "wish":
                var cardId = interaction.options._hoistedOptions[0].value.toLowerCase();
                var cardUserData = await CardModule.getCardUserStatusData(userId);

                var embedData = {
                    mipple:{
                        color:"#FAF0FB",
                        imgOk:"https://cdn.discordapp.com/attachments/879277780599210005/879278899027132436/mipple_happy.png",
                        imgFailed:"https://cdn.discordapp.com/attachments/879277780599210005/879278935974764584/mipple_sad.png",
                        textPhrase:"Mipple"
                    },
                    mepple:{
                        color:"#FFFAC7",
                        imgOk:"https://cdn.discordapp.com/attachments/879277780599210005/879278983559139389/mepple_happy.png",
                        imgFailed:"https://cdn.discordapp.com/attachments/879277780599210005/879279017382014996/mepple_sad.png",
                        textPhrase:"Mepple"
                    }
                }

                //randomize the embed data
                var rndEmbed = GlobalFunctions.randomNumber(0,1);
                switch(rndEmbed){
                    case 0:
                        embedData = embedData.mipple;
                        break;
                    case 1:
                        embedData = embedData.mepple;
                }
                
                objEmbed.color = embedData.color; //update the color embed

                //week & wish point validation
                var maxWishNumber = 5;
                var parsedWishData = JSON.parse(cardUserData[DBM_Card_User_Data.columns.wish_data]);
                var currentWeek = GlobalFunctions.getCurrentWeek();
                var arrEmbedsSend = [];
                if(currentWeek!=parsedWishData["wish_week"]){
                    parsedWishData["wish_point"]=maxWishNumber;
                    parsedWishData["wish_week"]=currentWeek;
                    //update the wish data
                    var paramSet = new Map();
                    paramSet.set(DBM_Card_User_Data.columns.wish_data,JSON.stringify(parsedWishData));
                    var paramWhere = new Map();
                    paramWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                    await DB.update(DBM_Card_User_Data.TABLENAME,paramSet,paramWhere);
                    
                    objEmbed.thumbnail = {
                        url:embedData.imgOk
                    }
                    objEmbed.title = `${maxWishNumber} Wish Point Received!`;
                    objEmbed.description = `:white_check_mark: You have received ${maxWishNumber} wish point for this week!`;
                    arrEmbedsSend.push(new MessageEmbed(objEmbed));
                } else if(parsedWishData["wish_point"]<=0){
                    objEmbed.thumbnail = {
                        url:embedData.imgFailed
                    }
                    objEmbed.description = `:x: You need 1 wish point to use card wishing.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //check if card ID exists/not
                var cardData = await CardModule.getCardData(cardId);

                if(cardData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that card ID.";

                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //check if user have card/not
                var itemStock = await CardModule.getUserCardStock(userId,cardId);
                if(itemStock<=-1){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //get card user inventory data to get the received date data
                var userInventoryData = await CardModule.getUserCardInventoryData(userId,cardId);

                //check for level validation
                var cardInventory = await CardModule.getCardInventoryUserData(userId,cardId);
                if(cardData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that card ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //reset level:
                var paramSet = new Map();
                paramSet.set(DBM_Card_Inventory.columns.level,1);
                var paramWhere = new Map();
                paramWhere.set(DBM_Card_Inventory.columns.id_user,userId);
                paramWhere.set(DBM_Card_Inventory.columns.id_card,cardId);
                await DB.update(DBM_Card_Inventory.TABLENAME,paramSet,paramWhere);

                var rarity = cardData[DBM_Card_Data.columns.rarity];
                var chanceMin = rarity*10;
                var rndChance = GlobalFunctions.randomNumber(cardInventory[DBM_Card_Inventory.columns.level],chanceMin);

                //reload card user data
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                
                if(rndChance>=chanceMin){
                    //SUCCESS - add stock
                    await CardModule.addNewCardInventory(userId,cardData[DBM_Card_Data.columns.id_card],true,1);
                    objEmbed.thumbnail = {
                        url:embedData.imgOk
                    }
                    objEmbed.title = `Card Wished Up Successfully!`;
                    objEmbed.description = `🌠 ${embedData.textPhrase}! Your **${cardData[DBM_Card_Data.columns.name]}** has been wished up! You have received another duplicate of this card.`;
                } else {
                    //fail
                    objEmbed.thumbnail = {
                        url:embedData.imgFailed
                    }
                    objEmbed.title = `Card Wishing Has Failed`;
                    objEmbed.description = `:x: ${embedData.textPhrase}... Sorry, the wishing process for **${cardData[DBM_Card_Data.columns.name]}** has failed this time.`;
                }

                //reload card user data & update wish data
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                var parsedWishData = JSON.parse(cardUserData[DBM_Card_User_Data.columns.wish_data]);
                parsedWishData["wish_point"]-=1;
                //update the wish data
                var paramSet = new Map();
                paramSet.set(DBM_Card_User_Data.columns.wish_data,JSON.stringify(parsedWishData));
                var paramWhere = new Map();
                paramWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,paramSet,paramWhere);

                arrEmbedsSend.push(new MessageEmbed(objEmbed));
                
                return interaction.reply({embeds:arrEmbedsSend});

                break;
        }
    },
    async executeComponentSelectMenu(interaction){
        var customId = interaction.customId;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                name:userUsername,
                iconURL:userAvatarUrl
            }
        };

        var arrEmbedsSend = [];

        switch(customId){
            case "answer_quiz":
                await interaction.deferReply();
                var answer = interaction.values[0];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

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

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type!=null && spawnedCardData.type != "quiz"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: It's not quiz time yet.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                } else if(spawnedCardData.type==null||spawnedCardData.token==null||spawnedCardData.spawn_data==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: There are no card that is spawned yet. Please wait until the next card spawn.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You already use the answer command. Please wait until the next card spawn.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
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
                var seriesId = CardModule.Properties.seriesCardCore[spawnedCardData.series].series_point;
                var seriesCurrency = CardModule.Properties.seriesCardCore[seriesId].currency;
                
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];

                if(answer!=spawnedCardData.answer){
                    //check for status effect:
                    if(currentStatusEffect=="quiz_master"){
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                        arrEmbedsSend.push(new MessageEmbed(embedStatusActivated));

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgFailed
                        }
                        objEmbed.description = `:x: The correct answer was: **${spawnedCardData.answer}**`;
                        arrEmbedsSend.push(new MessageEmbed(objEmbed));
                        
                        //erase the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                    } else {
                        //default embed:
                        switch(spawnedCardData.type){
                            case CardModule.Properties.spawnData.quiz.typeNormal:
                            case CardModule.Properties.spawnData.quiz.typeStarTwinkleStarsCount:
                            case CardModule.Properties.spawnData.quiz.typeStarTwinkleConstellation:
                                objEmbed.thumbnail = {
                                    url: CardModule.Properties.imgResponse.imgFailed
                                }
                                objEmbed.title = `Wrong Answer!`;
                                objEmbed.description = `:x: Sorry but that's not the answer!`;
                                break;
                            case CardModule.Properties.spawnData.quiz.typeTsunagarus:
                                objEmbed.thumbnail = {
                                    url: TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.image
                                }
                                objEmbed.title = "Defeated!";
                                objEmbed.color = TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiridjirin.embedColor;
                                objEmbed.description = `:x: Chirichiri! You failed to rescue this time.`;
                                break;
                        }
                        
                        arrEmbedsSend.push(new MessageEmbed(objEmbed));

                        if(currentStatusEffect=="second_chance"){
                            //second chance status effect
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            // await message.channel.send({embed:embedStatusActivated});
                            arrEmbedsSend.push(new MessageEmbed(embedStatusActivated));

                            //erase the status effect
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);

                        } else {
                            //wrong answer - update the token
                            await CardModule.updateCatchAttempt(userId, spawnedCardData.token);
                        }
                    }

                    return await interaction.editReply({embeds:arrEmbedsSend});
                }

                switch(spawnedCardData.type){
                    case CardModule.Properties.spawnData.quiz.typeTsunagarus:
                        var embedVictory = objEmbed;
                        embedVictory.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgOk
                        }
                        embedVictory.title = "Mini Tsunagarus Defeated!";
                        embedVictory.description = "✅ You've successfully defeat the mini tsunagarus!";
                        arrEmbedsSend.push(new MessageEmbed(embedVictory));
                        break;
                }

                //correct answer
                var duplicate = true;
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
                if(userData.color==spawnedCardData.color) pointReward*=2;
                if(userData.series==spawnedCardData.series) seriesPointReward*=2;

                var cardStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                if(cardStock<=-1){//non duplicate
                    await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                    arrEmbedsSend.push(
                        CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesPointReward)
                    );

                    duplicate = false;
                } else {//duplicate
                    var cardQty = 1;
                    if(userData.color==spawnedCardData.color&&userData.series==spawnedCardData.series){
                        cardQty=2;
                    }

                    if(cardStock<CardModule.Properties.maximumCard){//add new stock card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);
                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesPointReward,cardQty)
                        );
                        cardStock=cardStock+1;
                    } else {
                        //cannot add more card
                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesPointReward)
                        );
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
                    arrEmbedsSend.push(CardModule.Embeds.embedCardCapture(spawnedCardData.color,spawnedCardData.id,spawnedCardData.pack,cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_hp],cardStock));
                }

                //send all embeds
                await interaction.editReply({embeds:arrEmbedsSend});
                
                //check card pack completion:
                var embedCompletion = null;
                var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                var arrCompletion = [];
                if(checkCardCompletionPack){
                    //card pack completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    if(embedCompletion!=null){
                        arrCompletion.push(new MessageEmbed(embedCompletion));
                    }
                } 
                
                if(checkCardCompletionColor) {
                    //color set completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                    if(embedCompletion!=null){
                        arrCompletion.push(new MessageEmbed(embedCompletion));
                    }
                }

                if(checkCardCompletionSeries) {
                    //color set completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                    if(embedCompletion!=null){
                        arrCompletion.push(new MessageEmbed(embedCompletion));
                    }
                }

                if(arrCompletion.length>0){
                    return interaction.channel.send({embeds:arrCompletion});
                }

                break;
            case "battle_normal":
                await interaction.deferUpdate();
                var command = interaction.values[0];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

                //add new card/update card stock & check for card completion
                var rewardsReceived = "";

                var messageSpawn = null;
                try{
                    messageSpawn = await interaction.channel.messages
                    .fetch(guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);
                } catch(error){}

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

                //battle validation
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.fear.value){
                    //fear debuff
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[embedStatusEffectActivated]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                } else if((spawnedCardData.type!=null && spawnedCardData.type != "battle")||
                spawnedCardData.type==null||spawnedCardData.token==null||spawnedCardData.spawn_data==null){
                    //card catcher validator, check if card is still spawning/not
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgOk
                    }
                    objEmbed.description = ":x: There are no tsunagarus right now.";
                    await interaction.editReply({embeds:messageSpawn.embeds});
                    return interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: You cannot participate in battle anymore!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                } else if(userData.cardIdSelected==null) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: You need to set your precure avatar first with: **/card set avatar** command!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
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
                var enemyRarity = 1;

                //battle command validation
                if(enemyCategory==TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.boss){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    };

                    objEmbed.description = ":x: You cannot use the party battle command!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                }

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
                } else if(CardModule.Properties.spawnData.battle.color_absorb in jsonParsedSpawnData){
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

                var captured = false; var hitted = false;
                var specialActivated = false;
                //charge/special command validation
                switch(command){
                    case "special":
                        var specialAllow = true;
                        //special validation
                        if(CardModule.Properties.spawnData.battle.special_allow in jsonParsedSpawnData){
                            if(!jsonParsedSpawnData[CardModule.Properties.spawnData.battle.special_allow]&&
                                currentStatusEffect!=CardModule.StatusEffect.buffData.special_break.value){
                                specialAllow = false;
                            }
                        }

                        if(currentStatusEffect==CardModule.StatusEffect.debuffData.specialock.value){
                            //specialock debuff
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                            
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(embedStatusActivated)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(userCardData[DBM_Card_User_Data.columns.special_point]<100){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.description = ":x: Your special point is not fully charged yet!";
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(!specialAllow||cardData[DBM_Card_Data.columns.series]!=enemyData[DBM_Card_Enemies.columns.series]){
                            //special countered
                            //remove the precure avatar
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    
                            //update the capture attempt
                            // await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
    
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
    
                            //reset the special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            // parameterSet.set(DBM_Card_User_Data.columns.card_set_token,spawnedCardData.token);
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
    
                            objEmbed.title = "Battle Lost: Special Countered!";
                            objEmbed.description = "Your special has been countered by the tsunagarus and you've instantly defeated! Your special point has dropped into 0%!";
    
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else {
                            //special activation with special break
                            if(currentStatusEffect==CardModule.StatusEffect.buffData.special_break.value){
                                var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                                arrEmbedsSend.push(embedStatusActivated);
        
                                if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                    if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                        if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                            await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                        }
                                    }
                                }
                            }
    
                            specialActivated = true;
                            
                            //activate individual special
                            var level_special = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
    
                            //reset the special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                            
                        }

                        break;
                    case "charge":
                        //reduce the color point
                        var cpCost = 50;
                        var pointSpecial = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                        pointSpecial=CardModule.Status.getSpecialPointProgress(pointSpecial);

                        if(userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<=cpCost){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You need ${cpCost} ${cardData[DBM_Card_Data.columns.color]} points to charge up the special attack!`;
                        } else if(userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]>=cpCost){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgOk
                            };
                            var objColor = new Map();
                            objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,-cpCost);
                            await CardModule.updateColorPoint(userId,objColor);

                            objEmbed.title = "Special Point Charged!";
                            objEmbed.description = `Your special point has been charged up by ${pointSpecial}%`;
                        }

                        //update the special point
                        var specialCharged = await CardModule.Status.updateSpecialPoint(userId,pointSpecial);
                        if(specialCharged){
                            objEmbed.description += `\n✨Your special has been fully charged and ready now!`;
                        }

                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                        var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                        setTimeout(function() {
                            embedNotif.delete();
                        }, 5000);
                        return;
                        break;
                }

                var pointReward = 0; //default point reward
                // var pointReward = 10*cardDataReward[DBM_Card_Data.columns.rarity];
                var seriesPointReward = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var selectedSeriesPoint = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;

                var debuffProtection = false; var removePrecure = true;

                var randDebuffChance = GlobalFunctions.randomNumber(0,10);
                var randomDebuff = null; //return in object
                randDebuffChance = 8; //for debug purpose only
                if(randDebuffChance<=9){
                    randomDebuff = GlobalFunctions.randomProperty(CardModule.StatusEffect.debuffData); //return in object
                }

                //color point validator
                var cpBattleCost = 10;//cp cost for battling the enemy
                if(!specialActivated&&
                    userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<cpBattleCost){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You need ${cpBattleCost} ${cardData[DBM_Card_Data.columns.color]} points to attack the tsunagarus!`;
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
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

                var hpEnemy = 0; var hpMaxEnemy = 0; var chance = 0;//default chance
                //get player stats:
                var hp = CardModule.Status.getHp(level,cardData[DBM_Card_Data.columns.max_hp]);
                var atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);

                //check for debuff prevention buff
                switch(currentStatusEffect){
                    case CardModule.StatusEffect.buffData.precure_protection.value:
                        allowSecondBattle = true;
                        removePrecure = false;
                        break;
                }

                //get enemy hp stats:
                if(CardModule.Properties.spawnData.battle.hp in jsonParsedSpawnData){
                    hpEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp];
                    hpMaxEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max];
                }
                
                var txtStatusEffectHit = "";//for the end status embed results
                var enemySpawnLink = GlobalFunctions.discordMessageLinkFormat(guildId,interaction.channel.id,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);

                //process the command:
                switch(command){
                    case "fight":
                    switch(enemyType){
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term:
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
                            var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.value];
                            var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts];
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
                                    // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts]-=1;
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

                                        arrEmbedsSend.push(
                                            CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)
                                        );
                                    } else {
                                        hitted = true;
                                    }
                                    break;
                                case CardModule.Properties.spawnData.battle.color_block:
                                    if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){
                                        arrEmbedsSend.push(
                                            CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)
                                        );
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

                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term:
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term:
                            //gizzagizza
                            // {"category":"normal","type":"gizzagizza","id_enemy":"FPC10","color_block":"red","id_card_reward":"haha501","level":32,"rarity":5,"hp":388,"hp_max":388,"damage_dealer":{}}
                            var rarity = cardData[DBM_Card_Data.columns.rarity];
                            var overrideChance = false;
    
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts];
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
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts]-=1;
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

                                            arrEmbedsSend.push(
                                                CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)
                                            )
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color_block:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){

                                            arrEmbedsSend.push(
                                                CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)
                                            );

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
                        
                        //enemy 3

                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term:
                            
                            var rarity = cardData[DBM_Card_Data.columns.rarity];
                            var overrideChance = false;

                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()){
                                //calculate series buff: +10%
                                chance+=70;
                            }
                            
                            //check for skills boost
                            if(currentStatusEffectSkills!=null){
                                var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.value];
                                var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts];
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
                                        // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts]-=1;
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

                                            arrEmbedsSend.push(
                                                CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Absorbed!",":x: Your attack has been absorbed!",`${hpEnemy}/${hpMaxEnemy}`)
                                            );
                                        } else {
                                            hitted = true;
                                        }
                                        break;
                                    case CardModule.Properties.spawnData.battle.color_block:
                                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_block].includes(cardData[DBM_Card_Data.columns.color])){
                                            arrEmbedsSend.push(
                                                CardModule.Embeds.battleHitHpFail(cardData[DBM_Card_Data.columns.color],enemyType,userUsername,userAvatarUrl,"Damage Blocked!",":x: The tsunagarus has blocked your attack!",`${hpEnemy}/${hpMaxEnemy}`)
                                            );
                                            
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


                        //enemy 3 end
                    }
                    break;
                    case "special":
                        hpEnemy = 0;
                        break;
                }

                //individual
                var duplicate = true; var enemyRespawned = false;
                if(!specialActivated&&hitted&&hpEnemy>0){
                    //success hit
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 10;
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 15;
                            break;
                        case 1: case 2: default:
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

                    arrEmbedsSend.push(CardModule.Embeds.battleHitHpSuccess(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],userUsername,userAvatarUrl,`**${userUsername}** has dealt **${atk}** damage to **${enemyType}**!`,txtStatusEffectHit,txtRewards,`${hpEnemy}/${hpMaxEnemy}`));

                    // await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:arrEmbedsSend});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 8000);

                } else if(specialActivated||captured||hpEnemy<=0){
                    //victory/enemy defeated
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 60;
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 70;
                            break;
                        case 1: case 2: default:
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
                    await interaction.guild.members.fetch(`${userId}`)
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

                    arrEmbedsSend.push(new MessageEmbed({
                        color:CardModule.Properties.embedColor,
                        title:"❤️ Damage Dealer List:",
                        description:txtDamageDealerList,
                        thumbnail:{
                            url:CardModule.Properties.imgResponse.imgOk
                        },
                    }));

                    var userCardRewardStock = await CardModule.getUserCardStock(userId,cardDataReward[DBM_Card_Data.columns.id_card]);
                    var qty = 1; var rewardBoost = false; var iconBoost = "";

                    //reward booster validation
                    if(currentStatusEffectSkills!=null&&oldIdUser==userId){
                        var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.value];
                        var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts];
                        var skillsActivated = true;
                        switch(valueSkillEffects){
                            case CardModule.StatusEffect.cureSkillsBuffData.reward_booster.value:
                                rewardBoost = true; iconBoost = "⬆️";
                                // var embedSkillsActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,valueSkillEffects,"skills");
                                // arrEmbedsSend.push(embedSkillsActivated);

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
                            rewardsReceived+=`>${iconBoost}2x New Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
                        
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
                                rewardsReceived+=`>${iconBoost}2x Duplicate Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**\n`;
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
                            rewardsReceived+=`>${iconBoost}${qty}x Item: ${itemDropData[0][0][DBM_Item_Data.columns.name]} **(${itemDropData[0][0][DBM_Item_Data.columns.id]})**\n`;

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
                    rewardsReceived+=`>${iconBoost}**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points\n`;
                    rewardsReceived+=`>${iconBoost}${seriesPointReward} ${CardModule.Properties.seriesCardCore[selectedSeriesPoint].currency}\n`;
                    
                    //update the mofucoin
                    var mofucoinReward = pointReward;
                    if(rewardBoost){
                        mofucoinReward*=2;
                    }
                    await CardModule.updateMofucoin(userId,mofucoinReward);
                    rewardsReceived+=`>${iconBoost}${mofucoinReward} mofucoin\n`

                    var specialCharged = false;
                    if(!specialActivated){
                        //update the special point reward
                        var pointSpecial = CardModule.Status.getSpecialPointProgress(level_special);
                        if(rewardBoost){ pointSpecial*=2; }
                        specialCharged = await CardModule.Status.updateSpecialPoint(userId,pointSpecial);
                        rewardsReceived+=`>${iconBoost}**${pointSpecial}**% special points\n`;
                    }

                    //update the token & color point
                    var objColor = new Map();
                    objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                    var objSeries = new Map();
                    objSeries.set(selectedSeriesPoint,seriesPointReward);
                    await CardModule.updateCatchAttempt(userId,spawnedCardData.token,objColor,objSeries);

                    if(!specialActivated){
                        //battle win
                        arrEmbedsSend.push(
                            CardModule.Embeds.battleWin(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],rewardsReceived)
                        );
                    } else {
                        //special attack embed
                        arrEmbedsSend.push(
                            CardModule.Embeds.battleSpecialActivated(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],level_special,rewardsReceived)
                        );
                    }

                    //get the current card total
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardDataReward[DBM_Card_Data.columns.pack]);
                    // await message.channel.send({embed:objEmbed}); //announce the reward
                    
                    if(!duplicate){
                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCapture(cardDataReward[DBM_Card_Data.columns.color],cardDataReward[DBM_Card_Data.columns.id_card],cardDataReward[DBM_Card_Data.columns.pack],cardDataReward[DBM_Card_Data.columns.name],cardDataReward[DBM_Card_Data.columns.img_url],cardDataReward[DBM_Card_Data.columns.series],cardDataReward[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardDataReward[DBM_Card_Data.columns.max_hp],cardDataReward[DBM_Card_Data.columns.max_atk],userCardRewardStock)
                        );
                    }

                    if(specialCharged){
                        arrEmbedsSend.push(CardModule.Embeds.battleSpecialReady(userUsername,userAvatarUrl));//announce the special ready
                    }

                    await interaction.channel.send({embeds:arrEmbedsSend});

                    //check card pack completion:
                    var arrCompletion = [];
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",cardDataReward[DBM_Card_Data.columns.color]);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",cardDataReward[DBM_Card_Data.columns.series]);

                    if(checkCardCompletionPack){
                        //card pack completion
                        var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null){
                            arrCompletion.push(new MessageEmbed(embedCompletion));
                        }
                    }
                    
                    if(checkCardCompletionColor) {
                        //color set completion
                        var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                        if(embedCompletion!=null){
                            arrCompletion.push(new MessageEmbed(embedCompletion));
                        }
                    }

                    if(checkCardCompletionSeries) {
                        //color set completion
                        var embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                        if(embedCompletion!=null){
                            arrCompletion.push(new MessageEmbed(embedCompletion));
                        }
                    }

                    if(arrCompletion.length>0){
                        await interaction.channel.send({embeds:arrCompletion});
                    }
                    //completion checking end

                    //check for enemy revival/erase the card guild spawn
                    var reviveChance = GlobalFunctions.randomNumber(1,10);
                    reviveChance = 0;//for debugging purpose only
                    if(duplicate&&reviveChance<=8){
                        enemyRespawned = true;
                        var notifRespawn = await interaction.channel.send({embeds:
                            [new MessageEmbed({
                                author : {
                                    name: "Mofurun",
                                    icon_url: CardModule.Properties.imgResponse.imgFailed
                                },
                                color: CardModule.Properties.embedColor,
                                title: `Tsunagarus Respawned!`,
                                description: `Looks like the tsunagarus has been respawned again!`,
                                fields:{
                                    name:'Spawn Link:',
                                    value:`[Jump to spawn link](${GlobalFunctions.discordMessageLinkFormat(guildId,interaction.channel.id,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn])})`
                                },
                                thumbnail:{
                                    url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
                                }
                            })]
                        });

                        // setTimeout(function() {
                        //     notifRespawn.delete();
                        // }, 8000);

                        //reset spawn data
                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.damage_dealer]={};//modify DD data
                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp] = hpMaxEnemy;
                        //modify the enemy hp
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                        //reset the hp
                        switch(enemyType){
                            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term:
                            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term:
                            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term:
                            case TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term:
                                hpEnemy = hpMaxEnemy;
                                break;
                        }

                    } else {
                        await CardModule.removeCardGuildSpawn(guildId);
                    }

                } else {
                    //lose/failed to defeat the enemy
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 5;
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 7;
                            break;
                        case 1: case 2: default:
                            pointReward = 2;
                            break;
                    }

                    //update the catch token & color points
                    var objColor = new Map();
                    objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);

                    var txtDescription = "";
                    if(removePrecure){
                        txtDescription = `:x: Oh no! <@${userId}> has lost from the battle and lost the precure avatar power!\n`;
                        //remove the precure avatar
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                    } else {
                        txtDescription = `:x: Oh no! <@${userId}> has lost from the battle!\n`;
                    }

                    //check for buff
                    switch(currentStatusEffect){
                        case CardModule.StatusEffect.buffData.precure_protection.value:
                            allowSecondBattle = true;
                            removePrecure = false;
                            txtDescription+=`${CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"buff")}`;
                            // var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            // await message.channel.send({embed:embedStatusActivated});
                            break;
                    }

                    //activate the debuff if user doesn't have debuff protection
                    var debuff_data = "";
                    if(!debuffProtection&&randomDebuff!=null){
                        //check if have debuff/not
                        if(!(currentStatusEffect in CardModule.StatusEffect.debuffData)){
                            await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                            debuff_data = randomDebuff.value;
                            arrEmbedsSend.push(embedStatusActivated);
                        }
                    }

                    arrEmbedsSend.push(CardModule.Embeds.battleLost(userUsername,userAvatarUrl,txtDescription,`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,"",enemySpawnLink));

                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:arrEmbedsSend});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 8000);

                    //check if buff status effect is permanent/not
                    if(currentStatusEffect in CardModule.StatusEffect.buffData){
                        if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                            if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                            }
                        }
                    }
                }

                //embed spawn updates
                if(hpEnemy>0||enemyRespawned){
                    //enemy respawned
                    switch(enemyType){
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chokkins.term:
                            try{
                                var editedEmbed = new MessageEmbed(messageSpawn.embeds[0]);
                                editedEmbed.fields[2].value = `${hpEnemy}/${hpMaxEnemy}`;
                                messageSpawn.embeds = [editedEmbed];
                            } catch(error){}
                            break;
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.dibosu.term:
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.chiguhaguu.term:
                            try{
                                var editedEmbed = new MessageEmbed(messageSpawn.embeds[0]);
                                editedEmbed.fields[1].value = `${hpEnemy}/${hpMaxEnemy}`;
                                messageSpawn.embeds = [editedEmbed];
                            } catch(error){}
                            break;
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.gizzagizza.term:
                            try{
                                var editedEmbed = new MessageEmbed(messageSpawn.embeds[0]);
                                editedEmbed.fields[0].value = `${hpEnemy}/${hpMaxEnemy}`;
                                messageSpawn.embeds = [editedEmbed];
                            } catch(error){}
                            break;
                    }

                    try{
                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    } catch(error){}
                    
                } else {
                    //enemy not respawning
                    await interaction.editReply({embeds:[new MessageEmbed({
                        color: CardModule.Properties.embedColor,
                        author: {
                            name:userUsername,
                            iconURL:userAvatarUrl
                        },
                        title:"Victory!",
                        description:"Tsunagarus has been defeated!",
                        thumbnail:{
                            url:CardModule.Properties.imgResponse.imgOk
                        }})],
                        components:[]
                    });
                }
                
                return;
                break;
            case "battle_boss":
            case "battle_boss_scan":
                await interaction.deferUpdate();
                var command = interaction.values[0];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

                //add new card/update card stock & check for card completion
                var rewardsReceived = "";

                var messageSpawn = null;
                try{
                    messageSpawn = await interaction.channel.messages
                    .fetch(guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);
                } catch(error){}

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

                //battle validation
                var currentStatusEffect = userCardData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.fear.value){
                    //fear debuff
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[embedStatusEffectActivated]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                } else if((spawnedCardData.type!=null && spawnedCardData.type != "battle")||
                spawnedCardData.type==null||spawnedCardData.token==null||spawnedCardData.spawn_data==null){
                    //card catcher validator, check if card is still spawning/not
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgOk
                    }
                    objEmbed.description = ":x: There are no tsunagarus right now.";
                    await interaction.editReply({embeds:messageSpawn.embeds});
                    return interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: You cannot participate in battle anymore!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                } else if(userData.cardIdSelected==null) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = ":x: You need to set your precure avatar first with **card set avatar** command!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
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

                if(enemyCategory!=TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.boss){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    };

                    objEmbed.description = ":x: You cannot use the party battle command!";
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                }

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
                } else if(CardModule.Properties.spawnData.battle.color_absorb in jsonParsedSpawnData){
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
                var specialActivatedIndividual = false;//for team battle only

                //default point reward
                var pointReward = 0;
                // var pointReward = 10*cardDataReward[DBM_Card_Data.columns.rarity];
                var seriesPointReward = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var selectedSeriesPoint = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;

                var debuffProtection = false; var removePrecure = true; 
                var partyBlock = false;

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
                if(enemyCategory==TsunagarusModules.Properties.enemySpawnData.tsunagarus.category.boss){
                    teamBattle = true;
                }

                //in party validation
                if(partyData==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: You need to be on team party!`;
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
                    }, 5000);
                    return;
                } else if(partyData!=null){
                    inParty = true;
                    partyPoint = partyData[DBM_Card_Party.columns.party_point];
                    partyData = await CardModule.Party.getAllStatus(partyData[DBM_Card_Party.columns.id]);
                    //check for party synergy
                    if(partyData.synergy){partySynergy = true;}
                }

                //scan command validation
                switch(customId){
                    case "battle_boss_scan":
                        //scan command
                        if(partyPoint<1){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            };
                            objEmbed.description = ":x: Your party need 1 Party Point to use the scan command.";
                        } else {
                            objEmbed.thumbnail = {
                                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
                            };

                            switch(command){
                                case "color":
                                    var txtColor = "";
                                    for(var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                        txtColor+=`${key},`;
                                    }
                                    txtColor = txtColor.replace(/,(?=[^,]*$)/, '');

                                    objEmbed.title = "🔍 Color Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus currently have: **${txtColor}** lives.`;
                                    break;
                                case "type":
                                    objEmbed.title = "🔍 Enemy Type Scanned!"
                                    objEmbed.description = `1 PP has been used! This tsunagarus possesses **${TsunagarusModules.Properties.enemySpawnData[enemyData[DBM_Card_Enemies.columns.series].toLowerCase()].term}** power`;
                                    break;
                                case "rarity":
                                    objEmbed.title = "🔍 Rarity Scanned!"
                                    objEmbed.description = `1 PP has been used! You need card with minimum rarity of: **${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]}** for this one.`;
                                    break;
                            }
                            
                            //update the party point
                            await CardModule.Party.updatePartyPoint(partyData.partyData[DBM_Card_Party.columns.id],-1);
                        }

                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                        return interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                }

                //charge/special command validation
                //special validation
                var specialAllow = true;
                //check for special protection
                if(CardModule.Properties.spawnData.battle.special_allow in jsonParsedSpawnData){
                    if(!jsonParsedSpawnData[CardModule.Properties.spawnData.battle.special_allow]&&
                        currentStatusEffect!=CardModule.StatusEffect.buffData.special_break.value){
                        specialAllow = false;
                    }
                }

                //both special individual/party validation
                if(command=="special"||command=="special_party"){
                    if(currentStatusEffect==CardModule.StatusEffect.debuffData.specialock.value){
                        //check for specialock debuff
                        var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                        
                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                        var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(embedStatusActivated)]});
                        setTimeout(function() {
                            embedNotif.delete();
                        }, 5000);
                        return;
                    } 
                }

                //special/special party/block:
                switch(command){
                    case "special":
                        //individual special validation
                        if(userCardData[DBM_Card_User_Data.columns.special_point]<100){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.description = ":x: Your special point is not fully charged yet!";
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(!(cardData[DBM_Card_Data.columns.color] in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives])) {
                            //check if color exists/not
                            //reset own special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.title = "Special attack missed!";
                            objEmbed.description = "Your special attack has been missed!";
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(!specialAllow||cardData[DBM_Card_Data.columns.series]!=enemyData[DBM_Card_Enemies.columns.series]){
                            //special countered: remove the precure avatar & reset special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.title = "Battle Lost: Special Countered!";
                            objEmbed.description = "Your special has been countered by the tsunagarus and you've instantly defeated! Your special point has dropped into 0%!";

                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        }

                        //special break notification
                        if(currentStatusEffect==CardModule.StatusEffect.buffData.special_break.value){
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            arrEmbedsSend.push(embedStatusActivated);
    
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                    }
                                }
                            }
                        }

                        //activate individual special
                        specialActivatedIndividual = true;
                        hitted = true;

                        var level_special = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                        //reset the special point
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                        
                        break;
                    case "special_party":
                        //party special validation

                        if(partyData.partyData[DBM_Card_Party.columns.special_point]<100){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.description = ":x: Your party special point is not fully charged yet!";
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(!specialAllow||cardData[DBM_Card_Data.columns.series]!=enemyData[DBM_Card_Enemies.columns.series]){
                            //special countered: remove the precure avatar & reset special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                            parameterSet.set(DBM_Card_User_Data.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                            await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                            //update the capture attempt
                            //reset party special point
                            var parameterSet = new Map();
                            parameterSet.set(DBM_Card_Party.columns.special_point,0);
                            var parameterWhere = new Map();
                            parameterWhere.set(DBM_Card_Party.columns.id,partyData.partyData[DBM_Card_Party.columns.id]);
                            await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);

                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.title = "Battle Lost: Special Countered!";
                            objEmbed.description = "The team attack has been countered by the tsunagarus and you've instantly defeated! Your party special point has dropped into 0%!";

                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        } else if(!partySynergy){
                            //check for special synergy
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            };
                            objEmbed.title = "Non Synergy!";
                            objEmbed.description = "Your party is not on synergy and can't use the team attack!";
                            await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                            var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                            setTimeout(function() {
                                embedNotif.delete();
                            }, 5000);
                            return;
                        }
                        //end checking general validation

                        //special break notification
                        if(currentStatusEffect==CardModule.StatusEffect.buffData.special_break.value){
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            arrEmbedsSend.push(embedStatusActivated);
    
                            if(currentStatusEffect in CardModule.StatusEffect.buffData){
                                if("permanent" in CardModule.StatusEffect.buffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.buffData[currentStatusEffect].permanent){
                                        await CardModule.StatusEffect.updateStatusEffect(userId,null); //remove the SE
                                    }
                                }
                            }
                        }

                        //activate team attack
                        specialActivated = true;
                        bossAlive = false;
                        //reset party special point
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Party.columns.special_point,0);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Party.columns.id,partyData.partyData[DBM_Card_Party.columns.id]);
                        await DB.update(DBM_Card_Party.TABLENAME,parameterSet,parameterWhere);
                        break;
                    case "block":
                        partyBlock = true;
                        break;
                }

                var pointReward = 0; //default point reward
                // var pointReward = 10*cardDataReward[DBM_Card_Data.columns.rarity];
                var seriesPointReward = userCardInventoryData[DBM_Card_Inventory.columns.level_special];
                var selectedSeriesPoint = CardModule.Properties.seriesCardCore[cardData[DBM_Card_Data.columns.series]].series_point;

                var debuffProtection = false; var removePrecure = true;

                var randDebuffChance = GlobalFunctions.randomNumber(0,10);
                var randomDebuff = null; //return in object
                randDebuffChance = 8; //for debug purpose only
                if(randDebuffChance<=9){
                    randomDebuff = GlobalFunctions.randomProperty(CardModule.StatusEffect.debuffData); //return in object
                }

                //color point validator
                var cpBattleCost = 10;//cp cost for battling the enemy
                if(!specialActivated&&
                    userCardData[`color_point_${cardData[DBM_Card_Data.columns.color]}`]<cpBattleCost){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You need ${cpBattleCost} ${cardData[DBM_Card_Data.columns.color]} points to attack the tsunagarus!`;
                    await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                    var embedNotif = await interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                    setTimeout(function() {
                        embedNotif.delete();
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

                var chance = 0;//default chance
                var hpMaxEnemy = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max];
                var teamBattleTurnOut = false;//for battle ends by enemy
                var bossAlive = true; var livesDown = false;

                //player stats:
                var hp = CardModule.Status.getHp(level,cardData[DBM_Card_Data.columns.max_hp]);
                var atk = CardModule.Status.getAtk(level,cardData[DBM_Card_Data.columns.max_atk]);

                //check for debuff prevention buff
                switch(currentStatusEffect){
                    case CardModule.StatusEffect.buffData.precure_protection.value:
                        allowSecondBattle = true;
                        removePrecure = false;
                        break;
                }

                var txtStatusEffectHit = "";//for the end status embed results
                var enemySpawnLink = GlobalFunctions.discordMessageLinkFormat(guildId,interaction.channel.id,guildSpawnData[DBM_Card_Guild.columns.id_last_message_spawn]);

                //process the battle:
                if(bossAlive && !specialActivatedIndividual){
                    //check for buff & debuff:
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
                        var valueSkillEffects = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.value];
                        var attempts = currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts];
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
                                // currentStatusEffectSkills[CardModule.StatusEffect.propertiesStatusEffect.attempts]-=1;
                                await CardModule.StatusEffect.updateCureSkillsStatusEffect(userId,currentStatusEffectSkills,true);
                            }
                        }

                        //prevents from getting negative
                        hp<=0?0:hp;
                        atk<=0?0:atk;
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

                    //process enemy type
                    switch(enemyType){
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.term:
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
                            var txtHeaderActions = ""; var txtDescriptionActions = "";
                            if(chance>=100){
                                var actions = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions];
                                var parsedColorLives = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives];
    
                                if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.value in actions){
                                    //check for color absorb actions
                                    if(cardData[DBM_Card_Data.columns.color]==jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][CardModule.Properties.spawnData.battle.color_absorb]){
                                        parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                        if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                        txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.name;
                                        txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.description;
                                        txtDescriptionActions = `${txtDescriptionActions.replace("<xcolor>",cardData[DBM_Card_Data.columns.color])}. `;
                                        txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                        hitted = false;
                                    } else {
                                        hitted = true;
                                    }
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.value in actions){
                                    //atk debuff
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.buttascream.description;

                                    if(!partyBlock&&!debuffProtection){
                                        var randDebuff = [
                                            CardModule.StatusEffect.debuffData.atk_down_1.value,
                                            CardModule.StatusEffect.debuffData.atk_down_2.value,
                                            CardModule.StatusEffect.debuffData.atk_down_3.value,
                                            CardModule.StatusEffect.debuffData.atk_down_4.value,
                                        ];
                                        randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                        await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    } else if(partyBlock) {
                                        hitted = true;
                                    }
                                    
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.value in actions){
                                    //hp debuff
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.big_punch.description;

                                    if(!partyBlock&&!debuffProtection){
                                        var randDebuff = [
                                            CardModule.StatusEffect.debuffData.hp_down_1.value,
                                            CardModule.StatusEffect.debuffData.hp_down_2.value,
                                            CardModule.StatusEffect.debuffData.hp_down_3.value,
                                            CardModule.StatusEffect.debuffData.hp_down_4.value,
                                        ];
                                        randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                        await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    } else if(partyBlock) {
                                        hitted = true;
                                    }
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.value in actions){
                                    //charge up
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.charge_up.description;

                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+=1;
                                    
                                    if(partyBlock){
                                        hitted = false;
                                    } else {
                                        hitted = true;
                                    }
                                    
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.value in actions){
                                    //do nothing
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.daydreaming.description;
                                    if(partyBlock){
                                        hitted = false;
                                    } else {
                                        hitted = true;
                                    }
                                } else {
                                    hitted = true;
                                }
                                
    
                                var minChance = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level];
                                if(hp<minChance){
                                    chance = GlobalFunctions.randomNumber(hp,100);
                                } else {
                                    chance = 100;
                                }
                                
                                // minChance = 0;//for debugging purpose
                                //process damage
                                if(chance>=minChance&&hitted){
                                    var parsedColorLivesDown = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives_down];
    
                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]-=atk;
                                    if(specialActivatedIndividual){
                                        parsedColorLives[cardData[DBM_Card_Data.columns.color]]-=9999;
                                    }
                                    
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
                                }
                            }
    
                            //check for color lives
                            var colorLivesLeft = 0;
                            for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]>0){
                                    colorLivesLeft++;
                                }
                            }

                            if(colorLivesLeft<=0){ bossAlive = false; }
                            
                            //announce actions embed
                            if(bossAlive){
                                if(txtHeaderActions!=""){
                                    if(!hitted&&partyBlock){
                                        arrEmbedsSend.push(CardModule.Embeds.battleEnemyActions(enemyType,`Counter Fail!`,`**${txtHeaderActions}** cannot be countered/blocked!`,enemySpawnLink));
                                    } else if(hitted&partyBlock) {
                                        arrEmbedsSend.push(CardModule.Embeds.battleEnemyActionsBlock(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],userUsername,userAvatarUrl,`Actions Blocked: ${txtHeaderActions}!`,`${userUsername} has successfully blocked: **${txtHeaderActions}** & counter the attacks!`));
                                    } else {
                                        arrEmbedsSend.push(CardModule.Embeds.battleEnemyActions(enemyType,txtHeaderActions,txtDescriptionActions,enemySpawnLink));
                                    }
                                }
                            }
    
                            //update the turn
                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+=1;
                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]){
                                //prevent turn>max turn
                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn] = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max];
                            }
                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]&&bossAlive){
                                //special attack: wipe out party
                                teamBattleTurnOut = true;
                                var txtDescription = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.description;
                                arrEmbedsSend.push(CardModule.Embeds.battleEnemyActions(enemyType,TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.name,TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam.description));
    
                                var parsedDataUser = partyData.data_user;
                                for (var key in parsedDataUser) {
                                    var parameterSet = new Map();
                                    parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                                    var parameterWhere = new Map();
                                    parameterWhere.set(DBM_Card_User_Data.columns.id_user,key);
                                    await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                                }
                            } else if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]&&bossAlive) {
                                //reset the actions
                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions] = {};
    
                                //randomize the attack
                                var randomActions = null;
                                if(colorLivesLeft>1){
                                    randomActions = GlobalFunctions.randomProperty(TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions);
                                } else {
                                    randomActions = GlobalFunctions.randomProperty(TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions_last_lives);
                                }
    
                                // randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb;//for debugging
    
                                if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+1>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]){
                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.special_attack.buttagislam;
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][randomActions.value] = "";
                                    txtActionsEmbed = randomActions.name;
                                } else {
                                    if(randomActions.value==TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.actions.color_absorb.value){
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

                                arrEmbedsSend.push(CardModule.Embeds.battleEnemyActionsPrepare(enemyType,randomActions.name,txtActionsEmbed));
                            }
                            
                            break;
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                            if(cardData[DBM_Card_Data.columns.series].toLowerCase()==enemyData[DBM_Card_Enemies.columns.series].toLowerCase()&&
                            rarity>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.rarity]&&
                            cardData[DBM_Card_Data.columns.color] in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                //check for series & rarity buff
                                chance=100;
                            } else {
                                chance = 0;
                            }

                            var txtHeaderActions = ""; var txtDescriptionActions = "";
                            var turnMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics];
                            var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics];

                            if(chance>=100){
                                var actions = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions];
                                var parsedColorLives = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives];
                                var priorityBlock = false;

                                //for slomwmo actions grouping - check for priority block:
                                if(((turnMechanics==4&&actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_punch]==2)||
                                turnMechanics==5&&actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_punch]==3)){
                                    priorityBlock = true;
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarpunch.name;
                                } else if((turnMechanics==10&&actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick]==2)||
                                (turnMechanics==11&&actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick]==3)||
                                (turnMechanics==12&&actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick]==4)){
                                    priorityBlock = true;
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarkick.name;
                                }

                                //check for turn mechanics
                                if(priorityBlock&&!partyBlock){
                                    //check for slomo barbarpunch
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarpunch.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarpunch.description;

                                    //add debuff
                                    var randDebuff = [
                                        CardModule.StatusEffect.debuffData.hp_down_1.value,
                                        CardModule.StatusEffect.debuffData.hp_down_2.value,
                                        CardModule.StatusEffect.debuffData.hp_down_3.value,
                                        CardModule.StatusEffect.debuffData.hp_down_4.value,
                                    ];
                                    randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                    await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    hitted = false;
                                } else if(priorityBlock&&!partyBlock){
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarkick.name;
                                    txtDescriptionActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.barbarkick.description;

                                    //add debuff
                                    var randDebuff = [
                                        CardModule.StatusEffect.debuffData.hp_down_1.value,
                                        CardModule.StatusEffect.debuffData.hp_down_2.value,
                                        CardModule.StatusEffect.debuffData.hp_down_3.value,
                                        CardModule.StatusEffect.debuffData.hp_down_4.value,
                                    ];
                                    randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                    await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    hitted = false;
                                } else if(priorityBlock&&partyBlock){
                                    hitted = true;
                                } else if((TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_force.value in actions||TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_force.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sunlight_force.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moonlight_force.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.slowmo_punch_2.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.slowmo_punch_3.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.slowmo_kick_2.value in actions||TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.slowmo_kick_3.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.slowmo_kick_4.value in actions||
                                TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.forcepposite.value in actions)&&!priorityBlock){
                                    //any attacks that cannot be blocked
                                    if(partyBlock){
                                        hitted = false;
                                    } else {
                                        //check for forcepposite:
                                        if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.forcepposite.value in actions){
                                            //swap the sun/moon force color
                                            var tempSunForce = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force];
                                            
                                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force] = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force];

                                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force] = tempSunForce;
                                        }

                                        hitted = true;
                                    }
                                } else if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.value in actions&&
                                actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.white_force].includes(cardData[DBM_Card_Data.columns.color])&&!partyBlock){
                                    //check for white beam color force actions
                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                    if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.name;
                                    txtDescriptionActions += `${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.description}\n`;
                                    txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                    hitted = false;

                                    //add debuff
                                    var randDebuff = [
                                        CardModule.StatusEffect.debuffData.hp_down_1.value,
                                        CardModule.StatusEffect.debuffData.hp_down_2.value,
                                        CardModule.StatusEffect.debuffData.hp_down_3.value,
                                        CardModule.StatusEffect.debuffData.hp_down_4.value,
                                    ];
                                    randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                    await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    hitted = false;
                                } else if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_beam.value in actions&&
                                actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.black_force].includes(cardData[DBM_Card_Data.columns.color])&&
                                !partyBlock){
                                    //check for black beam color force actions
                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                    if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_beam.name;
                                    txtDescriptionActions += `${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.description}\n`;
                                    txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                    hitted = false;

                                    //add debuff
                                    var randDebuff = [
                                        CardModule.StatusEffect.debuffData.hp_down_1.value,
                                        CardModule.StatusEffect.debuffData.hp_down_2.value,
                                        CardModule.StatusEffect.debuffData.hp_down_3.value,
                                        CardModule.StatusEffect.debuffData.hp_down_4.value,
                                    ];
                                    randDebuff = randDebuff[GlobalFunctions.randomNumber(0,randDebuff.length-1)];
                                    await CardModule.StatusEffect.updateStatusEffect(userId,randDebuff);
                                    hitted = false;
                                } else if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam.value in   actions&&
                                actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force].includes(cardData[DBM_Card_Data.columns.color])&&
                                !partyBlock){
                                    //check for sun beam color force actions
                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                    if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam.name;
                                    txtDescriptionActions += `${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam.description}\n`;
                                    txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                    hitted = false;
                                } else if(TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam.value in actions&&
                                actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force].includes(cardData[DBM_Card_Data.columns.color])&&
                                !partyBlock){
                                    //check for moon beam color force actions
                                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]+=atk;
                                    if(parsedColorLives[cardData[DBM_Card_Data.columns.color]]>=hpMaxEnemy){ parsedColorLives[cardData[DBM_Card_Data.columns.color]] = hpMaxEnemy;}

                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam.name;
                                    txtDescriptionActions += `${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam.description}\n`;
                                    txtDescriptionActions += `Absorbed **${atk} ${cardData[DBM_Card_Data.columns.color]}** atk!`;
                                    hitted = false;
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.value in actions&&
                                !(actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.white_force].includes(cardData[DBM_Card_Data.columns.color]))&&partyBlock&&!priorityBlock){
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam.name;
                                    hitted = false;
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_beam.value in actions&&
                                !(actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.black_force].includes(cardData[DBM_Card_Data.columns.color]))&&partyBlock&&!priorityBlock){
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_beam.name;
                                    hitted = false;
                                } else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam.value in   actions&&
                                !(actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force].includes(cardData[DBM_Card_Data.columns.color]))&&partyBlock&&!priorityBlock) {
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam.name;
                                    hitted = false;
                                } 
                                else if (TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam.value in actions&&
                                !(actionsMechanics[TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force].includes(cardData[DBM_Card_Data.columns.color]))&&partyBlock&&!priorityBlock) {
                                    txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam.name;
                                    hitted = false;
                                } 
                                else {
                                    hitted = true;
                                }

                                if(txtHeaderActions==""){
                                    //get default actions:
                                    for (var key in actions){
                                        txtHeaderActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions[key].name;
                                        txtDescriptionActions += `${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions[key].description}`;
                                    }
                                }
                                

                                var minChance = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.level];
                                if(hp<minChance){
                                    chance = GlobalFunctions.randomNumber(hp,100);
                                } else {
                                    chance = 100;
                                }
                                
                                // minChance = 0;//for debugging purpose
                                //process damage
                                if(chance>=minChance&&hitted){
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
                                }
                            }

                            //check for color lives
                            var colorLivesLeft = 0;
                            for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                                if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]>=1){
                                    bossAlive = true; colorLivesLeft++;
                                }
                            }

                            //announce actions embed
                            if(bossAlive){
                                if(txtHeaderActions!=""){
                                    if(!hitted&&partyBlock){
                                        arrEmbedsSend.push(
                                            CardModule.Embeds.battleEnemyActions(enemyType,`Counter Fail!`,`**${txtHeaderActions}** cannot be countered/blocked!`,enemySpawnLink)
                                        );
                                    } else if(hitted&partyBlock) {
                                        arrEmbedsSend.push(
                                            CardModule.Embeds.battleEnemyActionsBlock(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],userUsername,userAvatarUrl,`Actions Blocked: ${txtHeaderActions}!`,`${userUsername} has successfully blocked: **${txtHeaderActions}** & counter the attacks!`)
                                        );
                                        jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics]+=1;
                                    } else {
                                        arrEmbedsSend.push(
                                            CardModule.Embeds.battleEnemyActions(enemyType,txtHeaderActions,txtDescriptionActions,enemySpawnLink)
                                        );
                                        
                                        if(hitted){
                                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics]+=1;
                                        }
                                    }
                                } else {
                                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics]+=1;
                                }
                            }

                            //update the turn
                            // if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]<=1){
                                //auto add 1 turn for very first turn
                                // jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics]+=1;
                            // }

                            jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]+=1;

                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]){
                                //prevent turn>max turn
                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn] = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max];
                            }
                            if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]>=jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]&&bossAlive){
                                //special attack: wipe out party
                                teamBattleTurnOut = true;
                                arrEmbedsSend.push(
                                    CardModule.Embeds.battleEnemyActions(enemyType,TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.special_attack.rampage.name,TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.special_attack.rampage.description)
                                )

                                var parsedDataUser = partyData.data_user;
                                for (var key in parsedDataUser) {
                                    var parameterSet = new Map();
                                    parameterSet.set(DBM_Card_User_Data.columns.card_id_selected,null);
                                    var parameterWhere = new Map();
                                    parameterWhere.set(DBM_Card_User_Data.columns.id_user,key);
                                    await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                                }
                            } else if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]<jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]&&bossAlive) {
                                //reset the actions
                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions] = {};

                                //randomize the attack
                                var nextActions = null;
                                var randomActions = null;

                                var turnMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_mechanics];
                                if(turnMechanics<=2){
                                    //slowmo punch
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_punch];//get the slowmo punch turns

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions[`${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_punch}_${actionsMechanics}`];
                                } else if(turnMechanics<=3){
                                    //white force
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.white_force];//get white force color

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_force;
                                    //replace xcolor:
                                    randomActions.name = randomActions.name.replace("<xcolor>",actionsMechanics);
                                    randomActions.description = randomActions.description.replace("<xcolor>",actionsMechanics);
                                } else if(turnMechanics<=4){
                                    //black force
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.black_force];//get black force color

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_force;
                                    //replace xcolor:
                                    randomActions.name = randomActions.name.replace("<xcolor>",actionsMechanics);
                                    randomActions.description = randomActions.description.replace("<xcolor>",actionsMechanics);
                                } else if(turnMechanics<=7) {
                                    //white beam/black beam
                                    var rndBeam = GlobalFunctions.randomNumber(0,1);
                                    if(rndBeam==0){
                                        //white beam
                                        randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.white_beam;
                                    } else {
                                        randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.black_beam;
                                    }
                                } else if(turnMechanics<=8){
                                    //slowmo kick
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick];//get the slowmo kick turns

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions[`${TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.slowmo_kick}_${actionsMechanics}`];
                                } else if(turnMechanics<=9){
                                    //sunlight force
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.sunlight_force];//get sunlight force color

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sunlight_force;
                                    //replace xcolor:
                                    randomActions.name = randomActions.name.replace("<xcolor>",actionsMechanics);
                                    randomActions.description = randomActions.description.replace("<xcolor>",actionsMechanics);

                                } else if(turnMechanics<=10){
                                    //moonlight force
                                    var actionsMechanics = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions_mechanics][TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions_mechanics.moonlight_force];//get moonlight force color

                                    randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moonlight_force;
                                    //replace xcolor:
                                    randomActions.name = randomActions.name.replace("<xcolor>",actionsMechanics);
                                    randomActions.description = randomActions.description.replace("<xcolor>",actionsMechanics);
                                } else {
                                    //turn >=11: sun beam/moon beam/forcepossite
                                    var rndMechanics = GlobalFunctions.randomNumber(0,3);
                                    switch(rndMechanics){
                                        case 0:
                                            //sun beam
                                            randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.sun_beam;
                                            break;
                                        case 1:
                                            //moon beam
                                            randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.moon_beam;
                                            break;
                                        case 2:
                                        case 3:
                                            //forcepposite
                                            randomActions = TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.actions.forcepposite;
                                            break;
                                    }
                                }

                                jsonParsedSpawnData[CardModule.Properties.spawnData.battle.actions][`${randomActions.value}`] = "";
                                txtActionsEmbed = `${randomActions.name}`;

                                arrEmbedsSend.push(CardModule.Embeds.battleEnemyActionsPrepare(enemyType,randomActions.name,txtActionsEmbed));
                            }

                            //update embeds
                            // if(bossAlive){
                            //     var editedEmbed = new MessageEmbed(messageSpawn.embeds[0]);
                            //     var txtHpEmbed = editedEmbed.fields[0].value.split("\n");
                            //     var newtxtHpEmbed = "";
                            //     var ctr = 0;
                            //     for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                            //         var splittedHp = txtHpEmbed[ctr].split("/");
                            //         splittedHp = splittedHp[0].split(": ");
                            //         newtxtHpEmbed+=`${splittedHp[0]}: ${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]}/${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.hp_max]}\n`;
                            //         ctr++;
                            //     }
                            //     newtxtHpEmbed = newtxtHpEmbed.replace("/\n$/","");

                            //     editedEmbed.fields[0].value = `${newtxtHpEmbed}`;
                            //     editedEmbed.fields[2].value = `${txtActionsEmbed}`;
                            //     editedEmbed.fields[3].value = `${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn]}/${jsonParsedSpawnData[CardModule.Properties.spawnData.battle.turn_max]}`;
                            //     messageSpawn.embeds = [editedEmbed];
                            // }//
                            break;
                    }
                } else if(specialActivatedIndividual){

                    var parsedColorLivesDown = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives_down];
                    var parsedColorLives = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives];
                    parsedColorLives[cardData[DBM_Card_Data.columns.color]]=0;

                    //check for color taken down
                    if(!parsedColorLivesDown.includes(cardData[DBM_Card_Data.columns.color])){
                        livesDown = true;
                        parsedColorLivesDown.push(cardData[DBM_Card_Data.columns.color]);
                    }
                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives] = parsedColorLives;
                    jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives_down] = parsedColorLivesDown;

                    //check for individual special:
                    var colorLivesLeft = 0;
                    for (var key in jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives]){
                        if(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.color_lives][key]>0){
                            colorLivesLeft++;
                        }
                    }

                    txtActionsEmbed = "-";

                    if(colorLivesLeft<=0){ bossAlive = false; }
                }

                //update the embeds:
                if(bossAlive){
                    switch(enemyType){
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.buttagiru.term:
                        case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                            var editedEmbed = new MessageEmbed(messageSpawn.embeds[0]);
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
                            messageSpawn.embeds = [editedEmbed];
                            break;
                    }
                }

                //end enemy process

                //battle results:
                //by default: buttagiru
                var objQtyRewards = {
                    fragment:1,
                    card:2
                };

                switch(enemyType){
                    case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                        objQtyRewards = {
                            fragment:3,
                            card:3
                        }
                        break
                }

                //team battle
                if(bossAlive&&hitted&&!teamBattleTurnOut&&(!specialActivated||specialActivatedIndividual)){
                    var dataUser = partyData.data_user;
                    //color points
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 13;
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 15;
                            break;
                        case 1: case 2: default:
                            pointReward = 10;
                            break;
                    }

                    var queryIdUser= "";
                    var splittedUserId = [];
                    for(var key in dataUser){
                        queryIdUser+=`"${key}",`;
                        splittedUserId.push(key);
                    }
                    queryIdUser = queryIdUser.replace(/,\s*$/, "");//remove last comma

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
                            await ItemModule.addNewItemInventory(splittedUserId[i],fragmentDropData[DBM_Item_Data.columns.id],objQtyRewards.fragment);
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
                    specialCharged = await CardModule.Party.updatePartySpecialPoint(partyData.partyData[DBM_Card_Party.columns.id],pointSpecial);
                    rewardsReceived+=`>**${pointSpecial}**% party special points\n`;

                    try{
                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                        if(specialActivatedIndividual){
                            await interaction.channel.send({
                                embeds:[CardModule.Embeds.teamBattleSpecialActivatedHitOne(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.pack],rewardsReceived)]
                            });
                        } else if(livesDown){
                            await interaction.channel.send({
                                embeds:[CardModule.Embeds.teamBattleLivesDown(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],`${partyData.partyData[DBM_Card_Party.columns.name]} - ${userUsername}`,userAvatarUrl,rewardsReceived)]
                            });
                        } else {
                            arrEmbedsSend.push(CardModule.Embeds.teamBattleHit(cardData[DBM_Card_Data.columns.color],cardData[DBM_Card_Data.columns.pack],`${partyData.partyData[DBM_Card_Party.columns.name]} - ${userUsername}`,userAvatarUrl,`**${userUsername}** has dealt **${atk} ${cardData[DBM_Card_Data.columns.color]}** damage!`,txtStatusEffectHit,rewardsReceived,enemySpawnLink));

                            var messageHit = await interaction.channel.send({embeds:arrEmbedsSend});
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
                } else if(arrEmbedsSend.length>0){
                    try{
                        var messageHit = await interaction.channel.send({embeds:arrEmbedsSend});
                        setTimeout(function(){
                            messageHit.delete();
                        }, 6000);
                    } catch(error){}
                }

                if(!bossAlive||specialActivated){
                    //team battle win
                    //randomize card fragment
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 80;
                            switch(enemyType){
                                case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                                    pointReward = 100;
                                    break
                            }
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 90;
                            switch(enemyType){
                                case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                                    pointReward = 120;
                                    break
                            }
                            break;
                        case 1: case 2:
                        default:
                            pointReward = 70;
                            switch(enemyType){
                                case TsunagarusModules.Properties.enemySpawnData.tsunagarus.barabaran.term:
                                    pointReward = 150;
                                    break
                            }
                            break;
                    }

                    var query = `SELECT *  
                    FROM ${DBM_Item_Data.TABLENAME}  
                    WHERE ${DBM_Item_Data.columns.category}=?  
                    ORDER BY RAND() 
                    LIMIT 1`;
                    var dropData = await DBConn.conn.promise().query(query,["misc_fragment"]);

                    //fragment drop
                    var fragmentDropData = dropData[0][0];
                    rewardsReceived+=`>**${objQtyRewards.fragment}x Fragment:** ${fragmentDropData[DBM_Item_Data.columns.name]} **(${fragmentDropData[DBM_Item_Data.columns.id]})**\n`;

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
                        specialCharged = await CardModule.Party.updatePartySpecialPoint(partyData.partyData[DBM_Card_Party.columns.id],pointSpecial);
                        rewardsReceived+=`>**${pointSpecial}**% party special points\n`;
                    }

                    var paramIdUser = []; var queryIdUser= "";

                    //add rewards to leader
                    await ItemModule.addNewItemInventory(partyData.partyData[DBM_Card_Party.columns.id_user],fragmentDropData[DBM_Item_Data.columns.id],objQtyRewards.fragment);

                    paramIdUser.push(partyData.partyData[DBM_Card_Party.columns.id_user]);
                    queryIdUser+="?,";

                    var splittedUserId = partyData.partyData[DBM_Card_Party.columns.party_data].split(",");
                    for(var i=0;i<splittedUserId.length;i++){
                        //add rewards to all members
                        await ItemModule.addNewItemInventory(splittedUserId[i],fragmentDropData[DBM_Item_Data.columns.id],objQtyRewards.fragment);

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
                    rewardsReceived+=`>${objQtyRewards.card}x Card: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**`;

                    //adds up the card to leader
                    var userCardRewardStock = await CardModule.getUserCardStock(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card]);
                    if(userCardRewardStock<=-1){
                        await CardModule.addNewCardInventory(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card],false,objQtyRewards.card);
                    } else if(userCardRewardStock<CardModule.Properties.maximumCard){
                        await CardModule.addNewCardInventory(partyData.partyData[DBM_Card_Party.columns.id_user],cardDataReward[DBM_Card_Data.columns.id_card],true,objQtyRewards.card);
                    }

                    //check leader card pack completion:
                    var arrCompletion = [];
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"color",cardDataReward[DBM_Card_Data.columns.color]);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],"series",cardDataReward[DBM_Card_Data.columns.series]);

                    if(checkCardCompletionPack){
                        //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null){
                            arrCompletion.push(embedCompletion);
                        }
                    }
                    
                    if(checkCardCompletionColor) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                        if(embedCompletion!=null){
                            arrCompletion.push(embedCompletion);
                        }
                    }

                    if(checkCardCompletionSeries) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,partyData.partyData[DBM_Card_Party.columns.id_user],userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                        if(embedCompletion!=null){
                            arrCompletion.push(embedCompletion);
                        }
                    }

                    if(arrCompletion.length>0){
                        await interaction.channel.send({embeds:arrCompletion});
                    }

                    //adds up card to all members
                    var splittedUserId = partyData.partyData[DBM_Card_Party.columns.party_data].split(",").length==1 ? 
                    []:partyData.partyData[DBM_Card_Party.columns.party_data].split(",");
                    for(var i=0;i<splittedUserId.length;i++){
                        var userCardRewardStock = await CardModule.getUserCardStock(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card]);
                        if(userCardRewardStock<=-1){
                            await CardModule.addNewCardInventory(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card],false,objQtyRewards.card);
                        } else if(userCardRewardStock<CardModule.Properties.maximumCard){
                            await CardModule.addNewCardInventory(splittedUserId[i],cardDataReward[DBM_Card_Data.columns.id_card],true,objQtyRewards.card);
                        }

                        //check all member card completion:
                        var arrCompletion = [];
                        var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                        var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"color",cardDataReward[DBM_Card_Data.columns.color]);
                        var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,splittedUserId[i],"series",cardDataReward[DBM_Card_Data.columns.series]);

                        if(checkCardCompletionPack){
                            //card pack completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"pack",cardDataReward[DBM_Card_Data.columns.pack]);
                            if(embedCompletion!=null){
                                arrCompletion.push(embedCompletion);
                            }
                        }

                        if(checkCardCompletionColor) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.dataColorCore[cardDataReward[DBM_Card_Data.columns.color]].color,"color",cardDataReward[DBM_Card_Data.columns.color]);
                            if(embedCompletion!=null){
                                arrCompletion.push(embedCompletion);
                            }
                        }

                        if(checkCardCompletionSeries) {
                            //color set completion
                            embedCompletion = await CardModule.leaderboardAddNew(guildId,splittedUserId[i],userAvatarUrl,CardModule.Properties.embedColor,"series",cardDataReward[DBM_Card_Data.columns.series]);
                            if(embedCompletion!=null){
                                arrCompletion.push(embedCompletion);
                            }
                        }

                        if(arrCompletion.length>0){
                            await interaction.channel.send({embeds:arrCompletion});
                        }

                    }

                    if(specialActivated){
                        arrEmbedsSend.push(CardModule.Embeds.teamBattleSpecialActivated(cardData[DBM_Card_Data.columns.color],userUsername,userAvatarUrl,cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.pack],partyData.partyData[DBM_Card_Party.columns.name],rewardsReceived));
                    } else {
                        arrEmbedsSend.push(CardModule.Embeds.teamBattleWin(cardData[DBM_Card_Data.columns.pack],cardData[DBM_Card_Data.columns.series],partyData.partyData[DBM_Card_Party.columns.name],rewardsReceived));
                    }

                    await interaction.editReply({embeds:arrEmbedsSend,components:[]});

                    //erase the spawn data
                    await CardModule.removeCardGuildSpawn(guildId);
                    await CardModule.limitizeUserPoints();

                } else if((bossAlive&&!hitted)||teamBattleTurnOut) {
                    //team battle defeated
                    switch(cardData[DBM_Card_Data.columns.rarity]){
                        case 3: case 4:
                            pointReward = 7;
                            break;
                        case 5: case 6: case 7: case 8:
                            pointReward = 10;
                            break;
                        case 1: case 2: default:
                            pointReward = 5;
                            break;
                    }

                    //update the catch token & color points
                    var objColor = new Map();
                    objColor.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);

                    var txtDescription = "";
                    objEmbed.title = "Defeated";
                    if(removePrecure){
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgFailed
                        }
                        txtDescription = `:x: Oh no! <@${userId}> has lost from the battle and lost the precure avatar power!\n`;
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
                        txtDescription = `:x: Oh no! <@${userId}> has lost from the battle!\n`;
                    }

                    //check for buff
                    switch(currentStatusEffect){
                        case CardModule.StatusEffect.buffData.precure_protection.value:
                            allowSecondBattle = true;
                            removePrecure = false;
                            txtDescription+=`${CardModule.StatusEffect.statusEffectBattleHitResults(currentStatusEffect,"buff")}`;
                            break;
                    }

                    //activate the debuff if user doesn't have debuff protection
                    var debuff_data = "";
                    if(!debuffProtection&&randomDebuff!=null){
                        await CardModule.StatusEffect.updateStatusEffect(userId,randomDebuff.value);
                        // var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,randomDebuff.value,"debuff");
                        debuff_data = randomDebuff.value;
                    }

                    await interaction.channel.send({embeds:[CardModule.Embeds.battleLost(userUsername,userAvatarUrl,txtDescription,`>**${pointReward} ${cardData[DBM_Card_Data.columns.color]}** color points.`,debuff_data,enemySpawnLink)]});

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
                        await interaction.editReply({embeds:[new MessageEmbed({
                            color: CardModule.Properties.embedColor,
                            author: {
                                name:userUsername,
                                iconURL:userAvatarUrl
                            },
                            title:"Defeated!",
                            description:`${enemyType} has escaped from the battle`,
                            thumbnail:{
                                url:CardModule.Properties.imgResponse.imgFailed
                            }})],
                            components:[]
                        });
                        
                        await CardModule.removeCardGuildSpawn(guildId);
                    } else {
                        await interaction.editReply({embeds:messageSpawn.embeds,components:messageSpawn.components});
                        //update the spawn data
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.spawn_data,JSON.stringify(jsonParsedSpawnData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
                    }

                    await CardModule.limitizeUserPoints();
                }

                break;
        }
    },
    async executeComponentButton(interaction){
        var customId = interaction.customId;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                iconURL:userAvatarUrl,
                name:userUsername
            }
        };

        var arrEmbedsSend = [];

        switch(customId){
            case "catch_normal":
            case "catch_color":
            case "catch_series":
                await interaction.deferReply();
                
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

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
                    arrEmbedsSend.push(embedStatusEffectActivated);
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||spawnedCardData.token==null||
                (spawnedCardData.type=="normal"&&spawnedCardData.id==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: There are no precure cards spawning right now. Please wait until the next card spawn.";
                    return await interaction.editReply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You already used the capture attempt. Please wait until the next card spawn.";
                    return await interaction.editReply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                }

                //reward & validator
                switch(spawnedCardData.type){
                    case "quiz":
                    case "number":
                    case "battle":
                        //check if card spawn is quiz
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: You can't capture this card.";
                        return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
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

                            arrEmbedsSend.push(embedStatusActivated);
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

                            arrEmbedsSend.push(embedStatusActivated);
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

                        arrEmbedsSend.push(embedStatusActivated);

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
                        if(rngCatch+bonusCatch+10>=chance) captured = true;
                        break;
                    default://normal card spawn
                        if(rngCatch+bonusCatch>=chance) captured = true;
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
                    if(spawnedCardData.color==userData.color) pointReward*=2;
                    if(spawnedCardData.series==userData.series) seriesReward*=2;

                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    var objSeries = new Map();
                    objSeries.set(seriesId,seriesReward);

                    //insert new card
                    if(itemStock<=-1){//non duplicate
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);

                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)
                        );

                        duplicate = false;
                    } else {//duplicate
                        if(itemStock<CardModule.Properties.maximumCard){//add new stock card
                            var cardQty = 1;
                            if(spawnedCardData.color==userData.color&&spawnedCardData.series==userData.series){
                                cardQty = 2;
                            }

                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true);

                            arrEmbedsSend.push(
                                CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesReward,cardQty)
                            );

                            itemStock+=1;
                        } else {
                            //cannot add more card
                            arrEmbedsSend.push(
                                CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,spawnedCardData.id,cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)
                            );
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
                                spawnedCardData.data==null ? await CardModule.removeCardGuildSpawn(guildId) : await CardModule.removeCardGuildSpawn(guildId,false,true,false)
                                break;
                        }

                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCapture(cardSpawnData[DBM_Card_Data.columns.color],cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_atk],itemStock)
                        );
                    }

                    await interaction.editReply({embeds:arrEmbedsSend});
                    
                    //check card pack completion:
                    var embedCompletion = null; var arrCompletion = [];
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                    if(checkCardCompletionPack){
                        //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null) arrCompletion.push(embedCompletion);
                    }

                    if(checkCardCompletionSeries) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                        if(embedCompletion!=null) arrCompletion.push(embedCompletion);
                    }
                    
                    if(checkCardCompletionColor) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                        if(embedCompletion!=null) arrCompletion.push(embedCompletion);
                    }

                    if(arrCompletion.length>0){
                        return interaction.channel.send({embeds:arrCompletion});
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
                            name:`Consolidation Rewards:`,
                            value:`>${pointReward} ${cardSpawnData[DBM_Card_Data.columns.color]} points\n>${pointReward} ${seriesCurrency}`,
                            inline:true
                        }
                    ];

                    await interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});

                    //get status effect
                    switch(currentStatusEffect){
                        case CardModule.StatusEffect.buffData.second_chance.value:
                            //check if second chance/not
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await interaction.channel.send({embeds:[embedStatusActivated]});
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
            case "guess_number":
                await interaction.deferReply();
                var guess = interaction.value;

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

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
                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type!=null&&spawnedCardData.type != "number"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You can't capture this card.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                } else if(spawnedCardData.type==null|| spawnedCardData.token==null||
                    (spawnedCardData.id==null&&spawnedCardData.color==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: There are no Precure cards spawning now. Please wait until the next card spawn.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You already used the guess command. Please wait until the next card spawn.";
                    return interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});
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

                        arrEmbedsSend.push(embedStatusActivated);
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
                    return interaction.channel.send({embeds:[new MessageEmbed(objEmbed)]});
                } else {
                    switch(guess.toLowerCase()){
                        case "lower":
                            if(nextNumber<currentNumber) success = true;
                            break;
                        case "higher":
                            if(nextNumber>currentNumber) success = true;
                            break;
                    }
                }
                
                if(success){
                    var pointReward = cardSpawnData[DBM_Card_Data.columns.rarity];
                    var seriesReward = pointReward;

                    if(userData.color==spawnedCardData.color) pointReward*=2;
                    if(userData.series==spawnedCardData.series) seriesReward*=2;
                    
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    var objSeries = new Map();
                    objSeries.set(seriesId,seriesReward);

                    //if success
                    var cardStock = await CardModule.getUserCardStock(userId,spawnedCardData.id);
                    var duplicate = true;

                    if(cardStock<=-1){//card is not duplicate
                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);

                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCaptureNew(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward)
                        );

                        duplicate = false;
                    } else { //duplicate
                        var cardQty = 1;
                        if(userData.color==spawnedCardData.color && userData.series==spawnedCardData.series) cardQty=2;

                        if(cardStock<CardModule.Properties.maximumCard){//add new stock card
                            await CardModule.addNewCardInventory(userId,spawnedCardData.id,true,cardQty);

                            arrEmbedsSend.push(CardModule.Embeds.embedCardCaptureDuplicate(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,cardSpawnData[DBM_Card_Data.columns.img_url],userAvatarUrl,userUsername,seriesReward,cardQty));

                            cardStock=cardStock+1;
                        } else {
                            //cannot add more card
                            arrEmbedsSend.push(CardModule.Embeds.embedCardCaptureDuplicateMaxCard(spawnedCardData.color,cardSpawnData[DBM_Card_Data.columns.id_card],cardSpawnData[DBM_Card_Data.columns.name],pointReward,seriesCurrency,userAvatarUrl,userUsername,seriesReward));
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

                        arrEmbedsSend.push(
                            CardModule.Embeds.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                            cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard,cardSpawnData[DBM_Card_Data.columns.max_hp],cardSpawnData[DBM_Card_Data.columns.max_atk],cardStock)
                        )
                    }

                    await interaction.editReply({embeds:arrEmbedsSend});

                    //check card pack completion:
                    var embedCompletion = null; var arrCompletion = [];
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(guildId,userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(guildId,userId,"color",spawnedCardData.color);
                    var checkCardCompletionSeries = await CardModule.checkCardCompletion(guildId,userId,"series",spawnedCardData.series);

                    if(checkCardCompletionPack){ //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                        if(embedCompletion!=null) arrCompletion.push(new MessageEmbed(embedCompletion));
                    } 
                    
                    if(checkCardCompletionColor) { //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                        if(embedCompletion!=null) arrCompletion.push(new MessageEmbed(embedCompletion));
                    }

                    if(checkCardCompletionSeries){
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.embedColor,"series",spawnedCardData.series);
                        if(embedCompletion!=null) arrCompletion.push(new MessageEmbed(embedCompletion));
                    }
                    
                } else { //guessed the wrong hidden number
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}**. Sorry, you guessed it wrong this time.`;

                    await interaction.editReply({embeds:[new MessageEmbed(objEmbed)]});

                    //get status effect
                    switch(currentStatusEffect){
                        case "second_chance":
                            //check if second chance/not
                            //erase the status effect
                            await CardModule.StatusEffect.updateStatusEffect(userId,null);
                            var embedStatusActivated = await CardModule.StatusEffect.embedStatusEffectActivated(userUsername,userAvatarUrl,currentStatusEffect);
                            await interaction.channel.send({embeds:[embedStatusActivated]});
                            break;
                        default:
                            await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                            break;
                    }

                }
                break;
        }
    }
};
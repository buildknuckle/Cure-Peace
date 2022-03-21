const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageEmbed} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');
const capitalize = GlobalFunctions.capitalize;

const paginationEmbed = require('../DiscordPagination');

const Properties = require('./Properties');
const Color = Properties.color;
const Currency = Properties.currency;
const Emoji = Properties.emoji;

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
// const DBM_User_Data = require('../../database/model/DBM_User_Data');
// const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

// const Data = require("./Data");
const User = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {UserQuest, DailyCardQuest} = require("./data/Quest");
const {AvatarFormation, PrecureAvatar} = require("./data/Avatar");

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");
const {Character } = require('./data/Character');

const CardModule = require('./card');
// const QuestModule = require('./Quest');

const Embed = require("./Embed");

class Validation extends require("./Validation") {
    
}

class EventListener {
    static async printInventory(discordUser, pack, interaction, isPrivate){
        var userId = discordUser.id;
        var arrPages = []; //prepare paging embed
        
        //validation if pack exists/not
        var cardDataInventory = await CardInventory.getDataByPack(userId, pack);
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
        var cardInfo = new CardInventory(cardDataInventory[0], cardDataInventory[0]);
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
            var card = new CardInventory(cardDataInventory[i], cardDataInventory[i]);
            let id = card.id_card; let level = card.level;
            let img = card.img_url;
            let displayName = `[${GlobalFunctions.cutText(card.name,30)}](${img})`;
            let stock = card.stock;
            let rarity = card.rarity;
            let hp = card.maxHp;
            let atk = card.atk;
            let maxSp = CardInventory.parameter.maxSp(color);

            if(card.isHaveCard()){
                txtInventory+=`**${Card.emoji.rarity(rarity)}${rarity}: ${id}** ${Color[color].emoji_card}x${stock}\n`;
                // txtInventory+=`${displayName} \n\n`;
                txtInventory+=`${displayName} **Lv.${level}**\n${CardInventory.emoji.hp} Hp: ${hp} | ${CardInventory.emoji.atk} Atk: ${atk} | ${CardInventory.emoji.sp} Max Sp: ${maxSp}\n`;
                txtInventory+=`─────────────────\n`;
            } else {
                txtInventory+=`**${Card.emoji.rarity(rarity)}${rarity}: ???**\n???\n`;
                txtInventory+=`─────────────────\n`;
            }
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.length-1)){
                let embed = 
                Embed.builder(
                    `**Normal:** ${total.normal}/${maxPack} | **Gold:** ${total.gold}/${maxPack}\n${Color[color].emoji_card}x${total.duplicate}/${maxPack*CardInventory.limit.card}\n`+
                    `\n${txtInventory}`,discordUser,{
                    color:Embed.color[color],
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
    
        var userData = new User(await User.getData(userId));
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
            var cardInventory = new CardInventory(cardDataInventory[i], cardDataInventory[i]);
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
        var setColor = userData.set_color;
        var setSeries = userData.set_series;

        var seriesData = new Series(setSeries);
    
        //prepare the embed
        var txtMainStatus = dedent(`${seriesData.emoji.mascot} **Location:** ${seriesData.location.name} @${seriesData.name}
        ${User.peacePoint.emoji} **${User.peacePoint.name}:** ${userData.peace_point}/${User.limit.peacePoint}
        ${Emoji.mofuheart} **Daily Card Quest:** ${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}

        **Currency:**
        ${Currency.mofucoin.emoji} **Mofucoin:** ${userData.Currency.mofucoin}/${User.limit.currency.mofucoin} 
        ${Currency.jewel.emoji} **Jewel:** ${userData.Currency.jewel}/${User.limit.currency.jewel}`);

        var author = Embed.builderUser.author(discordUser, `${discordUser.username} (Lvl. ${userLevel})`);
        var objEmbed = Embed.builder(txtMainStatus, author, {
            title:`Main Status:`,
            color:Embed.color[setColor],
            thumbnail:seriesData.icon,
            fields: [
                {name: dedent(`${Color.pink.emoji} ${capitalize(Color.pink.value)} Lvl. ${userData.Color.getLevel(Color.pink.value)}
                ${userData.Color.canLevelUp(Color.pink.value) ? "🆙":""} ${userData.Color.getPoint(Color.pink.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.blue.emoji} ${capitalize(Color.blue.value)} Lvl. ${userData.Color.getLevel(Color.blue.value)}
                ${userData.Color.canLevelUp(Color.blue.value) ? "🆙":""} ${userData.Color.getPoint(Color.blue.value)} Pts`),
                value: ``,inline:true},
                
                {name: dedent(`${Color.yellow.emoji} ${capitalize(Color.yellow.value)} Lvl. ${userData.Color.getLevel(Color.yellow.value)}
                ${userData.Color.canLevelUp(Color.yellow.value) ? "🆙":""} ${userData.Color.getPoint(Color.yellow.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.purple.emoji} ${capitalize(Color.purple.value)} Lvl. ${userData.Color.getLevel(Color.purple.value)}
                ${userData.Color.canLevelUp(Color.purple.value) ? "🆙":""} ${userData.Color.getPoint(Color.purple.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.red.emoji} ${capitalize(Color.red.value)} Lvl. ${userData.Color.getLevel(Color.red.value)}
                ${userData.Color.canLevelUp(Color.red.value) ? "🆙":""} ${userData.Color.getPoint(Color.red.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.green.emoji} ${capitalize(Color.green.value)} Lvl. ${userData.Color.getLevel(Color.green.value)}
                ${userData.Color.canLevelUp(Color.green.value) ? "🆙":""} ${userData.Color.getPoint(Color.green.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.white.emoji} ${capitalize(Color.white.value)} Lvl. ${userData.Color.getLevel(Color.white.value)}
                ${userData.Color.canLevelUp(Color.white.value) ? "🆙":""} ${userData.Color.getPoint(Color.white.value)} Pts`),
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
                var cardInventory = new CardInventory(obj,obj);
                
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
            if(series.value==userData.set_series){
                objEmbed.description+=`**${series.emoji.mascot} ${userData.Series.getPoint(series.value)}/${User.limit.seriesPoint} ${series.getCurrencyName()} (${series.name})**\n`;
             }else {
                objEmbed.description+=`${series.emoji.mascot} ${userData.Series.getPoint(series.value)}/${User.limit.seriesPoint} ${series.getCurrencyName()} (${series.name})\n`;
            }
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

            var cardInventory = new CardInventory(objData,objData);
            cardInventory.addKeyVal("total",cardDataInventory[i].total);
            objCardInventory[color][pack] = cardInventory; //reassign object
        }

        //print embed of normal card duplicate
        var idxColor = 0;
        for(var color in objCardInventory){
            for(var pack in objCardInventory[color]){
                var obj = objCardInventory[color][pack];
                var cardInventory = new CardInventory(obj,obj);
                
                objEmbed.fields[idxColor].value += 
                `${cardInventory.getKeyVal("emoji_completion")} ${GlobalFunctions.capitalize(cardInventory.pack)}: ${cardInventory.getKeyVal("total")}/${CardInventory.limit.card*3}\n`;
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
                var cardInventory = new CardInventory(obj, obj);
                
                objEmbed.fields[idxColor].value += 
                `${cardInventory.getKeyVal("emoji_completion")} ${GlobalFunctions.capitalize(cardInventory.pack)}: ${cardInventory.getKeyVal("total_gold")}/${cardInventory.packTotal}\n`;
            }
            idxColor++;
        }
    
        arrPages[3] = new MessageEmbed(objEmbed); //add embed to pages

        //======page 5: avatar======
        var avatarFormation = new AvatarFormation(await AvatarFormation.getData(userId));

        var arrFields = [
            {name:`**${capitalize(AvatarFormation.formation.main.name)}:**`, value:`:x: ${capitalize(AvatarFormation.formation.main.name)} precure avatar has not set yet.`},
            {name:`**${capitalize(AvatarFormation.formation.support1.name)}:**`, value:`:x: ${capitalize(AvatarFormation.formation.support1.name)} precure avatar has not set yet.`},
            {name:`**${capitalize(AvatarFormation.formation.support2.name)}:**`, value:`:x: ${capitalize(AvatarFormation.formation.support2.name)} precure avatar has not set yet.`},
        ];

        var idx = 0;
        for(var key in AvatarFormation.formation){
            var formation = AvatarFormation.formation[key];

            if(avatarFormation[formation.columns]!=null){
                var avatar = new PrecureAvatar(key, 
                    await CardInventory.getDataByIdUser(userId, avatarFormation[formation.columns]),
                    await Card.getCardData(avatarFormation[formation.columns]));
                var rarity = avatar.cardInventory.rarity;
                arrFields[idx].name = `${avatar.cardInventory.getRarityEmoji()} ${rarity} ${avatar.properties.name} Lvl. ${avatar.parameter.level} (**${capitalize(avatar.formation.name)}**)`;
                arrFields[idx].value =  `${CardInventory.emoji.hp}**Hp:** ${avatar.parameter.maxHp} ${CardInventory.emoji.atk} **Atk:** ${avatar.parameter.atk} ${CardInventory.emoji.sp}**Sp:** ${avatar.parameter.maxSp}`;

                if(formation.value=="main"){
                    var embedColor = avatar.cardInventory.color;
                    var embedThumbnail = avatar.properties.icon;
                }
            }

            idx++;
        }

        arrPages[4] = new MessageEmbed(
            Embed.builder(``,
            discordUser,
            {
                color: avatarFormation.id_main!=null? embedColor:setColor,
                title: `Precure Avatar:`,
                thumbnail: avatarFormation.id_main!=null? embedThumbnail:``,
                fields: arrFields
            })
        ); //add embed to pages

        return arrPages;
    }

    static async printDetail(objUserData, idCard, interaction, isPrivate=true){
        var userId = objUserData.id;
        //print card detail
        var arrPages = []; //prepare paging embed
        var cardData = await CardModule.getCardData(idCard);
        var cardInventoryData = await CardModule.Inventory.getData(userId, idCard);
        if(!cardData){
            return interaction.reply(Embed.notifCardDataNotFound(objUserData));
        } else if(!cardInventoryData){
            return interaction.reply(Embed.notifNotOwnCard(objUserData));
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

        arrPages.push(Embed.builder(
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
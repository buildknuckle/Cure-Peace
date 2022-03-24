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

const User = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {UserQuest, DailyCardQuest} = require("./data/Quest");
const {AvatarFormation, PrecureAvatar} = require("./data/Avatar");

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("./data/Series");

const Embed = require("./Embed");

class Validation extends require("./Validation") {
    
}

class EventListener {
    static async printStatus(discordUser){
        var userId = discordUser.id;
        //init embed
        var arrPages = []; //prepare paging embed
    
        var user = new User(await User.getData(userId));
        var userLevel = user.getAverageColorLevel();//average color level
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

        var query = `select cd.${Card.columns.pack}, count(inv.${CardInventory.columns.id_user}) as total, 
        cd.${Card.columns.color}, cd.${Card.columns.series} 
        from ${Card.tablename} cd 
        left join ${CardInventory.tablename} inv 
        on cd.${Card.columns.id_card}=inv.${CardInventory.columns.id_card} and 
        inv.${CardInventory.columns.id_user}=? 
        group by cd.${Card.columns.pack}`;
        
        var queryGold = `select cd.${Card.columns.pack}, count(inv.${CardInventory.columns.id_user}) as total_gold, cd.${Card.columns.color}, cd.${Card.columns.series} 
        from ${Card.tablename} cd
        left join ${CardInventory.tablename} inv 
        on cd.${Card.columns.id_card}=inv.${CardInventory.columns.id_card} and 
        inv.${CardInventory.columns.id_user}=? and inv.${CardInventory.columns.is_gold}=1 
        group by cd.${Card.columns.pack}`;

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
        var setColor = user.set_color;
        var setSeries = user.set_series;

        var seriesData = new Series(setSeries);
        if(!user.hasLogin()){
            var txtDailyCardQuest = `not checked in yet`;
        } else if(userQuest.DailyCardQuest.getTotal()>1) {
            var txtDailyCardQuest = `${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}`;
        } else {
            var txtDailyCardQuest = ` completed ✅`;
        }
    
        //prepare the embed
        var txtMainStatus = dedent(`${seriesData.emoji.mascot} **Location:** ${seriesData.location.name} @${seriesData.name}
        ${User.peacePoint.emoji} **${User.peacePoint.name}:** ${user.peace_point}/${User.limit.peacePoint}
        ${Emoji.mofuheart} **Daily Card Quest:** ${txtDailyCardQuest}

        **Currency:**
        ${Currency.mofucoin.emoji} **Mofucoin:** ${user.Currency.mofucoin}/${User.Currency.limit.mofucoin} 
        ${Currency.jewel.emoji} **Jewel:** ${user.Currency.jewel}/${User.Currency.limit.jewel}`);

        var author = Embed.builderUser.author(discordUser, `${discordUser.username} (Lvl. ${userLevel})`);
        var objEmbed = Embed.builder(txtMainStatus, author, {
            title:`Main Status:`,
            color:Embed.color[setColor],
            thumbnail:seriesData.icon,
            fields: [
                {name: dedent(`${Color.pink.emoji} ${capitalize(Color.pink.value)} Lvl. ${user.Color.getLevel(Color.pink.value)}
                ${user.Color.canLevelUp(Color.pink.value) ? "🆙":""} ${user.Color.getPoint(Color.pink.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.blue.emoji} ${capitalize(Color.blue.value)} Lvl. ${user.Color.getLevel(Color.blue.value)}
                ${user.Color.canLevelUp(Color.blue.value) ? "🆙":""} ${user.Color.getPoint(Color.blue.value)} Pts`),
                value: ``,inline:true},
                
                {name: dedent(`${Color.yellow.emoji} ${capitalize(Color.yellow.value)} Lvl. ${user.Color.getLevel(Color.yellow.value)}
                ${user.Color.canLevelUp(Color.yellow.value) ? "🆙":""} ${user.Color.getPoint(Color.yellow.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.purple.emoji} ${capitalize(Color.purple.value)} Lvl. ${user.Color.getLevel(Color.purple.value)}
                ${user.Color.canLevelUp(Color.purple.value) ? "🆙":""} ${user.Color.getPoint(Color.purple.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.red.emoji} ${capitalize(Color.red.value)} Lvl. ${user.Color.getLevel(Color.red.value)}
                ${user.Color.canLevelUp(Color.red.value) ? "🆙":""} ${user.Color.getPoint(Color.red.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.green.emoji} ${capitalize(Color.green.value)} Lvl. ${user.Color.getLevel(Color.green.value)}
                ${user.Color.canLevelUp(Color.green.value) ? "🆙":""} ${user.Color.getPoint(Color.green.value)} Pts`),
                value: ``,inline:true},

                {name: dedent(`${Color.white.emoji} ${capitalize(Color.white.value)} Lvl. ${user.Color.getLevel(Color.white.value)}
                ${user.Color.canLevelUp(Color.white.value) ? "🆙":""} ${user.Color.getPoint(Color.white.value)} Pts`),
                value: ``,inline:true},
            ],
            footer:{
                text:`Page 1 / 5 | Daily checked in: ${user.hasLogin() ? `✅`:`❌`} `
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
            if(series.value==user.set_series){
                objEmbed.description+=`**${series.emoji.mascot} ${user.Series.getPoint(series.value)}/${User.Series.limit.point} ${series.getCurrencyName()} (${series.name})**\n`;
             }else {
                objEmbed.description+=`${series.emoji.mascot} ${user.Series.getPoint(series.value)}/${User.Series.limit.point} ${series.getCurrencyName()} (${series.name})\n`;
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

        var queryDuplicate = `select cd.${Card.columns.pack}, sum(inv.${CardInventory.columns.stock}) as total, 
        cd. ${Card.columns.color}
        from ${Card.tablename} cd
        left join ${CardInventory.tablename} inv
        on cd.${Card.columns.id_card}=inv.${CardInventory.columns.id_card} and
        inv.${CardInventory.columns.id_user}=? and
        inv.${CardInventory.columns.stock}>=1
        where inv.${CardInventory.columns.stock}>=1 
        group by cd.${Card.columns.pack}`;
    
        var cardDataInventory = await DBConn.conn.query(queryDuplicate, [discordUser.id]);
        //reassign total into duplicate total
        for(var i=0;i<cardDataInventory.length;i++){
            var pack = cardDataInventory[i][Card.columns.pack];
            var color = cardDataInventory[i][Card.columns.color];
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

    static async levelUpColor(){

    }

}

module.exports = {EventListener}
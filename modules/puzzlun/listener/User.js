// const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageEmbed} = require('discord.js');
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require('../../DiscordStyles');
const GlobalFunctions = require('../../GlobalFunctions.js');
const capitalize = GlobalFunctions.capitalize;

const paginationEmbed = require('../../DiscordPagination');

const Properties = require('./../Properties');
const Color = Properties.color;
const Currency = Properties.currency;
const Emoji = Properties.emoji;

const User = require("../data/User");
const Card = require("../data/Card");
const CardInventory = require("../data/CardInventory");
const {UserQuest, DailyCardQuest} = require("../data/Quest");
const {AvatarFormation, PrecureAvatar} = require("../data/Avatar");

// const CpackModule = require("./Cpack");
const {Series, SPack} = require("../data/Series");

const Embed = require("../Embed");

class Validation extends require("../Validation") {
    
}

class Listener extends require("../data/Listener") {

    constructor(userId=null, discordUser=null, interaction=null){
        super(userId,discordUser, interaction);
    }

    async status(isPrivate){//print user status menu
        var userId = this.discordUser.id;
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
            var txtDailyCardQuest = `not checked in yet ❌`;
        } else if(userQuest.DailyCardQuest.getTotal()>1) {
            var txtDailyCardQuest = `${userQuest.DailyCardQuest.getTotal()}/${DailyCardQuest.max}`;
        } else {
            var txtDailyCardQuest = ` completed ✅`;
        }
    
        //prepare the embed
        var txtMainStatus = dedent(`${seriesData.emoji.mascot} **Location:** ${seriesData.location.name} @${seriesData.name}
        ${User.peacePoint.emoji} **${User.peacePoint.name}:** ${user.peace_point}/${User.limit.peacePoint}
        ${Emoji.mofuheart} **Daily card quest:** ${txtDailyCardQuest}

        **Currency:**
        ${Currency.mofucoin.emoji} **Mofucoin:** ${user.Currency.mofucoin}/${User.Currency.limit.mofucoin} 
        ${Currency.jewel.emoji} **Jewel:** ${user.Currency.jewel}/${User.Currency.limit.jewel}`);

        var author = Embed.builderUser.author(this.discordUser, `${this.discordUser.username} (Lvl. ${userLevel})`);
        var objEmbed = Embed.builder(txtMainStatus, author, {
            title:`${Emoji.mofuheart} Main Status:`,
            color:Embed.color[setColor],
            thumbnail:seriesData.icon,
            fields: [
                {name: dedent(`${Color.pink.emoji} ${capitalize(Color.pink.value)} Lvl. ${user.Color.getLevel(Color.pink.value)}
                ${user.Color.canLevelUp("pink") ? "🆙":""} ${user.Color.getPoint("pink")} Pts`),
                value: ``, inline:true},

                {name: dedent(`${Color.blue.emoji} ${capitalize(Color.blue.value)} Lvl. ${user.Color.getLevel(Color.blue.value)}
                ${user.Color.canLevelUp("blue") ? "🆙":""} ${user.Color.getPoint("blue")} Pts`),
                value: ``, inline:true},
                
                {name: dedent(`${Color.yellow.emoji} ${capitalize(Color.yellow.value)} Lvl. ${user.Color.getLevel(Color.yellow.value)}
                ${user.Color.canLevelUp("yellow") ? "🆙":""} ${user.Color.getPoint("yellow")} Pts`),
                value: ``, inline:true},

                {name: dedent(`${Color.purple.emoji} ${capitalize(Color.purple.value)} Lvl. ${user.Color.getLevel(Color.purple.value)}
                ${user.Color.canLevelUp("purple") ? "🆙":""} ${user.Color.getPoint("purple")} Pts`),
                value: ``, inline:true},

                {name: dedent(`${Color.red.emoji} ${capitalize(Color.red.value)} Lvl. ${user.Color.getLevel(Color.red.value)}
                ${user.Color.canLevelUp("red") ? "🆙":""} ${user.Color.getPoint("red")} Pts`),
                value: ``, inline:true},

                {name: dedent(`${Color.green.emoji} ${capitalize(Color.green.value)} Lvl. ${user.Color.getLevel(Color.green.value)}
                ${user.Color.canLevelUp("green") ? "🆙":""} ${user.Color.getPoint("green")} Pts`),
                value: ``, inline:true},

                {name: dedent(`${Color.white.emoji} ${capitalize(Color.white.value)} Lvl. ${user.Color.getLevel(Color.white.value)}
                ${user.Color.canLevelUp("white") ? "🆙":""} ${user.Color.getPoint("white")} Pts`),
                value: ``, inline:true},
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
    
        //======page 2 : series, color effect======
        objEmbed.title = `${Emoji.mofuheart} Main Status`;
        objEmbed.description = ``;
        var arrColor = Object.keys(Color);
        var txtColorEffect = ``;
        for(var key in arrColor){
            let color = arrColor[key];
            txtColorEffect+=`${User.Color.getEmoji(color)} **Lvl ${user.Color.getLevel(color)}**: +${user.Color.getCardCaptureBonus(color)}%\n`;
        }

        //reset fields embed:
        objEmbed.fields = [{
            name:`Card capture bonus effect:`,
            value:txtColorEffect
        }];

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
    
        var cardDataInventory = await DBConn.conn.query(queryDuplicate, [this.discordUser.id]);
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
            this.discordUser,
            {
                color: avatarFormation.id_main!=null? embedColor:setColor,
                title: `Precure Avatar:`,
                thumbnail: avatarFormation.id_main!=null? embedThumbnail:``,
                fields: arrFields
            })
        ); //add embed to pages

        paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, isPrivate);
    }

    async levelUpColor(){//level up color
        var colorSelection = this.interaction.options.getString("selection");
        var user = new User(await User.getData(this.userId));
        var costPoint = user.Color.getNextLevelPoint(colorSelection);
        var nextLevel = user.Color[colorSelection].level+1;

        if(!user.Color.canLevelUp(colorSelection)){//validation: not enough color points
            return this.interaction.reply(
                Embed.errorMini(`${User.Color.getEmoji(colorSelection)} ${costPoint} ${colorSelection} points are required to level up into ${nextLevel}`, this.discordUser, true, {
                    title:`❌ Not enough ${colorSelection} points`
                })
            );
        }
        
        user.Color[colorSelection].point-=costPoint;
        user.Color[colorSelection].level+=1;
        await user.update();

        var costPoint = user.Color.getNextLevelPoint(colorSelection);//reassign level point

        var colorEmoji = User.Color.getEmoji(colorSelection);
        return this.interaction.reply({
            embeds:[
                Embed.builder(`Your ${colorEmoji} **${colorSelection}** color is now level **${user.Color[colorSelection].level}**!`, this.discordUser, {
                    color: colorSelection,
                    title: `🆙 ${capitalize(colorSelection)} color level up!`,
                    thumbnail: Properties.imgSet.mofu.ok,
                    fields:[
                        {
                            name:`Base ${colorSelection} capture bonus:`,
                            value:`${Color[colorSelection].emoji_card} +${user.Color.getCardCaptureBonus(colorSelection)}% chance`,
                        },
                        {
                            name:`Next level with:`,
                            value:`${colorEmoji} ${costPoint} ${colorSelection} points`,
                        }
                    ]
                })
            ]}
        );
    }

    async setAvatar(cardId, formation, isPrivate){
        var user = new User(await User.getData(this.userId));
        
        //validation: if card exists
        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null) return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        
        //validation: if user have card
        if(cardInventoryData.cardInventoryData==null) return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));

        var cardInventory = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        var color = Color[cardInventory.color];
        var series = cardInventory.Series;
        var rarity = cardInventory.rarity;
        //validation color & series points
        var cost = {
            color:10*cardInventory.rarity,
            series:10*cardInventory.rarity
        }
        if(user.Color[cardInventory.color].point<cost.color||
        user.Series[cardInventory.series]<cost.series){//validation color & series points
            return this.interaction.reply(
                Embed.errorMini(`You need **${color.emoji} ${cost.color}** & **${series.currency.emoji} ${cost.series}** to set ${cardInventory.getRarityEmoji()}**${rarity}** ${cardInventory.id_card} - ${cardInventory.getName(15)} as precure avatar`,this.discordUser, true,{
                    title:`❌ Not enough points`
                })
            );
        }

        var avatarFormation = new AvatarFormation(await AvatarFormation.getData(this.userId));
        //validation: check for same avatar on any formation
        if(avatarFormation.id_main==cardInventory.id_card){
            return this.interaction.reply(
                Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.main.name}** formation`,this.discordUser, true,{
                    title:`❌ Same avatar/formation`
                })
            );
        } else if(avatarFormation.id_support1==cardInventory.id_card){
            return this.interaction.reply(
                Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.support1.name}** formation`,this.discordUser, true,{
                    title:`❌ Same avatar/formation`
                })
            );
        } else if(avatarFormation.id_support2==cardInventory.id_card){
            return this.interaction.reply(
                Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.support2.name}** formation`,this.discordUser, true,{
                    title:`❌ Same avatar/formation`
                })
            );
        }

        //update the precure avatar:
        var precureAvatar = new PrecureAvatar(formation, cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        avatarFormation[precureAvatar.formation.columns] = cardInventory.id_card;
        await avatarFormation.update();

        //update user color & series points:
        user.Color[cardInventory.color].point-=cost.color;
        user.Series[cardInventory.series]-=cost.series;
        await user.update();
        
        return this.interaction.reply({embeds:[
            Embed.builder(dedent(`*"${precureAvatar.properties.transform_quotes2}"*
        
            <@${userId}> has assign **${precureAvatar.properties.name}** as **${precureAvatar.formation.name}** precure avatar!`),
                Embed.builderUser.authorCustom(`⭐${rarity} ${precureAvatar.character.alter_ego}`, precureAvatar.character.icon),{
                    color: precureAvatar.character.color,
                    thumbnail: precureAvatar.cardInventory.getImgDisplay(),
                    title: precureAvatar.properties.transform_quotes1,
                    image: precureAvatar.properties.img_transformation
                }
            )
        ],ephemeral: isPrivate});
    }

    async setColor(selection){
        var user = new User(await User.getData(this.userId));
        var setCost = 100;
        var userColor = Color[user.set_color];
        var color = Color[selection];
        
        if(user.set_color==selection){
            //validation: same color
            return this.interaction.reply(
                Embed.errorMini(`You've already assigned in ${userColor.emoji} **${userColor.value}** color`, this.discordUser, true, {
                    title:`❌ Same color`
                })
            );
        } else if(user.Color[user.set_color].point<=setCost){
            //validation: color point
            return this.interaction.reply(
                Embed.errorMini(`**${userColor.emoji} ${setCost} ${userColor.value} points** are required to change your color assignment into: **${color.emoji} ${color.value}**`,this.discordUser, true,{
                    title:`❌ Not enough ${userColor.value} points`
                })
            );
        }

        user.Color[user.set_color].point-=setCost;
        user.set_color = selection;
        await user.update();

        return this.interaction.reply({embeds:[
            Embed.builder(`${Properties.emoji.mofuheart} Your color assignment has been changed into: **${color.emoji} ${color.value}**`, this.discordUser, {
                color:user.set_color,
                title:`Color changed!`,
                thumbnail:Properties.imgSet.mofu.ok
            })
        ]});
    }

    async setSeries(selection){
        var user = new User(await User.getData(this.userId));
        var setCost = 100;
        var userSeries = new Series(user.set_series);
        var series = new Series(selection);
        if(user.set_series==selection){
            return this.interaction.reply(
                Embed.errorMini(`You've already assigned in **${userSeries.emoji.mascot} ${userSeries.location.name} @${userSeries.name}**`, this.discordUser, true, {
                    title:`❌ Same Location`
                })
            );
        } else if(user.Series[user.set_series]<setCost){
            //validation: series point
            return this.interaction.reply(
                Embed.errorMini(`You need **${userSeries.emoji.mascot} ${setCost} ${userSeries.currency.name}** to teleport into: **${series.location.name} @${series.name}**`,this.discordUser, true,{
                    title:`❌ Not enough series points`
                })
            );
        }

        user.Series[userSeries.value]-=setCost;
        user.set_series = series.value;
        await user.update();

        return this.interaction.reply({embeds:[
            Embed.builder(`${Properties.emoji.mofuheart} You have successfully teleported into: **${series.location.name} @${series.name}**`, this.discordUser, {
                color:user.set_color,
                title:`${series.emoji.mascot} Welcome to: ${series.location.name}!`,
                thumbnail:series.location.icon,
                footer:Embed.builderUser.footer(`${await User.getUserTotalByLocation(selection)} other user are available in this location`)
            })
        ]});
    }

    // async unsetAvatar(formation){
    //     var user = new User(await User.getData(this.userId));
    //     var avatarFormation = new AvatarFormation(await AvatarFormation.getData(this.userId));
    //     //validation if all:
    //     if(formation=="all"){
    //         var arrFormation = Object.keys(AvatarFormation.formation);
    //         // for(var key in arrFormation){
    //         //     var val = arrFormation[key];
    //         //     if(avatarFormation.getCardFormation(formation))
    //         // }
            
    //     }
        
    // }

}

module.exports = Listener
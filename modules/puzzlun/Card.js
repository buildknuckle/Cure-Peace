const stripIndents = require('common-tags');
const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;
const paginationEmbed = require('../DiscordPagination');

const User = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {ItemInventory, Item} = require("./data/Item");
const {Series, SPack} = require("./data/Series");
const {Character, CPack} = require("./data/Character");
const Properties = require('./Properties');
const Color = Properties.color;
const Emoji = Properties.emoji;
const Currency = Properties.currency;

// const GuildModule = require("./Guild");

class Validation extends require("./Validation") {
    
}

class Embed extends require('./Embed') {
    user;
    card;
    discordUser;
    
    constructor(cardData, userData=null, discordUser){
        super();
        this.card = new Card(cardData);
        if(userData!==null) this.user = new User(userData);
        this.discordUser = discordUser;
    }

    newCard(updatedTotalPack, options = {notifFront:"",notifBack:""}){
        //discord user author:
        var userId = this.discordUser.id;
        var username = this.discordUser.username;
        var userAvatar = Embed.builderUser.getAvatarUrl(this.discordUser);

        //card data
        var id = this.card.id_card; var rarity = this.card.rarity;
        var character = this.card.Character; var name = this.card.name.toString();
        var img = this.card.img_url; var color = this.card.color;
        var series = this.card.Series;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;

        var author = Embed.builderUser.author(this.discordUser, `New ${capitalize(character.name)} Card!`, character.icon);

        return Embed.builder(dedent(`${notifFront}${Properties.emoji.mofuthumbsup} <@${userId}> has received new ${this.card.getRarity()} ${capitalize(character.name)} card!${notifBack}`), author, {
            color: color,
            title: name,
            fields:[{
                name:`ID:`,
                value:`${id.toString()}`,
                inline:true
            },{
                name:`Series:`,
                value:`${series.emoji.mascot} ${capitalize(series.name)}`,
                inline:true
            }],
            image: img,
            footer: Embed.builderUser.footer(`${username} (${updatedTotalPack}/${this.card.packTotal})`, userAvatar)
        });
    }

    duplicateCard(updatedStock, options = {notifFront:"",notifBack:""}){
        //card data
        var userId = this.discordUser.id;

        var character = this.card.Character; var series = this.card.Series; 
        var name = this.card.name; var img = this.card.img_url; 
        var color = this.card.color;

        var notifFront = `${"notifFront" in options ? options.notifFront:""}`;
        var notifBack = `${"notifBack" in options ? options.notifBack:""}`;

        return Embed.builder(dedent(`${notifFront}${Emoji.mofuheart} <@${userId}> has received another ${character.name} card${notifBack}:
        ${this.card.getRarity(true)} ${this.card.getIdCard()} **${name}**`), this.discordUser, {
            color: color,
            title: `Duplicate Card`,
            thumbnail: img,
            footer: Embed.builderUser.footer(`Stock: ${updatedStock}/${CardInventory.limit.card}`)});
    }

    detail(cardInventoryData){
        var cardInventory = new CardInventory(cardInventoryData, this.card);
        
        var cardId = cardInventory.id_card;
        var color = cardInventory.color;
        var character = cardInventory.Character;

        return Embed.builder(
            dedent(`**${cardInventory.getRarityEmoji()}${cardInventory.rarity} - Level:** ${cardInventory.level}/${cardInventory.getMaxLevel()}
            ─────────────────
            ${CardInventory.emoji.hp} **Hp:** ${cardInventory.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${cardInventory.atk} | ${CardInventory.emoji.sp} **Sp:** ${cardInventory.maxSp}        
            💖 **Special:** ${character.specialAttack} Lv.${cardInventory.level_special}`),
            Embed.builderUser.author(this.discordUser,character.fullname, character.icon),{
                color:color,
                image:cardInventory.getImgDisplay(),
                title:`${cardInventory.name}`,
                footer:{
                    text:`${cardInventory.id_card} | Received at: ${cardInventory.getReceivedDate()}`,
                    iconURL:Embed.builderUser.getAvatarUrl(this.discordUser)
                }
        });
    }

    detailWithAvatar(cardInventoryData){
        var cardInventory = new CardInventory(cardInventoryData, this.card);
        var arrPages = [];
        
        var cardId = cardInventory.id_card;
        var color = cardInventory.color;
        var character = cardInventory.Character;

        arrPages.push(Embed.builder(
        dedent(`**${cardInventory.getRarityEmoji()}${cardInventory.rarity} - Level:** ${cardInventory.level}/${cardInventory.getMaxLevel()}
        ─────────────────
        ${CardInventory.emoji.hp} **Hp:** ${cardInventory.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${cardInventory.atk} | ${CardInventory.emoji.sp} **Sp:** ${cardInventory.maxSp}        
        💖 **Special:** ${character.specialAttack} Lv.${cardInventory.level_special}`),
        Embed.builderUser.author(this.discordUser,character.fullname, character.icon),{
            color:color,
            image:cardInventory.getImgDisplay(),
            title:`${cardInventory.name}`,
            footer:{
                text:`${cardInventory.id_card} | Received at: ${cardInventory.getReceivedDate()}`,
                iconURL:Embed.builderUser.getAvatarUrl(this.discordUser)
            }
        }));

        return arrPages;
    }

}

class Listener extends require("./data/Listener") {
    // constructor(userId=null, discordUser=null, interaction=null){
    //     super(userId,discordUser, interaction);
    // }

    static viewStyle = {
        compact:"compact",
        full:"full",
    }

    async detail(){//print card detail
        var cardId = this.interaction.options.getString("card-id");
        var isPrivate = this.interaction.options.getBoolean("visible-private") !== null? 
        this.interaction.options.getBoolean("visible-private"):false;

        var userId = this.discordUser.id;
        // var arrPages = []; //prepare paging embed
        // var cardData = await CardModule.getCardData(idCard);

        var cardDataInventory = await CardInventory.getJoinUserData(userId, cardId);
        if(cardDataInventory==null){//validation: check if card exists/not
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        } else if(cardDataInventory.cardInventoryData==null){//validation: check if user have card/not
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }
        
        var embedDetail = new Embed(cardDataInventory.cardData, null, this.discordUser);
        var arrPages = embedDetail.detailWithAvatar(cardDataInventory.cardInventoryData);

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList, isPrivate);
    }

    async inventory(){ //prepare paging embed
        var pack = this.interaction.options.getString("card-pack");
        var parameterUsername = this.interaction.options.getString("username");
        var duplicateOnly = this.interaction.options.getBoolean("filter-duplicate")!==null ? 
            this.interaction.options.getBoolean("filter-duplicate"):false;
        var isPrivate = parameterUsername==null? true:false;
        //display style:
        var displayStyle = this.interaction.options.getString("display-style")!==null?
            this.interaction.options.getString("display-style"):Listener.viewStyle.full;
        var userSearchResult = await Validation.User.isAvailable(this.discordUser, parameterUsername, this.interaction);
        if(!userSearchResult) return; else this.discordUser = userSearchResult;

        var userId = this.discordUser.id;
        var arrPages = []; 
        
        //validation if pack exists/not
        var cardDataInventory = await CardInventory.getDataByPack(userId, pack, duplicateOnly);
        if(cardDataInventory==null){
            if(duplicateOnly){
                return this.interaction.reply(
                    Embed.errorMini(`No duplicates are available on this pack.`, this.discordUser, {
                        title:`❌ No duplicates available`
                    })
                );
            } else {
                return this.interaction.reply(Validation.Pack.embedNotFound(this.discordUser));
            }
        }

        var total = {
            normal: cardDataInventory.cardInventoryData.filter(
                function (item) {
                    return item!=null&&item[CardInventory.columns.id_user] != null;
                }
            ).length,
            gold: cardDataInventory.cardInventoryData.filter(
                function (item) {
                    return item!=null&&item[CardInventory.columns.is_gold] == 1;
                }
            ).length,
            duplicate: GlobalFunctions.sumObjectByKey(cardDataInventory.cardInventoryData.filter(
                function (item) {
                    return item!=null&&item[CardInventory.columns.stock]>0;
                }
            ), CardInventory.columns.stock)
        };

        //process first card info
        var cardInfo = new Card(cardDataInventory.cardData[0]);
        var character = new Character(cardInfo.pack);
        var alterEgo = character.alter_ego;
        var color = cardInfo.color;
        var icon = character.icon;
        // var iconColor = Color[color].emoji;
        var iconSeries = cardInfo.Series.emoji.mascot;
        var maxPack = cardInfo.packTotal;
            
        var arrFields = [];
        var idx = 0; var maxIdx = 4; var txtInventory = ``;
        for(var i=0;i<cardDataInventory.cardData.length;i++){
            var card = new CardInventory(cardDataInventory.cardInventoryData[i], cardDataInventory.cardData[i]);
            let level = card.level;
            let displayName = `${card.getName(30, true)}`;
            let stock = card.stock;
            let rarity = card.rarity;
            let hp = card.maxHp;
            let atk = card.atk;

            if(card.isHaveCard()){
                txtInventory+=dedent(`**${card.getRarity()}** ${card.getIdCard()} ${card.getCardEmoji()}x${stock} ${card.isTradable()? "🔀":""}
                ${displayName} **Lv.${level}**`)+`\n`;
                if(displayStyle==Listener.viewStyle.full){
                    txtInventory+=`${CardInventory.emoji.hp} **Hp:** ${hp} | ${CardInventory.emoji.atk} **Atk:** ${atk} | ${CardInventory.emoji.sp} **Sp:** ${card.maxSp}\n`;
                }
                txtInventory+=`─────────────────\n`;
            } else {
                txtInventory+=dedent(`**${card.getRarity()} ???**
                ─────────────────`)+`\n`;
            }
            
            //check for max page content
            if(idx>=maxIdx||(idx<maxIdx && i==cardDataInventory.cardData.length-1)){
                let embed = 
                Embed.builder(dedent(`**Normal:** ${total.normal}/${maxPack} | **Gold:** ${total.gold}/${maxPack}
                ${card.getCardEmoji()} **Duplicates:** ${total.duplicate}/${maxPack*CardInventory.limit.card}
                
                ${txtInventory}`)
                    ,this.discordUser,{
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

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, isPrivate);
    }

    async levelUp(){
        let cardId = this.interaction.options.getString("card-id");
        let amount = this.interaction.options.getInteger("amount")!==null?
        this.interaction.options.getInteger("amount"):1;

        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null){//validation: cannot find card
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        } else if(cardInventoryData.cardInventoryData==null){//validation: user don't have card
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        if(amount<=0||amount>10){//validation: invalid amount
            return this.interaction.reply(
                Embed.errorMini(`Please enter the amount of level up between 1-10`, this.discordUser, true, {
                    title:`❌ Invalid amount`
                })
            );
        }

        var user = new User(await User.getData(this.userId));
        var card = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        var character = card.Character;
        var color = card.color;
        var newLevel = card.level+amount;
        if(card.level>=card.getMaxLevel()){//validation: check for max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`${card.getRarity()} ${card.getIdCard()} **${card.getName(15)}** cannot be leveled up anymore`),
                this.discordUser, true, {
                    title:`❌ Max level reached`
                })
            );
        } else if(newLevel>card.getMaxLevel()){//validation: check for amount max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`${card.getRarity()} ${card.getIdCard()} **${card.getName(15)}** cannot be leveled up with this level amount`),
                this.discordUser, true, {
                    title:`❌ Invalid level amount!`
                })
            );
        }

        // case 1: return 20;
        // case 2: return 25;
        // case 3: return 35;
        // case 4: return 40;
        // case 5: return 50;
        // case 6: case 7: return 60;
        // default: return 20;
        if(card.rarity<=5){//validation: rarity 1-5 level up with color points
            var colorPoint = user.getColorPoint(color);//selected color point
            var cost = CardInventory.parameter.nextColorPoint(card.level, amount);//cost of color point
            if(!card.canLevelUpColor(colorPoint, amount)){//validation: check for color points
                return this.interaction.reply(
                    Embed.errorMini(dedent(`${card.getColorEmoji()} **${cost} ${color} points** are required to level up ${card.getIdCard()} **${card.getName(18)}** into level ${newLevel}`),
                    this.discordUser, true, {
                        title:`❌ Not enough color point`
                    })
                );
            }
            
            user.Color[color].point-=cost;//update user color points
            await user.update();//update user data
        } else {//rarity 6+ level up with duplicates
            if(!card.canLevelUpDuplicate(amount)){//validation: check for duplicates
                return this.interaction.reply(
                    Embed.errorMini(dedent(`${amount}x ${card.getCardEmoji()}${card.getIdCard()} **${card.name}** are required to level up this card.`), 
                    this.discordUser, true, {
                        title:`❌ Not enough duplicates`
                    })
                )
            }

            card.stock-=amount;//update user card stock
        }

        card.levelSync(newLevel);//sync into new level
        await card.update();//update card inventory data



        return await this.interaction.reply({content:`${Properties.emoji.mofuheart} ${card.getIdCard()} **${card.getName(18)}** has been leveled up into level **${newLevel}**!`, 
            embeds:[
            //level up notification
            // Embed.builder(
            //     dedent(`**${card.id_card} - ${card.name}** is now level ${newLevel}!`),
            //     this.discordUser,{
            //         color:color,
            //         title:`Card leveled up!`
            // }),
            //card display
            Embed.builder(dedent(`**${card.getRarityEmoji()}${card.rarity} | Level:** ${card.level}/${card.getMaxLevel()}
                ─────────────────
                ${CardInventory.emoji.hp} **Hp:** ${card.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${card.atk} | ${CardInventory.emoji.sp} **Sp:** ${card.maxSp}        
                💖 **Special:** ${character.specialAttack} Lv.${card.level_special}
                
                **Passive Skill:**`),
                Embed.builderUser.author(this.discordUser,character.fullname, character.icon),{
                    color:color,
                    thumbnail:card.getImgDisplay(),
                    title:`${card.name}`,
                    footer:{
                        text:`${this.discordUser.username}`,
                        iconURL:Embed.builderUser.getAvatarUrl(this.discordUser)
                    }
            })
        ]});
    }

    async levelUpSpecial(){
        let cardId = this.interaction.options.getString("card-id");
        let amount = this.interaction.options.getInteger("amount")!==null?
        this.interaction.options.getInteger("amount"):1;

        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null){//validation: cannot find card
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        }

        if(cardInventoryData.cardInventoryData==null){//validation: user don't have card
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        if(amount<=0||amount>9){//validation: invalid amount
            return this.interaction.reply(
                Embed.errorMini(`Please enter the amount of level up between 1-9`, this.discordUser, true, {
                    title:`❌ Invalid amount`
                })
            );
        }

        // var user = new User(await User.getData(this.userId));
        var card = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        var character = card.Character;
        var color = card.color;
        var newLevel = card.level_special+amount;
        var specialAttack = character.specialAttack;

        if(card.level_special>=card.getMaxSpecialLevel()){//validation: check for max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`${card.getRarity()} ${card.getIdCard()} **${specialAttack}** cannot be leveled up anymore`),
                this.discordUser, true, {
                    title:`❌ Max special level reached`
                })
            );
        } else if(newLevel>card.getMaxSpecialLevel()){//validation: check for amount max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`${card.getRarity()} ${card.getIdCard()} **${specialAttack}** cannot be leveled up with this level amount`),
                this.discordUser, true, {
                    title:`❌ Invalid level amount!`
                })
            );
        }

        //update card stock
        if(!card.canLevelUpSpecial(amount)){//validation: check for duplicates
            return this.interaction.reply(
                Embed.errorMini(dedent(`${amount}x ${card.getCardEmoji()}${card.getIdCard()} **${card.getName(18)}** are required to level up this card special level`), 
                this.discordUser, true, {
                    title:`❌ Not enough duplicates`
                })
            )
        }

        card.level_special = newLevel;
        card.stock-=amount;//update user card stock
        await card.update();//update card inventory data

        return await this.interaction.reply({content:`${Properties.emoji.mofuheart} ${card.getIdCard()} **${character.specialAttack}** is now level **${newLevel}**!`, 
            embeds:[
            Embed.builder(dedent(`**${card.getRarityEmoji()}${card.rarity} | Level:** ${card.level}/${card.getMaxLevel()}
                ─────────────────
                ${CardInventory.emoji.hp} **Hp:** ${card.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${card.atk} | ${CardInventory.emoji.sp} **Sp:** ${card.maxSp}        
                💖 **Special:** ${character.specialAttack} Lv.${card.level_special}
                
                **Passive Skill:**`),
                Embed.builderUser.author(this.discordUser,character.fullname, character.icon),{
                    color:color,
                    thumbnail:card.getImgDisplay(),
                    title:`${card.name}`,
                    footer:{
                        text:`${this.discordUser.username}`,
                        iconURL:Embed.builderUser.getAvatarUrl(this.discordUser)
                    }
            })
        ]});
    }

    async upgradeGold(){
        var cardId = this.interaction.options.getString("card-id");

        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null){//validation: cannot find card
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        } else if(cardInventoryData.cardInventoryData==null){//validation: user don't have card
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        var card = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        if(card.is_gold){//validation: already upgraded to gold
            return this.interaction.reply(
                Embed.errorMini(`This card has been upgraded into gold.`, this.discordUser, true, {
                    title:`❌ Cannot upgrade this card`
                })
            );
        }
        
        //validation: check for duplicates & item material
        var itemInventoryData = await ItemInventory.getItemInventoryDataById(this.userId, card.getGoldUpgradeMaterial());
        var item = new Item(itemInventoryData.itemData);
        var itemInventory = new ItemInventory(itemInventoryData.itemInventoryData, itemInventoryData.itemData);

        var cost = card.rarity;
        if(card.stock<cost||itemInventory.stock==null||
            itemInventory.stock<cost){//validation: check for material
                return this.interaction.reply(
                    Embed.errorMini(`You don't have enough material to upgrade into gold card.`, this.discordUser, true, {
                        title:`❌ Not enough material`,
                        fields:[
                            {
                                name:`Material required:`,
                                value:dedent(`${cost}x ${card.getCardEmoji()} ${card.getIdCard()} ${card.getName()}
                                ${cost}x ${item.getCategoryEmoji()} ${item.getIdItem()} ${item.name}`)
                            }
                        ]
                    })
                );
        }

        var embed = new Embed(cardInventoryData.cardData, null, this.discordUser);
        card.is_gold = 1;
        card.stock-=cost;
        await card.update();//update card data

        //update item stock:
        itemInventory.stock-=cost;
        await itemInventory.update();

        return this.interaction.reply({content:`${Emoji.mofuheart} ${card.getIdCard()} **${card.getName(18)}** has successfully upgraded upgraded into gold card!`, embeds:[
            embed.detail(card)
        ]});
    }

    async convert(){
        var cardId = this.interaction.options.getString("card-id");
        var amount = this.interaction.options.getInteger("amount")!==null?
            this.interaction.options.getInteger("amount"):1;
        var user = new User(await User.getData(this.userId));

        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null){//validation: cannot find card
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        } else if(cardInventoryData.cardInventoryData==null){//validation: user don't have card
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }

        if(amount<=0||amount>10){//validation: invalid amount
            return this.interaction.reply(
                Embed.errorMini(`Please enter the convert amount between 1-10`, this.discordUser, true, {
                    title:`❌ Invalid amount`
                })
            );
        }

        var card = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        if(card.stock<amount){//validation: check if user have enough amount
            return this.interaction.reply(
                Embed.errorMini(dedent(`${amount}x ${card.getCardEmoji()}${card.getIdCard()} **${card.name}** are required to convert this card.`), 
                    this.discordUser, true, {
                        title:`❌ Not enough duplicates`
                    })
            );
        }
        
        card.stock-=amount;
        await card.update();//update card stock

        var colorPoints = card.parameter.convertColor(card.rarity)*amount;
        var seriesPoints = card.parameter.convertSeries(card.rarity)*amount;
        var jewel = card.parameter.convertJewel(card.rarity)*amount;

        //update user points
        user.Color.modifPoint(card.color, colorPoints);
        user.Series.modifPoint(card.series, seriesPoints);
        user.Currency.modifPoint(Currency.jewel.value, jewel);
        await user.update();

        return this.interaction.reply({embeds:[
            Embed.builder(`${card.getRarity()} ${card.getIdCard()} **${card.getName(20)}** has been converted.`, 
                this.discordUser, {
                    title:`↖️ Card converted`,
                    color:card.color,
                    thumbnail:card.img_url,
                    fields:[
                        {
                            name:`Converted results:`,
                            value:dedent(`${card.getColorEmoji()} ${colorPoints} ${card.color} points (${user.getColorPoint(card.color)}/${User.Color.limit.point})
                            ${card.Series.getMascotEmoji()} ${seriesPoints} ${card.Series.currency.name} (${user.getSeriesPoint(card.series)}/${User.Series.limit.point})
                            ${jewel>0 ? `${Currency.jewel.emoji} ${jewel} ${Currency.jewel.name} (${user.Currency.jewel}/${User.Currency.limit.jewel})`:``}`)
                        }
                    ]
            })
        ], ephemeral:true});

    }

}

module.exports = {
    CardEmbed: Embed,
    CardListener: Listener
}
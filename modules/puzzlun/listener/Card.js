const dedent = require("dedent-js");
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require('../../DiscordStyles');
const GlobalFunctions = require('../../GlobalFunctions');
const paginationEmbed = require('../../DiscordPagination');

const User = require("../data/User");
const Card = require("../data/Card");
const CardInventory = require("../data/CardInventory");
const {Series, SPack} = require("../data/Series");
const {Character, CPack} = require("../data/Character");
const Properties = require('../Properties');
const Embed = require('../Embed');

// const GuildModule = require("./Guild");

class Validation extends require("../Validation") {
    
}

class Listener extends require("../data/Listener") {
    constructor(userId=null, discordUser=null, interaction=null){
        super(userId,discordUser, interaction);
    }

    async detail(cardId, isPrivate=true){//print card detail
        
        var userId = this.discordUser.id;
        var arrPages = []; //prepare paging embed
        // var cardData = await CardModule.getCardData(idCard);
        var cardData = await Card.getCardData(cardId);
        if(cardData==null){
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        }

        var cardDataInventory = await CardInventory.getDataByIdUser(userId, cardId);
        if(cardDataInventory==null){
            return this.interaction.reply(Validation.Card.embedNotHave(this.discordUser));
        }
        
        var card = new CardInventory(
            cardDataInventory,
            cardData
        )

        var cardId = card.id_card;
        var color = card.color;
        var character = card.Character;

        arrPages.push(Embed.builder(
        dedent(`**${card.getRarityEmoji()}${card.rarity} Level:** ${card.level}/${card.getMaxLevel()}
        ─────────────────
        ${CardInventory.emoji.hp} **Hp:** ${card.maxHp} | ${CardInventory.emoji.atk} **Atk:** ${card.atk} | ${CardInventory.emoji.sp} **Sp:** ${card.maxSp}        
        💖 **Special:** ${character.specialAttack} Lv.${card.level_special}
        
        **Passive Skill:**`),
        Embed.builderUser.author(this.discordUser,character.fullname, character.icon),{
            color:color,
            image:card.getImgDisplay(),
            title:`${card.name}`,
            footer:{
                text:`Received at: ${card.received_at}`,
                iconURL:Embed.builderUser.getAvatarUrl(this.discordUser)
            }
        }));

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList, isPrivate);
    }

    async inventory(pack, isPrivate, duplicateOnly){ //prepare paging embed
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
            normal: cardDataInventory.cardData.filter(
                function (item) {
                    return item[CardInventory.columns.id_user] != null;
                }
            ).length,
            gold: cardDataInventory.cardData.filter(
                function (item) {
                    return item[CardInventory.columns.is_gold] == 1;
                }
            ).length,
            duplicate: GlobalFunctions.sumObjectByKey(cardDataInventory.cardData.filter(
                function (item) {
                    return item[CardInventory.columns.stock]>0;
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
            let id = card.id_card; let level = card.level;
            let displayName = `${card.getName(30, true)}`;
            let stock = card.stock;
            let rarity = card.rarity;
            let hp = card.maxHp;
            let atk = card.atk;

            if(card.isHaveCard()){
                txtInventory+=`**${card.getRarityEmoji()}${rarity}: ${id}** ${card.getCardEmoji()}x${stock} ${card.isTradable()? "🔀":""}\n`;
                // txtInventory+=`${displayName} \n\n`;
                txtInventory+=`${displayName} **Lv.${level}**\n${CardInventory.emoji.hp} Hp: ${hp} | ${CardInventory.emoji.atk} Atk: ${atk} | ${CardInventory.emoji.sp} Sp: ${card.maxSp}\n`;
                txtInventory+=`─────────────────\n`;
            } else {
                txtInventory+=`**${Card.emoji.rarity(rarity)}${rarity}: ???**\n???\n`;
                txtInventory+=`─────────────────\n`;
            }
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==cardDataInventory.cardData.length-1)){
                let embed = 
                Embed.builder(
                    `**Normal:** ${total.normal}/${maxPack} | **Gold:** ${total.gold}/${maxPack}\n${card.getCardEmoji()}x${total.duplicate}/${maxPack*CardInventory.limit.card}\n`+
                    `\n${txtInventory}`,this.discordUser,{
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

    async levelUp(cardId, amount=1){
        var cardInventoryData = await CardInventory.getJoinUserData(this.userId, cardId);
        if(cardInventoryData==null){//validation: cannot find card
            return this.interaction.reply(Validation.Card.embedNotFound(this.discordUser));
        }

        if(cardInventoryData.cardInventoryData==null){//validation: user don't have card
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
                Embed.errorMini(dedent(`**${card.getCardEmoji()} ${card.id_card} - ${card.getName(15)}** cannot be leveled up anymore`),
                this.discordUser, true, {
                    title:`❌ Max level reached`
                })
            );
        } else if(newLevel>card.getMaxLevel()){//validation: check for amount max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`**${card.getCardEmoji()} ${card.id_card} - ${card.getName(15)}** cannot be leveled up with this level amount`),
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
                    Embed.errorMini(dedent(`${card.getColorEmoji()} **${cost} ${color} points** are required to level up **${card.id_card} - ${card.getName(18)}** into level ${newLevel}`),
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
                    Embed.errorMini(dedent(`${card.getCardEmoji()} **${amount}x ${card.id_card} - ${card.name}** are required to level up this card.`), 
                    this.discordUser, true, {
                        title:`❌ Not enough duplicates`
                    })
                )
            }

            card.stock-=amount;//update user card stock
        }

        card.levelSync(newLevel);//sync into new level
        await card.update();//update card inventory data
        return await this.interaction.reply({content:`${Properties.emoji.mofuheart} **${card.id_card} - ${card.getName(18)}** is now level **${newLevel}**!`, 
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

    async levelUpSpecial(cardId, amount=1){
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

        var user = new User(await User.getData(this.userId));
        var card = new CardInventory(cardInventoryData.cardInventoryData, cardInventoryData.cardData);
        var character = card.Character;
        var color = card.color;
        var newLevel = card.level_special+amount;
        var specialAttack = character.specialAttack;

        if(card.level_special>=card.getMaxSpecialLevel()){//validation: check for max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`**${card.getCardEmoji()} ${card.id_card} - ${specialAttack}**  cannot be leveled up anymore`),
                this.discordUser, true, {
                    title:`❌ Max special level reached`
                })
            );
        } else if(newLevel>card.getMaxSpecialLevel()){//validation: check for amount max level
            return this.interaction.reply(
                Embed.errorMini(dedent(`**${card.getCardEmoji()} ${card.id_card} - ${specialAttack}** cannot be leveled up with this level amount`),
                this.discordUser, true, {
                    title:`❌ Invalid level amount!`
                })
            );
        }

        //update card stock
        if(!card.canLevelUpSpecial(amount)){//validation: check for duplicates
            return this.interaction.reply(
                Embed.errorMini(dedent(`${card.getCardEmoji()} **${amount}x ${card.id_card} - ${card.name}** are required to level up this card.special level`), 
                this.discordUser, true, {
                    title:`❌ Not enough duplicates`
                })
            )
        }

        card.level_special = newLevel;
        card.stock-=amount;//update user card stock
        await card.update();//update card inventory data

        return await this.interaction.reply({content:`${Properties.emoji.mofuheart} **${card.id_card} - ${card.getName(18)}** special: **${character.specialAttack}** is now level **${newLevel}**!`, 
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

}

module.exports = Listener;
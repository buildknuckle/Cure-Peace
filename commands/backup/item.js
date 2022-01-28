const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const TsunagarusModule = require('../../modules/Tsunagarus');
const CardGuildModule = require('../../modules/CardGuild');
const ItemModule = require('../../modules/Item');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Guild = require('../../database/model/DBM_Card_Guild');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');

module.exports = {
    name: 'item',
    cooldown: 5,
    description: 'Contains all item categories',
    args: true,
    options:[
        {
            name: "inventory",
            description: "Open item inventory menu",
            type: 2,
            options: [
                {
                    name: "open-item-inventory",
                    description: "Open item inventory menu",
                    type: 1,
                    options: [
                        {
                            name: "filter",
                            description: "Enter username to view card status from other user.",
                            type: 3,
                            choices:[
                                {
                                    name:ItemModule.Properties.categoryData.card.choices_text,
                                    value:ItemModule.Properties.categoryData.card.value
                                },
                                {
                                    name:ItemModule.Properties.categoryData.food.choices_text,
                                    value:ItemModule.Properties.categoryData.food.value
                                },
                                {
                                    name:ItemModule.Properties.categoryData.ingredient.choices_text,
                                    value:ItemModule.Properties.categoryData.ingredient.value
                                },
                                {
                                    name:ItemModule.Properties.categoryData.misc_fragment.choices_text,
                                    value:ItemModule.Properties.categoryData.misc_fragment.value
                                },
                                {
                                    name:ItemModule.Properties.categoryData.misc_gardening.choices_text,
                                    value:ItemModule.Properties.categoryData.misc_gardening.value
                                },
                                {
                                    name:ItemModule.Properties.categoryData.misc_plant.choices_text,
                                    value:ItemModule.Properties.categoryData.misc_plant.value
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "detail",
            description: "View item detail",
            type: 2,
            options: [
                {
                    name: "view",
                    description: "View item detail",
                    type: 1,
                    options: [
                        {
                            name: "id-item",
                            description: "Enter id item that you want to view. Example:ca001",
                            type: 3,
                            required:true
                        }
                    ]
                }
            ]
        },
        {
            name: "use",
            description: "Use items",
            type: 2,
            options: [
                {
                    name: "item",
                    description: "Use items",
                    type: 1,
                    options: [
                        {
                            name: "id-item",
                            description: "Enter id item that you want to use. Example:ca001",
                            type: 3,
                            required:true
                        }
                    ]
                }
            ]
        },
        {
            name: "shop",
            description: "Open item shop menu",
            type: 2,
            options: [
                {
                    name: "view",
                    description: "View item shop listing",
                    type: 1
                },
                {
                    name: "buy",
                    description: "Purchase the item",
                    type: 1,
                    options:[
                        {
                            name:"item-id",
                            description:"Enter the item ID that you want to purchase. Example: ca001",
                            type:3,
                            required:true
                        },
                        {
                            name:"qty",
                            description:"Enter the amount of item that you want to purchase.",
                            type:4
                        },
                    ]
                }
            ]
        },
        {
            name: "sale",
            description: "Open item sale menu",
            type: 2,
            options: [
                {
                    name: "view",
                    description: "View item sale listing",
                    type: 1
                },
                {
                    name: "buy",
                    description: "Purchase the item sale",
                    type: 1,
                    options:[
                        {
                            name:"sale-selection",
                            description:"Enter the sale number selection",
                            type:3,
                            required:true
                        },
                        {
                            name:"qty",
                            description:"Enter the amount of item sale that you want to purchase.",
                            type:4,
                            required:true
                        },
                    ]
                }
            ]
        },
    ],
	async executeMessage(message, args) {
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
            case "inventory":
                var filter = interaction.options._hoistedOptions.hasOwnProperty(0) ? 
                interaction.options._hoistedOptions[0].value : null;
                objEmbed.title = `Item Inventory:`;

                var queryFilterInventory = "";
                var arrParameterized = [userId,0];
                var itemFilter = "";
                if(filter!=null){
                    itemFilter = filter.toLowerCase();
                    objEmbed.title = `Item Inventory - ${GlobalFunctions.capitalize(ItemModule.Properties.categoryData[itemFilter].name)}:`;
                    switch(itemFilter){
                        case ItemModule.Properties.categoryData.card.value_search:
                        case ItemModule.Properties.categoryData.food.value_search:
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push(ItemModule.Properties.categoryData[itemFilter].value);
                            break;
                        case ItemModule.Properties.categoryData.misc_fragment.value_search:
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push(ItemModule.Properties.categoryData.misc_fragment.value);
                            break;
                        case ItemModule.Properties.categoryData.misc_gardening.value_search:
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push(ItemModule.Properties.categoryData.misc_gardening.value);
                            break;
                        case ItemModule.Properties.categoryData.misc_plant.value_search:
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push(ItemModule.Properties.categoryData.misc_plant.value);
                            break;
                        case ItemModule.Properties.categoryData.ingredient.value_search:
                            queryFilterInventory+=` AND (idat.${DBM_Item_Data.columns.category}=? OR idat.${DBM_Item_Data.columns.category}=?) `;
                            arrParameterized.push(ItemModule.Properties.categoryData.ingredient.value,ItemModule.Properties.categoryData.ingredient_rare.value);
                            break;
                    }
                }

                var query = `select idat.${DBM_Item_Data.columns.id},idat.${DBM_Item_Data.columns.name}, 
                inv.${DBM_Item_Inventory.columns.stock},idat.${DBM_Item_Data.columns.description}
                from ${DBM_Item_Data.TABLENAME} idat 
                left join ${DBM_Item_Inventory.TABLENAME} inv 
                on inv.${DBM_Item_Inventory.columns.id_item}=idat.${DBM_Item_Data.columns.id} and 
                inv.${DBM_Item_Inventory.columns.id_user}=? and 
                inv.${DBM_Item_Inventory.columns.stock}>? ${queryFilterInventory} 
                where inv.${DBM_Item_Inventory.columns.stock}>? 
                order by inv.${DBM_Item_Inventory.columns.id_item}`;
                arrParameterized.push(0);
                
                var arrPages = []; var itemList = ""; var descriptionList = "";
                var inventoryUser = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 0; var maxCtr = 6; var pointerMaxData = inventoryUser[0].length;
                
                inventoryUser[0].forEach(entry => {
                    itemList+=`**[${entry[DBM_Item_Data.columns.id]}] - ${entry[DBM_Item_Data.columns.name]}** x${entry[DBM_Item_Inventory.columns.stock]}\n`;
                    descriptionList+=`${GlobalFunctions.cutText(entry[DBM_Item_Data.columns.description],20).replace(/\*\*/g, '')}\n`;
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [
                            {
                                name: `[ID] - Name - Stock:`,
                                value: itemList,
                                inline:true
                            },
                            {
                                name: `Description:`,
                                value: descriptionList,
                                inline:true
                            },
                        ];
                        var msgEmbed = new MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        itemList = ""; descriptionList=""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });

                if(arrPages.length<=0){
                    objEmbed.description = "You don't have any item yet.";
                    if(filter!=null)
                        objEmbed.description = `You don't have any **${ItemModule.Properties.categoryData[itemFilter].name}** yet.`;
                    
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                break;
            case "detail":
                var itemId = interaction.options._hoistedOptions[0].value;
                objEmbed.author = null;
                //check if item ID exists/not
                var itemData = await ItemModule.getItemData(itemId);
                if(itemData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that item ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //check if user have card/not
                var userItemStock = await ItemModule.getUserItemStock(userId,itemId);
                if(userItemStock<=0){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You don't have: **${itemData[DBM_Item_Data.columns.name]}** yet.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                var objEmbedFields = [
                    {
                        name:`Category:`,
                        value:ItemModule.Properties.categoryData[itemData[DBM_Item_Data.columns.category]].name,
                        inline:true
                    }
                ]

                if(itemData[DBM_Item_Data.columns.img_url]!=null){
                    objEmbed.thumbnail = {
                        url:itemData[DBM_Item_Data.columns.img_url]
                    }
                }
                
                objEmbed.title = `${itemData[DBM_Item_Data.columns.name]}`;
                objEmbed.footer = {
                    text:`Item ID: ${itemData[DBM_Item_Data.columns.id]} | Stock: ${userItemStock}`
                }

                switch(itemData[DBM_Item_Data.columns.category]){
                    case ItemModule.Properties.categoryData.card.value:
                    case ItemModule.Properties.categoryData.food.value:
                        if("permanent" in CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]]){

                            var permanentValue = "❌";
                            if(CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].permanent){
                                permanentValue = "✅";
                            }
        
                            objEmbedFields[objEmbedFields.length] = {
                                name:`Permanent Effect?`,
                                value:`${permanentValue}`,
                                inline:true
                            }
                        }
                        
                        objEmbedFields[objEmbedFields.length] = {
                            name:`Effects:`,
                            value:`${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`,
                            inline:false
                        }
                        break;
                    default:
                        objEmbedFields[objEmbedFields.length] = {
                            name:`Description:`,
                            value:`${itemData[DBM_Item_Data.columns.description]}`,
                            inline:true
                        }
                        break;
                }

                if(objEmbedFields!=null){
                    objEmbed.fields = objEmbedFields;
                }

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
            case "use":
                var userStatusData = await CardModule.getCardUserStatusData(userId);
                var currentStatusEffect = userStatusData[DBM_Card_User_Data.columns.status_effect];
                var itemId = interaction.options._hoistedOptions[0].value;

                var currentStatusEffect = userStatusData[DBM_Card_User_Data.columns.status_effect];

                //check if item ID exists/not
                var itemData = await ItemModule.getItemData(itemId);

                if(itemData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that item ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                if(currentStatusEffect==CardModule.StatusEffect.debuffData.item_curse.value){
                    switch(itemData[DBM_Item_Data.columns.effect_data].toLowerCase()){
                        case CardModule.StatusEffect.buffData.clear_status_all.value:
                            break;
                        default:
                            if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                                if("recovery_item" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                    if(!CardModule.StatusEffect.debuffData[currentStatusEffect].recovery_item.includes(
                                        itemData[DBM_Item_Data.columns.id])){
                                            var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                                                userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                                            return interaction.reply({embeds:[new MessageEmbed(embedStatusEffectActivated)]});
                                        }
                                    }
                            }
                            break;
                    }
                    
                }

                //stock validation
                var userItemStock = await ItemModule.getUserItemStock(userId,itemId);
                if(userItemStock<=0){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${itemData[DBM_Item_Data.columns.name]}** yet.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //category validator
                var usableItemCategory = [ItemModule.Properties.categoryData.card.value,ItemModule.Properties.categoryData.food.value];
                if(!usableItemCategory.includes(itemData[DBM_Item_Data.columns.category])){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You cannot use this item.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                var messageValue = `${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`;
                var clearStatusEffect = false; var announceStatusEffect = true;

                switch(itemData[DBM_Item_Data.columns.effect_data].toLowerCase()){
                    case CardModule.StatusEffect.buffData.scan_tsunagarus.value:
                        //check for guild spawn type
                        var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                        var spawnedCardData = {
                            token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                            type:guildSpawnData[DBM_Card_Guild.columns.spawn_type]
                        }

                        if(spawnedCardData.token!=null&&spawnedCardData.type!=null){
                            switch(spawnedCardData.type.toLowerCase()){
                                case "battle":
                                    announceStatusEffect = false;
                                    var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                                    var cardDataReward = await CardModule.getCardData(jsonParsedSpawnData[CardModule.Properties.spawnData.battle.id_card_reward]);
                                    var enemyType = jsonParsedSpawnData[CardModule.Properties.spawnData.battle.type];

                                    objEmbed.thumbnail = {
                                        url:TsunagarusModule.Properties.enemySpawnData.tsunagarus[enemyType].image
                                    }
                                    if(cardDataReward == null){
                                        objEmbed.thumbnail = {
                                            url:CardModule.Properties.imgResponse.imgError
                                        }
                                        objEmbed.description = `:x: Cannot scan the card reward for this tsunagarus!`;
                                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                                    } else {
                                        objEmbed.fields = [
                                            {
                                                name:`${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].name}`,
                                                value:`This tsunagarus will drop: **${cardDataReward[DBM_Card_Data.columns.id_card]} - ${cardDataReward[DBM_Card_Data.columns.name]}**`
                                            }
                                        ];
                                    }
                                    
                                    break;
                                default:
                                    objEmbed.thumbnail = {
                                        url:CardModule.Properties.imgResponse.imgError
                                    }
                                    objEmbed.description = `:x: Cannot use this item when no tsunagarus detected!`;
                                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                                    break;
                            }
                            
                        } else {
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: Cannot use this item when no tsunagarus detected!`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
                        break;
                    case CardModule.StatusEffect.buffData.clear_status_all.value:
                        //clear the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                        break;
                    default:
                        //check for debuff status effect:
                        if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if("recovery_item" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                if(CardModule.StatusEffect.debuffData[currentStatusEffect].recovery_item.includes(
                                    itemData[DBM_Item_Data.columns.id])){
                                    //check for availability recovery item
                                    if(itemData[DBM_Item_Data.columns.effect_data] in CardModule.StatusEffect.buffData){
                                        if("clear_status" in CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]]){
                                            if(CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].clear_status){
                                                await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                                clearStatusEffect = true;
                                            }
                                        }
                                    }
                                    
                                    messageValue = `✨ **${CardModule.StatusEffect.debuffData[currentStatusEffect].name}** has been removed.\n⬆️**New Status Effect:** ${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`;
                                } else {
                                    objEmbed.fields = [
                                        {
                                            name:"Cannot use this item",
                                            value:`:x: **${itemData[DBM_Item_Data.columns.name]}** cannot be used for this status effect.`,
                                            inline:true
                                        }
                                    ]
                                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                                }
                            }
                        } else if(itemData[DBM_Item_Data.columns.effect_data] in CardModule.StatusEffect.buffData){
                            if("usable" in CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]]){
                                if(!CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].usable){
                                    objEmbed.fields = [
                                        {
                                            name:"Cannot use this item",
                                            value:`:x: **${itemData[DBM_Item_Data.columns.name]}** cannot be used right now.`,
                                            inline:true
                                        }
                                    ]
                                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                                }
                            }
                        }

                        //update the status effect
                        if(!clearStatusEffect){
                            await CardModule.StatusEffect.updateStatusEffect(userId,itemData[DBM_Item_Data.columns.effect_data]);
                        }
                        
                        break;
                }

                //update the item stock
                await ItemModule.updateItemStock(userId,itemId,-1);
                //announce item use
                if(announceStatusEffect){
                    objEmbed.fields = [
                        {
                            name:`✨Status Effect: ${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].name}`,
                            value:messageValue,
                            inline:true
                        }
                    ];
                    if(itemData[DBM_Item_Data.columns.img_url]!=null){
                        objEmbed.thumbnail = {
                            url:itemData[DBM_Item_Data.columns.img_url]
                        }
                    }
                }
                
                await interaction.reply({embeds:[new MessageEmbed(objEmbed)],ephemeral:true});
                break;
            case "shop":
                var userCardData = await CardModule.getCardUserStatusData(userId);

                var arrSaleDay = ["sat","sun"];
                var itemSale = false;
                var day = GlobalFunctions.getDayName();
                if(arrSaleDay.includes(day)) itemSale = true;

                var objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author: {
                        name: "Mofu shop",
                        icon_url: "https://waa.ai/JEwn.png"
                    }
                }

                switch(commandSubcommand){
                    case "view":
                        var itemSaleNotification = itemSale == true ? `\n\n✨**Special Offer:** It's **${day}sale**-day! I'm giving the discount sale price by 50% for all items!\n`:""; 
    
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? OR  
                        ${DBM_Item_Data.columns.category}=?`;
                        var result = await DBConn.conn.promise().query(query, [ItemModule.Properties.categoryData.card.value,ItemModule.Properties.categoryData.ingredient.value]);
                        
                        var arrPages = [];
                        var itemList1 = ""; var itemList2 = ""; var itemList3 = ""; var ctr = 0;
                        var maxCtr = 8; var pointerMaxData = result[0].length;
                        objEmbed.title = `Mofu Item Shop:`;
                        objEmbed.description = `Welcome to Mofushop! Here are the available item list that you can purchase:${itemSaleNotification}\nYour Mofucoin: **${userCardData[DBM_Card_User_Data.columns.mofucoin]}**`;
    
                        result[0].forEach(item => {
                            itemList1+=`**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`;
                            
                            if(itemSale){
                                itemList2+=`${Math.round(item[DBM_Item_Data.columns.price_mofucoin]/2)}\n`;
                            } else {
                                itemList2+=`${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
                            }
                            
                            itemList3+=`${item[DBM_Item_Data.columns.description]}\n`;
                            
                            //create pagination
                            if(pointerMaxData-1<=0||ctr>maxCtr){
                                objEmbed.fields = [
                                    {
                                        name:`ID - Name:`,
                                        value: itemList1,
                                        inline:true,
                                    },
                                    {
                                        name:`MC:`,
                                        value: itemList2,
                                        inline:true,
                                    },
                                    {
                                        name:`Description:`,
                                        value: itemList3,
                                        inline:true,
                                    }
                                ];
                                var msgEmbed = new MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                itemList1 = ""; itemList2 = ""; itemList3 = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        });
    
                        return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                        break;
                    case "buy":
                        objEmbed = {
                            color:CardModule.Properties.embedColor,
                            author : {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            }
                        }
        
                        var itemId = interaction.options._hoistedOptions[0].value;
                        var qty = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value : 1;

                        if(qty!=null&&isNaN(qty)){
                            objEmbed.description = `:x: Please enter valid quantity between 1-99`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(qty<=0||qty>=99){
                            objEmbed.description = `:x: Please enter valid quantity between 1-99`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        var allowedItem = `'${ItemModule.Properties.categoryData.card.value_search}',
                        '${ItemModule.Properties.categoryData.ingredient.value_search}'`;
                        //get current user stock
                        var currentStock = await ItemModule.getUserItemStock(userId,itemId);
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category} IN (${allowedItem}) AND 
                        ${DBM_Item_Data.columns.id}=? 
                        LIMIT 1`;
                        var itemData = await DBConn.conn.promise().query(query,[itemId]);
                        itemData = itemData[0][0];
                        
                        if(itemData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: Please enter the correct item ID.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        var mofucoin = userCardData[DBM_Card_User_Data.columns.mofucoin];
        
                        var itemDataPrice = itemData[DBM_Item_Data.columns.price_mofucoin]*qty;
                        if(itemSale){
                            itemDataPrice=Math.round(itemData[DBM_Item_Data.columns.price_mofucoin]/2)*qty;
                        }
                        var itemDataId = itemData[DBM_Item_Data.columns.id];
                        var itemDataName = itemData[DBM_Item_Data.columns.name];
        
                        if(currentStock+qty>=ItemModule.Properties.maxItem){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: Sorry, you cannot purchase **${itemDataId} - ${itemDataName}** anymore.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(mofucoin<itemDataPrice){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: Sorry, you need **${itemDataPrice} mofucoin** to purchase ${qty}x: **${itemDataId} - ${itemDataName}**`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgOk
                        }
                        objEmbed.description = `You have purchased ${qty}x: **${itemDataId} - ${itemDataName}** with **${itemDataPrice} mofucoin**.`;
                        
                        //update the mofucoin
                        await CardModule.updateMofucoin(userId,-itemDataPrice);
        
                        // //add the item inventory
                        await ItemModule.addNewItemInventory(userId,itemId,qty);
        
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        break;
                }
                break;
            case "sale":
                var objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author: {
                        name: "Hariham Harry",
                        icon_url: "https://cdn.discordapp.com/attachments/793415946738860072/827928547590668298/latest.png"
                    },
                    title:"Fragment Shop",
                    description:`Hariham Harry has returned from the future with fragments and has opened up shop again!\nBe quick, once someone buys a sale, it's gone! And remember, you can buy as many sale as you want, but can only buy up to 1 fragment type!`,
                    thumbnail:{
                        url:"https://cdn.discordapp.com/attachments/793415946738860072/827928547590668298/latest.png"
                    }
                }

                //format: sale token, sale date, sale list

                var guildData = await CardGuildModule.getCardGuildData(guildId);
                var arrItemShopList = []; var arrItemShopListStock = []; var salePrice = 100; var lastDate = -1; var createNew = false;
                var allSoldOut = false; var salePurchased = ""; var shopSaleToken = ""; var saleToken = ""; var lastSaleDate = "";
                var cardUserData = await CardModule.getCardUserStatusData(userId);

                if(guildData[DBM_Card_Guild.columns.sale_shop_data]!=null){
                    //exists
                    var jsonParsedData = JSON.parse(guildData[DBM_Card_Guild.columns.sale_shop_data]);
                    lastDate = jsonParsedData[ItemModule.Properties.saleData.last_date];

                    //calculate next time arrival
                    var future = new Date(lastDate);
                    future.setHours(0, 0, 0, 0);
                    future.setDate(future.getDate() + 2);

                    var timeRemaining = ( future.getTime() - new Date().getTime() ) / 1000 / 60;
                    var num = timeRemaining;
                    var hours = (num / 60);
                    var rhours = Math.floor(hours);
                    var minutes = (hours - rhours) * 60;
                    var rminutes = Math.round(minutes);
                    if(rhours<=0){
                        createNew = true; rhours = 48; rminutes = 0;
                    } else {
                        shopSaleToken = jsonParsedData[ItemModule.Properties.saleData.sale_token];
                        var saleList = jsonParsedData[ItemModule.Properties.saleData.sale_list];
                        Object.keys(saleList).forEach(function(key) {
                            arrItemShopList.push(key);
                            arrItemShopListStock.push(saleList[key]);
                        });
                    }

                    timeRemaining = rhours + " hour(s) and " + rminutes + " more minute(s)";

                    objEmbed.footer = {
                        text:`Next item sale will arrive at: ${timeRemaining}`
                    }
                }

                if(cardUserData[DBM_Card_User_Data.columns.sale_token]!=null){
                    var splittedUserTokenData = cardUserData[DBM_Card_User_Data.columns.sale_token].split(",");
                    saleToken = splittedUserTokenData[0];
                    if(saleToken!=shopSaleToken){
                        //new
                        saleToken = shopSaleToken;
                        salePurchased = "";
                    } else {
                        //exists
                        salePurchased = splittedUserTokenData[1];
                    }
                } else {
                    saleToken = shopSaleToken;
                    lastSaleDate = GlobalFunctions.getCurrentDate();
                    salePurchased = "";
                }

                var arrField = [];
                if(lastDate==-1||createNew){
                    //generate new
                    var query = `SELECT * 
                    FROM ${DBM_Item_Data.TABLENAME} 
                    WHERE ${DBM_Item_Data.columns.category}=? 
                    ORDER BY RAND() 
                    LIMIT 5`;
                    var result = await DBConn.conn.promise().query(query, [ItemModule.Properties.categoryData.misc_fragment.value]);
                    result = result[0]; var ctr = 1;
                    var saleList = "";
                    for(var i=0;i<result.length;i++){
                        var seriesData = result[i][DBM_Item_Data.columns.extra_data];
                        var seriesPoint = CardModule.Properties.seriesCardCore[seriesData].series_point;
                        arrField[i] = {
                            name:`Sale ${i+1}: ${result[i][DBM_Item_Data.columns.id]} - ${result[i][DBM_Item_Data.columns.name]} x5`,
                            value:`Price: ${salePrice} ${CardModule.Properties.seriesCardCore[seriesPoint].currency}/each`
                        }
                        saleList+=`"${result[i][DBM_Item_Data.columns.id]}":5,`;
                    }
                    saleList = saleList.replace(/,\s*$/, "");
                    objEmbed.fields = arrField;
                    
                    lastDate = GlobalFunctions.getCurrentDate();
                    // if(cardUserData[DBM_Card_User_Data.columns.sale_token]!=null){
                    //     saleToken = cardUserData[DBM_Card_User_Data.columns.sale_token];
                    // }
                    //generate guild sale shop data
                    var saleShopData = `{"${ItemModule.Properties.saleData.sale_token}":"${GlobalFunctions.randomNumber(100,5000)}","${ItemModule.Properties.saleData.last_date}":"${lastDate}","${ItemModule.Properties.saleData.sale_list}":{${saleList}}}`;
                    var parameterSet = new Map();
                    parameterSet.set(DBM_Card_Guild.columns.sale_shop_data,saleShopData);
                    var parameterWhere = new Map();
                    parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                    await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
                    objEmbed.footer = null;
                } else if(!createNew){
                    //show the available list
                    var filtered = arrItemShopListStock.filter(function (el) {
                        return el>0;
                    });
                    if(filtered.length<=0){
                        allSoldOut = true;
                    } else {
                        for(var i=0;i<arrItemShopList.length;i++){
                            var entry = arrItemShopList[i];
                            var entryStock = arrItemShopListStock[i];
                            if(entryStock>0){
                                var itemData = await ItemModule.getItemData(entry);
                                var seriesData = itemData[DBM_Item_Data.columns.extra_data];
                                var seriesPoint = CardModule.Properties.seriesCardCore[seriesData].series_point;
    
                                arrField[i] = {
                                    name:`Sale ${i+1}: ${itemData[DBM_Item_Data.columns.id]} - ${itemData[DBM_Item_Data.columns.name]} x${arrItemShopListStock[i]}`,
                                    value:`Price: ${salePrice} ${CardModule.Properties.seriesCardCore[seriesPoint].currency}/each`
                                }
                            } else {
                                arrField[i] = {
                                    name:`Sale ${i+1}: Sold Out!`,
                                    value:`❌`
                                }
                            }
                        }
    
                        objEmbed.fields = arrField;
                    }
                }

                //all sold out
                if(allSoldOut){
                    objEmbed.description = "All the item sale has been sold out.";
                    objEmbed.fields = null;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                switch(commandSubcommand){
                    case "buy":
                        objEmbed.fields = null; objEmbed.footer = null;
    
                        var selectedSaleNumber = interaction.options._hoistedOptions[0].value; //move to next args: selected sale number
                        if(isNaN(selectedSaleNumber)||selectedSaleNumber==null){
                            objEmbed.description = ":x: Please enter the valid sale number";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(arrItemShopList[selectedSaleNumber-1]==null||arrItemShopList[selectedSaleNumber-1]==""||arrItemShopListStock[selectedSaleNumber-1]<=0){
                            objEmbed.description = ":x: The selected sale number is not on the list/has been sold out.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(saleToken==shopSaleToken && salePurchased.includes(String(selectedSaleNumber-1))){
                            objEmbed.description = ":x: You're not allowed to buy the same sale item again.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
    
                        // console.log(saleToken);
                        // return;
    
                        var qty = 1;
                        var optionalQty = interaction.options._hoistedOptions[1].value; //move to next args
                        if(optionalQty<1){
                            objEmbed.description = ":x: Please re-enter the qty with valid amount.";
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(optionalQty!=null){
                            qty = optionalQty; salePrice*=qty;
                        }
    
                        //item shop stock validation
                        if(qty>arrItemShopListStock[selectedSaleNumber-1]){
                            objEmbed.description = `:x: You can only buy up to **${arrItemShopListStock[selectedSaleNumber-1]} ${arrItemShopList[selectedSaleNumber-1]}**.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        var itemData = await ItemModule.getItemData(arrItemShopList[selectedSaleNumber-1]);
                        var seriesData = itemData[DBM_Item_Data.columns.extra_data];
                        var seriesPoint = CardModule.Properties.seriesCardCore[seriesData].series_point;
        
                        if(cardUserData[seriesPoint]<salePrice){
                            objEmbed.description = `:x: You need ${salePrice} ${CardModule.Properties.seriesCardCore[seriesPoint].currency} to purchase ${qty}x sale number ${selectedSaleNumber}: **${itemData[DBM_Item_Data.columns.id]} - ${itemData[DBM_Item_Data.columns.name]}**.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }
        
                        objEmbed.description = `:white_check_mark: <@${userId}> has purchased ${qty}x sale number ${selectedSaleNumber}: **${itemData[DBM_Item_Data.columns.id]} - ${itemData[DBM_Item_Data.columns.name]}** with **${salePrice} ${CardModule.Properties.seriesCardCore[seriesPoint].currency}**.`;
        
                        //{"sale_token":"2239","last_date":"2021-04-04","sale_list":{"cfrg001":5,"cfrg011":0,"cfrg007":0,"cfrg004":5,"cfrg015":5}}
    
                        //update the series point
                        var parameterSeries = new Map();
                        parameterSeries.set(seriesPoint,-salePrice);
                        await CardModule.updateSeriesPoint(userId,parameterSeries);
    
                        salePurchased += selectedSaleNumber-1;
    
                        //update the sale token
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_User_Data.columns.sale_token,`${saleToken},${salePurchased}`);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
        
                        //update the item
                        await ItemModule.addNewItemInventory(userId,itemData[DBM_Item_Data.columns.id],qty);
        
                        //update the item sale data
                        var jsonParsedData = JSON.parse(guildData[DBM_Card_Guild.columns.sale_shop_data]);
                        jsonParsedData[ItemModule.Properties.saleData.sale_list][arrItemShopList[selectedSaleNumber-1]]-=qty;
                        guildData[DBM_Card_Guild.columns.sale_shop_data] = jsonParsedData;
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.sale_shop_data,JSON.stringify(jsonParsedData));
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                        break;
                }

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
        }
    }
}
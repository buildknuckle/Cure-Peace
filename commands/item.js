const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const ItemModule = require('../modules/Item');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');

module.exports = {
    name: 'item',
    cooldown: 5,
    description: 'Contains all item categories',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        switch(args[0]) {
            case "inventory":
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };
                objEmbed.title = `Item Inventory:`;
                objEmbed.author = {
                    name: userUsername,
                    icon_url: userAvatarUrl
                }

                var queryFilterInventory = "";
                var arrParameterized = [userId,0];
                if(args[1]!=null){
                    var itemFilter = args[1].toLowerCase();
                    if(itemFilter!="card"&&itemFilter!="food"&&itemFilter!="ingredient"){
                        objEmbed.description = ":x: Please enter the filter with: **card**/**food**/**ingredient**";
                        objEmbed.thumbnail = {
                            url:ItemModule.Properties.imgResponse.imgError
                        };
                        return message.channel.send({embed:objEmbed});
                    }

                    switch(itemFilter){
                        case "card":
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push("card");
                            break;
                        case "food":
                            queryFilterInventory+=` AND idat.${DBM_Item_Data.columns.category}=? `;
                            arrParameterized.push("food");
                            break;
                        case "ingredient":
                            queryFilterInventory+=` AND (idat.${DBM_Item_Data.columns.category}=? OR idat.${DBM_Item_Data.columns.category}=?) `;
                            arrParameterized.push("ingredient","ingredient_rare");
                            break;
                    }
                }

                var query = `select idat.${DBM_Item_Data.columns.id},idat.${DBM_Item_Data.columns.name}, 
                inv.${DBM_Item_Inventory.columns.stock} 
                from ${DBM_Item_Data.TABLENAME} idat 
                left join ${DBM_Item_Inventory.TABLENAME} inv 
                on inv.${DBM_Item_Inventory.columns.id_item}=idat.${DBM_Item_Data.columns.id} and 
                inv.${DBM_Item_Inventory.columns.id_user}=? and 
                inv.${DBM_Item_Inventory.columns.stock}>? ${queryFilterInventory} 
                where inv.${DBM_Item_Inventory.columns.stock}>? 
                order by inv.${DBM_Item_Inventory.columns.id_item}`;
                arrParameterized.push(0);
                
                var arrPages = []; var itemList = "";
                var inventoryUser = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 0; var maxCtr = 6; var pointerMaxData = inventoryUser[0].length;
                
                inventoryUser[0].forEach(entry => {
                    
                    itemList+=`**${entry[DBM_Item_Data.columns.id]} - ${entry[DBM_Item_Data.columns.name]}** x${entry[DBM_Item_Inventory.columns.stock]}\n`;
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `ID - Name - Stock:`,
                            value: itemList,
                        }];
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        itemList = ""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });

                if(arrPages.length<=0){
                    objEmbed.description = "You don't have any item yet...";
                    var msgEmbed = new Discord.MessageEmbed(objEmbed);
                    arrPages.push(msgEmbed);
                }

                pages = arrPages;

                paginationEmbed(message,pages);

                break;
            case "detail":
                var itemId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor
                }
                if(itemId==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the item ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //check if item ID exists/not
                var itemData = await ItemModule.getItemData(itemId);

                if(itemData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that item ID.";

                    return message.channel.send({embed:objEmbed});
                }

                //check if user have card/not
                var userItemStock = await ItemModule.getUserItemStock(userId,itemId);
                if(userItemStock<=0){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${itemData[DBM_Item_Data.columns.name]}** yet.`;
                    return message.channel.send({embed:objEmbed});
                }

                var objEmbedFields = [
                    {
                        name:`Category:`,
                        value:ItemModule.Properties.categoryTerm[itemData[DBM_Item_Data.columns.category]],
                        inline:true
                    }
                ]

                objEmbed.title = `${itemData[DBM_Item_Data.columns.name]}`;
                objEmbed.footer = {
                    text:`Item ID: ${itemData[DBM_Item_Data.columns.id]} | Stock: ${userItemStock}`
                }

                switch(itemData[DBM_Item_Data.columns.category]){
                    case "card":
                    case "food":
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
                            name:`Description`,
                            value:`${itemData[DBM_Item_Data.columns.description]}`,
                            inline:true
                        }
                        break;
                }

                if(objEmbedFields!=null){
                    objEmbed.fields = objEmbedFields;
                }

                return message.channel.send({embed:objEmbed});
                break;
            case "use":
                var userStatusData = await CardModule.getCardUserStatusData(userId);
                var currentStatusEffect = userStatusData[DBM_Card_User_Data.columns.status_effect];

                var itemId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
                }

                var currentStatusEffect = userStatusData[DBM_Card_User_Data.columns.status_effect];
                if(currentStatusEffect==CardModule.StatusEffect.debuffData.cardcaplock.value){
                    var embedStatusEffectActivated = await CardModule.StatusEffect.embedStatusEffectActivated(
                        userUsername,userAvatarUrl,currentStatusEffect,"debuff");
                    return message.channel.send({embed:embedStatusEffectActivated})
                }

                if(itemId==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the item ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //check if item ID exists/not
                var itemData = await ItemModule.getItemData(itemId);

                if(itemData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that item ID.";

                    return message.channel.send({embed:objEmbed});
                }

                //check if user have item/not
                var userItemStock = await ItemModule.getUserItemStock(userId,itemId);
                if(userItemStock<=0){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${itemData[DBM_Item_Data.columns.name]}** yet.`;
                    return message.channel.send({embed:objEmbed});
                }

                //category validator
                var unusableItemCategory = ["ingredient","ingredient_rare"];
                if(unusableItemCategory.includes(itemData[DBM_Item_Data.columns.category])){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: You cannot use this item.`;
                    return message.channel.send({embed:objEmbed});
                }

                var messageValue = `${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`;

                switch(itemData[DBM_Item_Data.columns.effect_data].toLowerCase()){
                    case CardModule.StatusEffect.buffData.clear_status_all.value:
                        //clear the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                        break;
                    // case CardModule.StatusEffect.buffData.second_chance.value:
                    //     //update the capture token
                    //     // var parameterSet = new Map();
                    //     // parameterSet.set(DBM_Card_User_Data.columns.spawn_token,null);
                    //     // var parameterWhere = new Map();
                    //     // parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                    //     // await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);
                    //     await CardModule.StatusEffect.updateStatusEffect(userId,itemData[DBM_Item_Data.columns.effect_data]);
                    //     break;
                    default:
                        //check for debuff status effect:
                        if(currentStatusEffect in CardModule.StatusEffect.debuffData){
                            if("recovery_item" in CardModule.StatusEffect.debuffData[currentStatusEffect]){
                                if(CardModule.StatusEffect.debuffData[currentStatusEffect].recovery_item.includes(
                                    itemData[DBM_Item_Data.columns.id])){
                                    //check for availability recovery item
                                    await CardModule.StatusEffect.updateStatusEffect(userId,null);
                                    messageValue = `Status Effect: ${CardModule.StatusEffect.debuffData[currentStatusEffect].name} has been removed.`;
                                } else {
                                    objEmbed.fields = [
                                        {
                                            name:"Cannot use this item",
                                            value:`:x: **${itemData[DBM_Item_Data.columns.name]}** cannot be used for this status effect.`,
                                            inline:true
                                        }
                                    ]
                                    return message.channel.send({embed:objEmbed});
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
                                    return message.channel.send({embed:objEmbed});
                                }
                            }
                        }

                        //update the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,itemData[DBM_Item_Data.columns.effect_data]);
                        break;
                }

                //update the item stock
                await ItemModule.updateItemStock(userId,itemId,-1);

                objEmbed.description = `<@${userId}> used the item: **${itemData[DBM_Item_Data.columns.name]}**.`;
                objEmbed.fields = [
                    {
                        name:`Status Effect: ${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].name}`,
                        value:messageValue,
                        inline:true
                    }
                ]
                
                return message.channel.send({embed:objEmbed});

                break;
            case "shop":
                var userCardData = await CardModule.getCardUserStatusData(userId);

                if(args[1]==null){
                    var objEmbed = {
                        color:CardModule.Properties.embedColor,
                        author: {
                            name: "Mofu shop",
                            icon_url: "https://waa.ai/JEwn.png"
                        }
                    }

                    var query = `SELECT * 
                    FROM ${DBM_Item_Data.TABLENAME} 
                    WHERE ${DBM_Item_Data.columns.category}<>? AND 
                    ${DBM_Item_Data.columns.category}<>?`;
                    var result = await DBConn.conn.promise().query(query, ["food","ingredient_rare"]);
                    
                    var arrPages = [];
                    var itemList1 = ""; var itemList2 = ""; var itemList3 = ""; var ctr = 0;
                    var maxCtr = 8; var pointerMaxData = result[0].length;
                    objEmbed.title = `Item Shop List:`;
                    objEmbed.description = `Welcome to Mofushop! Here are the available item list that you can purchase:\nUse **p!item shop buy <item id> [qty]** to purchase the item.\nYour Mofucoin: **${userCardData[DBM_Card_User_Data.columns.mofucoin]}**`;

                    result[0].forEach(item => {
                        itemList1+=`**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`;
                        itemList2+=`${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
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
                            var msgEmbed = new Discord.MessageEmbed(objEmbed);
                            arrPages.push(msgEmbed);
                            itemList1 = ""; itemList2 = ""; itemList3 = ""; ctr = 0;
                        } else {
                            ctr++;
                        }
                        pointerMaxData--;
                    });

                    // for(var i=0;i<arrPages.length;i++){
                    //     arrPages[i].fields[0]['name'] = `Progress: ${progressTotal}/${PinkyModule.Properties.maxPinky}`;
                    // }

                    return paginationEmbed(message,arrPages);

                } else if(args[1]!=null){
                    if(args[1].toLowerCase()!="buy"){
                        return message.channel.send({embed:{
                            color: CardModule.Properties.embedColor,
                            description:`Use **p!item shop buy <item id>** to buy the item.`
                        }})
                    }
                } else if(args[2]==null){
                    return message.channel.send({embed:{
                        color: CardModule.Properties.embedColor,
                        description:`Use **p!item shop buy <item id>** to buy the item.`
                    }})
                }

                objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author : {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
                }

                var itemId = args[2];
                var qty = args[3];
                if(qty!=null&&isNaN(qty)){
                    objEmbed.description = `:x: Please enter the quantity between 1-99`;
                    return message.channel.send({embed:objEmbed});
                } else if(qty<=0||qty>=99){
                    objEmbed.description = `:x: Please enter the quantity between 1-99`;
                    return message.channel.send({embed:objEmbed});
                } 
                
                if(qty==null){
                    qty = 1;
                }
                qty = parseInt(qty);//convert to int

                var allowedItem = "'card','ingredient'";
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
                    objEmbed.description = `:x: Sorry, that item is not purchasable on the shop.`;
                    return message.channel.send({embed:objEmbed});
                }

                var mofucoin = userCardData[DBM_Card_User_Data.columns.mofucoin];

                var itemDataPrice = itemData[DBM_Item_Data.columns.price_mofucoin]*qty;
                var itemDataId = itemData[DBM_Item_Data.columns.id];
                var itemDataName = itemData[DBM_Item_Data.columns.name];

                if(currentStock+qty>=ItemModule.Properties.maxItem){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry, you cannot purchase **${itemDataId} - ${itemDataName}** anymore.`;
                    return message.channel.send({embed:objEmbed});
                } else if(mofucoin<itemDataPrice){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry, you need **${itemDataPrice} mofucoin** to purchase ${qty}x: **${itemDataId} - ${itemDataName}**`;
                    return message.channel.send({embed:objEmbed});
                }

                objEmbed.thumbnail = {
                    url:CardModule.Properties.imgResponse.imgOk
                }
                objEmbed.description = `You have purchased ${qty}x: **${itemDataId} - ${itemDataName}** with **${itemDataPrice} mofucoin**.`;
                
                //update the mofucoin
                await CardModule.updateMofucoin(userId,-itemDataPrice);

                // //add the item inventory
                await ItemModule.addNewItemInventory(userId,itemId,qty);

                return message.channel.send({embed:objEmbed});
                break;
        }

    }
}
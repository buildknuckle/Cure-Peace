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

                var query = `select idat.${DBM_Item_Data.columns.id},idat.${DBM_Item_Data.columns.name}, 
                inv.${DBM_Item_Inventory.columns.stock} 
                from ${DBM_Item_Data.TABLENAME} idat 
                left join ${DBM_Item_Inventory.TABLENAME} inv 
                on inv.${DBM_Item_Inventory.columns.id_item}=idat.${DBM_Item_Data.columns.id} and 
                inv.${DBM_Item_Inventory.columns.id_user}=? and 
                inv.${DBM_Item_Inventory.columns.stock}>? 
                where inv.${DBM_Item_Inventory.columns.stock}>? 
                order by inv.${DBM_Item_Inventory.columns.id_item}`;
                var arrParameterized = [userId,0,0];
                
                var arrPages = []; var itemList = "";
                var inventoryUser = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 0; var maxCtr = 3; var pointerMaxData = inventoryUser[0].length;
                
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

                objEmbed.title = `${itemData[DBM_Item_Data.columns.name]}`;
                objEmbed.description = `${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`;

                var objEmbedFields = [{
                    name:`Item ID:`,
                    value:itemData[DBM_Item_Data.columns.id],
                    inline:true
                }];

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
                
                if(objEmbedFields!=null){
                    objEmbed.fields = objEmbedFields;
                }
                
                return message.channel.send({embed:objEmbed});

                break;
            
            case "use":
                var itemId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
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

                switch(itemData[DBM_Item_Data.columns.effect_data].toLowerCase()){
                    case "clear_status_all":
                        //clear the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,null);
                        break;
                    case "second_chance":
                        //update the capture token
                        // var parameterSet = new Map();
                        // parameterSet.set(DBM_Card_User_Data.columns.spawn_token,null);
                        // var parameterWhere = new Map();
                        // parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                        // await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                        await CardModule.StatusEffect.updateStatusEffect(userId,itemData[DBM_Item_Data.columns.effect_data]);
                        break;
                    default:
                        //update the status effect
                        await CardModule.StatusEffect.updateStatusEffect(userId,itemData[DBM_Item_Data.columns.effect_data]);
                        break;
                }

                //update the item stock
                await ItemModule.updateItemStock(userId,itemId,-1);

                objEmbed.fields = [
                    {
                        name:`Status Effect: ${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].name}`,
                        value:`${CardModule.StatusEffect.buffData[itemData[DBM_Item_Data.columns.effect_data]].description}`,
                        inline:true
                    }
                ]
                objEmbed.description = `<@${userId}> used the item: **${itemData[DBM_Item_Data.columns.name]}**.`;
                return message.channel.send({embed:objEmbed});

                break;
        }

    }
}
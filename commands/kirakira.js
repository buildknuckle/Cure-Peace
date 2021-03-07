const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const KirakiraModule = require('../modules/Kirakira');
const ItemModule = require('../modules/Item');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Kirakira_Recipe = require('../database/model/DBM_Kirakira_Recipe');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');

module.exports = {
    name: 'kirakira',
    cooldown: 5,
    description: 'Contains all kirakira categories',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        switch(args[0]) {
            case "recipe":
                var textVal = "";

                var query = `SELECT r.${DBM_Kirakira_Recipe.columns.id_item} as id_recipe,r.${DBM_Kirakira_Recipe.columns.difficulty}, idat.${DBM_Item_Data.columns.name}  
                FROM ${DBM_Kirakira_Recipe.TABLENAME} r 
                LEFT JOIN ${DBM_Item_Data.TABLENAME} idat ON 
                idat.${DBM_Item_Data.columns.id}=r.${DBM_Kirakira_Recipe.columns.id_item} 
                ORDER BY ${DBM_Kirakira_Recipe.columns.id_item} ASC`;
                var dataRecipe = await DBConn.conn.promise().query(query);
                dataRecipe[0].forEach(item => {
                    textVal+=`${item["id_recipe"]} - ${item[DBM_Item_Data.columns.name]}\n`;
                });

                var objEmbed ={
                    color: KirakiraModule.Properties.embedColor,
                    author: {
                        name: KirakiraModule.Properties.embedName
                    },
                    thumbnail:{
                        url:KirakiraModule.Properties.imgResponse.imgPekorin
                    },
                    title: "Kirakira Recipe",
                    description:`Here are the available recipe that you can create with **p!kirakira create <recipe id>** command:`,
                    fields:[
                        {
                            name:"Recipe List:",
                            value:textVal
                        }
                    ]
                };

                return message.channel.send({embed:objEmbed});
                break;
            case "detail":
                var recipeId = args[1];
                objEmbed = {
                    color:KirakiraModule.Properties.embedColor
                }
                if(recipeId==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the recipe ID.";
                    return message.channel.send({embed:objEmbed});
                }

                var recipeData = await KirakiraModule.getRecipeData(recipeId);

                //check if recipe ID exists/not
                if(recipeData==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that recipe ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //list all the ingredient & information
                var idIngredient = "";
                var splittedIngredient = recipeData[DBM_Kirakira_Recipe.columns.id_item_ingredient].split(",");
                splittedIngredient.forEach(item => {
                    idIngredient+=`'${item}',`;
                });
                idIngredient = idIngredient.replace(/,\s*$/, "");

                //get basic food data:
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Item_Data.columns.id,recipeId);
                var foodData = await DB.select(DBM_Item_Data.TABLENAME,parameterWhere);
                foodData = foodData[0][0];

                var query = `SELECT idat.${DBM_Item_Data.columns.id},idat.${DBM_Item_Data.columns.name},inv.${DBM_Item_Inventory.columns.id_user}  
                FROM ${DBM_Item_Data.TABLENAME} idat 
                LEFT JOIN ${DBM_Item_Inventory.TABLENAME} inv 
                ON (inv.${DBM_Item_Inventory.columns.id_item}=idat.${DBM_Item_Data.columns.id} AND 
                inv.${DBM_Item_Inventory.columns.stock}>=1) 
                WHERE idat.${DBM_Item_Data.columns.id} in (${idIngredient})`;
                var dataIngredient = await DBConn.conn.promise().query(query, idIngredient);
                var textIngredient = "";
                dataIngredient[0].forEach(item => {
                    var icon = "❌ ";
                    if(item[DBM_Item_Inventory.columns.id_user]!=null){
                        icon = "✅ ";
                    }
                    textIngredient+=`${icon}${item[DBM_Item_Data.columns.id]} - ${item[DBM_Item_Data.columns.name]}\n`;
                });

                //set the embeds
                objEmbed.title = `${foodData[DBM_Item_Data.columns.name]}`;
                objEmbed.description = `**Description**:\n⬆️ ${foodData[DBM_Item_Data.columns.description]}`;

                objEmbed.fields = [
                    {
                        name:"Ingredients:",
                        value:textIngredient,
                        inline:true
                    }
                ]
                
                objEmbed.footer = {
                    text:`Recipe ID: ${recipeId}`
                }

                return message.channel.send({embed:objEmbed});
                break;
            case "create":
            case "craft":
            case "synthesize":
                var recipeId = args[1];
                objEmbed = {
                    color:KirakiraModule.Properties.embedColor
                }

                if(recipeId==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the recipe ID.";
                    return message.channel.send({embed:objEmbed});
                }

                var recipeData = await KirakiraModule.getRecipeData(recipeId);

                //check if recipe ID exists/not
                if(recipeData==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that recipe ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //list all the ingredient & information
                var idIngredient = "";
                var splittedIngredient = recipeData[DBM_Kirakira_Recipe.columns.id_item_ingredient].split(",");
                splittedIngredient.forEach(item => {
                    idIngredient+=`'${item}',`;
                });
                idIngredient = idIngredient.replace(/,\s*$/, "");

                //get basic food data:
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Item_Data.columns.id,recipeId);
                var foodData = await DB.select(DBM_Item_Data.TABLENAME,parameterWhere);
                foodData = foodData[0][0];

                //check for ingredient
                var query = `SELECT idat.${DBM_Item_Data.columns.id},idat.${DBM_Item_Data.columns.name},inv.${DBM_Item_Inventory.columns.id_user}, 
                inv.${DBM_Item_Inventory.columns.stock} 
                FROM ${DBM_Item_Data.TABLENAME} idat 
                LEFT JOIN ${DBM_Item_Inventory.TABLENAME} inv 
                ON (inv.${DBM_Item_Inventory.columns.id_item}=idat.${DBM_Item_Data.columns.id} AND 
                inv.${DBM_Item_Inventory.columns.stock}>=1) 
                WHERE idat.${DBM_Item_Data.columns.id} in (${idIngredient})`;
                var dataIngredient = await DBConn.conn.promise().query(query, idIngredient);
                var textIngredient = ""; var createOk = true;
                dataIngredient[0].forEach(item => {
                    if(item[DBM_Item_Inventory.columns.id_user]==null){
                        textIngredient+=`${item[DBM_Item_Data.columns.id]} - ${item[DBM_Item_Data.columns.name]}\n`;
                        createOk = false;
                    }
                });

                if(!createOk){
                    objEmbed.author = {
                        iconURL:userAvatarUrl,
                        name:userUsername
                    }

                    objEmbed.title = foodData[DBM_Item_Data.columns.name];
                    objEmbed.description = ":x: Looks like you don't have the required ingredients to create this recipe.";

                    objEmbed.fields = [
                        {
                            name:"Missing Ingredients List:",
                            value:textIngredient,
                            inline:true
                        }
                    ]
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgFailed
                    }

                    return message.channel.send({embed:objEmbed});
                }

                //get current user stock
                var currentStock = await ItemModule.getUserItemStock(userId,foodData[DBM_Item_Data.columns.id]);
                if(currentStock+1>=ItemModule.Properties.maxItem){
                    objEmbed.thumbnail = {
                        url:ItemModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry, you cannot create **${foodData[DBM_Item_Data.columns.id]} - ${foodData[DBM_Item_Data.columns.name]}** anymore.`;
                    return message.channel.send({embed:objEmbed});
                }

                //remove the ingredient
                var query = `UPDATE ${DBM_Item_Inventory.TABLENAME} 
                SET ${DBM_Item_Inventory.columns.stock} = ${DBM_Item_Inventory.columns.stock}-1 
                WHERE ${DBM_Item_Inventory.columns.id_item} in (${idIngredient})`;
                var dataIngredient = await DBConn.conn.promise().query(query, idIngredient);

                // //add the food to inventory
                await ItemModule.addNewItemInventory(userId,foodData[DBM_Item_Inventory.columns.id],1);

                //embed
                var imgUrl = "";
                if(foodData[DBM_Item_Data.columns.img_url]!=null){
                    imgUrl = foodData[DBM_Item_Data.columns.img_url];
                }
                await message.channel.send({embed:KirakiraModule.Embeds.synthesizeComplete(userUsername,userAvatarUrl,foodData[DBM_Item_Data.columns.id],foodData[DBM_Item_Data.columns.name],foodData[DBM_Item_Data.columns.description],imgUrl)});

                break;
        }
    }
}
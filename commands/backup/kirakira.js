const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const KirakiraModule = require('../../modules/Kirakira');
const ItemModule = require('../../modules/Item');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const DBM_Kirakira_Recipe = require('../../database/model/DBM_Kirakira_Recipe');
const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');

module.exports = {
    name: 'kirakira',
    cooldown: 5,
    description: 'Contains all kirakira categories',
    args: true,
    options:[
        {
            name: "recipe",
            description: "Open kirakira recipe menu",
            type: 2,
            options: [
                {
                    name: "open-recipe-menu",
                    description: "Open kirakira recipe menu",
                    type: 1
                }
            ]
        },
        {
            name: "detail",
            description: "View detail of the kirakira recipe",
            type: 2,
            options: [
                {
                    name: "recipe",
                    description: "View detail of the kirakira recipe",
                    type: 1,
                    options:[
                        {
                            name:"id-recipe",
                            description:"Enter the recipe Id. Example: fo001",
                            type:3,
                            required:true
                        }
                    ]
                }
            ]
        },
        {
            name: "craft",
            description: "Craft kirakira recipe",
            type: 2,
            options:[
                {
                    name: "recipe",
                    description: "Craft kirakira recipe",
                    type: 1,
                    options:[
                        {
                            name:"id-recipe",
                            description:"Enter the recipe Id. Example: fo001",
                            type:3,
                            required:true
                        },
                        {
                            name:"qty",
                            description:"Enter the amount of food that you want to create",
                            type:4
                        }
                    ]
                }
            ]
        }
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
            color: KirakiraModule.Properties.embedColor
        };

        switch(command){
            case "recipe":
                var textVal = ""; var textVal2 = "";

                var query = `SELECT r.${DBM_Kirakira_Recipe.columns.id_item} as id_recipe,r.${DBM_Kirakira_Recipe.columns.difficulty}, idat.${DBM_Item_Data.columns.name},idat.${DBM_Item_Data.columns.description}    
                FROM ${DBM_Kirakira_Recipe.TABLENAME} r 
                LEFT JOIN ${DBM_Item_Data.TABLENAME} idat ON 
                idat.${DBM_Item_Data.columns.id}=r.${DBM_Kirakira_Recipe.columns.id_item} 
                ORDER BY ${DBM_Kirakira_Recipe.columns.id_item} ASC`;
                var dataRecipe = await DBConn.conn.promise().query(query);
                dataRecipe[0].forEach(item => {
                    textVal+=`${item["id_recipe"]} - ${item[DBM_Item_Data.columns.name]}\n`;
                    textVal2+=`${GlobalFunctions.cutText(item[DBM_Item_Data.columns.description],33)}\n`;
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
                    description:`Here are the available recipe that you can create with **kirakira craft** command:`,
                    fields:[
                        {
                            name:"Recipe List:",
                            value:textVal,inline:true
                        },
                        {
                            name:"Description:",
                            value:textVal2,inline:true
                        },
                    ]
                };

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
            case "detail":
                var recipeId = interaction.options._hoistedOptions[0].value;
                var recipeData = await KirakiraModule.getRecipeData(recipeId);

                //check if recipe ID exists/not
                if(recipeData==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that recipe ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                inv.${DBM_Item_Inventory.columns.stock}>=1 AND 
                inv.${DBM_Item_Inventory.columns.id_user}=?) 
                WHERE idat.${DBM_Item_Data.columns.id} in (${idIngredient})`;
                var dataIngredient = await DBConn.conn.promise().query(query, [userId]);
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

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
            case "craft":
                var recipeId = interaction.options._hoistedOptions[0].value;
                var qty = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                interaction.options._hoistedOptions[1].value : 1; //check for qty parameter

                if(qty<1){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the valid qty parameter.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                var recipeData = await KirakiraModule.getRecipeData(recipeId);

                //check if recipe ID exists/not
                if(recipeData==null){
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that recipe ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
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
                inv.${DBM_Item_Inventory.columns.stock}>=${qty} AND  
                inv.${DBM_Item_Inventory.columns.id_user}=?) 
                WHERE idat.${DBM_Item_Data.columns.id} in (${idIngredient})`;
                var dataIngredient = await DBConn.conn.promise().query(query, [userId]);
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
                    objEmbed.description = ":x: You don't have the required ingredients to create this recipe.";

                    objEmbed.fields = [
                        {
                            name:"Missing Ingredients List:",
                            value:textIngredient,
                            inline:true
                        }
                    ];
                    objEmbed.thumbnail = {
                        url:KirakiraModule.Properties.imgResponse.imgFailed
                    }

                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //get current food user stock
                var currentStock = await ItemModule.getUserItemStock(userId,foodData[DBM_Item_Data.columns.id]);
                if(currentStock+qty>=ItemModule.Properties.maxItem){
                    objEmbed.thumbnail = {
                        url:ItemModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: You cannot create **${foodData[DBM_Item_Data.columns.id]} - ${foodData[DBM_Item_Data.columns.name]}** anymore.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //remove the ingredient
                var query = `UPDATE ${DBM_Item_Inventory.TABLENAME} 
                SET ${DBM_Item_Inventory.columns.stock} = ${DBM_Item_Inventory.columns.stock}-${qty} 
                WHERE ${DBM_Item_Inventory.columns.id_item} in (${idIngredient}) AND 
                ${DBM_Item_Inventory.columns.id_user}=?`;
                var dataIngredient = await DBConn.conn.promise().query(query, [userId]);

                // //add the food to inventory
                await ItemModule.addNewItemInventory(userId,foodData[DBM_Item_Inventory.columns.id],qty);

                //embed
                var imgUrl = "";
                if(foodData[DBM_Item_Data.columns.img_url]!=null){
                    imgUrl = foodData[DBM_Item_Data.columns.img_url];
                }
                await interaction.reply({embeds:[
                    new MessageEmbed(KirakiraModule.Embeds.synthesizeComplete(userUsername,userAvatarUrl,foodData[DBM_Item_Data.columns.id],foodData[DBM_Item_Data.columns.name],foodData[DBM_Item_Data.columns.description],qty,imgUrl))
                ],ephemeral:true});
                break;
        }

    }
}
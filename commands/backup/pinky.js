const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModule = require('../../modules/Card');
const GlobalFunctions = require('../../modules/GlobalFunctions.js');
const CardGuildModule = require('../../modules/CardGuild');
const PinkyModule = require('../../modules/Pinky');
const ItemModule = require('../../modules/Item');

const DBM_Card_User_Data = require('../../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Guild = require('../../database/model/DBM_Card_Guild');
const DBM_Pinky_Data = require('../../database/model/DBM_Pinky_Data');
const DBM_Pinky_Inventory = require('../../database/model/DBM_Pinky_Inventory');
const DBM_Item_Data = require('../../database/model/DBM_Item_Data');
const { executeComponentButton } = require('./card');

module.exports = {
    name: 'pinky',
    cooldown: 5,
    description: 'Contains all pinky categories',
    args: true,
    options:[
        {
            name: "collet",
            description: "Open dream collet inventory",
            type: 2,
            options: [
                {
                    name: "open-collet-inventory",
                    description: "Open dream collet inventory",
                    type: 1
                }
            ]
        },
        {
            name: "detail",
            description: "View pinky information detail",
            type: 2,
            options: [
                {
                    name: "open-detail",
                    description: "View pinky information detail",
                    type: 1,
                    options: [
                        {
                            name: "pinky-id",
                            description: "Enter the pinky id. Example: pi001",
                            type: 3,
                            required:true
                        },
                    ]
                }
            ]
        },
    ],
	async executeMessage(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();
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
            color: CardModule.Properties.embedColor
        };

        switch(command){
            case "collet":
                objEmbed.title = `Dream Collet`;

                var pinkyList = "";
                var query = `select pd.${DBM_Pinky_Data.columns.id_pinky},pd.${DBM_Pinky_Data.columns.name},pd.${DBM_Pinky_Data.columns.img_url},inv.${DBM_Pinky_Inventory.columns.id_user}  
                from ${DBM_Pinky_Data.TABLENAME} pd 
                left join ${DBM_Pinky_Inventory.TABLENAME} inv 
                on pd.${DBM_Pinky_Data.columns.id_pinky}=inv.${DBM_Pinky_Inventory.columns.id_pinky} and 
                inv.${DBM_Pinky_Inventory.columns.id_guild}=?`;
                var arrParameterized = [guildId];
                
                var arrPages = [];
                var pinkyDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                // var cardDataInventory = await CardModule.getAllCardDataByPack(pack);
                var progressTotal = 0; var ctr = 0; var maxCtr = 3; var pointerMaxData = pinkyDataInventory[0].length;
                pinkyDataInventory[0].forEach(function(entry){
                    var icon = "❌ ";
                    //checkmark if card is owned
                    if(entry[DBM_Pinky_Inventory.columns.id_user]!=null){
                        icon = "✅ "; progressTotal++;
                    }
                    pinkyList+=`[${icon}${entry[DBM_Pinky_Data.columns.id_pinky]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})`;
                    if(entry[DBM_Pinky_Inventory.columns.id_user]!=null){
                        pinkyList+=` : <@${entry[DBM_Pinky_Inventory.columns.id_user]}>`;
                    }
                    pinkyList+="\n";

                    objEmbed.thumbnail = {
                        url:`https://static.wikia.nocookie.net/prettycure/images/1/1c/Dreamcol1.png`
                    };
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `Progress: ${progressTotal}/${PinkyModule.Properties.maxPinky}`,
                            value: pinkyList,
                        }];
                        var msgEmbed = new MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        pinkyList = ""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });

                for(var i=0;i<arrPages.length;i++){
                    arrPages[i].fields[0]['name'] = `Progress: ${progressTotal}/${PinkyModule.Properties.maxPinky}`;
                }

                if(progressTotal<PinkyModule.Properties.maxPinky){
                    arrPages[0].description = `Help Coco & Natts to capture all missing pinky!`;
                } else {
                    arrPages[0].description = `All the pinky has been captured! Thank you for restoring the Palmier Kingdom.`;
                }

                paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                break;
            case "detail":
                //get/view the card detail
                var pinkyId = interaction.options._hoistedOptions[0].value.toLowerCase();

                //check if card ID exists/not
                var pinkyData = await PinkyModule.getPinkyData(pinkyId);

                if(pinkyData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: I can't find that pinky ID.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //check if pinky captured/not
                var pinkyInventoryData = await PinkyModule.getPinkyInventoryData(guildId,pinkyId);
                if(pinkyInventoryData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Pinky: **${pinkyData[DBM_Pinky_Data.columns.name]}** need to be captured first.`;
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                objEmbed.title = `${pinkyData[DBM_Pinky_Data.columns.name]}`;
                objEmbed.fields = [
                    {
                        name:`Pinky ID:`,
                        value:`${pinkyData[DBM_Pinky_Data.columns.id_pinky]}`,
                        inline:true
                    },
                    {
                        name:`Category:`,
                        value:`${pinkyData[DBM_Pinky_Data.columns.category]}`,
                        inline:true
                    },
                    {
                        name:`Captured By:`,
                        value:`<@${pinkyInventoryData[DBM_Pinky_Inventory.columns.id_user]}>`,
                        inline:true
                    }
                ];
                objEmbed.thumbnail = {
                    url:pinkyData[DBM_Pinky_Data.columns.img_url]
                }
                objEmbed.footer = {
                    text:`Captured at: ${GlobalFunctions.convertDateTime(pinkyInventoryData[DBM_Pinky_Inventory.columns.created_at])}`
                }

                return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                break;
        }

    },
    async executeComponentButton(interaction){
        var customId = interaction.customId;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        //default embed:
        var objEmbed = {
            color: CardModule.Properties.embedColor,
            author: {
                iconURL:userAvatarUrl,
                name:userUsername
            }
        };
        var arrEmbedsSend = [];

        switch(customId){
            case "catch_pinky":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    data:guildSpawnData[DBM_Card_Guild.columns.spawn_data],
                    id:guildSpawnData[DBM_Card_Guild.columns.spawn_id]
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                spawnedCardData.token==null||
                (spawnedCardData.type=="normal" && spawnedCardData.data==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: There are no Pinky detected right now.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: You already used the capture command.";
                    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                //reward & validator
                switch(spawnedCardData.type){
                    case "number":
                        //check if card spawn is number
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current card spawn type is **number**. You need to use: **p!card guess <lower/higher>** to guess the next hidden number and capture the card.";
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    case "battle":
                        //check if card spawn is number
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgFailed
                        }
                        objEmbed.description = ":x: Tsunagarus are still wandering around! You need to battle it.";
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    case "color":
                    case "quiz":
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Current card spawn type was **${spawnedCardData.type}**.`;
                        return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                }

                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);

                var idPinky = jsonParsedSpawnData.id_pinky;
                var pinkyData = await PinkyModule.getPinkyData(idPinky);
                var cardData = await CardModule.getCardData(jsonParsedSpawnData.id_card);

                var colorPointReward = cardData[DBM_Card_Data.columns.rarity]*10;
                var textReward = `>${colorPointReward} ${cardData[DBM_Card_Data.columns.color]} color point\n`;
                var mofuCoinReward = cardData[DBM_Card_Data.columns.rarity]*10;

                var seriesPointReward = cardData[DBM_Card_Data.columns.rarity]*10;

                textReward += `>${mofuCoinReward} mofucoin\n`;
                textReward += `>${seriesPointReward} ${CardModule.Properties.seriesCardCore.sp003.currency}\n`;

                //update the item
                var query = `SELECT * 
                FROM ${DBM_Item_Data.TABLENAME} 
                WHERE ${DBM_Item_Data.columns.category}<>? 
                ORDER BY rand() 
                LIMIT 1`;
                var itemDropData = await DBConn.conn.promise().query(query,["misc_fragment"]);
                if(itemDropData[0][0]!=null){
                    textReward+=`>Item: ${itemDropData[0][0][DBM_Item_Data.columns.name]} **(${itemDropData[0][0][DBM_Item_Data.columns.id]})**\n`;
                    await ItemModule.addNewItemInventory(userId,itemDropData[0][0][DBM_Item_Data.columns.id]);
                }
                
                objEmbed.author = {
                    iconURL:userAvatarUrl,
                    name:userUsername
                },
                objEmbed.title = "Pinky Captured!";
                objEmbed.description = `<@${userId}> has captured the pinky: **${pinkyData[DBM_Pinky_Data.columns.name]}**!`;
                objEmbed.fields = [
                    {
                        name:"Rewards Received:",
                        value:textReward,
                        inline:true
                    }
                ]
                objEmbed.thumbnail = {
                    url:pinkyData[DBM_Pinky_Data.columns.img_url]
                }

                //add to pinky inventory
                await PinkyModule.addPinkyInventory(guildId,userId,idPinky);
                //get latest pinky total
                var currentPinky = await PinkyModule.getPinkyTotal(guildId);
                //update user mofucoin
                await CardModule.updateMofucoin(userId,mofuCoinReward);
                //update user token
                await CardModule.updateCatchAttempt(userId,spawnedCardData.token);
                //update color point
                var colorMap = new Map();
                colorMap.set(`color_point_${cardData[DBM_Card_Data.columns.color]}`,colorPointReward);
                await CardModule.updateColorPoint(userId,colorMap);
                //update series point
                var seriesMap = new Map();
                seriesMap.set(CardModule.Properties.seriesCardCore.sp003.value,seriesPointReward);
                await CardModule.updateSeriesPoint(userId,seriesMap);
                //erase pinky spawn data
                if(spawnedCardData.id==null){
                    await CardModule.removeCardGuildSpawn(guildId);
                } else {
                    await CardModule.removeCardGuildSpawn(guildId,false,false,true);
                }

                objEmbed.footer = {
                    text:`ID: ${idPinky} | Captured By: ${userUsername}(${currentPinky}/${PinkyModule.Properties.maxPinky})`
                }

                arrEmbedsSend.push(new MessageEmbed(objEmbed));

                //check for completionist status
                if(currentPinky>=PinkyModule.Properties.maxPinky){
                    var completion = await PinkyModule.pinkyCompletion(guildId);
                    if(completion!=null){
                        arrEmbedsSend.push(new MessageEmbed(completion));
                    }
                }

                await interaction.reply({embeds:arrEmbedsSend});

                break;
        }
    }
}
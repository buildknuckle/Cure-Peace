const {MessageActionRow, MessageButton, MessageEmbed, Discord, Message} = require('discord.js');
const DiscordStyles = require('../modules/DiscordStyles');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const ItemModule = require('../modules/Item');
const WeatherModule = require('../modules/Weather');
const GardenModule = require('../modules/Garden');
const CardGuildModule = require('../modules/CardGuild');
const CardModule = require('../modules/Card');
const UserModule = require('../modules/User');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_User_Data = require('../database/model/DBM_User_Data');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');

module.exports = {
    name: 'garden',
    cooldown: 5,
    description: 'Contains all gardening command categories',
    args: true,
    options:[
        {
            name: "shop",
            description: "Garden shop command",
            type: 2,
            options: [
                {
                    name: "view",
                    description: "Open garden shop menu",
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
    ],
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        // var members = message.guild.members;
        switch(args[0]) {
            case "shop":
                var userData = await CardModule.getCardUserStatusData(userId);
                var allowedItem = `'${ItemModule.Properties.categoryData.misc_gardening.value}'`;

                if(args[1]==null){
                    var objEmbed = {
                        color:CardModule.Properties.embedColor,
                        author: {
                            name: "Hanasaki Garden Shop",
                            icon_url: "https://cdn.discordapp.com/attachments/793415946738860072/853166970030260235/Prettycure.png"
                        }
                    }

                    var query = `SELECT * 
                    FROM ${DBM_Item_Data.TABLENAME} 
                    WHERE ${DBM_Item_Data.columns.category} IN (${allowedItem}) AND 
                    ${DBM_Item_Data.columns.is_purchasable_shop}=?`;
                    var result = await DBConn.conn.promise().query(query,[1]);
                    result = result[0];
                    
                    var arrPages = [];
                    var itemList1 = ""; var itemList2 = ""; var itemList3 = ""; var ctr = 0;
                    var maxCtr = 8; var pointerMaxData = result.length;
                    objEmbed.description = `Welcome to Hanasaki Garden Shop!\nUse **p!garden shop buy <item id> [qty]** to purchase the gardening item.\n\nYour Mofucoin: **${userData[DBM_Card_User_Data.columns.mofucoin]}**`;

                    result.forEach(item => {
                        itemList1+=`**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`;
                        itemList2+=`${item[DBM_Item_Data.columns.price_mofucoin]}\n`;                        
                        itemList3+=`${GlobalFunctions.cutText(item[DBM_Item_Data.columns.description],30)}\n`;
                        
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

                    return paginationEmbed(message,arrPages);

                } else if(args[1]!=null){
                    if(args[1].toLowerCase()!="buy"){
                        return message.channel.send({embed:{
                            color: GardenModule.Properties.embedColor,
                            description:`Use **p!garden shop buy <item id>** to buy the gardening item.`
                        }})
                    }
                } else if(args[2]==null){
                    return message.channel.send({embed:{
                        color: GardenModule.Properties.embedColor,
                        description:`Use **p!garden shop buy <item id>** to buy the gardening item.`
                    }})
                }

                objEmbed = {
                    color:GardenModule.Properties.embedColor,
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

                //get current user stock
                var currentStock = await ItemModule.getUserItemStock(userId,itemId);
                var query = `SELECT * 
                FROM ${DBM_Item_Data.TABLENAME} 
                WHERE ${DBM_Item_Data.columns.category} IN (${allowedItem}) AND 
                ${DBM_Item_Data.columns.id}=? AND ${DBM_Item_Data.columns.is_purchasable_shop}=? 
                LIMIT 1`;
                var itemData = await DBConn.conn.promise().query(query,[itemId,1]);
                itemData = itemData[0][0];
                
                if(itemData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Please enter the correct Item ID.`;
                    return message.channel.send({embed:objEmbed});
                }

                var mofucoin = userData[DBM_Card_User_Data.columns.mofucoin];

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
                    url:"https://cdn.discordapp.com/attachments/793415946738860072/853166970030260235/Prettycure.png"
                }
                objEmbed.description = `You have purchased ${qty}x: **${itemDataId} - ${itemDataName}** with **${itemDataPrice} mofucoin**.`;
                
                //update the mofucoin
                await CardModule.updateMofucoin(userId,-itemDataPrice);

                // //add the item inventory
                await ItemModule.addNewItemInventory(userId,itemId,qty);
                return message.channel.send({embed:objEmbed});

                break;
            case "detail":
            case "view":
                await GardenModule.processGardenTimelapse(userId);

                var gardenUserData = await UserModule.getUserStatusData(userId);
                var plotZone = "";

                var parsedGardenData = JSON.parse(gardenUserData[DBM_User_Data.columns.gardening_plot_data]);
                var gardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];
                parsedGardenData = parsedGardenData[GardenModule.Properties.propertyKey.plotData];

                var width = GardenModule.Properties.plotData[gardenSize].width;
                var height = GardenModule.Properties.plotData[gardenSize].height;

                //initialize the weather
                plotZone+=`**${GardenModule.Properties.plotData[gardenSize].name} Plot (${width}x${height}):**\n`;
                plotZone += `${WeatherModule.Properties.currentWeather.icon}`;
                for(var i=0;i<width;i++){
                    plotZone+=`${GardenModule.Properties.plotData[gardenSize].plotsetRow[i]}`;
                }
                plotZone+="\n";

                var ctr = 0; var arrFields = []; var arrPages = [];
                for (const [key, value] of Object.entries(parsedGardenData)){
                    for(var i=0;i<=width;i++){
                        if(i==0){
                            plotZone += `:regional_indicator_${GardenModule.Properties.plotData[gardenSize].plotsetColumn[ctr]}:`;
                        } else {
                            var rowData = value; var entry = rowData[i-1];
                            
                            var seeds = null; var plants = ""; var soil = "";
                            var infoBottom = ` `;
                            if(entry!=null){
                                seeds = entry[GardenModule.Properties.propertyKey.seeds];
                                soil = entry[GardenModule.Properties.propertyKey.soil];
                                soil = GardenModule.Properties.soilData[soil].name;

                                var futureDate = new Date(entry[GardenModule.Properties.propertyKey.lastTend]);
                                futureDate.setDate(futureDate.getDate()+1);

                                if(entry[GardenModule.Properties.propertyKey.progress_growth]>=100){
                                    //fully growth
                                    infoBottom=`✅**Harvest time!**`;
                                } else if(entry[GardenModule.Properties.propertyKey.wiltProgress]>=GardenModule.Properties.witheredProgress){
                                    infoBottom=`Withered...`;
                                } else {
                                    var timerTendLeft = GlobalFunctions.getDateTimeDifference(futureDate.getTime(),new Date().getTime());
                                    if(timerTendLeft.hours>0&&timerTendLeft.minutes>0){
                                        infoBottom=`⏱️${timerTendLeft.hours}H ${timerTendLeft.minutes}M`;
                                    } else {
                                        infoBottom=`❗Tend Required`;
                                    }
                                }
                            }

                            // var seedsData = ;
                            if(entry==null){
                                plotZone += `:x:`;
                            } else if(entry[GardenModule.Properties.propertyKey.progress_growth]>=100){
                                //fully growth
                                plotZone += `${GardenModule.Properties.plantData[seeds].icon}`;
                                plants += `${GardenModule.Properties.plantData[seeds].icon} **${GardenModule.Properties.plantData[seeds].name}**`;
                            } else if(entry[GardenModule.Properties.propertyKey.wiltProgress]>=GardenModule.Properties.wiltingProgressMax) {
                                //plant wilting
                                plotZone += `:wilted_rose:`;
                                plants = `:wilted_rose: **${GardenModule.Properties.plantData[seeds].name}**`;
                            } else if(entry[GardenModule.Properties.propertyKey.progress_growth]<100) {
                                //on growing
                                plotZone += `${GardenModule.Properties.plantData[seeds].icon_seedling}`;
                                plants += `${GardenModule.Properties.plantData[seeds].icon_seedling} **${GardenModule.Properties.plantData[seeds].name}**`;
                            }

                            //initialize the fields
                            arrFields[arrFields.length] = {
                                name:`${GlobalFunctions.capitalize(GardenModule.Properties.plotData[gardenSize].plotsetColumn[ctr])}${i} `,
                                value:``,
                                inline:true
                            };

                            if(entry==null){
                                arrFields[arrFields.length-1].value=`:x: No Plants`;
                            } else {
                                arrFields[arrFields.length-1].name += `[${entry[GardenModule.Properties.propertyKey.progress_growth]}%]`;
                                arrFields[arrFields.length-1].value=`${plants}\n${soil}\n${infoBottom}`;
                            }
                            arrFields[arrFields.length-1].name += `:`;
                        }
                    }

                    plotZone+=`\n`;
                    ctr++;
                }

                var objEmbed = {
                    color: GardenModule.Properties.embedColor,
                    author:{
                        iconURL:userAvatarUrl,
                        name: userUsername
                    },
                    title:`Garden Viewer`,
                    description:plotZone,
                    fields:[]
                };

                var ctr = 0;
                for(i=0;i<arrFields.length;i++){
                    objEmbed.fields[objEmbed.fields.length] = arrFields[i];
                    if(ctr>=8||i>=arrFields.length-1){
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        ctr = 0;
                        objEmbed.fields = [];
                    } else {
                        ctr++;
                    }
                }

                paginationEmbed(message,arrPages);
                
                // return message.channel.send({embed:objEmbed});

                break;
            case "upgrade":
                var cardUserData = await CardModule.getCardUserStatusData(userId);
                var userData = await UserModule.getUserStatusData(userId);
                var parsedGardenData = JSON.parse(userData[DBM_User_Data.columns.gardening_plot_data]);

                var allowed = [
                    GardenModule.Properties.plotData.medium.value_search,
                    GardenModule.Properties.plotData.large.value_search
                ];
                var selection = "";

                var filteredGardenOptions = Object.keys(GardenModule.Properties.plotData)
                .filter(key => allowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = GardenModule.Properties.plotData[key];
                    return obj;
                }, {});

                if(args[1]==null){
                    var objEmbed = {
                        color:GardenModule.Properties.embedColor,
                        author: {
                            name: "Hanasaki Garden Creation",
                            icon_url: "https://waa.ai/JEwn.png"
                        },
                        description: `Welcome to Hanasaki Garden Creation, you can upgrade your garden plot with **p!garden upgrade <medium/large>**\nYour Mofucoin: **${cardUserData[DBM_Card_User_Data.columns.mofucoin]}**\n\n**Available Upgrade List**:\n`
                    }

                    for(var i=0;i<allowed.length;i++){
                        var entry = filteredGardenOptions[allowed[i]];
                        objEmbed.description +=`>${entry.name} Plot (${entry.width}x${entry.height}): ${entry.price} MC\n`;
                    }

                    return message.channel.send({embed:objEmbed});
                }

                if(!allowed.includes(args[1].toLowerCase())){
                    return message.channel.send({embed:{
                        color:GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description: `:x: Please enter the valid upgrade options with: **p!garden upgrade <medium/large>**`
                    }});
                }

                selection = args[1].toLowerCase();
                var selectionData = GardenModule.Properties.plotData[selection];
                //garden size validation
                var currentGardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];
                var oldGardenSize = GardenModule.Properties.plotData[currentGardenSize].name;//for display text
                if(selectionData.num<=GardenModule.Properties.plotData[currentGardenSize].num){
                    return message.channel.send({embed:{
                        color:GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description: `:x: You cannot upgrade your garden into this size.`
                    }});
                }

                //mofucoin validation
                if(cardUserData[DBM_Card_User_Data.columns.mofucoin]<selectionData.price){
                    return message.channel.send({embed:{
                        color:GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description: `:x: You need **${selectionData.price} mofucoin** to upgrade into **${selectionData.name}** garden.`
                    }});
                }

                //update plot size
                for(var [key,value] of Object.entries(parsedGardenData[GardenModule.Properties.propertyKey.plotData])){
                    var lastIndex = Object.getOwnPropertyNames(value).length;

                    //add new index number
                    for(var i=lastIndex;i<selectionData.plotsetColumn.length;i++){
                        value[i] = null;
                    }
                }

                //add new alpha plot
                parsedGardenData[GardenModule.Properties.propertyKey.size] = selectionData.value;
                for(var i=lastIndex;i<selectionData.plotsetRow.length;i++){
                    parsedGardenData[GardenModule.Properties.propertyKey.plotData][selectionData.plotsetColumn[i]] = {};
                    var temp = parsedGardenData[GardenModule.Properties.propertyKey.plotData][selectionData.plotsetColumn[i]];
                    for(var j=0;j<selectionData.width;j++){
                        temp[j] = null;
                    }
                    parsedGardenData[GardenModule.Properties.propertyKey.plotData][selectionData.plotsetColumn[i]] = temp;
                }

                //update plot data
                var paramSet = new Map();
                paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                var paramWhere = new Map();
                paramWhere.set(DBM_User_Data.columns.id_user,userId);
                await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                //update mofucoin
                await CardModule.updateMofucoin(userId,-selectionData.price);

                return message.channel.send({embed:{
                    color:GardenModule.Properties.embedColor,
                    author:{
                        iconURL:userAvatarUrl,
                        name: userUsername
                    },
                    title:`Upgrade Complete!`,
                    description: `Your **${oldGardenSize} Garden** has been upgraded into **${selectionData.name} Garden** with **${selectionData.price}** mofucoin.`
                }});

                break;
            case "plant":
                var userGardenData = await UserModule.getUserStatusData(userId);
                var parsedGardenData = JSON.parse(userGardenData[DBM_User_Data.columns.gardening_plot_data]);

                var plotId = args[1]; var soilId = args[2]; var seedsId = args[3];
                if(plotId==null||soilId==null||seedsId==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the correct plant command format with:\n**p!garden plant <plot id> <soil id> <seeds id>**\nExample: **p!garden plant a1 gso001 gse001**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //plot address validation
                var parsedPlotData = parsedGardenData[GardenModule.Properties.propertyKey.plotData];
                var gardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];
                var plotCol = plotId[0].toLowerCase(); var plotRow = plotId[1];

                var plotError = true;
                if(plotCol in parsedPlotData){
                    if(parseInt(plotRow)>0&&parseInt(plotRow)<=GardenModule.Properties.plotData[gardenSize].width){
                        plotError = false;
                    }
                }

                if(plotError){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the valid plot ID with:\n**p!garden plant <plot id> <soil id> <seeds id>**\nExample: **p!garden plant a1 gso001 gse001**`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(parsedPlotData[plotCol][parseInt(plotRow)-1]!=null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Plot zone **${plotCol}${plotRow}** are not empty!`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //soil validation
                var soilData = await GardenModule.getGardeningItemData(soilId,GardenModule.Properties.subCategory.soil);
                if(soilData==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: I can't find that Soil ID`
                    };
                    return message.channel.send({embed:objEmbed});
                } else {
                    //check if user have the soil
                    var soilStock = await ItemModule.getUserItemStock(userId,soilId);
                    if(soilStock<=0){
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            description:`:x: You don't have **${soilData[DBM_Item_Data.columns.name]}** yet.`
                        };
                        return message.channel.send({embed:objEmbed});
                    }
                }

                //seeds validation
                var seedsData = await GardenModule.getGardeningItemData(seedsId,GardenModule.Properties.subCategory.seeds);
                if(seedsData==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: I can't find that Seeds ID`
                    };
                    return message.channel.send({embed:objEmbed});
                } else {
                    //check if user have the seeds
                    var seedsStock = await ItemModule.getUserItemStock(userId,seedsId);
                    if(seedsStock<=0){
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            description:`:x: You don't have **${seedsData[DBM_Item_Data.columns.name]}** yet.`
                        };
                        return message.channel.send({embed:objEmbed});
                    }
                }

                var objPlotData = {}

                //update soil stock
                objPlotData[GardenModule.Properties.propertyKey.seeds] = JSON.parse(seedsData[DBM_Item_Data.columns.extra_data])["value"];
                objPlotData[GardenModule.Properties.propertyKey.soil] = JSON.parse(soilData[DBM_Item_Data.columns.extra_data])["value"];
                objPlotData[GardenModule.Properties.propertyKey.lastTend] = null;
                objPlotData[GardenModule.Properties.propertyKey.lastProcess] = GlobalFunctions.getCurrentDateTime();
                objPlotData[GardenModule.Properties.propertyKey.lastFertilizer] = null;
                objPlotData[GardenModule.Properties.propertyKey.progress_growth] = 0;
                objPlotData[GardenModule.Properties.propertyKey.progress_crossbreeding] = 0;
                objPlotData[GardenModule.Properties.propertyKey.wiltProgress] = 0;

                parsedPlotData[plotCol][parseInt(plotRow)-1] = objPlotData;

                // parsedGardenData[GardenModule.Properties.propertyKey.plotData] = JSON.parse(parsedPlotData);
                // {"size":"medium","plotData":{"a":{"0":null,"1":null,"2":null,"3":null},"b":{"0":null,"1":null,"2":null,"3":null},"c":{"0":null,"1":null,"2":null,"3":null},"d":{"0":null,"1":null,"2":null,"3":null}}}

                //update plant data
                var paramSet = new Map();
                paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                var paramWhere = new Map();
                paramWhere.set(DBM_User_Data.columns.id_user,userId);
                await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                //update soil stock
                await ItemModule.updateItemStock(userId,soilData[DBM_Item_Data.columns.id],-1);

                // //update seeds stock
                await ItemModule.updateItemStock(userId,seedsData[DBM_Item_Data.columns.id],-1);

                var objEmbed = {
                    color: GardenModule.Properties.embedColor,
                    author:{
                        iconURL:userAvatarUrl,
                        name: userUsername
                    },
                    description:`🌱 Plot **${plotCol}${plotRow}** has been planted with new plant!\n>**Seeds**:${seedsData[DBM_Item_Data.columns.name]}\n>**Soil:** ${soilData[DBM_Item_Data.columns.name]}`
                };

                return message.channel.send({embed:objEmbed});

                break;
            case "weather":
                var minutes = GlobalFunctions.str_pad_left(Math.floor(WeatherModule.timerWeatherInformation.remaining / 60),'0',2);
                var seconds = GlobalFunctions.str_pad_left(WeatherModule.timerWeatherInformation.remaining - minutes * 60,'0',2);
                var timerLeft = `${minutes}:${seconds}`;
                
                var objEmbed = {
                    color: GardenModule.Properties.embedColor,
                    author:{
                        name: `Current Weather Status`
                    },
                    title:`${WeatherModule.Properties.currentWeather.icon} ${WeatherModule.Properties.currentWeather.name}`,
                    description:`**Plant growth rate:** ${GardenModule.Properties.growthData[WeatherModule.Properties.currentWeather.value].growth_min}-${GardenModule.Properties.growthData[WeatherModule.Properties.currentWeather.value].growth_max}%`,
                    footer:{
                        text:`🔁 Next Weather at: ${timerLeft}`
                    }
                };

                return message.channel.send({embed:objEmbed});
                break;
            case "tend":
                await GardenModule.processGardenTimelapse(userId);
                await message.delete();
                
                var userGardenData = await UserModule.getUserStatusData(userId);
                var parsedGardenData = JSON.parse(userGardenData[DBM_User_Data.columns.gardening_plot_data]);

                //plot address validation
                var parsedPlotData = parsedGardenData[GardenModule.Properties.propertyKey.plotData];
                var gardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];
                var weather = WeatherModule.Properties.currentWeather;//get current weather
                var plotId = args[1];
                if(plotId==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the correct plot ID with:\n**p!garden tend <plot id>**\nExample: **p!garden tend a1**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var plotCol = plotId[0]; var plotRow = plotId[1];
                if(plotCol!=null){
                    plotCol = plotCol.toLowerCase();
                }

                var plotError = true;
                if(plotCol in parsedPlotData){
                    if(parseInt(plotRow)>0&&parseInt(plotRow)<=GardenModule.Properties.plotData[gardenSize].width){
                        plotError = false;
                    }
                }

                if(plotError){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the valid plot ID with:\n**p!garden tend <plot id>**\nExample: **p!garden tend a1**`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(parsedPlotData[plotCol][parseInt(plotRow)-1]==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: You can't tend on empty plot zone!`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var selectedPlot = parsedPlotData[plotCol][parseInt(plotRow)-1];
                var selectedPlantData = GardenModule.Properties.plantData[selectedPlot[GardenModule.Properties.propertyKey.seeds]];
                if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]>=100){
                    //harvest time
                    //add harvest item to inventory
                    var txtHarvestReward = ``;
                    var crossbreedingPoint = selectedPlot[GardenModule.Properties.propertyKey.progress_crossbreeding];
                    var itemHarvestData = await ItemModule.getItemData(selectedPlantData.harvest_item);
                    await ItemModule.addNewItemInventory(userId,itemHarvestData[DBM_Item_Data.columns.id]);
                    txtHarvestReward+=`>**[${itemHarvestData[DBM_Item_Data.columns.id]}]** ${itemHarvestData[DBM_Item_Data.columns.name]} x1\n`;

                    //check for crossbreeding result reward
                    for(var i=0;i<selectedPlantData.crossbreedingData.length;i++){
                        var entry = selectedPlantData.crossbreedingData[i];
                        if(crossbreedingPoint>0){
                            var rnd = GlobalFunctions.randomNumber(1,crossbreedingPoint);
                            if(rnd>=entry.min_chance){
                                //add crossbreeding item reward
                                var itemHarvestData = await ItemModule.getItemData(entry.item);
                                txtHarvestReward+=`>**[${itemHarvestData[DBM_Item_Data.columns.id]}]** ${itemHarvestData[DBM_Item_Data.columns.name]} x1\n`;
                                await ItemModule.addNewItemInventory(userId,itemHarvestData[DBM_Item_Data.columns.id]);
                            }
                        }
                    }

                    //update/remove the plot
                    parsedPlotData[plotCol][parseInt(plotRow)-1] = null;

                    //update plot data
                    var paramSet = new Map();
                    paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                    var paramWhere = new Map();
                    paramWhere.set(DBM_User_Data.columns.id_user,userId);
                    await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        title: `Harvested: **${GlobalFunctions.capitalize(plotCol)}${plotRow} - ${selectedPlantData.name}**`,
                        description:`✅ **Harvest Result:**\n${txtHarvestReward}`
                    };
                    return message.channel.send({embed:objEmbed});

                } else if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]<100){
                    //get last tend date
                    var diffDays = 0;
                    if(selectedPlot[GardenModule.Properties.propertyKey.lastTend]!=null){
                        var date1 = new Date(selectedPlot[GardenModule.Properties.propertyKey.lastTend]);
                        var date2 = new Date(GlobalFunctions.getCurrentDateTime());
                        var diffTime = Math.abs(date2 - date1);
                        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))-1;
                    }

                    // var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))-1;
                    //check for withered               
                    if(selectedPlot[GardenModule.Properties.propertyKey.wiltProgress]>=GardenModule.Properties.witheredProgress){
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            title:`${GlobalFunctions.capitalize(plotCol)}${plotRow} has withered...`,
                            description:`:x: You can't tend on withered plant`
                        };
                        return message.channel.send({embed:objEmbed});
                    } else if(selectedPlot[GardenModule.Properties.propertyKey.lastTend]!=null&&
                        diffDays<1){
                        var futureDate = new Date(selectedPlot[GardenModule.Properties.propertyKey.lastTend]);
                        futureDate.setDate(futureDate.getDate()+1);
    
                        // var midnight = new Date();
                        // midnight.setHours(24, 0, 0, 0);
                        var remaining = GlobalFunctions.getDateTimeDifference(futureDate.getTime(),new Date().getTime());
                        timeRemaining = remaining.hours + " hour(s) and " + remaining.minutes + " more minute(s)";
    
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            title:`Tend cooldown: ${GlobalFunctions.capitalize(plotCol)}${parseInt(plotRow)}`,
                            description:`:x: Please wait for **${timeRemaining}**`
                        };
                        return message.channel.send({embed:objEmbed});
                    } else if(selectedPlot[GardenModule.Properties.propertyKey.lastTend]==null||
                        diffDays>=1){
                        //update last tend & process time
                        selectedPlot[GardenModule.Properties.propertyKey.lastTend] = GlobalFunctions.getCurrentDateTime();
                        selectedPlot[GardenModule.Properties.propertyKey.lastProcess] = GlobalFunctions.getCurrentDateTime();
                        selectedPlot[GardenModule.Properties.propertyKey.wiltProgress] = 0;//reset wilt progress
    
                        //add plant growth
                        var growthProgress = GlobalFunctions.randomNumber(GardenModule.Properties.growthData[weather.value].growth_min,GardenModule.Properties.growthData[weather.value].growth_max);
                        selectedPlot[GardenModule.Properties.propertyKey.progress_growth]+=growthProgress;
                        
                        if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]>=100){
                            //prevent from exceeding max
                            selectedPlot[GardenModule.Properties.propertyKey.progress_growth] = 100;
                        }
    
                        var paramSet = new Map();
                        paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                        var paramWhere = new Map();
                        paramWhere.set(DBM_User_Data.columns.id_user,userId);
                        await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                        if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]>=100){
                            //ready for harvest
                            await message.channel.send({embed:{
                                color: GardenModule.Properties.embedColor,
                                author:{
                                    iconURL:userAvatarUrl,
                                    name: userUsername
                                },
                                title:`✅ Harvest Time!`,
                                description:`**${GlobalFunctions.capitalize(plotCol)}${plotRow} : ${selectedPlantData.name}** ready to be harvested!`
                            }});
                        } else {
                            var objEmbed = await message.channel.send({embed:{
                                color: GardenModule.Properties.embedColor,
                                author:{
                                    iconURL:userAvatarUrl,
                                    name: userUsername
                                },
                                title:`✅ Plant tended!`,
                                description:`🌱**${GlobalFunctions.capitalize(plotCol)}${plotRow} : ${selectedPlantData.name}** has been tended!\n**Growth Progress:** ${selectedPlot[GardenModule.Properties.propertyKey.progress_growth]}% (+${growthProgress}%)`
                            }});
                            setTimeout(function() {
                                objEmbed.delete();
                            }, 8000);
                        }
                        
                    }
                }

                break;
            case "fertilize":
                await GardenModule.processGardenTimelapse(userId);

                var userGardenData = await UserModule.getUserStatusData(userId);
                var parsedGardenData = JSON.parse(userGardenData[DBM_User_Data.columns.gardening_plot_data]);

                //plot address validation
                var parsedPlotData = parsedGardenData[GardenModule.Properties.propertyKey.plotData];
                var gardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];
                var weather = WeatherModule.Properties.currentWeather;//get current weather
                var plotId = args[1]; var fertilizerId = args[2];
                if(plotId==null||fertilizerId==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the correct fertilize command with:\n**p!garden fertilize <plot id> <fertilizer id>**\nExample: **p!garden fertilize a1 gso001**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var plotCol = plotId[0]; var plotRow = plotId[1];
                if(plotCol!=null){
                    plotCol = plotCol.toLowerCase();
                }

                var plotError = true;
                if(plotCol in parsedPlotData){
                    if(parseInt(plotRow)>0&&parseInt(plotRow)<=GardenModule.Properties.plotData[gardenSize].width){
                        plotError = false;
                    }
                }

                if(plotError){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the valid fertilize command with:\n**p!garden fertilize <plot id> <fertilizer id>**\nExample: **p!garden fertilize a1 gso001**`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(parsedPlotData[plotCol][parseInt(plotRow)-1]==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: You can't use fertilizer on empty plot zone!`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //fertilizer validation
                var fertilizerData = await GardenModule.getGardeningItemData(fertilizerId,GardenModule.Properties.subCategory.fertilizer);
                if(fertilizerData==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: I can't find that Fertilizer ID`
                    };
                    return message.channel.send({embed:objEmbed});
                } else {
                    //check if user have the fertilizer
                    var fertilizerStock = await ItemModule.getUserItemStock(userId,fertilizerId);
                    if(fertilizerStock<=0){
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            description:`:x: You don't have **${fertilizerData[DBM_Item_Data.columns.name]}** yet.`
                        };
                        return message.channel.send({embed:objEmbed});
                    }
                }

                var selectedPlot = parsedPlotData[plotCol][parseInt(plotRow)-1];
                var selectedSoil = selectedPlot[GardenModule.Properties.propertyKey.soil];

                //soil validation
                if(GardenModule.Properties.soilData[selectedSoil].crossbreeding_rate<=0){
                    return message.channel.send({embed:{
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: You can't use **${fertilizerData[DBM_Item_Data.columns.name]}** on this soil.`
                    }});
                }

                var selectedPlantData = GardenModule.Properties.plantData[selectedPlot[GardenModule.Properties.propertyKey.seeds]];
                if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]>=100){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: This plant are ready to be harvested`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(selectedPlot[GardenModule.Properties.propertyKey.progress_growth]<100){
                    //get last fertilizer date
                    var date1 = new Date(GlobalFunctions.getCurrentDateTime());
                    var date2 = new Date(selectedPlot[GardenModule.Properties.propertyKey.lastFertilizer]);
                    date2.setHours(date2.getHours() + 1);
                    var diffTime = GlobalFunctions.getDateTimeDifference(date2,date1);

                    if(selectedPlot[GardenModule.Properties.propertyKey.wiltProgress]>=GardenModule.Properties.witheredProgress){
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            title:`${GlobalFunctions.capitalize(plotCol)}${plotRow} has withered...`,
                            description:`:x: You can't use the fertilizer on withered plant`
                        };
                        return message.channel.send({embed:objEmbed});
                    } else if(selectedPlot[GardenModule.Properties.propertyKey.lastFertilizer]!=null&&
                        (diffTime.hours>0||diffTime.minutes>0)){
                        timeRemaining = diffTime.hours + " hour(s) and " + diffTime.minutes + " minute(s)";
    
                        var objEmbed = {
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            title:`Fertilizer cooldown: ${GlobalFunctions.capitalize(plotCol)}${parseInt(plotRow)}`,
                            description:`:x: Please wait for **${timeRemaining}**`
                        };
                        return message.channel.send({embed:objEmbed});
                    } else {
                        var fertilizerValue = JSON.parse(fertilizerData[DBM_Item_Data.columns.extra_data])["value"];
                        //process
                        selectedPlot[GardenModule.Properties.propertyKey.lastFertilizer] = GlobalFunctions.getCurrentDateTime();

                        //update crossbreeding progress
                        var crossbreedingProgress = GlobalFunctions.randomNumber(GardenModule.Properties.fertilizerData[fertilizerValue].rate_min,GardenModule.Properties.fertilizerData[fertilizerValue].rate_max);
                        selectedPlot[GardenModule.Properties.propertyKey.progress_crossbreeding]+=crossbreedingProgress;

                        var paramSet = new Map();
                        paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                        var paramWhere = new Map();
                        paramWhere.set(DBM_User_Data.columns.id_user,userId);
                        await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                        //update the item stock
                        await ItemModule.updateItemStock(userId,fertilizerId,-1);

                        await message.channel.send({embed:{
                            color: GardenModule.Properties.embedColor,
                            author:{
                                iconURL:userAvatarUrl,
                                name: userUsername
                            },
                            title:`✅ Fertilizer used!`,
                            description:`🌱**${fertilizerData[DBM_Item_Data.columns.name]}** has been used on **${GlobalFunctions.capitalize(plotCol)}${plotRow} : ${selectedPlantData.name}**! (+${crossbreedingProgress}%)`
                        }});
                    }

                }

                break;
            case "remove":
                var userGardenData = await UserModule.getUserStatusData(userId);
                var parsedGardenData = JSON.parse(userGardenData[DBM_User_Data.columns.gardening_plot_data]);

                //plot address validation
                var parsedPlotData = parsedGardenData[GardenModule.Properties.propertyKey.plotData];
                var gardenSize = parsedGardenData[GardenModule.Properties.propertyKey.size];

                var plotId = args[1];
                if(plotId==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the correct plot removal command with:\n**p!garden remove <plot id>**\nExample: **p!garden remove a1**`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var plotCol = plotId[0]; var plotRow = plotId[1];
                if(plotCol!=null){
                    plotCol = plotCol.toLowerCase();
                }

                var plotError = true;
                if(plotCol in parsedPlotData){
                    if(parseInt(plotRow)>0&&parseInt(plotRow)<=GardenModule.Properties.plotData[gardenSize].width){
                        plotError = false;
                    }
                }

                if(plotError){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: Please enter the correct plot removal command with:\n**p!garden remove <plot id>**\nExample: **p!garden remove a1**`
                    };
                    return message.channel.send({embed:objEmbed});
                } else if(parsedPlotData[plotCol][parseInt(plotRow)-1]==null){
                    var objEmbed = {
                        color: GardenModule.Properties.embedColor,
                        author:{
                            iconURL:userAvatarUrl,
                            name: userUsername
                        },
                        description:`:x: That garden plot is empty.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //update plot data
                parsedPlotData[plotCol][parseInt(plotRow)-1] = null;

                var paramSet = new Map();
                paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
                var paramWhere = new Map();
                paramWhere.set(DBM_User_Data.columns.id_user,userId);
                await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);

                //send embed
                await message.channel.send({embed:{
                    color: GardenModule.Properties.embedColor,
                    author:{
                        iconURL:userAvatarUrl,
                        name: userUsername
                    },
                    title:`Plot Removed!`,
                    description:`Garden Plot **${GlobalFunctions.capitalize(plotCol)}${plotRow}** has been removed.`
                }});

                await GardenModule.processGardenTimelapse(userId);
                break;
            case "exchange":
                var objEmbed = {
                    color:GardenModule.Properties.embedColor,
                    author : {
                        name: "Kaoruko Hanasaki",
                        icon_url: "https://cdn.myanimelist.net/images/characters/3/92147.jpg"
                    },
                    description:`Welcome to the exchange counter, <@${userId}>\nUse **p!garden exchange <plant id>** to exchange the plants with various special rewards.`
                }

                var userData = await CardModule.getCardUserStatusData(userId);
                var plantId = args[1];
                if(plantId==null){
                    var exchangeData = {
                        "pl001":">300 set color points\n>3x random card fragment",
                        "pl002":">230 set series points\n>2x series card fragment",
                        "pl003":">350 overall color points\n>350 overall series points\n>3x series card fragment",
                        "pl004":">400 overall color points\n>400 overall series points\n>4x random card fragment",
                        "pl005":">7x series card fragment",
                        "pl006":">500 overall series points\n>500 overall color points\n>6x random card fragment",
                        "pl007":">700 overall series points\n>700 overall color points\n>5x series card fragment",
                    }

                    var arrPages = []; var ctr = 1;
                    for (var key in exchangeData) {
                        var itemData = await ItemModule.getItemData(key);
                        objEmbed.title = `${ctr}. [${itemData[DBM_Item_Data.columns.id]}] ${itemData[DBM_Item_Data.columns.name]}`;
                        objEmbed.fields = {
                            name:"Rewards:",
                            value:`${exchangeData[key]}`
                        };
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        ctr++;
                    }

                    return paginationEmbed(message,arrPages);
                }

                plantId = plantId.toLowerCase();

                var plantData = await ItemModule.getItemData(plantId);
                var itemStock = await ItemModule.getUserItemStock(userId,plantId);

                if(plantData==null){
                    objEmbed.description = `:x: I can't find that plant Id.`;
                    return message.channel.send({embed:objEmbed});
                }

                //stock validation
                if(itemStock<=0){
                    objEmbed.description = `:x: You need 1x **${plantData[DBM_Item_Data.columns.id]} - ${plantData[DBM_Item_Data.columns.name]}**.`;
                    return message.channel.send({embed:objEmbed});
                }

                var txtRewards = "";
                var selectedSeries = CardModule.Properties.seriesCardCore[userData[DBM_Card_User_Data.columns.series_set]].pack;
                var currency = CardModule.Properties.seriesCardCore[userData[DBM_Card_User_Data.columns.series_set]].currency;

                switch(plantData[DBM_Item_Data.columns.id]){
                    case "pl001":
                        //>300 set color points\n>3x random card fragment
                        //update color points
                        var pointRewardColor = 300;
                        txtRewards+=`>${pointRewardColor} ${userData[DBM_Card_User_Data.columns.color]} color points\n`;
                        
                        var objColor = new Map();
                        objColor.set(`color_point_${userData[DBM_Card_User_Data.columns.color]}`,pointRewardColor);
                        await CardModule.updateColorPoint(userId,objColor);

                        //select 3 random card fragment
                        var qtyRewards = 3;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? 
                        ORDER BY rand() LIMIT ${qtyRewards}`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value]);
                        fragmentData = fragmentData[0];

                        for(var i=0;i<fragmentData.length;i++){
                            var entry = fragmentData[i];
                            txtRewards+=`>1x **[${entry[DBM_Item_Data.columns.id]}]** ${entry[DBM_Item_Data.columns.name]}\n`;
                            //add the items
                            await ItemModule.addNewItemInventory(userId,entry[DBM_Item_Data.columns.id]);
                        }
                        
                        break;
                    case "pl002":
                        //>230 set series points\n>2x series card fragment
                        //update series points
                        var pointRewardSeries = 230;
                        var objSeries = new Map();
                        objSeries.set(`${userData[DBM_Card_User_Data.columns.series_set]}`,pointRewardSeries);
                        await CardModule.updateSeriesPoint(userId,objSeries);
                        txtRewards+=`>${pointRewardSeries} ${currency} points\n`;

                        //select & add 2 series fragment
                        var qtyRewards = 2;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? AND 
                        ${DBM_Item_Data.columns.extra_data}=?`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value,selectedSeries]);
                        fragmentData = fragmentData[0][0];

                        await ItemModule.addNewItemInventory(userId,fragmentData[DBM_Item_Data.columns.id],qtyRewards);
                        txtRewards+=`>${qtyRewards}x **[${fragmentData[DBM_Item_Data.columns.id]}]** ${fragmentData[DBM_Item_Data.columns.name]}\n`;

                        break;
                    case "pl003":
                        //>350 overall color points\n>350 overall series points\n>3x series card fragment
                        var pointRewardColor = 350; var pointRewardSeries = 350;
                        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${pointRewardColor},  
                        ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${pointRewardColor},
                        ${DBM_Card_User_Data.columns.sp001} = ${DBM_Card_User_Data.columns.sp001}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp002} = ${DBM_Card_User_Data.columns.sp002}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp003} = ${DBM_Card_User_Data.columns.sp003}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp004} = ${DBM_Card_User_Data.columns.sp004}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp005} = ${DBM_Card_User_Data.columns.sp005}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp006} = ${DBM_Card_User_Data.columns.sp006}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp007} = ${DBM_Card_User_Data.columns.sp007}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp008} = ${DBM_Card_User_Data.columns.sp008}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp009} = ${DBM_Card_User_Data.columns.sp009}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp010} = ${DBM_Card_User_Data.columns.sp010}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp011} = ${DBM_Card_User_Data.columns.sp011}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp012} = ${DBM_Card_User_Data.columns.sp012}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp013} = ${DBM_Card_User_Data.columns.sp013}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp014} = ${DBM_Card_User_Data.columns.sp014}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp015} = ${DBM_Card_User_Data.columns.sp015}+${pointRewardSeries} 
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        await DBConn.conn.promise().query(query,[userId]);
                        txtRewards+=`>${pointRewardColor} overall color points\n`;
                        txtRewards+=`>${pointRewardSeries} overall series points\n`;

                        //select & add 3 series fragment
                        var qtyRewards = 3;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? AND 
                        ${DBM_Item_Data.columns.extra_data}=?`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value,selectedSeries]);
                        fragmentData = fragmentData[0][0];

                        await ItemModule.addNewItemInventory(userId,fragmentData[DBM_Item_Data.columns.id],qtyRewards);
                        txtRewards+=`>${qtyRewards}x [${fragmentData[DBM_Item_Data.columns.id]}] ${fragmentData[DBM_Item_Data.columns.name]}\n`;

                        break;
                    case "pl004":
                        //>400 overall color points\n>400 overall series points\n>4x random card fragment
                        var pointRewardColor = 400; var pointRewardSeries = 400;
                        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${pointRewardColor},  
                        ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${pointRewardColor},
                        ${DBM_Card_User_Data.columns.sp001} = ${DBM_Card_User_Data.columns.sp001}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp002} = ${DBM_Card_User_Data.columns.sp002}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp003} = ${DBM_Card_User_Data.columns.sp003}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp004} = ${DBM_Card_User_Data.columns.sp004}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp005} = ${DBM_Card_User_Data.columns.sp005}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp006} = ${DBM_Card_User_Data.columns.sp006}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp007} = ${DBM_Card_User_Data.columns.sp007}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp008} = ${DBM_Card_User_Data.columns.sp008}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp009} = ${DBM_Card_User_Data.columns.sp009}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp010} = ${DBM_Card_User_Data.columns.sp010}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp011} = ${DBM_Card_User_Data.columns.sp011}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp012} = ${DBM_Card_User_Data.columns.sp012}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp013} = ${DBM_Card_User_Data.columns.sp013}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp014} = ${DBM_Card_User_Data.columns.sp014}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp015} = ${DBM_Card_User_Data.columns.sp015}+${pointRewardSeries} 
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        await DBConn.conn.promise().query(query,[userId]);
                        txtRewards+=`>${pointRewardColor} overall color points\n`;
                        txtRewards+=`>${pointRewardSeries} overall series points\n`;

                        //select 4 random card fragment
                        var qtyRewards = 4;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? 
                        ORDER BY rand() LIMIT ${qtyRewards}`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value]);
                        fragmentData = fragmentData[0];

                        for(var i=0;i<fragmentData.length;i++){
                            var entry = fragmentData[i];
                            txtRewards+=`>1x **[${entry[DBM_Item_Data.columns.id]}]** ${entry[DBM_Item_Data.columns.name]}\n`;
                            //add the items
                            await ItemModule.addNewItemInventory(userId,entry[DBM_Item_Data.columns.id]);
                        }

                        break;
                    case "pl005":
                        //>7x series card fragment
                        //select & add 7 series fragment
                        var qtyRewards = 7;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? AND 
                        ${DBM_Item_Data.columns.extra_data}=?`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value,selectedSeries]);
                        fragmentData = fragmentData[0][0];

                        await ItemModule.addNewItemInventory(userId,fragmentData[DBM_Item_Data.columns.id],qtyRewards);
                        txtRewards+=`>${qtyRewards}x **[${fragmentData[DBM_Item_Data.columns.id]}]** ${fragmentData[DBM_Item_Data.columns.name]}\n`;

                        break;
                    case "pl006":
                        //>500 overall series points\n>500 overall color points\n>6x random card fragment
                        var pointRewardColor = 500; var pointRewardSeries = 500;
                        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${pointRewardColor},  
                        ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${pointRewardColor},
                        ${DBM_Card_User_Data.columns.sp001} = ${DBM_Card_User_Data.columns.sp001}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp002} = ${DBM_Card_User_Data.columns.sp002}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp003} = ${DBM_Card_User_Data.columns.sp003}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp004} = ${DBM_Card_User_Data.columns.sp004}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp005} = ${DBM_Card_User_Data.columns.sp005}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp006} = ${DBM_Card_User_Data.columns.sp006}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp007} = ${DBM_Card_User_Data.columns.sp007}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp008} = ${DBM_Card_User_Data.columns.sp008}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp009} = ${DBM_Card_User_Data.columns.sp009}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp010} = ${DBM_Card_User_Data.columns.sp010}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp011} = ${DBM_Card_User_Data.columns.sp011}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp012} = ${DBM_Card_User_Data.columns.sp012}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp013} = ${DBM_Card_User_Data.columns.sp013}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp014} = ${DBM_Card_User_Data.columns.sp014}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp015} = ${DBM_Card_User_Data.columns.sp015}+${pointRewardSeries} 
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        await DBConn.conn.promise().query(query,[userId]);
                        txtRewards+=`>${pointRewardColor} overall color points\n`;
                        txtRewards+=`>${pointRewardSeries} overall series points\n`;

                        //select 6 random card fragment
                        var qtyRewards = 6;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? 
                        ORDER BY rand() LIMIT ${qtyRewards}`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value]);
                        fragmentData = fragmentData[0];

                        for(var i=0;i<fragmentData.length;i++){
                            var entry = fragmentData[i];
                            txtRewards+=`>1x **[${entry[DBM_Item_Data.columns.id]}]** ${entry[DBM_Item_Data.columns.name]}\n`;
                            //add the items
                            await ItemModule.addNewItemInventory(userId,entry[DBM_Item_Data.columns.id]);
                        }

                        break;
                    case "pl007":
                        //>700 overall series points\n>700 overall color points\n>5x series card fragment
                        var pointRewardColor = 700; var pointRewardSeries = 700;
                        var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                        SET ${DBM_Card_User_Data.columns.color_point_pink} = ${DBM_Card_User_Data.columns.color_point_pink}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_blue} = ${DBM_Card_User_Data.columns.color_point_blue}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_green} = ${DBM_Card_User_Data.columns.color_point_green}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_purple} = ${DBM_Card_User_Data.columns.color_point_purple}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_red} = ${DBM_Card_User_Data.columns.color_point_red}+${pointRewardColor},  
                        ${DBM_Card_User_Data.columns.color_point_white} = ${DBM_Card_User_Data.columns.color_point_white}+${pointRewardColor}, 
                        ${DBM_Card_User_Data.columns.color_point_yellow} = ${DBM_Card_User_Data.columns.color_point_yellow}+${pointRewardColor},
                        ${DBM_Card_User_Data.columns.sp001} = ${DBM_Card_User_Data.columns.sp001}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp002} = ${DBM_Card_User_Data.columns.sp002}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp003} = ${DBM_Card_User_Data.columns.sp003}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp004} = ${DBM_Card_User_Data.columns.sp004}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp005} = ${DBM_Card_User_Data.columns.sp005}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp006} = ${DBM_Card_User_Data.columns.sp006}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp007} = ${DBM_Card_User_Data.columns.sp007}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp008} = ${DBM_Card_User_Data.columns.sp008}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp009} = ${DBM_Card_User_Data.columns.sp009}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp010} = ${DBM_Card_User_Data.columns.sp010}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp011} = ${DBM_Card_User_Data.columns.sp011}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp012} = ${DBM_Card_User_Data.columns.sp012}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp013} = ${DBM_Card_User_Data.columns.sp013}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp014} = ${DBM_Card_User_Data.columns.sp014}+${pointRewardSeries},
                        ${DBM_Card_User_Data.columns.sp015} = ${DBM_Card_User_Data.columns.sp015}+${pointRewardSeries} 
                        WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                        await DBConn.conn.promise().query(query,[userId]);
                        txtRewards+=`>${pointRewardColor} overall color points\n`;
                        txtRewards+=`>${pointRewardSeries} overall series points\n`;

                        //select & add 5 series fragment
                        var qtyRewards = 5;
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category}=? AND 
                        ${DBM_Item_Data.columns.extra_data}=?`;
                        var fragmentData = await DBConn.conn.promise().query(query,[ItemModule.Properties.categoryData.misc_fragment.value,selectedSeries]);
                        fragmentData = fragmentData[0][0];

                        await ItemModule.addNewItemInventory(userId,fragmentData[DBM_Item_Data.columns.id],qtyRewards);
                        txtRewards+=`>${qtyRewards}x [${fragmentData[DBM_Item_Data.columns.id]}] ${fragmentData[DBM_Item_Data.columns.name]}\n`;

                        break;
                }

                //substract/update the plant stocks
                await ItemModule.updateItemStock(userId,plantData[DBM_Item_Data.columns.id],-1);

                await CardModule.limitizeUserPoints();

                await message.channel.send({embed:{
                    color:GardenModule.Properties.embedColor,
                    author : {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    },
                    thumbnail:{
                        url:"https://cdn.myanimelist.net/images/characters/3/92147.jpg"
                    },
                    description:`<@${userId}> has exchanged 1x **${plantData[DBM_Item_Data.columns.name]}**.`,
                    fields: {
                        name:"Received:",
                        value:txtRewards
                    },
                }});

                break;
        }
    },
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        switch(command){
            case "shop":
                var userData = await CardModule.getCardUserStatusData(userId);
                var allowedItem = `'${ItemModule.Properties.categoryData.misc_gardening.value}'`;

                var objEmbed = {
                    color:CardModule.Properties.embedColor,
                    author: {
                        name: "Hanasaki Garden Shop",
                        icon_url: "https://cdn.discordapp.com/attachments/793415946738860072/853166970030260235/Prettycure.png"
                    }
                }

                switch(commandSubcommand){
                    case "view":
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category} IN (${allowedItem}) AND 
                        ${DBM_Item_Data.columns.is_purchasable_shop}=?`;
                        var result = await DBConn.conn.promise().query(query,[1]);
                        result = result[0];
                        
                        var arrPages = [];
                        var itemList1 = ""; var itemList2 = ""; var itemList3 = ""; var ctr = 0;
                        var maxCtr = 8; var pointerMaxData = result.length;
                        objEmbed.description = `Welcome to Hanasaki Garden Shop!\nYour Mofucoin: **${userData[DBM_Card_User_Data.columns.mofucoin]}**`;

                        result.forEach(item => {
                            itemList1+=`**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`;
                            itemList2+=`${item[DBM_Item_Data.columns.price_mofucoin]}\n`;                        
                            itemList3+=`${GlobalFunctions.cutText(item[DBM_Item_Data.columns.description],30)}\n`;
                            
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
                            color:GardenModule.Properties.embedColor,
                            author : {
                                name: userUsername,
                                icon_url: userAvatarUrl
                            }
                        }

                        var itemId = interaction.options._hoistedOptions[0].value;
                        var qty = interaction.options._hoistedOptions.hasOwnProperty(1) ? 
                        interaction.options._hoistedOptions[1].value:1;
                        if(qty<=0||qty>=99){
                            objEmbed.description = `:x: Please enter valid quantity`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } 
                        
                        //get current user stock
                        var currentStock = await ItemModule.getUserItemStock(userId,itemId);
                        var query = `SELECT * 
                        FROM ${DBM_Item_Data.TABLENAME} 
                        WHERE ${DBM_Item_Data.columns.category} IN (${allowedItem}) AND 
                        ${DBM_Item_Data.columns.id}=? AND ${DBM_Item_Data.columns.is_purchasable_shop}=? 
                        LIMIT 1`;
                        var itemData = await DBConn.conn.promise().query(query,[itemId,1]);
                        itemData = itemData[0][0];
                        
                        if(itemData==null){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: Please enter the correct Item ID.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        var mofucoin = userData[DBM_Card_User_Data.columns.mofucoin];

                        var itemDataPrice = itemData[DBM_Item_Data.columns.price_mofucoin]*qty;
                        var itemDataId = itemData[DBM_Item_Data.columns.id];
                        var itemDataName = itemData[DBM_Item_Data.columns.name];

                        if(currentStock+qty>=ItemModule.Properties.maxItem){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: You cannot purchase **${itemDataId} - ${itemDataName}** anymore.`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        } else if(mofucoin<itemDataPrice){
                            objEmbed.thumbnail = {
                                url:CardModule.Properties.imgResponse.imgFailed
                            }
                            objEmbed.description = `:x: You need **${itemDataPrice} mofucoin** to purchase ${qty}x: **${itemDataId} - ${itemDataName}**`;
                            return interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                        }

                        objEmbed.thumbnail = {
                            url:"https://cdn.discordapp.com/attachments/793415946738860072/853166970030260235/Prettycure.png"
                        }
                        objEmbed.description = `You have purchased ${qty}x: **${itemDataId} - ${itemDataName}** with **${itemDataPrice} mofucoin**.`;
                        
                        //update the mofucoin
                        await CardModule.updateMofucoin(userId,-itemDataPrice);

                        // //add the item inventory
                        await ItemModule.addNewItemInventory(userId,itemId,qty);
                        return message.channel.send({embed:objEmbed});

                        break;
                }
                break;
        }
    }
}
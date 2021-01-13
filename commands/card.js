const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Card_Leaderboard = require('../database/model/DBM_Card_Leaderboard');

module.exports = {
    name: 'card',
    cooldown: 5,
    description: 'Contain all card category',
    args: true,
	async execute(message, args) {
        const guildId = message.guild.id;
        var userId = message.author.id;
        var userUsername = message.author.username;
        var userAvatarUrl = message.author.avatarURL();

        // var members = message.guild.members;
        switch(args[0]) {
            case "status":
                //show the card status
                var objEmbed ={
                    color: CardModule.Properties.embedColor,
                    author: {
                        name: userUsername,
                        icon_url: userAvatarUrl
                    }
                };
                //get card total:
                //user parameter validator if placed
                var memberExists = true;
                if(args[1]!=null){
                    var parameterUsername = args[1];
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1})
                    .then(
                        members=> {
                            if(members.size>=1){
                                userId = members.first().user.id;
                                objEmbed.author = {
                                    name:members.first().user.username,
                                    icon_url:members.first().user.avatarURL()
                                }
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                }

                if(!memberExists){
                    return message.channel.send("Sorry, I can't find that username.");
                }


                var query = `select cd.${DBM_Card_Data.columns.pack},count(inv.${DBM_Card_Inventory.columns.id_user}) as total
                from card_data cd
                left join ${DBM_Card_Inventory.TABLENAME} inv
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                inv.${DBM_Card_Inventory.columns.id_user}=?
                group by cd.${DBM_Card_Data.columns.pack}`;
                var arrParameterized = [userId];
                var arrCardTotal = {};
                var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                cardDataInventory[0].forEach(function(entry){
                    arrCardTotal[entry[DBM_Card_Data.columns.pack]] = entry['total'];
                });

                var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                //get the color level average
                var arrColorLevel = [
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_green],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_red],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_white],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]
                ]

                var clvl = 0;
                for( var i = 0; i < arrColorLevel.length; i++ ){
                    clvl += parseInt( arrColorLevel[i], 10 ); //don't forget to add the base
                }
                clvl = Math.ceil(clvl/arrColorLevel.length);

                //prepare the embed
                objEmbed.title = `Card Status | cLvl: ${clvl} | Color: ${cardUserStatusData[DBM_Card_User_Data.columns.color]}`;
                objEmbed.fields = [{
                        name: `Pink(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_pink]}):`,
                        value: `Nagisa: ${arrCardTotal.nagisa}/${CardModule.Properties.dataCardCore.nagisa.total}
                        Saki: ${arrCardTotal.saki}/${CardModule.Properties.dataCardCore.saki.total}
                        Nozomi: ${arrCardTotal.nozomi}/${CardModule.Properties.dataCardCore.nozomi.total}
                        Love: ${arrCardTotal.love}/${CardModule.Properties.dataCardCore.love.total}
                        Tsubomi: ${arrCardTotal.tsubomi}/${CardModule.Properties.dataCardCore.tsubomi.total}
                        Hibiki: ${arrCardTotal.hibiki}/${CardModule.Properties.dataCardCore.hibiki.total}
                        Miyuki: ${arrCardTotal.miyuki}/${CardModule.Properties.dataCardCore.miyuki.total}
                        Mana: ${arrCardTotal.mana}/${CardModule.Properties.dataCardCore.mana.total}
                        Megumi: ${arrCardTotal.megumi}/${CardModule.Properties.dataCardCore.megumi.total}
                        Haruka: ${arrCardTotal.haruka}/${CardModule.Properties.dataCardCore.haruka.total}
                        Mirai: ${arrCardTotal.mirai}/${CardModule.Properties.dataCardCore.mirai.total}
                        Ichika: ${arrCardTotal.ichika}/${CardModule.Properties.dataCardCore.ichika.total}
                        Hana: ${arrCardTotal.hana}/${CardModule.Properties.dataCardCore.hana.total}
                        Hikaru: ${arrCardTotal.hikaru}/${CardModule.Properties.dataCardCore.hikaru.total}
                        Nodoka: ${arrCardTotal.nodoka}/${CardModule.Properties.dataCardCore.nodoka.total}`,
                        inline: true
                    },
                    {
                        name: `Blue(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_blue]}):`,
                        value: `Karen: ${arrCardTotal.karen}/${CardModule.Properties.dataCardCore.karen.total}
                        Miki: ${arrCardTotal.miki}/${CardModule.Properties.dataCardCore.miki.total}
                        Erika: ${arrCardTotal.erika}/${CardModule.Properties.dataCardCore.erika.total}
                        Ellen: ${arrCardTotal.ellen}/${CardModule.Properties.dataCardCore.ellen.total}
                        Reika: ${arrCardTotal.hikaru}/${CardModule.Properties.dataCardCore.reika.total}
                        Rikka: ${arrCardTotal.rikka}/${CardModule.Properties.dataCardCore.rikka.total}
                        Hime: ${arrCardTotal.hime}/${CardModule.Properties.dataCardCore.hime.total}
                        Minami: ${arrCardTotal.minami}/${CardModule.Properties.dataCardCore.minami.total}
                        Aoi: ${arrCardTotal.aoi}/${CardModule.Properties.dataCardCore.aoi.total}
                        Saaya: ${arrCardTotal.saaya}/${CardModule.Properties.dataCardCore.saaya.total}
                        Yuni: ${arrCardTotal.yuni}/${CardModule.Properties.dataCardCore.yuni.total}
                        Chiyu: ${arrCardTotal.chiyu}/${CardModule.Properties.dataCardCore.chiyu.total}`,
                        inline: true
                    },
                    {
                        name: `Yellow(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_yellow]}):`,
                        value: `Hikari: ${arrCardTotal.hikari}/${CardModule.Properties.dataCardCore.hikari.total}
                        Urara: ${arrCardTotal.urara}/${CardModule.Properties.dataCardCore.urara.total}
                        Inori: ${arrCardTotal.inori}/${CardModule.Properties.dataCardCore.inori.total}
                        Itsuki: ${arrCardTotal.itsuki}/${CardModule.Properties.dataCardCore.itsuki.total}
                        Ako: ${arrCardTotal.ako}/${CardModule.Properties.dataCardCore.ako.total}
                        Yayoi: ${arrCardTotal.yayoi}/${CardModule.Properties.dataCardCore.yayoi.total}
                        Alice: ${arrCardTotal.alice}/${CardModule.Properties.dataCardCore.alice.total}
                        Yuko: ${arrCardTotal.yuko}/${CardModule.Properties.dataCardCore.yuko.total}
                        Kirara: ${arrCardTotal.kirara}/${CardModule.Properties.dataCardCore.kirara.total}
                        Himari: ${arrCardTotal.himari}/${CardModule.Properties.dataCardCore.himari.total}
                        Homare: ${arrCardTotal.homare}/${CardModule.Properties.dataCardCore.homare.total}
                        Elena: ${arrCardTotal.elena}/${CardModule.Properties.dataCardCore.elena.total}
                        Hinata: ${arrCardTotal.hinata}/${CardModule.Properties.dataCardCore.hinata.total}`,
                        inline: true
                    },
                    {
                        name: `Purple(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_purple]}):`,
                        value: `Yuri: ${arrCardTotal.yuri}/${CardModule.Properties.dataCardCore.yuri.total}
                        Makoto: ${arrCardTotal.makoto}/${CardModule.Properties.dataCardCore.makoto.total}
                        Iona: ${arrCardTotal.iona}/${CardModule.Properties.dataCardCore.iona.total}
                        Riko: ${arrCardTotal.riko}/${CardModule.Properties.dataCardCore.riko.total}
                        Yukari: ${arrCardTotal.yukari}/${CardModule.Properties.dataCardCore.yukari.total}
                        Amour: ${arrCardTotal.amour}/${CardModule.Properties.dataCardCore.amour.total}
                        Madoka: ${arrCardTotal.madoka}/${CardModule.Properties.dataCardCore.madoka.total}
                        Kurumi: ${arrCardTotal.kurumi}/${CardModule.Properties.dataCardCore.kurumi.total}`,
                        inline: true
                    },
                    {
                        name: `Red(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_red]}):`,
                        value: `Rin: ${arrCardTotal.rin}/${CardModule.Properties.dataCardCore.rin.total}
                        Setsuna: ${arrCardTotal.setsuna}/${CardModule.Properties.dataCardCore.setsuna.total}
                        Akane: ${arrCardTotal.akane}/${CardModule.Properties.dataCardCore.akane.total}
                        Aguri: ${arrCardTotal.aguri}/${CardModule.Properties.dataCardCore.aguri.total}
                        Towa: ${arrCardTotal.towa}/${CardModule.Properties.dataCardCore.towa.total}
                        Akira: ${arrCardTotal.akira}/${CardModule.Properties.dataCardCore.akira.total}
                        Emiru: ${arrCardTotal.emiru}/${CardModule.Properties.dataCardCore.emiru.total}`,
                        inline: true
                    },
                    {
                        name: `Green(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_green]}):`,
                        value: `Komachi: ${arrCardTotal.komachi}/${CardModule.Properties.dataCardCore.komachi.total}
                        Nao: ${arrCardTotal.nao}/${CardModule.Properties.dataCardCore.nao.total}
                        Kotoha: ${arrCardTotal.kotoha}/${CardModule.Properties.dataCardCore.kotoha.total}
                        Ciel: ${arrCardTotal.ciel}/${CardModule.Properties.dataCardCore.ciel.total}
                        Lala: ${arrCardTotal.lala}/${CardModule.Properties.dataCardCore.lala.total}`,
                        inline: true
                    },
                    {
                        name: `White(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_white]}):`,
                        value: `Honoka: ${arrCardTotal.honoka}/${CardModule.Properties.dataCardCore.honoka.total}
                        Mai: ${arrCardTotal.mai}/${CardModule.Properties.dataCardCore.mai.total}
                        Kanade: ${arrCardTotal.kanade}/${CardModule.Properties.dataCardCore.kanade.total}`,
                        inline: true
                    }
                ];

                message.channel.send({embed:objEmbed});
                
                break;
            case "inventory":
                var pack = args[1];
                //get the first mentionable user:
                //console.log(message.mentions.users.first());

                //check if user is available
                //check if user available/not
                var objEmbed ={
                    color: CardModule.Properties.embedColor
                };

                //card pack validator
                if(pack==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the card pack that you want to see.";
                    return message.channel.send({embed:objEmbed});
                } else if(!CardModule.Properties.dataCardCore.hasOwnProperty(pack)){
                    var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                    
                    return message.channel.send({
                        content:"Sorry, I cannot find that card pack. Here are the list of all available card pack:",
                        embed:CardModule.embedCardPackList});
                }

                //user parameter validator
                var memberExists = true;
                if(args[2]!=null){
                    var parameterUsername = args[2];
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
                    .then(
                        members=> {
                            if(members.size>=1){
                                userId = members.first().user.id;
                                userUsername = members.first().user.username;
                                userAvatarUrl = members.first().user.avatarURL();
                            } else {
                                memberExists = false;
                            }
                        }
                    );
                }

                if(!memberExists){
                    return message.channel.send("Sorry, I can't find that username.");
                }

                //end user parameter validator
                objEmbed.title = `${pack} Card Pack:`;
                objEmbed.author = {
                    name: userUsername,
                    icon_url: userAvatarUrl
                }

                var cardList = "";

                var query = `select cd.${DBM_Card_Data.columns.id_card},cd.${DBM_Card_Data.columns.color},
                cd.${DBM_Card_Data.columns.series},cd.${DBM_Card_Data.columns.pack},cd.${DBM_Card_Data.columns.name},
                cd.${DBM_Card_Data.columns.img_url},inv.${DBM_Card_Inventory.columns.id_user} 
                from ${DBM_Card_Data.TABLENAME} cd
                left join ${DBM_Card_Inventory.TABLENAME} inv
                on cd.${DBM_Card_Data.columns.id_card}=inv.${DBM_Card_Inventory.columns.id_card} and 
                inv.${DBM_Card_Inventory.columns.id_user}=?  
                where cd.pack = ?`;
                var arrParameterized = [userId,pack];
                
                var arrPages = [];
                var cardDataInventory = await DBConn.conn.promise().query(query, arrParameterized);
                // var cardDataInventory = await CardModule.getAllCardDataByPack(pack);
                var progressTotal = 0; var ctr = 0; var maxCtr = 4; var pointerMaxData = cardDataInventory[0].length;
                cardDataInventory[0].forEach(function(entry){
                    var icon = ":x:";
                    //checkmark if card is owned
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        icon = ":white_check_mark:"; progressTotal++;
                    }
                    cardList+=`[${icon}${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})\n`;
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.dataCardCore[pack].icon
                    };
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `Progress: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total}`,
                            value: cardList,
                        }];
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                        cardList = ""; ctr = 0;
                    } else {
                        ctr++;
                    }
                    pointerMaxData--;
                });
                
                // message.channel.send({embed:objEmbed});
                pages = arrPages;

                paginationEmbed(message,pages);
                
                //console.log(new Discord.MessageMentions(args[1]));
                // var options =  args[1].mention;
                // console.log(options);
            
                //console.log(guild);
                break;
            case "catch":
                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    id:guildSpawnData[DBM_Card_Guild.columns.spawn_id],
                    color:guildSpawnData[DBM_Card_Guild.columns.spawn_color],
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    (spawnedCardData.id==null&&spawnedCardData.color==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no card that is spawned now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you already use the capture command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                }

                switch(spawnedCardData.type){
                    case "number":
                        //check if card spawn is number
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current spawn type is number. You need to use: **p!card guess <lower/higher>** to guess the next number and capture the card.";
                        return message.channel.send({embed:objEmbed});
                    case "color": //color card spawn
                        var objColor = JSON.parse(spawnedCardData.color);
                        //card color validator
                        if(Object.keys(objColor).length<=0){
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: Sorry, there are no available color that can be captured this time. Please wait until the next card spawn.";
                            return message.channel.send({embed:objEmbed});
                        } else if(!objColor.hasOwnProperty(userData.color)){
                            //check color lefted card
                            var availableColor = "";
                            for (const [key, value] of Object.entries(objColor)) {
                                availableColor+=`${key}/ `;
                            }
                            availableColor = availableColor.replace(/\/\s*$/, "");//remove the last comma and any whitespace
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = `:x: You are not assigned on the available listed color: **${availableColor}**. Please assign your color with: **p!card color set <color>**`;
                            return message.channel.send({embed:objEmbed});
                        }

                        spawnedCardData.id = objColor[userData.color];
                        spawnedCardData.color = userData.color;
                        break;
                    default:
                        break;
                }

                //check for duplicates
                var randomPoint = Math.floor(Math.random() * 3)+1;//for received random card point
                var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);

                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];

                if(duplicateCard){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you already have this card: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. 
                    As a bonus you have received **${randomPoint} ${cardSpawnData[DBM_Card_Data.columns.color]}** color point.`;
                    //update the catch token & color point
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,randomPoint);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );
                    return message.channel.send({embed:objEmbed});
                }

                //RNG: calculate catch attempt
                var captured = false;
                var chance = parseInt(cardSpawnData[DBM_Card_Data.columns.rarity])*10; 
                var rngCatch = Math.floor(Math.random() * 100)+
                CardModule.getBonusCatchAttempt(parseInt(userCardData[`color_level_${spawnedCardData.color}`]));//rng point
                switch(spawnedCardData.type){
                    case "color":
                        //bonus +10% catch rate
                        if(rngCatch+10>=chance){
                            captured = true;
                        }
                        break;
                    default://normal card spawn
                        if(rngCatch>=chance){
                            captured = true;
                        }
                        break;
                }

                //get & put card data into embed
                if(captured){
                    var cpReward = 5;
                    //update the catch token & color point
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,cpReward);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );

                    //insert new card
                    await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                    
                    var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);//get the current card total
                    objEmbed.color = CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color;
                    objEmbed.author = {
                        name:`${GlobalFunctions.capitalize(cardSpawnData[DBM_Card_Data.columns.pack])} Card Pack`,
                        iconURL: CardModule.Properties.dataCardCore[cardSpawnData[DBM_Card_Data.columns.pack]].icon 
                    }
                    objEmbed.title = `${cardSpawnData[DBM_Card_Data.columns.name]}`;

                    objEmbed.fields = [
                        {
                            name:"ID:",
                            value:`${cardSpawnData[DBM_Card_Data.columns.id_card]}`,
                            inline:true
                        },
                        {
                            name:"Series:",
                            value:`${cardSpawnData[DBM_Card_Data.columns.series]}`,
                            inline:true
                        },
                        {
                            name:"Rarity:",
                            value:`${cardSpawnData[DBM_Card_Data.columns.rarity]} :star:`,
                            inline:true
                        }
                    ]
                    objEmbed.image = {
                        url: cardSpawnData[DBM_Card_Data.columns.img_url]
                    }
                    objEmbed.footer = {
                        text: `Captured by: ${userUsername} (${currentTotalCard}/${CardModule.Properties.dataCardCore[cardSpawnData[DBM_Card_Data.columns.pack]].total})`,
                        iconURL: userAvatarUrl
                    }

                    //update the guild spawn data
                    switch(spawnedCardData.type){
                        case "color":
                            //erase the color spawn key on guild
                            // console.log("sp COLOR: " + spawnedCardData.color);
                            var tempObjGuild = guildSpawnData[DBM_Card_Guild.columns.spawn_color];
                            var newColor = JSON.parse(tempObjGuild);
                            
                            delete newColor[spawnedCardData.color];
                            newColor = JSON.stringify(newColor);
                            
                            var query = `UPDATE ${DBM_Card_Guild.TABLENAME}
                            SET ${DBM_Card_Guild.columns.spawn_color} = ? 
                            WHERE ${DBM_Card_Guild.columns.id_guild} = ?`;
                            var arrParameterized = [newColor,guildId];
                            await DBConn.conn.promise().query(query, arrParameterized);
                            
                            break;
                        default://normal card spawn, erase the card guild spawn
                            await CardModule.removeCardGuildSpawn(guildId);
                            break;
                    }

                    return message.channel.send({
                        content:`Nice catch! **${userUsername}** has captured: **${cardSpawnData[DBM_Card_Data.columns.name]}**. You also received **${cpReward} ${spawnedCardData.color}** color point.`,
                        embed:objEmbed
                    });
                } else {
                    //update the catch token & color point
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,1);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );

                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry <@${userId}>, you failed to catch the card. As a bonus you received **1 ${cardSpawnData[DBM_Card_Data.columns.color]}** color point.`;

                    return message.channel.send({embed:objEmbed});
                }
                
                break;
            case "detail":
                //get/view the card detail
                const cardId = args[1];
                objEmbed = {
                    color:CardModule.Properties.embedColor
                }
                if(cardId==null){
                    objEmbed.thumbnail = {
                            url:CardModule.Properties.imgResponse.imgError
                        }
                    objEmbed.description = ":x: Please enter the card ID.";
                    return message.channel.send({embed:objEmbed});
                }

                //check if card ID exists/not
                var cardData = await CardModule.getCardData(cardId);

                if(cardData==null){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, I can't find that card ID.";

                    return message.channel.send({embed:objEmbed});
                }

                //check if user have card/not
                var userHaveCard = await CardModule.checkUserHaveCard(userId,cardId);
                if(!userHaveCard){
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you don't have: **${cardData[DBM_Card_Data.columns.name]}** yet. Please capture this card first.`;
                    return message.channel.send({embed:objEmbed});
                }

                //get card user inventory data to get the received date data
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_Inventory.columns.id_card,cardId);
                parameterWhere.set(DBM_Card_Inventory.columns.id_user,userId);
                var userInventoryData = await DB.select(DBM_Card_Inventory.TABLENAME,parameterWhere);

                return message.channel.send({embed:CardModule.embedCardDetail(cardData[DBM_Card_Data.columns.color],
                    cardData[DBM_Card_Data.columns.id_card],cardData[DBM_Card_Data.columns.pack],
                    cardData[DBM_Card_Data.columns.name],cardData[DBM_Card_Data.columns.img_url],cardData[DBM_Card_Data.columns.series],cardData[DBM_Card_Data.columns.rarity],userAvatarUrl,
                    userInventoryData[0][0][DBM_Card_Inventory.columns.created_at])});
            case "guess":
                const guess = args[1];

                //get card spawn information
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                //get the spawn token & prepare the card color
                var userData = {
                    token:userCardData[DBM_Card_User_Data.columns.spawn_token],
                    color:userCardData[DBM_Card_User_Data.columns.color]
                }
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    id:guildSpawnData[DBM_Card_Guild.columns.spawn_id],
                    color:guildSpawnData[DBM_Card_Guild.columns.spawn_color],
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    (spawnedCardData.id==null&&spawnedCardData.color==null)){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no card that is spawned now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you already use the guess command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type != "number"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you current spawn is not number. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(guess==null||(guess.toLowerCase()!="lower"&&guess.toLowerCase()!="higher")){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the guess parameter with **lower** or **higher**.";
                    return message.channel.send({embed:objEmbed});
                }

                var success = false; var same = false; var msgSend = "";
                var currentNumber = parseInt(guildSpawnData[DBM_Card_Guild.columns.spawn_number]);
                var nextNumber = Math.floor(Math.random() * 12) + 1; var pointReward = 0;
                if(nextNumber==currentNumber){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Neither number is lower or higher. I'll send a new number card again. As a bonus you received **10 ${spawnedCardData.color}** color point.`;
                    pointReward = 10;
                    same = true;
                } else {
                    switch(guess.toLowerCase()){
                        case "lower":
                            if(nextNumber<currentNumber){
                                success = true;
                            }
                            break;
                        case "higher":
                            if(nextNumber>currentNumber){
                                success = true;
                            }
                            break;
                    }
                }

                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);

                if(success){
                    //check for duplicates
                    var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);

                    if(duplicateCard){
                        var randomPoint = Math.floor(Math.random() * 3)+1;//for received random card point

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}** and you guessed it correctly! Sorry, you already have this card: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${randomPoint} ${spawnedCardData.color}** color point.`;
                        //update the catch token & color point
                        pointReward = randomPoint;
                        message.channel.send({embed:objEmbed});
                    } else {
                        msgSend = `:white_check_mark: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}** and you guessed it correctly!`;

                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);//get the current card total

                        msgSend += ` **${userUsername}** have received: **${cardSpawnData[DBM_Card_Data.columns.name]}** & 3 **${spawnedCardData.color}** color point.`;
                        var objEmbed = CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                            cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard);
                        pointReward = 3;
                        message.channel.send({content:msgSend,embed:objEmbed});
                    }
                } else if(same) {
                    message.channel.send({embed:objEmbed});
                } else {
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}**. Sorry, you guessed it wrong this time.`;
                    message.channel.send({embed:objEmbed});
                }

                if(!same){
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );
                } else {
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                    await CardModule.updateColorPoint(userId,objColor);
                }

                //generate new card:
                var objEmbedNewCard =  await CardModule.generateCardSpawn(guildId,"number",false);
                message.channel.send({embed:objEmbedNewCard});
                
                break;
            case "color":
                var newColor = args[2];
                //validator is parameter format is not correct

                if(args[1]==null||
                    (args[1].toLowerCase()!="set" && newColor == null)||
                    (args[1].toLowerCase()=="set" && !CardModule.Properties.arrColor.includes(newColor))){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : ":x: Please enter the correct color set command with: **p!card color set <pink/purple/green/yellow/white/blue/red>**"
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var userCardData = await CardModule.getCardUserStatusData(userId);
                var assignedColor = userCardData[DBM_Card_User_Data.columns.color];
                var assignedColorPoint = userCardData[`color_point_${assignedColor}`];
                //validator: check if color point is enough/not
                if(assignedColorPoint<100){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **100 ${assignedColor}** color point to change your color.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //assign new color & update color
                var parameterSet = new Map();
                parameterSet.set(DBM_Card_User_Data.columns.color,newColor);
                var parameterWhere = new Map();
                parameterWhere.set(DBM_Card_User_Data.columns.id_user,userId);
                await DB.update(DBM_Card_User_Data.TABLENAME,parameterSet,parameterWhere);

                //update the color point
                var parameterSetColorPoint = new Map();
                parameterSetColorPoint.set(`color_point_${assignedColor}`,-100);
                await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    title: `:white_check_mark: New color has been set`,
                    description : `:white_check_mark: <@${userId}> is now assigned with color: **${newColor}** and use **100 ${assignedColor}** color point.`
                };

                message.channel.send({embed:objEmbed});

                break;
            case "guide":
                var objEmbed = {
                    color:CardModule.Properties.embedColor,
                    title: "Precure Cardcatcher! Guide 101",
                    // thumbnail: {
                    //     url: CardModule.Properties.imgResponse.imgOk
                    // },
                    description: "This is the basic guide starter for precure cardcatcher:",
                    fields: [
                    {
                        name: "How many card color/packs/rarity available?",
                        value: `7 Color: pink, purple, green, yellow, white, blue, red. There are also 63 card pack that you can collect. 
                        Each card also provided with number of rarity, the higher number of rarity the lower of the chance that you can capture it. You can track down your card progression with **p!card status** or **p!card inventory <pack>**.`
                    },
                    {
                        name: "What is cLvl,color level and color point?",
                        value: `cLvl stands for the average of all your color level. Starting from level 2 you will get 5% card capture chance bonus and will be increased for every level. To level up your color you need a multiplier of 100 color point with your level and use the command: **p!card up <color>**.`
                    },
                    {
                        name: "How many card spawn type are there?",
                        value: `Currently there are 3 spawn type:
                        -**normal card**: the normal card spawn that you can capture with **p!card catch** command.
                        -**number card**: a random current number from 1-12 with the card rarity of 1-4 :star: will be spawned and you need to guess if the next hidden number will be **lower** or **higher** with **p!card guess <lower/higher>**. After you guessed it up the next random number card will be spawned immediately and other user can guess the next number card. You can only guess it once every spawn turn. This card spawn also guarantee with a 100% catch rate.
                        - **color card**: 7 different color card: **pink, purple, green, yellow, white, blue, red** will be provided and every color will provide 1 random card with the color of the card. You can only capture the card with based from the assigned color. After a color has been captured that color will be removed. This card spawn also provide with a bonus +10% catch rate.`
                    },
                    {
                        name: "Summary & Getting Started",
                        value: `-Gather daily color point everyday (24 hour bot server time reset) with **p!daily**. Color point can be used to change your color. If you provide use the daily command with color parameter the received point will be doubled, otherwise you'll receive overall color point.
                        -Capture the card based from the card spawn type ruleset. Example: **p!card capture** or **p!card guess<lower/higher>** if the card spawn is number type.
                        -You can level up the your color with: **p!card up <color>**.
                        -You can use **p!card status** or **p!card inventory <pack>** to track down your card progress.`
                    },
                    ]
                    
                  }
                  message.channel.send({embed:objEmbed});
                
                break;
            case "leaderboard":
                var selection = ""; var pack = ""; var color = "";
                //validator
                if(args[1]!=null&&CardModule.Properties.dataCardCore.hasOwnProperty(args[1].toLowerCase())){
                    selection = "pack"; pack = args[1].toLowerCase();
                } else if(args[1]!=null&&CardModule.Properties.arrColor.includes(args[1].toLowerCase())){
                    selection = "color"; color = args[1].toLowerCase();
                } else {
                    return message.channel.send({
                        content:`Please enter the parameter with one of the color list:**${CardModule.Properties.arrColor.toString().split(",").join("/")}** or pack list that is listed bellow:`,
                        embed:CardModule.embedCardPackList
                    });
                }

                //prepare the embed
                var objEmbed = {
                    color: CardModule.Properties.embedColor
                }
                
                var completion = args[1].toLowerCase();
                var query = `SELECT * 
                FROM ${DBM_Card_Leaderboard.TABLENAME} 
                WHERE ${DBM_Card_Leaderboard.columns.id_guild}=? AND 
                ${DBM_Card_Leaderboard.columns.category}=? AND 
                ${DBM_Card_Leaderboard.columns.completion}=?
                ORDER BY ${DBM_Card_Leaderboard.columns.created_at} ASC 
                LIMIT 10`; 
                var leaderboardContent = "";
                var arrParameterized = [guildId,selection,completion];
                var dataLeaderboard = await DBConn.conn.promise().query(query, arrParameterized);
                var ctr = 1;
                dataLeaderboard[0].forEach(function(entry){
                    leaderboardContent += `${ctr}. <@${entry[DBM_Card_Leaderboard.columns.id_user]}> : ${GlobalFunctions.convertDateTime(entry[DBM_Card_Leaderboard.columns.created_at])}\n`; ctr++;
                })

                switch(selection){
                    case "pack":
                        objEmbed.title = `:trophy: Top 10 ${GlobalFunctions.capitalize(completion)} Card Pack Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has complete the **${completion}** card pack yet...`;
                        } else {
                            objEmbed.description = `Here are the top 10 list of **${completion}** card pack:
                            ${leaderboardContent}`;
                        }
                        break;
                    case "color":
                        objEmbed.title = `:trophy: Top 10 Cure ${GlobalFunctions.capitalize(completion)} Master Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has become the master of **cure ${completion}** yet...`;
                        } else {
                            objEmbed.description = `Here are the top 10 list master of **cure ${completion}**:
                            ${leaderboardContent}`;
                        }
                        break;
                }

                return message.channel.send({embed:objEmbed});
            case "up":
                //level up the color
                var selectedColor = args[1];
                //validator is parameter format is not correct

                if(!CardModule.Properties.arrColor.includes(selectedColor)){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : ":x: Please enter the correct color level up command with: **p!card up <pink/purple/green/yellow/white/blue/red>**"
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var userCardData = await CardModule.getCardUserStatusData(userId);
                var colorLevel = userCardData[`color_level_${selectedColor}`];
                var colorPoint = userCardData[`color_point_${selectedColor}`];
                var nextColorPoint = CardModule.getNextColorPoint(colorLevel);
                //validator: check if color point is enough/not
                if(colorPoint<nextColorPoint){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **${nextColorPoint} ${selectedColor}** color point to level up.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //update the color point
                var parameterSetColorPoint = new Map();
                parameterSetColorPoint.set(`color_point_${selectedColor}`,-nextColorPoint);
                await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                //add 1 color level
                var query = `UPDATE ${DBM_Card_User_Data.TABLENAME} 
                SET color_level_${selectedColor} = color_level_${selectedColor}+1
                WHERE ${DBM_Card_User_Data.columns.id_user}=?`;
                await DBConn.conn.promise().query(query, [userId]);

                colorLevel+=1;

                var objEmbed = {
                    color: CardModule.Properties.embedColor,
                    title: `${userUsername}' ${GlobalFunctions.capitalize(selectedColor)} Level Up!`,
                    thumbnail:{
                        url: userAvatarUrl
                    },
                    description : `:white_check_mark: <@${userId}> is now level ${colorLevel} !`,
                    fields: [
                        {
                            name:`Total bonus capture rate:`,
                            value:`+${CardModule.getBonusCatchAttempt(colorLevel)}%`,
                            inline: true
                        },
                        {
                            name:`Next ${GlobalFunctions.capitalize(selectedColor)} Color Point:`,
                            value:`+${CardModule.getNextColorPoint(colorLevel)}%`,
                            inline: true
                        },
                    ]
                };

                message.channel.send({embed:objEmbed});
            default:
                break;
        }
	},
};
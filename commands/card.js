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
    description: 'Contains all card categories',
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
                clvl = await CardModule.getAverageLevel(userId,[
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_green],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_red],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_white],
                    cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]
                ]);

                //prepare the embed
                objEmbed.title = `Card Status | cLvl: ${clvl} | Color: ${cardUserStatusData[DBM_Card_User_Data.columns.color]}`;
                objEmbed.fields = [{
                        name: `Pink(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_pink]}):`,
                        value: `Nagisa: ${arrCardTotal.nagisa}/${CardModule.Properties.dataCardCore.nagisa.total}\nSaki: ${arrCardTotal.saki}/${CardModule.Properties.dataCardCore.saki.total}\nNozomi: ${arrCardTotal.nozomi}/${CardModule.Properties.dataCardCore.nozomi.total}\nLove: ${arrCardTotal.love}/${CardModule.Properties.dataCardCore.love.total}\nTsubomi: ${arrCardTotal.tsubomi}/${CardModule.Properties.dataCardCore.tsubomi.total}\nHibiki: ${arrCardTotal.hibiki}/${CardModule.Properties.dataCardCore.hibiki.total}\nMiyuki: ${arrCardTotal.miyuki}/${CardModule.Properties.dataCardCore.miyuki.total}\nMana: ${arrCardTotal.mana}/${CardModule.Properties.dataCardCore.mana.total}\nMegumi: ${arrCardTotal.megumi}/${CardModule.Properties.dataCardCore.megumi.total}\nHaruka: ${arrCardTotal.haruka}/${CardModule.Properties.dataCardCore.haruka.total}\nMirai: ${arrCardTotal.mirai}/${CardModule.Properties.dataCardCore.mirai.total}\nIchika: ${arrCardTotal.ichika}/${CardModule.Properties.dataCardCore.ichika.total}\nHana: ${arrCardTotal.hana}/${CardModule.Properties.dataCardCore.hana.total}\nHikaru: ${arrCardTotal.hikaru}/${CardModule.Properties.dataCardCore.hikaru.total}\nNodoka: ${arrCardTotal.nodoka}/${CardModule.Properties.dataCardCore.nodoka.total}`,
                        inline: true
                    },
                    {
                        name: `Blue(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_blue]}):`,
                        value: `Karen: ${arrCardTotal.karen}/${CardModule.Properties.dataCardCore.karen.total}\nMiki: ${arrCardTotal.miki}/${CardModule.Properties.dataCardCore.miki.total}\nErika: ${arrCardTotal.erika}/${CardModule.Properties.dataCardCore.erika.total}\nEllen: ${arrCardTotal.ellen}/${CardModule.Properties.dataCardCore.ellen.total}\nReika: ${arrCardTotal.hikaru}/${CardModule.Properties.dataCardCore.reika.total}\nRikka: ${arrCardTotal.rikka}/${CardModule.Properties.dataCardCore.rikka.total}\nHime: ${arrCardTotal.hime}/${CardModule.Properties.dataCardCore.hime.total}\nMinami: ${arrCardTotal.minami}/${CardModule.Properties.dataCardCore.minami.total}\nAoi: ${arrCardTotal.aoi}/${CardModule.Properties.dataCardCore.aoi.total}\nSaaya: ${arrCardTotal.saaya}/${CardModule.Properties.dataCardCore.saaya.total}\nYuni: ${arrCardTotal.yuni}/${CardModule.Properties.dataCardCore.yuni.total}\nChiyu: ${arrCardTotal.chiyu}/${CardModule.Properties.dataCardCore.chiyu.total}`,
                        inline: true
                    },
                    {
                        name: `Yellow(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_yellow]}):`,
                        value: `Hikari: ${arrCardTotal.hikari}/${CardModule.Properties.dataCardCore.hikari.total}\nUrara: ${arrCardTotal.urara}/${CardModule.Properties.dataCardCore.urara.total}\nInori: ${arrCardTotal.inori}/${CardModule.Properties.dataCardCore.inori.total}\nItsuki: ${arrCardTotal.itsuki}/${CardModule.Properties.dataCardCore.itsuki.total}\nAko: ${arrCardTotal.ako}/${CardModule.Properties.dataCardCore.ako.total}\nYayoi: ${arrCardTotal.yayoi}/${CardModule.Properties.dataCardCore.yayoi.total}\nAlice: ${arrCardTotal.alice}/${CardModule.Properties.dataCardCore.alice.total}\nYuko: ${arrCardTotal.yuko}/${CardModule.Properties.dataCardCore.yuko.total}\nKirara: ${arrCardTotal.kirara}/${CardModule.Properties.dataCardCore.kirara.total}\nHimari: ${arrCardTotal.himari}/${CardModule.Properties.dataCardCore.himari.total}\nHomare: ${arrCardTotal.homare}/${CardModule.Properties.dataCardCore.homare.total}\nElena: ${arrCardTotal.elena}/${CardModule.Properties.dataCardCore.elena.total}\nHinata: ${arrCardTotal.hinata}/${CardModule.Properties.dataCardCore.hinata.total}`,
                        inline: true
                    },
                    {
                        name: `Purple(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_purple]}):`,
                        value: `Yuri: ${arrCardTotal.yuri}/${CardModule.Properties.dataCardCore.yuri.total}\nMakoto: ${arrCardTotal.makoto}/${CardModule.Properties.dataCardCore.makoto.total}\nIona: ${arrCardTotal.iona}/${CardModule.Properties.dataCardCore.iona.total}\nRiko: ${arrCardTotal.riko}/${CardModule.Properties.dataCardCore.riko.total}\nYukari: ${arrCardTotal.yukari}/${CardModule.Properties.dataCardCore.yukari.total}\nAmour: ${arrCardTotal.amour}/${CardModule.Properties.dataCardCore.amour.total}\nMadoka: ${arrCardTotal.madoka}/${CardModule.Properties.dataCardCore.madoka.total}\nKurumi: ${arrCardTotal.kurumi}/${CardModule.Properties.dataCardCore.kurumi.total}`,
                        inline: true
                    },
                    {
                        name: `Red(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_red]}):`,
                        value: `Rin: ${arrCardTotal.rin}/${CardModule.Properties.dataCardCore.rin.total}\nSetsuna: ${arrCardTotal.setsuna}/${CardModule.Properties.dataCardCore.setsuna.total}\nAkane: ${arrCardTotal.akane}/${CardModule.Properties.dataCardCore.akane.total}\nAguri: ${arrCardTotal.aguri}/${CardModule.Properties.dataCardCore.aguri.total}\nTowa: ${arrCardTotal.towa}/${CardModule.Properties.dataCardCore.towa.total}\nAkira: ${arrCardTotal.akira}/${CardModule.Properties.dataCardCore.akira.total}\nEmiru: ${arrCardTotal.emiru}/${CardModule.Properties.dataCardCore.emiru.total}`,
                        inline: true
                    },
                    {
                        name: `Green(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_green]}):`,
                        value: `Komachi: ${arrCardTotal.komachi}/${CardModule.Properties.dataCardCore.komachi.total}\nNao: ${arrCardTotal.nao}/${CardModule.Properties.dataCardCore.nao.total}\nKotoha: ${arrCardTotal.kotoha}/${CardModule.Properties.dataCardCore.kotoha.total}\nCiel: ${arrCardTotal.ciel}/${CardModule.Properties.dataCardCore.ciel.total}\nLala: ${arrCardTotal.lala}/${CardModule.Properties.dataCardCore.lala.total}`,
                        inline: true
                    },
                    {
                        name: `White(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_white]}):`,
                        value: `Honoka: ${arrCardTotal.honoka}/${CardModule.Properties.dataCardCore.honoka.total}\nMai: ${arrCardTotal.mai}/${CardModule.Properties.dataCardCore.mai.total}\nKanade: ${arrCardTotal.kanade}/${CardModule.Properties.dataCardCore.kanade.total}`,
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
                objEmbed.title = `${GlobalFunctions.capitalize(pack)} Card Pack:`;
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
                    var icon = "❌ ";
                    //checkmark if card is owned
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        icon = "✅ "; progressTotal++;
                    }
                    cardList+=`[${icon}${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})\n`;
                    objEmbed.thumbnail = {
                        url:CardModule.Properties.dataCardCore[pack].icon
                    };
                    
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            // name: `Progress: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total}`,
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

                for(var i=0;i<arrPages.length;i++){
                    arrPages[i].fields[0]['name'] = `Progress: ${progressTotal}/${CardModule.Properties.dataCardCore[pack].total}`;
                }
                
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
                    data:guildSpawnData[DBM_Card_Guild.columns.spawn_data]
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                spawnedCardData.token==null){
                    console.log(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no Precure cards spawning right now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you've already used the capture command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                }

                switch(spawnedCardData.type){
                    case "quiz":
                        //check if card spawn is quiz
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current card spawn type is **quiz**. You need to use: **p!card answer <a/b/c>** to guess the next number and capture the card.";
                        return message.channel.send({embed:objEmbed});
                    case "number":
                        //check if card spawn is number
                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgError
                        }
                        objEmbed.description = ":x: Current card spawn type is **number**. You need to use: **p!card guess <lower/higher>** to guess the next number and capture the card.";
                        return message.channel.send({embed:objEmbed});
                    case "color": //color card spawn
                        // spawnedCardData.color = guildSpawnData[DBM_Card_Guild.columns.spawn_data];
                        // var objColor = JSON.parse(spawnedCardData.color);
                        // //card color validator
                        // if(Object.keys(objColor).length<=0){
                        //     objEmbed.thumbnail = {
                        //         url: CardModule.Properties.imgResponse.imgError
                        //     }
                        //     objEmbed.description = ":x: Sorry, there are no available colours that can be captured right now. Please wait until the next card spawn.";
                        //     return message.channel.send({embed:objEmbed});
                        // } else if(!objColor.hasOwnProperty(userData.color)){
                        //     //check color lefted card
                        //     var availableColor = "";
                        //     for (const [key, value] of Object.entries(objColor)) {
                        //         availableColor+=`${key}/ `;
                        //     }
                        //     availableColor = availableColor.replace(/\/\s*$/, "");//remove the last comma and any whitespace
                        //     objEmbed.thumbnail = {
                        //         url: CardModule.Properties.imgResponse.imgError
                        //     }
                        //     objEmbed.description = `:x: You are not assigned to the color: **${availableColor}** at the moment. Please assign your color with: **p!card color set <color>**`;
                        //     return message.channel.send({embed:objEmbed});
                        // }

                        // spawnedCardData.id = objColor[userData.color];
                        // spawnedCardData.color = userData.color;

                        var query = `SELECT * 
                        FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.color}=? 
                        ORDER BY rand() 
                        LIMIT 1`;
                        var resultData = await DBConn.conn.promise().query(query,[userData.color]);
                        spawnedCardData.id = resultData[0][0][DBM_Card_Data.columns.id_card];
                        spawnedCardData.color = userData.color;
                        break;
                    default:
                        break;
                }

                //check for duplicates
                
                var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];

                if(duplicateCard){
                    var randomPoint = Math.floor(Math.random() * 5)+1;//for received random card point
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = `:x: Sorry, you already have this card: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${randomPoint} ${cardSpawnData[DBM_Card_Data.columns.color]}** color point.`;
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
                            // var tempObjGuild = guildSpawnData[DBM_Card_Guild.columns.spawn_data];
                            // var newColor = JSON.parse(tempObjGuild);
                            
                            // delete newColor[spawnedCardData.color];
                            // newColor = JSON.stringify(newColor);
                            
                            // var query = `UPDATE ${DBM_Card_Guild.TABLENAME}
                            // SET ${DBM_Card_Guild.columns.spawn_data} = ? 
                            // WHERE ${DBM_Card_Guild.columns.id_guild} = ?`;
                            // var arrParameterized = [newColor,guildId];
                            // await DBConn.conn.promise().query(query, arrParameterized);
                            
                            break;
                        default://normal card spawn, erase the card guild spawn
                            await CardModule.removeCardGuildSpawn(guildId);
                            break;
                    }

                    message.channel.send({
                        content:`Nice catch! **${userUsername}** has captured: **${cardSpawnData[DBM_Card_Data.columns.name]}** & received **${cpReward} ${spawnedCardData.color}** color point.`,
                        embed:objEmbed
                    });

                    //check card pack completion:
                    var embedCompletion = null;
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(userId,"color",spawnedCardData.color);

                    if(checkCardCompletionPack){
                        //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    } else if(checkCardCompletionColor) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                    }

                    if(embedCompletion!=null){
                        return message.channel.send({embed:embedCompletion});
                    }
                } else {
                    //update the catch token & color point
                    var cpReward = Math.floor(Math.random() * 5)+1;
                    var objColor = new Map();
                    objColor.set(`color_point_${spawnedCardData.color}`,cpReward);
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );

                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry <@${userId}>, you failed to catch the card. As a bonus you received **${cpReward} ${cardSpawnData[DBM_Card_Data.columns.color]}** color point.`;

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
                    objEmbed.description = ":x: Sorry, there are no Precure cards spawning now. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you have already used the guess command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type != "number"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, current card spawn type is not a lucky number.";
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
                var nextNumber = Math.floor(Math.random() * 12) + 1;
                var pointReward = 0;
                if(nextNumber==currentNumber){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Neither number is lower or higher. As a bonus you received **10 ${spawnedCardData.color}** color point.`;
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
                        var randomPoint = Math.floor(Math.random() * 5)+1;//for received random card point

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgFailed
                        }
                        objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}** and you guessed it correctly! Sorry, you already have this card: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${randomPoint} ${spawnedCardData.color}** color point.`;
                        //update the catch token & color point
                        pointReward = randomPoint;
                        var objColor = new Map();
                        objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                        await CardModule.updateCatchAttempt(userId,
                            spawnedCardData.token,
                            objColor
                        );
                        return message.channel.send({embed:objEmbed});
                    } else {
                        pointReward = 5;
                        msgSend = `:white_check_mark: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}** and you guessed it correctly!`;

                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        var currentTotalCard = await CardModule.getUserTotalCard(userId,cardSpawnData[DBM_Card_Data.columns.pack]);//get the current card total

                        msgSend += ` **${userUsername}** have received: **${cardSpawnData[DBM_Card_Data.columns.name]}** & ${pointReward} **${spawnedCardData.color}** color point.`;
                        var objEmbed = CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                            cardSpawnData[DBM_Card_Data.columns.pack],cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard);
                        message.channel.send({content:msgSend,embed:objEmbed});
                    }

                    //check card pack completion:
                    var embedCompletion = null;
                    var checkCardCompletionPack = await CardModule.checkCardCompletion(userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    var checkCardCompletionColor = await CardModule.checkCardCompletion(userId,"color",spawnedCardData.color);

                    if(checkCardCompletionPack){
                        //card pack completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                    } else if(checkCardCompletionColor) {
                        //color set completion
                        embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                    }

                    if(embedCompletion!=null){
                        message.channel.send({embed:embedCompletion});
                    }

                } else if(same) {
                    message.channel.send({embed:objEmbed});
                } else {
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Current number was: **${currentNumber}** and the next hidden number was **${nextNumber}**. Your guess was: **${guess}**. Sorry, you guessed it wrong this time.`;
                    await CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );
                    return message.channel.send({embed:objEmbed});
                }

                // if(!same){
                var objColor = new Map();
                objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                await CardModule.updateCatchAttempt(userId,
                    spawnedCardData.token,
                    objColor
                );
                // } else {
                //     var objColor = new Map();
                //     objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                //     await CardModule.updateColorPoint(userId,objColor);
                // }

                await CardModule.removeCardGuildSpawn(guildId);

                //generate new card:
                // var objEmbedNewCard =  await CardModule.generateCardSpawn(guildId,"number",false);
                // message.channel.send({embed:objEmbedNewCard});
                
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
                    title: `New color has been set`,
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
                    description: "This is the basic guide starter for the Precure Card Catcher:",
                    fields: [
                    {
                        name: "How many card color/packs/rarity available?",
                        value: `There are seven colours: pink, purple, green, yellow, white, blue and red. There are also 63 card packs that you can collect.\nEach card also provided with number of rarity from 1-7, the higher number of rarity the lower of the chance that you can capture it. You can track down your card progression with **p!card status** or **p!card inventory <pack>**`
                    },
                    {
                        name: "What is cLvl, assigned color, CL(color level) and CP(color point) on my status?",
                        value: `**cLvl** stands for the average of all your color level and just used to represent your overall color level. The **color that you assigned** will be used during the color card spawn.\nStarting from **CL(color level)** 2 you will get 5% card capture chance bonus and will be increased for every level. To level up your color, you need a multiplier of 100 **CP(color point)** for every color level and use the command: **p!card up <color>**. Color point can be used to change your color too.`
                    },
                    {
                        name: "What are the list of card spawn that is available?",
                        value: `-**normal**: the common card spawn that you can capture with **p!card catch** command.\n-**color**: 7 different color cards will be spawned and every color will provide 1 random card from its color. You can only capture the card from your assigned color and do it one time. After a color has been captured that color will be removed. Base catch rate +10% for this spawn.\n-**number**: a random number from 1-12 & card rarity within 1-4 will be spawned. You need to guess if the next hidden number will be **lower** or **higher** with **p!card guess <lower/higher>**. After you guessed it, the next random number card will be spawned immediately and other user can guess the next number card. Bonus spawn type: 100% catch rate.\n-**quiz**: A set of question, answer and card rarity from 5 to higher will be spawned. You need to answer it with **p!card answer <a/b/c>**. Bonus spawn type: 100% catch rate.`
                    },
                    {
                        name: "Summary & Getting Started",
                        value: `-Gather daily color points once every 24 hours with **p!daily <color>**. The **<color>** parameter is optional and the points will be doubled if you didn't provide the **<color>** parameter, otherwise you'll receive overall color point.\n-Capture the card based from the card spawn type ruleset.\n-You can level up the your color with: **p!card up <color>**.\n-You can use **p!card status** or **p!card inventory <pack>** to track down your card progress.\n-You can use the **p!card respawn** to spawn a new card for 20 color points but the chances are 20%. If that fails, you will need to wait until the next card spawn.`
                    }]
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
                            objEmbed.description = `No one has completed the **${completion}** card pack yet...`;
                        } else {
                            objEmbed.description = `Here are the top 10 list of **${completion}** card pack:\n${leaderboardContent}`;
                        }
                        break;
                    case "color":
                        objEmbed.title = `:trophy: Top 10 Cure ${GlobalFunctions.capitalize(completion)} Master Leaderboard`;
                        if(leaderboardContent==""){
                            objEmbed.description = `No one has become the master of **Cure ${completion}** yet...`;
                        } else {
                            objEmbed.description = `Here are the top 10 list master of **Cure ${completion}**:\n${leaderboardContent}`;
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
                break;
            case "answer":
                var answer = args[1];

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
                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                var spawnedCardData = {
                    token:guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    type:guildSpawnData[DBM_Card_Guild.columns.spawn_type],
                    spawn_data:guildSpawnData[DBM_Card_Guild.columns.spawn_data]
                }

                //card catcher validator, check if card is still spawning/not
                if(spawnedCardData.type==null||
                    spawnedCardData.token==null||
                    spawnedCardData.spawn_data==null){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, there are no card that is spawned yet. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(userData.token==spawnedCardData.token) {
                    //user already capture the card on this turn
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you already use the answer command. Please wait until the next card spawn.";
                    return message.channel.send({embed:objEmbed});
                } else if(spawnedCardData.type != "quiz"){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, it's not quiz time yet.";
                    return message.channel.send({embed:objEmbed});
                } else if(answer==null||
                    (answer.toLowerCase()!="a"&&answer.toLowerCase()!="b"&&answer.toLowerCase()!="c")){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Please enter the answer parameter with **a** or **b** or **c**.";
                    return message.channel.send({embed:objEmbed});
                }

                var jsonParsedSpawnData = JSON.parse(guildSpawnData[DBM_Card_Guild.columns.spawn_data]);
                
                spawnedCardData.id = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.id_card];
                spawnedCardData.answer = jsonParsedSpawnData[CardModule.Properties.spawnData.quiz.answer];

                var success = false; var msgSend = "";
                //get card data
                var cardSpawnData = await CardModule.getCardData(spawnedCardData.id);
                spawnedCardData.color = cardSpawnData[DBM_Card_Data.columns.color];
                spawnedCardData.pack = cardSpawnData[DBM_Card_Data.columns.pack];

                answer = answer.toLowerCase();
                var pointReward = 0;
                if(answer!=spawnedCardData.answer){
                    objEmbed.thumbnail = {
                        url: CardModule.Properties.imgResponse.imgFailed
                    }
                    objEmbed.description = `:x: Sorry, your answer is wrong. The correct answer was: **${spawnedCardData.answer} - ${CardModule.Properties.dataCardCore[spawnedCardData.pack].fullname}**`;
                    return message.channel.send({embed:objEmbed});
                } else {
                    success = true;
                }

                if(success){
                    //check for duplicates
                    var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardData.id);
                    
                    if(duplicateCard){
                        var randomPoint = Math.floor(Math.random() * 5)+3;//for received random card point

                        objEmbed.thumbnail = {
                            url: CardModule.Properties.imgResponse.imgFailed
                        }
                        objEmbed.description = `:x: The answer was correct! But you already have this card: **${spawnedCardData.id} - ${cardSpawnData[DBM_Card_Data.columns.name]}**. As a bonus you have received **${randomPoint} ${spawnedCardData.color}** color points.`;
                        //update the catch token & color point
                        pointReward = randomPoint;
                        message.channel.send({embed:objEmbed});
                    } else {
                        pointReward = 10;
                        msgSend = `:white_check_mark: The answer was correct! **${userUsername}** have received: **${cardSpawnData[DBM_Card_Data.columns.name]}** & **${pointReward} ${spawnedCardData.color}** color points.`;

                        //insert new card
                        await CardModule.addNewCardInventory(userId,spawnedCardData.id);
                        var currentTotalCard = await CardModule.getUserTotalCard(userId,spawnedCardData.pack);//get the current card total
                        
                        var objEmbed = CardModule.embedCardCapture(spawnedCardData.color,spawnedCardData.id,
                            spawnedCardData.pack,cardSpawnData[DBM_Card_Data.columns.name],cardSpawnData[DBM_Card_Data.columns.img_url],cardSpawnData[DBM_Card_Data.columns.series],cardSpawnData[DBM_Card_Data.columns.rarity],userAvatarUrl,userUsername,currentTotalCard);
                        
                        message.channel.send({content:msgSend,embed:objEmbed});
                    }
                } else {
                    message.channel.send({embed:objEmbed});
                }

                var objColor = new Map();
                objColor.set(`color_point_${spawnedCardData.color}`,pointReward);
                await CardModule.updateCatchAttempt(userId,
                    spawnedCardData.token,
                    objColor
                );

                //check card pack completion:
                var embedCompletion = null;
                var checkCardCompletionPack = await CardModule.checkCardCompletion(userId,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                var checkCardCompletionColor = await CardModule.checkCardCompletion(userId,"color",spawnedCardData.color);

                if(checkCardCompletionPack){
                    //card pack completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"pack",cardSpawnData[DBM_Card_Data.columns.pack]);
                } else if(checkCardCompletionColor) {
                    //color set completion
                    embedCompletion = await CardModule.leaderboardAddNew(guildId,userId,userAvatarUrl,CardModule.Properties.dataColorCore[cardSpawnData[DBM_Card_Data.columns.color]].color,"color",spawnedCardData.color);
                }

                if(embedCompletion!=null){
                    message.channel.send({embed:embedCompletion});
                }

                await CardModule.removeCardGuildSpawn(guildId);

                //generate new card:
                // var objEmbedNewCard =  await CardModule.generateCardSpawn(guildId,"quiz",false);
                // message.channel.send({embed:objEmbedNewCard});
                
                break;
            case "respawn":
                //respawn the question again
                //check if user have enough color point/not
                var userCardData = await CardModule.getCardUserStatusData(userId);
                var assignedColor = userCardData[DBM_Card_User_Data.columns.color];
                var assignedColorPoint = userCardData[`color_point_${assignedColor}`];

                //validator: check if color point is enough/not
                var priceRespawn = 20;
                if(assignedColorPoint<priceRespawn){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        description : `:x: Sorry, you need **${priceRespawn} ${assignedColor}** color points to use the **card respawn**.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                var objEmbed = {
                    color: CardModule.Properties.embedColor
                };

                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                //check if token is same/not
                if(guildSpawnData[DBM_Card_Guild.columns.spawn_token]==null||
                userCardData[DBM_Card_User_Data.columns.spawn_token]==guildSpawnData[DBM_Card_Guild.columns.spawn_token]){
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgError
                        },
                        author: {
                            name: userUsername,
                            iconURL: userAvatarUrl
                        },
                        description : `:x: Sorry you cannot use the **card respawn** this time.`
                    };
                    return message.channel.send({embed:objEmbed});
                }

                //update the color point
                var parameterSetColorPoint = new Map();
                parameterSetColorPoint.set(`color_point_${assignedColor}`,-priceRespawn);
                await CardModule.updateColorPoint(userId,parameterSetColorPoint);

                var rndChances = Math.floor(Math.random()*10);

                if(rndChances>=9){
                    objEmbed.title="Card Spawn Activated!";
                    objEmbed.description = `<@${userId}> has use the **card spawn** & **${priceRespawn} ${assignedColor} color point**!`;
                    message.channel.send({embed:objEmbed});
                    var cardSpawnData = await CardModule.generateCardSpawn(guildId);
                    return message.channel.send({embed:cardSpawnData});
                } else {
                    await CardModule.updateCatchAttempt(userId,guildSpawnData[DBM_Card_Guild.columns.spawn_token]);
                    var objEmbed = {
                        color: CardModule.Properties.embedColor,
                        thumbnail : {
                            url: CardModule.Properties.imgResponse.imgFailed
                        },
                        author: {
                            name: userUsername,
                            iconURL: userAvatarUrl
                        },
                        description : `:x: Sorry, the card respawn has failed. You also need to wait until the next card spawn.`
                    };
                    return message.channel.send({embed:objEmbed});
                }
                //get card spawn information
                
                
                break;
            // case "debug":
            //     //for card spawn debug purpose
            //     var cardSpawnData = await CardModule.generateCardSpawn(guildId);
            //     message.channel.send({embed:cardSpawnData});
            //     break;
            default:
                break;
        }
	},
};
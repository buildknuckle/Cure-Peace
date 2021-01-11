const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DBConn = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const CardGuildModule = require('../modules/CardGuild');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Card_User_Data = require('../database/model/DBM_Card_User_Data');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

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
                objEmbed.title = `Card Status | Level: ${cardUserStatusData[DBM_Card_User_Data.columns.level]} | EXP: ${cardUserStatusData[DBM_Card_User_Data.columns.exp]} | Color: ${cardUserStatusData[DBM_Card_User_Data.columns.color]}`;
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
                    message.channel.send("Please enter the card pack that you want to see."); return;
                } else if(!CardModule.Properties.dataCardCore.hasOwnProperty(pack)){
                    var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                    objEmbed.title = `Card Pack List`;
                    objEmbed.fields = [{
                            name: `Pink`,
                            value: `Nagisa
                            Saki
                            Nozomi
                            Love
                            Tsubomi
                            Hibiki
                            Miyuki
                            Mana
                            Megumi
                            Haruka
                            Mirai
                            Ichika
                            Hana
                            Hikaru
                            Nodoka`,
                            inline: true
                        },
                        {
                            name: `Blue`,
                            value: `Karen
                            Miki
                            Erika
                            Ellen
                            Reika
                            Rikka
                            Hime
                            Minami
                            Aoi
                            Saaya
                            Yuni
                            Chiyu`,
                            inline: true
                        },
                        {
                            name: `Yellow`,
                            value: `Hikari
                            Urara
                            Inori
                            Itsuki
                            Ako
                            Yayoi
                            Alice
                            Yuko
                            Kirara
                            Himari
                            Homare
                            Elena
                            Hinata`,
                            inline: true
                        },
                        {
                            name: `Purple`,
                            value: `Yuri
                            Makoto
                            Iona
                            Riko
                            Yukari
                            Amour
                            Madoka
                            Kurumi`,
                            inline: true
                        },
                        {
                            name: `Red`,
                            value: `Rin
                            Setsuna
                            Akane
                            Aguri
                            Towa
                            Akira
                            Emiru`,
                            inline: true
                        },
                        {
                            name: `Green`,
                            value: `Komachi
                            Nao
                            Kotoha
                            Ciel
                            Lala
                            `,
                            inline: true
                        },
                        {
                            name: `White`,
                            value: `Honoka
                            Mai
                            Kanade`,
                            inline: true
                        }
                    ];
                    message.channel.send({
                        content:"Sorry, I cannot find that card pack. Here are the list of all available card pack:",
                        embed:objEmbed}); 
                    return;
                }

                //user parameter validator
                var memberExists = true;
                if(args[2]!=null){
                    var parameterUsername = args[2];
                    await message.guild.members.fetch({query:`${parameterUsername}`,limit:1,count:false})
                    .then(
                        members=> {
                            if(members.size>=1){
                                userUsername = members.first().user.username;
                                userAvatarUrl = members.first().user.defaultAvatarURL;
                            } else {
                                memberExists = false;
                            }
                            // console.log(members.size);
                        }
                    );
                }

                if(!memberExists){
                    message.channel.send("Sorry, I can't find that username."); return;
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
                            objEmbed.thumbnail = {
                                url: CardModule.Properties.imgResponse.imgError
                            }
                            objEmbed.description = ":x: You are not assigned on the available listed color. Please assign your color with: **p!card color set <color>**";
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
                    CardModule.updateCatchAttempt(userId,
                        spawnedCardData.token,
                        objColor
                    );
                    return message.channel.send({embed:objEmbed});
                }

                //RNG: calculate catch attempt
                var captured = false;
                var chance = parseInt(cardSpawnData[DBM_Card_Data.columns.rarity]); 
                var rngCatch = Math.floor(Math.random() * 10);//rng point
                switch(spawnedCardData.type){
                    case "color":
                        if(rngCatch+1>=chance){
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
            case "guess":
                
                break;
            case "debug":
                var objReturnEmbed = await CardModule.generateCardSpawn(guildId);
                if(objReturnEmbed!=null){
                    message.channel.send({embed:objReturnEmbed});
                }
                
                break;
            default:
                break;
        }
	},
};
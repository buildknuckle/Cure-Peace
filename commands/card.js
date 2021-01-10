const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const DB = require('../storage/dbconn');
const CardModule = require('../modules/Card');
const CardGuildModule = require('../modules/CardGuild');
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
                    color: CardModule.embedColor,
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
                var cardDataInventory = await DB.conn.promise().query(query, arrParameterized);
                cardDataInventory[0].forEach(function(entry){
                    arrCardTotal[entry[DBM_Card_Data.columns.pack]] = entry['total'];
                });

                var cardUserStatusData = await CardModule.getCardUserStatusData(userId);
                objEmbed.title = `Card Status | Level: ${cardUserStatusData[DBM_Card_User_Data.columns.level]} | EXP: ${cardUserStatusData[DBM_Card_User_Data.columns.exp]} | Color: ${cardUserStatusData[DBM_Card_User_Data.columns.color]}`;
                objEmbed.fields = [{
                        name: `Pink(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_pink]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_pink]}):`,
                        value: `Nagisa:${arrCardTotal.nagisa}/${CardModule.dataCardCore.nagisa.total}
                        Saki:${arrCardTotal.saki}/${CardModule.dataCardCore.saki.total}
                        Nozomi:${arrCardTotal.nozomi}/${CardModule.dataCardCore.nozomi.total}
                        Love:${arrCardTotal.love}/${CardModule.dataCardCore.love.total}
                        Tsubomi:${arrCardTotal.tsubomi}/${CardModule.dataCardCore.tsubomi.total}
                        Hibiki:${arrCardTotal.hibiki}/${CardModule.dataCardCore.hibiki.total}
                        Miyuki:${arrCardTotal.miyuki}/${CardModule.dataCardCore.miyuki.total}
                        Mana:${arrCardTotal.mana}/${CardModule.dataCardCore.mana.total}
                        Megumi:${arrCardTotal.megumi}/${CardModule.dataCardCore.megumi.total}
                        Haruka:${arrCardTotal.haruka}/${CardModule.dataCardCore.haruka.total}
                        Mirai:${arrCardTotal.mirai}/${CardModule.dataCardCore.mirai.total}
                        Ichika:${arrCardTotal.ichika}/${CardModule.dataCardCore.ichika.total}
                        Hana:${arrCardTotal.hana}/${CardModule.dataCardCore.hana.total}
                        Hikaru:${arrCardTotal.hikaru}/${CardModule.dataCardCore.hikaru.total}
                        Nodoka:${arrCardTotal.nodoka}/${CardModule.dataCardCore.nodoka.total}`,
                        inline: true
                    },
                    {
                        name: `Blue(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_blue]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_blue]}):`,
                        value: `Karen:${arrCardTotal.karen}/${CardModule.dataCardCore.karen.total}
                        Miki:${arrCardTotal.miki}/${CardModule.dataCardCore.miki.total}
                        Erika:${arrCardTotal.erika}/${CardModule.dataCardCore.erika.total}
                        Ellen:${arrCardTotal.ellen}/${CardModule.dataCardCore.ellen.total}
                        Reika:${arrCardTotal.hikaru}/${CardModule.dataCardCore.reika.total}
                        Rikka:${arrCardTotal.rikka}/${CardModule.dataCardCore.rikka.total}
                        Hime:${arrCardTotal.hime}/${CardModule.dataCardCore.hime.total}
                        Minami:${arrCardTotal.minami}/${CardModule.dataCardCore.minami.total}
                        Aoi:${arrCardTotal.aoi}/${CardModule.dataCardCore.aoi.total}
                        Saaya:${arrCardTotal.saaya}/${CardModule.dataCardCore.saaya.total}
                        Yuni:${arrCardTotal.yuni}/${CardModule.dataCardCore.yuni.total}
                        Chiyu:${arrCardTotal.chiyu}/${CardModule.dataCardCore.chiyu.total}`,
                        inline: true
                    },
                    {
                        name: `Yellow(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_yellow]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_yellow]}):`,
                        value: `Hikari:${arrCardTotal.hikari}/${CardModule.dataCardCore.hikari.total}
                        Urara:${arrCardTotal.urara}/${CardModule.dataCardCore.urara.total}
                        Inori:${arrCardTotal.inori}/${CardModule.dataCardCore.inori.total}
                        Itsuki:${arrCardTotal.itsuki}/${CardModule.dataCardCore.itsuki.total}
                        Ako:${arrCardTotal.ako}/${CardModule.dataCardCore.ako.total}
                        Yayoi:${arrCardTotal.yayoi}/${CardModule.dataCardCore.yayoi.total}
                        Alice:${arrCardTotal.alice}/${CardModule.dataCardCore.alice.total}
                        Yuko:${arrCardTotal.yuko}/${CardModule.dataCardCore.yuko.total}
                        Kirara:${arrCardTotal.kirara}/${CardModule.dataCardCore.kirara.total}
                        Himari:${arrCardTotal.himari}/${CardModule.dataCardCore.himari.total}
                        Homare:${arrCardTotal.homare}/${CardModule.dataCardCore.homare.total}
                        Elena:${arrCardTotal.elena}/${CardModule.dataCardCore.elena.total}
                        Hinata:${arrCardTotal.hinata}/${CardModule.dataCardCore.hinata.total}`,
                        inline: true
                    },
                    {
                        name: `Purple(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_purple]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_purple]}):`,
                        value: `Yuri:${arrCardTotal.yuri}/${CardModule.dataCardCore.yuri.total}
                        Makoto:${arrCardTotal.makoto}/${CardModule.dataCardCore.makoto.total}
                        Iona:${arrCardTotal.iona}/${CardModule.dataCardCore.iona.total}
                        Riko:${arrCardTotal.riko}/${CardModule.dataCardCore.riko.total}
                        Yukari:${arrCardTotal.yukari}/${CardModule.dataCardCore.yukari.total}
                        Amour:${arrCardTotal.amour}/${CardModule.dataCardCore.amour.total}
                        Madoka:${arrCardTotal.madoka}/${CardModule.dataCardCore.madoka.total}
                        Kurumi:${arrCardTotal.kurumi}/${CardModule.dataCardCore.kurumi.total}`,
                        inline: true
                    },
                    {
                        name: `Red(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_red]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_red]}):`,
                        value: `Rin:${arrCardTotal.rin}/${CardModule.dataCardCore.rin.total}
                        Setsuna:${arrCardTotal.setsuna}/${CardModule.dataCardCore.setsuna.total}
                        Akane:${arrCardTotal.akane}/${CardModule.dataCardCore.akane.total}
                        Aguri:${arrCardTotal.aguri}/${CardModule.dataCardCore.aguri.total}
                        Towa:${arrCardTotal.towa}/${CardModule.dataCardCore.towa.total}
                        Akira:${arrCardTotal.akira}/${CardModule.dataCardCore.akira.total}
                        Emiru:${arrCardTotal.emiru}/${CardModule.dataCardCore.emiru.total}`,
                        inline: true
                    },
                    {
                        name: `Green(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_green]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_green]}):`,
                        value: `Komachi:${arrCardTotal.komachi}/${CardModule.dataCardCore.komachi.total}
                        Nao:${arrCardTotal.nao}/${CardModule.dataCardCore.nao.total}
                        Kotoha:${arrCardTotal.kotoha}/${CardModule.dataCardCore.kotoha.total}
                        Ciel:${arrCardTotal.ciel}/${CardModule.dataCardCore.ciel.total}
                        Lala:${arrCardTotal.lala}/${CardModule.dataCardCore.lala.total}`,
                        inline: true
                    },
                    {
                        name: `White(CL: ${cardUserStatusData[DBM_Card_User_Data.columns.color_level_white]}/ CP: ${cardUserStatusData[DBM_Card_User_Data.columns.color_point_white]}):`,
                        value: `Honoka:${arrCardTotal.honoka}/${CardModule.dataCardCore.honoka.total}
                        Mai:${arrCardTotal.mai}/${CardModule.dataCardCore.mai.total}
                        Kanade:${arrCardTotal.kanade}/${CardModule.dataCardCore.kanade.total}`,
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
                    color: CardModule.embedColor
                };

                //card pack validator
                if(pack==null){
                    message.channel.send("Please enter the card pack that you want to see."); return;
                } else if(!CardModule.dataCardCore.hasOwnProperty(pack)){
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
                var cardDataInventory = await DB.conn.promise().query(query, arrParameterized);
                // var cardDataInventory = await CardModule.getAllCardDataByPack(pack);
                var progressTotal = 0; var ctr = 0; var maxCtr = 4; var pointerMaxData = cardDataInventory[0].length;
                cardDataInventory[0].forEach(function(entry){
                    var icon = ":x:";
                    //checkmark if card is owned
                    if(entry[DBM_Card_Inventory.columns.id_user]!=null){
                        icon = ":white_check_mark:"; progressTotal++;
                    }
                    cardList+=`[${icon}${entry[DBM_Card_Data.columns.id_card]} - ${entry[DBM_Card_Data.columns.name]}](${entry[DBM_Card_Data.columns.img_url]})\n`;
                    //create pagination
                    if(pointerMaxData-1<=0||ctr>maxCtr){
                        objEmbed.fields = [{
                            name: `Progress: ${progressTotal}/${CardModule.dataCardCore[pack].total}`,
                            value: cardList
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
                var guildSpawnData = await CardGuildModule.getCardGuildData(guildId);
                var objEmbed = {
                    color: CardModule.embedColor
                };

                var spawnedCardId = "";

                //card catcher validator, check if card is still spawning/not
                if(guildSpawnData.spawn_token==null||
                    (guildSpawnData.spawn_id==null&&guildSpawnData.spawn_color==null)){
                    objEmbed.thumbnail = {
                        "url": CardModule.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, the card is not spawned yet. Please wait until the next card spawn."
                    return message.channel.send({embed:objEmbed});
                }  else if(guildSpawnData.spawn_id!=null){
                    //check if user already have the card/not
                    spawnedCardId = guildSpawnData[DBM_Card_Guild.columns.spawn_id];
                }

                //check for duplicates
                var duplicateCard = await CardModule.checkUserHaveCard(userId,spawnedCardId);
                if(duplicateCard){
                    objEmbed.thumbnail = {
                        "url": CardModule.imgResponse.imgError
                    }
                    objEmbed.description = ":x: Sorry, you already have this card.";
                    return message.channel.send({embed:objEmbed});
                }
                
                //randomize card catch value
                //get card rarity if spawn type is individual
                var objColor = new Map();
                objColor.set(`color_point_blue`,5);
                //update the catch token
                CardModule.updateCatchAttempt(userId,
                    guildSpawnData[DBM_Card_Guild.columns.spawn_token],
                    objColor
                )

            default:
                break;
        }
	},
};
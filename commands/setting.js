const DB = require('../database/DatabaseCore');
const CardModules = require('../modules/Card');
const CardGuildModules = require('../modules/CardGuild');

const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

module.exports = {
	name: 'setting',
    description: 'Contain all card setting category',
    args: true,
	async execute(message, args) {
        var guildId = message.guild.id;
        var userId = message.author.id;

        //check if user is moderator
        if (!message.guild.members.cache.find(member => member.id === userId).hasPermission('KICK_MEMBERS')) {
            return message.channel.send("Sorry, you need to be moderator to use this command.");
        }
        
        //init & get card guild data
        var cardGuildData = await CardGuildModules.getCardGuildData(guildId);
        
        switch(args[0]) {
            case "spawn":
                //remove the card spawn settings and the timer
                if(args[1].toLowerCase()=="remove"){
                    clearInterval(CardGuildModules.arrTimerCardSpawn[guildId]);
                    clearInterval(CardGuildModules.arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
                    var parameterSet = new Map();
                    parameterSet.set(DBM_Card_Guild.columns.id_channel_spawn,null);
                    parameterSet.set(DBM_Card_Guild.columns.spawn_interval,null);
                    var parameterWhere = new Map();
                    parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                    DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);
                    return message.channel.send(`Card spawn settings has been removed.`);
                }

                // var slicedArgs = args.slice(1);
                var assignedChannel = args[1];
                assignedChannel = assignedChannel.match(/^<#?(\d+)>$/); //regex if channel format is correct/not

                var interval = args[2];
                //parameter: minutes
                var intervalMinutes = parseInt(interval);
                //check channel format
                if(!assignedChannel){
                    return message.channel.send(`Please mention the correct channel name.`);
                } else if(!Number.isNaN(intervalMinutes)){
                    assignedChannel = assignedChannel[1];

                    if(intervalMinutes>=5 && intervalMinutes<=1440){
                        //update card interval
                        var arr = new Map([
                            [DBM_Card_Guild.columns.id_guild, guildId],
                        ]);
                        
                        var columnSet = new Map();
                        columnSet.set(DBM_Card_Guild.columns.spawn_interval, intervalMinutes);
                        var columnWhere = new Map();
                        columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);

                        //check if channel exists
                        const channelExists = message.guild.channels.cache.find(ch => ch.id === assignedChannel)
                        if(!channelExists){
                            //channel not exists
                            return message.channel.send(`Please mention the correct channel name.`);
                        } else {
                            columnSet.set(DBM_Card_Guild.columns.id_channel_spawn, assignedChannel);
                            //clear & set new card spawn
                            clearInterval(CardGuildModules.arrTimerCardSpawn[guildId]);
                            CardGuildModules.arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
                                //get the card guild data to get the role of card catcher
                                cardGuildData = await CardGuildModules.getCardGuildData(guildId);
                                var objEmbed = await CardModules.generateCardSpawn(guildId);

                                var finalSend = {}; 
                                if(cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]!=null){
                                    finalSend = {
                                        content:`<@&${cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]}>`,
                                        embed:objEmbed
                                    }
                                } else {
                                    finalSend = {
                                        embed:objEmbed
                                    }
                                }

                                var msgObject = await message.guild.channels.cache.find(ch => ch.id === assignedChannel)
                                .send(finalSend);
                                await CardModules.updateMessageIdSpawn(guildId,msgObject.id);
                            }, parseInt(intervalMinutes)*60*1000);
                        }

                        await DB.update(DBM_Card_Guild.TABLENAME,
                            columnSet,
                            columnWhere
                        );

                        //update the time remaining information:
                        await CardGuildModules.updateTimerRemaining(guildId);

                        return message.channel.send(`Card spawn interval has been set into **${intervalMinutes}** minutes at <#${assignedChannel}>.`);
                    } else {
                        return message.channel.send("Please enter interval(in minutes) between 5-1440.");
                    }
                } else {
                    return message.channel.send("Please enter interval(in minutes) with number format between 5-1440.");
                }
                // code block
                //return message.channel.send(slicedArgs[0]);
            case "cardcatcher":
                if(args[1].toLowerCase()=="remove"){
                    //remove the cardcatcher role
                    var columnSet = new Map();
                    columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, null);
                    var columnWhere = new Map();
                    columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
                    await DB.update(DBM_Card_Guild.TABLENAME,
                        columnSet,
                        columnWhere
                    );

                    //update the timer
                    //clear & update the card spawn timer if timer exists
                    // cardGuildData = await CardGuildModules.getCardGuildData(guildId);
                    if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
                        clearInterval(CardGuildModules.arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
                        clearInterval(CardGuildModules.arrTimerCardSpawn[guildId]);
                        CardGuildModules.arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
                            var objEmbed = await CardModules.generateCardSpawn(guildId);
                            message.guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]).send({embed:objEmbed});
                        }, parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval])*60*1000);
                        //update the time remaining information:
                        await CardGuildModules.updateTimerRemaining(guildId);
                    }
                    
                    
                    return message.channel.send("**Cardcatcher** roles has been removed.");
                }

                var assignedRole = args[1];
                var roleExists = assignedRole.match(/^\d+$/); //regex if channel format is correct/not

                //check role format
                if(!roleExists){
                    return message.channel.send(`Please enter the role ID for **cardcatcher** or enter **remove** to remove the cardcatcher role.`);
                }

                //check if channel exists
                roleExists = message.guild.roles.cache.has(assignedRole);

                if(!roleExists){
                    //channel not exists
                    return message.channel.send(`Sorry, I can't find that role ID. Please enter the correct role ID for **cardcatcher**.`);
                } else {
                    //set new card catcher role ID
                    var columnSet = new Map();
                    columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, assignedRole);
                    var columnWhere = new Map();
                    columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
                    await DB.update(DBM_Card_Guild.TABLENAME,
                        columnSet,
                        columnWhere
                    );

                    //update the card spawn timer if timer exists
                    if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
                        clearInterval(CardGuildModules.arrTimerGuildInformation[guildId].timer);//clear the timer remaining information
                        clearInterval(CardGuildModules.arrTimerCardSpawn[guildId]);
                        CardGuildModules.arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
                            var objEmbed = await CardModules.generateCardSpawn(guildId);
                            message.guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn])
                            .send({content:`<@&${assignedRole}>`,
                                embed:objEmbed});
                        }, parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval])*60*1000);
                        //update the time remaining information:
                        await CardGuildModules.updateTimerRemaining(guildId);
                    }

                    return message.channel.send({
                        embed:{
                            color:CardModules.Properties.embedColor,
                            description:`<@&${assignedRole}> has been set as card catcher role.`
                        }
                    });

                }
            default:
                break;
        }

	},
};
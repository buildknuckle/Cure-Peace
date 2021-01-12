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
        
        //init & get card guild data
        var cardGuildData = await CardGuildModules.getCardGuildData(guildId);
        
        switch(args[0]) {
            case "spawn":
                if(args[1].toLowerCase()=="remove"){
                    //remove the card spawn settings, remove the timer
                    clearInterval(CardGuildModules.arrTimerCardSpawn[guildId]);
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
                            //set new card spawn
                            CardGuildModules.arrTimerCardSpawn[guildId] = setInterval(async function intervalCardSpawn(){
                                var objEmbed = await CardModules.generateCardSpawn(guildId);
                                message.guild.channels.cache.find(ch => ch.id === assignedChannel)
                                .send({embed:objEmbed});
                            }, parseInt(intervalMinutes)*1000);

                        }

                        DB.update(DBM_Card_Guild.TABLENAME,
                            columnSet,
                            columnWhere
                        );

                        return message.channel.send(`Card spawn interval has been set into **${intervalMinutes}** minutes at <#${assignedChannel}>.`);
                    } else {
                        return message.channel.send("Please enter interval(in minutes) between 5-1440.");
                    }
                } else {
                    return message.channel.send("Please enter interval(in minutes) with number format between 5-1440.");
                }
                // code block
                //return message.channel.send(slicedArgs[0]);
                break;
            
            default:
                break;
            // code block
        }

	},
};
const DB = require('../database/DatabaseCore');
const CardModules = require('../modules/Card');
const CardGuildModules = require('../modules/CardGuild');

const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');

module.exports = {
	name: 'setting',
    description: 'Contain all card setting category',
    args: true,
	execute(message, args) {
        var guildId = message.guild.id;
        
        //get card guild data
        CardGuildModules.getCardGuildData(guildId,function nothing(result){});
        var slicedArgs = args.slice(1);
        switch(args[0]) {
            case "interval":
                //parameter: minutes
                var intervalMinutes = parseInt(slicedArgs[0]);
                if(!Number.isNaN(intervalMinutes)){
                    if(intervalMinutes>=5 && intervalMinutes<=1440){
                        //update card interval
                        var arr = new Map([
                            [DBM_Card_Guild.columns.id_guild, guildId],
                        ]);
                        
                        var columnSet = new Map();
                        columnSet.set(DBM_Card_Guild.columns.spawn_interval, intervalMinutes);
                        var columnWhere = new Map();
                        columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);

                        DB.update(DBM_Card_Guild.TABLENAME,
                            columnSet,
                            columnWhere
                        );

                        return message.channel.send(`Card spawn interval has been set into **${intervalMinutes}** minutes.`);
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
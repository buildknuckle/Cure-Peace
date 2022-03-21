const CardModules = require("./Card");
// const DataUser = require("./data/User");
const Guild = require("./data/Guild");
const SpawnerModules  = require("./data/Spawner");
const Spawner = SpawnerModules.Spawner;

async function init(){
    //load card modules
    await CardModules.init();
}

async function initGuild(guildId, discordGuild){
    var guildData = await Guild.getDBData(guildId);
    var guild = new Guild(
        guildData
    );
    // Guild.setData(guildId, guild);

    //init for card spawn
    if(guild.id_channel_spawn!=null){
        var assignedChannel = guild.id_channel_spawn;
    
        //check if channel exists/not
        var guildChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(guildChannel){
            var spawner = new Spawner({
                guildId: guildId,
                guildChannel: guildChannel,
                interval: guild.spawn_interval,
                idRoleping: {
                    cardcatcher: guild.id_roleping_cardcatcher
                }
            });

            // if(guild.spawn_type!==null || guild.spawn_data!==null){
            //     spawner.type = guild.spawn_type;
            //     spawner.spawnData = guild.spawn_data;
            //     await spawner.initSpawner();
            // }

            // await spawner.startTimer(guildData);

            guild.spawner = spawner;//set guild spawner
            guild.updateData();
            // console.log(guild);
            return;

            // spawner.guildId = guildId;
            // spawner.guildChannel = guildChannel;
            // spawner.interval = guild.spawn_interval;
            // spawner.token = guild.spawn_token;
            // spawner.idRoleping.cardcatcher = guild.id_roleping_cardcatcher;
            

            

            
            
            
            console.log(guild);
            return;
        }
    }
}

module.exports = {
    init, initGuild
}
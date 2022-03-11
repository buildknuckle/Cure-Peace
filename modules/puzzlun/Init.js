const CardModules = require("./Card");
const DataUser = require("./data/User");
const DataGuild = require("./data/Guild");
const SpawnerModules  = require("./data/Spawner");
const Spawner = SpawnerModules.Spawner;

async function init(){
    //load card modules
    await CardModules.init();
}

async function initGuild(guildId, discordGuild){
    var guild = new DataGuild(
        await DataGuild.getDBData(guildId)
    );
    DataGuild.setData(guildId, guild);

    //init for card spawn
    if(guild.id_channel_spawn!=null){
        var assignedChannel = guild.id_channel_spawn;
    
        //check if channel exists/not
        var guildChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(guildChannel){
            var spawner = new Spawner();
            // await spawner.init(guildId, guildChannel, guild.spawn_interval,
            // guild.spawn_token, guild.spawn_type, guild.spawn_data,
            // guild.id_roleping_cardcatcher);

            spawner.guildId = guildId;
            spawner.guildChannel = guildChannel;
            spawner.interval = guild.spawn_interval;
            spawner.token = guild.spawn_token;
            spawner.idRoleping.cardcatcher = guild.id_roleping_cardcatcher;
            if(guild.spawn_type!==null || guild.spawn_data!==null){
                spawner.type = guild.spawn_type;
                spawner.spawnData = guild.spawn_data;
                await spawner.setSpawnData();
            }

            await spawner.startTimer();
            guild.setSpawner(spawner.type, spawner.spawnData, spawner);
        }
    }
}

module.exports = {
    init, initGuild
}
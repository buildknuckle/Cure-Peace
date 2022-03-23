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
    if(guild.id_channel_spawn!=null&&guild.spawn_interval!=null){
        var assignedChannel = guild.id_channel_spawn;
    
        //check if channel exists/not
        var spawnChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(spawnChannel){
            var spawner = new Spawner({
                guildId: guildId,
                spawnChannel: spawnChannel,
                interval: guild.spawn_interval,
                idRoleping: {
                    cardcatcher: guild.id_roleping_cardcatcher
                }
            });

            // await spawner.startTimer(guildData);

            guild.spawner = spawner;//set guild spawner
            guild.updateData();
            // console.log(guild);
            return;
        }
    }
}

module.exports = {
    init, initGuild
}
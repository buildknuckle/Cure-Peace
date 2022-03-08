const CardModules = require("./Card");
const DataGuild = require("./data/Guild");
const SpawnerModules  = require("./data/Spawner");
const Spawner = SpawnerModules.Spawner;

async function init(){
    //load card modules
    await CardModules.init();
}

async function initGuild(guildId, discordGuild){
    var dataGuild = new DataGuild(
        await DataGuild.getDBData(guildId)
    );
    DataGuild.setData(guildId, dataGuild);

    //init for card spawn
    if(dataGuild.id_channel_spawn!=null){
        var assignedChannel = dataGuild.id_channel_spawn;
    
        //check if channel exists/not
        var guildChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(guildChannel){
            var spawner = new Spawner();
            await spawner.init(guildId, guildChannel, dataGuild.spawn_interval,
            dataGuild.spawn_type, dataGuild.spawn_data);

            // var spawner = new CardNormal();
            // await spawner.init(guildId, guildChannel, dataGuild.spawn_interval,
            // dataGuild.spawn_type, dataGuild.spawn_data);
            // console.log(spawner);
            
            // var b = new Spawner.type.normal(spawner.data);
            // console.log(b.embedSpawn.components[0]);
            // DataGuild.setSpawner(guildId, spawner);
            // await spawner.random();
            // dataGuild.updateData();
            // console.log(DataGuild.data);
            // console.log(DataGuild.getData(guildId));
            // spawner.guildChannel.send({content:"init ok"});
        }

        // console.log(DataGuild.data);
    }
    

    // b();
    // console.log(b);
    // console.log(DataGuild.getData(guildId));

    // await client.channels.cache.find(ch => ch.id === '793074374663995412')
    // .send(sendParam)
    // DataGuild.data[guildId] = dataGuild;
    // if(dataGuild.isSpawnActive()){
    //     this.Spawner = new DataSpawner(this.spawn_type, this.spawn_data);
    // }
    // console.log(DataGuild.data[guildId]);
    
    // setInterval(function(){
    //     console.log(`TIMER ${guildId}`);
    // }, 1000);
}

module.exports = {
    init, initGuild
}
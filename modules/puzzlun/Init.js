const CardModules = require("./Card");
const DataGuild = require("./data/Guild");
const Spawner  = require("./data/Spawner");

async function init(){
    //load card modules
    await CardModules.init();
}

async function initGuild(guildId, discordGuild){
    var guildData = await DataGuild.getDBData(guildId);
    var dataGuild = new DataGuild(guildData);
    DataGuild.setData(guildId, dataGuild);


    if(dataGuild.id_channel_spawn!=null){
        var assignedChannel = dataGuild.id_channel_spawn;
        // var b = Spawner.Timer.start;
    
        //check if channel exists/not
        var guildChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(guildChannel){
            Spawner.Timer.start(guildChannel);
            // guildChannel.send({content:"init ok"});
        }
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
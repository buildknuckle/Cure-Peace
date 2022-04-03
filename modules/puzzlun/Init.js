const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const CardModules = require("./Card");
const Card = require("./data/Card");
const Guild = require("./data/Guild");
const {Shikishi} = require("./data/Shikishi");
const {Character} = require("./data/Character");
const SpawnerModules  = require("./data/Spawner");
const Spawner = SpawnerModules.Spawner;
const Instance = require('./data/Instance');
const Gachapon = require("./Gachapon");
const Shop = require("./Shop");
const Daily = require("./Daily");


async function init(){
    //load total card for all pack
    var query = `select cd.${Card.columns.pack}, count(cd.${Card.columns.pack}) as total, 
        cd.${Card.columns.color}, cd.${Card.columns.series}
        from ${Card.tablename} cd
        group by cd.${Card.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++){
        var dataCard = new Card(cardData[i]);
        Character.setTotal(dataCard.pack, cardData[i]["total"]);
    }

    //init shikishi data
    await Shikishi.init();

    //init gachapon data
    await Gachapon.init();

    //init shop data
    await Shop.init();

    //init daily
    await Daily.init();

    //init instance reward data
    await Instance.init();


    // console.log(Gachapon.dailyRollsCardData[1]);
}

async function initGuild(guildId, discordGuild){
    var guildData = await Guild.getDBData(guildId);
    var guild = new Guild(guildData);

    //init for card spawn
    if(guild.id_channel_spawn!=null&&guild.spawn_interval!=null){
        var assignedChannel = guild.id_channel_spawn;
    
        //check if channel exists/not
        var spawnChannel = discordGuild.channels.cache.find(ch => ch.id === assignedChannel);
        if(spawnChannel){
            var spawner = new Spawner({
                // guildId: guildId,
                spawnChannel: spawnChannel,
                interval: guild.spawn_interval,
                idRoleping: {
                    cardcatcher: guild.id_roleping_cardcatcher
                }
            });

            // await spawner.startTimer(guildData);
            await spawner.startTimer();

            guild.spawner = spawner;//set guild spawner
            // console.log(guild);
        }
    }
    
    guild.updateData();
    // console.log(guild);
}

module.exports = {
    init, initGuild
}
// const CardModule = require("../modules/card/Card");
// const BattleModule = require("../modules/card/Battle");

// const SpackModule = require("../modules/card/Spack");
// const AvatarModule = require("../modules/card/Avatar");
const DataCard = require('./Card');
const DataGuild = require("../modules/puzzlun/data/Guild");
const Spawner = require("../modules/puzzlun/data/Spawner");

module.exports = {
    name: 'debug',
    cooldown: 5,
    description: 'Dev debug command',
    args: true,
    options:[
        {
            name: "test",
			description: "Debug test",
			type: 3
		}
	],

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        // var objSpawn = await (guildId);
        // await interaction.reply(objSpawn);

        var oldDataGuild = new DataGuild(DataGuild.getData(guildId));
        var randomCard = await Spawner.type.normal.getRandomCard();
        var normalSpawn = new Spawner.type.normal();
        //to be called on spawn:
        normalSpawn.setCardData(randomCard);
        //await normalSpawn.spawn(guildId);
        // var spawnData = normalSpawn.getSpawnData();
        var b = await interaction.reply(normalSpawn.getEmbedSpawn());
        console.log(b);
        // console.log(spawnData);

        // await normalSpawn.spawn(guildId);
        // console.log(oldDataGuild);

        // oldDataGuild.setSpawner(normalSpawn.type, normalSpawn);
        // DataGuild.setData(guildId, oldDataGuild);
        
        // var newDataGuild = new DataGuild(DataGuild.getData(guildId));
        // console.log(newDataGuild);

        //set data to guild
        // setInterval(function(){
        //     console.log("HELLO");
        // },1000);
        // 


    }
}
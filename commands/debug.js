// const CardModule = require("../modules/card/Card");
// const BattleModule = require("../modules/card/Battle");

// const SpackModule = require("../modules/card/Spack");
// const AvatarModule = require("../modules/card/Avatar");
const DataCard = require('./Card');
const DataGuild = require("../modules/puzzlun/data/Guild");
const SpawnerModules = require("../modules/puzzlun/data/Spawner");

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

        var dataGuild = new DataGuild(DataGuild.getData(guildId));
        console.log(dataGuild);


    }
}
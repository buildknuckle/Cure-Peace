const DataCard = require('./Card');
const Guild = require("../modules/puzzlun/data/Guild");
const Spawner = require("../modules/puzzlun/data/Spawner");

module.exports = {
    name: 'debug',
    cooldown: 5,
    description: 'Dev debug command',
    args: true,
    options:[
        {
            name: "spawn",
			description: "Debug spawn",
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

        var guildData = Guild.getData(guildId);
        var guild = new Guild(guildData);
        await guild.spawner.randomizeSpawn(guildData);


    }
}
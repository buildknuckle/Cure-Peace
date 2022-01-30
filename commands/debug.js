const CardModule = require("../modules/card/Card");

const SpackModule = require("../modules/card/Spack");

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

        var objSpawn = await CardModule.Spawner.spawnBattle(guildId);
        await interaction.reply(objSpawn);

        // await interaction.reply("text <:color_pink:935901707026714714>");

        // switch(command){
        //     //STATUS MENU: open card status
        //     case "test":
        //         await interaction.reply("ok");
        //         break;
        // }
    }
}
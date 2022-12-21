const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { Embed } = require("../modules/discord/Embed");

module.exports = {
	name: "info",
	description: "Peace will give info about herself",
	type: ApplicationCommandType.ChatInput,
	options:[
		{
			name: "server",
			description: "Peace will give info about herself",
			type: ApplicationCommandOptionType.String,
		},
	],
	execute(interaction) {
		const totalGuild = interaction.client.guilds.cache.size;
		const embed = new Embed();
		embed.authorName = interaction.client.user.username;
		embed.thumbnail = "https://waa.ai/JEwq.png";
		embed.color = 0xefcc2c;
		embed.title = "Here's some info about me.";
		embed.description = `I am in **${totalGuild}** servers right now.`;
		interaction.reply(embed.buildEmbed());
	},
};
const { ApplicationCommandType } = require("discord.js");
const { Embed } = require("../modules/discord/Embed");

module.exports = {
	name: "help",
	description: "Cure Peace help command",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			// basic command
			name: "command-list",
			description: "List all basic command of cure Peace",
			type: 1,
		},
	],
	execute(interaction) {
		const embed = new Embed();
		embed.title = "Cure Peace Command List";
		embed.addFields("/anilist", "Search with Anilist");
		embed.addFields("/jankenpon", "Play jankenpon with Peace");
		embed.addFields("/sakugabooru", "Search with Sakugabooru");
		embed.addFields("/saucenao", "Search image with Saucenao");
		embed.addFields("/temp", "Convert temperature");
		embed.addFields("/thread", "Peace will join/leave thread");

		return interaction.reply(embed.buildEmbed());
	},
};
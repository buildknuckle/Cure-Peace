const { ApplicationCommandType } = require("discord.js");

module.exports = {
	type: ApplicationCommandType.ChatInput,
	name: "hello",
	description: "Peace will say hello",
	async execute(interaction) {
		await interaction.reply("hello!");
	},
};
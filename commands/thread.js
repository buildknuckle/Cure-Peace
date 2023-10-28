const { ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = {
	name: "thread",
	description: "Assign Peace to join/leave from thread",
	type: ApplicationCommandType.ChatInput,
	args: true,
	options: [
		{
			name: "join",
			description: "Peace will join current thread",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "leave",
			description: "Peace will leave from thread",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
		case "join": {
			if (interaction.channel.type === ChannelType.PublicThread ||
				interaction.channel.type === ChannelType.PrivateThread) {
				interaction.reply({ content: "Peace has joined into this thread!", ephemeral: true });
				await interaction.channel.join();
			}
			else {
				interaction.reply({ content: ":x: Cannot join into this channel", ephemeral: true });
			}

			break;
		}
		case "leave": {
			try {
				// check channel type
				if (interaction.channel.type === ChannelType.PublicThread ||
				interaction.channel.type === ChannelType.PrivateThread) {
					interaction.reply({ content: "Peace now leaving from this thread", ephemeral: true });
					await interaction.channel.leave();
				}
				else {
					interaction.reply({ content: ":x: I can only leave from thread", ephemeral: true });
				}
			}
			catch (err) {
				console.log(err);
			}
			break;
		}

		}
	},
};
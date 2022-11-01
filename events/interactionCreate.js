const { InteractionType, ComponentType } = require("discord.js");
const { PaginationConfig } = require("../modules/discord/Pagination");
const { errorLog } = require("../modules/Logger");
const { dateTimeNow } = require("../modules/helper/datetime");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		// slash text command
		if (interaction.isChatInputCommand()) {
			try {
				const command = interaction.client.commands.get(interaction.commandName);
				await command.execute(interaction);
			}
			catch (error) {
				const log = `[INTERACTION_CREATE] ${dateTimeNow()} ${error}`;
				console.log(log);
				errorLog(log);
			}
		}

		try {
			switch (interaction.type) {
			case InteractionType.MessageComponent:{
				// split dot and get the command
				let command = interaction.customId.split(".");

				switch (interaction.componentType) {
				case ComponentType.SelectMenu:
					// split dot and get the command
					// modify the id & remove the command name
					interaction.customId = command[1];
					command = interaction.client.commands.get(command[0]);
					await command.executeComponentSelectMenu(interaction);
					break;
				case ComponentType.Button:
					// prevent from pagination button
					if (interaction.customId == PaginationConfig.prevBtn || interaction.customId == PaginationConfig.nextBtn) return;

					// modify the id & remove the command name
					interaction.customId = command[1];
					command = interaction.client.commands.get(command[0]);
					await command.executeComponentButton(interaction);
					break;
				}
				break;
			}
			}
		}
		catch (error) {
			const log = `[INTERACTION_CREATE] ${dateTimeNow()} ${error}`;
			console.error(log);
			errorLog(log);
		}
	},
};
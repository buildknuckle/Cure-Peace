const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		// if (!interaction.isCommand()) return;

		try {
			switch(interaction.type){
				case "APPLICATION_COMMAND":
					try{
						const command = interaction.client.commands.get(interaction.commandName);
						await command.execute(interaction);
					} catch(error){
						console.log(error);
					}
					break;
				case "MESSAGE_COMPONENT":
					switch(interaction.componentType){
						case "SELECT_MENU":
							var command = interaction.customId.split(".");//split dot and get the command
							interaction.customId = command[1];//modify the id & remove the command name
							command = interaction.client.commands.get(command[0]);
							await command.executeComponentSelectMenu(interaction);
							break;
						case "BUTTON":
							//prevent paging button call
							if(interaction.customId=="previousbtn"||interaction.customId=="nextbtn") return;
							var command = interaction.customId.split(".");//split dot and get the command
							interaction.customId = command[1];//modify the id & remove the command name
							command = interaction.client.commands.get(command[0]);
							await command.executeComponentButton(interaction);
							break;
					}
					break;
			}
		} catch(error){
			console.error(error);
			// await GlobalFunctions.errorLogger(error);
		}



		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};
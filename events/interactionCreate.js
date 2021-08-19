const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (!interaction.isCommand()) return;

		try{
			const command = interaction.client.commands.get(interaction.commandName);
			await command.execute(interaction);
		} catch(error){
			console.log(error);
		}

		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};
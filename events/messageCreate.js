const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { prefix } = require('../storage/config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		var cooldown = false;

		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (!message.client.commands.has(commandName)) return;
		const command = message.client.commands.get(commandName);
		
		if (command.args && !args.length) {
			return message.reply(`I don't know what you're talking about. Can you give me some arguments?`);
		}

		try {
			if(!cooldown){
				cooldown = true;
				// message.channel.startTyping();
				await command.executeMessage(message, args);
				// message.channel.stopTyping();
				cooldown = false;
			}
			// message.channel.stopTyping();
		} catch (error) {
			console.error(error);
			cooldown = false;
			GlobalFunctions.errorLogger(error);
			message.reply("I'm having trouble doing what you're asking me to do, help!");
			// message.channel.stopTyping();
		}
    }
}
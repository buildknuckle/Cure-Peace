const dotenv = require("dotenv").config();
const prefix = dotenv.parsed.bot_prefix;
const { errorLog } = require("../modules/Logger");
const { dateTimeNow } = require("../modules/helper/datetime");

module.exports = {
	name: "messageCreate",
	async execute(message) {
		// check if message author was bot
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		if (!message.client.commands.has(commandName)) return;
		const command = message.client.commands.get(commandName);

		if (!("executeMessage" in command)) return;

		if (command.args && !args.length) {
			return message.reply("I don't know what you're talking about. Can you give me some arguments?");
		}

		try {
			await command.executeMessage(message, args);
		}
		catch (error) {
			const log = `[MESSAGE_CREATE] ${dateTimeNow()} ${error}`;
			errorLog(log);
			message.reply("I'm having trouble doing what you're asking me to do, help!");
		}
	},
};
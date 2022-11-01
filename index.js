const dotenv = require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const { Client, GatewayIntentBits, Partials } = Discord;

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Discord.Collection();

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(dotenv.parsed.bot_token);
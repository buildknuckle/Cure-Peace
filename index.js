const fs = require('fs');
const Discord = require('discord.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const GlobalFunctions = require('./modules/GlobalFunctions');
// const CardModules = require('./modules/Card');
// const CardGuildModules = require('./modules/CardGuild');
// const WeatherModules = require('./modules/Weather');
const { prefix, token } = require('./storage/config.json');

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

const { Client, Intents } = Discord;
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

client.commands = new Discord.Collection();

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token)

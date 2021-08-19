const fs = require('fs');
const Discord = require('discord.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const DBM_Card_Guild = require('./database/model/DBM_Card_Guild');
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

// const commands = [];
// 

const cooldowns = new Discord.Collection();
var cooldown = false;

// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
//     client.commands.set(command.name, command);	
// }
            
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//end

//message:
// client.on('messageCreate', async message => {
//     if (!message.content.startsWith(prefix) || message.author.bot) return;

//     const args = message.content.slice(prefix.length).trim().split(/ +/);
//     const commandName = args.shift().toLowerCase();

//     if (!client.commands.has(commandName)) return;
//     const command = client.commands.get(commandName);
    
//     if (command.args && !args.length) {
//         return message.reply(`I don't know what you're talking about. Can you give me some arguments?`);
//     }

//     try {
//         if(!cooldown){
//             cooldown = true;
//             // message.channel.startTyping();
//             var msgRet = await command.execute(message, args);
//             // message.channel.stopTyping();
//             cooldown = false;
//         }
//         // message.channel.stopTyping();
//     } catch (error) {
//         console.error(error);
//         cooldown = false;
//         GlobalFunctions.errorLogger(error);
//         message.reply("I'm having trouble doing what you're asking me to do, help!");
//         // message.channel.stopTyping();
//     }

//     if (!cooldowns.has(command.name)) {
//         cooldowns.set(command.name, new Discord.Collection());
//     }
    
//     const now = Date.now();
//     const timestamps = cooldowns.get(command.name);
//     const cooldownAmount = (command.cooldown || 3) * 1000;
    
//     if (timestamps.has(message.author.id)) {
//         const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

// 	    if (now < expirationTime) {
// 		    const timeLeft = (expirationTime - now) / 1000;
// 		    return message.reply(`I can't keep up! Wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command again!`);
// 	    }
//     }
    
// });

client.login(token)

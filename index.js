const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./storage/config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//set random activity status
function intervalRandomStatus() {
    var arrActivity = [
        'Sparkling, glittering, rock-paper-scissors! Cure Peace!',
        'Healin good precure!',
        'The two lights that come together! Cure Sparkle!',
        'Puzzlun Cure!'
    ];
    var randIndex = Math.floor(Math.random() * Math.floor(arrActivity.length));
    client.user.setActivity(arrActivity[randIndex]);
    //console.log(DBM_Card_User_Data.columns.id_user);
    // const guild = new Discord.Guild();
    // guild.channels.cache.find(ch => ch.name === 'testing-ground').send('Hello world.');
    //client.channel.fetch(795299749745131560).send("hello world");
}

function invtervalCardSpawn(){

}

client.once('ready', () => {
    //same like guildAvailable
    client.guilds.cache.forEach(guild => {
        console.log("connected to:"+guild.name);

        //set card spawn interval
        

    });

    //randomize the status:
    setInterval(intervalRandomStatus, 15000);

    console.log('Cure Peace Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
    
    if (command.args && !args.length) {
        return message.reply(`I don't know what you're talking about. Can you give me some arguments?`);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("I'm having trouble doing what you're asking me to do, help!");
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`I can't keep up! Wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command again!`);
	    }
    }

    if (!peacestats[message.author.id]){ 
        peacestats[message.author.id] = {
           win: 0,
           draw: 0,
           loss: 0,
           points: 0
       };
   }
    
});

client.login(token)
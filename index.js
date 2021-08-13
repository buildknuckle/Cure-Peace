const fs = require('fs');
const Discord = require('discord.js');
const DBM_Card_Guild = require('./database/model/DBM_Card_Guild');
const GlobalFunctions = require('./modules/GlobalFunctions');
const CardModules = require('./modules/Card');
const CardGuildModules = require('./modules/CardGuild');
const WeatherModules = require('./modules/Weather');
const { prefix, token } = require('./storage/config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();
var cooldown = false;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    // //force bot to leave from all of the guild:
   /* client.guilds.cache.forEach(async guild => {
        var whitelistServerId = 793074374663995412;//DON'T FORGET TO REPLACE THIS ID WITH YOUR SERVER ID. This server ID is just for example
        if(guild.id!=whitelistServerId){
            console.log(`Leaving from: ${guild.id} - ${guild.name}`);
            guild.leave();
        }
    });
    console.log("All done!");
    return;
*/

    //prepare the weather
    //initialize the garden timer information:
    WeatherModules.updateTimerRemaining();

    // WeatherModules.timerWeatherInformation.timer = setInterval(function intervalCardSpawn(){
    //     //randomize the weather 
    //     WeatherModules.Properties.currentWeather = GlobalFunctions.randomProperty(WeatherModules.Properties.weatherData);
    // }, parseInt(WeatherModules.Properties.interval)*60*1000);

    //same like guildAvailable
    client.guilds.cache.forEach(async guild => {
        console.log(`connected to: ${guild.id} - ${guild.name}`);
        //guild.channels.cache.find(ch => ch.name === 'testing-ground').send('Hello world.');

        //get card spawn guild data
        var cardGuildData = await CardGuildModules.getCardGuildData(guild.id);
        //set card spawn interval
        if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
            //check if channel exists/not
            const channelExists = guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn])
            if(channelExists){
                CardGuildModules.arrTimerCardSpawn[guild.id] = setInterval(async function intervalCardSpawn(){
                    var objEmbed = await CardModules.generateCardSpawn(guild.id);
                    //check if cardcatcher role exists/not
                    var finalSend = {}; 
                    if(cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]!=null){
                        finalSend = {
                            content:`<@&${cardGuildData[DBM_Card_Guild.columns.id_cardcatcher]}>`,
                            embed:objEmbed
                        }
                    } else {
                        finalSend = {
                            embed:objEmbed
                        }
                    }

                    var msgObject = await guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn])
                    .send(finalSend);
                    //update the last message id
                    await CardModules.updateMessageIdSpawn(guild.id,msgObject.id);

                }, parseInt(cardGuildData[DBM_Card_Guild.columns.spawn_interval])*60*1000);
            }
            //update the time remaining information:
            await CardGuildModules.updateTimerRemaining(guild.id);
        }
        
    });

    //added the activity
    var arrActivity = [
        'Sparkling, glittering, rock-paper-scissors! Cure Peace!',
        'Puzzlun Cure!'
    ];

    var randIndex = Math.floor(Math.random() * Math.floor(arrActivity.length));
    client.user.setActivity(arrActivity[randIndex]);

    //randomize the status every 1 hour:
    setInterval(function intervalRandomStatus() {
        client.user.setActivity(arrActivity[randIndex]);
    }, 3600000);
    console.log('Cure Peace Ready!');
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);
    
    if (command.args && !args.length) {
        return message.reply(`I don't know what you're talking about. Can you give me some arguments?`);
    }

    try {
        if(!cooldown){
            cooldown = true;
            message.channel.startTyping();
            var msgRet = await command.execute(message, args);
            message.channel.stopTyping();
            cooldown = false;
        }
        message.channel.stopTyping();
    } catch (error) {
        console.error(error);
        cooldown = false;
        GlobalFunctions.errorLogger(error);
        message.reply("I'm having trouble doing what you're asking me to do, help!");
        message.channel.stopTyping();
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

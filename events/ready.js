const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const CardModules = require('../modules/Card');
const CardGuildModules = require('../modules/CardGuild');
const WeatherModules = require('../modules/Weather');
const { prefix, token } = require('../storage/config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
        const rest = new REST({ version: '9' }).setToken(token);

		// console.log('Ready!');
        WeatherModules.updateTimerRemaining();
        
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
        	const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);	
        }

        client.guilds.cache.forEach(async guild => {
            console.log(`connected to: ${guild.id} - ${guild.name}`);
            (async () => {
                try {
                    // console.log('Started refreshing application (/) commands.');
                    await rest.put(
                        Routes.applicationGuildCommands(`${client.application.id}`,`${guild.id}`),
                        { body: client.commands.toJSON() },
                    );
            
                    // console.log('Successfully reloaded application (/) commands.');
                } catch (error) {
                    console.error(error);
                }
            })();
    
            //get card spawn guild data
            var cardGuildData = await CardGuildModules.getCardGuildData(guild.id);
            //set card spawn interval
            if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
                //check if channel exists/not
                var channelExists = guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn])
                if(channelExists){

                    await CardGuildModules.initCardSpawnInstance(guild.id,guild);
                }
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
	},
};
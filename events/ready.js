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
            
            //guild.channels.cache.find(ch => ch.name === 'testing-ground').send('Hello world.');
    
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
	},
};
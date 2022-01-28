const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const DBM_Guild_Data = require('../database/model/DBM_Guild_Data');
const CardModules = require('../modules/card/Card');
const GuildModule = require('../modules/card/Guild');
// const CardGuildModules = require('../modules/CardGuild');
// const WeatherModules = require('../modules/Weather');
const { prefix, token } = require('../storage/config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        try {
            const rest = new REST({ version: '9' }).setToken(token);

            //load all necessary card data
            await CardModules.init();

            // console.log('Ready!');
            // WeatherModules.updateTimerRemaining();
            
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                client.commands.set(command.name, command);	
            }

            client.guilds.cache.forEach(async guild => {
                //init/one time load load all necessary guild data
                await GuildModule.init(guild.id);

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
                        // GlobalFunctions.errorLogger(error);
                    }
                })();
        
                //get card spawn guild data
                // var cardGuildData = await CardGuildModules.getCardGuildData(guild.id);
                // //set card spawn interval
                // if(cardGuildData[DBM_Card_Guild.columns.id_channel_spawn]!=null){
                //     //check if channel exists/not
                //     var channelExists = guild.channels.cache.find(ch => ch.id === cardGuildData[DBM_Card_Guild.columns.id_channel_spawn])
                //     if(channelExists){
                //         await CardGuildModules.initCardSpawnInstance(guild.id,guild);
                //     }
                // }
                
            });

            // console.log(GuildModule.dataUserLogin);
        
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
        } catch(error){
            console.log(error);
            // GlobalFunctions.errorLogger(error);
        }
	},
};
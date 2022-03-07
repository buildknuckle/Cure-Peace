const GlobalFunctions = require('../modules/GlobalFunctions');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

const PuzzlunInit = require("../modules/puzzlun/Init");
const Birthday = require('../modules/Birthday');
const DBM_Birthday_Guild = require("../database/model/DBM_Birthday_Guild");

const { prefix, token } = require('../storage/config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        try {
            const rest = new REST({ version: '9' }).setToken(token);

            await PuzzlunInit.init();//init card modules

            // console.log('Ready!');
            // WeatherModules.updateTimerRemaining();
            
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                client.commands.set(command.name, command);	
            }

            client.guilds.cache.forEach(async guild => {
                let guildId = guild.id;
                await PuzzlunInit.initGuild(guildId, guild);//init/one time load for all necessary guild data
                // await GuildModule.init(guild.id);//init/one time load for all necessary guild data

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

                let birthdayGuildData = await Birthday.getGuildConfig(guild.id);
                let notif_channel = birthdayGuildData[DBM_Birthday_Guild.columns.id_notification_channel];
                let birthdays_enabled_for_guild = birthdayGuildData[DBM_Birthday_Guild.columns.enabled] === 1;
                if (notif_channel) {
                    let birthdayNotifChannelExists = guild.channels.cache.find(ch => ch.id === birthdayGuildData[DBM_Birthday_Guild.columns.id_notification_channel]);
                    if (birthdayNotifChannelExists && birthdays_enabled_for_guild) {
                        console.log(`birthday notif channel exists! ${birthdayNotifChannelExists} (${birthdayNotifChannelExists.name})`);
                        await Birthday.initBirthdayReportingInstance(guild.id, guild);
                    }
                } else if (birthdays_enabled_for_guild && notif_channel == null) {
                    console.warn(`Birthdays enabled for '${guild.name}' but no notification channel specified!`);
                }
                
            });

            // await BattleModules.init();//init battle modules
        
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
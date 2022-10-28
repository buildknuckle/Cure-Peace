const GlobalFunctions = require('../modules/GlobalFunctions');

// const PuzzlunInit = require("../modules/puzzlun/Init");
const Birthday = require('../modules/Birthday');
const DBM_Birthday_Guild = require("../database/model/DBM_Birthday_Guild");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            // await PuzzlunInit.init();//init puzzlun modules
            // console.log('Ready!');

            await client.guilds.cache.forEach(guild => {
                // let guildId = guild.id;
                // await PuzzlunInit.initGuild(guildId, guild);

                // init/one time load for all necessary guild data
                console.log(`connected to: ${guild.id} - ${guild.name}`);
                //Guild commands (To be used during development)
                // (async () => {
                //     try {
                //         // console.log('Started refreshing application (/) commands.');
                //         await rest.put(
                //             Routes.applicationGuildCommands(`${client.application.id}`,`${guild.id}`),
                //             { body: client.commands.toJSON() },
                //         );

                //         // console.log('Successfully reloaded application (/) commands.');
                //     } catch (error) {
                //         console.error(error);
                //         // GlobalFunctions.errorLogger(error);
                //     }
                // })();

                let birthdayGuildData = Birthday.getGuildConfig(guild.id);
                console.log(birthdayGuildData);
                let notif_channel = birthdayGuildData[DBM_Birthday_Guild.columns.id_notification_channel];
                let birthdays_enabled_for_guild = birthdayGuildData[DBM_Birthday_Guild.columns.enabled] === 1;
                if (notif_channel) {
                    let birthdayNotifChannelExists = guild.channels.cache.find(ch => ch.id === birthdayGuildData[DBM_Birthday_Guild.columns.id_notification_channel]);
                    if (birthdayNotifChannelExists && birthdays_enabled_for_guild) {
                        console.log(`birthday notif channel exists! ${birthdayNotifChannelExists} (${birthdayNotifChannelExists.name})`);
                        Birthday.initBirthdayReportingInstance(guild.id, guild);
                    }
                } else if (birthdays_enabled_for_guild && notif_channel == null) {
                    console.warn(`Birthdays enabled for '${guild.name}' but no notification channel specified!`);
                }

            });
            //added the activity
            const arrActivity = [
                'Sparkling, glittering, rock-paper-scissors! Cure Peace!',
                'Puzzlun Peace!'
            ];

            const randIndex = Math.floor(Math.random() * Math.floor(arrActivity.length));
            client.user.setActivity(arrActivity[randIndex]);

            //randomize the status every 1 hour:
            setInterval(function intervalRandomStatus() {
                client.user.setActivity(arrActivity[randIndex]);
            }, 3600000);
            console.log('Cure Peace Ready!');
        } catch (error) {
            console.log(error);
            await GlobalFunctions.errorLogger(error);
        }
    },
};
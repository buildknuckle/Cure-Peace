const Birthday = require('../modules/Birthday');
const {MessageEmbed, MessageButton, Permissions} = require('discord.js');
const paginationEmbed = require('discordjs-button-pagination');
// const wait = require('util').promisify(setTimeout);

module.exports = {
    name: 'birthday',
    description: 'Birthday ping management',
    args: true,
    options: [
        {
            type: 1,
            name: "add",
            description: "Adds your birthday to the list",
            options: [
                {
                    type: 4,
                    name: "month",
                    description: "What month",
                    required: true
                },
                {
                    type: 4,
                    name: "day",
                    description: "Day",
                    required: true
                },
                {
                    type: 3,
                    name: "notes",
                    description: "Any favorite, hobby or something we can use as input to surprise you when it's " +
                        "your birthday?",
                    required: false
                }
            ]
        },
        {
            type: 1,
            name: "list",
            description: "List"

        },
        {
            type: 1,
            name: "remove",
            description: "Entered a wrong date? Remove your birthday from the list here."

        }
    ],
    executeMessage: async function (message, args) {
        const guildId = message.guild.id;

        const config = await Birthday.getGuildConfig(guildId, false);
        // let canSendInNotifChannel = false;
        let notif_channel = null;
        if (config) {
            notif_channel = message.guild.channels.cache.get(config.id_notification_channel);
            // canSendInNotifChannel = notif_channel.permissionsFor(message.author).has(Permissions.FLAGS.SEND_MESSAGES);
        }

        const isAdmin = message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
        const isDev = ['148794707563118593', '145584315839938561', '171225691751317504'];
        // const planner_role = message.guild.roles.cache.find(role => role.name === "Birthday Planner");
        // const user_has_planner_role = planner_role && message.author.roles.cache.has(planner_role.id);

        if (isAdmin || isDev.includes(message.author.id)) {
            switch (args[0]) {
                case 'enable':
                    await Birthday.setGuildConfig(guildId, null, null, true)
                        .then(async () => {
                            await message.react('✅');
                        }).catch(async () => {
                            await message.react('❌');
                        });

                    break;
                case 'disable':
                    await Birthday.setGuildConfig(guildId, null, null, false)
                        .then(async () => {
                            await message.react('✅');
                        }).catch(async () => {
                            await message.react('❌');
                        });
                    break;
                case "setchannel":
                    const mentioned_channel = message.mentions.channels.first();
                    if (mentioned_channel) {
                        notif_channel = mentioned_channel.id;
                        await Birthday.setGuildConfig(guildId, notif_channel).then(async () => {
                            await message.react('✅');
                        }).catch(async () => {
                            await message.react('❌');
                        });

                    } else {
                        const channel_obj = message.guild.channels.cache.find(ch => ch.name === args[1]);
                        if (channel_obj) {
                            await Birthday.setGuildConfig(guildId, channel_obj.id).then(async () => {
                                await message.react('✅');
                            }).catch(async () => {
                                await message.react('❌');
                            });
                        }
                    }
                    break;
                case "sethour":
                    const hour = parseInt(args[1]);
                    const isValid = hour.toString().match('\\d{1,2}') && hour >= 0 && hour <= 24;
                    if (isValid) {
                        await Birthday.setGuildConfig(guildId, null, hour).then(async () => {
                            await message.react('✅');
                        }).catch(async () => {
                            await message.react('❌');
                        });
                    } else {
                        await message.reply({content: "Invalid hour specified!", ephemeral: true}).then((msg) => {
                            setTimeout(async () => {
                                await msg.delete();
                            }, 10000);
                        });
                    }
                    break;
                case "disablebirthday":
                    break;
                case "removebirthday":
                    break;
                    default:
                    break;
            }
        } else {
            await message.reply({content: `You are not allowed to use this command. Use /${module.exports.name}`});
        }
    },
    execute: async function (interaction) {
        const subcommand = interaction.options._subcommand;
        const guild_id = interaction.guild.id;
        const author_id = interaction.user.id;
        const author_name = interaction.user.username;
        const isBirthdayEnabled = await Birthday.isGuildEnabled(guild_id);
        if (!isBirthdayEnabled) {
            return interaction.reply({content: "The birthday module is not enabled.", ephemeral: true});
        }
        switch (subcommand) {
            case 'add':
                let month = interaction.options._hoistedOptions.find(opt => opt.name === 'month').value.toString();
                let day = interaction.options._hoistedOptions.find(opt => opt.name === 'day').value.toString();
                // const validMonth = /^([1-9]|1[0-2])$/.test(month.toString());
                const regex = /^(?:(?:1|3|5|7|8|10|12)-(?:[1-9]|1[0-9]|2[0-9]|3[01])|(?:4|6|9|11)-(?:0[1-9]|1[0-9]|2[0-9]|30)|2-(?:[1-9]|1[0-9]|2[0-9]))$/;
                let time = `${month.toString()}-${day.toString()}`;
                const isValidDate = regex.test(time);

                if (!isValidDate) {
                    return await interaction.reply("Invalid birthday date specified.");
                }
                // return interaction.reply("Invalid month specified");
                // }
                let notes_opt = interaction.options._hoistedOptions.find(opt => opt.name === 'notes');
                let notes;
                if (notes_opt) {
                    notes = notes_opt.value.toString();

                    if (notes.includes('`')) {
                        let warning = interaction.reply({
                            content: "Due to security reasons, notes cannot contain backticks.",
                            ephemeral: true
                        });
                        setTimeout(() => {
                            warning.delete();
                        }, 10000);
                        break;
                    }
                }
                let label = author_name;
                let birthday = new Date();
                // zero-based month integer
                birthday.setMonth(parseInt(month.toString()) - 1);
                birthday.setDate(parseInt(day.toString()));
                // february 29
                if (month.toString() === '1' && day.toString() === '29') {
                    birthday.setFullYear(2024);
                }

                let add = await Birthday.addBirthday(guild_id, author_id, birthday, label, notes);
                switch (add) {
                    case 'BIRTHDAY_EXISTS':
                        interaction.reply("I already have your birthday on file. Remove your birthday and re-add it.");
                        break;
                    case 'BIRTHDAY_ADDED':
                        interaction.reply('✅');
                        break;
                    case 'BIRTHDAY_ERROR':
                        interaction.reply("Something went wrong.");
                        break;
                }
                break;
            case 'list':
                // await interaction.deferReply();
                const birthdayList = await Birthday.getListOfBDsForThisServer(guild_id);

                const listSize = birthdayList.length;

                if (listSize > 25) {
                    let pages;
                    const chunk = 25;
                    const split = birthdayList.reduce((splitArray, item, index) => {
                        const chunkIndex = Math.floor(index / chunk);

                        if (!splitArray[chunkIndex]) {
                            splitArray[chunkIndex] = []; // start a new chunk
                        }

                        splitArray[chunkIndex].push(item);

                        return splitArray;
                    }, []);

                    // for (const splitKey in split) {
                    // console.log(split);
                    pages = [];
                    split.forEach((split) => {
                        let split_desc = '';
                        split.forEach(birthday => {
                            let userObj = interaction.guild.members.cache.get(`${birthday.id_user}`);
                            let month = (birthday.month.toString().length === 1) ? `0${birthday.month}` : birthday.month;
                            let day = (birthday.day.toString().length === 1) ? `0${birthday.day}` : birthday.day;

                            if (userObj) {
                                let hasNickname = userObj.name !== userObj.displayName;
                                split_desc += `${month}-${day} - <@${userObj.id_user} ${hasNickname ? userObj.name : null})\n`;
                            } else {
                                split_desc += `${month}-${day} - <@${birthday.id_user}> (${birthday.label})\n`;
                            }
                        });

                        const embed_split = new MessageEmbed()
                            .setTitle(`Birthday list`)
                            .setDescription(split_desc);

                        pages.push(embed_split);
                    });

                    const buttonList = [
                        new MessageButton().setCustomId('previousbtn').setLabel('Previous').setStyle('DANGER'),
                        new MessageButton().setCustomId('nextbtn').setLabel('Next').setStyle('SUCCESS')
                    ];

                    await paginationEmbed(interaction, pages, buttonList);
                } else {

                    let birthdayListEmbed = new MessageEmbed();
                    birthdayListEmbed.setTitle(`Birthday list ${listSize}`);

                    // can fit within one message
                    let birthdays = '';
                    birthdayList.forEach(birthday => {
                        let userObj = interaction.guild.members.cache.get(birthday.id_user);
                        let month = (birthday.month.toString().length === 1) ? `0${birthday.month}` : birthday.month;
                        let day = (birthday.day.toString().length === 1) ? `0${birthday.day}` : birthday.day;
                        if (userObj) {
                            birthdays += `${month}-${day} - <@${userObj.id_user} (${birthday.label})\n`;
                        } else {
                            birthdays += `~~${month}-${day} - <@${birthday.id_user}> (${birthday.label})~~\n`;
                        }
                    });

                    birthdayListEmbed.setDescription(birthdays);

                    interaction.reply({
                        embeds: [birthdayListEmbed],
                        ephemeral: true,
                        allowedMentions: {
                            "users": []
                        },
                    });
                }
                break;
            case 'remove':
                const removeBirthday = await Birthday.removeBirthday(guild_id, author_id);

                switch (removeBirthday) {
                    case 'NO_BIRTHDAY':
                        interaction.reply({content: `There's no birthday on file!`, ephemeral: true});
                        break;
                    case 'BIRTHDAY_DELETED':
                        interaction.reply({content: "✅"});
                        break;
                    case 'BIRTHDAY_ERROR':
                        interaction.reply('Something went wrong.');
                        break;
                }
        }
        // }
    }
};
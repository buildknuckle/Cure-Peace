const {Permissions, MessageEmbed} = require('discord.js');
const DiscordStyles = require('../../modules/DiscordStyles');
const DB = require('../../database/DatabaseCore');
const CardModules = require('../../modules/Card');
const CardGuildModules = require('../../modules/CardGuild');

const DBM_Card_Guild = require('../../database/model/DBM_Card_Guild');

module.exports = {
	name: 'setting',
    description: 'Contains all precure card catcher setting command.',
    args: true,
    options:[
        {
            name: "precure-card-spawn",
            description: "Assign the channel for precure card spawn",
            type: 1,
            options:[
                {
                    name:"channel-spawn",
                    description:"Choose the channel for precure card spawn",
                    type:7,
                    required:true
                },
                {
                    name:"spawn-interval",
                    description:"Enter the spawn interval(minutes) between 5-1440",
                    type:4,
                    required:true
                },
            ]
        },
        {
            name: "cardcatcher-role",
            description: "Assign the cardcatcher mention role.",
            type: 1,
            options:[
                {
                    name:"set-mention-role",
                    description:"Choose the role",
                    type:8,
                    required:true
                }
            ],
        },
        {
            name: "remove",
            description: "Remove settings menu",
            type: 1,
            options:[
                {
                    name:"settings",
                    description:"Choose the settings that you want to remove",
                    type:3,
                    choices:[
                        {
                            name:"card-spawn",
                            value:"card-spawn"
                        },
                        {
                            name:"role-cardcatcher",
                            value:"role-cardcatcher"
                        }
                    ]
                }
            ]
        }
    ],
	async executeMessage(message, args) {
        var guildId = message.guild.id;
        var userId = message.author.id;
	},
    async execute(interaction) {
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;
        var userUsername = interaction.user.username;
        var userAvatarUrl = interaction.user.avatarURL();

        //check if user has manage channels permission
        var hasPermission = await interaction.guild.members.cache.find(member => member.id === userId).permissions.has("MANAGE_CHANNELS");
        if (!hasPermission) {
            return interaction.reply(`:x: You need **Manage Channels** permissions to use this command.`);
        }

        //default embeds:
        var objEmbed = new MessageEmbed({
            color:DiscordStyles.Color.embedColor
        });

        switch(commandSubcommand){
            case "precure-card-spawn":
                var assignedChannel = interaction.options._hoistedOptions[0].value;
                var intervalMinutes = parseInt(interaction.options._hoistedOptions[1].value);
                //check channel format
                if(!Number.isNaN(intervalMinutes)){
                    if(intervalMinutes>=1 && intervalMinutes<=1440){
                        //update card interval
                        var columnSet = new Map();
                        columnSet.set(DBM_Card_Guild.columns.spawn_interval, intervalMinutes);
                        columnSet.set(DBM_Card_Guild.columns.id_channel_spawn, assignedChannel);
                        var columnWhere = new Map();
                        columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,
                            columnSet,
                            columnWhere
                        );

                        await CardGuildModules.updateCardSpawnInstance(guildId,interaction);
                        objEmbed.setTitle("Precure Card Spawn Updated!");
                        objEmbed.setDescription(`Next precure card will be spawned at: <#${assignedChannel}>/**${intervalMinutes}** minutes.`);
                        return interaction.reply({embeds:[objEmbed]});
                    } else {
                        return interaction.reply("Please enter valid interval(minutes) between 5-1440.");
                    }
                } else {
                    return interaction.reply("Please enter valid interval(minutes) between 5-1440.");
                }

                break;
            case "cardcatcher-role":
                var assignedRole = interaction.options._hoistedOptions[0].value;

                //check if channel exists
                // roleExists = message.guild.roles.cache.has(assignedRole);

                //set new card catcher role ID
                var columnSet = new Map();
                columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, assignedRole);
                var columnWhere = new Map();
                columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
                await DB.update(DBM_Card_Guild.TABLENAME,
                    columnSet,
                    columnWhere
                );

                await CardGuildModules.updateCardSpawnInstance(guildId,interaction);
                objEmbed.setTitle("Precure Cardcatcher Role Updated!");
                objEmbed.setDescription(`<@&${assignedRole}> has been assigned as new cardcatcher role.`);
                return interaction.reply({embeds:[objEmbed]});
                break;
            case "remove":
                var choices = interaction.options._hoistedOptions[0].value;
                switch(choices){
                    case "card-spawn":
                        //update database
                        var parameterSet = new Map();
                        parameterSet.set(DBM_Card_Guild.columns.id_channel_spawn,null);
                        parameterSet.set(DBM_Card_Guild.columns.spawn_interval,null);
                        var parameterWhere = new Map();
                        parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

                        //update spawn instance
                        await CardGuildModules.updateCardSpawnInstance(guildId,interaction);

                        //send embeds
                        objEmbed.setTitle("Precure Card Spawn Removed");
                        objEmbed.setDescription(`Precure card will no longer spawning.`);
                        return interaction.reply({embeds:[objEmbed]});
                        break;
                    case "role-cardcatcher":
                        //update database
                        var columnSet = new Map();
                        columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, null);
                        var columnWhere = new Map();
                        columnWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
                        await DB.update(DBM_Card_Guild.TABLENAME,columnSet,columnWhere);

                        //update spawn instance
                        await CardGuildModules.updateCardSpawnInstance(guildId,interaction);

                        //send embeds
                        objEmbed.setTitle("Precure Cardcatcher Mentions Removed");
                        objEmbed.setDescription(`${interaction.client.user.username} will no longer mentions during card spawn.`);
                        return interaction.reply({embeds:[objEmbed]});
                        break;
                }
                break;
        }

    }
};
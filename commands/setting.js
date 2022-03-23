const DB = require('../database/DatabaseCore');
const Embed = require('../modules/puzzlun/Embed');
const Guild = require("../modules/puzzlun/data/Guild");
const {Spawner} = require("../modules/puzzlun/data/Spawner");
const {init, initGuild} = require("../modules/puzzlun/Init");

module.exports = {
	name: 'setting',
    description: 'Contains all precure card catcher setting command.',
    args: true,
    options:[
        {
            name: "puzzlun-card-spawn",
            description: "Assign the channel for puzzlun card spawn",
            type: 1,
            options:[
                {
                    name:"channel",
                    description:"Choose the channel for puzzlun card spawn",
                    type:7,
                    required:true
                },
                {
                    name:"interval",
                    description:"Enter the spawn interval(in minutes) between 5-1440",
                    type:4,
                    required:true
                },
            ]
        },
        {
            name: "cardcatcher-role",
            description: "Assign the cardcatcher mention role during puzzlun card spawn.",
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
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;
        var userId = interaction.user.id;

        var discordUser = interaction.user;

        var hasPermission = await interaction.guild.members.cache.find(member => member.id === userId).permissions.has("MANAGE_CHANNELS");
        if (!hasPermission) { //validation: if user has manage channels permission
            return interaction.reply(
                Embed.errorMini(`:x: You need **manage channels** permission to use this command.`, discordUser, true)
            );
        }

        var guildData = Guild.getData(guildId);
        var guild = new Guild(guildData);
        var spawner = new Spawner(guild.spawner);

        switch(subcommand){
            case "puzzlun-card-spawn":
                var channel = interaction.options.getChannel("channel");
                var interval = interaction.options.getInteger("interval");
                
                if(channel.type!="GUILD_TEXT"){ //validation: invalid channel type
                    return interaction.reply(
                        Embed.errorMini(`:x: Spawn channel needs to be on type of text channel.`, discordUser, true,{
                            title:`Invalid channel type`
                        })
                    );
                }

                //stop timer
                var channelId = channel.id;
                if(interval>=1 && interval<=1440){
                    spawner.spawnChannel = channel;//assign channel

                    //update card interval
                    // var columnSet = new Map();
                    // columnSet.set(DBM_Card_Guild.columns.spawn_interval, interval);
                    // columnSet.set(DBM_Card_Guild.columns.id_channel_spawn, channelId);
                    // var columnWhere = new Map();
                    // columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
                    // await DB.update(DBM_Card_Guild.TABLENAME,
                    //     columnSet,
                    //     columnWhere
                    // );

                    await CardGuildModules.updateCardSpawnInstance(guildId,interaction);
                    objEmbed.setTitle("Precure Card Spawn Updated!");
                    objEmbed.setDescription(`Next precure card will be spawned at: <#${assignedChannel}>/**${interval}** minutes.`);
                    return interaction.reply({embeds:[objEmbed]});
                } else {
                    return interaction.reply(
                        Embed.errorMini("Please re-enter valid interval(minutes) between 5-1440.", discordUser, true)
                    );
                }
                break;
        }

        // switch(commandSubcommand){
        //     case "precure-card-spawn":
        //         var assignedChannel = interaction.options._hoistedOptions[0].value;
        //         var intervalMinutes = parseInt(interaction.options._hoistedOptions[1].value);
        //         //check channel format
        //         

        //         break;
        //     case "cardcatcher-role":
        //         var assignedRole = interaction.options._hoistedOptions[0].value;

        //         //check if channel exists
        //         // roleExists = message.guild.roles.cache.has(assignedRole);

        //         //set new card catcher role ID
        //         var columnSet = new Map();
        //         columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, assignedRole);
        //         var columnWhere = new Map();
        //         columnWhere.set(DBM_Card_Guild.columns.id_guild, guildId);
        //         await DB.update(DBM_Card_Guild.TABLENAME,
        //             columnSet,
        //             columnWhere
        //         );

        //         await CardGuildModules.updateCardSpawnInstance(guildId,interaction);
        //         objEmbed.setTitle("Precure Cardcatcher Role Updated!");
        //         objEmbed.setDescription(`<@&${assignedRole}> has been assigned as new cardcatcher role.`);
        //         return interaction.reply({embeds:[objEmbed]});
        //         break;
        //     case "remove":
        //         var choices = interaction.options._hoistedOptions[0].value;
        //         switch(choices){
        //             case "card-spawn":
        //                 //update database
        //                 var parameterSet = new Map();
        //                 parameterSet.set(DBM_Card_Guild.columns.id_channel_spawn,null);
        //                 parameterSet.set(DBM_Card_Guild.columns.spawn_interval,null);
        //                 var parameterWhere = new Map();
        //                 parameterWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
        //                 await DB.update(DBM_Card_Guild.TABLENAME,parameterSet,parameterWhere);

        //                 //update spawn instance
        //                 await CardGuildModules.updateCardSpawnInstance(guildId,interaction);

        //                 //send embeds
        //                 objEmbed.setTitle("Precure Card Spawn Removed");
        //                 objEmbed.setDescription(`Precure card will no longer spawning.`);
        //                 return interaction.reply({embeds:[objEmbed]});
        //                 break;
        //             case "role-cardcatcher":
        //                 //update database
        //                 var columnSet = new Map();
        //                 columnSet.set(DBM_Card_Guild.columns.id_cardcatcher, null);
        //                 var columnWhere = new Map();
        //                 columnWhere.set(DBM_Card_Guild.columns.id_guild,guildId);
        //                 await DB.update(DBM_Card_Guild.TABLENAME,columnSet,columnWhere);

        //                 //update spawn instance
        //                 await CardGuildModules.updateCardSpawnInstance(guildId,interaction);

        //                 //send embeds
        //                 objEmbed.setTitle("Precure Cardcatcher Mentions Removed");
        //                 objEmbed.setDescription(`${interaction.client.user.username} will no longer mentions during card spawn.`);
        //                 return interaction.reply({embeds:[objEmbed]});
        //                 break;
        //         }
        //         break;
        // }

    }
};
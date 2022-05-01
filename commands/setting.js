const DB = require('../database/DatabaseCore');
const Embed = require('../modules/puzzlun/Embed');
const Guild = require("../modules/puzzlun/data/Guild");
const Admin = require("../modules/puzzlun/data/Admin");
const {Spawner} = require("../modules/puzzlun/data/Spawner");
const {init, initGuild} = require("../modules/puzzlun/Init");

class Validation {

    static restrictedPermission(discordUser){
        return Embed.errorMini(`You're not allowed to use this command.`, discordUser, true, {
            title:`❌ Restricted command`
        });
    }

    static restrictedDiscordPermission(discordUser){
        return Embed.errorMini(`You need **manage channels** permission to use this command.`, discordUser, true, {
            title:`❌ Restricted command`
        });
    }

    static invalidChannelType(discordUser){
        return Embed.errorMini(`:x: Spawn channel needs to be on type of text channel.`, discordUser, true, {
            title:`❌ Invalid channel type`
        });
    }
    
}

module.exports = {
	name: 'setting',
    description: 'Contains all precure card catcher setting command.',
    args: true,
    options:[
        {
            name: "puzzlun-card-spawn",
            description: "Assign the channel for puzzlun spawn",
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
                {
                    name:"cardspawn-ping",
                    description:"Choose the role to get notified during puzzlun card spawn.",
                    type:8,
                    required:false
                }
            ]
        },
        {
            name: "remove-puzzlun-spawn",
            description: "Remove puzzlun card spawn from server",
            type: 1
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

        var userAdmin = new Admin(await Admin.getData(userId));
        var hasPermission = await interaction.guild.members.cache.find(member => member.id === userId).permissions.has("MANAGE_CHANNELS");
        if(userAdmin.isAvailable()){ //check if user is part of puzzlun dev admin
            if(!userAdmin.isAdmin()) return interaction.reply(Validation.restrictedPermission(discordUser));
        } else if (!hasPermission) { //validation: if user has manage channels permission
            return interaction.reply(Validation.restrictedDiscordPermission(discordUser));
        }

        var guildData = Guild.getData(guildId);
        var guild = new Guild(guildData);

        switch(subcommand){
            case "puzzlun-card-spawn":
                var spawner = new Spawner(guild.spawner);

                var channel = interaction.options.getChannel("channel");
                var interval = interaction.options.getInteger("interval");
                
                if(channel.type!="GUILD_TEXT"){ //validation: invalid channel type
                    return interaction.reply(
                        Validation.invalidChannelType(discordUser)
                    );
                }

                var cardSpawnRole = interaction.options.getRole("cardspawn-ping");
                var roleId = null;
                if(cardSpawnRole!=null){ //validation: prevent from selecting @everyone
                    if(cardSpawnRole.name=='@everyone'){
                        return interaction.reply(
                            Embed.errorMini(`Unable to set everyone as ping role.`, discordUser, true, {
                                title:`❌ Restricted roles`
                            })
                        );
                    } else {
                        roleId = cardSpawnRole.id;
                    }
                }

                //stop timer
                var channelId = channel.id;
                if(interval>=1 && interval<=1440){
                    //update spawner:
                    spawner.idRoleping.cardcatcher = roleId;
                    spawner.spawnChannel = channel;//update channel
                    await spawner.updateTimer(interval);//update timer
                    await spawner.startTimer();
                    guild.setSpawner(spawner);//set spawner to guild

                    //update guild:
                    guild.id_channel_spawn = channelId;
                    guild.spawn_interval = interval;
                    guild.id_roleping_cardcatcher = roleId;
                    // guild.removeSpawn();
                    await guild.updateDb();//update to db
                    guild.removeSpawn();

                    return interaction.reply(
                        Embed.successMini(`Puzzlun card spawn setting successfully updated.`, discordUser, false, {
                            title:`✅ Puzzlun card spawn updated`,
                            fields:[
                                {
                                    name:`Card spawn channel:`,
                                    value:`<#${channelId}>`
                                },
                                {
                                    name:`Card spawn interval:`,
                                    value:`${interval} minutes`
                                }
                            ]
                        })
                    );
                } else {//validation: invalid time value
                    return interaction.reply(
                        Embed.errorMini("Please re-enter valid interval(minutes) between 5-1440.", discordUser, true)
                    );
                }
                break;
            case "remove-puzzlun-spawn":
                var spawner = new Spawner(guild.spawner);

                spawner.idRoleping.cardcatcher = null;
                spawner.spawnChannel = null;//update channel
                spawner.interval = null;
                
                await spawner.stopTimer();//stop spawn timer interval
                // guild.setSpawner(spawner);//set spawner to guild
                
                //update guild:
                guild.id_channel_spawn = null;
                guild.spawn_interval = null;
                guild.id_roleping_cardcatcher = null;
                await guild.updateDb();//update guild setting to db
                guild.removeSpawn();

                return interaction.reply(
                    Embed.successMini(`Puzzlun card spawn has been removed from this server.`, discordUser, false, {
                        title:`✅ Puzzlun card spawn removed`,
                        thumbnail:null
                    })
                );

                break;
        }

    }
};
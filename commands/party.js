const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const {Party} = require("../modules/puzzlun/data/Party");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const Embed = require('../modules/puzzlun/Embed');
const {AvatarFormation, PrecureAvatar} = require('../modules/puzzlun/Data/Avatar');

module.exports = {
    name: 'party',
    cooldown: 5,
    description: 'Contains all party command',
    args: true,
    options:[
        {
            name: "create",
            description: "Create party",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter unique name for your party",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "join",
            description: "Join existing party",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter the spesific party name",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "rename",
            description: "Rename your party name",
            type: 1,
            options: [
                {
                    name: "name",
                    description: "Enter new unique party name",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "leave",
            description: "Leave your party/disband if you are leader",
            type: 1
        },
        {
            name: "status",
            description: "Open party status menu",
            type: 1
        },
    ],
    async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(subcommand){
            case "create":
                var user = new User(await User.getData(userId));
                var partyData = await Party.getData(guildId, userId);
                //validation: if user existed as party leader/members
                if(partyData!=null){
                    return interaction.reply(Embed.errorMini(`You are still in party and cannot create another one.`, discordUser, true, {
                        title:":x: Cannot create another party"
                    }));
                }

                var newPartyName = interaction.options._hoistedOptions[0].value;
                var partyDataWithName = await Party.getDataByName(guildId, newPartyName);
                //validation: if party name has been taken
                if(partyDataWithName!=null){
                    return interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, discordUser, true, {
                        title:":x: Duplicate party name"
                    }));
                }

                //check for avatar
                var avatarFormation = new AvatarFormation(await AvatarFormation.getData(userId));
                var seriesName = "";
                if(avatarFormation.id_main!=null){
                    var mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, 
                        await CardInventory.getDataByIdUser(userId, avatarFormation.id_main), 
                        await CardInventory.getCardData(avatarFormation.id_main));
                    seriesName = `${mainAvatar.series.name}`;
                    var seriesIcon = mainAvatar.series.icon;
                }

                await Party.create(newPartyName, guildId, userId);

                return interaction.reply({embeds:[
                    Embed.builder(dedent(`${Properties.emoji.mofuheart} <@${userId}> has formed up ${seriesName} party with the name: **${newPartyName}**!

                    Join this party anytime with: **/party join ${newPartyName}**`),discordUser, {
                        color: user.set_color,
                        title: `✅ Party Created!`,
                        thumbnail: avatarFormation.id_main!=null? seriesIcon:""
                    })
                ]});

                break;
            
            case "join":
                var user = new User(await User.getData(userId));
                var partyData = await Party.getData(guildId, userId);
                //validation: if user existed as party leader/members
                if(partyData!=null){
                    return interaction.reply(Embed.errorMini(`You are still in party and cannot join another one.`, discordUser, true, {
                        title:":x: Cannot join another party"
                    }));
                }

                var partyName = interaction.options._hoistedOptions[0].value;
                var partyDataWithName = await Party.getDataByName(guildId, partyName);
                //validation: if party name not found
                if(partyDataWithName==null){
                    return interaction.reply(Embed.errorMini(`I cannot find that party, please re-enter with spesific party name.`, discordUser, true, {
                        title:":x: Cannot find the party"
                    }));
                }

                
                var party = new Party(partyDataWithName);
                //validation: if members already reached the limits
                if(party.join(userId)==false){
                    return interaction.reply(Embed.errorMini(`**${party.name}** members already reached its limit.`, discordUser, true, {
                        title:":x: Cannot join this party"
                    }));
                }
                party.update();

                //check for avatar
                var avatarFormation = new AvatarFormation(await AvatarFormation.getData(party.id_leader));
                if(avatarFormation.id_main!=null){
                    var mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, 
                        await CardInventory.getDataByIdUser(party.id_leader, avatarFormation.id_main), 
                        await CardInventory.getCardData(avatarFormation.id_main));
                    var seriesIcon = mainAvatar.series.icon;
                }
                
                var memberList = ``;
                for(var i=0; i<party.id_member.length; i++){
                    var val = party.id_member[i];
                    memberList+=`${i+1}. <@${val}>\n`;
                }
                
                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} <@${userId}> has joined up: **${party.name}**!`,discordUser, {
                        color: user.set_color,
                        title: `✅ Party Joined! (${party.getTotal()}/${Party.limit.member+1})`,
                        thumbnail: avatarFormation.id_main!=null? seriesIcon:"",
                        fields:[
                            {
                                name:`Party leader:`,
                                value:`<@${party.id_leader}>`
                            },
                            {
                                name:`Party members:`,
                                value:memberList
                            },
                        ]
                    })
                ]});

                break;
            
            case "rename":
                var user = new User(await User.getData(userId));
                var partyData = await Party.getDataByLeader(guildId, userId);
                //validation: if user was party leader/not
                if(partyData==null){
                    return interaction.reply(Embed.errorMini(`Cannot rename party while you are not a party leader.`, discordUser, true, {
                        title:":x: Unable to rename"
                    }));
                }

                var newPartyName = interaction.options._hoistedOptions[0].value;
                var partyDataWithName = await Party.getDataByName(guildId, newPartyName);
                //validation: if party name has been taken
                if(partyDataWithName!=null){
                    return interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, discordUser, true, {
                        title:":x: Duplicate Party Name"
                    }));
                }

                var party = new Party(partyData);
                party.name = newPartyName;
                await party.update();

                //check for avatar
                var avatarFormation = new AvatarFormation(await AvatarFormation.getData(userId));
                var seriesName = "";
                if(avatarFormation.id_main!=null){
                    var mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, 
                        await CardInventory.getDataByIdUser(userId, avatarFormation.id_main), 
                        await CardInventory.getCardData(avatarFormation.id_main));
                    seriesName = `${mainAvatar.series.name}`;
                    var seriesIcon = mainAvatar.series.icon;
                }

                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} <@${userId}>'s party has been renamed into: **${party.name}**`,
                    discordUser, {
                        color: user.set_color,
                        title: `✅ Party renamed!`,
                        thumbnail: avatarFormation.id_main!=null? seriesIcon:"",
                    })
                ]});
                
                break;
            
            case "leave":
                var user = new User(await User.getData(userId));
                var partyData = await Party.getData(guildId, userId);
                //validation: if user existed as party leader/members
                if(partyData==null){
                    return interaction.reply(Embed.errorMini(`Cannot leave while not in party.`, discordUser, true, {
                        title:":x: Not in party"
                    }));
                }

                var party = new Party(partyData);
                if(party.isPartyLeader(userId)){//party leader: disband the party
                    await party.remove();
                    return interaction.reply({embeds:[
                        Embed.builder(`<@${userId}>'s party: **${party.name}** has been disbanded`,
                        discordUser, {
                            color: Embed.color.danger,
                            title: `Party disbanded`
                        })
                    ]});

                } else if(party.isPartyMember(userId)){//party member: leave the party
                    party.leave(userId);
                    await party.update();

                    return interaction.reply({embeds:[
                        Embed.builder(`You have leave ${party.name}`,
                        discordUser, {
                            color: Embed.color.danger
                        })
                    ]});
                }

                break;
        
            case "status":
                var user = new User(await User.getData(userId));
                var partyData = await Party.getData(guildId, userId);
                //validation: if user existed as party leader/members
                if(partyData==null){
                    return interaction.reply(Embed.errorMini(`Cannot use this command while not in party.`, discordUser, true, {
                        title:":x: Not in party"
                    }));
                }

                var party = new Party(partyData);
                

                //check for avatar
                var txtDescription = ``;
                var avatarFormation = new AvatarFormation(await AvatarFormation.getData(party.id_leader));
                if(avatarFormation.id_main!=null){
                    var mainAvatar = new PrecureAvatar(AvatarFormation.formation.main.value, 
                        await CardInventory.getDataByIdUser(party.id_leader, avatarFormation.id_main), 
                        await CardInventory.getCardData(avatarFormation.id_main));
                    txtDescription=`**Party series:**\n${mainAvatar.series.emoji.mascot} ${mainAvatar.series.name}`;
                    var seriesIcon = mainAvatar.series.icon;
                }

                var memberList = party.getTotalMember()<=0 ? `No one has joined this party yet.`:'';
                for(var i=0; i<party.id_member.length; i++){
                    var val = party.id_member[i];
                    memberList+=`${i+1}. <@${val}>\n`;
                }

                var userLeader = new User(await User.getData(party.id_leader));
                
                return interaction.reply({embeds:[
                    Embed.builder(txtDescription, 
                        Embed.builderUser.authorCustom(`${party.name} (${party.getTotal()}/${Party.limit.member+1})`), {
                        color: userLeader.set_color,
                        thumbnail: avatarFormation.id_main!=null? seriesIcon:"",
                        fields:[
                            {
                                name:`Party leader:`,
                                value:`<@${party.id_leader}>`
                            },
                            {
                                name:`Party members:`,
                                value:memberList
                            },
                        ]
                    })
                ]});

                break;
        }
    }
}
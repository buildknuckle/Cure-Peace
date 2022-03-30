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
        {//create party
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
        {//join into party
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
        {//rename party
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
        {//leave from party
            name: "leave",
            description: "Leave your party/disband if you are leader",
            type: 1
        },
        {//open party status
            name: "status",
            description: "Open party status menu",
            type: 1
        },
        {//party list
            name: "list",
            description: "Open party list menu",
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
            case "create":{
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
                
                if(partyDataWithName!=null){ //validation: if party name has been taken
                    return interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, discordUser, true, {
                        title:":x: Duplicate party name"
                    }));
                } else if(newPartyName.length>=20){ //validation name length
                    return interaction.reply(Embed.errorMini(`Please re-enter with shortner party name.`, discordUser, true, {
                        title:":x: Party name too long"
                    }));
                }

                await Party.create(newPartyName, guildId, userId);
                var party = new Party(await Party.getData(guildId, userId));

                return interaction.reply({embeds:[
                    Embed.builder(dedent(`${Properties.emoji.mofuheart} <@${userId}> has formed up ${party.Series!=null? party.Series.name:""} party with the name: **${newPartyName}**!

                    Join this party anytime with: **/party join ${newPartyName}**`),discordUser, {
                        color: party.Color.value,
                        title: `✅ Party Created!`,
                        thumbnail: party.Series!=null? party.Series.icon:"",
                    })
                ]});

                break;
            }
            case "join":{
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
                
                
                var memberList = ``;
                for(var i=0; i<party.id_member.length; i++){
                    var val = party.id_member[i];
                    memberList+=`${i+1}. <@${val}>\n`;
                }
                
                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} <@${userId}> has joined up: **${party.name}**!`,discordUser, {
                        color: party.Color.value,
                        title: `✅ Party Joined! (${party.getTotal()}/${Party.limit.maxUser})`,
                        thumbnail: party.Series!=null? party.Series.icon:"",
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
            case "rename":{
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
                
                if(partyDataWithName!=null){ //validation: if party name has been taken
                    return interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, discordUser, true, {
                        title:":x: Duplicate Party Name"
                    }));
                } else if(newPartyName.length>=20){ //validation name length
                    return interaction.reply(Embed.errorMini(`Please re-enter with shortner party name.`, discordUser, true, {
                        title:":x: Party name too long"
                    }));
                }

                var party = new Party(partyData);
                party.name = newPartyName;
                await party.update();

                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} <@${userId}>'s party has been renamed into: **${party.name}**`,
                    discordUser, {
                        color: party.Color.value,
                        title: `✅ Party renamed!`,
                        thumbnail: party.Series!=null? party.Series.icon:"",
                    })
                ]});
                
                break;
            }
            case "leave":{
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
                        Embed.builder(`You have leave the party from: ${party.name}`,
                        discordUser, {
                            color: Embed.color.danger
                        })
                    ]});
                }

                break;
            }
            case "status":{
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

                var memberList = party.getTotalMember()<=0 ? `No one has joined this party yet.`:'';
                for(var i=0; i<party.id_member.length; i++){
                    var val = party.id_member[i];
                    memberList+=`${i+1}. <@${val}>\n`;
                }
                
                return interaction.reply({embeds:[
                    Embed.builder(txtDescription, 
                        Embed.builderUser.authorCustom(`${party.name} (${party.getTotal()}/${Party.limit.member+1})`), {
                        color: party.Color.value,
                        thumbnail: party.Series!=null? party.Series.icon:"",
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
            case "list":{
                var user = new User(await User.getData(userId));
                var partyData = await Party.getAllData(guildId);
                //validation if no party available
                if(partyData.length<=0)
                    return interaction.reply(Embed.errorMini(":x: No open party are available yet", discordUser, true));
                console.log(partyData);
                return;


                var arrPages = [];
                var idx = 0; var maxIdx = 4; var txtList = ``;
                for(var i=0;i<partyData.length;i++){
                    var party = new Party(partyData[i]);
                    if(party.Series!=null) txtList+=`${party.Series.emoji.mascot} `;
                    
                    txtList+=dedent(`${party.name} (${party.getTotal()}/${Party.limit.maxUser})
                    **Leader:** <@${party.id_leader}>
                    ─────────────────`);
                    txtList+=`\n`;

                    //check for max page content
                    if(idx>=maxIdx||(idx<maxIdx && i==partyData.length-1)){
                        let embed = Embed.builder(`Join into party with: **/party join**\n\n`+txtList, null,{
                            title:`Party List:`
                        })

                        arrPages.push(embed);
                        txtList="";
                        idx = 0;
                    } else {
                        idx++;
                    }

                }

                return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
                // await interaction.reply({embeds:[
                //     Embed.builder(txtList, null, {
                //         title:`Party List`
                //     })
                // ]});

                break;
            }
        }
    }
}
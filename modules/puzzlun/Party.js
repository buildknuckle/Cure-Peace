// const stripIndents = require('common-tags/lib/stripIndent');
const dedent = require("dedent-js");
const {MessageEmbed} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions.js');
const capitalize = GlobalFunctions.capitalize;

const paginationEmbed = require('../DiscordPagination');
const Embed = require('./Embed');

const Properties = require('./Properties');
const Color = Properties.color;
const Currency = Properties.currency;
const Emoji = Properties.emoji;

const {Party} = require("./data/Party");
const User = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {UserQuest, DailyCardQuest} = require("./data/Quest");
const {AvatarFormation, PrecureAvatar} = require("./data/Avatar");

class Listener extends require("./data/Listener") {

    async create(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getData(this.guildId, this.userId);
        //validation: if user existed as party leader/members
        if(partyData!=null){
            return this.interaction.reply(Embed.errorMini(`You are still in party and cannot create another one.`, this.discordUser, true, {
                title:":x: Cannot create another party"
            }));
        }

        var newPartyName = this.interaction.options.getString("name");
        var partyDataWithName = await Party.getDataByName(this.guildId, newPartyName);
        
        if(partyDataWithName!=null){ //validation: if party name has been taken
            return this.interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, this.discordUser, true, {
                title:":x: Duplicate party name"
            }));
        } else if(newPartyName.length>=20){ //validation name length
            return this.interaction.reply(Embed.errorMini(`Please re-enter with shorter party name.`, this.discordUser, true, {
                title:":x: Party name too long"
            }));
        }

        await Party.create(newPartyName, this.guildId, this.userId);
        var party = new Party(await Party.getData(this.guildId, this.userId));

        return this.interaction.reply({embeds:[
            Embed.builder(dedent(`${Properties.emoji.mofuheart} <@${this.userId}> has formed up ${party.Series!=null? party.Series.name:""} party with the name: **${newPartyName}**

            Join into this party with: **/party join ${newPartyName}**`),this.discordUser, {
                color: party.Color.value,
                title: `✅ Party Created!`,
                thumbnail: party.Series!=null? party.Series.icon:"",
            })
        ]});
    }

    async joinParty(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getData(this.guildId, this.userId);
        //validation: if user existed as party leader/members
        if(partyData!=null){
            return this.interaction.reply(Embed.errorMini(`You are still in party and cannot join another one.`, this.discordUser, true, {
                title:":x: Cannot join another party"
            }));
        }

        var partyName = this.interaction.options._hoistedOptions[0].value;
        var partyDataWithName = await Party.getDataByName(this.guildId, partyName);
        //validation: if party name not found
        if(partyDataWithName==null){
            return this.interaction.reply(Embed.errorMini(`I cannot find that party, please re-enter with spesific party name.`, this.discordUser, true, {
                title:":x: Cannot find the party"
            }));
        }

        var party = new Party(partyDataWithName);
        //validation: if members already reached the limits
        if(party.join(this.userId)==false){
            return this.interaction.reply(Embed.errorMini(`**${party.name}** members already reached its limit.`, this.discordUser, true, {
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
        
        return this.interaction.reply({embeds:[
            Embed.builder(`${Properties.emoji.mofuheart} <@${this.userId}> has joined: **${party.name}**`,this.discordUser, {
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
    }

    async renameParty(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getDataByLeader(this.guildId, this.userId);
        //validation: if user was party leader/not
        if(partyData==null){
            return this.interaction.reply(Embed.errorMini(`Cannot rename party while you are not a party leader.`, this.discordUser, true, {
                title:":x: Unable to rename"
            }));
        }

        var newPartyName = this.interaction.options._hoistedOptions[0].value;
        var partyDataWithName = await Party.getDataByName(this.guildId, newPartyName);
        
        if(partyDataWithName!=null){ //validation: if party name has been taken
            return this.interaction.reply(Embed.errorMini(`That party name has been taken. Please re-enter with different name.`, this.discordUser, true, {
                title:":x: Duplicate Party Name"
            }));
        } else if(newPartyName.length>=20){ //validation name length
            return this.interaction.reply(Embed.errorMini(`Please re-enter with shortner party name.`, this.discordUser, true, {
                title:":x: Party name too long"
            }));
        }

        var party = new Party(partyData);
        party.name = newPartyName;
        await party.update();

        return this.interaction.reply({embeds:[
            Embed.builder(`${Properties.emoji.mofuheart} <@${this.userId}>'s party has been renamed into: **${party.name}**`,
            this.discordUser, {
                color: party.Color.value,
                title: `✅ Party renamed!`,
                thumbnail: party.Series!=null? party.Series.icon:"",
            })
        ]});
    }

    async leave(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getData(this.guildId, this.userId);
        //validation: if user existed as party leader/members
        if(partyData==null){
            return this.interaction.reply(Embed.errorMini(`Cannot leave while not in party.`, this.discordUser, true, {
                title:":x: Not in party"
            }));
        }

        var party = new Party(partyData);
        if(party.isPartyLeader(this.userId)){//party leader: disband the party
            await party.remove();
            return this.interaction.reply({embeds:[
                Embed.builder(`**${party.name}** has been disbanded`,
                this.discordUser, {
                    color: Embed.color.danger,
                    title: `↖️ Party disbanded`
                })
            ]});

        } else if(party.isPartyMember(this.userId)){//party member: leave the party
            party.leave(this.userId);
            await party.update();

            return this.interaction.reply({embeds:[
                Embed.builder(`You have leave the party from: ${party.name}`,
                this.discordUser, {
                    color: Embed.color.danger
                })
            ], ephemeral:true});
        }
    }

    async status(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getData(this.guildId, this.userId);
        //validation: if user existed as party leader/members
        if(partyData==null){
            return this.interaction.reply(Embed.errorMini(`Cannot use this command while not in party.`, this.discordUser, true, {
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
        
        return this.interaction.reply({embeds:[
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
    }

    async partyList(){
        var user = new User(await User.getData(this.userId));
        var partyData = await Party.getAllData(this.guildId);
        //validation if no party available
        if(partyData.length<=0)
            return this.interaction.reply(Embed.errorMini(":x: No open party are available", this.discordUser, true));

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
                let embed = Embed.builder(`Join into any open party with: **/party join**\n\n`+txtList, 
                Embed.builderUser.authorCustom(`Party List`, Properties.imgSet.mofu.ok))

                arrPages.push(embed);
                txtList="";
                idx = 0;
            } else {
                idx++;
            }

        }

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
    }
}

module.exports = {
    PartyListener:Listener
}
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const {Gachapon, GachaponListener} = require("../modules/puzzlun/Gachapon");

module.exports = {
    name: 'gachapon',
    cooldown: 5,
    description: 'Contains all gachapon command',
    args: true,
    options:[
        {//status
            name: "info",
            description: "Open gachapon info menu",
            type: 1
        },
        {//daily rolls
            name: "daily",
            description: "Roll on standard daily based gachapon.",
            type: 1,
            options: [
                {
                    name: "roll",
                    description: "Select the types of roll",
                    type: 3,
                    required:true, 
                    choices:[
                        {
                            name:`1x (Cost: ${Gachapon.cost.daily[1]} jewel)`,
                            value:`1`
                        },
                        {
                            name:`5x (Cost: ${Gachapon.cost.daily[5]} jewel)`,
                            value:`5`
                        }
                    ]
                },
            ]
        },
        {//daily rolls
            name: "tropical-catch",
            description: "Roll on limited tropical rouge precure gachapon.",
            type: 1,
            options: [
                {
                    name: "roll",
                    description: "Select the types of roll",
                    type: 3,
                    required:true, 
                    choices:[
                        {
                            name:`1x (Cost: ${Gachapon.cost.daily[1]} jewel)`,
                            value:`1`
                        },
                        {
                            name:`5x (Cost: ${Gachapon.cost.daily[5]} jewel)`,
                            value:`5`
                        }
                    ]
                },
            ]
        },
        
    ],
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(commandSubcommand){
            case "info":{
                let gacha = new GachaponListener(userId, discordUser, interaction);
                await gacha.info();
                break;
            }
            case "daily":
                var roll = parseInt(interaction.options.getString("roll"));
                let gacha = new GachaponListener(userId, discordUser, interaction);
                await gacha.dailyRoll(roll);
                break;
        }
    }
}
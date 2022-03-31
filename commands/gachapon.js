const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const Gachapon = require("../modules/puzzlun/Gachapon");

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
                            name:`1x (Cost: ${Gachapon.Daily.cost[1]} jewel)`,
                            value:`1`
                        },
                        {
                            name:`5x (Cost: ${Gachapon.Daily.cost[5]} jewel)`,
                            value:`5`
                        }
                    ]
                },
            ]
        },
        {//tropical-catch roll
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
                            name:`1x (Cost: ${Gachapon.TropicalCatch.cost[1]} jewel)`,
                            value:`1`
                        },
                        {
                            name:`3x (Cost: ${Gachapon.TropicalCatch.cost[3]} jewel)`,
                            value:`3`
                        }
                    ]
                },
            ]
        },
        {//ticket roll
            name: "ticket",
            description: "Roll on limited tropical rouge precure gachapon.",
            type: 1,
            options: [
                {
                    name: "selection",
                    description: "Select the gachapon ticket that you want to use",
                    type: 3,
                    required:true,
                    choices:[
                        {//standard ticket
                            name:`Standard Gachapon Ticket`,
                            value:`standard`
                        },
                        {//tropical catch ticket
                            name:`Tropical-Catch! Gachapon Ticket`,
                            value:`tropical-catch`
                        },
                        {//premium ticket
                            name:`Premium Gachapon Ticket`,
                            value:`premium`
                        },
                    ]
                }
            ]
        }
    ],
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();

        switch(commandSubcommand){
            case "info":{
                let gacha = new Gachapon(interaction);
                await gacha.info();
                break;
            }
            case "daily":{
                let gacha = new Gachapon.Daily(interaction);
                await gacha.roll();
                break;
            }
            case "tropical-catch":{
                let gacha = new Gachapon.TropicalCatch(interaction);
                await gacha.roll();
                break;
            }
            case "ticket":{
                let choice = interaction.options.getString("selection");
                switch(choice){
                    case "standard":{
                        let gacha = new Gachapon.StandardTicket(interaction);
                        await gacha.roll();
                        break;
                    }
                    case "tropical-catch":{
                        let gacha = new Gachapon.TropicalCatchTicket(interaction);
                        await gacha.roll();
                        break;
                    }
                    case "premium":{
                        let gacha = new Gachapon.PremiumTicket(interaction);
                        await gacha.roll();
                        break;
                    }
                }
                break;
            }
        }
    }
}
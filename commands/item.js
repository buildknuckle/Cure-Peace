const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const Shop = require("../modules/puzzlun/Shop");

module.exports = {
    name: 'item',
    cooldown: 5,
    description: 'Contains all item related command',
    args: true,
    options:[
        {//item shop
            name: "shop",
            description: "Open mofu shop menu",
            type: 1,
            options: [
                {
                    name: "category",
                    description: "Filter item shop with category",
                    type: 3,
                    required:false,
                    choices:[
                        {
                            name:`${Shop.category.ingredient_food.name}`,
                            value:`${Shop.category.ingredient_food.value}`
                        },
                        {
                            name:`${Shop.category.gacha_ticket.name}`,
                            value:`${Shop.category.gacha_ticket.value}`
                        },
                        {
                            name:`${Shop.category.misc_fragment.name}`,
                            value:`${Shop.category.misc_fragment.value}`
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
            case "shop":{
                var category = interaction.options.getString("category");
                var mofuShop = new Shop.MofuShop(userId, discordUser, interaction);
                await mofuShop.shopMenu(category);
                break;
            }
        }
    }
}
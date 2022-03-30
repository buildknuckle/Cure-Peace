const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const Shop = require("../modules/puzzlun/Shop");
const {ItemListener} = require("../modules/puzzlun/Item");

module.exports = {
    name: 'item',
    cooldown: 5,
    description: 'Contains all item related command',
    args: true,
    options:[
        {//item inventory
            name: "inventory",
            description: "Open item inventory menu",
            type: 1,
            options: [
                {
                    name: "category",
                    description: "Filter item inventory with category",
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
                {
                    name: "display-style",
                    description: "Select the displaying style (Default: compact)",
                    type: 3,
                    required:false,
                    choices:[
                        {
                            name:`Compact (name & stock)`,
                            value:ItemListener.viewStyle.compact
                        },
                        {
                            name:`Full (name, stock & description)`,
                            value:ItemListener.viewStyle.full
                        },
                    ]
                },
            ]
        },
        {//item shop menu
            name: "shop-menu",
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
        {//item shop buy
            name: "shop-buy",
            description: "Purchase item from mofu shop",
            type: 1,
            options: [
                {
                    name: "keyword",
                    description: "Enter the item keyword that you want to purchase (ID/name/alias)",
                    type: 3,
                    required:true
                },
                {
                    name: "qty",
                    description: "Enter the amount of item that you want to purchase (Default: 1, max: 99)",
                    type: 4
                },
            ]
        }
    ],
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(commandSubcommand){
            case "inventory":{
                let item = new ItemListener(userId,discordUser, interaction);
                await item.inventory();
                break;
            }
            case "shop-buy":{
                let mofuShop = new Shop.MofuShop(userId, discordUser, interaction);
                await mofuShop.buy();
                break;
            }
            case "shop-menu":{
                let mofuShop = new Shop.MofuShop(userId, discordUser, interaction);
                await mofuShop.menu();
                break;
            }
        }
    }
}
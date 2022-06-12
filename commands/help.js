const { MessageEmbed } = require('discord.js');
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('../modules/DiscordPagination');

module.exports = {
    name: 'help',
    description: 'Cure Peace help command',
    options: [
        {//basic command
            name: "basic-command",
            description: "List all basic command",
            type: 1,
        },
    ],
    executeMessage(message, args) {

    },
    execute(interaction) {
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();

        const embed = new MessageEmbed()
        .setColor('#efcc2c')
        .setTitle('Cure Peace command')
        .addFields(
            { name: '/anilist', value: 'Open anilist command' },
            { name: '/jankenpon', value: 'Play jankenpon with Peace' },
            { name: '/sakugabooru', value: 'Search with sakugabooru' },
            { name: '/saucenao', value: 'Search image using saucenao' },
            { name: '/temp', value: 'Convert temperature' },
            { name: '/thread', value: 'Join/leave thread' },
        );

        return interaction.reply({embeds:[embed]});

        
    }
};
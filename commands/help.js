const { MessageEmbed } = require('discord.js');
// const CardModules = require('../modules/Card');

module.exports = {
    name: 'help',
    description: 'Contains all available commands',
    options: [],
    executeMessage(message, args) {

    },
    execute(interaction) {
        const objEmbed = {
            "title": "Help Command",
            "description": "No more prefix calling needed, instead you can call me with slash command(/) features! " +
                "Here is the list of available commands:",
            "color": CardModules.Properties.embedColor,
            "fields": [
                {
                    name: "Public command",
                    value: `bio/daily/info`
                },
                {
                    name: "/anilist",
                    value: "Search with anilist"
                },
                {
                    name: "/card",
                    value: "The main content: smile precure line-up command a.k.a. Let's play card catching with Peace!"
                },
                {
                    name: "/garden",
                    value: "Heartcatch line-up command"
                },
                {
                    name: "/item",
                    value: "Item command"
                },
                {
                    name: "/jankenpon",
                    value: "Play rock-paper-scissors with Peace"
                },
                {
                    name: "/kirakira",
                    value: "Kirakira line-up command"
                },
                {
                    name: "/pinky",
                    value: "Yes Precure 5 pinky line-up command"
                },
                {
                    name: "/sakugabooru",
                    value: "Search with sakugabooru"
                },
                {
                    name: "/setting",
                    value: "Setting related to card command"
                },
                {
                    name: "/temp",
                    value: "Convert a temperature from one format to another",
                },
                {
                    name: "/thread",
                    value: "Command peace to join/leave thread"
                },
                {
                    name: "/tracemoe",
                    value: "Reverse search anime pictures with tracemoe"
                }
            ]
        };
        return interaction.reply({embeds: [new MessageEmbed(objEmbed)]});
    }
};
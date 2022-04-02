const { MessageEmbed } = require('discord.js');
const Embed = require("../modules/puzzlun/Embed");
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('../modules/DiscordPagination');


module.exports = {
    name: 'help',
    description: 'Cure Peace help command',
    options: [
        {//basic command
            name: "command-basic",
            description: "List all basic command",
            type: 1,
        },
        {//puzzlun command
            name: "command-puzzlun",
            description: "List all puzzlun command",
            type: 1,
        },
    ],
    executeMessage(message, args) {

    },
    execute(interaction) {
        var arrPages = [];
        var author = Embed.builderUser.authorCustom(`Help`);

        //page 1: basic command
        arrPages.push({embeds:[
            Embed.builder(``,author, {
                title:`Basic command - part 1`,
                fields:[
                    {
                        name:`/anilist`,
                        value:`Search anime title/character with anilist`,
                    },
                    {
                        name:`/bio`,
                        value:`Check precure bio info`,
                    },
                    {
                        name:`/jankenpon`,
                        value:`Play jankenpon with cure Peace`,
                    },
                    {
                        name: "/temp",
                        value: "Convert a temperature from one format to another",
                    },
                    {
                        name: "/sakugabooru",
                        value: "Search with sakugabooru"
                    },
                    {
                        name: "/thread",
                        value: "Command cure Peace to join/leave thread"
                    },
                    {
                        name: "/tracemoe",
                        value: "Reverse search anime pictures with tracemoe"
                    }
                ]
            })
        ],});

        return paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList, true);
    }
};
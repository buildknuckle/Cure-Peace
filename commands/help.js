const { MessageEmbed } = require('discord.js');
const Embed = require("../modules/puzzlun/Embed");
const DiscordStyles = require('../modules/DiscordStyles');
const paginationEmbed = require('../modules/DiscordPagination');

const {Help} = require("../modules/puzzlun/Help");

module.exports = {
    name: 'help',
    description: 'Cure Peace help command',
    options: [
        {//basic command
            name: "patch-notes",
            description: "View the latest patch notes",
            type: 1,
        },
        {//basic command
            name: "command-basic",
            description: "List all basic command",
            type: 1,
        },
        {//puzzlun command
            name: "puzzlun-command",
            description: "List all puzzlun command",
            type: 1,
            options:[
                {
                    name: "filter",
                    description: "Filter puzzlun command help",
                    type: 3,
                    choices:Help.getCommandList()
                }
            ],
        },
        {//puzzlun guide
            name: "puzzlun-guide",
            description: "Open puzzlun basic guide",
            type: 1,
            options:[
                {
                    name: "category",
                    description: "Select the guide that you want to look into",
                    type: 3,
                    required:true,
                    choices:[
                        { name: 'starter', value: 'starter' },
                        // { name: 'badge', value: 'badge' },
                        // { name: 'card spawn', value: 'card_spawn' },
                        // { name: 'daily', value: 'daily' },
                        // { name: 'gachapon', value: 'gachapon' },
                        // { name: 'item', value: 'item' },
                        // { name: 'party', value: 'party' },
                        // { name: 'set', value: 'set' },
                        // { name: 'shikishi', value: 'shikishi' },
                        // { name: 'tradeboard', value: 'tradeboard' }
                      ]
                }
            ],
        },
    ],
    executeMessage(message, args) {

    },
    execute(interaction) {
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();

        var help = new Help(interaction);

        switch(commandSubcommand){
            
            case "command-basic":{
                var arrPages = [];
                var author = Embed.builderUser.authorCustom(`Help`);
                
                arrPages.push(
                    Embed.builder(`Help command`,author, {
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
                );

                return paginationEmbed(interaction, arrPages, DiscordStyles.Button.pagingButtonList, true);
                break;
            }
            case "patch-notes":{
                help.patchNotes();
                break;
            }
            case "puzzlun-command":{
                help.commandList();
                break;
            }
            case "puzzlun-guide":{
                help.guide();
                break;
            }
        }

        //page 1: basic command
        
    }
};
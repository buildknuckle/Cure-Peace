const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const {Series} = require('../../modules/puzzlun/data/Series');
const UserListener = require("../../modules/puzzlun/User");
const {ShikishiListener} = require("../../modules/puzzlun/Shikishi");

module.exports = {
    name: 'shikishi',
    cooldown: 5,
    description: 'Contains all shikishi command',
    args: true,
    options:[
        {//status
            name: "inventory",
            description: "Open shikishi inventory menu.",
            type: 1,
            options: [
                {//series
                    name: "series",
                    description: "Search shikishi by series",
                    type: 3,
                    choices: [
                        {
                            name: `${new Series("max_heart").name}`,
                            value: "max_heart"
                        },
                        {
                            name: `${new Series("splash_star").name}`,
                            value: "splash_star"
                        },
                        {
                            name: `${new Series("yes5gogo").name}`,
                            value: "yes5gogo"
                        },
                        {
                            name: `${new Series("fresh").name}`,
                            value: "fresh"
                        },
                        {
                            name: `${new Series("heartcatch").name}`,
                            value: "heartcatch"
                        },
                        {
                            name: `${new Series("suite").name}`,
                            value: "suite"
                        },
                        {
                            name: `${new Series("smile").name}`,
                            value: "smile"
                        },
                        {
                            name: `${new Series("dokidoki").name}`,
                            value: "dokidoki"
                        },
                        {
                            name: `${new Series("happiness_charge").name}`,
                            value: "happiness_charge"
                        },
                        {
                            name: `${new Series("go_princess").name}`,
                            value: "go_princess"
                        },
                        {
                            name: `${new Series("mahou_tsukai").name}`,
                            value: "mahou_tsukai"
                        },
                        {
                            name: `${new Series("kirakira").name}`,
                            value: "kirakira"
                        },
                        {
                            name: `${new Series("hugtto").name}`,
                            value: "hugtto"
                        },
                        {
                            name: `${new Series("star_twinkle").name}`,
                            value: "star_twinkle"
                        },
                        {
                            name: `${new Series("healin_good").name}`,
                            value: "healin_good"
                        },
                        {
                            name: `${new Series("tropical_rouge").name}`,
                            value: "tropical_rouge"
                        },
                    ],
                },
                {//username
                    name: "username",
                    description: "Enter username to view shikishi inventory from other user.",
                    type: 3,
                },
                {//filter
                    name: "filter",
                    description: "Filter shikishi inventory to be displayed",
                    type: 3,
                    choices: [
                        {
                            name: `owned`,
                            value: "owned"
                        },
                        // {
                        //     name: `duplicate only`,
                        //     value: "duplicate"
                        // },
                    ],
                },
            ]
        },
    ],
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();

        var shikishi = new ShikishiListener(interaction);

        switch(commandSubcommand){
            case "inventory":{
                await shikishi.inventory();
                break;
            }
        }
    }
}
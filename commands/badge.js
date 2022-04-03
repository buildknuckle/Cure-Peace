const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const {Series} = require('../modules/puzzlun/data/Series');
const UserListener = require("../modules/puzzlun/User");
const paginationEmbed = require('../modules/DiscordPagination');

module.exports = {
    name: 'badge',
    cooldown: 5,
    description: 'Contains all precure badge command',
    args: true,
    options:[
        {//status
            name: "view",
            description: "Open badge status menu.",
            type: 1,
            options: [
                {
                    name: "username",
                    description: "Enter username to view badge from other user.",
                    type: 3,
                    required:false
                }
            ]
        },
        {//edit
            name: "edit",
            description: "Edit your precure badge.",
            type: 1,
            options: [
                {//nickname
                    name: "nickname",
                    description: "Enter your nickname (max char: 20)",
                    type: 3,
                },
                {//color
                    name: "color",
                    description: "Enter your new color",
                    type: 3,
                    choices: [
                        {
                            name: `pink`,
                            value: "pink"
                        },
                        {
                            name: `blue`,
                            value: "blue"
                        },
                        {
                            name: `red`,
                            value: "red"
                        },
                        {
                            name: `yellow`,
                            value: "yellow"
                        },
                        {
                            name: `green`,
                            value: "green"
                        },
                        {
                            name: `purple`,
                            value: "purple"
                        },
                        {
                            name: `white`,
                            value: "white"
                        },
                    ],
                },
                {//favorite series
                    name: "favorite-series",
                    description: "Select your favorite series",
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
                {//favorite character
                    name: "favorite-character",
                    description: "Enter your favorite precure character",
                    type: 3,
                },
                {//about
                    name: "about",
                    description: "Enter your about personalization (max char:60)",
                    type: 3,
                },
                {//shikishi
                    name: "set-shikishi-cover",
                    description: "Enter the shikishi id as your badge cover",
                    type: 3,
                }
            ]
        },
        {//remove
            name: "remove",
            description: "Remove badge information",
            type: 1,
            options: [
                {
                    name: "section",
                    description: "Select the section that you want to remove",
                    type: 3,
                    required:true,
                    choices: [
                        {
                            name: `nickname`,
                            value: "nickname"
                        },
                        {
                            name: `about`,
                            value: "about"
                        },
                        {
                            name: `shikishi cover`,
                            value: "shikishi-cover"
                        },
                    ],
                }
            ]
        }
    ],
    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options.getSubcommand();

        switch(command){
            
        }

        let userListener = new UserListener(interaction);

        switch(commandSubcommand){
            case "view":{//print user status
                return await userListener.viewBadge();
                break;
            }
            case "edit":{
                return await userListener.editBadge();
                break;
            }
            case "remove":{
                return await userListener.removeBadgeSection();
                break;
            }
        }

    }
}
const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const Embed = require('../modules/puzzlun/Embed');
const Validation = require('../modules/puzzlun/Validation');
const {AvatarFormation} = require('../modules/puzzlun/Data/Avatar');
const UserListener = require("../modules/puzzlun/User");
const {CardListener} = require("../modules/puzzlun/Card");

module.exports = {
    name: 'set',
    cooldown: 5,
    description: 'Contains all set command',
    args: true,
    options:[
        {//avatar
            name: "avatar",
            description: "Transform & set your precure avatar.",
            type: 1,
            options: [
                {
                    name: "card-id",
                    description: "Enter precure card id",
                    type: 3,
                    required: true
                },
                {
                    name: "formation",
                    description: "Select the formation (Default:Main)",
                    type: 3,
                    choices:[
                        {
                            name:`${AvatarFormation.formation.main.name}`,
                            value:`${AvatarFormation.formation.main.value}`
                        },
                        // {
                        //     name:`${AvatarFormation.formation.support1.name}`,
                        //     value:`${AvatarFormation.formation.support1.value}`
                        // },
                        // {
                        //     name:`${AvatarFormation.formation.support2.name}`,
                        //     value:`${AvatarFormation.formation.support2.value}`
                        // },
                    ]
                },
                {
                    name: "visible-public",
                    description: "Set the henshin notification to be shown on public (Default: false)",
                    type: 5
                },
            ]
        },
        {//color
            name: "color",
            description: "Precure color change to change your assigned color. (Cost: 100 Color Points)",
            type: 1,
            options: [
                {
                    name: "change",
                    description: "Select the color",
                    type: 3,
                    required: true,
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
                }
            ]
        },
        {//series
            name: "series",
            description: `Teleport into available series location. (Cost: 100 Series Points)`,
            type: 1,
            options: [
                {
                    name: "location",
                    description: `Select the location & series.`,
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: `${new Series("max_heart").location.name} @${new Series("max_heart").name}`,
                            value: "max_heart"
                        },
                        {
                            name: `${new Series("splash_star").location.name} @${new Series("splash_star").name}`,
                            value: "splash_star"
                        },
                        {
                            name: `${new Series("yes5gogo").location.name} @${new Series("yes5gogo").name}`,
                            value: "yes5gogo"
                        },
                        {
                            name: `${new Series("fresh").location.name} @${new Series("fresh").name}`,
                            value: "fresh"
                        },
                        {
                            name: `${new Series("heartcatch").location.name} @${new Series("heartcatch").name}`,
                            value: "heartcatch"
                        },
                        {
                            name: `${new Series("suite").location.name} @${new Series("suite").name}`,
                            value: "suite"
                        },
                        {
                            name: `${new Series("smile").location.name} @${new Series("smile").name}`,
                            value: "smile"
                        },
                        {
                            name: `${new Series("dokidoki").location.name} @${new Series("dokidoki").name}`,
                            value: "dokidoki"
                        },
                        {
                            name: `${new Series("happiness_charge").location.name} @${new Series("happiness_charge").name}`,
                            value: "happiness_charge"
                        },
                        {
                            name: `${new Series("go_princess").location.name} @${new Series("go_princess").name}`,
                            value: "go_princess"
                        },
                        {
                            name: `${new Series("mahou_tsukai").location.name} @${new Series("mahou_tsukai").name}`,
                            value: "mahou_tsukai"
                        },
                        {
                            name: `${new Series("kirakira").location.name} @${new Series("kirakira").name}`,
                            value: "kirakira"
                        },
                        {
                            name: `${new Series("hugtto").location.name} @${new Series("hugtto").name}`,
                            value: "hugtto"
                        },
                        {
                            name: `${new Series("star_twinkle").location.name} @${new Series("star_twinkle").name}`,
                            value: "star_twinkle"
                        },
                        {
                            name: `${new Series("healin_good").location.name} @${new Series("healin_good").name}`,
                            value: "healin_good"
                        },
                        {
                            name: `${new Series("tropical_rouge").location.name} @${new Series("tropical_rouge").name}`,
                            value: "tropical_rouge"
                        },
                    ],
                }
            ]
        },
    ],
    async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        let userListener = new UserListener(interaction);

        switch(subcommand){
            case "avatar":{//set precure avatar
                await userListener.setAvatar();
                break;
            }
            case "color":{//set color assignment
                await userListener.setColor();
                break;
            }
            case "series":{//set series
                await userListener.setSeries();
                break;
            }
        }
    }
}
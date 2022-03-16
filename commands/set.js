const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Embed = require('../modules/puzzlun/Embed');

module.exports = {
    name: 'set',
    cooldown: 5,
    description: 'Contains all card command',
    args: true,
    options:[
        {
            name: "avatar",
            description: "Open card status menu.",
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
                            name:`Main`,
                            value:`id_main`
                        },
                        {
                            name:`Support 1`,
                            value:`id_support1`
                        },
                        {
                            name:`Support 2`,
                            value:`id_support2`
                        },
                    ]
                },
                {
                    name: "visible-public",
                    description: "Set the henshin notification to be shown on public (Default: false)",
                    type: 5
                },
            ]
        },
        {
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
        {
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
        }
    ],
    async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;

        switch(subcommand){
            case "series"://set series
                var user = new User(await User.getData(userId));
                var selection = interaction.options._hoistedOptions[0].value.toLowerCase();
                var setCost = 100;
                var userSeries = new Series(user.set_series);
                var series = new Series(selection);
                //validation: series point
                if(user.Series[user.set_series]<setCost){
                    return interaction.reply(
                        Embed.errorMini(`You need ${userSeries.emoji.mascot} ${setCost} ${userSeries.currency.name} to teleport into: **${series.location.name} @${series.name}**`,discordUser, true,{
                            title:`❌ Not Enough Series Points`
                        })
                    );
                }

                // user.Series[series.value]-=setCost;
                // user.set_series = series.value;
                // await user.update();

                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} You have successfully teleported into: **${series.location.name} @${series.name}**`, discordUser, {
                        color:user.set_color,
                        title:`${series.emoji.mascot} Welcome to: ${series.location.name}!`,
                        thumbnail:series.location.icon,
                        footer:Embed.builderUser.footer(`${await User.getUserTotalByLocation(selection)} other user are available in this location`)
                    })
                ]});

                break;
            case "color":
                var user = new User(await User.getData(userId));
                var selection = interaction.options._hoistedOptions[0].value.toLowerCase();
                var setCost = 100;
                var userColor = new Color(user.set_color);
                var color = new Color(selection);
                //validation: color point
                if(user.Color.blue.point<=setCost){

                }

                break;
        }
    }
}
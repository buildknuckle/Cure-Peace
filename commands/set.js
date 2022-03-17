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
const {AvatarFormation, PrecureAvatar} = require('../modules/puzzlun/Data/Avatar');

module.exports = {
    name: 'set',
    cooldown: 5,
    description: 'Contains all card command',
    args: true,
    options:[
        {
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
                            name:`Main`,
                            value:`${AvatarFormation.formation.main.value}`
                        },
                        {
                            name:`Support 1`,
                            value:`${AvatarFormation.formation.support1.value}`
                        },
                        {
                            name:`Support 2`,
                            value:`${AvatarFormation.formation.support2.value}`
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
                if(user.set_series==selection){
                    return interaction.reply(
                        Embed.errorMini(`❌ You've already assigned in **${userSeries.emoji.mascot} ${userSeries.location.name} @${userSeries.name}**`, discordUser, true)
                    );
                } else if(user.Series[user.set_series]<setCost){
                    //validation: series point
                    return interaction.reply(
                        Embed.errorMini(`You need ${userSeries.emoji.mascot} ${setCost} ${userSeries.currency.name} to teleport into: **${series.location.name} @${series.name}**`,discordUser, true,{
                            title:`❌ Not Enough Series Points`
                        })
                    );
                }

                user.Series[userSeries.value]-=setCost;
                user.set_series = series.value;
                await user.update();

                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} You have successfully teleported into: **${series.location.name} @${series.name}**`, discordUser, {
                        color:user.set_color,
                        title:`${series.emoji.mascot} Welcome to: ${series.location.name}!`,
                        thumbnail:series.location.icon,
                        footer:Embed.builderUser.footer(`${await User.getUserTotalByLocation(selection)} other user are available in this location`)
                    })
                ]});

                break;
            case "color"://set color assignment
                var user = new User(await User.getData(userId));
                var selection = interaction.options._hoistedOptions[0].value.toLowerCase();
                var setCost = 100;
                var userColor = Color[user.set_color];
                var color = Color[selection];
                
                if(user.set_color==selection){
                    //validation: same color
                    return interaction.reply(
                        Embed.errorMini(`❌ You've already assigned in ${userColor.emoji} **${userColor.value}** color`, discordUser, true)
                    );
                } else if(user.Color[user.set_color].point<=setCost){
                    //validation: color point
                    return interaction.reply(
                        Embed.errorMini(`You need ${userColor.emoji} ${setCost} ${userColor.value} points to change your color assignment into: **${color.value}**`,discordUser, true,{
                            title:`❌ Not Enough ${userColor.value} Points`
                        })
                    );
                }

                user.Color[user.set_color].point-=setCost;
                user.set_color = selection;
                await user.update();

                return interaction.reply({embeds:[
                    Embed.builder(`${Properties.emoji.mofuheart} Your color assignment has been changed into: **${selection}**`, discordUser, {
                        color:user.set_color,
                        title:`${color.emoji} Color Changed!`,
                        thumbnail:Properties.imgSet.mofu.ok
                    })
                ]});
                break;
            case "avatar"://set precure avatar
                var user = new User(await User.getData(userId));
                var hoistedOptions = interaction.options._hoistedOptions;
                var cardId = hoistedOptions[0].value.toLowerCase();//get card id

                var formation = GlobalFunctions.filterDiscordInteractionKey(
                    hoistedOptions, "formation", AvatarFormation.formation.main.value);//get formation
                var isPrivate = GlobalFunctions.filterDiscordInteractionKey(
                    hoistedOptions, "visible-public", false);//embed visibility
                
                //validation: if card exists
                var cardData = await Card.getCardData(cardId);
                if(cardData==null) return interaction.reply(Validation.Card.embedNotFound(discordUser));
                
                //validation: if user have card
                var cardInventoryData = await CardInventory.getDataByIdUser(userId, cardId);
                if(cardInventoryData==null) return interaction.reply(Validation.Card.embedNotHave(discordUser));

                var cardInventory = new CardInventory(cardInventoryData, cardData);
                var color = Color[cardInventory.color];
                var series = new Series(cardInventory.series);
                var rarity = cardInventory.rarity;
                //validation color & series points
                var cost = {
                    color:10*cardInventory.rarity,
                    series:10*cardInventory.rarity
                }
                if(user.Color[cardInventory.color].point<cost.color||
                user.Series[cardInventory.series]<cost.series){//validation color & series points
                    return interaction.reply(
                        Embed.errorMini(`You need **${color.emoji} ${cost.color}** & **${series.currency.emoji} ${cost.series}** to set ${CardInventory.emoji.rarity(cardInventory.is_gold, rarity)}**${rarity}** ${cardInventory.id_card} - ${GlobalFunctions.cutText(cardInventory.name,15)} as precure avatar`,discordUser, true,{
                            title:`❌ Not Enough Points`
                        })
                    );
                }

                var avatarFormation = new AvatarFormation(await AvatarFormation.getData(userId));
                //validation: check for same avatar on any formation
                if(avatarFormation.id_main==cardInventory.id_card){
                    return interaction.reply(
                        Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.main.name}** formation`,discordUser, true,{
                            title:`❌ Same Avatar/Formation`
                        })
                    );
                } else if(avatarFormation.id_support1==cardInventory.id_card){
                    return interaction.reply(
                        Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.support1.name}** formation`,discordUser, true,{
                            title:`❌ Same Avatar/Formation`
                        })
                    );
                } else if(avatarFormation.id_support2==cardInventory.id_card){
                    return interaction.reply(
                        Embed.errorMini(`This precure has been assigned in **${AvatarFormation.formation.support2.name}** formation`,discordUser, true,{
                            title:`❌ Same Avatar/Formation`
                        })
                    );
                }

                var precureAvatar = new PrecureAvatar(formation, cardInventoryData, cardData);
                avatarFormation[precureAvatar.formation.columns] = cardInventory.id_card;
                await avatarFormation.update();//update the avatar

                user.Color[cardInventory.color].point-=cost.color; //update user color & series points
                user.Series[cardInventory.series]-=cost.series;
                await user.update();
                
                return interaction.reply({embeds:[
                    Embed.builder(dedent(`*"${precureAvatar.properties.transform_quotes2}"*
                
                    <@${userId}> has assign **${precureAvatar.properties.name}** as **${precureAvatar.formation.name}** precure avatar!`),
                        Embed.builderUser.authorCustom(`⭐${rarity} ${precureAvatar.character.alter_ego}`, precureAvatar.character.icon),{
                            color: precureAvatar.character.color,
                            thumbnail: precureAvatar.cardInventory.getImgDisplay(),
                            title: precureAvatar.properties.transform_quotes1,
                            image: precureAvatar.properties.img_transformation
                        }
                    )
                ],ephemeral: isPrivate});
                break;
        }
    }
}
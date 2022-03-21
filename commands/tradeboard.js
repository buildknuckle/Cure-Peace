const dedent = require('dedent-js');
const paginationEmbed = require('../modules/DiscordPagination');
const DiscordStyles = require('../modules/DiscordStyles');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const Properties = require("../modules/puzzlun/Properties");
const Color = Properties.color;
const User = require("../modules/puzzlun/data/User");
// const {Party} = require("../modules/puzzlun/data/Party");
// const {Series, SPack} = require('../modules/puzzlun/data/Series');
const Validation = require("../modules/puzzlun/Validation");
const Card = require("../modules/puzzlun/data/Card");
const CardInventory = require("../modules/puzzlun/data/CardInventory");
const {Tradeboard, CardTradeboard} = require("../modules/puzzlun/data/Tradeboard");
const Embed = require('../modules/puzzlun/Embed');

module.exports = {
    name: 'tradeboard',
    cooldown: 5,
    description: 'Contains all tradeboard command',
    args: true,
    options:[
        {
            name: "post",
            description: "Post card trade offer",
            type: 1,
            options: [
                {
                    name: "looking-for",
                    description: "Enter the precure card id that you're looking for",
                    type: 3,
                    required: true
                },
                {
                    name: "card-offer",
                    description: "Enter the precure card id that you will send",
                    type: 3,
                    required: true
                },
            ]
        },
    ], async executeMessage(message, args) {
	},
    async execute(interaction){
        var command = interaction.options._group;
        var subcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var discordUser = interaction.user;
        var userId = discordUser.id;
        var user = new User(await User.getData(userId));

        switch(subcommand){
            case "post":
                var idCardLookingFor = GlobalFunctions.filterDiscordInteractionKey(interaction.options._hoistedOptions, "looking-for");
                var idCardOffer = GlobalFunctions.filterDiscordInteractionKey(interaction.options._hoistedOptions, "card-offer");

                var cardDataLookingFor = await Card.getCardData(idCardLookingFor);
                var cardDataOffer = await Card.getCardData(idCardOffer);
                if(cardDataLookingFor==null){
                    return interaction.reply(
                        Embed.errorMini(`I cannot find the card that you're looking for.`,discordUser, true, {
                            title:`❌ Cannot find that card`
                        })
                    );
                }

                //check for available card:
                if(cardDataOffer==null){
                    return interaction.reply(
                        Embed.errorMini(`I cannot find the card that card offer.`,discordUser, true, {
                            title:`❌ Cannot find that card`
                        })
                    );
                }

                var cardInventoryData = await CardInventory.getDataByIdUser(userId, idCardOffer);
                if(cardInventoryData==null){
                    return interaction.reply(Validation.Card.embedNotHave(discordUser));
                }

                var cardLookingFor = new Card(cardDataLookingFor);
                var cardOffer = new CardInventory(
                    cardInventoryData,
                    cardDataOffer
                );

                var totalList = await Tradeboard.getTotalByUser(guildId, userId);

                var cardTradeboard = new CardTradeboard(
                    {
                        guildId: guildId,
                        userId: userId,
                        lookingFor: cardLookingFor.id_card,
                        offer: cardOffer.id_card
                    },
                    cardDataLookingFor, cardDataOffer
                );
                console.log(cardTradeboard);
                break;
        }

    }
}
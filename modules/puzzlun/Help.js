const fs = require('fs');

const stripIndents = require('common-tags');
const dedent = require("dedent-js");

const GlobalFunctions = require('../GlobalFunctions');
const DiscordStyles = require('../DiscordStyles');
const paginationEmbed = require('../DiscordPagination');
const Embed = require('./Embed');

const Card = require('../puzzlun/data/Card');
const {Item} = require('../puzzlun/data/Item');
const {Series, SPack} = require('../puzzlun/data/Series');
const User = require('../puzzlun/data/User');
const Properties = require('./Properties');
const Color = Properties.color;
const Emoji = Properties.emoji;
const Currency = Properties.currency;

class Help extends require("./data/Listener") {

    static getCommandList(){
        var puzzlunCommand = ["badge","card","daily","gachapon","item","party","set","shikishi","tradeboard"];
        for(var i=0;i<puzzlunCommand.length;i++){
            var command = puzzlunCommand[i];
            puzzlunCommand[i] = {
                name:`${command}`,
                value:`${command}`
            };
        }

        return puzzlunCommand;
    }

    commandList(){
        var arrPages = [];
        var puzzlunCommand = this.interaction.options.getString("filter")!==null ? 
            [this.interaction.options.getString("filter")]:Help.getCommandList().map(key => key.value);
        
        //page 1:
        var arrFields = [];
        var idx = 0; var maxIdx = 4; var txtHelp = ``;
        var helpAuthor = Embed.builderUser.authorCustom(`Puzzlun command list`, Properties.imgSet.mofu.ok);

        for (const file of puzzlunCommand) {//loop through command list
            const commandFile = require(`../../commands/${file}.js`);
            const mainCommand =  commandFile.name;
            var commandOptions = commandFile.options;

            //check for max page content
            for(var i=0;i<commandOptions.length;i++){//loop through command options
                var command = commandOptions[i];

                arrFields.push(
                    {
                        name:`/${mainCommand} ${command.name} `,
                        value:`${command.description}`
                    }
                )

                if("options" in command){
                    arrFields[idx].value+=`\n**Subcommand:** `;
                    for(var j=0;j<command.options.length;j++){
                        var subcommand = command.options[j];
                        arrFields[idx].value+=
                            dedent(`\`${subcommand.name}\`/`);
                    };
                    arrFields[idx].value = arrFields[idx].value.replace(/\/\s*$/, "");//remove last / and any whitespace
                }
                

                if(idx>=maxIdx||(idx<maxIdx && i==commandOptions.length-1)){
                    let embed = 
                    Embed.builder(dedent(``)
                        ,helpAuthor,{
                            fields:arrFields
                        }
                    )
    
                    arrPages.push(embed);
                    arrFields = []; txtHelp="";
                    idx = 0;
                } else {
                    idx++;
                }
            }

            
        }

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList);
        
    }

    patchNotes(){
        var arrPages = [];
        var helpAuthor = Embed.builderUser.authorCustom(`Puzzlun Peace`, Properties.imgSet.mofu.ok);

        //page 1:
        arrPages.push(
            Embed.builder(dedent(`Puzzlun Peace 2.2 introduces new card, spawn, currency & emoji support. Command updates, QoL improvement, and bug fixes also been made on this release.
            
            __**Overview:**__
            • New card & series: Tropical-Rouge!
            • New status & currency: peace point & jewel
            • New & updated spawn: smile jankenpon, suite notes counting, party treasure hunt
            • New system: tradeboard, gachapon, shikishi, badge
            • Daily rewards & quest updates
            • Item updates
            • Embed & Visual Updates
            • Disabled features
            • Bug fixes
            
            > ${new Series("tropical_rouge").getMascotEmoji()} __**New Card & Series:**__  
            • Total of 75 new precure cards has been added
            • The tropical rouge team has joined into puzzlun! 4 new cure card: Manatsu, Minorin, Sango and Asuka has been added as collectable card. 
            • New series points: ${new Series("tropical_rouge").getMascotEmoji()} **tropi points** has been added.
            • Tropical-rouge series has been added into series assignment command.
            
            > ${Currency.jewel.emoji} __**New Currency: Jewel**__ 
            • Jewel can be obtained by completing daily quests, converting 6/7 ${Card.emoji.rarity(1)} card and clearing treasure hunts.
            • Jewel can be used to use gachapon command.
            
            > ${User.peacePoint.emoji} __**New Status: Peace Point**__ 
            • Peace point can be used on several card spawn to guarantee your card capture into 100%
            • Peace point can be obtained by participating in jankenpon spawn.`),
            helpAuthor, {
                title:`Puzzlun Peace Patch 2.2 Notes`
            })
        );

        //page 2:
        arrPages.push(
            Embed.builder(dedent(`:exclamation: __**New & Updated Spawn **__

            :new: 3 new type of spawn has been added:
            • __**Suite Notes Counting**__
            **Rewards:** 2${Card.emoji.rarity(1)} suite series card, color point & series point
            
            • __**Smile Jankenpon**__
            **Rewards:** 5${Card.emoji.rarity(1)} smile series card, color point, series point & peace point
            
            • **__Party Treasure Hunt__**
            **Rewards:** mofucoin, jewel, shikishi
            
            __**Overview**:__
            Form up party with minimum of 1 party members, party leader must have their precure avatar assigned.  Each party can only commence treasure hunt instance once/spawn.
            
            __**Rules & Gameplay**:__
            • This spawn will be similar with number card spawn, however party need to guess hidden numbers up to 10 stage. Any party members can use the guess party commands.
            • New button command called: **Collect**. This command can be used to collect remained rewards that has been collected.
            • Your party will progress through stage upon guessing correct hidden numbers. 
            • In the event the party is guessing wrong numbers, your party will lost all of its rewards and instances will be ended.
            
            __**Updated Spawn**:__ 
            • Normal card spawn will now spawn 1${Card.emoji.rarity(1)}(80%), 2${Card.emoji.rarity(1)}(70%). Tropical-rouge card will also appeared on this spawn category.
            • Mini tsunagarus will now spawn 3${Card.emoji.rarity(1)} of 4 random cards from answer list.
            • Star twinkle constellation & counting will now spawn 3${Card.emoji.rarity(1)} of 4 random cards. This spawn also moved into act series spawn.
            • Color card will now spawn 4${Card.emoji.rarity(1)}(30%) & 5${Card.emoji.rarity(1)}(20%). Bonus color assignment system has also been added.
            • Tsunagarus battle & series card has been disabled and to be added on next update.`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 3:
        arrPages.push(
            Embed.builder(dedent(`:twisted_rightwards_arrows: __**Tradeboard**__
            **Main command: **/tradeboard
            You can now trade card with other members using tradeboard. 
            • Post your card listing with: /tradeboard post
            • Search card listing with: /tradeboard search-card
            • Process/confirm the trade that you want with: /tradeboard trade
            
            __**Notes & Restrictions:**__
            • You can only trade using the duplicate card.
            • Your duplicate card will be put on hold when post a trade listing
            • In general you can only trade 1-5${Card.emoji.rarity(1)} precure card
            • Some card are limited and cannot be traded. Non limited card can be seen through your inventory and will be marked with :twisted_rightwards_arrows: 
            
            > :ticket: __**Gachapon**__
            **Main command: **/gachapon
            • New system called gachapon has been added. Gachapon contains several card that you can get using jewel/gachapon ticket.
            • Some gachapon will be limited such as daily gachapon with jewel.
            
            > :frame_photo: __**Shikishi**__
            **Main command: **/shikishi
            • Shikishi has been added and can be used to personalize your badge cover.
            • Shikishi can be obtained by participating party treasure hunts spawn.
            
            > ${Emoji.mofuheart} __**Badge**__
            **Main command: **/badge
            Precure badge can be used to personalize yourself with nickname, favorite series, favorite character and write about yourself. You can also set your shikishi as your badge cover.
            ─────────────────`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 4:
        arrPages.push(
            Embed.builder(dedent(`> ${Emoji.mofuheart} __**Daily Rewards & Quest Updates**__
            • New members will receive 8 normal gachapon ticket & 2 premium gachapon ticket.
            • Jewel rewards has been added upon completing 4${Card.emoji.rarity(1)} card quest.
            • Quest completion bonus system has been added. Upon completing all daily card quest you'll receive 50 jewel & 1 gachapon ticket.
            
            > :shopping_cart:  __**Item & Shop Updates**__
            • You can now purchase item with name
            • Category filter has been added
            • New item: gachapon ticket has been added
            • Status effect item has been removed and will get reworks into next updates
            
            > ${Emoji.mofuheart} __**Embed & Visual Updates**__
            • Emoji support has been added
            • Rewards embed will now display points overview
            • Ephemeral/private embed support on paging embed
            • Card ID now will be marked with square bracket. Example: **[nami201]**
            
            __**Series Assignment**__
            • Location has been added upon set new series
            
            __**Status Menu**__
            • status menu will now displayed privately & will be visible when entering username parameter
            • color assignment status has been moved into embed color/embed bar color
            • series assignment has been renamed into location
            • peace point, jewel currency, daily & gachapon status has been added
            
            __**Card Inventory**__
            • card inventory will now displayed privately & will be visible when entering username parameter
            • duplicate card inventory has been moved into card inventory options filter
            • inventory list will now show main parameter status of each card 
            • inventory display style has been added into command options.`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 5:
        arrPages.push(
            Embed.builder(dedent(`> :x: __**Disabled Features**__
            Some features has been temporarily disabled & will get rework prior next updates:
            - card completion/leaderboard
            - kirakira crafting
            - gardening
            - pinky system
            - wishing star
            
            > :tools: __**Bug Fixes**__
            •  fixed number card spawn that cannot display fail notifications upon guessing wrong numbers`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList);

    }

    guide(){
        var category = this.interaction.options.getString("category");
        var helpAuthor = Embed.builderUser.authorCustom(`Puzzlun basic guide`, Properties.imgSet.mofu.ok);
        var arrPages = [];

        switch(category){
            case "starter":{
                arrPages.push(
                    Embed.builder(dedent(`> __**Starter Guideline**__

                    • Get your first & daily rewards everyday with: **/daily**. You'll receive 10 starter ticket on your first daily rewards.
                    • Level up your color level with: **/card upgrade color-level** . Color level will help to increase your capture chance on some spawn such as color card spawn.
                    • **/gachapon** can be used as another way to get new card.
                    • Trade card with other members using: **/tradeboard**

                    __ > **Basic Command**__
                    • Access card status menu with: **/card status**
                    • Access card inventory with: **/card inventory**
                    • Access item inventory with: **/item inventory**
                    • Access shikishi inventory with: **/shikishi inventory**
                    • Access your item inventory menu with: **/item inventory**
                    • Party command can be accessed with: **/party**
                    • Assign your color with: **/set color**`),
                    helpAuthor, {
                        title:`Puzzlun Peace Guide`
                    })
                );
                break;
            }
            case "badge":{
                arrPages.push(
                    Embed.builder(dedent(`─────────────────
                    **Overview**
                    ─────────────────
                    Precure badge can be used to personalize yourself with nickname, favorite series, favorite character and write about yourself. You can also set your shikishi as your badge cover.
                    
                    ─────────────────
                    **Obtaining Shikishi**
                    ─────────────────
                    Shikishi can be obtained by participating in party treasure hunt instance.`),
                    helpAuthor, {
                        title:`Badge`
                    })
                );
                break;
            }
            case "card_spawn":{
                // arrPages.push(
                //     Embed.builder(dedent(`There are 6 different type of puzzlun card spawn that are available:
                //     • Normal Card
                //     • Act (Activity): 
                //     ▸ Smile jankenpon 🆕
                //     ▸ Quiztaccked 
                //     ▸ Suite note counting 🆕
                //     • Color card
                //     • Quiz
                //     • Number guessing
                //     • Party Act (Activity):
                //     ▸Treasure Hunt 🆕
                    
                //     ─────────────────
                //     **Normal Card Spawn**
                //     ─────────────────
                //     Normal card spawn are`),
                //     helpAuthor, {
                //         title:`Puzzlun Card Spawn`
                //     })
                // );

                //page 1:
                arrPages.push(
                    Embed.builder(dedent(`─────────────────
                    **Overview**
                    ─────────────────
                    `),
                    helpAuthor, {
                        title:`Normal Card Spawn`
                    })
                );
                break;
            }
        }

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList);

    }

}

module.exports = {Help};
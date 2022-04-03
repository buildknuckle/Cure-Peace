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
            Embed.builder(dedent(`─────────────────
            **Puzzlun Peace Preliminary Updates 2.2** 
            ─────────────────
            Puzzlun Peace 2.2 introduces emoji display support, new card, spawn, currency, command updates, improvement, bug fixes and more.
            
            __**Overview:**__
            • Emoji display support
            • New card & series: Tropical-Rouge!
            • New status & currency: peace point & jewel
            • New & updated card spawn: smile jankenpon, suite notes counting, party treasure hunt
            • New system: tradeboard, gachapon, shikishi, badge
            • Daily updates
            • Item updates
            • Delayed/removed features
            • Bug fixes
            
            **New Card & Series:** ${new Series("tropical_rouge").getMascotEmoji()}
            ─────────────────
            • The tropical rouge team has joined into the party! 4 new cure card: Manatsu, Minorin, Sango and Asuka has been added. 
            • New series points: **tropi points** has been added.
            • Tropical-rouge series has been added into series assignment command.
            
            **New Currency: Jewel** 
            ─────────────────
            • Jewel can be obtained by completing daily quests, converting 6/7 ${Card.emoji.rarity(1)} card, clearing treasure hunts
            • Jewel can be used to use gachapon command.
            
            **New Status: Peace point** 
            ─────────────────
            • Peace point can be used on several card spawn to guarantee your card capture into 100%
            • Peace point can be obtained by participating in jankenpon spawn.`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 2:
        arrPages.push(
            Embed.builder(dedent(`─────────────────
            **New & updated card spawn **
            ─────────────────
            3 new card spawn has been added
            
            **__Suite notes counting__**
            • **Rewards:** 2${Card.emoji.rarity(1)} suite series card, peace point
            
            **__Smile jankenpon__**
            • **Rewards:** 5${Card.emoji.rarity(1)} smile series card, peace point
            
            **__Party Treasure Hunt__**
            Form up party with minimum of 1 party members, leader must assign their precure avatar.
            This spawn will be similar with number however party need guessed hidden numbers up to 10 stage. 
            • **Rewards:** mofucoin, jewel, shikishi`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 3:
        arrPages.push(
            Embed.builder(dedent(`─────────────────
            **Tradeboard**
            ─────────────────
            **Main command: **/tradeboard
            You can now trade card with other members using tradeboard.
            
            __**Notes/restrictions:**__
            • In general you can only trade with rarity of 1-5.
            • Some card are limited and cannot be traded. Non limited card can be seen through your inventory and will be marked with 🔀  
            • You can only trade using the duplicate card.
            
            **Gachapon**
            ─────────────────
            **Main command: **/gachapon
            • New system called gachapon has been added. Gachapon contains several card that you can get using jewel/gachapon ticket.
            • Some gachapon will be limited such as daily gachapon with jewel.
            
            **Shikishi**
            ─────────────────
            **Main command: **/shikishi
            • Shikishi has been added and can be used to personalize your badge cover.
            • Shikishi can be obtained by participating party treasure hunts spawn.
            
            **Badge**
            ─────────────────
            **Main command: **/badge
            Precure badge can be used to personalize yourself with nickname, favorite series, favorite character and write about yourself. You can also set your shikishi as your badge cover.`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        //page 4:
        arrPages.push(
            Embed.builder(dedent(`─────────────────
            **Daily rewards & quest updates**
            ─────────────────
            • New members will now receive 8 normal gachapon ticket & 2 premium gachapon ticket
            • Jewel rewards has been added upon completing 4:r1: card quest
            • Quest completion bonus system has been added. You'll receive ${Currency.jewel.emoji} 50 jewel & ${Item.category.gacha_ticket.emoji} 1 normal gachapon ticket
            
            **Item & Shop updates**
            ─────────────────
            • New item: ${Item.category.gacha_ticket.emoji} gachapon ticket has been added
            • Status effect item has been removed and will be changed into next updates
            
            **Delayed/removed features**
            ─────────────────
            Some features has been temporarily removed & will be added prior next updates:
            -card completion/leaderboard
            -tsunagarus battle
            -gardening
            -pinky system
            
            **Bug fixes**
            ─────────────────
            • fixed issues upon numbers card spawn that cannot display fail notifications upon guessing wrong numbers`),
            helpAuthor, {
                title:`Patch Notes 2.2`
            })
        );

        paginationEmbed(this.interaction, arrPages, DiscordStyles.Button.pagingButtonList);

    }

    guide(){
        var category = this.interaction.options.getString("category");
        var helpAuthor = Embed.builderUser.authorCustom(`Puzzlun basic guide`, Properties.imgSet.mofu.ok);

        switch(category){
            case "starter":{
                arrPages.push(
                    Embed.builder(dedent(`─────────────────
                    **Starter guidelines**
                    ─────────────────
                    • Get your daily rewards everyday with: **/daily**. You'll receive 10 starter ticket on your first daily rewards.
                    • Level up your color level with: **/card upgrade color-level** . Color level will increase your capture chance on some spawn such as color card spawn.
                    • **/gachapon** can be used as another way to get your card.
                    • You can trade card with other members with **/tradeboard**

                    ─────────────────
                    **Basic command**
                    ─────────────────
                    • Access card status menu with: **/card status**
                    • Access card inventory with: **/card inventory**
                    • Access item inventory with: **/item inventory**
                    • Access shikishi inventory with: **/shikishi inventory**
                    • Access your item inventory menu with: **/item inventory**
                    • Party command can be accessed with: **/party**`),
                    helpAuthor, {
                        title:`Puzzlun Peace starter guide`
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
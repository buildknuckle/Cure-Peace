/* jshint sub:true */
const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('../modules/DiscordPagination');
const GlobalFunctions = require('../modules/GlobalFunctions');
const DiscordStyles = require('../modules/DiscordStyles');

const graphql = "https://graphql.anilist.co";
const graphql_method = 'POST';
const graphql_method_headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};
const template_http_options = {
    method: graphql_method,
    headers: graphql_method_headers,
    body: null
};

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}
module.exports = {
    name: 'anilist',
    args: true,
    // type: 1,
    description: "Anilist command",
    options: [
        {
            name: "search",
            description: "Anilist search command",
            type: 2, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "title",
                    description: "Search for anime title",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "anime-title",
                            description: "Enter the anime title",
                            type: 3,
                            "required": true
                        }
                    ]
                },
                {
                    name: "character",
                    description: "Search for anime character",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "anime-character",
                            description: "Enter the anime character",
                            type: 3,
                            required: true
                        },
                        {
                            name: "anime-title",
                            description: "Enter the anime title",
                            type: 3,
                            required: false
                        }
                    ]
                },
                {
                    name: "staff",
                    description: "Search for anime/VA/studio staff",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "staff-name",
                            description: "Enter the staff name",
                            type: 3,
                            required: true
                        },
                        {
                            name: "filter",
                            description: "Search filter based on Staff(by default)/VA",
                            type: 3,
                            required: false,
                            choices: [
                                {
                                    name: "staff",
                                    value: "staff"
                                },
                                {
                                    name: "voice-actor",
                                    value: "voice-actor"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    async executeMessage(message, args) {
    },
    execute: async function (interaction) {

        let objEmbed = {
            color: DiscordStyles.Color.embedColor
        };

        const command = interaction.options;

        // console.log(command);
        switch (command._subcommand) {
            case "title":
                //search for anime title
                const media_title = command._hoistedOptions[0].value;

                const media_query = `query ($title: String) {
                    Media (search: $title, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
                        id
                        description
                        staff(perPage:6){
                            edges{
                                node{
                                    id
                                    name{
                                        full
                                        native
                                    }
                                }
                                role
                            }
                        }
                        title{
                        romaji
                        english
                        native
                        }
                        bannerImage
                        siteUrl
                    }
                    }`;

                // Define our query variables and values that will be used in the query request
                const media_variables = {
                    title: media_title
                    // id: 15125 //search by id
                };

                // Define the config we'll need for our Api request
                let media_http_options = template_http_options;
                media_http_options.body = JSON.stringify({
                    query: media_query,
                    variables: media_variables
                });

                //main anime info:
                // Make the HTTP Api request
                await fetch(graphql, media_http_options).then(handleResponse)
                    .then(async function handleData(dt) {
                        if (dt['data'] != null) {
                            let replacedTitle = dt['data']['Media']['title']['romaji'];
                            // const regexSymbol = /[-$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
                            const regexSymbol = /[^a-zA-Z\d ]/g;
                            const regexWhitespace = /\s/g;
                            replacedTitle = replacedTitle.replace(regexSymbol, "");//replace all symbols
                            replacedTitle = replacedTitle.replace(regexWhitespace, "-");//replace white space with -

                            objEmbed.description = GlobalFunctions.markupCleaner(dt['data']['Media'].description);
                            if (dt['data']['Media'].description != null) {
                                if (dt['data']['Media'].description.length >= 1024) {
                                    objEmbed.description = dt['data']['Media'].description.substring(0, 1024) + " ...";
                                }
                            }

                            const staffNodes = dt['data']['Media']['staff']['edges'];
                            let ctrIndex = 0;
                            objEmbed.fields = []; //prepare the fields embed
                            staffNodes.forEach(function (entry) {
                                let nativeName = "";
                                if (entry.node.name.native != null) {
                                    nativeName = ` (${entry.node.name.native})`;
                                }
                                objEmbed.fields[ctrIndex] = {
                                    name: `${entry.node.name.full}${nativeName}`,
                                    value: `${entry.role}`, inline: true
                                };
                                ctrIndex += 1;
                            });

                            let titleNative = "";
                            if (dt['data']['Media'].title.native != null) {
                                titleNative = ` (${dt['data']['Media'].title.native})`;
                            }
                            objEmbed.author = {
                                name: `${dt['data']['Media'].title['romaji']}${titleNative}`,
                                url: dt['data']['Media']['siteUrl']
                            };

                            objEmbed.image = {
                                url: `https://img.anili.st/media/${dt['data']['Media'].id}`
                            };
                            await interaction.channel.send({
                                content: `Top search results for: **${media_title}**`,
                                embeds: [new MessageEmbed(objEmbed)]
                            });
                        }
                    })
                    .catch(async function handleError(error) {
                        // console.error(error);
                        return await interaction.reply(`:x: I can't find that **title**. Try to put more specific title/keyword.`);
                    });

                //title list
                //reset the embed objects:
                objEmbed = {
                    color: DiscordStyles.Color.embedColor
                };

                //send pagination too if exists
                const titlelist_query = `query ($id: Int, $page: Int, $search: String) {
                Page (page: $page) {
                    pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                    }
                    media (id: $id, search: $search, isAdult:false, type: ANIME, sort: START_DATE) {
                    id
                    title {
                        romaji
                    }
                    siteUrl
                    seasonYear
                    }
                }
                }`;

                const titlelist_variables = {
                    search: media_title,
                    page: 1
                };

                let titlelist_http_options = template_http_options;
                titlelist_http_options.body = JSON.stringify({
                    query: titlelist_query,
                    variables: titlelist_variables
                });

                await fetch(graphql, titlelist_http_options).then(handleResponse)
                    .then(async function handleData(dt) {
                        if (dt['data']['Page'].media.length >= 2) {
                            let titlelist_txtTitle = "";
                            let titlelist_arrPages = [];
                            let titlelist_ctr = 0;
                            const titellist_maxCtr = 3;
                            let titlelist_pointerMaxData = dt['data']['Page'].media.length;
                            dt['data']['Page'].media.forEach(function (entry) {
                                titlelist_txtTitle += `[${entry['title']['romaji']} `;
                                if (entry['seasonYear'] != null) {
                                    titlelist_txtTitle += `(${entry['seasonYear']})`;
                                }
                                titlelist_txtTitle += `](${entry['siteUrl']})\n`;
                                if (titlelist_pointerMaxData - 1 <= 0 || titlelist_ctr > titellist_maxCtr) {
                                    objEmbed.fields = [{
                                        name: "Top 25 Title Search Results:",
                                        value: titlelist_txtTitle,
                                    }];
                                    titlelist_arrPages.push(new MessageEmbed(objEmbed));
                                    titlelist_txtTitle = "";
                                    titlelist_ctr = 0;
                                } else {
                                    titlelist_ctr++;
                                }
                                titlelist_pointerMaxData--;
                            });

                            // var pages = arrPages;
                            // paginationEmbed.
                            await paginationEmbed(interaction, titlelist_arrPages, DiscordStyles.Button.pagingButtonList);
                        }
                    })
                    .catch(function handleError(error) {
                        // console.log(error);
                        return interaction.reply(
                            {body: `:x: I can't find that **title**. Try to put a more specific title/keyword.`, }
                        );
                    });


                break;
            case "character":
                //search for character
                const charName = command._hoistedOptions[0].value; //param: char name
                const character_title = command._hoistedOptions.hasOwnProperty(1) ? command._hoistedOptions[1].value : false; //param(opt.): anime title
                let charId = -1;

                //check if title parameter was given:
                if (character_title) {
                    const character_title_query = `query ($title: String) {
                        Media (search: $title, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
                            id
                            characters(sort: FAVOURITES_DESC){
                                nodes{
                                    id
                                    name{
                                        first
                                        last
                                        full
                                        native
                                        alternative
                                    }
                                }
                            }
                        }
                        }`;

                    // Define our query variables and values that will be used in the query request
                    const character_title_variables = {
                        title: character_title
                    };

                    // Define the config we'll need for our Api request
                    let character_title_http_options = template_http_options;
                    character_title_http_options.body = JSON.stringify({
                        query: character_title_query,
                        variables: character_title_variables
                    });

                    // Make the HTTP Api request
                    await fetch(graphql, character_title_http_options).then(handleResponse)
                        .then(function handleData(dt) {
                            if (dt['data'] != null) {
                                const titleId = dt['data']['Media'].id;
                                const charNodes = dt['data']['Media']['characters'].nodes;

                                const filteredData = charNodes.filter(val => {
                                    // console.log(val)
                                    return Object.values(val['name']).some(
                                        first => String(first).toLowerCase().includes(charName.toLowerCase())
                                    ) || Object.values(val['name']).some(
                                        last => String(last).toLowerCase().includes(charName.toLowerCase())
                                    ) || Object.values(val['name']).some(
                                        full => String(full).toLowerCase().includes(charName.toLowerCase())
                                    ) || Object.values(val['name']).some(
                                        alternative => String(alternative).toLowerCase().includes(charName.toLowerCase())
                                    );
                                });
                                charId = filteredData.hasOwnProperty(0) ? filteredData[0].id : -1;
                            }
                        })
                        .catch(function handleError(error) {
                            // console.log(error);
                            return interaction.reply(`:x: I can't find that **character** on given **title**. Try to put a more specific keyword.`);
                        });
                }

                //default query:
                let character_query = `query ($keyword: String) {
                    Character (search: $keyword) {
                        id
                        name{
                            full
                            native
                            alternative
                        }
                        image{large,medium}
                        description
                        siteUrl
                        favourites
                        media(type: ANIME, sort: START_DATE){
                            edges{
                                node{
                                    id
                                    title{
                                        romaji
                                    }
                                    siteUrl
                                    seasonYear
                                }
                                voiceActors{
                                    id
                                    name{
                                        full
                                        native
                                    }
                                    language
                                }
                            }
                        }
                    }
                    }`;
                // Define our query variables and values that will be used in the query request
                const character_variables = {
                    keyword: charName
                };

                if (charId !== -1) {
                    character_query = `query ($keyword: String,$idChar:Int) { # Define which variables will be used in the query (id)
                        Character (search: $keyword,id:$idChar) {
                            id
                            name{
                                full
                                native
                                alternative
                            }
                            image{large,medium}
                            description
                            siteUrl
                            favourites
                            media(type: ANIME, sort: START_DATE){
                                edges{
                                    node{
                                        id
                                        title{
                                            romaji
                                        }
                                        siteUrl
                                        seasonYear
                                    }
                                    voiceActors{
                                        id
                                        name{
                                            full
                                            native
                                        }
                                        language
                                    }
                                }
                            }
                        }
                        }`;
                    character_variables.idChar = charId;
                }

                // Define the config we'll need for our Api request
                let character_http_options = template_http_options;
                character_http_options.body = JSON.stringify({
                    query: character_query,
                    variables: character_variables
                });

                // Make the HTTP Api request
                fetch(graphql, character_http_options).then(handleResponse)
                    .then(function handleData(dt) {
                        if (dt['data'] != null) {
                            // objEmbed.title = `${dt['data']['Character'].name.full}
                            // (${dt['data']['Character'].name.native})`;
                            objEmbed.author = {
                                iconURL: dt['data']['Character']['image']['medium'],
                                name: `${dt['data']['Character']['name']['full']}`,
                                url: dt['data']['Character']['siteUrl']
                            };
                            if (dt['data']['Character'].name.native != null) {
                                objEmbed.author.name += ` (${dt['data']['Character'].name.native})`;
                            }
                            objEmbed.thumbnail = {
                                url: dt['data']['Character'].image.large
                            };
                            let appearances = "";
                            const charEdges = dt['data']['Character']['media']['edges'];

                            let character_arrVa = [];
                            let character_ctr = 0;
                            let isMore = false;
                            charEdges.forEach(function (entry) {
                                //add the va data:
                                const vaData = entry['voiceActors'];
                                vaData.forEach(function (entryVa) {
                                    let tempVaText = `${entryVa.name.full}: ${entryVa.language}`;
                                    if (!character_arrVa.includes(tempVaText)) {
                                        character_arrVa.push(tempVaText);
                                    }
                                });
                                //add the appearances of the show:
                                if (character_ctr <= 5) {
                                    const node = entry.node;
                                    appearances += `[${node.title['romaji']} `;
                                    if (node['seasonYear'] != null) {
                                        appearances += ` (${node['seasonYear']})`;
                                    }
                                    appearances += `](${node['siteUrl']})\n`;
                                } else {
                                    isMore = true;
                                }
                                character_ctr++;
                            });
                            if (isMore) {
                                appearances += `**& ${character_ctr}+ other anime**`;
                            }

                            objEmbed.fields = [
                                {
                                    name: `Appearances:`,
                                    value: appearances,
                                    inline: false
                                },
                                {
                                    name: `VA Staff:`,
                                    value: "-",
                                    inline: false
                                },
                                {
                                    name: `Alias:`,
                                    value: '-',
                                    inline: true
                                }
                            ];
                            objEmbed.footer = {
                                text: `❤️ ${dt['data']['Character']['favourites']}`
                            };
                            //alias checking
                            if (dt['data']['Character']['name']['alternative'] !== '') {
                                objEmbed.fields[1] = {
                                    name: `Alias:`,
                                    value: dt['data']['Character']['name']['alternative'].join(","),
                                    inline: true
                                };
                            }

                            const desc = dt['data']['Character'].description;
                            if (desc != null) {
                                objEmbed.description = GlobalFunctions.markupCleaner(desc);
                                if (desc.length >= 1200) {
                                    objEmbed.description = desc.substring(0, 1200) + " ...";
                                }
                            } else {
                                objEmbed.description = "No description available for this character.";
                            }

                            if (character_arrVa.length >= 1) {
                                objEmbed.fields[1] = {
                                    name: `VA Staff:`,
                                    value: character_arrVa.join("\n"),
                                    inline: false
                                };
                            }
                            interaction.reply({embeds: [new MessageEmbed(objEmbed)]});
                        }
                    })
                    .catch(function handleError(error) {
                        // console.log(error);
                        return interaction.reply({
                            body: `:x: I can't find that **character**. Try to put a more specific keyword.`
                        });
                    });

                break;
            case "staff":
                const staffName = command._hoistedOptions[0].value;

                const filter = command._hoistedOptions.hasOwnProperty(1) ? command._hoistedOptions[1].value : "staff"; //param(opt.): staff/va

                const staff_query = `query ($keyword: String) {
                    Staff (search: $keyword) { 
                        id
                        name{
                            full
                            native
                            alternative
                        }
                        image{large,medium}
                        description
                        siteUrl
                        favourites
                        staffMedia(type: ANIME){
                            edges{
                                node{
                                    id
                                    title{
                                        romaji
                                    }
                                    siteUrl
                                    seasonYear
                                }
                                staffRole
                            }
                        }
                        characterMedia{
                            edges{
                                node{
                                   title{
                                       romaji
                                   }
                                   siteUrl
                                   seasonYear
                                }
                                characters{
                                    siteUrl
                                    name{
                                        full
                                        native
                                        alternative  
                                    }
                                    image{large,medium}
                                }
                            }
                        }
                    }
                    }
                    `;

                // Define our query variables and values that will be used in the query request
                const staff_variables = {
                    keyword: staffName
                };

                // Define the config we'll need for our Api request
                let staff_http_options = template_http_options;
                staff_http_options.body = JSON.stringify({
                    query: staff_query,
                    variables: staff_variables
                });

                // Make the HTTP Api request
                fetch(graphql, staff_http_options).then(handleResponse)
                    .then(function handleData(dt) {
                        if (dt['data'] != null) {
                            const staffMediaEdges = dt['data'].Staff['staffMedia']['edges'];

                            objEmbed.author = {
                                iconURL: dt['data'].Staff.image['medium'],
                                name: `${dt['data'].Staff.name.full} (${dt['data'].Staff.name.native})`,
                                url: dt['data'].Staff['siteUrl']
                            };
                            objEmbed.thumbnail = {
                                url: dt['data'].Staff.image.large
                            };

                            let desc = dt['data'].Staff.description;

                            if (desc) {
                                if (desc.length >= 1100) {
                                    desc = desc.substring(0, 1100) + " ...";
                                }
                            } else if (desc === null) {
                                desc = "No description available for this staff.";

                            }

                            objEmbed.description = GlobalFunctions.markupCleaner(desc);

                            //MAIN STAFF DATA
                            let staff_txtCharacter = "";
                            let staff_arrPages = [];
                            let staff_ctr = 0;
                            const staff_maxCtr = 4;
                            let staff_pointerMaxData = staffMediaEdges.length;
                            objEmbed.fields = [];
                            switch (filter) {
                                case "staff":
                                    staffMediaEdges.forEach(function (entry) {
                                        // var temp = "";
                                        const staffMediaNode = entry.node;
                                        // temp += `${staffMediaNode.title.romaji} : ${entry.staffRole}`;
                                        let staff_txtTitle = `${staffMediaNode['title']['romaji']}`;
                                        if (staffMediaNode['seasonYear'] != null) {
                                            staff_txtTitle += ` (${staffMediaNode['seasonYear']})`;
                                        }

                                        objEmbed.fields[staff_ctr] = {
                                            name: `${staff_txtTitle}:`,
                                            value: entry['staffRole'],
                                            inline: true
                                        };

                                        if (staff_pointerMaxData - 1 <= 0 || staff_ctr > staff_maxCtr) {
                                            const msgEmbed = new MessageEmbed(objEmbed);
                                            staff_arrPages.push(msgEmbed);
                                            staff_ctr = 0;
                                        } else {
                                            staff_ctr++;
                                        }
                                        staff_pointerMaxData--;
                                    });

                                    if (staff_arrPages.length >= 2) {
                                        paginationEmbed(interaction, staff_arrPages, DiscordStyles.Button.pagingButtonList);
                                    } else {
                                        interaction.reply({embeds: [new MessageEmbed(objEmbed)]});
                                    }
                                    break;
                                case "voice-actor":
                                    //VA DATA
                                    objEmbed = {
                                        author: objEmbed.author,
                                        title: `Top 25 Known VA Works:`,
                                        color: DiscordStyles.Color.embedColor
                                    };


                                    const charMedia = dt['data'].Staff['characterMedia']['edges'];

                                    let va_txtTitle = "";
                                    let va_txtCharacter = "";
                                    let va_arrPages = [];
                                    let va_ctr = 0;
                                    let va_maxCtr = 4;
                                    let va_pointerMaxData = charMedia.length;
                                    objEmbed.fields = [];
                                    // objEmbed.title = "Top 25 VA:";

                                    charMedia.forEach(function (entry) {

                                        const charNodes = entry['characters'];

                                        charNodes.forEach(function (entryCharacters) {
                                            va_txtCharacter += `[${entryCharacters.name.full}](${entryCharacters['siteUrl']})\n`;
                                        });

                                        if (va_ctr === 0) {
                                            objEmbed.thumbnail = {
                                                url: charNodes[0].image.large
                                            };
                                        }

                                        objEmbed.fields[va_ctr] = {
                                            name: `${entry.node.title['romaji']} (${entry.node['seasonYear']}):`,
                                            value: va_txtCharacter,
                                            inline: true
                                        };
                                        va_txtCharacter = "";

                                        if (va_pointerMaxData - 1 <= 0 || va_ctr > va_maxCtr) {
                                            const va_msgEmbed = new MessageEmbed(objEmbed);
                                            va_arrPages.push(va_msgEmbed);
                                            va_txtTitle = "";
                                            va_txtCharacter = "";
                                            va_ctr = 0;
                                        } else {
                                            va_ctr++;
                                        }
                                        va_pointerMaxData--;
                                    });

                                    if (va_arrPages.length >= 1)
                                        paginationEmbed(interaction, va_arrPages, DiscordStyles.Button.pagingButtonList);
                                    else
                                        interaction.reply("I can't find this **Staff** based on **VA**");
                                    break;
                            }
                        }
                    })
                    .catch(function handleError(error) {
                        // console.log(error);
                        return interaction.reply(`:x: I can't find this **staff**. Try to put more specific keyword.`);
                    });

                break;
        }
    },
};
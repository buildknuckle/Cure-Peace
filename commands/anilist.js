const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const fetch = require('node-fetch');
// const paginationEmbed = require('discord.js-pagination');
const paginationEmbed = require('discordjs-button-pagination');
const GlobalFunctions = require('../modules/GlobalFunctions');
const DiscordStyles = require('../modules/DiscordStyles');

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
}

function handleError(error) {
    console.log(error);
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
	async execute(message, args) {
	},
    async execute(interaction) {
        var objEmbed = {
            color: DiscordStyles.Color.embedColor
        };

        var command = interaction.options;

        // console.log(command);
        switch(command._subcommand){
            case "title":
                //search for anime title
                var _title = command._hoistedOptions[0].value;
                
                var query = `query ($title: String) {
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
                var variables = {
                    title:_title 
                    // id: 15125 //search by id
                };

                // Define the config we'll need for our Api request
                var url = 'https://graphql.anilist.co',
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables
                    })
                };

                //main anime info:
                // Make the HTTP Api request
                await fetch(url, options).then(handleResponse)
                .then(async function handleData(dt) {
                    if(dt.data!=null){
                        var replacedTitle = dt.data.Media.title.romaji;
                        // const regexSymbol = /[-$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
                        const regexSymbol = /[^a-zA-Z\d ]/g;
                        const regexWhitespace = /\s/g;
                        replacedTitle = replacedTitle.replace(regexSymbol,"");//replace all symbols
                        replacedTitle = replacedTitle.replace(regexWhitespace,"-");//replace white space with -

                        objEmbed.description = GlobalFunctions.markupCleaner(dt.data.Media.description);
                        if(dt.data.Media.description!=null){
                            if(dt.data.Media.description.length>=1024){
                                objEmbed.description = dt.data.Media.description.substring(0, 1024) + " ...";
                            }
                        }

                        var staffNodes = dt.data.Media.staff.edges;
                        var ctrIndex = 0; objEmbed.fields = []; //prepare the fields embed
                        staffNodes.forEach(function(entry){
                            var nativeName = "";
                            if(entry.node.name.native!=null){
                                nativeName = ` (${entry.node.name.native})`;
                            }
                            objEmbed.fields[ctrIndex] = {
                                name: `${entry.node.name.full}${nativeName}`,
                                value: `${entry.role}`,inline:true
                            };
                            ctrIndex+=1;
                        })

                        var titleNative = "";
                        if(dt.data.Media.title.native!=null){
                            titleNative = ` (${dt.data.Media.title.native})`;
                        }
                        objEmbed.author = {
                            name:`${dt.data.Media.title.romaji}${titleNative}`,
                            url:dt.data.Media.siteUrl
                        };

                        objEmbed.image = {
                            url: `https://img.anili.st/media/${dt.data.Media.id}`
                        }
                        await interaction.channel.send({
                            content:`Top search results for: **${_title}**`,
                            embeds:[new MessageEmbed(objEmbed)]
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
                var query = `query ($id: Int, $page: Int, $search: String) {
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

                var variables = {
                    search: _title,
                    page: 1
                };

                var url = 'https://graphql.anilist.co',
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables
                    })
                };

                await fetch(url, options).then(handleResponse)
                .then(async function handleData(dt) {
                    if(dt.data.Page.media.length>=2){
                        var txtTitle = ""; var arrPages = [];
                        var ctr = 0; var maxCtr = 3; var pointerMaxData = dt.data.Page.media.length;
                        dt.data.Page.media.forEach(function(entry){
                            txtTitle += `[${entry.title.romaji} `;
                            if(entry.seasonYear!=null){
                                txtTitle += `(${entry.seasonYear})`;
                            }
                            txtTitle += `](${entry.siteUrl})\n`;
                            if(pointerMaxData-1<=0||ctr>maxCtr){
                                objEmbed.fields = [{
                                    name:"Top 25 Title Search Results:",
                                    value: txtTitle,
                                }];
                                var msgEmbed = objEmbed;
                                arrPages.push(new MessageEmbed(msgEmbed));
                                txtTitle = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        });

                        // var pages = arrPages;
                        // paginationEmbed.
                        paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                    }
                })
                .catch(function handleError(error) {
                    // console.log(error);
                    return interaction.reply(`:x: I can't find that **title**. Try to put a more specific title/keyword.`);
                });


            break;
            case "character":
                //search for character
                var charName = command._hoistedOptions[0].value; //param: char name
                var _title = command._hoistedOptions.hasOwnProperty(1) ? command._hoistedOptions[1].value:false; //param(opt.): anime title
                var charId = -1;
                
                //check if title parameter was given:
                if(_title){    
                    var query = `query ($title: String) {
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
                    var variables = {
                        title:_title
                    };
    
                    // Define the config we'll need for our Api request
                    var url = 'https://graphql.anilist.co',
                        options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                query: query,
                                variables: variables
                            })
                        };
    
                    // Make the HTTP Api request
                    var arrTemp = null;
                    await fetch(url, options).then(handleResponse)
                    .then(function handleData(dt) {
                        if(dt.data!=null){
                            titleId = dt.data.Media.id;
                            var charNodes = dt.data.Media.characters.nodes;

                            var filteredData = charNodes.filter(val => {
                                // console.log(val)
                                return Object.values(val.name).some(
                                    first=>String(first).toLowerCase().includes(charName.toLowerCase())
                                ) || Object.values(val.name).some(
                                    last=>String(last).toLowerCase().includes(charName.toLowerCase())
                                ) || Object.values(val.name).some(
                                    full=>String(full).toLowerCase().includes(charName.toLowerCase())
                                ) || Object.values(val.name).some(
                                    alternative=>String(alternative).toLowerCase().includes(charName.toLowerCase())
                                )
                            })
                            charId = filteredData.hasOwnProperty(0) ? filteredData[0].id:-1;
                        }
                    })
                    .catch(function handleError(error) {
                        // console.log(error);
                        return interaction.reply(`:x: I can't find that **character** on given **title**. Try to put a more specific keyword.`);
                    });
                }

                //default query:
                var query = `query ($keyword: String) {
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
                var variables = {
                    keyword:charName
                };

                if(charId!=-1){
                    query = `query ($keyword: String,$idChar:Int) { # Define which variables will be used in the query (id)
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
                    variables.idChar = charId;
                }

                // Define the config we'll need for our Api request
                var url = 'https://graphql.anilist.co',
                    options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: query,
                            variables: variables
                        })
                    };

                // Make the HTTP Api request
                fetch(url, options).then(handleResponse)
                .then(function handleData(dt) {
                    if(dt.data!=null){
                        // objEmbed.title = `${dt.data.Character.name.full} (${dt.data.Character.name.native})`;
                        objEmbed.author = {
                            iconURL: dt.data.Character.image.medium,
                            name: `${dt.data.Character.name.full}`,
                            url: dt.data.Character.siteUrl
                        }
                        if(dt.data.Character.name.native!=null){
                            objEmbed.author.name+=`(${dt.data.Character.name.native})`;
                        }
                        objEmbed.thumbnail = {
                            url: dt.data.Character.image.large
                        }
                        var appearances = "";
                        var charEdges = dt.data.Character.media.edges;
                        
                        var arrVa = [];
                        var ctr = 0; var isMore = false;
                        charEdges.forEach(function(entry){
                            //add the va data:
                            var vaData = entry.voiceActors;
                            vaData.forEach(function(entryVa){
                                var tempVaText = `${entryVa.name.full} : ${entryVa.language}`;
                                if(!arrVa.includes(tempVaText)){
                                    arrVa.push(tempVaText);
                                }
                            })
                            //add the appearances of the show:
                            if(ctr<=5){
                                var node = entry.node;
                                appearances += `[${node.title.romaji} `;
                                if(node.seasonYear!=null){
                                    appearances += ` (${node.seasonYear})`;
                                }
                                appearances += `](${node.siteUrl})\n`;
                            } else {
                                isMore = true;
                            }
                            ctr++;
                        })
                        if(isMore){
                            appearances += `**& ${ctr}+ other anime**`;
                        }

                        objEmbed.fields = [
                            {
                                name:`Appearances:`,
                                value: appearances,
                                inline: false
                            },
                            {
                                name:`VA Staff:`,
                                value: "-",
                                inline: false
                            },
                            {
                                name:`Alias:`,
                                value: '-',
                                inline: true
                            }
                        ]
                        objEmbed.footer = {
                            text :`❤️ ${dt.data.Character.favourites}`
                        }
                        //alias checking
                        if(dt.data.Character.name["alternative"]!=''){
                            objEmbed.fields[1] = {
                                name:`Alias:`,
                                value: dt.data.Character.name.alternative.join(","),
                                inline: true
                            };
                        }

                        var desc = dt.data.Character.description;
                        if(desc!=null){
                            objEmbed.description = GlobalFunctions.markupCleaner(desc);
                            if (desc.length >= 1200) {
                                objEmbed.description = desc.substring(0, 1200) + " ...";
                            }
                        } else {
                            objEmbed.description = "No description available for this character.";
                        }

                        if(arrVa.length>=1){
                            objEmbed.fields[1] = {
                                name:`VA Staff:`,
                                value: arrVa.join("\n"),
                                inline: false
                            }
                        }
                        interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                    }
                })
                .catch(function handleError(error) {
                    // console.log(error);
                    return interaction.reply(`:x: I can't find that **character**. Try to put a more specific keyword.`);
                });

                break;
            case "staff":
                var staffName = command._hoistedOptions[0].value;

                var filter = command._hoistedOptions.hasOwnProperty(1) ? command._hoistedOptions[1].value:"staff"; //param(opt.): staff/va

                var query = `query ($keyword: String) {
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
                var variables = {
                    keyword:staffName
                };

                // Define the config we'll need for our Api request
                var url = 'https://graphql.anilist.co',
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables
                    })
                };

                // Make the HTTP Api request
                fetch(url, options).then(handleResponse)
                .then(function handleData(dt) {
                    if(dt.data!=null){
                        var staffMediaEdges = dt.data.Staff.staffMedia.edges;

                        objEmbed.author = {
                            iconURL: dt.data.Staff.image.medium,
                            name: `${dt.data.Staff.name.full} (${dt.data.Staff.name.native})`,
                            url: dt.data.Staff.siteUrl
                        }
                        objEmbed.thumbnail = {
                            url: dt.data.Staff.image.large
                        }

                        var desc = dt.data.Staff.description;
                        if(desc==null){
                            desc = "No description available for this staff.";
                        }

                        if(desc!=null){
                            if(desc.length>=1100){
                                desc = desc.substring(0, 1100) + " ...";
                            }
                        }

                        objEmbed.description = GlobalFunctions.markupCleaner(desc);

                        //MAIN STAFF DATA
                        var txtCharacter = ""; var arrPages = [];
                        var ctr = 0; var maxCtr = 4; var pointerMaxData = staffMediaEdges.length;
                        objEmbed.fields = [];
                        switch(filter){
                            case "staff":
                                staffMediaEdges.forEach(function(entry){
                                    // var temp = "";
                                    var staffMediaNode = entry.node;
                                    // temp += `${staffMediaNode.title.romaji} : ${entry.staffRole}`;
                                    var txtTitle = `${staffMediaNode.title.romaji}`;
                                    if(staffMediaNode.seasonYear!=null){
                                        txtTitle+=` (${staffMediaNode.seasonYear})`;
                                    }
        
                                    objEmbed.fields[ctr] = {
                                        name:`${txtTitle}:`,
                                        value:entry.staffRole,
                                        inline:true
                                    }
        
                                    if(pointerMaxData-1<=0||ctr>maxCtr){
                                        var msgEmbed = new MessageEmbed(objEmbed);
                                        arrPages.push(msgEmbed);
                                        ctr = 0;
                                    } else {
                                        ctr++;
                                    }
                                    pointerMaxData--;
                                })
                                
                                if(arrPages.length>=2){
                                    paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                                } else {
                                    interaction.reply({embeds:[new MessageEmbed(objEmbed)]});
                                }
                                break;
                            case "voice-actor":
                                //VA DATA
                                objEmbed = {
                                    author: objEmbed.author,
                                    title: `Top 25 Known VA Works:`,
                                    color: DiscordStyles.Color.embedColor
                                };


                                var charMedia = dt.data.Staff.characterMedia.edges;

                                var txtTitle = ""; var txtCharacter = ""; var arrPages = [];
                                var ctr = 0; var maxCtr = 4; var pointerMaxData = charMedia.length;
                                objEmbed.fields = []; 
                                // objEmbed.title = "Top 25 VA:";

                                charMedia.forEach(function(entry){

                                    var charNodes = entry.characters;
                                    
                                    charNodes.forEach(function(entryCharacters){
                                        txtCharacter+=`[${entryCharacters.name.full}](${entryCharacters.siteUrl})\n`;
                                    })

                                    if(ctr==0){
                                        objEmbed.thumbnail = {
                                            url: charNodes[0].image.large
                                        }
                                    }

                                    objEmbed.fields[ctr] = {
                                        name:`${entry.node.title.romaji} (${entry.node.seasonYear}):`,
                                        value:txtCharacter,
                                        inline:true
                                    }
                                    txtCharacter ="";

                                    if(pointerMaxData-1<=0||ctr>maxCtr){
                                        var msgEmbed = new MessageEmbed(objEmbed);
                                        arrPages.push(msgEmbed);
                                        txtTitle = ""; txtCharacter = ""; ctr = 0;
                                    } else {
                                        ctr++;
                                    }
                                    pointerMaxData--;
                                });

                                if(arrPages.length>=1)
                                    paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
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
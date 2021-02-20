const Discord = require('discord.js');
const fetch = require('node-fetch');
const paginationEmbed = require('discord.js-pagination');
const GlobalFunctions = require('../modules/GlobalFunctions');

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
    description: 'Contain all anilist category',
    args: true,
	async execute(message, args) {
        // var guildId = message.guild.id;
        // var userId = message.author.id;
        
        switch(args[0]) {
            case "search": //give anilist link by title
                var objEmbed = {
                    color: '#efcc2c'
                };
                var _title = args.slice(1);
                _title = _title.join(' ');

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

                // Make the HTTP Api request
                await fetch(url, options).then(handleResponse)
                .then(function handleData(dt) {
                    if(dt.data!=null){
                        var replacedTitle = dt.data.Media.title.romaji;
                        // const regexSymbol = /[-$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
                        const regexSymbol = /[^a-zA-Z\d ]/g;
                        const regexWhitespace = /\s/g;
                        replacedTitle = replacedTitle.replace(regexSymbol,"");//replace all symbols
                        replacedTitle = replacedTitle.replace(regexWhitespace,"-");//replace white space with -
                        // return message.channel.send({`Here is the top search result for: **${_title}** \n${dt.data.Media.siteUrl}/${replacedTitle}/`,});

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
                        return message.channel.send({content:`Here is the top search result for: **${_title}**`,embed:objEmbed});
                    }
                })
                .catch(function handleError(error) {
                    console.error(error);
                    return message.channel.send(`Sorry, I can't find that **title**. Try to put a more specific title/keyword.`);
                });

                //reset the embed objects:
                objEmbed = {
                    color: '#efcc2c'
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
                .then(function handleData(dt) {
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
                                    value: txtTitle,
                                }];
                                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                txtTitle = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        });

                        for(var i=0;i<arrPages.length;i++){
                            arrPages[i].fields[0]['name'] = `Top 25 Similar Titles:`;
                        }

                        // var pages = arrPages;
                        paginationEmbed(message,arrPages);
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **title**. Try to put a more specific title/keyword.`);
                });
            
                break;
            case "whois": //search for anime character
            case "profile":
                var objEmbed = {
                    color: '#efcc2c'
                };
                var charName = args.slice(1);
                charName = charName.join(' ');
                var charId = -1;
                //filter with title
                if(charName.includes("from")){
                    var arrSplit = charName.split("from");
                    var titleKeyword = arrSplit[1].replace(/^\s+/,"");
                    charName = arrSplit[0].toLowerCase();

                    var query = `query ($title: String) {
                        Media (search: $title, sort: SEARCH_MATCH, type: ANIME, isAdult:false) {
                            id
                            characters(sort: SEARCH_MATCH){
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
                        title:titleKeyword
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
                    
                    await fetch(url, options).then(handleResponse)
                    .then(function handleData(dt) {
                        if(dt.data!=null){
                            titleId = dt.data.Media.id;
                            var charNodes = dt.data.Media.characters.nodes;
                            charNodes.forEach(function(entry){
                                var altName = entry.name.alternative;
                                if(charName.includes(entry.name.full.toLowerCase())){
                                    charId = entry.id;
                                } else if(charName.includes(entry.name.first.toLowerCase())){
                                    charId = entry.id;
                                } else if(altName[0]!=''){
                                    var lowercasedName = altName.map(altName => altName.toLowerCase());
                                    if(charName.includes(lowercasedName)){
                                        charId = entry.id;
                                    }
                                }
                            })
                        }
                    })
                    .catch(function handleError(error) {
                        return message.channel.send(`Sorry, I can't find that **title**. Try to put a more specific title/keyword.`);
                    });
                } else {
                    title = "";
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
                                nodes{
                                    id
                                    title{
                                        romaji
                                    }
                                    siteUrl
                                    seasonYear
                                }
                            }
                        }
                        }
                        `;
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

                        message.channel.send({embed:objEmbed});
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **character**. Try to put a more specific keyword.`);
                });

                break;
            
            case "staff":
                var objEmbed = {
                    color: '#efcc2c'
                };
                var staffName = args.slice(1);
                staffName = staffName.join(' ');

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
                            desc = "There are no description available for this staff.";
                        }

                        objEmbed.description = GlobalFunctions.markupCleaner(desc);

                        //MAIN STAFF DATA
                        var txtTitle = ""; var txtCharacter = ""; var arrPages = [];
                        var ctr = 0; var maxCtr = 4; var pointerMaxData = staffMediaEdges.length;
                        objEmbed.fields = [];
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
                                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        })
                        
                        if(arrPages.length>=2){
                            paginationEmbed(message,arrPages);
                        } else {
                            message.channel.send({embed:objEmbed});
                        }
                        
                        // 

                        objEmbed = {
                            author: objEmbed.author,
                            title: `Top 25 Known VA Works:`,
                            color: '#efcc2c'
                        };

                        //VA DATA
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
                                
                                var msgEmbed = new Discord.MessageEmbed(objEmbed);
                                arrPages.push(msgEmbed);
                                txtTitle = ""; txtCharacter = ""; ctr = 0;
                            } else {
                                ctr++;
                            }
                            pointerMaxData--;
                        });

                        if(arrPages.length>=1){
                            //VA
                            paginationEmbed(message,arrPages);
                        }

                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **staff** name. Try to put a more specific keyword.`);
                });

                break;
            default:
                break;
        }

	},
};
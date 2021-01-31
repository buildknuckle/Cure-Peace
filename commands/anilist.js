const Discord = require('discord.js');
const fetch = require('node-fetch');
const paginationEmbed = require('discord.js-pagination');

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

                var query = `query ($title: String) { # Define which variables will be used in the query (id)
                    Media (search: $title, type: ANIME, isAdult:false) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                        id
                        title{
                        romaji
                        english
                        native
                        }
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
                        return message.channel.send(`Here is the top search result for: **${_title}** \n${dt.data.Media.siteUrl}/${replacedTitle}/`);
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **title**. Try to put more specific title/keyword.`);
                });

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
                    if(dt.data.Page.media.length>=1){
                        var txtTitle = ""; var arrPages = [];
                        var ctr = 0; var maxCtr = 3; var pointerMaxData = dt.data.Page.media.length;
                        dt.data.Page.media.forEach(function(entry){
                            txtTitle += `[${entry.title.romaji} (${entry.seasonYear})](${entry.siteUrl})\n`;
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
                            arrPages[i].fields[0]['name'] = `Search Results:`;
                        }

                        // var pages = arrPages;
                        paginationEmbed(message,arrPages);
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **title**. Try to put more specific title/keyword.`);
                });
            
                break;
            case "whois": //search for anime character
            case "profile":
                var objEmbed = {
                    color: '#efcc2c'
                };
                var charName = args.slice(1);
                charName = charName.join(' ');

                var query = `query ($keyword: String) { # Define which variables will be used in the query (id)
                    Character (search: $keyword) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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

                // Define our query variables and values that will be used in the query request
                var variables = {
                    keyword:charName
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
                        // objEmbed.title = `${dt.data.Character.name.full} (${dt.data.Character.name.native})`;
                        // console.log(dt.data.Character.media);
                        objEmbed.author = {
                            iconURL: dt.data.Character.image.medium,
                            name: `${dt.data.Character.name.full} (${dt.data.Character.name.native})`,
                            url: dt.data.Character.siteUrl
                        }
                        objEmbed.thumbnail = {
                            url: dt.data.Character.image.large
                        }
                        var appearances = "";
                        var nodes = dt.data.Character.media.nodes;
                        
                        var ctr = 0; var isMore = false;
                        nodes.forEach(function(entry){
                            if(ctr<=5){
                                appearances += `[${entry.title.romaji} (${entry.seasonYear})](${entry.siteUrl})\n`;
                            } else {
                                isMore = true;
                            }
                            ctr++;
                        })
                        if(isMore){
                            appearances += `**& ${ctr} other anime.**`;
                        }

                        objEmbed.fields = [
                            {
                                name:`❤️ Favourites:`,
                                value: dt.data.Character.favourites,
                                inline: false
                            },
                            {
                                name:`Appearances:`,
                                value: appearances,
                                inline: false
                            }
                        ]
                        //alias checking
                        if(dt.data.Character.name["alternative"]!=''){
                            objEmbed.fields[2] = {
                                name:`Alias:`,
                                value: dt.data.Character.name.alternative.join(","),
                                inline: false
                            };
                        }

                        var desc = dt.data.Character.description;
                        if (desc.length >= 450) {
                            desc = desc.substring(0, 450) + " ...";
                        }

                        objEmbed.description = desc;
                        message.channel.send({embed:objEmbed});
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that **character**. Try to put more specific title/keyword.`);
                });

                break;
            default:
                break;
        }

	},
};
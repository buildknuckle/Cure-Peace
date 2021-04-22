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
	name: 'sakuga',
    description: 'Contain all sakugabooru category',
    args: true,

    async execute(message, args) {
        // var guildId = message.guild.id;
        // var userId = message.author.id;
        
        switch(args[0]) {
            case "search":
                var objEmbed = {
                    color: '#efcc2c'
                };

                var page = 1; var indexSlice = 1;
                if(args[1].includes("page")){
                    indexSlice = 2;
                    var splitPage = args[1].split("page");
                    page = splitPage[1];
                }

                var _keyword = args.slice(indexSlice);
                _keyword = _keyword.join(' ');
                if(_keyword==""){
                    message.channel.send("Please enter the search keyword.");
                    return;
                }

                _keyword = _keyword.replace(/\s/g, '_');//replace whitespace
                _keyword = _keyword.replace(/,/g, '+');//repalce comma

                // Define the config we'll need for our Api request
                var url = `https://www.sakugabooru.com/post.json?limit=0&page=${page}&tags=${_keyword}`,
                options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                };

                // console.log(`https://www.sakugabooru.com/post.json?limit=0&page=${page}&tags=${_keyword}`);

                // Make the HTTP Api request
                await fetch(url, options).then(handleResponse)
                .then(async function handleData(dt) {
                    var txtTitle = ""; var arrPages = [];
                    var ctr = 0; var maxCtr = 3; var pointerMaxData = dt.length;
                    dt.forEach(entry => {
                        objEmbed.author = {
                            name: `${entry.author}`,
                            url: `https://www.sakugabooru.com/user/show/${entry.creator_id}`
                        }

                        objEmbed.description = `**Tags:**\n${entry.tags.replace(/\s/g,",").replace(/_/g," ")}`;

                        if(entry.file_ext!="jpg"&&entry.file_ext!="png"&&entry.file_ext!="gif"){
                            objEmbed.description +=`\n\n**File:**\n${entry.file_url}`;
                            objEmbed.image = {
                                url:entry.preview_url
                                // url:entry.jpeg_url
                            }
                        } else {
                            objEmbed.image = {
                                url:entry.file_url
                                // url:entry.jpeg_url
                            }
                        }
                        
                        objEmbed.fields = [
                            {
                                name:`Site:`,
                                value:`[Go to site](https://www.sakugabooru.com/post/show/${entry.id})\n`,
                                inline:true
                                // value: ,
                            },
                            {
                                name:`Posted:`,
                                value:`${GlobalFunctions.timestampToDateTime(entry.created_at)}`,
                                inline:true
                            },
                            {
                                name:`Score:`,
                                value:entry.score,
                                inline:true
                                // value: `[Go to site](https://www.sakugabooru.com/post/show/${dt.id})\n`,
                            },
                        ];
                        var msgEmbed = new Discord.MessageEmbed(objEmbed);
                        arrPages.push(msgEmbed);
                    });

                    if(arrPages.length>0){
                        paginationEmbed(message,arrPages);
                    } else {
                        return message.channel.send(`Sorry, I can't find that **keyword**. Try to put a more specific keyword.`);
                    }
                })
                .catch(function handleError(error) {
                    console.error(error);
                    return message.channel.send(`Sorry, I can't find that **keyword**. Try to put a more specific keyword.`);
                });
                

                break;
        }
    }
}
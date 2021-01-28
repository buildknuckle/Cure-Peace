const fetch = require('node-fetch');

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
            case "search":
                var _title = args.slice(1);
                _title = _title.join(' ');
                //give anilist link by title

                // Here we define our query as a multi-line string
                // Storing it in a separate .graphql/.gql file is also possible
                // var query = `query ($id: Int) { # Define which variables will be used in the query (id)
                // Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                //     id
                //     title {
                //     romaji
                //     english
                //     native
                //     }
                // }
                // }
                // `;


                var query = `query ($title: String) { # Define which variables will be used in the query (id)
                    Media (search: $title, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                        id
                        title{
                        romaji
                        english
                        native
                        }
                        siteUrl
                    }
                    }
                    `;

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
                fetch(url, options).then(handleResponse)
                .then(function handleData(dt) {
                    if(dt.data!=null){
                        return message.channel.send(`${dt.data.Media.siteUrl}`);
                    }
                })
                .catch(function handleError(error) {
                    return message.channel.send(`Sorry, I can't find that title.`);
                });
            
            default:
                break;
        }

	},
};
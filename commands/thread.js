const fetch = require('node-fetch');

module.exports = {
	name: 'thread',
    args: true,
    description: "Thread related command",
    required:true,
    options: [
        {
            name: "join",
            description: "Join into thread",
            type: 1, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "thread-name",
                    description: "Join into thread with given thread name",
                    type: 7, // 1 is type SUB_COMMAND
                    required:true
                }
            ]
        },
        {
            name: "leave",
            description: "Leave from thread",
            type: 1
        }
    ],
    async execute(message, args) {
	},
    async execute(interaction) {
        var command = interaction.options;
        if(command._subcommand==null) return;
        switch(command._subcommand){
            case "join":
                //join into thread
                var threadId = command._hoistedOptions[0].value;
                var thread = await interaction.channel.threads.cache.find(x => x.id === threadId);
                try {
                    await thread.join();
                    interaction.reply(`Successfully joined into: <#${threadId}>`)
                }
                catch(err) {
                    interaction.reply(`:x: Invalid thread input`)
                }
                
                break;
            case "leave":
                try {
                    if(interaction.channel.type.includes("THREAD")){
                        var threadId = interaction.channel.id;
                        interaction.reply(`Successfully leaving from: <#${threadId}>`);
                        await interaction.channel.leave();
                    } else {
                        interaction.reply(`:x: I can only leave from thread`);
                    }
                }
                catch(err) {
                    
                }

                break;
        }
    }
}
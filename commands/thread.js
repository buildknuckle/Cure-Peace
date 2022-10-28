module.exports = {
    name: 'thread',
    args: true,
    description: "Thread related command",
    required: true,
    options: [
        {
            name: "join",
            description: "Join into thread",
            type: 1, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "thread",
                    description: "Join into thread with given thread (channel) name",
                    type: 7, // 1 is type SUB_COMMAND
                    required: true
                }
            ]
        },
        {
            name: "leave",
            description: "Leave from thread",
            type: 1
        }
    ],
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "join":
                // join into thread
                const thread = interaction.options.getChannel('thread-id').id;
                const thread_channel = await interaction.channel.threads.cache.find(x => x.id === thread);
                try {
                    await thread_channel.join();
                    interaction.reply(`Successfully joined into: <#${thread}>`);
                } catch (err) {
                    interaction.reply({content: `:x: Invalid thread input`, ephemeral: true});
                }

                break;
            case "leave":
                if (interaction.channel.type.includes("THREAD")) {
                    const threadId_leave = interaction.channel.id;
                    interaction.reply(`Successfully left from: <#${threadId_leave}>`);
                    await interaction.channel.leave();
                } else {
                    interaction.reply({
                        content: `:x: I can only leave if you issue the leave command within a thread`,
                        ephemeral: true
                    });
                }

                break;
        }
    }
};
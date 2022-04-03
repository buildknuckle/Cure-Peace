class Listener {
    interaction=null;
    userId=null;
    discordUser=null;
    guildId=null;

    constructor(interaction=null){
        this.interaction = interaction;
        this.guildId = interaction.guild.id;
        this.userId = interaction.user.id;
        this.discordUser = interaction.user;
    }
}

module.exports = Listener;
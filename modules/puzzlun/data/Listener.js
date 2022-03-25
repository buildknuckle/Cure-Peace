class Listener {
    userId=null;
    discordUser=null;
    interaction=null;

    constructor(userId=null, discordUser=null, interaction=null){
        this.userId = userId;
        this.discordUser = discordUser;
        this.interaction = interaction;
    }
}

module.exports = Listener;
const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Peace will give info about herself',
    options:[
        {
            name: "server",
            description: "Peace will give info about herself",
            type: 1
        }
    ],
	executeMessage(message, args) {
	},
    execute(interaction){
        var totalGuild = interaction.client.guilds.cache.size;
		const infobox = new Discord.MessageEmbed()
        .setAuthor(interaction.client.user.username)
        .setThumbnail("https://waa.ai/JEwq.png")
        .setColor('#efcc2c')
        .setTitle("Here's some info about me.")
        .setDescription(`I am in **${totalGuild}** servers right now.` )
        interaction.reply({embeds:[new Discord.MessageEmbed(infobox)]})
    }
};
const Discord = require('discord.js');


module.exports = {
	name: 'info',
	description: 'Peace will give info about herself',
	execute(message, args) {
        var totalGuild = message.client.guilds.cache.size;
		const infobox = new Discord.MessageEmbed()
        .setAuthor(message.client.user.username)
        .setThumbnail("https://waa.ai/JEwq.png")
        .setColor('#efcc2c')
        .setTitle("Here's some info about me.")
        .setDescription(`I am in **${totalGuild}** servers right now.` )
        message.channel.send(infobox)
	},
};
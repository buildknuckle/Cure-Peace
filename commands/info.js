const Discord = require('discord.js');


module.exports = {
	name: 'info',
	description: 'Peace will give info about herself',
	execute(message, args) {
		const infobox = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setThumbnail("https://waa.ai/JEwq.png")
        .setColor('#efcc2c')
        .setTitle("Here's some info about me.")
        .addField("I am in ", Discord.Client.guilds.size, " servers right now." )
        message.channel.send(infobox)	
	},
};
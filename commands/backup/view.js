const Discord = require('discord.js');

module.exports = {
    name: 'view',
    cooldown: 5,
    description: 'Peace will display the screencap that you ask for',
    args: true,
    execute(message, args) {
        const rock = new Discord.MessageEmbed()
	        .setColor('#efcc2c')
	        .setTitle('Rock!')
	        .setDescription('Here I am doing my cool rock pose!')    
            .setImage('https://i.imgur.com/xvAk8aA.png')

        const paper = new Discord.MessageEmbed()
	        .setColor('#efcc2c')
	        .setTitle('Paper!')
	        .setDescription('Here I am doing my cool paper pose!')    
            .setImage('https://imgur.com/uQtSfqD.png')
        
        const scissors = new Discord.MessageEmbed()
	        .setColor('#efcc2c')
	        .setTitle('Scissors!')
	        .setDescription('Here I am doing my cool scissors pose!')    
            .setImage('https://imgur.com/vgqsHN5.png')
            
        
        if (args[0] === 'rock') {
            return message.channel.send(rock);
        }
        else if (args[0] === 'paper') {
			return message.channel.send(paper);
        }
        else if (args[0] === 'scissors') {
			return message.channel.send(scissors);
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);	
    },
    execute(interaction){

    }
};
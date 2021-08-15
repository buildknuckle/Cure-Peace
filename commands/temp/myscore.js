const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'myscore',
    cooldown: 5,
    description: 'Peace will tell you your current score!',

    execute(message, args) {

        const peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

        if (!peacestats[message.author.id]){ 
            peacestats[message.author.id] = {
               name: message.author.username,
               win: 0,
               draw: 0,
               loss: 0,
               points: 0
           };
       }

        let cwin = peacestats[message.author.id].win
        let cdraw = peacestats[message.author.id].draw
        let closs = peacestats[message.author.id].loss
        let cpoints = peacestats[message.author.id].points

        const scorecard = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true }))
        .setColor('#efcc2c')
        .setTitle("Here's your current score ", (message.author.username), "!" )
        .addField(":white_check_mark:", `${cwin} wins`)
        .addField(":recycle:", `${cdraw} draws` )
        .addField(":negative_squared_cross_mark:", `${closs} losses`)
        .addField(":cloud_lightning:", `${cpoints} points`)

        message.channel.send(scorecard)	
    }
}
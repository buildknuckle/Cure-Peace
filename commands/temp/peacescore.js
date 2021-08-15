const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'peacescore',
    cooldown: 5,
    description: 'Peace will tell you her current score!',

    execute(message, args) {

        const peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

        if (!peacestats["764510594153054258"]){ 
            peacestats["764510594153054258"] = {
               name: "Cure Peace", 
               win: 0,
               draw: 0,
               loss: 0,
               points: 0
           };
       }
    
        let cwin = peacestats["764510594153054258"].win
        let cdraw = peacestats["764510594153054258"].draw
        let closs = peacestats["764510594153054258"].loss
        let cpoints = peacestats["764510594153054258"].points

        const scorecard = new Discord.MessageEmbed()
        .setAuthor("Cure Peace")
        .setThumbnail("https://cdn.discordapp.com/avatars/764510594153054258/cb309a0c731ca1357cfbe303c39d47a8.png")
        .setColor('#efcc2c')
        .setTitle("Here's my current score!" )
        .addField(":white_check_mark:", `${cwin} wins`)
        .addField(":recycle:", `${cdraw} draws` )
        .addField(":negative_squared_cross_mark:", `${closs} losses`)
        .addField(":cloud_lightning:", `${cpoints} points`)

        message.channel.send(scorecard)	
    }
}
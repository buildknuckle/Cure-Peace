const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name: 'leaderboard',
    cooldown: 5,
    description: 'Peace will tell you the top 10 Rock-Paper-Scissors players!',

    execute(message) {
            
        const peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

        var lbArray = Object.entries(peacestats)

        for (i = 0, len = lbArray.length; i < len; i++) {
        lbArray[i].splice(0,1);
        }

        var newarray = [];

        for (i = 0, len = lbArray.length; i < len; i++) { 
            newarray.push(lbArray[i].pop())
        }

        console.log(newarray)

        function compare(a, b) {
            const ptsa = a.points
        const ptsb = b.points

        let comparison = 0;
        if (ptsa > ptsb) {
            comparison = -1;
        } else if (ptsa < ptsb) {
            comparison = 1;
        }
        return comparison;
        }

        newarray.sort(compare);
        console.log(newarray)

        let postarray = newarray.map(x => `${x.name} - W: ${x.win} - D: ${x.draw} - L: ${x.loss} - Pts: ${x.points}`)
        
        const leaderboard = new Discord.MessageEmbed()
        .setAuthor("Top 10")
        .setThumbnail("https://cdn.discordapp.com/avatars/764510594153054258/cb309a0c731ca1357cfbe303c39d47a8.png")
        .setColor('#efcc2c')
        .setTitle("Here's the current Top 10!" )
        i = 0;
        while (i < 10) {
            if (postarray[i] == undefined) {
                break;
            }
            leaderboard.addField('#' + (i + 1) ,postarray[i]);
            i++;
        }
        message.channel.send(leaderboard)
    }
};
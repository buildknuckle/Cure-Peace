const fs = require('fs');
const Discord = require('discord.js');

const peacestats = JSON.parse(fs.readFileSync('storage/peacestats.json', 'utf8'));

module.exports = {
    name: 'jankenpon',
    cooldown: 5,
    description: 'Peace will play a game of Rock-Paper-Scissors with you!',
    args: true,

    execute(message, args) {

        const janken = new Discord.MessageEmbed()
	        .setColor('#efcc2c')
	        .setTitle('Sparkling, glittering, rock-paper-scissors!')           
        
        if (!peacestats[message.author.id]){ 
             peacestats[message.author.id] = {
                name: message.author.username,
                win: 0,
                draw: 0,
                loss: 0,
                points: 0
            };
        }

        if (!peacestats["764510594153054258"]){ 
            peacestats["764510594153054258"] = {
               name: "Cure Peace", 
               win: 0,
               draw: 0,
               loss: 0,
               points: 0
           };
       }
    
        let uwin = peacestats[message.author.id].win
        let udraw = peacestats[message.author.id].draw
        let uloss = peacestats[message.author.id].loss
        let upoints = peacestats[message.author.id].points

        let pwin = peacestats["764510594153054258"].win
        let pdraw = peacestats["764510594153054258"].draw
        let ploss = peacestats["764510594153054258"].loss
        let ppoints = peacestats["764510594153054258"].points

        if (args[0] === 'rock') {

            peaceChoice = Math.floor(Math.random() * 3) + 1;
            if (peaceChoice == 1) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 1, loss: uloss + 0, points: upoints + 1 } //Poster's Score Draw
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 1, loss: ploss + 0, points: ppoints + 1 } //Cure Peace's Score Draw
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`Hey we both went with Rock! It's a draw!`)
                janken.setImage('https://i.imgur.com/xvAk8aA.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 2) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 0, loss: uloss + 1, points: upoints + 0  } //Poster's Score Loss
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 1, draw: pdraw + 0, loss: ploss + 0, points: ppoints + 3 } //Cure Peace's Score Win
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Paper! Oh no, you lost.`)
                janken.setImage('https://imgur.com/uQtSfqD.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 3) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 1, draw: udraw + 0, loss: uloss + 0, points: upoints + 3 } //Poster's Score Win
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 0, loss: ploss + 1, points: ppoints + 0 } //Cure Peace's Score Loss
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => { 
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Scissors! Yay yay yay! You win!`)
                janken.setImage('https://imgur.com/vgqsHN5.png')
                return message.channel.send(janken); 
            }
        }
        else if (args[0] === 'paper') {
            peaceChoice = Math.floor(Math.random() * 3) + 1;
			if (peaceChoice == 1) {
                peacestats[message.author.id] = {name: message.author.username, win: uwin + 1, draw: udraw + 0, loss: uloss + 0, points: upoints + 3 } //Poster's Score Win
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 0, loss: ploss + 1, points: ppoints + 0 } //Cure Peace's Score Loss
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => { 
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Rock! Yay yay yay! You win!`)
                janken.setImage('https://i.imgur.com/xvAk8aA.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 2) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 1, loss: uloss + 0, points: upoints + 1 } //Poster's Score Draw
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 1, loss: ploss + 0, points: ppoints + 1 } //Cure Peace's Score Draw
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`Hey we both went with Paper! It's a draw!`)
                janken.setImage('https://imgur.com/uQtSfqD.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 3) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 0, loss: uloss + 1, points: upoints + 0  } //Poster's Score Loss
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 1, draw: pdraw + 0, loss: ploss + 0, points: ppoints + 3 } //Cure Peace's Score Win
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Scissors! Oh no, you lost.`)
                janken.setImage('https://imgur.com/vgqsHN5.png')
                return message.channel.send(janken); 
            }
        }
        else if (args[0] === 'scissors') {
            peaceChoice = Math.floor(Math.random() * 3) + 1;
			if (peaceChoice == 1) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 0, loss: uloss + 1, points: upoints + 0  } //Poster's Score Loss
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 1, draw: pdraw + 0, loss: ploss + 0, points: ppoints + 3 } //Cure Peace's Score Win
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Rock! Oh no, you lost.`)
                janken.setImage('https://i.imgur.com/xvAk8aA.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 2) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 1, draw: udraw + 0, loss: uloss + 0, points: upoints + 3 } //Poster's Score Win
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 0, loss: ploss + 1, points: ppoints + 0 } //Cure Peace's Score Loss
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => { 
                    if (err) console.error(err); 
                });
                janken.setDescription(`I picked Paper! Yay yay yay! You win!`)
                janken.setImage('https://imgur.com/uQtSfqD.png')
                return message.channel.send(janken);   
            }
            else if (peaceChoice == 3) {
                peacestats[message.author.id] = { name: message.author.username, win: uwin + 0, draw: udraw + 1, loss: uloss + 0, points: upoints + 1 } //Poster's Score Draw
                peacestats["764510594153054258"] = { name: "Cure Peace",  win: pwin + 0, draw: pdraw + 1, loss: ploss + 0, points: ppoints + 1 } //Cure Peace's Score Draw
                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err); 
                });
                janken.setDescription(`Hey we both went with Scissors! It's a draw!`)
                janken.setImage('https://imgur.com/vgqsHN5.png')
                return message.channel.send(janken); 
            }
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);	
    },
};
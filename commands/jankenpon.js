const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const filename = 'jankenpon.json';
let peacestats_fileobj;

try {
    // rename peacestats.json to jankenpon.json
    if (fs.existsSync('storage/peacestats.json')) {
        fs.renameSync('storage/peacestats.json', `storage/${filename}`);
    }
    peacestats_fileobj = fs.readFileSync(`storage/${filename}`, 'utf8');
} catch (err) {
    if (err.code === 'ENOENT') {
        fs.writeFile(`storage/${filename}`, '{}', (err) => {
            if (err) console.log(err); else {
                console.log("Found no jankenpon stats file, so one was created.\n");
            }
            // new file was created, now load it
            peacestats_fileobj = fs.readFileSync(`storage/${filename}`, 'utf8');
        });
    }
}

let peacestats = JSON.parse(peacestats_fileobj);

module.exports = {
    name: 'jankenpon',
    cooldown: 5,
    description: "Rock-Paper-Scissors! with Peace",
    args: true,
    options: [
        {
            name: "play",
            description: "Peace will play a game of Rock-Paper-Scissors with you!",
            type: 3,
            choices: [
                {
                    name: "rock", value: "rock"
                },
                {
                    name: "paper", value: "paper"
                },
                {
                    name: "scissors", value: "scissors"
                }
            ]
        },
        {
            name: "score",
            description: "Peace will show the Rock-Paper-Score scoreboard!",
            type: 3,
            required: false,
            choices: [
                {
                    name: "myscore", value: "myscore"
                },
                {
                    name: "leaderboard", value: "leaderboard"
                }
            ]
        },
        {
            name: "view",
            description: "Peace will display the screencap that you ask for",
            type: 3,
            required: false,
            choices: [
                {
                    name: "rock", value: "rock"
                },
                {
                    name: "paper", value: "paper"
                },
                {
                    name: "scissors", value: "scissors"
                },
            ]
        },
    ],
    executeMessage(message, args) {
        // slash-only command
    },
    execute(interaction) {
        const userObject = interaction.member.user;
        const userId = userObject.id;
        const username = userObject.username;
        const avatarURL = userObject.avatarURL();

        const clientId = interaction.applicationId;
        const janken = new MessageEmbed({
                color: '#efcc2c',
                title: 'Sparkling, glittering, rock-paper-scissors!'
            }
        );

        if (!(userId in peacestats)) {
            // if the user playing isn't in the stats, add them
            peacestats[userId] = {
                name: username, win: 0, draw: 0, loss: 0, points: 0
            };
        }

        // if the bot isn't in the stats, add it
        if (!(clientId in peacestats)) {
            peacestats[clientId] = {
                name: "Cure Peace", win: 0, draw: 0, loss: 0, points: 0
            };
        }

        let uwin = peacestats[userId].win;
        let udraw = peacestats[userId].draw;
        let uloss = peacestats[userId].loss;
        let upoints = peacestats[userId].points;

        let pwin = peacestats[clientId].win;
        let pdraw = peacestats[clientId].draw;
        let ploss = peacestats[clientId].loss;
        let ppoints = peacestats[clientId].points;

        //first param
        const command = interaction.options._hoistedOptions.hasOwnProperty(0) ? interaction.options._hoistedOptions[0].name : null;

        switch (command) {
            case "play":
                const play_selection = interaction.options._hoistedOptions[0].value;
                const peaceChoice = Math.floor(Math.random() * 3) + 1;

                let state = 0; // 0:draw, 1:loss, 2:win
                switch (play_selection) {
                    case "rock":
                        switch (peaceChoice) {
                            case 1:
                                state = 0;
                                janken.setDescription(`Hey we both went with Rock! It's a draw!`);
                                janken.setImage('https://i.imgur.com/xvAk8aA.png');
                                break;
                            case 2:
                                state = 1;
                                janken.setDescription(`I picked Paper! Oh no, you lost.`);
                                janken.setImage('https://i.imgur.com/uQtSfqD.png');
                                break;
                            case 3:
                                state = 2;
                                janken.setDescription(`I picked Scissors! Yay yay yay! You win!`);
                                janken.setImage('https://i.imgur.com/vgqsHN5.png');
                                break;
                        }
                        break;
                    case "paper":
                        switch (peaceChoice) {
                            case 1:
                                state = 2;
                                janken.setDescription(`I picked Rock! Yay yay yay! You win!`);
                                janken.setImage('https://i.imgur.com/xvAk8aA.png');
                                break;
                            case 2:
                                state = 0;
                                janken.setDescription(`Hey we both went with Paper! It's a draw!`);
                                janken.setImage('https://i.imgur.com/uQtSfqD.png');
                                break;
                            case 3:
                                state = 1;
                                janken.setDescription(`I picked Scissors! Oh no, you lost.`);
                                janken.setImage('https://i.imgur.com/vgqsHN5.png');
                                break;
                        }
                        break;
                    case "scissors":
                        switch (peaceChoice) {
                            case 1:
                                state = 1;
                                janken.setDescription(`I picked Rock! Oh no, you lost.`);
                                janken.setImage('https://i.imgur.com/xvAk8aA.png');
                                break;
                            case 2:
                                state = 2;
                                janken.setDescription(`I picked Paper! Yay yay yay! You win!`);
                                janken.setImage('https://i.imgur.com/uQtSfqD.png');
                                break;
                            case 3:
                                state = 0;
                                janken.setDescription(`Hey we both went with Scissors! It's a draw!`);
                                janken.setImage('https://i.imgur.com/vgqsHN5.png');
                                break;
                        }
                        break;
                }

                switch (state) {
                    case 0:
                        //draw
                        peacestats[userId] = {name: username, win: uwin + 0, draw: udraw + 1, loss: uloss + 0, points: upoints + 1}; // Poster's Score Draw
                        peacestats[clientId] = {name: "Cure Peace", win: pwin + 0, draw: pdraw + 1, loss: ploss + 0, points: ppoints + 1}; // Cure Peace's Score Draw
                        break;
                    case 1:
                        //loss
                        peacestats[userId] = {name: username, win: uwin + 0, draw: udraw + 0, loss: uloss + 1, points: upoints + 0}; // Poster's Score Loss
                        peacestats[clientId] = {name: "Cure Peace", win: pwin + 1, draw: pdraw + 0, loss: ploss + 0, points: ppoints + 3}; // Cure Peace's Score Win
                        break;
                    case 2:
                        //win
                        peacestats[userId] = {name: username, win: uwin + 1, draw: udraw + 0, loss: uloss + 0, points: upoints + 3}; // Poster's Score Win
                        peacestats[clientId] = {name: "Cure Peace", win: pwin + 0, draw: pdraw + 0, loss: ploss + 1, points: ppoints + 0}; // Cure Peace's Score Loss
                        break;
                }

                fs.writeFile('storage/peacestats.json', JSON.stringify(peacestats), (err) => {
                    if (err) console.error(err);
                });
                return interaction.reply({embeds: [janken]});
            case "score":
                const score_selection = interaction.options._hoistedOptions[0].value; //myscore/leaderboard
                switch (score_selection) {
                    case "myscore":
                        const scorecard = new MessageEmbed({
                            author: username,
                            thumbnail: avatarURL,
                            color: '#efcc2c',
                            title: `Here's your current score, ${username}!`,
                            fields: [
                                {
                                    name: ':white_check_mark:', value: `${uwin} wins`
                                },
                                {
                                    name: ':recycle:', value: `${udraw} draws`
                                },
                                {
                                    name: ':negative_squared_cross_mark:', value: `${uloss} losses`
                                },
                                {
                                    name: ':cloud_lightning:', value: `${upoints} points`
                                }
                            ]
                        });
                        interaction.reply({embeds: [scorecard]});
                        break;
                    case "leaderboard":
                        let lbArray = Object.entries(peacestats);

                        for (let i = 0, len = lbArray.length; i < len; i++) {
                            lbArray[i].splice(0, 1);
                        }

                        let newarray = [];

                        for (let i = 0, len = lbArray.length; i < len; i++) {
                            newarray.push(lbArray[i].pop());
                        }

                    function compare(a, b) {
                        const ptsa = a.points;
                        const ptsb = b.points;

                        let comparison = 0;
                        if (ptsa > ptsb) {
                            comparison = -1;
                        } else if (ptsa < ptsb) {
                            comparison = 1;
                        }
                        return comparison;
                    }

                        newarray.sort(compare);

                        let postarray = newarray.map(x => `${x.name} - W: ${x.win} - D: ${x.draw} - L: ${x.loss} - Pts: ${x.points}`);

                        let leaderboard = new MessageEmbed()
                            .setAuthor({name: "Top 10"})
                            .setThumbnail("https://cdn.discordapp.com/avatars/764510594153054258/cb309a0c731ca1357cfbe303c39d47a8.png")
                            .setColor('#efcc2c')
                            .setTitle("Here's the current Top 10!");

                        let i = 0;
                        while (i < 10) {
                            if (postarray[i] === undefined) {
                                break;
                            }

                            // v14
                            // leaderboard.addFields([
                            //     {name: `#${i + 1}`, value: postarray[i]}
                            // ]);
                            leaderboard.addField(`#${i + 1}`, postarray[i]);
                            i++;
                        }
                        interaction.reply({embeds: [leaderboard]});
                        break;
                }
                break;
            case "view":
                const view_selection = interaction.options._hoistedOptions[0].value; // rock/paper/scissors
                switch (view_selection) {
                    case "rock":
                        janken.setTitle('Rock!')
                            .setDescription('Here I am doing my cool rock pose!')
                            .setImage('https://i.imgur.com/xvAk8aA.png');
                        break;
                    case "paper":
                        janken.setTitle('Paper!')
                            .setDescription('Here I am doing my cool paper pose!')
                            .setImage('https://i.imgur.com/uQtSfqD.png');
                        break;
                    case "scissors":
                        janken.setColor('#efcc2c')
                            .setTitle('Scissors!')
                            .setDescription('Here I am doing my cool scissors pose!')
                            .setImage('https://i.imgur.com/vgqsHN5.png');
                        break;
                }
                interaction.reply({embeds: [janken]});
                break;
            case null:
                interaction.reply({content: 'You did not specify a valid option!', ephemeral: true});
                break;
        }
    }
};
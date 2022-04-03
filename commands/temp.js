const Discord = require('discord.js');

module.exports = {
    name: 'temp',
    cooldown: 5,
    description: `You'll be able to convert temperatures now!`,
    args: true,
    options: [
        {
            name: "ctof",
            type: 1,
            description: "Celsius to Fahrenheit",
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        },
        {
            name: "ftoc",
            description: "Fahrenheit to Celsius",
            type: 1,
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        },
        {
            name: "ktoc",
            value: 'ktoc',
            description: "Kelvin to Celsius",
            type: 1,
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        },
        {
            name: "ktof",
            value: 'ktof',
            description: "Kelvin to Fahrenheit",
            type: 1,
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        },
        {
            name: "ctok",
            value: "ctok",
            description: "Celsius to Kelvin",
            type: 1,
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        },
        {
            name: "ftok",
            value: 'ftok',
            description: "Fahrenheit to Kelvin",
            type: 1,
            options: [
                {
                    type: 4,
                    name: "temp",
                    description: "Temperature",
                    choices: [],
                    required: true
                }
            ],
        }
    ],

    executeMessage(message, args) {

    },
    execute(interaction) {

        const tempbox = new Discord.MessageEmbed();
        const command = interaction.options._subcommand;
        const temp = interaction.options._hoistedOptions[0].value;
        let tempresult = 0;

        let convert = function (color, type, title, output) {
            tempbox.setColor(color);
            const hot = 'The brilliant sun, hot-blooded power!';
            const cold = 'The light of Wisdom!';
            switch (type) {
                case 'hot':
                    tempbox.setTitle(`${hot} ${title}`);
                    tempbox.setThumbnail("https://waa.ai/JEw2.png");
                    tempbox.setDescription(output);
                    break;
                case 'cold':
                    tempbox.setThumbnail("https://waa.ai/JEwz.png");
                    tempbox.setTitle(`${cold} ${title}`);
                    tempbox.setDescription(output);
                    break;
            }
            return interaction.reply({embeds: [tempbox]});
        };

        let emptyInput = function (color, thumb = null) {
            tempbox.setColor(color);
            if (thumb) {
                tempbox.setThumbnail(thumb);
            }
            tempbox.setDescription(`You didn't enter anything!`);
            return interaction.reply({embeds: [tempbox], ephemeral: true});
        };

        switch (command) {
            case "ctof":
                if (temp != null) {
                    tempresult = (temp * 9 / 5) + 32;
                    let title = 'Converting Celsius to Fahrenheit!';
                    let output = `${temp} ℃ is ${tempresult} ℉`;

                    convert('#F97E36', 'hot', title, output);
                } else {
                    emptyInput('#F97E36');
                }
                break;
            case "ftoc":
                if (temp != null) {
                    tempresult = (temp - 32) * 5 / 9;

                    let title = 'Converting Fahrenheit to Celsius!';
                    let output = `${temp} ℉ is ${tempresult} ℃`;

                    convert('#F97E36', 'hot', title, output);
                } else {
                    emptyInput('#F97E36');
                }
                break;
            case "ktoc":
                if (temp != null) {

                    tempresult = temp - 273.15;
                    let title = 'Converting Kelvin to Celsius!';
                    let output = `${temp} K is ${tempresult} ℃`;

                    convert('#A59CFD', 'cold', title, output);
                } else {
                    emptyInput('#A59CFD', 'https://waa.ai/JEwz.png');
                }
                break;
            case "ktof":
                if (temp != null) {

                    tempresult = (temp - 273.15) * 9 / 5 + 32;
                    let title = 'Converting Kelvin to Fahrenheit!';
                    let output = `${temp} K is ${tempresult} ℉`;

                    convert('#A59CFD', 'cold', title, output);
                } else {
                    emptyInput('#A59CFD', 'https://waa.ai/JEwz.png');
                }
                break;
            case "ctok":
                if (temp != null) {

                    tempresult = temp + 273.15;

                    let title = 'Converting Celsius to Kelvin!';
                    let output = `${temp} ℃ is ${tempresult} K`;
                    convert('#A59CFD', 'cold', title, output);
                } else {
                    emptyInput('#A59CFD', 'https://waa.ai/JEwz.png');
                }
                break;
            case "ftok":
                if (temp != null) {

                    tempresult = (temp - 32) * 5 / 9 + 273.15;
                    let title = 'Converting Fahrenheit to Kelvin!';
                    let output = `${temp} ℉ is ${tempresult} K`;

                    convert('#A59CFD', 'cold', title, output);
                } else {
                    emptyInput('#A59CFD', 'https://waa.ai/JEwz.png');
                }
                break;
            case null:
                interaction.reply({content: "No conversion specified!", ephemeral: true});
                break;
        }

    },

};

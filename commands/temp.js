const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { Embed } = require("../modules/discord/Embed");

module.exports = {
	name: "temp",
	cooldown: 5,
	description: "You'll be able to convert temperatures now!",
	type: ApplicationCommandType.ChatInput,
	args: true,
	options: [
		{
			name: "mode",
			description: "Select conversion mode",
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{
					name: "celcius-to-fahrenheit",
					value: "ctof",
				},
				{
					name: "fahrenheit-to-celcius",
					value: "ftoc",
				},
				{
					name: "kelvin-to-celcius",
					value: "ktoc",
				},
				{
					name: "kelvin-to-fahrenheit",
					value: "ktof",
				},
				{
					name: "celcius-to-kelvin",
					value: "ctok",
				},
				{
					name: "fahrenheit-to-kelvin",
					value: "ftok",
				},
			],
		},
		{
			name: "temperature",
			description: "Provide the original temperature",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
	execute(interaction) {
		const mode = interaction.options.getString("mode");
		const temp = interaction.options.getInteger("temperature");

		const convert = function(type, title, output) {
			const embed = new Embed();
			const hot = "The brilliant sun, hot-blooded power!";
			const cold = "The light of Wisdom!";
			switch (type) {
			case "hot":
				embed.title = `${hot} ${title}`;
				embed.thumbnail = "https://waa.ai/JEw2.png";
				embed.color = 0xF97E36;
				break;
			case "cold":
				embed.title = `${cold} ${title}`;
				embed.thumbnail = "https://waa.ai/JEwz.png";
				embed.color = 0xA59CFD;
				break;
			}
			embed.description = output;
			return interaction.reply(embed.buildEmbed());
		};

		switch (mode) {
		case "ctof":{
			const tempresult = (temp * 9 / 5) + 32;
			const title = "Converting Celsius to Fahrenheit!";
			const output = `${temp} ℃ is ${tempresult} ℉`;
			convert("hot", title, output);
			break;
		}
		case "ftoc":{
			const tempresult = (temp - 32) * 5 / 9;
			const title = "Converting Fahrenheit to Celsius!";
			const output = `${temp} ℉ is ${tempresult} ℃`;
			convert("hot", title, output);
			break;
		}
		case "ktoc":{
			const tempresult = temp - 273.15;
			const title = "Converting Kelvin to Celsius!";
			const output = `${temp} K is ${tempresult} ℃`;
			convert("cold", title, output);
			break;
		}
		case "ktof":{
			const tempresult = (temp - 273.15) * 9 / 5 + 32;
			const title = "Converting Kelvin to Fahrenheit!";
			const output = `${temp} K is ${tempresult} ℉`;
			convert("cold", title, output);
			break;
		}
		case "ctok":{
			const tempresult = temp + 273.15;
			const title = "Converting Celsius to Kelvin!";
			const output = `${temp} ℃ is ${tempresult} K`;
			convert("cold", title, output);
			break;
		}
		case "ftok":{
			const tempresult = (temp - 32) * 5 / 9 + 273.15;
			const title = "Converting Fahrenheit to Kelvin!";
			const output = `${temp} ℉ is ${tempresult} K`;
			convert("cold", title, output);
			break;
		}
		}


	},

};

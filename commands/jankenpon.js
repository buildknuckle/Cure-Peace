const fs = require("fs");
const { ApplicationCommandType, ApplicationCommandOptionType, bold } = require("discord.js");
const { Embed } = require("../modules/discord/Embed");
const { capitalize } = require("../modules/helper/typography");

const peacestats = JSON.parse(fs.readFileSync("storage/peacestats.json", "utf8"));
const PeaceStatsModel = require("../models/PeaceStatsModel");
const { stripIndent } = require("common-tags");
const { rndProperty } = require("../modules/helper/randomizer");

module.exports = {
	name: "jankenpon",
	description: "Rock-Paper-Scissors! with Peace",
	args: true,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "play",
			description: "Play jankenpon with peace",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "move",
					description: "Choose your move",
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{
							name: "rock",
							value: "rock",
						},
						{
							name: "paper",
							value: "paper",
						},
						{
							name: "scissors",
							value: "scissors",
						},
					],
				},
			],
		},
		{
			name: "scoreboard",
			description: "Peace will show the Rock-Paper-Score scoreboard!",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "type",
					description: "Scoreboard type",
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{
							name: "my-score",
							value: "my-score",
						},
						{
							name: "leaderboard",
							value: "leaderboard",
						},
					],
				},
			],
		},
		{
			name: "view",
			description: "Peace will display the screencap that you ask for",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "pose",
					description: "Choose the pose that you want to view",
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{
							name: "rock",
							value: "rock",
						},
						{
							name: "paper",
							value: "paper",
						},
						{
							name: "scissors",
							value: "scissors",
						},
					],
				},
			],
		},
	],
	async execute(interaction) {
		const user = interaction.member.user;
		const userId = user.id;
		const username = user.username;
		const avatarURL = user.avatarURL();
		const clientId = interaction.applicationId;

		const img = {
			"rock":"https://i.imgur.com/xvAk8aA.png",
			"paper":"https://i.imgur.com/uQtSfqD.png",
			"scissors":"https://i.imgur.com/vgqsHN5.png",
		};

		await interaction.deferReply();

		// init user peacestats
		const userPeaceStats = new PeaceStatsModel();
		let paramWhere = new Map();
		paramWhere.set(userPeaceStats.fields.id_user, userId);
		await userPeaceStats.find(paramWhere);
		if (!userPeaceStats.hasData()) {
			userPeaceStats.id_user = userId;
			userPeaceStats.name = username;
			await userPeaceStats.insert();
		}

		if (!peacestats[userId]) {
			peacestats[userId] = {
				name: user.username,
				win: 0,
				draw: 0,
				loss: 0,
				points: 0,
			};
		}

		// load peacestats
		const peaceStatsDB = new PeaceStatsModel();
		paramWhere = new Map();
		paramWhere.set(peaceStatsDB.fields.id_user, clientId);
		await peaceStatsDB.find(paramWhere);

		switch (interaction.options.getSubcommand()) {
		case "play":{
			const embed = new Embed();
			const selection = interaction.options.getString("move");

			// enum list of state
			const State = {
				Draw: 0,
				Win: 1,
				Lose: 2,
			};

			const Choice = {
				Rock: "rock",
				Paper: "paper",
				Scissors: "scissors",
			};

			const peaceChoice = rndProperty(Choice);
			let peaceState = State.Draw;

			switch (selection) {
			case "rock":{
				switch (peaceChoice) {
				case Choice.Rock:{
					peaceState = State.Draw;
					break;
				}
				case Choice.Paper:{
					peaceState = State.Win;
					break;
				}
				case Choice.Scissors:
				default:{
					peaceState = State.Lose;
					break;
				}
				}
				break;
			}
			case "paper":{
				switch (peaceChoice) {
				case Choice.Rock:{
					peaceState = State.Lose;
					break;
				}
				case Choice.Paper:{
					peaceState = State.Draw;
					break;
				}
				case Choice.Scissors:
				default:{
					peaceState = State.Win;
					break;
				}
				}
				break;
			}
			case "scissors":
			default:{
				switch (peaceChoice) {
				case Choice.Rock:{
					peaceState = State.Win;
					break;
				}
				case Choice.Paper:{
					peaceState = State.Lose;
					break;
				}
				case Choice.Scissors:
				default:{
					peaceState = State.Draw;
					break;
				}
				}
				break;
			}
			}

			embed.image = img[peaceChoice];

			switch (peaceState) {
			case State.Draw: {
				embed.title = "♻️ It's a draw!";
				embed.description = `Hey we both went with ${capitalize(peaceChoice)}! It's a draw!`;

				peacestats[userId].draw++;
				peacestats[userId].points++;
				userPeaceStats.draw++;
				userPeaceStats.points++;

				peacestats[clientId].draw++;
				peacestats[clientId].points++;
				peaceStatsDB.draw++;
				peaceStatsDB.points++;
				break;
			}
			case State.Win: {
				embed.title = ":negative_squared_cross_mark: You lose!";
				embed.description = `I picked ${capitalize(peaceChoice)}! Oh no, you lose.`;

				peacestats[userId].loss++;
				userPeaceStats.loss++;

				peacestats[clientId].win++;
				peacestats[clientId].points += 3;
				peaceStatsDB.win++;
				peaceStatsDB.points += 3;

				embed.color = Embed.color.danger;
				break;
			}
			case State.Lose:
			default: {
				embed.title = ":white_check_mark: You win!";
				embed.description = `I picked ${capitalize(peaceChoice)}! Yay yay yay! You win!`;

				peacestats[userId].win++;
				peacestats[userId].points += 3;
				userPeaceStats.win++;
				userPeaceStats.points += 3;

				peacestats[clientId].loss++;
				peaceStatsDB.loss++;
				embed.color = Embed.color.success;
				break;
			}
			}

			embed.addFields("Your Current Score:", stripIndent`${bold("Win: ")} ${userPeaceStats.win}
			${bold("Loss: ")} ${userPeaceStats.loss}
			${bold("Draw: ")} ${userPeaceStats.draw}`, true);

			fs.writeFile("storage/peacestats.json", JSON.stringify(peacestats), (err) => {
				if (err) console.error(err);
			});

			// update peacestats
			await userPeaceStats.update();
			await peaceStatsDB.update();

			return interaction.followUp(embed.buildEmbed());
		}
		case "scoreboard": {
			const scoreType = interaction.options.getString("type");

			switch (scoreType) {
			case "my-score": {
				const embed = new Embed(interaction.member.user);
				embed.description = `Here's your current score, ${username}!`;
				embed.thumbnail = avatarURL;
				embed.addFields(":white_check_mark:", `${userPeaceStats.win} wins`);
				embed.addFields(":recycle:", `${userPeaceStats.draw} draws`);
				embed.addFields(":negative_squared_cross_mark:", `${userPeaceStats.loss} losses`);
				embed.addFields(":cloud_lightning:", `${userPeaceStats.points} points`);
				return interaction.followUp(embed.buildEmbed());
			}
			case "leaderboard": {
				const embed = new Embed();
				embed.authorName = "Top 10";
				embed.title = "Here's the current Top 10!";
				embed.thumbnail = "https://cdn.discordapp.com/avatars/764510594153054258/cb309a0c731ca1357cfbe303c39d47a8.png";

				const paramOrderBy = new Map();
				paramOrderBy.set(peaceStatsDB.fields.points, "DESC");
				const results = await PeaceStatsModel.DB.selectAll(peaceStatsDB.tableName, null, paramOrderBy, 10);
				for (let i = 0; i < results.length;i++) {
					const leaderboardModel = new PeaceStatsModel();
					leaderboardModel.setData(results[i]);

					embed.addFields("#" + (i + 1), `${leaderboardModel.name} - W: ${leaderboardModel.win} - D: ${leaderboardModel.draw} - L: ${leaderboardModel.loss} - Pts: ${leaderboardModel.points}`);

				}

				return interaction.followUp(embed.buildEmbed());
			}
			}

			break;
		}
		case "view": {
			const pose = interaction.options.getString("pose");

			const embed = new Embed();
			embed.title = `${capitalize(pose)}`;
			embed.description = `Here I am doing my cool ${pose} pose!`;
			embed.image = img[pose];

			return interaction.followUp(embed.buildEmbed());
		}
		}
	},
};
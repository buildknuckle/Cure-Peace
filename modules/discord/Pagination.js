const Pagination = require("@acegoal07/discordjs-pagination");

const {
	ButtonBuilder, ButtonStyle,
} = require("discord.js");

// default timeout:
const PaginationConfig = {
	timeout: 50000,
	prevBtn:"previousbtn",
	nextBtn:"nextbtn",
};

// basic paging list
const PaginationButton = [
	new ButtonBuilder()
		.setCustomId(PaginationConfig.prevBtn)
		.setLabel("◀")
		.setStyle(ButtonStyle.Success),
	new ButtonBuilder()
		.setCustomId(PaginationConfig.nextBtn)
		.setLabel("▶")
		.setStyle(ButtonStyle.Success),
];

module.exports = { Pagination, PaginationConfig, PaginationButton };
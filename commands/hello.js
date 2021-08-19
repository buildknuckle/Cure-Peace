module.exports = {
	name: 'hello',
	description: 'Peace will say hello',
	executeMessage(message, args) {
		message.reply("hello!")
	},
};
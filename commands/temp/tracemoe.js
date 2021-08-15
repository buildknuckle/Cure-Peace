module.exports = {
	name: 'tracemoe',
	description: 'Tracemoe command',
	options:{
		description:"say hello"
	},
	execute(message, args) {
		message.reply("hello!")
	},
};
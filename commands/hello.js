module.exports = {
	name: 'hello',
	description: 'Peace will say hello',
	options:[
        {
            name: "peace",
			description: "Say hello to cure peace",
			type: 3
		}
	],
	executeMessage(message, args) {
	},
	async execute(interaction){
		await interaction.reply("hello!");
	}
};
const CardModules = require('../modules/Card');

module.exports = {
	name: 'help',
	description: 'Contain all available command',
	execute(message, args) {
		var objEmbed = {
            "title": "Help Command",
            "description": "Here are the command list that is available:",
            "color":CardModules.Properties.embedColor,
            "fields": [
              {
                "name": "General",
                "value": "`daily <color>`,`hello`,`leaderboard`,`myscore`,`peacescore`,`view`"
              },
              {
                "name": "Card",
                "value": "`catch`,`detail`,`status [username]`,`inventory [pack][username]`,`guess [lower/higher]`,`color set [color]`"
              }
            ]
          }
        message.channel.send({embed:objEmbed})
	},
};
const CardModules = require('../modules/Card');

module.exports = {
	name: 'help',
	description: 'Contain all available commands',
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
                "value": "`catch`,`detail`,`guide`,`status [username]`,`inventory [pack][username]`,`guess [lower/higher]`,`color set [color]`,`color up [color]`,`answer [a/b/c]`"
              },
              {
                "name": "Setting [Moderator]",
                "value": "`spawn <channelname> <minutes interval>`,`spawn remove`,`spawn cardcatcher <roleId>`,`spawn cardcatcher remove`"
              },
              {
                "name": "Cure Peace's Jankenpon",
                "value": "`leaderboard`, `myscore`, `peacescore`, `view`, `jankenpon <rock/paper/scissors>`" 
              },
            ]
          }
        message.channel.send({embed:objEmbed})
	},
};
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
                "value": "`daily [[quest] [submit] [card id]]/[color]`,`hello`,`leaderboard`,`myscore`,`peacescore`,`view`"
              },
              {
                "name": "Card",
                "value": "`catch/capture`,`detail <card id> [normal/gold]`,`guide`,`status [username]`,`inventory [pack][username]`,`duplicate [pack][username]`,`guess [lower/higher]`,`color set [color]`,`answer [a/b/c/d]`,`convert item <id> | convert level <id> <id target> | convert point <id> | convert mofucoin <id> | convert fraglevel <id>| convert fragpoint <id>`,`set/transform/precure <card id>`,`spawn`,`battle [special/charge]`,`avatar`,`up color <color>`,`up level <card id> [level qty]`,`up special <card id>`,`leaderboard <pack/color>`,`tradeboard search <card id>`,`tradeboard post <card id that you search/want> <your card id offer>`,`tradeboard trade <trade id>`,`tradeboard remove`,`verify`,`upgrade gold <card id>`,`party create <name>/status/join <party id>/list/leave/charge`"
              },
              {
                "name": "Item",
                "value": "`inventory [card/food/ingredient/fragment]`,`use <item id>`,`detail <item id>`,`shop/shop buy <item id> [qty]`"
              },
              {
                "name": "Pinky",
                "value": "`collet/inventory`,`catch`,`detail <pinky id>`"
              },
              {
                "name": "Party",
                "value": "`create <party name>`,`status`,`join <party id>`,`list`,`leave`,`charge`"
              },
              {
                "name": "Kirakira",
                "value": "`recipe`,`create/craft/synthesize <recipe id> [qty]`,`detail <recipe id>`"
              },
              {
                "name": "Setting [Moderator]",
                "value": "`spawn <channelname> <minutes interval>`,`spawn remove`,`spawn cardcatcher <roleId>`,`spawn cardcatcher remove`"
              },
              {
                "name": "Cure Peace's Jankenpon",
                "value": "`leaderboard`, `myscore`, `peacescore`, `view`, `jankenpon <rock/paper/scissors>`" 
              },
              {
                "name": "Anilist",
                "value": "`search <anime title>`, `whois/profile <character name> [from] [anime title]`, `staff <staff name>`" 
              },
            ]
          }
        message.channel.send({embed:objEmbed})
	},
};
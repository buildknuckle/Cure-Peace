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
                "value": "`detail <card id> [normal/gold]`\n`status [username]`\n`inventory [pack][username]`\n`duplicate [pack][username]`\n`color set [color]`\n`series set <series>`\n`set/transform/precure <card id>`\n`spawn`\n`special <card id>`\n`leaderboard <pack/color>`\n`trade <trade id>`,`remove`\n`verify`\n**party:**`create <name>/status/join <party id>/list/leave/charge`\n**tradeboard: **`search <card id> | post <card id that you search/want> <your card id offer>`\n**convert: **`point <cardid> [all/qty] | mofucoin <cardid> [all/qty] | item <cardid> | level <cardid> <card id target> [qty] | fraglevel <cardid> | fragpoint <fragment id>`\n**up/upgrade: **`color <color> | level <card id> [level qty] | gold <card id>`"
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
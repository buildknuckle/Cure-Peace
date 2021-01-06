const CardModule = require('../modules/Card');

module.exports = {
	name: 'card',
    description: 'Contain all card category',
    args: true,
	execute(message, args) {
        CardModule.getCardData(args,function getData(result){
            message.reply(result.name);
        });
        
        // if(ret){
        //     message.reply("sorry, I can't find that card ID");
        // } else {
        //     message.reply("founded!");
        // }
	},
};
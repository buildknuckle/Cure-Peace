const GEmbed = require("./Embed");
const embedColor = require("./Embed").color;
const imgSet = require("./Properties").imgSet;

async function userAvailable(userDiscord, username, interaction){//check if username is available on server/not
    if(username!=null){
        var memberExists = true;

        await interaction.guild.members.fetch({query:`${username}`,limit:1})
        .then(
            async members=> {
                if(members.size>=1){
                    userDiscord = {
                        id:members.first().user.id,
                        username:members.first().user.username,
                        avatarUrl:members.first().user.avatarURL()
                    }
                    
                } else {
                    memberExists = false;
                }
            }
        );

        if(!memberExists){
            await interaction.reply(GEmbed.errorMini(`:x: I can't find that username, please re-enter with specific nickname/username.`,userDiscord, true, {
                title:`Cannot find that user`,
                thumbnail:imgSet.mofu.error
            }));
            return false;
        }
    }

    return userDiscord;
}

// packNotFound(objUserData){
//     var packByColor = {pink:``,blue:``,yellow:``,purple:``,red:``,green:``,white:``};
//     for(var pack in CpackModule){
//         var series = CpackModule[pack].Properties.series;
//         packByColor[CpackModule[pack].Properties.color]+=`${SpackModule[series].Properties.icon.mascot_emoji} ${GlobalFunctions.capitalize(pack)}\n`;
//     }
    
//     return {embeds:[
//         GEmbed.builder(":x: I can't find that card pack. Here are the list for available card pack:", objUserData, {
//             color:GEmbed.color.danger,
//             fields:[
//                 {
//                     name:`${GProperties.emoji.color_pink} Pink:`,
//                     value:packByColor.pink,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_blue} Blue:`,
//                     value:packByColor.blue,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_yellow} Yellow:`,
//                     value:packByColor.yellow,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_purple} Purple:`,
//                     value:packByColor.purple,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_red} Red:`,
//                     value:packByColor.red,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_green} Green:`,
//                     value:packByColor.green,
//                     inline:true
//                 },
//                 {
//                     name:`${GProperties.emoji.color_white} White:`,
//                     value:packByColor.white,
//                     inline:true
//                 }
//             ]
//         })
//     ], ephemeral:true};
// },

// cardDataNotFound(objUserData){
//     return GEmbed.errorMini(`:x: I can't find that precure card.`, objUserData, true);
// },

// notOwnCard(objUserData){
//     return GEmbed.errorMini(`:x: You don't have this card yet.`, objUserData, true);
// }

module.exports = {
    userAvailable
}
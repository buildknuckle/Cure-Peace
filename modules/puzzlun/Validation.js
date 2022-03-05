const GlobalFunctions = require("../GlobalFunctions");
const GProperties = require("./Properties");
const Color = GProperties.color;
const {Character, CPack} = require("./data/Character");
const {Series, SPack} = require("./data/Series");
const Embed = require("./Embed");
const EmbedColor = Embed.color;
const imgSet = require("./Properties").imgSet;

class User {
    static async isAvailable(userDiscord, username, interaction){//check if username is available on server/not
        if(username!=null){
            var memberExists = true;
    
            await interaction.guild.members.fetch({query:`${username}`,limit:1})
            .then(
                async members=> {
                    if(members.size>=1){
                        userDiscord = members.first().user
                        
                    } else {
                        memberExists = false;
                    }
                }
            );
    
            if(!memberExists){
                await interaction.reply(Embed.errorMini(`:x: I can't find that username, please re-enter with specific nickname/username.`,userDiscord, true, {
                    title:`Cannot find that user`,
                    thumbnail:imgSet.mofu.error
                }));
                return false;
            }
        }
    
        return userDiscord;
    }

    static embedIsLogin(objUserData, guildId){
        var userId = objUserData.id;
        if(!GuildModule.Data.userLogin[guildId].includes(userId)){
            return Embed.errorMini(`Please login into server with: "**/daily check-in**" command.`,objUserData,true, {
                title:`❌ Not logged in yet!`
            });
        } else {
            return true;
        }
    }
}

class Pack {
    /**
     * @param {string} pack pack in string
     */
     static isAvailable(pack){
        return pack in CPack ? true:false;
    }

    static embedNotFound(userDiscord){
        var packByColor = {pink:``,blue:``,yellow:``,purple:``,red:``,green:``,white:``};
        for(var pack in CPack){
            var character = new Character(pack);
            var series = new Series(character.series);
    
            packByColor[character.color]+=`${series.emoji.mascot} ${GlobalFunctions.capitalize(pack)}\n`;
        }
        
        return {embeds:[
            Embed.builder(":x: I can't find that card pack. Here are the list for available card pack:", userDiscord, {
                color:EmbedColor.danger,
                fields:[
                    {
                        name:`${Color.pink.emoji} Pink:`,
                        value:packByColor.pink,
                        inline:true
                    },
                    {
                        name:`${Color.blue.emoji} Blue:`,
                        value:packByColor.blue,
                        inline:true
                    },
                    {
                        name:`${Color.yellow.emoji} Yellow:`,
                        value:packByColor.yellow,
                        inline:true
                    },
                    {
                        name:`${Color.purple.emoji} Purple:`,
                        value:packByColor.purple,
                        inline:true
                    },
                    {
                        name:`${Color.red.emoji} Red:`,
                        value:packByColor.red,
                        inline:true
                    },
                    {
                        name:`${Color.green.emoji} Green:`,
                        value:packByColor.green,
                        inline:true
                    },
                    {
                        name:`${Color.white.emoji} White:`,
                        value:packByColor.white,
                        inline:true
                    }
                ]
            })
        ], ephemeral:true};
    }

}

class Validation {
    static User = User;
    static Pack = Pack;
}

// cardDataNotFound(objUserData){
//     return GEmbed.errorMini(`:x: I can't find that precure card.`, objUserData, true);
// },

// notOwnCard(objUserData){
//     return GEmbed.errorMini(`:x: You don't have this card yet.`, objUserData, true);
// }



module.exports = Validation;
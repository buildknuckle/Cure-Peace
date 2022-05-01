const stripIndents = require('common-tags');
const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;
const paginationEmbed = require('../DiscordPagination');

const User = require("./data/User");
const Card = require("./data/Card");
const CardInventory = require("./data/CardInventory");
const {Shikishi, ShikishiInventory} = require("./data/Shikishi");
const {Series, SPack} = require("./data/Series");
const {Character, CPack} = require("./data/Character");
const Properties = require('./Properties');
const Listener = require("./data/Listener");

const Embed = require("./Embed");

class Validation extends require("./Validation") {
    
}

class ShikishiListener extends Listener {
    async inventory(){
        var parameterUsername = this.interaction.options.getString("username");
        var series = this.interaction.options.getString("series");
        var filter = this.interaction.options.getString("filter");

        // var duplicateOnly = filter=="duplicate" ? true:false;
        var isPrivate = parameterUsername==null? true:false;

        var userSearchResult = await Validation.User.isAvailable(this.discordUser, parameterUsername, this.interaction);
        if(!userSearchResult) return; else this.discordUser = userSearchResult;

        var userId = this.discordUser.id;
        var arrPages = [];

        var shikishiDataInventory = await ShikishiInventory.getShikishiInventoryData(userId, series, filter);
        // if(shikishiDataInventory==null){
        //     if(filter=="duplicate"){
        //         return this.interaction.reply(
        //             Embed.errorMini(`No duplicates shikishi are found.`, this.discordUser, true, {
        //                 title:`❌ No duplicates available`
        //             })
        //         );
        //     }
        // }

        var user = new User(await User.getData(userId));

        var total = {
            normal: shikishiDataInventory.shikishiInventoryData.filter(
                function (item) {
                    return item!=null&&item[ShikishiInventory.columns.id_user] != null;
                }
            ).length,
            duplicate: GlobalFunctions.sumObjectByKey(shikishiDataInventory.shikishiInventoryData.filter(
                function (item) {
                    return item!=null&&item[ShikishiInventory.columns.stock]>0;
                }
            ), ShikishiInventory.columns.stock)
        }

        var arrFields = [];
        var idx = 0; var maxIdx = 4; var txtInventory = ``;
        for(var i=0;i<shikishiDataInventory.shikishiData.length;i++){
            var shikishi = new ShikishiInventory(shikishiDataInventory.shikishiInventoryData[i], 
                shikishiDataInventory.shikishiData[i]);
            var stock = shikishi.stock;

            if(shikishi.isHaveShikishi()){
                txtInventory+=dedent(`${shikishi.Series.getMascotEmoji()} ${shikishi.getIdShikishi()} ${shikishi.getShikishiEmoji()}x${stock}
                ${shikishi.getName(0, true)}`)+`\n`;
                txtInventory+=`─────────────────\n`;
            } else {
                txtInventory+=dedent(`**???**
                ─────────────────`)+`\n`;
            }

            //check for max page content
            if(idx>=maxIdx||(idx<maxIdx && i==shikishiDataInventory.shikishiData.length-1)){
                let embed = 
                Embed.builder(dedent(`**Total:** ${total.normal}/${Shikishi.total} 
                **Duplicates:** ${total.duplicate}
                
                ${txtInventory}`)
                    ,this.discordUser,{
                    color:user.set_color,
                    title:`${shikishi.getShikishiEmoji()} Shikishi Inventory:`,
                    // thumbnail:icon,
                    // fields:arrFields
                })

                arrPages.push(embed);
                arrFields = []; txtInventory="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, isPrivate);

    }

}

module.exports = {
    ShikishiListener
}
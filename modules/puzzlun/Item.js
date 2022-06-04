const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const User = require("./data/User");
const {Item, ItemInventory} = require("./data/Item");
const Properties = require("./Properties");
const Color = Properties.color;
const Currency = Properties.currency;
const paginationEmbed = require('../../modules/DiscordPagination');
const Embed = require('./Embed');

class Listener extends require("./data/Listener") {

    static viewStyle = {
        compact:"compact",
        full:"full"
    }

    async inventory(){
        var category = this.interaction.options.getString("category")!==null? 
            [this.interaction.options.getString("category")]:null;
        var displayStyle = this.interaction.options.getString("display-style")!==null? 
            this.interaction.options.getString("display-style"):Listener.viewStyle.compact;

        var user = User.getData(this.userId);
        var itemInventoryData = await ItemInventory.getItemInventoryData(this.userId, category);
        if(itemInventoryData==null){
            return this.interaction.reply({
                embeds:[
                    Embed.builder(`${category==null? 
                        `You don't have any item yet.`:`No item were found on this category.`}`, 
                    this.discordUser, {
                        title:`❌ Item not available`,
                    })
                ],ephemeral:true
            });
        }
        
        var arrPages = [];
        var idx = 0; var maxIdx = 4; var txtList = ``;
        for(var i=0;i<itemInventoryData.length;i++){
            var item = new ItemInventory(itemInventoryData[i], itemInventoryData[i]);

            txtList+=dedent(`${item.getCategoryEmoji()} ${item.getIdItem()} x${item.stock}/${ItemInventory.limit.stock}
            ${item.getName()}`);
            txtList+=`\n`;
            if(displayStyle!==Listener.viewStyle.compact)
                txtList+=`${item.description}\n`;

            txtList+=`─────────────────\n`;
            
            //check for max page content
            if(idx>=maxIdx||(idx<maxIdx && i==itemInventoryData.length-1)){
                let embed = Embed.builder(dedent(`${txtList}`),
                    this.discordUser,{
                    title:`Item inventory`,
                })

                arrPages.push(embed);
                txtList="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, true);

    }
}

module.exports = {
    ItemListener: Listener
};
const dedent = require("dedent-js");
// const DB = require('../../database/DatabaseCore');
// const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const User = require("./data/User");
const {Item, ItemShop, ItemInventory} = require("./data/Item");
const Properties = require("./Properties");
// const Color = Properties.color;
const Currency = Properties.currency;
const paginationEmbed = require('../../modules/DiscordPagination');
const Embed = require('./Embed');

class Validation extends require('./Validation') {
    static itemNotAvailable(discordUser){
        return Embed.errorMini(`I cannot find that item on this shop.`, discordUser, true, {
            title:`❌ Item not available`
        });
    }

}

class MofuShop extends require("./data/Listener") {
    static itemData = {};
    static categoryListed = [
        ItemShop.category.ingredient_food.value,
        ItemShop.category.misc_fragment.value,
        ItemShop.category.gacha_ticket.value,
    ];
    
    async buy(){
        var keyword = this.interaction.options.getString("keyword");
        var qty = this.interaction.options.getInteger("qty")!==null?
            this.interaction.options.getInteger("qty"):1;
        var user = new User(await User.getData(this.userId));
        
        //validation: check if itemdata was listed/not
        //search by id
        var itemDataResult=null;
        if(keyword in MofuShop.itemData) {
            itemDataResult = MofuShop.itemData[keyword];
        } else if(!(keyword in MofuShop.itemData)) {
            //search by name
            var searchByName= Object.values(MofuShop.itemData).filter(
                function (item) {
                    return item[Item.columns.name].toLowerCase().includes(keyword.toLowerCase())||
                    item[Item.columns.keyword_search]!==null&&
                    item[Item.columns.keyword_search].toLowerCase().includes(keyword.toLowerCase());
                }
            )[0];

            if(searchByName!==undefined) itemDataResult=searchByName;
        }

        //search by id
        if(itemDataResult==null) return this.interaction.reply(Validation.itemNotAvailable(this.discordUser));

        //validation: check for currency
        var item = new ItemShop(itemDataResult);
        var cost = item.price*qty;
        var txtPrice= `**${item.getCurrencyEmoji()} ${cost} ${item.getCurrencyName()}**`;

        if(qty<=0||qty>=99){//validation: invalid amount
            return this.interaction.reply(
                Embed.errorMini(`Please enter valid amount between 1-99`, this.discordUser, true, {
                    title:`❌ Invalid amount`
                })
            );
        }

        //validation: check for price
        var itemCurrency = item.getCurrencyValue();
        if(!item.isPurchasable(user.Currency[itemCurrency], qty)){
            return this.interaction.reply(
                Embed.errorMini(`${txtPrice} are required to purchase: **${item.getCategoryEmoji()} ${item.getName()}**`, this.discordUser, true, {
                    title:`❌ Not enough ${item.getCurrencyName()}`
                })
            );
        }

        user.Currency[itemCurrency]-=cost;//update user currency
        await user.update();//update user data
        await ItemInventory.updateStock(this.userId, item.id_item, qty);//update user item

        return this.interaction.reply(
            Embed.successMini(dedent(`You have purchased: ${qty}x **${item.getCategoryEmoji()} ${item.getName()}**

            ${Properties.emoji.mofuheart} Thank you for the purchase mofu~`), 
            this.discordUser, true, {
                title:`🛒 Item purchased`,
            })
        );
    }

    async menu(){
        var user = new User(await User.getData(this.userId));
        var category = this.interaction.options.getString("category")!==null? 
            [this.interaction.options.getString("category")]:null;
        var result = await ItemShop.getItemShopData(category);

        var arrPages = [];
        var idx = 0; var maxIdx = 4; var txtList = ``;
        for(var i=0;i<result.length;i++){
            var item = new ItemShop(result[i]);
            var txtPrice = `${item.price} ${item.getCurrencyEmoji()}`;

            txtList+=dedent(`${item.getCategoryEmoji()} **[${item.id_item}]** ${item.getName()} 
            **Price:** ${txtPrice}
            ${item.description}
            ─────────────────`);
            txtList+=`\n`;
            
            //check for max page content
            if(idx>=maxIdx||(idx<maxIdx && i==result.length-1)){
                let embed = 
                Embed.builder(dedent(`You can purchase item with: **/item shop buy**
                **Your currency:**
                ${Currency.mofucoin.emoji} ${user.getCurrency("mofucoin")} / ${Currency.jewel.emoji} ${user.getCurrency("jewel")}

                __**Listed Items:**__
                ${txtList}`),
                    Embed.builderUser.authorCustom(`Mofu Shop`, Properties.imgSet.mofu.ok),{
                    title:`Welcome to Mofu Shop!`,
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

    //init item data that're listed & can be purchased
    static async initItemData(){
        var result = await ItemShop.getItemShopData(MofuShop.categoryListed);

        for(var i=0;i<result.length;i++){
            this.itemData[result[i][ItemShop.columns.id_item]] = result[i];
        }
        
    }
}

class Shop {
    static category = ItemShop.category;
    static MofuShop = MofuShop;
    // static Listener = Listener;

    static async init(){
        await MofuShop.initItemData();//init mofushop item data
    }
}

module.exports = Shop;
const dedent = require("dedent-js");
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../../modules/DiscordStyles');
const GlobalFunctions = require('../../modules/GlobalFunctions');
const capitalize = GlobalFunctions.capitalize;

const User = require("./data/User");
const {ItemShop, ItemInventory} = require("./data/Item");
const Properties = require("./Properties");
const Color = Properties.color;
const Currency = Properties.currency;
const paginationEmbed = require('../../modules/DiscordPagination');
const Embed = require('./Embed');

class MofuShop extends require("./data/Listener") {
    static itemData = {};
    static categoryListed = [
        ItemShop.category.ingredient_food.value,
        ItemShop.category.misc_fragment.value,
        ItemShop.category.gacha_ticket.value,
    ];
    
    async shopMenu(category=null) {
        if(category!==null) category = [category];
        var result = await ItemShop.getItemShopData(category);

        var arrPages = [];
        var idx = 0; var maxIdx = 4; var txtList = ``;
        for(var i=0;i<result.length;i++){
            var item = new ItemShop(result[i]);
            var txtPrice;
            //check for price
            if(item.price_mofucoin>0){
                txtPrice=`${item.price_mofucoin} ${Currency.mofucoin.emoji}`;
            } else {
                txtPrice=`${item.price_jewel} ${Currency.jewel.emoji}`;
            }

            txtList+=dedent(`${item.getCategoryEmoji()} **[${item.id_item}]** ${item.getName()} 
            **Price:** ${txtPrice}
            ${item.description}
            ─────────────────`);
            txtList+=`\n`;
            
            //check for max page content
            if(idx>maxIdx||(idx<maxIdx && i==result.length-1)){
                let embed = 
                Embed.builder(dedent(`You can purchase item with: **/item shop buy**

                **Item list:**
                ${txtList}`),
                    Embed.builderUser.authorCustom(`Mofu shop`, Properties.imgSet.mofu.ok),{
                    title:`Welcome to Mofu Shop!`,
                })

                arrPages.push(embed);
                txtList="";
                idx = 0;
            } else {
                idx++;
            }
        }

        return paginationEmbed(this.interaction,arrPages,DiscordStyles.Button.pagingButtonList, false);
        

        // var itemList = ""; var itemList2 = ""; var itemList3 = "";
        // var result = await DB.selectAll(DBM_Item_Data.TABLENAME);
        // result[0].forEach(item => {
        //     itemList += `**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`
        //     itemList2 += `${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
        //     itemList3 += `${item[DBM_Item_Data.columns.description]}\n`;
        // });

        // return {
        //     color: Properties.embedColor,
        //     author: {
        //         name: "Mofu shop",
        //         icon_url: "https://waa.ai/JEwn.png"
        //     },
        //     title: `Item Shop List:`,
        //     description: `Welcome to Mofushop! Here are the available item list that you can purchase:\nUse **p!card shop buy <item id> [qty]** to purchase the item.`,
        //     fields:[
        //         {
        //             name:`ID - Name:`,
        //             value:itemList,
        //             inline:true
        //         },
        //         {
        //             name:`Price (MC):`,
        //             value:itemList2,
        //             inline:true
        //         },
        //         {
        //             name:`Description`,
        //             value:itemList3,
        //             inline:true
        //         }
        //     ],
        // }
    }

    static async initItemData(){
        var result = await ItemShop.getItemShopData(MofuShop.categoryListed);

        for(var i=0;i<result.length;i++){
            this.itemData[result[i][ItemShop.columns.id_item]] = result[i];
        }
        
    }
}

// class Listener extends require("./data/Listener") {
//     constructor(userId=null, discordUser=null, interaction=null){
//         super(userId, discordUser, interaction);
//     }

    
// }

class Shop {
    static category = ItemShop.category;
    static MofuShop = MofuShop;
    // static Listener = Listener;

    static async init(){
        await MofuShop.initItemData()//init mofushop item data
    }
}

module.exports = Shop;
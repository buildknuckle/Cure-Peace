module.exports = class Shop {
    static async embedShopList() {
        var itemList = ""; var itemList2 = ""; var itemList3 = "";
        var result = await DB.selectAll(DBM_Item_Data.TABLENAME);
        result[0].forEach(item => {
            itemList += `**${item[DBM_Item_Data.columns.id]}** - ${item[DBM_Item_Data.columns.name]}\n`
            itemList2 += `${item[DBM_Item_Data.columns.price_mofucoin]}\n`;
            itemList3 += `${item[DBM_Item_Data.columns.description]}\n`;
        });

        return {
            color: Properties.embedColor,
            author: {
                name: "Mofu shop",
                icon_url: "https://waa.ai/JEwn.png"
            },
            title: `Item Shop List:`,
            description: `Welcome to Mofushop! Here are the available item list that you can purchase:\nUse **p!card shop buy <item id> [qty]** to purchase the item.`,
            fields:[
                {
                    name:`ID - Name:`,
                    value:itemList,
                    inline:true
                },
                {
                    name:`Price (MC):`,
                    value:itemList2,
                    inline:true
                },
                {
                    name:`Description`,
                    value:itemList3,
                    inline:true
                }
            ],
        }
    }
}
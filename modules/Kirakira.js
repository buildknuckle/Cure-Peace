const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_Kirakira_Recipe = require('../database/model/DBM_Kirakira_Recipe');

class Properties{
    static maxItem = 100;
    static embedColor = '#FBEBEC';
    static embedName = "Pekorin";

    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png",
        imgPekorin: "https://cdn.discordapp.com/attachments/793415946738860072/817355244068536340/latest.png"
    }
}

class Embeds{
    static synthesizeComplete(userUsername,userAvatarUrl,idItem,name,_description,imgUrl = ""){
        return {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail: {
                url:Properties.imgResponse.imgOk
            },
            title: "Kirakirarun!",
            description: `You have received: **${idItem} - ${name}** from creating the kirakira.`,
            image:{
                url:imgUrl
            },
            fields:[
                {
                    name:`Description:`,
                    value:_description,
                    inline:true
                }
            ]
        }
    }
}

async function getRecipeData(id_item) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Kirakira_Recipe.columns.id_item,id_item);
    var result = await DB.select(DBM_Kirakira_Recipe.TABLENAME,parameterWhere);
    return result[0][0];
}

module.exports = {Properties,Embeds,getRecipeData}
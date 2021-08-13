const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const GlobalFunctions = require('../modules/GlobalFunctions.js');
const DBM_Item_Inventory = require('../database/model/DBM_Item_Inventory');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');

class Properties{
    static maxItem = 250;
    static embedColor = '#efcc2c';

    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png"
    }

    static categoryData = {
        card:{
            value:"card",
            value_search:"card",
            name:"Card"
        },
        food:{
            value:"food",
            value_search:"food",
            name:"Food"
        },
        ingredient:{
            value:"ingredient",
            value_search:"ingredient",
            name:"Ingredient"
        },
        ingredient_rare:{
            value:"ingredient_rare",
            value_search:"ingredient",
            name:"Rare Ingredient"
        },
        misc_fragment:{
            value:"misc_fragment",
            value_search:"fragment",
            name:"Card Fragment",
        },
        misc_gardening:{
            value:"misc_gardening",
            value_search:"gardening",
            name:"Gardening",
        },
        misc_plant:{
            value:"misc_plant",
            value_search:"plant",
            name:"Plant",
        }
    }

    static saleData = {
        sale_token:"sale_token",
        last_date:"last_date",
        sale_list:"sale_list"
    }
}

class Embeds{
    static ItemDropReward(userUsername,userAvatarUrl,idItem,name,_description){
        return {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail: {
                url:Properties.imgResponse.imgOk
            },
            title: "Item Drop Reward:",
            description: `You have received: **${idItem} - ${name}**`,
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

async function getItemData(id_item) {
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Item_Data.columns.id,id_item);
    var result = await DB.select(DBM_Item_Data.TABLENAME,parameterWhere);
    return result[0][0];
}

async function getUserItemStock(id_user,id_item){
    //return the stock if existed
    var parameterWhere = new Map();
    parameterWhere.set(DBM_Item_Inventory.columns.id_user,id_user);
    parameterWhere.set(DBM_Item_Inventory.columns.id_item,id_item);
    var result = await DB.select(DBM_Item_Inventory.TABLENAME,parameterWhere);
    if(result[0][0]!=null){
        return result[0][0][DBM_Item_Inventory.columns.stock];
    } else {
        return -1;
    }
}

async function addNewItemInventory(id_user,id_item,addStock = 1){
    var maxStock = Properties.maxItem;
    var oldStock = await getUserItemStock(id_user,id_item);
    if(oldStock+addStock>=maxStock){
        addStock = 0;
    }

    if(oldStock<=-1){
        var parameterSet = new Map();
        parameterSet.set(DBM_Item_Inventory.columns.id_user,id_user);
        parameterSet.set(DBM_Item_Inventory.columns.id_item,id_item);
        if(addStock>1){
            parameterSet.set(DBM_Item_Inventory.columns.stock,addStock);
        }

        await DB.insert(DBM_Item_Inventory.TABLENAME,parameterSet);
    } else if(addStock>=1){
        //update the stock
        var query = `UPDATE ${DBM_Item_Inventory.TABLENAME} 
        SET ${DBM_Item_Inventory.columns.stock}=${DBM_Item_Inventory.columns.stock}+${addStock} 
        WHERE ${DBM_Item_Inventory.columns.id_user}=? AND 
        ${DBM_Item_Inventory.columns.id_item}=?`;
        await DBConn.conn.promise().query(query, [id_user,id_item]);
    }
}

async function updateItemStock(id_user,id_item,value){
    var maxItem = Properties.maxItem;
    var itemUserStatusData = await getUserItemStock(id_user,id_item);

    var queryStock = "";

    if(value>=1){
        //addition
        if(itemUserStatusData[DBM_Item_Inventory.columns.stock]+value>=maxItem){
            queryStock += ` ${DBM_Item_Inventory.columns.stock} = ${maxItem} `;
        } else {
            queryStock += ` ${DBM_Item_Inventory.columns.stock} = ${DBM_Item_Inventory.columns.stock}+${value} `;
        }
    } else {
        //substract
        if(itemUserStatusData[DBM_Item_Inventory.columns.stock]-value<=0){
            queryStock += ` ${DBM_Item_Inventory.columns.stock} = 0 `;
        } else {
            queryStock += ` ${DBM_Item_Inventory.columns.stock} = ${DBM_Item_Inventory.columns.stock}${value} `;
        }
    }

    var query = `UPDATE ${DBM_Item_Inventory.TABLENAME} 
    SET ${queryStock} 
    WHERE ${DBM_Item_Inventory.columns.id_user}=? AND 
    ${DBM_Item_Inventory.columns.id_item}=?`;

    await DBConn.conn.promise().query(query, [id_user,id_item]);
}

module.exports = {Properties,Embeds,getItemData,getUserItemStock,addNewItemInventory,updateItemStock}
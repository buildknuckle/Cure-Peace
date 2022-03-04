// module.exports = {
//     GlobalFunctions: require('../GlobalFunctions'),
//     DB: require('../../database/DatabaseCore'),
//     DBConn: require('../../storage/dbconn'),

//     //database modules
//     DBM_Birthday_Guild: require('../../database/model/DBM_Birthday_Guild'),
//     DBM_Birthday: require('../../database/model/DBM_Birthday'),
//     DBM_Card_Avatar: require('../../database/model/DBM_Card_Avatar'),
//     DBM_Card_Data: require('../../database/model/DBM_Card_Data'),
//     DBM_Card_Inventory: require('../../database/model/DBM_Card_Inventory'),
//     DBM_Card_Leaderboard: require('../../database/model/DBM_Card_Leaderboard'),
//     DBM_Card_Party: require('../../database/model/DBM_Card_Party'),
//     DBM_Card_User_Data: require('../../database/model/DBM_Card_User_Data'),
//     DBM_Enemy_Data: require('../../database/model/DBM_Enemy_Data'),
//     DBM_Guild_Data: require('../../database/model/DBM_Guild_Data'),
//     DBM_Item_Data: require('../../database/model/DBM_Item_Data'),
//     DBM_Item_Inventory: require('../../database/model/DBM_Item_Inventory'),
//     DBM_Kirakira_Recipe: require('../../database/model/DBM_Kirakira_Recipe'),
//     DBM_Pinky_Data: require('../../database/model/DBM_Pinky_Data'),
//     DBM_Pinky_Inventory: require('../../database/model/DBM_Pinky_Inventory'),
//     DBM_Tradeboard: require('../../database/model/DBM_Tradeboard'),
//     DBM_User_Data: require('../../database/model/DBM_User_Data'),

//     GProperties: require('./Properties'),
//     CPack: require('./Cpack'),
//     Series: require('./Series'),
//     Enpack: require('./Enpack')
// }

const Card = require("./Card");

function init(){
    //load card modules
    Card.init();
}

module.exports = {
    init
}
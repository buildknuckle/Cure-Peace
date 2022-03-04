// const DB = require('../../database/DatabaseCore');
// const DBConn = require('../../storage/dbconn');

// const DBM_Card_Avatar = require('../../database/model/DBM_Card_Avatar');
// const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
// const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
// const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

// const SpackModule = require("./Spack");
// const GProperties = require('./Properties');

module.exports = {
    Avatar:require('./data/Avatar'),
    Card:require('./data/Card'),
    CardInventory:require('./data/CardInventory'),
    User:require('./data/User'),
    Guild:require('./data/Guild')
}
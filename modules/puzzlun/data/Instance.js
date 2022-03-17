const dedent = require("dedent-js");
const paginationEmbed = require('../../../modules/DiscordPagination');
const GlobalFunctions = require('../../GlobalFunctions');
const emojify = GlobalFunctions.emojify;
const capitalize = GlobalFunctions.capitalize;
const DB = require('../../../database/DatabaseCore');
const DBConn = require('../../../storage/dbconn');
const DiscordStyles = require("../../DiscordStyles");
const DataCard = require('./Card');
const DataCardInventory = require('./CardInventory');
const DataUser = require('./User');
const {Series, SPack} = require('./Series');
const {Character, CPack} = require('./Character');
const {AvatarFormation: CardAvatar, PrecureAvatar} = require('./Avatar');

class InstanceBattle {
    userId = null;
    cardAvatar;
    mainAvatar = null;
    support1Avatar = null;
    support2Avatar = null;
    enemy = null;

    constructor(userId=null, cardAvatarData=null, cardInventoryData = {main:null, support1:null, support2:null}, 
        cardData = {main:null, support1:null, support2:null}, 
        enemy = null){
        if(userId!=null){
            this.userId = userId;
            this.cardAvatar = new CardAvatar(cardAvatarData);
            this.mainAvatar = new PrecureAvatar(CardAvatar.formation.main.value, cardInventoryData.main, cardData.main);

            if("support1" in cardInventoryData){
                this.support1Avatar = new PrecureAvatar(CardAvatar.formation.support1.value, cardInventoryData.support1, cardData.support1);
            }
            
            this.support2Avatar = new PrecureAvatar(CardAvatar.formation.support2.value, cardInventoryData.support2, cardData.support2);
        }
    }
}

module.exports = {
    InstanceBattle
}
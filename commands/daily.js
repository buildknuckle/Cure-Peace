const stripIndents = require("common-tags/lib/stripIndents")
const {MessageActionRow, MessageButton, MessageEmbed, Discord} = require('discord.js');
const DB = require('../database/DatabaseCore');
const DBConn = require('../storage/dbconn');
const DiscordStyles = require('../Modules/DiscordStyles');
const paginationEmbed = require('discordjs-button-pagination');

const GlobalFunctions = require('../modules/GlobalFunctions');
const CardModule = require("../modules/card/Card");
const UserModule = require("../modules/card/User");
const GuildModule = require("../modules/card/Guild");
const QuestModule = require("../modules/card/Quest");
const Properties = require("../modules/card/Properties");
const Embed = require("../modules/card/Embed");

const SpackModule = require("../modules/card/Spack");
const DBM_User_Data = require('../database/model/DBM_User_Data');
const DBM_Card_Inventory = require('../database/model/DBM_Card_Inventory');
const DBM_Card_Data = require('../database/model/DBM_Card_Data');

module.exports = {
	name: 'daily',
    cooldown: 5,
    description: 'Card daily commands',
    options:[
        {
            name: "check-in",
            description: "Check in for daily rewards.",
            type: 2, // 2 is type SUB_COMMAND_GROUP
            options: [
                {
                    name: "color",
                    description: "Check in for series & color point rewards",
                    type: 1, // 1 is type SUB_COMMAND
                    options: [
                        {
                            name: "selection",
                            description: "Select the color check-in rewards",
                            type: 3,
                            required: true,
                            choices: [
                                {
                                    name: "overall",
                                    value: "overall"
                                },
                                {
                                    name: "pink",
                                    value: "pink"
                                },
                                {
                                    name: "blue",
                                    value: "blue"
                                },
                                {
                                    name: "yellow",
                                    value: "yellow"
                                },
                                {
                                    name: "purple",
                                    value: "purple"
                                },
                                {
                                    name: "red",
                                    value: "red"
                                },
                                {
                                    name: "green",
                                    value: "green"
                                },
                                {
                                    name: "white",
                                    value: "white"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "quest",
            description: "Check in for daily quests",
            type: 2,
            options:[
                {
                    name: "list",
                    description: "Receive new quests/open the quests list",
                    type: 1,
                },
                {
                    name: "submit",
                    description: "Submit the card quests",
                    type: 1,
                    options: [
                        {
                            name: "card-id",
                            description: "Enter the card id",
                            type: 3,
                            required:true
                        }
                    ]
                },
            ]
        }
    ],
    async executeMessage(message, args) {
	},

    async execute(interaction){
        var command = interaction.options._group;
        var commandSubcommand = interaction.options._subcommand;
        const guildId = interaction.guild.id;

        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }
        var userId = objUserData.id;

        switch(command){
            case "quest":
                var questDate = GlobalFunctions.getCurrentDate();
                var userStatusData = await UserModule.getStatusData(objUserData.id);

                switch(commandSubcommand){
                    case "list":
                        var ret = await QuestModule.Card.generateQuest(objUserData,userStatusData);
                        await interaction.reply(ret);
                        break;
                    case "submit":
                        var idCardSubmit = interaction.options._hoistedOptions[0].value.toLowerCase();
                        var ret = await QuestModule.Card.submitQuest(objUserData, userStatusData, idCardSubmit);
                        return interaction.reply(ret);
                        break;
                }

                break;
            case "check-in":
                //update color point
                //validate & check if user have do the daily/not
                var checkInDate = GlobalFunctions.getCurrentDate();
                
                var userStatusData = await UserModule.getStatusData(userId);
                var idLogin = userStatusData[DBM_User_Data.columns.server_id_login];
                var optionsColor = interaction.options._hoistedOptions[0].value;
                var embedColor = `success`;//default for overall

                //init base point reward
                var colorPoint = GlobalFunctions.randomNumber(60,70);
                var mofucoin = GlobalFunctions.randomNumber(60,70);
                var seriesPoint = Math.round(colorPoint/2);

                var ownSeries = userStatusData[DBM_User_Data.columns.set_series];
                var parsedDailyData = JSON.parse(userStatusData[DBM_User_Data.columns.daily_data]);
                var lastCheckInDate = parsedDailyData[QuestModule.Properties.dataKey.lastCheckInDate];

                var txtBonus = ``; var isNewcomer = false;

                //check for newcomer (if user never checked in)
                if(userStatusData[DBM_User_Data.columns.server_id_login]==null){
                    //check if user have 10 cards/not
                    var query = `SELECT COUNT(*) as total FROM ${DBM_Card_Inventory.TABLENAME} WHERE ${DBM_User_Data.columns.id_user}=?`;
                    var res = await DBConn.conn.query(query,[userId]);
                    if(res[0]["total"]<=0){
                        isNewcomer = true;
                        //randomize 10 cards
                        var queryRandCard = `(SELECT * FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.rarity}=1 AND ${DBM_Card_Data.columns.is_spawnable}=1 
                        ORDER BY rand() LIMIT 4) UNION ALL
                        (SELECT * FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.rarity}=2 AND ${DBM_Card_Data.columns.is_spawnable}=1 
                        ORDER BY rand() LIMIT 3) UNION ALL 
                        (SELECT * FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.rarity}=3 AND ${DBM_Card_Data.columns.is_spawnable}=1 
                        ORDER BY rand() LIMIT 2) UNION ALL 
                        (SELECT * FROM ${DBM_Card_Data.TABLENAME} 
                        WHERE ${DBM_Card_Data.columns.rarity}=4 AND ${DBM_Card_Data.columns.is_spawnable}=1 
                        ORDER BY rand() LIMIT 1)`;

                        var rndCard = await DBConn.conn.query(queryRandCard,[]);
                        var arrInsert = [];
                        for(var i=0;i<rndCard.length;i++){
                            var idCard = rndCard[i][DBM_Card_Data.columns.id_card]; var color = rndCard[i][DBM_Card_Data.columns.color];
                            var img = rndCard[i][DBM_Card_Data.columns.img_url];
                            var name = GlobalFunctions.cutText(rndCard[i][DBM_Card_Data.columns.name],15);
                            var mapInsert = new Map();
                            mapInsert.set(DBM_Card_Inventory.columns.id_user, userId);
                            mapInsert.set(DBM_Card_Inventory.columns.id_card, idCard);
                            arrInsert.push(mapInsert);

                            txtBonus += `${Properties.color[color].icon_card} [${idCard}]: [${name}](${img})\n`;
                        }

                        await DB.insertMultiple(DBM_Card_Inventory.TABLENAME, arrInsert);
                    }
                }

                if(lastCheckInDate==checkInDate){
                    //get reset time
                    var midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    var timeRemaining = GlobalFunctions.getDateTimeDifference(midnight.getTime(),new Date().getTime());
                    timeRemaining = `${timeRemaining.hours} hours & ${timeRemaining.minutes} minutes`;

                    var description = `:x: You already logged in & received daily points for today.\nNext daily allowance in: **${timeRemaining}**.`;
                    var objError = Embed.errorMini(description,objUserData,true);

                    return interaction.reply(objError);
                }

                var txtRewards = ``;
                var mapColor = new Map();
                var mapSeries = new Map();
                
                var updateData = {};
                switch(optionsColor){
                    case "overall":
                        for(var color in Properties.color){
                            mapColor.set(Properties.color[color].value, {"point":colorPoint});
                        }

                        for(var series in SpackModule){
                            mapSeries.set(SpackModule[series].Properties.value,seriesPoint);
                        }

                        txtRewards = stripIndents`${Properties.emoji.mofucoin} ${mofucoin} mofucoin
                        ${Properties.emoji.mofuheart} ${colorPoint} overall color points
                        ${Properties.emoji.mofuheart} ${seriesPoint} overall series points`;
                        break;
                    default:
                        //specific
                        embedColor = Properties.color[optionsColor].value;
                        colorPoint*=2; seriesPoint*=2; mofucoin*=2;

                        mapColor.set(Properties.color[optionsColor].value,{"point":colorPoint});
                        mapSeries.set(userStatusData[DBM_User_Data.columns.set_series],seriesPoint);

                        txtRewards = stripIndents`${Properties.emoji.mofucoin} ${mofucoin} mofucoin ⏫
                        ${Properties.color[optionsColor].icon} ${colorPoint} ${optionsColor} points ⏫
                        ${SpackModule[ownSeries].Properties.icon.mascot_emoji} ${seriesPoint} ${SpackModule[ownSeries].Properties.currency.name} ⏫`;
                        break;
                }

                updateData[DBM_User_Data.columns.color_data] = mapColor;//update color points data
                updateData[DBM_User_Data.columns.series_data] = mapSeries;//update series points data
                
                var mapCurrency = new Map();
                mapCurrency.set(Properties.currency.mofucoin.value, mofucoin);
                updateData[DBM_User_Data.columns.currency_data] = mapCurrency;

                //process daily data
                parsedDailyData[QuestModule.Properties.dataKey.lastCheckInDate] = checkInDate;
                userStatusData[DBM_User_Data.columns.daily_data] = JSON.stringify(parsedDailyData);
                
                updateData[DBM_User_Data.columns.daily_data] = userStatusData[DBM_User_Data.columns.daily_data];

                //update server id & CheckIn date
                //replace old guild key
                if(idLogin!==null){
                    if(idLogin in GuildModule.Data.userLogin){
                        GuildModule.Data.userLogin[idLogin] = 
                        GlobalFunctions.removeArrayItem(GuildModule.Data.userLogin[idLogin],userId);
                    }
                    
                }
                GuildModule.Data.userLogin[guildId].push(userId);
                updateData[DBM_User_Data.columns.server_id_login] = guildId;

                await UserModule.updateData(userId, userStatusData, updateData);

                var notifEmbed;
                if(!isNewcomer){
                    notifEmbed = Embed.successBuilder(`<@${userId}> has successfully checked in for the daily!`,
                    objUserData,{
                        color:embedColor,
                        fields:[{
                            name:`Daily rewards:`,
                            value:txtRewards
                        }]
                    });
                    return interaction.reply({embeds:[notifEmbed]});
                } else {
                    var arrPages = [];
                    arrPages.push(Embed.successBuilder(
                        stripIndents`<@${userId}> has successfully checked in for first time!\n
                        As bonus for newcomer you have received 10 free starter cards:
                        ${txtBonus}
                        
                        *You can read more basic guide on next page.`
                    , objUserData,{
                        color:embedColor,
                        title:`Welcome to Puzzlun Peacecure!`,
                        fields:[{
                            name:`Daily rewards:`,
                            value:txtRewards
                        }]
                    }));

                    arrPages.push(Embed.builder(
                        stripIndents`**Basic command:**
                        >"**/daily**": claim daily rewards
                        >"**/card inventory**": See your card inventory 
                        >"**/card status**: See your puzlun status information 
                        More command can be seen with: "**/help**" command.
                        
                        **Leveling up your color level:**
                        Some card spawn such as normal card have different catch rate. To increase your catch rate you can level up your color level with: **/card up level** command.`
                    ,objUserData,{
                        title:`Basic Guide`,
                        color:embedColor
                    }));

                    paginationEmbed(interaction,arrPages,DiscordStyles.Button.pagingButtonList);
                }
                break;
        }
    },

    async executeComponentButton(interaction){
        var command = interaction.command;
        var customId = interaction.customId;
        const guildId = interaction.guild.id;

        var objUserData = {
            id:interaction.user.id,
            username:interaction.user.username,
            avatarUrl:interaction.user.avatarURL()
        }

        switch(customId){
            case "check-in":
                
                break;
        }
    }
}
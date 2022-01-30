const stripIndents = require("common-tags/lib/stripIndents")
const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord, User} = require('discord.js');
const DB = require('../../database/DatabaseCore');
const DBConn = require('../../storage/dbconn');
const DiscordStyles = require('../DiscordStyles');
const GlobalFunctions = require('../GlobalFunctions');
const paginationEmbed = require('discordjs-button-pagination');

const DBM_Card_Data = require('../../database/model/DBM_Card_Data');
const DBM_Card_Inventory = require('../../database/model/DBM_Card_Inventory');
const DBM_User_Data = require('../../database/model/DBM_User_Data');
const DBM_Guild_Data = require('../../database/model/DBM_Guild_Data');

const CpackModule = require("./Cpack");
const SpackModule = require("./Spack");
const UserModule = require("./User");
const GuildModule = require("./Guild");
const BattleModule = require("./Battle");

//initialize necessary properties
async function init() {
    //load total card for all pack
    var query = `select cd.${DBM_Card_Data.columns.pack}, count(cd.${DBM_Card_Data.columns.pack}) as total, 
        cd.${DBM_Card_Data.columns.color}, cd.${DBM_Card_Data.columns.series}
        from ${DBM_Card_Data.TABLENAME} cd
        group by cd.${DBM_Card_Data.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++)
        CpackModule[cardData[i][DBM_Card_Data.columns.pack]].Properties.total = cardData[i]["total"];
    
    //load available color for enemy
    var query = `select ${DBM_Card_Data.columns.color}, ${DBM_Card_Data.columns.series} 
    from ${DBM_Card_Data.TABLENAME} 
    group by ${DBM_Card_Data.columns.pack}`;
    var cardData = await DBConn.conn.query(query, []);
    for(var i=0;i<cardData.length;i++){
        SpackModule[cardData[i][DBM_Card_Data.columns.series]]
        .Enemy.data.tsunagarus.color.push(cardData[i][DBM_Card_Data.columns.color]);
    }

    //init yes 5 gogo data
    await SpackModule.yes5gogo.init();
}

const Properties = require('./Properties');

const GEmbed = require('./Embed');

class Embed {
    static notifNotEnoughBoostPoint(boostCost, objUserData){
        return GEmbed.failMini(`:x: you need **${boostCost} peace point** to use the boost capture.`, objUserData)
    }

    static notifNewCard(objUserData, cardData, qtyReceive, 
        colorPoint, seriesPoint, total, options = {}){
        //user data:
        var userId = objUserData.id;
        var username = objUserData.username;
        var userAvatar = objUserData.avatarUrl;

        //card data
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var name = cardData[DBM_Card_Data.columns.name];
        var img = cardData[DBM_Card_Data.columns.img_url]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series;
        var packTotal = CpackModule[pack].Properties.total;

        return GEmbed.successBuilder(stripIndents`${"notifFront" in options? options.notifFront:""}
        <@${userId}> has received new ${pack} card!\n
        **Rewards:**
        ${Properties.color[color].icon_card} ${qtyReceive}x new card: ${id} ${qtyReceive>1?" ⏫":""}
        ${Properties.color[color].icon} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}
        ${SpackModule[series].Properties.currency.icon_emoji} ${seriesPoint} ${SpackModule[series].Properties.currency.name} ${seriesPoint>rarity?" ⏫":""}${"rewards" in options ? "\n"+options.rewards : ""}
        ${"notifBack" in options? options.notifBack:""}\n`, {
            username:`${rarity.toString()}⭐ ${GlobalFunctions.capitalize(pack)} Card`,
            avatarUrl: CpackModule[pack].Properties.icon
        }, {
        color: color,
        title: name.toString(),
        fields:[{
            name:`ID:`,
            value:`${id.toString()}`,
            inline:true
        },{
            name:`Series:`,
            value:`${GlobalFunctions.capitalize(SpackModule[series].Properties.name)}`,
            inline:true
        }],
        image: img,
        footer: {
            text: `Captured by: ${username} (${total}/${packTotal})`,
            icon_url: userAvatar
        }});
    }

    static notifDuplicateCard(objUserData, cardData, qtyReceive, 
        colorPoint, seriesPoint, updatedStock, options = {}){
        //user data:
        var userId = objUserData.id;

        //card data
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var series = CpackModule[pack].Properties.series; 
        var name = cardData[DBM_Card_Data.columns.name]; var img = cardData[DBM_Card_Data.columns.img_url]; 
        var color = CpackModule[pack].Properties.color;

        return GEmbed.builder(`${"notifFront" in options? options.notifFront:""}\n<@${userId}> has received another ${pack} card: **${id}**.${"notifBack" in options? options.notifBack:""}`, objUserData, {
            color: color,
            title: `Duplicate Card`,
            thumbnail:img,
            fields:[
            {
                name:`Rewards Received:`,
                value:stripIndents`${Properties.color[color].icon_card} **${qtyReceive}x dup card:** ${id} - ${name}${qtyReceive>1?" ⏫":""}
                ${Properties.color[color].icon} ${colorPoint} ${color} points ${colorPoint>rarity?" ⏫":""}
                ${SpackModule[series].Properties.currency.icon_emoji} ${seriesPoint} ${SpackModule[series].Properties.currency.name} ${seriesPoint>rarity?" ⏫":""}${"rewards" in options ? "\n"+options.rewards : ""}`,
                inline:false
            }],
            footer: {
                text: `Stock: ${updatedStock}/${UserModule.Properties.limit.card}`
        }});
    }

    static notifFailCatch(objUserData, cardData, options={}){
        //user data:
        var userId = objUserData.id;

        //card data
        var rarity = cardData[DBM_Card_Data.columns.rarity]; var pack = cardData[DBM_Card_Data.columns.pack]; 
        var color = CpackModule[pack].Properties.color; var series = CpackModule[pack].Properties.series;

        var builder = GEmbed.failMini(`${"notifFront" in options? options.notifFront:""}\n:x: <@${userId}> has failed to catch the card this time.\n${"notifBack" in options? options.notifBack:""}\n`, objUserData, {
        fields:[{
            name:`Received:`,
            value:stripIndents`${Properties.color[color].icon} ${rarity} ${color} points
            ${SpackModule[series].Properties.currency.icon_emoji} ${rarity} ${SpackModule[series].Properties.currency.name}`,
            inline:true
        }]});
        if("title" in options)
            obuilder.fields[0].title = options.title;
        
        return builder;
    }
}

class Spawner {
    static arrSeriesRandomizer = [SpackModule.max_heart.Properties.value,SpackModule.splash_star.Properties.value,SpackModule.yes5gogo.Properties.value, SpackModule.fresh.Properties.value, SpackModule.heartcatch.Properties.value, SpackModule.suite.Properties.value,
        SpackModule.smile.Properties.value, SpackModule.dokidoki.Properties.value, SpackModule.happiness_charge.Properties.value,
        SpackModule.go_princess.Properties.value, SpackModule.mahou_tsukai.Properties.value, SpackModule.kirakira.Properties.value,
        SpackModule.hugtto.Properties.value,SpackModule.star_twinkle.Properties.value, SpackModule.healin_good.Properties.value,
        SpackModule.tropical_rouge.Properties.value];
    
    static spawnDataType = {
        normal:{
            value:"normal",
            name:"normal",
            dataKey:{
                spawnId: "spawnId",
                type: "type",
                spawnSubId: "spawnSubId"//for special spawn such as pinky
            }
        },
        act:{
            value:"act",
            name:"act",
            dataKey:{
                spawnId : "spawnId",
                type: "type",
                value:"value",
                typeVal: {
                    jankenpon:"jankenpon",
                    mini_tsunagarus:"mini_tsunagarus",
                    suite_notes_count:"suite_notes_count",
                    star_twinkle_constellation:"star_twinkle_constellation",
                    star_twinkle_counting:"star_twinkle_counting"
                },  
            }
        },//act (activities)
        quiz:{
            value:"quiz",
            name:"quiz",
            dataKey:{
                spawnId : "spawnId",
                value:"value"
            }
        },
        number:{
            value:"number",
            name:"number",
            dataKey:{
                spawnId:"spawnId",
                number:"number"
            }
        },
        color:{
            value:"color",
            name:"color",
            dataKey:{
                rarity:"rarity",
                bonus_color:"bonus_color"
            }
        },
        series:{
            value:"series",
            name:"series",
            dataKey:{
                rarity:"rarity",
                bonus_series:"bonus_series"
            }
        },
        cure:{
            value:"cure",
            name:"cure",
            dataKey:{
                rarity:"rarity",
                bonus_color:"bonus_color",
                bonus_series:"bonus_series",
            }
        },
    }

    static spawnDataKey = {
        cure: {
            rarity:"rarity",
            bonus_color:"bonus_color",
            bonus_series:"bonus_series",
        }
    }

    static objEmbed = new MessageEmbed();

    static rate_catch = {
        normal:{
            1:80,
            2:70
        },
        color:{
            4:50,
            5:40
        },
        series:{
            4:60,
            5:50
        },
        grand:{
            4:30,
            5:20
        }
    }

    static bonusRateCatch = {
        color:{
            4:20,
            5:20
        },
        series:{
            4:20,
            5:10
        },
        grand:{
            4:40,
            5:40
        }
    }
    
    static boosterCost = {
        normal:{
            1:1,
            2:2,
        },
        number:{
            3:3,
            4:4
        },
        color:{
            4:4,
            5:5,
        },
        series:{
            4:4,
            5:5,
        },
        grand:{
            4:5,
            5:5,
        }
    }

    static cardSpawnType = this.spawnDataType.normal.value;//init default spawn type
    
    static async spawnNormal(guildId){
        //spawn normal card
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity,2);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging
        
        var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere);
        resultData = resultData[0];

        var id = resultData[DBM_Card_Data.columns.id_card]; var pack = resultData[DBM_Card_Data.columns.pack];
        var name = resultData[DBM_Card_Data.columns.name]; var img = resultData[DBM_Card_Data.columns.img_url];
        var color = CpackModule[pack].Properties.color; var series = CpackModule[pack].Properties.series;
        
        var rarity = resultData[DBM_Card_Data.columns.rarity];

        var objEmbed = GEmbed.builder(`**Normal Precure card has spawned!**`,{
            username:`${rarity}⭐ ${GlobalFunctions.capitalize(pack)} Card`,
            avatarUrl: CpackModule[pack].Properties.icon
        },{
            color: GEmbed.color[color],
            title:`${name.toString()}`,
            fields: [
                {
                    name:"Card Capture Command:",
                    value:`${Properties.emoji.mofuheart} Press ✨ **Catch!** to capture this card\n${UserModule.Properties.peacePoint.icon} Press 🆙 **Boost** to boost capture with ${this.boosterCost.normal[rarity]} peace point`
                }
            ],
            image:img,
            footer:{
                text:`${SpackModule[series].Properties.name} Card (${id}) | ✔️ Base Catch Rate: ${this.rate_catch.normal[rarity]}%`
            }
        });

        //start update
        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type,this.spawnDataType.normal.value);
        mapSet.set(DBM_Guild_Data.columns.spawn_data,`{"${Spawner.spawnDataType.normal.dataKey.spawnId}":"${id}"}`);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId.toString());
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await({embeds:[objEmbed], components: [DiscordStyles.Button.row([
            DiscordStyles.Button.base("card.catch_normal","✨ Catch!","PRIMARY"),
            DiscordStyles.Button.base("card.catch_boost","🆙 Boost","PRIMARY"),
        ])]});
    }

    static async spawnActivity(guildId){
        var rnd = GlobalFunctions.randomNumber(1,100);
        var spawn = "";

        if(rnd<=10){//5* smile jankenpon
            spawn = this.spawnDataType.act.dataKey.typeVal.jankenpon;
        } else if(rnd<=30){//3* mini tsunagarus
            spawn = this.spawnDataType.act.dataKey.typeVal.mini_tsunagarus;
        } else {//suite notes counting/star twinkle constellation/star twinkle counting
            var rnd = GlobalFunctions.randomNumber(0,2);
            switch(rnd){
                case 0:
                    spawn = this.spawnDataType.act.dataKey.typeVal.suite_notes_count;
                    break;
                case 1:
                    spawn = this.spawnDataType.act.dataKey.typeVal.star_twinkle_constellation;
                    break;
                case 2:
                default:
                    spawn = this.spawnDataType.act.dataKey.typeVal.star_twinkle_counting;
                    break;
            }
        }

        spawn = this.spawnDataType.act.dataKey.typeVal.star_twinkle_counting; // debugging purpose

        var mapSet = new Map(); var objEmbed = new MessageEmbed();
        var arrComponents = [];

        switch(spawn){
            case this.spawnDataType.act.dataKey.typeVal.jankenpon:
                //randomize smile card
                var mapWhere = new Map();
                mapWhere.set(DBM_Card_Data.columns.rarity,5);
                mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
                mapWhere.set(DBM_Card_Data.columns.series,SpackModule.smile.Properties.value);

                var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere);
                resultData = resultData[0];
                
                //card data:
                var id = resultData[DBM_Card_Data.columns.id_card];
                var series = resultData[DBM_Card_Data.columns.series];
                var rarity = resultData[DBM_Card_Data.columns.rarity];

                //start update
                mapSet.set(DBM_Guild_Data.columns.spawn_type, this.spawnDataType.act.value);
                mapSet.set(DBM_Guild_Data.columns.spawn_data, `{"${this.spawnDataType.act.dataKey.type}":"${this.spawnDataType.act.dataKey.typeVal.jankenpon}","${this.spawnDataType.act.dataKey.spawnId}":"${id}"}`);

                objEmbed = GEmbed.builder(`Play & win the jankenpon round from Peace!`,{username:`${rarity}⭐ Act Spawn: Smile Jankenpon`},{
                    thumbnail:CpackModule.yayoi.Properties.icon,
                    image:`https://cdn.discordapp.com/attachments/793415946738860072/936272483286413332/peace_jankenpon.gif`,
                    title:`${SpackModule.smile.Properties.icon.mascot_emoji} It's Jankenpon Time!`,
                    fields:[
                        {
                            name:"Jankenpon Command:",
                            value:`Press 🪨 to pick rock\nPress 📜 to pick paper\nPress ✂️ to pick scissors`
                        },
                    ]
                });

                arrComponents = [
                    new MessageActionRow()
                    .addComponents(
                        DiscordStyles.Button.base("card.jankenpon_rock","🪨 Rock")
                    )
                    .addComponents(
                        DiscordStyles.Button.base("card.jankenpon_paper","📜 Paper")
                    )
                    .addComponents(
                        DiscordStyles.Button.base("card.jankenpon_scissors","✂️ Scissors")
                    ),
                ];
                break;
            case this.spawnDataType.act.dataKey.typeVal.mini_tsunagarus:
                //mini tsunagarus
                var rarity = 3;
                var mapWhere = new Map();
                mapWhere.set(DBM_Card_Data.columns.rarity,rarity);
                mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
                var resultData = await DB.selectRandomNonDuplicate(DBM_Card_Data.TABLENAME, mapWhere, DBM_Card_Data.columns.pack, 4);
                
                //card data:
                var randIdReward = resultData[GlobalFunctions.randomNumber(0,resultData.length-1)][DBM_Card_Data.columns.id_card];
                var id = resultData[0][DBM_Card_Data.columns.id_card];
                var pack = resultData[0][DBM_Card_Data.columns.pack];
                var arrAnswerList = []; //prepare the answer list

                var splittedText = CpackModule[pack].Properties.fullname.split(" ");
                var shuffleName = "";
                for(var i=0;i<splittedText.length;i++)
                shuffleName += `${GlobalFunctions.shuffleText(
                        GlobalFunctions.shuffleText(
                            GlobalFunctions.shuffleText(splittedText[i])).replace(" ",""))}`.toLowerCase();
                
                for(var i=0;i<resultData.length;i++){
                    var pack = resultData[i][DBM_Card_Data.columns.pack];
                    var series = SpackModule[resultData[i][DBM_Card_Data.columns.series]].Properties.name;

                    arrAnswerList.push(`${series} - ${GlobalFunctions.capitalize(CpackModule[pack].Properties.color)} Cure`);
                }

                var tempAnswer = arrAnswerList[0];

                // //shuffle the answer
                arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                // //get the answer
                var answer = arrAnswerList.indexOf(tempAnswer);
                switch(answer){
                    case 0: answer = "a"; break;
                    case 1: answer = "b"; break;
                    case 2: answer = "c"; break;
                    case 3: answer = "d"; break;
                }

                //prepare select menu
                var arrOptions = [];
                for(var i=0;i<arrAnswerList.length;i++){
                    arrOptions.push({
                        label: `${arrAnswerList[i].toString()}`,
                        description: `Answers with: ${arrAnswerList[i]}`
                    });
                    switch(i){
                        case 0: arrOptions[i].value = "a"; break;
                        case 1: arrOptions[i].value = "b"; break;
                        case 2: arrOptions[i].value = "c"; break;
                        case 3: arrOptions[i].value = "d"; break;
                    }
                }

                arrComponents = [
                    DiscordStyles.SelectMenus.basic("card.act_mini_tsunagarus","Select the answers",arrOptions)
                ];
                // //select menu end
    
                mapSet.set(DBM_Guild_Data.columns.spawn_data,
                `{"${this.spawnDataType.act.dataKey.type}":"${this.spawnDataType.act.dataKey.typeVal.mini_tsunagarus}","${this.spawnDataType.act.dataKey.value}":"${answer}","${this.spawnDataType.act.dataKey.spawnId}":"${randIdReward}"}`);

                objEmbed = GEmbed.builder(`**Chiridjirin** has taking over the quiz time!\nRearrange this provided hint: **${shuffleName}** and choose the correct branch to defeat the tsunagarus!`,{username:`${rarity}⭐ Act Spawn: Quiztaccked!`},{
                    color:`#CC3060`,
                    thumbnail:Properties.imgMofu.panic,
                    image:`https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png`
                });

                break;
            case this.spawnDataType.act.dataKey.typeVal.suite_notes_count:
                //suite notes counting
                var total = 0;//init default

                var objNotes = [
                    {icon:"🎶",sign: "+",value:GlobalFunctions.randomNumber(5,10)},
                    {icon:"🎵",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(2,7)},
                    {icon:"🎹",sign: "+",value:GlobalFunctions.randomNumber(3,7)},
                    {icon:"🎸",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(5,7)},
                    {icon:"🎺",sign: GlobalFunctions.randomNumber(0,1)<=0?"+":"-",value:GlobalFunctions.randomNumber(3,7)},
                ];

                var positiveNotes = objNotes.filter(function(notes) {
                    return notes.sign === '+';
                });

                var txtDescription = `🎶${objNotes[0].sign}${objNotes[0].value} / 🎵${objNotes[1].sign}${objNotes[1].value} / 🎹${objNotes[2].sign}${objNotes[2].value} / 🎸${objNotes[3].sign}${objNotes[3].value} / 🎺${objNotes[4].sign}${objNotes[4].value}\n`;

                //generate notes
                var txtField=`🎶`;
                total = objNotes[0].value;//init first note number

                for(var i=0;i<4;i++){
                    var rndKey = GlobalFunctions.randomNumber(0,Object.keys(objNotes).length-1);
                    if(objNotes[rndKey].sign=="-" && total-objNotes[rndKey].value<=0){
                        //switch to positive & random with positive notes
                        var rndKey = GlobalFunctions.randomNumber(0,Object.keys(positiveNotes).length-1);
                        total+=positiveNotes[rndKey].value;
                        txtField+=`${positiveNotes[rndKey].icon}`;
                    } else {
                        objNotes[rndKey].sign=="+" ? total+=objNotes[rndKey].value : total-=objNotes[rndKey].value;
                        txtField+=`${objNotes[rndKey].icon}`;
                    }
                }

                var arrAnswerList = GlobalFunctions.shuffleArray([total,GlobalFunctions.randomNumber(total-3,total-4),GlobalFunctions.randomNumber(total-1,total-2),GlobalFunctions.randomNumber(total+1,total+2)]);

                // arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                answer = arrAnswerList.indexOf(total);

                var arrOptions = [];
                for(var i=0;i<arrAnswerList.length;i++){
                    arrOptions.push({
                        label: `${arrAnswerList[i].toString()}`,
                        description: `Answer with ${arrAnswerList[i]} notes`
                    });
                    switch(i){
                        case 0: arrOptions[i].value = "a"; break;
                        case 1: arrOptions[i].value = "b"; break;
                        case 2: arrOptions[i].value = "c"; break;
                        case 3: arrOptions[i].value = "d"; break;
                        case 4: arrOptions[i].value = "e"; break;
                    }
                }

                arrComponents = [
                    DiscordStyles.SelectMenus.basic("card.act_suite_notes_count","Select the answers",arrOptions)
                ];

                switch(answer){
                    case 0:
                        answer = "a";
                        break;
                    case 1:
                        answer = "b";
                        break;
                    case 2:
                        answer = "c";
                        break;
                    case 3:
                        answer = "d";
                        break;
                }

                //randomize 2* card
                var mapWhere = new Map();
                mapWhere.set(DBM_Card_Data.columns.rarity,2);
                mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
                mapWhere.set(DBM_Card_Data.columns.series,SpackModule.suite.Properties.value);

                var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere);
                resultData = resultData[0];

                //card data:
                var id = resultData[DBM_Card_Data.columns.id_card];
                var series = resultData[DBM_Card_Data.columns.series];
                var rarity = resultData[DBM_Card_Data.columns.rarity];

                mapSet.set(DBM_Guild_Data.columns.spawn_data,
                `{"${this.spawnDataType.act.dataKey.type}":"${this.spawnDataType.act.dataKey.typeVal.suite_notes_count}","${this.spawnDataType.act.dataKey.value}":"${answer}","${this.spawnDataType.act.dataKey.spawnId}":"${id}"}`);
                    
                //Embed:
                objEmbed = GEmbed.builder(`Count how many generated notes on this spawn:\n${txtDescription}`,
                {username:`${rarity}⭐ Act Spawn: Suite Notes Counting`},{
                    title:`${SpackModule.suite.Properties.icon.mascot_emoji} It's Suite Notes Counting Time!`,
                    thumbnail:SpackModule.suite.FairyTones.dataFairy[
                        GlobalFunctions.randomPropertyKey(SpackModule.suite.FairyTones.dataFairy)].img,
                    image:Properties.imgMofu.peek,
                    fields:[{
                        name:"Generated Notes:",
                        value:txtField
                    }]
                });

                break;
            case this.spawnDataType.act.dataKey.typeVal.star_twinkle_constellation:
                //star twinkle constellation
                var randObj = GlobalFunctions.randomProperty(SpackModule.star_twinkle.Properties.fuwaConstellation);
                var answer = randObj.name; var randomImg = randObj.img_url[0];
                var arrAnswerList = [];
                arrAnswerList.push(randObj.name);
                for(var i=0;i<=2;i++){
                    var tempAnswer = GlobalFunctions.randomProperty(SpackModule.star_twinkle.Properties.fuwaConstellation);
                    if(arrAnswerList.includes(tempAnswer.name)){
                        i-=1;
                    } else {
                        arrAnswerList.push(tempAnswer.name);
                    }
                }

                arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
                arrAnswerList = arrAnswerList.sort((a, b) => a - b); // For ascending sort
                answer = arrAnswerList.indexOf(answer);

                //select menu start
                var arrOptions = [];
                for(var i=0;i<arrAnswerList.length;i++){
                    arrOptions.push({
                        label: `${arrAnswerList[i].toString()}`,
                        description: `Answers with: ${arrAnswerList[i]}`
                    });
                    switch(i){
                        case 0: arrOptions[i].value = "a"; break;
                        case 1: arrOptions[i].value = "b"; break;
                        case 2: arrOptions[i].value = "c"; break;
                        case 3: arrOptions[i].value = "d"; break;
                    }
                }

                arrComponents = [
                    DiscordStyles.SelectMenus.basic("card.act_star_twinkle_constellation","Select the answers",arrOptions)
                ];
                //select menu end

                switch(answer){
                    case 0: answer = "a"; break;
                    case 1: answer = "b"; break;
                    case 2: answer = "c"; break;
                    case 3: answer = "d"; break;
                }

                //randomize 2* card
                var mapWhere = new Map();
                mapWhere.set(DBM_Card_Data.columns.rarity,2);
                mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
                mapWhere.set(DBM_Card_Data.columns.series,SpackModule.star_twinkle.Properties.value);

                var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere);
                resultData = resultData[0];

                //card data:
                var id = resultData[DBM_Card_Data.columns.id_card];
                var series = resultData[DBM_Card_Data.columns.series];
                var rarity = resultData[DBM_Card_Data.columns.rarity];

                mapSet.set(DBM_Guild_Data.columns.spawn_data,
                `{"${this.spawnDataType.act.dataKey.type}":"${this.spawnDataType.act.dataKey.typeVal.star_twinkle_constellation}","${this.spawnDataType.act.dataKey.value}":"${answer}","${this.spawnDataType.act.dataKey.spawnId}":"${id}"}`);

                objEmbed = GEmbed.builder(`Choose the correct fuwa constellation from this costume:`,
                {username:`${rarity}⭐ Act Spawn: Star Twinkle Constellation`},{
                    title:`${SpackModule.star_twinkle.Properties.icon.mascot_emoji} It's Star Twinkle Constellation Time!`,
                    thumbnail:Properties.imgMofu.peek,
                    image:randomImg,
                    // fields: [{
                    //     name:`Image Link`,
                    //     value:`[Image Link](${randomImg})`,
                    //     inline:true
                    // }]
                });

                break;
            case this.spawnDataType.act.dataKey.typeVal.star_twinkle_counting:
                //count star twinkle
                var txtStar = ""; var totalStars = 0;
                for(var i=0;i<5;i++){
                    var twinkleRandom = GlobalFunctions.randomNumber(2,10);
                    totalStars+=twinkleRandom;
                    for(var j=0;j<twinkleRandom;j++){
                        txtStar += `⭐`;
                    }
                    txtStar += `\n`;
                }

                var arrAnswerList = [totalStars,totalStars+1,totalStars+2,totalStars+3];
                arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);

                var answer = arrAnswerList.indexOf(totalStars);

                var arrOptions = [];
                for(var i=0;i<arrAnswerList.length;i++){
                    arrOptions.push({
                        label: `${arrAnswerList[i].toString()} ⭐`,
                        description: `Answers with ${arrAnswerList[i]} ⭐`
                    });
                    switch(i){
                        case 0: arrOptions[i].value = "a"; break;
                        case 1: arrOptions[i].value = "b"; break;
                        case 2: arrOptions[i].value = "c"; break;
                        case 3: arrOptions[i].value = "d"; break;
                    }
                }

                arrComponents = [
                    DiscordStyles.SelectMenus.basic("card.act_star_twinkle_counting","Select the answers",arrOptions)
                ];

                switch(answer){
                    case 0: answer = "a"; break;
                    case 1: answer = "b"; break;
                    case 2: answer = "c"; break;
                    case 3: answer = "d"; break;
                }

                //randomize 2* card
                var mapWhere = new Map();
                mapWhere.set(DBM_Card_Data.columns.rarity,2);
                mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
                mapWhere.set(DBM_Card_Data.columns.series,SpackModule.star_twinkle.Properties.value);

                var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere);
                resultData = resultData[0];

                //card data:
                var id = resultData[DBM_Card_Data.columns.id_card];
                var series = resultData[DBM_Card_Data.columns.series];
                var rarity = resultData[DBM_Card_Data.columns.rarity];

                mapSet.set(DBM_Guild_Data.columns.spawn_data,
                `{"${this.spawnDataType.act.dataKey.type}":"${this.spawnDataType.act.dataKey.typeVal.star_twinkle_counting}","${this.spawnDataType.act.dataKey.value}":"${answer}","${this.spawnDataType.act.dataKey.spawnId}":"${id}"}`);

                objEmbed = new MessageEmbed({
                    color:GEmbed.color.yellow,
                    author: {
                        name:`2⭐ Act Spawn: Star Twinkle Counting`,
                    },
                    title: `${Properties.emoji.m14_fuwa} It's Star Twinkle Counting Time!`,
                    description: `How many stars on this spawn:\n${txtStar}`,
                    image: {
                        url:`https://waa.ai/JEyE.png`
                    },
                    thumbnail: {
                        url:"https://static.wikia.nocookie.net/prettycure/images/5/51/STPC01_The_Fuwa_Constellation.jpg"
                    }
                });
                break;
        }

        mapSet.set(DBM_Guild_Data.columns.spawn_type,this.spawnDataType.act.value);//randomize spawn token
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));//randomize spawn token

        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId);
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: arrComponents};

    }

    static async spawnNumber(guildId){
        //spawn number card
        var rarity = GlobalFunctions.randomNumber(3,4);
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity,rarity);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable,1);
        // mapWhere.set(DBM_Card_Data.columns.pack,"megumi");//only for debugging
        
        var resultData = await DB.selectRandom(DBM_Card_Data.TABLENAME,mapWhere); //for testing only
        resultData = resultData[0];

        var id = resultData[DBM_Card_Data.columns.id_card];
        var color = resultData[DBM_Card_Data.columns.color];
        var rarity = resultData[DBM_Card_Data.columns.rarity];

        var rndNumber = GlobalFunctions.randomNumber(2,10);

        var objEmbed = GEmbed.builder(`Guess whether the hidden number **(1-12)** will be **lower** or **higher** than the current number: **${rndNumber}**`,{
            username:`${rarity}⭐ Number Spawn: ${GlobalFunctions.capitalize(color)} Edition`
        },{
            color:GEmbed.color[color],
            title:":game_die: It's Lucky Number Time!",
            image:Properties.imgMofu.peek
        });

        var arrComponents = [DiscordStyles.Button.row([
            DiscordStyles.Button.base("card.number_lower","▼ Lower","PRIMARY"),
            DiscordStyles.Button.base("card.number_higher","▲ Higher","PRIMARY")
        ])];

        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type, this.spawnDataType.number.value);
        mapSet.set(DBM_Guild_Data.columns.spawn_data, `{"${Spawner.spawnDataType.number.dataKey.number}":${rndNumber},"${Spawner.spawnDataType.number.dataKey.spawnId}":"${id}"}`);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));//randomize spawn token

        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId);
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: arrComponents};

    }

    static async spawnQuiz(guildId){
        //spawn quiz
        var rarity = 3;
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, rarity);
        mapWhere.set(DBM_Card_Data.columns.is_spawnable, 1);
        
        var resultData = await DB.selectRandomNonDuplicate(DBM_Card_Data.TABLENAME, mapWhere, DBM_Card_Data.columns.pack, 4); //for testing only

        var series = resultData[0][DBM_Card_Data.columns.series];
        var pack = resultData[0][DBM_Card_Data.columns.pack];

        var alterEgo = CpackModule[pack].Properties.alter_ego;
        var arrAnswerList = [];
        for(var i=0;i<=3;i++){
            arrAnswerList.push(resultData[i][DBM_Card_Data.columns.pack]);
        }

        //shuffle the answer
        arrAnswerList = GlobalFunctions.shuffleArray(arrAnswerList);
        //get the answer
        var answer = arrAnswerList.indexOf(pack);
        switch(answer){
            case 0: answer = "a"; break;
            case 1: answer = "b"; break;
            case 2: answer = "c"; break;
            case 3: answer = "d"; break;
        }

        //select menu start
        var arrOptions = [];
        for(var i=0;i<arrAnswerList.length;i++){
            var fullNameOption = `${CpackModule[arrAnswerList[i]].Properties.fullname}`.toString();
            arrOptions.push({
                label: `${fullNameOption}`,
                description: `Answer with: ${fullNameOption}`
            });
            switch(i){
                case 0: arrOptions[i].value = "a"; break;
                case 1: arrOptions[i].value = "b"; break;
                case 2: arrOptions[i].value = "c"; break;
                case 3: arrOptions[i].value = "d"; break;
            }
        }

        var arrComponents = [
            DiscordStyles.SelectMenus.basic("card.quiz_answer","Select the answers",arrOptions)
        ];

        var objEmbed = new MessageEmbed({
            color:GEmbed.color.yellow,
            author: {
                name:`${rarity}⭐ Precure Quiz`
            },
            title: ":grey_question: It's Quiz Time!",
            description: `The series theme/motif was about: **${SpackModule[series].Properties.theme}** and I'm known as **${alterEgo}**. Who am I?`,
            image: {
                url:Properties.imgMofu.peek
            }
        });

        //set for reward
        var id = resultData[GlobalFunctions.randomNumber(0,3)][DBM_Card_Data.columns.id_card];
        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type, this.spawnDataType.quiz.value);
        mapSet.set(DBM_Guild_Data.columns.spawn_data,
        `{"${this.spawnDataType.quiz.dataKey.value}":"${answer}","${this.spawnDataType.quiz.dataKey.spawnId}":"${id}"}`);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));//randomize spawn token

        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId);
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: arrComponents};

    }

    static async spawnColor(guildId){
        var rarity = GlobalFunctions.randomNumber(4,5);
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, rarity);
        var rndData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere);
        rndData = rndData[0];
        var rndColorBonus = rndData[DBM_Card_Data.columns.color];
        
        var baseCatchRate = this.rate_catch.color[rarity];
        var bonusCatchRate = baseCatchRate+this.bonusRateCatch.color[rarity];

        var objEmbed = new MessageEmbed({
            color: GEmbed.color[rndColorBonus],
            author: {
                name: `${rarity}⭐ Color Card Spawn`,
            },
            title:`${Properties.color[rndColorBonus].icon} A **color** card has spawned!`,
            description: `Capture it to get color card based from your assigned color zone.`,
            fields: [
                {
                    name:"Card Capture Command:",
                    value:`${Properties.emoji.mofuheart} Press ✨ **Catch!** to capture color card\n${UserModule.Properties.peacePoint.icon} Press 🆙 **Boost** to boost capture with ${this.boosterCost.color[rarity]} peace point`
                }
            ],
            image:{
                url:Properties.imgMofu.peek
            },
            footer:{
                text:`✔️ Catch Rate: ${baseCatchRate}% (⏫${rndColorBonus}: ${bonusCatchRate}%)`
            }
        });

        //start update
        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type,this.spawnDataType.color.value);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));
        mapSet.set(DBM_Guild_Data.columns.spawn_data,
            `{"${this.spawnDataType.color.dataKey.bonus_color}":"${rndColorBonus}","${this.spawnDataType.color.dataKey.rarity}":${rarity}}`);
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId.toString());
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: [
            new MessageActionRow()
            .addComponents(DiscordStyles.Button.base("card.catch_color","✨ Catch!"))
            .addComponents(DiscordStyles.Button.base("card.catch_color_boost","🆙 Boost")),
        ]};
    }

    static async spawnSeries(guildId){
        var rarity = GlobalFunctions.randomNumber(4,5);
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.rarity, rarity);
        var rndData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere);
        rndData = rndData[0];
        var objSeriesBonus = SpackModule[rndData[DBM_Card_Data.columns.series]];

        var baseCatchRate = this.rate_catch.series[rarity];
        var bonusCatchRate = baseCatchRate+this.bonusRateCatch.series[rarity];

        var objEmbed = new MessageEmbed({
            color: GEmbed.color.yellow,
            author: {
                name: `${rarity}⭐ Series Card Spawn`,
            },
            description: `${objSeriesBonus.Properties.icon.mascot_emoji} A **series** card has spawned! Capture it to get series card based from your assigned series zone.`,
            fields: [
                {
                    name:"Card Capture Command:",
                    value:`${Properties.emoji.mofuheart} Press ✨ **Catch!** to capture series card\n${UserModule.Properties.peacePoint.icon} Press 🆙 **Boost** to boost capture with ${this.boosterCost.series[rarity]} peace point`
                }
            ],
            thumbnail:{
                url:objSeriesBonus.Properties.icon.series
            },
            image:{
                url:Properties.imgMofu.peek
            },
            footer:{
                text:`✔️ Base Catch Rate: ${baseCatchRate}% (⏫${objSeriesBonus.Properties.name}: ${bonusCatchRate}%)`
            }
        });

        //start update
        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type,this.spawnDataType.series.value);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));
        mapSet.set(DBM_Guild_Data.columns.spawn_data,
            `{"${this.spawnDataType.series.dataKey.bonus_series}":"${objSeriesBonus.Properties.value}","${this.spawnDataType.series.dataKey.rarity}":${rarity}}`);
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId.toString());
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: [
            new MessageActionRow()
            .addComponents(
                DiscordStyles.Button.base("card.catch_series","✨ Catch!")
            )
            .addComponents(
                DiscordStyles.Button.base("card.catch_series_boost","🆙 Boost")
            ),
        ]};
    }

    static async spawnBattle(guildId){
        var rndSeries = GlobalFunctions.randomArrayItem(this.arrSeriesRandomizer);
        var difficulty = GlobalFunctions.randomNumber(1, 3);
        var txtDescription = stripIndents`**Traits:** 
        Weakness: ${Properties.color.green.icon}
        Absorb: ${Properties.color.blue.icon}`;
        var objEmbed = GEmbed.builder(txtDescription,
        {
            username:`${difficulty}⭐ Battle`
        }, {
            thumbnail:BattleModule.Properties.tsunagarus.chokkins.embed.icon,
            fields:[
                {
                    name:`💔HP:`,
                    value:stripIndents`${Properties.color.pink.icon} ???/???
                    ${Properties.color.blue.icon} ???
                    ${Properties.color.green.icon} ???`,
                    inline: true
                },
                {
                    name:`Next Target:`,
                    value:`${Properties.color.pink.icon}`,
                    inline: true
                }
            ],
            footer:{
                text:"Turn: x/?"
            }
        });

        
        // **Goal & Rewards:**
        // ⭐Contribute x damage\n⭐Contribute x damage\n⭐Contribute x damage

        return {embeds:[objEmbed], components: [
            new MessageActionRow()
            .addComponents(
                DiscordStyles.Button.base("card.battle_fight","⚔️ Auto Battle")
            )
            .addComponents(
                DiscordStyles.Button.base("card.battle_finisher","💖 Finisher")
            ),
            // .addComponents(
            //     DiscordStyles.Button.base("card.battle_swap","🔁 Swap")
            // ),
            DiscordStyles.SelectMenus.basic("card.battle_skill","✨ Cure Skills",
                [{
                    label: `Sapphire Arrow`,
                    description: ``,
                    value:`rock`
                },
                {
                    label: `Crystal Shoot`,
                    description: `Block with neutral stance`,
                    value:`crystal_shoot`
                }]
            ),
            DiscordStyles.SelectMenus.basic("card.battle_stance","Stance",
                [{
                    label: `🪨 Rock`,
                    description: `Attack & change into offensive stance`,
                    value:`rock`
                },
                {
                    label: `📜 Paper`,
                    description: `Block with neutral stance`,
                    value:`paper`
                },
                {
                    label: `✂️ Scissors`,
                    description: `Block & change into defensive stance`,
                    value:`scissors`
                }]
            )
        ]};
        
    }

    static async spawnCure(guildId){
        var objSeriesBonus = GlobalFunctions.randomPropertyKey(SpackModule);
        objSeriesBonus = SpackModule[objSeriesBonus];
        var rndColorBonus = GlobalFunctions.randomArrayItem(objSeriesBonus.Properties.colorAvailable);

        var rarity = GlobalFunctions.randomNumber(4,5);
        var objEmbed = new MessageEmbed({
            color: GEmbed.color[rndColorBonus],
            author: {
                name: `${rarity}⭐ Grand Card Spawn`,
            },
            description: `A **grand** card has spawned! Capture it to get card based from your assigned color & series zone.`,
            fields: [
                {
                    name:"⏫ Grand Zone Effect:",
                    value:`**${rndColorBonus}**: +${this.bonusRateCatch.grand[rarity]}% capture rate\n**${objSeriesBonus.Properties.name}**: +${this.bonusRateCatch.grand[rarity]}% capture rate\n`
                },
                {
                    name:"Card Capture Command:",
                    value:`Press ✨ **Catch!** to capture grand card\nPress 🆙 **Boost** to boost capture with ${this.boosterCost.series[rarity]} peace point`
                }
            ],
            thumbnail:{
                url:objSeriesBonus.Properties.icon
            },
            image:{
                url:`https://waa.ai/JEyE.png`
            },
            footer:{
                text:`✔️ Base Catch Rate: ${this.rate_catch.grand[rarity]}%`
            }
        });

        //start update
        var mapSet = new Map();
        mapSet.set(DBM_Guild_Data.columns.spawn_type,this.spawnDataType.cure);
        mapSet.set(DBM_Guild_Data.columns.spawn_token,GlobalFunctions.randomNumber(0,10000));
        mapSet.set(DBM_Guild_Data.columns.spawn_data,
            `{"${this.spawnDataKey.cure.bonus_color}":${rndColorBonus},"${this.spawnDataKey.cure.bonus_series}":"${objSeriesBonus.Properties.value}","${this.spawnDataKey.series.rarity}":${rarity}}`);
        var mapWhere = new Map();
        mapWhere.set(DBM_Guild_Data.columns.id_guild,guildId.toString());
        await DB.update(DBM_Guild_Data.TABLENAME,mapSet,mapWhere);

        return await {embeds:[objEmbed], components: [
            new MessageActionRow()
            .addComponents(
                DiscordStyles.Button.base("card.catch_grand","✨ Catch!")
            )
            .addComponents(
                DiscordStyles.Button.base("card.catch_grand_boost","🆙 Boost")
            ),
        ]};
    }

    static async generateCardSpawn(guildId){
        var rnd = GlobalFunctions.randomNumber(1,100);
        var spawnType = "normal";

        this.spawnNormal();

        var chance = {
            battle:25,
            quiz:20,
            normal:20,
            number:15,
            event:10,
            color:5,
            series:5,
        }

        // if(rnd<chance.battle){
        //     spawnType = "battle";
        // } else if(rnd<chance.battle+
        //     chance.normal+ chance.quiz){
        //     //normal/quiz/event
        //     spawnType = GlobalFunctions.randomNumber(0,1) == 0 ? "normal":"quiz";
        //     switch(spawnType){
        //         case 0:
        //             this.spawnNormal();
        //             break;
        //         case 1:

        //             break;
        //     }
            

        // } else if(rnd<chance.battle+
        //     chance.normal+ chance.quiz+
        //     chance.number){
        //     spawnType = "number";
        // } else if(rnd<chance.battle+
        //     chance.normal+ chance.quiz+
        //     chance.number+ chance.event){
        //     spawnType = "event";
        // } else if(rnd<chance.battle+
        //     chance.normal+ chance.quiz+
        //     chance.number+ chance.event+
        //     chance.color+ chance.series){
        //     spawnType = GlobalFunctions.randomNumber(0,1) == 0 ? "series":"color";
        // } else { 
        //     spawnType = "battle"; 
        // }

        return console.log(spawnType);
    }
}

async function getCardData(cardId){
    var mapWhere = new Map();
    mapWhere.set(DBM_Card_Data.columns.id_card,cardId);
    var cardData = await DB.select(DBM_Card_Data.TABLENAME,mapWhere);
    return cardData[0];
}

class EventListener {
    static spawnValidation(objUserData, userStatusData, guildData, spawnType, subSpawnType=""){
        if(guildData[DBM_Guild_Data.columns.spawn_type]==null){
            return GEmbed.errorMini(`:x: There are no card spawning right now.`,objUserData,true);
        } else if(userStatusData[DBM_User_Data.columns.token_cardspawn]==guildData[DBM_Guild_Data.columns.spawn_token]){
            //check if capture token same/not
            return GEmbed.errorMini(`:x: You have already used the capture attempt. Please wait for next card spawn.`,objUserData,true);
        } else if(guildData[DBM_Guild_Data.columns.spawn_type]!=spawnType){//check spawn type
            return GEmbed.errorMini(`:x: This command is not valid for ${Spawner.spawnDataType[spawnType].name} spawn this itme.`,objUserData,true);
        } else if(subSpawnType!=""){
            var parsedType = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
            if("type" in parsedType){
                if(parsedType["type"]!=subSpawnType){
                    return GEmbed.errorMini(`:x: This command is not valid for different type of ${Spawner.spawnDataType[spawnType].name} spawn this time.`,objUserData,true);
                }
            }
        }
        
        return true;
    }

    static async captureNormal(objUserData, guildId, isBoostCaptured = false){
        var userId = objUserData.id;

        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.normal.value);
        if(spawnValidation!==true) return spawnValidation;
        
        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var parsedSpawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var cardData = await getCardData(parsedSpawnData[Spawner.spawnDataType.normal.dataKey.spawnId]);
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series; var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point
        var colorPoint = color == userStatusData[DBM_User_Data.columns.set_color] ? rarity*2 : rarity;
        var seriesPoint = series == userStatusData[DBM_User_Data.columns.set_series] ? rarity*2 : rarity;
        var qty = color == userStatusData[DBM_User_Data.columns.set_color] && series == userStatusData[DBM_User_Data.columns.set_series]? 2:1;

        //check for capture chance
        var txtNotifBoostCapture = ``;
        var rateCatch = Spawner.rate_catch.normal[rarity];//init catch rate

        if(isBoostCaptured){//use boost command
            var boostCost = Spawner.boosterCost.normal[rarity];
            if(userStatusData[DBM_User_Data.columns.point_peace]<boostCost)
                return {embeds:[Embed.notifNotEnoughBoostPoint(boostCost, objUserData)], ephemeral:true};
            else{
                rateCatch = 100;
                updateData[DBM_User_Data.columns.point_peace] = -boostCost;
                txtNotifBoostCapture = `${UserModule.Properties.peacePoint.icon} boost capture has been used!`;
            }
        }

        //init point map
        var mapColorData = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        //get color level bonus
        //parse user color data
        var colorLevel = JSON.parse(userStatusData[DBM_User_Data.columns.color_data])[color]["level"];
        rateCatch+=UserModule.Card.getColorLevelBonus(colorLevel);

        if(GlobalFunctions.randomNumber(0,100)<=rateCatch){//success
            mapColorData.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);
    
            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,
                    qty, colorPoint, seriesPoint, total, {
                        notifFront:txtNotifBoostCapture
                    })
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock, {
                        notifFront:txtNotifBoostCapture
                    })
                );
            }
        } else { //fail to catch
            mapColorData.set(Properties.color[color].value, {"point":rarity});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward

            arrEmbeds.push(Embed.notifFailCatch(objUserData, cardData));
        }

        //process the user updatre
        updateData[DBM_User_Data.columns.color_data] = mapColorData;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureNumber(objUserData, guildId, choice){
        var userId = objUserData.id;

        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.number.value);
        if(spawnValidation!==true) return spawnValidation;
        
        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var parsedSpawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var cardData = await getCardData(parsedSpawnData[Spawner.spawnDataType.normal.dataKey.spawnId]);
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series; var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point
        var colorPoint = color == userStatusData[DBM_User_Data.columns.set_color] ? rarity*2 : rarity;
        var seriesPoint = series == userStatusData[DBM_User_Data.columns.set_series] ? rarity*2 : rarity;
        var qty = color == userStatusData[DBM_User_Data.columns.set_color] && series == userStatusData[DBM_User_Data.columns.set_series]? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        //check for capture chance
        var rndNumber = GlobalFunctions.randomNumber(1,12);//init catch rate
        var number = parsedSpawnData[Spawner.spawnDataType.number.dataKey.number];
        if((choice=="lower" && rndNumber<number)||
        (choice=="higher" && rndNumber>number)){//success
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
            updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);

            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,qty, colorPoint, seriesPoint, total,{
                        notifFront:`✅ The current number was: **${number}** and the hidden number was **${rndNumber}**.`
                    })
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock)
                );
            }
        } else if(rndNumber==number) {//same
            colorPoint = rarity; seriesPoint = rarity;
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward

            arrEmbeds.push(GEmbed.builder(
                `The current number was: **${number}** and the hidden number was **${rndNumber}**. Neither number is lower or higher.
                You have another chance to guess the next hidden number.`,objUserData,{
                    color:color,
                    title:`${Properties.emoji.mofuheart} 🔁 Once More!`,
                    thumbnail:Properties.imgMofu.ok,
                    fields:[{
                        name:`Rewards Received:`,
                        value:`${Properties.color[color].icon} ${colorPoint} ${color} points${colorPoint>rarity ? " ⏫":""}\n${SpackModule[series].Properties.icon.mascot_emoji} ${seriesPoint} ${SpackModule[series].Properties.currency.name} ${seriesPoint>rarity ? " ⏫":""}`
                    }]
                }
            ));
        } else { //fail to catch
            mapColorPoint.set(Properties.color[color].value, {"point":rarity});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward
            updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];

            arrEmbeds.push(Embed.notifFailCatch(objUserData, cardData,{
                notifFront:`❌ The current number was: **${number}** and the hidden number was **${rndNumber}**.`
            }));
        }

        //process the user updatre
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureColor(objUserData, guildId, isBoostCaptured = false){
        var userId = objUserData.id;

        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.color.value);
        if(spawnValidation!==true) return spawnValidation;

        //parse spawn data
        var color = userStatusData[DBM_User_Data.columns.set_color];
        var spawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var rarity = spawnData[Spawner.spawnDataType.color.dataKey.rarity];
        var bonusColor = spawnData[Spawner.spawnDataType.color.dataKey.bonus_color];

        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.color,color);
        mapWhere.set(DBM_Card_Data.columns.rarity,rarity);
        var cardData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere, 1);//randomize select color card
        cardData = cardData[0];
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var series = CpackModule[pack].Properties.series;
        var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point rewards
        var colorPoint = color == bonusColor ? rarity*3 : rarity;
        var seriesPoint = userStatusData[DBM_User_Data.columns.set_series] == series ? rarity*2 : rarity;
        var qty = (color == bonusColor && series == userStatusData[DBM_User_Data.columns.set_series])? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        //check for capture chance
        var txtNotifBoostCapture = ``;
        var rateCatch = Spawner.rate_catch.color[rarity];//init catch rate
        if(isBoostCaptured){//use boost command
            var boostCost = Spawner.boosterCost.color[rarity];
            if(userStatusData[DBM_User_Data.columns.point_peace]<boostCost)
                return {embeds:[Embed.notifNotEnoughBoostPoint(boostCost, objUserData)], ephemeral:true};
            else{
                rateCatch = 100;
                updateData[DBM_User_Data.columns.point_peace] = -boostCost;
                txtNotifBoostCapture = `${UserModule.Properties.peacePoint.icon} boost capture has been used!`;
            }
        } else if(color==bonusColor){
            rateCatch+=Spawner.bonusRateCatch.color[rarity];//calculate color zone bonus

            var colorLevel = JSON.parse(userStatusData[DBM_User_Data.columns.color_data])[color]["level"];
            rateCatch+=UserModule.Card.getColorLevelBonus(colorLevel);
        }

        var rndRoll = GlobalFunctions.randomNumber(0,100);
        if(rndRoll<rateCatch){//success
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);
    
            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,
                    qty, colorPoint, seriesPoint, total, {
                        notifFront:txtNotifBoostCapture
                    })
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock, {
                        notifFront:txtNotifBoostCapture
                    })
                );
            }
        } else { //fail to catch
            mapColorPoint.set(Properties.color[color].value, {"point":rarity});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward

            arrEmbeds.push(Embed.notifFailCatch(objUserData, cardData));
        }

        //update color & series point
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureSeries(objUserData, guildId, isBoostCaptured = false){
        var userId = objUserData.id;

        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.series.value);
        if(spawnValidation!==true) return spawnValidation;

        //parse spawn data
        var series = userStatusData[DBM_User_Data.columns.set_series];
        var spawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var rarity = spawnData[Spawner.spawnDataType.series.dataKey.rarity];
        var bonusSeries = spawnData[Spawner.spawnDataType.series.dataKey.bonus_series];

        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var mapWhere = new Map();
        mapWhere.set(DBM_Card_Data.columns.series,series);
        mapWhere.set(DBM_Card_Data.columns.rarity,rarity);
        var cardData = await DB.selectRandom(DBM_Card_Data.TABLENAME, mapWhere, 1);//randomize select color card
        cardData = cardData[0];
        var id = cardData[DBM_Card_Data.columns.id_card]; var pack = cardData[DBM_Card_Data.columns.pack];
        var color = CpackModule[pack].Properties.color; var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point rewards
        var colorPoint = userStatusData[DBM_User_Data.columns.set_color] == color ? rarity*2 : rarity;
        var seriesPoint = series == bonusSeries ? rarity*3 : rarity;
        var qty = (userStatusData[DBM_User_Data.columns.set_color] == color && series == bonusSeries)? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        //check for capture chance
        var txtNotifBoostCapture = ``;
        var rateCatch = Spawner.rate_catch.series[rarity];//init catch rate
        if(isBoostCaptured){//use boost command
            var boostCost = Spawner.boosterCost.series[rarity];
            if(userStatusData[DBM_User_Data.columns.point_peace]<boostCost)
                return {embeds:[Embed.notifNotEnoughBoostPoint(boostCost, objUserData)], ephemeral:true};
            else{
                rateCatch = 100;
                updateData[DBM_User_Data.columns.point_peace] = -boostCost;
                txtNotifBoostCapture = `${UserModule.Properties.peacePoint.icon} boost capture has been used!`;
            }
        } else if(series==bonusSeries){
            rateCatch+=Spawner.bonusRateCatch.series[rarity];//calculate series zone bonus

            //parse user series data
            var colorLevel = JSON.parse(userStatusData[DBM_User_Data.columns.color_data])[color]["level"];
            rateCatch+=UserModule.Card.getColorLevelBonus(colorLevel);
        }

        var rndRoll = GlobalFunctions.randomNumber(0,100);
        
        if(rndRoll<=rateCatch){//success
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);
    
            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,
                    qty, colorPoint, seriesPoint, total, {
                        notifFront:txtNotifBoostCapture
                    })
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock, {
                        notifFront:txtNotifBoostCapture
                    })
                );
            }
        } else { //fail to catch
            mapColorPoint.set(Properties.color[color].value, {"point":rarity});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward

            arrEmbeds.push(Embed.notifFailCatch(objUserData, cardData));
        }

        //update color & series point
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureJankenpon(objUserData, guildId, choice){
        var userId = objUserData.id;

        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.act.value);
        if(spawnValidation!==true) return spawnValidation;

        var arrEmbeds = []; var updateData = {};

        //get spawned card data
        var spawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var cardData = await getCardData(spawnData[Spawner.spawnDataType.act.dataKey.spawnId]);
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series; var seriesCurrency = SpackModule[series].Properties.currency;

        //prepare & check for bonus point
        var colorPoint = color == userStatusData[DBM_User_Data.columns.set_color] ? rarity*2 : rarity;
        var seriesPoint = series == userStatusData[DBM_User_Data.columns.set_series] ? rarity*2 : rarity;
        var qty = color == userStatusData[DBM_User_Data.columns.set_color] && series == userStatusData[DBM_User_Data.columns.set_series]? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        //randomize jankenpon
        var jankenponData = SpackModule.smile.Properties.jankenponData;
        var rndJankenpon = GlobalFunctions.randomPropertyKey(jankenponData);
        if(jankenponData[rndJankenpon].choiceResults[choice]){//results: win
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
            updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];//update user token

            var inventoryData = await UserModule.Card.getInventoryData(userId, id);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);

            arrEmbeds.push(GEmbed.builder(
                `I picked ${jankenponData[rndJankenpon].icon} **${jankenponData[rndJankenpon].value}**! Yay yay yay! You win!`,
                objUserData,{
                    color:GEmbed.color.yellow,
                    title:"✅ You Win!",
                    thumbnail:jankenponData[rndJankenpon].img
                }
            ));

            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,
                    qty, colorPoint, seriesPoint, total)
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock)
                );
            }
        } else if(jankenponData[rndJankenpon].value==choice){ //results: draw
            colorPoint = rarity; seriesPoint = rarity;
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward

            arrEmbeds.push(GEmbed.builder(
                `Hey we both went with ${jankenponData[rndJankenpon].icon} **${jankenponData[rndJankenpon].value}**! It's a draw!\nYou have another chance to use the jankenpon command.`,objUserData,{
                    title:"🔁 Once More!",
                    thumbnail:jankenponData[rndJankenpon].img,
                    fields:[{
                        name:`Received:`,
                        value:stripIndents`${Properties.color[color].icon} ${colorPoint} ${color} points${colorPoint>rarity ? " ⏫":""}
                        ${SpackModule[series].Properties.icon.mascot_emoji} ${seriesPoint} ${seriesCurrency.name} ${seriesPoint>rarity ? " ⏫":""}`
                    }]
                }
            ));
        } else {//results: lose
            colorPoint = rarity; seriesPoint = rarity;
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
            updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];//update user token

            arrEmbeds.push(GEmbed.builder(
                `I picked ${jankenponData[rndJankenpon].icon} **${jankenponData[rndJankenpon].value}**! Oh no, you lost.`,
                objUserData,{
                    color:GEmbed.color.danger,
                    title:"❌ You Lost!",
                    thumbnail:jankenponData[rndJankenpon].img,
                    fields:[{
                        name:`Received:`,
                        value:stripIndents`${Properties.color[color].icon} ${colorPoint} ${color} points${colorPoint>rarity ? " ⏫":""}
                        ${SpackModule[series].Properties.icon.mascot_emoji} ${seriesPoint} ${seriesCurrency.name} ${seriesPoint>rarity ? " ⏫":""}`
                    }]
                }
            ));
        }

        //process the user updates
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureCheckActAnswer(objUserData, guildId, choice, subType){
        var userId = objUserData.id;
        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.act.value, subType);
        if(spawnValidation!==true) return spawnValidation;

        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var parsedSpawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var cardData = await getCardData(parsedSpawnData[Spawner.spawnDataType.act.dataKey.spawnId]);
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series; var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point
        var colorPoint = color == userStatusData[DBM_User_Data.columns.set_color] ? rarity*2 : rarity;
        var seriesPoint = series == userStatusData[DBM_User_Data.columns.set_series] ? rarity*2 : rarity;
        var qty = color == userStatusData[DBM_User_Data.columns.set_color] && series == userStatusData[DBM_User_Data.columns.set_series]? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map
        
        var answer = parsedSpawnData[Spawner.spawnDataType.act.dataKey.value];

        if(choice == answer){ //success
            mapColorPoint.set(Properties.color[color].value, {"point":colorPoint});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);
    
            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,qty, colorPoint, seriesPoint, total)
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock)
                );
            }
        } else { //fail to catch
            mapColorPoint.set(Properties.color[color].value, {"point":rarity});//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward

            switch(subType){
                case Spawner.spawnDataType.act.dataKey.typeVal.mini_tsunagarus:
                    arrEmbeds.push(GEmbed.builder(`:x: Chirichiri! You failed to defeat the tsunagarus this time.`,objUserData,{
                        color:`#CC3060`,
                        thumbnail:`https://cdn.discordapp.com/attachments/793415946738860072/824898467646013451/latest.png`,
                        title:`Defeated!`
                    }));
                    break;
                default:
                    arrEmbeds.push(GEmbed.failMini(`:x: Sorry but that's not the answer!`,objUserData,{
                        title:`Wrong Answer!`
                    }));
                    break;
            }
        }

        //process the user update
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};
    }

    static async captureQuiz(objUserData, guildId, choice){
        var userId = objUserData.id;
        var userStatusData = await UserModule.getStatusData(userId);
        //check for guild spawned id & rarity
        var guildData = await GuildModule.getGuildData(guildId);

        //spawn validation
        var spawnValidation = this.spawnValidation(objUserData, userStatusData, guildData, Spawner.spawnDataType.quiz.value);
        if(spawnValidation!==true) return spawnValidation;

        var arrEmbeds = []; var updateData = {};
        //get spawned card data
        var parsedSpawnData = JSON.parse(guildData[DBM_Guild_Data.columns.spawn_data]);
        var cardData = await getCardData(parsedSpawnData[Spawner.spawnDataType.quiz.dataKey.spawnId]);
        var id = cardData[DBM_Card_Data.columns.id_card]; var rarity = cardData[DBM_Card_Data.columns.rarity];
        var pack = cardData[DBM_Card_Data.columns.pack]; var color = CpackModule[pack].Properties.color;
        var series = CpackModule[pack].Properties.series; var packTotal = CpackModule[pack].Properties.total;

        //prepare & check for bonus point
        var colorPoint = color == userStatusData[DBM_User_Data.columns.set_color] ? rarity*2 : rarity;
        var seriesPoint = series == userStatusData[DBM_User_Data.columns.set_series] ? rarity*2 : rarity;
        var qty = color == userStatusData[DBM_User_Data.columns.set_color] && series == userStatusData[DBM_User_Data.columns.set_series]? 2:1;

        //init point map
        var mapColorPoint = new Map(); //init color point map
        var mapSeriesPoint = new Map(); //init series point map

        var answer = parsedSpawnData[Spawner.spawnDataType.quiz.dataKey.value];
        if(choice == answer){ //success
            mapColorPoint.set(Properties.color[color].value, colorPoint);//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, seriesPoint);//series points reward
    
            var inventoryData = await UserModule.Card.getInventoryData(userId, cardData[DBM_Card_Data.columns.id_card]);
            var updatedStock = await UserModule.Card.updateStockParam(userId, id, inventoryData, qty);
            var total = await UserModule.Card.getPackTotal(userId, pack);
    
            if(inventoryData==null){
                //add new card
                arrEmbeds.push(
                    Embed.notifNewCard(objUserData,cardData,qty, colorPoint, seriesPoint, total)
                );

                //erase guild spawn
                await GuildModule.removeSpawn(guildId);
                
            } else {
                //add duplicate card
                arrEmbeds.push(
                    Embed.notifDuplicateCard(objUserData, cardData, qty, colorPoint, seriesPoint, updatedStock)
                );
            }
        } else { //fail to catch
            mapColorPoint.set(Properties.color[color].value, rarity);//color points reward
            mapSeriesPoint.set(SpackModule[series].Properties.value, rarity);//series points reward
            arrEmbeds.push(GEmbed.failMini(`:x: Sorry but that's not the answer!`,objUserData,{
                title:`Wrong Answer!`
            }));
        }

        //process the user update
        updateData[DBM_User_Data.columns.color_data] = mapColorPoint;
        updateData[DBM_User_Data.columns.series_data] = mapSeriesPoint;
        updateData[DBM_User_Data.columns.token_cardspawn] = guildData[DBM_Guild_Data.columns.spawn_token];
        await UserModule.updateData(userId, userStatusData, updateData);

        return {embeds:arrEmbeds};

    }   
}

module.exports = {
    init, Properties, Spawner, EventListener, getCardData
}
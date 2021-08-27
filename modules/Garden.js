const DB = require('../database/DatabaseCore');
const GlobalFunctions = require('./GlobalFunctions');
const CardModule = require('./Card');
const WeatherModule = require('./Weather');
const ItemModule = require('./Item');
const UserModule = require('./User');
const DBM_Card_Guild = require('../database/model/DBM_Card_Guild');
const DBM_Item_Data = require('../database/model/DBM_Item_Data');
const DBM_User_Data = require('../database/model/DBM_User_Data');

class Properties {
    static embedColor = '#efcc2c';
    static imgResponse = {
        imgOk: "https://waa.ai/JEwn.png",
        imgError: "https://waa.ai/JEw5.png",
        imgFailed: "https://waa.ai/JEwr.png"
    }

    static subCategory = {
        seeds:"seeds",
        soil:"soil",
        fertilizer:"fertilizer"
    }

    static propertyKey = {
        size:"size",
        plotData:"plotData",
        //for plotData:
        seeds:"seeds",
        soil:"soil",
        progress_growth:"progress_growth",
        progress_crossbreeding:"progress_crossbreeding",
        lastTend:"lastTend",
        lastFertilizer:"lastFertilizer",
        lastProcess:"lastProcess",//for plant processing by system
        wiltProgress:"wiltProgress"
    }

    static wiltingProgressMax = 2;//plant wilted indicator
    static witheredProgress = 3;//condition for plant is died

    static plantData = {
        seedling:{
            value:"seedling",
            name:"Seedling",
            icon:":seedling:"
        },
        pink_tulip:{
            value:"pink_tulip",
            name:"Pink Tulip",
            icon:":tulip:",
            icon_seedling:":seedling:",
            harvest_item:"pl001",
            crossbreedingData:[
                {
                    //pink tulip
                    item:"gse001",
                    min_chance:0
                },
                {
                    //magical herb
                    item:"gse003",
                    min_chance:50
                }
            ]
        },
        red_rose:{
            value:"red_rose",
            name:"Red Rose",
            icon:":rose:",
            icon_seedling:":seedling:",
            harvest_item:"pl002",
            crossbreedingData:[
                {
                    //red rose
                    item:"gse002",
                    min_chance:0
                },
                {
                    //magical herb
                    item:"gse003",
                    min_chance:50
                }
            ]
        },
        magical_herb:{
            value:"magical_herb",
            name:"Magical Herb",
            icon:":herb:",
            icon_seedling:":seedling:",
            harvest_item:"pl003",
            crossbreedingData:[
                {
                    //magical herb
                    item:"gse003",
                    min_chance:50
                },
                {
                    //hibiscus
                    item:"gse004",
                    min_chance:80
                },
                {
                    //cherry blossom
                    item:"gse005",
                    min_chance:80
                }
            ]
        },
        hibiscus:{
            value:"hibiscus",
            name:"Hibiscus",
            icon:":hibiscus:",
            icon_seedling:":seedling:",
            harvest_item:"pl004",
            crossbreedingData:[
                {
                    //magical herb
                    item:"gse003",
                    min_chance:50
                },
                {
                    //cherry blossom
                    item:"gse005",
                    min_chance:50
                }
            ]
        },
        cherry_blossom:{
            value:"cherry_blossom",
            name:"Cherry Blossom",
            icon:":cherry_blossom:",
            icon_seedling:":seedling:",
            harvest_item:"pl005",
            crossbreedingData:[
                {
                    //pink tulip
                    item:"gse001",
                    min_chance:0
                },
                {
                    //red rose
                    item:"gse002",
                    min_chance:0
                },
                {
                    //sunflower
                    item:"gse006",
                    min_chance:80
                },
                {
                    //magical blossom
                    item:"gse007",
                    min_chance:80
                },
            ]
        },
        sunflower:{
            value:"sunflower",
            name:"Sunflower",
            icon:":sunflower:",
            icon_seedling:":seedling:",
            harvest_item:"pl006",
            crossbreedingData:[
                {
                    //sunflower
                    item:"gse006",
                    min_chance:80
                },
                {
                    //magical blossom
                    item:"gse007",
                    min_chance:50
                }
            ]
        },
        magical_blossom:{
            value:"magical_blossom",
            name:"Magical Blossom",
            icon:":blossom:",
            icon_seedling:":seedling:",
            harvest_item:"pl007",
            crossbreedingData:[
                {
                    //magical blossom
                    item:"gse007",
                    min_chance:80
                },
                {
                    //sunflower
                    item:"gse006",
                    min_chance:50
                }
            ]
        },
        
    }

    static soilData = {
        normal:{
            value:"normal",
            name:"Normal Soil",
            growth_rate:1,
            crossbreeding_rate:0,
        },
        shiny:{
            value:"shiny",
            name:"Shiny Soil",
            growth_rate:2,
            crossbreeding_rate:0,
        },
        mystic:{
            value:"mystic",
            name:"Mystic Soil",
            growth_rate:1,
            crossbreeding_rate:1,
        }
    }

    static fertilizerData = {
        good:{
            value:"good",
            rate_min:1,
            rate_max:2
        },
        great:{
            value:"great",
            rate_min:2,
            rate_max:3
        }
    }

    static plotData = {
        small:{
            value:"small",
            value_search:"small",
            name:"Small",
            num:1,
            width:3,height:3,price:0,
            plotsetColumn:["a","b","c"],//columns
            plotsetRow:[":one:",":two:",":three:"],//row
        },
        medium:{
            value:"medium",
            value_search:"medium",
            name:"Medium",
            num:2,
            width:4,height:4,price:2500,
            plotsetColumn:["a","b","c","d"],//columns
            plotsetRow:[":one:",":two:",":three:",":four:"],//row
        },
        large:{
            value:"large",
            value_search:"large",
            name:"Large",
            num:3,
            width:5,height:5,price:2800,
            plotsetColumn:["a","b","c","d","e"],//columns
            plotsetRow:[":one:",":two:",":three:",":four:",":five:"],//row
        },
        // huge:{
        //     value:"huge",
        //     name:"Huge",
        //     num:4,
        //     width:6,height:6,price:2800,
        //     plotsetColumn:["a","b","c","d","e","f"],//columns
        //     plotsetRow:[":one:",":two:",":three:",":four:",":five:",":six:"],//row
        // }
    }

    static initPlotData = this.plotData.small.initData;

    static growthData = {
        sunny:{
            growth_min:5,
            growth_max:7
        },
        sunny_with_cloudy:{
            growth_min:3,
            growth_max:5
        },
        cloudy:{
            growth_min:3,
            growth_max:4
        },
        sunshower:{
            growth_min:2,
            growth_max:7
        },
        raining:{
            growth_min:1,
            growth_max:3
        },
        thunder_storm:{
            growth_min:1,
            growth_max:2
        }
    }

}

function initGardenPlotData(size){
    var temp = {};
    for(var i=0;i<Properties.plotData[size].height;i++){
        temp[i]={};
        for(var j=0;j<Properties.plotData[size].width;j++){
            temp[i][Properties.plotData[size].alphaset[j]]=null;
        }
    }
    return temp;
}

async function getGardeningItemData(idSoil,subcategory){
    var paramWhere = new Map();
    paramWhere.set(DBM_Item_Data.columns.category,ItemModule.Properties.categoryData.misc_gardening.value);
    paramWhere.set(DBM_Item_Data.columns.id,idSoil);
    var result = await DB.selectAll(DBM_Item_Data.TABLENAME,paramWhere);
    if(result[0][0]!=null){
        var parsedData = JSON.parse(result[0][0][DBM_Item_Data.columns.extra_data]);
        if(parsedData["type"]==subcategory){
            //check if soil/not
            return result[0][0];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

async function processGardenTimelapse(userId){
    var userData = await UserModule.getUserStatusData(userId);
    var parsedGardenData = JSON.parse(userData[DBM_User_Data.columns.gardening_plot_data]);
    var plotData = parsedGardenData[Properties.propertyKey.plotData];

    var needUpdate = false;
    
    for (const [key, value] of Object.entries(plotData)) {
        var objLength = Object.getOwnPropertyNames(value);
        objLength = objLength.length;

        for(var i=0;i<objLength;i++){
            var entry = value[i];
            if(entry!=null){
                //check if plant is withered/not
                if(entry[Properties.propertyKey.wiltProgress]<Properties.witheredProgress){
                    //get last process date
                    var dateLastProcess = new Date(entry[Properties.propertyKey.lastProcess]);
                    var dateNow = new Date(GlobalFunctions.getCurrentDateTime());
                    var diffTime = Math.abs(dateNow - dateLastProcess);
                    var diffDaysProcess = Math.ceil(diffTime / (1000 * 60 * 60 * 24))-1;
                    if(diffDaysProcess>=1){
                        //check last tend date
                        var tendDate = new Date(entry[Properties.propertyKey.lastTend]);
                        var diffTime = Math.abs(new Date() - tendDate);
                        var diffDaysTend = Math.ceil(diffTime / (1000 * 60 * 60 * 24))-1;

                        if(diffDaysTend>=1){
                            entry[Properties.propertyKey.wiltProgress]=diffDaysTend;
                            if(entry[Properties.propertyKey.wiltProgress]>=Properties.witheredProgress){
                                entry[Properties.propertyKey.wiltProgress] = Properties.witheredProgress;
                            }
                        }

                        //update the last process date
                        entry[Properties.propertyKey.lastProcess] = dateLastProcess.setDate(dateLastProcess.getDate() + diffDaysProcess);
                        entry[Properties.propertyKey.lastProcess] = GlobalFunctions.convertDateTime(entry[Properties.propertyKey.lastProcess],2);
                        needUpdate = true;
                    }
                }
            }
        }
    }

    if(needUpdate){
        var paramSet = new Map();
        paramSet.set(DBM_User_Data.columns.gardening_plot_data,JSON.stringify(parsedGardenData));
        var paramWhere = new Map();
        paramWhere.set(DBM_User_Data.columns.id_user,userId);
        await DB.update(DBM_User_Data.TABLENAME,paramSet,paramWhere);
    }
}

module.exports = {Properties,initGardenPlotData,getGardeningItemData,processGardenTimelapse}
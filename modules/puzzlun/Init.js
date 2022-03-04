const CardModules = require("./Card");

async function init(){
    //load card modules
    await CardModules.init();
}

module.exports = {
    init
}
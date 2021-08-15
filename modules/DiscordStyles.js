const { MessageEmbed , MessageButton} = require('discord.js');

class Color{
    static embedColor = "#efcc2c";//default embed color for bot
}

class Button{
    static prev = new MessageButton()
    .setCustomId('previousbtn')
    .setLabel('⏪')
    .setStyle('DANGER');

    static next = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('⏩')
    .setStyle('SUCCESS');

    static buttonList = [this.prev,this.next];
}

module.exports = {Color,Button}
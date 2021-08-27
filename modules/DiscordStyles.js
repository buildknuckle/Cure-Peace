const { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton} = require('discord.js');

class Color{
    static embedColor = "#efcc2c";//default embed color for bot
}

class Button{
    // static prevButton = new MessageButton()
    // .setCustomId('previousbtn')
    // .setLabel('⏪')
    // .setStyle('DANGER');

    // static nextButton = new MessageButton()
    // .setCustomId('nextbtn')
    // .setLabel('⏩')
    // .setStyle('SUCCESS');

    static pagingButtonList = [
        new MessageButton()
        .setCustomId('previousbtn')
        .setLabel('◀')
        .setStyle('SUCCESS'),
        new MessageButton()
        .setCustomId('nextbtn')
        .setLabel('▶')
        .setStyle('SUCCESS')
    ];

    static basic(id,label,style){
        return new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        );
    }

}

class SelectMenus {
    static basic(id,placeholder,arrOptions){
        return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(id)
                .setPlaceholder(placeholder)
                .addOptions(arrOptions)
        );
    } 
    
}

module.exports = {Color, Button, SelectMenus}
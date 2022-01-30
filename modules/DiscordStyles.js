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

    static base(id,label,style="PRIMARY"){
        return new MessageButton()
        .setCustomId(id)
        .setLabel(label)
        .setStyle(style);
    }

    static basic(id,label,style="PRIMARY"){
        return new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(id)
            .setLabel(label)
            .setStyle(style)
        );
    }

    static row(arrButton){
        return new MessageActionRow()
        .addComponents(arrButton);
    }

}

class SelectMenus {
    static basic(id,placeholder,arrOptions){
        //template arrOptions:
        //{
        //     label: 'Select me',
        //     description: 'This is a description',
        //     value: 'first_option',
        // }
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
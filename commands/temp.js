const Discord = require('discord.js');

module.exports = {
    name: 'temp',
    cooldown: 5,
    description: `You'll be able to convert temperatures now!`,


    execute(message, args) {
        
        const tempbox = new Discord.MessageEmbed()
        var temp = args[1]
        var tempresult = 0

        switch(args[0]){
            case "ctof": 
                if (temp != null) {
                 
                    tempresult = (temp * 9/5) + 32 

                    tempbox.setColor('#F97E36')
                    tempbox.setTitle('The brilliant sun, hot-blooded power!')    
                    tempbox.setTitle("Converting Celcius to Fahrenheit!")
                    tempbox.setThumbnail("https://waa.ai/JEw2.png")
                    tempbox.setDescription(temp, `C is `, tempresult, `F`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#F97E36')
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
            case "ftoc":
                if (temp != null) {
                 
                    tempresult = (temp - 32) * 5/9

                    tempbox.setColor('#F97E36')
                    tempbox.setTitle('The brilliant sun, hot-blooded power!')    
                    tempbox.setTitle("Converting Fahrenheit to Celcius!")
                    tempbox.setThumbnail("https://waa.ai/JEw2.png")
                    tempbox.setDescription(temp, `F is `, tempresult, `C`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#F97E36')
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
            case "ktoc":
                if (temp != null) {
                 
                    tempresult = temp - 273.15

                    tempbox.setColor('#A59CFD')
                    tempbox.setTitle('The light of Wisdom!')    
                    tempbox.setTitle("Converting Kelvin to Celcius!")
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(temp, `K is `, tempresult, `C`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#A59CFD')
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
            case "ktof":
                if (temp != null) {
                 
                    tempresult = (temp - 273.15) * 9/5 + 32 

                    tempbox.setColor('#A59CFD')
                    tempbox.setTitle('The light of Wisdom!')    
                    tempbox.setTitle("Converting Kelvin to Fahrenheit!")
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(temp, `K is `, tempresult, `F`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#A59CFD')
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
            case "ctok":
                if (temp != null) {
                 
                    tempresult = temp + 273.15

                    tempbox.setColor('#A59CFD')
                    tempbox.setTitle('The light of Wisdom!')    
                    tempbox.setTitle("Converting Celcius to Kelvin!")
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(temp, `C is `, tempresult, `K`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#A59CFD')
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
            case "ftok":
                if (temp != null) {
                 
                    tempresult = (temp - 32) * 5/9 + 273.15

                    tempbox.setColor('#A59CFD')
                    tempbox.setTitle('The light of Wisdom!')    
                    tempbox.setTitle("Converting Fahrenheit to Kelvin!")
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(temp, `F is `, tempresult, `K`)
                    return message.channel.send(tempbox);
                }
                else {
                    tempbox.setColor('#A59CFD')
                    tempbox.setThumbnail("https://waa.ai/JEwz.png")
                    tempbox.setDescription(`You didn't enter anything!`)
                    return message.channel.send(tempbox);
                }
        }

	},

}

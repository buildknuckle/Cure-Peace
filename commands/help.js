const { MessageEmbed } = require('discord.js');
const CardModules = require('../modules/Card');

module.exports = {
	name: 'help',
	description: 'Contain all available commands',
  options:[
  ],
	executeMessage(message, args) {
		
	},
  execute(interaction){
      var objEmbed = {
        "title": "Help Command",
        "description": "No more prefix calling needed, instead you can call me with slash command(/) features! Here are the list of available command:",
        "color":CardModules.Properties.embedColor,
        "fields": [
          {
            name:"Public command",
            value:`bio/daily/info`
          },
          {
            "name": "/card",
            "value": "The main content: smile precure line-up command a.k.a Let's play card catching with Peace!"
          },
          {
            "name": "/item",
            "value": "Item command"
          },
          {
            "name": "/pinky",
            "value": "Yes Precure 5 pinky line-up command"
          },
          {
            "name": "/kirakira",
            "value": "Kirakira line-up command"
          },
          {
            "name": "/garden",
            "value": "Heartcatch line-up command"
          },
          {
            "name": "/setting",
            "value": "Setting related to card command"
          },
          {
            "name": "/jankenpon",
            "value": "Play rock-paper-scissors with peace" 
          },
          {
            "name": "/thread",
            "value": "Command peace to join/leave thread" 
          },
          {
            "name": "/anilist",
            "value": "Search with anilist" 
          },
          {
            "name": "/sakugabooru",
            "value": "Search with sakugabooru" 
          },
          {
            "name": "/tracemoe",
            "value": "Reverse search anime pictures with tracemoe" 
          },
        ]
      }
    return interaction.reply({embeds:[new MessageEmbed(objEmbed)]})
  }
};
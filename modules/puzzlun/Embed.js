const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const GProperties = require('./Properties');

const color = Object.freeze({
    pink:GProperties.color.pink.embed_color,
    blue:GProperties.color.blue.embed_color,
    red:GProperties.color.red.embed_color,
    yellow:GProperties.color.yellow.embed_color,
    green:GProperties.color.green.embed_color,
    purple:GProperties.color.purple.embed_color,
    white:GProperties.color.white.embed_color,

    danger:"#fc0303",
    success:"#66d94a"
});

// function footer(text, iconURL) {
//     return { text: text, iconURL: iconURL};
// }

var builderUser = {
    getAvatarUrl(discordUser){
        return discordUser.avatarURL();
    },
    author(discordUser, text, avatarURL=""){
        if(avatarURL==""){
            return {name: text.toString(), icon_url: this.getAvatarUrl(discordUser)};
        } else {
            return {name: text.toString(), icon_url: avatarURL};
        }
    },
    footer(text,iconURL=""){
        return {text: text.toString(), iconURL: iconURL};
    },
}

//footer parameter: { text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' }
function builder(description, userDiscord=null, options = {}){
    var objEmbed = new MessageEmbed({
        description: description.toString(),
    });

    if(`color` in options){
        objEmbed.color = options.color.startsWith("#") ? options.color:color[options.color];
    } else {
        objEmbed.color = color.yellow;
    }

    if(`title` in options) objEmbed.title = options.title;
    if(`objFields` in options) objEmbed.fields = objFields;
    if(`thumbnail` in options) objEmbed.thumbnail = { url: options.thumbnail }
    if(`image` in options) objEmbed.image = { url:options.image }
    if(`fields` in options) objEmbed.fields = options.fields;
    if(`footer` in options) objEmbed.footer = options.footer;

    if(userDiscord!==null){
        if(userDiscord.avatarURL!==undefined){
            objEmbed.author = {
                name: userDiscord.username.toString(),
                icon_url: userDiscord.avatarURL()
            }
        } else {
            objEmbed.author = userDiscord;
        }
    }
    
    return objEmbed;
}

function mini(description, userDiscord=null, objFields=null, color=null, isPrivate = false){
    var objEmbed = new MessageEmbed({
        description: description.toString(),
    });

    if(color!==null){
        objEmbed.color = color.startsWith("#") ? color:Embed.color[color];
    } else {
        objEmbed.color = Embed.color.yellow;
    }

    if(objFields!==null) objEmbed.fields = objFields;

    if(userDiscord!==null){
        objEmbed.author = {
            name: userDiscord.username.toString(),
            icon_url: userDiscord.avatarURL()
        }
    }
    
    return {embeds:[objEmbed], ephemeral: isPrivate ? true:false};
}

function builderMini(description, userDiscord=null, objFields=null, color=null, isPrivate = false){
    var objEmbed = new MessageEmbed({
        description: description.toString(),
    });

    if(color!==null){
        objEmbed.color = color.startsWith("#") ? color:Embed.color[color];
    } else {
        objEmbed.color = Embed.color.yellow;
    }

    if(objFields!==null) objEmbed.fields = objFields;

    if(userDiscord!==null){
        objEmbed.author = {
            name: userDiscord.username.toString(),
            icon_url: userDiscord.avatarURL()
        }
    }
    
    var ret = {embeds:[objEmbed], ephemeral: isPrivate ? true:false}

    return ret;
}

function successMini(description, userDiscord=null, options = {}, color=null, isPrivate = false){
    var objEmbed = new MessageEmbed({
        description: description.toString(),
        thumbnail:{
            url:GProperties.imgSet.mofu.ok,
        }
    });
    
    if(`color` in options){
        objEmbed.color = color.startsWith("#") ? color:Embed.color[color];
    } else {
        objEmbed.color = Embed.color.green;
    }

    if(`title` in options) objEmbed.title = options.title;
    if(`objFields` in options) objEmbed.fields = objFields;
    if(`image` in options) objEmbed.image = { url:options.image }
    if(`fields` in options) objEmbed.fields = options.fields;
    if(`footer` in options) objEmbed.footer = options.footer;

    if(userDiscord!==null){
        objEmbed.author = {
            name: userDiscord.username.toString(),
            icon_url: userDiscord.avatarURL()
        }
    }
    
    return objEmbed;
}

function errorMini(description, userDiscord=null, isPrivateEmbed = false, options = {}){
    var objEmbed = new MessageEmbed({
        color: color.danger,
        description: description.toString(),
        thumbnail:{
            url:GProperties.imgSet.mofu.error,
        }
    });

    if(`color` in options){
        objEmbed.color = options.color.startsWith("#") ? options.color:color[options.color];
    } else {
        objEmbed.color = color.danger;
    }

    if(`title` in options) objEmbed.title = options.title;
    if(`objFields` in options) objEmbed.fields = objFields;
    if(`image` in options) objEmbed.image = { url:options.image }
    if(`fields` in options) objEmbed.fields = options.fields;
    if(`footer` in options) objEmbed.footer = options.footer;

    if(userDiscord!==null){
        objEmbed.author = {
            name: userDiscord.username.toString(),
            icon_url: userDiscord.avatarURL()
        }
    }
    
    var ret = {embeds:[objEmbed], ephemeral: isPrivateEmbed ? true:false}

    return ret;
}

function failMini(description, userDiscord=null, options = {}){
    var objEmbed = new MessageEmbed({
        color: Embed.color.danger,
        description: description.toString(),
        thumbnail:{
            url:GProperties.imgSet.mofu.panic,
        }
    });

    if(`title` in options) objEmbed.title = options.title;
    if(`objFields` in options) objEmbed.fields = objFields;
    if(`image` in options) objEmbed.image = { url:options.image }
    if(`fields` in options) objEmbed.fields = options.fields;
    if(`footer` in options) objEmbed.footer = options.footer;

    if(userDiscord!==null){
        objEmbed.author = {
            name: userDiscord.username.toString(),
            icon_url: userDiscord.avatarURL()
        }
    }
    
    return objEmbed;
}

module.exports = {color, builderUser, builder, mini, 
    builderMini, successMini, errorMini, failMini}
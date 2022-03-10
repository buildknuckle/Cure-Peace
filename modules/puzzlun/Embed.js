const {MessageEmbed} = require('discord.js');
const GProperties = require('./Properties');

class Embed {
    static color = Object.freeze({
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

    static builderUser = {
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
        authorCustom(text, avatarURL=""){
            return {name: text.toString(), icon_url: avatarURL};
        },
        footer(text,iconURL=""){
            return {text: text.toString(), iconURL: iconURL};
        },
    }

    static failMini(description, discordUser=null, isPrivate = false, options = {}){
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
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        return {embeds:[objEmbed], ephemeral: isPrivate ? true:false};
    }

    static errorMini(description, discordUser=null, isPrivateEmbed = false, options = {}){
        var objEmbed = new MessageEmbed({
            color: Embed.color.danger,
            description: description.toString(),
            thumbnail:{
                url:GProperties.imgSet.mofu.error,
            }
        });
    
        if(`color` in options){
            objEmbed.color = options.color.startsWith("#") ? options.color:color[options.color];
        } else {
            objEmbed.color = Embed.color.danger;
        }
    
        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        return {embeds:[objEmbed], ephemeral: isPrivateEmbed ? true:false};
    }

    static successMini(description, discordUser=null, isPrivate = false, options = {}){
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
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        return {embeds:[objEmbed], ephemeral: isPrivate ? true:false};
    }

    //footer parameter: { text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' }
    static builder(description, discordUser=null, options = {}){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
        });
    
        if(`color` in options){
            objEmbed.color = options.color.startsWith("#") ? options.color:this.color[options.color];
        } else {
            objEmbed.color = color.yellow;
        }
    
        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`thumbnail` in options) objEmbed.thumbnail = { url: options.thumbnail }
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        return objEmbed;
    }
    
    static mini(description, discordUser=null, objFields=null, color=null, isPrivate = false){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
        });
    
        if(color!==null){
            objEmbed.color = color.startsWith("#") ? color:this.color[color];
        } else {
            objEmbed.color = Embed.color.yellow;
        }
    
        if(objFields!==null) objEmbed.fields = objFields;
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        return {embeds:[objEmbed], ephemeral: isPrivate ? true:false};
    }
    
    static builderMini(description, discordUser=null, objFields=null, color=null, isPrivate = false){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
        });
    
        if(color!==null){
            objEmbed.color = color.startsWith("#") ? color:Embed.color[color];
        } else {
            objEmbed.color = Embed.color.yellow;
        }
    
        if(objFields!==null) objEmbed.fields = objFields;
    
        if("username" in discordUser){
            objEmbed.author = {
                name: discordUser.username.toString(),
                icon_url: discordUser.avatarURL()
            }
        } else {
            objEmbed.author = discordUser;
        }
        
        var ret = {embeds:[objEmbed], ephemeral: isPrivate ? true:false}
    
        return ret;
    }
}

module.exports = Embed;
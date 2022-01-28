const {MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed, Discord} = require('discord.js');
const Properties = require('./Properties');

module.exports = class Embed {
    static color = {
        pink:"#FEA1E6",
        blue:"#7FC7FF",
        red:"#FF9389",
        yellow:"#FDF13B",
        green:"#7CF885",
        purple:"#897CFE",
        white:"#FFFFEA",

        danger:"#fc0303",
        success:"#66d94a"
    };

    //footer parameter: { text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' }

    static builder(description, objUserData=null, options = {}){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
        });

        if(`color` in options){
            objEmbed.color = options.color.startsWith("#") ? options.color:Embed.color[options.color];
        } else {
            objEmbed.color = Embed.color.yellow;
        }

        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`thumbnail` in options) objEmbed.thumbnail = { url: options.thumbnail }
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;

        if(objUserData!==null){
            objEmbed.author = {
                name: objUserData.username.toString(),
                icon_url: objUserData.avatarUrl
            }
        }
        
        return objEmbed;
    }

    static defaultMini(description, objUserData=null, objFields=null, color=null, isPrivateEmbed = false){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
        });

        if(color!==null){
            objEmbed.color = color.startsWith("#") ? color:Embed.color[color];
        } else {
            objEmbed.color = Embed.color.yellow;
        }

        if(objFields!==null) objEmbed.fields = objFields;

        if(objUserData!==null){
            objEmbed.author = {
                name: objUserData.username.toString(),
                icon_url: objUserData.avatarUrl
            }
        }
        
        var ret = {embeds:[objEmbed], ephemeral: isPrivateEmbed ? true:false}

        return ret;
    }

    static successBuilder(description, objUserData=null, options = {}){
        var objEmbed = new MessageEmbed({
            description: description.toString(),
            thumbnail:{
                url:Properties.imgMofu.ok,
            }
        });
        
        if(`color` in options){
            objEmbed.color = options.color.startsWith("#") ? options.color:Embed.color[options.color];
        } else {
            objEmbed.color = Embed.color.green;
        }

        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;

        if(objUserData!==null){
            objEmbed.author = {
                name: objUserData.username.toString(),
                icon_url: objUserData.avatarUrl
            }
        }
        
        return objEmbed;
    }
    
    // static defaultSuccessful(title, objFields=null, objFields=null, description, objUserData=null, color=null, isPrivateEmbed = false){
    //     var objEmbed = new MessageEmbed({
    //         color:  color==null ? Embed.color.yellow : Embed.color[color],
    //         title: title,
    //         description: description.toString(),
    //         thumbnail:{
    //             url:Properties.imgResponse.ok,
    //         }
    //     });

    //     if(objUserData!==null){
    //         objEmbed.author = {
    //             name: objUserData.username.toString(),
    //             icon_url: objUserData.avatarUrl
    //         }
    //     }
        
    //     var ret = {embeds:[objEmbed],ephemeral:false}
    //     if(isPrivateEmbed) ret.ephemeral = true;

    //     return ret;
    // }

    static errorMini(description, objUserData=null, isPrivateEmbed = false, options = {}){
        var objEmbed = new MessageEmbed({
            color: Embed.color.danger,
            description: description.toString(),
            thumbnail:{
                url:Properties.imgMofu.error,
            }
        });

        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;

        if(objUserData!==null){
            objEmbed.author = {
                name: objUserData.username.toString(),
                icon_url: objUserData.avatarUrl
            }
        }
        
        var ret = {embeds:[objEmbed], ephemeral: isPrivateEmbed ? true:false}

        return ret;
    }

    static failMini(description, objUserData=null, options = {}){
        var objEmbed = new MessageEmbed({
            color: Embed.color.danger,
            description: description.toString(),
            thumbnail:{
                url:Properties.imgMofu.panic,
            }
        });

        if(`title` in options) objEmbed.title = options.title;
        if(`objFields` in options) objEmbed.fields = objFields;
        if(`image` in options) objEmbed.image = { url:options.image }
        if(`fields` in options) objEmbed.fields = options.fields;
        if(`footer` in options) objEmbed.footer = options.footer;

        if(objUserData!==null){
            objEmbed.author = {
                name: objUserData.username.toString(),
                icon_url: objUserData.avatarUrl
            }
        }
        
        return objEmbed;
    }

}
class Properties {
    static style = {
        color:'#efcc2c',
        imgResponse:{
            imgOk: "https://waa.ai/JEwn.png",
            imgError: "https://waa.ai/JEw5.png",
            imgFailed: "https://waa.ai/JEwr.png"
        }
    }
}

class Battle {
    static battleSpecialActivated(embedColor,userUsername,userAvatarUrl,packName,
        level_special,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}**!`,
            description: `**${Properties.dataCardCore[packName].alter_ego}** has used the special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            },
        });
    }
    
    static teamBattleSpecialActivated(embedColor,userUsername,userAvatarUrl,seriesName,packName,teamName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.seriesCardCore[seriesName].special_name}**!`,
            description: `**${teamName}** has used the team special attack and defeat the tsunagarus instantly!`,
            fields: [
                {
                    name:"Party Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            },
        });
    }
    
    static teamBattleSpecialActivatedHitOne(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `**${Properties.dataCardCore[packName].special_attack}**!`,
            description: `**${userUsername}** has used the special attack and take down **${embedColor}** color!`,
            fields: [
                {
                    name:"Party Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            },
        });
    }
    
    static battleSpecialReady(userUsername,userAvatarUrl,individual=true){
        var txtDescription = `Your special point is ready now! You can use the special attack on the next battle spawn.`;
        if(!individual){
            txtDescription = `Your party special point has been fully charged!.`;
        }
        return new MessageEmbed({
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Special Point Fully Charged!`,
            description: txtDescription,
            thumbnail:{
                url:Properties.imgResponse.imgOk
            }
        });
    }
    
    static battleHitHpSuccess(embedColor,packName,userUsername,userAvatarUrl,txtDescription,txtBuffDebuff,txtReward,txtHp){
        if(txtBuffDebuff!=""){
            txtBuffDebuff = `\n\n**Status Effects:**\n${txtBuffDebuff}`;
        }
    
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Nice Hit!`,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `${txtDescription}${txtBuffDebuff}`,
            fields:[
                {
                    name:`Contribution Rewards:`,
                    value:`${txtReward}`
                },
                {
                    name:`💔 Tsunagarus Hp:`,
                    value:`${txtHp}`
                }
            ]
        }
    
        return new MessageEmbed(objEmbed);
    }
    
    static battleEnemyActions(enemyType,txtHeader,txtDescription,txtSpawnLink=""){
        var objEmbed = {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor,
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            title: txtHeader,
            description: txtDescription
        }
    
        if(txtSpawnLink!=""){
            objEmbed.fields = {
                name:"Spawn Link:",
                value:`[Jump To Enemy Spawn](${txtSpawnLink})`
            }
        }
    
        return new MessageEmbed(objEmbed);
    }
    
    static battleEnemyActionsBlock(embedColor,packName,userUsername,userAvatarUrl,txtHeader,txtDescription){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            title: txtHeader,
            description: `${txtDescription}`
        }
        
        return new MessageEmbed(objEmbed);
    }
    
    static battleEnemyActionsPrepare(enemyType,txtHeader,txtDescription){
        var objEmbed = {
            color: TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].embedColor,
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            title: `Next Actions: ${txtHeader}`,
            description: `${enemyType} will prepare: **${txtDescription}** for the next actions!`
        }
    
        return new MessageEmbed(objEmbed);
    }

    static battleHitHpFail(embedColor,enemyType,userUsername,userAvatarUrl,txtHeader,txtDescription,txtHp){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: txtHeader,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            thumbnail:{
                url:TsunagarusModules.Properties.enemySpawnData.tsunagarus[enemyType].image
            },
            description: txtDescription,
            fields:[
                {
                    name:`💔 Tsunagarus Hp:`,
                    value:`${txtHp}`
                },
            ]
        }
    
        return new MessageEmbed(objEmbed);
    }
    
    static battleWin(embedColor,userUsername,userAvatarUrl,packName,rewardsReceived){
        return new MessageEmbed({
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `With the help of **${Properties.dataCardCore[packName].alter_ego}**, **${userUsername}** has won the battle against tsunagarus!`,
            fields: [
                {
                    name:"Battle Rewards:",
                    value:rewardsReceived,
                    inline:false
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        })
    }
    
    static battleLost(userUsername,userAvatarUrl,_description,rewardsReceived,debuff_data="",txtSpawnLink){
        var objEmbed = {
            color: Properties.embedColor,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: `Defeated!`,
            thumbnail:{
                url:Properties.imgResponse.imgFailed
            },
            description: _description,
            fields: []
        }
    
        objEmbed.fields[objEmbed.fields.length] =  {
            name:"Battle Rewards:",
            value:rewardsReceived,
            inline:true
        }
    
        if(debuff_data!=""){
            objEmbed.fields[objEmbed.fields.length] = {
                name : "⬇️ Debuff inflicted!",
                value: `**${StatusEffect.debuffData[debuff_data].name}**:\n${StatusEffect.debuffData[debuff_data].description}`,
                inline:true
            }
        }
    
        objEmbed.fields[objEmbed.fields.length] =  {
            name:"Spawn Link:",
            value:`[Jump To Enemy Spawn](${txtSpawnLink})`,
            inline:true
        }
        
        return new MessageEmbed(objEmbed);
    }
    
    static teamBattleWin(packName,seriesName,partyName,txtReward){
        return new MessageEmbed({
            color: Properties.embedColor,
            title: `Tsunagarus Defeated!`,
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${partyName}** has won the battle against tsunagarus!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.seriesCardCore[seriesName].img_team_attack
            }
        })
    }
    
    static teamBattleHit(embedColor,packName,userUsername,userAvatarUrl,txtDescription,txtBuffDebuff,txtReward,txtSpawnLink){
        if(txtBuffDebuff!=""){
            txtBuffDebuff = `\n\n**Status Effects:**\n${txtBuffDebuff}`;
        }
    
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Nice Hit!`,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `${txtDescription}${txtBuffDebuff}`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                },
                {
                    name:"Spawn Link:",
                    value:`[Jump To Enemy Spawn](${txtSpawnLink})`
                },
            ]
        }
        
        return new MessageEmbed(objEmbed);
    }
    
    static teamBattleLivesDown(embedColor,packName,userUsername,userAvatarUrl,txtReward){
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            title: `Color Down!`,
            author: {
                iconURL:userAvatarUrl,
                name: userUsername
            },
            thumbnail:{
                url:Properties.dataCardCore[packName].icon
            },
            description: `**${embedColor}** color has been taken down!`,
            fields:[
                {
                    name:`Party Rewards:`,
                    value:`${txtReward}`
                }
            ],
            image:{
                url:Properties.dataCardCore[packName].img_special_attack
            }
        }
        
        return new MessageEmbed(objEmbed);
    }

}

class Card {
    static avatarView(embedColor,userUsername,userAvatarUrl,packName,
        level,hp,atk,level_special,thumbnail,cardId,rarity,type=Properties.cardCategory.normal.value,
        henshinForm="normal"){
        //embedColor in string and will be readed on Properties class: object variable
        var transformQuotes = Properties.dataCardCore[packName].transform_quotes;
        // if("transform_super_quotes" in Properties.dataCardCore[packName]){
        //     transformQuotes = Properties.dataCardCore[packName].transform_super_quotes;
        // }

        var imgTransformation = Properties.dataCardCore[packName].icon;//default transformation image

        if("img_transformation" in Properties.dataCardCore[packName]){
            if(Properties.dataCardCore[packName].img_transformation.length>0){
                imgTransformation = GlobalFunctions.randomArrayItem(Properties.dataCardCore[packName].img_transformation);
            }
        }
        
        var objEmbed = {
            color: Properties.dataColorCore[embedColor].color,
            author: {
                name: userUsername,
                icon_url: userAvatarUrl
            },
            title: Properties.dataCardCore[packName].henshin_phrase,
            description: transformQuotes,
            fields:[
                {
                    name:`${rarity}⭐ ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                    value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                    inline:true
                }
            ],
            // thumbnail:{
            //     url:selectedIcon
            // },
            image:{ url:imgTransformation },
            footer:{ text:`Cure Avatar ID: ${cardId}` }
        }

        var henshinFormData = null;
        if(henshinForm.toLowerCase()=="normal"){
            objEmbed.thumbnail = { url:Properties.dataCardCore[packName].icon }
        } else {
            henshinFormData = Properties.dataCardCore[packName].form[henshinForm];
            objEmbed.title = henshinFormData.quotes_head;
            objEmbed.description = henshinFormData.quotes_description;
            objEmbed.thumbnail = { url:henshinFormData.img_url }
            objEmbed.fields = [
                {
                    name:`${rarity}⭐ ${henshinFormData.name} Lv.${level}`,
                    value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                    inline:true
                }
            ]
        }

        switch(type){
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                if(henshinForm=="normal"){
                    objEmbed.fields = [
                        {
                            name:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ Gold ${Properties.dataCardCore[packName].alter_ego} Lv.${level}`,
                            value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }
                    ];
                } else {
                    objEmbed.fields = [
                        {
                            name:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ Gold ${henshinFormData.name} Lv.${level}`,
                            value:`**HP: **${Status.getHp(level,hp)}\n**Atk:** ${Status.getAtk(level,atk)}\n**Special**: ${Properties.dataCardCore[packName].special_attack} Lv.${level_special}`,
                            inline:true
                        }
                    ];
                }
                
                break;
        }
        
        return new MessageEmbed(objEmbed);
    }

    static captureNew(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"New Card!",
            description: `**${username}** has received new card!`,
            thumbnail:{
                url:Properties.imgResponse.imgOk
            },
            fields:[
                {
                    name:"Rewards:",
                    value:`>**New Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static captureDuplicate(embedColor,id_card,
    cardName,pointReward,seriesCurrency,imgUrl,avatarImgUrl,username,seriesPoint=0,cardQty=1){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"Duplicate Card",
            description: `**${username}** has received another duplicate card.`,
            thumbnail:{
                url:imgUrl
            },
            fields:[
                {
                    name:"Rewards:",
                    value:`>**${cardQty}x Dup Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static captureDuplicateMaxCard(embedColor,id_card,
    cardName,pointReward,seriesCurrency,avatarImgUrl,username,seriesPoint=0){
        if(seriesPoint==0){
            seriesPoint = pointReward;
        }
        return new MessageEmbed({
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:avatarImgUrl,
                name:username
            },
            title:"Duplicate Card",
            description: `**${username}** cannot receive another dupe of this card anymore.`,
            fields:[
                {
                    name:"Rewards:",
                    value:`>**Overcapped Dup Card: **${id_card} - ${cardName}\n>${pointReward} ${embedColor} points\n>${seriesPoint} ${seriesCurrency}`
                }
            ]
        });
    }

    static detail(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,receivedDate,
        level,max_hp,max_atk,special_level,stock=0,ability1,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable

        var customReceivedDate = GlobalFunctions.convertDateTime(receivedDate);

        var txtPartyAbility = "-";
        if(ability1 in StatusEffect.partyBuffData)
            txtPartyAbility = `**${StatusEffect.partyBuffData[ability1].name}:**\n${StatusEffect.partyBuffData[ability1].description}`;

        var embedColor = Properties.dataCardCore[packName].color;
        var skillsData = Properties.dataColorCore[embedColor].skills[1];
        var skillsCpCost = Properties.dataColorCore[embedColor].skills[1].cp_cost;
        var skillsName = skillsData.buff_data.name;
        var skillsDescription = skillsData.buff_data.description;

        var objEmbed = {
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} | Next CP: ${Leveling.getNextCardExp(level)}`
            },
            title:`${cardName}`,
            description:`**Party Ability:**\n>${txtPartyAbility}\n\n**Battle Skills:**\n>**${skillsName} (${skillsCpCost} CP)**:\n${skillsDescription}`,
            image:{ url:imgUrl },
            fields:[
                {
                    name:"ID:",
                    value:id_card,
                    inline:true
                },
                {
                    name:"Series:",
                    value:series,
                    inline:true
                },
                {
                    name:"Rarity:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost} :star:`,
                    inline:true
                },
                {
                    name:`❤️HP:`,
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`Received at: ${customReceivedDate}`
            }
        }

        //modify the card
        switch(type){
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory.gold.color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }

        if(stock>=1) objEmbed.footer.text+= ` | Dup:${stock}`;
        return new MessageEmbed(objEmbed);
    }

    static capture(embedColor,id_card,packName,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,currentCardTotal,
        max_hp,max_atk,cardStock=0){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here

        var objEmbed = {
            color:Properties.dataColorCore[embedColor].color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`${GlobalFunctions.capitalize(packName)} Card Pack`
            },
            title:cardName,
            image:{
                url:imgUrl
            },
            fields:[
                {
                    name:"ID:",
                    value:id_card,
                    inline:true
                },
                {
                    name:"Series:",
                    value:series,
                    inline:true
                },
                {
                    name:"Rarity:",
                    value:`${String(rarity)} :star:`,
                    inline:true
                },
                {
                    name:"HP:",
                    value:`${String(max_hp)}`,
                    inline:true
                },
                {
                    name:"Atk:",
                    value:`${Status.getAtk(1,max_atk)}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:Properties.dataCardCore[packName].special_attack,
                    inline:true
                }
            ]
        }

        if(cardStock>=1){
            objEmbed["footer"] = {
                iconURL:avatarImgUrl,
                text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total}) x${cardStock}`
            }
        } else {
            objEmbed["footer"] = {
                iconURL:avatarImgUrl,
                text:`Captured By: ${username} (${currentCardTotal}/${Properties.dataCardCore[packName].total})`
            }
        }

        return new MessageEmbed(objEmbed);
    }

    static cardLevelUp(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,totalLevelUp,
        level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here

        var hpHeader = "HP: "; var modifiedHp = "";
        var _color = Properties.dataCardCore[packName].color;
        _color = Properties.dataColorCore[_color].color;
        if(Status.getModifiedHp(level,max_hp)>0){
            hpHeader += Status.getHp(level,max_hp);
            modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
        }

        var objEmbed = {
            color:_color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} (Lv+ ${totalLevelUp}/Next CP: ${Leveling.getNextCardExp(level)})`
            },
            title:`${String(cardName)}`,
            thumbnail:{ url:imgUrl },
            fields:[
                {
                    name:"❤️HP:",
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:"Rarity/Series:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ ${series}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`ID Card: ${id_card}`
            }
        }

        switch(type){
            //override color from card type
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }

        return new MessageEmbed(objEmbed);
    }

    static levelUpDefault(packName,id_card,
        cardName,imgUrl,series,rarity,avatarImgUrl,username,totalLevelUp,
        level,max_hp,max_atk,special_level,type=Properties.cardCategory.normal.value){
        //embedColor in string and will be readed on Properties class: object variable
        //received date readed from db, will be converted here

        var hpHeader = "HP: "; var modifiedHp = "";
        var _color = Properties.dataCardCore[packName].color;
        _color = Properties.dataColorCore[_color].color;
        if(Status.getModifiedHp(level,max_hp)>0){
            hpHeader += Status.getHp(level,max_hp);
            modifiedHp = `(+${Status.getModifiedHp(level,max_hp)})`;
        }

        var objEmbed = {
            color:_color,
            author:{
                iconURL:Properties.dataCardCore[packName].icon,
                name:`Level ${level}/${Leveling.getMaxLevel(rarity)} (Next CP: ${Leveling.getNextCardExp(level)})`
            },
            title:`${String(cardName)}`,
            thumbnail:{ url:imgUrl },
            fields:[
                {
                    name:"❤️HP:",
                    value:`${String(Status.getHp(level,max_hp))}`,
                    inline:true
                },
                {
                    name:"⚔️Atk:",
                    value:`${String(Status.getAtk(level,max_atk))}`,
                    inline:true
                },
                {
                    name:"Rarity/Series:",
                    value:`${rarity+Properties.cardCategory[type].rarityBoost}⭐ ${series}`,
                    inline:true
                },
                {
                    name:`Special:`,
                    value:`${Properties.dataCardCore[packName].special_attack} Lv.${special_level}`,
                    inline:true
                }
            ],
            footer:{
                iconURL:avatarImgUrl,
                text:`ID Card: ${id_card}`
            }
        }

        switch(type){
            //override color from card type
            case Properties.cardCategory.gold.value:
                objEmbed.color = Properties.cardCategory[type].color;
                objEmbed.title = `${cardName} ✨`;
                break;
        }
        
        return new MessageEmbed(objEmbed);
    }

    static packNotFound(){
        return {
            color: Properties.embedColor,
            title : `Card Pack List`,
            description: ":x: I can't find that cure name.\nPack list:",
            fields : [{
                name: `Pink`,
                value: `Nagisa\nSaki\nNozomi\nLove\nTsubomi\nHibiki\nMiyuki\nMana\nMegumi\nHaruka\nMirai\nIchika\nHana\nHikaru\nNodoka\n`,
                inline: true
            },
            {
                name: `Blue`,
                value: `Karen\nMiki\nErika\nEllen\nReika\nRikka\nHime\nMinami\nAoi\nSaaya\nYuni\nChiyu`,
                inline: true
            },
            {
                name: `Yellow`,
                value: `Hikari\nUrara\nInori\nItsuki\nAko\nYayoi\nAlice\nYuko\nKirara\nHimari\nHomare\nElena\nHinata`,
                inline: true
            },
            {
                name: `Purple`,
                value: `Yuri\nMakoto\nIona\nRiko\nYukari\nRuru\nMadoka\nKurumi`,
                inline: true
            },
            {
                name: `Red`,
                value: `Rin\nSetsuna\nAkane\nAguri\nTowa\nAkira\nEmiru`,
                inline: true
            },
            {
                name: `Green`,
                value: `Komachi\nNao\nKotoha\nCiel\nLala`,
                inline: true
            },
            {
                name: `White`,
                value: `Honoka\nMai\nKanade`,
                inline: true
            }]
        }
    }
}

module.exports = {
    Properties, Battle, Card
}
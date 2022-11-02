# Embed.js Module (optional):
This module can be used to help with creating default embed since it's default color, author, description trimmer (1200 words max), read more link, markup parser can be automatically done on this module. To use simply create its new class; e.g:
```
// discordUser parameter are optional and if provided will be automatically converted on any build functions
const embed = new Embed(<discordUser>);
```
There're few provided options setter that're pretty straightforward:
```
// to set author display:
embed.withAuthor = <true/false>

// to set ephemeral value and will be used on `buildEmbed()`:
embed.isPrivate = <true/false>

// to include read more link on description:
embed.withReadmore = <readmore link>
```
Below are setter usage that're commonly used:
```
// to set color with static color variable value:
embed.color = Embed.color.yellow

// to set color with hex value:
embed.color = 0xFDF13B

// to set description:
embed.description = "hello world!";

// to set footer:
embed.setFooter(text, iconUrl)

// to set author:
embed.authorName = "cure peace";
embed.authorIcon = "icon_link.jpg";
embed.authorUrl = "link goes here";

// to add fields
addFields(name, value, inline = false)
```
Then embed can be build/crated with any of these functions:
```
// create single embed:
embed.build()

// fully create single constructed embed and ready to be called with any interaction.reply functions.
// Output results: { embeds:[new EmbedBuilder(this.objEmbed)], ephemeral: this.options.isPrivate }
embed.buildEmbed()

// create single embed with green embed color
embed.buildSuccess()

// create single embed with red color & default title message
embed.buildDanger()
```
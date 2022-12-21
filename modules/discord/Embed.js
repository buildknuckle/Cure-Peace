// const stripIndents = require("common-tags");
// const dedent = require("dedent-js");
const { userMention, EmbedBuilder, hyperlink } = require("discord.js");
const { Color } = require("./Color");
const Img = require("../res/Img");
const typography = require("../helper/typography");

// base class of embed builder
class Embed {
	static defaultColor = Color.yellow.embed_color;
	static color = Object.freeze({
		pink: Color.pink.embed_color,
		orange: Color.orange.embed_color,
		blue: Color.blue.embed_color,
		red: Color.red.embed_color,
		yellow: Color.yellow.embed_color,
		green: Color.green.embed_color,
		purple: Color.purple.embed_color,
		white: Color.white.embed_color,

		danger:0xfc0303,
		success:0x66d94a,
	});

	discordUser = null;
	discordGuild = null;

	objEmbed = {
		description: null,
		title: null,
		image: null,
		thumbnail: null,
		color: null,
		author: {
			name: null,
			icon_url: null,
		},
		// footer: {
		//     text: null,
		//     icon_url: null
		// },
		fields: null,
	};

	options = {
		withAuthor : false,
		isPrivate : false,
		readmoreLink : null,
	};

	constructor(discordUser = null) {
		// set default embed color
		this.objEmbed.color = Embed.defaultColor;

		if (discordUser != null) {
			this.discordUser = discordUser;
			this.convertDiscordUserAuthor();
			this.options.withAuthor = true;
		}

	}

	get mentionUser() {
		return this.discordUser !== null ?
			userMention(this.discordUser.id) : "";
	}

	// options setter:
	set withAuthor(param = true) {
		this.options.withAuthor = param;
	}

	set isPrivate(param = true) {
		this.options.isPrivate = param;
	}

	set withReadmore(link) {
		this.options.readmoreLink = link;
	}

	// objEmbed setter
	set author(objAuthor) {
		this.objEmbed.author = objAuthor;
		this.withAuthor = true;
	}

	set authorIcon(url) {
		this.objEmbed.author.icon_url = url;
	}

	set authorName(name) {
		this.objEmbed.author.name = name;
		this.withAuthor = true;
	}

	set authorUrl(url) {
		this.objEmbed.author.url = url;
	}

	set title(text) {
		this.objEmbed.title = text;
	}

	set thumbnail(url) {
		this.objEmbed.thumbnail = {
			url: url,
		};
	}

	set description(desc) {
		this.objEmbed.description = desc;
	}

	set image(url) {
		this.objEmbed.image = {
			url: url,
		};
	}

	set fields(fields) {
		this.objEmbed.fields = fields;
	}

	set color(color) {
		this.objEmbed.color = color;
	}

	addFields(name, value, inline = false) {
		// init fields if null
		if (!this.objEmbed.fields) this.objEmbed.fields = [];
		// push new array
		this.objEmbed.fields.push({
			name: name,
			value: value,
			inline: inline ? true : false,
		});
	}

	// converter:
	convertDiscordUserAuthor() {
		if (!this.discordUser) return;
		this.objEmbed.author = {
			name: this.discordUser.username.toString(),
			icon_url: this.discordUser.avatarURL(),
		};
	}

	convertImageUrl() {
		if (this.objEmbed.image !== null) {
			this.objEmbed.image = {
				url: this.objEmbed.image,
			};
		}
	}

	convertThumbnailUrl() {
		if (this.objEmbed.thumbnail !== null) {
			this.objEmbed.thumbnail = {
				url: this.objEmbed.thumbnail,
			};
		}
	}

	// check for color if not in hex format
	convertColor() {
		if (!this.objEmbed.color) { this.objEmbed.color = Embed.defaultColor; }
		else if (!Color.isHexColor(this.objEmbed.color)) { this.objEmbed.color = Embed.color[this.objEmbed.color]; }
	}

	// replace tags with mentionable. e.g: <username>/<umention>/<servername>
	convertParser() {
		// replace title
		if (this.objEmbed.title !== null) {

			// replace username
			if (this.discordUser !== null) {
				this.objEmbed.title = this.objEmbed.title
					.replace("<username>", this.discordUser.username);
			}

			// replace server name
			if (this.discordGuild !== null) {
				this.objEmbed.title = this.objEmbed.title
					.replace("<servername>", this.discordGuild.name);

				this.objEmbed.description = this.objEmbed.description
					.replace("<servername>", this.discordGuild.name);
			}
		}

		// replace description
		if (this.objEmbed.description !== null) {

			// replace username
			if (this.discordUser !== null) {
				this.objEmbed.description = this.objEmbed.description
					.replace("<username>", this.discordUser.username)
					.replace("<umention>", this.mentionUser);
			}

			// replace multi line & convert markup
			let desc = typography.markupCleaner(this.objEmbed.description
				.replaceAll("\\n", "\n").replaceAll("\\", ""));

			if (desc.length >= 1200) {
				desc = desc.substring(0, 1200) + " ...";
			}

			if (this.options.readmoreLink) {
				desc += `${hyperlink("[Read more]", this.options.readmoreLink)}`;
			}

			this.description = desc;

		}
	}

	setFooter(text = null, iconUrl = null) {
		if (text == null) return;
		this.objEmbed.footer = {
			text: text,
			icon_url: iconUrl,
		};
	}

	// reset objEmbed except author
	reset() {
		this.objEmbed.description = null;
		this.objEmbed.title = null;
		this.objEmbed.image = null;
		this.objEmbed.thumbnail = null;
		this.objEmbed.color = null;
		this.objEmbed.fields = null;
	}

	// return single objEmbed
	build() {
		// convert thumbnail
		// this.convertImageUrl();
		// this.convertThumbnailUrl();
		this.convertColor();
		this.convertParser();

		if (!this.options.withAuthor) {
			this.objEmbed.author = null;
		}

		return new EmbedBuilder(this.objEmbed);
	}

	// fully return single objEmbed
	buildEmbed() {
		// convert thumbnail
		// this.convertImageUrl();
		// this.convertThumbnailUrl();
		this.convertColor();
		this.convertParser();

		if (!this.options.withAuthor) {
			this.objEmbed.author = null;
		}

		const eb = { embeds:[new EmbedBuilder(this.objEmbed)], ephemeral: this.options.isPrivate };
		return eb;
	}

	buildDanger() {
		if (!this.objEmbed.title) { this.objEmbed.title = "❌ Oops"; }
		this.objEmbed.color = Embed.color.danger;
		this.objEmbed.thumbnail = Img.mofu.error;

		return this.buildEmbed();
	}

	buildSuccess() {
		this.objEmbed.color = Embed.color.success;
		this.objEmbed.thumbnail = Img.mofu.ok;

		return this.buildEmbed();
	}

}

// base embed class of validation builder
class EmbedValidation extends Embed {
	isPrivate = true;

	// general
	invalidAmount(min, max) {
		this.objEmbed.title = "❌ Invalid amount";
		this.objEmbed.description = `Please re-enter with valid amount between ${min}-${max}`;
		return this.buildDanger();
	}

	invalidCharacterLength(max) {
		this.objEmbed.title = "❌ Invalid input";
		this.objEmbed.description = `Please re-enter input with maximum of ${max} character`;
		return this.buildDanger();
	}

	// user
	get userNotAvailable() {
		this.objEmbed.title = "❌ I can't find that user";
		this.objEmbed.description = "Please re-enter with specific discord nickname/username";
		return this.buildDanger();
	}

}

module.exports = { Embed, EmbedValidation };
function messageId(_link) {
	const link = _link.split("/").reverse();
	return {
		"message":link[0],
		"channel":link[1],
	};
}

function unicodeToEmoji(_unicode) {
	return String.fromCodePoint(parseInt("0x" + _unicode));
}

function emojiToUnicode(_emoji) {
	return _emoji.codePointAt(0).toString(16);
}

function emojiIsUnicode(raw) {
	return !raw.startsWith("<");
}

function emojiCustom(emojiName, id, animated = false) {
	const anim = animated ? "a" : "";
	return `<${anim}:${emojiName}:${id}>`;
}

function messageLinkFormat(id_guild, id_channel, id_messsage) {
	return `https://discord.com/channels/${id_guild}/${id_channel}/${id_messsage}`;
}

module.exports = { messageId, unicodeToEmoji, emojiToUnicode, emojiIsUnicode, emojiCustom, messageLinkFormat };
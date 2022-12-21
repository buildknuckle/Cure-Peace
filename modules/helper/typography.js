function capitalize(words) {
	const separateWord = words.toLowerCase().split(" ");
	for (let i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
		separateWord[i].substring(1);
	}
	return separateWord.join(" ");
}

function str_pad_left(string, pad, length) {
	// e.g: var finalTime = str_pad_left(minutes,'0',2) will output: 02
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

function markupCleaner(text) {
	text = text.replace(/<br>/g, "");
	text = text.replace(/<i>/g, "*");
	text = text.replace(/<\/i>/g, "*");
	text = text.replace(/<b>/g, "**");
	text = text.replace(/<\/b>/g, "**");
	text = text.replace(/&#039;/g, "'");
	text = text.replace(/&quot;/g, "\"");
	return text;
}

function cutText(text, maxLength) {
	// give ... from the given length
	if (text.length >= maxLength) {
		return text.substring(0, maxLength) + "...";
	}
	else {
		return text;
	}

}

// return all emoji into smaller size on mobile
function emojify(string) {
	return `${string}𝅺`;
}

module.exports = { capitalize, str_pad_left, markupCleaner, cutText, emojify };
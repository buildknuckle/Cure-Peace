function capitalize(words) {
    const separateWord = words.toLowerCase().split(" ");
    for (let i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(" ");
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

module.exports = {capitalize, markupCleaner};
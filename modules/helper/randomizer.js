// get 1 random value from array
function rndArray(arr, n = null) {
	if (n) {
		return arr[Math.floor((Math.random() * arr.length))];
	}
	else {
		const result = new Array(n);
		let	len = arr.length;
		const taken = new Array(len);
		if (n > len) {throw new RangeError("getRandom: more elements taken than available");}
		while (n--) {
			const x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
		}
		return result;
	}
}

// shuffle array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

// generate random number
function rng(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate random crypto number with hex format
function rndCrypto(min = 16) {
	const token = require("crypto").randomBytes(min).toString("hex");
	return token;
}

function rndProperty(obj) {
	const keys = Object.keys(obj);
	return obj[keys[ keys.length * Math.random() << 0]];
}

function rndPropertyKey(obj) {
	const keys = Object.keys(obj);
	return keys[ keys.length * Math.random() << 0];
}

function shuffleText(str) {
	let originalArray = [];
	for (let i = 0;i < str.length;i++) {
		originalArray.push(str[i]);
	}

	originalArray = originalArray.sort(() => Math.random() - 0.5);

	let txt = "";
	for (let i = 0;i < originalArray.length;i++) {
		txt += originalArray[i];
	}

	return txt;
}

module.exports = { rndArray, shuffleArray, rng, rndCrypto, rndProperty, rndPropertyKey, shuffleText };
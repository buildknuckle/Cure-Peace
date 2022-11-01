class Color {
	static pink = {
		value: "pink",
		name: "pink",
		embed_color: 0xFEA1E6,
	};

	static orange = {
		value: "orange",
		name: "orange",
		embed_color: 0xFF890F,
	};

	static blue = {
		value: "blue",
		name: "blue",
		embed_color: 0x7FC7FF,
	};

	static red = {
		value: "red",
		name: "red",
		embed_color: 0xFF9389,
	};

	static yellow = {
		value: "yellow",
		name: "yellow",
		embed_color: 0xFDF13B,
	};

	static green = {
		value: "green",
		name: "green",
		embed_color: 0x7CF885,
	};

	static purple = {
		value: "purple",
		name: "purple",
		embed_color: 0x897CFE,
	};

	static white = {
		value: "white",
		name: "white",
		embed_color: 0xFFFFEA,
	};

	value = null;
	name = null;
	embed_color = null;

	constructor(color = null) {
		if (color !== null) this.getData(color);
	}

	getData(color) {
		this.value = Color[color].value;
		this.name = Color[color].name;
		this.embed_color = Color[color].embed_color;
		return this;
	}

	static isHexColor(hex) {
		return !isNaN(Number(hex));
	}

}

module.exports = { Color };
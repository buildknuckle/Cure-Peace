const Model = require("../modules/Model");

class PeaceStatsModel extends Model {
	get tableName() {
		return "peace_stats";
	}

	get primaryKey() {
		return "id_user";
	}

	get fields() {
		return {
			id_user: "id_user",
			name: "name",
			win: "win",
			loss: "loss",
			draw: "draw",
			points: "points",
		};
	}

	get allowedFields() {
		return [this.fields.id_user, this.fields.name, this.fields.win, this.fields.loss, this.fields.draw, this.fields.points];
	}

	get updateFields() {
		return [this.fields.id_user];
	}

	id_user = null;
	name = null;
	win = 0;
	loss = 0;
	draw = 0;
	points = 0;

}

module.exports = PeaceStatsModel;
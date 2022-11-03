const Model = require("../modules/Model");

class PeaceStatsModel extends Model {
	tableName = "peace_stats";
	primaryKey = "id_user";

	fields = {
		id_user: "id_user",
		name: "name",
		win: "win",
		loss: "loss",
		draw: "draw",
		points: "points",
	};

	allowedFields = [this.fields.id_user, this.fields.name, this.fields.win, this.fields.loss, this.fields.draw, this.fields.points];
	updateFields = [this.fields.id_user];

	id_user = null;
	name = null;
	win = 0;
	loss = 0;
	draw = 0;
	points = 0;

}

module.exports = PeaceStatsModel;
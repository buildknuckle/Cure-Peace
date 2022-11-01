const Model = require("../modules/Model");

class PeaceStatsModel extends Model {
	tableName = "peace_stats";
	primaryKey = "id_user";

	schema = {
		id_user: "id_user",
		name: "name",
		win: "win",
		loss: "loss",
		draw: "draw",
		points: "points",
	};

	allowedFields = [this.schema.id_user, this.schema.name, this.schema.win, this.schema.loss, this.schema.draw, this.schema.points];
	updateFields = [this.schema.id_user];

	id_user = null;
	name = null;
	win = 0;
	loss = 0;
	draw = 0;
	points = 0;

}

module.exports = PeaceStatsModel;
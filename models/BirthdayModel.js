const Model = require("../modules/Model");

class BirthdayModel extends Model {
	tablename = "birthday";

	schema = {
		id: "id",
		id_guild: "id_guild",
		id_user: "id_user",
		birthday: "birthday",
		label: "label",
		notes: "notes",
		enabled: "enabled",
	};
}

module.exports = BirthdayModel;
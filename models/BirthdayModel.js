const Model = require("../modules/Model");

class BirthdayModel extends Model {
	tableName = "birthday";
	primaryKey = "id";

	schema = {
		id: "id",
		id_guild: "id_guild",
		id_user: "id_user",
		birthday: "birthday",
		label: "label",
		notes: "notes",
		enabled: "enabled",
	};

	allowedFields = [this.schema.id, this.schema.id_guild, this.schema.id_user, this.schema.birthday, this.schema.label, this.schema.notes, this.schema.enabled];
	updateFields = [this.schema.id];

	id = null;
	id_guild = null;
	id_user = null;
	birthday = null;
	label = null;
	notes = null;
	enabled = null;

}

module.exports = BirthdayModel;
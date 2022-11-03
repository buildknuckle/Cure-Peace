const Model = require("../modules/Model");

class BirthdayModel extends Model {
	tableName = "birthday";
	primaryKey = "id";

	fields = {
		id: "id",
		id_guild: "id_guild",
		id_user: "id_user",
		birthday: "birthday",
		label: "label",
		notes: "notes",
		enabled: "enabled",
	};

	allowedFields = [this.fields.id, this.fields.id_guild, this.fields.id_user, this.fields.birthday, this.fields.label, this.fields.notes, this.fields.enabled];
	updateFields = [this.fields.id];

	id = null;
	id_guild = null;
	id_user = null;
	birthday = null;
	label = null;
	notes = null;
	enabled = null;

}

module.exports = BirthdayModel;
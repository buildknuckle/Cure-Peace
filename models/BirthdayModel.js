const Model = require("../modules/Model");

class BirthdayModel extends Model {
	get tableName() {
		return "birthday";
	}

	get primaryKey() {
		return "id";
	}

	get fields() {
		return {
			id: "id",
			id_guild: "id_guild",
			id_user: "id_user",
			birthday: "birthday",
			label: "label",
			notes: "notes",
			enabled: "enabled",
		};
	}

	get allowedFields() {
		return [this.fields.id_guild, this.fields.id_user, this.fields.birthday, this.fields.label, this.fields.notes, this.fields.enabled];
	}

	get updateFields() {
		return [this.fields.id];
	}

	id = null;
	id_guild = null;
	id_user = null;
	birthday = null;
	label = null;
	notes = null;
	enabled = null;

}

module.exports = BirthdayModel;
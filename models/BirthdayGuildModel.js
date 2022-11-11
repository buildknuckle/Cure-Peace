const Model = require("../modules/Model");

class BirthdayGuildModel extends Model {
	get tableName() {
		return "birthday_guild";
	}

	get primaryKey() {
		return "id_guild";
	}

	get fields() {
		return {
			id_guild: "id_guild",
			id_notification_channel: "id_notification_channel",
			notification_hour: "notification_hour",
			enabled: "enabled",
		};
	}

	get allowedFields() {
		return [this.fields.id_guild, this.fields.id_notification_channel, this.fields.notification_hour, this.fields.enabled];
	}

	get updateFields() {
		return [this.fields.id_user];
	}

	id_guild = null;
	id_notification_channel = null;
	notification_hour = null;
	enabled = null;

}

module.exports = BirthdayGuildModel;
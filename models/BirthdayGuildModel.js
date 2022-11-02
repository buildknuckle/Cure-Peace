const Model = require("../modules/Model");

class BirthdayGuildModel extends Model {
	tableName = "birthday_guild";
	primaryKey = "id_guild";

	schema = {
		id_guild: "id_guild",
		id_notification_channel: "id_notification_channel",
		notification_hour: "notification_hour",
		enabled: "enabled",
	};

	allowedFields = [this.schema.id_guild, this.schema.id_notification_channel, this.schema.notification_hour, this.schema.enabled];
	updateFields = [this.schema.id_user];

	id_guild = null;
	id_notification_channel = null;
	notification_hour = null;
	enabled = null;

}

module.exports = BirthdayGuildModel;
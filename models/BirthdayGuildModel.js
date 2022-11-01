const Model = require("../modules/Model");

class BirthdayGuildModel extends Model {
	tablename = "birthday_guild";
	primaryKey = "id_guild";

	schema = {
		id_guild: "id_guild",
		id_notification_channel: "id_notification_channel",
		notification_hour: "notification_hour",
		enabled: "enabled",
	};
}

module.exports = BirthdayGuildModel;
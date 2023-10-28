const dotenv = require("dotenv").config();
const fs = require("fs");

module.exports = {
	errorLog(log) {
		const log_file = dotenv.parsed.LOG_FILE;
		// synchronous check
		const fileExists = fs.existsSync(log_file);
		if (!fileExists) {
			console.log("Created an error log since it doesn't exist yet");
			fs.openSync(log_file, 'w');
		}
		fs.appendFile(log_file, `${log}\n`, function(err) {
			if (err) throw err;
		});
	},
};
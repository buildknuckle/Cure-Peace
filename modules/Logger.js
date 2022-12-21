const dotenv = require("dotenv").config();
const fs = require("fs");

module.exports = {
	errorLog(log) {
		fs.appendFile(dotenv.parsed.log_files, `${log}\n`, function(err) {
			if (err) throw err;
		});
	},
};
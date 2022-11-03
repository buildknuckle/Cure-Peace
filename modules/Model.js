const DB = require("./Database");

class Model {
	static DB = DB;

	// default primary key columns
	primaryKey = "id";

	// tablename of the model
	tableName = "";

	// lists of fields name
	fields = {};

	// default allowed fields on insert/update
	allowedFields = [];
	// default where fields on update
	updateFields = [
		this.primaryKey,
	];

	// id = null;

	constructor() {
		// set primary key to default value
		// this[this.primaryKey] = null;
	}

	// set data from db variable assignment
	setData(data) {
		for (const key in data) {
			this[key] = data[key];
		}
	}

	// check if data existed
	hasData() {
		return this[this.primaryKey] ? true : false;
	}

	async find(paramWhere) {
		const results = await DB.select(this.tableName, paramWhere);
		this.setData(results);
	}

	async delete(paramWhere) {
		await DB.del(this.tableName, paramWhere);
	}

	// delete by primary key
	async deleteByPrimary() {
		if (!this.hasData()) { return; }
		const mapWhere = new Map();
		mapWhere.set(this.fields[this.primaryKey], this[this.primaryKey]);
		await DB.del(this.tableName, mapWhere);
	}

	// save to db
	async insert(paramInsert = null) {
		let mapInsert = new Map();
		if (paramInsert) {
			mapInsert = paramInsert;
		}
		else {
			this.allowedFields.forEach(item => {
				mapInsert.set(this.fields[item], this[item]);
			});
		}
		const result = await DB.insert(this.tableName, mapInsert);
		return "insertId" in result ? parseInt(result["insertId"]) : false;
	}

	async update(paramSet = null, paramWhere = null) {
		let mapSet = new Map();
		if (paramSet) {
			mapSet = paramSet;
		}
		else {
			this.allowedFields.forEach(item => {
				mapSet.set(this.fields[item], this[item]);
			});
		}

		let mapWhere = new Map();
		if (paramWhere) {
			mapWhere = paramWhere;
		}
		else {
			this.updateFields.forEach(item => {
				mapWhere.set(this.fields[item], this[item]);
			});
		}

		await DB.update(this.tableName, mapSet, mapWhere);
	}

}

module.exports = Model;
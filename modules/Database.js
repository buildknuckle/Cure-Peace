const dotenv = require("dotenv").config();
const DB = require("mariadb");

const conn = DB.createPool({
	host: dotenv.parsed.database_host,
	port: dotenv.parsed.database_port,
	user: dotenv.parsed.database_username,
	password: dotenv.parsed.database_password,
	database: dotenv.parsed.database_database,
	multipleStatements: true,
});

// basic select functions
async function select(tableName, parameterWhere = null) {
	const arrParameterized = [];
	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key}=? AND `;
			arrParameterized.push(value);
		}

		// remove last AND and any whitespace
		_query = _query.replace(/AND\s*$/, "");
		_query += " LIMIT 1";
	}

	const result = await conn.query(_query, arrParameterized);
	return 0 in result ? result[0] : null;
}

// basic multiple select functions
async function selectAll(tableName, parameterWhere = null, parameterOrderBy = null, limit = null) {
	const arrParameterized = [];
	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key}=? AND `;
			arrParameterized.push(value);
		}

		// remove last AND and any whitespace
		_query = _query.replace(/AND\s*$/, "");
	}

	if (parameterOrderBy != null) {
		_query += " ORDER BY ";
		for (const [key, value] of parameterOrderBy.entries()) {
			_query += ` ${key} ${value}, `;
		}
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	if (limit) {
		_query += ` LIMIT ${limit} `;
	}

	return await conn.query(_query, arrParameterized);
}

// basic select functions with or
async function selectOr(tableName, parameterWhere, parameterOrderBy = null, limit = null) {
	// parameterWhere in array[]
	const arrParameterized = [];
	let _query = `SELECT * FROM ${tableName} WHERE `;

	// check where
	for (const keyArr in parameterWhere) {
		const itemArr = parameterWhere[keyArr];
		for (const [key, value] of itemArr.entries()) {
			_query += ` ${key}=? OR `;
			arrParameterized.push(value);
		}
	}

	// remove last AND and any whitespace
	_query = _query.replace(/OR\s*$/, "");

	if (parameterOrderBy != null) {
		_query += " ORDER BY ";
		for (const [key, value] of parameterOrderBy.entries()) {
			_query += ` ${key} ${value}, `;
		}
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	if (limit) {
		_query += ` LIMIT ${limit} `;
	}

	return await conn.query(_query, arrParameterized);
}

// basic select functions with join
async function selectIn(tableName, columns, valWhere, limit = null) {
	// valWhere = array[]
	const arrParameterized = [];

	let _query = `SELECT * FROM ${tableName}
    WHERE ${columns} IN (`;
	valWhere.forEach(val => {
		_query += " ?, ";
		arrParameterized.push(val);
	});

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");
	_query += `) ORDER BY FIELD(${columns}, `;

	valWhere.forEach(val => {
		_query += " ?, ";
		arrParameterized.push(val);
	});

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");
	_query += ")";

	if (limit) {
		_query += ` LIMIT ${limit} `;
	}

	return await conn.query(_query, arrParameterized);
}

// basic select functions with like
async function selectLikeOr(tableName, parameterWhere = null, parameterOrderBy = null, limit = null) {
	const arrParameterized = [];

	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key} LIKE ? OR `;
			arrParameterized.push(value);
		}

		// remove last OR and any whitespace
		_query = _query.replace(/OR\s*$/, "");
	}

	if (parameterOrderBy != null) {
		_query += " ORDER BY ";
		for (const [key, value] of parameterOrderBy.entries()) {
			_query += ` ${key} ${value}, `;
		}
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	if (limit) {
		_query += ` LIMIT ${limit} `;
	}

	return await conn.query(_query, arrParameterized);
}

async function selectLikeAnd(tableName, parameterWhere = null, parameterOrderBy = null, limit = null) {
	const arrParameterized = [];

	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key} LIKE ? AND `;
			arrParameterized.push(value);
		}

		// remove last OR and any whitespace
		_query = _query.replace(/AND\s*$/, "");
	}

	if (parameterOrderBy != null) {
		_query += " ORDER BY ";
		for (const [key, value] of parameterOrderBy.entries()) {
			_query += ` ${key} ${value}, `;
		}
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	if (limit) {
		_query += ` LIMIT ${limit} `;
	}

	return await conn.query(_query, arrParameterized);
}

// basic random select functions
async function selectRandom(tableName, parameterWhere = null, limit = 1) {
	// select 1 random row
	const arrParameterized = [];
	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key}=? AND `;
			arrParameterized.push(value);
		}

		// remove last AND and any whitespace
		_query = _query.replace(/AND\s*$/, "");

	}

	_query += ` ORDER BY RAND() LIMIT ${limit}`;

	return await conn.query(_query, arrParameterized);
}

// basic random select functions with grouping
async function selectRandomNonDuplicate(tableName, parameterWhere = null,
	parameterGroupBy = null, limit = 1) {
	// select 1 random row
	const arrParameterized = [];
	let _query = `SELECT * FROM ${tableName} `;

	// check where
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key}=? AND `;
			arrParameterized.push(value);
		}

		// remove last AND and any whitespace
		_query = _query.replace(/AND\s*$/, "");
	}

	_query += ` GROUP BY ${parameterGroupBy} ORDER BY RAND() LIMIT ${limit}`;

	return await conn.query(_query, arrParameterized);
}

// basic insert functions into table
async function insert(tableName, parameterInsert) {
	const arrParameterized = [];
	let _query = `INSERT INTO ${tableName} `;
	_query += "(";
	for (const [key, value] of parameterInsert.entries()) {
		_query += `${key},`;
		arrParameterized.push(value);
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");
	_query += ") VALUES(";
	arrParameterized.forEach(function() {
		_query += "?,";
	});

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");
	_query += ")";

	return await conn.query(_query, arrParameterized);
}

// basic multiple select function
async function insertBatch(tableName, parameterInsert) {
	// parameter = array[] that contains multiple map:
	// e.g: [
	// Map(2) { 'id_card' => 'akhi501' },
	// Map(2) { 'id_card' => 'mami201' }
	// ]

	const arrParameterized = [];
	let _query = `INSERT INTO ${tableName} `;
	_query += "(";
	for (const [key, _value] of parameterInsert[0].entries()) {
		_query += `${key},`;
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");
	_query += ") VALUES";

	for (let i = 0;i < parameterInsert.length;i++) {
		_query += "(";
		for (const [value] of parameterInsert[i].entries()) {
			arrParameterized.push(value);
			_query += "?,";
		}

		// remove last comma and any whitespace
		_query = _query.replace(/,\s*$/, "");
		_query += "),";
	}

	// remove last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	return await conn.query(_query, arrParameterized);
}

// basic update functions
async function update(tableName, parameterSet, parameterWhere) {
	const arrParameterized = [];
	let _query = `UPDATE ${tableName} SET `;
	// SET
	for (const [key, value] of parameterSet.entries()) {
		_query += ` ${key}=?,`;
		arrParameterized.push(value);
	}

	// remove the last comma and any whitespace
	_query = _query.replace(/,\s*$/, "");

	// check where
	_query += " WHERE ";
	for (const [key, value] of parameterWhere.entries()) {
		_query += ` ${key}=? AND `;
		arrParameterized.push(value);
	}

	// remove the last comma and any whitespace
	_query = _query.replace(/AND\s*$/, "");
	return await conn.query(_query, arrParameterized);
}

// basic delete functions
async function del(tableName, parameterWhere) {
	// delete
	const arrParameterized = [];
	let _query = `DELETE FROM ${tableName} `;
	// WHERE
	_query += " WHERE ";
	for (const [key, value] of parameterWhere.entries()) {
		_query += ` ${key}=? AND `;
		arrParameterized.push(value);
	}

	// remove the last comma and any whitespace
	_query = _query.replace(/AND\s*$/, "");
	// conn.query(query,arrParameterized,function (err) {});
	return await conn.query(_query, arrParameterized);
}

// basic count functions
async function count(tableName, parameterWhere = null) {
	// simple count
	const arrParameterized = [];
	let _query = `SELECT COUNT(*) as total FROM ${tableName} `;

	// check WHERE
	if (parameterWhere != null) {
		_query += " WHERE ";
		for (const [key, value] of parameterWhere.entries()) {
			_query += ` ${key}=? AND `;
			arrParameterized.push(value);
		}

		// remove the last comma and any whitespace
		_query = _query.replace(/AND\s*$/, "");
	}

	// conn.query(query,arrParameterized,function (err) {});
	return await conn.query(_query, arrParameterized);
}

// basic raw query functions
async function query(_query, arrParameterized) {
	return await conn.query(_query, arrParameterized);
}

module.exports = { DB, select, selectRandom, selectRandomNonDuplicate, selectAll,
	selectOr, selectIn, selectLikeOr, selectLikeAnd, insert, insertBatch, update, del, count, query };
const fs = require('fs');
const DB = require('../storage/dbconn');

/*
template to select manual:
DB.conn.query(
        `SELECT * 
        FROM ${DBM_Card_Data.TABLENAME} 
        WHERE ${DBM_Card_Data.columns.id_card}=? LIMIT 1`,[id_card], 
        function (err, rows) {
            rows.forEach(function(row) {
                //console.log(row.name);
                return callback(row);
            });
        }
    );
*/
function selectAll(tableName,parameterWhere,callback){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} WHERE `;
    //WHERE
    for (const [key, value] of parameterWhere.entries()) {
        query += ` ${key}=? AND `;
        arrParameterized.push(value);
    }
    query = query.replace(/AND\s*$/, "");//remove the last comma and any whitespace
    query += " LIMIT 1";
    DB.conn.query(
        query,arrParameterized, 
        function (err, rows) {
            rows.forEach(function(row) {
                //console.log(row.name);
                return callback(row);
            });
        }
    );
}

function insert(tableName,parameter){
    var arrParameterized = [];
    var query = `INSERT INTO ${tableName} `;
    query += `(`;
    for (const [key, value] of parameter.entries()) {
        query += `${key},`;
        arrParameterized.push(value);
    }
    query = query.replace(/,\s*$/, "");//remove the last comma and any whitespace
    query += `) VALUES(`;
    arrParameterized.forEach(function(entry){
        query += `?,`;
    });
    query = query.replace(/,\s*$/, "");//remove the last comma and any whitespace
    query += `)`;
    DB.conn.query(
         query,arrParameterized,
        function (err) {}
    );
}

function update(tableName,parameterSet,parameterWhere){
    var arrParameterized = [];
    var query = `UPDATE ${tableName} SET `;
    //SET
    for (const [key, value] of parameterSet.entries()) {
        query += ` ${key}=?,`;
        arrParameterized.push(value);
    }
    query = query.replace(/,\s*$/, "");//remove the last comma and any whitespace
    //WHERE
    query += " WHERE ";
    for (const [key, value] of parameterWhere.entries()) {
        query += ` ${key}=? AND `;
        arrParameterized.push(value);
    }
    query = query.replace(/AND\s*$/, "");//remove the last comma and any whitespace
    DB.conn.query(query,arrParameterized,function (err) {});
}

module.exports = {selectAll,insert,update};
const fs = require('fs');
const DB = require('../storage/dbconn');

async function select(tableName,parameterWhere){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} WHERE `;
    //WHERE
    for (const [key, value] of parameterWhere.entries()) {
        query += ` ${key}=? AND `;
        arrParameterized.push(value);
    }
    query = query.replace(/AND\s*$/, "");//remove the last AND and any whitespace
    query += " LIMIT 1";
    return await DB.conn.promise().query(query, arrParameterized);
}

async function selectAll(tableName,parameterWhere=null,parameterOrderBy=null){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    if(parameterWhere!=null){
        query+=" WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }
        query = query.replace(/AND\s*$/, "");//remove the last AND and any whitespace
    }
    
    if(parameterOrderBy!=null){
        query+=" ORDER BY ";
        for (const [key, value] of parameterOrderBy.entries()) {
            query += ` ${key} ${value}, `;
        }
    }
    query = query.replace(/,\s*$/, "");//remove the last comma and any whitespace
    
    return await DB.conn.promise().query(query, arrParameterized);
}

async function insert(tableName,parameter){
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
    return await DB.conn.promise().query(query, arrParameterized);
    // DB.conn.query(
    //      query,arrParameterized,
    //     function (err) {}
    // );
}

async function update(tableName,parameterSet,parameterWhere){
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
    // DB.conn.query(query,arrParameterized,function (err) {});
    return await DB.conn.promise().query(query, arrParameterized);
}

module.exports = {DB,select,selectAll,insert,update};
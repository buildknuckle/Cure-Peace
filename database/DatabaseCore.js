const DB = require('../storage/dbconn');

async function select(tableName,parameterWhere = null){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    
    if(parameterWhere!=null){
        query+= " WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }
        query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
        query += " LIMIT 1";
    }
    
    return await DB.conn.query(query, arrParameterized);
}

async function selectAll(tableName, parameterWhere=null, parameterOrderBy=null){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    if(parameterWhere!=null){
        query+=" WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }

        query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
    }
    
    if(parameterOrderBy!=null){
        query+=" ORDER BY ";
        for (const [key, value] of parameterOrderBy.entries()) {
            query += ` ${key} ${value}, `;
        }
    }
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    return await DB.conn.query(query, arrParameterized);
}

async function selectOr(tableName, parameterWhere, parameterOrderBy=null){
    //parameterWhere in array[]
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} WHERE `;

    //WHERE
    for(var keyArr in parameterWhere){
        var itemArr = parameterWhere[keyArr];
        for (const [key, value] of itemArr.entries()) {
            query += ` ${key}=? OR `;
            arrParameterized.push(value);
        }
    }

    query = query.replace(/OR\s*$/, "");//remove last AND and any whitespace

    if(parameterOrderBy!=null){
        query+=" ORDER BY ";
        for (const [key, value] of parameterOrderBy.entries()) {
            query += ` ${key} ${value}, `;
        }
    }
    
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    return await DB.conn.query(query, arrParameterized);
}

async function selectIn(tableName, columns, valWhere){
    //valWhere = array[]
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} 
    WHERE ${columns} IN (`;
    valWhere.forEach(val => {
        query+=` ?, `;
        arrParameterized.push(val);
    });
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    query+=`) ORDER BY FIELD(${columns}, `;
    
    valWhere.forEach(val => {
        query+=` ?, `;
        arrParameterized.push(val);
    });
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    query+=`)`;

    return await DB.conn.query(query, arrParameterized);
}

async function selectLike(tableName, parameterWhere=null, parameterOrderBy=null){
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    if(parameterWhere!=null){
        query+=" WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key} LIKE ? OR `;
            arrParameterized.push(value);
        }

        query = query.replace(/OR\s*$/, "");//remove last OR and any whitespace
    }
    
    if(parameterOrderBy!=null){
        query+=" ORDER BY ";
        for (const [key, value] of parameterOrderBy.entries()) {
            query += ` ${key} ${value}, `;
        }
    }
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    return await DB.conn.query(query, arrParameterized);
}

async function selectRandom(tableName, parameterWhere = null, totalRandom = 1){
    //select 1 random row
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    
    if(parameterWhere!=null){
        query+= " WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }
        query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
        
    }

    query += ` ORDER BY RAND() LIMIT ${totalRandom}`;
    
    return await DB.conn.query(query, arrParameterized);
}

async function selectRandomNonDuplicate(tableName, parameterWhere = null, 
    parameterGroupBy = null, totalRandom = 1){
    //select 1 random row
    var arrParameterized = [];
    var query = `SELECT * FROM ${tableName} `;
    
    if(parameterWhere!=null){
        query+= " WHERE ";
        //WHERE
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }
        query = query.replace(/AND\s*$/, "");//remove last AND and any whitespace
    }

    query += ` GROUP BY ${parameterGroupBy} ORDER BY RAND() LIMIT ${totalRandom}`;
    
    return await DB.conn.query(query, arrParameterized);
}

async function insert(tableName,parameter){
    var arrParameterized = [];
    var query = `INSERT INTO ${tableName} `;
    query += `(`;
    for (const [key, value] of parameter.entries()) {
        query += `${key},`;
        arrParameterized.push(value);
    }
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    query += `) VALUES(`;
    arrParameterized.forEach(function(entry){
        query += `?,`;
    });
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    query += `)`;
    return await DB.conn.query(query, arrParameterized);
    // DB.conn.query(
    //      query,arrParameterized,
    //     function (err) {}
    // );
}

async function insertMultiple(tableName, parameter){
    //parameter = array[] that contains multiple map:
    //e.g: [
    // Map(2) { 'id_card' => 'akhi501' },
    // Map(2) { 'id_card' => 'mami201' }
    // ]
    var arrParameterized = [];
    var query = `INSERT INTO ${tableName} `;
    query += `(`;
    for (const [key, value] of parameter[0].entries()) {
        query += `${key},`;
    }
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
    query += `) VALUES`;

    for(var i=0;i<parameter.length;i++){
        query += `(`;
        for (const [key, value] of parameter[i].entries()) {
            arrParameterized.push(value);
            query += `?,`;
        }
        query = query.replace(/,\s*$/, "");//remove last comma and any whitespace
        query += `),`;
    }
    query = query.replace(/,\s*$/, "");//remove last comma and any whitespace

    return await DB.conn.query(query, arrParameterized);
    return;
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
    return await DB.conn.query(query, arrParameterized);
}

async function del(tableName,parameterWhere){
    //delete
    var arrParameterized = [];
    var query = `DELETE FROM ${tableName} `;
    //WHERE
    query += " WHERE ";
    for (const [key, value] of parameterWhere.entries()) {
        query += ` ${key}=? AND `;
        arrParameterized.push(value);
    }
    query = query.replace(/AND\s*$/, "");//remove the last comma and any whitespace
    // DB.conn.query(query,arrParameterized,function (err) {});
    return await DB.conn.query(query, arrParameterized);
}

async function count(tableName,parameterWhere=null){
    //simple count
    var arrParameterized = [];
    var query = `SELECT COUNT(*) as total FROM ${tableName} `;
    if(parameterWhere!=null){
        //WHERE
        query += " WHERE ";
        for (const [key, value] of parameterWhere.entries()) {
            query += ` ${key}=? AND `;
            arrParameterized.push(value);
        }
        query = query.replace(/AND\s*$/, "");//remove the last comma and any whitespace
    }
    
    // DB.conn.query(query,arrParameterized,function (err) {});
    return await DB.conn.query(query, arrParameterized);
}

module.exports = {DB,select,selectRandom,selectRandomNonDuplicate,selectAll,
    selectOr, selectIn, selectLike, insert, insertMultiple,update,del,count};
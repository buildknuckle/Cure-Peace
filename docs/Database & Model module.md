# >Database & Model.js Module:
This module can be used to help up with database CRUD operation and already extends with Model.js and Database.js with. Basic DB CRUD functions can also be used with this module. Model structure example can be seen inside `models/PeaceStatsModel.js` and model usage example can be seen on `jankenpon.js` command.

Basic model structure:
```
// main table name
tableName = "";

// primary key that'll be used on .hasData() & .deleteByPrimary()
primaryKey = "";

// previously known as columns structure and now changed to schema
schema = {};

// default fields that'll be inserted/updated
allowedFields = [];

// default where fields upon data update
updateFields = [];

// below will be default columns & value that can be called through its model class. e.g:
id_user = null;
win = 0;
lose = 0;
```
To use database model simply create its own class:

```
const peaceStats = new PeaceStatsModel();
```

Usage example:
```
// manipulate model variable with:
peaceStats.name = "Cure Peace";
peaceStats.win +=1 ;

// select 1 data:
await peaceStats.find(<paramWhere>)

// check if data exists:
peaceStats.hasData()

// data insertion:
// if paramInsert was empty then it'll be inserted from assigned variable
await peaceStats.insert(<paramInsert>)

// if paramSet are not filled then set value will be assigned with allowedFields variable
// if paramWhere are not filled then where value will be assigned with updateFields variable
await peaceStats.update(<paramSet>, <paramWhere>)

// delete data by paramWhere:
await peaceStats.delete(<paramWhere>)

// delete data by primary key:
await peaceStats.deleteByPrimary()

// basic DB operation can also be used through .DB static variable:
await PeaceStatsModel.DB.select(tableName, parameterWhere)
```
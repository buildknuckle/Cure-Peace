# Database & Model.js Module:
This module can be used to help with database CRUD operation by extending `Model.js`.

### Basic model structure:
5 getter variable components for model
- `tableName` : main table name
- `primaryKey` : primary key that'll be used on `.hasData()` & `.deleteByPrimary()`
- `fields` : table fields structure
- `allowedFields` : default set fields that'll be inserted/updated
- `updateFields` : default where fields during on `.update()`

```
const Model = require("../modules/Model");

class PeaceStatsModel extends Model {
  get tableName() {
    return "peace_stats";
  }

  get primaryKey() {
    return "id_user";
  }

  get fields() {
    return {
      id_user: "id_user",
      name: "name",
      win: "win",
      loss: "loss",
    };
  }

  get allowedFields() {
    return [this.fields.id_user, this.fields.name, this.fields.win, this.fields.loss];
  }

  get updateFields() {
    return [this.fields.id_user];
  }

  // below will be default fields & value that will be used:
  id_user = null;
  name = null;
  win = 0;
  loss = 0;
}
```
To use database model simply create its own class:

```
const peaceStats = new PeaceStatsModel();
```
___
### Selecting 1 Data:
```
const paramWhere = new Map();
paramWhere.set("id_user", 12345);
await peaceStats.find();
```
___
### Updating Data:
Updating data can be done with variable or parameter.
`allowedFields` getter by default will be used as default `paramSet` and `updateFields` getter by defaults will be used as default `paramWhere`.

- With Variable:
```
peaceStats.win+=5;
await peaceStats.update();
```

- With parameter:

```
const paramSet = new Map();
paramSet.set("win", 5);
const paramWhere = new Map();
paramWhere.set("id_user", 12345);
await peaceStats.update();
```

- With variable and parameter respectively:
```
// update data with variable:
peaceStats.name = "Cure Peace";
peaceStats.win+=5;

// assign the paramWhere:
const paramWhere = new Map();
paramWhere.set("id_user", 12345);
await peaceStats.update(null, paramWhere);
```

___
### Inserting Data:

- with variable:
```
peaceStats.id_user = 12345;
peaceStats.win = 10;
const insertedId = await peaceStats.insert();
// insertedId will be returned after inserting data
console.log(insertedId);
```

- with parameter:
```
const paramInsert = new Map();
paramInsert.set("id_user", 12345);
paramInsert.set("win", 10);
await peaceStats.insert();
```
___
### Delete Data:
- with paramWhere
```
const paramWhere = new Map();
paramWhere.set("id_user", 12345);
await peaceStats.delete(paramWhere);
```

- with primaryKey
```
await peaceStats.deleteByPrimary();
```
___
### Basic DB Query
Basic DB operation can also be used with `.DB` static variable:
```
await PeaceStatsModel.DB.select(tableName, parameterWhere)
await PeaceStatsModel.DB.query("SELECT * FROM tablename")
```

___
### Check if Data exists:
```
peaceStats.hasData()
```
[![Build Status](https://travis-ci.com/dakc/merodb.svg?branch=master)](https://travis-ci.com/dakc/merodb)
[![npm](https://img.shields.io/npm/v/merodb.svg)](https://www.npmjs.com/package/merodb) 
[![GitHub license](https://img.shields.io/github/license/dakc/merodb.svg?style=popout)](https://github.com/dakc/mero/blob/master/LICENSE) 

# Documents
Look here in detail for [HOW TO USE](https://dakc.github.io/merodb/) MeroDB.




# How To Use
## 1. Installation
### Npm
Install the library by using following command.
```
npm install --save-dev merodb
```

Create MeroDB Instance
```
const MeroDB = require("merodb");
var myDb = new MeroDB();
```

### Browser
Load "merodb.min.js" file which is on dist folder.
[SAMPLE](example.html)
```
<script src="./dist/merodb.min.js"></script>
```
Create Instance after the dom contents are loaded.
```
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var myDb = new MeroDB();
    });
</script>
```

### 2. Create Collection
###### &lt;collection name&gt;, &lt;is activate&gt;?
MeroDB can hold multiple collection. As like a "Table" in RDBMS first create COLLECTION.
The first parameter is name of collection.It should be of string type.
```
myDb.createCollection("continent");
```
"createCollection" will return false if failed, Otherwise returns true.
```
var isCreated = myDb.createCollection("continent");
if(isCreated === false){
    console.log("Failed to create collection");
}
```

Get collection list
```
var myCollections = myDb.getCollections();
```
### 3. Activate Collection
###### &lt;collection name&gt;
@returns: boolean (true:success, false:error)
```
var isCollectionActivated = myDb.use("continent");
if(isCollectionActivated == true){
    console.log("collection is activated");
}else{
    console.error(myDb.GetError());
}
```

### 4. Insert Data
###### &lt;collection name&gt;?, &lt;data&gt;
@returns: boolean (true:success, false:error)

| parameter       | type   |  description                 |
| --------------- | ------ | -----------------------------|
| collection name | string | it can be omitted for [active collection](#3-activate-collection) |
| data            | object | data to be inserted in a collection |

```
var data1 = {id:1,place:"Asia",color:"red"};
var data2 = {id:3,place:"Europe",color:"green"};
var collectionName = "continent";
myDb.insert(collectionName,data1);
myDb.insert(collectionName,data2);
```
However, first parameter can be omitted if a collection is activated.
To activate a collection "use" method is executed.
```
myDb.use("continent");
var data1 = {id:5,place:"Africa",color:"blue"};
var data2 = {id:7,place:"America",color:"yellow"};
myDb.insert(data1);
myDb.insert(data2);
```
"use" & "insert" methods will return false if failed, Otherwise returns true.
if second parameter is passed as true while creating collection, 
it will automatically activate the given collection.
```
myDb.createCollection("continent", true);
myDb.insert({id:7,place:"Antartica",color:"pink"});
```

### Create From Existing Object
Collections can be created from existing Objects.
###### &lt;collection name&gt;?, &lt;data&gt;
@returns: boolean (true:success, false:error)

| paramete        | type   |  description                 |
| --------------- | ------ | -----------------------------|
| collection name | string | it can be omitted for [active collection](#3-activate-collection) |
| data            | object | existing data to be inserted in a collection |

```
var userData = [];
userData.push({ id: 1, name: "pk", salary: 10 });
userData.push({ id: 2, name: "ck", age: 20, salary: 20, sex: "M" });
userData.push({ id: 3, name: "dk", create: "2018-01-20", sex: "M", salary: 35 });
userData.push({ id: 4, name: "kk", salary: 25, sex: "M" });
userData.push({ id: 5, name: "kk", salary: 15 });

myDb.loadFromJsonObject("user", userData);
```

### 5. Find
###### &lt;collection name&gt;?, &lt;[condition](#search-condition)&gt;,&lt;column headers&gt;?
@returns: array of documents fulfilling given condition

| parameter             | numbers | usage                         | description                 |
| --------------------- | ------- | ----------------------------- |---------------------------- |
| object                |   1     | search condition              | returns all the document satisfiying this condition |
| object, array         |   2     | search condition, column list | similar to case 1 but only the columns listed will be returned |
| string, object, array |   3     | collection name, search condition, column list | name of collection can be explicitly applied |

```
var searchTableString = "user";
var searchConditionObject = { place: "Asia" };
var resultColumnArray = ["id"];

var searchResult = myDb.find(searchTableString, searchConditionObject);
var searchResult = myDb.find(searchTableString, searchConditionObject, resultColumnArray);
var searchResult = myDb.find(searchConditionObject);
var searchResult = myDb.find(searchConditionObject, resultColumnArray);
```
 ## Search condition
 | name | meaning | usage |
 |------|---------|-----|
 | $e | equals | { id: { $e: 200 } } |
  | $ne | not equal | { id: { $ne: 200 } } |
 | $lt | less then | { id: { $lt: 200 } }
 | $lte | less then or equal | { id: { $lte: 200 } } |
 | $gt | greater then | { id: { $gt: 200 } } |
 | $gte | greater then or equal | { id: { $gte: 200 } }
 | $bt | between | { id: [2, 5] } |
 | $cont | contains | { name: { $cont: "a" } } |
 
##### Uses-1
```
var searchResult = myDb.find("user",{ id: { $gte: 4 } });
```
##### Uses-2
```
var searchResult = myDb.find("user", {
            $or: [{ id: 1 }, { name: "kk" }],
            salary: 15
        });
```
##### Uses-3
```
var searchResult = myDb.find({
            $or: [
                { isbn: { $gte: 2000 } },
                { writer: { $ne: "df" } }
            ],
            name: { $ne: "df" },
            price:{$lt:5000}
        });
```

#### 6. Update
###### &lt;collection name&gt;?, &lt;[condition](#search-condition)&gt;, &lt;new value&gt;
@returns: boolean (true:success, false:error)

| paramet         | type   |  description                 |
| --------------- | ------ | -----------------------------|
| collection name | string | it can be omitted for [active collection](#3-activate-collection) |
| condition       | object | documents fulfilling this condition will be updated with new value  |
| new value       | object | this value will be the new value |

##### Note
if the &lt;new value&gt; does not contain "$set" key then all the the data of the document fulfilling given condition will be replaced with the &lt;new value&gt; object.
```
// create instance of MeroDB
var myDb = new MeroDB();
// create collection with name "user" and activate
myDb.createCollection("user", true);
// insert two documents in the active collection
myDb.insert({ id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15 });
myDb.insert({ id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 });
// update active collection having its documents id = 2
myDb.update({ id: 2 }, { id: 1111, name: "tom" });

// get current data from active collection
var newData = myDb.find({});
console.log(newData[0], newData[1]);
// Object {id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15}
// Object {name: "tom"}
// the result will be as following where second document is completely replaced.
```
If &lt;new value&gt; contains "$set" key then it will update the the keys set.
```
// update active collection having its documents id = 2
myDb.update({ id: 2 }, { $set: { id: 1111, name: "tom" } });

// get current data from active collection
var newData = myDb.find({});
console.log(newData[0], newData[1]);
//Object {id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15}
//Object {id: 1111, name: "tom", enroll: "2017-02-28", sex: "F", salary: 35}
// only id,name were updated.
```

Condition is object which is exactly similar to the condition for find method.
[usable conditions](#search-condition)
##### Uses 1
```
var searchCondition = { id: { $lt: 2 } };
var newData = { $set: { name: "harilarl" } };
myDb.update(searchCondition, newData);
```

Get number of documents updated
```
var updatedNumber = myDb.getDocumentNumAffected();
console.log("number of updated documents is " + updatedNumber);
```

#### 7. Delete
###### &lt;collection name&gt;?, &lt;[condition](#search-condition)&gt;
@returns: boolean (true:success, false:error)
##### Uses 1
Delete from user where id is less then two.
```
var searchCondition = { id: { $lt: 2 } };
var documentName = "user"
var isDelete = myDb.delete(documentName, searchCondition);
if (isDelete == true) {
    console.log("Deleted.");
}
```
Get number of documents deleted
```
var deletedNumber = myDb.getDocumentNumAffected();
console.log("number of deleted documents is " + deletedNumber);
```

### 8. Usefull methods
##### ・updateAlways
###### &lt;filepath&gt;
@returns: boolean (true:success, false:error)

This method only works for nodejs environment. It will output the contents of database on each insert,update,delete action.
```
myDb.updateAlways("./my.db");
```

##### ・save
###### &lt;filepath&gt;
@returns: boolean (true:success, false:error)

This method only works for nodejs environment. It will output the contents of database to given file.
```
myDb.save("./my.db");
```

##### ・getDocumentCount
###### &lt;collection name&gt;?
@returns: number of documents

It will return the number of documents existing on given collection name.
If no collection name is specified then it will return the active collection's row number.
```
var numberRows = myDb.getDocumentCount("user");
```

##### ・getDocumentNumAffected
@returns: number of documents

It will return the number of number of documents collections affected after update and delete process.
```
var searchCondition = { id: { $lt: 2 } };
var documentName = "user"
var isDelete = myDb.delete(documentName, searchCondition);
var numberRowsDeleted = myDb.getDocumentNumAffected();
```

##### ・getActiveCollection
@returns: name of active collection

It will return the name of active collection if exist.
```
var activeCollection = myDb.getActiveCollection();
```

##### ・getError
@returns: error message

It will return error content.
```
var errorMessage = myDb.getError();
```

##### ・getCollections
@returns: array of collection name

It will return all the collections as array
```
var arrayCollection = myDb.getCollections();
```

### Todos
 - Write MORE use cases for find
 - Write MORE use cases for update
 - Write MORE use cases for delete
 - Translate README to JAPANESE
 - Add Encryption for nodejs
 - Add Error Description for every possible case

License
----
[MIT](LICENSE)

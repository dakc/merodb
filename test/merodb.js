const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

// check create collection
describe("creating collection with single parameter collection name", function () {
    let myDb = new MeroDB();
    it("should return true if collection name is set to be valid string", function () {
        assert.isTrue(myDb.createCollection("user"));
    });
    it("should return empty string for error", function () {
        assert.isEmpty(myDb.getError());
    });
    it("should return false if collection name is set to be empty string", function () {
        assert.isFalse(myDb.createCollection(""));
        assert.equal(myDb.getError(),"Collection name should not be empty string.");
    });
    it("should return false if collection name is set to be object", function () {
        assert.isFalse(myDb.createCollection({name:"user"}));
        assert.isFalse(myDb.createCollection(["user"]));
        assert.equal(myDb.getError(),"Collection name should be string.");
    });
});
describe("create collection and activate (passing true as second parameters)", function () {
    let myDb = new MeroDB();
    it("should return true on passing valid string as collection name", function () {
        assert.isTrue(myDb.createCollection("user", true));
    });
    it("should return 「user」 as active collection name", function () {
        assert.equal(myDb.getActiveCollection(),"user");
    });
});


// check for use method
describe("activate collection", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user");
    myDb.createCollection("city");
    it("should return true if existing collection is passed", function () {
        assert.isTrue(myDb.use("user"));
    });
    it("should return empty string for error", function () {
        assert.isEmpty(myDb.getError());
    });
    it("should return false if non-existing collection name is passed", function () {
        assert.isFalse(myDb.use("hogehoge"));
    });
    it("should return error message as 「No any collection found with name 「hogehoge」.", function () {
        assert.equal(myDb.getError(),"No any collection found with name 「hogehoge」.");
    });
    it("should return false if empty string is set as collection name", function () {
        assert.isFalse(myDb.use(""));
    });
    it("should return error message as 「Collection name should not be empty string.」", function () {
        assert.equal(myDb.getError(),"Collection name should not be empty string.");
    });
    it("should return false if object is set as collection name", function () {
        assert.isFalse(myDb.use(["user"]));
        assert.isFalse(myDb.use({ name: "user" }));
    });
    it("should return error message as 「Collection name should be string.」", function () {
        assert.equal(myDb.getError(),"Collection name should be string.");
    });
    it("should return 「author」 as active collection", function () {
        myDb.createCollection("author", true);
        assert.equal(myDb.getActiveCollection(), "author");
    });
    it("should return 「user」 as active collection", function () {
        myDb.use("user");
        assert.equal(myDb.getActiveCollection(), "user");
    });
});

// check for insert method
describe("inserting documents on a collection", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user");
    it("should return false on inserting string", function () {
        assert.isFalse(myDb.insert("adf"));
    });
    it("should return false on inserting boolean", function () {
        assert.isFalse(myDb.insert(true));
    });
    it("should return false on inserting number", function () {
        assert.isFalse(myDb.insert(3));
    });
    it("should return false on inserting valid object without collection name if no collection is activated", function () {
        assert.isFalse(myDb.insert({id:2}));
    });
    it("should return false on inserting to collection that does not exists", function () {
        assert.isFalse(myDb.insert("author",{id:22,name:"oraj"}));
    });
    it("should return true on inserting valid object to existing collection", function () {
        assert.isTrue(myDb.insert("user", { id: 22, name: "oraj" }));
    });
    it("should return true on inserting valid object to activated collection", function () {
        myDb.createCollection("author", true);
        assert.isTrue(myDb.insert("author", { id: 22, name: "oraj" }));
    });
});

// check for find method
describe("finding datas in a collection by passing collection name as a parameter", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user", true);
    // create data to be inserted
    let userData = [];
    userData.push({ id: 1, name: "pk",salary:10 });
    userData.push({ id: 2, name: "ck", age:20,salary:20 });
    userData.push({ id: 3, name: "dk", create:"2018-01-20", sex:"M" ,salary:35});
    userData.push({ id: 4, name: "kk",salary:25 });
    userData.push({ id: 5, name: "kk",salary:15 });
    // execute insertion
    for (let i = 0; i < userData.length; i++){
        myDb.insert(userData[i]);
    }
    myDb.createCollection("author", true);
    myDb.insert({ isbn: 2346, price: 2000, name: "jkst" });

    it("should return an array of single document", function () {
        let searchResult = myDb.find("user", { id: 2 });
        let expectedResult = [
            { id: 2, name: "ck", age:20,salary:20 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return an array of two documents", function () {
        let searchResult = myDb.find("user", { name: "kk" });
        let expectedResult = [
            { id: 4, name: "kk",salary:25 },
            { id: 5, name: "kk",salary:15 }        
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return all the documents from user collection", function () {
        let searchResult = myDb.find("user", {});
        assert.deepEqual(searchResult, userData);
    });
    it("should return an array of two documents with key id only when array of field names are set as third parameter", function () {
        let searchResult = myDb.find("user", { name: "kk" },["id"]);
        let expectedResult = [
            { id: 4 },
            { id: 5 }        
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return two documents.(using greater then or equal to equation)", function () {
        let searchResult = myDb.find("user",{ id: { $gte: 4 } });
        let expectedResult = [
            { id: 4, name: "kk",salary:25 },
            { id: 5, name: "kk",salary:15 } 
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return one document.(using 「or」 and 「and」 equation)", function () {
        let searchResult = myDb.find("user", {
            $or: [{ id: 1 }, { name: "kk" }],
            salary: 15
        });
        let expectedResult = [
            { id: 5, name: "kk",salary:15 } 
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return four documents.(using complex equation)", function () {
        let searchResult = myDb.find("user", {
            $or: [
                { id: { $gte: 200 } },
                { salary: { $lt: 100 } }
            ],
            age: { $gt: 10 },
            name: "ck"
        });
        let expectedResult = [
            { id: 2, name: 'ck', age: 20, salary: 20 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
    it("should return single document from activated collection", function () {
        myDb.insert({ isbn: 1046, price: 5000, name: "sdf", writer: "kcj" });
        let searchResult = myDb.find({
            $or: [
                { isbn: { $gte: 2000 } },
                { writer: { $ne: "df" } }
            ],
            name: { $ne: "df" },
            price:{$lt:5000}
        });
        let expectedResult = [
            { isbn: 2346, price: 2000, name: "jkst" }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
})


// check for delete method
describe("deleting documents on a collection", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user", true);
    // create data to be inserted
    let userData = [];
    userData.push({ id: 1, name: "pk",salary:10 });
    userData.push({ id: 2, name: "ck", age:20,salary:20 , sex:"M" });
    userData.push({ id: 3, name: "dk", create:"2018-01-20", sex:"M" ,salary:35});
    userData.push({ id: 4, name: "kk",salary:25, sex:"M"  });
    userData.push({ id: 5, name: "kk",salary:15 });
    // execute insertion
    for (let i = 0; i < userData.length; i++){
        myDb.insert(userData[i]);
    }
    myDb.createCollection("author", true);
    myDb.insert({ isbn: 2346, price: 2000, name: "jkst" });
    it("should return true and number of collection deleted to be 1 after deletion", function () {
        let isDel = myDb.delete({ isbn: 2346 });
        assert.isTrue(isDel);
        assert.equal(myDb.find({}).length, 0);
        assert.equal(myDb.collAffected(), 1);
    });
    it("should return true and number of collection deleted to be zero  after deletion because the condition is not satisfied", function () {
        let isDel = myDb.delete({ isbn: 3346 });
        assert.isTrue(isDel);
        assert.equal(myDb.collAffected(), 0);
    });
    it("should return true and number of collection deleted to be 2 after deletion", function () {
        let isDel = myDb.delete("user", {  
            $or: [
                { id: { $gte: 5 } },
                { sex: "M" }
            ],
            name: { $ne: "kk" },
            salary:{$gt:10}
        });
        assert.isTrue(isDel);
        assert.equal(myDb.find("user", {}).length, 3);
        assert.equal(myDb.collAffected(), 2);
    });
});

// check for creating database from object
describe("creating database from object", function () {
    let myDb = new MeroDB();
    
    // create data to be inserted
    let userData = [];
    userData.push({ id: 1, name: "pk", salary: 10 });
    userData.push({ id: 2, name: "ck", age: 20, salary: 20, sex: "M" });
    userData.push({ id: 3, name: "dk", create: "2018-01-20", sex: "M", salary: 35 });
    userData.push({ id: 4, name: "kk", salary: 25, sex: "M" });
    userData.push({ id: 5, name: "kk", salary: 15 });
    
    myDb.loadFromJsonObject("user", userData);

    it("should return true on activating existing collection", function () {
        assert.isTrue(myDb.use("user"));
    });
    it("should return false on activating non existing collection", function () {
        assert.isFalse(myDb.use("author"));
    });
    it("should return true and number of collection deleted to be 2 after deletion", function () {
        let isDel = myDb.delete({ id: {$gte:4},salary:{$lt:20} });
        assert.isTrue(isDel);
        assert.equal(myDb.collAffected(), 1);
        assert.equal(myDb.find("user",{}).length, 4);
    });
    it("should return true on inserting valid object", function () {
        assert.isTrue(myDb.insert("user", { id: 22, name: "oraj" }));
    });
    it("should return true on updating valid object", function () {
        assert.isTrue(myDb.update("user", { id: 22, name: "oraj" }, { $set: { name: "harilarl" } }));
        assert.equal(myDb.collAffected(), 1);
    });
});
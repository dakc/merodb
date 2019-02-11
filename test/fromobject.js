const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

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
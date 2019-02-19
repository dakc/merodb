const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

// check for find method
describe("updating datas in a collection", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user", true);
    // insert data
    myDb.insert({ id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15 });
    myDb.insert({ id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 });
    myDb.insert({ id: 3, name: "sakura", enroll: "2018-11-02", sex: "M", salary: 22 });
    myDb.insert({ id: 4, name: "okayama", enroll: "2019-01-20", sex: "M", salary: 33 });
    myDb.insert({ id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 });
 
    // create author collection and insert data
    myDb.createCollection("author", true);
    myDb.insert({ isbn: 2346, price: 2000, name: "jkst" });

    it("should update all the data of the document", function () {
        let searchCondition = { id: 2 };
        let newData = { id:2,jpt: "all changed" };
        let isUpdated = myDb.update("user", searchCondition, newData);

        let searchResult = myDb.find("user", searchCondition);
        let expectedResult = [newData];
        assert.deepEqual(searchResult, expectedResult);
        assert.equal(myDb.collAffected(), 1);
        assert.isTrue(isUpdated);
    });

    it("should update only the keys set", function () {
        let searchCondition = { id: 3 };
        let newData = { $set: { name: "new name", jpt: "this will ignored" } };
        let isUpdated = myDb.update("user", searchCondition, newData);

        let searchResult = myDb.find("user", searchCondition);
        let expectedResult = [{ id: 3, name: "new name", enroll: "2018-11-02", sex: "M", salary: 22 }];
        assert.deepEqual(searchResult, expectedResult);
        assert.equal(myDb.collAffected(), 1);
        assert.isTrue(isUpdated);
    });
});
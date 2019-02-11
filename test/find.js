const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

// check for find method
describe("finding datas in a collection", function () {
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

    it("should return an array of single document", function () {
        let searchResult = myDb.find("user", { id: 2 });
        let expectedResult = [
            { id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it("should return an array of two documents", function () {
        let searchResult = myDb.find("user", { sex: "F" });
        let expectedResult = [
            { id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 },
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it("should return all the documents from user collection", function () {
        let searchResult = myDb.find("user", {});
        let expectedResult = [
            { id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15 },
            { id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 },
            { id: 3, name: "sakura", enroll: "2018-11-02", sex: "M", salary: 22 },
            { id: 4, name: "okayama", enroll: "2019-01-20", sex: "M", salary: 33 },
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it("should return all documents with key 「id」 and 「name」 only when array of field names are set as third parameter", function () {
        let searchCondition = {};
        let retHdr = ["name", "salary"];
        let searchResult = myDb.find("user", searchCondition, retHdr);
        let expectedResult = [
            { name: "hbeauty", salary: 15 },
            { name: "dakc", salary: 35 },
            { name: "sakura", salary: 22 },
            { name: "okayama", salary: 33 },
            { name: "himal", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it("should return single document.(using greater equation)", function () {
        let searchCondition = {
            id: { $gt: 4 }
        };
        let searchResult = myDb.find("user", searchCondition);
        let expectedResult = [
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it("should return two documents.(using greater then or equal to equation)", function () {
        let searchCondition = {
            id: { $gte: 4 }
        };
        let searchResult = myDb.find("user", searchCondition);
        let expectedResult = [
            { id: 4, name: "okayama", enroll: "2019-01-20", sex: "M", salary: 33 },
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });


    it(` or condition`, function () {
        let searchCondition = {
            $or: [{ name: "okayama" }, { name: "himal" }]
        };
        let searchResult = myDb.find("user", searchCondition);
        let expectedResult = [
            { id: 4, name: "okayama", enroll: "2019-01-20", sex: "M", salary: 33 },
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it(` less then condition`, function () {
        myDb.use("user");
        let searchCondition = {id: { $lt: 2 }};
        let searchResult = myDb.find(searchCondition);
        let expectedResult = [
            { id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it(` less then and equal condition`, function () {
        let searchCondition = {id: { $lte: 2 }};
        let searchResult = myDb.find(searchCondition);
        let expectedResult = [
            { id: 1, name: "hbeauty", enroll: "2018-01-20", sex: "M", salary: 15 },
            { id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it(` contains condition`, function () {
        let searchCondition = {name: { $cont: "kc" }};
        let searchResult = myDb.find(searchCondition);
        let expectedResult = [
            { id: 2, name: "dakc", enroll: "2017-02-28", sex: "F", salary: 35 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it(` between condition`, function () {
        let searchCondition = {salary: { $bt: [20,30] }};
        let searchResult = myDb.find(searchCondition);
        let expectedResult = [
            { id: 3, name: "sakura", enroll: "2018-11-02", sex: "M", salary: 22 },
            { id: 5, name: "himal", enroll: "2012-06-08", sex: "F", salary: 25 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });

    it(` complex condition having 「between」,「greater then」,「contains」`, function () {
        let searchCondition = {
            id: { $bt: [2,4] },
            enroll: { $gt: "2018-01-20" },
            name: { $cont: "yama" }
        };
        let searchResult = myDb.find(searchCondition);
        let expectedResult = [
            { id: 4, name: "okayama", enroll: "2019-01-20", sex: "M", salary: 33 }
        ];
        assert.deepEqual(searchResult, expectedResult);
    });
});
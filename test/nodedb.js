const assert = require("chai").assert;
const MeroDB = require("../index");

// check for reading and writtig from and to a file
describe("writting to file and reading from file", function () {
    let myDb = new MeroDB();
    myDb.createCollection("user", true);
    // create data to be inserted
    let userData = [];
    userData.push({ id: 1, name: "pk", salary: 10 });
    userData.push({ id: 2, name: "ck", age: 20, salary: 20, sex: "M" });
    userData.push({ id: 3, name: "dk", create: "2018-01-20", sex: "M", salary: 35 });
    userData.push({ id: 4, name: "kk", salary: 25, sex: "M" });
    userData.push({ id: 5, name: "kk", salary: 15 });
    // execute insertion
    for (let i = 0; i < userData.length; i++) {
        myDb.insert(userData[i]);
    }
    myDb.createCollection("author", true);
    myDb.insert({ isbn: 2346, price: 2000, name: "jkst" });

    it("should return true on writting to file", function () {
        let isWritten = myDb.save("./my.db");
        assert.isTrue(isWritten);
    });
    it("should return true on reading from file", function () {
        let isLoaded = myDb.loadFromFile("./my.db");
        assert.isTrue(isLoaded);
    });
    // it("should return true on encryption", function () {
    //     let isWritten = myDb.writeOnFile("./my.db.enc","thisispassword");
    //     assert.isTrue(isWritten);
    //     let newDb = new MeroDB();
    //     newDb.loadFromFile("./my.db.enc", "thisispassword");
    //     console.log(newDb);
    //     assert.equal(myDb.find("user", {}).length, newDb.find("user", {}).length);
    //     assert.equal(myDb.find("author", {}).length, newDb.find("author", {}).length);
    // });
    // it("should return same data on reading from file", function () {
    //     myDb.writeOnFile("./my.db","myps");
    //     let newDb = new MeroDB();
    //     newDb.loadFromFile("./my.db","myps");
    //     assert.equal(myDb.find("user", {}).length, newDb.find("user", {}).length);
    //     assert.equal(myDb.find("author", {}).length, newDb.find("author", {}).length);
    // });
});
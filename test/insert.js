const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

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
const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

// check create collection
describe("creating collection with single parameter collection name", function () {
    let myDb = new MeroDB();
    it("should return true if collection name is set to be valid string", function () {
        assert.isTrue(myDb.createCollection("user"));
    });
    it("should return empty string for error if collection was created successfully.", function () {
        assert.isEmpty(myDb.getError());
    });
    it("should return false if collection name is set to be empty string", function () {
        assert.isFalse(myDb.createCollection(""));
        assert.equal(myDb.getError(), "Collection name should not be empty string.");
    });
    it("should return false if collection name is set to be object", function () {
        assert.isFalse(myDb.createCollection({
            name: "user"
        }));
        assert.isFalse(myDb.createCollection(["user"]));
        assert.equal(myDb.getError(), "Collection name should be string.");
    });

    it("should return the list of collections as expected.", function () {
        var expectedCollections = ["user"];
        var collections = myDb.getCollections();
        assert.deepEqual(collections, expectedCollections);
    });
});

describe("create collection and activate (passing true as second parameters)", function () {
    let myDb = new MeroDB();
    myDb.createCollection("author");
    
    it(`
    1. should return true on passing valid string as collection name and true (boolean) as second parameter
    2. should return 「user」 as active collection name
    `, function () {
        assert.isTrue(myDb.createCollection("user", true));
        assert.equal(myDb.getActiveCollection(), "user");
    });

    it(`
    1. should return false on passing other then boolean as second parameter
    2. should return 「author,user」 as active collection name as creating collection country failed.
    3. should return the list of collections as expected.
    `, function () {
        assert.isFalse(myDb.createCollection("country", "activation"));
        assert.equal(myDb.getActiveCollection(), "user");
        var expectedCollections = ["author","user"];
        var collections = myDb.getCollections();
        assert.deepEqual(collections, expectedCollections);
    });
});

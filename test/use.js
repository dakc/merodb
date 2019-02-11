const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

// check for use method
describe("activate collection", () => {
    let myDb = new MeroDB();
    myDb.createCollection("user");
    myDb.createCollection("city");
    it(`
    1. should return true if existing collection is passed.
    2. should return empty string for getError method.
    `, () => {
        assert.isTrue(myDb.use("user"));
        assert.isEmpty(myDb.getError());
    });

    it(`
    1. should return false if non-existing collection name is passed.
    2. should return error message as 「No any collection found with name 「hogehoge」」.
    `, () => {
        assert.isFalse(myDb.use("hogehoge"));
        assert.equal(myDb.getError(), "No any collection found with name 「hogehoge」.");
    });

    it(`
    1. should return false if empty string is set as collection name
    2. should return error message as 「Collection name should not be empty string.」.
    `, () => {
        assert.isFalse(myDb.use(""));
        assert.equal(myDb.getError(), "Collection name should not be empty string.");
    });

    it(`
    1. should return false if object is set as collection name
    2. should return error message as 「Collection name should be string.」
    `, () => {
        assert.isFalse(myDb.use(["user"]));
        assert.equal(myDb.getError(), "Collection name should be string.");
        assert.isFalse(myDb.use({
            name: "user"
        }));
        assert.equal(myDb.getError(), "Collection name should be string.");
        assert.isFalse(myDb.use(2));
        assert.equal(myDb.getError(), "Collection name should be string.");
        assert.isFalse(myDb.use(true));
        assert.equal(myDb.getError(), "Collection name should be string.");
    });


    it("should return 「author」 as active collection", () => {
        myDb.createCollection("author", true);
        assert.equal(myDb.getActiveCollection(), "author");
    });

    it("should return 「user」 as active collection", () => {
        myDb.use("user");
        assert.equal(myDb.getActiveCollection(), "user");
    });

    it(`should return false on passing other then boolean as second parameter
    1. 「hogehoge」 collection should not be created and the collection list should be
    ["user", "city", "author"]
    2. active collection should be 「user」
    `, () => {
        assert.isFalse(myDb.createCollection("hogehoge", "activation"));
        var expectedCollections = ["user", "city", "author"];
        var collections = myDb.getCollections();
        assert.deepEqual(collections, expectedCollections);
        assert.equal(myDb.getActiveCollection(), "user");
    });
});

const assert = require("chai").assert;
const MeroDB = require("../src/merodb");

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
        assert.equal(myDb.getDocumentNumAffected(), 1);
    });
    it("should return true and number of collection deleted to be zero  after deletion because the condition is not satisfied", function () {
        let isDel = myDb.delete({ isbn: 3346 });
        assert.isTrue(isDel);
        assert.equal(myDb.getDocumentNumAffected(), 0);
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
        assert.equal(myDb.getDocumentNumAffected(), 2);
    });
});
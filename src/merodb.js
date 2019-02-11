'use strict';
const Core = require("./core");
class MeroDB extends Core{
    constructor(){
        super();
    }

    /**
     * returns true if object is loaded in the database successfully
     * else returns false
     * 
     * @param {string} collectionName - name of collection
     * @param {object} arrayObj - object to be loaded in database
     */
    loadFromJsonObject(collectionName,arrayObj){
        if(typeof collectionName !== "string" || !collectionName.trim()){
            this.err = "collection name is not set";
            return false;
        }
        if(typeof arrayObj !== "object" || !Array.isArray(arrayObj)){
            this.err = "arrayObj should be array of object.";
            return false;
        }
        this.clcn[collectionName] = arrayObj;
        return true;
    }

    /**
     * return true if collection is created
     * else returns false
     * 
     * @param {string} collectionName - name of the collection
     * @param {boolean} isActivate - true if activate collection.
     *                               Default value is false.
     */
    createCollection(collectionName,isActivate=false){
        if(typeof collectionName !== "string"){
            this.err = "Collection name should be string.";
            return false;
        }
        if(!collectionName.trim()){
            this.err = "Collection name should not be empty string.";
            return false;
        }
        if(typeof isActivate !== "boolean"){
            this.err = "Second parameter should be boolean.";
            return false;
        }
        if (Object.prototype.hasOwnProperty.call(this.clcn, collectionName)) {
            this.err = `Collection name 「${collectionName}」 already exists.`;
            return false;
        }

        this.clcn[collectionName] = [];
        return isActivate ? this.use(collectionName) : true;
    }

    /**
     * by calling this funcion, we can use find,select,
     * .. without using collection parameter
     * 
     * @param {string} collectionName - collection name
     */
    use(collectionName) {
        if(typeof collectionName !== "string"){
            this.err = "Collection name should be string.";
            return false;
        }
        if(!collectionName.trim()){
            this.err = "Collection name should not be empty string.";
            return false;
        }

        if (!Object.prototype.hasOwnProperty.call(this.clcn, collectionName)) {
            this.err = `No any collection found with name 「${collectionName}」.`;
            return false;
        }

        this.aClcn = collectionName;
        return true;
    }

    /**
     * resturn the rows of document satisfiying given condition
     * 
     * @param  {string,object} - table name, search condition 
     * kdbInstance.find('tbl1',{ id: { $gte: 22 } });
     * 
     * @param  {object} - search condition (kdbInstance.use(table) should be called before)
     * kdbInstance.find({ id: { $gte: 22 } });
     * 
     * @param  {object,object} - search condition , array of column to return
     * kdbInstance.find({ id: { $gte: 22 } },['id','namel']);
     * 
     * @param  {string,object} - table name, search condition(containing or statement)
     * kdbInstance.find("tbl1", { $or: [{ id: 33 }, { id: 22 }], name: "asdf" });
     * 
     * @param  {string,object} - table name, search condition(empty object) -> returns all data
     * kdbInstance.find("tbl1", {});
     */
    find(...args) {
        if(args.length > 3 ) return null;

        // kdbInstance.find(tableName,condition,field to response);
        if (args.length === 3 && typeof args[0] == "string" && typeof args[1] == "object" && typeof args[2] == "object") {
            if (!Array.isArray(args[2])) return null;
            let res = this._exec(this._find,[args[0],args[1]]);
            // deep copy array
            let cloneRes = JSON.parse(JSON.stringify(res));
            cloneRes.forEach(eachRow => { 
                Object.keys(eachRow).forEach(key => {
                    if (!args[2].includes(key)) delete eachRow[key];
                });
            });
            return cloneRes;
        }

        // kdbInstance.find(condition,field to response);
        if (args.length === 2 && typeof args[0] == "object" && typeof args[1] == "object") {
            if (!Array.isArray(args[1])) return null;
            let res = this._exec(this._find,[args[0]]);
            // deep copy array
            let cloneRes = JSON.parse(JSON.stringify(res));
            cloneRes.forEach(eachRow => { 
                Object.keys(eachRow).forEach(key => {
                    if (!args[1].includes(key)) delete eachRow[key];
                });
            });
            return cloneRes;
        }

        // kdbInstance.find(table,conditon);
        if (args.length === 2 && typeof args[0] == "string" && typeof args[1] == "object") {
            return this._exec(this._find,args);
        }
        
        // kdbInstance.find(conditon);
        if (args.length === 1 && typeof args[0] == "object") {
            return this._exec(this._find,args);
        }

        return null;
    }

    
    /**
     * returns true if update is successfull
     * else returns false
     * The number of COLLECTIONS updated can be known by
     * calling 「collAffected」 method.
     * 
     * @param  {...any} args 
     */
    update(...args) {
        if (args.length === 2) {
            if (typeof args[0] == "object" && typeof args[1] == "object" && this.aClcn !== "") {
                return this._update(this.aClcn, args[0], args[1]);
            }
        }

        if (args.length === 3) {
            if (typeof args[0] == "string" && typeof args[1] == "object" && typeof args[2] == "object") {
                return this._update(args[0], args[1], args[2]);
            }
        }

        return false;
    }
    
    /**
     * returns true if insertion is successfull 
     * else returns false
     * 
     * @param  {...any} args 
     */
    insert(...args) {
        if (args.length > 2 || args.length == 0) return false;
        
        if (args.length === 2) {
            if (typeof args[0] == "string" && typeof args[1] == "object"
                && Object.prototype.hasOwnProperty.call(this.clcn, args[0])) {
                this._insert(args[0], args[1]);
                return true;
            }
            return false;
        }

        if (args.length === 1) {
            if (typeof args[0] == "object" && this.aClcn !== "") {
                this._insert(this.aClcn, args[0]);
                return true;
            }
            return false;
        }

        return false;
    }

    /**
     * returns true if deletion is successfull
     * else returns false
     * The number of COLLECTIONS deleted can be known by
     * calling 「collAffected」 method.
     * 
     * @param  {...any} args 
     */
    delete(...args) {
        if (args.length > 2 || args.length == 0) return false;
        
        if (args.length === 2) {
            if (typeof args[0] == "string" && typeof args[1] == "object"
                && Object.prototype.hasOwnProperty.call(this.clcn, args[0])) {
                this._delete(args[0], args[1]);
                return true;
            }
            return false;
        }

        if (args.length === 1) {
            if (typeof args[0] == "object" && this.aClcn !== "") {
                this._delete(this.aClcn, args[0]);
                return true;
            }
            return false;
        }

        return false;
    }

    /**
     * returns the number of collections affected 
     * after update and delete process
     */
    collAffected() {
        return this.num;
    }

    /**
     * get the active collection name
     */
    getActiveCollection(){
        return this.aClcn;
    }

    /**
     * get the error message
     */
    getError() {
        return this.err;
    }

    /**
     * get the list of collection
     */
    getCollections() {
        return Object.keys(this.clcn)
    }
}

module.exports = MeroDB;
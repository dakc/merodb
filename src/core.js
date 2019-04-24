'use strict';
const fs = require('fs');
const  EventEmitter = require('events').EventEmitter;
class Core extends EventEmitter{
    constructor(){
        super();
        this.clcn = Object.create(null);
        this.err = "";
        this.aClcn = "";
        this.num = 0;

        // on update emit write data to file
        this.on("update",data => {
            if(!this.filePath || !this.isUpdateEveryTime) return;
            this._writeOnFile(this.filePath);
        });
    }

    /**
     * write db content to file
     * @param {string} filePath  - filepath for saving database
     */
    _writeOnFile(filePath) {
        try {
            let data = JSON.stringify(this.clcn, null);
            fs.writeFile(filePath, data,'utf8',err => {
                if (err) throw Error(err);
            });
        } catch (error) {
            this.err = error.message;
        }
    }

    /**
     * returns true if object contains object with the given condition
     * else returns false
     * 
     * @param {object} searchFrom - one dimensional object from where searchData will be searched
     *                              for eg, {id:22,name:"jptk"}
     * @param {object} searchCondition - one dimensional object containing search condition
     *                                  for eg,{id:{$gt:20}}
     */
    _isSatisfied(searchFrom, searchCondition) {
        if (typeof searchFrom != "object") return false;
        if (typeof searchCondition != "object") return false;
        if (Object.keys(searchCondition).length !== 1) return false;
        let searchKey = Object.keys(searchCondition)[0];
        let searchObj = searchCondition[searchKey];
        if (typeof searchObj != "object") return false;

        let isExists = false;
        let execCalc = ((op,x,y) => {
            if(op == "$e") return x === y;
            if(op == "$ne") return x != y;
            if(op == "$lt") return x < y;
            if(op == "$lte") return x <= y;
            if(op == "$gt") return x > y;
            if(op == "$gte") return x >= y;
            if(op == "$cont") return x.includes(y);
            if(op == "$bt") {
                if(typeof y != "object") return false;
                if (!Array.isArray(y)) return false;
                if(y.length !== 2) return false;
                if(x >= y[0] && x <= y[1]) return true;
                if(x >= y[1] && x <= y[0]) return true;
                return false;
            }
            return false;
        });

        let operator = Object.keys(searchObj)[0];      
        Object.keys(searchFrom).forEach(searchFromKey => {
            if(searchKey == searchFromKey){
                return isExists = execCalc(operator,searchFrom[searchKey],searchObj[operator]);
            }
        });

        return isExists;
    }

    /**
     * returns object from table collectionName
     * having condition searchObj
     * @param {string} collectionName - table name to search data
     * @param {object} searchObj - search condition
     */
    _find(collectionName, searchObj) {
        this.err = "";
        if (!Object.prototype.hasOwnProperty.call(this.clcn, collectionName)) {
            return null;
        }

        let searchResult = this.clcn[collectionName];
        // run of search if or is found on search object
        Object.keys(searchObj).forEach(key => {
            if (key.toString().startsWith("$or")) {
                // value of $or should be array of objects
                if (Array.isArray(searchObj[key])) {
                    // check for each row from data
                    searchResult = searchResult.filter((elm, index, arr) => {
                        let isOrClsSatisfied = false;
                        // check each single row from search or object
                        searchObj[key].forEach(orItms => {
                            Object.keys(orItms).forEach(orItmKey => {
                                if(typeof orItms[orItmKey] != "object" && elm[orItmKey] == orItms[orItmKey]) return isOrClsSatisfied = true;
                                if(typeof orItms[orItmKey] == "object" && this._isSatisfied(elm,orItms,orItmKey)) return isOrClsSatisfied = true;
                            })
                        })

                        return isOrClsSatisfied;
                    });
                }
            }
        });

        // run and search
        Object.keys(searchObj).forEach(key => {
            if (key.startsWith("$or")) return;

            // check for each row from data
            searchResult = searchResult.filter((elm) => {
                if (typeof searchObj[key] != "object" && elm[key] == searchObj[key]) return true;
                if (typeof searchObj[key] == "object") {
                    let obj = Object.create({});
                    Object.defineProperty(obj, key, { value: searchObj[key], enumerable: true});
                    return this._isSatisfied(elm, obj);
                } 
                return false;  
            });
        });

        return searchResult;
    }

    _insert(collectionName,data){
        this.clcn[collectionName].push(data);
        this.emit("update",data);
    }

    _update(collectionName,whereCls,dtObj){
        this.err = "";
        this.num = 0;

        // return false if no table was found
        if (!Object.prototype.hasOwnProperty.call(this.clcn, collectionName)) return false;

        // exit if validation of set value object fails
        if (Object.keys(dtObj)[0] == "$set") {
            // return false if input param is not object
            if (typeof dtObj["$set"] !== "object") return false;
        } else {
            if (typeof dtObj !== "object") return false;

        }

        // filter data satisfiying where clause
        let searchResult = this._find(collectionName, whereCls);
        // exit if given condition fulfilling data does not exists
        if(!(this.num = searchResult.length)) return false;

        // update particular fields
        if (Object.keys(dtObj)[0] == "$set") {
            Object.keys(dtObj["$set"]).forEach(key => {
                searchResult.forEach(itm => {
                    if (Object.prototype.hasOwnProperty.call(itm, key)) {
                        itm[key] = dtObj["$set"][key];
                    }
                })
            })
        }

        // update all row
        else {
            searchResult.forEach(function(item) {
                Object.keys(item).forEach(key => {
                    delete item[key];
                });

                Object.keys(dtObj).forEach(key => {
                    item[key] = dtObj[key];
                });
              });
        }

        this.emit("update","");
        return true;
    }

    _delete(collectionName, whereCls) {
        this.err = "";
        this.num = 0;
        // exit if no table was found
        if (!Object.prototype.hasOwnProperty.call(this.clcn, collectionName)) return false;
        // exit if where clause is not object
        if (typeof whereCls !== "object") return false;

        // filter data satisfiying where clause
        let searchResult = this._find(collectionName, whereCls);
        // exit if given condition fulfilling data does not exists
        if (!(this.num = searchResult.length)) return false;

        // deletion
        let indexToBeDel = [];
        this.clcn[collectionName].forEach((tblData, index) => {
            searchResult.forEach(filterData => {
                let n = 0;
                Object.keys(filterData).forEach(key => {
                    if (filterData[key] == tblData[key]) n++;
                });
                if (n == Object.keys(tblData).length) indexToBeDel.push(index);
            });
            
        });

        for (let i = indexToBeDel.length; i > 0; i--){
            this.clcn[collectionName].splice(indexToBeDel[i-1], 1);
        }

        this.emit("update","");
        return true;
    }

    _exec(fn,args) {
        if (args.length === 1) {
            if (typeof args[0] == "object" && this.aClcn !== "") {
                let obj = fn.bind(this, this.aClcn, args[0]);
                return obj();
            }
        }

        if (args.length === 2) {
            if (typeof args[0] == "string" && typeof args[1] == "object") {
                let obj = fn.bind(this, args[0], args[1]);
                return obj();
            }
        }

        return false;
    }
}
module.exports = Core;
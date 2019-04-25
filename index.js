'use strict';
const MeroDB = require("./src/merodb");
const fs = require('fs');

class nodeVerMeroDB extends MeroDB{
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
     * load contents in a database from file
     * @param {string} filePath 
     */
    _loadFromFile(filePath){
        try {
            // check file existence
            if (!fs.existsSync(filePath)) {
                this.err = `database file ${filePath} does not exists.`;
                return false;
            }
    
            let data = fs.readFileSync(filePath);
            this.clcn = JSON.parse(data);
            return true;
        } catch (error) {
            this.err = error.message;
        }
        return false;
    }

    /**
     * write db contents to file
     * @param {string} filePath - filepath to save db
     */
    save(filePath){
        if(typeof filePath !== "string" || !filePath.trim()){
            this.err = "filePath is not set";
            return false;
        }
        this._writeOnFile(filePath);
        return true;
    }

    /**
     * write the contents of database
     * on each insert,update and delete
     * 
     * @param {string} filePath  - filepath to save db
     */
    updateAlways(filePath){
        if(typeof filePath !== "string" || !filePath.trim()){
            this.err = "filePath is not set";
            return false;
        }
        this.filePath = filePath;
        this.isUpdateEveryTime = true;
    }

    /**
     * load contents in a database from file
     * @param {string} filePath 
     */
    loadFromFile(filePath){
        return this._loadFromFile(filePath);
    }
}

module.exports = nodeVerMeroDB;
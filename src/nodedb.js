'use strict';

const fs = require('fs');
const MeroDB = require("./merodb");

class NodeDb extends MeroDB{
    /**
     * writes the object into file path
     * @param {string} filePath - file path for database file
     */
    writeOnFile(filePath,pass="") {
        try {
            let data = JSON.stringify(this.clcn, null);
            fs.writeFileSync(filePath, data);
            return true;
        } catch (error) {
            this.err = error.message;
        }
        return false;
    }

    /**
     * return true on successfull loading data from file
     * else returns false
     * 
     * @param {string} filePath - file path for the database file
     */
    loadFromFile(filePath,pass=""){
        try {
            // check file existence
            if (!fs.existsSync(filePath)) {
                this.err = `database file ${filePath} does not exists.`;
                return false;
            }

            let data = fs.readFileSync(filePath);
            if (pass) data = this._decrypt(data,pass);
            this.clcn = JSON.parse(data);
            return true;
        } catch (error) {
            this.err = error.message;
        }
        return false;
    }

   
}

module.exports = NodeDb;
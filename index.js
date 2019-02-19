'use strict';

const fs = require('fs');
const MeroDB = require("./src/merodb");


MeroDB.prototype.writeOnFile = function(filePath,pass="") {
    try {
        let data = JSON.stringify(this.clcn, null);
        fs.writeFileSync(filePath, data);
        return true;
    } catch (error) {
        this.err = error.message;
    }
    return false;
}

MeroDB.prototype.loadFromFile = function(filePath,pass=""){
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

module.exports = MeroDB;
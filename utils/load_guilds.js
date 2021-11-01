const fs = require('fs');
const GUILDS_FILE = "guilds.json"

module.exports = function(){
    let rawdata = fs.readFileSync(GUILDS_FILE)
    let jsonObj = JSON.parse(rawdata)
    return jsonObj
}


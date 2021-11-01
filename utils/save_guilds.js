const fs = require('fs');
const GUILDS_FILE = "guilds.json"

module.exports = function (jsonObj){
    let data = JSON.stringify(jsonObj, null, "\t");
    fs.writeFileSync(GUILDS_FILE, data);
}
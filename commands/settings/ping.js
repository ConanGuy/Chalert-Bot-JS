const utils = require("../../utils.js");

async function command(msg, args) {
    await utils.send(msg, {content: `Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(msg.client.ws.ping)}ms`})
}

module.exports = async function (msg, args){
    await command(msg, args)
}

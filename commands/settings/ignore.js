const utils = require("../../utils.js");

async function command(msg, args) {
    let guildsJson = utils.load_guilds()

    let guild = msg.guild
    let author = msg.author

    if (!guildsJson[guild.id].ignore.includes(author.id)){
        guildsJson[guild.id].ignore.push(author.id)
        await utils.send(msg, {content: `${author.username} added to ignored list for this server`})
    }
    else{
        let idx = guildsJson[guild.id].ignore.indexOf(author.id)
        guildsJson[guild.id].ignore.splice(idx, 1)
        await utils.send(msg, {content: `${author.username} removed from ignored list for this server`})
    }

    utils.save_guilds(guildsJson)
}

module.exports = async function (msg, args){
    await command(msg, args)
}

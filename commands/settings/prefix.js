const utils = require("../../utils.js");
const {Permissions} = require("discord.js")

async function command(msg, args) {
    let newPref = args[0]

    let guild = msg.guild
    let author = msg.author
    let member = await guild.members.fetch(author.id)

    let guildsJson = utils.load_guilds()
    if(newPref != undefined){
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            guildsJson[guild.id].prefix = newPref
            utils.save_guilds(guildsJson)
            await utils.send(msg, {content: "Prefix set to `"+newPref+"` for this server"})
        }
        else{
            await utils.send(msg, {content: `You are not allowed to change prefix on this server`})
        }
    }
    else{
        await utils.send(msg, {content: "Current prefix is `"+guildsJson[guild.id].prefix+"` for this server"})
    }
}

module.exports = async function (msg, args){
    await command(msg, args)
}

const utils = require("../../utils.js");
const {Permissions} = require("discord.js")

async function command(msg, args) {
    let newChan = args[0]
    let channel_id = newChan === undefined ? undefined : newChan.replace(/\D/g, '')

    let guild = msg.guild
    let author = msg.author
    let member = await guild.members.fetch(author.id)

    let guildsJson = utils.load_guilds()
    if(channel_id != undefined){
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            guildsJson[guild.id].channel = channel_id
            utils.save_guilds(guildsJson)
            await utils.send(msg, {content: "Channel set to <#"+channel_id+"> for this server"})
        }
        else{
            await utils.send(msg, {content: `You are not allowed to change channel on this server`})
        }
    }
    else{
        if (guildsJson[guild.id].channel == null){
            await utils.send(msg, {content: "No channel defined"})
        }
        else{
            await utils.send(msg, {content: "Current channel is <#"+guildsJson[guild.id].channel+"> for this server"})
        }
    }
}

module.exports = async function (msg, args){
    await command(msg, args)
}

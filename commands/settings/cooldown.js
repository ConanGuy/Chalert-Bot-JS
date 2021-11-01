const utils = require("../../utils.js");
const {Permissions} = require("discord.js")

async function command(msg, args) {
    let newCd = args[0]
    let cd = parseInt(newCd)

    let guild = msg.guild
    let author = msg.author
    let member = await guild.members.fetch(author.id)

    let guildsJson = utils.load_guilds()
    if(!isNaN(cd)){
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            guildsJson[guild.id].cooldown = cd
            utils.save_guilds(guildsJson)
            await utils.send(msg, {content: "Cooldown set to "+cd+" minutes for this server"})
        }
        else{
            await utils.send(msg, {content: `You are not allowed to change cooldown on this server`})
        }
    }
    else{
        let now = new Date()
        let timeDiff = Math.floor(Math.abs(now - Date.parse(guildsJson[guild.id].last_update)) / 1000)
	let timeLeft = guildsJson[guild.id].cooldown*60 - timeDiff
        await utils.send(msg, {content: "Current cooldown is "+guildsJson[guild.id].cooldown+" minutes for this server"+(timeLeft>0 ? " ("+timeLeft+"s left)" : "")})
    }
}

module.exports = async function (msg, args){
    await command(msg, args)
}

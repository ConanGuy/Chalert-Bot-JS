const utils = require("../../utils.js");

async function command(msg, args) {
    let allGuilds = await msg.client.guilds.fetch()

    let count = 0
    let sendInterval = 20
    let toSend = []
    let skipGuilds= ["891000842788937748", "853749415927349310"]
    for (let [guildId, guildO] of allGuilds){
        if (skipGuilds.includes(guildId)) continue
        
        count += 1

        let guild = await guildO.fetch()

        let roleName = 'Chalert user';
        let roles = guild.roles
        let hasRole = false
        for (let roleArr of await roles.fetch()){
            role_id = roleArr[0]
            role = roleArr[1]
            if (role.name == roleName){
                hasRole = true
                break
            }
        }

        toSend.push(`\`${guild.name}\`:  since \`${guild.joinedAt.toLocaleDateString("en-US")}\`, hasRole=\`${hasRole}\``)
        if (toSend.length == sendInterval){
            await utils.send(msg, {content: toSend.join("\n")})
            toSend = []
        }  
    }
    if (toSend.length > 0){
        await utils.send(msg, {content: toSend.join("\n")})
    }  
    await utils.send(msg, {content: `${count} guilds found`})

}

module.exports = async function (msg, args){
    await command(msg, args)
}

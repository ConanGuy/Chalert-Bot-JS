module.exports = async function (guild, botMember){
    const channels = await guild.channels.fetch()
    let channel
    for (const c of channels){
        if (c[1].type == "GUILD_TEXT"){
            let hasPerm = true
            for (const perm of ["VIEW_CHANNEL", "SEND_MESSAGES"])
                if (!(await c[1].permissionsFor(botMember)).has(perm))
                    hasPerm = false
            if (hasPerm){
                channel = c[1]
                break
            }
        }
    }
    return channel
}
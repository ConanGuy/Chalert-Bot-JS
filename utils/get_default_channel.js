module.exports = async function (guild){
    const channels = await guild.channels.fetch()
    let channel
    for (const c of channels){
        console.log(c)
        if (c[1].type == "GUILD_TEXT"){
            channel = c[1]
            break
        }
    }
    return channel
}
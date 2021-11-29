const utils = require("../../utils.js");
const { MessageEmbed } = require('discord.js');

async function command(msg, args) {
    guildsJson = utils.load_guilds()

    let nbCUsers = await utils.count_chalert_users(msg.guild)
    let ping = Date.now() - msg.createdTimestamp
    let joinedAt = new Date(msg.guild.joinedAt)

    let dateStr =
        ("00" + (joinedAt.getMonth() + 1)).slice(-2) + "/" +
        ("00" + joinedAt.getDate()).slice(-2) + "/" +
        joinedAt.getFullYear() + " " +
        ("00" + joinedAt.getHours()).slice(-2) + ":" +
        ("00" + joinedAt.getMinutes()).slice(-2) + ":" +
        ("00" + joinedAt.getSeconds()).slice(-2);

    let nbSent = guildsJson[msg.guild.id].nbAlert
    let botAvatar = await msg.client.user.avatarURL() || msg.client.user.defaultAvatarURL

    let desc = "Server joined at `"+dateStr+"`"
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Infos for '+msg.guild.name)
        .setAuthor(msg.client.user.tag, botAvatar)
        .setDescription(desc)
        .addFields(
            { name: 'Chalert users', value: nbCUsers+' users', inline: true },
            { name: 'Alerts sent', value: nbSent+' alerts sent', inline: true },
            { name: 'Ping', value: ping+"ms", inline: true },
        )
        .setImage(await msg.guild.iconURL())
        .setTimestamp()
    
    await utils.send(msg, {embeds: [embed]})
}

module.exports = async function (msg, args){
    await command(msg, args)
}

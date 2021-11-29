require('dotenv').config()
const Discord = require("discord.js")
const commandHandler = require("./commands/commands")
const utils = require("./utils")

const ROLE_NAME = "Chalert user"

///////////////////////////////////////////////////////////////////////////////////////////////////
// 
// BOT LINK
// 
// https://discord.com/
//
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////

// CLIENT INIT

const TOKEN = process.env.TOKEN_CHALERT

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] })
client.login(TOKEN)

client.on("messageCreate", getMessage)
client.on("guildCreate", guildJoin)
client.on("guildDelete", guildLeft)
client.on("voiceStateUpdate", voiceChannelUpdate)
client.on("ready", botReady)

///////////////////////////////////////////////////////////////////////////////////////////////////

// EVENTS FUNCTIONS

async function botReady(){
    const date = new Date()
    console.log(`[Logs @${date.toUTCString()}] ${client.user.username} has connected to Discord\n`)

    utils.conan = await client.users.fetch("351822142989402123")
    utils.botMember = await client.users.fetch(client.user.id)

    await check_json()   
    await check_guilds() 
}

async function voiceChannelUpdate(before, after){
    if (after.channelId != null && before.channelId == null){
        let guild = after.guild
        let member = await guild.members.fetch(after.id)

        let now = new Date()

        guildsJson = utils.load_guilds()

        let n = 0
        for (let channelArr of await guild.channels.fetch()){
            let channel = channelArr[1]
            if (channel.type == "GUILD_VOICE"){
                n += channel.members.size
            }
        }

        if (n > 1){
            return
        }

        let timeDiff = Math.floor(Math.abs(now - Date.parse(guildsJson[guild.id].last_update)) / 1000);
        
        if (timeDiff < guildsJson[guild.id].cooldown * 60){
            console.log(`[${guild} @${now.toUTCString()}] Cooldown: ${Math.round(timeDiff, 2)}s left for ${guild}\n`)            
            return
        }
        if (guildsJson[guild.id].ignore.includes(after.id)){
            console.log(`[${guild} @${now.toUTCString()}] '${member}' is ignored in ${guild}\n`) 
            return
        }

        if (n == 1){
            let nbSent = 0
            let s = `${member.user.username} has joined a VoiceChannel in ${guild} !!`   
            for (let userArr of await guild.members.fetch()){
                let user = userArr[1]

                if (user == member || guildsJson[guild.id].ignore.includes(user.id))
                    continue
                
                for (let roleArr of await user.roles.cache){
                    let role = roleArr[1]
                    if (ROLE_NAME == role.name){
                        console.log(`[${guild} @${now.toUTCString()}] '${s}' send to ${user.user.username}`)
                        nbSent++
                        try{
                            await user.send(s)
                        }
                        catch(err){
                            
                        }
                    }
                }
            }
            guildsJson[guild.id].nbAlert += nbSent
            console.log()

            guildsJson[guild.id].last_update = now
            utils.save_guilds(guildsJson)
        }
    }
}

async function getMessage(message){
    if(message.author.bot) return
    else{
        commandHandler(message)
    }
}

async function guildJoin(guild){
    const date = new Date()
    console.log(`[Logs @${date.toUTCString()}] ${client.user.username} has joined ${guild}\n`)

    let conan = await client.users.fetch("351822142989402123")
    await conan.send("Chalert joined "+guild.name+" (id: "+guild.id+")")

    await check_guilds_specific(guild)
}

async function guildLeft(guild){
    const date = new Date()
    console.log(`[Logs @${date.toUTCString()}] ${client.user.username} has left ${guild}\n`)

    let guildsJson = utils.load_guilds()
    delete guildsJson[guild.id]
    utils.save_guilds(guildsJson)
    
    let conan = await client.users.fetch("351822142989402123")
    await conan.send("Chalert left "+guild.name+" (id: "+guild.id+")")

}

///////////////////////////////////////////////////////////////////////////////////////////////////

// OTHER FUNCTIONS

async function check_guilds(){
    let guilds = await client.guilds.fetch()
    for (let guild of guilds){
        await check_guilds_specific(await guild[1].fetch())
    }
}

async function check_guilds_specific(guild){
    let guildsJson = utils.load_guilds()
    if (!Object.keys(guildsJson).includes(guild.id)){
        guildsJson[guild.id] = {"id": guild.id, "last_update": new Date(0), "cooldown": 5, "ignore": [], "name": guild.name, "prefix": "chalert.", "toAlert": [], "channel": null, "nbAlert": 0, "lastRoleWarning": new Date(0)}
    }
    utils.save_guilds(guildsJson)

    let roles = await guild.roles.fetch()
    let hasRole = false
    for (let roleArr of await roles){
        role_id = roleArr[0]
        role = roleArr[1]
        if (role.name == ROLE_NAME){
            hasRole = true
            break
        }
    }
    
    let now = new Date() 

    let timeDiff = Math.floor(Math.abs(now - Date.parse(guildsJson[guild.id].last_update)) / 1000);
    if (!hasRole && timeDiff > 60*60){
        try {
            await roles.create({name: ROLE_NAME})
            console.log(`[Logs @${now.toUTCString()}] Added role to ${guild}\n`)
        }
        catch(e){
            console.log("[Logs @"+now.toUTCString()+"]Cannot create role on "+guild.name+" ("+guild.id+")")
            guildsJson[guild.id].lastRoleWarning = now
            utils.save_guilds(guildsJson)
            try{
                let defChannel = guildsJson[guild.id].channel
                if (defChannel === null)
                    defChannel = utils.get_default_channel(guild, utils.botMember)
                await defChannel.send({content: "Could not create `Chalert user` role. Please consider creating it"})
            }
            catch(err){
                console.log("Cannot send error message to channel on "+guild.name+" ("+guild.id+")\n")
            }
        }
    }
}

async function check_json(){
    let guildsJson = utils.load_guilds()

    let allGuilds = await client.guilds.fetch()

    let savedIds = Object.keys(guildsJson)

    let allIds = []

    let checking = {
		"last_update": "new Date(0)",
		"cooldown": "5",
		"ignore": "[]",
        "name": "guild.name",
        "prefix": "'chalert.'",
        "toAlert": "[]",
        "channel": "null",
        "nbAlert": "0",
        "lastRoleWarning": "new Date(0)"
    }

    for (let [guildId, guildO] of allGuilds){
        allIds.push(guildId)

        let guild = await guildO.fetch()

        let gJ = guildsJson[guildId]

        if (gJ === undefined){
            guildsJson[guild.id] = {"id": guild.id, "last_update": new Date(0), "cooldown": 5, "ignore": [], "name": guild.name, "prefix": "chalert.", "toAlert": [], "channel": null, "nbAlert": 0, "lastRoleWarning": new Date(0)}
        }
        else{
            for (let [key, value] of Object.entries(checking)){
                if (!gJ.hasOwnProperty(key)){
                    gJ[key] = eval(value)
                }
            }
        }
    }

    for (let id of savedIds){
        if (!allIds.includes(id)) delete guildsJson[id]
    }

    utils.save_guilds(guildsJson)
}

async function alert_guild(guildId){
    let guild = await (await client.guilds.fetch(guildId)).fetch()
    let chan = await utils.get_default_channel(guild, utils.botMember)   
    await chan.send("The issue should be solved, sorry for the inconvenience")
    console.log("sent")
}

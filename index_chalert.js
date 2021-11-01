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

const TOKEN = process.env.TOKEN

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_VOICE_STATES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] })
client.login(TOKEN)

client.on("messageCreate", getMessage)
client.on("guildCreate", guildJoin)
client.on("voiceStateUpdate", voiceChannelUpdate)
client.on("ready", botReady)

///////////////////////////////////////////////////////////////////////////////////////////////////

// EVENTS FUNCTIONS

async function botReady(){
    const date = new Date()
    console.log(`[Logs @${date.toUTCString()}] ${client.user.username} has connected to Discord\n`)

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
            let s = `${member.user.username} has joined a VoiceChannel in ${guild} !!`   
            for (let userArr of await guild.members.fetch()){
                let user = userArr[1]

                if (user == member || guildsJson[guild.id].ignore.includes(user.id))
                    continue
                
                for (let roleArr of user.roles.cache){
                    let role = roleArr[1]
                    if (ROLE_NAME == role.name){
                        console.log(`[${guild} @${now.toUTCString()}] '${s}' send to ${user.user.username}`)
                        try{
                            await user.send(s)
                        }
                        catch(err){
                            
                        }
                    }
                }
            }
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

    let guildsJson = utils.load_guilds()
    if (!Object.keys(guildsJson).includes(guild.id)){
        guildsJson[guild.id] = {"id": guild.id, "last_update": new Date(0), "cooldown": 5, "ignore": []}
    }
    utils.save_guilds(guildsJson)
}

///////////////////////////////////////////////////////////////////////////////////////////////////

// OTHER FUNCTIONS

async function check_guilds(){
    let guildsJson = utils.load_guilds()

    let guilds = await client.guilds.fetch()
    for (let guild of guilds){
        check_guilds_specific(client.guilds.cache.get(guild[0]))
    }
    utils.save_guilds(guildsJson)
}

async function check_guilds_specific(guild){
    let guildsJson = utils.load_guilds()
    if (!Object.keys(guildsJson).includes(guild.id)){
        guildsJson[guild.id] = {"id": guild.id, "last_update": new Date(0), "cooldown": 5, "ignore": []}
    }

    let roles = guild.roles
    let hasRole = false
    for (let roleArr of await roles.cache){
        role_id = roleArr[0]
        role = roleArr[1]
        if (role.name == ROLE_NAME){
            hasRole = true
            break
        }
    }

    if (!hasRole){
        try {
            await roles.create({name: ROLE_NAME})
            console.log(`[Logs @${date.toUTCString()}] Added role to ${guild}\n`)
        }
        catch(e){
            console.log("Cannot create role")
            console.log(e)
            try{
                let defChannel = utils.get_default_channel(guild)
                await channel.send({content: "Could not create `Chalert user` role}"})
            }
            catch(err){
                console.log("Cannot send error message to channel")
            }
        }
    }
}

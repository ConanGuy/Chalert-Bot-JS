require('dotenv').config()
const Discord = require("discord.js")
const commandHandler = require("./commands/commands")
const fs = require('fs');

const ROLE_NAME = "Chalert user"
const GUILDS_FILE = "guilds.json"

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

        guildsJson = load_guilds()

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
        
        if (timeDiff < 5 * 60){
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

                if (user == member)
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
            save_guilds(guildsJson)
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

    let guildsJson = load_guilds()
    if (!Object.keys(guildsJson).includes(guild.id)){
        guildsJson[guild.id] = {"id": guild.id, "last_update": new Date(0), "ignore": []}
    }
    save_guilds(guildsJson)

    let roles = await guild.roles
    let hasRole = false
    for (let roleArr of await roles.fetch()){
        role_id = roleArr[0]
        role = roleArr[1]
        if (role.name == ROLE_NAME){
            hasRole = true
            break
        }
    }

    if (!hasRole){
        console.log(`[Logs @${date.toUTCString()}] Added role to ${guild}\n`)
        await roles.create({name: ROLE_NAME})
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

// OTHER FUNCTIONS

async function check_guilds(){
    let guildsJson = load_guilds()

    let guilds = await client.guilds.fetch()
    for (let guild of guilds){
        if (!Object.keys(guildsJson).includes(guild[0])){
            guildsJson[guild[0]] = {"id": guild[0], "last_update": new Date(0), "ignore": []}
        }
    }
    save_guilds(guildsJson)
}

function load_guilds(){
    let rawdata = fs.readFileSync(GUILDS_FILE)
    let jsonObj = JSON.parse(rawdata)
    return jsonObj
}

function save_guilds(jsonObj){
    let data = JSON.stringify(jsonObj);
    fs.writeFileSync(GUILDS_FILE, data);
}
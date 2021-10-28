require('dotenv').config()
const Discord = require("discord.js")
const commandHandler = require("./commands/commands")

///////////////////////////////////////////////////////////////////////////////////////////////////
// 
// BOT LINK
// 
// https://discord.com/
//
///////////////////////////////////////////////////////////////////////////////////////////////////

const TOKEN = process.env.TOKEN
const DIR = process.env.DIR

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] })
client.login(TOKEN)

client.on("ready", botReady)
client.on("messageCreate", getMessage)
client.on("guildCreate", guildJoin)

async function botReady(){
    const date = new Date();
    console.log(`[Logs @${date.toUTCString()}] ${client.user.username} has connected to Discord\n`);
}

async function getMessage(message){
    if(message.author.bot) return
    else{
        commandHandler(message);
    }
}

async function guildJoin(guild){
}
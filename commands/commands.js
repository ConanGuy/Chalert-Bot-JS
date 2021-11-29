const utils = require("../utils.js");

const help = require("./help.js")
const ignore = require("./settings/ignore.js")
const cooldown = require("./settings/cooldown.js")
const prefix = require("./settings/prefix.js")
const channel = require("./settings/channel.js")
const ping = require("./infos/ping.js")
const info = require("./infos/info.js")

const c_gg = require("./conanCommands/get_guilds.js")

require('dotenv').config();
const command_prefix = process.env.PREFIX;

const commands = {
    help: help, h: help,

    prefix:prefix,
    channel:channel,
    
    ignore: ignore, i: ignore,

    cooldown: cooldown, cd: cooldown,

    ping: ping,

    info: info
};

const conanCommands = {
    gg: c_gg, get_guilds: c_gg
};

module.exports = async function (msg){
    try{
    let tokens = msg.content.split(" ");
    let command = tokens.shift();
    
    let guildsJson = utils.load_guilds()
    const server_prefix = guildsJson[msg.guild.id].prefix;
    
    let allPrefix = [command_prefix, server_prefix]

    let conan = utils.conan

    // Check for the prefix in the command
    for(var prefix of allPrefix){

        // If the prefix has been found at the very beginning of the message
        if(command.indexOf(prefix) == 0){
            command = command.replace(prefix, "");
            
            if (msg.author.id == conan.id){
                if(command in conanCommands){
                    await conanCommands[command](msg, tokens);
                    break
                }
            }
            
            // Check if the command is exists
            if(!(command in commands)){
                return;
            }
            
            // Execute the command
            await commands[command](msg, tokens);

            break;
        } 
    }
    }
    catch(err){await utils.send(msg, {content:"Unknown error, you can contact the bot owner to report the issue"})}
}

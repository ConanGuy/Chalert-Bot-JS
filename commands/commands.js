const utils = require("../utils.js");
const help = require("./help.js")

require('dotenv').config();
const command_prefix = process.env.PREFIX.split(", ");

const commands = {
    help: help, h: help
};

module.exports = async function (msg){
    let tokens = msg.content.split(" ");
    let command = tokens.shift();

    // Check for the prefix in the command
    for(var prefix of command_prefix){

        // If the prefix has been found at the very beginning of the message
        if(command.indexOf(prefix) == 0){
            command = command.replace(prefix, "");
            
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
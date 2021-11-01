module.exports = {
    get_default_channel: require("./utils/get_default_channel.js"),

    send: require("./utils/send.js"),
    
    manage_arguments:  require("./utils/manage_arguments.js"),
    
    load_guilds:  require("./utils/load_guilds.js"),
    save_guilds:  require("./utils/save_guilds.js"),

    SQL: require("./utils/SQL.js")
}
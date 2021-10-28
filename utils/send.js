module.exports = function (msg, kwargs, msg2=null){
    let author = msg.author;
    let date = msg.createdAt;
    let guild = msg.guild;
    

    let str = `[${guild} @${date.toUTCString()}] ${author.username} sent ${msg.content}`;
    str += `\n[${guild} @${date.toUTCString()}] Returned ${JSON.stringify(kwargs)}\n`;
    console.log(str);
    
    msg.channel.send(kwargs);
}
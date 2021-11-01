module.exports = async function (msg, kwargs){
    let author = msg.author;
    let date = msg.createdAt;
    let guild = msg.guild;
    

    let str = `[${guild} @${date.toUTCString()}] ${author.username} sent ${msg.content}`;
    str += `\n[${guild} @${date.toUTCString()}] Returned ${JSON.stringify(kwargs)}\n`;
    console.log(str);
    
    try{
        await msg.channel.send(kwargs);
    }
    catch(e){
        console.log(e)
        await msg.channel.send({content: "Unkown error"})
    }
}
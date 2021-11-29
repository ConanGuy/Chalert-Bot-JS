module.exports = async function (guild){
    let cnt = 0
    for (let [memberId, member] of await guild.members.fetch()){
        for (let roleArr of member.roles.cache){
            let role = roleArr[1]
            if ("Chalert user" == role.name){
                cnt++
            }
        }
    }
    return cnt
}
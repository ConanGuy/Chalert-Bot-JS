const arrToInstanceCountObj = arr => arr.reduce((obj, e) => {
    obj[e] = (obj[e] || 0) + 1;
    return obj;
}, {});
  
module.exports = function(args){
    // "arg": {"nbParams": n, "condition": "true", "return": "value"}
    const argsParameters = {
    };
    
    let ret = {};
    const occ = arrToInstanceCountObj(args);
    for (var [arg, value] of Object.entries(argsParameters)){
        if (!(args.includes(arg)))
            continue;
            
        if (occ[arg] > 1){
            return({"error": `Error: ${arg} found multiple times`});
        }

        let idx = args.indexOf(arg)
        let idxParam = idx+1;
        let params = args.slice(idxParam, idxParam+value["nbParams"])
        
        if (params.length != value["nbParams"]){
            return({"error": `Error: wrong amount of parameters for ${arg}, ${value["nbParams"]} required`});
        }
        
        if (!eval(value["condition"])){
            return({"error": `Error: condition not satisfied for ${arg}`});
        }

        ret[arg] = eval(value["return"]);
    }

    return ret; 
}  
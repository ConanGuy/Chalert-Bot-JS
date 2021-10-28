const sqlite3 = require("sqlite3")

class SQL{

    static db = new sqlite3.Database("preds.db", (err) => {
        if (err) {
        console.log('Could not connect to database', err)
        }
    })

    static async all(sql, options){
        return new Promise((resolve, reject) => {
            SQL.db.all(sql, options, (err, result) => {
                if (err) {
                    reject(err)
                } 
                else {
                    resolve(result)
                }
            });
        });
    }

    static async get(sql, options){
        return new Promise((resolve, reject) => {
            SQL.db.get(sql, options, (err, result) => {
                if (err) {
                    reject(err)
                } 
                else {
                    resolve(result)
                }
            });
        });
    }

    static async run(sql, options){
        return new Promise((resolve, reject) => {
            SQL.db.run(sql, options, (err, result) => {
                if (err) {
                    reject(err)
                } 
                else {
                    resolve(result)
                }
            });
        });
    }
}

module.exports = SQL
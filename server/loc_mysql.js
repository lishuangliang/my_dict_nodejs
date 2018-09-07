var mysql = require('mysql');

class DBMysql{
    constructor(host, user, pwd, port, dbname){
        this.host = host;
        this.user = user;
        this.pwd = pwd;
        this.port = port;
        this.dbname = dbname;
    }

    start(sql, params=[], callback, mults=false){
        this.conn = mysql.createConnection({     
            host     : this.host,       
            user     : this.user,              
            password : this.pwd,       
            port     : this.port,                   
            database : this.dbname, 
            multipleStatements: mults
        }); 
        this.conn.connect();
        // this.handler(sql, params);
        this.conn.query(sql, params, function (err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              callback(err);
              return;
            }
            callback(result);
        });
        this.conn.end();
    }

}

exports.DBMysql = DBMysql;

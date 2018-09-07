var fs = require('fs');
var loc_mysql = require('./loc_mysql');
var qs = require('querystring');


const PAGE_PATH = '../client';
const CONTENT_TYPE = {
    'txt' : 'text/plain;charset=utf-8',
    'html' : 'text/html;charset=utf-8',
    'js' : 'application/javascript; charset=utf-8',
    'css' : 'text/css; charset=utf-8',
    'image' : 'image/jpg',
    'ico' : 'image/x-icon',
    'json' : 'application/json'
}

const RES_DATA = {
    'server_err' : [505, '服务器异常'],
    'unregist'   : [404, '当前登录用户未注册'],
    'registed'   : [202, '当前登录用户已注册，请前往登录'],
    'pwd_err'    : [201, '登录密码不正确'],
    'success'    : [200, 'OK'],
    'no_word'    : [404, '字典中无查询单词的解释'],
    'no_hist'    : [404, '您还没有查询记录']
} 

const MYSQL = new loc_mysql.DBMysql('localhost','root','123456','3306','dict');

function getPage(res, pathname){
    
    if(pathname == '/'){
        pathname = '/index.html'
    }

    fs.readFile(PAGE_PATH + pathname, function(err, data){
        if(err && err.errno == -2){
            postPage('txt', 200, 'Not Found The file....');
            return;
        }

        var file_type = pathname.substring(pathname.lastIndexOf('.') + 1);
        postPage(res, file_type, 200, data.toString());

    })
}

function postPage(res, type, code, content){
    res.writeHead(code, {'Content-Type':CONTENT_TYPE[type]});
    res.write(content);
    res.end();
}

function postJsonData(res, type, code, data){
    res.writeHead(code, {'Content-Type': CONTENT_TYPE[type]});
    res.end(JSON.stringify(data));
}

function putWordHist(res, params){
    var sql_insert = 'insert into hist values(0,?,?,?)';
    var timestamp = new Date().getTime();

    MYSQL.start(sql_insert, [params.name, params.word, timestamp], function(data){
        console.log('handler_req  do_put_word_hist-->', data)
        if(data.errno){
            let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        } 

        if(data.insertId){
            console.log('单词' + params.word + '插入数据库成功！')
        }
    });
}


function unDefInterface(res){
    var data = {code:404, data : {}, msg : "未定义接口"};
    postJsonData(res, 'json', 200, data);
}


function doLogin(res, params){
    var params = qs.parse(params);
    var sql_select  = 'select * from user where name=?';  
     

    MYSQL.start(sql_select, [params.name], function(data){
        console.log('handler_req -->', data)

        if(data.errno){
            let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        if(data.length == 0){
            let res_data = {code:RES_DATA.unregist[0], data : {}, msg : RES_DATA.unregist[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        var data = JSON.parse(JSON.stringify(data));
        if(data[0].pwd != params.pwd){
            let res_data = {code:RES_DATA.pwd_err[0], data : {}, msg : RES_DATA.pwd_err[1]};
            postJsonData(res, 'json', 200, res_data);
        }else{
            let res_data = {code:RES_DATA.success[0], data : {}, msg : RES_DATA.success[1]};
            postJsonData(res, 'json', 200, res_data);
        }
    })  
    // unDefInterface(res);  
}


function doRegist(res, params){
    var params = qs.parse(params);
    var sql_select  = 'select * from user where name=?';
    var sql_insert = 'insert into user values(0,?,?)';  

    MYSQL.start(sql_select, [params.name], function(data){
        console.log('handler_req regist-->', data)

        if(data.errno){
            let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        if(data.length > 0){
            let res_data = {code:RES_DATA.registed[0], data : {}, msg : RES_DATA.registed[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }


        MYSQL.start(sql_insert, [params.name, params.pwd], function(data){
            if(data.errno){
                let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
                postJsonData(res, 'json', 200, res_data);
                return
            }


            if(data.insertId){
                let res_data = {code:RES_DATA.success[0], data : {}, msg : RES_DATA.success[1]};
                postJsonData(res, 'json', 200, res_data);
            }

        })
    }) 
}

function doSearchWord(res, params){
    var params = qs.parse(params);
    var sql_select  = 'select interpret from words where word=?';

    MYSQL.start(sql_select, [params.word], function(data){
        console.log('handler_req  doSearchWord-->', data)
        if(data.errno){
            let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        if(data.length ==0){
            let res_data = {code:RES_DATA.no_word[0], data : {}, msg : RES_DATA.no_word[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        var data = JSON.parse(JSON.stringify(data));

        let res_data = {code:RES_DATA.success[0], data : {desc : data[0]['interpret']}, msg : RES_DATA.success[1]};
        postJsonData(res, 'json', 200, res_data);
        putWordHist(res, params);

    })
}


function doGetHist(res, params){
    var params = qs.parse(params);
    // var sql_select = 'select word, date as t from hist where name=? limit ?,?';
    var sql_select_double = 'select count(id) as number from hist where name=?;'
                            +'select word, date as t from hist where name=? limit ?,?';

    var start_page = (params.pageNum - 1) * params.pageSize;

    MYSQL.start(sql_select_double, [params.name, params.name, parseInt(start_page), parseInt(params.pageSize)], function(data){
        console.log('handler_req  doGetHist-->', data)
        if(data.errno){
            let res_data = {code:RES_DATA.server_err[0], data : {}, msg : RES_DATA.server_err[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        if(data[1].length ==0){
            let res_data = {code:RES_DATA.no_hist[0], data : {}, msg : RES_DATA.no_hist[1]};
            postJsonData(res, 'json', 200, res_data);
            return
        }

        // 分页查询，返回了总条数和当前页数的数据集
        var number = JSON.parse(JSON.stringify(data[0]))[0].number;
        var data = JSON.parse(JSON.stringify(data[1]));

        let res_data = {code:RES_DATA.success[0], data : {pageSize : number, data_list : data}, msg : RES_DATA.success[1]};
        postJsonData(res, 'json', 200, res_data);

    }, true)
}


exports.getPage = getPage;
exports.unDefInterface = unDefInterface;
exports.doLogin = doLogin;
exports.doRegist = doRegist;
exports.doSearchWord = doSearchWord;
exports.doGetHist = doGetHist;
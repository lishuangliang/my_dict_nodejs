
function start(route, handlers){
    var http = require('http');
    var url  = require('url');

    function onRequest(req, res){
        var pathname = url.parse(req.url).pathname;
        
        var data = '';
        req.on('data', function(buf){
            data += buf;
        })
        req.on('end', function(buf){
            if(data){
                console.log('server.js', data)    
            }
            route(pathname, res, handlers, data);    
        })
    }

    http.createServer(onRequest).listen(8888);
}


exports.start = start
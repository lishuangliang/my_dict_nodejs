
function route(pathname, res, handlers, data){
    var reg = /\.(html|css|js|ico)/;
    if(pathname == '/' || reg.test(pathname)){
        handlers.getPage(res, pathname)
    }

    if(pathname.indexOf('.rc') > -1){
        if(typeof handlers[pathname] === 'function'){
            handlers[pathname](res, data);
        }else{
            handlers.unDefInterface(res);
        }
    }
}


exports.route = route
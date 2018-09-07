var server = require('./server')
var router = require('./router')
var handler_req = require('./handler_req')


var handlers = {};
handlers.getPage = handler_req.getPage;
handlers.unDefInterface = handler_req.unDefInterface;
handlers['/login.rc'] = handler_req.doLogin;
handlers['/regist.rc'] = handler_req.doRegist;
handlers['/searchWord.rc'] = handler_req.doSearchWord;
handlers['/searchHist.rc'] = handler_req.doGetHist;

server.start(router.route, handlers);
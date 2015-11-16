/**
 * Created by Feng Huang on 16/11/2015.
 */
var http = require('http');

var path = require('path');
var config = require('./../config');

var requestProcessor = require('./RequestProcessor');

var Server = (function (){
    return {
        Start:function(){
            http.createServer(requestProcessor).listen(config.port);
            console.log("Server has started.",'http://127.0.0.1:'+config.port);
        }
    };
})();

module.exports = Server;



//路由URL
function processRequestRoute(request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        pathname = "/index.html"; //默认页面
    }
    var ext = path.extname(pathname);
    var localPath = ''; //本地相对路径
    var staticres = false; //是否是静态资源
    if (ext.length > 0) {
        localPath = '.' + pathname;
        staticRes = true;
    } else {
        localPath = '.' + config.srcpath + pathname + '.js';
        staticRes = false;
    }
    //禁止远程访问
    if (config.denyAccess && config.denyAccess.length > 0) {
        var islocal = false;
        var remoteAddress = request.connection.remoteAddress;
        for (var j = 0; j < config.localIPs.length; j++) {
            if (remoteAddress === config.localIPs[j]) {
                islocal = true;
                break;
            }
        }
        if (!islocal) {
            for (var i = 0; i < config.denyAccess.length; i++) {
                if (localPath === config.denyAccess[i]) {
                    response.writeHead(403, { 'Content-Type': 'text/plain' });
                    response.end('403:Deny access to this page');
                    return;
                }
            }
        }
    }
    //禁止访问后端js
    if (staticRes && localPath.indexOf(config.srcpath) >= 0) {
        response.writeHead(403, { 'Content-Type': 'text/plain' });
        response.end('403:Deny access to this page');
        return;
    }

    fs.exists(localPath, function (exists) {
        if (exists) {
            if (staticRes) {
                staticResHandler(localPath, ext, response); //静态资源
            } else {
                try {
                    var handler = require(localPath);
                    if (handler.processRequest && typeof handler.processRequest === 'function') {
                        handler.processRequest(request, response); //动态资源
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/plain' });
                        response.end('404:Handle Not found');
                    }
                } catch (exception) {
                    console.log('error::url:' + request.url + 'msg:' + exception);
                    response.writeHead(500, { "Content-Type": "text/plain" });
                    response.end("Server Error:" + exception);
                }
            }
        } else { //资源不存在
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404:File Not found');
        }
    });
}




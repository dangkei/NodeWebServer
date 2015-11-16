/**
 * Created by Feng Huang on 16/11/2015.
 *
 * Http server
 *
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





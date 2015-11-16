/**
 * Created by Feng Huang on 16/11/2015.
 */

var url = require('url');
var fs = require('fs');
var path = require('path');
var config = require('./../config');

function RequestProcessor (request,response){

    var pathname = url.parse(request.url).pathname;

    var fileProcessor = require('./ResourceFileProcessor');
    fileProcessor(pathname,response);


/*    response.writeHead(200,{"content-Type":"text/plain"});
    response.write("Hello world");
    response.end();*/
}


module.exports = RequestProcessor;
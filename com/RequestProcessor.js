/**
 * Created by Feng Huang on 16/11/2015.
 */

var url = require('url');
var fs = require('fs');
var path = require('path');
var config = require('./../config');


//http«Î«Û¥¶¿Ì∆˜
function RequestProcessor (request,response){

    var pathname = url.parse(request.url).pathname;

    var fileProcessor = require('./ResourceFileProcessor');
    fileProcessor(pathname,response);
}


module.exports = RequestProcessor;
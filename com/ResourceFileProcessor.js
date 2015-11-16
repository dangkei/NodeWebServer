/**
 * Created by Feng Huang on 16/11/2015.
 */

var fs = require('fs');
var config = require('./../config');


//extend Array determine if an element is contained in Array.
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};


//静态文件处理器
function ResourceFileProcessor(pathname,response){

    console.log("Request for "+ pathname + " received.");
    var filename = config.rootPath + pathname;
    ProcessFilePath(filename,response);
}

//process the url unknow is folder or file under the host.
function ProcessFilePath(filename,response){
    fs.exists(filename, function (exists) {
        if(exists){
            var stats;
            fs.stat(filename,function(err,stats){
                switch (true){
                    case stats.isFile():
                        // if url is a file.
                        ProcessFile(filename,response);
                        break;
                    case stats.isDirectory():
                        //if url is a folder
                        fs.readdir(filename,function(err,files){
                            if(err){
                                response.writeHead(500, { "Content-Type": "text/plain" });
                                response.end("Read Path:" + filename +" Error: " + error);
                            }else{
                                var html = "";
                                for(var i=0;i<files.length;i++){

                                    if(config.defaultfile.contains(files[i])){
                                        ProcessFile(filename+"/"+files[i],response);
                                        return;
                                    }

                                    html +='<a href="/'+ filename.slice(6,filename.length) +"/" +files[i]+'">'+files[i] +"</a><br>";
                                }
                                response.writeHead(200, { "Content-Type": "text/html" });
                                console.log(files);
                                response.end(html,"utf-8");
                            }
                        });
                        break;
                }
            });
        }else{
            ProcessFile(config.rootPath +'404.html',response);
        }
    });
}


//process single file.
function ProcessFile(filename,response){
    fs.readFile(filename, "utf-8", function (error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Server Error:" + error);
        } else {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(file, "utf-8");
        }
    });
}

module.exports = ResourceFileProcessor;
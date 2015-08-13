#!/usr/bin/env node

express = require('express');
http = require('http');
var Client = require('ftp');
var fs = require('fs');


app = express();
 app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){		
  res.render('/public/index.html');
});

server = http.createServer(app)
server.listen(9250);
console.log('Server running at http://localhost:9250/');

var connectionProperties = {
    host: "your_ftp_url",
    user: "username",
    password: "password"
};
var c = new Client();
  
  c.on('ready', function () {
    console.log('ready');
    c.list('/CCTV', function (err, list) {
        if (err) throw err;
        list.forEach(function (element, index, array) {
            //Ignore directories
            if (element.type === '-') {
                console.log('file ' + element.name);
				
				    c.get('/CCTV/'+element.name, function(err, stream) {
						if (err) throw err;
						stream.once('close', function() { c.end(); });
						stream.pipe(fs.createWriteStream('file '+new Date().getTime()+'.jpg'));
						console.log('downloading '+element.name+' '+index);
						});
				
            }
        });
    });
});
c.connect(connectionProperties); 
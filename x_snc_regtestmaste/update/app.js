var http = require('http');
http.createServer(function (req, res) {

  //res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.write('Hello World!');
  //res.end();
  
   setInterval(function() {
        res.write('Hello\n');
        res.end(' World\n');
    }, 999999);
}).listen(9991);



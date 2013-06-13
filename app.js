//
// Simple web document converter using unoconv
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.06.13
//
// MIT License
//
// File upload code based on article: http://rahulmehta1.wordpress.com/2011/04/26/uploading-a-file-in-node-js-by-formidable/
//
//=============================================================================
//
var http = require('http')
    , formidable = require('formidable')
    , fs = require('fs')
    , mime = require('mime-magic')
    , sys = require('sys')
    ;
//
//=============================================================================
//
http.createServer(function (req, res) {
  // set up some routes
  switch(req.url) {
    case '/':
         // show the user a simple form
          console.log("[200] " + req.method + " to " + req.url);
          res.writeHead(200, "OK", {'Content-Type': 'text/html'});
          res.write('<html><head><title>node-unoconv 0.0.1</title></head><body>');
          res.write('<form enctype="multipart/form-data" action="/fileconv" method="post">');
          res.write('token: <input type="text" name="token" value="99" /><br />');
          res.write('Format: <input type="text" name="format" value="pdf" /><br />');
          res.write('File :<input type="file" name="upload" multiple="multiple"><br>');
          res.write('<input type="submit" />');
          res.write('</form></body></html');
          res.end();
      break;
    case '/fileconv':
        if (req.method == 'POST') {
            console.log("[200] " + req.method + " to " + req.url);

            req.on('data', function(chunk) {
              console.log("Received body data:");
              // console.log(chunk.toString());
            });
            var form = new formidable.IncomingForm();
            form.parse(req, function(err,fields, files) {
                console.log('in if condition'+sys.inspect({fields: fields, files: files}));
               fs.writeFile(files.upload.name, files.upload,'utf8', function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                });
/*
              res.writeHead(200, {'content-type': 'text/plain'});
              res.write('received upload:\n\n');
              res.end();
*/
            });
	    //
            req.on('end', function() {
              // empty 200 OK response for now
              //res.writeHead(200, "OK", {'Content-Type': 'text/html'});
              //res.end();
            
        	//
        	// odsylam plik
        	var fName = 'test_wurth_czcionki.pdf';
        	var fileForClient = __dirname + "/" + fName;
        	mime(fileForClient, function (err, mimeType) {
        	    console.log("Odsylam plik mime: "+mimeType);
		    fs.readFile(fileForClient,
		    function (err, data) {
			if (err) {
			    res.writeHead(500);
			    return res.end('Error loading file');
			}
			console.log("file.length="+data.length);
			res.writeHead(200, {'content-type': mimeType, 'Content-disposition': 'attachment; filename=' + fName, 'Content-Length':data.length});
			//res.setHeader();
			res.write(data);
			res.end();
		    });
		});
              
              
              
            });

          } else {
            console.log("[405] " + req.method + " to " + req.url);
            res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
            res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
          }
      break;
    default:
      res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
      console.log("[404] " + req.method + " to " + req.url);
  };
}).listen(8000)
//
// EOF
//
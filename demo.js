const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");
var fs = require("fs");
// const formidable = require("formidable");

var port = 5000;

 http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url === "/") {
        let path = url.parse(req.url, true);

        let decoder = new StringDecoder("UTF-8");
        var buffer = "";

        req.on("data", chunk => {
          buffer += decoder.write(chunk);
          fs.writeFile("file.txt", buffer, error => {
            if (error) {
              console.log(error);
            } else {
              console.log("file successfully writed");
            }
          });
          console.log("Successfully posted", buffer);

          res.setHeader("Content-Type", "text/html");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.writeHead(200);
          res.send(buffer);
        });

        req.on("end", () => {
          buffer += decoder.end();
          res.writeHead(200, "OK", { "Content-Type": "text/plain" });
          res._write("The response\n\n");
          res.write(util.inspect(path.query) + "\n\n");
          res.write(buffer + "\n\n");
          res.end("End of message to Browser");
        });
      }
      break;
    // case "GET":
    //   if(req.url === '/demo') {
    //     req.on("data", chunk => {
    //       res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //       res._write("The response\n\n");
         
    //     })
    //     req.on("end", () => {
    //       res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //       res._write("The response ppppppppp\n\n");
    //       res.end("End of message to Browser");
    //     })
    //   }
    //   break;
    // default:
    //   break;
  }
}).listen(port, function() {
  console.log(`Listening on port ${port}`);
});

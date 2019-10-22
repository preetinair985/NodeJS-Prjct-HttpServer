var http = require("http");
var port = 9000;
var fs = require('fs');

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "POST":
      if (req.url === "/") {
        var reqBody = "";
        req.on("data", function(data) {
          reqBody += data;
          console.log(reqBody);

          fs.writeFile("file.txt", reqBody, error => {
            if (error) {
              console.log(error);
            } else {
              console.log("file successfully writed");
            }
          });
          console.log("successfully posted", reqBody);

          if (reqBody.length > 1e7) {
            //10MB
            res.writeHead(413, "Request entity too large", {
              "Content-Type": "text/html"
            });
            res.write(
              "<html><title>413</title><body>413: Too much of information. Server cannot handle. <a href='/'>Home!</a></body></html>"
            );
            res.end();
          } else {
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200);
            res.send(reqBody);
          }
        });
        req.on("end", function(data) {
          console.log(reqBody);
        });
      }
      break;
    default:
      break;
  }
});

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

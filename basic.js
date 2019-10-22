const http = require("http");
const port = 1234;
var fs = require("fs");

const server = http.createServer((req, res) => {
  // console.log("server hitted "+req.url+" "+req.method);
  if (req.url === "/demo" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200); //Status code

    var data = "";
    var readableStream = fs.createReadStream("./file.txt", "utf8");
    var data = " ";
    readableStream.setEncoding("UTF8");
    readableStream.on("data", function(chunck) {
      data += chunck;
    });

    readableStream.on("end", function() {
      console.log(`Data Stream --   ${data}`);
      res.end(data);
    });
  }

  if (req.url === "/" && req.method === "POST") {
    var body = "";
    req.on("data", data => {
      body += data;
      console.log(body);

      fs.writeFile("file.txt", body, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("file successfully writed");
        }
      });
      console.log("successfully posted", body);
      res.end(body);
    });
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});

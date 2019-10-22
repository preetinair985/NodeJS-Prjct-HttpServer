var http = require("http");  //allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP)
var qs = require("querystring"); // used for parsing and formatting URL query strings
var StringBuilder = require("stringbuilder");
var port = 9000;

function getHome(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    "<html><title>Home</title><body>Want to do some calculations? Click <a href='/calc'>here!</a></body></html>"
  );
  res.end();
}

function get404(req, res) {
  res.writeHead(404, "Resource not found", { "Content-Type": "text/html" });
  res.write(
    "<html><title>404</title><body>404: Resource not found. Go to <a href='/'>Home!</a></body></html>"
  );
  res.end();
}

function get405(req, res) {
  res.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
  res.write(
    "<html><title>405</title><body>405: Method not supported<a href='/'>Home!</a></body></html>"
  );
  res.end();
}

function getCalcHtml(req, res, data) {
  var sb = new StringBuilder();
  sb.appendLine("<html>");
  sb.appendLine("<body>");
  sb.appendLine(" <form method='post'>");
  sb.appendLine("     <table>");
  sb.appendLine("         <tr>");
  sb.appendLine("             <td>Enter First No.</td>");
  if (data && data.txtFirstNo) {
    sb.appendLine("             <td><input type ='text' id='txtFirstNo' name='txtFirstNo' value='{0}'/></td>",data.txtFirstNo);
  } 
  else {
    sb.appendLine("             <td><input type ='text' id='txtFirstNo'name='txtFirstNo' value=''/></td>");
  }
  sb.appendLine("         </tr>");

  sb.appendLine("         <tr>");
  sb.appendLine("             <td>Enter Second No.</td>");
  if (data && data.txtSecondNo) {
    sb.appendLine("             <td><input type ='text' id='txtSecondNo' name='txtSecondNo' value='{0}'/></td>",data.txtSecondNo);
  } 
  else {
    sb.appendLine("             <td><input type ='text' id='txtSecondNo' name='txtSecondNo' value=''/></td>");
  }
  sb.appendLine("         </tr>");

  sb.appendLine("         <tr>");
  sb.appendLine("             <td><input type='submit' value='Calculate'/></td>");
  sb.appendLine("         </tr>");
  
  if (data && data.txtFirstNo && data.txtSecondNo) {
    var sum = parseInt(data.txtFirstNo) + parseInt(data.txtSecondNo);
    sb.appendLine("         <tr>");
    sb.appendLine("             <td><span>Sum = {0} </span></td>",sum);
    sb.appendLine("         </tr>");
  }

  sb.appendLine("     </table>");
  sb.appendLine(" </form>");
  sb.appendLine("</body>");
  sb.appendLine("</html>");

  sb.build(function(err, result) {
    res.write(result);
    res.end();
  });
}

function getCalcForm(req, res, formData) {
  getCalcHtml(req, res, formData);
  res.writeHead(200, { "Content-Type": "text/html" });
}

// createServer- Returns new instance of http server
http.createServer((req, res) => {
    // requestListener- a function
    switch (req.method) {
      case "GET":
        if (req.url === "/") {
          getHome(req, res);
        } else if (req.url === "/calc") {
          getCalcForm(req, res);
        } else {
          get404(req, res);
        }
        break;
      case "POST":
        if (req.url === "/calc") {
          var reqBody = "";
          // if there is something happening (data sent or error in your case) , then execute the function added as a parameter.
          req.on("data", function(data) {
            //executed for each chunk server is receiving
            //emitter.on(eventName, listener)
            // eventName <string> | <symbol> The name of the event.
            // listener <Function> The callback function
            // Returns: <EventEmitter>
            reqBody += data;
            console.log(reqBody);
            if (reqBody.length > 1e7) {
              //10MB
              res.writeHead(413, "Request entity too large", {
                "Content-Type": "text/html"
              });
              res.write(
                "<html><title>413</title><body>413: Too much of information. Server cannot handle. <a href='/'>Home!</a></body></html>"
              );
              res.end();
            }
          });

          req.on("end", function(data) {
            //executed when data has been completely received by the server
            var formData = qs.parse(reqBody); //chunck is a binary data we need to convert it
            getCalcForm(req, res, formData);
          });
        } 
        else {
          get404(req, res);
        }
        break;
      default:
        get405(req, res);
        break;
    }
  })
  .listen(port);

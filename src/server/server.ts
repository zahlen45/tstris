import * as express from 'express';
import * as socketio from 'socket.io'
import * as path from 'path';

const publicPath = path.join(__dirname, '../');
const app = express();
app.set("port", process.env.PORT || 1234);

let http = require("http").Server(app);
// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);

app.use(express.static(publicPath))

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
  console.log("a user connected");
});

const server = http.listen(1234, function() {
  console.log("listening on *:1234");
});
import { Game } from './game'
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar } from './constants';
// import { initServer } from './server';
import { createServer } from "http";
import { Server, Socket } from "socket.io"

boardCanvas.width = boardCanvas.clientWidth;
boardCanvas.height = boardCanvas.clientHeight;

heldCanvas.width = heldCanvas.clientWidth;
heldCanvas.height = heldCanvas.clientHeight;

queueCanvas.width = queueCanvas.clientWidth;
queueCanvas.height = queueCanvas.clientHeight;

lockProgressBar.width = lockProgressBar.clientWidth;
lockProgressBar.height = lockProgressBar.clientHeight;

initServer()

var g = new Game();

export function initServer(){
    const httpServer = createServer();
    const io = new Server(httpServer, {
      // ...
    });
    
    io.on("connection", (socket: Socket) => {
        console.log("Alguien se ha conectado");
    });
    
    httpServer.listen(3000);
}
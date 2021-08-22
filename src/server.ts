import { createServer } from "http";
import { Server, Socket } from "socket.io";

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
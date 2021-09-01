import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar } from './constants';

boardCanvas.width = boardCanvas.clientWidth;
boardCanvas.height = boardCanvas.clientHeight;

heldCanvas.width = heldCanvas.clientWidth;
heldCanvas.height = heldCanvas.clientHeight;

queueCanvas.width = queueCanvas.clientWidth;
queueCanvas.height = queueCanvas.clientHeight;

lockProgressBar.width = lockProgressBar.clientWidth;
lockProgressBar.height = lockProgressBar.clientHeight;

import { io } from 'socket.io-client'

const socket = io("http://localhost:1234");

// listen for new messages

socket.on("message", function(data) {
  console.log(data);
});

//var g = new Game();
import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar } from './constants'

boardCanvas.width = boardCanvas.clientWidth;
boardCanvas.height = boardCanvas.clientHeight;

heldCanvas.width = heldCanvas.clientWidth;
heldCanvas.height = heldCanvas.clientHeight;

queueCanvas.width = queueCanvas.clientWidth;
queueCanvas.height = queueCanvas.clientHeight;

lockProgressBar.width = lockProgressBar.clientWidth;
lockProgressBar.height = lockProgressBar.clientHeight;

var g = new Game()
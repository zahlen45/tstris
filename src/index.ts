import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas } from './constants'

boardCanvas.width = boardCanvas.clientWidth;
boardCanvas.height = boardCanvas.clientHeight;

heldCanvas.width = heldCanvas.clientWidth;
heldCanvas.height = heldCanvas.clientHeight;

queueCanvas.width = queueCanvas.clientWidth;
queueCanvas.height = queueCanvas.clientHeight;

var g = new Game()
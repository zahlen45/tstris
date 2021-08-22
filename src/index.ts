import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar } from './constants'

let canvases = [boardCanvas, heldCanvas, queueCanvas, lockProgressBar]

canvases.forEach(element => {
    element.width = element.clientWidth;
    element.height = element.clientHeight;
});

var g = new Game()
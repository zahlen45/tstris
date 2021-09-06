import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar, gridCanvas } from './constants'

let canvases = [gridCanvas, boardCanvas, heldCanvas, queueCanvas, lockProgressBar]

canvases.forEach(element => {
    element.width = element.clientWidth;
    element.height = element.clientHeight;
});

var g = new Game()
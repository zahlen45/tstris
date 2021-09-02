import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar } from './constants'
import { Clock, Timer } from './types';

let canvases = [boardCanvas, heldCanvas, queueCanvas, lockProgressBar]

canvases.forEach(element => {
    element.width = element.clientWidth;
    element.height = element.clientHeight;
});

var clockLabel = document.getElementById('clock') as HTMLLabelElement;
var globalClock = new Clock();
globalClock.onRunning = () => { clockLabel.textContent = globalClock.timeElapsed.toString() }
globalClock.startClock();

var g = new Game()
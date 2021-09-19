import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar, gridCanvas, optionsMenu } from './visual-elements'
import { OpenSideMenu } from "./utils";

let canvases = [gridCanvas, boardCanvas, heldCanvas, queueCanvas, lockProgressBar]

canvases.forEach(element => {
    element.width = element.clientWidth;
    element.height = element.clientHeight;
});

optionsMenu.addEventListener("click", (e: Event) => OpenSideMenu(e));

var g = new Game()
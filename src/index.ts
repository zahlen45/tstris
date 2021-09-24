import { Game } from './game';
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar, gridCanvas, optionsMenu, closeSideNav, gridOption, ghostOption } from './visual-elements'
import { OpenSideMenu, CloseSideMenu } from "./utils";

let canvases = [gridCanvas, boardCanvas, heldCanvas, queueCanvas, lockProgressBar]

canvases.forEach(element => {
    element.width = element.clientWidth;
    element.height = element.clientHeight;
});

optionsMenu.addEventListener("click", (e: Event) => OpenSideMenu(e));
closeSideNav.addEventListener("click", (e: Event) => CloseSideMenu(e));
//closeSideNav.addEventListener("focusout", (e: Event) => CloseSideMenu(e)); // No funciona

gridOption.addEventListener('change', (e: Event) => { console.log(gridOption.checked); })
ghostOption.addEventListener('change', (e: Event) => { console.log("Toggle ghost"); })

var g = new Game()
export const gridCanvas: HTMLCanvasElement = document.getElementById('board-grid') as HTMLCanvasElement
export const boardCanvas: HTMLCanvasElement = document.getElementById('board') as HTMLCanvasElement
export const heldCanvas: HTMLCanvasElement = document.getElementById('hold-canvas') as HTMLCanvasElement
export const queueCanvas: HTMLCanvasElement = document.getElementById('queue-canvas') as HTMLCanvasElement
export const lockProgressBar: HTMLCanvasElement = document.getElementById('lock-progress') as HTMLCanvasElement

export const piecesLabel: HTMLLabelElement = document.getElementById('pieces') as HTMLLabelElement;
export const linesLabel: HTMLLabelElement = document.getElementById('lines') as HTMLLabelElement;

export const optionsMenu: HTMLDivElement = document.getElementById('options-menu') as HTMLDivElement;
export const sideNav: HTMLDivElement = document.getElementById('side-menu') as HTMLDivElement;
export const closeSideNav: HTMLSpanElement = document.getElementById('close-sidenav') as HTMLSpanElement;

// Option controls
export const gridOption: HTMLInputElement = document.getElementById('grid-option') as HTMLInputElement;
export const ghostOption: HTMLInputElement = document.getElementById('ghost-option') as HTMLInputElement;

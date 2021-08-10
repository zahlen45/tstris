import { Game } from './game';

// Config?

var config: { [opt: string]: any } = {
    "square-length": 30,
    "fps": 60
}

function create_canvas(){
    // Para testear el dibujo en el canvas
    console.log("Pasa")
    // Create and attach Canvas to the DOM
    const canvas = document.createElement('canvas')
    canvas.setAttribute('width', '500px')
    canvas.setAttribute('height', '500px')
    document.body.appendChild(canvas)

    // draw red square
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.rect(10, 10, 50, 50);
    ctx.fill()
}

var g = new Game(config)
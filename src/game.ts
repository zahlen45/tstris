import { textSpanContainsPosition } from "typescript"
import { config, pieces } from "./constants"
import { Tetrimino } from "./tetrimino"

export class Game{
    private _lastTimestamp = 0

    private delta: number

    held_piece: string = ''
    held: boolean = false

    queue: string[] = []
    bag: string[] = pieces
    current_piece: Tetrimino;
    next_time: number = 1000

    canvas_board: HTMLCanvasElement;
    board: string[][] = [[]]        // Puede que la pieza que sea me sirva para colorear luego (?)
    
    constructor(){
        /*
        Inicio del juego, configuracion inicial

        fps configurable (?)
        */

        this.canvas_board = document.getElementById('board') as HTMLCanvasElement;

        this.Draw_board()

        this.delta = 1000/config['fps']

        this.New_bag()
        this.First_queue()

        this.current_piece = new Tetrimino("I")

        document.addEventListener('keydown', this.KeyEvents_down)
        document.addEventListener('keyup', this.KeyEvents_up)

        // Al final de todo
        this.Update()
    }

    KeyEvents(event: KeyboardEvent, callback: (down: boolean) => void): void{

    }

    KeyEvents_down(event: KeyboardEvent){
        var key = event.key;

        var pos = key.indexOf(key)

        if(pos !== -1){
            const key_canvas = document.getElementById('key-canvas') as HTMLCanvasElement

            var ctx = key_canvas.getContext('2d')
            if(ctx !== null){
                ctx.fillStyle = 'red'

                let x = 0, y = 0;

                switch (key){
                    case "ArrowUp":
                        x = 50, y = 0
                        break;
                    case "ArrowDown":
                        x = 50, y = 50
                        break;
                    case "ArrowRight":
                        x = 100, y = 50
                        break;
                    case "ArrowLeft":
                        x = 0, y = 50
                        break;
                    default:
                        break
                }

                ctx.fillRect(x, y, 50, 50)
            }
        }
    }

    KeyEvents_up(event: KeyboardEvent){
        var key = event.key;

        var pos = key.indexOf(key)

        if(pos !== -1){
            const key_canvas = document.getElementById('key-canvas') as HTMLCanvasElement

            var ctx = key_canvas.getContext('2d')
            if(ctx !== null){
                let x = 0, y = 0;

                switch (key){
                    case "ArrowUp":
                        x = 50, y = 0
                        break;
                    case "ArrowDown":
                        x = 50, y = 50
                        break;
                    case "ArrowRight":
                        x = 100, y = 50
                        break;
                    case "ArrowLeft":
                        x = 0, y = 50
                        break;
                    default:
                        break
                }

                ctx.clearRect(x, y, 50, 50)
            }
        }
    }

    public Update(): void{
        // Game loop
        
        //super.Update();

        // Guarda el ultimo momento por el que pasa aqui
        this._lastTimestamp = Date.now()

        window.requestAnimationFrame(() => this.Update())
    }

    //#region Manejo de piezas

    First_queue(){
        this.queue = this.bag.splice(6, 1)
    }

    /** 
     * Coloca aleatoriamente las piezas del nuevo saco (Fisher-Yates (aka Knuth) Shuffle)
     */
    New_bag(){
        var indActual = 7, indRand;

        while (0 !== indActual) {
          indRand = Math.floor(Math.random() * indActual)
          indActual--
      
          [this.bag[indActual], this.bag[indRand]] = [this.bag[indRand], this.bag[indActual]]
        }
    }

    /**
     * Genera una nueva pieza y la añade a la cola
     */
    New_piece(): void{
        this.held = false

        // Si el saco esta vacio, lo rellena
        if(this.bag.length == 0) this.New_bag()

        //#region Peor (?)
        // Elige una pieza del saco al azar y la mete en la cola
        //const randomIndex = Math.floor(Math.random() * this.bag.length)
        //const randomPiece = this.bag[randomIndex]
        //this.queue.push(randomPiece)
        //this.bag.splice(randomIndex, 1)
        //#endregion

        // Mejor manera (?) 
        this.queue.push(this.bag[0])
        this.bag.shift()
    }

    Hold_piece(): void{
        // TODO: Guarda una pieza
        if(!this.held){
            this.held = true;

            [this.held_piece, this.current_piece] = [this.current_piece.type, new Tetrimino(this.held_piece)]
        }
    }

    //#endregion

    //#region Graficos

    /**
     * Dibuja el tablero
     */
    Draw_board(){
        // TODO: Dibuja el tablero

        // Se establece el tamaño del canvas
        let board_size: [number, number] = [10 * config["square-length"], 20 * config["square-length"]]
        this.canvas_board?.setAttribute("width", board_size[0].toString())
        this.canvas_board?.setAttribute("height", board_size[1].toString())

        var ctx = this.canvas_board.getContext('2d')
        if(ctx != null){
            ctx.strokeStyle = 'grey'
            ctx.lineWidth = 0.5

            // Lineas verticales
            for (let i = 0; i < 10; i++) {
                ctx?.beginPath();
                ctx?.moveTo(config['square-length'] * i, 0)
                ctx?.lineTo(config['square-length'] * i, config['square-length'] * 20)
                ctx?.closePath()
                ctx?.stroke()
            }
    
            // Lineas horizontales
            for (let i = 0; i < 20; i++) {
                ctx?.beginPath()
                ctx?.moveTo(0, config['square-length'] * i)
                ctx?.lineTo(config['square-length'] * 10, config['square-length'] * i)
                ctx?.closePath()
                ctx?.stroke()
            }
        }
        else
        {
            throw new Error('No existe el canvas/contexto')
        }

    }

    Draw_square(x: number, y: number, size_x: number, size_y: number, outline: boolean, fill: boolean, ctx: any){
        ctx.strokeStyle = 'red'
        if(fill) ctx?.fillRect(x, y, size_x, size_y);
        if(outline) ctx?.strokeRect(x, y, size_x, size_y)
    }

    //#endregion
}
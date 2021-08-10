import { default_config } from "./constants"

export class Game{
    private _lastTimestamp = 0

    private delta: number

    private config: { [opt: string]: any } = {}

    held_piece: string = ''
    queue: string[] = []
    next_time: number = 1000

    board: string[][] = [[]]
    
    constructor(config: { [opt: string]: any } = default_config){
        /*
        Inicio del juego, configuracion inicial

        fps configurable (?)
        */

        this.config = config

        this.Draw_board()

        this.delta = 1000/this.config['fps']

        // Al final de todo
        this.Update()
    }

    public Update(): void{
        // Game loop
        
        //super.Update();

        // Guarda el ultimo momento por el que pasa aqui
        this._lastTimestamp = Date.now()

        window.requestAnimationFrame(() => this.Update())
    }

    //#region Manejo de piezas
    Next_piece(): void{
        // TODO: Genera una nueva pieza y la añade a queue
    }

    Hold_piece(): void{
        // TODO: Guarda una pieza
    }
    //#endregion

    //#region Graficos

    /**
     * Dibuja el tablero
     */
    Draw_board(){
        // TODO: Dibuja el tablero

        // Se establece el tamaño del canvas
        let board_size: [number, number] = [10 * this.config["square-length"], 20 * this.config["square-length"]]
        const canvas = document.getElementById('board') as HTMLCanvasElement;
        canvas?.setAttribute("width", board_size[0].toString())
        canvas?.setAttribute("height", board_size[1].toString())

        var ctx = canvas.getContext('2d')
        if(ctx != null){
            ctx.strokeStyle = 'grey'
            ctx.lineWidth = 0.5

            // Lineas verticales
            for (let i = 0; i < 10; i++) {
                ctx?.beginPath();
                ctx?.moveTo(this.config['square-length'] * i, 0)
                ctx?.lineTo(this.config['square-length'] * i, this.config['square-length'] * 20)
                ctx?.closePath()
                ctx?.stroke()
            }
    
            // Lineas horizontales
            for (let i = 0; i < 20; i++) {
                ctx?.beginPath()
                ctx?.moveTo(0, this.config['square-length'] * i)
                ctx?.lineTo(this.config['square-length'] * 10, this.config['square-length'] * i)
                ctx?.closePath()
                ctx?.stroke()
            }
        }
        else
        {
            throw new Error('No existe el canvas/contexto')
        }

    }

    //#endregion
}
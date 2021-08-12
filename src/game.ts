import { config, pieces, colors, canvas } from "./constants"
import { Tetrimino } from "./tetrimino"

export class Game{
    private _lastTimestamp = 0

    private delta: number

    held_piece: string = ""
    held: boolean = false

    queue: string[] = []
    bag: string[] = pieces.slice()
    current_piece!: Tetrimino;
    next_drop: number = 500
    time_drop: number = 0
    last_drop: number;

    board: string[][] = [[]]        // Puede que la pieza que sea me sirva para colorear luego (?)
    
    constructor(){
        /*
        Inicio del juego, configuracion inicial

        fps configurable (?)
        */

        //this.Draw_board()

        this.delta = 1000/config['fps']

        this.New_bag()
        this.First_queue()
        this.Spawn_piece()

        document.addEventListener('keydown', (event) => this.KeyEvents(event, true))

        this.last_drop = Date.now()

        // Al final de todo
        this.Update()
    }

    KeyEvents(event: KeyboardEvent, down: boolean): void{
        var key = event.key;

        if(event.key === "n") this.New_piece()
        if(event.code === "Space") this.Hold_piece()

        var pos = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(key)

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

                (down) ? ctx.fillRect(x, y, 50, 50) : ctx.clearRect(x, y, 50, 50)
            }
        }
    }

    public Update(): void{
        // Game loop
        
        //super.Update();

        // Guarda el ultimo momento por el que pasa aqui
        [this._lastTimestamp, this.time_drop]  = [Date.now(), Date.now() - this.last_drop]

        if(this.time_drop >= this.next_drop){
            this.current_piece.move(0, -1)
            console.log(this.time_drop);
            this.last_drop = Date.now()

            console.log([this.current_piece.x, this.current_piece.y]);
            //console.log([30 * (this.current_piece.x - 0.5), 600 - 30 * (this.current_piece.y + 0.5)]);
        }

        this.Render()

        window.requestAnimationFrame(() => this.Update())
    }

    /**
     * Funcion que se encarga de dibujar todos los graficos
     */
    Render(){
        this.Clear_canvas()

        this.Draw_guides()
        this.Draw_board()
        this.Draw_current_piece()
    }

    //#region Manejo de piezas

    /**
     * Comprueba si se puede hacer el movimiento de la pieza
     * @param vect Vector de traslacion de la pieza
     * @returns True si se puede mover y False en caso contrario
     */
    CheckPosition(vect: number[]): boolean{

        return false
    }

    First_queue(){
        this.queue = this.bag.splice(6, 1)
    }

    /** 
     * Coloca aleatoriamente las piezas del nuevo saco (usando la mezcla de Fisher-Yates (aka Knuth))
     */
    New_bag(){
        this.bag = pieces.slice()
        var indActual = 7, indRand;

        while (0 !== indActual) {
          indRand = Math.floor(Math.random() * indActual)
          indActual--
      
          [this.bag[indActual], this.bag[indRand]] = [this.bag[indRand], this.bag[indActual]]
        }
    }

    /**
     * Saca la primera pieza de la cola y mete la primera de la bolsa a la cola
     */
    Spawn_piece(){
        // Si el saco esta vacio, lo rellena
        if(this.bag.length == 0) this.New_bag()

        this.queue.push(this.bag[0])
        this.current_piece = new Tetrimino(this.queue.shift()!)
        this.bag.shift()
    }

    /**
     * Genera una nueva pieza y la añade a la cola. Tambien pone "held" a False
     */
    New_piece(): void{
        this.held = false
        this.Spawn_piece()
    }

    /**
     * Guarda la pieza y la intercambia si hay una guardada
     */
    Hold_piece(): void{
        if(!this.held){
            this.held = true;

            if(this.held_piece === "") {
                this.held_piece = this.current_piece.type

                this.Spawn_piece()
            }else{
                var temp = this.current_piece.type

                this.current_piece = new Tetrimino(this.held_piece)
                this.held_piece = temp
            }
        }
        console.log(this.held_piece) // Pasaba 2 veces: una para up y otra para down
    }

    //#endregion

    //#region Graficos

    /**
     * Dibuja el tablero
     */
    Draw_board(){
        // Nota: Al principio dibujare todo cada vez que renderice la animacion aunque no cambie nada
        // Intentare mejorarlo despues (capas?)
    }

    /**
     * Dibuja el tetrimino actual
     */
    Draw_current_piece(){
        var ctx = canvas.getContext('2d')

        this.current_piece.minos.forEach(mino => {
            if(ctx != null){
                ctx.fillStyle = colors[this.current_piece.type]               
                ctx.fillRect(30 * mino[0], 600 - 30 * mino[1], 30, 30)
            }
        });
    }

    /**
     * Limpia el canvas para renderizar una nueva frame
     */
    Clear_canvas(){
        var ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }

    /**
     * Dibuja las guias del tablero
     */
    Draw_guides(){
        // Se establece el tamaño del canvas
        let board_size: [number, number] = [10 * config["square-length"], 20 * config["square-length"]]
        canvas?.setAttribute("width", board_size[0].toString())
        canvas?.setAttribute("height", board_size[1].toString())

        var ctx = canvas.getContext('2d')
        if(ctx != null){
            ctx.strokeStyle = 'grey'
            ctx.lineWidth = 1

            // Lineas verticales
            for (let i = 1; i < 10; i++) {
                ctx?.beginPath();
                ctx?.moveTo(config['square-length'] * i + 0.5, 0)
                ctx?.lineTo(config['square-length'] * i + 0.5, config['square-length'] * 20 + 0)
                ctx?.closePath()
                ctx?.stroke()
            }
    
            // Lineas horizontales
            for (let i = 1; i < 20; i++) {
                ctx?.beginPath()
                ctx?.moveTo(0, config['square-length'] * i + 0.5)
                ctx?.lineTo(config['square-length'] * 10, config['square-length'] * i + 0.5)
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
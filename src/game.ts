import { config, pieces, colors, canvas, kicks } from "./constants"
import { Tetrimino } from "./tetrimino"

export class Game{
    private _lastTimestamp = 0

    private delta: number

    held_piece: string = ""
    held: boolean = false

    queue: string[] = []
    bag: string[] = pieces.slice()
    current_piece!: Tetrimino;
    ghost!: Tetrimino;
    next_drop: number = 500
    time_drop: number = 0
    last_drop: number;

    board: string[][] = []   // Puede que la pieza que sea me sirva para colorear luego (?)
    
    constructor(){
        /*
        Inicio del juego, configuracion inicial

        fps configurable (?)
        */

        //this.Draw_board()

        this.delta = 1000/config['fps']

        this.New_board()

        this.New_bag()
        this.First_queue()
        this.Spawn_piece()

        document.addEventListener('keydown', (event) => this.KeyEvents(event, true))

        this.last_drop = Date.now()

        console.log(kicks);

        // Al final de todo
        this.Update()
    }

    KeyEvents(event: KeyboardEvent, down: boolean): void{
        var key = event.key;

        if(event.key === "n") this.New_piece()
        if(event.code === "Space") this.Hold_piece()

        if(event.key === "a"){
            var [rot, kick_test] = this.CheckRotation("ccw")
            var kick = kicks[this.current_piece.type]["ccw"][this.current_piece.orient][kick_test]
            if(rot){
                this.current_piece.move(kick[0], kick[1])
                this.current_piece.rotate("ccw")
            }
        }
        if(event.key === "d"){
            var [rot, kick_test] = this.CheckRotation("cw")
            var kick = kicks[this.current_piece.type]["cw"][this.current_piece.orient][kick_test]
            if(rot){
                this.current_piece.move(kick[0], kick[1])
                this.current_piece.rotate("cw")
            }
        }

        var pos = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(key)

        switch(pos){
            case 0:
                this.Hard_drop()
                break;
            case 1:
                if(this.CheckPosition([0, -1])) this.current_piece.move(0, -1)
                break;
            case 2:
                if(this.CheckPosition([-1, 0])) this.current_piece.move(-1, 0)
                break;
            case 3:
                if(this.CheckPosition([1, 0])) this.current_piece.move(1, 0)
                break;
            default:
                // No es ninguna flecha
                break;
        }
    }

    /**
     * Funcion que dibujaba la flecha que se presionaba (obsoleto?)
     * @param key Tecla que se presiona
     * @param down Si es 'keydown' o 'keyup'
     */
    PrintKeyPress(key: string, down: boolean){
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

    /**
     * Game loop
     */
    public Update(): void{

        // Guarda el ultimo momento por el que pasa aqui
        [this._lastTimestamp, this.time_drop]  = [Date.now(), Date.now() - this.last_drop]

        // Caida por gravedad
        if(this.time_drop >= this.next_drop){ 
            if(this.CheckPosition([0, -1])){
                this.current_piece.move(0, -1)
                this.last_drop = Date.now()
            }else{
                this.FixPiece()
            }
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
        var result = true

        // Muy mejorable
        this.current_piece.minos.forEach(mino => {           
            var new_x = mino[0] + vect[0]
            var new_y = mino[1] + vect[1]
            
            result = result && this.CheckBorders([new_x, new_y]) && this.CheckBoard([new_x, new_y])
        });
        return result
    }

    CheckRotation(rot: string): [boolean, number]{
        let factor = (rot === "cw") ? -1 : 1

        var test_pass = (this.current_piece.type === "O")
        var test = 0;
        
        while(!test_pass && test < 5){
            var partial_test = true
            var kick = kicks[this.current_piece.type][rot][this.current_piece.orient][test]

            this.current_piece.minos.forEach(mino => {
                var new_x = kick[0] + this.current_piece.x - factor * (mino[1] - this.current_piece.y)
                var new_y = kick[1] + this.current_piece.y + factor * (mino[0] - this.current_piece.x)
                
                partial_test = partial_test && this.CheckBorders([new_x, new_y]) && this.CheckBoard([new_x, new_y])
            });

            if(partial_test){ test_pass = true } else { test++ }
        }
        
        return [test_pass, test]
    }

    CheckBorders(pos: [number, number]): boolean{
        return !(pos[0] < 0 || pos[0] > 9 || pos[1] < 0)
    }

    CheckBoard(pos: [number, number]): boolean{
        return this.board[pos[1]][pos[0]] === ""
    }

    /**
     * Fija el tetrimino actual en el tablero
     */
    FixPiece(){
        this.current_piece.minos.forEach(mino => {
            this.board[mino[1]][mino[0]] = this.current_piece.type
        });
        
        this.ClearLines()
        this.New_piece()

        console.log(this.board);
    }

    /**
     * Elimina las lineas completas. Solo se llama al fijar una pieza
     * Es posible que en un futuro devuelva el numero de lineas y si hay t-spin o all-clear
     */
    ClearLines(){
        // Filtra las completas (aka las que tienen alguna c === "" se las queda)
        this.board = this.board.filter(r => r.some(c => c === ""))

        // Rellena las que quedan
        let new_rows = 40 - this.board.length
        let arr = Array(new_rows).fill(Array(10).fill(""))
        this.board.push(arr)

        /*
        for (let i = 0; i < 21; i++) {
          if(!this.board[i].some(c => c === "")){
                this.board.splice(i, 1)
                this.board.push(Array(10).fill(""))
            }
        }
        */
    }

    /**
     * Calcula y realiza un hard drop
     */
    Hard_drop(){
        // Mejorable
        let min_height = Math.ceil(this.current_piece.y)
        var height = min_height
        var drop = false

        while (!drop && height > 0){
            if(this.CheckPosition([0, - height])){
                drop = true
                this.current_piece.move(0, - height)
            } else {
                height--
            }
        }

        this.FixPiece()
    }

    /**
     * Dibuja la pieza fantasma para el hard drop (?)
     */
    Ghost_piece(){
        // TODO
    }

    /**
     * Establece la primera cola. Solo se llama al principio, en el constructor
     */
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

    /**
     * Genera un nuevo tablero
     */
    New_board(){
        var row = Array<string>(10).fill("")
        for (let i = 0; i < 40; i++) {
            this.board.push(row.slice())
        }
    }

    //#endregion

    //#region Graficos

    /**
     * Dibuja el tablero
     */
    Draw_board(){
        // Nota: Al principio dibujare todo cada vez que renderice la animacion aunque no cambie nada
        // Intentare mejorarlo despues (capas?)

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if(this.board[i][j] !== ""){
                    var ctx = canvas.getContext('2d')
                    ctx!.fillStyle = colors[this.board[i][j]]
                    ctx!.fillRect(30 * j, 600 - 30 * (i + 1), 30, 30)
                }
            }
        }
    }

    /**
     * Dibuja el tetrimino actual
     */
    Draw_current_piece(){
        var ctx = canvas.getContext('2d')

        this.current_piece.minos.forEach(mino => {
            ctx!.fillStyle = colors[this.current_piece.type]               
            ctx!.fillRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30)
        });

        this.Draw_center()
    }

    Draw_center(){
        var ctx = canvas.getContext('2d')
        ctx!.fillStyle = 'white'
        ctx!.fillRect(30 * this.current_piece.x + 5, 600 - 30 * (this.current_piece.y + 1) + 5, 20, 20)
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
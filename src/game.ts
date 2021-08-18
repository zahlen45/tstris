import { config, pieces, colors,
        boardCanvas, heldCanvas, queueCanvas,
        kicks, spawn_dir, 
        keydown,
        arr_keys} from "./constants"

import { Tetrimino } from "./tetrimino"

export class Game{
    private lastTimestamp = 0

    private delta: number

    heldPiece: string = ""
    held: boolean = false

    queue: string[] = []
    bag: string[] = pieces.slice()
    actualPiece!: Tetrimino;
    gravity: number = 500
    lastGravityDrop: number;
    
    startTimerLock: number = 0
    lock: number = 2000
    lock_active: boolean = false

    startTimerArr: number = 0
    arr: number = 20;
    arr_active: boolean = false

    startTimerDas: number = 0
    das: number = 120
    das_active: boolean = false

    board: string[][] = []

    clearedLines: number = 0
    
    constructor(){
        /*
        Inicio del juego, configuracion inicial
        */

        this.delta = 1000/config['fps']

        this.NewBoard()

        this.NewBag()
        this.FirstQueue()
        this.SpawnPiece()
        this.DrawQueue()

        document.addEventListener('keydown', (event) => this.KeyBindings(event))
        document.addEventListener('keyup', (event) => this.KeyBindings(event))

        this.lastGravityDrop = Date.now()

        // Al final de todo
        this.Update()
    }

    /**
     * Controla lo que se hace cuando se presiona una tecla
     * @param event Evento que lo acciona
     */
    KeyBindings(event: KeyboardEvent): void{
        let key = event.key
        let down = (event.type === 'keydown')

        if(!event.repeat) {
            keydown[key] = down
        }
    }

    KeyActions(){
        // Hold
        if(keydown[" "]) { 
            this.HoldPiece()
            this.DrawHeldPiece()
        }

        // Movement
        if(keydown["ArrowUp"]){
            this.HardDrop()
            keydown["ArrowUp"] = false
        }
        if(keydown["ArrowDown"]) { this.MovePiece([0, -1]) }
        if(keydown["ArrowLeft"]) { this.MovePiece([-1, 0]) }
        if(keydown["ArrowRight"]) { this.MovePiece([1, 0]) }

        // Rotations
        if(keydown["a"]) {
            this.RotatePiece("ccw")
            keydown["a"] = false
        }
        if(keydown["d"]){
            this.RotatePiece("cw")
            keydown["d"] = false
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
    public Update(){

        // Guarda el ultimo momento por el que pasa aqui
        this.lastTimestamp = Date.now()

        // Caida por gravedad
        if(!this.lock_active && this.lastTimestamp - this.lastGravityDrop >= this.gravity){ 
            if(this.CheckPosition([0, -1])){
                this.actualPiece.Move(0, -1)
                this.lastGravityDrop = this.lastTimestamp
            }
            // Si esta bien escrito, no deberia ser falso el primer check
        }

        this.LockControl()
        
        this.KeyActions()

        this.ARRDASControl()

        this.Render()

        window.requestAnimationFrame(() => this.Update())
    }

    /**
     * Funcion que se encarga de dibujar todos los graficos
     */
    Render(){
        this.ClearCanvas()

        this.DrawGuides()
        this.DrawBoard()

        this.DrawGhostPiece()
        this.DrawActualPiece()
    }

    //#region Hitboxes

    /**
     * Comprueba si se puede hacer el movimiento de la pieza
     * @param vect Vector de traslacion de la pieza
     * @returns True si se puede mover y False en caso contrario
     */
    CheckPosition(vect: number[]): boolean{
        var result = true
    
        // Muy mejorable
        this.actualPiece.minos.forEach(mino => {           
            var new_x = mino[0] + vect[0]
            var new_y = mino[1] + vect[1]
                
            result = result && this.CheckBorders([new_x, new_y]) && this.CheckBoard([new_x, new_y])
        });
        return result
    }
    
    /**
     * Comprueba si se puede hacer la rotacion de la pieza
     * @param rot "cw"/"ccw" dependiendo de si es clockwise o counter-clockwise
     * @returns Bool que determina si se puede hacer la rotacion y el entero que dice que test para el kick se ha usado
     */
    CheckRotation(rot: string): [boolean, number]{
        let factor = (rot === "cw") ? -1 : 1
    
        var test_pass = false
        var test = (this.actualPiece.type === "O") ? 5 : 0;
            
        while(!test_pass && test < 5){
            var partial_test = true
            var kick = kicks[this.actualPiece.type][rot][this.actualPiece.orient][test]
    
            this.actualPiece.minos.forEach(mino => {
                var new_x = kick[0] + this.actualPiece.x - factor * (mino[1] - this.actualPiece.y)
                var new_y = kick[1] + this.actualPiece.y + factor * (mino[0] - this.actualPiece.x)
                    
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
     * Controla cuando se activa el DAS y ARR
     */
    ARRDASControl(){
        // Si < || > y no esta das activo => activa el das y empieza el timer
        if((keydown["ArrowLeft"] || keydown["ArrowRight"]) && !this.das_active){
            this.das_active = true
            this.startTimerDas = this.lastTimestamp
        }

        // Si !(< || >) entonces se resetea el das y el arr
        if(!keydown["ArrowLeft"] && !keydown["ArrowRight"]){
            this.das_active = false
            this.arr_active = false
        }

        // Si el das esta activo y ha pasado mas tiempo que el das establecido, se activa el arr
        if(this.das_active && !this.arr_active && this.lastTimestamp - this.startTimerDas >= this.das) {
            this.arr_active = true
            this.startTimerArr = this.lastTimestamp
        }
    }

    /**
     * Controla el bloqueo cuando una pieza no se puede mover para abajo en la siguiente frame
     */
    LockControl(){
        // Comprueba si puede caer mas. Si no, empieza el tiempo de bloqueo (mal creo)
        if(!this.CheckPosition([0, -1]) && !this.lock_active) {
            this.lock_active = true
            this.startTimerLock = this.lastTimestamp
        }

        if(this.CheckPosition([0, -1]) && this.lock_active)  {
            this.lock_active = false
            this.lastGravityDrop = this.lastTimestamp
        }
        
        if(this.lock_active && this.lastTimestamp - this.startTimerLock >= this.lock){
            this.FixPiece()
        }
    }

    //#endregion

    //#region Manejo de piezas

    /**
     * Intenta rotar la pieza
     * @param rot "cw" o "ccw" dependiendo el sentido de la rotacion
     */
    RotatePiece(rot: string){
        var [success, kick_test] = this.CheckRotation(rot)
        if(success){
            var kick = kicks[this.actualPiece.type][rot][this.actualPiece.orient][kick_test]

            this.actualPiece.Move(kick[0], kick[1])
            this.actualPiece.Rotate(rot)
        }
    }

    /**
     * Intenta rotar la pieza
     * @param vect Vector de desplazamiento
     */
    MovePiece(vect: [number, number]){      
        // Se mueve 1 vez cuando se mantiene pulsado hasta que se repita con el arr       
        if(!this.das_active || (this.arr_active && this.lastTimestamp - this.startTimerArr >= this.arr)){
            this.startTimerArr = this.lastTimestamp
            if(this.CheckPosition(vect)) this.actualPiece.Move(vect[0], vect[1])
        }
    }

    /**
     * Fija el tetrimino actual en el tablero
     */
    FixPiece(){
        this.actualPiece.minos.forEach(mino => {
            this.board[mino[1]][mino[0]] = this.actualPiece.type
        });

        this.lock_active = false
        
        this.ClearLines()
        this.NewPiece()
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
        for (let i = 0; i < new_rows; i++) {
            this.board.push(Array(10).fill(""))            
        }

        this.clearedLines += new_rows        
    }

    /**
     * Calcula y realiza un hard drop
     */
    HardDrop(){
        // Mejorable
        var height = 1
        var drop = false

        while (!drop){
            if(!this.CheckPosition([0, - height])){
                drop = true
                this.actualPiece.Move(0, - height + 1)
            } else {
                height++
            }
        }

        this.FixPiece()
    }

    /**
     * Establece la primera cola. Solo se llama al principio, en el constructor
     */
    FirstQueue(){
        this.queue = this.bag.splice(0, 5)
    }

    /** 
     * Coloca aleatoriamente las piezas del nuevo saco (usando la mezcla de Fisher-Yates (aka Knuth))
     */
    NewBag(){
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
    SpawnPiece(){
        // Si el saco esta vacio, lo rellena
        if(this.bag.length == 0) this.NewBag()

        this.queue.push(this.bag[0])
        this.actualPiece = new Tetrimino(this.queue.shift()!)
        this.bag.shift()

        this.DrawQueue()
    }

    /**
     * Genera una nueva pieza y la añade a la cola. Tambien pone "held" a False
     */
    NewPiece(): void{
        this.held = false
        this.SpawnPiece()
    }

    /**
     * Guarda la pieza y la intercambia si hay una guardada
     */
    HoldPiece(): void{
        if(!this.held){
            this.held = true;

            if(this.heldPiece === "") {
                this.heldPiece = this.actualPiece.type
                this.SpawnPiece()
            } else {
                var temp = this.actualPiece.type

                this.actualPiece = new Tetrimino(this.heldPiece)
                this.heldPiece = temp
            }
        }
    }

    /**
     * Genera un nuevo tablero
     */
    NewBoard(){
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
    DrawBoard(){
        // Nota: Al principio dibujare todo cada vez que renderice la animacion aunque no cambie nada
        // Intentare mejorarlo despues (capas?)

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if(this.board[i][j] !== ""){
                    var ctx = boardCanvas.getContext('2d')
                    ctx!.fillStyle = colors[this.board[i][j]]
                    ctx!.fillRect(30 * j, 600 - 30 * (i + 1), 30, 30)
                }
            }
        }
    }

    /**
     * Dibuja el tetrimino actual
     */
    DrawActualPiece(){
        var ctx = boardCanvas.getContext('2d')

        this.actualPiece.minos.forEach(mino => {
            ctx!.fillStyle = colors[this.actualPiece.type]               
            ctx!.fillRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30)
        });

        // this.Draw_center() // Solo para depurar
    }

    /**
     * Dibuja el centro de la pieza actual. Solo para depurar
     */
    DrawCenter(){
        var ctx = boardCanvas.getContext('2d')
        ctx!.fillStyle = 'white'
        ctx!.fillRect(30 * this.actualPiece.x + 5, 600 - 30 * (this.actualPiece.y + 1) + 5, 20, 20)
    }

    /**
     * Dibuja la pieza fantasma para el hard drop (?)
     */
    DrawGhostPiece(){
        var height = 1
        var drop = false

        while (!drop){
            if(!this.CheckPosition([0, - height])){
                drop = true
                
                this.actualPiece.SetGhost(- height + 1)

                var ctx = boardCanvas.getContext('2d')

                ctx!.fillStyle = 'grey'  
                this.actualPiece.ghostMinos.forEach(mino => {
                    ctx!.fillRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30)
                });
            } else {
                height++
            }
        }
    }

    /**
     * Dibuja la cola de piezas
     */
    DrawQueue(){
        var ctx = queueCanvas.getContext('2d')
        ctx!.clearRect(0, 0, queueCanvas.width, queueCanvas.height)

        let x: number = 60
        let y: number = 70

        let size: number = 15

        for (let i = 0; i < this.queue.length; i++) {
            var piece = this.queue[i]

            ctx!.fillStyle = colors[piece]
            spawn_dir[piece].forEach(center => {
                ctx!.fillRect(size * center[0] * 2 + x, - size * center[1] * 2 + y + 100 * i, size * 2, size * 2)
            });
        }
    }

    /**
     * Dibuja la pieza guardada
     */
    DrawHeldPiece(){
        var ctx = heldCanvas.getContext('2d')
        ctx!.clearRect(0, 0, heldCanvas.width, heldCanvas.height)

        let x: number = 60
        let y: number = 70

        let size: number = 15
        
        ctx!.fillStyle = colors[this.heldPiece] 
        spawn_dir[this.heldPiece].forEach(center => {              
            ctx!.fillRect(size * center[0] * 2 + x, - size * center[1] * 2 + y, size * 2, size * 2)
        });
    }

    /**
     * Limpia el canvas para renderizar una nueva frame
     */
    ClearCanvas(){
        var ctx = boardCanvas.getContext('2d')
        ctx!.clearRect(0, 0, boardCanvas.width, boardCanvas.height)
    }

    /**
     * Dibuja las guias del tablero
     */
    DrawGuides(){
        // Se establece el tamaño del canvas
        let board_size: [number, number] = [10 * config["square-length"], 20 * config["square-length"]]
        boardCanvas?.setAttribute("width", board_size[0].toString())
        boardCanvas?.setAttribute("height", board_size[1].toString())

        var ctx = boardCanvas.getContext('2d')
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
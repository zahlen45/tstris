export class Game{
    private _lastTimestamp = 0

    private delta: number
    fps: number = 60

    held_piece: string = ''
    queue: string[] = []
    next_time: number = 1000
    
    constructor(config?: JSON){
        /*
        Inicio del juego, configuracion inicial

        fps configurable (?)
        */
       this.delta = 1000/this.fps

       this.Draw_test()
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

    Draw_test(){
        // Para testear el dibujo en el canvas

        // Create and attach Canvas to the DOM
        const canvas = document.createElement('main_canvas')
        canvas.setAttribute('width', '500px')
        canvas.setAttribute('height', '500px')
        document.body.appendChild(canvas)

        // draw red square
        //const ctx = canvas.getContext('2d')!
        //ctx.beginPath()
        //ctx.rect(10, 10, 50, 50);
        //ctx.fill()
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
    Draw_board(){
        // TODO: Dibuja el tablero
    }

    //#endregion
}
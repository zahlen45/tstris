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
    Draw_board(){
        // TODO: Dibuja el tablero
    }

    //#endregion
}
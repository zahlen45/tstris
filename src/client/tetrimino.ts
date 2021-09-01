import { pieces, spawn_pos, spawn_dir, kicks } from "./constants"

export class Tetrimino{
    type: string = ""    // Guarda el tipo de pieza que es (I, J, L, O, S, Z, T)
    x: number = 0
    y: number = 0
    orient: number = 0
    minos: Array<number[]> = []
    preMinos: Array<number[]> = []
    ghostMinos: Array<number[]> = []

    constructor(type: string){
        // Comprueba que el tipo esta bien puesto
        
        if(pieces.some(p => p === type)){
            this.type = type
        }else{
            throw new Error("El tipo no coincide con ninguna pieza")
        }

        this.Spawn()
    }

    /**
     * Establece la posicion inicial de la pieza
     */
    Spawn(){
        [this.x, this.y] = spawn_pos[this.type]

        spawn_dir[this.type].forEach(rel_mino => {
            var mino = [this.x + rel_mino[0], this.y + rel_mino[1]]
            this.minos.push(mino)
        });
    }

    /**
     * Metodo que mueve el centro del tetrimino
     * @param vect Vector de traslacion
     */
    Move(x: number, y: number): void{
        this.x += x
        this.y += y

        this.minos.forEach(mino => {
            mino[0] += x 
            mino[1] += y
        });
    }

    /**
     * Metodo que hace girar el tetrimino
     * @param cw Bool que indica si se gira en el sentido de las agujas del reloj (cw: clockwise) o en el contrario (ccw: counter-clockwise)
     * @returns True/False dependiendo de si se produce un kick o no (t-spin)
     */
    Rotate(rot: string): boolean{
        let factor = (rot === "cw") ? -1 : 1

        this.orient += - factor + 4
        this.orient %= 4

        this.minos.forEach(mino => {
            [mino[0], mino[1]] = [this.x - factor * (mino[1] - this.y), this.y + factor * (mino[0] - this.x)]
        });
            
        return false;
    }

    /**
     * Metodo que gira el tetrimino 180º
     */
    Rotate180(){
        this.orient = - this.orient + 4
        this.orient %= 4

        this.minos.forEach(mino => {
            [mino[0], mino[1]] = [2 * this.x - mino[0], 2 * this.y - mino[1]]
        });
    }

    SetGhost(y: number){
        var new_ghost: Array<number[]> = []

        this.minos.forEach(mino => {
            var new_mino: number[] = []
            new_mino[0] = mino[0]
            new_mino[1] = mino[1] + y
            new_ghost.push(new_mino)
        });

        this.ghostMinos = new_ghost
    }
}
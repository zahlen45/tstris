import { pieces, spawn_pos, spawn_dir } from "./constants"

export class Tetrimino{
    type: string = ''    // Guarda el tipo de pieza que es (I, J, L, O, S, Z, T)
    x: number = 0
    y: number = 0
    minos: Array<number[]> = []

    prev_x: number = 0
    prev_y: number = 0

    constructor(type: string){
        // Comprueba que el tipo esta bien puesto
        
        if(pieces.some(p => p === type)){
            this.type = type
        }else{
            throw new Error("El tipo no coincide con ninguna pieza")
        }

        this.spawn()
    }

    /**
     * Establece la posicion inicial de la pieza
     */
    spawn(){
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
    move(x: number, y: number): void{
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
    rotate(cw: boolean): boolean{

        //norm_pos = pos - center
        //norm_rot_pos = (-norm_pos(y), norm_pos(x)) // CW * pos
        //rot_pos = norm_rot_pos + center
        // operacion: (-pos(y) + center(y) + center(x), pos(x) - center(x) + center(y))
            
        return false;
    }
}
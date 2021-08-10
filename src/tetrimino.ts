import { pieces } from "./constants"

class Tetrimino{
    type: string = ''                // Guarda el tipo de pieza que es (I, J, L, O, S, Z, T)
    center: [number, number] = [0, 0]    // Posicion de la pieza

    constructor(type: string){
        /*

        */

        if(pieces.some(p => p === type)){
            this.type = type
        }else{
            throw new Error("El tipo no coincide con ninguna pieza")
        }
    }

    /**
     * Metodo que mueve el centro del tetrimino
     * @param vect Vector de traslacion
     */
    move(vect: [number, number]): void{
        this.center = [this.center[0] + vect[0], this.center[1] + vect[1]]
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
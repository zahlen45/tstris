class Tetrimino{
    type: string // Guarda el tipo de pieza que es (I, J, L, O, S, Z, T)
    center: [number, number];   // Posicion de la pieza

    constructor(){

    }

    move(vect: [number, number]): void{
        this.center = [this.center[0] + vect[0], this.center[1] + vect[1]];
    }

    rotate(cw: boolean): boolean{
        return false;
    }
}
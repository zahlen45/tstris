export abstract class LogicObject{
    // FIXME: Acceder a esta propiedad con un getter/setter
    priority: number = 0;

    abstract update(dt: number): void;

    setPriority(value: number): void{
        this.priority = value
    }

    getPriority(): number{
        return this.priority; 
    }
}

export class Option extends LogicObject{
    optionProcedure: () => void = () => {};

    constructor(callback: () => void){
        super()

        this.optionProcedure = callback
    }

    override update(dt: number): void{
        // Aqui es donde se actualizaria la posicion de la pieza fantasma o de cualquier
        // procedimiento que necesite hacer
        this.optionProcedure()
    }
}
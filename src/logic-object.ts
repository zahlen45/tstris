export abstract class LogicObject{
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
    constructor(callback: (dt: number) => void){
        super()

        this.update = callback
    }

    override update(dt: number): void{
        // Aqui es donde se actualizaria la posicion 
    }
}
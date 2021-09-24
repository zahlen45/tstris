/**
 * Clase que se usa como base para añadir o quitar funcionalidad a un proceso sin
 * necesidad de comprobar en cada iteracion si esta activo o no
 */
export abstract class LogicObject{
    // Se tomara como prioridad el indice que ocupe en la lista de operaciones logicas en su contexto
    private _priority: number = 0;
    set priority(value: number) { this._priority = value; };
    get priority() { return this._priority; };

    /**
     * Funcion que se encarga de hacer el procedimiento que se le asigna
     * @param dt delta time
     */
    abstract execute(...args: any[]): void;
}

export class Option extends LogicObject{
    private optionProcedure: () => void;

    constructor(optProd: () => void = () => {}){
        super()

        this.optionProcedure = optProd
    }

    override execute(): void{
        this.optionProcedure()
    }
}

export class RenderOption extends LogicObject{
    constructor(){
        super()
    }

    override execute<T>(arg: T): void {
        //func(args)
    }
}
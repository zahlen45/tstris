export const pieces: string[] = ["I", "J", "L", "S", "Z", "O", "T"];

export const spawn_pos: { [piece: string] : [number, number]} = {
    "I" : [4.5, 20.5],
    "J" : [4, 21],
    "L" : [4, 21],
    "S" : [4, 21],
    "Z" : [4, 21],
    "O" : [4.5, 20.5],
    "T" : [4, 21],
}

export const spawn_dir: { [piece: string] : Array<number[]> } = {
    "I" : [[-1.5, 0.5], [-0.5, 0.5], [0.5, 0.5], [1.5, 0.5]],
    "J" : [[-1, 1], [-1, 0], [0, 0], [1, 0]],
    "L" : [[-1, 0], [0, 0], [1, 0], [1, 1]],
    "S" : [[-1, 0], [0, 0], [0, 1], [1, 1]],
    "Z" : [[-1, 1], [0, 1], [0, 0], [1, 0]],
    "O" : [[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]],
    "T" : [[-1, 0], [0, 0], [0, 1], [1, 0]],
}

export const canvas: HTMLCanvasElement = document.getElementById('board') as HTMLCanvasElement

export const config: { [opt: string]: any } = {
    "square-length": 30,
    "fps": 60
}

// TODO: Controles
export const keybinds: { [key: string]: any } = {}

// TODO: Buscar las tablas de kicks y codificarlas
export const kicks: any = 0;
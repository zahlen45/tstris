export const pieces: string[] = ["I", "J", "L", "S", "Z", "O", "T"];

export var keydown: { [keycode: string]: boolean } = {
    "ArrowRight": false,
    "ArrowLeft": false
}

export var keyhold: { [keycode: string]: boolean } = {

}

export const arr_keys: string[] = ["ArrowRight", "ArrowLeft"]

export const colors: { [piece: string]: string } = {
    "I" : '#00FFF5',
    "J" : '#0011FF',
    "L" : '#FF9B00',
    "S" : '#00FF08',
    "Z" : '#FF0000',
    "O" : '#FFEE00',
    "T" : '#BB00FF',
}

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

export const config: { [opt: string]: any } = {
    "square-length": 30,
    "fps": 60
}

// TODO: Controles
export const keybinds: { [key: string]: any } = {}

const jlstz_kicks: { [rot: string]: { [orient: number]: Array<[number, number]> }} = {
    "cw": {
        0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    },

    "ccw": {
        0: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        2: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    },
}
    
const i_kicks: { [rot: string]: { [orient: number]: Array<[number, number]> }} = {
    "cw": {
        0: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        1: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        2: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        3: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    },

    "ccw": {
        0: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        1: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        2: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
        3: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    },
}

export const kicks: { [piece: string]: { [rot:string]: { [orient: number]: Array<[number, number]> }}} = {
    "I" : i_kicks,
    "J" : jlstz_kicks,
    "L" : jlstz_kicks,
    "S" : jlstz_kicks,
    "Z" : jlstz_kicks,
    "T" : jlstz_kicks,
}
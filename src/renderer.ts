import { config, colors, spawn_dir } from "./constants";
import { LogicObject } from "./logic-object";
import { Tetrimino } from "./tetrimino";
import { boardCanvas, heldCanvas, queueCanvas, lockProgressBar, gridCanvas } from './visual-elements';

/**
 * Clase que se encarga de dibujar todo en los canvas
 */
export class Renderer{
    constructor(){ 
        this.DrawGuides();          // La config. permitira habilitar o deshabilitar esta opcion mas tarde
    }

    RenderFrame(board: string[][], currentPiece: Tetrimino, lockProgress: number){
        this.ClearCanvas();
        this.DrawBoard(board);

        // Primero iria la pieza fantasma
        this.DrawGhostPiece(currentPiece);
        this.DrawActualPiece(currentPiece);

        this.DrawLockProgressBar(lockProgress);

        // // Renderizado opcional
        // this.optionalRenderList.forEach(optRender => {
        //     optRender(optRender.args)
        // });
    }

    //#region Tablero

    /**
     * Dibuja el tablero actual
     */
    DrawBoard(board: string[][]) {
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (board[i][j] !== "") {
                    var ctx = boardCanvas.getContext("2d");
                    ctx!.fillStyle = colors[board[i][j]];
                    ctx!.fillRect(30 * j, 600 - 30 * (i + 1), 30, 30);
                }
            }
        }
    }

    /**
     * Limpia el canvas para renderizar una nueva frame
     */
    ClearCanvas() {
        var ctx = boardCanvas.getContext("2d");
        ctx!.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
    }

    /**
     * Dibuja las guias del tablero
     */
    DrawGuides() {
        // Se establece el tamaño del canvas
        let board_size: [number, number] = [
            10 * config["square-length"],
            20 * config["square-length"],
        ];
        gridCanvas?.setAttribute("width", board_size[0].toString());
        gridCanvas?.setAttribute("height", board_size[1].toString());

        var ctx = gridCanvas.getContext("2d");
        if (ctx != null) {
            ctx.strokeStyle = "grey";
            ctx.lineWidth = 1;

            // Lineas verticales
            for (let i = 1; i < 10; i++) {
                ctx?.beginPath();
                ctx?.moveTo(config["square-length"] * i + 0.5, 0);
                ctx?.lineTo(
                    config["square-length"] * i + 0.5,
                    config["square-length"] * 20 + 0
                );
                ctx?.closePath();
                ctx?.stroke();
            }

            // Lineas horizontales
            for (let i = 1; i < 20; i++) {
                ctx?.beginPath();
                ctx?.moveTo(0, config["square-length"] * i + 0.5);
                ctx?.lineTo(
                    config["square-length"] * 10,
                    config["square-length"] * i + 0.5
                );
                ctx?.closePath();
                ctx?.stroke();
            }
        } else {
            throw new Error("No existe el canvas/contexto");
        }
    }

    ClearAllCanvas(){
        this.ClearCanvas();
        var ctx = heldCanvas.getContext("2d");
        ctx!.clearRect(0, 0, heldCanvas.width, heldCanvas.height);
        var ctx = queueCanvas.getContext("2d");
        ctx!.clearRect(0, 0, queueCanvas.width, queueCanvas.height);
    }

    //#endregion

    //#region Tetriminos

    /**
     * Dibuja el tetrimino actual
     */
    DrawActualPiece(piece: Tetrimino) {
        var ctx = boardCanvas.getContext("2d");

        piece.minos.forEach((mino) => {
            ctx!.fillStyle = colors[piece.type];
            ctx!.fillRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30);
        });

        // this.Draw_center()           // Solo para depurar
    }

    /**
     * Dibuja el centro de la pieza actual. Solo para depurar
     */
    DrawCenter(piece: Tetrimino) {
        var ctx = boardCanvas.getContext("2d");
        ctx!.fillStyle = "white";
        ctx!.fillRect(
            30 * piece.x + 5,
            600 - 30 * (piece.y + 1) + 5,
            20,
            20
        );
    }

    /**
     * Dibuja la pieza fantasma para el hard drop (?)
     */
    DrawGhostPiece(piece: Tetrimino) {
        var ctx = boardCanvas.getContext("2d");

        ctx!.fillStyle = "grey";
        piece.ghostMinos.forEach((mino) => {
            ctx!.fillRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30);
        });
    }

    ClearGhostPiece(piece: Tetrimino) {
        var ctx = boardCanvas.getContext("2d");

        piece.ghostMinos.forEach((mino) => {
            ctx!.clearRect(30 * mino[0], 600 - 30 * (mino[1] + 1), 30, 30);
        });
    }

    /**
     * Dibuja la cola de piezas
     */
    DrawQueue(queue: string[]) {
        var ctx = queueCanvas.getContext("2d");
        ctx!.clearRect(0, 0, queueCanvas.width, queueCanvas.height);

        let x: number = 60;
        let y: number = 70;

        let size: number = 15;

        for (let i = 0; i < queue.length; i++) {
            var piece = queue[i];

            ctx!.fillStyle = colors[piece];
            spawn_dir[piece].forEach((center) => {
                ctx!.fillRect(
                    size * center[0] * 2 + x,
                    -size * center[1] * 2 + y + 100 * i,
                    size * 2,
                    size * 2
                );
            });
        }
    }

    /**
     * Dibuja la pieza guardada
     */
    DrawHeldPiece(heldPiece: string) {
        var ctx = heldCanvas.getContext("2d");
        ctx!.clearRect(0, 0, heldCanvas.width, heldCanvas.height);

        let x: number = 60;
        let y: number = 70;

        let size: number = 15;

        ctx!.fillStyle = colors[heldPiece];
        spawn_dir[heldPiece].forEach((center) => {
            ctx!.fillRect(
                size * center[0] * 2 + x,
                -size * center[1] * 2 + y,
                size * 2,
                size * 2
            );
        });
    }

    //#endregion

    //#region Progress Bar

    DrawLockProgressBar(progress: number) {
        var ctx = lockProgressBar.getContext("2d");
        ctx!.clearRect(0, 0, lockProgressBar.width, lockProgressBar.height);
        ctx!.fillStyle = "white";
        ctx!.fillRect(0, 0, lockProgressBar.width * progress, 10);
    }

    RestartLockProgressBar() {
        var ctx = lockProgressBar.getContext("2d");
        ctx!.fillStyle = "white";
        ctx!.fillRect(0, 0, lockProgressBar.width, lockProgressBar.height);
    }

    //#endregion
}
import { animacionesActivadas,modoOscuroActivado } from "./main.js";

/*----------------------------------------------------ANIMACIÓN LLUVIA DE CARACTERES---------------------------------------------------------*/

/** @type {HTMLCanvasElement} */
const canvasMatrix = document.getElementById("canvas_matrix");

/** @type {CanvasRenderingContext2D} */
const lienzoMatrix = canvasMatrix.getContext("2d");

let alturaTotalWeb = document.documentElement.scrollHeight;
let anchoPantalla = window.innerWidth;
let altoPantalla = window.innerHeight;

canvasMatrix.width = anchoPantalla;
canvasMatrix.height = altoPantalla;

export function animacionMatrix(timeStampCiclo){
    if(animacionesActivadas){
        lienzoMatrix.clearRect(0,0,anchoPantalla,altoPantalla);
        let colorCaracteres = modoOscuroActivado? "white" : "black";

        lienzoMatrix.save();
        lienzoMatrix.font = "Bold 24px FunnelDisplay";
        lienzoMatrix.fillStyle = colorCaracteres;
        lienzoMatrix.textBaseline = "top";
        lienzoMatrix.fillText(`PRUEBA DE CONCEPTO`,360,360);
        lienzoMatrix.restore();

        requestAnimationFrame(animacionMatrix);
    };
};
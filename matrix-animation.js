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

let arrayMatrix = [];
const anchoColumna = 50;
let columnasMatrix = anchoPantalla/anchoColumna;
let tiempoAnterior = 0;
let tiempoActual = 0;
const espaciadoTiempo = 1000;
let acumuladorTiempo = 0;
const velocidadBase = 5;
let velocidadAjustada = 5;
const fpsBase = 60;

const caracteresMatrix = ["[;]","{,}","</>","\\*/","|=|","@","($)","!.!"];

export function animacionMatrix(timeStampCiclo){
    if(animacionesActivadas){
        ajusteVelocidad(timeStampCiclo);
        avanceObjetosMatrix();
        creacionObjetoMatrix();
        pintadoCanvas();

        requestAnimationFrame(animacionMatrix);
    };
};

function ajusteVelocidad(timeStamp){
    tiempoAnterior = tiempoActual;
    tiempoActual = timeStamp;

    let deltaTime = tiempoActual-tiempoAnterior;
    if(deltaTime > 50){deltaTime = 50};

    acumuladorTiempo += deltaTime;

    let fpsActuales = 1000/deltaTime;
    let ajusteVelocidad = fpsBase/fpsActuales;

    velocidadAjustada = velocidadBase*ajusteVelocidad;
};

function avanceObjetosMatrix(){
    for(let i = arrayMatrix.length-1; i >=0 ; i--){
        arrayMatrix[i].coordenadaY += velocidadAjustada;

        if(arrayMatrix[i].coordenadaY >= alturaTotalWeb){
            arrayMatrix.splice(i,1);
        };
    };
};

function creacionObjetoMatrix(){
    if(acumuladorTiempo >= espaciadoTiempo){
        acumuladorTiempo -= espaciadoTiempo;

        let caracterRandom = caracteresMatrix[Math.floor(Math.random()*8)];
        let columnaRandom = Math.floor(Math.random()*columnasMatrix)+1;

        arrayMatrix.push({
            caracter : caracterRandom,
            columna : columnaRandom,
            coordenadaY : 0
        });
    };
};

function pintadoCanvas(){
    lienzoMatrix.clearRect(0,0,anchoPantalla,altoPantalla);
    let colorCaracteres = modoOscuroActivado? "white" : "black";

    arrayMatrix.forEach(elemento => {
        lienzoMatrix.save();
        lienzoMatrix.font = "24px FunnelDisplay";
        lienzoMatrix.fillStyle = colorCaracteres;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-50,(elemento.coordenadaY-window.scrollY));
        lienzoMatrix.restore();
    })
};

function ajusteResize(){
    alturaTotalWeb = document.documentElement.scrollHeight;
    anchoPantalla = window.innerWidth;
    altoPantalla = window.innerHeight;
    
    columnasMatrix = anchoPantalla/anchoColumna;
    
    for(let i = arrayMatrix.length-1; i >=0 ; i--){

        if(arrayMatrix[i].columna > columnasMatrix){
            arrayMatrix.splice(i,1);
        };
    };
};

window.addEventListener("resize",ajusteResize);
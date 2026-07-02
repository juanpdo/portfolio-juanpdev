import { animacionesActivadas,modoOscuroActivado } from "./main.js";

/*----------------------------------------------------ANIMACIÓN LLUVIA DE CARACTERES---------------------------------------------------------*/

/** @type {HTMLCanvasElement} */
const canvasMatrix = document.getElementById("canvas_matrix");

/** @type {CanvasRenderingContext2D} */
const lienzoMatrix = canvasMatrix.getContext("2d");

let alturaTotalWeb = document.documentElement.scrollHeight;
let anchoPantalla = document.documentElement.clientWidth;
let altoPantalla = document.documentElement.clientHeight;

canvasMatrix.width = anchoPantalla;
canvasMatrix.height = altoPantalla;

let arrayMatrix = [];
const anchoColumna = 50;
let columnasMatrix = anchoPantalla/anchoColumna;
let tiempoAnterior = 0;
let tiempoActual = 0;
const espaciadoTiempo = 500;
let acumuladorTiempo = 0;
const velocidadBase = 5;
let velocidadAjustada = 5;
const fpsBase = 60;

const caracteresMatrix = ["[;]","{,}","</>","\\*/","@","(.)"];

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

        if(arrayMatrix[i].coordenadaY >= alturaTotalWeb + 100){
            arrayMatrix.splice(i,1);
        };
    };
};

function creacionObjetoMatrix(){
    if(acumuladorTiempo >= espaciadoTiempo){
        acumuladorTiempo -= espaciadoTiempo;

        let caracterRandom = caracteresMatrix[Math.floor(Math.random()*6)];
        let columnaRandom = Math.floor(Math.random()*columnasMatrix)+1;

        arrayMatrix.push({
            caracter : caracterRandom,
            columna : columnaRandom,
            coordenadaY : 0
        });
    };
};

export function pintadoCanvas(){
    lienzoMatrix.clearRect(0,0,anchoPantalla,altoPantalla);
    let colorCaracteres = modoOscuroActivado? "255,255,255" : "0,0,0";

    arrayMatrix.forEach(elemento => {
        lienzoMatrix.save();
        lienzoMatrix.font = "24px FunnelDisplay";
        lienzoMatrix.fillStyle = `rgba(${colorCaracteres},1)`;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.textAlign = "center";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-25,(elemento.coordenadaY-window.scrollY));
        lienzoMatrix.restore();

        lienzoMatrix.save();
        lienzoMatrix.font = "22px FunnelDisplay";
        lienzoMatrix.fillStyle = `rgba(${colorCaracteres},0.4)`;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.textAlign = "center";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-25,(elemento.coordenadaY-window.scrollY-12));
        lienzoMatrix.restore();

        lienzoMatrix.save();
        lienzoMatrix.font = "20px FunnelDisplay";
        lienzoMatrix.fillStyle = `rgba(${colorCaracteres},0.3)`;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.textAlign = "center";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-25,(elemento.coordenadaY-window.scrollY-24));
        lienzoMatrix.restore();

        lienzoMatrix.save();
        lienzoMatrix.font = "18px FunnelDisplay";
        lienzoMatrix.fillStyle = `rgba(${colorCaracteres},0.2)`;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.textAlign = "center";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-25,(elemento.coordenadaY-window.scrollY-36));
        lienzoMatrix.restore();

        lienzoMatrix.save();
        lienzoMatrix.font = "16px FunnelDisplay";
        lienzoMatrix.fillStyle = `rgba(${colorCaracteres},0.1)`;
        lienzoMatrix.textBaseline = "bottom";
        lienzoMatrix.textAlign = "center";
        lienzoMatrix.fillText(`${elemento.caracter}`,(elemento.columna*50)-25,(elemento.coordenadaY-window.scrollY-48));
        lienzoMatrix.restore();
    })
};

function ajusteResize(){
    alturaTotalWeb = document.documentElement.scrollHeight;
    anchoPantalla = document.documentElement.clientWidth;
    altoPantalla = document.documentElement.clientHeight;
    
    columnasMatrix = anchoPantalla/anchoColumna;
    
    for(let i = arrayMatrix.length-1; i >=0 ; i--){

        if(arrayMatrix[i].columna > columnasMatrix){
            arrayMatrix.splice(i,1);
        };
    };
};

function pintadoPausado(){
    if(!animacionesActivadas){
        pintadoCanvas();
    };
};

window.addEventListener("resize",ajusteResize);
window.addEventListener("scroll",pintadoPausado);
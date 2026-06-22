/* CLON DE ARKANOID. En este ejercicio práctico, vamos a clonar el mítico videojuego de arcade ARKANOID. Para ello, hemos obtenido primeramente los sprites originales del juego, para poder recrearlo con la mayor fidelidad. Tendremos que implementar "físicas", basadas en las "colisiones" de los elementos en pantalla, las cuales nos permitan cambiar la dirección de la trayectoria, y simular un rebote. Esto lo conseguiremos comprobando en cada frame las coordenadas de los elementos móviles respecto al resto. Para que los elementos se muevan, tendremos que establecer velocidades, que modificarán periódicamente las coordenadas de los elementos móviles, en la dirección establecida en cada momento. Utilizaremos eventos de teclado para poder modificar las coordenadas del paddle, y con ello moverlo. Para crear el efecto visual de movimiento, recurriremos al método tradicional de todos los juegos: los frames. Implementaremos un sistema de framerate, basado en el refresco de pantalla del cliente, utilizando la función "requestAnimationFrame()", la cual recibe por parámetro otra función, que es la que se encargará de ejecutar toda la lógica del juego, y el pintado de cada frame. Esta función "requestAnimationFrame()" es el estándar para realizar animaciones y aplicaciones con animación, y funciona llamándose UNA SOLA VEZ justo antes de que se refresque el siguiente frame del monitor. Es decir, es una función que, una vez declarada, actua como un evento de refresco de pantalla, ejecutando la función que recibe por parámetro justo antes de que se refresque el siguiente frame del monitor. Una vez que se ejecuta desaparece el "evento", por lo que para que se produzca de forma continua tenemos que convertirla en una función recursiva, que, como última instrucción, se llame a sí misma. La gran diferencia con "setInterval" (ya NO se usa para esto), es que "requestAnimationFrame" se sincroniza con el monitor (hardware), optimizando los ciclos de funcionamiento del código; de forma que, si no está activa la pestaña en el monitor, se pausa el bucle, ahorrando recursos innecesarios. Además, esta función PASA un TimeStamp de alta precisión en cada llamada, lo cual nos permitirá calcular el DeltaTime entre frames, para ajustar la velocidad de la animación en base al refresco de monitor del usuario. También evita los tirones (tearing), ya que se sincroniza con el refresco del monitor, y mejora la fluidez de las animaciones por este mismo motivo (no se ven pequeños saltos) */

/** @type {HTMLCanvasElement} */
var lienzo = document.getElementById("canvas1");//Nos traemos el canvas a javascript

/** @type {CanvasRenderingContext2D} */
var contexto = lienzo.getContext("2d");//Creamos el contexto 2d del canvas para poder pintar en él

lienzo.width = 640;//Modificamos las medidas del lienzo
lienzo.height = 704;//Importante que sean múltiplos de 32, para que no se rompan los bordes

//VARIABLES DE CONFIGURACIÓN INICIALES (CONFIGURABLES)
var velocidad_pelota_inicial = 5;
var ajuste_velocidad_dificultad = 0.5;//Como de rápido aumenta la velocidad en el tiempo
var velocidad_paddle_inicial = 8;
var angulo_inicial = 225 + (Math.floor(Math.random()*10) * 10);//El ángulo incicial lo ponemos aleatorio al comenzar
var radio_pelota = 5;
var largo_paddle_inicial = 64;
var ancho_paddle = 16;
var x_pelota_inicial = lienzo.width/2;
var y_pelota_inicial = lienzo.height - ((ancho_paddle * 1.6) + radio_pelota + 1);
var x_paddle_inicial = (lienzo.width/2) - (largo_paddle_inicial/2);
var y_paddle_inicial = lienzo.height - (ancho_paddle * 1.6);
var coeficienteMargenSuperior = 0.15;

//VARIABLES DE PELOTA Y PADDLE
var largo_paddle = largo_paddle_inicial;
var x_paddle = x_paddle_inicial;
var y_paddle = y_paddle_inicial;
var v_paddle = velocidad_paddle_inicial;
var x_pelota = x_pelota_inicial;
var y_pelota = y_pelota_inicial;
var v_pelota = velocidad_pelota_inicial;
var v_pelotaAjustada = 0;
var v_paddleAjustada = 0;
var angulo = angulo_inicial;
var vectorX_pelota = Math.sqrt(0.5);
var vectorY_pelota = -Math.sqrt(0.5);
var vx_pelota = v_pelota * vectorX_pelota;
var vy_pelota = v_pelota * vectorY_pelota;
var arrayPosiciones = [];//Array para guardar las posiciones intermedias

//VARIABLES DE LADRILLOS
var filasLadrillos = 10;
var espaciadoLadrillos = 0;
var largoLadrillos = 32;
var altoLadrillos = 16;
var columnasLadrillos = Math.floor(((lienzo.width - 64) * 0.85) / (largoLadrillos + espaciadoLadrillos));
var numeroLadrillos = filasLadrillos * columnasLadrillos;
var margenLateral = ((lienzo.width - 64) - (columnasLadrillos * (largoLadrillos + espaciadoLadrillos))) / 2;
var margenSuperior = ((lienzo.height- 32) * coeficienteMargenSuperior);
var matrizLadrillos = [];//Array para guardar todos los ladrillos y sus estados

//VARIABLES DE POTENCIADOR
var v_potenciador = 3;
var x_potenciador = 0;
var y_potenciador = 0;
var largo_potenciador = largoLadrillos;
var ancho_potenciador = 0.875 * altoLadrillos;

//VARIABLES DE ESTADO
var movimientoDerecho = false;
var movimientoIzquierda = false;
var estadoColisionado = false;
var estadoJuego = "inicio";
var puntuacion = 0;
var potenciadorActivado = false;
var potenciadorJugando = false;
var estadoAlargado = false;
var volumenMuteado = false;

//VARIABLES DE TEMPORALIZACIÓN Y CICLO
var tiempoAnteriorCiclo = 0;
var tiempoActualCiclo = 0;
var fpsMonitor = 0;
var fpsJuego = 60;
var ajusteVelocidad = 1;
var contadorImagenes = 0;
var contadorDificultad = 0;
var contadorSonidos = 0;

//VARIABLES DE IMÁGENES
var imagenLogo = new Image;
imagenLogo.src = "./assets/img/logo.webp";
var imagenFondo = new Image;
imagenFondo.src = "./assets/img/bkg.png";
var imagenBorde = new Image;
imagenBorde.src = "./assets/img/borde-escalado.png";
var imagenSprites = new Image;
imagenSprites.src = "./assets/img/sprite.png";
var imagenVictoria = new Image;
imagenVictoria.src = "./assets/img/victoria.webp";
var imagenAltavoz = new Image;
imagenAltavoz.src = "./assets/img/altavoz.png";
var imagenSilencio = new Image;
imagenSilencio.src = "./assets/img/volumenOf.png";

//VARIABLES DE ANIMACIONES
var contadorCiclos = 1;
var contadorDestruccion = 1;
var contadorConstruccion = 1;
var contadorFPS = 0;
var fpsPintar = 0;

//VARIABLES DE SONIDO
var sonidoBSO = new Audio;
sonidoBSO.src = "./assets/audio/Maniac-Chipex.mp3";
sonidoBSO.volume = 0.20;
sonidoBSO.loop = true;
var sonidoAparicion = new Audio;
sonidoAparicion.src = "./assets/audio/aparicion.wav";
var sonidoColision = new Audio;
sonidoColision.src = "./assets/audio/colision.wav";
var sonidoExplosion = new Audio;
sonidoExplosion.src = "./assets/audio/explosion.wav";
var sonidoPotenciador = new Audio;
sonidoExplosion.volume = 0.7;
sonidoPotenciador.src = "./assets/audio/potenciador.wav";
sonidoPotenciador.volume = 0.6;

//VARIABLES DE INTERACTIVIDAD
var botonSonido = document.getElementById("boton_sonido");
var imagenSonido = document.getElementById("imagen_sonido");
var selectorDificultad = document.getElementById("selector_dificultad");
var selectorLadrillos = document.getElementById("selector_ladrillos");
var selectorEspaciado = document.getElementById("selector_espaciado");
var selectorTamano = document.getElementById("ladrillos_grandes");
var selectorPelota = document.getElementById("pelota_grande");
var botonOpciones = document.getElementById("boton_opciones");

//FUNCIÓN DE CONSTRUCCIÓN DE MATRIZ DE LADRILLOS (NIVEL 1)
function construccionMatrizLadrillos(){
    for(let i = 0; i <= numeroLadrillos - 1; i++){//Primeramente, creamos la matriz de ladrillos, sabiendo ya el total con las filas y las columnas
        let colorRandom = Math.floor(Math.random()*8);//Generamos un número aleatorio entre 0 y 7 para luego asignar un color de ladrillo
        matrizLadrillos[i] = [true,colorRandom];//Creamos el elemento de cada ladrillo, con estado existente, y su color
    };
    console.log(matrizLadrillos);//Comprobamos que la matriz de ladrillos se ha generado correctamente
};

//FUNCIÓN DE CÁLCULO DEL DELTA TIME, Y AJUSTE DE LOS FRAMES
function calculoDeltaTime(timeStampPreciso){//El requestAnimationFrame pasa por parámetro a la función el timeStam cuando se ejecuta y la llama
    tiempoAnteriorCiclo = tiempoActualCiclo;//Lo primero que hacemos al empezar el ciclo, es guardar el tiempo anterior en su variable global
    tiempoActualCiclo = timeStampPreciso;//Guardamos el timeStamp recibido del requestAnimationFrame como el tiempo actual de este ciclo
    let deltaTime = tiempoActualCiclo - tiempoAnteriorCiclo;//Y calculamos el delta time, como la diferencia entre ambos (tiempo entre ciclos)
    if(deltaTime > 50){//Controlamos que el deltaTime no se vaya de las manos, y provoque saltos de velocidad absurdos
        deltaTime = 13.3;//Esto puede suceder al cambiar de pantalla, o en los tiempos de carga del primer frame
    };

    fpsMonitor = 1000 / deltaTime;//Ya que el timeStamp está en milisegundos, calculamos cuantos ciclos se producen por segundo (1000 ms)

    ajusteVelocidad = fpsJuego / fpsMonitor;//Sacamos la relación entre los fps del monitor, y los ciclosa a los que funcina el juego

    v_pelotaAjustada = v_pelota * ajusteVelocidad;//Y ajustamos la velocidad de la pelota en base al refresco del monitor (la velocidad de este ciclo)
    v_paddleAjustada = v_paddle * ajusteVelocidad;//Ajustamos también la velocidad del paddle
};

//FUNCIÓN DE AUMENTO PROGRESIVO DE LA DIFICULTAD
function aumentoDificultad(){//Cada número de segundos (20 en este caso), aumentaremos progresivamente la velocidad de la pelota
    contadorDificultad += (1 * ajusteVelocidad);//Utilizamos un contador en varible global para controlar los ciclos, ajustado al deltaTime

    if((contadorDificultad >= (fpsJuego * 20)) && (v_pelota != 0)){//Cuando pasan los segundos establecidos, Y LA PELOTA NO ESTÁ PAUSADA
        v_pelota += ajuste_velocidad_dificultad;//ajustamos la velocidad base de la pelota
        contadorDificultad = 0;//Y reseteamos el contador de ciclos
        console.log("AUMENTO DE LA VELOCIDAD");//Notificamos este aumento de dificultad
    };
};

//FUNCIÓN DE REVISIÓN DE ESTADOS
function revisionEstados(timeStampCiclo){//Esta es la función de entrada, llamada por el requestAnimationFrame, que inicia cada ciclo
    if(estadoJuego == "inicio"){//Comprobamos lo primero de todo en que estado global está la aplicación, y en base a eso, continuamos las llamadas
        estadoInicio();
    }
    else if(estadoJuego == "iniciando"){
        estadoIniciando(timeStampCiclo);//Aquellos estados que necesiten el timeStamp, habrá que pasárselo por parámetro desde el comienzo del ciclo
    }
    else if(estadoJuego == "jugando"){
        estadoJugando(timeStampCiclo);
    }
    else if(estadoJuego == "perdiendo"){
        estadoPerdiendo(timeStampCiclo);
    }
    else if(estadoJuego == "perdido"){
        estadoPerdido();
    }
    else if(estadoJuego == "victoria"){
        estadoVictoria();
    };
};

function estadoInicio(){//Estado inicial nada más cargar el aplicativo, desde donde se puede iniciar el juego (pasar a estado "iniciando")
    pintarFondo();
    pintarBordes();
    pintarInicio();
};//Estado de "juego pausado", por lo que no se llama al requestAnimationFrame()

function estadoIniciando(timeStampCiclo){//Estado que sucede mientras se "crea" el paddle en pantalla (animación de inicio del juego)
    borrarPantalla();
    calculoDeltaTime(timeStampCiclo);
    pintarFondo();
    pintarIniciando();
    pintarBordes();
    pintarLadrillos();
    pintarFPS();
    pintarPuntuacion();
    requestAnimationFrame(revisionEstados);
};

function estadoJugando(timeStampCiclo){//Estado del juego en funcionamiento
    borrarPantalla();
    calculosIniciales(timeStampCiclo);
    aumentoDificultad();
    calculosColisiones();
    pintarJuego();
    pintarPotenciador();
    pintarFPS();
    pintarPuntuacion();
    condicionVictoria();
    requestAnimationFrame(revisionEstados);
};

function estadoPerdiendo(timeStampCiclo){//Estado mientras se "destruye" el paddle (animación una vez que has perdido)
    borrarPantalla();
    calculoDeltaTime(timeStampCiclo);
    pintarFondo();
    pintarPerdiendo();
    pintarBordes();
    pintarLadrillos();
    pintarPotenciador();
    pintarFPS();
    pintarPuntuacion();
    requestAnimationFrame(revisionEstados);
};

function estadoPerdido(){//Estado con la pantalla de GAME OVER, desde donde se puede reiniciar el juego (pasar a estado "iniciando")
    pintarFondo();
    pintarBordes();
    pintarPerdido();
    pintarPuntuacion();
};//Estado de "juego pausado", por lo que no se llama al requestAnimationFrame()

function estadoVictoria(){//Estado con la pantalla de HAS GANADO, desde donde se puede reiniciar el juego (pasar a estado "iniciando")
    pintarVictoria();
    pintarPuntuacion();
};//Estado de "juego pausado", por lo que no se llama al requestAnimationFrame()

function calculosIniciales(timeStampCiclo){//Esta función agolpa los cálculos iniciales del juego en cada ciclo
    calculoDeltaTime(timeStampCiclo);
    normalizarAngulo();
    calculoVector(angulo);
    calculoPosicionesIntermedias();
    modificarPosicion();
};

function calculosColisiones(){//Esta función agolpa los cálculos de todas las colisiones durante el desarrollo de un ciclo de juego
    colisionPotenciador();
    colisionPaddle(arrayPosiciones);
    colisionParedes(arrayPosiciones);
    colisionLadrillos(arrayPosiciones);
};

function pintarJuego(){//Esta función agolpa todas las funciones de pintado de los elementos durante un ciclo de juego
    pintarFondo();
    pintarPelota();
    pintarPaddle();
    pintarBordes();
    pintarLadrillos();
};

//FUNCIÓN DE RESTAURACIÓN DE PARÁMETROS INICIALES
function restablecimientoParametros(){//Esta función se ejecutará UNA VEZ cada vez que se inicie un nuevo juego (estado iniciando, primer frame)
    x_pelota_inicial = lienzo.width/2;
    y_pelota_inicial = lienzo.height - ((ancho_paddle * 1.6) + radio_pelota + 1);
    v_pelota = velocidad_pelota_inicial;
    v_paddle = velocidad_paddle_inicial;
    angulo = 225 + (Math.floor(Math.random()*10) * 10);//El ángulo se calcula en cada reinicio, de forma aleatoria
    x_pelota = x_pelota_inicial;
    y_pelota = y_pelota_inicial;
    x_paddle = x_paddle_inicial;
    y_paddle = y_paddle_inicial;
    largo_paddle = largo_paddle_inicial;
    columnasLadrillos = Math.floor(((lienzo.width - 64) * 0.85) / (largoLadrillos + espaciadoLadrillos));
    numeroLadrillos = filasLadrillos * columnasLadrillos;
    margenLateral = ((lienzo.width - 64) - (columnasLadrillos * (largoLadrillos + espaciadoLadrillos))) / 2;
    margenSuperior = ((lienzo.height- 32) * coeficienteMargenSuperior);
    matrizLadrillos = [];
    numeroLadrillos = filasLadrillos * columnasLadrillos;
    contadorDificultad = 0;
    puntuacion = 0;
    potenciadorActivado = false;
    potenciadorJugando = false;
    estadoAlargado = false;
};

//FUNCIÓN DE CONDICIÓN DE VICTORIA
function condicionVictoria(){//Con esta función, comprobamos la condición de victoria en cada ciclo del juego
    let contadorLadrillosVivos = numeroLadrillos;//Iniciamos un contador, igual al número de ladrillos totales de este juego

    matrizLadrillos.forEach(ladrillo => {//Comprobamos todos los ladrillos del array de ladrillos
        if(!ladrillo[0]){//Y si su primer estado (estado de existencia) es falso, indica que ya ha sido colisionado y destruido
            contadorLadrillosVivos --;//Por lo que restamos uno al contador total de ladrillos
        };
    });

    if(contadorLadrillosVivos <= 0){//Si llegamos a 0 ladrillos en el contador, querrá decir que todos los ladrillos del array han sido destruidos
        sonidoBSO.pause();//Detenemos la BSO del juego
        estadoJuego = "victoria";//Y cambiamos es estado general a "victoria"
        console.log("CAMBIO DE ESTADO A: " + estadoJuego);//Notificamos este cambio
    };
};

//FUNCIÓN DE BORRADO INICIAL
function borrarPantalla(){//Nada más empezar el ciclo de juego, limpiamos el lienzo 
    contexto.clearRect(0,0,lienzo.width,lienzo.height);//Así, limpiamos todo el lienzo  
};

//FUNCIÓN DE NORMALIZACIÓN DE ÁNGULO
function normalizarAngulo(){//Vamos a normalizar el ángulo, entre 0 y 360 grados sexagesimales, por facilitarnos la vida en los cálculos
    if(angulo > 360){//Así nos aseguramos que el ángulo siempre trabaje entre 0 y 360 grados
        angulo -= 360;
    }
    else if(angulo < 0){
        angulo += 360;
    };
};

//FUNCIÓN DE CONVERSIÓN DE GRADOS SEXAGESIMALES A RADIANES
function aRadianes (grados_sexagesimales){//Como javascript trabaja de forma nativa con radianes, tenemos que convertir a esta unidad
    return grados_sexagesimales * (Math.PI / 180);//Recordemos que 2*Pi radianes son 360 grados sexagesimales
};

//FUNCIÓN DE CÁLCULO DE COMPONENTES DEL VECTOR DESPLAZAMIENTO EN BASE AL ÁNGULO
function calculoVector (angulo_sexagesimal){//Aquí le entra el ángulo, previamente acotado (0 a 360 grados)
    vectorX_pelota = Math.cos(aRadianes(angulo_sexagesimal));//Obtenemos los vectores de movimiento en cada eje
    vectorY_pelota = Math.sin(aRadianes(angulo_sexagesimal));//El módulo del vector de movimiento total (x + y) siempre es 1 (lo hemos normalizado)

    vx_pelota = v_pelotaAjustada * vectorX_pelota;//Con la velocidad y los vectores de movimiento, asignamos los nuevos valores a las variaciones de posición
    vy_pelota = v_pelotaAjustada * vectorY_pelota;//Al estar normalizados los vectores de movimiento, la velocidad de la pelota será igual en todas direcciones
};

//FUNCIÓN DE CALCULO DE ARRAY DE POSICIONES INTERMEDIAS 
function calculoPosicionesIntermedias(){//Con esta función obtenemos un array con todas las posiciones desde la inicial a la final (aproximación 1px)
    let x_inicialPelota = x_pelota;//Las coordenadas iniciales de la pelota serán las últimas coordenadas registradas en el anterior frame
    let y_inicialPelota = y_pelota;
    arrayPosiciones = [];//Reiniciamos el array de posiciones, para evitar que se solapen, o queden residuos, de ciclos anteriores

    for(let i = 0; i <= (Math.ceil(v_pelotaAjustada)); i++){//Se incluye también la posición incial, a efectos de comprobaciones (no de colisiones)
        arrayPosiciones[i] = [x_inicialPelota + (vectorX_pelota * i), y_inicialPelota + (vectorY_pelota * i)];
    };//En cada "salto", la pelota se habrá posicionado en las coordenadas iniciales + su vector de desplazamiento por el número de salto
};//Esta función es fundamental para evitar el efecto tunel a altas velocidades de la bola (salta el elemento sin colisionarlo)

//FUNCIÓN DE MODIFICACIÓN DE POSICIONES DE PELOTA Y PADDLE
function modificarPosicion(){//Con esta función cambiamos la posición para este frame de la pelota, del paddle, y del potenciador (si está en juego)
    x_pelota += vx_pelota;//Modificamos las coordenadas de la pelota con las variaciones de posición en cada eje
    y_pelota += vy_pelota;

    if(potenciadorJugando){//Solo si el potenciador está en juego, cambiamos su posición
        y_potenciador += v_potenciador;
    };

    if((x_paddle + largo_paddle) < (lienzo.width - 32)){//Comprobamos si el paddle está dentro de los límites por la derecha
        movimientoDerecho && (x_paddle += v_paddleAjustada)//Y si se está moviendo (estado movimientoDerecho), desplazamos su coordenada
    };

    if((x_paddle + largo_paddle) > (lienzo.width - 32)){//Una vez desplazado, comprobamos si se ha salido de los límites por su velocidad
        x_paddle = (lienzo.width - 32) - largo_paddle;//Y posicionamos la coordenada de manera que no se salga de los límites
    };
    
    if(x_paddle > 32){//Hacemos lo mismo que antes, pero esta vez para el lateral izquierdo
        movimientoIzquierda && (x_paddle -= v_paddleAjustada)
    };

    if(x_paddle < 32){//Y si fuera necesario reposicionarlo por colarse del límite, así lo hacemos
        x_paddle = 32;
    };
};//Primeo movemos los elementos, y si no hay colisiones, esta será la posición final; pero si las hay, habrá que recolocar la pelota en la colisión

//FUNCIÓN DE COMPROBACIÓN DE TIPO DE COLISIÓN
function calculoTipoColision(coordenadaXPuntual,coordenadaYPuntual,coordenadaXInicial,coordenadaYInicial,coordenadaXFinal,coordenadaYFinal){
    let largoElemento = coordenadaXFinal - coordenadaXInicial;//Calculamos el largo del elemento a colisionar
    let altoElemento = coordenadaYFinal - coordenadaYInicial;//Y su alto
    let sobreXElemento = ((coordenadaXPuntual + radio_pelota) >= coordenadaXInicial) && ((coordenadaXPuntual - radio_pelota) <= (coordenadaXInicial + largoElemento));//Calculamos la superposición en X con el elemento en la posición actual (posición intermedia)
    let sobreYElemento = ((coordenadaYPuntual + radio_pelota) >= coordenadaYInicial) && ((coordenadaYPuntual - radio_pelota) <= coordenadaYInicial + altoElemento);//Y calculamos la superposición en Y con el elemento en la coordenada actual (posición intermedia)

    if(sobreXElemento && sobreYElemento){//Si la posición actual colisiona con el elemento
        let tipoColision;//Creamos una variable para almacenar el tipo de colisión
        let colisionEjeX;//Y otras 2 para guardar la "distancia" de colisión en cada uno de los ejes
        let colisionEjeY;//Estas nos permitirán determinar por que eje "colisionan más" los elementos, y determinar el tipo de colisión

        if((coordenadaXInicial <= (coordenadaXPuntual - radio_pelota)) && (coordenadaXFinal <= (coordenadaXPuntual + radio_pelota))){
            colisionEjeX = coordenadaXFinal - (coordenadaXPuntual - radio_pelota);//No totalmente solapados desde la derecha
        }
        else if((coordenadaXInicial > (coordenadaXPuntual - radio_pelota)) && (coordenadaXFinal > (coordenadaXPuntual + radio_pelota))){
            colisionEjeX = (coordenadaXPuntual + radio_pelota) - coordenadaXInicial;//No totalmente solapados desde la izquierda
        }
        else{//Totalmente solapados
            if((radio_pelota * 2) <= largoElemento){//Si la pelota es más pequeña
                colisionEjeX = radio_pelota * 2;
            }
            else{//Si la pelota es más grande que el elemento colisionado
                colisionEjeX = largoElemento;
            };
        };
    
        if((coordenadaYInicial <= (coordenadaYPuntual - radio_pelota)) && (coordenadaYFinal <= (coordenadaYPuntual + radio_pelota))){
            colisionEjeY = coordenadaYFinal - (coordenadaYPuntual - radio_pelota);//No totalmente solapados desde abajo
        }
        else if((coordenadaYInicial > (coordenadaYPuntual - radio_pelota)) && (coordenadaYFinal > (coordenadaYPuntual + radio_pelota))){
            colisionEjeY = (coordenadaYPuntual + radio_pelota) - coordenadaYInicial;//No totalmente solapados desde arriba
        }
        else{//Totalmente solapados
            if((radio_pelota * 2) <= altoElemento){//Si la pelota es más pequeña que el elemento
                colisionEjeY = radio_pelota * 2;
            }
            else{//Si la pelota es más grande
                colisionEjeY = altoElemento;
            };
        };
    
        if(colisionEjeX > colisionEjeY){//Si la "distancia" de colisión en el eje X e mayor que en el Y, es que ha "entrado" a la colisión por X
            tipoColision = "superficie";//Y el tipo de colisión será superficial (eje horizontal X)
        }
        else if(colisionEjeY > colisionEjeX){//Si la "distancia" en el eje Y es mayor, es que ha "entrado" a la colisión por ese eje Y
            tipoColision = "lateral";//Y el tipo de colisión será lateral (eje vertical Y)
        }
        else if(colisionEjeX == colisionEjeY){//Si la "distancia" es la misma en ambos ejes, es que ha entrado en esquina
            tipoColision = "esquinazo";//Y el tipo de colisión será esquinazo
        };//Puede darse un extraño caso que, siendo la distancia igual en ambos ejes, sea colisión superficial o lateral, pero es altamente improbable

        return(tipoColision);//Esta función devuelve el tipo de colisión (si la ha habido)
    };//Esta función es fundamental para saber que tipo de colisión (superficie o lateral) se ha producido (si es que se produce)
};//Además, realiza este cálculo para cada posición intermedia de la pelota, evitando así el efecto tunel a altas velocidades

//FUNCIÓN DE COMPROBACIÓN DE COLISIÓN CON EL POTENCIADOR
function colisionPotenciador(){
    if(potenciadorJugando){//Comprobamos si el potenciador está en juego, y creamos las variables de superposición (por facilitar el código)
        let superposicionX = ((x_potenciador + largo_potenciador) >= x_paddle) && (x_potenciador <= (x_paddle + largo_paddle));
        let superposicionY = ((y_potenciador + ancho_potenciador) >= y_paddle) && (y_potenciador <= (y_paddle + ancho_paddle));

        if(superposicionX && superposicionY){//Si se superponen el potenciador y el paddle (colisionan)
            console.log("POTENCIADOR RECOGIDO");//Lo notificamos
            sonidoPotenciador.play();//Reproducimos el sonido del potenciador
            potenciadorJugando = false;//Retiramos el potenciador de estado jugando
            estadoAlargado = true;//Y establecemos el paddle en estado alargado, para posteriormente poder pintarlo adecuadamente
            largo_paddle *= 1.5;//E incrementamos el largo de paddle, para que tenga mayor superficie de colisión (no solo estética)
            x_paddle -= (0.25 * largo_paddle);//Modidicamos la posición del paddle, para centrar y compensar el nuevo largo adquirido

            if(x_paddle < 32){//Una vez modificada la posición para compensar el crecimiento, comprobamos si se sale por la izquierda
                x_paddle = 32;//Y si es así, lo llevamos al filo del borde izquierdo
            }
            else if((x_paddle + largo_paddle) > (lienzo.width - 32)){//Comprobamos si susede lo mismo, pero en el límite derecho
                x_paddle = (lienzo.width - 32) - largo_paddle;//Y si se sale, lo recolocamos
            };

        }else if(y_potenciador > lienzo.height){//Si no colisionan el potenciador y el paddle, comprobamos si se ha salido del lienzo
            potenciadorJugando = false;//Y si es así, lo establecemos como fuera de juego, evitando futuros recálculos y pintados de este
        };
    };
};

//FUNCIÓN DE COMPROBACIÓN DE COLISIÓN CON EL PADDLE (CON ARRAY DE POSICIONES)
function colisionPaddle(arrayPosiciones){//Debemos pasar el array de posiciones intermedias por parámetro
    let colisionDetectada = false;//Variable para determinar si ya se ha detectado una colisión, y evitar más cálculos de colisión este ciclo

    arrayPosiciones.forEach((posicionActual,indice) => {//Recorremos las posiciones intermedias de la bola desde el comienzo al final
        let coordenadaXPuntual = posicionActual[0];//Sacamos la coordenada X de esa posición
        let coordenadaYPuntual = posicionActual[1];//Y la coordenada Y de esa posición

        if(coordenadaYPuntual + radio_pelota < y_paddle){//Si está por encima del paddle, cambia a estado no colisionado
        estadoColisionado = false;//Pues, una vez por encima del paddle, ya no puede arrollarlo
        };//Esto puede suceder, porque, al moverse el paddle a la vez que la pelota, el paddle puede superar la posición de colisión

        if(!estadoColisionado){//Solo si la bola no está ya en estado colisionado con el paddle
            if(indice != 0){//No comprobamos la colisión en la posición inicial (ya se ha resuelto antes como posición final) para evitar doble golpeo
                if(!colisionDetectada){//Si no se ha detectado colisión todavía en este ciclo
                    let tipoColision = calculoTipoColision(coordenadaXPuntual,coordenadaYPuntual,x_paddle,y_paddle,x_paddle + largo_paddle,y_paddle + ancho_paddle);//Creamos una variable, donde guardamos el retorno de la función con el tipo de colisión (si la hay)

                    if(tipoColision){//Si se ha encontrado algún tipo de colisión
                        sonidoColision.currentTime = 0;//Reseteamos al inicio el sonido de colisión (por si ya se estaba ejecutando)
                        sonidoColision.play();//Y reproducimos el sonido de colisión
                        colisionDetectada = true;//Actualizamos que ya se ha detectado una colisión este ciclo, para detener los cálculos innecesarios
                        estadoColisionado = true;//Importante para evitar el "arrollar" del paddle, y que lo vuelva a impactar en el siguiente ciclo
                        x_pelota = coordenadaXPuntual;//Modificamos las coordenadas de la pelota a las de la posición de la colisión
                        y_pelota = coordenadaYPuntual;//Así no se "mete" la pelota dentro de los objetos colisionados

                        if(movimientoDerecho){//Luego comprobamos si se está moviendo hacia la derecha
                            if(tipoColision == "superficie"){//Si le pega por arriba (colisionsuperficie)
                                angulo = -(angulo - 10);//Y modificamos el ángulo; en este caso con un efecto (no es rebote espejo total)
                                console.log("Colisión: " + tipoColision);
                            }
                            else if(tipoColision == "lateral" || tipoColision == "esquinazo"){//Comprobamos si la colisión es lateral o esquinazo
                                angulo += 180;//Y modificamos el ángulo; en vez de espejo, sentido contrario y misma dirección
                                console.log("Colisión: " + tipoColision);
                            };
                        };

                        if(movimientoIzquierda){//Igual que antes, pero aquí comprobamos si se mueve hacia la izquierda
                            if(tipoColision == "superficie"){
                                angulo = -(angulo + 10);
                                console.log("Colisión: " + tipoColision);
                            }
                            else if(tipoColision == "lateral" || tipoColision == "esquinazo"){
                                angulo += 180;
                                console.log("Colisión: " + tipoColision);
                            };
                        };

                        if(!movimientoDerecho && !movimientoIzquierda){//Aquí igual que en las anteriore, pero si NO se está moviendo para ningún lado
                            if(tipoColision == "superficie"){//Si le pega por arriba
                                angulo = -angulo;//Modificamos el ángulo; en este caso sin efecto, siendo rebote en espejo perfecto
                                console.log("Colisión: " + tipoColision);
                            }
                            else if(tipoColision == "lateral" || tipoColision == "esquinazo"){//Comprobamos si la colisión es lateral o esquinazo
                                angulo += 180;//Y modificamos el ángulo, en vez de espejo, sentido contrario y misma dirección
                                console.log("Colisión: " + tipoColision);
                            };
                        };
                    };
                }; 
            };
        };
    });//Una vez que ya sabemos si la bola ha colisionado con el paddle, comprobamos si choca con las paredes
};//Es importante hacerlo en este orden, pues, sino, podría darse la situación que la bola salga por abajo, antes de comprobar si da al paddle

//FUNCIÓN DE COMPROBACIÓN DE COLISIONES CON PAREDES (Y PERDIDA)(CON ARRAY DE POSICIONES)
function colisionParedes(arrayPosiciones){//Debemos pasar el array de posiciones intermedias por parámetro
    if((y_pelota - radio_pelota) >= lienzo.height){//Primero de todo, comprobación de si ha salido por abajo (has perdido), para evitar más cálculos
        estadoJuego = "perdiendo";//Cambiamos el estado a perdiendo, para modificar el comportamiento del próximo ciclo
        sonidoExplosion.play();//Podemos empezar a reproducir ya el sonido de explosión, que se pintará en el siguiente ciclo
        console.log("CAMBIO DE ESTADO A: " + estadoJuego);//Notificamos el cambio de estado
    }
    else{//Si no has perdido (pelota por encima del final)
        let colisionParedDetectada = false;//Variable para saber si se ha detectado ya colisión con pared, y detener más cálculos de colisiones
        arrayPosiciones.forEach((posicionActual,i) => {//Para cada posición intermedia de la bola en este ciclo
            let coordenadaXPuntual = posicionActual[0];//Guardamos las coordenadas de esta posición
            let coordenadaYPuntual = posicionActual[1];
            if(i != 0){//Y si no es la primera posición (inicial), ya que esto provocaría dobles golpeos
                if(!colisionParedDetectada){//Y no se ha detectado todavía una colisión con pared
                    if(coordenadaXPuntual - radio_pelota <= 32){//Comprobamos si choca con la pared de la izquierda
                        sonidoColision.currentTime = 0;//Reseteamos el sonido de colisión (por si ya se estaba ejecutando y es otra colisión rápida)
                        sonidoColision.play();//Y reproducimos el sonido de colisión
                        colisionParedDetectada = true;//Cambiamos el valor a colisión detectada, para evitar futuros cálculos (solo la primera)
                        x_pelota = coordenadaXPuntual;//Cambiamos las coordenadas de la pelota a la posición intermedia de la colisión
                        y_pelota = coordenadaYPuntual;
                        angulo = (180 - angulo);//Cambiamos el ángulo, para la próxima iteración, calcular los vectores de desplazamiento
                        console.log("cambio de sentido (izquierda) en x",angulo);//Y notificamos el cambio
                    };
                    
                    if(coordenadaXPuntual + radio_pelota >= (lienzo.width - 32)){//Igual que antes, pero para la pared de la derecha
                        sonidoColision.currentTime = 0;
                        sonidoColision.play();
                        colisionParedDetectada = true;
                        x_pelota = coordenadaXPuntual;
                        y_pelota = coordenadaYPuntual;
                        angulo = (180 - angulo);//Como vemos, las paredes rebotan siempre en espejo. Este cálculo del ángulo es mucho más simple
                        console.log("cambio de sentido (derecha) en x",angulo);
                    };

                    if(coordenadaYPuntual - radio_pelota <= 32){//Comprobamos si choca con el techo
                        sonidoColision.currentTime = 0;
                        sonidoColision.play();
                        colisionParedDetectada = true;
                        x_pelota = coordenadaXPuntual;
                        y_pelota = coordenadaYPuntual;
                        angulo = -angulo;//Y el techo, también rebota siempre en espejo
                        console.log("cambio de sentido en y",angulo);
                    };
                };
            }
        });
    }; 
};

//FUNCIÓN DE COMPROBACIÓN DE COLISIÓN CONTRA LADRILLOS (CON ARRAY DE POSICIONES) Y ACTUALIZACIÓN DE PUNTUACIÓN
function colisionLadrillos(arrayPosiciones){//Debemos pasar el array de posiciones intermedias por parámetro
    let colisionDetectada = false;//Creamos variable para establecer un estado de si se ha detectado ya una colisión (y parar) o no
    let ladrilloColisionado;//Creamos una variable, para registrar el posible ladrillo colisionado (primeramente vacío para ser un falsy)

    arrayPosiciones.forEach((posicionActual,indice) => {//Recorremos las posiciones desde el comienzo al final
        if(indice != 0){//No comprobamos la colisión en la posición inicial (ya se ha resuelta antes como posición final) para evitar doble golpeo
            let coordenadaXPuntual = posicionActual[0];//Sacamos la coordenada X de esa posición
            let coordenadaYPuntual = posicionActual[1];//Y la coordenada Y de esa posición
            let posicionGolpeo = indice;//También registramos que número en la fila ocupa esta posición en la lista de posiciones
            
            matrizLadrillos.forEach((ladrillo,i) => {//En cada posición que recorremos, comprobamos todos los ladrillos de la matriz
                if(!colisionDetectada){//Solo si no se ha detectado una colisión anterior
                    if(ladrillo[0]){//Comprobamos solo los ladrillos que existen (estado primero "true")
                        let filaActual = Math.floor(i/columnasLadrillos);//Calculamos la fila donde se encuentra
                        let columnaActual = (i+columnasLadrillos)%columnasLadrillos;//Y la columna
                        let coordenadaLadrilloX = (margenLateral + 32 + (espaciadoLadrillos / 2)) + (columnaActual * (largoLadrillos + espaciadoLadrillos));//La coordenada X
                        let coordenadaLadrilloY = (margenSuperior + 32 + (espaciadoLadrillos / 2)) + (filaActual * (altoLadrillos + espaciadoLadrillos));//Y la coordenada Y
                        let coordenadaXFinalLadrillo = coordenadaLadrilloX + largoLadrillos;//Calculamos también las coordenadas finales del ladrillo
                        let coordenadaYFinalLadrillo = coordenadaLadrilloY + altoLadrillos;//Importantes para pasarlas por parámetros (siguiente paso)
                        let tipoColision = calculoTipoColision(coordenadaXPuntual,coordenadaYPuntual,coordenadaLadrilloX,coordenadaLadrilloY,coordenadaXFinalLadrillo,coordenadaYFinalLadrillo);//Guardamos el tipo de colisión (si la hay) en esta variable

                        if(tipoColision){//Si se ha detectado alguna colisión en la función de detección de colisiones (y tipo)
                            sonidoColision.currentTime = 0;//Reseteamos el sonido de colisión
                            sonidoColision.play();//Y lo reproducimos de nuevo
                            colisionDetectada = true;//Cambiamos el estado a colisión detectada, para evitar realizar más cálculos de colisiones
                            ladrilloColisionado = [i,coordenadaXPuntual,coordenadaYPuntual,tipoColision];//E insertamos en la matriz de colisiones que ladrillo la ha provocado (el primero, solo uno), y las coordenadas de la colisión, y el tipo de colisión
                            console.log(posicionGolpeo);//Estos logs son a efectos de comprobación de la colisión
                            console.log(arrayPosiciones);
                            console.log(ladrilloColisionado);
                        };
                    };   
                };
            });
        };
    });

    if(ladrilloColisionado){//Si ya tenemos datos en ladrilloColisionado, porque ya hemos registrado una colisión con un ladrillo
        matrizLadrillos[ladrilloColisionado[0]][0] = false;//Automátiamente lo marca como eliminado (primer estato "false")
        puntuacion ++;//Una vez que se destruye un ladrillo, aumentamos la puntuación en 1
        x_pelota = ladrilloColisionado[1];//Y cambiamos las coordenadas de la pelota a las del punto de colisión, evitando que viaje más allá
        y_pelota = ladrilloColisionado[2];

        if(!potenciadorActivado){//Después de eliminar el ladrillo, comprobamos si suelta potenciador, solo en caso que no haya salido antes
            comprobarPotenciador(ladrilloColisionado[0]);//Pasamos por parámetro el índice del ladrillo colisionado
        };

        if(ladrilloColisionado[3] == "lateral"){//Y luego comprobamos se el choque es lateral
            angulo = (180 - angulo);//Y aplicamos el rebote en espejo
        }
        else if(ladrilloColisionado[3] == "superficie"){//Sino, vemos si el choque es superficial
            angulo = -angulo;//Y le aplicamos su rebote en espejo para este ángulo
        }
        else if(ladrilloColisionado[3] == "esquinazo"){//Y, sino, si el choque es en esquinazo
            angulo += 180;//Con su rebote en la misma dirección y sentido contrario
        }
    };
};

//FUNCIÓN DE COMPROBACIÓN DE POTENCIADOR
function comprobarPotenciador(numero_ladrillo){//Le pasamos por parámetro el ladrillo golpeado, que PUEDE generar el potenciador
    if(Math.ceil(Math.random()*50) == 50){//Existe una posibilidad entre 50 de que salga el potenciador (NO SE DEBE TRABAJAR RANDOM CON CEIL NI ROUND)
        console.log("-----------POTENCIADOR-------------");//Mostramos aviso por consola
        potenciadorActivado = true;//Marcamos la variable como verdadera, para evitar que caigan más potenciadores en esta partida
        potenciadorJugando = true;//Ponemos el estado de que el potenciador está en juego, para empezar a trabajar con él en el siguiente pintado

        let filaLadrillo = Math.floor(numero_ladrillo / columnasLadrillos);//Calculamos la fila del ladrillo
        let columnaLadrillo = (numero_ladrillo + columnasLadrillos) % columnasLadrillos;//Y su columna
        x_potenciador = (margenLateral + 32 + (espaciadoLadrillos / 2)) + (columnaLadrillo * (largoLadrillos + espaciadoLadrillos));
        y_potenciador = (margenSuperior + 32 + (espaciadoLadrillos / 2)) + (filaLadrillo * (altoLadrillos + espaciadoLadrillos));
    };//Y calculamos y asignamos las coordenadas donde debería aparecer el potenciador (las del ladrillo generador)
};

//FUNCIÓN DE PINTADO DE FONDO
function pintarFondo(){//Primeramente, pintamos el fondo, que es lo que debe quedar siempre al fondo
    contexto.save();
    let fondo = contexto.createPattern(imagenFondo,"repeat");
    contexto.fillStyle = fondo;
    contexto.fillRect(0,0,lienzo.width,lienzo.height);
    contexto.restore();
};

//FUNCIÓN DE PINTADO DE PELOTA
function pintarPelota(){//Seguidamente, pintamos la pelota, para que así las sombras queden debajo del paddle, de los bordes, y de los ladrillos
    contexto.drawImage(imagenSprites,46,94,9,9,(x_pelota-radio_pelota),(y_pelota-radio_pelota),9*((radio_pelota*2)/5),9*((radio_pelota*2)/5));
};

//FUNCIÓN DE PINTADO DEL PADDLE
function pintarPaddle(){//Pintamos el paddle con animación. Para ello, contamos los ciclos de pintado, y cambiamos la imagen cada número de ciclos 
    if(contadorCiclos > fpsJuego){//Cada segundo (ciclo de animación completo), reseteamos el contador
        contadorCiclos = 1;
    };

    if((contadorCiclos > 0) && (contadorCiclos <= (fpsJuego/4))){//Como hay 4 animaciones en el sprite, dividimos la animación en 4 tiempos
        if(estadoAlargado){//Como vemos, en cada animación comprobamos si el estado del paddle está alargado, para pintar su versión larga
            contexto.drawImage(imagenSprites,29,174,52,12,x_paddle,y_paddle,largo_paddle*(52/48),ancho_paddle*1.5);
        }
        else{//Si NO está alargado, pintamos su versión normal
            contexto.drawImage(imagenSprites,29,107,36,12,x_paddle,y_paddle,largo_paddle*1.125,ancho_paddle*1.5);
        };
    }
    else if((contadorCiclos > (fpsJuego/4)) && (contadorCiclos <= (fpsJuego/2))){
        if(estadoAlargado){
            contexto.drawImage(imagenSprites,86,174,52,12,x_paddle,y_paddle,largo_paddle*(52/48),ancho_paddle*1.5);
        }
        else{
            contexto.drawImage(imagenSprites,68,107,36,12,x_paddle,y_paddle,largo_paddle*1.125,ancho_paddle*1.5);
        };
    }
    else if((contadorCiclos > (fpsJuego/2)) && (contadorCiclos <= (fpsJuego * 3/4))){
        if(estadoAlargado){
            contexto.drawImage(imagenSprites,144,174,52,12,x_paddle,y_paddle,largo_paddle*(52/48),ancho_paddle*1.5);
        }
        else{
            contexto.drawImage(imagenSprites,109,107,36,12,x_paddle,y_paddle,largo_paddle*1.125,ancho_paddle*1.5);
        };
    }
    else if((contadorCiclos > (fpsJuego * 3/4)) && (contadorCiclos <= (fpsJuego))){
        if(estadoAlargado){
            contexto.drawImage(imagenSprites,202,174,52,12,x_paddle,y_paddle,largo_paddle*(52/48),ancho_paddle*1.5);
        }
        else{
            contexto.drawImage(imagenSprites,150,107,36,12,x_paddle,y_paddle,largo_paddle*1.125,ancho_paddle*1.5);
        };
    };
    
    contadorCiclos += (1 * ajusteVelocidad);//Al final del pintado, siempre añadimos uno al ciclo de pintado (ajustado a la velocidad del monitor)
};

//FUNCIÓN DE PINTADO DE BORDES
function pintarBordes(){//Ya pintados la pelota y el paddle, pintamos los bordes; así las sombras quedan debajo y no se ve raro
    contexto.save();
    let borde = contexto.createPattern(imagenBorde,"repeat");
    contexto.strokeStyle = borde;
    contexto.lineWidth = 32;
    contexto.beginPath();
    contexto.moveTo(16,lienzo.height);
    contexto.lineTo(16,16);
    contexto.lineTo((lienzo.width-16),16);
    contexto.lineTo((lienzo.width-16),lienzo.height);
    contexto.stroke();
    contexto.restore();
};//Importante que el tamaño del lienzo sea siempre múltiplos de 32 (alto y ancho), para que no se corten los ladrillos y queden raros

//FUNCIÓN DE PINTADO DE LADRILLOS
function pintarLadrillos(){//Ya por último, podemos pintar los ladrillos
    matrizLadrillos.forEach((ladrillo,i) => {//Recorremos todo el array de los ladrillos
        if(ladrillo[0]){//Y solo si el ladrillo existe (primer estado "true"), lo pintamos
            let filaActual = Math.floor(i/columnasLadrillos);//Calculamos la fila
            let columnaActual = (i+columnasLadrillos)%columnasLadrillos;//Y la columna
            contexto.drawImage(imagenSprites,29.5 + (ladrillo[1] * 16),83,16,8,(margenLateral + 32 + (espaciadoLadrillos / 2)) + (columnaActual * (largoLadrillos + espaciadoLadrillos)),(margenSuperior + 32 + (espaciadoLadrillos / 2)) + (filaActual * (altoLadrillos + espaciadoLadrillos)),largoLadrillos,altoLadrillos);//Y lo dibujamos en las coordenadas que le corresponden
        };
    });
};

//FUNCIÓN DE PINTADO DE POTENCIADOR
function pintarPotenciador(){
    if(potenciadorJugando){//Solo pintamos el potenciador si este se encuentra en estado "jugando"
        contexto.drawImage(imagenSprites,61,96,16,7,x_potenciador,y_potenciador,largo_potenciador,ancho_potenciador);
    };
};

//FUNCIÓN DE PINTADO DE FPS DEL JUEGO
function pintarFPS(){//Pintamos los FPS del monitor, para que el usuario sepa a que velocidad de refresco está trabajando
    contadorFPS += (1 * ajusteVelocidad);//Incrementamos el contador (ajustado al refresco), para controlar los ciclos de pintado

    if(contadorFPS >= (fpsJuego / 2)){//Hacemos que se recalcule solamente cada medio segundo (mitad de ciclo completo)
        contadorFPS = 0;//Reseteamos el contador a 0
        fpsPintar = Math.round(fpsMonitor);//Y calculamos el nuevo valor a pintar
    };

    contexto.save();
    contexto.font = "Bold 24px 'Courier New'";
    contexto.fillStyle = "white";
    contexto.textBaseline = "top";
    contexto.fillText(`FPS:${fpsPintar}`,36,36);//Y pintamos en cada ciclo el valor guardado
    contexto.restore();
};

//FUNCIÓN DE PINTADO DE PUNTUACIÓN
function pintarPuntuacion(){//En cada ciclo pintamos la puntuación actualizada
    contexto.save();
    contexto.font = "Bold 24px 'Courier New'";
    contexto.fillStyle = "white";
    contexto.textBaseline = "top";
    contexto.textAlign = "right";
    contexto.fillText(`SCORE:${puntuacion}`,(lienzo.width - 36),36);
    contexto.restore();
};

//FUNCIÓN DE PINTADO DE INICIO
function pintarInicio(){//Esta solo se pinta al comienzo de cargar el juego. Se pinta el logo de Arkanoid, y el botón para iniciar el juego
    contexto.drawImage(imagenLogo,0,0,219,53,((lienzo.width - 64) * 0.2) + 32,((lienzo.height - 32) * 0.2) + 32,(lienzo.width - 64) * 0.6,(lienzo.width - 64)*0.1452);

    contexto.drawImage(imagenSprites,223,74,48,24,(lienzo.width / 2) - 48,(lienzo.height / 2) - 24,96,48);
};

//FUNCIÓN DE PINTAR CUANDO ESTAS INICIANDO
function pintarIniciando(){//Esta se pinta solamente mientras se "construye" el paddle (animación de iniciando)
    if(contadorConstruccion <= fpsJuego){//Si no hemos terminado un ciclo completo (fps de juego)
        if(contadorConstruccion == 1){//SOLAMENTE EN EL PRIMER CICLO
            sonidoAparicion.play();//Reproducimos el sonido de "construcción" del paddle
            restablecimientoParametros();//IMPORTANTÍSIMO reestablecer todos los parametros de juego a los iniciales en cada juego
            construccionMatrizLadrillos();//Y volver a reconstruir la matriz de ladrillos en cada juego nuevo
        }
        else if((contadorConstruccion > 1) && (contadorConstruccion <= (fpsJuego/4))){//En los siguientes frames ya pintamos las animaciones
            contexto.drawImage(imagenSprites,29,150,32,15,x_paddle_inicial,y_paddle-(0.4375*ancho_paddle),largo_paddle,ancho_paddle*1.875);
        }
        else if((contadorConstruccion > (fpsJuego/4)) && (contadorConstruccion <= (fpsJuego/2))){//Como son 4 imágenes de sprite, en 4 tiempos
            contexto.drawImage(imagenSprites,69,155,32,10,x_paddle_inicial,y_paddle-(0.125*ancho_paddle),largo_paddle,ancho_paddle*1.25);
        }
        else if((contadorConstruccion > (fpsJuego/2)) && (contadorConstruccion <= (fpsJuego * 3/4))){
            contexto.drawImage(imagenSprites,105,155,32,10,x_paddle_inicial,y_paddle-(0.125*ancho_paddle),largo_paddle,ancho_paddle*1.25);
        }
        else if((contadorConstruccion > (fpsJuego * 3/4)) && (contadorConstruccion <= (fpsJuego))){
            contexto.drawImage(imagenSprites,142,157,32,8,x_paddle_inicial,y_paddle,largo_paddle,ancho_paddle);
        };

        contadorConstruccion += (1 * ajusteVelocidad);//Cuando terminamos de pintar un frame, aumentamos el contador (ajustado a la tasa de refresco)
    }
    else if(contadorConstruccion > fpsJuego){//Una vez que ha pasado un ciclo completo, y ya ha terminado la animación de construcción del paddle
        estadoJuego = "jugando";//Cambiamos el estado general a "jugando", para que el siguinte ciclo cambie se funcionamiento
        sonidoBSO.currentTime = 0;//Reseteamos el temporizador de la BSO, por si ya se había reproducido anteriormente
        sonidoBSO.play();//E iniciamos de nuevo la reproducción de la BSO
        console.log("CAMBIO DE ESTADO A: " + estadoJuego);//Notificamos el cambio de estado
        contadorConstruccion = 1;//Y reseteamos el contador de construcción (animación) para otro juego "iniciando"
    };
};

//FUNCIÓN DE PINTAR CUANDO ESTAS PERDIENDO
function pintarPerdiendo(){//Esta solo se pinta mientras el paddle se "destruye" (animación de perdiendo)
    if(contadorDestruccion <= fpsJuego){//Si no ha terminado aún el ciclo completo de la animación, sigue pintando
        if((contadorDestruccion > 0) && (contadorDestruccion <= (fpsJuego/4))){//4 imágenes de sprite, dividimos la animación en 4 tiempos
            contexto.drawImage(imagenSprites,29,129,36,13,x_paddle,y_paddle-(0.125*ancho_paddle),largo_paddle*1.125,ancho_paddle*1.625);
        }
        else if((contadorDestruccion > (fpsJuego/4)) && (contadorDestruccion <= (fpsJuego/2))){
            contexto.drawImage(imagenSprites,70,126,30,16,x_paddle,y_paddle-(0.5*ancho_paddle),largo_paddle,ancho_paddle*2);
        }
        else if((contadorDestruccion > (fpsJuego/2)) && (contadorDestruccion <= (fpsJuego * 3/4))){
            contexto.drawImage(imagenSprites,105,126,32,16,x_paddle,y_paddle-(0.5*ancho_paddle),largo_paddle,ancho_paddle*2);
        }
        else if((contadorDestruccion > (fpsJuego * 3/4)) && (contadorDestruccion <= (fpsJuego))){
            contexto.drawImage(imagenSprites,143,128,30,14,x_paddle,y_paddle-(0.35*ancho_paddle),largo_paddle,ancho_paddle*1.75);
        };

        contadorDestruccion += (1 * ajusteVelocidad);//Cuando terminamos de pintar un frame, aumentamos el contador (ajustado al refresco del monitor)
    }
    else if(contadorDestruccion > fpsJuego){//Si terminamos un ciclo completo (terminamos de pintar la animación)
        estadoJuego = "perdido";//Cambiamos el estado general a "perdido", para que en el siguiente ciclo cambie la ejecución del ciclo
        sonidoBSO.pause();//Detenemos la BSO, indicando que ya no se está "moviendo" el juego
        console.log("CAMBIO DE ESTADO A: " + estadoJuego);//Notificamos el cambio de estado
        contadorDestruccion = 1;//Y reseteamos el contador de la animación para futuros juegos
    };
};

//FUNCIÓN DE PINTADO CUANDO HAS PERDIDO
function pintarPerdido(){//Esta solo se pinta una vez que ha terminado la animación de destrucción, y el juego está pausado hasta reiniciar con botón
    contexto.drawImage(imagenSprites,324,2,146,20,((lienzo.width - 64) * 0.2) + 32,((lienzo.height - 32) * 0.2) + 32,(lienzo.width - 64) * 0.6,(lienzo.width - 64)*0.0823);//Se pinta el mensaje de "GAME OVER"

    contexto.drawImage(imagenSprites,223,74,48,24,(lienzo.width / 2) - 48,(lienzo.height / 2) - 24,96,48);//Y el botón de reinicio
};

//FUNCIÓN DE PINTADO CUANDO HAS GANADO
function pintarVictoria(){//Esta solo se pinta si se cumple la condición de victoria, y el juego se pausa a la espera de reinicio con el botón
    contexto.drawImage(imagenVictoria,0,0,300,47,((lienzo.width - 64) * 0.2) + 32,((lienzo.height - 32) * 0.2) + 32,(lienzo.width - 64) * 0.6,(lienzo.width - 64)*0.0942);//Se pinta el mensaje de "HAS GANADO"

    contexto.drawImage(imagenSprites,223,74,48,24,(lienzo.width / 2) - 48,(lienzo.height / 2) - 24,96,48);//Y el botón de reinicio
};

//FUNCIÓN PARA MOVER EL PADDLE
function moverPaddle(eventoTeclado){//Esta función es llamada con el evento de teclado cuando se pulsa una tecla (da igual el ciclo frame)
    let teclaPulsada = eventoTeclado.key;//Recogemos la tecla pulsada del evento de pulsación

    if(teclaPulsada == "d" || teclaPulsada == "D" || teclaPulsada == "ArrowRight"){//Comprobamos si es la tecla "D" o la flecha derecha
        movimientoDerecho = true;//Y cambiamos el estado de movimiento a la derecha a verdadero
    }
    else if(teclaPulsada == "a" || teclaPulsada == "A" || teclaPulsada == "ArrowLeft"){//Igual que antes, pero para la izquierda
        movimientoIzquierda = true;//Si en el siguiente frame está como verdadero, se aplicarán modificaciones a la posición del paddle
    }
};//Esta función solo actualiza el estado, pero será el ciclo frame el que mueva realmente el paddle en base a este estado (respuesta sin tirones)

//FUNCIÓN PARA DETENER EL PADDLE
function detenerPaddle(eventoTeclado){//Esta función actua como la anterior, pero con el evento de levantar la tecla en el documento
    let teclaLevantada = eventoTeclado.key;

    if(teclaLevantada == "d" || teclaLevantada == "D" || teclaLevantada == "ArrowRight"){
        movimientoDerecho = false;//En este caso, cambiamos los estados de moviento a falsos
    }
    else if(teclaLevantada == "a" || teclaLevantada == "A" || teclaLevantada == "ArrowLeft"){
        movimientoIzquierda = false;//Si en el siguiente frame, está como falso, no se aplicarán modificaciones de posición al paddle
    }
};

//FUNCIÓN PARA DETENER EL MOVIMIENTO DEL PADDLE AL PERDER EL FOCO DEL DOCUMENTO
function detenerMovimiento(){//Sin esta función, si cambiamos de pestaña (o foco), el movimiento se quedaría pillado
    movimientoDerecho = false;//Cambiamos ambos movimientos a "false", como si se hubiera levantado la tecla
    movimientoIzquierda = false;

    console.log(movimientoDerecho,movimientoIzquierda,"Movimiento detenido");//Lo notificamos para saber que está funcionando correctamente
};//Esta función se llama por evento "blur" (perder el foco) respecto a la ventana (no vale con el documento)

//SISTEMA PARA PAUSAR LA BOLA AL CLICAR EN EL CANVAS
var estado_velocidad;//Guardamos el estado de la velocidad actual de la pelota. Tiene que ser variable global para que escape de la función

function detenerPelota(){//Esta función es llamada si hacemos "click pulsado" sobre el canvas
    estado_velocidad = v_pelota;//Guardamos la velocidad actual para luego recuperarla

    v_pelota = 0;//Establecemos la velocidad de la pelota en 0 para que no se mueva (es lo único que no se recalcula en el ciclo de frames)

    lienzo.addEventListener("mouseup",reanudarPelota);//Añadimos un evento para cuando levantemos el click
    lienzo.addEventListener("mouseleave",reanudarPelota);//Y otro por si nos salimos del canvas sin levantar el click
};

function reanudarPelota(){//En ambos eventos anteriores, desencadenan en esta función
    v_pelota = estado_velocidad;//Que restablece la velocidad de la bola al valor previamente guardado

    lienzo.removeEventListener("mouseup",reanudarPelota);//Y quita los eventos de escucha de levantar el click (ya ha sucedido)
    lienzo.removeEventListener("mouseleave",reanudarPelota);
};

//FUNCIÓN PARA COMPROBAR SI SE HA PULSADO EL BOTÓN DE PLAY
function comprobarBoton(eventoClick){//Esta función es llamada cuando se hace "click" en el canvas, y recibe el evento "click" como parámetro
    if(estadoJuego == "inicio" || estadoJuego == "perdido" || estadoJuego == "victoria"){//Solo si se está en estado de "juego pausado"
        let coordenadaXPulsacion = eventoClick.offsetX;//Obtenemos las coordenadas del click del evento, recibido por parámetro
        let coordenadaYPulsacion = eventoClick.offsetY;
        let coordenadaXInicialBoton = (lienzo.width / 2) - 48;//Calculamos las coordenadas del botón de iniciar, que ya sabemos donde se posiciona
        let coordenadaYInicialBoton = (lienzo.height / 2) - 24;
        let coordenadaXFinalBoton = ((lienzo.width / 2) - 48) + 96;
        let coordenadaYFinalBoton = ((lienzo.height / 2) - 24) + 48;
        let dentroRangoX = (coordenadaXPulsacion >= coordenadaXInicialBoton) && (coordenadaXPulsacion <= coordenadaXFinalBoton);//Superposición en X
        let dentroRangoY = (coordenadaYPulsacion >= coordenadaYInicialBoton) && (coordenadaYPulsacion <= coordenadaYFinalBoton);//Superposición en Y

        if(dentroRangoX && dentroRangoY){//Si se superpone en el eje X e Y a la vez, es que está dentro del botón el click
            console.log("DENTRO DE RANGO DEL BOTÓN");//Lo notificamos
            estadoJuego = "iniciando";//Cambiamos el estado del juego a "iniciando", para que en el siguiente frame cambie la dinámica
            console.log("CAMBIO DE ESTADO A: " + estadoJuego);//Notificamos el cambio de estado
            requestAnimationFrame(revisionEstados);//Y comenzamos de nuevo el ciclo del frame, que se había detenido en estado de "juego pausado"
        };//Si nos fijamos, una vez que llegaos a un estado de "juego pausado" (inicio, perdido, o victoria), no se llama al ciclo de frame de nuevo
    };//La única forma de volver al ciclo del frame es mediante este botón
};

//FUNCIÓN DE COMPROBACIÓN DE CARGA DE IMÁGENES
function comprobarCargaImagenes(){//Con un contador, comprobamos si se han cargado todas las imágenes necesarias para el juego
    contadorImagenes ++;//Cada vez que se ejecuta esta función, llamada por la carga de una imagen (evento load), se suma 1 al contador
    if((contadorImagenes >= 5) && (contadorSonidos >= 5)){//Comprobamos que TODAS LAS IMÁGENES Y SONIDOS estén cargados
        requestAnimationFrame(revisionEstados);//Empezamos el primer ciclo de los frames, llamando a la primera función del ciclo
    };
};

//FUNCIÓN DE COMPROBACIÓN DE CARGA DE SONIDOS
function comprobarCargaSonidos(){//Exactamente igual que para las imágenes, pero para los sonidos
    contadorSonidos ++;//En este caso, el evento que llama a la función y aumenta el contador es "canplaythrough" (como load, para sonidos)
    if((contadorImagenes >= 5) && (contadorSonidos >= 5)){
        requestAnimationFrame(revisionEstados);
    };
};

//FUNCIÓN DE CAMBIO DE SONIDO
function cambiarSonido(){//Con esta función, permitimos mutear/desmutear el sonido. Se llama por evento "click" sobre el botón de altavoz
    volumenMuteado = !volumenMuteado;//Primeramente cambiamos (toggle) entre estado muteado/desmuteado

    if(volumenMuteado){//Comprobamos si está muteado, y muteamos todos los sonidos con la propiedad ".muted"
        imagenSonido.src = "./assets/img/volumenOf.png";//También cambiamos la imagen del botón altavoz al de muteado
        sonidoBSO.muted = true;
        sonidoAparicion.muted = true;
        sonidoColision.muted = true;
        sonidoExplosion.muted = true;
        sonidoPotenciador.muted = true;
    }
    else{//Si no está muteado, desmutamos todos los sonidos con la misma propiedad ".muted"
        imagenSonido.src = "./assets/img/altavoz.png";//Y volvemos a cambiar la imagen del botón altavoz a desmuteado
        sonidoBSO.muted = false;
        sonidoAparicion.muted = false;
        sonidoColision.muted = false;
        sonidoExplosion.muted = false;
        sonidoPotenciador.muted = false;
    }
};

//FUNCIÓN DE CAMBIO DE OPCIONES
function cambiarOpciones(){//Esta función es llamada cuando se hace "click" en el botón de "APLICAR CAMBIOS" del menú (formulario) de opciones
    if(estadoJuego == "inicio" || estadoJuego == "perdido" || estadoJuego == "victoria"){//Solamente en los estados de "juego pausado"
        switch(selectorDificultad.value){//Comprobamos los estados posibles de la opción de dificultad
            case "muyFacil": velocidad_pelota_inicial = 3;//Ajustamos la velocidad inicial de la pelota
            ajuste_velocidad_dificultad = 0.3;//Y el aumento de velocidad con el paso del tiempo
            console.log("velocidad cambiada a: ", velocidad_pelota_inicial);//Y notificamos los cambios
            break;//Añadimos un break, para que no siga haciendo más operaciones al coincidir con la opción
            case "facil": velocidad_pelota_inicial = 4;
            ajuste_velocidad_dificultad = 0.4;
            console.log("velocidad cambiada a: ", velocidad_pelota_inicial);
            break;
            case "normal": velocidad_pelota_inicial = 5;
            ajuste_velocidad_dificultad = 0.5;
            console.log("velocidad cambiada a: ", velocidad_pelota_inicial);
            break;
            case "dificil": velocidad_pelota_inicial = 6;
            ajuste_velocidad_dificultad = 0.6;
            console.log("velocidad cambiada a: ", velocidad_pelota_inicial);
            break;
            case "muyDificil": velocidad_pelota_inicial = 7;
            ajuste_velocidad_dificultad = 0.7;
            console.log("velocidad cambiada a: ", velocidad_pelota_inicial);
            break;
        };

        switch(selectorLadrillos.value){//Comprobamos los estados posibles de la opción de número de ladrillos
            case "pocos": filasLadrillos = 5;//Simplemente, cambiamos las filas de ladrillos a crear
            console.log("filas de ladrillos cambiadas a: ", filasLadrillos);//Y lo notificamos
            break;//De nuevo, detenemos la ejecución de más código, en cuanto coincida con una opción
            case "normal": filasLadrillos = 10;
            console.log("filas de ladrillos cambiadas a: ", filasLadrillos);
            break;
            case "muchos": filasLadrillos = 15;
            console.log("filas de ladrillos cambiadas a: ", filasLadrillos);
            break;
        };

        switch(selectorEspaciado.value){//Comprobamos los estados posibles de la opción de espaciado entre ladrillos
            case "ninguno": espaciadoLadrillos = 0;//Solo hay que cambiar el valor de espaciado de ladrillos
            console.log("Espaciado de ladrillos cambiado a: ", espaciadoLadrillos);//Y lo notificamos
            break;//Detenemos la ejecución en cuanto encuentre la opción correcta
            case "pequeno": espaciadoLadrillos = 5;
            console.log("Espaciado de ladrillos cambiado a: ", espaciadoLadrillos);
            break;
            case "grande": espaciadoLadrillos = 15;
            console.log("Espaciado de ladrillos cambiado a: ", espaciadoLadrillos);
            break;
        };

        if(selectorPelota.checked){//Comprobamos si está marcada la casilla de pelota grande
            radio_pelota = 10;//Cambiamos el radio de la pelota
            console.log("Tamaño de pelota cambiado a: ",radio_pelota);//Y lo notificamos
        }
        else{//Si no está marcada
            radio_pelota = 5;//Devolvemos la pelota a su radio original
            console.log("Tamaño de pelota cambiado a: ",radio_pelota);
        };

        if(selectorTamano.checked){//Comprobamos si la casilla de ladrillos grandes está marcada
            largoLadrillos = 48;//Y cambiamos el largo y el ancho de los ladrillos (por 1,5)
            altoLadrillos = 24;
            console.log("Tamaño de ladrillos cambiado a: ",largoLadrillos,altoLadrillos);//Notificamos el cambio
        }
        else{//Si no está marcada
            largoLadrillos = 32;//Devolvemos los ladrillos a sus dimensiones originales
            altoLadrillos = 16;
            console.log("Tamaño de ladrillos cambiado a: ",largoLadrillos,altoLadrillos);
        };

        if(selectorLadrillos.value == "muchos" && selectorEspaciado.value == "grande" && selectorTamano.checked){//Para que no se salgan los ladrillos
            coeficienteMargenSuperior = 0.03;//Cambiamos el margen superior de posicionamiento de los mismos
            console.log("Margen superior cambiado a: ",coeficienteMargenSuperior);//Y lo notificamos
        }
        else{//Si no se dan las condiciones "extremas" (todo al máximo: ladrillos grandes, espaciado a tope, y muchos ladrillos)
            coeficienteMargenSuperior = 0.15;//Devolvemos el margen a su valor original
            console.log("Margen superior cambiado a: ",coeficienteMargenSuperior);
        };
        
    }
    else{//Si el juego está "en movimiento", y se intentan cambiar las opciones, no se harán cambios ninguno
        alert("SOLO SE PUEDEN CAMBIAR LAS OPCIONES MIENTRAS NO SE ESTÁ JUGANDO");//Y se avisará al usuario con un alert
    };
};

//EVENTOS DEL JUEGO
lienzo.addEventListener("mousedown",detenerPelota);//Evento para el click dentro del canvas para pausar la bola
document.addEventListener("keydown",moverPaddle);//Evento en el documento para mover el paddle (ojo de perder el foco del documento de mientras)
document.addEventListener("keyup",detenerPaddle);//Evento en el documento para detener el paddle
lienzo.addEventListener("click",comprobarBoton);//Evento para comprobar si se ha pulsado sobre el botón PLAY
window.addEventListener("blur",detenerMovimiento);//Evento fundamental para que el paddle se detenga si perdemos el foco del documento (solo window)

//EVENTOS DE CARGA DE IMÁGENES
imagenLogo.addEventListener("load",comprobarCargaImagenes);//Evento para comprobar si la imagen ha cargado antes de pintar el canvas
imagenFondo.addEventListener("load",comprobarCargaImagenes);//Lo haremos con todas las imágenes que necesitemos cargar
imagenBorde.addEventListener("load",comprobarCargaImagenes);
imagenSprites.addEventListener("load",comprobarCargaImagenes);
imagenVictoria.addEventListener("load",comprobarCargaImagenes);

//EVENTOS DE CARGA DE SONIDOS
sonidoBSO.addEventListener("canplaythrough",comprobarCargaSonidos,{once:true});//Evento para comprobar si el sonido está listo para reproducirse
sonidoAparicion.addEventListener("canplaythrough",comprobarCargaSonidos,{once:true});//Lo haremos por cada sonido que queramos utilizar
sonidoColision.addEventListener("canplaythrough",comprobarCargaSonidos,{once:true});//Importante {once:true}, para que solo cargue una vez
sonidoExplosion.addEventListener("canplaythrough",comprobarCargaSonidos,{once:true});//"canplaythrough" sería el equivalente a "load", pero para audio
sonidoPotenciador.addEventListener("canplaythrough",comprobarCargaSonidos,{once:true});

//EVENTOS DE CONFIGURABLES (OPCIONES Y SONIDO ON/OFF)
botonSonido.addEventListener("click",cambiarSonido);//Evento para mutear o desmutear el sonido del juego con el botón del altavoz
botonOpciones.addEventListener("click",cambiarOpciones);//Evento para cambiar las opciones del juego con el botón del formulario



/* --------------------------------------------------FUNCIONALIDADES OBSOLETAS------------------------------------------------------------ */

//SISTEMA DE AVISO DE POSICIÓN DE LA BOLA RESPECTO AL PADDLE (primeras fases de desarrollo, actualmente en desuso)
// function pintarAvisoX(){
//     contexto.save();
//     contexto.fillStyle = "red";
//     contexto.fillRect(550,50,30,30);
//     contexto.restore();
// };

// function pintarAvisoY(){
//     contexto.save();
//     contexto.fillStyle = "green";
//     contexto.fillRect(500,50,30,30);
//     contexto.restore();
// };

//FUNCIÓN DE COMPROBACIÓN DE COLISIONES CON PAREDES (Y PERDIDA)
// function colisionParedes(){
//     if((y_pelota - radio_pelota) >= lienzo.height){//Comprobación de si ha salido por abajo (has perdido)
//         contexto.font = "36px bold Arial";//Cambiamos el contexto de fuente
//         contexto.fillText("HAS PERDIDO",200,300);//Y pintamos el mensaje de "HAS PERDIDO"
//     }//Al no llamar a más funciones en este caso, se cierra el ciclo del requestAnimationFrame
//     else{//Si no has perdido (pelota por encima del final)
//         if(x_pelota - radio_pelota <= 0){//Comprobamos si choca con la pared de la izquierda
//             // angulo += (90 - (angulo - 180)) * 2;//Método antiguo, normalizando ángulos, y trabajando con el complementario
//             angulo = (180 - angulo);//Cambiamos el ángulo, para la próxima iteración, calcular los vectores de desplazamiento
//             console.log("cambio de sentido (izquierda) en x",angulo);//Y notificamos el cambio
//         }
        
//         if(x_pelota + radio_pelota >= lienzo.width){//O si choca con la pared de la derecha
//             // angulo -= (90 - (360 - angulo)) * 2;//Igual que antes, método antiguo con ángulo complementario(conservamos por alternativa)
//             angulo = (180 - angulo);//Como vemos, las paredes rebotan siempre en espejo. Este cálculo del ángulo es mucho más simple
//             console.log("cambio de sentido (derecha) en x",angulo);
//         }

//         if(y_pelota - radio_pelota <= 0){//Comprobamos si choca con el techo
//             angulo = -angulo;//Y el techo, también rebota siempre en espejo
//             console.log("cambio de sentido en y",angulo);
//         }

//         colisionPaddle();//Una vez que hemos comprobado las colisiones con las paredes, comprobamos si hay colisión con el paddle
//     }   
// };

//FUNCIÓN DE COMPROBACIÓN DE COLISIÓN CON EL PADDLE
// function colisionPaddle(){//Siempre comprobamos primero si está en posición lateral, o si está por encima del paddle
//     let superficiePaddleIn = ((x_pelota + radio_pelota) >= x_paddle) && ((x_pelota - radio_pelota) <= (x_paddle + largo_paddle));
//     let lateralPaddleIn = ((y_pelota + radio_pelota) >= y_paddle) && ((y_pelota - radio_pelota) <= (y_paddle + ancho_paddle));

//     if(lateralPaddleIn && !superficiePaddleIn){//Si está en el lateral, pero no encima, cambia a colisionLateral
//         console.log("Posición lateral");
//         colisionSuperior = false;
//         colisionLateral = true;
//     }else if(y_pelota + radio_pelota < y_paddle){//Si está por encima del paddle, cambia a colisionSuperior, y a estado no colisionado
//         colisionSuperior = true;
//         colisionLateral = false;
//         estadoColisionado = false;
//     };

//     if(!estadoColisionado){//Solo se aplican las colisiones y los cambios de ángulo si la bola NO está en estadoColisionado
//         if(superficiePaddleIn){//Primero comprobamos que estén en las mismas coordenadas del eje x el paddle y la bola
//             if(movimientoDerecho){//Luego comprobamos si se está moviendo hacia la derecha
//                 if(!colisionLateral && lateralPaddleIn){//Si le pega por arriba (colisionSuperior), solo le modifica la dirección de la velocidad en Y
//                     estadoColisionado = true;//Cambia el estado a colisionado
//                     angulo = -(angulo - 10);//Y modificamos el ángulo; en este caso con un efecto (no es rebote espejo total)
//                 }//Pero si le pega por el lateral (colisionLateral), le modifica la dirección de la velocidad en ambos ejes
//                 else if(colisionLateral && largo_paddle){//Comprobamos si la colisión es lateral
//                     estadoColisionado = true;//Cambiamos el estado a colisionado
//                     angulo += 180;//Y modificamos el ángulo, en vez de espejo, sentido contrario y misma dirección
//                     console.log("Colisión lateral");
//                 }
//             };

//             if(movimientoIzquierda){//Igual que antes, pero aquí comprobamos si se mueve hacia la izquierda
//                 if(!colisionLateral && lateralPaddleIn){
//                     estadoColisionado = true;
//                     angulo = -(angulo + 10);//De nuevo, aplicamos un efecto al ángulo
//                 }
//                 else if(colisionLateral && largo_paddle){
//                     estadoColisionado = true;
//                     angulo += 180;//Si choca con los laterales, el rebore es de cambio de sentido, sin importar si se mueve o no
//                     console.log("Colisión lateral");
//                 }
//             };
            
//             if(!movimientoDerecho && !movimientoIzquierda){//Aquí igual que en las anteriore, pero si NO se está moviendo para ningún lado
//                 if(!colisionLateral && lateralPaddleIn){
//                     estadoColisionado = true;
//                     angulo = -angulo;//Si no se está moviendo, el rebote aplicado es de espejo perfecto, sin efectos
//                 }
//                 else if(colisionLateral && largo_paddle){
//                     estadoColisionado = true;
//                     angulo += 180;//De nuevo, el rebote con los laterales solo cambia el sentido de la bola en la misma dirección
//                     console.log("Colisión lateral");
//                 }
//             };
//         };
//     };    

//     pintarPelota();//Una vez comprobadas las colisiones con el paddle, pintamos los elementos
// };

//FUNCIÓN DE COMPROBACIÓN DE COLISIÓN CON LADRILLOS
// function colisionLadrillos(){//Vamos a comprobar cada ladrillo EXISTENTE en cada iteración
//     let colisionadoLadrillo = false;
//     matrizLadrillos.forEach((ladrillo,i) => {//Para todos los ladrillos de la matriz
//         if(ladrillo[0]){//Solo si el ladrillo existe (estado primero "true")
//             let filaActual = Math.floor(i/columnasLadrillos);//Calculamos la fila donde se encuentra
//             let columnaActual = (i+columnasLadrillos)%columnasLadrillos;//Y la columna
//             let coordenadaLadrilloX = (margenLateral + (espaciadoLadrillos / 2)) + (columnaActual * (largoLadrillos + espaciadoLadrillos));//La coordenada X
//             let coordenadaLadrilloY = (margenSuperior + (espaciadoLadrillos / 2)) + (filaActual * (altoLadrillos + espaciadoLadrillos));//Y la coordenada Y
//             let superficieLadrillo = ((x_pelota + radio_pelota) >= coordenadaLadrilloX) && ((x_pelota - radio_pelota) <= (coordenadaLadrilloX + largoLadrillos));
//             let lateralLadrillo = ((y_pelota + radio_pelota) >= coordenadaLadrilloY) && ((y_pelota - radio_pelota) <= coordenadaLadrilloY + altoLadrillos);
//             //Con superficieLadrillo y LateralLadrillo, comprobamos si la bola está en el rango x o y del ladrillo (como hacíamos con el paddle)

//             if(superficieLadrillo && lateralLadrillo && !colisionadoLadrillo){//Si la bola está pisando al ladrillo
//                 ladrillo[0] = false;//Automátiamente lo marca como eliminado (primer estato "false")
//                 colisionadoLadrillo = true;//Y marcamos la pelota como que ya colisionado con una ladrillo, para que no colisione más de 1 por frame
//                 if(ladrillo[1]){//Y luego comprobamos se el choque es lateral (estado segundo "true")
//                     angulo = (180 - angulo);//Y aplicamos el rebote en espejo
//                 }
//                 else{//Si no está en estado lateral, es que el impacto ha sido superficial
//                     angulo = -angulo;//Por lo que le aplicamos su rebote en espejo para este ángulo
//                 }  
//             };//Si no diferenciáramos la colisión lateral de la superficial, la bola podría atravesar por el lateral toda la formación de ladrillos

//             if(ladrillo[0] && !superficieLadrillo && lateralLadrillo){//Solo si el ladrillo sigue existiendo (los eliminados anteriormente no)
//                 ladrillo[1] = true;//Si está en posición lateral con la bola, lo marcamos, por si en la próxima iteración colisionan, saberlo
//             }
//             else{//Si no está en posición lateral, se marca como que no está en esta posición, por si luego colisionan
//                 ladrillo[1] = false;
//             };
//         };//Importantísimo primero resolver la colisión y luego ver si está en posición lateral, pues, sino, nunca habría colisiones laterales
//     });//Esto sucede porque, al ocupar el espacio del ladrillo, ya está dentro de la superficie x, por lo que no estaría en posición lateral

//     pintarPelota();//Una vez que hemos comprobado las colisiones, y modificado los ángulos (o no), podemos llamar a las funciones de pintar
// };
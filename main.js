/*-------------------------------------------------ESTADOS GLOBALES DE LA APLICACIÓN----------------------------------------------*/

let modoOscuroActivado = true;
let animacionesActivadas = true;
let sonidoActivado = false;
let tutorial = true;

const elementoRaiz = document.documentElement;
const checkboxModoOscuro = document.getElementById("switch_tema");
const checkboxAnimaciones = document.getElementById("switch_animacion");
const checkboxSonido = document.getElementById("switch_audio");

function cambiarModo(){
    if(checkboxModoOscuro.checked){
        modoOscuroActivado = true;
        elementoRaiz.setAttribute("data-theme","oscuro");
    }
    else{
        modoOscuroActivado = false;
        elementoRaiz.setAttribute("data-theme","claro");
    };
};

function cambiarAnimaciones(){
    if(checkboxAnimaciones.checked){
        animacionesActivadas = true;
        elementoRaiz.setAttribute("data-animation","on");
    }
    else{
        animacionesActivadas = false;
        elementoRaiz.setAttribute("data-animation","off");
    };
};

function cambiarSonido(){
    if(checkboxSonido.checked){
        sonidoActivado = true;
    }
    else{
        sonidoActivado = false;
    };
};

checkboxModoOscuro.addEventListener("change",cambiarModo);
checkboxAnimaciones.addEventListener("change",cambiarAnimaciones);
checkboxSonido.addEventListener("change",cambiarSonido);

/*------------------------------------------------APERTURA Y CIERRE MENÚ DE OPCIONES----------------------------------------------*/

let estadoMenu = "cerrado";

const botonMenu = document.getElementById("boton_settings");

const ventanaMenu = document.getElementById("menu_configuracion");

function cambiarEstadoMenu(){
    if(estadoMenu == "cerrado"){
        estadoMenu = "abierto";
    }
    else if(estadoMenu == "abierto"){
        estadoMenu = "cerrado";
    };

    ventanaMenu.setAttribute("data-estado",estadoMenu);
};

botonMenu.addEventListener("click",cambiarEstadoMenu);

/*-------------------------------------------------------CIERRE DIALOG TUTORIAL-----------------------------------------------------*/

const dialogoTutorial = document.getElementById("dialogo_tutorial");

const botonDialogoTutorial = document.getElementById("boton_dialogo_tutorial");

function cambiarEstadoTutorial(){
    dialogoTutorial.close();

    dialogoTutorial.classList.remove("tutorial");
    botonMenu.classList.remove("tutorial");

    localStorage.setItem("tutorial","true");

    checkboxSonido.checked = true;
    cambiarSonido();
};

botonDialogoTutorial.addEventListener("click",cambiarEstadoTutorial);

const tutorialAcabado = localStorage.getItem("tutorial");

if(tutorialAcabado){
    tutorial = false;

    dialogoTutorial.close();

    dialogoTutorial.classList.remove("tutorial");
    botonMenu.classList.remove("tutorial");    
}

/*-------------------------------------------------APERTURA Y CIERRE MODAL LEGAL-----------------------------------------------------*/

const botonModal = document.getElementById("boton_legal");

const modalLegal = document.getElementById("legal_modal");

const botonCerraModal = document.getElementById("boton_modal_cerrar");

function abrirModalLegal(){
    modalLegal.showModal();
};

function cerrarModalLegal(){
    modalLegal.close();
};

botonModal.addEventListener("click",abrirModalLegal);
botonCerraModal.addEventListener("click",cerrarModalLegal);

/*---------------------------------------INTERSECTIONOBSERVER Y APARICIÓN DE ELEMENTOS------------------------------------------------*/

function manejadorObservador(entradas,observador){

    entradas.forEach(entrada => {
        if(entrada.isIntersecting){
            entrada.target.classList.add("visible");

            if(entrada.target.id == "seccion_informacion"){
                controlPuntero();
            }
        }
        else{
           entrada.target.classList.remove("visible");

           if(entrada.target.id == "seccion_informacion"){
                quitarControlPuntero();
            }
        }
    });
};

let opcionesObserador = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2
}

const observador = new IntersectionObserver(manejadorObservador,opcionesObserador);

const secciones = document.querySelectorAll(".seccion");

secciones.forEach(seccion => {
    observador.observe(seccion);
});

/*-------------------------------------------ESCALADO SEPARADORES VERTICALES INFORMACIÓN------------------------------------------------*/

const separadores = document.querySelectorAll(".separador-vertical");

const seccionInfo = document.getElementById("seccion_informacion");

let procesandoEscalado = false;

function procesadoEscalado(evento){
    if(!procesandoEscalado){
        procesandoEscalado = true;
        requestAnimationFrame(()=>{
            const proporcionAltura = (((evento.clientY/window.innerHeight)*0.2)+0.9);
            
            separadores.forEach(separador => {
                separador.style.setProperty("--proporcion-escalado",proporcionAltura);
            });
            procesandoEscalado = false;
        })
    }
};

function controlPuntero(){
    console.log("CONTROLANDO EL PUNTERO");

    seccionInfo.addEventListener("mousemove",procesadoEscalado); 
};

function quitarControlPuntero(){
    console.log("QUITANDO CONTROL DE PUNTERO");

    seccionInfo.removeEventListener("mousemove",procesadoEscalado);
};

/*-------------------------------------------VIDEO EN MINIATURAS DE CARDS DE PROYECTOS------------------------------------------------*/

const cardSPA = document.getElementById("card_proyecto_spa");
const cardEcommerce = document.getElementById("card_proyecto_ecommerce");
const cardBuscador = document.getElementById("card_proyecto_buscador");
const cardTresEnRaya = document.getElementById("card_proyecto_tresenraya");
const cardArkanoid = document.getElementById("card_proyecto_arkanoid");
const cardCajero = document.getElementById("card_proyecto_cajero");

function reproduccionVideo(evento){
    const videoMiniatura = evento.target.querySelector(".miniatura-video");

    videoMiniatura.play();

    evento.target.addEventListener("mouseleave",resetVideo);
};

function resetVideo(evento){
    const videoMiniatura = evento.target.querySelector(".miniatura-video");

    videoMiniatura.pause();
    videoMiniatura.currentTime = 0;

    evento.target.removeEventListener("mouseleave",resetVideo);
};

cardSPA.addEventListener("mouseenter",reproduccionVideo);
cardEcommerce.addEventListener("mouseenter",reproduccionVideo);
cardBuscador.addEventListener("mouseenter",reproduccionVideo);
cardTresEnRaya.addEventListener("mouseenter",reproduccionVideo);
cardArkanoid.addEventListener("mouseenter",reproduccionVideo);
cardCajero.addEventListener("mouseenter",reproduccionVideo);

/*----------------------------------------------------AUDIO GENERAL DEL PORTFOLIO---------------------------------------------------------*/

const sonidoHoverNavbar = new Audio;
sonidoHoverNavbar.src = "./assets/audio/HOVER_NAVBAR.wav";
sonidoHoverNavbar.volume = 0.5;

const sonidoHoverIconos = new Audio;
sonidoHoverIconos.src = "./assets/audio/HOVER_ICONOS.wav";
sonidoHoverIconos.volume = 1;

const sonidoHoverCards = new Audio;
sonidoHoverCards.src = "./assets/audio/HOVER_CARDS.wav";
sonidoHoverCards.volume = 0.5;

const sonidoClick = new Audio;
sonidoClick.src = "./assets/audio/CLICK.wav";
sonidoClick.volume = 1;

const elementosNavbar = document.querySelectorAll(".navbar-elemento");
const elementosOpciones = document.querySelectorAll(".interruptor-cuerpo");
const elementosFlecha = document.querySelectorAll(".desplazamiento");
const tituloPortada = document.querySelector(".seccion-presentacion");
const imagenPortada = document.querySelector(".mascara-foto-principal");
const elementosCardsProyectos = document.querySelectorAll(".card-proyecto");
const elementosIconosTecnologias = document.querySelectorAll(".proyecto-lista-elemento");
const elementosCardsInformacion = document.querySelectorAll(".card-info");
const elementosIconosStack = document.querySelectorAll(".elemento-stack");
const botonEnviar = document.querySelector(".boton-enviar");
const elementosIconosContacto = document.querySelectorAll(".lista-contacto-elemento");
const avisoLegal = document.querySelector(".boton-aviso-legal");
const accesibilidad = document.querySelector(".enlace-accesibilidad");
const elementosNavbarLegal = document.querySelectorAll(".legal-lista-elemento");
const elementosClicables = document.querySelectorAll(".clicable");

elementosNavbar.forEach((iconoNavbar)=>{
    iconoNavbar.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverNavbar.currentTime = 0;
        sonidoHoverNavbar.play();
    })
});

elementosOpciones.forEach((interruptor)=>{
    interruptor.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverNavbar.currentTime = 0;
        sonidoHoverNavbar.play();
    })
});

elementosFlecha.forEach((flecha)=>{
    flecha.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverIconos.currentTime = 0;
        sonidoHoverIconos.play();
    })
});

tituloPortada.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverIconos.currentTime = 0;
    sonidoHoverIconos.play();
});

imagenPortada.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverIconos.currentTime = 0;
    sonidoHoverIconos.play();
});

elementosCardsProyectos.forEach((card)=>{
    card.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverCards.currentTime = 0;
        sonidoHoverCards.play();
    })
});

elementosIconosTecnologias.forEach((icono)=>{
    icono.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverIconos.currentTime = 0;
        sonidoHoverIconos.play();
    })
});

elementosCardsInformacion.forEach((card)=>{
    card.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverCards.currentTime = 0;
        sonidoHoverCards.play();
    })
});

elementosIconosStack.forEach((icono)=>{
    icono.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverIconos.currentTime = 0;
        sonidoHoverIconos.play();
    })
});

botonEnviar.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverCards.currentTime = 0;
    sonidoHoverCards.play();
});

elementosIconosContacto.forEach((icono)=>{
    icono.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverIconos.currentTime = 0;
        sonidoHoverIconos.play();
    })
});

avisoLegal.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverIconos.currentTime = 0;
    sonidoHoverIconos.play();
});

accesibilidad.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverIconos.currentTime = 0;
    sonidoHoverIconos.play();
});

elementosNavbarLegal.forEach((enlace)=>{
    enlace.addEventListener("mouseenter",()=>{
        if(!sonidoActivado){return};
        sonidoHoverNavbar.currentTime = 0;
        sonidoHoverNavbar.play();
    })
});

botonCerraModal.addEventListener("mouseenter",()=>{
    if(!sonidoActivado){return};
    sonidoHoverNavbar.currentTime = 0;
    sonidoHoverNavbar.play();
});

elementosClicables.forEach((elemento)=>{
    elemento.addEventListener("click",()=>{
        if(!sonidoActivado){return};
        sonidoClick.currentTime = 0;
        sonidoClick.play();
    })
});
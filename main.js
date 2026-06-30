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


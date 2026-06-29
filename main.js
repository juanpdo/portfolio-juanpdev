/*-----------------------------APERTURA Y CIERRE MENÚ DE OPCIONES-------------------------------*/

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

/*--------------------------------APERTURA Y CIERRE MODAL LEGAL----------------------------------*/

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
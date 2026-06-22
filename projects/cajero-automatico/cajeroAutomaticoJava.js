alert("Vamos al lío");

var pinTarjeta = prompt("Elige un PIN para tu tarjeta de crédito de 4 dígitos :");

comprobarPIN();

var imagenCajero = document.getElementById("imagenCajeroHtml");
var tecladoCajero = document.getElementById("tecladoCajeroHtml");
var tarjetaCredito = document.getElementById("tarjetaCreditoHtml");
var pantallaCajero = document.getElementById("pantallaHtml");
pantallaCajero.marco = pantallaCajero.getContext("2d");
var pantallaPIN = document.getElementById("pantallaPINHtml");
pantallaPIN.marco = pantallaPIN.getContext("2d");
var pantallaDinero = document.getElementById("pantallaDineroHtml");
pantallaDinero.marco = pantallaDinero.getContext("2d");
var lectorTarjeta = document.getElementById("lectorTarjetaHtml");
lectorTarjeta.marco = lectorTarjeta.getContext("2d");
var zonaDinero = document.getElementById("zonaDineroHtml");
zonaDinero.marco = zonaDinero.getContext("2d");
var tecla1 = document.getElementById("canvas1Html");
tecla1.marco = tecla1.getContext("2d");
var tecla2 = document.getElementById("canvas2Html");
tecla2.marco = tecla2.getContext("2d");
var tecla3 = document.getElementById("canvas3Html");
tecla3.marco = tecla3.getContext("2d");
var tecla4 = document.getElementById("canvas4Html");
tecla4.marco = tecla4.getContext("2d");
var tecla5 = document.getElementById("canvas5Html");
tecla5.marco = tecla5.getContext("2d");
var tecla6 = document.getElementById("canvas6Html");
tecla6.marco = tecla6.getContext("2d");
var tecla7 = document.getElementById("canvas7Html");
tecla7.marco = tecla7.getContext("2d");
var tecla8 = document.getElementById("canvas8Html");
tecla8.marco = tecla8.getContext("2d");
var tecla9 = document.getElementById("canvas9Html");
tecla9.marco = tecla9.getContext("2d");
var tecla0 = document.getElementById("canvas0Html");
tecla0.marco = tecla0.getContext("2d");
var teclaCancel = document.getElementById("canvasCancelHtml");
teclaCancel.marco = teclaCancel.getContext("2d");
var teclaClear = document.getElementById("canvasClearHtml");
teclaClear.marco = teclaClear.getContext("2d");
var teclaEnter = document.getElementById("canvasEnterHtml");
teclaEnter.marco = teclaEnter.getContext("2d");

var bolsillo = document.getElementById("bolsilloHtml");
bolsillo.marco = bolsillo.getContext("2d");

pantallaCajero.marco.font = "30pt Arial";
pantallaCajero.marco.textAlign = "center";
pantallaCajero.marco.fillStyle = "white";

pantallaPIN.marco.font = "30pt Arial";
pantallaPIN.marco.textAlign = "center";
pantallaPIN.marco.fillStyle = "white";

pantallaDinero.marco.font = "30pt Arial";
pantallaDinero.marco.textAlign = "center";
pantallaDinero.marco.fillStyle = "white";

imagenCajero.draggable = false;
tecladoCajero.draggable = false;
tarjetaCredito.draggable = false;

var sombreadoTeclasNormal = new Image;
sombreadoTeclasNormal.src = "sombraTeclasNormal.png";

var sombreadoTeclasGrande = new Image;
sombreadoTeclasGrande.src = "sombraTeclasGrande.png";

var teclas = document.getElementsByClassName("tecla");
var teclasGrandes = document.getElementsByClassName("teclaGrande");

var caja500 = document.getElementById("caja500Html");
var caja200 = document.getElementById("caja200Html");
var caja100 = document.getElementById("caja100Html");
var caja50 = document.getElementById("caja50Html");
var caja20 = document.getElementById("caja20Html");
var caja10 = document.getElementById("caja10Html");
var caja5 = document.getElementById("caja5Html");
var cajaTotal = document.getElementById("cajaTotalHtml");
var cajeroMaximo = document.getElementById("cajeroMaximoHtml");

var resultados = document.getElementById("resultadosHtml");
resultados.marco = resultados.getContext("2d");

var cajaBilletes = document.getElementsByClassName("caja");

var paginaBienvenida = true;
var paginaPin = false;
var paginaPinError = false;
var paginaSeleccion = false;
var paginaFaltanFondos = false;
var paginaCantidadExcesiva = false;
var paginaConfirmacion = false;
var paginaFaltanBilletes = false;
var paginaRetireTarjeta = false;
var paginaRetireDinero = false;
var paginaDespedida = false;

var introduccionPIN = "";
var asteriscosPIN = "";
var cantidadSeleccionada = "0";
var cantidadSeleccionadaValor = 0;

var cantidadADistibuir = 0;

var operacionCorrecta = false;
var dineroRecogido = false;

var imagenTarjetaMetida = new Image;
imagenTarjetaMetida.src = "tarjetaCreditoDentro.png";
var imagenDinero = new Image;
imagenDinero.src = "billetes.png";

var imagenBillete500 = new Image;
imagenBillete500.src = "500euros.jpg"
var imagenBillete200 = new Image;
imagenBillete200.src = "200euros.jpg"
var imagenBillete100 = new Image;
imagenBillete100.src = "100euros.jpg"
var imagenBillete50 = new Image;
imagenBillete50.src = "50euros.jpg"
var imagenBillete20 = new Image;
imagenBillete20.src = "20euros.jpg"
var imagenBillete10 = new Image;
imagenBillete10.src = "10euros.jpg"
var imagenBillete5 = new Image;
imagenBillete5.src = "5euros.jpg"

var tarjetaAgarrada = false;

var tarjetaInsertada = false;

class Billete
{
  constructor(nombre,valor,imagen,cantidadEnCajero,cantidadEntregar)
  {
    this.nombre = nombre;
    this.valor = valor;
    this.imagen = imagen;
    this.cantidadEnCajero = cantidadEnCajero;
    this.cantidadEntregar = cantidadEntregar;
  }
}

var billete500 = new Billete("Billete de 500",500,imagenBillete500,parseInt(caja500.value),0);
var billete200 = new Billete("Billete de 200",200,imagenBillete200,parseInt(caja200.value),0);
var billete100 = new Billete("Billete de 100",100,imagenBillete100,parseInt(caja100.value),0);
var billete50 = new Billete("Billete de 50",50,imagenBillete50,parseInt(caja50.value),0);
var billete20 = new Billete("Billete de 20",20,imagenBillete20,parseInt(caja20.value),0);
var billete10 = new Billete("Billete de 10",10,imagenBillete10,parseInt(caja10.value),0);
var billete5 = new Billete("Billete de 5",5,imagenBillete5,parseInt(caja5.value),0);

var billetes = [];
billetes[0] = billete500;
billetes[1] = billete200;
billetes[2] = billete100;
billetes[3] = billete50;
billetes[4] = billete20;
billetes[5] = billete10;
billetes[6] = billete5;

for (var i = 0; i < teclas.length; i++)
{
  teclas[i].addEventListener("mousedown",pulsado);
  teclas[i].addEventListener("mouseup",despulsado);
  teclas[i].addEventListener("click",valorTecla);

  teclas[i].value = i;
}

for (var i = 0; i < teclasGrandes.length; i++)
{
  teclasGrandes[i].addEventListener("mousedown",pulsadoGrande);
  teclasGrandes[i].addEventListener("mouseup",despulsadoGrande);
}

for (var i = 0; i < cajaBilletes.length; i++)
{
  cajaBilletes[i].addEventListener("mouseup",actualizarCajero);
  cajaBilletes[i].addEventListener("keyup",actualizarCajero);
}

teclaEnter.addEventListener("click",funcionEnter);
teclaCancel.addEventListener("click",funcionCancel);
teclaClear.addEventListener("click",funcionClear);

document.addEventListener("mouseup",despulsadoFuera);

document.addEventListener("mousedown",tarjetaCogida);
document.addEventListener("mousemove",moverTarjeta);
document.addEventListener("mouseup",dejarTarjeta);

lectorTarjeta.addEventListener("click",recogerTarjeta);
zonaDinero.addEventListener("click",recogerDinero);

cambiarPantalla();

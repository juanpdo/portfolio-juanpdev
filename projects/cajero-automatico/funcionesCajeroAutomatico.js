function comprobarPIN()
{
  var pinValor = parseInt(pinTarjeta);

  if (Number.isInteger(pinValor))
  {
    if (pinTarjeta.length == 4)
    {
      alert("PIN correcto");
    }

    else
    {
      pinTarjeta = prompt("Por favor, introduzca un PIN de 4 dígitos :");

      comprobarPIN();
    }
   }

   else
   {
     pinTarjeta = prompt("Por favor, introduzca un valor numérico");

     comprobarPIN();
   }
  }


function pulsado()
{
  console.log("tecla pulsada");

  this.marco.drawImage(sombreadoTeclasNormal,0,0);
}

function despulsado()
{
  console.log("tecla soltada");

  this.marco.clearRect(0,0,this.width,this.height);
}

function pulsadoGrande()
{
  console.log("tecla pulsada");

  this.marco.drawImage(sombreadoTeclasGrande,0,0);
}

function despulsadoGrande()
{
  console.log("tecla soltada");

  this.marco.clearRect(0,0,this.width,this.height);
}

function despulsadoFuera(localizacionFuera)
{
  if (localizacionFuera.target.className != "tecla" && localizacionFuera.target.className != "teclaGrande")
  {
    console.log("tecla soltada");

    for (var i = 0; i < teclas.length; i++) {
      teclas[i].marco.clearRect(0,0,teclas[i].width,teclas[i].height);
    }
    for (var i = 0; i < teclasGrandes.length; i++) {
      teclasGrandes[i].marco.clearRect(0,0,teclasGrandes[i].width,teclasGrandes[i].height);
    }
  }
}

function tarjetaCogida(seleccion)
{
  if (seleccion.target.className == "tarjeta")
  {
    tarjetaAgarrada = true;
  }
}

function moverTarjeta(lugar)
{
  var posicionXTarjeta = lugar.pageX;
  var posicionYTarjeta = lugar.pageY;

  if (tarjetaAgarrada == true)
  {
    tarjetaCredito.style.left = posicionXTarjeta + "px";
    tarjetaCredito.style.top = posicionYTarjeta + "px";
  }
}

function dejarTarjeta(dejar)
{
  if (tarjetaAgarrada == true)
  {
    console.log(dejar);

    if (dejar.pageX >= lectorTarjeta.offsetLeft && dejar.pageX <= lectorTarjeta.offsetLeft + 130 && dejar.pageY >= lectorTarjeta.offsetTop && dejar.pageY <= lectorTarjeta.offsetTop + 55 && paginaBienvenida == true)
    {
      console.log("tarjeta soltada dentro");

      tarjetaCredito.style.left = 1020 + "px";
      tarjetaCredito.style.top = 250 + "px";

      tarjetaCredito.hidden = true;

      tarjetaAgarrada = false;

      tarjetaMetida();
    }

    else
    {
      console.log("tarjeta soltada fuera");

      tarjetaCredito.style.left = 1020 + "px";
      tarjetaCredito.style.top = 250 + "px";

      tarjetaAgarrada = false;
    }
  }

  else
  {
    console.log("soltado sin tarjeta agarrada");
  }
}

function tarjetaMetida()
{
  lectorTarjeta.marco.drawImage(imagenTarjetaMetida,0,0);

  tarjetaInsertada = true;

  paginaPin = true;
  paginaBienvenida = false;

  cambiarPantalla();
}

function recogerTarjeta()
{
  if (tarjetaInsertada == true && paginaRetireTarjeta == true)
  {
    console.log("tarjeta retirada");

    lectorTarjeta.marco.clearRect(0,0,lectorTarjeta.width,lectorTarjeta.height);

    tarjetaCredito.hidden = false;

    tarjetaInsertada = false;

    if (operacionCorrecta == true)
    {
      paginaRetireTarjeta = false;
      paginaRetireDinero = true;
    }

    else
    {
      paginaRetireTarjeta = false;
      paginaDespedida = true;
    }

    cambiarPantalla();
  }
}

function cambiarPantalla()
{
  var centroPantallaX = pantallaCajero.width / 2;
  var centroPantallaY = pantallaCajero.height / 2;

  pantallaCajero.marco.clearRect(0,0,pantallaCajero.width,pantallaCajero.height);
  pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);
  pantallaDinero.marco.clearRect(0,0,pantallaDinero.width,pantallaDinero.height);

  if (paginaBienvenida == true)
  {
    var texto = " Bienvenido / Por favor introduzca / su tarjeta de crédito ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaPin == true)
  {
    var texto = " Por favor introduzca / el PIN de su tarjeta ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaPinError == true)
  {
    var texto = " PIN incorrecto / por favor / pruebe de nuevo ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaSeleccion == true)
  {
    var texto = " Por favor seleccione / la cantidad a retirar ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }

    pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
  }

  if (paginaFaltanFondos == true)
  {
    var texto = " Este cajero no dispone / de suficiente efectivo. / Seleccione otra cantidad ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaCantidadExcesiva == true)
  {
    var texto = " Este cajero tiene / un límite de " + cajeroMaximo.value + " € / seleccione otra cantidad ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaConfirmacion == true)
  {
    var texto = " Confirme que la / cantidad a retirar es: ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }

    pantallaPIN.marco.fillText(cantidadSeleccionadaValor + " €",100,40,180)
  }

  if (paginaFaltanBilletes == true)
  {
    var texto = " Este cajero no dispone / de los billetes necesarios / para la suma seleccionada ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaRetireTarjeta == true)
  {
    var texto = " Por favor / retire su tarjeta ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }

  if (paginaRetireDinero == true)
  {
    var texto = " Por favor / retire su dinero ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }

    zonaDinero.marco.drawImage(imagenDinero,0,0);
  }

  if (paginaDespedida == true)
  {
    var texto = " Gracias por usar / nuestro cajero automático / vuelva pronto ";
    var lineas = texto.split("/");
    var divisionesLineasPantalla = pantallaCajero.height / (lineas.length + 1);

    for (var i = 0; i < lineas.length; i++)
    {
      pantallaCajero.marco.fillText(lineas[i],centroPantallaX,divisionesLineasPantalla + (i * divisionesLineasPantalla),pantallaCajero.width - 20);
    }
  }
}

function valorTecla()
{
  if (paginaPin == true && introduccionPIN.length < 4)
  {
    console.log("metiendo valor:" + this.value);

    introduccionPIN = String(introduccionPIN + this.value);

    asteriscosPIN = asteriscosPIN + " * ";

    pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

    pantallaPIN.marco.fillText(asteriscosPIN,100,40,180);
  }

  if (paginaSeleccion == true && cantidadSeleccionada.length < 4)
  {
    console.log("metiendo valor:" + this.value);

    if (cantidadSeleccionadaValor == 0)
    {
      cantidadSeleccionada = String(this.value);

      cantidadSeleccionadaValor = parseInt(cantidadSeleccionada);

      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
    }

    else
    {
      cantidadSeleccionada = String(cantidadSeleccionada + this.value);

      cantidadSeleccionadaValor = parseInt(cantidadSeleccionada);

      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
    }
  }
}

function funcionEnter()
{
  console.log("tecla Enter pulsada");

  if (paginaPin == true)
  {
    if (introduccionPIN == pinTarjeta)
    {
      console.log("COINCIDEN");

      introduccionPIN = "";
      asteriscosPIN = "";

      paginaPin = false;
      paginaSeleccion = true;

      cambiarPantalla();
    }

    else
    {
      console.log("NO COINCIDEN");

      introduccionPIN = "";
      asteriscosPIN = "";

      paginaPin = false;
      paginaPinError = true;

      cambiarPantalla();
    }
  }

  else if(paginaPinError == true)
  {
    paginaPinError = false;
    paginaPin = true;

    cambiarPantalla();
  }

  else if (paginaSeleccion == true)
  {
    if (cantidadSeleccionadaValor <= cajaTotal.value && cantidadSeleccionadaValor <= cajeroMaximo.value && cantidadSeleccionadaValor != 0)
    {
      console.log("cantidad correcta");

      paginaSeleccion = false;
      paginaConfirmacion = true;

      calcularBilletes();

      bloquearCajas();

      cambiarPantalla();
    }

    else if (cantidadSeleccionadaValor > cajaTotal.value)
    {
      console.log("cantidad supera existencias");

      paginaSeleccion = false;
      paginaFaltanFondos = true;

      cambiarPantalla();
    }

    else if (cantidadSeleccionadaValor > cajeroMaximo.value)
    {
      console.log("cantidad supera maximo");

      paginaSeleccion = false;
      paginaCantidadExcesiva = true;

      cambiarPantalla();
    }
  }

  else if (paginaFaltanFondos == true)
  {
    paginaFaltanFondos = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }

  else if (paginaCantidadExcesiva == true)
  {
    paginaCantidadExcesiva = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }

  else if (paginaConfirmacion == true)
  {
    if (cantidadADistibuir == 0)
    {
      operacionCorrecta = true;

      paginaConfirmacion = false;
      paginaRetireTarjeta = true;

      cambiarPantalla();
    }

    else
    {
      console.log("resto diferente de 0")

      paginaConfirmacion = false;
      paginaFaltanBilletes = true;

      cambiarPantalla();
    }
  }

  else if (paginaFaltanBilletes == true)
  {
    paginaFaltanBilletes = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }

  else if (paginaDespedida == true)
  {
    dineroRecogido = false;

    cantidadSeleccionada = "0";
    cantidadSeleccionadaValor = 0;

    for (var i = 0; i < billetes.length; i++)
    {
      billetes[i].cantidadEntregar = 0;
    }

    paginaDespedida = false;
    paginaBienvenida = true;

    desbloquearCajas();

    bolsillo.marco.clearRect(0,0,bolsillo.width,bolsillo.height);
    resultados.marco.clearRect(0,0,resultados.width,resultados.height)

    cambiarPantalla();
  }
}

function funcionCancel()
{
  console.log("tecla Cancel pulsada");

  if (paginaPin == true)
  {
    if (introduccionPIN == "")
    {
      paginaRetireTarjeta = true;
      paginaPin = false;

      cambiarPantalla();
    }

    else
    {
      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      asteriscosPIN = "";
      introduccionPIN = "";
    }
  }

  else if (paginaPinError == true)
  {
    paginaPinError = false;
    paginaPin = true;

    cambiarPantalla();
  }

  else if (paginaSeleccion == true)
  {
    if (cantidadSeleccionada == "0")
    {
      operacionCorrecta = false;

      paginaRetireTarjeta = true;
      paginaSeleccion = false;

      cambiarPantalla();
    }

    else
    {
      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      cantidadSeleccionada = "0";
      cantidadSeleccionadaValor = parseInt(cantidadSeleccionada);

      pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
    }
  }

  else if (paginaFaltanFondos == true)
  {
    paginaFaltanFondos = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }

  else if (paginaCantidadExcesiva == true)
  {
    paginaCantidadExcesiva = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }

  else if (paginaConfirmacion == true)
  {
    paginaConfirmacion = false;
    paginaSeleccion = true;

    desbloquearCajas();

    cambiarPantalla();
  }

  else if (paginaFaltanBilletes == true)
  {
    paginaFaltanBilletes = false;
    paginaSeleccion = true;

    cambiarPantalla();
  }
}

function funcionClear()
{
  console.log("tecla Clear pulsada");

  if (paginaPin == true && introduccionPIN.length > 0)
  {
    introduccionPIN = introduccionPIN.substr(0,introduccionPIN.length - 1);
    asteriscosPIN = asteriscosPIN.substr(0,asteriscosPIN.length - 3);

    pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

    pantallaPIN.marco.fillText(asteriscosPIN,100,40,180);
  }

  else if (paginaSeleccion == true && cantidadSeleccionada.length > 0)
  {
    if (cantidadSeleccionada.length == 1)
    {
      cantidadSeleccionada = "0";
      cantidadSeleccionadaValor = parseInt(cantidadSeleccionada);

      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
    }

    else
    {
      cantidadSeleccionada = cantidadSeleccionada.substr(0,cantidadSeleccionada.length - 1);
      cantidadSeleccionadaValor = parseInt(cantidadSeleccionada);

      pantallaPIN.marco.clearRect(0,0,pantallaPIN.width,pantallaPIN.height);

      pantallaPIN.marco.fillText(cantidadSeleccionada + " €",100,40,180);
    }
  }
}

function recogerDinero()
{
  if (dineroRecogido == false && paginaRetireDinero == true)
  {
    console.log("dinero recogido");

    zonaDinero.marco.clearRect(0,0,zonaDinero.width,zonaDinero.height);

    dibujarDinero();
    mostrarResultados();

    dineroRecogido = true;

    reducirCaja();

    paginaRetireDinero = false;
    paginaDespedida = true;

    cambiarPantalla();
  }
}

function actualizarCajero()
{
  console.log("cajero actualizado");

  cajaTotal.value = caja500.value*500 + caja200.value*200 + caja100.value*100 + caja50.value*50 + caja20.value*20 + caja10.value*10 + caja5.value*5;

  for (var i = 0; i < billetes.length; i++)
  {
    billetes[i].cantidadEnCajero = parseInt(cajaBilletes[i].value);
  }
}

function calcularBilletes()
{
  cantidadADistibuir = cantidadSeleccionadaValor;

  for (var i = 0; i < billetes.length; i++)
  {
    billetes[i].cantidadEntregar = Math.min(billetes[i].cantidadEnCajero, Math.floor(cantidadADistibuir / billetes[i].valor));

    cantidadADistibuir = cantidadADistibuir - (billetes[i].valor * billetes[i].cantidadEntregar);
  }
}

function reducirCaja()
{
  for (var i = 0; i < billetes.length; i++)
  {
    cajaBilletes[i].value = cajaBilletes[i].value - billetes[i].cantidadEntregar;
  }

  actualizarCajero();
}

function bloquearCajas()
{
  for (var i = 0; i < cajaBilletes.length; i++)
  {
    cajaBilletes[i].readOnly = true;
  }

  cajeroMaximo.readOnly = true;
}

function desbloquearCajas()
{
  for (var i = 0; i < cajaBilletes.length; i++)
  {
    cajaBilletes[i].readOnly = false;
  }

  cajeroMaximo.readOnly = false;
}

function dibujarDinero()
{
  console.log("dibujando billetes")

  var posicionBilleteX = 30;
  var posicionBilleteY = 30;

  for (var i = 0; i < billetes.length; i++)
  {
    console.log(billetes[i].nombre);

    var cantidadADibujar = billetes[i].cantidadEntregar;

    while (cantidadADibujar > 0)
    {
      bolsillo.marco.drawImage(billetes[i].imagen,posicionBilleteX,posicionBilleteY);

      posicionBilleteX = posicionBilleteX + 30;
      posicionBilleteY = posicionBilleteY + 60;

      cantidadADibujar = cantidadADibujar - 1;

      console.log("billete dibujado de " + billetes[i].valor);
    }
  }
}

function mostrarResultados()
{
  var textoResultados1 = String(billete500.cantidadEntregar +" "+ billete500.nombre +","+ billete200.cantidadEntregar +" "+ billete200.nombre +","+ billete100.cantidadEntregar +" "+ billete100.nombre);
  var textoResultados2 = String(billete50.cantidadEntregar +" "+ billete50.nombre +","+ billete20.cantidadEntregar +" "+ billete20.nombre +","+ billete10.cantidadEntregar +" "+ billete10.nombre +","+ billete5.cantidadEntregar +" "+ billete5.nombre);

  resultados.marco.fillText("Ha retirado " + cantidadSeleccionadaValor + " euros, y ha obtenido: ",10,25);
  resultados.marco.fillText(textoResultados1,200,25);
  resultados.marco.fillText(textoResultados2,200,75);
}

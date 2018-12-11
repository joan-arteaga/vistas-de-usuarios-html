var select = document.getElementById("usuarios");
var selectTableros = document.getElementById("tableros");
var selectCartas = document.getElementById("cartas");
var tableros = [];
var idPersona = "";
var nombreCartas = "";
var listaCartas = [];
var nombreslistas = [];
var lista = "";
/*______________________________________________________________________________
_______________________________________________________________________________-*/

axios.get('http://127.0.0.1:8000/AppReporteHoras/api/persona/')
.then(convertir).catch((err)=>{
  console.log(err);
});


function convertir(personas){

  var longitudArreglo=personas.data.length;
  var i=0;


  for (i = 0; i < longitudArreglo; i++) {

    var nombres=personas.data[i].nombres;
    var apellidos=personas.data[i].apellidos;
    var resultado = nombres.concat(" ",apellidos);
    var correo=personas.data[i].correo;

    var option = document.createElement("option");
    option.text = resultado;
    option.value= correo;
    select.appendChild(option);
  }

}
function cambioUsuario (){
  var idPersona = select.value;
  console.log(idPersona);
}
/*________________________________________________________________________________________________
_________________________________________________________________________________________________*/

axios.get('https://cors-anywhere.herokuapp.com/http://geoapps.esri.co/json/pruebaJson.json')
.then(gettableros).catch((err)=>{
  console.log(err);
});

/*_________________________________________________________________________________________
*/
function gettableros(arreglotableros){
  tableros = arreglotableros;
  console.log( tableros);
  infoTableros(tableros);
}

function infoTableros(tableros){
  var longitudArregloTableros=tableros.data.length;
  var i=0;
  console.log(tableros);

  for (i = 0; i < longitudArregloTableros; i++) {

    var nombreTablero=tableros.data[i].TableroNombre;
    var idTablero=tableros.data[i].TableroId;

    var option = document.createElement("option");
    option.text = nombreTablero;
    option.value= idTablero;
    selectTableros.appendChild(option);

  }
}

function cambioTablero (idTab){
  idTab=selectTableros.value;
  console.log(idTab);
  var indexTab = recorrerTableros(tableros, idTab);
  var indexListas = recorrerListas(indexTab);

}


function recorrerTableros(tableros, idTab){

  for (var i = 0; i < tableros.data.length; i++) {

    if(tableros.data[i].TableroId === idTab){
      return i;
    }
  }
}

function recorrerListas(i){
  for (var j = 0; j < tableros.data[i].Lista.length; j++) {
    nombreslistas.push(tableros.data[i].Lista[j]);
    recorrerCartas(i,j);
  }
}

function recorrerCartas(i,j){
  for (var k = 0; k < tableros.data[i].Lista[j].cartas.length; k++) {
    var cartas = tableros.data[i].Lista[j].cartas[k];

    var option = document.createElement("option");
    option.text = cartas;
    option.value = cartas;
    selectCartas.appendChild(option);
    var nombre = cartas;
    var lista = j;
    var cartaObj = [nombre, lista];
    listaCartas.push(cartaObj);
  }
}

function cambioCartas (){
  nombreCartas = selectCartas.value;
  console.log(nombreCartas);
  listaCartasR(nombreCartas);
  console.log(nombreslistas[lista].NombreLista);
}

function listaCartasR (cartasR){

  for (var i = 0; i < listaCartas.length; i++) {
    if(cartasR===listaCartas[i][0]){
      lista = listaCartas[i][1];
      console.log(lista);
    }
  }
}


/*__________________________________________________________________________________________
____________________________________________________________________________________________*/
/* Se realiza la petición para post!*/


function enviar() {
  var horas = document.getElementById("horas").value;
  var fechaReporte = document.getElementById("fechareporte").value;
  var observacion = document.getElementById("observacion").value;

  var headers = {
      "Content-Type": "application/json"
  };
  var data = {

      tablero: selectTableros.value,
      correo: select.value,
      tarjeta: nombreCartas,
      horas_reportadas: horas,
      estado: nombreslistas[lista].NombreLista,
      fecha_de_reporte: fechaReporte,
      observacion: observacion

  };
console.log(data);
  axios.post("http://127.0.0.1:8000/AppReporteHoras/api/reporte/", data, {headers: headers})
      .then(function (response) {
          console.log(response);
      })
      .catch(function (error) {
          console.log(error);
      });
}

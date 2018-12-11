  function enviar() {
    var nombres = document.getElementById("nombres").value;
    var apellidos = document.getElementById("apellidos").value;
    var correo = document.getElementById("correo").value;
    var universidad = document.getElementById("universidad").value;
    var documentoIdentidad = document.getElementById("documentoIdentidad").value;
    var fNto = document.getElementById("fNto").value;
    var rol = document.getElementById("rol").value;
    var tallaCamiseta = document.getElementById("tallaCamiseta").value;
    var foto = document.getElementById("foto").value;
    var fechaGrado = document.getElementById("fechaGrado").value;
    var estimado = document.getElementById("feg").value;


    var select = document.getElementById("estado");
    select.addEventListener('change',
      function(){
        var estado = this.options[select.selectedIndex];
        console.log(estado.value);
        console.log(estado);
        return estado
      });


      var headers = {
          "Content-Type": "application/json"
      };
      var data = {

        correo: correo,
        nombres: nombres,
        apellidos: apellidos,
        documento_identidad: documentoIdentidad,
        fecha_nacimiento: fNto,
        universidad: universidad,
        talla_camiseta: tallaCamiseta,
        estado_persona: estado,
        rol_persona: rol,
        foto: foto,
        fecha_ten_grado: fechaGrado,
        exp_fecha: estimado

      };
    console.log(data);
      axios.post("http://40.117.213.29:81/api/persona/", data, {headers: headers})
          .then(function (response) {
              console.log(response);
              console.log("enviado");
          })
          .catch(function (error) {
              console.log(error);
          });

  }

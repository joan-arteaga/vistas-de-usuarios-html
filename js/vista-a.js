var miEstado=[];
var sesionLogin=[]; 
var miPrioridad=[];
var saveFilter=[];
var filtroLocal=[];
var tablero = [

   { 
      "idtask":"123456789",
      "email":"jarteaga@esri.co",
      "password": "123",
      "task": "Nombre de la tarea...",
      "description":"aqui la descripcion",
      "priority": "Baja",
      "name": "Aldo",
      "imagen":"https://trello-avatars.s3.amazonaws.com/78f06e43911494e549730de4abf6d340/170.png",
      "duration":"20",
      "blocking": "true",
      "state":"id-progress",
      "bordercolor":"green"
    }
  ]; 

function Init() {
  var guardado, prueba;
  if(localStorage.getItem("filtroLocal")!= undefined && localStorage.getItem("filtroLocal").length >0){
    
       saveFilter = JSON.parse(localStorage.getItem("filtroLocal"));
       cargarTareas(saveFilter);
  }else{
      if(localStorage.getItem("tablero")== undefined){
       
       localStorage.setItem("tablero", JSON.stringify(tablero));
       
        guardado = localStorage.getItem("tablero");
     
       tablero = JSON.parse(guardado);
       cargarTareas(tablero);
     }else{ 
       guardado = localStorage.getItem("tablero");
       tablero = JSON.parse(guardado);
       cargarTareas(tablero);
     }
  }
 
  var barraAutenticar='';
 if(localStorage.getItem("sesionLogin")== undefined){
  barraAutenticar+="<li data-toggle='modal' data-target='#login'><a href='#'><span class='glyphicon glyphicon-log-in'></span> Entrar</a></li>";   
 }else{
       prueba = localStorage.getItem("sesionLogin");
       sesionLogin = JSON.parse(prueba);
barraAutenticar+="<li><a href='#'><span class='glyphicon glyphicon-user'></span>" +sesionLogin[0]["name"]+ "</a></li>";
barraAutenticar+="<li><a href='#' onclick='logout();'><span class='glyphicon glyphicon-log-in'></span> Salir</a></li>";    
 }
 $("#sesion").append(barraAutenticar);
  getState();
  getPriority();
}
function addUser(domElement, tablero) {
       var select = document.getElementsByName(domElement)[0];
       var arregloPaises=[];
        for (value in tablero) {
           if(arregloPaises.indexOf(tablero[value]["name"])==-1){
               arregloPaises.push(tablero[value]["name"]);
                var option = document.createElement("option");
                 option.text=tablero[value]["name"];
                 option.value=tablero[value]["name"];
               }
        select.add(option);
       }
  }
function IDGenerator() {
	 
		 this.length = 8;
		 this.timestamp = +new Date;
		 
		 var _getRandomInt = function( min, max ) {
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
		 }
		 
		 this.generate = function() {
			 var ts = this.timestamp.toString();
			 var parts = ts.split( "" ).reverse();
			 var id = "";
			 
			 for( var i = 0; i < this.length; ++i ) {
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];	 
			 }
			 
			 return id;
		 }

		 
	 }
function setTask(id,accion){
  switch(accion) {
    case 'delete':
       if(localStorage.getItem("tablero")!= undefined){
          guardado = localStorage.getItem("tablero");
          tablero = JSON.parse(guardado);
          var nuevoTablero=[];
         for (value in tablero) {
           if(tablero[value]["idtask"]!=id){
             nuevoTablero.push(tablero[value]);
              }
         }
         $.confirm({
            title:"Se eliminara la tarea",
            content: '¿Estás seguro de continuar?',
            buttons: {
                specialKey: {
                    text: 'Confirmar',
                    action: function(){
                        localStorage.setItem("tablero", JSON.stringify(nuevoTablero));
                        $("#"+id+"").animate({opacity: 2 }, "fast").animate({opacity: 2}, "fast").hide("fast");
                        location.reload();
                    }
                },
                alphabet: {
                    text: 'Cancelar',
                    action: function(){ 
                    }
                }
            }
        });
        
       }
        break;
    case 'edit':
     
          guardado = localStorage.getItem("tablero");
          tablero = JSON.parse(guardado);
          var tareaEdit=[];
         for (value in tablero) {
           if(tablero[value]["idtask"]==id){
             //tareaEdit.push(tablero[value]);
             var idtask = id;
             var task=tablero[value]["task"];
             var description=tablero[value]["description"];
             var priority=tablero[value]["priority"];
             var state=tablero[value]["state"];
            
             var name=tablero[value]["name"];
             var imagen=tablero[value]["imagen"];
             var duration=tablero[value]["duration"];
              }
         }
      $('#id_edittarea').attr('value',id);
      //console.log($('#id_edittarea').val());
     
      $('#id-edittask').val(task);
      $('#editcomment').val(description);
      var idPriordad;
      switch(priority){
           case 'Urgente':
                   idPriordad='editurgente';
                break;
           case 'Alta':
                   idPriordad='editalta';
                break;
           case 'Baja':
                   idPriordad='editbaja';
                break;
           case 'Media':
                   idPriordad='editmedia';
                break;
           default:
                   console.log("no se encontro la prioridad");
                break;
      }
      $("#"+idPriordad).attr('checked', true);
      $("#editTarea").find('.img-rounded').attr('src',imagen);//
      $('#edithoras').val(duration);
      $("#comboModal option[value="+ name +"]").attr("selected",true);

        break;
    case 'backlog':
        if (!($("#"+id+"").closest("#id-backlog").length > 0)) {
            $("#"+id+"").appendTo("#id-backlog");
          setAtributoStorange(id,'state','id-backlog');
        }    
        break;
    case 'progress':
        if (!($("#"+id+"").closest("#id-progress").length > 0)) {
            $("#"+id+"").appendTo("#id-progress");
          setAtributoStorange(id,'state','id-progress');
        }
        break;
    case 'testing':
        if (!($("#"+id+"").closest("#id-testing").length > 0)) {
            $("#"+id+"").appendTo("#id-testing");
          setAtributoStorange(id,'state','id-testing');
        }
        break;
    case 'finalized':
        if (!($("#"+id+"").closest("#id-finalized").length > 0)) {
            $("#"+id+"").appendTo("#id-finalized");
          setAtributoStorange(id,'state','id-finalized');
        }
        break;
    case 'changeImage':
          var imagen='../img/persona.png';
          var name=$('select[id='+id+'] option:selected').text();
         switch(name){
             case 'Aldo':
                   imagen='https://media.licdn.com/dms/image/C5603AQGh-SBdPmfBnw/profile-displayphoto-shrink_200_200/0?e=1541030400&v=beta&t=l5J2EqQ7LMi-rJWEIKoHGSF0DX9NTRbQhKWSfnLpS1U';
                break;
             case 'Yoel':
                   imagen='https://thumbs.static-gigajob.com/thumbs/thumb300x300w/images/user/image_45f789c767cb7c4cb75fbddb08b7d108_1393177553.jpg';
                break;
             case 'Yunaldis':
                   imagen='https://media.licdn.com/dms/image/C4D03AQG8n5YRR6Ttxw/profile-displayphoto-shrink_200_200/0?e=1543449600&v=beta&t=6To4c3aJO5Eo65NoX120id7JUNCejQXpc0k6jb96S5U';
                break;
             case 'Ramiro':
                 imagen='http://www.asiap.org/AsIAP/images/JIAP/JIAP2013/Conferencistas/ramiroordiozola_ute.jpg';
                break;
                default:
                 imagen='../img/persona.png';
                   break;
                }
       $("#myTarea").find('.img-rounded').attr('src',imagen);
       $("#editTarea").find('.img-rounded').attr('src',imagen);
        break;
    default:
        console.log('Default');
} 
}
function cargarTareas(tablero){
 for (value in tablero) {
   var idtask=tablero[value]["idtask"];
   var email=tablero[value]["email"];
   var password=tablero[value]["password"];
   var task=tablero[value]["task"];
   var description=tablero[value]["description"];
   var priority=tablero[value]["priority"];
   var name=tablero[value]["name"];
   var imagen=tablero[value]["imagen"];
   var bordercolor=tablero[value]["bordercolor"];
   var duration=tablero[value]["duration"];
   var blocking=tablero[value]["blocking"];
   var state=tablero[value]["state"];
var cadena = ''; 
cadena +=" <article class='input-group' id="+idtask+" style='width: 80%; border-color: "+bordercolor+";' draggable='true' ondragstart='drag(event)'>";           
cadena +="<div class='row'>";             
cadena +="<div class='col-xs-9'>";
cadena +="<p id='tarea'>"+task+"</p>";
cadena +="</div>";
cadena +=" <div class='col-xs' > ";  
cadena +="           <div class='btn-group' style='width: 10px;'>";
cadena +="                <button type='button' class='btn btn-link dropdown-toggle'";
cadena +="                  data-toggle='dropdown'>";
cadena +="                  <span class='glyphicon glyphicon-list'></span>";
cadena +="                  <span class='caret'></span>";
cadena +="                </button>";
cadena +="            <ul class='dropdown-menu' >";
cadena +="               <li><a id="+idtask+" name='backlog' href='#' onclick=setTask("+idtask+",'backlog');> Backlog</a></li>";
cadena +="               <li><a id="+idtask+" name='progress'  href='#' onclick=setTask("+idtask+",'progress');> Proceso</a></li>";
cadena +="               <li><a id="+idtask+" name='testing'  href='#' onclick=setTask("+idtask+",'testing');> Testing</a></li>";
cadena +="               <li><a id="+idtask+" name='finalized'  href='#' onclick=setTask("+idtask+",'finalized');> Finalizada</a></li>";
cadena +="               <li><a id="+idtask+" name='edit'  data-target='#editTarea' data-toggle='modal'  href='#'  onclick=setTask("+idtask+",'edit');> Editar</a></li>";
cadena +="               <li><a id="+idtask+" name='delete' href='#' onclick=setTask("+idtask+",'delete');> Eliminar</a></li>";                                  
cadena +="            </ul>";
cadena +="            </div>";
cadena +="      </div>";
cadena +="     </div>";  
cadena +="    <div class='row'>";
cadena +="       <div class='col-xs-9'>";
cadena +="        <p id='desp_task'>"+description+"</p>";  
cadena +="        <a>Estimado:"+duration+"Hr</a>"; 
cadena +="      </div>";
cadena +="       <div class='col-xs'>";
cadena +="         <div class='row'>";
cadena +="         <img id='imagen' src="+imagen+"  style='width: 60px; height:60px; border: 1px solid "+bordercolor+";border-top-color: "+bordercolor+";border-radius: 10px;' alt='Foto de usuario'> ";
cadena +="          </div>";
cadena +="       </div>";
cadena +="     </div>";
cadena +="   </article>"; 
 $("#"+state+"").append(cadena);  
 }   
}
function nuevaTarea(){
   //guardar los datos en el storage y despues recargar....
             var Task=[];
             var generator = new IDGenerator();
             var idtask = generator.generate();// id nuevo...
             var task=$("#id-task").val();//nombre de la tarea...
             var description=$("#comment").val();//descripcion de la tarea...
             var priority=$('input:radio[name=rdprioridad]:checked').val();//baja,media,alta,urg...
             var blocking=$('#chk').is(':checked');// true o false
             var state="id-backlog";//por defecto en backlog
             var horas=$("#horas").val();
             var name=$('select[id="comboModal"] option:selected').text();
             var email,password,imagen,duration,bordercolor;
         switch(name){
             case 'joan':
                   email='jarteaga@esri.com';
                   imagen='https://trello-avatars.s3.amazonaws.com/78f06e43911494e549730de4abf6d340/170.png';
                break;
             case 'lorena':
                   email='erodriguez@esri.co';
                   imagen='https://trello-avatars.s3.amazonaws.com/926608481e1dc20dbee67536c6f90059/original.png';
                break;
             case 'alejo':
                   email='areyes@esri.co';
                   imagen='https://trello-avatars.s3.amazonaws.com/445663f720a4017549c2b3de99b63a55/original.png';
                break;
             case 'richard':
                 email='rcardozo@esri.co';
                 imagen='https://trello-avatars.s3.amazonaws.com/c2ebdf7be41390a5c5526868954500a8/original.png';
                break;
                default:
                 imagen='../img/persona.png';
                }
         switch(priority){
                case 'Urgente':
                   bordercolor='red';
                break;
                case 'Alta':
                   bordercolor='orange';
                break;
                case 'Media':
                   bordercolor='yellow';
                break;
                default:
                   bordercolor='green';
                }
         for (value in tablero) {
             Task.push(tablero[value]); 
         }
             var  miObjeto = { 'idtask': idtask, 'email': email, 'password': '123','task':task, 'description':description, 
                  'priority':priority, 'name':name, 'imagen':imagen, 'duration':horas, 'blocking':blocking, 'state':state, 'bordercolor':bordercolor};
                  Task.push(miObjeto);
             localStorage.setItem('tablero', JSON.stringify(Task));
             location.reload();
 
 
 }
function actualizaTarea(){
  var task22=$('#id-edittask').val();
  var description22=$('#editcomment').val();
  var priority22=$('input:radio[name=rdprioridad]:checked').val();
  var name22=$('select[id="combo"] option:selected').text();
  var priority22=$('input:radio[name=rdprioridad]:checked').val(); 
  var email22,password22='123',imagen22,bordercolor22;
  var duration22= $("#edithoras").val();
  var idEditarTarea=$('#id_edittarea').val();
         switch(name22){
             case 'joan':
                   email22='jarteaga@esri.com';
                   imagen='https://trello-avatars.s3.amazonaws.com/78f06e43911494e549730de4abf6d340/170.png';
                break;
             case 'lorena':
                   email22='erodriguez@esri.co';
                   imagen='https://trello-avatars.s3.amazonaws.com/926608481e1dc20dbee67536c6f90059/original.png';
                break;
             case 'alejo':
                   email22='areyes@esri.co';
                   imagen='https://trello-avatars.s3.amazonaws.com/445663f720a4017549c2b3de99b63a55/original.png';
                break;
             case 'richard':
                   email22='rcardozo@esri.co';
                   imagen='https://trello-avatars.s3.amazonaws.com/c2ebdf7be41390a5c5526868954500a8/original.png';
                break;
                default:
                 imagen22='../img/persona.png';
                   break;
                }
         switch(priority22){
                case 'Urgente':
                   bordercolor22='red';
                break;
                case 'Alta':
                   bordercolor22='orange';
                break;
                case 'Media':
                   bordercolor22='yellow';
                break;
                default:
                   bordercolor22='green';
                }
          guardado = localStorage.getItem("tablero");
          tablero = JSON.parse(guardado);
          var nuevoElemento=[];
         for (value in tablero) {
          if(tablero[value]["idtask"]!=idEditarTarea){ 
             nuevoElemento.push(tablero[value]);
            
              }  else{
                var state22=tablero[value]["state"];
                var miObjeto22 = { 'idtask': idEditarTarea, 'email': email22, 'password': password22,'task':task22, 'description':description22, 'priority':priority22, 'name':name22, 'imagen':imagen22, 'duration':duration22, 'blocking':'true', 'state':state22,'bordercolor':bordercolor22};  
                nuevoElemento.push(miObjeto22);
              } 
         }
      $("article").remove();location.reload();
      localStorage.setItem("tablero", JSON.stringify(nuevoElemento));
      guardado = localStorage.getItem("tablero");
      tablero = JSON.parse(guardado); 
      cargarTareas(tablero);
     
}
function login(email,password){
   var login=false; var nombre='';
   for (value in tablero) {
     if(tablero[value]["email"]===email && tablero[value]["password"]===password){
        sesionLogin.push(tablero[value]);
        nombre=tablero[value]["name"];
        login=true;
        }
   }
  if(Boolean(login)){
    localStorage.setItem("sesionLogin", JSON.stringify(sesionLogin));
    location.reload();
  }else{
    $('#email').parent().addClass( "has-error has-feedback" );
    $('#password').parent().addClass( "has-error has-feedback" );
  }
}
function logout(){
localStorage.removeItem("sesionLogin");
location.reload();
}
function getPriority(){
  var totalUrgente=0;
  var totalAlta=0;
  var totalMedia=0;
  var totalBaja=0;
  guardado = localStorage.getItem("tablero");
  
  tablero = JSON.parse(guardado);
 for (value in tablero) {
   if(tablero[value]["priority"]=="Urgente"){ totalUrgente+=1; }
   if(tablero[value]["priority"]=="Alta"){ totalAlta+=1; }
   if(tablero[value]["priority"]=="Media"){ totalMedia+=1; }
   if(tablero[value]["priority"]=="Baja"){ totalBaja+=1; }
   }
  miPrioridad = { 'baja': totalBaja, 'media': totalMedia, 'alta': totalAlta, 'urgente': totalUrgente}; 
}
function getState(){
  var totalBacklog=0;
  var totalProceso=0;
  var totalTesting=0;
  var totalFinalizada=0;
  guardado = localStorage.getItem("tablero");
  tablero = JSON.parse(guardado);
 for (value in tablero) {
   if(tablero[value]["state"]=="id-finalized"){ totalFinalizada+=1; }
   if(tablero[value]["state"]=="id-testing"){ totalTesting+=1; }
   if(tablero[value]["state"]=="id-progress"){ totalProceso+=1; }
   if(tablero[value]["state"]=="id-backlog"){ totalBacklog+=1; }
   }
  miEstado = { 'backlog': totalBacklog, 'progress': totalProceso, 'testing': totalTesting, 'finalized': totalFinalizada};
}
function getFiltro(){
  var i,j;
  var filtro=[];
  var taskAsg =[];
  var taskPrd =[];
$('select[id="selectionPrd"] option:selected').each(function(){
taskPrd.push($(this).val()); 
}); 
$('select[id="selectionAsg"] option:selected').each(function(){
taskAsg.push($(this).val()); 
});
  console.log(taskPrd);console.log(taskAsg);
  
  guardado = localStorage.getItem("tablero");
  tablero = JSON.parse(guardado);
  console.log(tablero);
  
  if(taskAsg.length== 0 && taskPrd.length > 0){// muestro tareas con esta prioridad
            for (j=0;j<taskPrd.length;j++) { 
              for (value in tablero) {              
               if(tablero[value]["priority"]==taskPrd[j]){
                     filtro.push(tablero[value]);
               }
             } 
           } 
            
  }
  if(taskPrd.length== 0 && taskAsg.length > 0){// muestro tareas con este user
    for (i=0;i<taskAsg.length;i++){ 
            
              for (value in tablero) {              
               if(tablero[value]["name"]==taskAsg[i]){
                     filtro.push(tablero[value]);
               }
             } 
           
         }        
  }
  if(taskPrd.length > 0 && taskAsg.length > 0){// muestro tareas con este user y esta propiedad
       for (i=0;i<taskAsg.length;i++){ 
            for (j=0;j<taskPrd.length;j++) { 
              for (value in tablero) {              
               if((tablero[value]["name"]==taskAsg[i]) && 
                  (tablero[value]["priority"]==taskPrd[j])){
                     filtro.push(tablero[value]);
               }
             } 
           } 
         }     
  }        
  if(filtro.length>0){
  localStorage.setItem("filtroLocal", JSON.stringify(filtro));
  saveFilter = JSON.parse(localStorage.getItem("filtroLocal"));
  location.reload();  
     }else{
       $.alert({
        title: 'Lo sentimos',
        content: 'No se encontraron tareas para tu filtro',
       });
     }  
}
function valida(e){
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla==8){
        return true;
    }
        
    // Patron de entrada, en este caso solo acepta numeros
    patron =/[0-9]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}
function setAtributoStorange(id,atributo,valor){
   var Task=[];
         for (value in tablero) {
           if(tablero[value]["idtask"]!=id){
                     Task.push(tablero[value]);
              }else{
                 var idtask=tablero[value]["idtask"];
                 var email=tablero[value]["email"];
                 var password=tablero[value]["password"];
                 var task=tablero[value]["task"];
                 var description=tablero[value]["description"];
                 var priority=tablero[value]["priority"];
                 var name=tablero[value]["name"];
                 var imagen=tablero[value]["imagen"];
                 var duration=tablero[value]["duration"];
                 var blocking=tablero[value]["blocking"];
                 var state=tablero[value]["state"];
                 var bordercolor=tablero[value]["bordercolor"];
               switch(atributo) {
                  case 'email':
                      email=valor;
                      break;
                  case 'task':
                      task=valor; 
                      break;
                  case 'description':
                      description=valor; 
                      break;
                  case 'priority':
                      priority=valor; 
                      break;
                  case 'name':
                      name=valor; 
                      break;
                  case 'duration':
                      duration=valor; 
                      break;
                  case 'blocking':
                      blocking=valor; 
                      break;
                  case 'state':
                      state=valor; 
                      break;
                  case 'bordercolor':
                      bordercolor=valor;
                      break;
                  default:
                      alert('Default');
              } 
                 var miObjeto = { 'idtask': idtask, 'email': email, 'password': password,'task':task, 'description':description, 
                  'priority':priority, 'name':name, 'imagen':imagen, 'duration':duration, 'blocking':blocking, 'state':state, 'bordercolor':bordercolor};
                     Task.push(miObjeto);
              }
         }   
             localStorage.setItem('tablero', JSON.stringify(Task));  
}
function drag(ev) {
  console.log("Arrastrando " + ev.currentTarget.id)
  ev.dataTransfer.setData("id", ev.currentTarget.id);
}
function drop(ev) {
  var elementoContenedor = $(ev.currentTarget);
  var elementoArrastrado = $(`#${ev.dataTransfer.getData("id")}`)
  console.log(`Soltaste a ${elementoArrastrado.attr('id')} en ${elementoContenedor.attr('id')}`);
   setAtributoStorange(elementoArrastrado.attr('id'),'state',elementoContenedor.attr('id'));
  elementoContenedor.append(elementoArrastrado);
}
function allowDrop(ev) {
  ev.preventDefault();
}
$(document).ready(function () {
    Init();
    addUser('comboFiltro', tablero); 
    addUser('newCombo', tablero);
    addUser('combo', tablero);
  
  $('#newCombo').change(function(){
    setTask('newCombo','changeImage');
  });
  $('#combo').change(function(){
    setTask('combo','changeImage');
  });
///--------GRAFICAS POR PRIORIDAD ------------///
var ctx = document.getElementById("myPriority").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Urgente","Alta", "Media", "Baja"],
        datasets: [{
            label: "Total",
            data: [miPrioridad["urgente"],miPrioridad["alta"], miPrioridad["media"], miPrioridad["baja"]],
            backgroundColor: [
              '#f2f2f2',
              '#f2f2f2',
              '#f2f2f2',
              '#f2f2f2'  
            ],
            borderColor: [
                'red',
                '#FE8C82',
                '#72A1E8',
                'orange'
                
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
      title: {
        display: true,
        text: 'Gráficas por prioridad'
      }
    }
});
 ///--------GRAFICAS POR ESTADOS ------------///
new Chart(document.getElementById("myState").getContext("2d"), {
 type: 'doughnut',
    data: {
      labels: ["Backlog", "Proceso", "Testing", "Finalizada"],
      datasets: [
        {
          label: "Total de tareas por estados",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
          data: [miEstado["backlog"],miEstado["progress"],miEstado["testing"],miEstado["finalized"]]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Gráficas por estados'
      }
    }
 
});

$("#filter").click(function () {
 getFiltro();
});
$("#disfiltrate").click(function () {
  localStorage.removeItem("filtroLocal");
  location.reload();
});
});